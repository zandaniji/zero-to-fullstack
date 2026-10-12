const { DatabaseSync } = require("node:sqlite");

// Opens (or creates) the database and makes sure the tables exist.
function openDatabase(file = process.env.DB_FILE || "tasks.db") {
  const db = new DatabaseSync(file);

  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title      TEXT    NOT NULL,
      done       INTEGER NOT NULL DEFAULT 0,
      due_date   TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
  `);

  return db;
}

module.exports = { openDatabase };
