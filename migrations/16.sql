
-- Fix any orphaned tasks by assigning them to the first available column
UPDATE tasks 
SET column_id = (SELECT MIN(id) FROM columns) 
WHERE column_id NOT IN (SELECT id FROM columns);
