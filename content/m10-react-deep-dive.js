/* Module 10 — React: Deep Dive */
Course.addContent('m10', {

  /* ---------------------------------------------------------------- */
  'use-effect': [
    {
      type: 'explain',
      title: 'Side effects and useEffect',
      body: [
        "A component's main job is to **calculate UI** from props and state. But apps also need to do things *outside* React: fetch data, start timers, change the page title, subscribe to events. These are **side effects**.",
        "Side effects don't belong in the render itself. Put them in `useEffect`, which runs **after** React has updated the screen:",
        { code: `import { useState, useEffect } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = \`You clicked \${count} times\`;\n  }, [count]);   // ← run again whenever count changes\n\n  return <button onClick={() => setCount(count + 1)}>+1</button>;\n}`, lang: 'jsx' },
      ],
    },
    {
      type: 'explain',
      title: 'The dependency array',
      body: [
        "The second argument tells React **when** to re-run the effect:",
        { code: `useEffect(() => { ... });          // after EVERY render (rarely what you want)\nuseEffect(() => { ... }, []);      // once, after the first render\nuseEffect(() => { ... }, [userId]); // after the first render, and whenever userId changes`, lang: 'jsx' },
        "List every prop or state value the effect *uses* in the array. That way it never works with stale values.",
        "### Cleaning up",
        "If an effect starts something ongoing (a timer, a subscription, an event listener), return a **cleanup** function that stops it. React calls it before re-running the effect and when the component disappears:",
        { code: `useEffect(() => {\n  const id = setInterval(() => console.log("tick"), 1000);\n  return () => clearInterval(id);   // cleanup\n}, []);`, lang: 'jsx' },
        "> In development, React's **Strict Mode** deliberately runs effects twice to help you spot missing cleanups. If something happens twice, that's probably why!",
      ],
    },
    {
      type: 'try',
      title: 'Sync the page title',
      body: ["The preview's page title is invisible here, but the checker can read it."],
      goal: "Add an effect that sets `document.title` to `Clicked <count> times` whenever `count` changes.",
      hint: [{ code: "useEffect(() => {\n  document.title = `Clicked ${count} times`;\n}, [count]);", lang: 'jsx' }],
      starter: {
        jsx: "import { useState, useEffect } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  // add your effect here\n\n  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState, useEffect } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Clicked ${count} times`;\n  }, [count]);\n\n  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, doc, wait, code }) => {
        if (!/useEffect\(/.test(code.jsx)) return 'Use `useEffect`.';
        if (doc.title !== 'Clicked 0 times') return 'The title should be "Clicked 0 times" right after the first render.';
        $('#root button').click(); await wait(50);
        $('#root button').click(); await wait(50);
        return doc.title === 'Clicked 2 times' || `After 2 clicks the title should be "Clicked 2 times" (it is "${doc.title}").`;
      },
    },
    {
      type: 'try',
      title: 'A stopwatch with cleanup',
      body: ["Timers are the classic effect that needs cleanup."],
      goal: [
        "- Keep a `seconds` state, starting at `0`",
        "- In an effect, start a `setInterval` that adds 1 every **1000 ms**",
        "- Return a cleanup function that calls `clearInterval`",
        "- Show the value in `#seconds`",
      ],
      hint: [
        ["Use the updater form inside the interval, since the effect only runs once: `setSeconds((s) => s + 1)`."],
        ["Remember the empty dependency array `[]` so you only start one interval."],
      ],
      starter: {
        jsx: "import { useState, useEffect } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction Stopwatch() {\n  const [seconds, setSeconds] = useState(0);\n\n  // start an interval here, and clean it up\n\n  return <p>⏱️ <span id=\"seconds\">{seconds}</span> seconds on this page</p>;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<Stopwatch />);\n",
      },
      solution: {
        jsx: "import { useState, useEffect } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction Stopwatch() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    const id = setInterval(() => {\n      setSeconds((s) => s + 1);\n    }, 1000);\n    return () => clearInterval(id);\n  }, []);\n\n  return <p>⏱️ <span id=\"seconds\">{seconds}</span> seconds on this page</p>;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<Stopwatch />);\n",
      },
      check: async ({ text, wait, code }) => {
        if (!/setInterval\(/.test(code.jsx)) return 'Use `setInterval` inside the effect.';
        if (!/return\s*\(\s*\)\s*=>\s*\{?\s*clearInterval|return\s+function/.test(code.jsx)) return 'Return a cleanup function that calls `clearInterval`.';
        const start = Number(text('#seconds'));
        await wait(2200);
        const later = Number(text('#seconds'));
        if (later - start < 2) return 'The seconds should go up by about 1 every second.';
        return later - start <= 3 || 'It\'s counting too fast. Do you have more than one interval running? Check the dependency array.';
      },
    },
    {
      type: 'explain',
      title: 'Fetching data in an effect',
      body: [
        "Loading data when a component appears is the most common effect. Track three things: the **data**, whether it's **loading**, and any **error**:",
        { code: `function UserList() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    async function load() {\n      try {\n        const res = await fetch("https://jsonplaceholder.typicode.com/users");\n        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n        setUsers(await res.json());\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    }\n    load();\n  }, []);\n\n  if (loading) return <p>Loading…</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;\n}`, lang: 'jsx' },
        "The effect function itself can't be `async`, so define an async function inside it and call it.",
        "> In bigger apps, libraries like **TanStack Query** handle caching, refetching and race conditions for you. Understanding this manual version first makes them easy to pick up.",
      ],
    },
    {
      type: 'try',
      title: 'Load users from an API',
      body: ["Needs an internet connection."],
      goal: [
        "- Fetch `https://jsonplaceholder.typicode.com/users` in an effect that runs once",
        "- While loading, render `<p>Loading…</p>`",
        "- Then render each user's `name` as an `<li>` inside a `<ul>`",
      ],
      hint: "Follow the pattern from the previous step. Use `[]` as the dependency array.",
      starter: {
        jsx: "import { useState, useEffect } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  // fetch the users here\n\n  return (\n    <ul>\n      {users.map((u) => <li key={u.id}>{u.name}</li>)}\n    </ul>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState, useEffect } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    async function load() {\n      try {\n        const res = await fetch(\"https://jsonplaceholder.typicode.com/users\");\n        setUsers(await res.json());\n      } finally {\n        setLoading(false);\n      }\n    }\n    load();\n  }, []);\n\n  if (loading) return <p>Loading…</p>;\n\n  return (\n    <ul>\n      {users.map((u) => <li key={u.id}>{u.name}</li>)}\n    </ul>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      checkDelay: 50,
      check: async ({ $$, text, wait, code }) => {
        if (!/fetch\(/.test(code.jsx)) return 'Use `fetch` inside a `useEffect`.';
        let sawLoading = /loading/i.test(text('#root'));
        for (let i = 0; i < 50 && $$('#root li').length === 0; i++) {
          if (/loading/i.test(text('#root'))) sawLoading = true;
          await wait(100);
        }
        if ($$('#root li').length !== 10) return `Expected 10 users but found ${$$('#root li').length}. (This needs an internet connection.)`;
        if (!sawLoading) return 'Show "Loading…" while the data is on its way.';
        return text('#root li') === 'Leanne Graham' || 'Each `<li>` should show the user\'s name.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'controlled-forms': [
    {
      type: 'explain',
      title: 'Forms the React way',
      body: [
        "In React, form inputs are usually **controlled**: state is the single source of truth, the input displays it, and `onChange` updates it. Submitting works like in Module 5:",
        { code: `function SignupForm() {\n  const [email, setEmail] = useState("");\n  const [submitted, setSubmitted] = useState(false);\n\n  function handleSubmit(e) {\n    e.preventDefault();        // still needed!\n    setSubmitted(true);\n  }\n\n  if (submitted) return <p>Thanks! We'll email {email}.</p>;\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <label htmlFor="email">Email</label>\n      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />\n      <button disabled={!email.includes("@")}>Sign up</button>\n    </form>\n  );\n}`, lang: 'jsx' },
        "Because the value lives in state, you can validate on every keystroke, disable the button, show hints, or reset the form by resetting the state.",
      ],
    },
    {
      type: 'explain',
      title: 'Many inputs, one state object',
      body: [
        "Instead of one `useState` per field, store the whole form in an object and use each input's `name` to update the right key:",
        { code: `const [form, setForm] = useState({ name: "", email: "", plan: "free", agree: false });\n\nfunction handleChange(e) {\n  const { name, value, type, checked } = e.target;\n  setForm({ ...form, [name]: type === "checkbox" ? checked : value });\n}\n\n<input name="name" value={form.name} onChange={handleChange} />\n<input name="email" value={form.email} onChange={handleChange} />\n<select name="plan" value={form.plan} onChange={handleChange}>...</select>\n<input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />`, lang: 'jsx' },
        "- `[name]: value` is a **computed property name**: the key comes from a variable.",
        "- Checkboxes use `checked`, not `value`.",
        "- `<select>` and `<textarea>` use `value` just like inputs.",
      ],
    },
    {
      type: 'try',
      title: 'Sign-up form',
      body: ["Build a validated sign-up form with a single state object."],
      goal: [
        "- Store `name`, `email` and `agree` in one `form` state object, and make all three inputs controlled",
        "- The **Create account** button is disabled until: name isn't empty, email contains `@`, and agree is checked",
        "- On submit (prevent the default!), replace the form with `<p className=\"success\">Welcome, <name>!</p>`",
      ],
      hint: [
        ["Use the shared `handleChange` from the previous step. Each input needs a matching `name` attribute."],
        ["`const valid = form.name.trim() !== \"\" && form.email.includes(\"@\") && form.agree;` then `<button disabled={!valid}>`."],
      ],
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n\n  return (\n    <form>\n      <label htmlFor=\"name\">Name</label>\n      <input id=\"name\" />\n\n      <label htmlFor=\"email\">Email</label>\n      <input id=\"email\" type=\"email\" />\n\n      <label className=\"check\">\n        <input id=\"agree\" type=\"checkbox\" /> I agree to the terms\n      </label>\n\n      <button>Create account</button>\n    </form>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 280px;\n}\n\n.check {\n  margin: 8px 0;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n}\n\n.success {\n  color: #138a4b;\n  font-size: 20px;\n  font-weight: bold;\n}\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n  const [form, setForm] = useState({ name: \"\", email: \"\", agree: false });\n  const [done, setDone] = useState(false);\n\n  function handleChange(e) {\n    const { name, value, type, checked } = e.target;\n    setForm({ ...form, [name]: type === \"checkbox\" ? checked : value });\n  }\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    setDone(true);\n  }\n\n  const valid = form.name.trim() !== \"\" && form.email.includes(\"@\") && form.agree;\n\n  if (done) return <p className=\"success\">Welcome, {form.name}!</p>;\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <label htmlFor=\"name\">Name</label>\n      <input id=\"name\" name=\"name\" value={form.name} onChange={handleChange} />\n\n      <label htmlFor=\"email\">Email</label>\n      <input id=\"email\" name=\"email\" type=\"email\" value={form.email} onChange={handleChange} />\n\n      <label className=\"check\">\n        <input id=\"agree\" name=\"agree\" type=\"checkbox\" checked={form.agree} onChange={handleChange} /> I agree to the terms\n      </label>\n\n      <button disabled={!valid}>Create account</button>\n    </form>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 280px;\n}\n\n.check {\n  margin: 8px 0;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n}\n\n.success {\n  color: #138a4b;\n  font-size: 20px;\n  font-weight: bold;\n}\n",
      },
      check: async ({ $, text, setValue, wait }) => {
        const btn = () => $('#root button');
        if (!btn().disabled) return 'The button should be disabled while the form is empty.';
        setValue('#name', 'Grace'); await wait(20);
        setValue('#email', 'grace-at-example.com'); await wait(20);
        $('#agree').click(); await wait(20);
        if (!btn().disabled) return 'An email without "@" should keep the button disabled.';
        setValue('#email', 'grace@example.com'); await wait(20);
        if (btn().disabled) return 'With a name, a valid email and the box ticked, the button should be enabled. Is each input controlled with a matching `name`?';
        $('#agree').click(); await wait(20);
        if (!btn().disabled) return 'Unticking "I agree" should disable the button again.';
        $('#agree').click(); await wait(20);
        $('#root form').requestSubmit(); await wait(40);
        return text('#root .success') === 'Welcome, Grace!' || 'After submitting, show "Welcome, Grace!" in a `.success` paragraph.';
      },
    },
    {
      type: 'explain',
      title: 'Showing validation errors',
      body: [
        "Good forms explain what's wrong, but only once the user has had a chance to type. A simple pattern is to track which fields were **touched**:",
        { code: `const [touched, setTouched] = useState({});\nconst errors = {};\nif (!form.email.includes("@")) errors.email = "Enter a valid email address.";\n\n<input\n  name="email"\n  value={form.email}\n  onChange={handleChange}\n  onBlur={() => setTouched({ ...touched, email: true })}\n  aria-invalid={touched.email && !!errors.email}\n  aria-describedby="email-error"\n/>\n{touched.email && errors.email && <p id="email-error" className="error">{errors.email}</p>}`, lang: 'jsx' },
        "- `onBlur` fires when the input loses focus.",
        "- `errors` is **derived** on every render, not stored in state.",
        "- `aria-invalid` and `aria-describedby` let screen readers announce the error (remember Module 6!).",
        "> For large forms, libraries like **React Hook Form** handle this bookkeeping for you.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'lifting-state': [
    {
      type: 'explain',
      title: 'Sharing state: lift it up',
      body: [
        "What if two components need the same data, like a form that adds items and a list that shows them? State lives in one component, so move (**lift**) it up to their closest common parent and pass it down:",
        { code: `function App() {\n  const [items, setItems] = useState([]);           // state lives in the parent\n\n  function addItem(text) {\n    setItems([...items, { id: Date.now(), text }]);\n  }\n\n  return (\n    <>\n      <AddItemForm onAdd={addItem} />              {/* pass a function down */}\n      <ItemList items={items} />                   {/* pass data down */}\n    </>\n  );\n}\n\nfunction AddItemForm({ onAdd }) {\n  // ...when submitted: onAdd(text)               ← child "calls up"\n}`, lang: 'jsx' },
        "This is React's core data flow: **data flows down** through props, and **events flow up** through callback props like `onAdd`.",
        "> Naming convention: props that are callbacks start with `on` (`onAdd`, `onDelete`), and the functions that handle them start with `handle` or describe the action.",
      ],
    },
    {
      type: 'try',
      title: 'Connect the components',
      body: ["The form and the list are separate components. The form keeps its own input text, but the **items** must live in `App` so the list (and the count) can see them."],
      goal: [
        "- In `App`, create an `items` state (array) and an `addItem(text)` function",
        "- Pass `addItem` to `AddItemForm` as `onAdd`, and call it on submit (then clear the input)",
        "- Pass `items` to `ItemList` and render them as `<li>`s",
        "- Show the number of items in the `<h1>`: `Packing list (<n>)`",
      ],
      hint: [
        ["In `AddItemForm`'s submit handler: `e.preventDefault(); if (!text.trim()) return; onAdd(text.trim()); setText(\"\");`"],
        ["In `ItemList`: `{items.map((item) => <li key={item.id}>{item.text}</li>)}`"],
      ],
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction AddItemForm() {\n  const [text, setText] = useState(\"\");\n\n  return (\n    <form>\n      <input id=\"new-item\" value={text} onChange={(e) => setText(e.target.value)} aria-label=\"New item\" />\n      <button>Add</button>\n    </form>\n  );\n}\n\nfunction ItemList() {\n  return <ul></ul>;\n}\n\nfunction App() {\n\n  return (\n    <main>\n      <h1>Packing list (0)</h1>\n      <AddItemForm />\n      <ItemList />\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction AddItemForm({ onAdd }) {\n  const [text, setText] = useState(\"\");\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    onAdd(text.trim());\n    setText(\"\");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input id=\"new-item\" value={text} onChange={(e) => setText(e.target.value)} aria-label=\"New item\" />\n      <button>Add</button>\n    </form>\n  );\n}\n\nfunction ItemList({ items }) {\n  return (\n    <ul>\n      {items.map((item) => (\n        <li key={item.id}>{item.text}</li>\n      ))}\n    </ul>\n  );\n}\n\nfunction App() {\n  const [items, setItems] = useState([]);\n\n  function addItem(text) {\n    setItems([...items, { id: Date.now() + Math.random(), text }]);\n  }\n\n  return (\n    <main>\n      <h1>Packing list ({items.length})</h1>\n      <AddItemForm onAdd={addItem} />\n      <ItemList items={items} />\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, $$, text, setValue, wait }) => {
        const add = async (t) => { setValue('#new-item', t); await wait(20); $('#root form').requestSubmit(); await wait(40); };
        await add('Passport');
        await add('Sunscreen');
        await add('   ');
        const items = $$('#root li').map((li) => li.textContent);
        if (items.join(',') !== 'Passport,Sunscreen') return `After adding Passport and Sunscreen (and a blank), the list should show exactly those two. It shows: ${items.join(', ') || 'nothing'}.`;
        if ($('#new-item').value.trim() !== '') return 'Clear the input after adding an item.';
        return text('#root h1') === 'Packing list (2)' || 'The heading should show the count: "Packing list (2)".';
      },
    },
    {
      type: 'explain',
      title: 'Thinking in React',
      body: [
        "The official React docs suggest a 5-step process for building any UI:",
        "1. **Break the UI into a component hierarchy.** Draw boxes around parts of a mockup.",
        "2. **Build a static version** with props only, no state.",
        "3. **Find the minimal state.** Ask of each piece of data: does it change over time? Can it be computed from something else? If it can be computed, it's not state.",
        "4. **Decide where state lives**: the closest common parent of every component that uses it.",
        "5. **Add inverse data flow**: pass callbacks down so children can request changes.",
        "When you find yourself passing props through many layers that don't use them (\"**prop drilling**\"), it's time for **context**. That's the next chapter.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'context-reducer-hooks': [
    {
      type: 'explain',
      title: 'Context: skip the prop drilling',
      body: [
        "Some data is needed all over the app: the logged-in user, the theme, the language. **Context** lets any component read it without passing props through every level:",
        { code: `import { createContext, useContext, useState } from "react";\n\n// 1. Create the context\nconst ThemeContext = createContext("light");\n\nfunction App() {\n  const [theme, setTheme] = useState("light");\n  // 2. Provide a value to everything inside\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Page />\n    </ThemeContext.Provider>\n  );\n}\n\n// 3. Read it anywhere below, no props needed\nfunction ThemeButton() {\n  const { theme, setTheme } = useContext(ThemeContext);\n  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>;\n}`, lang: 'jsx' },
        "> Don't reach for context for everything. Passing props is simpler and more explicit. Use context for truly app-wide data.",
      ],
    },
    {
      type: 'try',
      title: 'Theme switcher with context',
      body: ["`Toolbar` and `Card` are nested inside `Page`, which knows nothing about themes. That's the point!"],
      goal: [
        "- In `App`, hold a `theme` state (`\"light\"` to start) and provide `{ theme, toggleTheme }` through `ThemeContext`",
        "- `Toolbar`'s button calls `toggleTheme` from the context",
        "- `Card` reads `theme` from the context and uses it as an extra class: `className={`card ${theme}`}`",
      ],
      hint: [
        ["`const toggleTheme = () => setTheme(theme === \"light\" ? \"dark\" : \"light\");`"],
        ["Wrap `<Page />` in `<ThemeContext.Provider value={{ theme, toggleTheme }}>`."],
      ],
      starter: {
        jsx: "import { createContext, useContext, useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst ThemeContext = createContext(null);\n\nfunction Toolbar() {\n  return <button className=\"toggle\">Toggle theme</button>;\n}\n\nfunction Card() {\n  return (\n    <div className=\"card\">\n      <h2>Hello!</h2>\n      <p>I change color with the theme.</p>\n    </div>\n  );\n}\n\nfunction Page() {\n  return (\n    <>\n      <Toolbar />\n      <Card />\n    </>\n  );\n}\n\nfunction App() {\n  return <Page />;\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.card {\n  margin-top: 10px;\n  padding: 12px 16px;\n  border-radius: 12px;\n  border: 1px solid #ccc;\n}\n\n.card.light {\n  background: white;\n  color: #1a1c2b;\n}\n\n.card.dark {\n  background: #1d1f2d;\n  color: white;\n}\n",
      },
      solution: {
        jsx: "import { createContext, useContext, useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst ThemeContext = createContext(null);\n\nfunction Toolbar() {\n  const { toggleTheme } = useContext(ThemeContext);\n  return <button className=\"toggle\" onClick={toggleTheme}>Toggle theme</button>;\n}\n\nfunction Card() {\n  const { theme } = useContext(ThemeContext);\n  return (\n    <div className={`card ${theme}`}>\n      <h2>Hello!</h2>\n      <p>I change color with the theme.</p>\n    </div>\n  );\n}\n\nfunction Page() {\n  return (\n    <>\n      <Toolbar />\n      <Card />\n    </>\n  );\n}\n\nfunction App() {\n  const [theme, setTheme] = useState(\"light\");\n  const toggleTheme = () => setTheme(theme === \"light\" ? \"dark\" : \"light\");\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      <Page />\n    </ThemeContext.Provider>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.card {\n  margin-top: 10px;\n  padding: 12px 16px;\n  border-radius: 12px;\n  border: 1px solid #ccc;\n}\n\n.card.light {\n  background: white;\n  color: #1a1c2b;\n}\n\n.card.dark {\n  background: #1d1f2d;\n  color: white;\n}\n",
      },
      check: async ({ $, wait, code }) => {
        if (!/useContext\(\s*ThemeContext\s*\)/.test(code.jsx)) return 'Read the theme with `useContext(ThemeContext)`.';
        if (/function Page\(\s*\{/.test(code.jsx)) return 'Don\'t pass props through `Page`. Use the context instead.';
        const card = () => $('#root .card');
        if (!card() || !card().classList.contains('light')) return 'The card should start with the `light` class.';
        $('#root .toggle').click(); await wait(30);
        if (!card().classList.contains('dark')) return 'After clicking the toggle, the card should have the `dark` class.';
        $('#root .toggle').click(); await wait(30);
        return card().classList.contains('light') || 'Clicking again should switch back to `light`.';
      },
    },
    {
      type: 'explain',
      title: 'useReducer for complex state',
      body: [
        "When state updates get complicated, with many actions changing the same data, `useReducer` collects all the update logic in one place. A **reducer** is a pure function: `(state, action) → newState`.",
        { code: `function cartReducer(state, action) {\n  switch (action.type) {\n    case "add":\n      return { ...state, items: [...state.items, action.product] };\n    case "remove":\n      return { ...state, items: state.items.filter((p) => p.id !== action.id) };\n    case "clear":\n      return { ...state, items: [] };\n    default:\n      throw new Error("Unknown action: " + action.type);\n  }\n}\n\nfunction Shop() {\n  const [cart, dispatch] = useReducer(cartReducer, { items: [] });\n\n  return <button onClick={() => dispatch({ type: "add", product: mug })}>Add mug</button>;\n}`, lang: 'jsx' },
        "- Components describe **what happened** by dispatching actions like `{ type: \"add\", product }`.",
        "- The reducer decides **how state changes**, never mutating and always returning a new object.",
        "- Reducers are plain functions, so they're easy to test. You'll write one next.",
      ],
    },
    {
      type: 'try',
      title: 'Write a cart reducer',
      body: ["The UI is done and already dispatches actions. Your job is the reducer."],
      goal: [
        "Complete `cartReducer(state, action)` for a state shaped like `{ items: [] }`:",
        "- `add`: append `action.product` to `items`",
        "- `remove`: remove the item whose `id` is `action.id`",
        "- `clear`: empty the cart",
        "Never mutate `state`. Always return a new object.",
      ],
      hint: "Copy the `switch` from the previous step. It's almost exactly what you need.",
      starter: {
        jsx: "import { useReducer } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst PRODUCTS = [\n  { id: 1, name: \"☕ Mug\", price: 12 },\n  { id: 2, name: \"👕 T-shirt\", price: 20 },\n  { id: 3, name: \"🧢 Cap\", price: 15 },\n];\n\nfunction cartReducer(state, action) {\n  // handle \"add\", \"remove\" and \"clear\"\n  return state;\n}\n\nfunction App() {\n  const [cart, dispatch] = useReducer(cartReducer, { items: [] });\n  const total = cart.items.reduce((sum, p) => sum + p.price, 0);\n\n  return (\n    <main>\n      <h2>Shop</h2>\n      {PRODUCTS.map((p) => (\n        <button key={p.id} className=\"add\" onClick={() => dispatch({ type: \"add\", product: p })}>\n          Add {p.name}\n        </button>\n      ))}\n      <h2>Cart ({cart.items.length}) total ${total}</h2>\n      <ul>\n        {cart.items.map((p, i) => (\n          <li key={i}>\n            {p.name} <button onClick={() => dispatch({ type: \"remove\", id: p.id })}>✕</button>\n          </li>\n        ))}\n      </ul>\n      <button className=\"clear\" onClick={() => dispatch({ type: \"clear\" })}>Clear cart</button>\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nbutton {\n  margin: 2px;\n}\n",
      },
      solution: {
        jsx: "import { useReducer } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nconst PRODUCTS = [\n  { id: 1, name: \"☕ Mug\", price: 12 },\n  { id: 2, name: \"👕 T-shirt\", price: 20 },\n  { id: 3, name: \"🧢 Cap\", price: 15 },\n];\n\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case \"add\":\n      return { ...state, items: [...state.items, action.product] };\n    case \"remove\":\n      return { ...state, items: state.items.filter((p) => p.id !== action.id) };\n    case \"clear\":\n      return { ...state, items: [] };\n    default:\n      throw new Error(\"Unknown action: \" + action.type);\n  }\n}\n\nfunction App() {\n  const [cart, dispatch] = useReducer(cartReducer, { items: [] });\n  const total = cart.items.reduce((sum, p) => sum + p.price, 0);\n\n  return (\n    <main>\n      <h2>Shop</h2>\n      {PRODUCTS.map((p) => (\n        <button key={p.id} className=\"add\" onClick={() => dispatch({ type: \"add\", product: p })}>\n          Add {p.name}\n        </button>\n      ))}\n      <h2>Cart ({cart.items.length}) total ${total}</h2>\n      <ul>\n        {cart.items.map((p, i) => (\n          <li key={i}>\n            {p.name} <button onClick={() => dispatch({ type: \"remove\", id: p.id })}>✕</button>\n          </li>\n        ))}\n      </ul>\n      <button className=\"clear\" onClick={() => dispatch({ type: \"clear\" })}>Clear cart</button>\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nbutton {\n  margin: 2px;\n}\n",
      },
      check: ({ get }) => {
        const r = get('cartReducer');
        if (typeof r !== 'function') return 'Keep the `cartReducer` function.';
        const mug = { id: 1, name: 'Mug', price: 12 }, cap = { id: 3, name: 'Cap', price: 15 };
        const s0 = Object.freeze({ items: Object.freeze([]) });
        let s1;
        try { s1 = r(s0, { type: 'add', product: mug }); } catch (e) { return '`add` should not change the existing state. Return a new object and a new array.'; }
        if (s1 === s0 || !s1.items || s1.items.length !== 1 || s1.items[0] !== mug) return '`add` should return a new state with the product appended to `items`.';
        const s2 = r(s1, { type: 'add', product: cap });
        if (s2.items.length !== 2 || s1.items.length !== 1) return '`add` should create a new array, not push into the old one.';
        const s3 = r(s2, { type: 'remove', id: 1 });
        if (s3.items.length !== 1 || s3.items[0] !== cap || s2.items.length !== 2) return '`remove` should return a new state without the item whose id matches `action.id`.';
        const s4 = r(s3, { type: 'clear' });
        return (s4.items && s4.items.length === 0 && s3.items.length === 1) || '`clear` should return a new state with an empty `items` array.';
      },
    },
    {
      type: 'explain',
      title: 'Custom hooks',
      body: [
        "When several components need the same stateful logic, extract it into a **custom hook**: a function whose name starts with `use` and that calls other hooks.",
        { code: `function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const saved = localStorage.getItem(key);\n    return saved !== null ? JSON.parse(saved) : initialValue;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}\n\n// Used exactly like useState, but it survives a page reload!\nconst [name, setName] = useLocalStorage("name", "");`, lang: 'jsx' },
        "Each component that calls a custom hook gets its **own** independent state. Hooks share *logic*, not data.",
        "**The rules of hooks:**",
        "- Only call hooks at the **top level** of a component or custom hook (not inside `if`, loops or nested functions).",
        "- Only call hooks from **React functions** (components and custom hooks).",
        "> `useState(() => ...)` with a function is **lazy initialization**: the function only runs on the first render.",
      ],
    },
    {
      type: 'try',
      title: 'Write useToggle',
      body: ["Toggles are everywhere: menus, modals, accordions, dark mode. Let's make them one line each."],
      goal: [
        "Write a custom hook `useToggle(initial = false)` that returns `[value, toggle]`, where calling `toggle()` flips the value.",
        "The two components below already use it. They should toggle **independently**.",
      ],
      hint: [{ code: "function useToggle(initial = false) {\n  const [value, setValue] = useState(initial);\n  const toggle = () => setValue((v) => !v);\n  return [value, toggle];\n}", lang: 'jsx' }],
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\n// Write useToggle here\n\n\nfunction Faq() {\n  const [open, toggleOpen] = useToggle();\n  return (\n    <div className=\"faq\">\n      <button onClick={toggleOpen}>What is a hook?</button>\n      {open && <p>A function that lets components use React features.</p>}\n    </div>\n  );\n}\n\nfunction Mute() {\n  const [muted, toggleMuted] = useToggle(true);\n  return <button className=\"mute\" onClick={toggleMuted}>{muted ? \"🔇 Muted\" : \"🔊 Sound on\"}</button>;\n}\n\nfunction App() {\n  return (\n    <>\n      <Faq />\n      <Mute />\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction useToggle(initial = false) {\n  const [value, setValue] = useState(initial);\n  const toggle = () => setValue((v) => !v);\n  return [value, toggle];\n}\n\nfunction Faq() {\n  const [open, toggleOpen] = useToggle();\n  return (\n    <div className=\"faq\">\n      <button onClick={toggleOpen}>What is a hook?</button>\n      {open && <p>A function that lets components use React features.</p>}\n    </div>\n  );\n}\n\nfunction Mute() {\n  const [muted, toggleMuted] = useToggle(true);\n  return <button className=\"mute\" onClick={toggleMuted}>{muted ? \"🔇 Muted\" : \"🔊 Sound on\"}</button>;\n}\n\nfunction App() {\n  return (\n    <>\n      <Faq />\n      <Mute />\n    </>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
      },
      check: async ({ $, get, wait }) => {
        if (typeof get('useToggle') !== 'function') return 'Write a function called `useToggle`.';
        if (!$('#root .faq')) return 'The app isn\'t rendering. Check the console for errors.';
        if ($('#root .faq p')) return 'The FAQ answer should start hidden (`useToggle()` defaults to `false`).';
        if (!$('#root .mute').textContent.includes('Muted')) return '`useToggle(true)` should start as `true`, so "🔇 Muted".';
        $('#root .faq button').click(); await wait(30);
        if (!$('#root .faq p')) return 'Calling `toggle()` should flip the value to `true`.';
        if (!$('#root .mute').textContent.includes('Muted')) return 'The two components should toggle independently.';
        $('#root .mute').click(); await wait(30);
        return $('#root .mute').textContent.includes('Sound on') || 'The mute button should toggle too.';
      },
    },
    {
      type: 'explain',
      title: 'useRef, useMemo and friends',
      body: [
        "A few more built-in hooks you'll meet:",
        "**`useRef`**: a box that holds a value across renders *without* causing re-renders. Most often used to reach a DOM element:",
        { code: `function SearchBox() {\n  const inputRef = useRef(null);\n  return (\n    <>\n      <input ref={inputRef} />\n      <button onClick={() => inputRef.current.focus()}>Focus the search</button>\n    </>\n  );\n}`, lang: 'jsx' },
        "**`useMemo`** caches an expensive calculation between renders: `const sorted = useMemo(() => bigList.sort(...), [bigList]);`",
        "**`useCallback`** caches a function between renders. It's mostly useful for performance optimizations.",
        "**`useId`** generates unique IDs for linking labels and inputs: `const id = useId();`",
        "> Don't optimize early. Reach for `useMemo`/`useCallback` only when you've measured a performance problem.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'vite-router': [
    {
      type: 'explain',
      title: 'Real React projects with Vite',
      body: [
        "Real projects don't run React from a CDN. They use a **build tool** that bundles your modules, compiles JSX, handles npm packages, and reloads instantly while you work. The standard choice today is **Vite** (French for \"fast\").",
        "A new Vite + React project looks like this:",
        { code: `my-app/\n├── index.html          ← the single HTML page, with <div id="root">\n├── package.json        ← dependencies and scripts\n├── vite.config.js\n├── public/             ← static files copied as-is\n└── src/\n    ├── main.jsx        ← entry point: createRoot(...).render(<App />)\n    ├── App.jsx         ← your root component\n    ├── App.css\n    └── components/     ← your components, one per file`, lang: 'text' },
        "Each component usually lives in its own file and is shared with `export default`, using the modules you learned in Module 8:",
        { code: `// src/components/Greeting.jsx\nexport default function Greeting({ name }) {\n  return <p>Hello, {name}!</p>;\n}\n\n// src/App.jsx\nimport Greeting from "./components/Greeting.jsx";`, lang: 'jsx' },
      ],
    },
    {
      type: 'local',
      title: 'Create your first Vite app',
      body: [
        "You need **Node.js** installed. If you haven't installed it yet, download the **LTS** version from [nodejs.org](https://nodejs.org) (Module 11 covers Node in detail). Check it worked by opening a terminal and running `node -v`.",
        "### 1. Create the project",
        "Open a terminal in the folder where you keep your projects (in VS Code: **Terminal → New Terminal**) and run:",
        { code: `npm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev`, lang: 'bash' },
        "Vite prints a local address like `http://localhost:5173`. Open it in your browser and you'll see the starter page with a counter.",
        "### 2. Make it yours",
        "1. Open the `my-react-app` folder in VS Code.",
        "2. Open `src/App.jsx`, delete everything inside the `return ( ... )`, and return your own JSX.",
        "3. Save. The browser updates instantly without losing state. That's **Hot Module Replacement** (HMR).",
        "4. Create `src/components/Header.jsx`, export a component from it, and import it into `App.jsx`.",
        "### 3. Useful commands",
        "- `npm run dev`: start the development server",
        "- `npm run build`: create an optimized production build in the `dist/` folder",
        "- `npm run preview`: serve that production build locally to test it",
        "> Stop the dev server with **Ctrl+C** in the terminal.",
      ],
    },
    {
      type: 'explain',
      title: 'Multiple pages with React Router',
      body: [
        "A React app is a **single-page application** (SPA): one HTML page where JavaScript swaps the content. **React Router** maps URLs to components, so `/about` shows `<About />`, and the back button works.",
        { code: `npm install react-router`, lang: 'bash' },
        { code: `// src/main.jsx\nimport { createRoot } from "react-dom/client";\nimport { BrowserRouter } from "react-router";\nimport App from "./App.jsx";\n\ncreateRoot(document.getElementById("root")).render(\n  <BrowserRouter>\n    <App />\n  </BrowserRouter>\n);`, lang: 'jsx', label: 'src/main.jsx' },
        { code: `// src/App.jsx\nimport { Routes, Route, Link, NavLink } from "react-router";\nimport Home from "./pages/Home.jsx";\nimport About from "./pages/About.jsx";\nimport User from "./pages/User.jsx";\nimport NotFound from "./pages/NotFound.jsx";\n\nexport default function App() {\n  return (\n    <>\n      <nav>\n        <NavLink to="/">Home</NavLink>\n        <NavLink to="/about">About</NavLink>\n        <Link to="/users/42">User 42</Link>\n      </nav>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/users/:id" element={<User />} />\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </>\n  );\n}`, lang: 'jsx', label: 'src/App.jsx' },
        "- Use `<Link>` instead of `<a>` for internal links, so the page doesn't fully reload.",
        "- `<NavLink>` is a Link that gets an `active` class when its URL matches. Perfect for menus.",
        "- `path=\"*\"` catches every unknown URL: your 404 page.",
      ],
    },
    {
      type: 'explain',
      title: 'URL parameters and navigation',
      body: [
        "In `path=\"/users/:id\"`, `:id` is a **URL parameter**, like in Express (coming in Module 11). Read it with `useParams`:",
        { code: `// src/pages/User.jsx\nimport { useParams, useNavigate } from "react-router";\n\nexport default function User() {\n  const { id } = useParams();          // "/users/42" → id === "42"\n  const navigate = useNavigate();\n\n  return (\n    <>\n      <h1>User #{id}</h1>\n      <button onClick={() => navigate("/")}>Back home</button>\n    </>\n  );\n}`, lang: 'jsx', label: 'src/pages/User.jsx' },
        "- `useParams()` returns the URL parameters as strings.",
        "- `useNavigate()` returns a function to change pages from code, for example after a form is submitted.",
        "- `useSearchParams()` reads and writes the query string (`?q=pizza`). It's great for search pages, because the search survives a reload.",
      ],
    },
    {
      type: 'local',
      title: 'Add routing to your app',
      body: [
        "In your `my-react-app` project from earlier:",
        "1. Run `npm install react-router`.",
        "2. Wrap `<App />` in `<BrowserRouter>` in `src/main.jsx`.",
        "3. Create a `src/pages/` folder with `Home.jsx`, `About.jsx` and `NotFound.jsx`. Each one exports a simple component.",
        "4. In `App.jsx`, add a `<nav>` with `NavLink`s and a `<Routes>` block like the example.",
        "5. Add a dynamic route `/users/:id` that shows the id with `useParams()`.",
        "6. Style the active link: `nav a.active { font-weight: bold; }`.",
        "Click around: the URL changes, the back and forward buttons work, and the page never fully reloads.",
        "> **Deploying an SPA:** after `npm run build`, upload the `dist/` folder to Netlify or Vercel. Because there's only one real HTML file, tell the host to send every URL to `index.html`. On Netlify, create `public/_redirects` containing `/*  /index.html  200`.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-show-search': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "A **TV show search app** powered by the free TVMaze API (no key needed). It brings together controlled forms, effects or async handlers, loading and error states, lists, conditional rendering and lifted state.",
        "The API:",
        { code: `GET https://api.tvmaze.com/search/shows?q=girls\n\n[\n  {\n    "score": 0.9,\n    "show": {\n      "id": 139,\n      "name": "Girls",\n      "premiered": "2012-04-15",\n      "genres": ["Drama", "Romance"],\n      "rating": { "average": 6.5 },\n      "image": { "medium": "https://static.tvmaze.com/...jpg" }   ← can be null!\n    }\n  },\n  ...\n]`, lang: 'text' },
        "Notice that each result wraps the show in a `show` property, and that `image` can be `null`. Real APIs are messy, so code defensively.",
      ],
    },
    {
      type: 'project',
      title: 'TV show search',
      body: ["Needs an internet connection. Keep `form#search-form`, `input#query` and the `.show-card` class for the checker."],
      tasks: [
        "A controlled search input `#query` inside `form#search-form`",
        "On submit (`preventDefault`!), fetch `https://api.tvmaze.com/search/shows?q=<query>` (encode it with `encodeURIComponent`)",
        "Track `loading` and `error` state, and show \"Loading…\" and a friendly error message",
        "Render each result as a `.show-card` with the image (or a placeholder when `image` is null), the name in an `<h3>`, the year and the rating",
        "Show \"No shows found\" when a search returns an empty array",
        "Split your UI into components: `SearchForm`, `ShowList` and `ShowCard`, lifting state to `App`",
        "Add a ⭐ favorite button on each card, with favorites stored in `App` state and their count shown in the header",
      ],
      hint: [
        ["The year: `show.premiered ? show.premiered.slice(0, 4) : \"?\"`. The rating: `show.rating?.average ?? \"–\"`."],
        ["Store favorites as an array of ids. Toggle with `favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]`."],
        ["You don't need `useEffect` here: fetching inside the submit handler is fine, because the user triggers it."],
      ],
      starter: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction App() {\n\n  return (\n    <main>\n      <header>\n        <h1>📺 Show finder</h1>\n      </header>\n\n      <form id=\"search-form\">\n        <input id=\"query\" placeholder=\"Search for a TV show…\" aria-label=\"Search shows\" />\n        <button>Search</button>\n      </form>\n\n      <div className=\"results\"></div>\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: \"Segoe UI\", sans-serif;\n  background: #111219;\n  color: #e9eaf3;\n}\n\nheader {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n#search-form {\n  display: flex;\n  gap: 6px;\n  margin-bottom: 12px;\n}\n\n#search-form input {\n  flex: 1;\n  padding: 8px;\n  font-size: 16px;\n}\n\n.results {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n  gap: 12px;\n}\n\n.show-card {\n  background: #1d1f2d;\n  border-radius: 10px;\n  overflow: hidden;\n  padding-bottom: 8px;\n}\n\n.show-card img, .show-card .placeholder {\n  width: 100%;\n  aspect-ratio: 210 / 295;\n  object-fit: cover;\n  display: block;\n  background: #2f3245;\n}\n\n.show-card h3 {\n  font-size: 15px;\n  margin: 8px 8px 2px;\n}\n\n.show-card p {\n  font-size: 13px;\n  margin: 0 8px;\n  color: #a0a5bc;\n}\n",
      },
      solution: {
        jsx: "import { useState } from \"react\";\nimport { createRoot } from \"react-dom/client\";\n\nfunction SearchForm({ onSearch }) {\n  const [query, setQuery] = useState(\"\");\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (query.trim()) onSearch(query.trim());\n  }\n\n  return (\n    <form id=\"search-form\" onSubmit={handleSubmit}>\n      <input id=\"query\" value={query} onChange={(e) => setQuery(e.target.value)} placeholder=\"Search for a TV show…\" aria-label=\"Search shows\" />\n      <button>Search</button>\n    </form>\n  );\n}\n\nfunction ShowCard({ show, isFav, onToggleFav }) {\n  const year = show.premiered ? show.premiered.slice(0, 4) : \"?\";\n  const rating = show.rating?.average ?? \"–\";\n\n  return (\n    <article className=\"show-card\">\n      {show.image ? <img src={show.image.medium} alt={`${show.name} poster`} /> : <div className=\"placeholder\" aria-hidden=\"true\" />}\n      <h3>{show.name}</h3>\n      <p>{year} · ⭐ {rating}</p>\n      <button className=\"fav\" onClick={onToggleFav} aria-pressed={isFav}>\n        {isFav ? \"★ Favorite\" : \"☆ Add to favorites\"}\n      </button>\n    </article>\n  );\n}\n\nfunction ShowList({ shows, favs, onToggleFav }) {\n  return (\n    <div className=\"results\">\n      {shows.map((show) => (\n        <ShowCard key={show.id} show={show} isFav={favs.includes(show.id)} onToggleFav={() => onToggleFav(show.id)} />\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  const [shows, setShows] = useState(null);\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n  const [favs, setFavs] = useState([]);\n\n  async function search(query) {\n    setLoading(true);\n    setError(null);\n    try {\n      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);\n      if (!res.ok) throw new Error(`HTTP ${res.status}`);\n      const data = await res.json();\n      setShows(data.map((result) => result.show));\n    } catch (err) {\n      setError(\"Something went wrong. Please try again.\");\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  function toggleFav(id) {\n    setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);\n  }\n\n  return (\n    <main>\n      <header>\n        <h1>📺 Show finder</h1>\n        <span>★ {favs.length}</span>\n      </header>\n\n      <SearchForm onSearch={search} />\n\n      {loading && <p>Loading…</p>}\n      {error && <p role=\"alert\">{error}</p>}\n      {!loading && shows && shows.length === 0 && <p>No shows found.</p>}\n      {!loading && shows && <ShowList shows={shows} favs={favs} onToggleFav={toggleFav} />}\n    </main>\n  );\n}\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
        css: "body {\n  font-family: \"Segoe UI\", sans-serif;\n  background: #111219;\n  color: #e9eaf3;\n}\n\nheader {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n#search-form {\n  display: flex;\n  gap: 6px;\n  margin-bottom: 12px;\n}\n\n#search-form input {\n  flex: 1;\n  padding: 8px;\n  font-size: 16px;\n}\n\n.results {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n  gap: 12px;\n}\n\n.show-card {\n  background: #1d1f2d;\n  border-radius: 10px;\n  overflow: hidden;\n  padding-bottom: 8px;\n}\n\n.show-card img, .show-card .placeholder {\n  width: 100%;\n  aspect-ratio: 210 / 295;\n  object-fit: cover;\n  display: block;\n  background: #2f3245;\n}\n\n.show-card h3 {\n  font-size: 15px;\n  margin: 8px 8px 2px;\n}\n\n.show-card p {\n  font-size: 13px;\n  margin: 0 8px;\n  color: #a0a5bc;\n}\n\n.fav {\n  margin: 6px 8px 0;\n  background: none;\n  border: 1px solid #9a82ff;\n  color: #c9bcff;\n  border-radius: 6px;\n  cursor: pointer;\n}\n",
      },
      check: async ({ $, $$, text, setValue, wait, code }) => {
        if (!/encodeURIComponent/.test(code.jsx)) return 'Encode the search text with `encodeURIComponent` before putting it in the URL.';
        setValue('#query', 'girls'); await wait(30);
        $('#search-form').requestSubmit();
        let sawLoading = false;
        for (let i = 0; i < 60 && $$('#root .show-card').length === 0; i++) {
          if (/loading/i.test(text('#root'))) sawLoading = true;
          await wait(100);
        }
        const cards = $$('#root .show-card');
        if (!cards.length) return 'No `.show-card`s appeared after searching for "girls". (This needs an internet connection.)';
        if (!sawLoading) return 'Show "Loading…" while the search is running.';
        if (!cards.some((c) => /girls/i.test((c.querySelector('h3') || {}).textContent || ''))) return 'Each card should show the show\'s name in an `<h3>`.';
        setValue('#query', 'zzqqxxnotarealshow'); await wait(30);
        $('#search-form').requestSubmit();
        for (let i = 0; i < 60 && !/no shows found/i.test(text('#root')); i++) await wait(100);
        return /no shows found/i.test(text('#root')) || 'Show "No shows found" when the API returns no results.';
      },
      success: "Your show finder works! 🍿 Try searching for your favorite show.",
    },
    {
      type: 'explain',
      title: 'Module 10 complete',
      body: [
        "You now know React well enough to build real apps:",
        "- `useEffect` for side effects, cleanup and data fetching",
        "- Controlled forms, validation and accessible errors",
        "- Lifting state up, data down and events up",
        "- Context, `useReducer`, custom hooks, `useRef`",
        "- Real projects with **Vite**, and multi-page apps with **React Router**",
        "Next is **Capstone 2**: a complete multi-page React app built on your own computer.",
      ],
    },
  ],
});
