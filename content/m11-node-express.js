/* Module 11 — Node.js & Express */
Course.addContent('m11', {

  /* ---------------------------------------------------------------- */
  'node-npm': [
    {
      type: 'explain',
      title: 'JavaScript outside the browser',
      body: [
        "Until now, all your JavaScript has run **in the browser**. **Node.js** is a program that runs JavaScript **anywhere else**: on your computer, or on a server in a data center.",
        "That one change opens up a lot:",
        "- **Back-end servers and APIs**: the code that answers requests, checks passwords and talks to databases",
        "- **Tools**: Vite, npm, linters and test runners are all Node programs",
        "- **Scripts**: rename 1,000 files, scrape data, automate chores",
        "Node uses the same JavaScript language you know, but the environment is different:",
        "- ❌ no `document`, `window` or DOM. There's no web page!",
        "- ✅ access to files (`node:fs`), the network (`node:http`), the operating system, and `process.env` for configuration",
        "> The browser and the server are two separate programs that talk over the internet. Full-stack developers write both sides, and now so will you.",
      ],
    },
    {
      type: 'local',
      title: 'Install Node and run a script',
      body: [
        "1. Download the **LTS** version from [nodejs.org](https://nodejs.org) and install it. This also installs **npm**.",
        "2. Open a terminal (in VS Code: **Terminal → New Terminal**) and check both work:",
        { code: `node -v\nnpm -v`, lang: 'bash' },
        "3. Create a folder called `node-practice`, open it in VS Code, and add a file `hello.js`:",
        { code: `const name = process.argv[2] || "world";\nconsole.log(\`Hello, \${name}! 👋\`);\nconsole.log("Node version:", process.version);\nconsole.log("Running on:", process.platform);`, lang: 'js', label: 'hello.js' },
        "4. Run it, then run it again with your name:",
        { code: `node hello.js\nnode hello.js Ada`, lang: 'bash' },
        "5. Type `node` on its own to open the **REPL**, an interactive console like the browser's. Try `2 + 2` or `[1, 2, 3].map(n => n * 2)`. Press **Ctrl+C** twice to leave.",
      ],
    },
    {
      type: 'explain',
      title: 'npm and package.json',
      body: [
        "**npm** (Node Package Manager) installs code other people have published. There are millions of packages. Every project describes itself in a `package.json` file:",
        { code: `npm init -y            # create package.json\nnpm install express    # add a dependency (downloads into node_modules/)\nnpm install --save-dev nodemon   # a tool only needed while developing\nnpm install            # install everything listed in package.json`, lang: 'bash' },
        { code: `{\n  "name": "my-api",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "node --watch server.js"\n  },\n  "dependencies": {\n    "express": "^5.3.0"\n  }\n}`, lang: 'js', label: 'package.json' },
        "- `scripts` are shortcuts: `npm run dev` runs `node --watch server.js`, which restarts the server whenever you save.",
        "- `^5.3.0` means \"5.3.0 or any newer 5.x version\" (**semantic versioning**: major.minor.patch).",
        "- `node_modules/` holds the downloaded code. It can be huge, so never commit it to git. Add it to `.gitignore`, because `npm install` can always recreate it.",
        "- `package-lock.json` records the exact versions installed. Do commit that one.",
      ],
    },
    {
      type: 'explain',
      title: 'Modules in Node: require and import',
      body: [
        "Node has two module systems. You'll see both in the wild:",
        { code: `// CommonJS (the classic Node style, the default in .js files)\nconst express = require("express");\nconst { readFile } = require("node:fs/promises");\nmodule.exports = { add };\n\n// ES modules (the same import/export as the browser and Vite)\n// enable with "type": "module" in package.json, or use .mjs files\nimport express from "express";\nimport { readFile } from "node:fs/promises";\nexport function add(a, b) { return a + b; }`, lang: 'js' },
        "This course uses **`require`** for back-end code. It's what most Express tutorials and docs show, and it works everywhere without configuration. Everything you learn transfers directly to `import`.",
        "Built-in modules are imported with a `node:` prefix: `node:fs` (files), `node:path` (file paths), `node:crypto` (hashing, random values), `node:sqlite` (databases, Module 12!).",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'first-server': [
    {
      type: 'explain',
      title: 'How HTTP works',
      body: [
        "Every time a browser (or your React app's `fetch`) talks to a server, it sends an **HTTP request** and gets an **HTTP response** back:",
        { code: `REQUEST                               RESPONSE\n─────────────────────────────         ─────────────────────────────\nPOST /api/notes HTTP/1.1              HTTP/1.1 201 Created\nHost: example.com                     Content-Type: application/json\nContent-Type: application/json\n                                      {"id": 7, "title": "Buy milk"}\n{"title": "Buy milk"}`, lang: 'text' },
        "A **request** has a **method** (what to do), a **path** (which thing), **headers** (extra info) and sometimes a **body** (data).",
        "A **response** has a **status code**, headers and a body. Status codes come in families:",
        "- **2xx success**: `200 OK`, `201 Created`, `204 No Content`",
        "- **3xx redirect**: `301 Moved Permanently`, `304 Not Modified`",
        "- **4xx client error** (the request was wrong): `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`",
        "- **5xx server error** (your code broke): `500 Internal Server Error`",
        "> Open your browser's DevTools, go to the **Network** tab, and reload any site to see hundreds of real requests and responses.",
      ],
    },
    {
      type: 'explain',
      title: 'Hello, Express',
      body: [
        "**Express** is the most popular Node.js web framework. Here is a complete server:",
        { code: `const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello from my server!");\n});\n\napp.listen(3000, () => {\n  console.log("Server running at http://localhost:3000");\n});`, lang: 'js', label: 'server.js' },
        "- `express()` creates an **app**.",
        "- `app.get(path, handler)` defines a **route**: when a GET request arrives for `/`, run this function.",
        "- The handler receives `req` (the request) and `res` (the response you build).",
        "- `res.send(...)` sends text; `res.json(...)` sends JSON.",
        "- `app.listen(3000)` starts the server on **port** 3000, like a door number on your computer.",
        "### The Express playground",
        "Exercises in this module run in an **Express playground** inside your browser. Its server works like the real thing, and the preview panel becomes an **API tester**: pick a method, type a path, press **Send** and see the response. On your computer, the same code runs with `node server.js`.",
      ],
    },
    {
      type: 'try',
      title: 'Your first server',
      mode: 'express',
      tryRequests: [{ method: 'GET', url: '/' }],
      body: ["This server has no routes yet, and it isn't even listening! Send a request in the API tester to see what happens."],
      goal: [
        "- Add a `GET /` route that responds with the text **Hello from my server!**",
        "- Start the server with `app.listen(3000, ...)` and log a message in the callback",
      ],
      hint: "Copy the shape from the previous step. Remember: no `app.listen`, no server!",
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\n// Add a GET / route here\n\n\n// Start the server here\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\n// Add a GET / route here\napp.get(\"/\", (req, res) => {\n  res.send(\"Hello from my server!\");\n});\n\n// Start the server here\napp.listen(3000, () => {\n  console.log(\"Server running at http://localhost:3000\");\n});\n" },
      check: async ({ request }) => {
        const res = await request('GET', '/');
        if (res.status === 0) return res.text;
        if (res.status !== 200) return `GET / returned ${res.status}. Add an \`app.get("/", ...)\` route.`;
        return res.text === 'Hello from my server!' || `GET / should respond "Hello from my server!" but responded "${res.text}".`;
      },
    },
    {
      type: 'explain',
      title: 'Route parameters and query strings',
      body: [
        "Routes can capture parts of the URL:",
        { code: `// Route parameters: /users/42  → req.params.id === "42"\napp.get("/users/:id", (req, res) => {\n  res.json({ id: req.params.id });\n});\n\n// Query strings: /search?q=pizza&page=2\n//   → req.query.q === "pizza", req.query.page === "2"\napp.get("/search", (req, res) => {\n  res.json({ searchingFor: req.query.q, page: Number(req.query.page) || 1 });\n});`, lang: 'js' },
        "- **Params** (`/users/:id`) identify a specific resource.",
        "- **Query strings** (`?sort=price`) are optional extras: filters, sorting, paging.",
        "- Both are always **strings**, so convert with `Number()` when you need a number.",
        "Use `res.json()` to send JavaScript objects. Express converts them to JSON text and sets the `Content-Type` header for you.",
      ],
    },
    {
      type: 'try',
      title: 'Params and queries',
      mode: 'express',
      tryRequests: [{ method: 'GET', url: '/greet/Ada' }, { method: 'GET', url: '/add?a=2&b=3' }],
      body: ["Two small endpoints. The tester has buttons ready to try them."],
      goal: [
        "- `GET /greet/:name` responds with JSON `{ \"message\": \"Hello, <name>!\" }`",
        "- `GET /add?a=2&b=3` responds with JSON `{ \"result\": 5 }` (a number, not a string!)",
      ],
      hint: [
        [{ code: "res.json({ message: `Hello, ${req.params.name}!` });", lang: 'js' }],
        ["`Number(req.query.a) + Number(req.query.b)`"],
      ],
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\n\n\napp.listen(3000, () => console.log(\"Listening on port 3000\"));\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/greet/:name\", (req, res) => {\n  res.json({ message: `Hello, ${req.params.name}!` });\n});\n\napp.get(\"/add\", (req, res) => {\n  const result = Number(req.query.a) + Number(req.query.b);\n  res.json({ result });\n});\n\napp.listen(3000, () => console.log(\"Listening on port 3000\"));\n" },
      check: async ({ request }) => {
        const g = await request('GET', '/greet/Grace');
        if (g.status === 0) return g.text;
        if (g.status !== 200 || !g.body || g.body.message !== 'Hello, Grace!') return `GET /greet/Grace should return { "message": "Hello, Grace!" }. Got: ${g.text}`;
        const a = await request('GET', '/add?a=10&b=32');
        if (a.status !== 200 || !a.body || a.body.result === undefined) return `GET /add?a=10&b=32 should return { "result": 42 }. Got: ${a.text}`;
        if (a.body.result === '1032') return 'You got "1032". The query values are strings! Convert them with `Number()`.';
        return a.body.result === 42 || `GET /add?a=10&b=32 should return 42, not ${JSON.stringify(a.body.result)}.`;
      },
    },
    {
      type: 'explain',
      title: 'Status codes and JSON APIs',
      body: [
        "A good API tells the client clearly what happened, using the right **status code** with a helpful JSON body:",
        { code: `const users = [{ id: 1, name: "Ana" }, { id: 2, name: "Ben" }];\n\napp.get("/users/:id", (req, res) => {\n  const user = users.find((u) => u.id === Number(req.params.id));\n\n  if (!user) {\n    return res.status(404).json({ error: "User not found" });\n  }\n\n  res.json(user);   // status defaults to 200\n});`, lang: 'js' },
        "- `res.status(404)` sets the code, and you chain `.json(...)` after it.",
        "- Notice the **`return`**. It stops the function, so you never try to send two responses. Sending twice crashes with *Cannot set headers after they are sent*.",
        "- Make every error response JSON in the same shape (like `{ \"error\": \"...\" }`), so front ends can show it easily.",
      ],
    },
    {
      type: 'try',
      title: 'Find a user or 404',
      mode: 'express',
      tryRequests: [{ method: 'GET', url: '/users' }, { method: 'GET', url: '/users/2' }, { method: 'GET', url: '/users/99' }],
      body: ["The users array is your data for now. Module 12 swaps it for a real database."],
      goal: [
        "- `GET /users` responds with the whole array",
        "- `GET /users/:id` responds with the matching user, or status **404** and `{ \"error\": \"User not found\" }`",
      ],
      hint: "Compare with `Number(req.params.id)`, because the id in the URL is a string.",
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\nconst users = [\n  { id: 1, name: \"Ana\", role: \"admin\" },\n  { id: 2, name: \"Ben\", role: \"member\" },\n  { id: 3, name: \"Cleo\", role: \"member\" },\n];\n\n\n\napp.listen(3000);\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\nconst users = [\n  { id: 1, name: \"Ana\", role: \"admin\" },\n  { id: 2, name: \"Ben\", role: \"member\" },\n  { id: 3, name: \"Cleo\", role: \"member\" },\n];\n\napp.get(\"/users\", (req, res) => {\n  res.json(users);\n});\n\napp.get(\"/users/:id\", (req, res) => {\n  const user = users.find((u) => u.id === Number(req.params.id));\n  if (!user) {\n    return res.status(404).json({ error: \"User not found\" });\n  }\n  res.json(user);\n});\n\napp.listen(3000);\n" },
      check: async ({ request }) => {
        const all = await request('GET', '/users');
        if (all.status === 0) return all.text;
        if (!Array.isArray(all.body) || all.body.length !== 3) return 'GET /users should return the array of 3 users.';
        const one = await request('GET', '/users/2');
        if (one.status !== 200 || !one.body || one.body.name !== 'Ben') return `GET /users/2 should return Ben. Got ${one.status}: ${one.text}`;
        const none = await request('GET', '/users/99');
        if (none.status !== 404) return `GET /users/99 should return status 404, not ${none.status}.`;
        return (none.body && none.body.error === 'User not found') || 'The 404 response should be JSON: { "error": "User not found" }.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'middleware-rest': [
    {
      type: 'explain',
      title: 'Middleware',
      body: [
        "**Middleware** is a function that runs *between* the request arriving and your route handler. Each one can look at the request, change it, respond, or pass it on by calling `next()`:",
        { code: `request → [ logger ] → [ express.json() ] → [ auth check ] → route handler → response`, lang: 'text' },
        { code: `// Runs for every request, because app.use() matches all paths\napp.use((req, res, next) => {\n  console.log(\`\${req.method} \${req.path}\`);\n  next();   // ← pass control to the next middleware/route. Forget this and the request hangs!\n});\n\n// Built-in middleware: parse JSON bodies into req.body\napp.use(express.json());`, lang: 'js' },
        "- Middleware runs **in the order you add it**, so add `app.use(...)` lines before your routes.",
        "- It must either **send a response** or **call `next()`**.",
        "- Without `express.json()`, `req.body` is `undefined` for JSON requests. That's a very common beginner bug!",
      ],
    },
    {
      type: 'try',
      title: 'A request logger',
      mode: 'express',
      tryRequests: [{ method: 'GET', url: '/hello' }, { method: 'GET', url: '/bye' }],
      body: ["Watch the **Console** panel as you send requests."],
      goal: "Add middleware that logs `<METHOD> <path>` (like `GET /hello`) for every request, then calls `next()`. It must come **before** the routes.",
      hint: [{ code: "app.use((req, res, next) => {\n  console.log(`${req.method} ${req.path}`);\n  next();\n});", lang: 'js' }],
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\n// Your logger middleware here\n\n\napp.get(\"/hello\", (req, res) => res.send(\"Hi!\"));\napp.get(\"/bye\", (req, res) => res.send(\"Goodbye!\"));\n\napp.listen(3000);\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\n// Your logger middleware here\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.path}`);\n  next();\n});\n\napp.get(\"/hello\", (req, res) => res.send(\"Hi!\"));\napp.get(\"/bye\", (req, res) => res.send(\"Goodbye!\"));\n\napp.listen(3000);\n" },
      check: async ({ request, win }) => {
        const r = await request('GET', '/hello');
        if (r.status === 0) return r.text.includes('3 seconds') ? 'The request never got a response. Does your middleware call `next()`?' : r.text;
        if (r.text !== 'Hi!') return 'GET /hello should still respond "Hi!".';
        await request('DELETE', '/bye');
        const logs = win.__logs;
        if (!logs.includes('GET /hello')) return 'Your middleware should log "GET /hello" when that request arrives.';
        return logs.includes('DELETE /bye') || 'Log every request, even ones without a matching route, like "DELETE /bye".';
      },
    },
    {
      type: 'explain',
      title: 'REST: designing an API',
      body: [
        "**REST** is a set of conventions for APIs. You model your data as **resources** (nouns, like `/notes`), and use the HTTP **method** for the action:",
        { code: `Method   Path            Action                 Success status\n──────   ─────────────   ────────────────────   ──────────────\nGET      /notes          list all notes         200 OK\nGET      /notes/:id      get one note           200 OK (or 404)\nPOST     /notes          create a note          201 Created\nPUT      /notes/:id      replace a note         200 OK (or 404)\nPATCH    /notes/:id      update some fields     200 OK (or 404)\nDELETE   /notes/:id      delete a note          204 No Content (or 404)`, lang: 'text' },
        "These five operations are known as **CRUD**: Create, Read, Update, Delete. Almost every app is CRUD at its core.",
        "- Use plural nouns (`/notes`), never verbs (`/getNotes`, `/deleteNote`).",
        "- `POST` sends the new data as a JSON **body**. Read it from `req.body` (after `express.json()`).",
        "- **Validate** incoming data, and respond `400 Bad Request` when it's wrong.",
      ],
    },
    {
      type: 'try',
      title: 'Create and read todos',
      mode: 'express',
      tryRequests: [{ method: 'GET', url: '/todos' }, { method: 'POST', url: '/todos', body: { title: 'Learn REST' } }, { method: 'POST', url: '/todos', body: { title: '' } }],
      body: ["The first half of a CRUD API."],
      goal: [
        "- Parse JSON bodies with `express.json()`",
        "- `GET /todos` returns all todos",
        "- `POST /todos` with `{ \"title\": \"...\" }` creates `{ id, title, done: false }` and responds **201** with it",
        "- If the title is missing or empty, respond **400** with `{ \"error\": \"Title is required\" }`",
      ],
      hint: [
        ["Check with `if (!req.body || !req.body.title || !req.body.title.trim())`."],
        ["Give each todo `id: nextId++`, starting from `let nextId = 3;`."],
      ],
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\nlet todos = [\n  { id: 1, title: \"Learn Express\", done: true },\n  { id: 2, title: \"Build an API\", done: false },\n];\nlet nextId = 3;\n\n\n\napp.listen(3000);\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nlet todos = [\n  { id: 1, title: \"Learn Express\", done: true },\n  { id: 2, title: \"Build an API\", done: false },\n];\nlet nextId = 3;\n\napp.get(\"/todos\", (req, res) => {\n  res.json(todos);\n});\n\napp.post(\"/todos\", (req, res) => {\n  if (!req.body || !req.body.title || !req.body.title.trim()) {\n    return res.status(400).json({ error: \"Title is required\" });\n  }\n  const todo = { id: nextId++, title: req.body.title.trim(), done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});\n\napp.listen(3000);\n" },
      check: async ({ request }) => {
        const list = await request('GET', '/todos');
        if (list.status === 0) return list.text;
        if (!Array.isArray(list.body)) return 'GET /todos should return the todos array.';
        const created = await request('POST', '/todos', { title: 'Write tests' });
        if (created.status === 500) return 'POST /todos crashed (500). Did you add `app.use(express.json())` so `req.body` exists?';
        if (created.status !== 201) return `POST /todos should respond 201, not ${created.status}.`;
        if (!created.body || created.body.title !== 'Write tests' || created.body.done !== false || typeof created.body.id !== 'number') return 'The new todo should look like { id, title, done: false }.';
        const after = await request('GET', '/todos');
        if (!after.body.some((t) => t.id === created.body.id)) return 'The new todo should appear in GET /todos afterwards.';
        const bad = await request('POST', '/todos', { title: '   ' });
        if (bad.status !== 400) return `An empty title should get a 400 response, not ${bad.status}.`;
        const missing = await request('POST', '/todos', {});
        if (missing.status !== 400) return 'A body with no title at all should also get a 400.';
        return (bad.body && bad.body.error === 'Title is required') || 'The 400 response should be { "error": "Title is required" }.';
      },
    },
    {
      type: 'try',
      title: 'Update and delete todos',
      mode: 'express',
      tryRequests: [{ method: 'PATCH', url: '/todos/2', body: { done: true } }, { method: 'DELETE', url: '/todos/1' }, { method: 'GET', url: '/todos' }],
      body: ["The second half of CRUD."],
      goal: [
        "- `PATCH /todos/:id` updates `title` and/or `done` (only the fields that were sent) and responds with the updated todo",
        "- `DELETE /todos/:id` removes the todo and responds **204** with no body",
        "- Both respond **404** `{ \"error\": \"Todo not found\" }` for an unknown id",
      ],
      hint: [
        ["`if (req.body.done !== undefined) todo.done = req.body.done;`, and the same for title."],
        ["Delete with `todos = todos.filter((t) => t.id !== todo.id);` then `res.status(204).end();`"],
      ],
      starter: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nlet todos = [\n  { id: 1, title: \"Learn Express\", done: true },\n  { id: 2, title: \"Build an API\", done: false },\n];\n\napp.get(\"/todos\", (req, res) => res.json(todos));\n\n// PATCH /todos/:id\n\n\n// DELETE /todos/:id\n\n\napp.listen(3000);\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nlet todos = [\n  { id: 1, title: \"Learn Express\", done: true },\n  { id: 2, title: \"Build an API\", done: false },\n];\n\napp.get(\"/todos\", (req, res) => res.json(todos));\n\n// PATCH /todos/:id\napp.patch(\"/todos/:id\", (req, res) => {\n  const todo = todos.find((t) => t.id === Number(req.params.id));\n  if (!todo) return res.status(404).json({ error: \"Todo not found\" });\n\n  if (req.body.title !== undefined) todo.title = req.body.title;\n  if (req.body.done !== undefined) todo.done = req.body.done;\n  res.json(todo);\n});\n\n// DELETE /todos/:id\napp.delete(\"/todos/:id\", (req, res) => {\n  const todo = todos.find((t) => t.id === Number(req.params.id));\n  if (!todo) return res.status(404).json({ error: \"Todo not found\" });\n\n  todos = todos.filter((t) => t.id !== todo.id);\n  res.status(204).end();\n});\n\napp.listen(3000);\n" },
      check: async ({ request }) => {
        const p = await request('PATCH', '/todos/2', { done: true });
        if (p.status === 0) return p.text;
        if (p.status !== 200 || !p.body || p.body.done !== true) return `PATCH /todos/2 with { "done": true } should return the updated todo. Got ${p.status}: ${p.text}`;
        if (p.body.title !== 'Build an API') return 'PATCH should only change the fields that were sent. The title got lost!';
        const p2 = await request('PATCH', '/todos/2', { title: 'Ship the API' });
        if (!p2.body || p2.body.title !== 'Ship the API' || p2.body.done !== true) return 'PATCH with only a title should keep `done` unchanged.';
        const d = await request('DELETE', '/todos/1');
        if (d.status !== 204) return `DELETE /todos/1 should respond 204, not ${d.status}.`;
        const list = await request('GET', '/todos');
        if (list.body.some((t) => t.id === 1)) return 'After DELETE, the todo should be gone from GET /todos.';
        const p404 = await request('PATCH', '/todos/99', { done: true });
        const d404 = await request('DELETE', '/todos/99');
        if (p404.status !== 404 || d404.status !== 404) return 'Unknown ids should get a 404 for both PATCH and DELETE.';
        return (d404.body && d404.body.error === 'Todo not found') || 'The 404 body should be { "error": "Todo not found" }.';
      },
    },
    {
      type: 'explain',
      title: 'Organising routes with Router',
      body: [
        "As an API grows, one file with 30 routes gets messy. `express.Router()` groups related routes into their own file, like mini-apps:",
        { code: `// routes/todos.js\nconst express = require("express");\nconst router = express.Router();\n\nrouter.get("/", (req, res) => { ... });      // GET  /api/todos\nrouter.post("/", (req, res) => { ... });     // POST /api/todos\nrouter.get("/:id", (req, res) => { ... });   // GET  /api/todos/:id\n\nmodule.exports = router;`, lang: 'js', label: 'routes/todos.js' },
        { code: `// server.js\nconst todosRouter = require("./routes/todos");\napp.use("/api/todos", todosRouter);   // mount it at a prefix`, lang: 'js', label: 'server.js' },
        "Inside the router, paths are relative to where it's mounted. A typical project layout:",
        { code: `my-api/\n├── server.js          ← creates the app, adds middleware, mounts routers, listens\n├── routes/\n│   ├── todos.js\n│   └── users.js\n├── package.json\n└── .env               ← secrets (never committed)`, lang: 'text' },
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'errors-env': [
    {
      type: 'explain',
      title: 'Handling errors',
      body: [
        "Things go wrong: bad input, a database that's down, a bug. A good server **never crashes** and **never leaks internals**. It catches errors and responds with a clean message.",
        "Express has a special kind of middleware for errors. It takes **four** parameters, and Express recognises it by that:",
        { code: `app.get("/crash", (req, res) => {\n  throw new Error("Database exploded");   // or next(err)\n});\n\n// After all routes: catch-all for unknown URLs\napp.use((req, res) => {\n  res.status(404).json({ error: "Not found" });\n});\n\n// The error handler: (err, req, res, next). Must be LAST.\napp.use((err, req, res, next) => {\n  console.error(err);                       // full details in YOUR logs\n  res.status(500).json({ error: "Something went wrong" });  // vague for users\n});`, lang: 'js' },
        "- Errors thrown in a route jump straight to the error handler.",
        "- In **Express 5**, this also works for `async` handlers: a rejected promise is caught automatically. (Express 4 needed extra `try/catch` code.)",
        "- You can also call `next(err)` to hand an error over manually.",
        "> Never send `err.stack` or database errors to the client. They can reveal how your system works to attackers.",
      ],
    },
    {
      type: 'try',
      title: 'Add error handling',
      mode: 'express',
      tryRequests: [{ method: 'GET', url: '/ok' }, { method: 'GET', url: '/crash' }, { method: 'GET', url: '/async-crash' }, { method: 'GET', url: '/nowhere' }],
      body: ["Right now, unknown URLs and crashes return Express's plain-text defaults. Make them clean JSON."],
      goal: [
        "- Add a 404 handler after the routes: status **404**, `{ \"error\": \"Not found\" }`",
        "- Add an error handler (4 parameters!) that logs the error with `console.error` and responds **500** `{ \"error\": \"Something went wrong\" }`",
      ],
      hint: "Order matters: routes, then the 404 handler, then the error handler.",
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/ok\", (req, res) => res.json({ status: \"all good\" }));\n\napp.get(\"/crash\", (req, res) => {\n  throw new Error(\"Something broke in /crash\");\n});\n\napp.get(\"/async-crash\", async (req, res) => {\n  await Promise.resolve();\n  throw new Error(\"Something broke asynchronously\");\n});\n\n// 404 handler here\n\n\n// error handler here\n\n\napp.listen(3000);\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/ok\", (req, res) => res.json({ status: \"all good\" }));\n\napp.get(\"/crash\", (req, res) => {\n  throw new Error(\"Something broke in /crash\");\n});\n\napp.get(\"/async-crash\", async (req, res) => {\n  await Promise.resolve();\n  throw new Error(\"Something broke asynchronously\");\n});\n\n// 404 handler here\napp.use((req, res) => {\n  res.status(404).json({ error: \"Not found\" });\n});\n\n// error handler here\napp.use((err, req, res, next) => {\n  console.error(err.message);\n  res.status(500).json({ error: \"Something went wrong\" });\n});\n\napp.listen(3000);\n" },
      check: async ({ request, win }) => {
        const ok = await request('GET', '/ok');
        if (ok.status === 0) return ok.text;
        if (ok.status !== 200) return 'GET /ok should still work.';
        const nf = await request('GET', '/nowhere');
        if (nf.status !== 404 || !nf.body || nf.body.error !== 'Not found') return `GET /nowhere should return 404 { "error": "Not found" }. Got ${nf.status}: ${nf.text}`;
        const before = win.__logs.length;
        const c = await request('GET', '/crash');
        if (c.status !== 500 || !c.body || c.body.error !== 'Something went wrong') return `GET /crash should return 500 { "error": "Something went wrong" }. Got ${c.status}: ${c.text}`;
        if (c.text.includes('broke')) return 'Don\'t send the real error message to the client.';
        if (win.__logs.length === before) return 'Log the error on the server with `console.error`.';
        const ac = await request('GET', '/async-crash');
        return (ac.status === 500 && ac.body && ac.body.error === 'Something went wrong') || 'Async errors should reach your error handler too.';
      },
    },
    {
      type: 'explain',
      title: 'Configuration with environment variables',
      body: [
        "Some settings change between your laptop and the live server: the port, database location, API keys, secrets. Never hard-code them. Read them from **environment variables** via `process.env`:",
        { code: `const PORT = process.env.PORT || 3000;          // fallback for development\nconst secret = process.env.JWT_SECRET;\n\nif (!secret) {\n  console.error("Missing JWT_SECRET");\n  process.exit(1);   // refuse to start without it\n}`, lang: 'js' },
        "During development, keep them in a **`.env`** file, and load it with Node's built-in flag:",
        { code: `PORT=3000\nJWT_SECRET=a-long-random-string\nDB_FILE=notes.db`, lang: 'bash', label: '.env' },
        { code: `node --env-file=.env server.js`, lang: 'bash' },
        "- **Never commit `.env` to git.** Add it to `.gitignore`, and commit a `.env.example` with placeholder values instead.",
        "- Hosting platforms (Render, Railway, etc.) have a settings page where you enter the real values.",
        "> Older projects use the `dotenv` package (`require(\"dotenv\").config()`), which does the same job.",
      ],
    },
    {
      type: 'try',
      title: 'Use environment variables',
      mode: 'express',
      env: { GREETING: 'Howdy', PORT: '4000' },
      tryRequests: [{ method: 'GET', url: '/' }],
      body: ["In this playground, the environment has `GREETING=Howdy` and `PORT=4000` set for you."],
      goal: [
        "- Respond to `GET /` with JSON `{ \"message\": \"<GREETING> from port <PORT>!\" }` using `process.env`",
        "- Listen on `process.env.PORT`, falling back to `3000` when it's not set",
      ],
      hint: [{ code: "const PORT = process.env.PORT || 3000;\n\napp.get(\"/\", (req, res) => {\n  res.json({ message: `${process.env.GREETING} from port ${PORT}!` });\n});", lang: 'js' }],
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\n\n\napp.listen(3000, () => console.log(\"Listening on port 3000\"));\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\nconst PORT = process.env.PORT || 3000;\n\napp.get(\"/\", (req, res) => {\n  res.json({ message: `${process.env.GREETING} from port ${PORT}!` });\n});\n\napp.listen(PORT, () => console.log(`Listening on port ${PORT}`));\n" },
      check: async ({ request, code, win }) => {
        const r = await request('GET', '/');
        if (r.status === 0) return r.text;
        if (!/process\.env\.PORT/.test(code.js)) return 'Read the port from `process.env.PORT`.';
        if (!r.body || r.body.message !== 'Howdy from port 4000!') return `GET / should return { "message": "Howdy from port 4000!" }. Got: ${r.text}`;
        return String(win.__app.__port) === '4000' || 'Pass the port from `process.env.PORT` to `app.listen`.';
      },
    },
    {
      type: 'explain',
      title: 'A smooth development workflow',
      body: [
        "A few habits make back-end work much nicer:",
        "- **Auto-restart**: `node --watch server.js` restarts on every save. Put it in `package.json` as `\"dev\"` and run `npm run dev`.",
        "- **Test requests quickly**: the VS Code **REST Client** extension sends requests straight from a `.http` file in your project:",
        { code: `### Create a note\nPOST http://localhost:3000/api/notes\nContent-Type: application/json\n\n{ "title": "Hello" }`, lang: 'text', label: 'requests.http' },
        "- **Read the terminal**: every `console.log` and error from your server appears there, not in the browser.",
        "- **One thing at a time**: add a route, test it, then move on.",
        "> On Windows PowerShell, `curl` is an alias for something else. Use `curl.exe` to get the real curl.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-notes-api': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "A complete **Notes REST API**: the kind of back end a notes app like Google Keep needs. You'll build it twice: first here in the playground, then for real on your computer.",
        { code: `GET    /api/notes            list notes (?search=word filters them)\nGET    /api/notes/:id        one note           (404 if missing)\nPOST   /api/notes            create             (201, or 400 if invalid)\nPUT    /api/notes/:id        replace            (200, 400 or 404)\nDELETE /api/notes/:id        delete             (204 or 404)`, lang: 'text' },
        "A note looks like `{ id, title, body, createdAt }`. The title is required and can be at most 100 characters.",
      ],
    },
    {
      type: 'project',
      title: 'Notes API',
      mode: 'express',
      tryRequests: [
        { method: 'GET', url: '/api/notes' },
        { method: 'GET', url: '/api/notes?search=express' },
        { method: 'POST', url: '/api/notes', body: { title: 'Buy coffee', body: 'Beans, not instant' } },
        { method: 'PUT', url: '/api/notes/1', body: { title: 'Learn Express ✓', body: 'Done!' } },
        { method: 'DELETE', url: '/api/notes/2' },
      ],
      body: ["Use the preset buttons in the API tester to try each endpoint as you build it."],
      tasks: [
        "Add `express.json()` and a logging middleware",
        "Write `validateNote(data)` returning an array of error messages (title required, max 100 characters; body must be a string if given)",
        "`GET /api/notes`, with an optional case-insensitive `?search=` over title and body",
        "`GET /api/notes/:id` → the note, or 404 `{ error: \"Note not found\" }`",
        "`POST /api/notes` → 201 with the new note (with `id` and `createdAt`), or 400 `{ errors: [...] }`",
        "`PUT /api/notes/:id` → 200 with the updated note (404 / 400 as needed)",
        "`DELETE /api/notes/:id` → 204, or 404",
        "A JSON 404 handler for unknown routes and a JSON error handler",
      ],
      hint: [
        ["Search: `notes.filter((n) => (n.title + \" \" + n.body).toLowerCase().includes(search.toLowerCase()))`"],
        ["`createdAt: new Date().toISOString()` gives a standard timestamp string."],
      ],
      starter: { js: "const express = require(\"express\");\nconst app = express();\n\nlet notes = [\n  { id: 1, title: \"Learn Express\", body: \"Routes, middleware and JSON.\", createdAt: \"2026-01-01T10:00:00.000Z\" },\n  { id: 2, title: \"Build an API\", body: \"A notes app with full CRUD.\", createdAt: \"2026-01-02T10:00:00.000Z\" },\n];\nlet nextId = 3;\n\n// Middleware\n\n\n// validateNote(data)\n\n\n// Routes\n\n\n// 404 + error handlers\n\n\napp.listen(3000, () => console.log(\"Notes API running on port 3000\"));\n" },
      solution: { js: "const express = require(\"express\");\nconst app = express();\n\nlet notes = [\n  { id: 1, title: \"Learn Express\", body: \"Routes, middleware and JSON.\", createdAt: \"2026-01-01T10:00:00.000Z\" },\n  { id: 2, title: \"Build an API\", body: \"A notes app with full CRUD.\", createdAt: \"2026-01-02T10:00:00.000Z\" },\n];\nlet nextId = 3;\n\n// Middleware\napp.use(express.json());\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.originalUrl}`);\n  next();\n});\n\n// validateNote(data)\nfunction validateNote(data) {\n  const errors = [];\n  if (!data || typeof data.title !== \"string\" || !data.title.trim()) {\n    errors.push(\"title is required\");\n  } else if (data.title.trim().length > 100) {\n    errors.push(\"title must be 100 characters or fewer\");\n  }\n  if (data && data.body !== undefined && typeof data.body !== \"string\") {\n    errors.push(\"body must be a string\");\n  }\n  return errors;\n}\n\nconst findNote = (id) => notes.find((n) => n.id === Number(id));\n\n// Routes\napp.get(\"/api/notes\", (req, res) => {\n  const search = (req.query.search || \"\").toLowerCase();\n  res.json(search ? notes.filter((n) => (n.title + \" \" + n.body).toLowerCase().includes(search)) : notes);\n});\n\napp.get(\"/api/notes/:id\", (req, res) => {\n  const note = findNote(req.params.id);\n  if (!note) return res.status(404).json({ error: \"Note not found\" });\n  res.json(note);\n});\n\napp.post(\"/api/notes\", (req, res) => {\n  const errors = validateNote(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  const note = { id: nextId++, title: req.body.title.trim(), body: req.body.body || \"\", createdAt: new Date().toISOString() };\n  notes.push(note);\n  res.status(201).json(note);\n});\n\napp.put(\"/api/notes/:id\", (req, res) => {\n  const note = findNote(req.params.id);\n  if (!note) return res.status(404).json({ error: \"Note not found\" });\n  const errors = validateNote(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  note.title = req.body.title.trim();\n  note.body = req.body.body || \"\";\n  res.json(note);\n});\n\napp.delete(\"/api/notes/:id\", (req, res) => {\n  const note = findNote(req.params.id);\n  if (!note) return res.status(404).json({ error: \"Note not found\" });\n  notes = notes.filter((n) => n !== note);\n  res.status(204).end();\n});\n\n// 404 + error handlers\napp.use((req, res) => {\n  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });\n});\n\napp.use((err, req, res, next) => {\n  const status = err.status || 500;\n  if (status === 500) console.error(err);\n  res.status(status).json({ error: status === 500 ? \"Something went wrong\" : err.message });\n});\n\napp.listen(3000, () => console.log(\"Notes API running on port 3000\"));\n" },
      check: async ({ request }) => {
        const list = await request('GET', '/api/notes');
        if (list.status === 0) return list.text;
        if (!Array.isArray(list.body) || list.body.length !== 2) return 'GET /api/notes should return the 2 starting notes.';
        const s = await request('GET', '/api/notes?search=CRUD');
        if (!Array.isArray(s.body) || s.body.length !== 1 || s.body[0].id !== 2) return 'GET /api/notes?search=CRUD should return only note 2 (search the body too, ignoring case).';
        const one = await request('GET', '/api/notes/1');
        if (one.status !== 200 || one.body.title !== 'Learn Express') return 'GET /api/notes/1 should return note 1.';
        const missing = await request('GET', '/api/notes/42');
        if (missing.status !== 404 || !missing.body || missing.body.error !== 'Note not found') return 'GET /api/notes/42 should be 404 { "error": "Note not found" }.';
        const created = await request('POST', '/api/notes', { title: '  Trim me  ', body: 'ok' });
        if (created.status !== 201) return `POST should respond 201, not ${created.status}.`;
        if (created.body.title !== 'Trim me' || !created.body.createdAt || typeof created.body.id !== 'number') return 'The created note should have a trimmed title, an id and a createdAt.';
        const bad = await request('POST', '/api/notes', { body: 5 });
        if (bad.status !== 400 || !bad.body || !Array.isArray(bad.body.errors) || bad.body.errors.length < 2) return 'POST { "body": 5 } should be 400 with errors for both the missing title and the invalid body.';
        const long = await request('POST', '/api/notes', { title: 'x'.repeat(101) });
        if (long.status !== 400) return 'A 101-character title should be rejected with 400.';
        const put = await request('PUT', '/api/notes/1', { title: 'Renamed', body: 'New body' });
        if (put.status !== 200 || put.body.title !== 'Renamed' || put.body.body !== 'New body') return 'PUT /api/notes/1 should update and return the note.';
        if ((await request('PUT', '/api/notes/42', { title: 'x' })).status !== 404) return 'PUT on an unknown id should be 404.';
        const del = await request('DELETE', '/api/notes/2');
        if (del.status !== 204) return `DELETE should respond 204, not ${del.status}.`;
        if ((await request('GET', '/api/notes/2')).status !== 404) return 'A deleted note should be gone.';
        const unknown = await request('GET', '/nope');
        return (unknown.status === 404 && unknown.body && typeof unknown.body.error === 'string') || 'Unknown routes should get a JSON 404 like { "error": "..." }.';
      },
      success: "Your Notes API passes every check! 🎉 Now build it for real on your computer (next step).",
    },
    {
      type: 'local',
      title: 'Run it for real',
      body: [
        "Your course folder has a matching project: `projects/m11-notes-api`.",
        { code: `cd projects/m11-notes-api/starter\nnpm install\nnpm run dev`, lang: 'bash' },
        "1. Open `starter/server.js` and fill in the TODOs. You can copy your playground code across, because it's the same Express!",
        "2. Visit http://localhost:3000/api/notes in your browser.",
        "3. Install the VS Code **REST Client** extension, open `requests.http`, and click **Send Request** above each request to test POST, PUT and DELETE.",
        "4. Stop the server (Ctrl+C) and start it again. Your new notes are gone, because they only lived in memory. Module 12 fixes that with a database.",
        "Compare with `solution/server.js` if you get stuck.",
      ],
    },
    {
      type: 'explain',
      title: 'Module 11 complete',
      body: [
        "You can now build back ends:",
        "- **Node.js** and **npm**: running JavaScript on a server and using packages",
        "- **HTTP**: methods, paths, headers, bodies and status codes",
        "- **Express**: routes, params, queries and JSON responses",
        "- **Middleware**: logging, `express.json()`, and the order things run in",
        "- **REST** and **CRUD** API design, with validation",
        "- **Error handling** and **environment variables**",
        "Next up is **Module 12: Databases**, so your data finally survives a restart.",
      ],
    },
  ],
});
