
-- Remove the additional migrated tasks
DELETE FROM tasks WHERE created_at >= '2025-10-06 08:42:02' AND created_at <= '2025-10-08 05:33:26';
