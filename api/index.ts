import { Hono } from "hono";
import { cors } from "hono/cors";
import { 
  BoardSchema, 
  ColumnSchema, 
  TaskSchema,
  UserProfileSchema,
  CreateBoardSchema,
  CreateColumnSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  MoveTaskSchema,
  CreateUserProfileSchema,
  UpdateUserProfileSchema,
  type BoardWithColumns,
  type ColumnWithTasks 
} from "../shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors());

// Get all boards
// --- REPLACE IT WITH THIS NEW CODE ---
app.get('/api/boards', async (c) => {
  // Return some fake, hardcoded data for now
  const fakeBoards = [
    { id: 1, name: 'My First Board', description: 'This is a test board.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, name: 'Project Phoenix', description: 'Tasks for the new project.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
  return c.json(fakeBoards);
});

// Get a specific board with columns and tasks
app.get('/api/boards/:id', async (c) => {
  try {
    const boardId = parseInt(c.req.param('id'));
    if (isNaN(boardId)) {
      return c.json({ error: 'Invalid board ID' }, 400);
    }

    const boardResult = await c.env.DB.prepare('SELECT * FROM boards WHERE id = ?').bind(boardId).first();
    if (!boardResult) {
      return c.json({ error: 'Board not found' }, 404);
    }

    const board = BoardSchema.parse(boardResult);

    const columnsResult = await c.env.DB.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').bind(boardId).all();
    const columns = columnsResult.results.map(col => ColumnSchema.parse(col));

    const boardWithColumns: BoardWithColumns = {
      ...board,
      columns: []
    };

    for (const column of columns) {
      const tasksResult = await c.env.DB.prepare('SELECT * FROM tasks WHERE column_id = ? ORDER BY position').bind(column.id).all();
      const tasks = tasksResult.results.map(task => TaskSchema.parse(task));
      
      const columnWithTasks: ColumnWithTasks = {
        ...column,
        tasks
      };
      
      boardWithColumns.columns.push(columnWithTasks);
    }

    return c.json(boardWithColumns);
  } catch (error) {
    console.error('Error fetching board:', error);
    return c.json({ error: 'Failed to fetch board' }, 500);
  }
});

// Delete a board
app.delete('/api/boards/:id', async (c) => {
  try {
    const boardId = parseInt(c.req.param('id'));
    if (isNaN(boardId)) {
      return c.json({ error: 'Invalid board ID' }, 400);
    }

    // Delete all tasks in columns of this board
    await c.env.DB.prepare('DELETE FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = ?)')
      .bind(boardId)
      .run();

    // Delete all columns of this board
    await c.env.DB.prepare('DELETE FROM columns WHERE board_id = ?')
      .bind(boardId)
      .run();

    // Delete the board
    const result = await c.env.DB.prepare('DELETE FROM boards WHERE id = ? RETURNING *')
      .bind(boardId)
      .first();

    if (!result) {
      return c.json({ error: 'Board not found' }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return c.json({ error: 'Failed to delete board' }, 500);
  }
});

// Create a new board
app.post('/api/boards', async (c) => {
  try {
    const body = await c.req.json();
    const data = CreateBoardSchema.parse(body);

    const result = await c.env.DB.prepare('INSERT INTO boards (name, description) VALUES (?, ?) RETURNING *')
      .bind(data.name, data.description || null)
      .first();

    const board = BoardSchema.parse(result);

    // Create default columns
    const defaultColumns = ['Backlog', 'In Progress', 'Review', 'Done'];
    for (let i = 0; i < defaultColumns.length; i++) {
      await c.env.DB.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)')
        .bind(board.id, defaultColumns[i], i)
        .run();
    }

    return c.json(board, 201);
  } catch (error) {
    console.error('Error creating board:', error);
    return c.json({ error: 'Failed to create board' }, 500);
  }
});

// Create a new column
app.post('/api/columns', async (c) => {
  try {
    const body = await c.req.json();
    const data = CreateColumnSchema.parse(body);

    const result = await c.env.DB.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?) RETURNING *')
      .bind(data.board_id, data.name, data.position)
      .first();

    const column = ColumnSchema.parse(result);
    return c.json(column, 201);
  } catch (error) {
    console.error('Error creating column:', error);
    return c.json({ error: 'Failed to create column' }, 500);
  }
});

// Get user profile
app.get('/api/profile', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 1').first();
    
    if (!result) {
      return c.json(null);
    }

    const profile = UserProfileSchema.parse(result);
    return c.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Create user profile
app.post('/api/profile', async (c) => {
  try {
    const body = await c.req.json();
    const data = CreateUserProfileSchema.parse(body);

    const result = await c.env.DB.prepare('INSERT INTO user_profiles (name, city, email) VALUES (?, ?, ?) RETURNING *')
      .bind(data.name, data.city, data.email)
      .first();

    const profile = UserProfileSchema.parse(result);
    return c.json(profile, 201);
  } catch (error) {
    console.error('Error creating profile:', error);
    return c.json({ error: 'Failed to create profile' }, 500);
  }
});

// Update user profile
app.patch('/api/profile/:id', async (c) => {
  try {
    const profileId = parseInt(c.req.param('id'));
    if (isNaN(profileId)) {
      return c.json({ error: 'Invalid profile ID' }, 400);
    }

    const body = await c.req.json();
    const data = UpdateUserProfileSchema.parse(body);

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.city !== undefined) {
      updates.push('city = ?');
      values.push(data.city);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(profileId);

    const sql = `UPDATE user_profiles SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
    const result = await c.env.DB.prepare(sql).bind(...values).first();

    if (!result) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profile = UserProfileSchema.parse(result);
    return c.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Create a new task
app.post('/api/tasks', async (c) => {
  try {
    const body = await c.req.json();
    const data = CreateTaskSchema.parse(body);

    const result = await c.env.DB.prepare(
      'INSERT INTO tasks (column_id, title, description, priority, task_type, city, requester_name, requester_email, project_link, project_link_2, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *'
    ).bind(
      data.column_id,
      data.title,
      data.description || null,
      data.priority,
      data.task_type || null,
      data.city || null,
      data.requester_name || null,
      data.requester_email || null,
      data.project_link || null,
      data.project_link_2 || null,
      data.position
    ).first();

    const task = TaskSchema.parse(result);
    return c.json(task, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Update a task
app.patch('/api/tasks/:id', async (c) => {
  try {
    const taskId = parseInt(c.req.param('id'));
    if (isNaN(taskId)) {
      return c.json({ error: 'Invalid task ID' }, 400);
    }

    const body = await c.req.json();
    const data = UpdateTaskSchema.parse(body);

    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.priority !== undefined) {
      updates.push('priority = ?');
      values.push(data.priority);
    }
    if (data.task_type !== undefined) {
      updates.push('task_type = ?');
      values.push(data.task_type);
    }
    if (data.city !== undefined) {
      updates.push('city = ?');
      values.push(data.city);
    }
    if (data.requester_name !== undefined) {
      updates.push('requester_name = ?');
      values.push(data.requester_name);
    }
    if (data.requester_email !== undefined) {
      updates.push('requester_email = ?');
      values.push(data.requester_email);
    }
    if (data.project_link !== undefined) {
      updates.push('project_link = ?');
      values.push(data.project_link);
    }
    if (data.project_link_2 !== undefined) {
      updates.push('project_link_2 = ?');
      values.push(data.project_link_2);
    }
    if (data.column_id !== undefined) {
      updates.push('column_id = ?');
      values.push(data.column_id);
    }
    if (data.position !== undefined) {
      updates.push('position = ?');
      values.push(data.position);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(taskId);

    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
    const result = await c.env.DB.prepare(sql).bind(...values).first();

    if (!result) {
      return c.json({ error: 'Task not found' }, 404);
    }

    const task = TaskSchema.parse(result);
    return c.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// Move task to different column/position
app.patch('/api/tasks/:id/move', async (c) => {
  try {
    const taskId = parseInt(c.req.param('id'));
    if (isNaN(taskId)) {
      return c.json({ error: 'Invalid task ID' }, 400);
    }

    const body = await c.req.json();
    const data = MoveTaskSchema.parse(body);

    // Update the task's column and position
    const result = await c.env.DB.prepare('UPDATE tasks SET column_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *')
      .bind(data.column_id, data.position, taskId)
      .first();

    if (!result) {
      return c.json({ error: 'Task not found' }, 404);
    }

    const task = TaskSchema.parse(result);
    return c.json(task);
  } catch (error) {
    console.error('Error moving task:', error);
    return c.json({ error: 'Failed to move task' }, 500);
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (c) => {
  try {
    const taskId = parseInt(c.req.param('id'));
    if (isNaN(taskId)) {
      return c.json({ error: 'Invalid task ID' }, 400);
    }

    const result = await c.env.DB.prepare('DELETE FROM tasks WHERE id = ? RETURNING *')
      .bind(taskId)
      .first();

    if (!result) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

export default app;
