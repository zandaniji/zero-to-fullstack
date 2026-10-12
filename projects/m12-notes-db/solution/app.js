const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

// Returns a list of problems with a note sent by the client (empty = valid).
function validateNote(data) {
  const errors = [];
  if (!data || typeof data.title !== "string" || data.title.trim() === "") {
    errors.push("title is required");
  } else if (data.title.trim().length > 100) {
    errors.push("title must be 100 characters or fewer");
  }
  if (data && data.body !== undefined && typeof data.body !== "string") {
    errors.push("body must be a string");
  }
  return errors;
}

// Prepared statements: written once, run many times. The ? placeholders keep
// user input separate from the SQL, which prevents SQL injection.
const sql = {
  all: db.prepare("SELECT * FROM notes ORDER BY created_at DESC, id DESC"),
  search: db.prepare("SELECT * FROM notes WHERE title LIKE ? OR body LIKE ? ORDER BY created_at DESC, id DESC"),
  get: db.prepare("SELECT * FROM notes WHERE id = ?"),
  insert: db.prepare("INSERT INTO notes (title, body) VALUES (?, ?)"),
  update: db.prepare("UPDATE notes SET title = ?, body = ? WHERE id = ?"),
  remove: db.prepare("DELETE FROM notes WHERE id = ?"),
};

app.get("/api/notes", (req, res) => {
  const search = req.query.search;
  const notes = search ? sql.search.all(`%${search}%`, `%${search}%`) : sql.all.all();
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const note = sql.get.get(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});

app.post("/api/notes", (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = sql.insert.run(req.body.title.trim(), req.body.body || "");
  const note = sql.get.get(result.lastInsertRowid);
  res.status(201).json(note);
});

app.put("/api/notes/:id", (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = sql.update.run(req.body.title.trim(), req.body.body || "", req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Note not found" });
  res.json(sql.get.get(req.params.id));
});

app.delete("/api/notes/:id", (req, res) => {
  const result = sql.remove.run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Note not found" });
  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Something went wrong" : err.message });
});

module.exports = app;
