const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

// The database is a single file next to this one. Tests use ":memory:" instead.
const file = process.env.DB_FILE || path.join(__dirname, "notes.db");
const db = new DatabaseSync(file);

// TODO 1: create the notes table if it doesn't exist yet:
//   id          INTEGER PRIMARY KEY AUTOINCREMENT
//   title       TEXT NOT NULL
//   body        TEXT NOT NULL DEFAULT ''
//   created_at  TEXT NOT NULL DEFAULT (datetime('now'))
// Hint: db.exec(`CREATE TABLE IF NOT EXISTS notes (...)`)


// TODO 2: if the table is empty, insert two example notes.
// Hint: db.prepare("SELECT COUNT(*) AS count FROM notes").get()


module.exports = db;
