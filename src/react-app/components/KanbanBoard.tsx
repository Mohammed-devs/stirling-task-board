import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BoardWithColumns, Task, CreateTask, UpdateTask, UserProfile } from '@/shared/types';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import ProjectLinksModal from './ProjectLinksModal';

interface KanbanBoardProps {
  board: BoardWithColumns;
  profile: UserProfile | null;
  onUpdateBoard: (board: BoardWithColumns) => void;
  onUpdateProfile: () => void;
}

export default function KanbanBoard({ board, profile, onUpdateBoard, onUpdateProfile }: KanbanBoardProps) {
  const [, setActiveTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [showProjectLinksModal, setShowProjectLinksModal] = useState(false);
  const [taskNeedingLinks, setTaskNeedingLinks] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTask(active.id as string);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = findTask(activeId);
    if (!activeTask) return;

    const activeColumn = findColumn(activeTask.column_id);
    const overColumn = findColumnByTaskOrColumn(overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    // Move task to different column
    const updatedBoard = { ...board };
    const activeColumnIndex = updatedBoard.columns.findIndex(col => col.id === activeColumn.id);
    const overColumnIndex = updatedBoard.columns.findIndex(col => col.id === overColumn.id);

    // Remove task from active column
    const activeTaskIndex = updatedBoard.columns[activeColumnIndex].tasks.findIndex(task => task.id === activeTask.id);
    updatedBoard.columns[activeColumnIndex].tasks.splice(activeTaskIndex, 1);

    // Add task to over column
    const overTask = findTask(overId);
    let insertIndex = updatedBoard.columns[overColumnIndex].tasks.length;
    
    if (overTask) {
      insertIndex = updatedBoard.columns[overColumnIndex].tasks.findIndex(task => task.id === overTask.id);
    }

    const updatedTask = { ...activeTask, column_id: overColumn.id, position: insertIndex };
    updatedBoard.columns[overColumnIndex].tasks.splice(insertIndex, 0, updatedTask);

    // Update positions
    updatedBoard.columns[activeColumnIndex].tasks.forEach((task, index) => {
      task.position = index;
    });
    updatedBoard.columns[overColumnIndex].tasks.forEach((task, index) => {
      task.position = index;
    });

    onUpdateBoard(updatedBoard);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;

    const activeTask = findTask(activeId);
    if (!activeTask) return;

    // Check if task is being moved to Done column
    const targetColumn = findColumn(activeTask.column_id);
    const isDoneColumn = targetColumn?.name.toLowerCase() === 'done';
    
    if (isDoneColumn && (!activeTask.project_link || !activeTask.project_link.trim())) {
      // Show project links modal for tasks moved to Done without links
      setTaskNeedingLinks(activeTask);
      setShowProjectLinksModal(true);
      return;
    }

    try {
      // Send the move request to the server
      await fetch(`/api/tasks/${activeTask.id}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column_id: activeTask.column_id,
          position: activeTask.position,
        }),
      });
    } catch (error) {
      console.error('Failed to move task:', error);
      // Optionally revert the UI change here
    }
  };

  const findTask = (taskId: string): Task | null => {
    for (const column of board.columns) {
      const task = column.tasks.find(task => task.id.toString() === taskId);
      if (task) return task;
    }
    return null;
  };

  const findColumn = (columnId: number) => {
    return board.columns.find(col => col.id === columnId);
  };

  const findColumnByTaskOrColumn = (id: string) => {
    // Check if it's a column id
    const columnById = board.columns.find(col => col.id.toString() === id);
    if (columnById) return columnById;

    // Check if it's a task id
    const task = findTask(id);
    if (task) {
      return board.columns.find(col => col.id === task.column_id);
    }

    return null;
  };

  const handleCreateTask = async (columnId: number) => {
    setSelectedTask(null);
    setSelectedColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedColumnId(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: CreateTask | UpdateTask) => {
    try {
      if (selectedTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${selectedTask.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        const updatedTask = await response.json();
        
        // Update the board
        const updatedBoard = { ...board };
        const columnIndex = updatedBoard.columns.findIndex(col => col.id === selectedTask.column_id);
        if (columnIndex !== -1) {
          const taskIndex = updatedBoard.columns[columnIndex].tasks.findIndex(task => task.id === selectedTask.id);
          if (taskIndex !== -1) {
            updatedBoard.columns[columnIndex].tasks[taskIndex] = updatedTask;
          }
        }
        onUpdateBoard(updatedBoard);
      } else if (selectedColumnId) {
        // Create new task
        const column = board.columns.find(col => col.id === selectedColumnId);
        if (!column) return;

        const newTaskData: CreateTask = {
          ...(taskData as CreateTask),
          column_id: selectedColumnId,
          position: column.tasks.length,
        };

        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTaskData),
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const newTask = await response.json();
        
        // Update the board
        const updatedBoard = { ...board };
        const columnIndex = updatedBoard.columns.findIndex(col => col.id === selectedColumnId);
        if (columnIndex !== -1) {
          updatedBoard.columns[columnIndex].tasks.push(newTask);
        }
        onUpdateBoard(updatedBoard);
      }
      
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      setSelectedColumnId(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      // Update the board
      const updatedBoard = { ...board };
      updatedBoard.columns = updatedBoard.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId),
      }));
      
      onUpdateBoard(updatedBoard);
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleSaveProjectLinks = async (link1: string, link2?: string) => {
    if (!taskNeedingLinks) return;

    try {
      const response = await fetch(`/api/tasks/${taskNeedingLinks.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_link: link1,
          project_link_2: link2 || null,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      
      // Update the board
      const updatedBoard = { ...board };
      const columnIndex = updatedBoard.columns.findIndex(col => col.id === taskNeedingLinks.column_id);
      if (columnIndex !== -1) {
        const taskIndex = updatedBoard.columns[columnIndex].tasks.findIndex(task => task.id === taskNeedingLinks.id);
        if (taskIndex !== -1) {
          updatedBoard.columns[columnIndex].tasks[taskIndex] = updatedTask;
        }
      }
      onUpdateBoard(updatedBoard);

      // Now move the task
      await fetch(`/api/tasks/${taskNeedingLinks.id}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column_id: taskNeedingLinks.column_id,
          position: taskNeedingLinks.position,
        }),
      });

      setShowProjectLinksModal(false);
      setTaskNeedingLinks(null);
    } catch (error) {
      console.error('Failed to save project links:', error);
    }
  };

  const allTaskIds = board.columns.flatMap(column => 
    column.tasks.map(task => task.id.toString())
  );

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{board.name}</h1>
        {board.description && (
          <p className="text-slate-600">{board.description}</p>
        )}
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={allTaskIds} strategy={verticalListSortingStrategy}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onCreateTask={() => handleCreateTask(column.id)}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask}
          profile={profile}
          board={board}
          selectedColumnId={selectedColumnId}
          onSave={handleSaveTask}
          onDelete={selectedTask ? () => handleDeleteTask(selectedTask.id) : undefined}
          onUpdateProfile={onUpdateProfile}
          onUpdateBoard={onUpdateBoard}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
            setSelectedColumnId(null);
          }}
        />
      )}

      {showProjectLinksModal && taskNeedingLinks && (
        <ProjectLinksModal
          taskTitle={taskNeedingLinks.title}
          onSave={handleSaveProjectLinks}
          onClose={() => {
            setShowProjectLinksModal(false);
            setTaskNeedingLinks(null);
            // The UI change will be automatically reverted since we don't save the move
            // No need for page reload - the drag state was already handled
          }}
        />
      )}
    </div>
  );
}
