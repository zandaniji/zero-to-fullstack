const { createApp } = require("./app");

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing. Copy .env.example to .env and set it.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

createApp().listen(PORT, () => {
  console.log(`✅ Task Manager API running at http://localhost:${PORT}`);
});
