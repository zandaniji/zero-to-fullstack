/* Module 5 — DOM & Events */
Course.addContent('m05', {

  /* ---------------------------------------------------------------- */
  'dom-select-change': [
    {
      type: 'explain',
      title: 'What is the DOM?',
      body: [
        "When the browser loads your HTML, it builds a tree of objects in memory called the **DOM** (Document Object Model). Every element becomes an object that JavaScript can read and change.",
        { code: `document\n └─ html\n     ├─ head\n     │   └─ title\n     └─ body\n         ├─ h1        "My Page"\n         └─ ul\n             ├─ li    "One"\n             └─ li    "Two"`, lang: 'text' },
        "Change the DOM, and the page on screen updates instantly. This is how every interactive website works: JavaScript changing the DOM in response to what the user does.",
        "The whole tree starts at the `document` object.",
      ],
    },
    {
      type: 'explain',
      title: 'Selecting elements',
      body: [
        "Before you can change an element, you have to find it. `querySelector` takes any **CSS selector** and returns the first match:",
        { code: `const title = document.querySelector("h1");\nconst button = document.querySelector(".buy-button");\nconst menu = document.querySelector("#main-menu");\nconst firstLink = document.querySelector("nav a");`, lang: 'js' },
        "`querySelectorAll` returns **all** matches, as a list you can loop over:",
        { code: `const items = document.querySelectorAll("li");\nconsole.log(items.length);\n\nitems.forEach(item => console.log(item.textContent));`, lang: 'js' },
        "> If nothing matches, `querySelector` returns `null`. Trying to use `null` gives the famous error *Cannot read properties of null*. It usually means a typo in your selector!",
      ],
    },
    {
      type: 'try',
      title: 'Change the heading',
      body: ["Lessons now use all three tabs: HTML, CSS and **JavaScript**. Your JS runs after the HTML loads."],
      goal: "In the JavaScript tab, select the `h1` and change its `textContent` to **DOM is fun!**",
      hint: "`document.querySelector(\"h1\").textContent = \"DOM is fun!\";`",
      starter: {
        html: "<h1>Hello</h1>\n<p>JavaScript can change me.</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
        js: "// Select the h1 and change its text\n",
      },
      solution: {
        html: "<h1>Hello</h1>\n<p>JavaScript can change me.</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
        js: "// Select the h1 and change its text\nconst heading = document.querySelector(\"h1\");\nheading.textContent = \"DOM is fun!\";\n",
      },
      check: ({ text, code }) => {
        if (code.html.includes('DOM is fun')) return 'Change the text with JavaScript, not by editing the HTML.';
        return text('h1') === 'DOM is fun!' || 'The `h1` should say "DOM is fun!"';
      },
    },
    {
      type: 'explain',
      title: 'Changing content and style',
      body: [
        "Once you have an element, you can change almost anything about it:",
        { code: `const box = document.querySelector(".box");\n\nbox.textContent = "New text";          // plain text (safe)\nbox.innerHTML = "<strong>Bold</strong> text"; // parses HTML\n\nbox.style.color = "white";             // inline styles: camelCase names\nbox.style.backgroundColor = "purple";\n\nbox.classList.add("active");           // add a CSS class\nbox.classList.remove("hidden");        // remove one\nbox.classList.toggle("open");          // add if missing, remove if present\nbox.classList.contains("active");      // true / false`, lang: 'js' },
        "**Prefer `classList` over `.style`.** Keep the looks in your CSS, and let JavaScript just switch classes on and off.",
        "> ⚠️ Never put text typed by users into `innerHTML`. Someone could inject a malicious `<script>`. Use `textContent` for anything user-generated.",
      ],
    },
    {
      type: 'try',
      title: 'Highlight an item',
      body: ["The CSS already has a `.highlight` class. Let JavaScript apply it."],
      goal: "Use `querySelectorAll` to get all the `li` elements, then add the class `highlight` to the **second** one.",
      hint: "`querySelectorAll` returns a list. The second item is at index `[1]`.",
      starter: {
        html: "<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n  <li>Cherries</li>\n</ul>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.highlight {\n  background-color: gold;\n  font-weight: bold;\n}\n",
        js: "",
      },
      solution: {
        html: "<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n  <li>Cherries</li>\n</ul>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.highlight {\n  background-color: gold;\n  font-weight: bold;\n}\n",
        js: "const items = document.querySelectorAll(\"li\");\nitems[1].classList.add(\"highlight\");\n",
      },
      check: ({ $$, code }) => {
        if (/class\s*=\s*["']highlight/.test(code.html)) return 'Add the class with JavaScript, not in the HTML.';
        const li = $$('li');
        if (!li[1].classList.contains('highlight')) return 'The second `li` should have the `highlight` class.';
        return (!li[0].classList.contains('highlight') && !li[2].classList.contains('highlight')) || 'Only the second item should be highlighted.';
      },
    },
    {
      type: 'explain',
      title: 'Attributes',
      body: [
        "Elements' attributes are available as properties too:",
        { code: `const img = document.querySelector("img");\nimg.src = "cat.jpg";\nimg.alt = "A sleepy cat";\n\nconst link = document.querySelector("a");\nlink.href = "https://example.com";\n\nconst input = document.querySelector("input");\ninput.value = "Hello";       // the text in an input\ninput.disabled = true;\n\n// Generic versions work for any attribute:\nlink.setAttribute("target", "_blank");\nlink.getAttribute("href");`, lang: 'js' },
        "Custom `data-` attributes are great for storing extra info on elements, and you read them with `dataset`:",
        { code: `<button data-product-id="42">Buy</button>`, lang: 'html' },
        { code: `button.dataset.productId;  // "42"`, lang: 'js' },
      ],
    },
    {
      type: 'try',
      title: 'Fix the link',
      body: ["This link points nowhere."],
      goal: "With JavaScript, set the link's `href` to `https://developer.mozilla.org` and change its text to **Read the docs**.",
      hint: "Select the `a`, then set both `.href` and `.textContent`.",
      starter: {
        html: "<p>Stuck? <a href=\"#\">Click here</a></p>\n",
        css: "",
        js: "",
      },
      solution: {
        html: "<p>Stuck? <a href=\"#\">Click here</a></p>\n",
        css: "",
        js: "const link = document.querySelector(\"a\");\nlink.href = \"https://developer.mozilla.org\";\nlink.textContent = \"Read the docs\";\n",
      },
      check: ({ $ }) => {
        const a = $('a');
        if (!a.getAttribute('href').includes('developer.mozilla.org')) return 'Set the link\'s `href` to https://developer.mozilla.org';
        return a.textContent.trim() === 'Read the docs' || 'Change the link text to "Read the docs".';
      },
    },
    {
      type: 'explain',
      title: 'Creating and removing elements',
      body: [
        "JavaScript can build new elements from scratch, which is how lists, feeds and chat messages appear on the page:",
        { code: `const list = document.querySelector("ul");\n\nconst item = document.createElement("li");  // 1. create\nitem.textContent = "Buy milk";               // 2. fill it in\nitem.classList.add("task");\nlist.append(item);                          // 3. add it to the page\n\nitem.remove();                              // remove it again`, lang: 'js' },
        "Combine this with an array and a loop, and you can turn data into HTML:",
        { code: `const names = ["Ana", "Ben"];\nfor (const name of names) {\n  const li = document.createElement("li");\n  li.textContent = name;\n  list.append(li);\n}`, lang: 'js' },
        "> This **data → HTML** idea is exactly what React automates later in the course.",
      ],
    },
    {
      type: 'try',
      title: 'Render a list from data',
      body: ["The `ul` is empty. Fill it from the `fruits` array."],
      goal: "For each item in `fruits`, create an `li` with the fruit's name and append it to `#fruit-list`.",
      hint: "Loop with `for...of`, and inside it use `createElement`, `textContent` and `append`.",
      starter: {
        html: "<h2>Fruit</h2>\n<ul id=\"fruit-list\"></ul>\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
        js: "const fruits = [\"🍎 Apple\", \"🍌 Banana\", \"🍒 Cherry\"];\nconst list = document.querySelector(\"#fruit-list\");\n\n",
      },
      solution: {
        html: "<h2>Fruit</h2>\n<ul id=\"fruit-list\"></ul>\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
        js: "const fruits = [\"🍎 Apple\", \"🍌 Banana\", \"🍒 Cherry\"];\nconst list = document.querySelector(\"#fruit-list\");\n\nfor (const fruit of fruits) {\n  const li = document.createElement(\"li\");\n  li.textContent = fruit;\n  list.append(li);\n}\n",
      },
      check: ({ $$, get, code }) => {
        if (/<li/.test(code.html)) return 'Create the `li` elements with JavaScript, not in the HTML.';
        const fruits = get('fruits') || [];
        const items = $$('#fruit-list li').map((li) => li.textContent.trim());
        if (items.length !== fruits.length) return `There should be ${fruits.length} items in the list. Found ${items.length}.`;
        return items.every((t, i) => t === fruits[i]) || 'Each `li` should contain one fruit, in order.';
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'events': [
    {
      type: 'explain',
      title: 'Listening for events',
      body: [
        "An **event** is something that happens on the page: a click, a key press, a form being submitted. You react to events with `addEventListener`:",
        { code: `const button = document.querySelector("button");\n\nbutton.addEventListener("click", () => {\n  console.log("Button was clicked!");\n});`, lang: 'js' },
        "The second argument is a **callback** (remember those?). The browser calls it every time the event happens.",
        "> Don't write `addEventListener(\"click\", doSomething())` with parentheses. That calls the function immediately. Pass the function itself: `doSomething`.",
      ],
    },
    {
      type: 'try',
      title: 'Your first click',
      body: ["Make the button actually do something."],
      goal: "When the button is clicked, change the paragraph's text to **Clicked!**",
      hint: "Inside the callback: `message.textContent = \"Clicked!\";`",
      starter: {
        html: "<button>Click me</button>\n<p id=\"message\">Waiting…</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nbutton {\n  padding: 10px 18px;\n  font-size: 16px;\n}\n",
        js: "const button = document.querySelector(\"button\");\nconst message = document.querySelector(\"#message\");\n\n",
      },
      solution: {
        html: "<button>Click me</button>\n<p id=\"message\">Waiting…</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nbutton {\n  padding: 10px 18px;\n  font-size: 16px;\n}\n",
        js: "const button = document.querySelector(\"button\");\nconst message = document.querySelector(\"#message\");\n\nbutton.addEventListener(\"click\", () => {\n  message.textContent = \"Clicked!\";\n});\n",
      },
      check: ({ $, text }) => {
        if (text('#message') === 'Clicked!') return 'The text changed before anyone clicked. Change it *inside* the click listener.';
        $('button').click();
        return text('#message') === 'Clicked!' || 'After a click, the paragraph should say "Clicked!"';
      },
      success: "Click the button in the preview to see it work.",
    },
    {
      type: 'explain',
      title: 'Keeping state',
      body: [
        "Interactive apps remember things, like how many times something was clicked. Store that **state** in a variable, update it in the event listener, then update the page:",
        { code: `let likes = 0;\nconst button = document.querySelector("#like");\nconst count = document.querySelector("#count");\n\nbutton.addEventListener("click", () => {\n  likes++;                       // 1. update the state\n  count.textContent = likes;     // 2. update the page to match\n});`, lang: 'js' },
        "This *update state → update page* pattern is the heart of every front-end app.",
      ],
    },
    {
      type: 'try',
      title: 'Counter app',
      body: ["The classic first interactive app."],
      goal: [
        "- Clicking **+** adds 1 to the count",
        "- Clicking **−** subtracts 1",
        "- `#count` always shows the current number",
      ],
      hint: "Keep a `let count = 0;` variable, add a listener to each button, and update `countEl.textContent` in both.",
      starter: {
        html: "<div class=\"counter\">\n  <button id=\"minus\">−</button>\n  <span id=\"count\">0</span>\n  <button id=\"plus\">+</button>\n</div>\n",
        css: ".counter {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  font-family: sans-serif;\n  font-size: 32px;\n}\n\nbutton {\n  width: 48px;\n  height: 48px;\n  font-size: 24px;\n  border-radius: 50%;\n  border: 2px solid #6a4cf0;\n  background: white;\n  cursor: pointer;\n}\n",
        js: "let count = 0;\nconst countEl = document.querySelector(\"#count\");\n\n",
      },
      solution: {
        html: "<div class=\"counter\">\n  <button id=\"minus\">−</button>\n  <span id=\"count\">0</span>\n  <button id=\"plus\">+</button>\n</div>\n",
        css: ".counter {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  font-family: sans-serif;\n  font-size: 32px;\n}\n\nbutton {\n  width: 48px;\n  height: 48px;\n  font-size: 24px;\n  border-radius: 50%;\n  border: 2px solid #6a4cf0;\n  background: white;\n  cursor: pointer;\n}\n",
        js: "let count = 0;\nconst countEl = document.querySelector(\"#count\");\n\ndocument.querySelector(\"#plus\").addEventListener(\"click\", () => {\n  count++;\n  countEl.textContent = count;\n});\n\ndocument.querySelector(\"#minus\").addEventListener(\"click\", () => {\n  count--;\n  countEl.textContent = count;\n});\n",
      },
      check: ({ $, text }) => {
        const plus = $('#plus'), minus = $('#minus');
        plus.click(); plus.click(); plus.click();
        if (text('#count') !== '3') return `After clicking + three times, the count should be 3, but it shows "${text('#count')}".`;
        minus.click();
        return text('#count') === '2' || 'After clicking − once more, the count should be 2.';
      },
    },
    {
      type: 'explain',
      title: 'The event object',
      body: [
        "Your callback receives an **event object** with details about what happened:",
        { code: `document.addEventListener("keydown", (event) => {\n  console.log(event.key);      // "a", "Enter", "ArrowUp"...\n});\n\nbutton.addEventListener("click", (event) => {\n  console.log(event.target);   // the element that was clicked\n});\n\ninput.addEventListener("input", (event) => {\n  console.log(event.target.value);  // what's typed so far\n});`, lang: 'js' },
        "Common events to know:",
        "- `click`: mouse click or tap (also Enter/Space on a focused button)",
        "- `input`: the value of an input or textarea changed",
        "- `change`: a select, checkbox or input was changed and committed",
        "- `submit`: a form was submitted",
        "- `keydown`: a key was pressed",
        "- `mouseenter` / `mouseleave`: the pointer moved over or off an element",
      ],
    },
    {
      type: 'try',
      title: 'Live character counter',
      body: ["Like the counter under a tweet box."],
      goal: "Every time the user types in the `textarea`, update `#count` to show how many characters it contains, as `<number> / 140`.",
      hint: [
        ["Listen for the `input` event on the textarea."],
        ["The text is in `textarea.value`, and its length is `textarea.value.length`."],
      ],
      starter: {
        html: "<textarea rows=\"4\" cols=\"36\" placeholder=\"What's happening?\"></textarea>\n<p id=\"count\">0 / 140</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n#count {\n  color: #5d6279;\n}\n",
        js: "const textarea = document.querySelector(\"textarea\");\nconst count = document.querySelector(\"#count\");\n\n",
      },
      solution: {
        html: "<textarea rows=\"4\" cols=\"36\" placeholder=\"What's happening?\"></textarea>\n<p id=\"count\">0 / 140</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n#count {\n  color: #5d6279;\n}\n",
        js: "const textarea = document.querySelector(\"textarea\");\nconst count = document.querySelector(\"#count\");\n\ntextarea.addEventListener(\"input\", () => {\n  count.textContent = `${textarea.value.length} / 140`;\n});\n",
      },
      check: ({ $, text }) => {
        const ta = $('textarea');
        ta.value = 'hello';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        if (text('#count') !== '5 / 140') return `After typing "hello", the counter should say "5 / 140" but it says "${text('#count')}".`;
        ta.value = 'hello world!';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        return text('#count') === '12 / 140' || 'The counter should update every time the text changes.';
      },
      success: "Bonus idea: turn the counter red with a class when it goes over 140.",
    },
    {
      type: 'explain',
      title: 'Show and hide with classList.toggle',
      body: [
        "A super common pattern is toggling a class to show/hide something: menus, FAQs, modals, dark mode.",
        { code: `.hidden {\n  display: none;\n}`, lang: 'css' },
        { code: `const button = document.querySelector("#menu-button");\nconst menu = document.querySelector("#menu");\n\nbutton.addEventListener("click", () => {\n  menu.classList.toggle("hidden");\n});`, lang: 'js' },
        "`toggle` adds the class if it's missing and removes it if it's there, so one line handles both directions.",
      ],
    },
    {
      type: 'try',
      title: 'FAQ toggle',
      body: ["The answer starts hidden."],
      goal: "When the question button is clicked, toggle the `hidden` class on the `.answer`. Click once to show it, click again to hide it.",
      hint: "`answer.classList.toggle(\"hidden\");`",
      starter: {
        html: "<button class=\"question\">❓ Is this course free?</button>\n<p class=\"answer hidden\">Yes! Learn at your own pace, with nothing locked.</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.question {\n  font-size: 16px;\n  padding: 10px 14px;\n  cursor: pointer;\n}\n\n.hidden {\n  display: none;\n}\n",
        js: "const question = document.querySelector(\".question\");\nconst answer = document.querySelector(\".answer\");\n\n",
      },
      solution: {
        html: "<button class=\"question\">❓ Is this course free?</button>\n<p class=\"answer hidden\">Yes! Learn at your own pace, with nothing locked.</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.question {\n  font-size: 16px;\n  padding: 10px 14px;\n  cursor: pointer;\n}\n\n.hidden {\n  display: none;\n}\n",
        js: "const question = document.querySelector(\".question\");\nconst answer = document.querySelector(\".answer\");\n\nquestion.addEventListener(\"click\", () => {\n  answer.classList.toggle(\"hidden\");\n});\n",
      },
      check: ({ $ }) => {
        const answer = $('.answer');
        if (!answer.classList.contains('hidden')) return 'The answer should start hidden.';
        $('.question').click();
        if (answer.classList.contains('hidden')) return 'After one click, the answer should be visible.';
        $('.question').click();
        return answer.classList.contains('hidden') || 'After a second click, the answer should hide again.';
      },
    },
    {
      type: 'explain',
      title: 'Event delegation',
      body: [
        "What if you have 100 buttons, or buttons that get created later? Instead of adding a listener to each one, add **one** listener to their parent. Events **bubble up** from the clicked element through its ancestors:",
        { code: `<ul id="list">\n  <li>Task A <button class="delete">✕</button></li>\n  <li>Task B <button class="delete">✕</button></li>\n</ul>`, lang: 'html' },
        { code: `const list = document.querySelector("#list");\n\nlist.addEventListener("click", (event) => {\n  if (event.target.matches(".delete")) {\n    event.target.closest("li").remove();\n  }\n});`, lang: 'js' },
        "- `event.target` is the exact element that was clicked.",
        "- `matches(selector)` checks if an element matches a CSS selector.",
        "- `closest(selector)` walks up the tree to find the nearest matching ancestor.",
        "This pattern works even for list items added *after* the listener was set up. You'll use it in the to-do app project.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'forms': [
    {
      type: 'explain',
      title: 'HTML forms',
      body: [
        "Forms are how users send information: logins, searches, checkouts. The building blocks:",
        { code: `<form id="signup">\n  <label for="email">Email</label>\n  <input id="email" type="email" required>\n\n  <label for="plan">Plan</label>\n  <select id="plan">\n    <option value="free">Free</option>\n    <option value="pro">Pro</option>\n  </select>\n\n  <label>\n    <input type="checkbox" id="terms"> I agree to the terms\n  </label>\n\n  <button type="submit">Sign up</button>\n</form>`, lang: 'html' },
        "- Every input needs a `<label>`. Linking them with `for` and `id` means clicking the label focuses the input (and screen readers announce it).",
        "- `type` changes the input: `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio`…",
        "- `required`, `minlength` and `type=\"email\"` give you free browser validation.",
      ],
    },
    {
      type: 'explain',
      title: 'Handling submit with JavaScript',
      body: [
        "When a form is submitted, the browser's default behaviour is to **reload the page** and send the data off. In a JavaScript app we stop that with `event.preventDefault()`:",
        { code: `const form = document.querySelector("#signup");\nconst emailInput = document.querySelector("#email");\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();          // stop the page reload!\n  const email = emailInput.value;  // read what was typed\n  console.log("Signing up:", email);\n  form.reset();                    // clear all the fields\n});`, lang: 'js' },
        "Listen for `submit` on the **form**, not `click` on the button. That way pressing **Enter** in a field works too.",
      ],
    },
    {
      type: 'try',
      title: 'Greeting form',
      body: ["Handle your first form submission."],
      goal: [
        "When the form is submitted:",
        "- prevent the page from reloading",
        "- show `Hello, <name>!` in `#output`",
        "- clear the input",
      ],
      hint: [
        ["Listen for `\"submit\"` on the form and call `event.preventDefault()` first."],
        [{ code: "output.textContent = `Hello, ${input.value}!`;\ninput.value = \"\";", lang: 'js' }],
      ],
      starter: {
        html: "<form>\n  <label for=\"name\">Your name</label>\n  <input id=\"name\" type=\"text\">\n  <button type=\"submit\">Greet me</button>\n</form>\n<p id=\"output\"></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n#output {\n  font-size: 24px;\n  font-weight: bold;\n}\n",
        js: "const form = document.querySelector(\"form\");\nconst input = document.querySelector(\"#name\");\nconst output = document.querySelector(\"#output\");\n\n",
      },
      solution: {
        html: "<form>\n  <label for=\"name\">Your name</label>\n  <input id=\"name\" type=\"text\">\n  <button type=\"submit\">Greet me</button>\n</form>\n<p id=\"output\"></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n#output {\n  font-size: 24px;\n  font-weight: bold;\n}\n",
        js: "const form = document.querySelector(\"form\");\nconst input = document.querySelector(\"#name\");\nconst output = document.querySelector(\"#output\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  output.textContent = `Hello, ${input.value}!`;\n  input.value = \"\";\n});\n",
      },
      check: ({ $, text }) => {
        const form = $('form'), input = $('#name');
        let prevented = null;
        form.addEventListener('submit', (e) => { prevented = e.defaultPrevented; e.preventDefault(); });
        input.value = 'Ada';
        form.requestSubmit();
        if (text('#output') !== 'Hello, Ada!') return `After submitting "Ada", the output should be "Hello, Ada!" but it is "${text('#output')}".`;
        if (prevented === false) return 'Call `event.preventDefault()` in your submit listener, or the page reloads.';
        return input.value === '' || 'Clear the input after submitting.';
      },
    },
    {
      type: 'explain',
      title: 'Validating input',
      body: [
        "Never trust user input. Users leave fields empty, type spaces, or enter letters where you expect numbers. Check before using it:",
        { code: `form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = input.value.trim();   // remove spaces at both ends\n\n  if (name === "") {\n    error.textContent = "Please enter your name.";\n    return;                           // stop here\n  }\n\n  error.textContent = "";\n  output.textContent = \`Hello, \${name}!\`;\n});`, lang: 'js' },
        "`return` inside the listener exits early, which is a neat way to handle errors first and keep the \"happy path\" un-nested.",
        "> Browser validation (`required`, `type=\"email\"`) is nice for users, but it's easy to bypass. Servers must always validate again. You'll do that in Module 13.",
      ],
    },
    {
      type: 'try',
      title: 'Add validation',
      body: ["Right now, submitting an empty name says \"Hello, !\". Let's fix that."],
      goal: [
        "- If the name is empty (or only spaces), show `Please enter your name.` in `#error` and **don't** greet",
        "- Otherwise clear `#error` and greet as before",
      ],
      hint: "Use `input.value.trim()` and check `if (name === \"\")`. `return` early to skip the greeting.",
      starter: {
        html: "<form>\n  <label for=\"name\">Your name</label>\n  <input id=\"name\" type=\"text\">\n  <button type=\"submit\">Greet me</button>\n</form>\n<p id=\"error\"></p>\n<p id=\"output\"></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n#error {\n  color: crimson;\n}\n\n#output {\n  font-size: 24px;\n  font-weight: bold;\n}\n",
        js: "const form = document.querySelector(\"form\");\nconst input = document.querySelector(\"#name\");\nconst error = document.querySelector(\"#error\");\nconst output = document.querySelector(\"#output\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const name = input.value;\n  output.textContent = `Hello, ${name}!`;\n});\n",
      },
      solution: {
        html: "<form>\n  <label for=\"name\">Your name</label>\n  <input id=\"name\" type=\"text\">\n  <button type=\"submit\">Greet me</button>\n</form>\n<p id=\"error\"></p>\n<p id=\"output\"></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n#error {\n  color: crimson;\n}\n\n#output {\n  font-size: 24px;\n  font-weight: bold;\n}\n",
        js: "const form = document.querySelector(\"form\");\nconst input = document.querySelector(\"#name\");\nconst error = document.querySelector(\"#error\");\nconst output = document.querySelector(\"#output\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const name = input.value.trim();\n\n  if (name === \"\") {\n    error.textContent = \"Please enter your name.\";\n    output.textContent = \"\";\n    return;\n  }\n\n  error.textContent = \"\";\n  output.textContent = `Hello, ${name}!`;\n});\n",
      },
      check: ({ $, text }) => {
        const form = $('form'), input = $('#name');
        form.addEventListener('submit', (e) => e.preventDefault());
        input.value = '   ';
        form.requestSubmit();
        if (text('#error') !== 'Please enter your name.') return 'An empty (or spaces-only) name should show "Please enter your name." in `#error`.';
        if (text('#output').includes('Hello')) return 'Don\'t greet when the name is empty.';
        input.value = 'Grace';
        form.requestSubmit();
        if (text('#output') !== 'Hello, Grace!') return 'A valid name should still be greeted.';
        return text('#error') === '' || 'Clear the error message when the name is valid.';
      },
    },
    {
      type: 'explain',
      title: 'Numbers, selects and checkboxes',
      body: [
        "Different inputs give you their values in slightly different ways:",
        { code: `// <input type="number" id="qty">\nconst qty = Number(document.querySelector("#qty").value);  // .value is ALWAYS a string!\n\n// <select id="size"> ... </select>\nconst size = document.querySelector("#size").value;        // the selected option's value\n\n// <input type="checkbox" id="gift">\nconst isGift = document.querySelector("#gift").checked;    // true / false`, lang: 'js' },
        "Remember the `\"5\" + 1 = \"51\"` bug from Module 2? Input values are **always strings**, so convert them with `Number()` before doing math.",
      ],
    },
    {
      type: 'try',
      title: 'Temperature converter',
      body: ["Put inputs, a select and a submit handler together."],
      goal: [
        "When the form is submitted, convert the temperature and show the result in `#result`:",
        "- `c-to-f`: F = C × 9 / 5 + 32",
        "- `f-to-c`: C = (F − 32) × 5 / 9",
        "Show just the number, rounded to 1 decimal place (e.g. `212.0`).",
      ],
      hint: [
        ["Read the number with `Number(tempInput.value)` and the direction with `direction.value`."],
        ["Round with `result.toFixed(1)`."],
      ],
      starter: {
        html: "<form>\n  <input id=\"temp\" type=\"number\" step=\"any\" aria-label=\"Temperature\" required>\n  <select id=\"direction\" aria-label=\"Conversion\">\n    <option value=\"c-to-f\">°C → °F</option>\n    <option value=\"f-to-c\">°F → °C</option>\n  </select>\n  <button type=\"submit\">Convert</button>\n</form>\n<p>Result: <strong id=\"result\">–</strong></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\ninput, select, button {\n  font-size: 16px;\n  padding: 6px;\n}\n",
        js: "const form = document.querySelector(\"form\");\nconst tempInput = document.querySelector(\"#temp\");\nconst direction = document.querySelector(\"#direction\");\nconst resultEl = document.querySelector(\"#result\");\n\n",
      },
      solution: {
        html: "<form>\n  <input id=\"temp\" type=\"number\" step=\"any\" aria-label=\"Temperature\" required>\n  <select id=\"direction\" aria-label=\"Conversion\">\n    <option value=\"c-to-f\">°C → °F</option>\n    <option value=\"f-to-c\">°F → °C</option>\n  </select>\n  <button type=\"submit\">Convert</button>\n</form>\n<p>Result: <strong id=\"result\">–</strong></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\ninput, select, button {\n  font-size: 16px;\n  padding: 6px;\n}\n",
        js: "const form = document.querySelector(\"form\");\nconst tempInput = document.querySelector(\"#temp\");\nconst direction = document.querySelector(\"#direction\");\nconst resultEl = document.querySelector(\"#result\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const value = Number(tempInput.value);\n  let result;\n\n  if (direction.value === \"c-to-f\") {\n    result = value * 9 / 5 + 32;\n  } else {\n    result = (value - 32) * 5 / 9;\n  }\n\n  resultEl.textContent = result.toFixed(1);\n});\n",
      },
      check: ({ $, text }) => {
        const form = $('form');
        form.addEventListener('submit', (e) => e.preventDefault());
        $('#temp').value = '100';
        $('#direction').value = 'c-to-f';
        form.requestSubmit();
        if (text('#result') !== '212.0') return `100°C should convert to 212.0, but the result shows "${text('#result')}".`;
        $('#temp').value = '50';
        $('#direction').value = 'f-to-c';
        form.requestSubmit();
        return text('#result') === '10.0' || `50°F should convert to 10.0, but the result shows "${text('#result')}".`;
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-todo': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "The **to-do app** is the \"hello world\" of front-end development, and for good reason: it uses everything. You'll build one that can:",
        "- add tasks with a form",
        "- mark tasks as done (and undo)",
        "- delete tasks",
        "- show how many tasks are left",
        "### The plan: state + render",
        "Professional apps separate **data** from **display**. Keep your tasks in an array of objects (the **state**), and write one `render()` function that rebuilds the list from that array. Whenever something changes: update the array, then call `render()`.",
        { code: `let todos = [\n  { id: 1, text: "Learn the DOM", done: true },\n  { id: 2, text: "Build a to-do app", done: false },\n];\n\nfunction render() {\n  // clear the list, then create an <li> for every todo\n}`, lang: 'js' },
        "> This is exactly how React works under the hood. Learn it here and React will feel natural.",
      ],
    },
    {
      type: 'project',
      title: 'To-do app',
      body: ["Keep the IDs and class names from the starter HTML. The checker uses them."],
      tasks: [
        "Store tasks in a `todos` array of objects like `{ id, text, done }`",
        "Write a `render()` function that clears `#todo-list` and adds an `li` for each todo",
        "Each `li` contains the task text in a `span`, a `button.toggle` (✓) and a `button.delete` (✕)",
        "Submitting the form adds a new todo (ignore empty input), clears the input and re-renders",
        "Clicking ✓ toggles `done`. Done items get the `done` class (already styled with a strike-through)",
        "Clicking ✕ removes the todo",
        "`#remaining` shows how many tasks are not done yet",
      ],
      hint: [
        ["For a unique id, `Date.now()` works fine."],
        ["Use **event delegation**: one click listener on `#todo-list`, then check `event.target.matches(\".delete\")` or `.matches(\".toggle\")`."],
        ["Store the todo's id on the `li` with `li.dataset.id = todo.id`, then read it back with `Number(event.target.closest(\"li\").dataset.id)`."],
        ["Delete with `todos = todos.filter(t => t.id !== id)`. Toggle with `const todo = todos.find(t => t.id === id); todo.done = !todo.done;`"],
      ],
      starter: {
        html: "<main class=\"app\">\n  <h1>📝 My To-dos</h1>\n\n  <form id=\"todo-form\">\n    <input id=\"todo-input\" type=\"text\" placeholder=\"What needs doing?\" aria-label=\"New task\">\n    <button type=\"submit\">Add</button>\n  </form>\n\n  <ul id=\"todo-list\"></ul>\n\n  <p><span id=\"remaining\">0</span> tasks left</p>\n</main>\n",
        css: "body {\n  font-family: \"Segoe UI\", sans-serif;\n  background: #f0f2f8;\n}\n\n.app {\n  max-width: 420px;\n  margin: 0 auto;\n  background: white;\n  padding: 20px;\n  border-radius: 16px;\n}\n\nh1 {\n  margin-top: 0;\n}\n\n#todo-form {\n  display: flex;\n  gap: 8px;\n}\n\n#todo-input {\n  flex: 1;\n  padding: 10px;\n  font-size: 16px;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n}\n\nbutton {\n  cursor: pointer;\n  border: none;\n  border-radius: 8px;\n  padding: 8px 12px;\n  background: #6a4cf0;\n  color: white;\n  font-size: 15px;\n}\n\n#todo-list {\n  list-style: none;\n  padding: 0;\n}\n\n#todo-list li {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 0;\n  border-bottom: 1px solid #eee;\n}\n\n#todo-list li span {\n  flex: 1;\n}\n\n#todo-list li.done span {\n  text-decoration: line-through;\n  color: #999;\n}\n\n.delete {\n  background: #c53b3b;\n}\n",
        js: "let todos = [];\n\nconst form = document.querySelector(\"#todo-form\");\nconst input = document.querySelector(\"#todo-input\");\nconst list = document.querySelector(\"#todo-list\");\nconst remaining = document.querySelector(\"#remaining\");\n\nfunction render() {\n  // 1. clear the list\n  // 2. create an li for each todo\n  // 3. update the remaining count\n}\n\n// Add a todo when the form is submitted\n\n\n// Toggle / delete with event delegation\n\n\nrender();\n",
      },
      solution: {
        html: "<main class=\"app\">\n  <h1>📝 My To-dos</h1>\n\n  <form id=\"todo-form\">\n    <input id=\"todo-input\" type=\"text\" placeholder=\"What needs doing?\" aria-label=\"New task\">\n    <button type=\"submit\">Add</button>\n  </form>\n\n  <ul id=\"todo-list\"></ul>\n\n  <p><span id=\"remaining\">0</span> tasks left</p>\n</main>\n",
        css: "body {\n  font-family: \"Segoe UI\", sans-serif;\n  background: #f0f2f8;\n}\n\n.app {\n  max-width: 420px;\n  margin: 0 auto;\n  background: white;\n  padding: 20px;\n  border-radius: 16px;\n}\n\nh1 {\n  margin-top: 0;\n}\n\n#todo-form {\n  display: flex;\n  gap: 8px;\n}\n\n#todo-input {\n  flex: 1;\n  padding: 10px;\n  font-size: 16px;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n}\n\nbutton {\n  cursor: pointer;\n  border: none;\n  border-radius: 8px;\n  padding: 8px 12px;\n  background: #6a4cf0;\n  color: white;\n  font-size: 15px;\n}\n\n#todo-list {\n  list-style: none;\n  padding: 0;\n}\n\n#todo-list li {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 0;\n  border-bottom: 1px solid #eee;\n}\n\n#todo-list li span {\n  flex: 1;\n}\n\n#todo-list li.done span {\n  text-decoration: line-through;\n  color: #999;\n}\n\n.delete {\n  background: #c53b3b;\n}\n",
        js: "let todos = [];\n\nconst form = document.querySelector(\"#todo-form\");\nconst input = document.querySelector(\"#todo-input\");\nconst list = document.querySelector(\"#todo-list\");\nconst remaining = document.querySelector(\"#remaining\");\n\nfunction render() {\n  list.innerHTML = \"\";\n\n  for (const todo of todos) {\n    const li = document.createElement(\"li\");\n    li.dataset.id = todo.id;\n    if (todo.done) li.classList.add(\"done\");\n\n    const span = document.createElement(\"span\");\n    span.textContent = todo.text;\n\n    const toggle = document.createElement(\"button\");\n    toggle.className = \"toggle\";\n    toggle.textContent = \"✓\";\n\n    const del = document.createElement(\"button\");\n    del.className = \"delete\";\n    del.textContent = \"✕\";\n\n    li.append(span, toggle, del);\n    list.append(li);\n  }\n\n  remaining.textContent = todos.filter(t => !t.done).length;\n}\n\n// Add a todo when the form is submitted\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const text = input.value.trim();\n  if (text === \"\") return;\n\n  todos.push({ id: Date.now(), text, done: false });\n  input.value = \"\";\n  render();\n});\n\n// Toggle / delete with event delegation\nlist.addEventListener(\"click\", (event) => {\n  const li = event.target.closest(\"li\");\n  if (!li) return;\n  const id = Number(li.dataset.id);\n\n  if (event.target.matches(\".toggle\")) {\n    const todo = todos.find(t => t.id === id);\n    todo.done = !todo.done;\n  } else if (event.target.matches(\".delete\")) {\n    todos = todos.filter(t => t.id !== id);\n  }\n\n  render();\n});\n\nrender();\n",
      },
      check: async ({ $, $$, text, wait }) => {
        const form = $('#todo-form'), input = $('#todo-input');
        form.addEventListener('submit', (e) => e.preventDefault());
        const add = async (t) => { input.value = t; form.requestSubmit(); await wait(5); };
        const before = $$('#todo-list li').length;
        await add('Task one');
        if (input.value !== '') return 'Clear the input after adding a task.';
        await add('Task two');
        await add('   ');
        const items = $$('#todo-list li');
        if (items.length !== before + 2) return `Adding 2 tasks (and one empty one) should give ${before + 2} items, found ${items.length}.`;
        if (text('#remaining') !== String(before + 2)) return '`#remaining` should count the tasks that are not done.';
        const last = () => $$('#todo-list li').pop();
        const toggle = last().querySelector('.toggle');
        if (!toggle) return 'Each `li` needs a `button` with the class `toggle`.';
        toggle.click();
        await wait(5);
        if (!last().classList.contains('done')) return 'Clicking ✓ should give the `li` the `done` class.';
        if (text('#remaining') !== String(before + 1)) return '`#remaining` should go down when a task is done.';
        const del = last().querySelector('.delete');
        if (!del) return 'Each `li` needs a `button` with the class `delete`.';
        del.click();
        await wait(5);
        if ($$('#todo-list li').length !== before + 1) return 'Clicking ✕ should remove the task.';
        return true;
      },
      success: "You built a real to-do app with state and rendering! 🎉",
    },
    {
      type: 'explain',
      title: 'Module 5 complete',
      body: [
        "Your JavaScript can now drive real web pages:",
        "- Select elements with `querySelector` / `querySelectorAll`",
        "- Change text, attributes, classes and styles",
        "- Create and remove elements from data",
        "- React to clicks, typing and form submissions",
        "- Use the **state → render** pattern and event delegation",
        "> Challenge: add an \"Edit\" button to your to-do app, or a filter to show All / Active / Done tasks.",
        "Next up is **Module 6: Semantic HTML & Accessibility**, where you make sure what you build works for *everyone*. You'll even come back and improve this to-do app.",
      ],
    },
  ],
});
