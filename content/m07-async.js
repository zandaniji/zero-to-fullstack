/* Module 7 — Synchronous & Asynchronous JavaScript */
Course.addContent('m07', {

  /* ---------------------------------------------------------------- */
  'event-loop': [
    {
      type: 'explain',
      title: 'Synchronous code',
      body: [
        "Everything you've written so far is **synchronous**: JavaScript runs one line at a time, top to bottom, and each line finishes before the next starts.",
        { code: `console.log("1. Put the kettle on");\nconsole.log("2. Wait for it to boil");\nconsole.log("3. Make tea");`, lang: 'js' },
        { output: `1. Put the kettle on\n2. Wait for it to boil\n3. Make tea` },
        "JavaScript is **single-threaded**: it can only do one thing at a time. So what happens when something takes a long time, like downloading data? If JavaScript just sat there waiting, the whole page would freeze: no scrolling, no clicking.",
        "> That's why the web needs **asynchronous** code: start a slow task, carry on with other work, and deal with the result when it's ready.",
      ],
    },
    {
      type: 'explain',
      title: 'Asynchronous code with setTimeout',
      body: [
        "`setTimeout` runs a callback **later**, after a delay in milliseconds (1000 ms = 1 second):",
        { code: `console.log("Order placed");\n\nsetTimeout(() => {\n  console.log("🍕 Pizza delivered!");\n}, 2000);\n\nconsole.log("Watching TV while we wait...");`, lang: 'js' },
        { output: `Order placed\nWatching TV while we wait...\n🍕 Pizza delivered!` },
        "Notice the order! JavaScript doesn't stop and wait at `setTimeout`. It *schedules* the callback and moves straight on. Two seconds later the callback runs.",
        "Even `setTimeout(fn, 0)` runs *after* the current code finishes. \"Later\" always means \"once everything currently running is done\".",
      ],
    },
    {
      type: 'try',
      title: 'Change the order',
      body: ["Right now these print in order 1-2-3."],
      goal: "Wrap the `\"Second\"` log in a `setTimeout` of **500 ms**, so the output becomes First, Third, Second. Don't move any lines.",
      hint: [{ code: "setTimeout(() => {\n  console.log(\"Second\");\n}, 500);", lang: 'js' }],
      starter: { js: "console.log(\"First\");\nconsole.log(\"Second\");\nconsole.log(\"Third\");\n" },
      solution: { js: "console.log(\"First\");\nsetTimeout(() => {\n  console.log(\"Second\");\n}, 500);\nconsole.log(\"Third\");\n" },
      checkDelay: 900,
      check: ({ code, logs }) => {
        if (!/setTimeout\(/.test(code.js)) return 'Use `setTimeout`.';
        if (code.js.indexOf('"Second"') > code.js.indexOf('"Third"')) return 'Keep the lines in their original order and use `setTimeout` to delay "Second".';
        return logs.join(',') === 'First,Third,Second' || `Expected First, Third, Second but got ${logs.join(', ')}.`;
      },
    },
    {
      type: 'explain',
      title: 'How it works: the event loop',
      body: [
        "Here's what's happening behind the scenes:",
        { code: `┌──────────────┐     ┌──────────────────────┐\n│  Call stack  │ ──▶ │  Browser (Web APIs)  │\n│ (runs code   │     │  timers, fetch,      │\n│  one at a    │     │  events wait here    │\n│  time)       │     └──────────┬───────────┘\n└──────▲───────┘                │ when ready\n       │                        ▼\n       │            ┌──────────────────────┐\n       └─ event ─── │     Task queue       │\n          loop      │ callbacks wait here  │\n                    └──────────────────────┘`, lang: 'text' },
        "1. Your code runs on the **call stack**.",
        "2. `setTimeout`, `fetch` and event listeners hand their work to the **browser**, which handles the waiting.",
        "3. When a timer finishes (or data arrives, or a button is clicked), its callback goes into the **task queue**.",
        "4. The **event loop** keeps checking: *is the call stack empty?* If so, it takes the next callback from the queue and runs it.",
        "That's why the delayed callback always waits for the current code to finish, and why a long-running loop freezes everything: the event loop can't get a turn.",
      ],
    },
    {
      type: 'explain',
      title: 'Repeating with setInterval',
      body: [
        "`setInterval` runs a callback **repeatedly**, every N milliseconds. It returns an ID you pass to `clearInterval` to stop it:",
        { code: `let seconds = 0;\n\nconst timerId = setInterval(() => {\n  seconds++;\n  console.log(\`\${seconds}s\`);\n\n  if (seconds === 3) {\n    clearInterval(timerId);   // stop!\n    console.log("Done");\n  }\n}, 1000);`, lang: 'js' },
        { output: `1s\n2s\n3s\nDone` },
        "`setTimeout` returns an ID too, and `clearTimeout(id)` cancels it before it runs. That's useful for things like search boxes that wait until you stop typing.",
      ],
    },
    {
      type: 'try',
      title: 'Race countdown',
      body: ["Ready… set…"],
      goal: [
        "Use `setInterval` with a **300 ms** delay to print `3`, `2`, `1`, then `Go!`, and then **stop** the interval with `clearInterval`.",
      ],
      hint: [
        ["Keep a `let count = 3;` outside the interval."],
        ["Inside the callback: if `count > 0`, print it and decrease it. Otherwise print `Go!` and call `clearInterval(timer)`."],
      ],
      starter: { js: "let count = 3;\n\n" },
      solution: { js: "let count = 3;\n\nconst timer = setInterval(() => {\n  if (count > 0) {\n    console.log(count);\n    count--;\n  } else {\n    console.log(\"Go!\");\n    clearInterval(timer);\n  }\n}, 300);\n" },
      checkDelay: 2000,
      check: ({ code, logs }) => {
        if (!/setInterval\(/.test(code.js)) return 'Use `setInterval`.';
        if (!/clearInterval\(/.test(code.js)) return 'Stop the interval with `clearInterval`.';
        return logs.join(',') === '3,2,1,Go!' || `Expected 3, 2, 1, Go! (and then nothing more) but got ${logs.join(', ')}.`;
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'callbacks-promises': [
    {
      type: 'explain',
      title: 'Callbacks for async results',
      body: [
        "The first way to deal with async results was callbacks: *\"when you're done, call this function\"*.",
        { code: `function loadUser(id, callback) {\n  setTimeout(() => {\n    callback({ id, name: "Ana" });   // pretend this came from a server\n  }, 500);\n}\n\nloadUser(1, (user) => {\n  console.log("Loaded:", user.name);\n});`, lang: 'js' },
        "But when one async step depends on another, callbacks nest deeper and deeper. This is **callback hell**:",
        { code: `loadUser(1, (user) => {\n  loadOrders(user.id, (orders) => {\n    loadProduct(orders[0].productId, (product) => {\n      loadReviews(product.id, (reviews) => {\n        // 😵‍💫 and error handling at every level...\n      });\n    });\n  });\n});`, lang: 'js' },
        "**Promises** were invented to fix this.",
      ],
    },
    {
      type: 'explain',
      title: 'Promises',
      body: [
        "A **Promise** is an object representing a value that will be ready *later*. Think of a restaurant buzzer: you get it now, and it buzzes when your food is ready (or when they've run out).",
        "A promise is always in one of three states:",
        "- **pending**: still waiting",
        "- **fulfilled**: it worked, and here's the value",
        "- **rejected**: it failed, and here's the error",
        "You react to the outcome with `.then()` and `.catch()`:",
        { code: `fetch("https://api.example.com/user")   // fetch returns a promise\n  .then((response) => {\n    console.log("Got a response!");\n  })\n  .catch((error) => {\n    console.log("Something went wrong:", error.message);\n  });`, lang: 'js' },
        "You can also create your own promises, which is great for wrapping older callback code:",
        { code: `function wait(ms) {\n  return new Promise((resolve) => {\n    setTimeout(resolve, ms);   // call resolve() when the time is up\n  });\n}\n\nwait(1000).then(() => console.log("One second later"));`, lang: 'js' },
      ],
    },
    {
      type: 'try',
      title: 'Build a wait() function',
      body: ["This little helper is so useful you'll reuse it in the next chapter."],
      goal: [
        "- Write a function `wait(ms)` that **returns a Promise** that resolves after `ms` milliseconds",
        "- Call `wait(500)` and use `.then()` to print `Done waiting`",
      ],
      hint: [{ code: "function wait(ms) {\n  return new Promise((resolve) => {\n    setTimeout(resolve, ms);\n  });\n}", lang: 'js' }],
      starter: { js: "" },
      solution: { js: "function wait(ms) {\n  return new Promise((resolve) => {\n    setTimeout(resolve, ms);\n  });\n}\n\nwait(500).then(() => console.log(\"Done waiting\"));\n" },
      checkDelay: 900,
      check: async ({ get, logs }) => {
        const wait = get('wait');
        if (typeof wait !== 'function') return 'Write a function called `wait`.';
        const p = wait(10);
        if (!(p instanceof Promise)) return '`wait()` should `return` a Promise.';
        const start = Date.now();
        await wait(100);
        if (Date.now() - start < 90) return '`wait(100)` should take about 100 ms to resolve.';
        return logs.includes('Done waiting') || 'Use `.then()` to print "Done waiting" after `wait(500)`.';
      },
    },
    {
      type: 'explain',
      title: 'Chaining and errors',
      body: [
        "Whatever you return from a `.then()` is passed to the next `.then()`, so steps run in sequence without nesting:",
        { code: `wait(500)\n  .then(() => {\n    console.log("Step 1");\n    return wait(500);        // return a promise → the chain waits for it\n  })\n  .then(() => {\n    console.log("Step 2");\n    return 42;\n  })\n  .then((value) => {\n    console.log("Got", value);\n  })\n  .catch((error) => {\n    console.log("Any step failed:", error.message);\n  })\n  .finally(() => {\n    console.log("Runs either way");\n  });`, lang: 'js' },
        "One `.catch()` at the end handles errors from **any** step above it. That's far tidier than callback hell.",
        "To make a promise fail, call `reject` with an `Error`:",
        { code: `function divide(a, b) {\n  return new Promise((resolve, reject) => {\n    if (b === 0) reject(new Error("Can't divide by zero"));\n    else resolve(a / b);\n  });\n}`, lang: 'js' },
      ],
    },
    {
      type: 'try',
      title: 'Resolve or reject',
      body: ["Write a promise that can succeed or fail."],
      goal: [
        "Write `checkAge(age)` that returns a Promise which:",
        "- **resolves** with `\"Welcome!\"` if `age` is 18 or more",
        "- **rejects** with `new Error(\"Too young\")` otherwise",
        "Then call it with `20` and `12`, printing the result with `.then()` and `error.message` with `.catch()`.",
      ],
      hint: [{ code: "checkAge(12)\n  .then(msg => console.log(msg))\n  .catch(err => console.log(err.message));", lang: 'js' }],
      starter: { js: "" },
      solution: { js: "function checkAge(age) {\n  return new Promise((resolve, reject) => {\n    if (age >= 18) {\n      resolve(\"Welcome!\");\n    } else {\n      reject(new Error(\"Too young\"));\n    }\n  });\n}\n\ncheckAge(20)\n  .then(msg => console.log(msg))\n  .catch(err => console.log(err.message));\n\ncheckAge(12)\n  .then(msg => console.log(msg))\n  .catch(err => console.log(err.message));\n" },
      checkDelay: 300,
      check: async ({ get, logs }) => {
        const checkAge = get('checkAge');
        if (typeof checkAge !== 'function') return 'Write a function called `checkAge`.';
        const ok = checkAge(30);
        if (!(ok instanceof Promise)) return '`checkAge` should return a Promise.';
        if (await ok !== 'Welcome!') return 'For ages 18+, resolve with "Welcome!".';
        try {
          await checkAge(10);
          return 'For ages under 18, the promise should reject.';
        } catch (e) {
          if (!e || e.message !== 'Too young') return 'Reject with `new Error("Too young")`.';
        }
        if (!logs.includes('Welcome!')) return 'Call `checkAge(20)` and print the result with `.then()`.';
        return logs.includes('Too young') || 'Call `checkAge(12)` and print `err.message` with `.catch()`.';
      },
    },
    {
      type: 'explain',
      title: 'Running promises in parallel',
      body: [
        "Sometimes you need several things at once, like loading a user *and* their settings. Don't wait for one before starting the other. `Promise.all` runs them together and waits for **all** of them:",
        { code: `const [user, settings] = await Promise.all([\n  fetch("/api/user").then(r => r.json()),\n  fetch("/api/settings").then(r => r.json()),\n]);`, lang: 'js' },
        "If any of them fails, `Promise.all` rejects. If you want results even when some fail, use `Promise.allSettled`.",
        "That example used `await`, a much nicer way to work with promises. It's next!",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'async-await-fetch': [
    {
      type: 'explain',
      title: 'async and await',
      body: [
        "`async`/`await` lets you write asynchronous code that *reads* like normal, top-to-bottom code:",
        { code: `// With .then()\nfunction makeTea() {\n  return boilWater()\n    .then(() => brew())\n    .then(() => console.log("Tea is ready"));\n}\n\n// With async/await: same behaviour, easier to read\nasync function makeTea() {\n  await boilWater();\n  await brew();\n  console.log("Tea is ready");\n}`, lang: 'js' },
        "- Mark a function `async`. It then always returns a promise.",
        "- Inside it, `await` pauses *that function* until the promise settles, and gives you its value.",
        "- The rest of the page keeps running while it waits. Nothing freezes.",
        "> `await` only works inside an `async` function (or at the top level of a module).",
      ],
    },
    {
      type: 'try',
      title: 'Rewrite with async/await',
      body: ["The `wait` helper from the last chapter is ready for you."],
      goal: "Write an `async function main()` that prints `Step 1`, waits 300 ms, prints `Step 2`, waits 300 ms, prints `Step 3`. Then call `main()`.",
      hint: [{ code: "async function main() {\n  console.log(\"Step 1\");\n  await wait(300);\n  // ...\n}\n\nmain();", lang: 'js' }],
      starter: { js: "function wait(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\n" },
      solution: { js: "function wait(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\nasync function main() {\n  console.log(\"Step 1\");\n  await wait(300);\n  console.log(\"Step 2\");\n  await wait(300);\n  console.log(\"Step 3\");\n}\n\nmain();\n" },
      checkDelay: 1000,
      check: ({ code, logs }) => {
        if (!/async\s+function\s+main|const\s+main\s*=\s*async/.test(code.js)) return 'Write an `async function main()`.';
        if ((code.js.match(/await\s+wait\(/g) || []).length < 2) return 'Use `await wait(300)` twice.';
        return logs.join(',') === 'Step 1,Step 2,Step 3' || `Expected Step 1, Step 2, Step 3 but got ${logs.join(', ') || 'nothing'}. Did you call \`main()\`?`;
      },
    },
    {
      type: 'explain',
      title: 'Error handling with try/catch',
      body: [
        "With `await`, you handle errors using `try` / `catch`, the same tool that works for any error in JavaScript:",
        { code: `async function loadProfile() {\n  try {\n    const user = await getUser();      // might fail\n    console.log("Hello", user.name);\n  } catch (error) {\n    console.log("Couldn't load profile:", error.message);\n  } finally {\n    console.log("Hide the loading spinner");\n  }\n}`, lang: 'js' },
        "- Code in `try` runs normally.",
        "- If anything in `try` throws (or an awaited promise rejects), it jumps straight to `catch`.",
        "- `finally` runs no matter what. It's perfect for cleanup.",
      ],
    },
    {
      type: 'explain',
      title: 'Fetching data from an API',
      body: [
        "An **API** is a URL that returns data (usually JSON) instead of a web page. `fetch()` requests it:",
        { code: `async function getUser() {\n  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");\n  const user = await response.json();    // parse the JSON body\n  console.log(user.name);\n  console.log(user.email);\n}\n\ngetUser();`, lang: 'js' },
        { output: `Leanne Graham\nSincere@april.biz` },
        "There are **two** awaits: one for the response to arrive, and one to read and parse its body.",
        "> **JSONPlaceholder** is a free fake API for practising. Paste `https://jsonplaceholder.typicode.com/users/1` into your browser to see the raw JSON. The next exercises need an internet connection.",
      ],
    },
    {
      type: 'try',
      title: 'Your first fetch',
      body: ["Time to load real data from the internet!"],
      goal: "Fetch `https://jsonplaceholder.typicode.com/users/1` and print the user's **name**.",
      hint: [
        ["Write an `async` function, `await fetch(...)`, then `await response.json()`."],
        ["The name is in `user.name`. Don't forget to call your function!"],
      ],
      starter: { js: "async function loadUser() {\n  // fetch the user and print their name\n}\n\nloadUser();\n" },
      solution: { js: "async function loadUser() {\n  const response = await fetch(\"https://jsonplaceholder.typicode.com/users/1\");\n  const user = await response.json();\n  console.log(user.name);\n}\n\nloadUser();\n" },
      checkDelay: 3000,
      check: ({ code, logs }) => {
        if (!/fetch\(/.test(code.js)) return 'Use `fetch()`.';
        if (!/\.json\(\)/.test(code.js)) return 'Parse the response with `response.json()`.';
        return logs.includes('Leanne Graham') || 'The console should print "Leanne Graham". (This needs an internet connection.)';
      },
      success: "You just loaded data from a server on the internet! 🌍",
    },
    {
      type: 'explain',
      title: 'Handling fetch errors',
      body: [
        "Two kinds of things can go wrong with fetch:",
        "1. **Network errors** (offline, server down, bad URL): `fetch` rejects, and `catch` handles it.",
        "2. **HTTP errors** (404 Not Found, 500 Server Error): `fetch` does **not** reject! You have to check `response.ok` yourself.",
        { code: `async function loadPost(id) {\n  try {\n    const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`);\n\n    if (!response.ok) {\n      throw new Error(\`HTTP error \${response.status}\`);\n    }\n\n    const post = await response.json();\n    console.log(post.title);\n  } catch (error) {\n    console.log("Failed to load post:", error.message);\n  }\n}`, lang: 'js' },
        "`throw` creates an error on purpose, which jumps to `catch` just like a failed fetch.",
        "> Good apps also show the user what's happening: a **loading** message while waiting, the **data** when it arrives, or a friendly **error** message.",
      ],
    },
    {
      type: 'try',
      title: 'Fetch and render a list',
      body: ["Combine fetch with the DOM skills from Module 5."],
      goal: [
        "Fetch the first 5 todos from `https://jsonplaceholder.typicode.com/todos?_limit=5` and:",
        "- add an `li` with each todo's `title` to `#list`",
        "- remove the \"Loading…\" text (`#loading`) when done",
      ],
      hint: [
        ["The response is an **array** of todo objects. Loop over it with `for...of` or `forEach`."],
        ["Hide the loading message with `loading.remove()` or `loading.textContent = \"\"`."],
      ],
      starter: {
        html: "<h2>Todos from the API</h2>\n<p id=\"loading\">Loading…</p>\n<ul id=\"list\"></ul>\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
        js: "const list = document.querySelector(\"#list\");\nconst loading = document.querySelector(\"#loading\");\n\nasync function loadTodos() {\n\n}\n\nloadTodos();\n",
      },
      solution: {
        html: "<h2>Todos from the API</h2>\n<p id=\"loading\">Loading…</p>\n<ul id=\"list\"></ul>\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
        js: "const list = document.querySelector(\"#list\");\nconst loading = document.querySelector(\"#loading\");\n\nasync function loadTodos() {\n  try {\n    const response = await fetch(\"https://jsonplaceholder.typicode.com/todos?_limit=5\");\n    if (!response.ok) throw new Error(`HTTP error ${response.status}`);\n    const todos = await response.json();\n\n    for (const todo of todos) {\n      const li = document.createElement(\"li\");\n      li.textContent = todo.title;\n      list.append(li);\n    }\n  } catch (error) {\n    list.textContent = \"Could not load todos.\";\n  } finally {\n    loading.remove();\n  }\n}\n\nloadTodos();\n",
      },
      checkDelay: 3000,
      check: ({ $, $$ }) => {
        const items = $$('#list li');
        if (items.length !== 5) return `Expected 5 items in the list but found ${items.length}. (This needs an internet connection.)`;
        if (!items[0].textContent.includes('delectus aut autem')) return 'Each `li` should show the todo\'s `title`.';
        const loading = $('#loading');
        return !loading || !loading.textContent.trim() || getComputedStyle(loading).display === 'none' || 'Remove or hide the "Loading…" text once the data has arrived.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-quote-fetcher': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "A **random quote machine** that loads inspiring quotes from a real API, with proper loading and error states.",
        "The API: `https://dummyjson.com/quotes/random` returns JSON like this:",
        { code: `{\n  "id": 42,\n  "quote": "The best way out is always through.",\n  "author": "Robert Frost"\n}`, lang: 'js', label: 'JSON' },
        "Your app will:",
        "- load a quote when the page opens",
        "- load a new one every time the button is clicked",
        "- show \"Loading…\" and disable the button while waiting",
        "- show a friendly message if something goes wrong",
      ],
    },
    {
      type: 'project',
      title: 'Random quote machine',
      body: ["Keep the IDs from the starter HTML (`#quote`, `#author`, `#new-quote`, `#error`)."],
      tasks: [
        "Write an `async function loadQuote()` that fetches from `https://dummyjson.com/quotes/random`",
        "Show the quote text in `#quote` and the author in `#author`",
        "While loading: show `Loading…` in `#quote` and disable the button (`button.disabled = true`)",
        "Re-enable the button when finished, whether it worked or not (hint: `finally`)",
        "Check `response.ok` and use `try/catch` to show a friendly message in `#error` if it fails",
        "Call `loadQuote()` when the page loads and when the button is clicked",
        "Bonus: style it nicely, or add a \"Copy\" button using `navigator.clipboard.writeText()`",
      ],
      hint: [
        ["Structure: `try { ...fetch and display... } catch (e) { ...show error... } finally { ...re-enable button... }`"],
        ["Test your error handling by temporarily breaking the URL (e.g. `quotes/nope`)."],
      ],
      starter: {
        html: "<main class=\"card\">\n  <blockquote>\n    <p id=\"quote\">…</p>\n    <footer>— <cite id=\"author\"></cite></footer>\n  </blockquote>\n  <p id=\"error\" role=\"alert\"></p>\n  <button id=\"new-quote\" type=\"button\">New quote</button>\n</main>\n",
        css: "body {\n  font-family: Georgia, serif;\n  background: linear-gradient(135deg, #6a4cf0, #b06ab3);\n  min-height: 100vh;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.card {\n  background: white;\n  max-width: 420px;\n  margin: 16px;\n  padding: 24px;\n  border-radius: 16px;\n}\n\n#quote {\n  font-size: 20px;\n}\n\n#error {\n  color: #c53b3b;\n  font-family: sans-serif;\n}\n\nbutton {\n  font-size: 16px;\n  padding: 10px 16px;\n  border: none;\n  border-radius: 8px;\n  background: #6a4cf0;\n  color: white;\n  cursor: pointer;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n  cursor: wait;\n}\n",
        js: "const quoteEl = document.querySelector(\"#quote\");\nconst authorEl = document.querySelector(\"#author\");\nconst errorEl = document.querySelector(\"#error\");\nconst button = document.querySelector(\"#new-quote\");\n\nasync function loadQuote() {\n\n}\n\n",
      },
      solution: {
        html: "<main class=\"card\">\n  <blockquote>\n    <p id=\"quote\">…</p>\n    <footer>— <cite id=\"author\"></cite></footer>\n  </blockquote>\n  <p id=\"error\" role=\"alert\"></p>\n  <button id=\"new-quote\" type=\"button\">New quote</button>\n</main>\n",
        css: "body {\n  font-family: Georgia, serif;\n  background: linear-gradient(135deg, #6a4cf0, #b06ab3);\n  min-height: 100vh;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.card {\n  background: white;\n  max-width: 420px;\n  margin: 16px;\n  padding: 24px;\n  border-radius: 16px;\n}\n\n#quote {\n  font-size: 20px;\n}\n\n#error {\n  color: #c53b3b;\n  font-family: sans-serif;\n}\n\nbutton {\n  font-size: 16px;\n  padding: 10px 16px;\n  border: none;\n  border-radius: 8px;\n  background: #6a4cf0;\n  color: white;\n  cursor: pointer;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n  cursor: wait;\n}\n",
        js: "const quoteEl = document.querySelector(\"#quote\");\nconst authorEl = document.querySelector(\"#author\");\nconst errorEl = document.querySelector(\"#error\");\nconst button = document.querySelector(\"#new-quote\");\n\nasync function loadQuote() {\n  button.disabled = true;\n  errorEl.textContent = \"\";\n  quoteEl.textContent = \"Loading…\";\n  authorEl.textContent = \"\";\n\n  try {\n    const response = await fetch(\"https://dummyjson.com/quotes/random\");\n    if (!response.ok) throw new Error(`HTTP error ${response.status}`);\n\n    const data = await response.json();\n    quoteEl.textContent = data.quote;\n    authorEl.textContent = data.author;\n  } catch (error) {\n    quoteEl.textContent = \"\";\n    errorEl.textContent = \"Sorry, couldn't load a quote. Check your connection and try again.\";\n  } finally {\n    button.disabled = false;\n  }\n}\n\nbutton.addEventListener(\"click\", loadQuote);\nloadQuote();\n",
      },
      check: async ({ $, text, wait, code }) => {
        if (!/fetch\(/.test(code.js)) return 'Use `fetch()` to load the quote.';
        if (!/catch/.test(code.js)) return 'Handle errors with `try/catch`.';
        const ready = async () => {
          for (let i = 0; i < 40; i++) {
            const q = text('#quote');
            if ((q && q !== '…' && !/loading/i.test(q)) || text('#error')) return true;
            await wait(100);
          }
          return false;
        };
        if (!(await ready())) return 'No quote appeared within 4 seconds of the page loading. Do you call `loadQuote()` on start?';
        if (text('#error')) return 'The error message is showing. Check your fetch URL (and your internet connection).';
        if (!text('#author')) return 'Show the author in `#author`.';
        $('#new-quote').click();
        // loadQuote() should set the loading state synchronously, before its first await.
        if (!$('#new-quote').disabled) return 'Disable the button while a quote is loading.';
        if (!/loading/i.test(text('#quote'))) return 'Show "Loading…" in `#quote` while waiting.';
        if (!(await ready())) return 'Clicking the button didn\'t load a new quote.';
        if ($('#new-quote').disabled) return 'Re-enable the button once the quote has loaded.';
        return !!text('#quote') || 'Clicking the button should load a new quote.';
      },
      success: "Your quote machine works! ✨ Remember to tick the checklist.",
    },
    {
      type: 'explain',
      title: 'Module 7 complete',
      body: [
        "You now understand one of the trickiest parts of JavaScript:",
        "- Sync vs async code, and how the **event loop** schedules callbacks",
        "- `setTimeout`, `setInterval` and how to cancel them",
        "- **Promises**: `.then`, `.catch`, `.finally`, `new Promise`, `Promise.all`",
        "- **async/await** with `try/catch`",
        "- **fetch** for loading real data, with loading and error states",
        "> There are hundreds of free public APIs to play with: weather, jokes, Pokémon, space photos. Search \"public APIs list\" on GitHub and build something fun!",
        "Next up is **Module 8: JavaScript Classes**, the final piece before the capstone project.",
      ],
    },
  ],
});
