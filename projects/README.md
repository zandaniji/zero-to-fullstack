# Local projects

These projects run on your own computer, outside the learning app. They're for the parts of the course a browser can't fully run: real Node.js servers, databases and multi-file React apps.

| Folder | Course part | What you build |
|---|---|---|
| `m11-notes-api/` | Module 11: Node & Express | A REST API for notes (in memory) |
| `m12-notes-db/` | Module 12: Databases | The same API, saved in SQLite, with automated tests |
| `c2-recipe-finder/` | Capstone 2 | A multi-page React app with Vite and React Router |
| `c3-task-manager/` | Final Capstone | A full-stack app: React + Express + SQLite + login |

Most folders have a **`starter/`** (begin here, with TODOs) and a **`solution/`** (the finished version, for when you're stuck). Each one has its own README with steps.

## One-time setup

1. Install **Node.js LTS** (version 22.13 or newer) from https://nodejs.org.
2. Check it in a terminal: `node -v` and `npm -v`.
3. Install **VS Code** (https://code.visualstudio.com) plus these extensions:
   - **REST Client**: send API requests from `.http` files
   - **SQLite Viewer**: look inside `.db` files
   - **ES7+ React snippets** (optional): handy React shortcuts

## Running any project

```bash
cd m11-notes-api/starter     # or whichever folder
npm install                  # downloads the dependencies into node_modules/
npm run dev                  # starts it and restarts on every save
```

Press **Ctrl+C** in the terminal to stop a server.

> `node_modules/` folders can be large. You can delete them any time, since `npm install` brings them back.
