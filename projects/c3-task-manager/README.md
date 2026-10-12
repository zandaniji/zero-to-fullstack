# Final Capstone: TaskFlow, a full-stack task manager

A complete web app with a **React** front end, an **Express** API, a **SQLite** database and **user accounts**. Everything from the whole course comes together here.

```
┌──────────────────────┐   fetch /api/...    ┌───────────────────────┐    SQL     ┌──────────────┐
│ React client (Vite)  │ ──────────────────▶ │ Express API (Node.js) │ ─────────▶ │ SQLite file  │
│ localhost:5173       │ ◀────────────────── │ localhost:3000        │ ◀───────── │ tasks.db     │
└──────────────────────┘   JSON + JWT        └───────────────────────┘            └──────────────┘
```

## The API you'll build

| Method | Path | Auth? | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | | `{ email, password }` | 201 `{ token, user }` · 400 · 409 |
| POST | `/api/auth/login` | | `{ email, password }` | 200 `{ token, user }` · 401 |
| GET | `/api/auth/me` | ✅ | | 200 `{ user }` · 401 |
| GET | `/api/tasks?status=all\|active\|done` | ✅ | | 200 `[task]` |
| POST | `/api/tasks` | ✅ | `{ title, dueDate? }` | 201 `task` · 400 |
| PATCH | `/api/tasks/:id` | ✅ | `{ title?, done?, dueDate? }` | 200 `task` · 400 · 404 |
| DELETE | `/api/tasks/:id` | ✅ | | 204 · 404 |

"Auth ✅" means the request needs the header `Authorization: Bearer <token>`.

A task looks like `{ "id": 1, "title": "Ship it", "done": false, "dueDate": "2026-12-31", "createdAt": "..." }`.

## Folders

```
starter/   ← start here: structure, database, tests and TODOs
solution/  ← the finished app, for when you're stuck (try first!)
  server/    Express API   (npm test runs the API tests)
  client/    React app     (Vite)
```

## Part A: the server

```bash
cd starter/server
npm install
cp .env.example .env       # on Windows PowerShell: copy .env.example .env
```

Open `.env` and set `JWT_SECRET` to a long random string. You can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

The tests in `test/api.test.js` describe exactly what the API must do. Run `npm test` after each step and watch more of them turn green ✅.

1. **`src/passwords.js`**: `hashPassword` and `verifyPassword` with `crypto.scryptSync` and a random salt.
2. **`src/auth.js`**: `signToken` (JWT) and the `requireAuth` middleware.
3. **`src/routes/auth.js`**: register, login and `/me`.
4. **`src/routes/tasks.js`**: the four task routes. Every query must filter by `user_id`!
5. Run `npm run dev` and try the API with the VS Code REST Client or curl.

`src/db.js`, `src/app.js` and `src/server.js` are already done. Read them to see how the pieces connect.

## Part B: the client

Keep the server running in one terminal. In a **second** terminal:

```bash
cd starter/client
npm install
npm run dev
```

Open http://localhost:5173. `vite.config.js` already proxies `/api` to the server on port 3000.

1. **Auth context** (`src/context/AuthContext.jsx`): finish `register`, persist the token in `localStorage`, and verify a saved token with `/api/auth/me`.
2. **Routing**: `/login` and `/register` (one `AuthPage` component with a `mode` prop), `/` for tasks, and `*` for 404.
3. **`ProtectedRoute`**: when there's no user, `<Navigate to="/login" />`.
4. **Navbar**: show the user's email and a Log out button, or Log in / Sign up links.
5. **`useTasks` hook**: load tasks for the current filter, plus `addTask`, `toggleTask` and `deleteTask`. Log out automatically on a 401.
6. **Tasks page**: form, list, All / To do / Done filters (store the filter in the URL with `useSearchParams`), and a count of tasks left.
7. **Polish**: loading and error states, empty states, an overdue date in red, keyboard and screen-reader friendly.

## Part C: deploy (optional)

- **API**: Render, Railway or Fly.io. Set `JWT_SECRET`, `CLIENT_ORIGIN` (your front-end URL) and `DB_FILE` (a path on a *persistent disk*, otherwise your database disappears on every deploy).
- **Client**: Netlify or Vercel. Build command `npm run build`, publish folder `dist`, and set `VITE_API_URL` to your API's URL.

## Ideas to go further

- Edit a task's title inline · drag to reorder · task categories or tags
- "Forgot password" email flow · rate-limit the login route
- Switch SQLite to PostgreSQL · rewrite in TypeScript · add React component tests with Vitest
