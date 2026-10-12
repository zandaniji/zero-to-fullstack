const express = require("express");
const db = require("./db"); // eslint-disable-line no-unused-vars -- you'll use this!

const app = express();
app.use(express.json());

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

// ----------------------------------------------------------------------------
// This is the Module 11 API, still storing notes in an array.
// Your job: replace every use of `notes` with SQL queries through `db`.
// Use ? placeholders for every value that comes from the request!
//   db.prepare("SELECT * FROM notes WHERE id = ?").get(id)
//   db.prepare("INSERT INTO notes (title, body) VALUES (?, ?)").run(title, body)
// When you're done, delete the array and run `npm test`.
// ----------------------------------------------------------------------------
let notes = [
  { id: 1, title: "Learn SQL", body: "SELECT, INSERT, UPDATE, DELETE.", created_at: new Date().toISOString() },
  { id: 2, title: "Use a real database", body: "My notes survive a restart now!", created_at: new Date().toISOString() },
];
let nextId = 3;

app.get("/api/notes", (req, res) => {
  const search = (req.query.search || "").toLowerCase();
  const result = search
    ? notes.filter((n) => n.title.toLowerCase().includes(search) || n.body.toLowerCase().includes(search))
    : notes;
  res.json(result);
});

app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});

app.post("/api/notes", (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const note = { id: nextId++, title: req.body.title.trim(), body: req.body.body || "", created_at: new Date().toISOString() };
  notes.push(note);
  res.status(201).json(note);
});

app.put("/api/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: "Note not found" });

  const errors = validateNote(req.body);
  if (errors.length) return res.status(400).json({ errors });

  note.title = req.body.title.trim();
  note.body = req.body.body || "";
  res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: "Note not found" });
  notes = notes.filter((n) => n !== note);
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
