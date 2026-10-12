/* Module 12 — Databases */
(() => {
  // Sample data loaded fresh before every run of an SQL exercise.
  const BOOKS = `
CREATE TABLE books (
  id       INTEGER PRIMARY KEY,
  title    TEXT    NOT NULL,
  author   TEXT    NOT NULL,
  year     INTEGER,
  genre    TEXT,
  price    REAL,
  in_stock INTEGER NOT NULL DEFAULT 1
);
INSERT INTO books (title, author, year, genre, price, in_stock) VALUES
  ('The Hobbit', 'J.R.R. Tolkien', 1937, 'fantasy', 10.99, 1),
  ('Nineteen Eighty-Four', 'George Orwell', 1949, 'sci-fi', 8.99, 1),
  ('Dune', 'Frank Herbert', 1965, 'sci-fi', 12.50, 1),
  ('The Left Hand of Darkness', 'Ursula K. Le Guin', 1969, 'sci-fi', 11.25, 0),
  ('Pride and Prejudice', 'Jane Austen', 1813, 'romance', 6.99, 1),
  ('The Name of the Wind', 'Patrick Rothfuss', 2007, 'fantasy', 14.00, 1),
  ('Frankenstein', 'Mary Shelley', 1818, 'horror', 7.50, 0),
  ('The Martian', 'Andy Weir', 2011, 'sci-fi', 13.99, 1),
  ('A Wizard of Earthsea', 'Ursula K. Le Guin', 1968, 'fantasy', 9.50, 1),
  ('The Shining', 'Stephen King', 1977, 'horror', 9.99, 1);
`;

  const LIBRARY = `
CREATE TABLE authors (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  country TEXT
);
CREATE TABLE books (
  id        INTEGER PRIMARY KEY,
  title     TEXT    NOT NULL,
  year      INTEGER,
  author_id INTEGER REFERENCES authors(id)
);
INSERT INTO authors (id, name, country) VALUES
  (1, 'Ursula K. Le Guin', 'USA'),
  (2, 'Terry Pratchett', 'UK'),
  (3, 'Chimamanda Ngozi Adichie', 'Nigeria'),
  (4, 'Haruki Murakami', 'Japan');
INSERT INTO books (title, year, author_id) VALUES
  ('A Wizard of Earthsea', 1968, 1),
  ('The Dispossessed', 1974, 1),
  ('Guards! Guards!', 1989, 2),
  ('Small Gods', 1992, 2),
  ('Mort', 1987, 2),
  ('Half of a Yellow Sun', 2006, 3);
`;

  Course.addContent('m12', {

    /* ---------------------------------------------------------------- */
    'sql-vs-nosql': [
      {
        type: 'explain',
        title: 'Why databases?',
        body: [
          "Your Notes API kept data in an array, which vanished on every restart. You *could* write JSON to a file, but real apps need much more:",
          "- **Persistence**: data survives restarts and crashes",
          "- **Querying**: \"the 10 newest notes containing 'pizza'\" without loading everything into memory",
          "- **Many users at once**: two people saving at the same time without corrupting anything",
          "- **Rules**: every user must have an email, no two users can share one",
          "That's what a **database** does. Your server talks to it, and it stores everything safely on disk.",
          { code: `Browser ──HTTP──▶ Express server ──SQL──▶ Database (on disk)`, lang: 'text' },
        ],
      },
      {
        type: 'explain',
        title: 'Tables, rows and columns',
        body: [
          "A **relational database** stores data in **tables**, like spreadsheets with strict rules:",
          { code: `books\n┌────┬───────────────────────┬──────────────────┬──────┬────────┐\n│ id │ title                 │ author           │ year │ price  │\n├────┼───────────────────────┼──────────────────┼──────┼────────┤\n│ 1  │ The Hobbit            │ J.R.R. Tolkien   │ 1937 │ 10.99  │\n│ 2  │ Nineteen Eighty-Four  │ George Orwell    │ 1949 │  8.99  │\n│ 3  │ Dune                  │ Frank Herbert    │ 1965 │ 12.50  │\n└────┴───────────────────────┴──────────────────┴──────┴────────┘`, lang: 'text' },
          "- Each **column** has a name and a type (`INTEGER`, `TEXT`, `REAL` for decimals).",
          "- Each **row** is one record (one book).",
          "- The **primary key** (`id`) uniquely identifies each row.",
          "You talk to relational databases with **SQL** (Structured Query Language, said \"S-Q-L\" or \"sequel\"). It's been around since the 1970s and is still one of the most valuable skills in tech.",
        ],
      },
      {
        type: 'explain',
        title: 'SQL vs NoSQL',
        body: [
          "There are two big families of databases:",
          "**SQL (relational)**: PostgreSQL, MySQL, **SQLite**, SQL Server",
          "- Data in tables with a fixed structure (a **schema**)",
          "- Powerful queries and **joins** across tables",
          "- Strong guarantees about correctness (transactions)",
          "**NoSQL**: MongoDB, Firebase, Redis, DynamoDB",
          "- Often stores flexible JSON-like **documents**",
          "- Easy to change shape, and scales out across many machines",
          "- Joins across collections are harder",
          "For most apps, a relational database is the safe default. In this course you'll use **SQLite**: a complete SQL database stored in a single file, with no separate server to install. It's built into Node.js (`node:sqlite`) and is the most widely deployed database in the world (it's inside every phone!). The SQL you learn works almost unchanged in PostgreSQL and MySQL.",
        ],
      },
    ],

    /* ---------------------------------------------------------------- */
    'sql-basics': [
      {
        type: 'explain',
        title: 'SELECT: reading data',
        body: [
          "`SELECT` asks for data. The most basic query gets every column (`*`) of every row:",
          { code: `SELECT * FROM books;`, lang: 'sql' },
          "Pick specific columns, and sort with `ORDER BY`:",
          { code: `SELECT title, year\nFROM books\nORDER BY year DESC;   -- newest first (ASC is the default)`, lang: 'sql' },
          "SQL keywords are traditionally written in UPPERCASE, but that's just a convention. Statements end with `;`. Comments start with `--`.",
          "> In SQL exercises, the **Results** panel shows a table for each `SELECT`. Every run starts from a fresh copy of the sample data, so you can't break anything!",
        ],
      },
      {
        type: 'try',
        title: 'Your first query',
        body: ["A `books` table with 10 books is ready for you. Press Run to see what's there."],
        goal: "Select **all columns** of **all books**.",
        hint: "`SELECT * FROM books;`",
        setup: BOOKS,
        starter: { sql: "-- Write your query below\n" },
        solution: { sql: "-- Write your query below\nSELECT * FROM books;\n" },
        check: ({ results }) => {
          const r = results[results.length - 1];
          if (!r) return 'Write a SELECT query and run it.';
          if (r.values.length !== 10) return `Your query returned ${r.values.length} rows. It should return all 10 books.`;
          return r.columns.length === 7 || 'Select every column with `*`.';
        },
      },
      {
        type: 'explain',
        title: 'Filtering with WHERE',
        body: [
          "`WHERE` keeps only the rows that match a condition:",
          { code: `SELECT title, price FROM books WHERE price < 10;\n\nSELECT * FROM books WHERE genre = 'sci-fi';          -- text uses 'single quotes'\n\nSELECT * FROM books WHERE genre = 'sci-fi' AND year > 1960;\nSELECT * FROM books WHERE genre = 'horror' OR genre = 'fantasy';\nSELECT * FROM books WHERE genre IN ('horror', 'fantasy');   -- same thing, shorter\nSELECT * FROM books WHERE year BETWEEN 1900 AND 1999;\nSELECT * FROM books WHERE title LIKE '%the%';         -- % = any characters\nSELECT * FROM books WHERE price IS NULL;              -- NULL = no value`, lang: 'sql' },
          "Comparison operators: `=`, `!=` (or `<>`), `<`, `>`, `<=`, `>=`. Notice that SQL uses a **single** `=` for comparing.",
          "`LIMIT` caps how many rows come back. It's great for \"top 5\" lists:",
          { code: `SELECT title, price FROM books ORDER BY price DESC LIMIT 3;   -- 3 most expensive`, lang: 'sql' },
        ],
      },
      {
        type: 'try',
        title: 'Classics',
        body: ["Find the old books."],
        goal: "Select only the `title` and `author` of books published **before 1950**, ordered by `year` (oldest first).",
        hint: "`SELECT title, author FROM books WHERE year < 1950 ORDER BY year;`",
        setup: BOOKS,
        starter: { sql: "" },
        solution: { sql: "SELECT title, author\nFROM books\nWHERE year < 1950\nORDER BY year;\n" },
        check: ({ results, query }) => {
          const r = results[results.length - 1];
          if (!r) return 'Write a SELECT query and run it.';
          if (r.columns.join(',') !== 'title,author') return `Select exactly the title and author columns (you selected: ${r.columns.join(', ')}).`;
          const expected = query('SELECT title, author FROM books WHERE year < 1950 ORDER BY year').map((row) => row.title);
          const got = r.values.map((v) => v[0]);
          if (got.length !== expected.length) return `There are ${expected.length} books before 1950, but your query returned ${got.length}.`;
          return got.join('|') === expected.join('|') || 'Order the results by year, oldest first.';
        },
      },
      {
        type: 'try',
        title: 'Search and limit',
        body: ["Combine `LIKE`, `ORDER BY` and `LIMIT`."],
        goal: "Find books whose **title contains \"the\"** (any capitalization). Show `title` and `price`, cheapest first, and only the **3** cheapest.",
        hint: "`WHERE title LIKE '%the%' ORDER BY price LIMIT 3`. In SQLite, `LIKE` ignores case for English letters.",
        setup: BOOKS,
        starter: { sql: "" },
        solution: { sql: "SELECT title, price\nFROM books\nWHERE title LIKE '%the%'\nORDER BY price\nLIMIT 3;\n" },
        check: ({ results, query }) => {
          const r = results[results.length - 1];
          if (!r) return 'Write a SELECT query and run it.';
          if (r.columns.join(',') !== 'title,price') return 'Select the title and price columns.';
          const expected = query("SELECT title, price FROM books WHERE title LIKE '%the%' ORDER BY price LIMIT 3");
          if (r.values.length !== 3) return `Return exactly 3 rows (you returned ${r.values.length}). Use LIMIT.`;
          return r.values.every((v, i) => v[0] === expected[i].title) || 'Not quite: filter with LIKE \'%the%\' and sort by price (cheapest first).';
        },
      },
      {
        type: 'explain',
        title: 'Counting and grouping',
        body: [
          "**Aggregate functions** calculate one value from many rows:",
          { code: `SELECT COUNT(*) FROM books;                  -- how many rows\nSELECT AVG(price), MIN(price), MAX(price) FROM books;\nSELECT SUM(price) AS stock_value FROM books WHERE in_stock = 1;   -- AS renames a column`, lang: 'sql' },
          "`GROUP BY` runs the aggregate **once per group**:",
          { code: `SELECT genre, COUNT(*) AS book_count, ROUND(AVG(price), 2) AS avg_price\nFROM books\nGROUP BY genre\nORDER BY book_count DESC;`, lang: 'sql' },
          { output: `genre    | book_count | avg_price\nsci-fi   | 4          | 11.68\nfantasy  | 3          | 11.5\nhorror   | 2          | 8.75\nromance  | 1          | 6.99` },
          "To filter groups, use `HAVING` (`WHERE` filters rows *before* grouping): `... GROUP BY genre HAVING COUNT(*) > 1`.",
        ],
      },
      {
        type: 'try',
        title: 'Books per author',
        body: ["Which authors appear more than once?"],
        goal: "Show each `author` and how many books they have, as a column named `book_count`. Order by `book_count` (highest first), then by `author` A–Z.",
        hint: "`SELECT author, COUNT(*) AS book_count FROM books GROUP BY author ORDER BY book_count DESC, author;`",
        setup: BOOKS,
        starter: { sql: "" },
        solution: { sql: "SELECT author, COUNT(*) AS book_count\nFROM books\nGROUP BY author\nORDER BY book_count DESC, author;\n" },
        check: ({ results, query }) => {
          const r = results[results.length - 1];
          if (!r) return 'Write a SELECT query and run it.';
          if (r.columns.join(',') !== 'author,book_count') return 'Your columns should be `author` and `book_count` (use `AS book_count`).';
          const expected = query('SELECT author, COUNT(*) AS book_count FROM books GROUP BY author ORDER BY book_count DESC, author');
          if (r.values.length !== expected.length) return `There should be one row per author (${expected.length}). Did you GROUP BY author?`;
          return r.values.every((v, i) => v[0] === expected[i].author && v[1] === expected[i].book_count) || 'Order by book_count (highest first), then by author.';
        },
      },
      {
        type: 'explain',
        title: 'INSERT, UPDATE and DELETE',
        body: [
          "SQL can change data too:",
          { code: `-- Add a row (id is filled in automatically)\nINSERT INTO books (title, author, year, genre, price)\nVALUES ('Circe', 'Madeline Miller', 2018, 'fantasy', 15.99);\n\n-- Change rows: ALWAYS include a WHERE!\nUPDATE books SET price = 9.99 WHERE id = 3;\nUPDATE books SET price = price * 0.9 WHERE genre = 'horror';   -- 10% off\n\n-- Remove rows: ALWAYS include a WHERE!\nDELETE FROM books WHERE in_stock = 0;`, lang: 'sql' },
          "> ⚠️ `UPDATE books SET price = 0;` or `DELETE FROM books;` without a `WHERE` changes or deletes **every row**. Professionals run a `SELECT` with the same `WHERE` first, to see exactly what will be affected.",
        ],
      },
      {
        type: 'try',
        title: 'Run the bookshop',
        body: ["Write several statements in one go. They run in order."],
        goal: [
          "1. **Insert** *Project Hail Mary* by Andy Weir (2021, sci-fi, price 18.99)",
          "2. **Update** *Dune* so its price is 9.99",
          "3. **Delete** every book that's out of stock (`in_stock = 0`)",
          "4. Finally `SELECT * FROM books` to see the result",
        ],
        hint: "Separate the statements with semicolons. Use `WHERE title = 'Dune'` for the update.",
        setup: BOOKS,
        starter: { sql: "-- 1. INSERT\n\n-- 2. UPDATE\n\n-- 3. DELETE\n\n-- 4. SELECT\n" },
        solution: { sql: "-- 1. INSERT\nINSERT INTO books (title, author, year, genre, price)\nVALUES ('Project Hail Mary', 'Andy Weir', 2021, 'sci-fi', 18.99);\n\n-- 2. UPDATE\nUPDATE books SET price = 9.99 WHERE title = 'Dune';\n\n-- 3. DELETE\nDELETE FROM books WHERE in_stock = 0;\n\n-- 4. SELECT\nSELECT * FROM books;\n" },
        check: ({ query }) => {
          const phm = query("SELECT * FROM books WHERE title = 'Project Hail Mary'")[0];
          if (!phm) return 'Insert "Project Hail Mary".';
          if (phm.author !== 'Andy Weir' || phm.year !== 2021 || Math.abs(phm.price - 18.99) > 0.001) return 'Check the new book\'s author, year and price.';
          const dune = query("SELECT price FROM books WHERE title = 'Dune'")[0];
          if (!dune || Math.abs(dune.price - 9.99) > 0.001) return 'Update Dune\'s price to 9.99.';
          if (query('SELECT COUNT(*) AS n FROM books WHERE price = 9.99')[0].n > 2) return 'Your UPDATE changed more than Dune. Did you forget the WHERE?';
          if (query('SELECT COUNT(*) AS n FROM books WHERE in_stock = 0')[0].n !== 0) return 'Delete the out-of-stock books.';
          return query('SELECT COUNT(*) AS n FROM books')[0].n === 9 || 'You should end with 9 books. Did your DELETE remove too much?';
        },
      },
      {
        type: 'explain',
        title: 'Creating tables',
        body: [
          "`CREATE TABLE` defines a table's columns, types and **constraints** (rules the database enforces for you):",
          { code: `CREATE TABLE users (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,   -- unique id, assigned automatically\n  email      TEXT    NOT NULL UNIQUE,             -- required, no duplicates\n  name       TEXT    NOT NULL,\n  age        INTEGER CHECK (age >= 13),           -- custom rule\n  is_admin   INTEGER NOT NULL DEFAULT 0,          -- SQLite stores booleans as 0/1\n  created_at TEXT    NOT NULL DEFAULT (datetime('now'))\n);`, lang: 'sql' },
          "- `NOT NULL`: the value is required.",
          "- `UNIQUE`: no two rows may have the same value.",
          "- `DEFAULT`: the value used when you don't provide one.",
          "- `CREATE TABLE IF NOT EXISTS ...` does nothing if the table already exists. It's perfect for app start-up code.",
          "Constraints are your last line of defense: even if your JavaScript has a bug, the database refuses bad data.",
        ],
      },
      {
        type: 'try',
        title: 'Design a table',
        body: ["No sample data this time. You're starting with an empty database."],
        goal: [
          "Create a `students` table with:",
          "- `id`: integer primary key (autoincrement)",
          "- `name`: text, required",
          "- `email`: text, required and **unique**",
          "- `grade`: integer with a default of `1`",
          "Then insert **3 students** (leave out `grade` for at least one) and `SELECT * FROM students`.",
        ],
        hint: [{ code: "CREATE TABLE students (\n  id    INTEGER PRIMARY KEY AUTOINCREMENT,\n  name  TEXT NOT NULL,\n  email TEXT NOT NULL UNIQUE,\n  grade INTEGER DEFAULT 1\n);", lang: 'sql' }],
        starter: { sql: "" },
        solution: { sql: "CREATE TABLE students (\n  id    INTEGER PRIMARY KEY AUTOINCREMENT,\n  name  TEXT NOT NULL,\n  email TEXT NOT NULL UNIQUE,\n  grade INTEGER DEFAULT 1\n);\n\nINSERT INTO students (name, email, grade) VALUES ('Ana', 'ana@school.test', 3);\nINSERT INTO students (name, email, grade) VALUES ('Ben', 'ben@school.test', 2);\nINSERT INTO students (name, email) VALUES ('Cleo', 'cleo@school.test');\n\nSELECT * FROM students;\n" },
        check: ({ query }) => {
          const cols = query('PRAGMA table_info(students)');
          if (!cols.length) return 'Create a table called `students`.';
          const col = (n) => cols.find((c) => c.name === n);
          for (const n of ['id', 'name', 'email', 'grade']) if (!col(n)) return `The table needs a \`${n}\` column.`;
          if (!col('id').pk) return '`id` should be the PRIMARY KEY.';
          if (!col('name').notnull) return '`name` should be NOT NULL.';
          if (!col('email').notnull) return '`email` should be NOT NULL.';
          if (String(col('grade').dflt_value) !== '1') return '`grade` should have DEFAULT 1.';
          const rows = query('SELECT * FROM students');
          if (rows.length < 3) return `Insert at least 3 students (found ${rows.length}).`;
          if (!rows.some((r) => r.grade === 1)) return 'Leave out the grade for one student, so it gets the default of 1.';
          try {
            query(`INSERT INTO students (name, email) VALUES ('Copycat', '${String(rows[0].email).replace(/'/g, "''")}')`);
            return '`email` should be UNIQUE: inserting a duplicate email worked, but it shouldn\'t.';
          } catch (e) {
            return true;
          }
        },
      },
    ],

    /* ---------------------------------------------------------------- */
    'modeling': [
      {
        type: 'explain',
        title: 'Relationships between tables',
        body: [
          "Real data is connected. One author writes many books, one user has many tasks. Instead of repeating the author's details on every book, store them **once** and point to them:",
          { code: `authors                         books\n┌────┬──────────────────┐        ┌────┬──────────────────────┬───────────┐\n│ id │ name             │        │ id │ title                │ author_id │\n├────┼──────────────────┤        ├────┼──────────────────────┼───────────┤\n│ 1  │ Ursula K. Le Guin│◀───┬───│ 1  │ A Wizard of Earthsea │ 1         │\n│ 2  │ Terry Pratchett  │◀─┐ └───│ 2  │ The Dispossessed     │ 1         │\n└────┴──────────────────┘  └─────│ 3  │ Guards! Guards!      │ 2         │\n                                 └────┴──────────────────────┴───────────┘`, lang: 'text' },
          "`author_id` is a **foreign key**: it holds the `id` of a row in another table. This is a **one-to-many** relationship (one author → many books).",
          { code: `CREATE TABLE books (\n  id        INTEGER PRIMARY KEY,\n  title     TEXT NOT NULL,\n  author_id INTEGER NOT NULL REFERENCES authors(id)\n);`, lang: 'sql' },
          "**Many-to-many** relationships (students ↔ courses, posts ↔ tags) need a third **join table** with two foreign keys, like `enrollments(student_id, course_id)`.",
          "Storing each fact in one place is called **normalization**. Update an author's name once, and every book shows the change.",
        ],
      },
      {
        type: 'explain',
        title: 'JOIN: combining tables',
        body: [
          "A `JOIN` puts related rows back together in a query:",
          { code: `SELECT books.title, authors.name AS author\nFROM books\nJOIN authors ON books.author_id = authors.id\nORDER BY books.title;`, lang: 'sql' },
          { output: `title                  | author\nA Wizard of Earthsea   | Ursula K. Le Guin\nGuards! Guards!        | Terry Pratchett\n...` },
          "- `JOIN ... ON` says how rows match up (the foreign key equals the primary key).",
          "- Prefix columns with the table name (`books.title`) when both tables have a column with that name, like `id`.",
          "- A plain `JOIN` (an **INNER JOIN**) only keeps rows that have a match on both sides.",
          "- A **`LEFT JOIN`** keeps *every* row from the left table, even with no match (the right side's columns become `NULL`). Use it for \"authors and their books, *including* authors with no books\".",
        ],
      },
      {
        type: 'try',
        title: 'Books with their authors',
        body: ["This database has separate `authors` and `books` tables, linked by `books.author_id`."],
        goal: "List every book's `title` together with its author's name as a column called `author`, ordered by title.",
        hint: "`SELECT books.title, authors.name AS author FROM books JOIN authors ON books.author_id = authors.id ORDER BY books.title;`",
        setup: LIBRARY,
        starter: { sql: "-- Peek at the tables first if you like:\n-- SELECT * FROM authors;\n-- SELECT * FROM books;\n\n" },
        solution: { sql: "SELECT books.title, authors.name AS author\nFROM books\nJOIN authors ON books.author_id = authors.id\nORDER BY books.title;\n" },
        check: ({ results, query }) => {
          const r = results[results.length - 1];
          if (!r) return 'Write a SELECT query with a JOIN.';
          if (r.columns.join(',') !== 'title,author') return `Your columns should be \`title\` and \`author\` (you have: ${r.columns.join(', ')}).`;
          const expected = query('SELECT books.title, authors.name AS author FROM books JOIN authors ON books.author_id = authors.id ORDER BY books.title');
          if (r.values.length !== expected.length) return `There are ${expected.length} books, but your query returned ${r.values.length} rows. Check your ON condition.`;
          return r.values.every((v, i) => v[0] === expected[i].title && v[1] === expected[i].author) || 'Match each book to its author and order by title.';
        },
      },
      {
        type: 'try',
        title: 'Every author, even without books',
        body: ["Haruki Murakami is in the `authors` table but has no books yet. An inner JOIN would leave him out."],
        goal: "Show **every** author's `name` and how many books they have as `book_count` (0 for authors with none). Order by `book_count` (highest first), then name.",
        hint: [
          ["Start `FROM authors LEFT JOIN books ON books.author_id = authors.id`."],
          ["Use `COUNT(books.id)`, not `COUNT(*)`. It counts only real matches, so authors with no books get 0."],
        ],
        setup: LIBRARY,
        starter: { sql: "" },
        solution: { sql: "SELECT authors.name, COUNT(books.id) AS book_count\nFROM authors\nLEFT JOIN books ON books.author_id = authors.id\nGROUP BY authors.id\nORDER BY book_count DESC, authors.name;\n" },
        check: ({ results }) => {
          const r = results[results.length - 1];
          if (!r) return 'Write a SELECT query with a LEFT JOIN.';
          if (r.columns.join(',') !== 'name,book_count') return 'Your columns should be `name` and `book_count`.';
          const rows = r.values;
          if (rows.length !== 4) return `All 4 authors should appear (you have ${rows.length}). Use a LEFT JOIN.`;
          const murakami = rows.find((v) => v[0] === 'Haruki Murakami');
          if (!murakami) return 'Haruki Murakami is missing. That\'s what LEFT JOIN is for.';
          if (murakami[1] !== 0) return `Murakami has no books, so his book_count should be 0 (it's ${murakami[1]}). Use COUNT(books.id).`;
          return (rows[0][0] === 'Terry Pratchett' && rows[0][1] === 3) || 'Order by book_count, highest first.';
        },
      },
      {
        type: 'explain',
        title: 'Indexes and good habits',
        body: [
          "A few more ideas you'll meet as your databases grow:",
          "- **Indexes** make lookups fast, like the index at the back of a book. Primary keys and `UNIQUE` columns get one automatically. Add one for columns you often filter or join on: `CREATE INDEX idx_books_author ON books(author_id);`",
          "- **Transactions** group statements so they all succeed or all fail. Picture a bank transfer: take money from one account and add it to another, never just one half.",
          "- **Migrations** are versioned scripts that change your schema over time (add a column, create a table), so every copy of the database stays in sync.",
          "- **Never build SQL by gluing strings together with user input.** That's the next chapter's big lesson.",
        ],
      },
    ],

    /* ---------------------------------------------------------------- */
    'express-sqlite': [
      {
        type: 'explain',
        title: 'SQLite in Node.js',
        body: [
          "Node.js 22.13+ has SQLite built in with `node:sqlite`, so there's nothing to install:",
          { code: `const { DatabaseSync } = require("node:sqlite");\n\nconst db = new DatabaseSync("app.db");        // opens (or creates) the file\n// new DatabaseSync(":memory:") makes a temporary in-memory database\n\n// exec: run SQL that returns nothing (setup, CREATE TABLE...)\ndb.exec(\`CREATE TABLE IF NOT EXISTS notes (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  title TEXT NOT NULL\n)\`);\n\n// prepare: create a reusable statement with ? placeholders\nconst insert = db.prepare("INSERT INTO notes (title) VALUES (?)");\nconst result = insert.run("Buy milk");   // → { changes: 1, lastInsertRowid: 1 }\n\nconst all = db.prepare("SELECT * FROM notes").all();               // → array of row objects\nconst one = db.prepare("SELECT * FROM notes WHERE id = ?").get(1);  // → one object, or undefined`, lang: 'js' },
          "- `.all(...)`: every matching row, as an array.",
          "- `.get(...)`: the first row, or `undefined` if none.",
          "- `.run(...)`: for INSERT/UPDATE/DELETE. It returns `changes` (rows affected) and `lastInsertRowid` (the new id).",
          "- Each `?` is filled by the arguments, in order.",
          "> The Express playground supports `node:sqlite` too, using a temporary in-memory database that resets on every run.",
        ],
      },
      {
        type: 'explain',
        title: 'SQL injection, and how ? stops it',
        body: [
          "Imagine building a query by gluing in user input:",
          { code: `// ❌ NEVER DO THIS\nconst sql = \`SELECT * FROM users WHERE email = '\${req.query.email}'\`;`, lang: 'js' },
          "Now a visitor types this as their \"email\":",
          { code: `' OR '1'='1`, lang: 'text' },
          "…and your query becomes `SELECT * FROM users WHERE email = '' OR '1'='1'`, which returns **every user**. With a different input an attacker could delete tables. This is **SQL injection**, one of the most common and damaging security bugs ever.",
          "**Placeholders fix it completely.** The values are sent separately from the SQL, so they can never be treated as code:",
          { code: `// ✅ ALWAYS DO THIS\nconst user = db.prepare("SELECT * FROM users WHERE email = ?").get(req.query.email);`, lang: 'js' },
          "> The rule is simple: **every value that comes from outside goes through a `?`**. No exceptions.",
        ],
      },
      {
        type: 'try',
        title: 'Read from the database',
        mode: 'express',
        sqlite: true,
        tryRequests: [{ method: 'GET', url: '/books' }, { method: 'GET', url: '/books/2' }, { method: 'GET', url: '/books/99' }],
        body: ["The database setup is done for you at the top. Needs an internet connection (to load SQLite)."],
        goal: [
          "- `GET /books` returns all books ordered by title, using `.all()`",
          "- `GET /books/:id` returns one book using `.get()` with a `?` placeholder, or 404 `{ \"error\": \"Book not found\" }`",
        ],
        hint: [{ code: "const book = db.prepare(\"SELECT * FROM books WHERE id = ?\").get(req.params.id);\nif (!book) return res.status(404).json({ error: \"Book not found\" });", lang: 'js' }],
        starter: { js: "const express = require(\"express\");\nconst { DatabaseSync } = require(\"node:sqlite\");\n\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(`\n  CREATE TABLE books (\n    id     INTEGER PRIMARY KEY AUTOINCREMENT,\n    title  TEXT NOT NULL,\n    author TEXT NOT NULL\n  );\n  INSERT INTO books (title, author) VALUES\n    ('Dune', 'Frank Herbert'),\n    ('Beloved', 'Toni Morrison'),\n    ('Circe', 'Madeline Miller');\n`);\n\nconst app = express();\napp.use(express.json());\n\n// GET /books\n\n\n// GET /books/:id\n\n\napp.listen(3000, () => console.log(\"Bookshop API on port 3000\"));\n" },
        solution: { js: "const express = require(\"express\");\nconst { DatabaseSync } = require(\"node:sqlite\");\n\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(`\n  CREATE TABLE books (\n    id     INTEGER PRIMARY KEY AUTOINCREMENT,\n    title  TEXT NOT NULL,\n    author TEXT NOT NULL\n  );\n  INSERT INTO books (title, author) VALUES\n    ('Dune', 'Frank Herbert'),\n    ('Beloved', 'Toni Morrison'),\n    ('Circe', 'Madeline Miller');\n`);\n\nconst app = express();\napp.use(express.json());\n\n// GET /books\napp.get(\"/books\", (req, res) => {\n  const books = db.prepare(\"SELECT * FROM books ORDER BY title\").all();\n  res.json(books);\n});\n\n// GET /books/:id\napp.get(\"/books/:id\", (req, res) => {\n  const book = db.prepare(\"SELECT * FROM books WHERE id = ?\").get(req.params.id);\n  if (!book) return res.status(404).json({ error: \"Book not found\" });\n  res.json(book);\n});\n\napp.listen(3000, () => console.log(\"Bookshop API on port 3000\"));\n" },
        check: async ({ request, code }) => {
          const all = await request('GET', '/books');
          if (all.status === 0) return all.text;
          if (!Array.isArray(all.body) || all.body.length !== 3) return 'GET /books should return all 3 books from the database.';
          if (all.body.map((b) => b.title).join(',') !== 'Beloved,Circe,Dune') return 'Order the books by title (`ORDER BY title`).';
          const one = await request('GET', '/books/1');
          if (one.status !== 200 || !one.body || one.body.title !== 'Dune') return 'GET /books/1 should return Dune.';
          const none = await request('GET', '/books/99');
          if (none.status !== 404 || !none.body || none.body.error !== 'Book not found') return 'GET /books/99 should be 404 { "error": "Book not found" }.';
          if (/prepare\(\s*`[^`]*\$\{/.test(code.js)) return 'Don\'t put request values into the SQL string. Use a `?` placeholder!';
          return true;
        },
      },
      {
        type: 'try',
        title: 'Write to the database',
        mode: 'express',
        sqlite: true,
        tryRequests: [{ method: 'POST', url: '/books', body: { title: 'Kindred', author: 'Octavia E. Butler' } }, { method: 'GET', url: '/books' }, { method: 'DELETE', url: '/books/1' }],
        body: ["Now create and delete rows."],
        goal: [
          "- `POST /books` with `{ title, author }`: insert with placeholders and respond **201** with the new row (look it up using `lastInsertRowid`). If either field is missing, respond **400** `{ \"error\": \"title and author are required\" }`",
          "- `DELETE /books/:id`: respond **204**, or **404** `{ \"error\": \"Book not found\" }` when `changes` is 0",
        ],
        hint: [
          [{ code: "const result = db.prepare(\"INSERT INTO books (title, author) VALUES (?, ?)\").run(title, author);\nconst book = db.prepare(\"SELECT * FROM books WHERE id = ?\").get(result.lastInsertRowid);", lang: 'js' }],
          ["`const { changes } = db.prepare(\"DELETE FROM books WHERE id = ?\").run(req.params.id);`"],
        ],
        starter: { js: "const express = require(\"express\");\nconst { DatabaseSync } = require(\"node:sqlite\");\n\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(`\n  CREATE TABLE books (\n    id     INTEGER PRIMARY KEY AUTOINCREMENT,\n    title  TEXT NOT NULL,\n    author TEXT NOT NULL\n  );\n  INSERT INTO books (title, author) VALUES ('Dune', 'Frank Herbert'), ('Beloved', 'Toni Morrison');\n`);\n\nconst app = express();\napp.use(express.json());\n\napp.get(\"/books\", (req, res) => {\n  res.json(db.prepare(\"SELECT * FROM books\").all());\n});\n\n// POST /books\n\n\n// DELETE /books/:id\n\n\napp.listen(3000);\n" },
        solution: { js: "const express = require(\"express\");\nconst { DatabaseSync } = require(\"node:sqlite\");\n\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(`\n  CREATE TABLE books (\n    id     INTEGER PRIMARY KEY AUTOINCREMENT,\n    title  TEXT NOT NULL,\n    author TEXT NOT NULL\n  );\n  INSERT INTO books (title, author) VALUES ('Dune', 'Frank Herbert'), ('Beloved', 'Toni Morrison');\n`);\n\nconst app = express();\napp.use(express.json());\n\napp.get(\"/books\", (req, res) => {\n  res.json(db.prepare(\"SELECT * FROM books\").all());\n});\n\n// POST /books\napp.post(\"/books\", (req, res) => {\n  const { title, author } = req.body || {};\n  if (!title || !author) {\n    return res.status(400).json({ error: \"title and author are required\" });\n  }\n  const result = db.prepare(\"INSERT INTO books (title, author) VALUES (?, ?)\").run(title, author);\n  const book = db.prepare(\"SELECT * FROM books WHERE id = ?\").get(result.lastInsertRowid);\n  res.status(201).json(book);\n});\n\n// DELETE /books/:id\napp.delete(\"/books/:id\", (req, res) => {\n  const { changes } = db.prepare(\"DELETE FROM books WHERE id = ?\").run(req.params.id);\n  if (changes === 0) return res.status(404).json({ error: \"Book not found\" });\n  res.status(204).end();\n});\n\napp.listen(3000);\n" },
        check: async ({ request, code }) => {
          const created = await request('POST', '/books', { title: 'Kindred', author: 'Octavia E. Butler' });
          if (created.status === 0) return created.text;
          if (created.status !== 201) return `POST /books should respond 201, not ${created.status}.`;
          if (!created.body || created.body.title !== 'Kindred' || typeof created.body.id !== 'number') return 'Respond with the new row from the database (including its id).';
          const list = await request('GET', '/books');
          if (!list.body.some((b) => b.title === 'Kindred')) return 'The new book should be saved in the database.';
          const tricky = await request('POST', '/books', { title: "O'Brien's Guide", author: "Robert'); DROP TABLE books; --" });
          if (tricky.status !== 201) return 'A title containing quotes broke your query. Use `?` placeholders instead of building the SQL string yourself.';
          if ((await request('GET', '/books')).status !== 200) return 'Your books table got dropped! Always use `?` placeholders.';
          const bad = await request('POST', '/books', { title: 'No author' });
          if (bad.status !== 400 || !bad.body || bad.body.error !== 'title and author are required') return 'A missing author should get 400 { "error": "title and author are required" }.';
          const del = await request('DELETE', '/books/1');
          if (del.status !== 204) return `DELETE /books/1 should respond 204, not ${del.status}.`;
          const again = await request('DELETE', '/books/1');
          if (again.status !== 404) return 'Deleting a book that doesn\'t exist should be 404. Check `changes`.';
          if (/prepare\(\s*`[^`]*\$\{/.test(code.js)) return 'Don\'t put request values into the SQL string. Use `?` placeholders!';
          return true;
        },
      },
    ],

    /* ---------------------------------------------------------------- */
    'project-notes-db': [
      {
        type: 'explain',
        title: "What you'll build",
        body: [
          "Time to give your Notes API a real memory. Same endpoints as Module 11, but every note now lives in a SQLite table:",
          { code: `CREATE TABLE IF NOT EXISTS notes (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  title      TEXT    NOT NULL,\n  body       TEXT    NOT NULL DEFAULT '',\n  created_at TEXT    NOT NULL DEFAULT (datetime('now'))\n);`, lang: 'sql' },
          "First in the playground, then on your computer, where the data is stored in a `notes.db` file and survives restarts.",
        ],
      },
      {
        type: 'project',
        title: 'Notes API with SQLite',
        mode: 'express',
        sqlite: true,
        tryRequests: [
          { method: 'GET', url: '/api/notes' },
          { method: 'GET', url: '/api/notes?search=sql' },
          { method: 'POST', url: '/api/notes', body: { title: 'Saved in SQLite', body: 'For real this time' } },
          { method: 'PUT', url: '/api/notes/1', body: { title: 'Updated', body: 'via SQL UPDATE' } },
          { method: 'DELETE', url: '/api/notes/2' },
        ],
        body: ["The validation and error handlers carry over from Module 11. Focus on the SQL."],
        tasks: [
          "Create the `notes` table with `CREATE TABLE IF NOT EXISTS` and insert two example notes",
          "`GET /api/notes`: newest first; with `?search=`, use `WHERE title LIKE ? OR body LIKE ?` and `%word%`",
          "`GET /api/notes/:id` with `.get()` → the note or 404",
          "`POST /api/notes` → INSERT, then respond 201 with the row fetched by `lastInsertRowid`",
          "`PUT /api/notes/:id` → UPDATE; if `changes === 0` respond 404",
          "`DELETE /api/notes/:id` → DELETE; 204 or 404 based on `changes`",
          "Every value from the request goes through a `?` placeholder",
        ],
        hint: [
          ["Order newest first with `ORDER BY created_at DESC, id DESC` (the id breaks ties when notes were created in the same second)."],
          ["Search, with one value per `?`:", { code: "db.prepare(\"SELECT * FROM notes WHERE title LIKE ? OR body LIKE ?\")\n  .all(`%${search}%`, `%${search}%`);", lang: 'js' }],
        ],
        starter: { js: "const express = require(\"express\");\nconst { DatabaseSync } = require(\"node:sqlite\");\n\nconst db = new DatabaseSync(\":memory:\");\n\n// 1. Create the notes table and add two example notes\n\n\nconst app = express();\napp.use(express.json());\n\nfunction validateNote(data) {\n  const errors = [];\n  if (!data || typeof data.title !== \"string\" || !data.title.trim()) errors.push(\"title is required\");\n  else if (data.title.trim().length > 100) errors.push(\"title must be 100 characters or fewer\");\n  if (data && data.body !== undefined && typeof data.body !== \"string\") errors.push(\"body must be a string\");\n  return errors;\n}\n\n// 2. Routes (use db.prepare(...) with ? placeholders)\n\n\napp.use((req, res) => res.status(404).json({ error: `Cannot ${req.method} ${req.path}` }));\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(err.status || 500).json({ error: err.status ? err.message : \"Something went wrong\" });\n});\n\napp.listen(3000, () => console.log(\"Notes API (SQLite) on port 3000\"));\n" },
        solution: { js: "const express = require(\"express\");\nconst { DatabaseSync } = require(\"node:sqlite\");\n\nconst db = new DatabaseSync(\":memory:\");\n\n// 1. Create the notes table and add two example notes\ndb.exec(`\n  CREATE TABLE IF NOT EXISTS notes (\n    id         INTEGER PRIMARY KEY AUTOINCREMENT,\n    title      TEXT    NOT NULL,\n    body       TEXT    NOT NULL DEFAULT '',\n    created_at TEXT    NOT NULL DEFAULT (datetime('now'))\n  )\n`);\nconst insert = db.prepare(\"INSERT INTO notes (title, body) VALUES (?, ?)\");\ninsert.run(\"Learn SQL\", \"SELECT, INSERT, UPDATE, DELETE.\");\ninsert.run(\"Use a real database\", \"My notes survive a restart now!\");\n\nconst app = express();\napp.use(express.json());\n\nfunction validateNote(data) {\n  const errors = [];\n  if (!data || typeof data.title !== \"string\" || !data.title.trim()) errors.push(\"title is required\");\n  else if (data.title.trim().length > 100) errors.push(\"title must be 100 characters or fewer\");\n  if (data && data.body !== undefined && typeof data.body !== \"string\") errors.push(\"body must be a string\");\n  return errors;\n}\n\nconst getNote = db.prepare(\"SELECT * FROM notes WHERE id = ?\");\n\n// 2. Routes (use db.prepare(...) with ? placeholders)\napp.get(\"/api/notes\", (req, res) => {\n  const search = req.query.search;\n  const notes = search\n    ? db.prepare(\"SELECT * FROM notes WHERE title LIKE ? OR body LIKE ? ORDER BY created_at DESC, id DESC\").all(`%${search}%`, `%${search}%`)\n    : db.prepare(\"SELECT * FROM notes ORDER BY created_at DESC, id DESC\").all();\n  res.json(notes);\n});\n\napp.get(\"/api/notes/:id\", (req, res) => {\n  const note = getNote.get(req.params.id);\n  if (!note) return res.status(404).json({ error: \"Note not found\" });\n  res.json(note);\n});\n\napp.post(\"/api/notes\", (req, res) => {\n  const errors = validateNote(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  const result = insert.run(req.body.title.trim(), req.body.body || \"\");\n  res.status(201).json(getNote.get(result.lastInsertRowid));\n});\n\napp.put(\"/api/notes/:id\", (req, res) => {\n  const errors = validateNote(req.body);\n  if (errors.length) return res.status(400).json({ errors });\n  const { changes } = db.prepare(\"UPDATE notes SET title = ?, body = ? WHERE id = ?\").run(req.body.title.trim(), req.body.body || \"\", req.params.id);\n  if (changes === 0) return res.status(404).json({ error: \"Note not found\" });\n  res.json(getNote.get(req.params.id));\n});\n\napp.delete(\"/api/notes/:id\", (req, res) => {\n  const { changes } = db.prepare(\"DELETE FROM notes WHERE id = ?\").run(req.params.id);\n  if (changes === 0) return res.status(404).json({ error: \"Note not found\" });\n  res.status(204).end();\n});\n\napp.use((req, res) => res.status(404).json({ error: `Cannot ${req.method} ${req.path}` }));\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(err.status || 500).json({ error: err.status ? err.message : \"Something went wrong\" });\n});\n\napp.listen(3000, () => console.log(\"Notes API (SQLite) on port 3000\"));\n" },
        check: async ({ request, code }) => {
          if (!/CREATE TABLE/i.test(code.js)) return 'Create the notes table with `CREATE TABLE IF NOT EXISTS notes (...)`.';
          if (/\blet\s+notes\s*=\s*\[/.test(code.js)) return 'Store notes in the database, not in an array.';
          const list = await request('GET', '/api/notes');
          if (list.status === 0) return list.text;
          if (!Array.isArray(list.body) || list.body.length !== 2) return 'GET /api/notes should return the 2 example notes from the database.';
          if (!list.body[0].created_at) return 'Notes should come from the table (with a `created_at` column).';
          const created = await request('POST', '/api/notes', { title: 'From the test', body: 'zebra crossing' });
          if (created.status !== 201 || !created.body || created.body.title !== 'From the test' || !created.body.id) return `POST should insert the note and respond 201 with the new row. Got ${created.status}: ${created.text}`;
          const newest = await request('GET', '/api/notes');
          if (newest.body.length !== 3 || newest.body[0].id !== created.body.id) return 'GET /api/notes should list the newest note first.';
          const search = await request('GET', '/api/notes?search=ZEBRA');
          if (!Array.isArray(search.body) || search.body.length !== 1) return 'Searching for "ZEBRA" should find exactly the note whose body contains "zebra".';
          if ((await request('POST', '/api/notes', { body: 'no title' })).status !== 400) return 'Invalid notes should still be rejected with 400.';
          const put = await request('PUT', `/api/notes/${created.body.id}`, { title: 'Edited', body: 'new' });
          if (put.status !== 200 || !put.body || put.body.title !== 'Edited') return 'PUT should update the row and return it.';
          if ((await request('PUT', '/api/notes/999', { title: 'x' })).status !== 404) return 'PUT on an unknown id should be 404 (check `changes`).';
          if ((await request('DELETE', `/api/notes/${created.body.id}`)).status !== 204) return 'DELETE should respond 204.';
          if ((await request('GET', `/api/notes/${created.body.id}`)).status !== 404) return 'A deleted note should return 404.';
          if ((await request('DELETE', '/api/notes/999')).status !== 404) return 'DELETE on an unknown id should be 404.';
          const evil = await request('GET', '/api/notes?search=' + encodeURIComponent("' OR 1=1 --"));
          if (evil.status !== 200 || evil.body.length !== 0) return 'Your search is vulnerable to SQL injection! Use `?` placeholders.';
          return true;
        },
        success: "Your API is now backed by a real database. 💾 Time to run it on your computer.",
      },
      {
        type: 'local',
        title: 'Run it for real',
        body: [
          "Your course folder has the matching project: `projects/m12-notes-db`. It's your Module 11 API, reorganized into files, with an **automated test suite**.",
          { code: `cd projects/m12-notes-db/starter\nnpm install\nnpm run dev`, lang: 'bash' },
          "1. Fill in the TODOs in `db.js` (create the table, seed example notes).",
          "2. Replace the array in `app.js` with SQL, one route at a time.",
          "3. Run the tests with `npm test` before you start and after each route you convert. They start your app on a random port and check every endpoint, including an SQL injection attempt. They pass on the array version already; your job is to keep them green while switching to SQL (a **refactor**).",
          "4. Create a few notes, **restart the server**, and check they're still there. 🎉",
          "5. Install the VS Code **SQLite Viewer** extension and open `notes.db` to see your table.",
          "> Automated tests are covered properly in Module 13. For now, enjoy watching them pass!",
        ],
      },
      {
        type: 'explain',
        title: 'Module 12 complete',
        body: [
          "You can now store data properly:",
          "- Relational databases, tables, and SQL vs NoSQL",
          "- `SELECT` with `WHERE`, `ORDER BY`, `LIMIT`, `LIKE`, `GROUP BY` and aggregates",
          "- `INSERT`, `UPDATE`, `DELETE` (with a `WHERE`!) and `CREATE TABLE` with constraints",
          "- Relationships, foreign keys, `JOIN` and `LEFT JOIN`",
          "- `node:sqlite` in Express, and **placeholders to prevent SQL injection**",
          "Next is **Module 13: Backend Essentials**: authentication, security, connecting React to your API, testing and deployment.",
        ],
      },
    ],
  });
})();
