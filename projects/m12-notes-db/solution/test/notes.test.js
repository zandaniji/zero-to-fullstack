// Run with: npm test   (uses Node's built-in test runner, no extra packages)
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

// Use a throwaway in-memory database so tests never touch notes.db.
process.env.DB_FILE = ":memory:";
const app = require("../app");

let server;
let base;

before(async () => {
  server = app.listen(0); // port 0 = pick any free port
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

// Small helper: send JSON, get { status, body } back.
async function request(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

test("lists the example notes", async () => {
  const res = await request("GET", "/api/notes");
  assert.equal(res.status, 200);
  assert.equal(res.body.length, 2);
});

test("creates a note and reads it back", async () => {
  const created = await request("POST", "/api/notes", { title: "  Test note  ", body: "Hello" });
  assert.equal(created.status, 201);
  assert.equal(created.body.title, "Test note");

  const fetched = await request("GET", `/api/notes/${created.body.id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.body, "Hello");
});

test("rejects a note without a title", async () => {
  const res = await request("POST", "/api/notes", { body: "no title" });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.errors, ["title is required"]);
});

test("searches by title or body", async () => {
  await request("POST", "/api/notes", { title: "Pizza recipe", body: "Dough, sauce, cheese" });
  const res = await request("GET", "/api/notes?search=cheese");
  assert.equal(res.status, 200);
  assert.ok(res.body.some((n) => n.title === "Pizza recipe"));
  assert.ok(res.body.every((n) => /cheese/i.test(n.title + n.body)));
});

test("updates and deletes a note", async () => {
  const { body: note } = await request("POST", "/api/notes", { title: "Temporary" });

  const updated = await request("PUT", `/api/notes/${note.id}`, { title: "Renamed" });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.title, "Renamed");

  const deleted = await request("DELETE", `/api/notes/${note.id}`);
  assert.equal(deleted.status, 204);

  const gone = await request("GET", `/api/notes/${note.id}`);
  assert.equal(gone.status, 404);
});

test("is safe from SQL injection in search", async () => {
  const res = await request("GET", "/api/notes?search=" + encodeURIComponent("'; DROP TABLE notes; --"));
  assert.equal(res.status, 200);
  const still = await request("GET", "/api/notes");
  assert.equal(still.status, 200); // the table still exists
});
