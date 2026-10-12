const express = require("express");
const cors = require("cors");
const { openDatabase } = require("./db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Build the app. Taking `db` as a parameter lets tests pass an in-memory database.
function createApp(db = openDatabase()) {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRoutes(db));
  app.use("/api/tasks", taskRoutes(db));

  app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
  });

  // Never leak stack traces to clients; log them on the server instead.
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? "Something went wrong." : err.message });
  });

  return app;
}

module.exports = { createApp };
