const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

// The database is a single file next to this one. Tests use ":memory:" instead.
const file = process.env.DB_FILE || path.join(__dirname, "notes.db");
const db = new DatabaseSync(file);

// Create the table the first time the app runs.
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// Add a couple of example notes if the table is empty.
const { count } = db.prepare("SELECT COUNT(*) AS count FROM notes").get();
if (count === 0) {
  const insert = db.prepare("INSERT INTO notes (title, body) VALUES (?, ?)");
  insert.run("Learn SQL", "SELECT, INSERT, UPDATE, DELETE.");
  insert.run("Use a real database", "My notes survive a restart now!");
}

module.exports = db;
