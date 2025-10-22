
CREATE TABLE versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version_name TEXT NOT NULL,
  description TEXT,
  boards_backup TEXT NOT NULL,
  columns_backup TEXT NOT NULL,
  tasks_backup TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_versions_name ON versions(version_name);
