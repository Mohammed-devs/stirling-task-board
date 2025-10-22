
-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN task_type TEXT;
ALTER TABLE tasks ADD COLUMN city TEXT;
ALTER TABLE tasks ADD COLUMN requester_name TEXT;
ALTER TABLE tasks ADD COLUMN requester_email TEXT;

-- Create user profiles table
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
