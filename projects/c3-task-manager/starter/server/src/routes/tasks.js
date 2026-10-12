const express = require("express");
const { requireAuth } = require("../auth");

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

  // ⚠️ Every query must include "AND user_id = ?" so people only ever see their own tasks.

  // TODO: GET /           ?status=all|active|done   → 200 [tasks]
  // TODO: POST /          { title, dueDate? }        → 201 task   (400 if title is missing/too long)
  // TODO: PATCH /:id      { title?, done?, dueDate? } → 200 task   (404 if not yours, 400 if invalid)
  // TODO: DELETE /:id                                → 204        (404 if not yours)

  return router;
};
