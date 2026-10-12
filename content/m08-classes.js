/* Module 8 — JavaScript Classes */
Course.addContent('m08', {

  /* ---------------------------------------------------------------- */
  'classes-basics': [
    {
      type: 'explain',
      title: 'Why classes?',
      body: [
        "Imagine a game with 50 enemies. Each one has a name, health and an `attack()` method. Writing 50 objects by hand would be painful, and they'd easily drift out of sync.",
        "A **class** is a **blueprint** for making objects of the same shape. Each object made from it is called an **instance**:",
        { code: `class Enemy {\n  constructor(name, health) {\n    this.name = name;\n    this.health = health;\n  }\n\n  takeDamage(amount) {\n    this.health -= amount;\n  }\n}\n\nconst goblin = new Enemy("Goblin", 30);\nconst dragon = new Enemy("Dragon", 500);\n\ngoblin.takeDamage(10);\nconsole.log(goblin.health);  // 20\nconsole.log(dragon.health);  // 500: each instance has its own data`, lang: 'js' },
        "You've used built-in classes already: `new Promise(...)`, `new Error(...)`, `new Date()`.",
      ],
    },
    {
      type: 'explain',
      title: 'Anatomy of a class',
      body: [
        { code: `class Product {                      // 1. class names use PascalCase\n  constructor(name, price) {         // 2. runs when you call "new"\n    this.name = name;                // 3. "this" is the new object\n    this.price = price;\n  }\n\n  describe() {                       // 4. methods: no "function" keyword\n    return \`\${this.name} costs $\${this.price}\`;\n  }\n}\n\nconst mug = new Product("Mug", 12);  // 5. "new" creates an instance\nconsole.log(mug.describe());`, lang: 'js' },
        { output: `Mug costs $12` },
        "1. Class names start with a capital letter by convention.",
        "2. `constructor` sets up each new instance. Its parameters are what you pass to `new`.",
        "3. Inside the class, `this` refers to the specific instance being created or used.",
        "4. Methods are shared by all instances.",
        "5. Forgetting `new` is an error: `Product(\"Mug\", 12)` throws *Class constructor cannot be invoked without 'new'*.",
      ],
    },
    {
      type: 'try',
      title: 'Your first class',
      body: ["Let's model a dog."],
      goal: [
        "Create a class `Dog` with:",
        "- a constructor that takes `name` and `breed` and stores them on `this`",
        "- a `bark()` method that **returns** `\"<name> says woof!\"`",
        "Then create a dog and print its `bark()`.",
      ],
      hint: [{ code: "class Dog {\n  constructor(name, breed) {\n    this.name = name;\n    this.breed = breed;\n  }\n\n  bark() {\n    return `${this.name} says woof!`;\n  }\n}", lang: 'js' }],
      starter: { js: "" },
      solution: { js: "class Dog {\n  constructor(name, breed) {\n    this.name = name;\n    this.breed = breed;\n  }\n\n  bark() {\n    return `${this.name} says woof!`;\n  }\n}\n\nconst rex = new Dog(\"Rex\", \"Labrador\");\nconsole.log(rex.bark());\n" },
      check: ({ get, logs }) => {
        const Dog = get('Dog');
        if (typeof Dog !== 'function') return 'Create a class called `Dog`.';
        const d = new Dog('Biscuit', 'Beagle');
        if (d.name !== 'Biscuit' || d.breed !== 'Beagle') return 'The constructor should store `name` and `breed` on `this`.';
        if (typeof d.bark !== 'function') return 'Add a `bark()` method.';
        if (d.bark() !== 'Biscuit says woof!') return '`bark()` should return "<name> says woof!", e.g. "Biscuit says woof!".';
        return logs.some((l) => l.endsWith('says woof!')) || 'Create a dog with `new` and print its `bark()`.';
      },
    },
    {
      type: 'explain',
      title: 'Methods that change state',
      body: [
        "Methods can read **and** update an instance's data. Each instance keeps its own separate state:",
        { code: `class Timer {\n  constructor() {\n    this.seconds = 0;     // properties don't have to come from parameters\n  }\n\n  tick() {\n    this.seconds++;\n  }\n\n  reset() {\n    this.seconds = 0;\n  }\n}\n\nconst a = new Timer();\nconst b = new Timer();\na.tick(); a.tick(); b.tick();\nconsole.log(a.seconds, b.seconds);  // 2 1`, lang: 'js' },
        "You can also declare properties directly in the class body as **class fields**. It's a tidy way to set defaults:",
        { code: `class Timer {\n  seconds = 0;   // class field\n\n  tick() {\n    this.seconds++;\n  }\n}`, lang: 'js' },
      ],
    },
    {
      type: 'try',
      title: 'Shopping cart class',
      body: ["Classes are perfect for things that hold data and have actions."],
      goal: [
        "Create a class `Cart` with:",
        "- an `items` array that starts empty",
        "- `add(name, price)` which pushes `{ name, price }` into `items`",
        "- `total()` which returns the sum of all prices",
        "- `count()` which returns how many items are in the cart",
      ],
      hint: [
        ["Start with the class field `items = [];` or set `this.items = []` in the constructor."],
        ["`total()` is a perfect job for `reduce`."],
      ],
      starter: { js: "class Cart {\n\n}\n\nconst cart = new Cart();\ncart.add(\"Book\", 12.5);\ncart.add(\"Pen\", 2.5);\nconsole.log(cart.count());\nconsole.log(cart.total());\n" },
      solution: { js: "class Cart {\n  items = [];\n\n  add(name, price) {\n    this.items.push({ name, price });\n  }\n\n  total() {\n    return this.items.reduce((sum, item) => sum + item.price, 0);\n  }\n\n  count() {\n    return this.items.length;\n  }\n}\n\nconst cart = new Cart();\ncart.add(\"Book\", 12.5);\ncart.add(\"Pen\", 2.5);\nconsole.log(cart.count());\nconsole.log(cart.total());\n" },
      check: ({ get }) => {
        const Cart = get('Cart');
        if (typeof Cart !== 'function') return 'Create a class called `Cart`.';
        const a = new Cart(), b = new Cart();
        if (!Array.isArray(a.items) || a.items.length !== 0) return 'A new cart should start with an empty `items` array.';
        if (typeof a.add !== 'function') return 'Add an `add(name, price)` method.';
        a.add('X', 10); a.add('Y', 5.5);
        if (b.items.length !== 0) return 'Each cart should have its own `items` array.';
        if (a.items[0].name !== 'X' || a.items[0].price !== 10) return '`add` should push an object like `{ name, price }`.';
        if (typeof a.total !== 'function' || a.total() !== 15.5) return '`total()` should return the sum of the prices.';
        return (typeof a.count === 'function' && a.count() === 2) || '`count()` should return the number of items.';
      },
    },
    {
      type: 'explain',
      title: 'Static methods and instanceof',
      body: [
        "A **static** method belongs to the class itself, not to instances. It's often used for helpers or alternative ways to create instances:",
        { code: `class Temperature {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n\n  static fromFahrenheit(f) {\n    return new Temperature((f - 32) * 5 / 9);\n  }\n}\n\nconst t = Temperature.fromFahrenheit(212);  // called on the CLASS\nconsole.log(t.celsius);                      // 100`, lang: 'js' },
        "You've used static methods before: `Math.random()`, `Number(…)`, `Object.keys(…)`, `JSON.parse(…)`.",
        "`instanceof` checks whether an object was made from a class:",
        { code: `console.log(t instanceof Temperature);  // true\nconsole.log([] instanceof Array);       // true`, lang: 'js' },
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'inheritance': [
    {
      type: 'explain',
      title: 'Inheritance with extends',
      body: [
        "Sometimes one class is a more specific version of another. A `Cat` *is an* `Animal`. With `extends`, the child class **inherits** everything from the parent and can add or override things:",
        { code: `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  eat() {\n    return \`\${this.name} is eating\`;\n  }\n\n  speak() {\n    return \`\${this.name} makes a sound\`;\n  }\n}\n\nclass Cat extends Animal {\n  speak() {                         // override the parent's version\n    return \`\${this.name} meows\`;\n  }\n}\n\nconst tom = new Cat("Tom");\nconsole.log(tom.eat());    // inherited from Animal\nconsole.log(tom.speak());  // Cat's own version`, lang: 'js' },
        { output: `Tom is eating\nTom meows` },
      ],
    },
    {
      type: 'try',
      title: 'Extend a class',
      body: ["The `Animal` class is ready. Make a more specific animal."],
      goal: [
        "Create a class `Cat` that **extends** `Animal` and overrides `speak()` to return `\"<name> meows\"`.",
        "Then create a cat and print its `speak()` and `eat()`.",
      ],
      hint: "`class Cat extends Animal { speak() { ... } }`. No constructor needed, since it inherits Animal's.",
      starter: { js: "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  eat() {\n    return `${this.name} is eating`;\n  }\n\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}\n\n" },
      solution: { js: "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  eat() {\n    return `${this.name} is eating`;\n  }\n\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}\n\nclass Cat extends Animal {\n  speak() {\n    return `${this.name} meows`;\n  }\n}\n\nconst tom = new Cat(\"Tom\");\nconsole.log(tom.speak());\nconsole.log(tom.eat());\n" },
      check: ({ get }) => {
        const Animal = get('Animal'), Cat = get('Cat');
        if (typeof Cat !== 'function') return 'Create a class called `Cat`.';
        const c = new Cat('Luna');
        if (!(c instanceof Animal)) return '`Cat` should `extends Animal`.';
        if (c.speak() !== 'Luna meows') return '`speak()` should return "<name> meows".';
        return c.eat() === 'Luna is eating' || '`Cat` should still inherit `eat()` from `Animal`.';
      },
    },
    {
      type: 'explain',
      title: 'super: calling the parent',
      body: [
        "If the child needs its own constructor, it **must** call `super(...)` first. That runs the parent's constructor:",
        { code: `class Dog extends Animal {\n  constructor(name, tricks) {\n    super(name);            // let Animal set up this.name\n    this.tricks = tricks;   // then add Dog-specific data\n  }\n\n  speak() {\n    // super.method() calls the parent's version of a method\n    return super.speak() + " (it's a woof)";\n  }\n}\n\nconst rex = new Dog("Rex", ["sit", "roll"]);\nconsole.log(rex.speak());`, lang: 'js' },
        { output: `Rex makes a sound (it's a woof)` },
        "> Using `this` before calling `super()` in a child constructor is an error.",
      ],
    },
    {
      type: 'explain',
      title: 'Getters and setters',
      body: [
        "**Getters** look like properties but are calculated when you read them. **Setters** run code when you assign, which makes them perfect for validation:",
        { code: `class Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  get area() {                 // read like a property: rect.area\n    return this.width * this.height;\n  }\n\n  set size(value) {            // assign like a property: rect.size = 5\n    if (value <= 0) throw new Error("Size must be positive");\n    this.width = value;\n    this.height = value;\n  }\n}\n\nconst rect = new Rectangle(3, 4);\nconsole.log(rect.area);   // 12: no parentheses!\nrect.size = 5;\nconsole.log(rect.area);   // 25`, lang: 'js' },
      ],
    },
    {
      type: 'try',
      title: 'A getter',
      body: ["Getters are great for values that are always derived from other data."],
      goal: [
        "Add two getters to the `Person` class:",
        "- `fullName`: returns `\"<firstName> <lastName>\"`",
        "- `initials`: returns the first letter of each name, e.g. `\"AL\"`",
      ],
      hint: ["A getter looks like a method with `get` in front. The first letter of a string is `str[0]`.", { code: "get fullName() {\n  return `${this.firstName} ${this.lastName}`;\n}", lang: 'js' }],
      starter: { js: "class Person {\n  constructor(firstName, lastName) {\n    this.firstName = firstName;\n    this.lastName = lastName;\n  }\n\n  // add your getters here\n}\n\nconst ada = new Person(\"Ada\", \"Lovelace\");\nconsole.log(ada.fullName);\nconsole.log(ada.initials);\n" },
      solution: { js: "class Person {\n  constructor(firstName, lastName) {\n    this.firstName = firstName;\n    this.lastName = lastName;\n  }\n\n  get fullName() {\n    return `${this.firstName} ${this.lastName}`;\n  }\n\n  get initials() {\n    return this.firstName[0] + this.lastName[0];\n  }\n}\n\nconst ada = new Person(\"Ada\", \"Lovelace\");\nconsole.log(ada.fullName);\nconsole.log(ada.initials);\n" },
      check: ({ get }) => {
        const Person = get('Person');
        const p = new Person('Grace', 'Hopper');
        const desc = (name) => Object.getOwnPropertyDescriptor(Person.prototype, name);
        if (!desc('fullName') || !desc('fullName').get) return 'Add `get fullName()` to the class.';
        if (p.fullName !== 'Grace Hopper') return '`fullName` should return "Grace Hopper" for Grace Hopper.';
        p.firstName = 'Margaret';
        if (p.fullName !== 'Margaret Hopper') return '`fullName` should update when `firstName` changes. Calculate it in the getter.';
        if (!desc('initials') || !desc('initials').get) return 'Add `get initials()` to the class.';
        return p.initials === 'MH' || '`initials` should return the first letter of each name, like "MH".';
      },
    },
    {
      type: 'explain',
      title: 'Private fields',
      body: [
        "Fields starting with `#` are **private**: they can only be used *inside* the class. Code outside can't read or change them, so the class stays in control of its own data:",
        { code: `class Thermostat {\n  #temperature = 20;                 // private field\n\n  get temperature() {\n    return this.#temperature;\n  }\n\n  increase() {\n    if (this.#temperature < 30) this.#temperature++;\n  }\n}\n\nconst t = new Thermostat();\nt.increase();\nconsole.log(t.temperature);   // 21\nt.temperature = 100;          // ignored: there's no setter\nconsole.log(t.temperature);   // 21\n// t.#temperature             // ❌ SyntaxError outside the class`, lang: 'js' },
        "This idea, hiding internal details behind a small set of methods, is called **encapsulation**.",
        "### Classes or plain objects?",
        "Use a **class** when you need many objects with the same behaviour, or need to protect internal state. Use a **plain object** for simple bundles of data, like settings or one API response. Both are everyday JavaScript.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'modules': [
    {
      type: 'explain',
      title: 'Why modules?',
      body: [
        "Real apps have thousands of lines of code. Putting it all in one file is a nightmare. **Modules** let you split code into files, where each file chooses what to share with `export` and what to use from others with `import`:",
        { code: `// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\nexport const PI = 3.14159;\n\nfunction secretHelper() {}   // not exported → private to this file`, lang: 'js', label: 'math.js' },
        { code: `// main.js\nimport { add, PI } from "./math.js";\n\nconsole.log(add(2, 3));  // 5\nconsole.log(PI);`, lang: 'js', label: 'main.js' },
        "Each module has its own scope, so variables in one file don't leak into others. No more name clashes!",
      ],
    },
    {
      type: 'explain',
      title: 'Named vs default exports',
      body: [
        "There are two kinds of exports:",
        { code: `// User.js: one main thing? Use a DEFAULT export\nexport default class User {\n  constructor(name) { this.name = name; }\n}\n\n// Also allowed alongside it: named exports\nexport function isAdmin(user) { return user.name === "admin"; }`, lang: 'js', label: 'User.js' },
        { code: `// Default import: no braces, and you choose the name\nimport User from "./User.js";\n\n// Named imports: braces, and the names must match\nimport { isAdmin } from "./User.js";\n\n// Both at once, and renaming with "as"\nimport User, { isAdmin as checkAdmin } from "./User.js";`, lang: 'js', label: 'main.js' },
        "- **Named** exports: a file shares several things. Import them by their exact name in `{ }`.",
        "- **Default** export: a file has one main thing, like a class or a React component.",
        "> Packages you install with npm work the same way: `import express from \"express\"`. You'll see this constantly from Module 9 onwards.",
      ],
    },
    {
      type: 'explain',
      title: 'Modules in the browser',
      body: [
        "To use modules in a web page, add `type=\"module\"` to your script tag:",
        { code: `<script type="module" src="main.js"></script>`, lang: 'html' },
        "Module scripts:",
        "- can use `import` and `export`",
        "- automatically run after the HTML is parsed (like `defer`)",
        "- run in strict mode",
        "- **must be served over http(s)**. Opening the HTML file directly (`file://…`) blocks them for security reasons.",
        "That last point means you need a small local web server. The easiest option is the free **Live Server** extension for VS Code. The next step walks you through it.",
        "> Bigger projects use a tool called a **bundler** (like **Vite**) that handles modules, npm packages and fast reloading for you. You'll set up Vite in the React module.",
      ],
    },
    {
      type: 'local',
      title: 'Build a module project on your computer',
      body: [
        "This step happens outside the course app, in a real code editor.",
        "### 1. Set up",
        "1. Install [VS Code](https://code.visualstudio.com) if you haven't already.",
        "2. In VS Code, open the **Extensions** panel (Ctrl+Shift+X), search for **Live Server** and install it.",
        "3. Create a new folder called `modules-practice` and open it in VS Code (**File → Open Folder**).",
        "### 2. Create three files",
        { code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>Modules practice</title>\n</head>\n<body>\n  <h1>Open the console (F12)</h1>\n  <script type="module" src="main.js"></script>\n</body>\n</html>`, lang: 'html', label: 'index.html' },
        { code: `export class Counter {\n  #count = 0;\n\n  increment() {\n    this.#count++;\n    return this.#count;\n  }\n}\n\nexport function shout(text) {\n  return text.toUpperCase() + "!";\n}`, lang: 'js', label: 'utils.js' },
        { code: `import { Counter, shout } from "./utils.js";\n\nconst counter = new Counter();\ncounter.increment();\nconsole.log("Count:", counter.increment());\nconsole.log(shout("modules work"));`, lang: 'js', label: 'main.js' },
        "### 3. Run it",
        "Right-click `index.html` and choose **Open with Live Server**. Your browser opens the page. Press **F12**, open the **Console**, and you should see `Count: 2` and `MODULES WORK!`.",
        "### 4. Experiment",
        "- Make `Counter` the **default** export and update the import.",
        "- Try importing something that isn't exported and read the error.",
        "- Add a third file and import from it.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-bank-account': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "You'll build the core of a **banking system** using classes, the kind of model that sits behind real finance apps.",
        "- A `BankAccount` class with a **private** balance that can only change through `deposit()` and `withdraw()`",
        "- Validation: no negative deposits, no withdrawing more than you have",
        "- A transaction history",
        "- A `SavingsAccount` that **extends** `BankAccount` and can earn interest",
        "This project uses classes, private fields, getters, inheritance, `super`, arrays of objects and error handling with `throw`.",
      ],
    },
    {
      type: 'project',
      title: 'Bank account simulator',
      body: ["Build the classes, then use the demo code at the bottom to try them out. Wrap risky calls in `try/catch` to see your errors."],
      tasks: [
        "`BankAccount` constructor takes `owner` and a starting `balance` (default `0`), stored in a **private** `#balance` field",
        "A `balance` **getter** (no setter, so nobody can change it directly)",
        "`deposit(amount)` adds money and throws an `Error` if the amount is not positive",
        "`withdraw(amount)` removes money and throws an `Error` if the amount is not positive or more than the balance",
        "A `transactions` array that records `{ type: \"deposit\" | \"withdraw\", amount }` for every *successful* deposit or withdrawal",
        "`SavingsAccount extends BankAccount` with an extra `rate` parameter (e.g. `0.05` for 5%), calling `super()`",
        "`addInterest()` on `SavingsAccount` deposits `balance × rate`",
      ],
      hint: [
        ["Check for errors *before* changing anything: `if (amount <= 0) throw new Error(\"Amount must be positive\");`"],
        ["`SavingsAccount` can't touch `#balance` directly, because private fields aren't inherited. Use `this.balance` and `this.deposit()` instead."],
        ["`constructor(owner, balance, rate) { super(owner, balance); this.rate = rate; }`"],
      ],
      starter: { js: "class BankAccount {\n\n}\n\nclass SavingsAccount extends BankAccount {\n\n}\n\n// ---- Demo ----\nconst account = new BankAccount(\"Ana\", 100);\naccount.deposit(50);\naccount.withdraw(30);\nconsole.log(`${account.owner} has $${account.balance}`);\n\ntry {\n  account.withdraw(1000);\n} catch (error) {\n  console.log(\"Error:\", error.message);\n}\n\nconst savings = new SavingsAccount(\"Ben\", 1000, 0.05);\nsavings.addInterest();\nconsole.log(`${savings.owner} has $${savings.balance}`);\nconsole.log(account.transactions);\n" },
      solution: { js: "class BankAccount {\n  #balance;\n\n  constructor(owner, balance = 0) {\n    this.owner = owner;\n    this.#balance = balance;\n    this.transactions = [];\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n\n  deposit(amount) {\n    if (amount <= 0) throw new Error(\"Deposit must be positive\");\n    this.#balance += amount;\n    this.transactions.push({ type: \"deposit\", amount });\n  }\n\n  withdraw(amount) {\n    if (amount <= 0) throw new Error(\"Withdrawal must be positive\");\n    if (amount > this.#balance) throw new Error(\"Insufficient funds\");\n    this.#balance -= amount;\n    this.transactions.push({ type: \"withdraw\", amount });\n  }\n}\n\nclass SavingsAccount extends BankAccount {\n  constructor(owner, balance, rate) {\n    super(owner, balance);\n    this.rate = rate;\n  }\n\n  addInterest() {\n    this.deposit(this.balance * this.rate);\n  }\n}\n\n// ---- Demo ----\nconst account = new BankAccount(\"Ana\", 100);\naccount.deposit(50);\naccount.withdraw(30);\nconsole.log(`${account.owner} has $${account.balance}`);\n\ntry {\n  account.withdraw(1000);\n} catch (error) {\n  console.log(\"Error:\", error.message);\n}\n\nconst savings = new SavingsAccount(\"Ben\", 1000, 0.05);\nsavings.addInterest();\nconsole.log(`${savings.owner} has $${savings.balance}`);\nconsole.log(account.transactions);\n" },
      check: ({ get }) => {
        const BankAccount = get('BankAccount'), SavingsAccount = get('SavingsAccount');
        if (typeof BankAccount !== 'function') return 'Create the `BankAccount` class.';
        const a = new BankAccount('Test', 100);
        if (a.owner !== 'Test') return 'Store the `owner` on the account.';
        if (a.balance !== 100) return 'The `balance` getter should return the starting balance.';
        if (Object.keys(a).includes('balance')) return 'Keep the balance in a **private** `#balance` field, exposed only through a getter.';
        if (new BankAccount('Zero').balance !== 0) return 'The starting balance should default to 0.';
        a.deposit(50);
        if (a.balance !== 150) return 'After depositing 50 into 100, the balance should be 150.';
        a.withdraw(30);
        if (a.balance !== 120) return 'After withdrawing 30, the balance should be 120.';
        try { a.balance = 999; } catch (e) { /* strict mode throws, which is fine */ }
        if (a.balance !== 120) return 'It should not be possible to set `balance` directly.';
        const throws = (fn) => { try { fn(); return false; } catch (e) { return e instanceof Error; } };
        if (!throws(() => a.withdraw(1000))) return 'Withdrawing more than the balance should throw an `Error`.';
        if (!throws(() => a.deposit(-5))) return 'Depositing a negative amount should throw an `Error`.';
        if (!throws(() => a.withdraw(0))) return 'Withdrawing 0 (or less) should throw an `Error`.';
        if (a.balance !== 120) return 'Failed transactions must not change the balance.';
        if (!Array.isArray(a.transactions) || a.transactions.length !== 2) return 'Record exactly one entry in `transactions` for each *successful* deposit or withdrawal.';
        if (a.transactions[0].type !== 'deposit' || a.transactions[0].amount !== 50 || a.transactions[1].type !== 'withdraw') return 'Transactions should look like `{ type: "deposit", amount: 50 }`.';
        if (typeof SavingsAccount !== 'function') return 'Create the `SavingsAccount` class.';
        const s = new SavingsAccount('Saver', 1000, 0.05);
        if (!(s instanceof BankAccount)) return '`SavingsAccount` should extend `BankAccount`.';
        if (s.balance !== 1000) return 'Pass the owner and balance to `super()`.';
        s.addInterest();
        return Math.abs(s.balance - 1050) < 0.001 || '`addInterest()` with a 5% rate should turn 1000 into 1050.';
      },
      success: "Your bank works and your balance is safe from tampering. 🏦",
    },
    {
      type: 'explain',
      title: 'Module 8 complete',
      body: [
        "You can now model real-world things in code:",
        "- **Classes**, constructors, methods, class fields and `new`",
        "- **Inheritance** with `extends` and `super`",
        "- **Getters, setters** and **private fields** for encapsulation",
        "- **Static methods** and `instanceof`",
        "- **Modules** with `import` / `export`",
        "That completes the core JavaScript part of your path! 🎉",
        "Next is **Capstone 1: Expense Tracker**, a full app that pulls together everything from Modules 1–8.",
      ],
    },
  ],
});
