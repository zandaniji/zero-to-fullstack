// Run with: npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "test-secret";
const { openDatabase } = require("../src/db");
const { createApp } = require("../src/app");

let server;
let base;

before(async () => {
  server = createApp(openDatabase(":memory:")).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

async function api(method, path, { body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

const register = (email, password = "correct-horse") => api("POST", "/api/auth/register", { body: { email, password } });

test("registers a user and never returns the password hash", async () => {
  const res = await register("ana@example.com");
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.deepEqual(Object.keys(res.body.user).sort(), ["email", "id"]);
});

test("rejects bad registrations", async () => {
  assert.equal((await register("not-an-email")).status, 400);
  assert.equal((await register("short@example.com", "123")).status, 400);
  assert.equal((await register("ana@example.com")).status, 409); // duplicate
});

test("logs in with the right password only", async () => {
  const ok = await api("POST", "/api/auth/login", { body: { email: "ANA@example.com", password: "correct-horse" } });
  assert.equal(ok.status, 200);
  assert.ok(ok.body.token);

  const bad = await api("POST", "/api/auth/login", { body: { email: "ana@example.com", password: "wrong-password" } });
  assert.equal(bad.status, 401);
});

test("protects task routes", async () => {
  assert.equal((await api("GET", "/api/tasks")).status, 401);
  assert.equal((await api("GET", "/api/tasks", { token: "garbage" })).status, 401);
});

test("full task lifecycle", async () => {
  const { body: { token } } = await register("ben@example.com");

  const created = await api("POST", "/api/tasks", { token, body: { title: "Write tests", dueDate: "2026-12-31" } });
  assert.equal(created.status, 201);
  assert.equal(created.body.done, false);

  const invalid = await api("POST", "/api/tasks", { token, body: { title: "" } });
  assert.equal(invalid.status, 400);

  const patched = await api("PATCH", `/api/tasks/${created.body.id}`, { token, body: { done: true } });
  assert.equal(patched.status, 200);
  assert.equal(patched.body.done, true);
  assert.equal(patched.body.title, "Write tests");

  const done = await api("GET", "/api/tasks?status=done", { token });
  assert.equal(done.body.length, 1);
  const active = await api("GET", "/api/tasks?status=active", { token });
  assert.equal(active.body.length, 0);

  assert.equal((await api("DELETE", `/api/tasks/${created.body.id}`, { token })).status, 204);
  assert.equal((await api("DELETE", `/api/tasks/${created.body.id}`, { token })).status, 404);
});

test("users can't see or change each other's tasks", async () => {
  const { body: { token: cleo } } = await register("cleo@example.com");
  const { body: { token: dev } } = await register("dev@example.com");

  const { body: task } = await api("POST", "/api/tasks", { token: cleo, body: { title: "Cleo's secret task" } });

  assert.equal((await api("GET", "/api/tasks", { token: dev })).body.length, 0);
  assert.equal((await api("PATCH", `/api/tasks/${task.id}`, { token: dev, body: { done: true } })).status, 404);
  assert.equal((await api("DELETE", `/api/tasks/${task.id}`, { token: dev })).status, 404);
});
