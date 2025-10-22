
-- Remove the additional batch of migrated tasks
DELETE FROM tasks WHERE created_at >= '2025-10-08 05:35:05' AND created_at <= '2025-10-12 07:56:26';
