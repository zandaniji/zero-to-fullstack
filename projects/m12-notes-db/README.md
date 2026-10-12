# Module 12 project: Notes API + SQLite

Your Module 11 API forgets everything when it restarts. In this project you'll store notes in a real **SQLite** database file, using `node:sqlite`, which is built into Node.js 22.13 and newer, so there's nothing extra to install.

## Get started

```bash
cd starter
npm install
npm run dev
```

## The project structure

```
starter/
├── db.js           ← opens the database and creates the table (TODO)
├── app.js          ← the Express app and routes (TODO: switch from the array to SQL)
├── server.js       ← starts the server (done)
└── test/
    └── notes.test.js  ← automated tests, run with `npm test`
```

Splitting `app.js` (the app) from `server.js` (starting it) lets the tests start their own copy of the app on a random port.

## Steps

Run `npm test` first: the tests already pass on the array version! Your job is a **refactor**: change how the data is stored while keeping every test green. Run the tests after each route you convert.

1. **`db.js`**: create the `notes` table with `CREATE TABLE IF NOT EXISTS`, and insert two example notes when it's empty.
2. **`app.js`**: replace the array with SQL, one route at a time:
   - `GET /api/notes`: `SELECT * FROM notes`, and with `?search=` use `WHERE title LIKE ? OR body LIKE ?` with `%word%`
   - `GET /api/notes/:id`: `.get(id)` returns the row or `undefined`
   - `POST /api/notes`: `INSERT ... VALUES (?, ?)`, then select the new row with `result.lastInsertRowid`
   - `PUT /api/notes/:id`: `UPDATE ... WHERE id = ?`. If `result.changes === 0`, the note didn't exist (404)
   - `DELETE /api/notes/:id`: `DELETE ... WHERE id = ?`, checking `changes` the same way
3. Delete the `notes` array and `nextId`.
4. Run **`npm test`**. All tests should still pass.
5. Restart the server and check that your notes are still there. 🎉

## Rules

- **Always** use `?` placeholders for values from the request. Never build SQL with template strings. That's how SQL injection happens (see the last test).
- The database lives in `notes.db`. Delete that file to start fresh. Add `notes.db` to `.gitignore` if you use git.

## Peek at the data

Install the **SQLite Viewer** extension in VS Code and click `notes.db` to browse your table.

Stuck? Compare with the `solution/` folder.
