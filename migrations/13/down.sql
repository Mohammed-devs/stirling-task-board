
-- Remove the final batch of migrated tasks
DELETE FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = (SELECT id FROM boards WHERE name = 'Stirling Schools Marketing Task Board')) AND position >= 100;
