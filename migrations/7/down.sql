
-- Remove this final batch of completed tasks
DELETE FROM tasks WHERE created_at >= '2025-10-12 07:57:26' AND created_at <= '2025-10-13 09:28:50';
