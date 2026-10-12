/* Module 9 — React: Introduction */
Course.addContent('m09', {

  /* ---------------------------------------------------------------- */
  'why-react-jsx': [
    {
      type: 'explain',
      title: 'Why React?',
      body: [
        "Remember the to-do app? Every change meant: update the array, then carefully rebuild the right bits of the DOM. As apps grow, keeping the page in sync with the data by hand gets messy and buggy.",
        "**React** flips this around. You describe what the UI should look like *for the current data*, and React updates the DOM for you whenever the data changes:",
        { code: `UI = f(state)`, lang: 'text' },
        "React apps are built from **components**: small, reusable functions that each return a piece of UI. A page is a tree of components: `App` → `Header`, `TodoList` → `TodoItem`…",
        "React is used by Meta, Netflix, Airbnb, Discord and countless others. It's the most popular way to build web interfaces, which is why it's next on your path.",
        "> Everything you learned in Modules 1–8 still applies. React is JavaScript, and it outputs HTML and CSS.",
      ],
    },
    {
      type: 'explain',
      title: 'Your first component',
      body: [
        "Here is a complete React app. It's the same shape you'll see in real projects:",
        { code: `import { createRoot } from "react-dom/client";\n\nfunction App() {\n  return <h1>Hello from React!</h1>;\n}\n\ncreateRoot(document.getElementById("root")).render(<App />);`, lang: 'jsx' },
        "- `App` is a **component**: a function that returns what to show.",
        "- That HTML-looking code is **JSX**. It looks like HTML but lives inside JavaScript.",
        "- `createRoot(...).render(<App />)` puts your component into the page's `<div id=\"root\">`.",
        "> In this course's editor the **App.jsx** tab works just like a real project, and the `<div id=\"root\">` is created for you. In Module 10 you'll set up a real React project on your computer with **Vite**.",
      ],
    },
    {
      type: 'try',
      title: 'Hello, React!',
      body: ["The preview re-runs about a second after you stop typing (React needs a moment to compile). You can also press ▶ Run."],
      goal: "Change the `App` component so it returns an `<h1>` that says **Hello, React!**",
      hint: "Replace the `<p>…</p>` with `<h1>Hello, React!</h1>`.",
      starter: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  return <p>Change me!</p>;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  return <h1>Hello, React!</h1>;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: ({ text, $ }) => {
        if (!$('#root h1')) return 'Return an `<h1>` from `App`.';
        return text('#root h1') === 'Hello, React!' || 'The heading should say "Hello, React!"';
      },
    },
    {
      type: 'explain',
      title: 'The rules of JSX',
      body: [
        "JSX is *almost* HTML, but it's really JavaScript, so a few rules are different:",
        { code: `function Card() {\n  return (\n    <>                                       {/* 1. one parent: use a fragment <>...</> */}\n      <div className="card">                 {/* 2. className, not class */}\n        <img src="cat.jpg" alt="A cat" />    {/* 3. every tag must close: <img /> */}\n        <label htmlFor="name">Name</label>   {/* 4. htmlFor, not for */}\n        <input id="name" onChange={handle} /> {/* 5. camelCase events and attributes */}\n      </div>\n      <p style={{ color: "red" }}>Hi</p>      {/* 6. style takes an object */}\n    </>\n  );\n}`, lang: 'jsx' },
        "1. A component returns **one** root element. Wrap siblings in a fragment `<>…</>` (it adds nothing to the page).",
        "2. `class` is a reserved word in JavaScript, so use `className`.",
        "3. Every tag must be closed, including `<img />`, `<br />` and `<input />`.",
        "4–5. Attributes are camelCase: `htmlFor`, `onClick`, `tabIndex`.",
        "6. Inline styles are objects with camelCase keys: `style={{ backgroundColor: \"red\" }}`.",
        "When JSX spans multiple lines, wrap it in parentheses `( )` after `return`. Comments look like `{/* this */}`.",
      ],
    },
    {
      type: 'try',
      title: 'Fix the broken JSX',
      body: ["This code was copied from an HTML file and doesn't compile. Check the console for the error."],
      goal: [
        "Fix the JSX so the card renders:",
        "- change `class` to `className`",
        "- close the `<img>` tag",
        "- wrap the two sibling elements in a fragment `<>…</>`",
      ],
      hint: "Put `<>` right after `return (` and `</>` right before the closing `)`.",
      starter: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  return (\n    <div class=\"card\">\n      <img src=\"https://picsum.photos/id/237/120/120\" alt=\"A black puppy\">\n      <h2>Buddy</h2>\n    </div>\n    <p>Looking for a home!</p>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.card {\n  display: inline-block;\n  padding: 12px;\n  border: 2px solid #6a4cf0;\n  border-radius: 12px;\n  text-align: center;\n}\n",
      },
      solution: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  return (\n    <>\n      <div className=\"card\">\n        <img src=\"https://picsum.photos/id/237/120/120\" alt=\"A black puppy\" />\n        <h2>Buddy</h2>\n      </div>\n      <p>Looking for a home!</p>\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.card {\n  display: inline-block;\n  padding: 12px;\n  border: 2px solid #6a4cf0;\n  border-radius: 12px;\n  text-align: center;\n}\n",
      },
      check: ({ $, code }) => {
        if (/\sclass=/.test(code.jsx)) return 'Change `class=` to `className=`.';
        if (!$('#root .card')) return 'The card isn\'t rendering yet. Look at the error in the console.';
        if (!$('#root .card img')) return 'Keep the image inside the card.';
        return !!$('#root > p') || 'The paragraph should render next to the card.';
      },
    },
    {
      type: 'explain',
      title: 'JavaScript inside JSX',
      body: [
        "Curly braces `{ }` let you drop **any JavaScript expression** into JSX:",
        { code: `const user = { name: "Ana", avatar: "https://picsum.photos/id/64/80/80", points: 1250 };\n\nfunction Profile() {\n  return (\n    <div>\n      <img src={user.avatar} alt={user.name} />          {/* in attributes */}\n      <h2>{user.name.toUpperCase()}</h2>                {/* method calls */}\n      <p>Points: {user.points}</p>\n      <p>Level: {Math.floor(user.points / 500)}</p>     {/* math */}\n      <p>{user.points > 1000 ? "⭐ Pro" : "Rookie"}</p> {/* ternaries */}\n    </div>\n  );\n}`, lang: 'jsx' },
        "An *expression* is anything that produces a value. Statements like `if` or `for` can't go inside `{ }`, but ternaries and array methods can.",
      ],
    },
    {
      type: 'try',
      title: 'Render data',
      body: ["The `book` object is ready. Show it on the page."],
      goal: [
        "Inside `App`, render:",
        "- the book's `title` in an `<h2>`",
        "- `by <author>` in a `<p>`",
        "- the cover `<img>` using `book.cover` for `src` and the title for `alt`",
      ],
      hint: "`<h2>{book.title}</h2>` and `<img src={book.cover} alt={book.title} />`",
      starter: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nconst book = {\n  title: \"The Hobbit\",\n  author: \"J.R.R. Tolkien\",\n  cover: \"https://picsum.photos/id/24/120/160\",\n};\n\nfunction App() {\n  return (\n    <div className=\"book\">\n      {/* your JSX here */}\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nconst book = {\n  title: \"The Hobbit\",\n  author: \"J.R.R. Tolkien\",\n  cover: \"https://picsum.photos/id/24/120/160\",\n};\n\nfunction App() {\n  return (\n    <div className=\"book\">\n      <img src={book.cover} alt={book.title} />\n      <h2>{book.title}</h2>\n      <p>by {book.author}</p>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: ({ $, text, code }) => {
        if (!/\{\s*book\.title\s*\}/.test(code.jsx)) return 'Use `{book.title}` rather than typing the title by hand.';
        if (text('#root h2') !== 'The Hobbit') return 'Render the title in an `<h2>`.';
        if (!/by J\.R\.R\. Tolkien/.test(text('#root p'))) return 'Render "by J.R.R. Tolkien" in a `<p>`.';
        const img = $('#root img');
        if (!img || !img.getAttribute('src').includes('picsum')) return 'Add an `<img>` with `src={book.cover}`.';
        return img.getAttribute('alt') === 'The Hobbit' || 'Set the image\'s `alt` to the book title.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'components-props': [
    {
      type: 'explain',
      title: 'Building with components',
      body: [
        "Split your UI into components, then combine them like LEGO bricks:",
        { code: `function Header() {\n  return <header><h1>My Blog</h1></header>;\n}\n\nfunction Footer() {\n  return <footer>© 2026</footer>;\n}\n\nfunction App() {\n  return (\n    <>\n      <Header />\n      <main>Posts go here</main>\n      <Footer />\n    </>\n  );\n}`, lang: 'jsx' },
        "- Component names **must** start with a capital letter. `<header>` is the HTML tag; `<Header />` is your component.",
        "- Use them like HTML tags: `<Header />`.",
        "- Each component is just a function, so keep them small and focused.",
      ],
    },
    {
      type: 'try',
      title: 'Header and footer components',
      body: ["Break the page into pieces."],
      goal: [
        "- Create a `Header` component that returns a `<header>` containing an `<h1>`",
        "- Create a `Footer` component that returns a `<footer>`",
        "- Use both inside `App`, around the `<main>`",
      ],
      hint: "Define `function Header() { return (...); }` above `App`, then write `<Header />` inside App's fragment.",
      starter: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\n// Create Header and Footer here\n\n\nfunction App() {\n  return (\n    <>\n      <main>\n        <p>Welcome to my site!</p>\n      </main>\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n  margin: 0;\n}\n\nheader, footer {\n  background: #1d1f2d;\n  color: white;\n  padding: 8px 16px;\n}\n\nmain {\n  padding: 16px;\n}\n",
      },
      solution: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction Header() {\n  return (\n    <header>\n      <h1>My Site</h1>\n    </header>\n  );\n}\n\nfunction Footer() {\n  return <footer>© 2026 My Site</footer>;\n}\n\nfunction App() {\n  return (\n    <>\n      <Header />\n      <main>\n        <p>Welcome to my site!</p>\n      </main>\n      <Footer />\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n  margin: 0;\n}\n\nheader, footer {\n  background: #1d1f2d;\n  color: white;\n  padding: 8px 16px;\n}\n\nmain {\n  padding: 16px;\n}\n",
      },
      check: ({ $, get }) => {
        if (typeof get('Header') !== 'function') return 'Create a function component called `Header`.';
        if (typeof get('Footer') !== 'function') return 'Create a function component called `Footer`.';
        if (!$('#root header h1')) return 'Render `<Header />` in App. It should output a `<header>` with an `<h1>`.';
        if (!$('#root footer')) return 'Render `<Footer />` in App.';
        const kids = Array.from($('#root').children).map((el) => el.tagName);
        return (kids.indexOf('HEADER') < kids.indexOf('MAIN') && kids.indexOf('MAIN') < kids.indexOf('FOOTER')) || 'Put the header before `<main>` and the footer after it.';
      },
    },
    {
      type: 'explain',
      title: 'Props: passing data to components',
      body: [
        "Components become reusable when you can pass them data. Those values are called **props** (properties), written like HTML attributes:",
        { code: `function Greeting({ name, emoji }) {   // destructure the props object\n  return <p>Hello, {name} {emoji}</p>;\n}\n\nfunction App() {\n  return (\n    <>\n      <Greeting name="Ana" emoji="👋" />\n      <Greeting name="Ben" emoji="🎉" />\n      <Greeting name="Cleo" />            {/* emoji is undefined here */}\n    </>\n  );\n}`, lang: 'jsx' },
        "- Strings can be passed in quotes: `name=\"Ana\"`. Anything else goes in braces: `age={30}`, `isAdmin={true}`, `tags={[\"a\", \"b\"]}`.",
        "- The component receives one object with all the props. Destructuring `{ name, emoji }` pulls them out.",
        "- You can set defaults: `function Greeting({ name, emoji = \"🙂\" })`.",
        "> Props are **read-only**. A component should never change its own props. Think of them like function arguments.",
      ],
    },
    {
      type: 'try',
      title: 'A reusable product card',
      body: ["One component, many products."],
      goal: [
        "- Finish the `ProductCard` component so it shows the `name` in an `<h3>` and the `price` as `$<price>` in a `<p>`",
        "- In `App`, render **three** `ProductCard`s with different names and prices",
      ],
      hint: ["Use props like this:", { code: "<ProductCard name=\"Mug\" price={12} />", lang: 'jsx' }],
      starter: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction ProductCard({ name, price }) {\n  return (\n    <div className=\"product-card\">\n      {/* show the name and price */}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div className=\"grid\">\n      {/* three ProductCards */}\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 10px;\n}\n\n.product-card {\n  border: 1px solid #ddd;\n  border-radius: 10px;\n  padding: 10px;\n}\n",
      },
      solution: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction ProductCard({ name, price }) {\n  return (\n    <div className=\"product-card\">\n      <h3>{name}</h3>\n      <p>${price}</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div className=\"grid\">\n      <ProductCard name=\"Mug\" price={12} />\n      <ProductCard name=\"T-shirt\" price={20} />\n      <ProductCard name=\"Sticker\" price={3} />\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 10px;\n}\n\n.product-card {\n  border: 1px solid #ddd;\n  border-radius: 10px;\n  padding: 10px;\n}\n",
      },
      check: ({ $$ }) => {
        const cards = $$('#root .product-card');
        if (cards.length !== 3) return `Render exactly 3 \`ProductCard\`s. Found ${cards.length}.`;
        for (const c of cards) {
          if (!c.querySelector('h3') || !c.querySelector('h3').textContent.trim()) return 'Each card should show its name in an `<h3>`.';
          if (!/^\$\d/.test((c.querySelector('p') || {}).textContent || '')) return 'Each card should show its price like `$12` in a `<p>`.';
        }
        return new Set(cards.map((c) => c.querySelector('h3').textContent)).size === 3 || 'Give the three products different names.';
      },
    },
    {
      type: 'explain',
      title: 'The children prop',
      body: [
        "Whatever you put **between** a component's opening and closing tags arrives as a special prop called `children`. It's perfect for wrapper components:",
        { code: `function Card({ title, children }) {\n  return (\n    <section className="card">\n      <h2>{title}</h2>\n      {children}\n    </section>\n  );\n}\n\nfunction App() {\n  return (\n    <Card title="Weather">\n      <p>☀️ 24°C and sunny</p>\n      <button>Refresh</button>\n    </Card>\n  );\n}`, lang: 'jsx' },
        "This is called **composition**: building complex UIs by nesting simple components. Layouts, modals, buttons with icons… all use `children`.",
      ],
    },
    {
      type: 'try',
      title: 'A wrapper component',
      body: ["Make a reusable panel that can hold anything."],
      goal: [
        "Write a `Panel` component that takes `title` and `children` and renders a `<section className=\"panel\">` with the title in an `<h2>` followed by the children.",
        "The `App` already uses it twice.",
      ],
      hint: "Add `{children}` inside the section, after the `<h2>`.",
      starter: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction Panel({ title, children }) {\n  // return a section with the title and the children\n}\n\nfunction App() {\n  return (\n    <>\n      <Panel title=\"News\">\n        <p>React is fun!</p>\n      </Panel>\n      <Panel title=\"Links\">\n        <a href=\"https://react.dev\">react.dev</a>\n      </Panel>\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.panel {\n  border: 1px solid #ccc;\n  border-radius: 10px;\n  padding: 4px 14px;\n  margin-bottom: 10px;\n}\n",
      },
      solution: {
        jsx: "import { createRoot } from \"react-dom/client\";\n\nfunction Panel({ title, children }) {\n  return (\n    <section className=\"panel\">\n      <h2>{title}</h2>\n      {children}\n    </section>\n  );\n}\n\nfunction App() {\n  return (\n    <>\n      <Panel title=\"News\">\n        <p>React is fun!</p>\n      </Panel>\n      <Panel title=\"Links\">\n        <a href=\"https://react.dev\">react.dev</a>\n      </Panel>\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.panel {\n  border: 1px solid #ccc;\n  border-radius: 10px;\n  padding: 4px 14px;\n  margin-bottom: 10px;\n}\n",
      },
      check: ({ $$ }) => {
        const panels = $$('#root section.panel');
        if (panels.length !== 2) return 'Each `Panel` should render a `<section className="panel">`.';
        if (panels[0].querySelector('h2')?.textContent !== 'News') return 'Show the `title` in an `<h2>`.';
        if (!panels[0].querySelector('p') || !panels[1].querySelector('a')) return 'Render `{children}` inside the section.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Rendering lists',
      body: [
        "To show a list, `map` an array to JSX. This is the React version of the loop + `createElement` you wrote in Module 5:",
        { code: `const fruits = [\n  { id: 1, name: "Apple", emoji: "🍎" },\n  { id: 2, name: "Banana", emoji: "🍌" },\n];\n\nfunction FruitList() {\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li key={fruit.id}>{fruit.emoji} {fruit.name}</li>\n      ))}\n    </ul>\n  );\n}`, lang: 'jsx' },
        "Every item needs a unique **`key`** prop. React uses keys to track which item is which when the list changes.",
        "- Use a stable id from your data: `key={fruit.id}`.",
        "- Avoid using the array index as a key if items can be added, removed or reordered.",
        "> Forgetting the key gives a warning in the console: *Each child in a list should have a unique \"key\" prop.*",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'state': [
    {
      type: 'explain',
      title: 'State: a component\'s memory',
      body: [
        "Props come from outside. **State** is data a component remembers and can change itself, like a counter value, whether a menu is open, or what's typed in a box.",
        "You can't just use a normal variable. React wouldn't know it changed, so the screen wouldn't update. Instead, use the `useState` **hook**:",
        { code: `import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);   // [current value, setter], with 0 to start\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}`, lang: 'jsx' },
        "1. `useState(0)` creates a piece of state starting at `0`.",
        "2. It returns an array: the current value and a function to update it. We destructure them as `count` and `setCount`.",
        "3. Calling `setCount(...)` stores the new value and **re-renders** the component. React runs the function again and updates the DOM to match.",
        "> Hooks are functions starting with `use`. Call them at the top level of your component, never inside `if`s or loops.",
      ],
    },
    {
      type: 'try',
      title: 'Counter',
      body: ["The classic: the to-do app's state → render pattern, in a fraction of the code."],
      goal: "Create a `count` state starting at `0`. Clicking the **+1** button increases it, and the `<p>` shows `Count: <count>`.",
      hint: "`const [count, setCount] = useState(0);` and `onClick={() => setCount(count + 1)}`",
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  // create your state here\n\n  return (\n    <div>\n      <p>Count: 0</p>\n      <button>+1</button>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, text, wait }) => {
        if (text('#root p') !== 'Count: 0') return 'It should start at "Count: 0".';
        const btn = $('#root button');
        btn.click(); await wait(30); btn.click(); await wait(30); btn.click(); await wait(30);
        return text('#root p') === 'Count: 3' || `After 3 clicks it should say "Count: 3" but says "${text('#root p')}".`;
      },
    },
    {
      type: 'explain',
      title: 'How updates work',
      body: [
        "A few rules make state predictable:",
        "**1. Never change state directly.** Always use the setter:",
        { code: `count = count + 1;        // ❌ React doesn't notice\nsetCount(count + 1);     // ✅`, lang: 'jsx' },
        "**2. When the new value depends on the old one, pass a function.** React gives you the latest value:",
        { code: `setCount((c) => c + 1);  // ✅ safe even if called several times in a row`, lang: 'jsx' },
        "**3. Each render has its own values.** Inside one render, `count` doesn't change. The new value shows up on the *next* render:",
        { code: `function handleClick() {\n  setCount(count + 1);\n  console.log(count);     // still the OLD value here\n}`, lang: 'jsx' },
        "**4. A component can have many pieces of state.** Just call `useState` several times.",
      ],
    },
    {
      type: 'try',
      title: 'Like button',
      body: ["State doesn't have to be a number. Booleans are great for toggles."],
      goal: "Create a `liked` state (starting `false`). Clicking the button toggles it. The button text is `🤍 Like` when not liked and `❤️ Liked` when liked.",
      hint: "`setLiked(!liked)`, plus a ternary inside the button: `{liked ? \"❤️ Liked\" : \"🤍 Like\"}`",
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction LikeButton() {\n\n  return <button className=\"like\">🤍 Like</button>;\n}\n\nfunction App() {\n  return <LikeButton />;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: ".like {\n  font-size: 18px;\n  padding: 8px 16px;\n  border-radius: 999px;\n  border: 2px solid crimson;\n  background: white;\n  cursor: pointer;\n}\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction LikeButton() {\n  const [liked, setLiked] = useState(false);\n\n  return (\n    <button className=\"like\" onClick={() => setLiked(!liked)}>\n      {liked ? \"❤️ Liked\" : \"🤍 Like\"}\n    </button>\n  );\n}\n\nfunction App() {\n  return <LikeButton />;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: ".like {\n  font-size: 18px;\n  padding: 8px 16px;\n  border-radius: 999px;\n  border: 2px solid crimson;\n  background: white;\n  cursor: pointer;\n}\n",
      },
      check: async ({ $, wait }) => {
        const btn = () => $('#root button');
        if (!btn().textContent.includes('Like') || btn().textContent.includes('Liked')) return 'It should start as "🤍 Like".';
        btn().click(); await wait(30);
        if (!btn().textContent.includes('Liked')) return 'After one click it should say "❤️ Liked".';
        btn().click(); await wait(30);
        return !btn().textContent.includes('Liked') || 'Clicking again should toggle back to "🤍 Like".';
      },
    },
    {
      type: 'explain',
      title: 'Arrays and objects in state',
      body: [
        "For arrays and objects, the \"never change state directly\" rule means: **create a new copy** with the change. The spread operator `...` from Module 4 is your best friend here:",
        { code: `const [items, setItems] = useState(["Milk"]);\n\n// ❌ push changes the existing array, so React won't re-render\nitems.push("Eggs");\n\n// ✅ add: a new array with everything plus the new item\nsetItems([...items, "Eggs"]);\n\n// ✅ remove: filter returns a new array\nsetItems(items.filter((item) => item !== "Milk"));\n\n// ✅ objects: copy, then override\nconst [user, setUser] = useState({ name: "Ana", age: 30 });\nsetUser({ ...user, age: 31 });`, lang: 'jsx' },
        "React compares the old and new values. A brand-new array or object tells it something changed.",
      ],
    },
    {
      type: 'try',
      title: 'Grow a list',
      body: ["Add items to an array in state."],
      goal: [
        "- Create an `items` state starting as an empty array",
        "- Clicking **Add item** adds `Item <n>` to the end (Item 1, Item 2, …)",
        "- Render each item as an `<li>` inside the `<ul>` (with a `key`!)",
        "- Show the count in the `<h2>`: `Items: <n>`",
      ],
      hint: [
        ["Add with a new array:", { code: "setItems([...items, `Item ${items.length + 1}`]);", lang: 'jsx' }],
        ["Render with `{items.map((item) => <li key={item}>{item}</li>)}`."],
      ],
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n\n  return (\n    <div>\n      <h2>Items: 0</h2>\n      <button>Add item</button>\n      <ul></ul>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [items, setItems] = useState([]);\n\n  function addItem() {\n    setItems([...items, `Item ${items.length + 1}`]);\n  }\n\n  return (\n    <div>\n      <h2>Items: {items.length}</h2>\n      <button onClick={addItem}>Add item</button>\n      <ul>\n        {items.map((item) => (\n          <li key={item}>{item}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, $$, text, wait }) => {
        if ($$('#root li').length !== 0) return 'The list should start empty.';
        for (let i = 0; i < 3; i++) { $('#root button').click(); await wait(30); }
        const items = $$('#root li').map((li) => li.textContent);
        if (items.join(',') !== 'Item 1,Item 2,Item 3') return `After 3 clicks the list should be Item 1, Item 2, Item 3 but it is: ${items.join(', ') || 'empty'}.`;
        return text('#root h2') === 'Items: 3' || 'The heading should show "Items: 3".';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'events-lists': [
    {
      type: 'explain',
      title: 'Handling events',
      body: [
        "React events look like HTML attributes, but camelCase and with a **function** as the value:",
        { code: `function App() {\n  function handleClick() {\n    alert("Clicked!");\n  }\n\n  return (\n    <>\n      <button onClick={handleClick}>Named function</button>\n      <button onClick={() => alert("Hi")}>Inline arrow</button>\n      <input onChange={(e) => console.log(e.target.value)} />\n    </>\n  );\n}`, lang: 'jsx' },
        "Same trap as `addEventListener`: pass the function, don't call it.",
        { code: `<button onClick={handleClick}>     ✅ React calls it on click\n<button onClick={handleClick()}>   ❌ runs immediately, during render!\n<button onClick={() => remove(id)}> ✅ wrap in an arrow to pass arguments`, lang: 'text' },
      ],
    },
    {
      type: 'explain',
      title: 'Conditional rendering',
      body: [
        "Show different UI depending on state, using plain JavaScript:",
        { code: `function Inbox({ messages, isLoggedIn }) {\n  // 1. Early return\n  if (!isLoggedIn) return <p>Please log in.</p>;\n\n  return (\n    <div>\n      {/* 2. && : render only if true */}\n      {messages.length > 0 && <span className="badge">{messages.length}</span>}\n\n      {/* 3. ternary: one thing or another */}\n      {messages.length === 0 ? <p>No messages 🎉</p> : <MessageList messages={messages} />}\n    </div>\n  );\n}`, lang: 'jsx' },
        "> ⚠️ With `&&`, make sure the left side is a boolean. `{count && <Badge />}` renders a literal `0` when count is 0! Use `{count > 0 && <Badge />}`.",
      ],
    },
    {
      type: 'try',
      title: 'Show more',
      body: ["A common pattern: hide extra content until the user asks for it."],
      goal: [
        "- Add a `showDetails` state (start `false`)",
        "- The button toggles it, and its text is `Show details` or `Hide details`",
        "- The `<p className=\"details\">` is only rendered when `showDetails` is `true`",
      ],
      hint: "`{showDetails && <p className=\"details\">…</p>}`",
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n\n  return (\n    <article>\n      <h2>🚀 Rocket launch tonight</h2>\n      <button>Show details</button>\n      <p className=\"details\">Liftoff is at 21:30 from Pad 39A. Bring a jacket!</p>\n    </article>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [showDetails, setShowDetails] = useState(false);\n\n  return (\n    <article>\n      <h2>🚀 Rocket launch tonight</h2>\n      <button onClick={() => setShowDetails(!showDetails)}>\n        {showDetails ? \"Hide details\" : \"Show details\"}\n      </button>\n      {showDetails && (\n        <p className=\"details\">Liftoff is at 21:30 from Pad 39A. Bring a jacket!</p>\n      )}\n    </article>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, wait }) => {
        if ($('#root .details')) return 'The details should not be rendered at first.';
        const btn = () => $('#root button');
        if (btn().textContent.trim() !== 'Show details') return 'The button should start as "Show details".';
        btn().click(); await wait(30);
        if (!$('#root .details')) return 'After clicking, the details should appear.';
        if (btn().textContent.trim() !== 'Hide details') return 'When shown, the button should say "Hide details".';
        btn().click(); await wait(30);
        return !$('#root .details') || 'Clicking again should hide the details.';
      },
    },
    {
      type: 'explain',
      title: 'Filtering lists',
      body: [
        "Because rendering is just JavaScript, filtering a list is a `filter` before the `map`:",
        { code: `function TaskList({ tasks }) {\n  const [hideDone, setHideDone] = useState(false);\n  const visible = hideDone ? tasks.filter((t) => !t.done) : tasks;\n\n  return (\n    <>\n      <label>\n        <input type="checkbox" checked={hideDone} onChange={() => setHideDone(!hideDone)} />\n        Hide completed\n      </label>\n      <ul>\n        {visible.map((t) => <li key={t.id}>{t.title}</li>)}\n      </ul>\n    </>\n  );\n}`, lang: 'jsx' },
        "Notice `visible` isn't state. It's **derived** from state on every render. Only store the minimum in state, and calculate the rest.",
      ],
    },
    {
      type: 'try',
      title: 'Hide completed tasks',
      body: ["The task list renders already. Add a filter."],
      goal: [
        "- Add a `hideDone` state (start `false`) controlled by the checkbox",
        "- When checked, only show tasks where `done` is `false`",
        "- Show `<n> tasks shown` in the `<p>`",
      ],
      hint: "Derive `const visible = hideDone ? tasks.filter((t) => !t.done) : tasks;` and map over `visible`.",
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst tasks = [\n  { id: 1, title: \"Learn JSX\", done: true },\n  { id: 2, title: \"Learn state\", done: true },\n  { id: 3, title: \"Learn effects\", done: false },\n  { id: 4, title: \"Build an app\", done: false },\n];\n\nfunction App() {\n\n  return (\n    <div>\n      <label>\n        <input type=\"checkbox\" /> Hide completed\n      </label>\n      <ul>\n        {tasks.map((t) => (\n          <li key={t.id}>{t.done ? \"✅\" : \"⬜\"} {t.title}</li>\n        ))}\n      </ul>\n      <p>4 tasks shown</p>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst tasks = [\n  { id: 1, title: \"Learn JSX\", done: true },\n  { id: 2, title: \"Learn state\", done: true },\n  { id: 3, title: \"Learn effects\", done: false },\n  { id: 4, title: \"Build an app\", done: false },\n];\n\nfunction App() {\n  const [hideDone, setHideDone] = useState(false);\n  const visible = hideDone ? tasks.filter((t) => !t.done) : tasks;\n\n  return (\n    <div>\n      <label>\n        <input type=\"checkbox\" checked={hideDone} onChange={() => setHideDone(!hideDone)} /> Hide completed\n      </label>\n      <ul>\n        {visible.map((t) => (\n          <li key={t.id}>{t.done ? \"✅\" : \"⬜\"} {t.title}</li>\n        ))}\n      </ul>\n      <p>{visible.length} tasks shown</p>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, $$, text, wait }) => {
        if ($$('#root li').length !== 4) return 'All 4 tasks should show at first.';
        $('#root input[type=checkbox]').click(); await wait(30);
        if ($$('#root li').length !== 2) return `With "Hide completed" checked, only 2 tasks should show (found ${$$('#root li').length}).`;
        if (text('#root p') !== '2 tasks shown') return 'The paragraph should say "2 tasks shown".';
        $('#root input[type=checkbox]').click(); await wait(30);
        return $$('#root li').length === 4 || 'Unchecking should show all tasks again.';
      },
    },
    {
      type: 'explain',
      title: 'Controlled inputs',
      body: [
        "To read what's typed, connect an input to state. Its `value` comes from state, and `onChange` updates the state. This is a **controlled input**:",
        { code: `function NameTag() {\n  const [name, setName] = useState("");\n\n  return (\n    <>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <p>Hello, {name || "stranger"}!</p>\n    </>\n  );\n}`, lang: 'jsx' },
        "Every keystroke updates state, React re-renders, and the paragraph always matches the input. No `querySelector` needed!",
        "You'll go deeper into forms in Module 10.",
      ],
    },
    {
      type: 'try',
      title: 'Live greeting',
      body: ["Wire up your first controlled input."],
      goal: "Make the input controlled with a `name` state, and show `Hello, <name>!` in the `<h2>` (or `Hello, stranger!` when empty).",
      hint: "`value={name}` and `onChange={(e) => setName(e.target.value)}`",
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n\n  return (\n    <div>\n      <label htmlFor=\"name\">Your name </label>\n      <input id=\"name\" />\n      <h2>Hello, stranger!</h2>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [name, setName] = useState(\"\");\n\n  return (\n    <div>\n      <label htmlFor=\"name\">Your name </label>\n      <input id=\"name\" value={name} onChange={(e) => setName(e.target.value)} />\n      <h2>Hello, {name || \"stranger\"}!</h2>\n    </div>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ setValue, text, wait }) => {
        if (text('#root h2') !== 'Hello, stranger!') return 'Start with "Hello, stranger!".';
        setValue('#name', 'Ada'); await wait(30);
        if (text('#root h2') !== 'Hello, Ada!') return `After typing "Ada", the heading should say "Hello, Ada!" (it says "${text('#root h2')}").`;
        setValue('#name', ''); await wait(30);
        return text('#root h2') === 'Hello, stranger!' || 'When the input is empty again, show "Hello, stranger!".';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-tip-calculator': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "A **tip calculator** for splitting a restaurant bill. It's a classic React exercise because everything on screen is *derived* from a few pieces of state.",
        "The user enters:",
        "- the **bill** amount",
        "- a **tip %** (preset buttons for 10%, 15% and 20%)",
        "- the number of **people**",
        "and instantly sees the **tip per person** and **total per person**.",
        "> Think first: what's the *minimum* state you need? (Answer: bill, tip percent and people. Everything else is calculated during render.)",
      ],
    },
    {
      type: 'project',
      title: 'Tip calculator',
      body: ["Keep the IDs `#bill`, `#people`, `#tip-per-person` and `#total-per-person` so the checker can find them."],
      tasks: [
        "Create state for `bill`, `tipPercent` and `people` (start people at 1)",
        "Make the bill and people inputs **controlled**",
        "Clicking a tip button (10%, 15%, 20%) sets the tip percent, and the selected button gets the `active` class",
        "Calculate the tip per person and the total per person during render (no extra state!)",
        "Show both as money, like `$12.50`, in `#tip-per-person` and `#total-per-person`",
        "Handle bad input: if the bill is empty or people is less than 1, show `$0.00`",
        "Add a **Reset** button that puts everything back to the start",
      ],
      hint: [
        ["Input values are strings: `const billNum = Number(bill);`."],
        ["`const tipEach = valid ? (billNum * tipPercent / 100) / peopleNum : 0;`"],
        ["Render the buttons from an array: `[10, 15, 20].map((p) => <button key={p} className={p === tipPercent ? \"active\" : \"\"} onClick={() => setTipPercent(p)}>{p}%</button>)`"],
      ],
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n\n  return (\n    <main className=\"calc\">\n      <h1>💰 Tip calculator</h1>\n\n      <label htmlFor=\"bill\">Bill ($)</label>\n      <input id=\"bill\" type=\"number\" min=\"0\" />\n\n      <p className=\"label\">Tip</p>\n      <div className=\"tips\">\n        {/* 10%, 15%, 20% buttons */}\n      </div>\n\n      <label htmlFor=\"people\">People</label>\n      <input id=\"people\" type=\"number\" min=\"1\" />\n\n      <div className=\"results\">\n        <p>Tip / person <strong id=\"tip-per-person\">$0.00</strong></p>\n        <p>Total / person <strong id=\"total-per-person\">$0.00</strong></p>\n      </div>\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: \"Segoe UI\", sans-serif;\n  background: #e2f6ea;\n}\n\n.calc {\n  max-width: 320px;\n  margin: 0 auto;\n  background: white;\n  padding: 16px 20px;\n  border-radius: 16px;\n}\n\nh1 {\n  font-size: 22px;\n  margin-top: 0;\n}\n\nlabel, .label {\n  display: block;\n  font-weight: 600;\n  margin: 12px 0 4px;\n}\n\ninput {\n  width: 100%;\n  box-sizing: border-box;\n  font-size: 18px;\n  padding: 6px 10px;\n}\n\n.tips {\n  display: flex;\n  gap: 6px;\n}\n\n.tips button {\n  flex: 1;\n  padding: 8px;\n  font-size: 16px;\n  border: 2px solid #138a4b;\n  background: white;\n  border-radius: 8px;\n  cursor: pointer;\n}\n\n.tips button.active {\n  background: #138a4b;\n  color: white;\n}\n\n.results {\n  margin-top: 16px;\n  background: #1d1f2d;\n  color: white;\n  border-radius: 12px;\n  padding: 4px 14px;\n}\n\n.results p {\n  display: flex;\n  justify-content: space-between;\n}\n\n.results strong {\n  color: #4fd08c;\n  font-size: 20px;\n}\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst TIP_OPTIONS = [10, 15, 20];\nconst money = (n) => \"$\" + n.toFixed(2);\n\nfunction App() {\n  const [bill, setBill] = useState(\"\");\n  const [tipPercent, setTipPercent] = useState(15);\n  const [people, setPeople] = useState(\"1\");\n\n  const billNum = Number(bill);\n  const peopleNum = Number(people);\n  const valid = billNum > 0 && peopleNum >= 1;\n\n  const tipEach = valid ? (billNum * tipPercent) / 100 / peopleNum : 0;\n  const totalEach = valid ? billNum / peopleNum + tipEach : 0;\n\n  function reset() {\n    setBill(\"\");\n    setTipPercent(15);\n    setPeople(\"1\");\n  }\n\n  return (\n    <main className=\"calc\">\n      <h1>💰 Tip calculator</h1>\n\n      <label htmlFor=\"bill\">Bill ($)</label>\n      <input id=\"bill\" type=\"number\" min=\"0\" value={bill} onChange={(e) => setBill(e.target.value)} />\n\n      <p className=\"label\">Tip</p>\n      <div className=\"tips\">\n        {TIP_OPTIONS.map((p) => (\n          <button key={p} className={p === tipPercent ? \"active\" : \"\"} onClick={() => setTipPercent(p)}>\n            {p}%\n          </button>\n        ))}\n      </div>\n\n      <label htmlFor=\"people\">People</label>\n      <input id=\"people\" type=\"number\" min=\"1\" value={people} onChange={(e) => setPeople(e.target.value)} />\n\n      <div className=\"results\">\n        <p>Tip / person <strong id=\"tip-per-person\">{money(tipEach)}</strong></p>\n        <p>Total / person <strong id=\"total-per-person\">{money(totalEach)}</strong></p>\n      </div>\n\n      <button className=\"reset\" onClick={reset}>Reset</button>\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: \"Segoe UI\", sans-serif;\n  background: #e2f6ea;\n}\n\n.calc {\n  max-width: 320px;\n  margin: 0 auto;\n  background: white;\n  padding: 16px 20px;\n  border-radius: 16px;\n}\n\nh1 {\n  font-size: 22px;\n  margin-top: 0;\n}\n\nlabel, .label {\n  display: block;\n  font-weight: 600;\n  margin: 12px 0 4px;\n}\n\ninput {\n  width: 100%;\n  box-sizing: border-box;\n  font-size: 18px;\n  padding: 6px 10px;\n}\n\n.tips {\n  display: flex;\n  gap: 6px;\n}\n\n.tips button {\n  flex: 1;\n  padding: 8px;\n  font-size: 16px;\n  border: 2px solid #138a4b;\n  background: white;\n  border-radius: 8px;\n  cursor: pointer;\n}\n\n.tips button.active {\n  background: #138a4b;\n  color: white;\n}\n\n.results {\n  margin-top: 16px;\n  background: #1d1f2d;\n  color: white;\n  border-radius: 12px;\n  padding: 4px 14px;\n}\n\n.results p {\n  display: flex;\n  justify-content: space-between;\n}\n\n.results strong {\n  color: #4fd08c;\n  font-size: 20px;\n}\n\n.reset {\n  margin-top: 12px;\n  width: 100%;\n  padding: 10px;\n  font-size: 16px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}\n",
      },
      check: async ({ $, $$, text, setValue, wait }) => {
        const tipBtn = (p) => $$('#root button').find((b) => b.textContent.trim() === p + '%');
        for (const p of [10, 15, 20]) if (!tipBtn(p)) return `Add a "${p}%" button.`;
        setValue('#bill', '100'); setValue('#people', '2'); await wait(30);
        tipBtn(20).click(); await wait(30);
        if (!tipBtn(20).classList.contains('active')) return 'The selected tip button should get the `active` class.';
        if (tipBtn(10).classList.contains('active')) return 'Only the selected tip button should be `active`.';
        if (text('#tip-per-person') !== '$10.00') return `A $100 bill, 20% tip, 2 people → tip per person should be $10.00 (it shows ${text('#tip-per-person')}).`;
        if (text('#total-per-person') !== '$60.00') return `…and total per person should be $60.00 (it shows ${text('#total-per-person')}).`;
        tipBtn(10).click(); await wait(30);
        if (text('#total-per-person') !== '$55.00') return 'Switching to 10% should update the total to $55.00.';
        setValue('#people', '0'); await wait(30);
        if (text('#total-per-person') !== '$0.00') return 'With 0 people, show $0.00 instead of dividing by zero.';
        const reset = $$('#root button').find((b) => /reset/i.test(b.textContent));
        if (!reset) return 'Add a Reset button.';
        reset.click(); await wait(30);
        return $('#bill').value === '' || 'Reset should clear the bill.';
      },
      success: "Your calculator is done! 🧮 Notice how little state it needed: everything else is derived.",
    },
    {
      type: 'explain',
      title: 'Module 9 complete',
      body: [
        "You've learned the core of React:",
        "- **Components** and **JSX**",
        "- **Props** (including `children`) for passing data down",
        "- **State** with `useState`, plus the rules for updating it",
        "- **Events**, **conditional rendering**, **lists with keys** and **controlled inputs**",
        "- Deriving values instead of storing extra state",
        "Next up is **Module 10: React Deep Dive**: side effects and data fetching, forms, sharing state between components, context, reducers, custom hooks, and setting up a real React project with Vite and React Router.",
      ],
    },
  ],
});
