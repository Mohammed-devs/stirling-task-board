
-- Remove all migrated tasks
DELETE FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Stirling Schools Marketing Task Board'));
