import z from "zod";

export const BoardSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ColumnSchema = z.object({
  id: z.number(),
  board_id: z.number(),
  name: z.string(),
  position: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const TaskSchema = z.object({
  id: z.number(),
  column_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  task_type: z.string().nullable(),
  city: z.string().nullable(),
  requester_name: z.string().nullable(),
  requester_email: z.string().nullable(),
  project_link: z.string().nullable(),
  project_link_2: z.string().nullable(),
  position: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const UserProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  city: z.string(),
  email: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateBoardSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const CreateColumnSchema = z.object({
  board_id: z.number(),
  name: z.string().min(1),
  position: z.number(),
});

export const CreateTaskSchema = z.object({
  column_id: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  task_type: z.string().optional(),
  city: z.string().optional(),
  requester_name: z.string().optional(),
  requester_email: z.string().optional(),
  project_link: z.string().optional(),
  project_link_2: z.string().optional(),
  position: z.number(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  task_type: z.string().optional(),
  city: z.string().optional(),
  requester_name: z.string().optional(),
  requester_email: z.string().optional(),
  project_link: z.string().optional(),
  project_link_2: z.string().optional(),
  column_id: z.number().optional(),
  position: z.number().optional(),
});

export const MoveTaskSchema = z.object({
  column_id: z.number(),
  position: z.number(),
});

export const CreateUserProfileSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  email: z.string().email(),
});

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export type Board = z.infer<typeof BoardSchema>;
export type Column = z.infer<typeof ColumnSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type CreateBoard = z.infer<typeof CreateBoardSchema>;
export type CreateColumn = z.infer<typeof CreateColumnSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type MoveTask = z.infer<typeof MoveTaskSchema>;
export type CreateUserProfile = z.infer<typeof CreateUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;

export interface BoardWithColumns extends Board {
  columns: ColumnWithTasks[];
}

export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export const TASK_TYPES = ['Design', 'Social Media', 'Video/Photo', 'Update/Technical'] as const;
export const CITIES = [
  'Stirling Schools',
  'Erbil',
  'Slemani',
  'Duhok',
  'Baghdad',
  'Basra',
  'Kirkuk'
] as const;
