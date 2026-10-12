/* Module 4 — Arrays, Functions & Objects */
Course.addContent('m04', {

  /* ---------------------------------------------------------------- */
  'arrays': [
    {
      type: 'explain',
      title: 'Arrays: lists of values',
      body: [
        "So far each variable held one value. An **array** holds a whole list, in order:",
        { code: `const colors = ["red", "green", "blue"];\nconst scores = [90, 72, 85];\nconst mixed = ["Sam", 31, true];   // any types\nconst empty = [];`, lang: 'js' },
        "Each item has a numbered position called an **index**. Indexes start at **0**:",
        { code: `const colors = ["red", "green", "blue"];\n\nconsole.log(colors[0]);       // first item\nconsole.log(colors[2]);       // third item\nconsole.log(colors.length);   // how many items\nconsole.log(colors[colors.length - 1]); // last item`, lang: 'js' },
        { output: `red\nblue\n3\nblue` },
        "Asking for an index that doesn't exist gives `undefined`.",
      ],
    },
    {
      type: 'try',
      title: 'Your first array',
      body: ["Let's make a list of your favourite foods."],
      goal: [
        "- Create a `const` array called `foods` with **at least 3** strings",
        "- Print the **first** food",
        "- Print how many foods are in the array",
      ],
      hint: "`console.log(foods[0]);` and `console.log(foods.length);`",
      starter: { js: "// Create your foods array\n\n" },
      solution: { js: "// Create your foods array\nconst foods = [\"pizza\", \"sushi\", \"tacos\"];\n\nconsole.log(foods[0]);\nconsole.log(foods.length);\n" },
      check: ({ get, logs }) => {
        const foods = get('foods');
        if (!Array.isArray(foods)) return 'Create an array called `foods`.';
        if (foods.length < 3) return 'Put at least 3 foods in the array.';
        if (!logs.includes(String(foods[0]))) return 'Print the first food with `foods[0]`.';
        return logs.includes(String(foods.length)) || 'Print the length with `foods.length`.';
      },
    },
    {
      type: 'explain',
      title: 'Adding and removing items',
      body: [
        "Arrays come with methods to change them:",
        { code: `const queue = ["Ana", "Ben"];\n\nqueue.push("Cleo");      // add to the END     → ["Ana", "Ben", "Cleo"]\nqueue.unshift("Zed");    // add to the START   → ["Zed", "Ana", "Ben", "Cleo"]\nqueue.pop();             // remove from END    → ["Zed", "Ana", "Ben"]\nqueue.shift();           // remove from START  → ["Ana", "Ben"]\nqueue[1] = "Bea";        // replace an item    → ["Ana", "Bea"]\n\nconsole.log(queue);`, lang: 'js' },
        { output: `["Ana", "Bea"]` },
        "Wait, `queue` is a `const`, so how can it change? `const` stops you *reassigning* the variable (`queue = [...]`), but the array **itself** can still be modified.",
        "> `pop()` and `shift()` also *return* the item they removed: `const next = queue.shift();`",
      ],
    },
    {
      type: 'try',
      title: 'Shopping list',
      body: ["Update the shopping list as you shop."],
      goal: [
        "- Add `\"bread\"` to the end of `list`",
        "- Remove the first item (`\"milk\"`, you already bought it)",
        "- Print the whole list. It should be `[\"eggs\", \"bread\"]`",
      ],
      hint: "Use `push()` to add to the end and `shift()` to remove from the start.",
      starter: { js: "const list = [\"milk\", \"eggs\"];\n\n" },
      solution: { js: "const list = [\"milk\", \"eggs\"];\n\nlist.push(\"bread\");\nlist.shift();\n\nconsole.log(list);\n" },
      check: ({ code, logs }) => {
        if (!/\.push\(/.test(code.js)) return 'Use `push()` to add bread.';
        if (!/\.shift\(\)/.test(code.js)) return 'Use `shift()` to remove the first item.';
        return logs.includes('["eggs", "bread"]') || 'The printed list should be `["eggs", "bread"]`.';
      },
    },
    {
      type: 'explain',
      title: 'Looping through arrays',
      body: [
        "Loops and arrays are best friends. Two common ways:",
        { code: `const pets = ["cat", "dog", "parrot"];\n\n// 1. Classic for loop: when you need the index\nfor (let i = 0; i < pets.length; i++) {\n  console.log(i + ": " + pets[i]);\n}\n\n// 2. for...of: when you just need each item\nfor (const pet of pets) {\n  console.log("I love my " + pet);\n}`, lang: 'js' },
        { output: `0: cat\n1: dog\n2: parrot\nI love my cat\nI love my dog\nI love my parrot` },
        "Notice the classic loop uses `i < pets.length`, not `<=`. The last index is always `length - 1`.",
      ],
    },
    {
      type: 'try',
      title: 'Average score',
      body: ["Use the accumulator pattern from Module 2, but on an array this time."],
      goal: "Loop through `scores`, add them up, then print the **average** (total ÷ number of scores).",
      hint: [
        ["Start with `let total = 0;` and add each score inside a `for...of` loop."],
        ["After the loop: `console.log(total / scores.length);`"],
      ],
      starter: { js: "const scores = [80, 92, 75, 60, 88];\n\n" },
      solution: { js: "const scores = [80, 92, 75, 60, 88];\n\nlet total = 0;\nfor (const score of scores) {\n  total += score;\n}\n\nconsole.log(total / scores.length);\n" },
      check: ({ code, logs, get }) => {
        if (!/for\s*\(|\.forEach\(|\.reduce\(/.test(code.js)) return 'Use a loop to add up the scores.';
        const s = get('scores') || [];
        const avg = s.reduce((a, b) => a + b, 0) / s.length;
        return logs.includes(String(avg)) || `The average should be ${avg}.`;
      },
    },
    {
      type: 'explain',
      title: 'Searching and slicing',
      body: [
        "More handy array methods:",
        { code: `const names = ["Ana", "Ben", "Cleo", "Dev"];\n\nnames.includes("Ben");    // true: is it in there?\nnames.indexOf("Cleo");    // 2: where is it? (-1 if missing)\nnames.join(", ");         // "Ana, Ben, Cleo, Dev": array → string\nnames.slice(1, 3);        // ["Ben", "Cleo"]: a copy of part of it\nnames.reverse();          // reverses IN PLACE\n"a-b-c".split("-");       // ["a", "b", "c"]: string → array`, lang: 'js' },
        "Sorting also changes the array in place. For numbers you must pass a compare function, or they're sorted like text:",
        { code: `const nums = [10, 1, 5, 100];\nnums.sort();                   // [1, 10, 100, 5]  😬 sorted as text\nnums.sort((a, b) => a - b);    // [1, 5, 10, 100]  ✅`, lang: 'js' },
        "That `(a, b) => a - b` is an *arrow function*, coming up in the next chapter.",
      ],
    },
    {
      type: 'try',
      title: 'Guest list',
      body: ["You're at the door of a party with the guest list."],
      goal: [
        "- Print whether `\"Zoe\"` is on the list (`true`/`false`)",
        "- Print the position (index) of `\"Max\"`",
        "- Print all the guests as one string, separated by `\", \"`",
      ],
      hint: "`includes()`, `indexOf()` and `join(\", \")`",
      starter: { js: "const guests = [\"Lia\", \"Max\", \"Omar\", \"Pia\"];\n\n" },
      solution: { js: "const guests = [\"Lia\", \"Max\", \"Omar\", \"Pia\"];\n\nconsole.log(guests.includes(\"Zoe\"));\nconsole.log(guests.indexOf(\"Max\"));\nconsole.log(guests.join(\", \"));\n" },
      check: ({ logs }) => {
        if (!logs.includes('false')) return 'Print `guests.includes("Zoe")`, which should be `false`.';
        if (!logs.includes('1')) return 'Print `guests.indexOf("Max")`, which should be `1`.';
        return logs.includes('Lia, Max, Omar, Pia') || 'Print the guests joined with `", "`.';
      },
    },
    {
      type: 'explain',
      title: 'Spread and destructuring',
      body: [
        "Two modern shortcuts you'll see in almost every codebase (especially React):",
        "The **spread operator** `...` unpacks an array's items:",
        { code: `const fruits = ["apple", "pear"];\nconst veg = ["carrot"];\n\nconst food = [...fruits, ...veg, "bread"];  // ["apple", "pear", "carrot", "bread"]\nconst copy = [...fruits];                   // a separate copy`, lang: 'js' },
        "**Destructuring** pulls items out into variables:",
        { code: `const point = [10, 20];\nconst [x, y] = point;\nconsole.log(x, y);   // 10 20\n\nconst [first, ...rest] = ["a", "b", "c"];\nconsole.log(first);  // "a"\nconsole.log(rest);   // ["b", "c"]`, lang: 'js' },
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'functions': [
    {
      type: 'explain',
      title: 'Functions: reusable blocks of code',
      body: [
        "A **function** is a named block of code you can run whenever you like. You've already *used* functions: `console.log()`, `Math.random()`. Now you'll write your own.",
        { code: `// Declare (define) the function\nfunction sayHello() {\n  console.log("Hello!");\n  console.log("Nice to meet you.");\n}\n\n// Call (run) it, as many times as you want\nsayHello();\nsayHello();`, lang: 'js' },
        { output: `Hello!\nNice to meet you.\nHello!\nNice to meet you.` },
        "Declaring a function doesn't run it. The code inside only runs when you **call** it with `()`.",
        "> Functions follow the **DRY** principle: *Don't Repeat Yourself*. If you copy-paste code, it probably wants to be a function.",
      ],
    },
    {
      type: 'try',
      title: 'Write a function',
      body: ["Let's write and call your first function."],
      goal: "Write a function called `cheer` that prints `Go team!`, then call it **3 times**.",
      hint: "`function cheer() { console.log(\"Go team!\"); }` then `cheer();` three times.",
      starter: { js: "" },
      solution: { js: "function cheer() {\n  console.log(\"Go team!\");\n}\n\ncheer();\ncheer();\ncheer();\n" },
      check: ({ get, logs }) => {
        if (typeof get('cheer') !== 'function') return 'Declare a function called `cheer`.';
        return logs.filter((l) => l === 'Go team!').length === 3 || 'Call `cheer()` exactly 3 times so "Go team!" prints 3 times.';
      },
    },
    {
      type: 'explain',
      title: 'Parameters and arguments',
      body: [
        "Functions become really useful when you can pass information **in**. The names in the parentheses are **parameters**, like variables that get their values when the function is called:",
        { code: `function greet(name, emoji) {\n  console.log(\`Hi \${name} \${emoji}\`);\n}\n\ngreet("Ana", "👋");\ngreet("Ben", "🎉");`, lang: 'js' },
        { output: `Hi Ana 👋\nHi Ben 🎉` },
        "The actual values you pass (`\"Ana\"`, `\"👋\"`) are called **arguments**.",
        "You can give parameters a **default value** for when an argument is missing:",
        { code: `function greet(name = "friend") {\n  console.log(\`Hi \${name}\`);\n}\ngreet();       // Hi friend`, lang: 'js' },
      ],
    },
    {
      type: 'try',
      title: 'Personal greetings',
      body: ["Make one function that can greet anyone."],
      goal: "Write a function `greet(name)` that prints `Hello, <name>!`, then call it with **two different names**.",
      hint: ["Use a template literal inside the function:", { code: "console.log(`Hello, ${name}!`);", lang: 'js' }],
      starter: { js: "" },
      solution: { js: "function greet(name) {\n  console.log(`Hello, ${name}!`);\n}\n\ngreet(\"Ana\");\ngreet(\"Ben\");\n" },
      check: ({ get, logs }) => {
        if (typeof get('greet') !== 'function') return 'Declare a function called `greet`.';
        const hellos = logs.filter((l) => /^Hello, .+!$/.test(l));
        if (hellos.length < 2) return 'Call `greet()` twice so it prints two greetings like `Hello, Ana!`.';
        return new Set(hellos).size >= 2 || 'Use two *different* names.';
      },
    },
    {
      type: 'explain',
      title: 'Returning values',
      body: [
        "So far our functions *printed* things. Most functions instead **return** a value back to whoever called them:",
        { code: `function add(a, b) {\n  return a + b;\n}\n\nconst sum = add(2, 3);       // sum is 5\nconsole.log(add(10, 20));    // 30\nconsole.log(add(add(1, 2), 3)); // 6`, lang: 'js' },
        "`return` does two things: it sends a value back, and it **ends** the function immediately. Code after it doesn't run.",
        "> `console.log` shows something to *you*. `return` gives something to *your code*. A function without `return` returns `undefined`.",
      ],
    },
    {
      type: 'try',
      title: 'Return a value',
      body: ["Write a function that calculates something and gives the answer back."],
      goal: "Write a function `square(n)` that **returns** `n` multiplied by itself. Then print `square(7)`.",
      hint: "`function square(n) { return n * n; }`",
      starter: { js: "" },
      solution: { js: "function square(n) {\n  return n * n;\n}\n\nconsole.log(square(7));\n" },
      check: ({ get }) => {
        const square = get('square');
        if (typeof square !== 'function') return 'Declare a function called `square`.';
        if (square(4) === undefined) return 'Your function needs to `return` the answer, not just print it.';
        return (square(4) === 16 && square(-3) === 9) || '`square(4)` should return 16.';
      },
    },
    {
      type: 'explain',
      title: 'Arrow functions',
      body: [
        "**Arrow functions** are a shorter way to write functions, and they're everywhere in modern JavaScript:",
        { code: `// Regular function\nfunction double(n) {\n  return n * 2;\n}\n\n// Arrow function stored in a const\nconst double = (n) => {\n  return n * 2;\n};\n\n// Even shorter: one expression = automatic return, no braces needed\nconst double = (n) => n * 2;\n\n// One parameter? The parentheses are optional\nconst double = n => n * 2;`, lang: 'js' },
        "All four versions do the same thing (you'd only keep one, of course!).",
        "> With braces `{ }` you must write `return`. Without braces, the expression is returned automatically.",
      ],
    },
    {
      type: 'try',
      title: 'Arrow functions',
      body: ["Practise the short syntax."],
      goal: [
        "Write these as **arrow functions** stored in `const`s:",
        "- `triple`: returns a number × 3",
        "- `isAdult`: takes an age and returns `true` if it's 18 or more",
      ],
      hint: "`const triple = n => n * 3;`",
      starter: { js: "// Write your arrow functions here\n\n\nconsole.log(triple(5));\nconsole.log(isAdult(20));\n" },
      solution: { js: "// Write your arrow functions here\nconst triple = n => n * 3;\nconst isAdult = age => age >= 18;\n\nconsole.log(triple(5));\nconsole.log(isAdult(20));\n" },
      check: ({ get, code }) => {
        if (!code.js.includes('=>')) return 'Use arrow function syntax `=>`.';
        const triple = get('triple'), isAdult = get('isAdult');
        if (typeof triple !== 'function' || triple(5) !== 15) return '`triple(5)` should return 15.';
        if (typeof isAdult !== 'function' || isAdult(18) !== true || isAdult(12) !== false) return '`isAdult(18)` should return `true` and `isAdult(12)` should return `false`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Scope: where variables live',
      body: [
        "Variables created inside a function only exist **inside** that function. This is called **scope**:",
        { code: `const appName = "Notes";       // global: visible everywhere\n\nfunction show() {\n  const message = "Hi!";       // local: only inside show()\n  console.log(appName);        // ✅ can see globals\n  console.log(message);        // ✅\n}\n\nshow();\nconsole.log(message);          // ❌ ReferenceError: message is not defined`, lang: 'js' },
        "`let` and `const` are also **block-scoped**: a variable made inside any `{ }` (an `if`, a loop) disappears after that block.",
        "> Scope is a good thing: functions can use simple names like `total` or `i` without clashing with the rest of your program.",
      ],
    },
    {
      type: 'explain',
      title: 'Callbacks: passing functions around',
      body: [
        "In JavaScript, functions are values. You can store them in variables and **pass them to other functions**. A function passed in like this is called a **callback**:",
        { code: `function doTwice(action) {\n  action();\n  action();\n}\n\ndoTwice(() => console.log("Beep!"));`, lang: 'js' },
        { output: `Beep!\nBeep!` },
        "Arrays have a built-in method that takes a callback and runs it for each item: `forEach`.",
        { code: `const pets = ["cat", "dog"];\npets.forEach((pet, index) => {\n  console.log(\`\${index}: \${pet}\`);\n});`, lang: 'js' },
        { output: `0: cat\n1: dog` },
        "You'll use callbacks constantly: for array methods, button clicks and loading data.",
      ],
    },
    {
      type: 'explain',
      title: 'map, filter, find and reduce',
      body: [
        "These four array methods replace most loops in modern JavaScript. Each takes a callback:",
        { code: `const prices = [5, 12, 8, 20];\n\n// map: transform every item → a NEW array, same length\nconst withTax = prices.map(p => p * 1.2);       // [6, 14.4, 9.6, 24]\n\n// filter: keep the items where the callback returns true\nconst cheap = prices.filter(p => p < 10);        // [5, 8]\n\n// find: the FIRST item that matches (or undefined)\nconst firstBig = prices.find(p => p > 10);       // 12\n\n// reduce: boil the array down to ONE value\nconst total = prices.reduce((sum, p) => sum + p, 0); // 45`, lang: 'js' },
        "`reduce` is the trickiest. The callback gets the running total (`sum`) and the current item (`p`), and returns the new running total. The `0` is the starting value.",
        "None of these change the original array. They return something new.",
        "> You can chain them: `prices.filter(p => p < 10).map(p => p * 2)` → `[10, 16]`",
      ],
    },
    {
      type: 'try',
      title: 'filter and map',
      body: ["Chain two array methods together."],
      goal: "From `numbers`, keep only the **even** numbers with `filter`, then **double** them with `map`. Store the result in `doubledEvens` and print it. You should see `[4, 8, 12, 16, 20]`.",
      hint: [
        ["Even means `n % 2 === 0`."],
        [{ code: "const doubledEvens = numbers.filter(n => /* even? */).map(n => /* double */);", lang: 'js' }],
      ],
      starter: { js: "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n" },
      solution: { js: "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst doubledEvens = numbers.filter(n => n % 2 === 0).map(n => n * 2);\nconsole.log(doubledEvens);\n" },
      check: ({ code, logs }) => {
        if (!/\.filter\(/.test(code.js)) return 'Use `.filter()`.';
        if (!/\.map\(/.test(code.js)) return 'Use `.map()`.';
        return logs.includes('[4, 8, 12, 16, 20]') || 'The result should print `[4, 8, 12, 16, 20]`.';
      },
    },
    {
      type: 'try',
      title: 'Cart total with reduce',
      body: ["Every online shop needs to add up the cart."],
      goal: "Use `reduce` to add up all the prices in `cart`, and print the total.",
      hint: [{ code: "const total = cart.reduce((sum, price) => sum + price, 0);", lang: 'js' }],
      starter: { js: "const cart = [12.5, 7.25, 30];\n\n" },
      solution: { js: "const cart = [12.5, 7.25, 30];\n\nconst total = cart.reduce((sum, price) => sum + price, 0);\nconsole.log(total);\n" },
      check: ({ code, logs }) => {
        if (!/\.reduce\(/.test(code.js)) return 'Use `.reduce()`.';
        return logs.includes('49.75') || 'The total should be `49.75`.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'objects': [
    {
      type: 'explain',
      title: 'Objects: grouping related data',
      body: [
        "An array is an ordered list. An **object** stores data as named **properties** (key–value pairs). It's perfect for describing one *thing*:",
        { code: `const user = {\n  name: "Ana",\n  age: 28,\n  isAdmin: false,\n  hobbies: ["chess", "climbing"],\n};\n\nconsole.log(user.name);        // dot notation\nconsole.log(user["age"]);      // bracket notation\nconsole.log(user.hobbies[0]);`, lang: 'js' },
        { output: `Ana\n28\nchess` },
        "Use **dot notation** most of the time. Use **brackets** when the key is stored in a variable: `user[key]`.",
      ],
    },
    {
      type: 'try',
      title: 'Describe a book',
      body: ["Model your favourite book as an object."],
      goal: [
        "- Create a `const book` with `title`, `author` and `pages` properties",
        "- Print the book's title using dot notation",
      ],
      hint: "`const book = { title: \"Dune\", author: \"Frank Herbert\", pages: 412 };`",
      starter: { js: "" },
      solution: { js: "const book = {\n  title: \"Dune\",\n  author: \"Frank Herbert\",\n  pages: 412,\n};\n\nconsole.log(book.title);\n" },
      check: ({ get, logs }) => {
        const book = get('book');
        if (!book || typeof book !== 'object') return 'Create an object called `book`.';
        for (const key of ['title', 'author', 'pages']) if (!(key in book)) return `Your book needs a \`${key}\` property.`;
        if (typeof book.pages !== 'number') return '`pages` should be a number (no quotes).';
        return logs.includes(String(book.title)) || 'Print `book.title`.';
      },
    },
    {
      type: 'explain',
      title: 'Changing objects',
      body: [
        "You can update, add and delete properties at any time:",
        { code: `const car = { brand: "Toyota", year: 2015 };\n\ncar.year = 2020;          // update\ncar.color = "blue";       // add a new property\ndelete car.brand;         // remove\n\nconsole.log(car);`, lang: 'js' },
        { output: `{ year: 2020, color: "blue" }` },
        "Objects can contain other objects and arrays. This is called **nesting**, and real-world data is full of it:",
        { code: `const order = {\n  id: 1042,\n  customer: { name: "Ben", city: "Oslo" },\n  items: ["book", "pen"],\n};\n\nconsole.log(order.customer.city);  // Oslo\nconsole.log(order.items.length);   // 2`, lang: 'js' },
      ],
    },
    {
      type: 'explain',
      title: 'Methods and this',
      body: [
        "When a property holds a function, it's called a **method**. Inside a method, `this` refers to the object itself:",
        { code: `const player = {\n  name: "Kai",\n  score: 0,\n  addPoints(amount) {\n    this.score += amount;\n  },\n  describe() {\n    return \`\${this.name} has \${this.score} points\`;\n  },\n};\n\nplayer.addPoints(10);\nplayer.addPoints(5);\nconsole.log(player.describe());`, lang: 'js' },
        { output: `Kai has 15 points` },
        "This is how objects bundle **data** and **behaviour** together. Remember `\"hi\".toUpperCase()`? That's a method on a string!",
        "> Use the shorthand `addPoints(amount) { }` for methods. Arrow functions don't get their own `this`, so avoid them for methods.",
      ],
    },
    {
      type: 'try',
      title: 'A counter object',
      body: ["Build an object that remembers a count and can change it."],
      goal: [
        "Create a `const counter` object with:",
        "- a `count` property starting at `0`",
        "- an `increment()` method that adds 1 to `this.count`",
        "Then call `counter.increment()` twice and print `counter.count` (should be `2`).",
      ],
      hint: "Inside the method: `this.count++;`",
      starter: { js: "" },
      solution: { js: "const counter = {\n  count: 0,\n  increment() {\n    this.count++;\n  },\n};\n\ncounter.increment();\ncounter.increment();\nconsole.log(counter.count);\n" },
      check: ({ get, logs }) => {
        const c = get('counter');
        if (!c || typeof c !== 'object') return 'Create an object called `counter`.';
        if (typeof c.increment !== 'function') return 'Give `counter` an `increment()` method.';
        if (!logs.includes('2')) return 'Call `increment()` twice, then print `counter.count`. It should show `2`.';
        const before = c.count;
        c.increment();
        return c.count === before + 1 || '`increment()` should add 1 to `this.count`.';
      },
    },
    {
      type: 'explain',
      title: 'Arrays of objects',
      body: [
        "This is the most common data shape on the web: a list of things, each described by an object. Products in a shop, posts in a feed, tasks in a to-do app:",
        { code: `const products = [\n  { name: "Laptop", price: 999, inStock: true },\n  { name: "Mouse", price: 25, inStock: false },\n  { name: "Keyboard", price: 75, inStock: true },\n];\n\nconst available = products.filter(p => p.inStock);\nconst names = available.map(p => p.name);\nconsole.log(names);\n\nconst cheapest = products.find(p => p.price < 50);\nconsole.log(cheapest.name);`, lang: 'js' },
        { output: `["Laptop", "Keyboard"]\nMouse` },
        "Everything you learned about `map`, `filter`, `find` and `reduce` shines here.",
      ],
    },
    {
      type: 'try',
      title: 'Movie night',
      body: ["You have a list of movies. Find the good ones."],
      goal: [
        "- Use `filter` to keep movies with a `rating` of **8 or higher**",
        "- Use `map` to get just their **titles**",
        "- Print the result: `[\"Inception\", \"Spirited Away\"]`",
      ],
      hint: [{ code: "const titles = movies.filter(m => m.rating >= 8).map(m => m.title);", lang: 'js' }],
      starter: { js: "const movies = [\n  { title: \"Inception\", rating: 8.8 },\n  { title: \"Cats\", rating: 2.8 },\n  { title: \"Spirited Away\", rating: 8.6 },\n  { title: \"Average Movie\", rating: 6.1 },\n];\n\n" },
      solution: { js: "const movies = [\n  { title: \"Inception\", rating: 8.8 },\n  { title: \"Cats\", rating: 2.8 },\n  { title: \"Spirited Away\", rating: 8.6 },\n  { title: \"Average Movie\", rating: 6.1 },\n];\n\nconst titles = movies.filter(m => m.rating >= 8).map(m => m.title);\nconsole.log(titles);\n" },
      check: ({ code, logs }) => {
        if (!/\.filter\(/.test(code.js) || !/\.map\(/.test(code.js)) return 'Use both `.filter()` and `.map()`.';
        return logs.includes('["Inception", "Spirited Away"]') || 'The result should print `["Inception", "Spirited Away"]`.';
      },
    },
    {
      type: 'explain',
      title: 'Destructuring, spread and shorthand',
      body: [
        "The same modern shortcuts from arrays work on objects:",
        { code: `const user = { name: "Ana", age: 28, city: "Lima" };\n\n// Destructuring: pull properties into variables\nconst { name, city } = user;\nconsole.log(name, city);         // Ana Lima\n\n// Spread: copy an object and override some properties\nconst older = { ...user, age: 29 };\n\n// Shorthand: if the variable name matches the key\nconst score = 10;\nconst result = { name, score };  // same as { name: name, score: score }`, lang: 'js' },
        "You can also destructure directly in function parameters, which React uses all the time:",
        { code: `function describe({ name, age }) {\n  return \`\${name} is \${age}\`;\n}\ndescribe(user); // "Ana is 28"`, lang: 'js' },
      ],
    },
    {
      type: 'explain',
      title: 'Looping over objects and JSON',
      body: [
        "To loop over an object's properties, turn them into arrays first:",
        { code: `const stock = { apples: 5, pears: 2 };\n\nObject.keys(stock);     // ["apples", "pears"]\nObject.values(stock);   // [5, 2]\nObject.entries(stock);  // [["apples", 5], ["pears", 2]]\n\nfor (const [fruit, count] of Object.entries(stock)) {\n  console.log(\`\${fruit}: \${count}\`);\n}`, lang: 'js' },
        "### JSON",
        "**JSON** (JavaScript Object Notation) is the text format the whole web uses to send data. It looks almost exactly like JS objects, but keys must be in double quotes:",
        { code: `const user = { name: "Ana", age: 28 };\n\nconst text = JSON.stringify(user);  // object → string\nconsole.log(text);                  // {"name":"Ana","age":28}\n\nconst back = JSON.parse(text);      // string → object\nconsole.log(back.name);             // Ana`, lang: 'js' },
        "You'll use these when saving data in the browser and when talking to servers.",
      ],
    },
    {
      type: 'try',
      title: 'JSON round trip',
      body: ["Convert an object to JSON text and back again."],
      goal: [
        "- Convert `settings` to a JSON string with `JSON.stringify` and print it",
        "- Convert that string back to an object with `JSON.parse`, then print its `theme` property",
      ],
      hint: "`const json = JSON.stringify(settings);` then `const parsed = JSON.parse(json);`",
      starter: { js: "const settings = { theme: \"dark\", fontSize: 16, notifications: true };\n\n" },
      solution: { js: "const settings = { theme: \"dark\", fontSize: 16, notifications: true };\n\nconst json = JSON.stringify(settings);\nconsole.log(json);\n\nconst parsed = JSON.parse(json);\nconsole.log(parsed.theme);\n" },
      check: ({ code, logs }) => {
        if (!/JSON\.stringify\(/.test(code.js)) return 'Use `JSON.stringify()`.';
        if (!/JSON\.parse\(/.test(code.js)) return 'Use `JSON.parse()`.';
        if (!logs.includes('{"theme":"dark","fontSize":16,"notifications":true}')) return 'Print the JSON string.';
        return logs.includes('dark') || 'Print the `theme` property of the parsed object.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-grade-calculator': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "You're building a **grade report generator** for a class, the kind of logic that runs behind real school apps.",
        "You'll get an array of student objects, each with a name and a list of test scores. Your program will:",
        "- calculate each student's **average**",
        "- turn it into a **letter grade**",
        "- print a **report** line for every student",
        "- find the **top student** and the **class average**",
        "This project uses functions, arrays, objects, loops, conditions and array methods. Everything from Modules 2 and 4!",
      ],
    },
    {
      type: 'project',
      title: 'Grade calculator',
      body: ["Build it function by function. Test each one with `console.log` before moving on."],
      tasks: [
        "Write `average(scores)` that returns the average of an array of numbers",
        "Write `letterGrade(avg)` that returns `\"A\"` (90+), `\"B\"` (80+), `\"C\"` (70+), `\"D\"` (60+) or `\"F\"`",
        "Loop over `students` and print a line like `Ana: 91.7 (A)` for each one (round to 1 decimal with `.toFixed(1)`)",
        "Find and print the student with the highest average",
        "Calculate and print the class average (the average of all student averages)",
      ],
      hint: [
        ["`average` is a one-liner with `reduce`: sum the scores, then divide by `scores.length`."],
        ["Use `map` to build a new array like `{ name, avg }` for each student. That makes the rest much easier."],
        ["To find the top student, you could sort a copy: `[...results].sort((a, b) => b.avg - a.avg)[0]`, or use `reduce`."],
      ],
      starter: { js: "const students = [\n  { name: \"Ana\", scores: [92, 88, 95] },\n  { name: \"Ben\", scores: [75, 64, 80] },\n  { name: \"Cleo\", scores: [58, 71, 62] },\n  { name: \"Dev\", scores: [85, 90, 78] },\n];\n\n// 1. average(scores)\n\n\n// 2. letterGrade(avg)\n\n\n// 3. Print a report line for each student\n\n\n// 4. Top student\n\n\n// 5. Class average\n\n" },
      solution: { js: "const students = [\n  { name: \"Ana\", scores: [92, 88, 95] },\n  { name: \"Ben\", scores: [75, 64, 80] },\n  { name: \"Cleo\", scores: [58, 71, 62] },\n  { name: \"Dev\", scores: [85, 90, 78] },\n];\n\n// 1. average(scores)\nfunction average(scores) {\n  const total = scores.reduce((sum, s) => sum + s, 0);\n  return total / scores.length;\n}\n\n// 2. letterGrade(avg)\nfunction letterGrade(avg) {\n  if (avg >= 90) return \"A\";\n  if (avg >= 80) return \"B\";\n  if (avg >= 70) return \"C\";\n  if (avg >= 60) return \"D\";\n  return \"F\";\n}\n\n// 3. Print a report line for each student\nconst results = students.map(s => ({ name: s.name, avg: average(s.scores) }));\n\nfor (const r of results) {\n  console.log(`${r.name}: ${r.avg.toFixed(1)} (${letterGrade(r.avg)})`);\n}\n\n// 4. Top student\nconst topStudent = results.reduce((best, r) => (r.avg > best.avg ? r : best));\nconsole.log(`🏆 Top student: ${topStudent.name}`);\n\n// 5. Class average\nconst classAvg = average(results.map(r => r.avg));\nconsole.log(`Class average: ${classAvg.toFixed(1)}`);\n" },
      check: ({ get, logs }) => {
        const average = get('average'), letterGrade = get('letterGrade');
        if (typeof average !== 'function') return 'Write a function called `average`.';
        if (Math.abs(average([90, 80]) - 85) > 0.001) return '`average([90, 80])` should return 85.';
        if (typeof letterGrade !== 'function') return 'Write a function called `letterGrade`.';
        const expect = { 95: 'A', 90: 'A', 85: 'B', 72: 'C', 61: 'D', 40: 'F' };
        for (const [n, g] of Object.entries(expect)) if (letterGrade(Number(n)) !== g) return `\`letterGrade(${n})\` should return "${g}".`;
        if (!logs.some((l) => l.includes('Ana') && l.includes('A'))) return 'Print a report line for each student, e.g. `Ana: 91.7 (A)`.';
        if (!logs.some((l) => /Cleo/.test(l) && /\bD\b|\(D\)/.test(l))) return 'Cleo\'s line should show a D.';
        return true;
      },
      success: "Your grade calculator works! 🎓 Try adding a new student to the array and run it again.",
    },
    {
      type: 'explain',
      title: 'Module 4 complete',
      body: [
        "You've learned how real programs organise data and logic:",
        "- **Arrays**: ordered lists, with methods to add, remove, search and slice",
        "- **Functions**: parameters, return values, arrow functions and scope",
        "- **Callbacks** and the big four: `map`, `filter`, `find`, `reduce`",
        "- **Objects**: properties, methods, `this`, nesting, destructuring and JSON",
        "Next up is **Module 5: DOM & Events**, where JavaScript and HTML finally meet. Your code will start changing real web pages and reacting to clicks.",
      ],
    },
  ],
});
