const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Notes API (SQLite) running at http://localhost:${PORT}`);
});
