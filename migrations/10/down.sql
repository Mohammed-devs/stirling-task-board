
-- Remove the final completed tasks
DELETE FROM tasks WHERE created_at >= '2025-10-19 10:28:00' AND created_at <= '2025-10-20 09:28:06';
