
-- Remove all migrated tasks
DELETE FROM tasks WHERE created_at >= '2025-10-01 05:38:39' AND created_at <= '2025-10-20 09:28:06';
