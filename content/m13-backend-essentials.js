/* Module 13 — Backend Essentials */
(() => {
  // Shared playground setup for the auth exercises.
  // (The browser playground has no node:crypto, so fakeHash stands in for scrypt.)
  const AUTH_SETUP = [
    'const express = require("express");',
    'const app = express();',
    'app.use(express.json());',
    '',
    '// ⚠️ Stand-in for crypto.scryptSync. Never use this in a real app!',
    'const fakeHash = (password) => "hashed:" + password.split("").reverse().join("");',
    '',
    'const users = [',
    '  { id: 1, email: "ana@example.com", role: "admin", passwordHash: fakeHash("admin-pass-123") },',
    '  { id: 2, email: "ben@example.com", role: "member", passwordHash: fakeHash("member-pass-123") },',
    '];',
    '',
    '// token → user id. (Node: use crypto.randomBytes(32).toString("hex") for tokens.)',
    'const sessions = new Map();',
    'const newToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);',
    '',
    'app.post("/login", (req, res) => {',
    '  const { email, password } = req.body || {};',
    '  const user = users.find((u) => u.email === email);',
    '  if (!user || user.passwordHash !== fakeHash(String(password))) {',
    '    return res.status(401).json({ error: "Wrong email or password" });',
    '  }',
    '  const token = newToken();',
    '  sessions.set(token, user.id);',
    '  res.json({ token });',
    '});',
  ].join('\n');

  const REQUIRE_AUTH = [
    'function requireAuth(req, res, next) {',
    '  const [scheme, token] = (req.get("Authorization") || "").split(" ");',
    '  if (scheme !== "Bearer" || !token) {',
    '    return res.status(401).json({ error: "Please log in" });',
    '  }',
    '  const userId = sessions.get(token);',
    '  if (!userId) {',
    '    return res.status(401).json({ error: "Invalid or expired token" });',
    '  }',
    '  req.user = users.find((u) => u.id === userId);',
    '  next();',
    '}',
  ].join('\n');

  Course.addContent('m13', {

    /* ---------------------------------------------------------------- */
    'auth': [
      {
        type: 'explain',
        title: 'Authentication vs authorization',
        body: [
          "Two words that sound alike but mean different things:",
          "- **Authentication** (*who are you?*): proving identity, usually with an email and password. Failing it gives **401 Unauthorized**.",
          "- **Authorization** (*what are you allowed to do?*): checking permissions, for example \"only admins can delete users\" or \"you can only edit *your* tasks\". Failing it gives **403 Forbidden** (or 404 if you'd rather not reveal that the thing exists).",
          "A typical login flow:",
          { code: `1. Client  ── POST /login { email, password } ──────────▶  Server checks the password hash\n2. Client  ◀─────────────── { token } ──────────────────  Server creates a session / token\n3. Client  ── GET /tasks  Authorization: Bearer <token> ▶  Middleware checks the token,\n                                                          sets req.user, route runs\n4. Client  ◀─────────────── [ tasks of req.user ] ─────`, lang: 'text' },
        ],
      },
      {
        type: 'explain',
        title: 'Storing passwords safely',
        body: [
          "**Never store passwords as plain text.** Databases get leaked, and people reuse passwords everywhere. Instead, store a **hash**: a one-way scramble that can't be reversed.",
          "Good password hashing is deliberately **slow** (so attackers can't try billions of guesses) and **salted** (a random value per user, so identical passwords produce different hashes). Node's built-in `scrypt` does both:",
          { code: `const crypto = require("node:crypto");\n\nfunction hashPassword(password) {\n  const salt = crypto.randomBytes(16).toString("hex");\n  const hash = crypto.scryptSync(password, salt, 64).toString("hex");\n  return \`\${salt}:\${hash}\`;          // store this string in the database\n}\n\nfunction verifyPassword(password, stored) {\n  const [salt, hash] = stored.split(":");\n  const attempt = crypto.scryptSync(password, salt, 64);\n  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), attempt);\n}`, lang: 'js' },
          "To log someone in, hash what they typed with the same salt and compare. `timingSafeEqual` avoids leaking information through how long the comparison takes.",
          "> Popular alternatives are the `bcrypt` and `argon2` packages. Never invent your own scheme, and never use fast hashes like MD5 or SHA-256 for passwords.",
        ],
      },
      {
        type: 'explain',
        title: 'Sessions and tokens',
        body: [
          "After logging in, the server needs to recognise the user on every later request. There are two main approaches:",
          "**Server sessions**: the server stores `{ sessionId → userId }` (in memory or a database) and gives the browser the random session ID in an **httpOnly cookie**. Logging out deletes the session. This is simple and easy to revoke.",
          "**Tokens (JWT)**: the server gives the client a **signed** token containing the user's id. The server doesn't store anything; it just verifies the signature on each request:",
          { code: `const jwt = require("jsonwebtoken");\n\nconst token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });\n// → "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImV4cCI6...}.Xb7Rk..."\n//      header            . payload (NOT secret!)       . signature\n\nconst payload = jwt.verify(token, process.env.JWT_SECRET);  // throws if tampered or expired`, lang: 'js' },
          "- A JWT's payload is only **encoded**, not encrypted. Anyone can read it, so never put secrets in it.",
          "- The **signature** proves the server created it and nobody changed it.",
          "- Clients send it in a header: `Authorization: Bearer <token>`.",
          "The next exercise uses a simple token → user map (like server sessions). The Final Capstone uses real JWTs. The middleware looks almost the same either way.",
        ],
      },
      {
        type: 'try',
        title: 'Protect routes with middleware',
        mode: 'express',
        tryRequests: [
          { method: 'GET', url: '/me' },
          { method: 'POST', url: '/login', body: { email: 'ben@example.com', password: 'member-pass-123' } },
        ],
        body: [
          "`POST /login` already works and returns a token. To call a protected route in the API tester, you'd need to send the token in a header. The checker does that for you.",
        ],
        goal: [
          "Write a `requireAuth` middleware:",
          "- Read the `Authorization` header with `req.get(\"Authorization\")`. It should be `Bearer <token>`",
          "- Missing or malformed → **401** `{ \"error\": \"Please log in\" }`",
          "- Token not in `sessions` → **401** `{ \"error\": \"Invalid or expired token\" }`",
          "- Otherwise set `req.user` to the matching user and call `next()`",
          "Then protect `GET /me`, which responds with the user's `email` and `role`.",
        ],
        hint: [
          ["`const [scheme, token] = (req.get(\"Authorization\") || \"\").split(\" \");`"],
          ["Protect a route by listing the middleware before the handler: `app.get(\"/me\", requireAuth, (req, res) => ...)`."],
        ],
        starter: { js: AUTH_SETUP + '\n\n// Write requireAuth here\n\n\napp.get("/me", (req, res) => {\n  // respond with { email, role } of the logged-in user\n  res.status(501).json({ error: "Not implemented" });\n});\n\napp.listen(3000);\n' },
        solution: { js: AUTH_SETUP + '\n\n// Write requireAuth here\n' + REQUIRE_AUTH + '\n\napp.get("/me", requireAuth, (req, res) => {\n  // respond with { email, role } of the logged-in user\n  res.json({ email: req.user.email, role: req.user.role });\n});\n\napp.listen(3000);\n' },
        check: async ({ request }) => {
          const none = await request('GET', '/me');
          if (none.status === 0) return none.text;
          if (none.status !== 401 || !none.body || none.body.error !== 'Please log in') return `GET /me without a token should be 401 { "error": "Please log in" }. Got ${none.status}: ${none.text}`;
          const wrong = await request('GET', '/me', null, { Authorization: 'Bearer not-a-real-token' });
          if (wrong.status !== 401 || !wrong.body || wrong.body.error !== 'Invalid or expired token') return 'An unknown token should be 401 { "error": "Invalid or expired token" }.';
          const weird = await request('GET', '/me', null, { Authorization: 'Basic abc' });
          if (weird.status !== 401) return 'Only accept the "Bearer <token>" format.';
          const login = await request('POST', '/login', { email: 'ben@example.com', password: 'member-pass-123' });
          if (!login.body || !login.body.token) return 'POST /login stopped working.';
          const me = await request('GET', '/me', null, { Authorization: 'Bearer ' + login.body.token });
          if (me.status !== 200) return `GET /me with a valid token should be 200, not ${me.status}.`;
          return (me.body && me.body.email === 'ben@example.com' && me.body.role === 'member' && !('passwordHash' in me.body)) || 'GET /me should return just { email, role } of the logged-in user (never the password hash!).';
        },
      },
      {
        type: 'try',
        title: 'Role-based authorization',
        mode: 'express',
        tryRequests: [{ method: 'GET', url: '/admin/stats' }],
        body: ["Being logged in isn't always enough. Some routes are for admins only."],
        goal: [
          "Write a middleware **factory** `requireRole(role)` that returns a middleware which:",
          "- responds **403** `{ \"error\": \"Forbidden\" }` if `req.user.role` doesn't match",
          "- otherwise calls `next()`",
          "Protect `GET /admin/stats` with `requireAuth` **and** `requireRole(\"admin\")`.",
        ],
        hint: [{ code: "function requireRole(role) {\n  return (req, res, next) => {\n    if (req.user.role !== role) return res.status(403).json({ error: \"Forbidden\" });\n    next();\n  };\n}\n\napp.get(\"/admin/stats\", requireAuth, requireRole(\"admin\"), (req, res) => { ... });", lang: 'js' }],
        starter: { js: AUTH_SETUP + '\n\n' + REQUIRE_AUTH + '\n\n// Write requireRole(role) here\n\n\napp.get("/admin/stats", (req, res) => {\n  res.json({ users: users.length, activeSessions: sessions.size });\n});\n\napp.listen(3000);\n' },
        solution: { js: AUTH_SETUP + '\n\n' + REQUIRE_AUTH + '\n\n// Write requireRole(role) here\nfunction requireRole(role) {\n  return (req, res, next) => {\n    if (req.user.role !== role) {\n      return res.status(403).json({ error: "Forbidden" });\n    }\n    next();\n  };\n}\n\napp.get("/admin/stats", requireAuth, requireRole("admin"), (req, res) => {\n  res.json({ users: users.length, activeSessions: sessions.size });\n});\n\napp.listen(3000);\n' },
        check: async ({ request }) => {
          const anon = await request('GET', '/admin/stats');
          if (anon.status === 0) return anon.text;
          if (anon.status !== 401) return `Without a token, /admin/stats should be 401 (got ${anon.status}). Add requireAuth.`;
          const member = await request('POST', '/login', { email: 'ben@example.com', password: 'member-pass-123' });
          const m = await request('GET', '/admin/stats', null, { Authorization: 'Bearer ' + member.body.token });
          if (m.status !== 403 || !m.body || m.body.error !== 'Forbidden') return `A member should get 403 { "error": "Forbidden" }. Got ${m.status}: ${m.text}`;
          const admin = await request('POST', '/login', { email: 'ana@example.com', password: 'admin-pass-123' });
          const a = await request('GET', '/admin/stats', null, { Authorization: 'Bearer ' + admin.body.token });
          return (a.status === 200 && a.body && a.body.users === 2) || `An admin should get 200 with the stats. Got ${a.status}: ${a.text}`;
        },
      },
      {
        type: 'explain',
        title: 'Where should the client keep the token?',
        body: [
          "A common question with no perfect answer:",
          "- **`localStorage`**: simple, and survives reloads. But any JavaScript on the page can read it, so a cross-site scripting (XSS) bug could steal it.",
          "- **httpOnly cookie**: JavaScript can't read it at all, so it's safer against XSS. The browser sends it automatically. You then need to protect against **CSRF** (cookie settings like `SameSite=Lax` help), and it takes a bit more setup across different domains.",
          "Many production apps use httpOnly cookies. Plenty of apps (including your capstone) use `localStorage` plus a short token lifetime. The most important defense either way is preventing XSS in the first place: never put user input into `innerHTML`, and keep your dependencies updated.",
          "> For real products, consider an auth service or library (Auth.js, Clerk, Supabase Auth, Lucia-style session patterns). Auth is easy to get subtly wrong, and building it yourself here is about understanding how it works.",
        ],
      },
    ],

    /* ---------------------------------------------------------------- */
    'validation-security': [
      {
        type: 'explain',
        title: 'Validate everything',
        body: [
          "**Never trust the client.** Anyone can send any request to your API, skipping your nice React form entirely, with curl or a script. Front-end validation is for user experience; **back-end validation is for safety**.",
          "Check every input for:",
          "- **Presence**: required fields exist",
          "- **Type**: a string is a string, a number is a number",
          "- **Format and range**: emails look like emails, ages are positive, titles aren't 10MB long",
          "Respond with **400** and say *what* is wrong, so clients can show useful messages:",
          { code: `{ "errors": ["email must be a valid email address", "password must be at least 8 characters"] }`, lang: 'js', label: 'JSON' },
          "Validation is a perfect job for **middleware**, keeping your route handlers clean.",
          "> In larger projects, schema libraries like **Zod** describe the shape once and validate it for you: `z.object({ email: z.string().email() })`.",
        ],
      },
      {
        type: 'try',
        title: 'A validation middleware',
        mode: 'express',
        tryRequests: [
          { method: 'POST', url: '/signup', body: { email: 'ada@example.com', password: 'analytical1', age: 36 } },
          { method: 'POST', url: '/signup', body: { email: 'nope', password: 'short' } },
        ],
        body: ["Keep the rules out of the route by putting them in middleware."],
        goal: [
          "Write `validateSignup(req, res, next)` that collects **all** problems into an `errors` array:",
          "- `email` must be a string containing `@` → `\"email is invalid\"`",
          "- `password` must be a string of at least 8 characters **including a digit** → `\"password must be 8+ characters with a number\"`",
          "- `age` is optional, but if present must be an integer ≥ 13 → `\"age must be a whole number of 13 or more\"`",
          "If there are errors, respond **400** `{ errors }`. Otherwise call `next()`. Use it on `POST /signup`.",
        ],
        hint: [
          ["A digit check: `/\\d/.test(password)`. A whole number: `Number.isInteger(age)`."],
          ["Optional fields: `if (age !== undefined && (!Number.isInteger(age) || age < 13))`"],
        ],
        starter: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\n// Write validateSignup here\n\n\napp.post(\"/signup\", (req, res) => {\n  res.status(201).json({ ok: true, email: req.body.email });\n});\n\napp.listen(3000);\n" },
        solution: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\n// Write validateSignup here\nfunction validateSignup(req, res, next) {\n  const { email, password, age } = req.body || {};\n  const errors = [];\n\n  if (typeof email !== \"string\" || !email.includes(\"@\")) {\n    errors.push(\"email is invalid\");\n  }\n  if (typeof password !== \"string\" || password.length < 8 || !/\\d/.test(password)) {\n    errors.push(\"password must be 8+ characters with a number\");\n  }\n  if (age !== undefined && (!Number.isInteger(age) || age < 13)) {\n    errors.push(\"age must be a whole number of 13 or more\");\n  }\n\n  if (errors.length) return res.status(400).json({ errors });\n  next();\n}\n\napp.post(\"/signup\", validateSignup, (req, res) => {\n  res.status(201).json({ ok: true, email: req.body.email });\n});\n\napp.listen(3000);\n" },
        check: async ({ request }) => {
          const ok = await request('POST', '/signup', { email: 'ada@example.com', password: 'analytical1' });
          if (ok.status === 0) return ok.text;
          if (ok.status !== 201) return `A valid signup (no age) should pass with 201. Got ${ok.status}: ${ok.text}`;
          const okAge = await request('POST', '/signup', { email: 'ada@example.com', password: 'analytical1', age: 36 });
          if (okAge.status !== 201) return 'A valid signup with age 36 should pass.';
          const bad = await request('POST', '/signup', { email: 'nope', password: 'short', age: 9 });
          if (bad.status !== 400 || !bad.body || !Array.isArray(bad.body.errors)) return 'Invalid data should get 400 { errors: [...] }.';
          const want = ['email is invalid', 'password must be 8+ characters with a number', 'age must be a whole number of 13 or more'];
          for (const w of want) if (!bad.body.errors.includes(w)) return `Missing the error "${w}". Collect all errors before responding.`;
          const noDigit = await request('POST', '/signup', { email: 'a@b.co', password: 'password' });
          if (noDigit.status !== 400) return 'A password without a digit should be rejected.';
          const decimal = await request('POST', '/signup', { email: 'a@b.co', password: 'passw0rd!', age: 15.5 });
          if (decimal.status !== 400) return 'An age of 15.5 should be rejected (whole numbers only).';
          const empty = await request('POST', '/signup', {});
          return (empty.status === 400 && empty.body.errors.length === 2) || 'An empty body should give 2 errors (email and password; age is optional).';
        },
      },
      {
        type: 'explain',
        title: 'CORS: who may call your API?',
        body: [
          "Browsers enforce the **same-origin policy**: a page from `http://localhost:5173` can't read responses from `http://localhost:3000` (a different port is a different **origin**) unless the server says it's OK.",
          "The server says so with **CORS** (Cross-Origin Resource Sharing) headers:",
          { code: `Access-Control-Allow-Origin: http://localhost:5173\nAccess-Control-Allow-Methods: GET, POST, PATCH, DELETE\nAccess-Control-Allow-Headers: Content-Type, Authorization`, lang: 'text' },
          "For \"non-simple\" requests (JSON bodies, an `Authorization` header, PATCH or DELETE), the browser first sends a **preflight** `OPTIONS` request to ask permission, then the real request.",
          "In real projects, use the `cors` package:",
          { code: `const cors = require("cors");\napp.use(cors({ origin: process.env.CLIENT_ORIGIN }));   // only your front end`, lang: 'js' },
          "> CORS only applies to **browsers**. It doesn't stop curl or other servers, so it's not a replacement for authentication. It also only exists to *relax* the browser's default protection. Avoid `origin: \"*\"` for APIs that use credentials.",
        ],
      },
      {
        type: 'try',
        title: 'CORS by hand',
        mode: 'express',
        tryRequests: [{ method: 'GET', url: '/api/data' }],
        body: ["To really understand CORS, write the middleware yourself (instead of using the `cors` package)."],
        goal: [
          "Write middleware that, **only when** the request's `Origin` header is `http://localhost:5173`:",
          "- sets `Access-Control-Allow-Origin` to that origin",
          "- sets `Access-Control-Allow-Methods` to `GET, POST, PATCH, DELETE`",
          "- sets `Access-Control-Allow-Headers` to `Content-Type, Authorization`",
          "For any `OPTIONS` request (preflight), respond **204** immediately. Other origins get no CORS headers.",
        ],
        hint: [{ code: "app.use((req, res, next) => {\n  if (req.get(\"Origin\") === ALLOWED_ORIGIN) {\n    res.set(\"Access-Control-Allow-Origin\", ALLOWED_ORIGIN);\n    // ...the other two headers\n  }\n  if (req.method === \"OPTIONS\") return res.sendStatus(204);\n  next();\n});", lang: 'js' }],
        starter: { js: "const express = require(\"express\");\nconst app = express();\n\nconst ALLOWED_ORIGIN = \"http://localhost:5173\";\n\n// CORS middleware here\n\n\napp.get(\"/api/data\", (req, res) => {\n  res.json({ message: \"Hello from the API\" });\n});\n\napp.listen(3000);\n" },
        solution: { js: "const express = require(\"express\");\nconst app = express();\n\nconst ALLOWED_ORIGIN = \"http://localhost:5173\";\n\n// CORS middleware here\napp.use((req, res, next) => {\n  if (req.get(\"Origin\") === ALLOWED_ORIGIN) {\n    res.set(\"Access-Control-Allow-Origin\", ALLOWED_ORIGIN);\n    res.set(\"Access-Control-Allow-Methods\", \"GET, POST, PATCH, DELETE\");\n    res.set(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\");\n  }\n  if (req.method === \"OPTIONS\") return res.sendStatus(204);\n  next();\n});\n\napp.get(\"/api/data\", (req, res) => {\n  res.json({ message: \"Hello from the API\" });\n});\n\napp.listen(3000);\n" },
        check: async ({ request }) => {
          const good = await request('GET', '/api/data', null, { Origin: 'http://localhost:5173' });
          if (good.status === 0) return good.text;
          if (good.status !== 200) return 'GET /api/data should still work.';
          const h = good.headers;
          if (h['access-control-allow-origin'] !== 'http://localhost:5173') return 'Set `Access-Control-Allow-Origin` to `http://localhost:5173` for that origin.';
          if (!/PATCH/.test(h['access-control-allow-methods'] || '')) return 'Set `Access-Control-Allow-Methods` to "GET, POST, PATCH, DELETE".';
          if (!/Authorization/.test(h['access-control-allow-headers'] || '')) return 'Set `Access-Control-Allow-Headers` to "Content-Type, Authorization".';
          const evil = await request('GET', '/api/data', null, { Origin: 'https://evil.example' });
          if (evil.headers['access-control-allow-origin']) return 'Other origins must NOT get an `Access-Control-Allow-Origin` header.';
          const pre = await request('OPTIONS', '/api/data', null, { Origin: 'http://localhost:5173' });
          return pre.status === 204 || `A preflight OPTIONS request should get 204 (got ${pre.status}).`;
        },
      },
      {
        type: 'explain',
        title: 'A security checklist',
        body: [
          "Most real-world breaches come from a handful of well-known mistakes. Check every project against this list:",
          "1. **SQL injection**: always use `?` placeholders. ✅ You've done this since Module 12.",
          "2. **Cross-site scripting (XSS)**: never insert user content as HTML. Use `textContent`; React escapes values in `{ }` for you. Be very careful with `innerHTML` and `dangerouslySetInnerHTML`.",
          "3. **Broken access control**: check *ownership* on every request (`WHERE id = ? AND user_id = ?`). This is the #1 web risk on the OWASP Top 10!",
          "4. **Secrets**: keep them in environment variables. Never commit them, never send them to the browser, and rotate any that leak.",
          "5. **Passwords**: hash with scrypt, bcrypt or argon2. Rate-limit login attempts.",
          "6. **Error messages**: log details on the server, and send generic messages to clients.",
          "7. **HTTPS everywhere** in production (hosting platforms do this for you).",
          "8. **Security headers**: the `helmet` package sets a sensible bundle in one line: `app.use(helmet())`.",
          "9. **Dependencies**: run `npm audit` regularly and keep packages updated.",
          "10. **Limits**: cap request body size (`express.json({ limit: \"10kb\" })`) and rate-limit expensive or sensitive endpoints.",
        ],
      },
      {
        type: 'try',
        title: 'A simple rate limiter',
        mode: 'express',
        tryRequests: [{ method: 'POST', url: '/login', body: { email: 'me@example.com', password: 'guess' } }],
        body: ["Without a limit, an attacker can try thousands of passwords per minute. Press Send repeatedly to see your limiter kick in."],
        goal: [
          "Write a `rateLimit` middleware that allows at most **3 requests per minute** per client:",
          "- identify the client with `req.ip || \"local\"`",
          "- keep `{ count, windowStart }` per client in a `Map`",
          "- when a minute has passed since `windowStart`, start a new window",
          "- over the limit → **429** `{ \"error\": \"Too many requests, try again later\" }` plus a `Retry-After` header (seconds)",
          "Apply it to `POST /login` only.",
        ],
        hint: [
          ["`const now = Date.now(); let entry = hits.get(key); if (!entry || now - entry.windowStart > WINDOW_MS) { entry = { count: 0, windowStart: now }; hits.set(key, entry); } entry.count++;`"],
          ["Seconds until the window resets: `Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000)`."],
        ],
        starter: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst WINDOW_MS = 60 * 1000;\nconst MAX_REQUESTS = 3;\nconst hits = new Map();\n\n// Write rateLimit here\n\n\napp.post(\"/login\", (req, res) => {\n  res.status(401).json({ error: \"Wrong email or password\" });\n});\n\napp.get(\"/public\", (req, res) => res.json({ ok: true }));\n\napp.listen(3000);\n" },
        solution: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst WINDOW_MS = 60 * 1000;\nconst MAX_REQUESTS = 3;\nconst hits = new Map();\n\n// Write rateLimit here\nfunction rateLimit(req, res, next) {\n  const key = req.ip || \"local\";\n  const now = Date.now();\n  let entry = hits.get(key);\n\n  if (!entry || now - entry.windowStart > WINDOW_MS) {\n    entry = { count: 0, windowStart: now };\n    hits.set(key, entry);\n  }\n  entry.count++;\n\n  if (entry.count > MAX_REQUESTS) {\n    const retryAfter = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);\n    res.set(\"Retry-After\", String(retryAfter));\n    return res.status(429).json({ error: \"Too many requests, try again later\" });\n  }\n  next();\n}\n\napp.post(\"/login\", rateLimit, (req, res) => {\n  res.status(401).json({ error: \"Wrong email or password\" });\n});\n\napp.get(\"/public\", (req, res) => res.json({ ok: true }));\n\napp.listen(3000);\n" },
        check: async ({ request }) => {
          const statuses = [];
          for (let i = 0; i < 5; i++) statuses.push((await request('POST', '/login', { email: 'x@y.z', password: 'guess' })).status);
          if (statuses[0] === 0) return 'The server isn\'t responding.';
          if (statuses.slice(0, 3).some((s) => s !== 401)) return `The first 3 login attempts should reach the route (401). Got: ${statuses.join(', ')}`;
          if (statuses[3] !== 429 || statuses[4] !== 429) return `Attempts 4 and 5 should be blocked with 429. Got: ${statuses.join(', ')}`;
          const last = await request('POST', '/login', { email: 'x@y.z', password: 'guess' });
          if (!last.body || last.body.error !== 'Too many requests, try again later') return 'The 429 body should be { "error": "Too many requests, try again later" }.';
          const ra = Number(last.headers['retry-after']);
          if (!(ra > 0 && ra <= 60)) return 'Set a `Retry-After` header with the number of seconds left (1–60).';
          for (let i = 0; i < 4; i++) {
            const pub = await request('GET', '/public');
            if (pub.status !== 200) return 'Only limit `POST /login`. Other routes like `/public` should be unaffected.';
          }
          return true;
        },
      },
    ],

    /* ---------------------------------------------------------------- */
    'react-express': [
      {
        type: 'explain',
        title: 'How front end and back end fit together',
        body: [
          "In development you run **two** servers side by side:",
          { code: `Terminal 1:  cd server && npm run dev   →  Express API on http://localhost:3000\nTerminal 2:  cd client && npm run dev   →  Vite + React on http://localhost:5173`, lang: 'text' },
          "The React app calls the API with `fetch`. Because they're on different ports (different origins), you need one of:",
          "- **A Vite proxy** (recommended in development): React fetches `/api/notes` from its *own* origin, and Vite forwards it to port 3000. The browser never sees a cross-origin request, so no CORS is needed.",
          "- **CORS** on the API (needed in production if the front end and API live on different domains).",
          { code: `// client/vite.config.js\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      "/api": "http://localhost:3000",   // anything starting with /api goes to Express\n    },\n  },\n});`, lang: 'js', label: 'vite.config.js' },
          "In production, a common setup is: React built to static files on Netlify or Vercel, and the API on Render, Railway or Fly.io. The client then uses the API's full URL from an environment variable (`import.meta.env.VITE_API_URL`).",
        ],
      },
      {
        type: 'explain',
        title: 'A small API helper',
        body: [
          "Rather than repeating `fetch` boilerplate in every component, write one helper that handles JSON, the auth header and errors:",
          { code: `const BASE = import.meta.env.VITE_API_URL || "";\n\nexport async function api(path, { method = "GET", body, token } = {}) {\n  const headers = {};\n  if (body !== undefined) headers["Content-Type"] = "application/json";\n  if (token) headers.Authorization = \`Bearer \${token}\`;\n\n  const res = await fetch(BASE + path, {\n    method,\n    headers,\n    body: body !== undefined ? JSON.stringify(body) : undefined,\n  });\n\n  if (res.status === 204) return null;            // no body to parse\n  const data = await res.json().catch(() => null);\n  if (!res.ok) throw new Error(data?.error || \`Request failed (\${res.status})\`);\n  return data;\n}`, lang: 'js', label: 'src/api.js' },
          "Now components stay tidy:",
          { code: `const notes = await api("/api/notes");\nconst created = await api("/api/notes", { method: "POST", body: { title } });\nawait api(\`/api/notes/\${id}\`, { method: "DELETE" });`, lang: 'js' },
        ],
      },
      {
        type: 'explain',
        title: 'Auth on the client',
        body: [
          "Putting the pieces from Modules 10 and 13 together:",
          "1. An **`AuthContext`** holds `token` and `user`, plus `login`, `register` and `logout` functions.",
          "2. After login, store the token (in state and `localStorage`).",
          "3. Pass it to every API call: `api(\"/api/tasks\", { token })`.",
          "4. If any call returns **401**, the token expired, so call `logout()`.",
          "5. A **`ProtectedRoute`** component redirects to `/login` when there's no user:",
          { code: `import { Navigate } from "react-router";\n\nfunction ProtectedRoute({ children }) {\n  const { user } = useAuth();\n  if (!user) return <Navigate to="/login" replace />;\n  return children;\n}\n\n<Route path="/" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />`, lang: 'jsx' },
          "> Hiding pages in React is about *user experience*, not security. The real protection is your API's `requireAuth` middleware. A user can always edit front-end code in DevTools!",
        ],
      },
      {
        type: 'local',
        title: 'Connect React to your Notes API',
        body: [
          "Build a small front end for the SQLite Notes API from Module 12.",
          "1. Start the API: `cd projects/m12-notes-db/solution`, run `npm install` (first time only), then `npm run dev`.",
          "2. In a **second terminal**, create a React app next to it:",
          { code: `npm create vite@latest notes-client -- --template react\ncd notes-client\nnpm install`, lang: 'bash' },
          "3. Add the proxy to `vite.config.js`: `server: { proxy: { \"/api\": \"http://localhost:3000\" } }`.",
          "4. Create `src/api.js` with the helper from two steps ago.",
          "5. Replace `src/App.jsx` with a notes app:",
          { code: `import { useEffect, useState } from "react";\nimport { api } from "./api.js";\n\nexport default function App() {\n  const [notes, setNotes] = useState([]);\n  const [title, setTitle] = useState("");\n  const [error, setError] = useState("");\n\n  async function load() {\n    try {\n      setNotes(await api("/api/notes"));\n    } catch (err) {\n      setError(err.message);\n    }\n  }\n\n  useEffect(() => { load(); }, []);\n\n  async function addNote(e) {\n    e.preventDefault();\n    try {\n      await api("/api/notes", { method: "POST", body: { title } });\n      setTitle("");\n      load();\n    } catch (err) {\n      setError(err.message);\n    }\n  }\n\n  async function removeNote(id) {\n    await api(\`/api/notes/\${id}\`, { method: "DELETE" });\n    load();\n  }\n\n  return (\n    <main>\n      <h1>📝 Notes</h1>\n      <form onSubmit={addNote}>\n        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="New note" />\n        <button>Add</button>\n      </form>\n      {error && <p role="alert">{error}</p>}\n      <ul>\n        {notes.map((n) => (\n          <li key={n.id}>\n            {n.title} <button onClick={() => removeNote(n.id)} aria-label={\`Delete \${n.title}\`}>✕</button>\n          </li>\n        ))}\n      </ul>\n    </main>\n  );\n}`, lang: 'jsx', label: 'src/App.jsx' },
          "6. Run `npm run dev` and open http://localhost:5173. Add a note, restart the API, reload: it's still there! You've built a full-stack app. 🎉",
          "Try submitting an empty title to see your API's validation message appear in React.",
        ],
      },
    ],

    /* ---------------------------------------------------------------- */
    'testing-deploy': [
      {
        type: 'explain',
        title: 'Why write tests?',
        body: [
          "Every time you change code, something else might break. Clicking through every feature by hand doesn't scale. **Automated tests** check your code for you in seconds, every time.",
          "The **testing pyramid**:",
          { code: `        ▲   End-to-end tests   few, slow: a real browser clicks through the app\n       ▲▲▲  Integration tests  some: e.g. send real HTTP requests to your API\n     ▲▲▲▲▲▲ Unit tests          many, fast: test single functions`, lang: 'text' },
          "Tests also act as **living documentation**: they show exactly how your code is supposed to behave. In the Final Capstone, the tests *are* the specification!",
        ],
      },
      {
        type: 'explain',
        title: 'Unit tests with node:test',
        body: [
          "Node has a test runner built in, so there's nothing to install. Put tests in files ending in `.test.js`, and run `node --test` (or `npm test`):",
          { code: `// validate.test.js\nconst { test } = require("node:test");\nconst assert = require("node:assert/strict");\nconst { validateNote } = require("./validate");\n\ntest("accepts a valid note", () => {\n  assert.deepEqual(validateNote({ title: "Hello" }), []);\n});\n\ntest("requires a title", () => {\n  assert.deepEqual(validateNote({}), ["title is required"]);\n});\n\ntest("limits the title to 100 characters", () => {\n  const errors = validateNote({ title: "x".repeat(101) });\n  assert.equal(errors.length, 1);\n});`, lang: 'js', label: 'validate.test.js' },
          { output: `✔ accepts a valid note (0.6ms)\n✔ requires a title (0.1ms)\n✔ limits the title to 100 characters (0.1ms)\nℹ tests 3\nℹ pass 3\nℹ fail 0` },
          "- `assert.equal(a, b)`: values are equal",
          "- `assert.deepEqual(a, b)`: objects and arrays have the same contents",
          "- `assert.ok(x)`: x is truthy",
          "- `assert.throws(fn)`: fn throws an error",
        ],
      },
      {
        type: 'explain',
        title: 'Testing an API',
        body: [
          "**Integration tests** start your real app on a random port and send real requests with `fetch`. To make this possible, export the app from `app.js` and only call `listen` in `server.js`:",
          { code: `const { test, before, after } = require("node:test");\nconst assert = require("node:assert/strict");\n\nprocess.env.DB_FILE = ":memory:";      // a fresh, throwaway database\nconst app = require("../app");\n\nlet server, base;\nbefore(async () => {\n  server = app.listen(0);              // 0 = any free port\n  await new Promise((r) => server.once("listening", r));\n  base = \`http://localhost:\${server.address().port}\`;\n});\nafter(() => server.close());\n\ntest("creating a note returns 201", async () => {\n  const res = await fetch(base + "/api/notes", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ title: "Test" }),\n  });\n  assert.equal(res.status, 201);\n  assert.equal((await res.json()).title, "Test");\n});`, lang: 'js' },
          "> Test the **unhappy paths** too: missing fields, wrong ids, no token, someone else's data. That's where the bugs hide.",
        ],
      },
      {
        type: 'local',
        title: 'Run and extend the test suites',
        body: [
          "1. Run the Module 12 tests:",
          { code: `cd projects/m12-notes-db/solution\nnpm install\nnpm test`, lang: 'bash' },
          "2. **Break something on purpose.** In `app.js`, change `res.status(201)` to `res.status(200)` and run `npm test` again. Read the failure message: it tells you exactly what was expected. Then undo it.",
          "3. **Add a test** to `test/notes.test.js`: \"searching for a word that doesn't exist returns an empty array\". Use the other tests as a template.",
          "4. Run the Final Capstone's API tests in `projects/c3-task-manager/solution/server` (`npm install`, then `npm test`). Read through `test/api.test.js` to see how it checks that users can't access each other's tasks.",
          "> For React, the usual tools are **Vitest** + **React Testing Library** (component tests) and **Playwright** (end-to-end tests in a real browser). They work the same way: arrange, act, assert.",
        ],
      },
      {
        type: 'explain',
        title: 'Shipping to production',
        body: [
          "Deploying a full-stack app usually looks like this:",
          "1. **Git + GitHub**: put your code in a repository. Most hosts deploy automatically on every push.",
          "2. **The front end**: `npm run build` creates static files in `dist/`. Host them on **Netlify**, **Vercel** or **Cloudflare Pages**. Set `VITE_API_URL` to your API's address, and add an SPA redirect rule.",
          "3. **The API**: host the Node app on **Render**, **Railway** or **Fly.io**. Set the start command (`npm start`) and the environment variables (`JWT_SECRET`, `CLIENT_ORIGIN`, `DB_FILE`…) in the dashboard.",
          "4. **The database**: SQLite is a file, so it needs a **persistent disk** (many hosts wipe the filesystem on every deploy). For bigger apps, use a managed database like **PostgreSQL** (Neon, Supabase, Render) or hosted SQLite (Turso).",
          "5. **CORS**: allow your real front-end origin, not localhost.",
          "6. **Check it**: sign up, log in, create data, reload, and look at the logs in your host's dashboard.",
          "> Free tiers change often, so check each host's current docs. The concepts (build command, start command, environment variables, persistent storage) are the same everywhere.",
        ],
      },
      {
        type: 'explain',
        title: 'Your launch checklist',
        body: [
          "Before sharing an app with the world:",
          "- ✅ All tests pass (`npm test`)",
          "- ✅ No secrets in the code or the git history, and `.env` is in `.gitignore`",
          "- ✅ Strong `JWT_SECRET` (long and random) set in production",
          "- ✅ Every route validates input and checks ownership",
          "- ✅ Passwords hashed, login rate-limited",
          "- ✅ Errors logged on the server, with generic messages for clients",
          "- ✅ CORS allows only your front end",
          "- ✅ HTTPS on both front end and API",
          "- ✅ The 2-minute keyboard test and a Lighthouse audit on the front end",
          "- ✅ The database is on persistent storage, with a backup plan",
          "Module 13 complete! 🎉 Everything is in place for the **Final Capstone**.",
        ],
      },
    ],
  });
})();
