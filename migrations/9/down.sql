
-- Remove this final batch of completed tasks
DELETE FROM tasks WHERE created_at >= '2025-10-19 08:59:25' AND created_at <= '2025-10-19 10:26:24';
