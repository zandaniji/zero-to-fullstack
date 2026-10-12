const jwt = require("jsonwebtoken");

function secret() {
  return process.env.JWT_SECRET;
}

// Create a signed token that proves "this request comes from user X".
function signToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email }, secret(), { expiresIn: "7d" });
}

// Middleware: only let requests with a valid "Authorization: Bearer <token>" through.
function requireAuth(req, res, next) {
  const header = req.get("Authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Please log in first." });
  }

  try {
    const payload = jwt.verify(token, secret());
    req.user = { id: Number(payload.sub), email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}

module.exports = { signToken, requireAuth };
