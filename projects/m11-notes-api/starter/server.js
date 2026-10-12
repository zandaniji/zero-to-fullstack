const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------

// TODO: parse JSON request bodies (express.json())

// TODO: log every request, e.g. "GET /api/notes"

// ---------- "Database" (just an array for now) ----------

let notes = [
  { id: 1, title: "Learn Express", body: "Routes, middleware and JSON.", createdAt: new Date().toISOString() },
  { id: 2, title: "Build an API", body: "A notes app with full CRUD.", createdAt: new Date().toISOString() },
];
let nextId = 3;

// TODO: write validateNote(data) that returns an array of error messages
//  - title is required (a non-empty string)
//  - title must be 100 characters or fewer
//  - body, if present, must be a string

// ---------- Routes ----------

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Notes API 📝" });
});

// TODO: GET    /api/notes          list all notes (support ?search=word)
// TODO: GET    /api/notes/:id      one note, or 404 { error: "Note not found" }
// TODO: POST   /api/notes          create (validate → 400), respond 201 with the new note
// TODO: PUT    /api/notes/:id      replace title/body (404 / 400 as needed)
// TODO: DELETE /api/notes/:id      delete, respond 204 (or 404)

// ---------- Errors ----------

// TODO: a 404 handler for unknown routes → { error: "Cannot GET /something" }

// TODO: an error-handling middleware (err, req, res, next) → 500 { error: "Something went wrong" }

app.listen(PORT, () => {
  console.log(`Notes API running at http://localhost:${PORT}`);
});
