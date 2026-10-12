const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------

// Parse JSON request bodies into req.body
app.use(express.json());

// Log every request, e.g. "GET /api/notes"
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ---------- "Database" (just an array for now) ----------

let notes = [
  { id: 1, title: "Learn Express", body: "Routes, middleware and JSON.", createdAt: new Date().toISOString() },
  { id: 2, title: "Build an API", body: "A notes app with full CRUD.", createdAt: new Date().toISOString() },
];
let nextId = 3;

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

function findNote(id) {
  return notes.find((n) => n.id === Number(id));
}

// ---------- Routes ----------

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Notes API 📝",
    endpoints: ["GET /api/notes", "GET /api/notes/:id", "POST /api/notes", "PUT /api/notes/:id", "DELETE /api/notes/:id"],
  });
});

// List notes, optionally filtered: /api/notes?search=express
app.get("/api/notes", (req, res) => {
  const search = (req.query.search || "").toLowerCase();
  const result = search
    ? notes.filter((n) => n.title.toLowerCase().includes(search) || n.body.toLowerCase().includes(search))
    : notes;
  res.json(result);
});

// Get one note
app.get("/api/notes/:id", (req, res) => {
  const note = findNote(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});

// Create a note
app.post("/api/notes", (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const note = {
    id: nextId++,
    title: req.body.title.trim(),
    body: req.body.body || "",
    createdAt: new Date().toISOString(),
  };
  notes.push(note);
  res.status(201).json(note);
});

// Update (replace) a note
app.put("/api/notes/:id", (req, res) => {
  const note = findNote(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });

  const errors = validateNote(req.body);
  if (errors.length) return res.status(400).json({ errors });

  note.title = req.body.title.trim();
  note.body = req.body.body || "";
  res.json(note);
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const note = findNote(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });

  notes = notes.filter((n) => n !== note);
  res.status(204).end();
});

// ---------- Errors ----------

// Any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Error handler: Express recognises it by its 4 parameters
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Something went wrong" : err.message });
});

app.listen(PORT, () => {
  console.log(`Notes API running at http://localhost:${PORT}`);
});
