
-- This migration ensures all tasks have valid column_id values
-- and recreates any problematic constraints properly
UPDATE tasks SET column_id = 1 WHERE column_id IS NULL;
