/* Module 2 — Interactive JavaScript */
Course.addContent('m02', {

  /* ---------------------------------------------------------------- */
  'variables-types': [
    {
      type: 'explain',
      title: 'Meet JavaScript',
      body: [
        "JavaScript is the programming language of the web. HTML and CSS *describe* a page; JavaScript gives it *behaviour*. It reacts to clicks, does calculations, loads data and changes the page.",
        "We'll start with pure logic in the **console**, a place where your code can print messages. The command to print is `console.log()`:",
        { code: `console.log("Hello!");\nconsole.log(2 + 3);`, lang: 'js' },
        { output: `Hello!\n5` },
        "Each line is a **statement**: an instruction. Statements usually end with a semicolon `;`.",
        "> Every browser has a console. Press **F12** (or right-click → Inspect) and open the **Console** tab. You can type JavaScript straight into it!",
      ],
    },
    {
      type: 'try',
      title: 'Print a message',
      body: ["In JavaScript lessons the editor only shows a **console**. Write your code, then press **▶ Run**."],
      goal: "Use `console.log()` to print **Hello, JavaScript!**",
      hint: "Text must be inside quotes: `console.log(\"Hello, JavaScript!\");`",
      starter: { js: "// Print a message below\n" },
      solution: { js: "// Print a message below\nconsole.log(\"Hello, JavaScript!\");\n" },
      check: ({ logs, norm }) => logs.some((l) => norm(l).includes('hello, javascript')) || 'Nothing printed "Hello, JavaScript!" yet. Did you press Run?',
    },
    {
      type: 'explain',
      title: 'Variables: boxes with labels',
      body: [
        "A **variable** stores a value so you can use it later. Think of it as a labelled box.",
        { code: `let score = 0;\nconst playerName = "Sam";\n\nconsole.log(playerName);\nconsole.log(score);`, lang: 'js' },
        { output: `Sam\n0` },
        "- `let` creates a variable whose value **can change** later.",
        "- `const` creates a variable that **can't be reassigned**.",
        "- The `=` sign means *assign*: put the value on the right into the box on the left.",
        "Variable names are usually written in **camelCase**: first word lowercase, each following word capitalised (`playerName`, `totalPrice`). They can't contain spaces or start with a number.",
        "> You may see `var` in older code. It's the old way to make variables. Use `let` and `const` instead.",
      ],
    },
    {
      type: 'try',
      title: 'Create some variables',
      body: ["Let's store some information about you."],
      goal: [
        "- Create a `const` called `firstName` holding your name (in quotes)",
        "- Create a `let` called `age` holding a number (no quotes)",
        "- Print both with `console.log()`",
      ],
      hint: "`const firstName = \"Alex\";` then `console.log(firstName);`",
      starter: { js: "// Create your variables here\n\n\n// Print them\n" },
      solution: { js: "// Create your variables here\nconst firstName = \"Alex\";\nlet age = 25;\n\n// Print them\nconsole.log(firstName);\nconsole.log(age);\n" },
      check: ({ code, logs }) => {
        if (!/const\s+firstName\s*=/.test(code.js)) return 'Create a variable with `const firstName = ...`';
        if (!/let\s+age\s*=/.test(code.js)) return 'Create a variable with `let age = ...`';
        if (logs.length < 2) return 'Print both variables with `console.log()`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Changing values: let vs const',
      body: [
        "A `let` variable can be given a new value. Notice there's no `let` the second time:",
        { code: `let lives = 3;\nlives = 2;\nconsole.log(lives);`, lang: 'js' },
        { output: `2` },
        "Try that with `const` and you get an error:",
        { code: `const lives = 3;\nlives = 2;`, lang: 'js' },
        { output: `TypeError: Assignment to constant variable.` },
        "> Rule of thumb: use `const` by default. Switch to `let` only when you know the value needs to change. This makes your code easier to reason about.",
      ],
    },
    {
      type: 'explain',
      title: 'Data types',
      body: [
        "Every value in JavaScript has a **type**. The most common ones:",
        { code: `const name = "Sam";         // string: text, in quotes\nconst age = 28;             // number: whole or decimal\nconst price = 9.99;         // also a number\nconst isOnline = true;      // boolean: true or false\nlet nickname;               // undefined: no value yet\nconst middleName = null;    // null: deliberately empty`, lang: 'js' },
        "You can check a value's type with `typeof`:",
        { code: `console.log(typeof "Sam");\nconsole.log(typeof 28);\nconsole.log(typeof true);`, lang: 'js' },
        { output: `string\nnumber\nboolean` },
        "> `\"28\"` (with quotes) is a **string**, not a number. That difference will matter soon!",
      ],
    },
    {
      type: 'try',
      title: 'Check the types',
      body: ["Three variables are ready for you."],
      goal: "Print the `typeof` each variable, so you see `string`, `number` and `boolean` in the console.",
      hint: "`console.log(typeof city);`, and the same for the others.",
      starter: { js: "const city = \"Lisbon\";\nconst population = 545000;\nconst isCapital = true;\n\n// Print the type of each variable\n" },
      solution: { js: "const city = \"Lisbon\";\nconst population = 545000;\nconst isCapital = true;\n\n// Print the type of each variable\nconsole.log(typeof city);\nconsole.log(typeof population);\nconsole.log(typeof isCapital);\n" },
      check: ({ logs }) => ['string', 'number', 'boolean'].every((t) => logs.includes(t)) || 'The console should show `string`, `number` and `boolean`.',
    },
    {
      type: 'try',
      title: 'Debug: fix the error',
      body: [
        "Run this code. It crashes with an error in the console.",
        "> Reading errors is a core developer skill. The message tells you *what* went wrong, and the line number tells you *where*.",
      ],
      goal: "Fix the code so it prints `15`.",
      hint: "`score` is changed on line 2, so it can't be a `const`.",
      starter: { js: "const score = 10;\nscore = score + 5;\nconsole.log(score);\n" },
      solution: { js: "let score = 10;\nscore = score + 5;\nconsole.log(score);\n" },
      check: ({ logs }) => logs.includes('15') || 'The console should print `15` with no errors.',
      success: "You read an error message and fixed it. That's most of programming, honestly.",
    },
  ],

  /* ---------------------------------------------------------------- */
  'strings-numbers': [
    {
      type: 'explain',
      title: 'Doing math',
      body: [
        "JavaScript can calculate with the usual operators:",
        { code: `console.log(10 + 3);   // addition\nconsole.log(10 - 3);   // subtraction\nconsole.log(10 * 3);   // multiplication\nconsole.log(10 / 4);   // division\nconsole.log(10 % 3);   // remainder (modulo)\nconsole.log(2 ** 3);   // exponent: 2 to the power of 3`, lang: 'js' },
        { output: `13\n7\n30\n2.5\n1\n8` },
        "Like in school math, `*` and `/` happen before `+` and `-`. Use parentheses to control the order:",
        { code: `console.log(2 + 3 * 4);    // 14\nconsole.log((2 + 3) * 4);  // 20`, lang: 'js' },
        "Text after `//` is a **comment**. JavaScript ignores it.",
      ],
    },
    {
      type: 'try',
      title: 'Rectangle calculator',
      body: ["Variables and math work great together."],
      goal: [
        "Using the `width` and `height` variables:",
        "- calculate and print the **area** (width × height)",
        "- calculate and print the **perimeter** (2 × width + 2 × height)",
      ],
      hint: "`const area = width * height;` then `console.log(area);`",
      starter: { js: "const width = 7;\nconst height = 5;\n\n// Calculate the area and perimeter\n" },
      solution: { js: "const width = 7;\nconst height = 5;\n\n// Calculate the area and perimeter\nconst area = width * height;\nconst perimeter = 2 * width + 2 * height;\n\nconsole.log(area);\nconsole.log(perimeter);\n" },
      check: ({ logs, code }) => {
        if (!/width\s*\*\s*height|height\s*\*\s*width/.test(code.js)) return 'Calculate with the variables (`width * height`), not by typing the answer.';
        if (!logs.includes('35')) return 'The area should print `35`.';
        if (!logs.includes('24')) return 'The perimeter should print `24`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'The remainder operator %',
      body: [
        "`%` gives the **remainder** after dividing. It sounds niche, but it's super useful:",
        { code: `console.log(10 % 2);  // 0, so 10 is even\nconsole.log(7 % 2);   // 1, so 7 is odd\nconsole.log(17 % 5);  // 2: 17 = 5*3 + 2`, lang: 'js' },
        { output: `0\n1\n2` },
        "If `number % 2` is `0`, the number is **even**. You'll use this trick in the conditions and loops chapters.",
      ],
    },
    {
      type: 'explain',
      title: 'Strings and template literals',
      body: [
        "Strings (text) can use double quotes, single quotes or backticks. Join strings with `+`:",
        { code: `const first = "Ada";\nconst last = 'Lovelace';\nconsole.log(first + " " + last);`, lang: 'js' },
        { output: `Ada Lovelace` },
        "**Template literals** use backticks and let you drop variables straight in with `${}`. They're much easier to read:",
        { code: "const item = \"coffee\";\nconst price = 3.5;\nconsole.log(`One ${item} costs $${price}.`);\nconsole.log(`Two cost $${price * 2}.`);", lang: 'js' },
        { output: `One coffee costs $3.5.\nTwo cost $7.` },
        "> The backtick key is usually at the top left of your keyboard, under Esc.",
      ],
    },
    {
      type: 'try',
      title: 'Introduce yourself',
      body: ["Template literals are how you'll build most messages from now on."],
      goal: "Use a **template literal** to print: `Hi, I'm <name> from <city>!` using the `name` and `city` variables.",
      hint: ["Put the whole message in backticks:", { code: "console.log(`Hi, I'm ${name} from ${city}!`);", lang: 'js' }],
      starter: { js: "const name = \"Maya\";\nconst city = \"Toronto\";\n\n// Print the greeting with a template literal\n" },
      solution: { js: "const name = \"Maya\";\nconst city = \"Toronto\";\n\n// Print the greeting with a template literal\nconsole.log(`Hi, I'm ${name} from ${city}!`);\n" },
      check: ({ code, logs }) => {
        if (!code.js.includes('`') || !code.js.includes('${')) return 'Use backticks and `${}` to build the message.';
        const name = (/const\s+name\s*=\s*["'`]([^"'`]*)/.exec(code.js) || [])[1];
        const city = (/const\s+city\s*=\s*["'`]([^"'`]*)/.exec(code.js) || [])[1];
        if (!logs.some((l) => l.includes(name) && l.includes(city))) return 'Your message should include both the name and the city.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'String properties and methods',
      body: [
        "Strings come with built-in tools. `.length` tells you how many characters a string has, and **methods** (functions that belong to a value) transform it:",
        { code: `const word = "JavaScript";\n\nconsole.log(word.length);           // 10\nconsole.log(word.toUpperCase());    // JAVASCRIPT\nconsole.log(word.toLowerCase());    // javascript\nconsole.log(word.includes("Script")); // true\nconsole.log(word[0]);               // J (first character)\nconsole.log(word.slice(0, 4));      // Java\nconsole.log("  hi  ".trim());       // "hi" (spaces removed)`, lang: 'js' },
        "Counting starts at **0** in JavaScript, so `word[0]` is the first character and `word[1]` is the second.",
        "> Methods don't change the original string. `word.toUpperCase()` returns a *new* string and `word` stays the same.",
      ],
    },
    {
      type: 'try',
      title: 'Explore a string',
      body: ["Let's poke at a string with its built-in tools."],
      goal: [
        "Using the `language` variable, print:",
        "- its length",
        "- the word in all capitals",
        "- its first character",
      ],
      hint: "`language.length`, `language.toUpperCase()` and `language[0]`",
      starter: { js: "const language = \"JavaScript\";\n\n" },
      solution: { js: "const language = \"JavaScript\";\n\nconsole.log(language.length);\nconsole.log(language.toUpperCase());\nconsole.log(language[0]);\n" },
      check: ({ logs }) => {
        if (!logs.includes('10')) return 'Print the length (it should be `10`).';
        if (!logs.includes('JAVASCRIPT')) return 'Print the uppercase version: `JAVASCRIPT`.';
        if (!logs.includes('J')) return 'Print the first character: `J`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Shortcuts for updating numbers',
      body: [
        "Updating a variable based on its current value is so common that there are shortcuts:",
        { code: `let points = 10;\n\npoints = points + 5;  // long way: 15\npoints += 5;          // shortcut: 20\npoints -= 3;          // 17\npoints *= 2;          // 34\npoints++;             // add 1: 35\npoints--;             // subtract 1: 34\n\nconsole.log(points);`, lang: 'js' },
        { output: `34` },
        "`+=` works on strings too: `message += \"!\"` adds an exclamation mark to the end.",
      ],
    },
    {
      type: 'explain',
      title: 'Watch out: strings vs numbers',
      body: [
        "When you use `+` with a string, JavaScript **joins** instead of adding:",
        { code: `console.log(5 + 1);      // 6\nconsole.log("5" + 1);    // "51"  ← joined, not added!\nconsole.log("5" * 2);    // 10    ← * converts to a number`, lang: 'js' },
        "This is a classic bug, especially with user input, which always arrives as a string. Convert explicitly with `Number()`:",
        { code: `const input = "5";\nconsole.log(Number(input) + 1);  // 6\nconsole.log(String(42));         // "42"`, lang: 'js' },
        "If the text isn't a valid number you get `NaN` (\"Not a Number\"): `Number(\"hello\")` → `NaN`.",
      ],
    },
    {
      type: 'try',
      title: 'Debug: the 510 bug',
      body: ["This code is supposed to add two quantities from a form, but it prints `510`."],
      goal: "Fix it so it prints `15`. Leave the quotes in `a` and `b` (pretend they came from a form).",
      hint: "Convert each one with `Number()` before adding.",
      starter: { js: "const a = \"5\";\nconst b = \"10\";\n\nconsole.log(a + b);\n" },
      solution: { js: "const a = \"5\";\nconst b = \"10\";\n\nconsole.log(Number(a) + Number(b));\n" },
      check: ({ logs, code }) => {
        if (!/const\s+a\s*=\s*["']5["']/.test(code.js)) return 'Keep `a` as the string `"5"`. Convert it when you add instead.';
        return logs.includes('15') || 'The console should print `15`.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'comparisons': [
    {
      type: 'explain',
      title: 'Comparing values',
      body: [
        "Programs constantly ask questions: *Is the player's score high enough? Is the password long enough?* Comparison operators answer them with a **boolean**: `true` or `false`.",
        { code: `console.log(10 > 5);   // greater than
console.log(10 < 5);   // less than
console.log(10 >= 10); // greater than or equal
console.log(3 <= 2);   // less than or equal`, lang: 'js' },
        { output: `true\nfalse\ntrue\nfalse` },
        "You can store the answer in a variable: `const canVote = age >= 18;`",
      ],
    },
    {
      type: 'explain',
      title: 'Equality: === vs ==',
      body: [
        "To check if two values are equal, use **triple equals** `===`. To check they're *not* equal, use `!==`:",
        { code: `console.log(5 === 5);      // true\nconsole.log(5 === "5");    // false: different types\nconsole.log("cat" !== "dog"); // true`, lang: 'js' },
        "There's also a double equals `==`, which converts types before comparing. That leads to surprises:",
        { code: `console.log(5 == "5");   // true  😬\nconsole.log(0 == "");    // true  😱`, lang: 'js' },
        "> Always use `===` and `!==`. Remember: a single `=` *assigns* a value, while `===` *compares*.",
      ],
    },
    {
      type: 'try',
      title: 'Test equality',
      body: ["See the difference between strict and loose equality for yourself."],
      goal: [
        "Print these three comparisons, in this order:",
        "1. `5 === \"5\"`",
        "2. `5 == \"5\"`",
        "3. `10 !== 20`",
      ],
      hint: "`console.log(5 === \"5\");`, and so on.",
      starter: { js: "// Print the three comparisons\n" },
      solution: { js: "// Print the three comparisons\nconsole.log(5 === \"5\");\nconsole.log(5 == \"5\");\nconsole.log(10 !== 20);\n" },
      check: ({ logs }) => logs.slice(0, 3).join(',') === 'false,true,true' || 'Expected the console to show `false`, `true`, `true` in that order.',
      success: "`===` checked the type too, so `5` and `\"5\"` weren't equal.",
    },
    {
      type: 'explain',
      title: 'Combining conditions: && || !',
      body: [
        "**Logical operators** combine booleans:",
        "- `&&` (AND): true only if **both** sides are true.",
        "- `||` (OR): true if **at least one** side is true.",
        "- `!` (NOT): flips true to false and false to true.",
        { code: `const age = 25;\nconst hasLicense = false;\n\nconsole.log(age >= 18 && hasLicense);  // false: needs both\nconsole.log(age >= 18 || hasLicense);  // true: one is enough\nconsole.log(!hasLicense);              // true`, lang: 'js' },
        { output: `false\ntrue\ntrue` },
      ],
    },
    {
      type: 'try',
      title: 'Can they enter?',
      body: ["A concert lets you in if you're **18 or older AND** have a ticket."],
      goal: "Create a `const canEnter` using `&&` with `age` and `hasTicket`, then print it.",
      hint: "`const canEnter = age >= 18 && hasTicket;`",
      starter: { js: "const age = 20;\nconst hasTicket = true;\n\n// Can this person enter?\n" },
      solution: { js: "const age = 20;\nconst hasTicket = true;\n\n// Can this person enter?\nconst canEnter = age >= 18 && hasTicket;\nconsole.log(canEnter);\n" },
      check: ({ code, logs }) => {
        if (!/const\s+canEnter\s*=/.test(code.js)) return 'Create a variable called `canEnter`.';
        if (!code.js.includes('&&')) return 'Use the `&&` operator.';
        const age = Number((/const\s+age\s*=\s*(\d+)/.exec(code.js) || [])[1]);
        const ticket = /const\s+hasTicket\s*=\s*true/.test(code.js);
        const expected = String(age >= 18 && ticket);
        return logs.includes(expected) || `With these values, \`canEnter\` should print \`${expected}\`.`;
      },
      success: "Try changing `age` to 16 or `hasTicket` to false and run it again.",
    },
    {
      type: 'explain',
      title: 'Truthy and falsy',
      body: [
        "JavaScript can treat *any* value as true or false. These six values are **falsy** (they act like `false`):",
        "- `false`, `0`, `\"\"` (empty string), `null`, `undefined` and `NaN`",
        "**Everything else is truthy**, including `\"0\"`, `\" \"` (a space) and `\"false\"`!",
        { code: `console.log(Boolean(0));        // false\nconsole.log(Boolean("hello"));  // true\nconsole.log(Boolean(""));       // false\nconsole.log(Boolean("0"));      // true`, lang: 'js' },
        "A handy trick: `||` returns the first truthy value, which is perfect for **default values**:",
        { code: `const username = "";\nconst display = username || "Guest";\nconsole.log(display);`, lang: 'js' },
        { output: `Guest` },
      ],
    },
    {
      type: 'try',
      title: 'Default values with ||',
      body: ["The user left the name field empty. Let's show a sensible default instead."],
      goal: "Create a `const name` that uses `||` to fall back to `\"Guest\"` when `input` is empty, then print `name`.",
      hint: "`const name = input || \"Guest\";`",
      starter: { js: "const input = \"\";\n\n" },
      solution: { js: "const input = \"\";\n\nconst name = input || \"Guest\";\nconsole.log(name);\n" },
      check: ({ code, logs }) => {
        if (!code.js.includes('||')) return 'Use the `||` operator.';
        return logs.includes('Guest') || 'The console should print `Guest`.';
      },
      success: "Now set `input` to your name and run it. The default disappears.",
    },
  ],

  /* ---------------------------------------------------------------- */
  'conditions': [
    {
      type: 'explain',
      title: 'Making decisions with if',
      body: [
        "An `if` statement runs code **only when** a condition is true:",
        { code: `const temperature = 32;\n\nif (temperature > 30) {\n  console.log("It's hot! Stay hydrated.");\n}\n\nconsole.log("Have a nice day.");`, lang: 'js' },
        { output: `It's hot! Stay hydrated.\nHave a nice day.` },
        "- The condition goes in parentheses `( )`.",
        "- The code to run goes in curly braces `{ }`. This is called a **block**.",
        "If `temperature` were 20, only \"Have a nice day.\" would print.",
      ],
    },
    {
      type: 'explain',
      title: 'else and else if',
      body: [
        "`else` runs when the condition is false. `else if` lets you check more conditions in order:",
        { code: `const score = 72;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 70) {\n  console.log("Grade: B");\n} else if (score >= 50) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}`, lang: 'js' },
        { output: `Grade: B` },
        "JavaScript checks each condition **from top to bottom** and runs only the **first** block that matches. 72 is also ≥ 50, but by then the B branch has already won.",
        "> Order matters! If you checked `score >= 50` first, a 95 would get a C.",
      ],
    },
    {
      type: 'try',
      title: 'Weather advisor',
      body: ["Write a program that describes the temperature."],
      goal: [
        "Using `temperature`, print exactly one word:",
        "- `Hot` if it's above 25",
        "- `Warm` if it's above 15",
        "- `Cold` otherwise",
      ],
      hint: "Use `if (temperature > 25) { ... } else if (temperature > 15) { ... } else { ... }`",
      starter: { js: "const temperature = 30;\n\n" },
      solution: { js: "const temperature = 30;\n\nif (temperature > 25) {\n  console.log(\"Hot\");\n} else if (temperature > 15) {\n  console.log(\"Warm\");\n} else {\n  console.log(\"Cold\");\n}\n" },
      check: ({ code, logs }) => {
        if (!/else\s+if/.test(code.js) || !/\belse\s*\{/.test(code.js)) return 'Use `if`, `else if` and `else`.';
        const t = Number((/const\s+temperature\s*=\s*(-?\d+(?:\.\d+)?)/.exec(code.js) || [])[1]);
        const expected = t > 25 ? 'Hot' : t > 15 ? 'Warm' : 'Cold';
        if (logs.length !== 1) return 'Your program should print exactly one word.';
        return logs[0] === expected || `For ${t}°, the answer should be \`${expected}\`.`;
      },
      success: "Change `temperature` to 20, then 5, and run it again to test every branch.",
    },
    {
      type: 'explain',
      title: 'The ternary operator',
      body: [
        "For a simple either/or choice, the **ternary operator** is a compact `if/else` in one line:",
        { code: `const age = 20;\nconst status = age >= 18 ? "adult" : "minor";\nconsole.log(status);`, lang: 'js' },
        { output: `adult` },
        "Read it as: *condition* `?` *value if true* `:` *value if false*.",
        "> Use ternaries for choosing between two **values**. For running different blocks of code, a regular `if/else` is clearer.",
      ],
    },
    {
      type: 'try',
      title: 'Even or odd?',
      body: ["Remember the `%` remainder trick from the last chapter?"],
      goal: "Use a **ternary** to set `type` to `\"even\"` or `\"odd\"`, then print: `7 is odd` (using the `number` variable).",
      hint: "`const type = number % 2 === 0 ? \"even\" : \"odd\";` then use a template literal.",
      starter: { js: "const number = 7;\n\n" },
      solution: { js: "const number = 7;\n\nconst type = number % 2 === 0 ? \"even\" : \"odd\";\nconsole.log(`${number} is ${type}`);\n" },
      check: ({ code, logs }) => {
        if (!/\?[^:]+:/.test(code.js)) return 'Use the ternary operator `condition ? a : b`.';
        const n = Number((/const\s+number\s*=\s*(-?\d+)/.exec(code.js) || [])[1]);
        const expected = `${n} is ${n % 2 === 0 ? 'even' : 'odd'}`;
        return logs.includes(expected) || `The console should print \`${expected}\`.`;
      },
    },
    {
      type: 'explain',
      title: 'switch statements',
      body: [
        "When you compare **one value** against many options, `switch` can be cleaner than a long `else if` chain:",
        { code: `const fruit = "banana";\n\nswitch (fruit) {\n  case "apple":\n    console.log("Apples are $1.20");\n    break;\n  case "banana":\n    console.log("Bananas are $0.50");\n    break;\n  default:\n    console.log("Sorry, we don't sell that.");\n}`, lang: 'js' },
        { output: `Bananas are $0.50` },
        "- Each `case` is compared with `===`.",
        "- `break` stops the switch. Without it, the code \"falls through\" into the next case!",
        "- `default` runs if no case matches, just like `else`.",
      ],
    },
    {
      type: 'try',
      title: 'Day of the week',
      body: ["Turn a day number into a name."],
      goal: "Use a `switch` on `day` to print the weekday name, where `1` is `Monday` and `7` is `Sunday`. Add a `default` that prints `Invalid day`.",
      hint: "Write `case 1:` with `console.log(\"Monday\");` and `break;`, and repeat for each day.",
      starter: { js: "const day = 3;\n\n" },
      solution: { js: "const day = 3;\n\nswitch (day) {\n  case 1:\n    console.log(\"Monday\");\n    break;\n  case 2:\n    console.log(\"Tuesday\");\n    break;\n  case 3:\n    console.log(\"Wednesday\");\n    break;\n  case 4:\n    console.log(\"Thursday\");\n    break;\n  case 5:\n    console.log(\"Friday\");\n    break;\n  case 6:\n    console.log(\"Saturday\");\n    break;\n  case 7:\n    console.log(\"Sunday\");\n    break;\n  default:\n    console.log(\"Invalid day\");\n}\n" },
      check: ({ code, logs }) => {
        if (!/switch\s*\(/.test(code.js)) return 'Use a `switch` statement.';
        if (!/default\s*:/.test(code.js)) return 'Add a `default` case.';
        if ((code.js.match(/case\s/g) || []).length < 7) return 'Add a `case` for each of the 7 days.';
        const d = Number((/const\s+day\s*=\s*(-?\d+)/.exec(code.js) || [])[1]);
        const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const expected = names[d - 1] || 'Invalid day';
        if (logs.length !== 1) return 'Exactly one line should print. Did you forget a `break`?';
        return logs[0] === expected || `For day ${d} the answer should be \`${expected}\`.`;
      },
    },
    {
      type: 'explain',
      title: 'Writing readable conditions',
      body: [
        "Conditions can combine logical operators, and `if` statements can go inside each other (**nesting**):",
        { code: `const isWeekend = true;\nconst isRaining = false;\n\nif (isWeekend && !isRaining) {\n  console.log("Let's go to the park!");\n} else if (isWeekend) {\n  console.log("Movie day at home.");\n} else {\n  console.log("Off to work.");\n}`, lang: 'js' },
        { output: `Let's go to the park!` },
        "Tips for clean conditions:",
        "- Name booleans like questions: `isLoggedIn`, `hasItems`, `canEdit`.",
        "- Avoid deep nesting. Combining conditions with `&&` is often flatter and clearer.",
        "- Write `if (isReady)`, not `if (isReady === true)`.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'loops': [
    {
      type: 'explain',
      title: 'Why loops?',
      body: [
        "Imagine printing the numbers 1 to 100. You *could* write 100 `console.log` lines… or use a **loop** that repeats code for you.",
        "The `for` loop is the most common:",
        { code: `for (let i = 1; i <= 3; i++) {\n  console.log("Lap " + i);\n}`, lang: 'js' },
        { output: `Lap 1\nLap 2\nLap 3` },
        "It has three parts, separated by semicolons:",
        "1. **Start**: `let i = 1` runs once, before the loop begins.",
        "2. **Condition**: `i <= 3` is checked before each lap. The loop stops when it's false.",
        "3. **Update**: `i++` runs after each lap.",
      ],
    },
    {
      type: 'try',
      title: 'Count to five',
      body: ["Your first loop!"],
      goal: "Use a `for` loop to print the numbers **1 to 5**, each on its own line.",
      hint: "`for (let i = 1; i <= 5; i++) { console.log(i); }`",
      starter: { js: "// Write your loop here\n" },
      solution: { js: "// Write your loop here\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n" },
      check: ({ code, logs }) => {
        if (!/for\s*\(/.test(code.js)) return 'Use a `for` loop.';
        return logs.join(',') === '1,2,3,4,5' || 'The console should show 1, 2, 3, 4, 5, one number per line.';
      },
    },
    {
      type: 'try',
      title: 'Even numbers',
      body: ["The update part doesn't have to be `i++`. You can count in any steps."],
      goal: "Print the even numbers from **2 to 20** using a `for` loop.",
      hint: ["Start at 2 and add 2 each time: `i += 2`.", "Alternatively, loop through 1–20 and only print when `i % 2 === 0`."],
      starter: { js: "" },
      solution: { js: "for (let i = 2; i <= 20; i += 2) {\n  console.log(i);\n}\n" },
      check: ({ code, logs }) => {
        if (!/for\s*\(/.test(code.js)) return 'Use a `for` loop.';
        return logs.join(',') === '2,4,6,8,10,12,14,16,18,20' || 'Expected 2, 4, 6 … 20, one per line.';
      },
    },
    {
      type: 'explain',
      title: 'while loops',
      body: [
        "A `while` loop keeps going **as long as** its condition is true. Use it when you don't know in advance how many laps you need:",
        { code: `let balance = 100;\nlet months = 0;\n\nwhile (balance < 200) {\n  balance = balance * 1.1;  // grows 10% each month\n  months++;\n}\n\nconsole.log("Doubled after " + months + " months");`, lang: 'js' },
        { output: `Doubled after 8 months` },
        "> ⚠️ If the condition never becomes false, you get an **infinite loop** and the page freezes. Always make sure something inside the loop moves it towards the end. (This editor stops loops that run longer than 3 seconds.)",
      ],
    },
    {
      type: 'try',
      title: 'Countdown',
      body: ["Houston, we have a loop."],
      goal: "Use a `while` loop to count down from **10 to 1**, then print `Liftoff!` after the loop.",
      hint: "Start with `let count = 10;`, loop `while (count >= 1)`, and decrease with `count--` inside the loop.",
      starter: { js: "let count = 10;\n\n" },
      solution: { js: "let count = 10;\n\nwhile (count >= 1) {\n  console.log(count);\n  count--;\n}\n\nconsole.log(\"Liftoff!\");\n" },
      check: ({ code, logs }) => {
        if (!/while\s*\(/.test(code.js)) return 'Use a `while` loop.';
        if (logs.slice(0, 10).join(',') !== '10,9,8,7,6,5,4,3,2,1') return 'The countdown should go 10, 9, 8 … 1.';
        return (logs[10] || '').includes('Liftoff') || 'Print `Liftoff!` after the loop finishes.';
      },
      success: "🚀",
    },
    {
      type: 'explain',
      title: 'break and continue',
      body: [
        "Two keywords give you more control inside loops:",
        "- `break` exits the loop **immediately**.",
        "- `continue` skips the rest of **this lap** and jumps to the next one.",
        { code: `for (let i = 1; i <= 10; i++) {\n  if (i === 3) continue; // skip 3\n  if (i === 6) break;    // stop at 6\n  console.log(i);\n}`, lang: 'js' },
        { output: `1\n2\n4\n5` },
      ],
    },
    {
      type: 'try',
      title: 'FizzBuzz',
      body: [
        "FizzBuzz is a famous programming exercise, and has even been used in job interviews! It combines loops, conditions and `%`.",
      ],
      goal: [
        "Loop from **1 to 15**. For each number print:",
        "- `FizzBuzz` if it's divisible by both 3 and 5",
        "- `Fizz` if it's divisible by 3",
        "- `Buzz` if it's divisible by 5",
        "- otherwise, the number itself",
      ],
      hint: [
        ["\"Divisible by 3\" means `i % 3 === 0`."],
        ["Check the FizzBuzz case **first**. Otherwise 15 would match the Fizz branch and stop there."],
      ],
      starter: { js: "for (let i = 1; i <= 15; i++) {\n  \n}\n" },
      solution: { js: "for (let i = 1; i <= 15; i++) {\n  if (i % 3 === 0 && i % 5 === 0) {\n    console.log(\"FizzBuzz\");\n  } else if (i % 3 === 0) {\n    console.log(\"Fizz\");\n  } else if (i % 5 === 0) {\n    console.log(\"Buzz\");\n  } else {\n    console.log(i);\n  }\n}\n" },
      check: ({ logs }) => {
        const expected = ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'];
        for (let i = 0; i < expected.length; i++) {
          if (logs[i] !== expected[i]) return `Line ${i + 1} should be \`${expected[i]}\` but got \`${logs[i] === undefined ? 'nothing' : logs[i]}\`.`;
        }
        return logs.length === 15 || 'Print exactly 15 lines.';
      },
      success: "You solved FizzBuzz. Plenty of people applying for programming jobs can't!",
    },
    {
      type: 'explain',
      title: 'for…of: looping over things',
      body: [
        "`for…of` goes through each item in something you can loop over. Strings work, letter by letter:",
        { code: `for (const letter of "Hi!") {\n  console.log(letter);\n}`, lang: 'js' },
        { output: `H\ni\n!` },
        "No counter needed! You'll use `for…of` a lot with **arrays** (lists of values) in Module 4.",
      ],
    },
    {
      type: 'try',
      title: 'Count the vowels',
      body: ["Combine a loop, a condition and a counter variable. This **counter pattern** is everywhere in programming."],
      goal: "Count how many vowels (a, e, i, o, u) are in `sentence` and print the count.",
      hint: [
        ["Create `let count = 0;` before the loop, and do `count++` when you find a vowel."],
        ["`\"aeiou\".includes(letter)` checks if a letter is a vowel. Use `letter.toLowerCase()` to catch capitals too."],
      ],
      starter: { js: "const sentence = \"Programming is fun\";\n\n" },
      solution: { js: "const sentence = \"Programming is fun\";\n\nlet count = 0;\nfor (const letter of sentence) {\n  if (\"aeiou\".includes(letter.toLowerCase())) {\n    count++;\n  }\n}\n\nconsole.log(count);\n" },
      check: ({ code, logs }) => {
        if (!/for\s*\(|while\s*\(/.test(code.js)) return 'Use a loop to go through the letters.';
        const s = (/const\s+sentence\s*=\s*["'`]([^"'`]*)/.exec(code.js) || [])[1] || '';
        const expected = String([...s].filter((c) => 'aeiou'.includes(c.toLowerCase())).length);
        return logs.includes(expected) || `There are ${expected} vowels in that sentence.`;
      },
    },
    {
      type: 'try',
      title: 'Sum it up',
      body: ["The **accumulator pattern** builds up a total as a loop runs. Legend says a young Carl Gauss solved this one in his head."],
      goal: "Use a loop to add up every number from **1 to 100** and print the total.",
      hint: "Start with `let total = 0;`, then inside the loop do `total += i;`. Print after the loop ends.",
      starter: { js: "let total = 0;\n\n" },
      solution: { js: "let total = 0;\n\nfor (let i = 1; i <= 100; i++) {\n  total += i;\n}\n\nconsole.log(total);\n" },
      check: ({ code, logs }) => {
        if (!/for\s*\(|while\s*\(/.test(code.js)) return 'Use a loop.';
        return logs.includes('5050') || 'The total should be `5050`. Make sure you print once, after the loop.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-guessing-game': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "In this project you'll build a **number guessing game**, played by a robot! The computer picks a secret number from 1 to 100, and a guessing robot finds it using \"too high\" and \"too low\" hints.",
        "First, one new tool. `Math.random()` gives a random decimal between 0 and 1. Combined with `Math.floor()` (which rounds down) you can make random whole numbers:",
        { code: `// Random whole number from 1 to 100\nconst secret = Math.floor(Math.random() * 100) + 1;\nconsole.log(secret);`, lang: 'js' },
        "### The robot's strategy",
        "The smartest way to guess is to always pick the **middle** of the remaining range:",
        "- Guess 50. \"Too low!\" means the number is in 51–100.",
        "- Guess 75. \"Too high!\" means the number is in 51–74.",
        "- Keep halving the range…",
        "This is called **binary search**, and it never needs more than **7 guesses** for 1–100. Real software uses it to search huge amounts of data fast.",
      ],
    },
    {
      type: 'project',
      title: 'The guessing robot',
      body: ["Build it step by step and run your code often. The secret is random, so each run plays a different game."],
      tasks: [
        "Create a random `secret` number from 1 to 100",
        "Create `low = 1`, `high = 100` and `attempts = 0` with `let`",
        "Write a `while` loop that keeps guessing until the number is found",
        "Each round: guess the middle with `Math.floor((low + high) / 2)` and add 1 to `attempts`",
        "If the guess is too low, print a message and move `low` up to `guess + 1`",
        "If the guess is too high, print a message and move `high` down to `guess - 1`",
        "When the guess is right, print a success message with the number of attempts, then `break`",
      ],
      hint: [
        ["You can use `while (true)` with a `break` when the guess is correct, or `while (low <= high)`."],
        ["Inside the loop: `if (guess === secret) {...} else if (guess < secret) {...} else {...}`"],
        ["Use template literals for nice messages:", { code: "console.log(`Guess #${attempts}: ${guess} is too low`);", lang: 'js' }],
      ],
      starter: { js: "// 1. Pick a secret number from 1 to 100\n\n\n// 2. Set up the robot's range and an attempt counter\n\n\n// 3. Loop until the robot finds the number\n\n" },
      solution: { js: "// 1. Pick a secret number from 1 to 100\nconst secret = Math.floor(Math.random() * 100) + 1;\nconsole.log(`🤫 The secret number is ${secret}`);\n\n// 2. Set up the robot's range and an attempt counter\nlet low = 1;\nlet high = 100;\nlet attempts = 0;\n\n// 3. Loop until the robot finds the number\nwhile (low <= high) {\n  const guess = Math.floor((low + high) / 2);\n  attempts++;\n\n  if (guess === secret) {\n    console.log(`🤖 Got it! The number was ${guess}. It took ${attempts} attempts.`);\n    break;\n  } else if (guess < secret) {\n    console.log(`Guess #${attempts}: ${guess} is too low`);\n    low = guess + 1;\n  } else {\n    console.log(`Guess #${attempts}: ${guess} is too high`);\n    high = guess - 1;\n  }\n}\n" },
      check: ({ code, logs }) => {
        if (!/Math\.random\(\)/.test(code.js)) return 'Use `Math.random()` to pick the secret number.';
        if (!/while\s*\(/.test(code.js)) return 'Use a `while` loop for the guessing.';
        if (!/attempts/.test(code.js)) return 'Keep count of the guesses in an `attempts` variable.';
        if (!logs.length) return 'Your game should print each guess.';
        if (logs.length > 9) return 'The robot took too many guesses. Is it moving `low` and `high` correctly?';
        if (!/\d/.test(logs[logs.length - 1])) return 'The last message should say how many attempts it took.';
        return true;
      },
      success: "Your robot can find any number from 1 to 100 in at most 7 guesses! 🤖",
    },
    {
      type: 'explain',
      title: 'Bonus: play it yourself',
      body: [
        "Want to be the one guessing? `prompt()` shows a pop-up box that asks the user to type something, and returns their answer **as a string** (or `null` if they press Cancel).",
        { code: `const secret = Math.floor(Math.random() * 100) + 1;\nlet attempts = 0;\n\nwhile (true) {\n  const answer = prompt("Guess a number from 1 to 100");\n  if (answer === null) break;          // pressed Cancel\n\n  const guess = Number(answer);        // strings → numbers!\n  attempts++;\n\n  if (guess === secret) {\n    alert(\`Correct! You got it in \${attempts} tries.\`);\n    break;\n  } else if (guess < secret) {\n    alert("Too low!");\n  } else {\n    alert("Too high!");\n  }\n}`, lang: 'js' },
        "Paste this into the editor on the previous step and press Run. If your browser blocks pop-ups in the preview, open your browser's DevTools console (**F12** → Console) and paste it there instead.",
        "> 🎉 That's Module 2 done! You now know the core logic of programming: variables, operators, comparisons, conditions and loops. Every app you'll ever build uses these.",
      ],
    },
  ],
});
