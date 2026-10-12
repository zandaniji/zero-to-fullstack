const express = require("express");
const { hashPassword, verifyPassword } = require("../passwords");
const { signToken, requireAuth } = require("../auth");

module.exports = function authRoutes(db) {
  const router = express.Router();

  // TODO: prepare your SQL statements here, e.g.
  // const findByEmail = db.prepare("SELECT * FROM users WHERE email = ?");

  // TODO: POST /register   body: { email, password }
  //  - validate: email looks like an email, password is at least 8 characters → else 400 { errors: [...] }
  //  - lowercase + trim the email
  //  - email already used → 409 { error }
  //  - INSERT the user with hashPassword(password)
  //  - respond 201 { token: signToken(user), user: { id, email } }   ← never send the hash!

  // TODO: POST /login   body: { email, password }
  //  - find the user by (lowercased) email and verifyPassword
  //  - wrong email OR wrong password → the SAME 401 { error: "Wrong email or password." }
  //  - respond 200 { token, user: { id, email } }

  // TODO: GET /me   (protected with requireAuth)
  //  - respond { user: { id, email } }

  return router;
};
