/* Capstone 1 — Expense Tracker (Modules 1–8 combined) */
(() => {
  const L = (...lines) => lines.join('\n') + '\n';

  /* ---------- shared layout (the Part 1 solution, used as the base for Parts 2–4) ---------- */

  const HTML = L(
    '<main class="app">',
    '  <header>',
    '    <h1>💸 Expense Tracker</h1>',
    '    <p class="total">Total: <strong id="total">$0.00</strong></p>',
    '  </header>',
    '',
    '  <!-- novalidate: we show our own friendly error messages with JavaScript -->',
    '  <form id="expense-form" novalidate>',
    '    <div class="field">',
    '      <label for="description">Description</label>',
    '      <input id="description" type="text" placeholder="e.g. Groceries">',
    '    </div>',
    '    <div class="field">',
    '      <label for="amount">Amount ($)</label>',
    '      <input id="amount" type="number" min="0" step="0.01" placeholder="0.00">',
    '    </div>',
    '    <div class="field">',
    '      <label for="category">Category</label>',
    '      <select id="category">',
    '        <option value="food">🍔 Food</option>',
    '        <option value="transport">🚌 Transport</option>',
    '        <option value="fun">🎉 Fun</option>',
    '        <option value="bills">🧾 Bills</option>',
    '        <option value="other">📦 Other</option>',
    '      </select>',
    '    </div>',
    '    <button type="submit">Add expense</button>',
    '  </form>',
    '  <p id="error" role="alert"></p>',
    '',
    '  <section aria-labelledby="list-heading">',
    '    <div class="list-header">',
    '      <h2 id="list-heading">Expenses</h2>',
    '      <label>Show',
    '        <select id="filter">',
    '          <option value="all">All categories</option>',
    '          <option value="food">🍔 Food</option>',
    '          <option value="transport">🚌 Transport</option>',
    '          <option value="fun">🎉 Fun</option>',
    '          <option value="bills">🧾 Bills</option>',
    '          <option value="other">📦 Other</option>',
    '        </select>',
    '      </label>',
    '    </div>',
    '    <ul id="expense-list"></ul>',
    '    <p id="empty">No expenses yet. Add your first one above!</p>',
    '  </section>',
    '',
    '  <section aria-labelledby="summary-heading">',
    '    <h2 id="summary-heading">By category</h2>',
    '    <ul id="summary"></ul>',
    '  </section>',
    '</main>',
  );

  const CSS = L(
    '* {',
    '  box-sizing: border-box;',
    '}',
    '',
    'body {',
    '  margin: 0;',
    '  font-family: "Segoe UI", system-ui, sans-serif;',
    '  background: #f0f2f8;',
    '  color: #1a1c2b;',
    '}',
    '',
    '.app {',
    '  max-width: 560px;',
    '  margin: 0 auto;',
    '  padding: 16px;',
    '}',
    '',
    'header {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: center;',
    '  flex-wrap: wrap;',
    '  gap: 8px;',
    '}',
    '',
    'h1 {',
    '  font-size: 24px;',
    '  margin: 0;',
    '}',
    '',
    '.total {',
    '  margin: 0;',
    '  font-size: 18px;',
    '}',
    '',
    '#expense-form {',
    '  display: grid;',
    '  grid-template-columns: 1fr;',
    '  gap: 12px;',
    '  background: white;',
    '  padding: 16px;',
    '  border-radius: 14px;',
    '  margin: 16px 0 8px;',
    '}',
    '',
    '@media (min-width: 480px) {',
    '  #expense-form {',
    '    grid-template-columns: 2fr 1fr 1fr;',
    '    align-items: end;',
    '  }',
    '',
    '  #expense-form button {',
    '    grid-column: 1 / -1;',
    '  }',
    '}',
    '',
    '.field {',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 4px;',
    '}',
    '',
    'label {',
    '  font-size: 14px;',
    '  font-weight: 600;',
    '}',
    '',
    'input, select {',
    '  font: inherit;',
    '  padding: 8px 10px;',
    '  border: 1px solid #c5c9d6;',
    '  border-radius: 8px;',
    '  background: white;',
    '}',
    '',
    'button {',
    '  font: inherit;',
    '  font-weight: 600;',
    '  padding: 10px 14px;',
    '  border: none;',
    '  border-radius: 8px;',
    '  background: #6a4cf0;',
    '  color: white;',
    '  cursor: pointer;',
    '}',
    '',
    ':focus-visible {',
    '  outline: 3px solid #6a4cf0;',
    '  outline-offset: 2px;',
    '}',
    '',
    '#error {',
    '  color: #c53b3b;',
    '  min-height: 1.2em;',
    '  margin: 0 0 8px;',
    '}',
    '',
    'section {',
    '  background: white;',
    '  padding: 16px;',
    '  border-radius: 14px;',
    '  margin-bottom: 16px;',
    '}',
    '',
    '.list-header {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: center;',
    '  flex-wrap: wrap;',
    '  gap: 8px;',
    '}',
    '',
    'h2 {',
    '  font-size: 18px;',
    '  margin: 0;',
    '}',
    '',
    '#expense-list, #summary {',
    '  list-style: none;',
    '  padding: 0;',
    '  margin: 12px 0 0;',
    '}',
    '',
    '#expense-list li {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 10px;',
    '  padding: 10px 0;',
    '  border-bottom: 1px solid #eef0f8;',
    '}',
    '',
    '#expense-list .info {',
    '  flex: 1;',
    '}',
    '',
    '.delete {',
    '  background: transparent;',
    '  color: #c53b3b;',
    '  padding: 4px 8px;',
    '}',
    '',
    '#summary li {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  padding: 6px 0;',
    '}',
    '',
    '#empty {',
    '  color: #5d6279;',
    '}',
  );

  /* ---------- JavaScript, built up part by part ---------- */

  const JS_SETUP = L(
    'class Expense {',
    '  constructor(description, amount, category) {',
    '    this.id = Date.now() + Math.random();',
    '    this.description = description;',
    '    this.amount = amount;',
    '    this.category = category;',
    '    this.date = new Date().toISOString().slice(0, 10);',
    '  }',
    '}',
    '',
    'const CATEGORY_LABELS = {',
    '  food: "🍔 Food",',
    '  transport: "🚌 Transport",',
    '  fun: "🎉 Fun",',
    '  bills: "🧾 Bills",',
    '  other: "📦 Other",',
    '};',
    '',
    'const form = document.querySelector("#expense-form");',
    'const descriptionInput = document.querySelector("#description");',
    'const amountInput = document.querySelector("#amount");',
    'const categoryInput = document.querySelector("#category");',
    'const errorEl = document.querySelector("#error");',
    'const list = document.querySelector("#expense-list");',
    'const totalEl = document.querySelector("#total");',
    'const emptyEl = document.querySelector("#empty");',
    'const filterSelect = document.querySelector("#filter");',
    'const summaryList = document.querySelector("#summary");',
    '',
    'const formatMoney = (n) => "$" + n.toFixed(2);',
  );

  const JS_PART2 = L(
    JS_SETUP.trimEnd(),
    '',
    'let expenses = [];',
    '',
    'function render() {',
    '  list.innerHTML = "";',
    '',
    '  for (const expense of expenses) {',
    '    const li = document.createElement("li");',
    '    li.dataset.id = expense.id;',
    '',
    '    const info = document.createElement("span");',
    '    info.className = "info";',
    '    info.textContent = `${expense.description} · ${CATEGORY_LABELS[expense.category]}`;',
    '',
    '    const amount = document.createElement("strong");',
    '    amount.textContent = formatMoney(expense.amount);',
    '',
    '    li.append(info, amount);',
    '    list.append(li);',
    '  }',
    '',
    '  const total = expenses.reduce((sum, e) => sum + e.amount, 0);',
    '  totalEl.textContent = formatMoney(total);',
    '  emptyEl.hidden = expenses.length > 0;',
    '}',
    '',
    'form.addEventListener("submit", (event) => {',
    '  event.preventDefault();',
    '  const description = descriptionInput.value.trim();',
    '  const amount = Number(amountInput.value);',
    '',
    '  if (description === "") {',
    '    errorEl.textContent = "Please enter a description.";',
    '    return;',
    '  }',
    '  if (!(amount > 0)) {',
    '    errorEl.textContent = "Please enter an amount greater than 0.";',
    '    return;',
    '  }',
    '',
    '  errorEl.textContent = "";',
    '  expenses.push(new Expense(description, amount, categoryInput.value));',
    '  form.reset();',
    '  descriptionInput.focus();',
    '  render();',
    '});',
    '',
    'render();',
  );

  const JS_PART3_CORE = L(
    'function render() {',
    '  // 1. The list, filtered by the selected category',
    '  const filter = filterSelect.value;',
    '  const visible = filter === "all" ? expenses : expenses.filter(e => e.category === filter);',
    '',
    '  list.innerHTML = "";',
    '  for (const expense of visible) {',
    '    const li = document.createElement("li");',
    '    li.dataset.id = expense.id;',
    '',
    '    const info = document.createElement("span");',
    '    info.className = "info";',
    '    info.textContent = `${expense.description} · ${CATEGORY_LABELS[expense.category]}`;',
    '',
    '    const amount = document.createElement("strong");',
    '    amount.textContent = formatMoney(expense.amount);',
    '',
    '    const del = document.createElement("button");',
    '    del.type = "button";',
    '    del.className = "delete";',
    '    del.textContent = "✕";',
    '    del.setAttribute("aria-label", `Delete ${expense.description}`);',
    '',
    '    li.append(info, amount, del);',
    '    list.append(li);',
    '  }',
    '',
    '  // 2. Total of the visible expenses',
    '  const total = visible.reduce((sum, e) => sum + e.amount, 0);',
    '  totalEl.textContent = formatMoney(total);',
    '  emptyEl.hidden = visible.length > 0;',
    '',
    '  // 3. Summary by category (always for ALL expenses)',
    '  const byCategory = expenses.reduce((totals, e) => {',
    '    totals[e.category] = (totals[e.category] || 0) + e.amount;',
    '    return totals;',
    '  }, {});',
    '',
    '  summaryList.innerHTML = "";',
    '  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);',
    '  for (const [category, sum] of sorted) {',
    '    const li = document.createElement("li");',
    '    li.innerHTML = `<span></span><strong></strong>`;',
    '    li.querySelector("span").textContent = CATEGORY_LABELS[category];',
    '    li.querySelector("strong").textContent = formatMoney(sum);',
    '    summaryList.append(li);',
    '  }',
    '}',
  );

  // afterChange: an extra line to run after the data changes (Part 4 passes "  save();").
  const JS_SUBMIT = (afterChange) => L(...[
    'form.addEventListener("submit", (event) => {',
    '  event.preventDefault();',
    '  const description = descriptionInput.value.trim();',
    '  const amount = Number(amountInput.value);',
    '',
    '  if (description === "") {',
    '    errorEl.textContent = "Please enter a description.";',
    '    return;',
    '  }',
    '  if (!(amount > 0)) {',
    '    errorEl.textContent = "Please enter an amount greater than 0.";',
    '    return;',
    '  }',
    '',
    '  errorEl.textContent = "";',
    '  expenses.push(new Expense(description, amount, categoryInput.value));',
    afterChange,
    '  form.reset();',
    '  descriptionInput.focus();',
    '  render();',
    '});',
    '',
    '// Delete with event delegation',
    'list.addEventListener("click", (event) => {',
    '  if (!event.target.matches(".delete")) return;',
    '  const id = Number(event.target.closest("li").dataset.id);',
    '  expenses = expenses.filter(e => e.id !== id);',
    afterChange,
    '  render();',
    '});',
    '',
    'filterSelect.addEventListener("change", render);',
    '',
    'render();',
  ].filter((line) => line !== null));

  const JS_PART3 = L(JS_SETUP.trimEnd(), '', 'let expenses = [];', '', JS_PART3_CORE.trimEnd(), '', JS_SUBMIT(null).trimEnd());

  const JS_PART4 = L(
    JS_SETUP.trimEnd(),
    '',
    'const STORAGE_KEY = "expenses";',
    '',
    'function save() {',
    '  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));',
    '}',
    '',
    'function load() {',
    '  try {',
    '    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];',
    '    // JSON gives back plain objects; turn them back into Expense instances',
    '    return data.map(e => Object.assign(new Expense(e.description, e.amount, e.category), e));',
    '  } catch (error) {',
    '    return [];   // corrupted data? start fresh instead of crashing',
    '  }',
    '}',
    '',
    'let expenses = load();',
    '',
    JS_PART3_CORE.trimEnd(),
    '',
    JS_SUBMIT('  save();').trimEnd(),
  );

  // Note: checks are serialized into the preview iframe, so each one defines its own helpers.
  Course.addContent('c1', {
    'expense-tracker': [
      {
        type: 'explain',
        title: 'Capstone 1: the plan',
        body: [
          "Time to build a complete app on your own: an **expense tracker** to see where your money goes. It brings together everything from Modules 1–8.",
          "### Features",
          "- Add expenses with a description, amount and category",
          "- See a list of expenses and the total",
          "- Delete expenses",
          "- Filter the list by category",
          "- See a summary of spending per category",
          "- Your data survives a page reload (saved in `localStorage`)",
          "### Four parts",
          "1. **Layout**: semantic, accessible HTML and a responsive CSS layout",
          "2. **Add & render**: an `Expense` class, form handling, validation and rendering",
          "3. **Delete, filter & summarise**: event delegation and array methods",
          "4. **Save & load**: persist your data with `localStorage` and JSON",
          "> Parts 2–4 each start from a provided version of the previous part, so the IDs match and you can jump into any part. Try each one yourself before peeking at the solution!",
        ],
      },
      {
        type: 'project',
        title: 'Part 1: Layout',
        body: [
          "Build the HTML and CSS for the app. Aim for something like this:",
          { code: `┌───────────────────────────────────────────┐\n│ 💸 Expense Tracker            Total: $0.00 │  ← header (flex)\n├───────────────────────────────────────────┤\n│ Description     │ Amount │ Category       │  ← form (grid)\n│ [____________]  │ [____] │ [Food ▾]       │\n│ [            Add expense               ]  │\n├───────────────────────────────────────────┤\n│ Expenses                 Show [All ▾]     │\n│  Groceries · 🍔 Food            $42.10    │\n├───────────────────────────────────────────┤\n│ By category                               │\n│  🍔 Food                        $42.10    │\n└───────────────────────────────────────────┘`, lang: 'text' },
          "Use these IDs, because the JavaScript in the next parts relies on them.",
        ],
        tasks: [
          "Wrap everything in `<main>`, with a `<header>` holding an `<h1>` and the total in `#total`",
          "A `<form id=\"expense-form\">` with labelled inputs `#description` (text) and `#amount` (number)",
          "A labelled `<select id=\"category\">` with at least 3 categories, and a submit button",
          "An empty `<p id=\"error\">` for error messages",
          "A section with a heading, a `<select id=\"filter\">` (first option `value=\"all\"`) and an empty `<ul id=\"expense-list\">`",
          "A section with a heading and an empty `<ul id=\"summary\">`",
          "CSS: header with flexbox `space-between`, form laid out with grid (stacked on narrow screens), visible focus styles",
        ],
        hint: [
          ["Label each input with `<label for=\"description\">Description</label>`. The `for` must match the input's `id`."],
          ["A responsive form: `display: grid; grid-template-columns: 1fr;` then, inside `@media (min-width: 480px)`, use `2fr 1fr 1fr`."],
        ],
        starter: {
          html: L(
            '<main class="app">',
            '  <!-- Header: h1 on the left, total (#total) on the right -->',
            '',
            '',
            '  <!-- Form #expense-form: #description, #amount, #category + submit button -->',
            '',
            '',
            '  <!-- Error message: #error -->',
            '',
            '',
            '  <!-- Section: heading, #filter select, #expense-list -->',
            '',
            '',
            '  <!-- Section: heading, #summary -->',
            '',
            '</main>',
          ),
          css: L('* {', '  box-sizing: border-box;', '}', '', 'body {', '  margin: 0;', '  font-family: "Segoe UI", system-ui, sans-serif;', '  background: #f0f2f8;', '}'),
        },
        solution: { html: HTML, css: CSS },
        check: ({ $, css }) => {
          if (!$('main')) return 'Wrap the app in `<main>`.';
          if (!$('header h1')) return 'Add a `<header>` with an `<h1>`.';
          if (!$('#total')) return 'Add an element with `id="total"` for the total.';
          const form = $('form#expense-form');
          if (!form) return 'Add a `<form id="expense-form">`.';
          for (const id of ['description', 'amount', 'category']) {
            const el = form.querySelector('#' + id);
            if (!el) return `The form needs an element with \`id="${id}"\`.`;
            if (!el.labels || !el.labels.length) return `Link a \`<label>\` to \`#${id}\`.`;
          }
          if ($('#amount').type !== 'number') return '`#amount` should be `type="number"`.';
          if ($('#category').tagName !== 'SELECT' || $('#category').options.length < 3) return '`#category` should be a `<select>` with at least 3 options.';
          if (!form.querySelector('button')) return 'Add a submit `<button>` to the form.';
          if (!$('#error')) return 'Add an empty `<p id="error">`.';
          const filter = $('select#filter');
          if (!filter || filter.options[0].value !== 'all') return 'Add a `<select id="filter">` whose first option has `value="all"`.';
          if (!$('ul#expense-list')) return 'Add an empty `<ul id="expense-list">`.';
          if (!$('ul#summary')) return 'Add an empty `<ul id="summary">`.';
          if (css('header', 'display') !== 'flex') return 'Lay out the header with flexbox.';
          if (!['grid', 'flex'].includes(css('#expense-form', 'display'))) return 'Lay out the form with grid (or flexbox).';
          return true;
        },
        success: "Layout done! Part 2 starts from a provided version of this layout so everyone's IDs match. You can paste your own CSS into it if you prefer your design.",
      },
      {
        type: 'project',
        title: 'Part 2: Add & render expenses',
        body: [
          "The layout is ready (it's in the HTML and CSS tabs). Now make it work. The setup code at the top of the JavaScript tab selects all the elements for you.",
        ],
        tasks: [
          "Create an `Expense` class whose constructor stores `description`, `amount`, `category`, a unique `id` and the `date` (already done in the starter, so read it!)",
          "Keep all expenses in a `let expenses = []` array",
          "Write `render()`: clear `#expense-list` and add an `li` for each expense showing its description, category and amount (formatted with `formatMoney`)",
          "`render()` also updates `#total` with the sum of all amounts, and hides `#empty` when there are expenses",
          "On form submit: `preventDefault`, read and validate the inputs, show a message in `#error` for an empty description or an amount that isn't above 0",
          "If valid: clear the error, push a `new Expense(...)`, reset the form and call `render()`",
        ],
        hint: [
          ["Input values are strings, so use `Number(amountInput.value)`. An empty input gives `0`, which your `> 0` check will catch."],
          ["The total is a one-liner: `expenses.reduce((sum, e) => sum + e.amount, 0)`."],
          ["`emptyEl.hidden = expenses.length > 0;` shows or hides the \"No expenses yet\" message."],
        ],
        starter: {
          html: HTML,
          css: CSS,
          js: L(JS_SETUP.trimEnd(), '', 'let expenses = [];', '', 'function render() {', '', '}', '', '// Handle the form submit here', '', '', 'render();'),
        },
        solution: { html: HTML, css: CSS, js: JS_PART2 },
        check: async ({ $, $$, text, wait }) => {
          const form = $('#expense-form');
          form.addEventListener('submit', (e) => e.preventDefault());
          const add = async (d, a, c) => { $('#description').value = d; $('#amount').value = a; $('#category').value = c; form.requestSubmit(); await wait(5); };
          const count = () => $$('#expense-list li').length;
          const before = count();
          await add('Lunch', '12.5', 'food');
          if (count() !== before + 1) return 'Submitting the form should add an `li` to `#expense-list`.';
          const li = $$('#expense-list li').find((x) => x.textContent.includes('Lunch'));
          if (!li) return 'Each list item should show the expense description.';
          if (!li.textContent.includes('$12.50')) return 'Show the amount formatted like `$12.50` (use `formatMoney`).';
          if ($('#description').value !== '') return 'Reset the form after adding an expense.';
          await add('Bus', '5.25', 'transport');
          if (before === 0 && text('#total') !== '$17.75') return `After adding $12.50 and $5.25, \`#total\` should be "$17.75" but it shows "${text('#total')}".`;
          if (before === 0 && !$('#empty').hidden && getComputedStyle($('#empty')).display !== 'none') return 'Hide `#empty` when there are expenses.';
          await add('Broken', '0', 'food');
          if (count() !== before + 2) return 'An amount of 0 should not be added.';
          if (!text('#error')) return 'Show a message in `#error` when the amount isn\'t greater than 0.';
          await add('   ', '10', 'food');
          if (count() !== before + 2) return 'An empty description should not be added.';
          await add('Coffee', '3', 'food');
          return text('#error') === '' || 'Clear `#error` after a valid expense is added.';
        },
        success: "Expenses are flowing! 💸 Add a few in the preview to try it.",
      },
      {
        type: 'project',
        title: 'Part 3: Delete, filter & summarise',
        body: ["Starting from the Part 2 solution, add the features that make the tracker genuinely useful."],
        tasks: [
          "Add a delete `button.delete` (✕) to each `li`, with an `aria-label` like `Delete Lunch`",
          "Use **event delegation** on `#expense-list` to remove the clicked expense from the array, then re-render",
          "Filter the list by the `#filter` select (`\"all\"` shows everything), and re-render when the filter changes",
          "Make `#total` show the total of the *visible* (filtered) expenses",
          "Fill `#summary` with one `li` per category that has spending, showing its label and total, sorted from highest to lowest",
        ],
        hint: [
          ["Store the id on each `li` with `li.dataset.id = expense.id`, and read it back with `Number(...)` since dataset values are strings."],
          ["Group by category with `reduce` into an object like `{ food: 42.1, fun: 15 }`, then loop over `Object.entries(...)`."],
          ["`filterSelect.addEventListener(\"change\", render);`"],
        ],
        starter: { html: HTML, css: CSS, js: JS_PART2 },
        solution: { html: HTML, css: CSS, js: JS_PART3 },
        check: async ({ $, $$, text, wait }) => {
          const form = $('#expense-form');
          form.addEventListener('submit', (e) => e.preventDefault());
          const add = async (d, a, c) => { $('#description').value = d; $('#amount').value = a; $('#category').value = c; form.requestSubmit(); await wait(5); };
          const items = () => $$('#expense-list li');
          const setFilter = async (v) => { $('#filter').value = v; $('#filter').dispatchEvent(new Event('change', { bubbles: true })); await wait(5); };
          await add('Pizza night', '10', 'food');
          await add('Movie', '5', 'fun');
          const pizza = items().find((li) => li.textContent.includes('Pizza night'));
          if (!pizza) return 'Adding an expense should still work.';
          const del = pizza.querySelector('button.delete');
          if (!del) return 'Each `li` needs a `button` with the class `delete`.';
          if (!(del.getAttribute('aria-label') || '').includes('Pizza night')) return 'Give each delete button an `aria-label` like "Delete Pizza night".';
          await setFilter('fun');
          if (items().some((li) => li.textContent.includes('Pizza night'))) return 'With the filter set to Fun, food expenses should be hidden.';
          if (!items().some((li) => li.textContent.includes('Movie'))) return 'With the filter set to Fun, fun expenses should be shown.';
          if (items().every((li) => li.textContent.includes('Movie')) && items().length === 1 && text('#total') !== '$5.00') return 'The total should only count the visible (filtered) expenses.';
          await setFilter('all');
          const summary = $$('#summary li').map((li) => li.textContent);
          if (!summary.length) return 'Fill `#summary` with one `li` per category.';
          if (!summary.some((t) => /food/i.test(t) && t.includes('$'))) return 'The summary should include the Food category and its total.';
          items().find((li) => li.textContent.includes('Pizza night')).querySelector('.delete').click();
          await wait(5);
          if (items().some((li) => li.textContent.includes('Pizza night'))) return 'Clicking ✕ should remove that expense.';
          return items().some((li) => li.textContent.includes('Movie')) || 'Deleting one expense should leave the others.';
        },
      },
      {
        type: 'project',
        title: 'Part 4: Save & load',
        body: [
          "Right now everything disappears when the page reloads. Save the expenses to `localStorage` so they stick around.",
          "> In this course's editor, your code gets its own `localStorage` that the app keeps for you, so pressing ▶ Run is like reloading the page.",
        ],
        tasks: [
          "Write `save()`: store the `expenses` array in `localStorage` as JSON under the key `\"expenses\"`",
          "Call `save()` after every change (add and delete)",
          "Write `load()`: read and `JSON.parse` the saved data, falling back to `[]` if there's nothing saved",
          "Start with `let expenses = load();` instead of an empty array",
          "Handle corrupted data: wrap the parsing in `try/catch` and start fresh if it fails",
          "Bonus: turn the loaded plain objects back into `Expense` instances",
          "Test it: add some expenses, press ▶ Run, and check they're still there",
        ],
        hint: [
          ["`localStorage.setItem(\"expenses\", JSON.stringify(expenses));`"],
          ["`JSON.parse(localStorage.getItem(\"expenses\")) || []`. When nothing is saved, `getItem` returns `null`, `JSON.parse(null)` is `null`, and `|| []` kicks in."],
          ["Bonus: `data.map(e => Object.assign(new Expense(e.description, e.amount, e.category), e))`"],
        ],
        starter: { html: HTML, css: CSS, js: JS_PART3 },
        solution: { html: HTML, css: CSS, js: JS_PART4 },
        check: async ({ $, $$, wait, code, win }) => {
          if (!/localStorage\.getItem\(/.test(code.js)) return 'Load the saved data with `localStorage.getItem()`.';
          if (!/JSON\.parse\(/.test(code.js)) return 'Use `JSON.parse()` to turn the saved text back into an array.';
          const form = $('#expense-form');
          form.addEventListener('submit', (e) => e.preventDefault());
          const stored = () => { try { return JSON.parse(win.localStorage.getItem('expenses')) || []; } catch (e) { return null; } };
          const tag = 'Saved check ' + Math.floor(Math.random() * 1e6);
          $('#description').value = tag; $('#amount').value = '7'; $('#category').value = 'other';
          form.requestSubmit();
          await wait(5);
          const after = stored();
          if (!Array.isArray(after)) return 'Save the expenses as a JSON array under the key "expenses".';
          if (!after.some((e) => e.description === tag && e.amount === 7)) return 'After adding an expense, it should be saved to `localStorage` under "expenses". Call `save()` after adding.';
          const li = $$('#expense-list li').find((x) => x.textContent.includes(tag));
          li.querySelector('.delete').click();
          await wait(5);
          if (stored().some((e) => e.description === tag)) return 'After deleting an expense, save again so it\'s removed from storage too.';
          return true;
        },
        success: "Your expense tracker remembers everything. That's a complete, real app! 🏆",
      },
      {
        type: 'explain',
        title: 'Capstone 1 complete! 🎉',
        body: [
          "You built a full application from scratch with semantic HTML, responsive CSS, classes, array methods, DOM rendering, event delegation, validation and persistence. That's a real portfolio project.",
          "### Put it online (free)",
          "1. Create a folder with `index.html`, `style.css` and `script.js`. Paste your code into each and link them: `<link rel=\"stylesheet\" href=\"style.css\">` in the head and `<script src=\"script.js\" defer></script>`.",
          "2. Go to [Netlify Drop](https://app.netlify.com/drop) and drag the folder onto the page. You get a live URL in seconds.",
          "3. Or create a GitHub repository and turn on **GitHub Pages** in its settings.",
          "### Ideas to extend it",
          "- Edit an existing expense",
          "- Add a date picker and sort by date",
          "- Show the summary as a simple bar chart with `div`s and percentage widths",
          "- Add a monthly budget with a warning when you go over",
          "- Export to CSV",
          "Next is **Module 9: React**, where you'll rebuild UIs like this with components and see how much easier the *state → render* pattern becomes.",
        ],
      },
    ],
  });
})();
