const express = require("express");
const { hashPassword, verifyPassword } = require("../passwords");
const { signToken, requireAuth } = require("../auth");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(body) {
  const errors = [];
  if (!body || typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email.trim())) {
    errors.push("A valid email is required.");
  }
  if (!body || typeof body.password !== "string" || body.password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  return errors;
}

// Never send password hashes back to the client.
const publicUser = (user) => ({ id: user.id, email: user.email });

module.exports = function authRoutes(db) {
  const router = express.Router();

  const findByEmail = db.prepare("SELECT * FROM users WHERE email = ?");
  const findById = db.prepare("SELECT * FROM users WHERE id = ?");
  const insertUser = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");

  router.post("/register", (req, res) => {
    const errors = validateCredentials(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const email = req.body.email.trim().toLowerCase();
    if (findByEmail.get(email)) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const result = insertUser.run(email, hashPassword(req.body.password));
    const user = findById.get(result.lastInsertRowid);
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  });

  router.post("/login", (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const user = findByEmail.get(email);

    // Same message for "no such user" and "wrong password", so we don't reveal which emails exist.
    if (!user || !verifyPassword(String(req.body?.password || ""), user.password_hash)) {
      return res.status(401).json({ error: "Wrong email or password." });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  });

  router.get("/me", requireAuth, (req, res) => {
    const user = findById.get(req.user.id);
    if (!user) return res.status(401).json({ error: "Account not found." });
    res.json({ user: publicUser(user) });
  });

  return router;
};
