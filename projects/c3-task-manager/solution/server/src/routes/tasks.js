const express = require("express");
const { requireAuth } = require("../auth");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Validate a (possibly partial) task. `partial` = PATCH, where fields are optional.
function validateTask(body, { partial = false } = {}) {
  const errors = [];
  if (!body || typeof body !== "object") return ["Request body must be JSON."];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) errors.push("title is required.");
    else if (body.title.trim().length > 200) errors.push("title must be 200 characters or fewer.");
  }
  if (body.done !== undefined && typeof body.done !== "boolean") errors.push("done must be true or false.");
  if (body.dueDate !== undefined && body.dueDate !== null && !DATE_PATTERN.test(body.dueDate)) {
    errors.push("dueDate must look like 2026-12-31 (or be null).");
  }
  return errors;
}

// Database rows use snake_case and 0/1; the API speaks camelCase and booleans.
const toJson = (row) => ({
  id: row.id,
  title: row.title,
  done: row.done === 1,
  dueDate: row.due_date,
  createdAt: row.created_at,
});

module.exports = function taskRoutes(db) {
  const router = express.Router();
  router.use(requireAuth); // every task route needs a logged-in user

  // Every query includes user_id, so people can only ever see their own tasks.
  const listAll = db.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY done, due_date IS NULL, due_date, id DESC");
  const listByDone = db.prepare("SELECT * FROM tasks WHERE user_id = ? AND done = ? ORDER BY due_date IS NULL, due_date, id DESC");
  const getOne = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?");
  const insert = db.prepare("INSERT INTO tasks (user_id, title, due_date) VALUES (?, ?, ?)");
  const update = db.prepare("UPDATE tasks SET title = ?, done = ?, due_date = ? WHERE id = ? AND user_id = ?");
  const remove = db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");

  // GET /api/tasks?status=all|active|done
  router.get("/", (req, res) => {
    const status = req.query.status || "all";
    let rows;
    if (status === "active") rows = listByDone.all(req.user.id, 0);
    else if (status === "done") rows = listByDone.all(req.user.id, 1);
    else rows = listAll.all(req.user.id);
    res.json(rows.map(toJson));
  });

  router.post("/", (req, res) => {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = insert.run(req.user.id, req.body.title.trim(), req.body.dueDate || null);
    res.status(201).json(toJson(getOne.get(result.lastInsertRowid, req.user.id)));
  });

  // PATCH: update only the fields that were sent
  router.patch("/:id", (req, res) => {
    const task = getOne.get(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: "Task not found." });

    const errors = validateTask(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ errors });

    const title = req.body.title !== undefined ? req.body.title.trim() : task.title;
    const done = req.body.done !== undefined ? Number(req.body.done) : task.done;
    const dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.due_date;

    update.run(title, done, dueDate, task.id, req.user.id);
    res.json(toJson(getOne.get(task.id, req.user.id)));
  });

  router.delete("/:id", (req, res) => {
    const result = remove.run(req.params.id, req.user.id);
    if (result.changes === 0) return res.status(404).json({ error: "Task not found." });
    res.status(204).end();
  });

  return router;
};
