# Module 11 project: Notes REST API

Build a REST API for notes with Node.js and Express. Data is kept in memory (an array), so it resets whenever the server restarts. You'll fix that with a real database in Module 12.

## Get started

```bash
cd starter
npm install
npm run dev
```

`npm run dev` uses `node --watch`, which restarts the server every time you save a file. Open http://localhost:3000 in your browser to check it's running.

## What to build

| Method | URL | Does | Success | Errors |
|---|---|---|---|---|
| GET | `/api/notes` | List notes (`?search=word` filters by title/body) | 200 | |
| GET | `/api/notes/:id` | Get one note | 200 | 404 |
| POST | `/api/notes` | Create a note `{ title, body }` | 201 + the note | 400 |
| PUT | `/api/notes/:id` | Replace a note's title and body | 200 + the note | 400, 404 |
| DELETE | `/api/notes/:id` | Delete a note | 204 (no body) | 404 |

Checklist:

- [ ] `express.json()` middleware so `req.body` works
- [ ] A logging middleware that prints `METHOD /path` for every request
- [ ] `validateNote()`: title required, max 100 characters; body must be a string if given
- [ ] All five routes above with the right status codes
- [ ] Errors are JSON: `{ "error": "Note not found" }` or `{ "errors": ["title is required"] }`
- [ ] A 404 handler for unknown routes, and an error-handling middleware

## Testing your API

Browsers can only easily send GET requests. For POST, PUT and DELETE, use one of these:

- **VS Code REST Client** (recommended): install the "REST Client" extension, open `requests.http`, and click **Send Request** above any request.
- **curl** in a terminal. On Windows PowerShell, type `curl.exe`, because plain `curl` is an alias for something else:

```bash
curl.exe http://localhost:3000/api/notes
curl.exe -X POST http://localhost:3000/api/notes -H "Content-Type: application/json" -d "{\"title\":\"Hello\"}"
```

- **Thunder Client** or **Postman**: graphical API testers.

Stuck? Compare with `solution/server.js`.
