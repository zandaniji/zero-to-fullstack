const jwt = require("jsonwebtoken");

// TODO: signToken(user)
// Return jwt.sign({ sub: String(user.id), email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })
function signToken(user) {
  throw new Error("signToken is not implemented yet");
}

// TODO: requireAuth(req, res, next)
//  - Read the "Authorization" header. It should look like "Bearer <token>"
//  - Missing or wrong format → 401 { error: "Please log in first." }
//  - jwt.verify(token, process.env.JWT_SECRET) inside try/catch
//      ✓ valid   → req.user = { id: Number(payload.sub), email: payload.email }; next()
//      ✗ invalid → 401 { error: "Your session has expired. Please log in again." }
function requireAuth(req, res, next) {
  res.status(501).json({ error: "requireAuth is not implemented yet" });
}

module.exports = { signToken, requireAuth };
