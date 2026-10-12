/* Module 6 — Semantic HTML & Accessibility */
Course.addContent('m06', {

  /* ---------------------------------------------------------------- */
  'semantic-elements': [
    {
      type: 'explain',
      title: 'What does "semantic" mean?',
      body: [
        "**Semantic** HTML means choosing elements for what they *mean*, not how they look. Compare these two pages:",
        { code: `<!-- ❌ "div soup" -->\n<div class="header">\n  <div class="nav">...</div>\n</div>\n<div class="content">...</div>\n<div class="footer">...</div>\n\n<!-- ✅ semantic -->\n<header>\n  <nav>...</nav>\n</header>\n<main>...</main>\n<footer>...</footer>`, lang: 'html' },
        "Both can look identical. But the semantic version:",
        "- lets **screen reader** users jump straight to the navigation or main content",
        "- helps **search engines** understand your page",
        "- is easier for **other developers** (and future you) to read",
        "- gives you browser features for free, like keyboard support on buttons",
      ],
    },
    {
      type: 'explain',
      title: 'Landmark elements',
      body: [
        "These elements describe the big regions of a page. Screen readers list them as **landmarks** for quick navigation:",
        "- `<header>`: introductory content: logo, site title, sometimes the nav",
        "- `<nav>`: a block of navigation links",
        "- `<main>`: the main content. Use exactly **one** per page",
        "- `<aside>`: related content off to the side: sidebars, call-outs",
        "- `<footer>`: copyright, contact info, secondary links",
        "- `<section>`: a themed group of content, usually with its own heading",
        "- `<article>`: a self-contained piece that would make sense on its own: a blog post, a news story, a product card",
        { code: `<body>\n  <header>\n    <h1>Daily Recipes</h1>\n    <nav><a href="/">Home</a> <a href="/about">About</a></nav>\n  </header>\n  <main>\n    <article>\n      <h2>Perfect pancakes</h2>\n      <p>...</p>\n    </article>\n  </main>\n  <footer>© 2026 Daily Recipes</footer>\n</body>`, lang: 'html' },
      ],
    },
    {
      type: 'try',
      title: 'Fix the div soup',
      body: ["This page works, but it's all `div`s. The CSS uses element selectors, so it will style your semantic elements once you swap them in."],
      goal: "Replace the four divs with the matching semantic elements: `<header>`, `<nav>`, `<main>` and `<footer>`. Remove the `class` attributes too.",
      hint: "`<div class=\"header\">` becomes `<header>`. Don't forget to change the closing tags.",
      starter: {
        html: "<div class=\"header\">\n  <h1>Pixel Pets</h1>\n  <div class=\"nav\">\n    <a href=\"#\">Home</a>\n    <a href=\"#\">Adopt</a>\n  </div>\n</div>\n\n<div class=\"main\">\n  <h2>Find your new best friend</h2>\n  <p>Hundreds of virtual pets are waiting for a home.</p>\n</div>\n\n<div class=\"footer\">\n  <p>© 2026 Pixel Pets</p>\n</div>\n",
        css: "body {\n  font-family: sans-serif;\n  margin: 0;\n}\n\nheader, footer {\n  background: #1d1f2d;\n  color: white;\n  padding: 12px 16px;\n}\n\nnav a {\n  color: #c9bcff;\n  margin-right: 12px;\n}\n\nmain {\n  padding: 16px;\n}\n",
      },
      solution: {
        html: "<header>\n  <h1>Pixel Pets</h1>\n  <nav>\n    <a href=\"#\">Home</a>\n    <a href=\"#\">Adopt</a>\n  </nav>\n</header>\n\n<main>\n  <h2>Find your new best friend</h2>\n  <p>Hundreds of virtual pets are waiting for a home.</p>\n</main>\n\n<footer>\n  <p>© 2026 Pixel Pets</p>\n</footer>\n",
        css: "body {\n  font-family: sans-serif;\n  margin: 0;\n}\n\nheader, footer {\n  background: #1d1f2d;\n  color: white;\n  padding: 12px 16px;\n}\n\nnav a {\n  color: #c9bcff;\n  margin-right: 12px;\n}\n\nmain {\n  padding: 16px;\n}\n",
      },
      check: ({ $, $$ }) => {
        for (const tag of ['header', 'nav', 'main', 'footer']) if (!$(tag)) return `Add a \`<${tag}>\` element.`;
        if (!$('header nav')) return 'The `<nav>` should be inside the `<header>`.';
        if (!$('main h2')) return 'The `<h2>` and paragraph belong inside `<main>`.';
        return $$('div').length === 0 || 'There are still some `div`s left. Replace them all.';
      },
    },
    {
      type: 'explain',
      title: 'Headings, articles and figures',
      body: [
        "Headings create the **outline** of your page. Screen reader users often navigate by jumping from heading to heading, so:",
        "- Use one `<h1>` for the page's main title.",
        "- Don't skip levels (an `<h2>` followed by an `<h4>`).",
        "- Choose headings by **importance**, not size. Change the size with CSS.",
        "A few more meaningful elements:",
        { code: `<article>\n  <h2>We adopted a cat!</h2>\n  <p>Posted <time datetime="2026-03-14">March 14</time></p>\n\n  <figure>\n    <img src="milo.jpg" alt="Milo, an orange kitten, asleep in a shoebox">\n    <figcaption>Milo's favourite bed is, of course, the box.</figcaption>\n  </figure>\n</article>`, lang: 'html' },
        "- `<time datetime=\"...\">` gives dates a machine-readable format.",
        "- `<figure>` and `<figcaption>` group an image (or chart, or code) with its caption.",
      ],
    },
    {
      type: 'try',
      title: 'Write a blog post',
      body: ["Mark up a short blog post using the right elements."],
      goal: [
        "Inside the `<main>`, create an `<article>` containing:",
        "- an `<h2>` title",
        "- a `<time>` element with a `datetime` attribute",
        "- a `<figure>` with an `<img>` (with alt text) and a `<figcaption>`",
        "- at least one `<p>`",
      ],
      hint: "Use the example from the previous step as a template. Try `src=\"https://picsum.photos/id/40/300/200\"` for the image.",
      starter: {
        html: "<main>\n  <!-- Your article goes here -->\n\n</main>\n",
        css: "body {\n  font-family: Georgia, serif;\n  max-width: 520px;\n  margin: 0 auto;\n  padding: 12px;\n}\n\nimg {\n  max-width: 100%;\n  border-radius: 8px;\n}\n\nfigcaption {\n  font-size: 14px;\n  color: #5d6279;\n}\n",
      },
      solution: {
        html: "<main>\n  <article>\n    <h2>We adopted a cat!</h2>\n    <p>Posted <time datetime=\"2026-03-14\">March 14, 2026</time></p>\n\n    <figure>\n      <img src=\"https://picsum.photos/id/40/300/200\" alt=\"A grey cat looking up at the camera\">\n      <figcaption>Meet Milo, the newest member of the family.</figcaption>\n    </figure>\n\n    <p>After weeks of visiting shelters, we finally found him.</p>\n  </article>\n</main>\n",
        css: "body {\n  font-family: Georgia, serif;\n  max-width: 520px;\n  margin: 0 auto;\n  padding: 12px;\n}\n\nimg {\n  max-width: 100%;\n  border-radius: 8px;\n}\n\nfigcaption {\n  font-size: 14px;\n  color: #5d6279;\n}\n",
      },
      check: ({ $ }) => {
        if (!$('main article')) return 'Add an `<article>` inside `<main>`.';
        if (!$('article h2')) return 'Give the article an `<h2>` title.';
        const time = $('article time');
        if (!time || !time.getAttribute('datetime')) return 'Add a `<time>` with a `datetime` attribute, like `datetime="2026-03-14"`.';
        if (!$('article figure img') || !$('article figure figcaption')) return 'Add a `<figure>` containing an `<img>` and a `<figcaption>`.';
        const alt = $('article figure img').getAttribute('alt');
        if (!alt || !alt.trim()) return 'Give the image some `alt` text.';
        return !!$('article p') || 'Add at least one paragraph.';
      },
    },
    {
      type: 'explain',
      title: 'Buttons vs links',
      body: [
        "One of the most common accessibility bugs is using the wrong clickable element:",
        "- `<a href>` **navigates** somewhere: another page, a section, a file.",
        "- `<button>` **does something** on the current page: submit, open a menu, delete, like.",
        "Never make a clickable `<div>`:",
        { code: `<!-- ❌ can't be reached with Tab, doesn't work with Enter/Space, isn't announced as a button -->\n<div class="btn" onclick="save()">Save</div>\n\n<!-- ✅ all of that for free -->\n<button type="button" class="btn">Save</button>`, lang: 'html' },
        "A real `<button>` is focusable, works with the keyboard, and screen readers announce it as \"Save, button\". Recreating all that on a `div` takes a lot of extra code, and is easy to get wrong.",
      ],
    },
    {
      type: 'try',
      title: 'Fix the fake button',
      body: ["Try pressing Tab in the preview: you can't reach the \"Like\" control with the keyboard."],
      goal: "Replace the `<div class=\"like\">` with a real `<button>` (keep the `like` class so the JavaScript still works).",
      hint: "`<button type=\"button\" class=\"like\">❤️ Like</button>`",
      starter: {
        html: "<p>Did you enjoy this lesson?</p>\n<div class=\"like\">❤️ Like</div>\n<p id=\"status\"></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.like {\n  display: inline-block;\n  padding: 8px 14px;\n  border: 2px solid crimson;\n  border-radius: 999px;\n  background: white;\n  font-size: 16px;\n  cursor: pointer;\n}\n",
        js: "document.querySelector(\".like\").addEventListener(\"click\", () => {\n  document.querySelector(\"#status\").textContent = \"Thanks for the love!\";\n});\n",
      },
      solution: {
        html: "<p>Did you enjoy this lesson?</p>\n<button type=\"button\" class=\"like\">❤️ Like</button>\n<p id=\"status\"></p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.like {\n  display: inline-block;\n  padding: 8px 14px;\n  border: 2px solid crimson;\n  border-radius: 999px;\n  background: white;\n  font-size: 16px;\n  cursor: pointer;\n}\n",
        js: "document.querySelector(\".like\").addEventListener(\"click\", () => {\n  document.querySelector(\"#status\").textContent = \"Thanks for the love!\";\n});\n",
      },
      check: ({ $, text }) => {
        if ($('div.like')) return 'The like control is still a `div`.';
        const btn = $('button.like');
        if (!btn) return 'Add a `<button>` with the class `like`.';
        btn.click();
        return text('#status') === 'Thanks for the love!' || 'The button should still work when clicked.';
      },
    },
    {
      type: 'explain',
      title: 'Tables for tabular data',
      body: [
        "When data has rows **and** columns, like a timetable, prices or results, use a `<table>`. Never use tables for page layout (that's what grid is for).",
        { code: `<table>\n  <caption>Workshop schedule</caption>\n  <thead>\n    <tr>\n      <th scope="col">Time</th>\n      <th scope="col">Session</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>09:00</td>\n      <td>HTML basics</td>\n    </tr>\n    <tr>\n      <td>11:00</td>\n      <td>CSS layout</td>\n    </tr>\n  </tbody>\n</table>`, lang: 'html' },
        "- `<caption>` titles the table.",
        "- `<th>` are header cells. `scope=\"col\"` tells screen readers they head a column, so each cell can be read with its header.",
        "- `<tr>` is a row; `<td>` is a normal data cell.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'accessibility-basics': [
    {
      type: 'explain',
      title: 'Why accessibility matters',
      body: [
        "**Accessibility** (often shortened to **a11y**: 11 letters between the a and the y) means building sites everyone can use, including people who:",
        "- are blind or have low vision and use a **screen reader** or zoom",
        "- can't use a mouse and navigate with a **keyboard** or switch device",
        "- are deaf or hard of hearing (videos need captions)",
        "- have cognitive or learning differences",
        "About 1 in 6 people worldwide lives with a significant disability, and everyone benefits: captions in a noisy café, big buttons on a bumpy bus, good contrast in bright sunlight.",
        "In many countries accessibility is also a **legal requirement**. The standard to aim for is **WCAG** (Web Content Accessibility Guidelines) level AA.",
        "> Good news: semantic HTML gets you most of the way there. Most accessibility bugs come from fighting the browser instead of using the right element.",
      ],
    },
    {
      type: 'explain',
      title: 'Alternative text',
      body: [
        "Screen readers read an image's `alt` text out loud. Writing good alt text depends on the image's **purpose**:",
        { code: `<!-- Informative: describe what matters -->\n<img src="chart.png" alt="Sales doubled from 2024 to 2025">\n\n<!-- Functional (an image inside a link/button): describe the ACTION -->\n<a href="/"><img src="logo.svg" alt="PizzaPlace home"></a>\n\n<!-- Decorative: empty alt so screen readers skip it -->\n<img src="swirly-divider.png" alt="">`, lang: 'html' },
        "- Don't start with \"Image of…\". Screen readers already say it's an image.",
        "- Keep it short and useful in context.",
        "- Decorative images get `alt=\"\"` (empty, not missing!). Without any `alt`, some screen readers read out the file name instead.",
      ],
    },
    {
      type: 'try',
      title: 'Write good alt text',
      body: ["One image carries information; the other is pure decoration."],
      goal: [
        "- Give the **chart** image a descriptive `alt` (it shows that website visitors tripled in 2026)",
        "- Mark the **sparkles** image as decorative with an empty `alt=\"\"`",
      ],
      hint: "Decorative: `alt=\"\"` (two quotes with nothing between).",
      starter: {
        html: "<h2>Our year in review <img class=\"sparkles\" src=\"https://picsum.photos/id/1080/40/40\"></h2>\n\n<img class=\"chart\" src=\"https://picsum.photos/id/20/300/160\">\n<p>Thanks to all of you, 2026 was our best year yet.</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.sparkles {\n  vertical-align: middle;\n  border-radius: 50%;\n}\n",
      },
      solution: {
        html: "<h2>Our year in review <img class=\"sparkles\" src=\"https://picsum.photos/id/1080/40/40\" alt=\"\"></h2>\n\n<img class=\"chart\" src=\"https://picsum.photos/id/20/300/160\" alt=\"Bar chart: website visitors tripled in 2026 compared with 2025\">\n<p>Thanks to all of you, 2026 was our best year yet.</p>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\n.sparkles {\n  vertical-align: middle;\n  border-radius: 50%;\n}\n",
      },
      check: ({ $ }) => {
        const chart = $('.chart'), sparkles = $('.sparkles');
        const alt = chart.getAttribute('alt');
        if (!alt || alt.trim().length < 10) return 'Give the chart a descriptive `alt` that explains what it shows.';
        if (/^(image|picture|photo) of/i.test(alt.trim())) return 'Skip "Image of…". Screen readers already announce that it\'s an image.';
        if (!sparkles.hasAttribute('alt')) return 'The sparkles image needs an `alt` attribute. Make it empty: `alt=""`.';
        return sparkles.getAttribute('alt') === '' || 'The sparkles are decorative, so their `alt` should be empty.';
      },
    },
    {
      type: 'explain',
      title: 'Labels for every input',
      body: [
        "Every form control needs a **label**: visible text that's programmatically linked to it.",
        { code: `<!-- ✅ explicit: for matches the input's id -->\n<label for="email">Email address</label>\n<input id="email" type="email">\n\n<!-- ✅ implicit: input inside the label -->\n<label>\n  <input type="checkbox"> Subscribe to the newsletter\n</label>\n\n<!-- ❌ placeholder is NOT a label: it disappears when you type -->\n<input type="email" placeholder="Email">`, lang: 'html' },
        "Linked labels are read aloud when the input gets focus, and clicking them focuses the input, which gives people with shaky hands a bigger target.",
        "If a visible label truly isn't possible (like a search box with a 🔍 button), use `aria-label=\"Search\"` on the input as a last resort.",
      ],
    },
    {
      type: 'try',
      title: 'Label the form',
      body: ["This sign-up form only has placeholders. A screen reader user hears \"edit text, edit text\" with no idea what to type."],
      goal: "Add a `<label>` for **each** input, linked with `for` / `id`.",
      hint: "Give each input an `id` (e.g. `id=\"username\"`), then add `<label for=\"username\">Username</label>` before it.",
      starter: {
        html: "<form>\n  <input type=\"text\" placeholder=\"Username\">\n  <input type=\"email\" placeholder=\"Email\">\n  <input type=\"password\" placeholder=\"Password\">\n  <button type=\"submit\">Create account</button>\n</form>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 280px;\n}\n\ninput {\n  padding: 8px;\n  margin-bottom: 8px;\n}\n",
      },
      solution: {
        html: "<form>\n  <label for=\"username\">Username</label>\n  <input id=\"username\" type=\"text\">\n\n  <label for=\"email\">Email</label>\n  <input id=\"email\" type=\"email\">\n\n  <label for=\"password\">Password</label>\n  <input id=\"password\" type=\"password\">\n\n  <button type=\"submit\">Create account</button>\n</form>\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 280px;\n}\n\ninput {\n  padding: 8px;\n  margin-bottom: 8px;\n}\n",
      },
      check: ({ $$ }) => {
        const inputs = $$('input');
        for (const input of inputs) {
          if (!input.labels || !input.labels.length) return `The ${input.type} input has no linked \`<label>\`.`;
          if (!input.labels[0].textContent.trim()) return 'Labels need visible text.';
        }
        return inputs.length === 3 || 'Keep all three inputs.';
      },
    },
    {
      type: 'explain',
      title: 'Keyboard access and focus',
      body: [
        "Try it now: put your mouse aside and press **Tab** to move through this page, **Shift+Tab** to go back, and **Enter** or **Space** to activate things. Everything clickable should be reachable and usable this way.",
        "The **focus indicator** (that outline around the focused element) shows keyboard users where they are. Removing it is like hiding the mouse cursor:",
        { code: `/* ❌ never do this without a replacement */\nbutton:focus {\n  outline: none;\n}\n\n/* ✅ a clear custom style that only shows for keyboard users */\nbutton:focus-visible {\n  outline: 3px solid #6a4cf0;\n  outline-offset: 2px;\n}`, lang: 'css' },
        "Rules of thumb:",
        "- Use real `<button>`, `<a href>` and form elements, which are focusable automatically.",
        "- Keep the visual order and the HTML order the same, so Tab moves logically.",
        "- `tabindex=\"0\"` makes something focusable, but you rarely need it if you use the right elements. Avoid positive `tabindex` values.",
      ],
    },
    {
      type: 'try',
      title: 'Restore the focus outline',
      body: ["A designer removed the focus ring because they \"didn't like how it looked\". Click in the preview and press Tab: you can't tell which button is focused."],
      goal: [
        "- Delete the `outline: none` rule",
        "- Add a `button:focus-visible` rule with a clearly visible `outline`",
      ],
      hint: "`button:focus-visible { outline: 3px solid #6a4cf0; outline-offset: 2px; }`",
      starter: {
        html: "<button>Save</button>\n<button>Cancel</button>\n<button>Delete</button>\n",
        css: "button {\n  font-size: 16px;\n  padding: 8px 14px;\n  margin: 4px;\n  border: none;\n  border-radius: 8px;\n  background: #eef0f8;\n}\n\nbutton:focus {\n  outline: none;\n}\n",
      },
      solution: {
        html: "<button>Save</button>\n<button>Cancel</button>\n<button>Delete</button>\n",
        css: "button {\n  font-size: 16px;\n  padding: 8px 14px;\n  margin: 4px;\n  border: none;\n  border-radius: 8px;\n  background: #eef0f8;\n}\n\nbutton:focus-visible {\n  outline: 3px solid #6a4cf0;\n  outline-offset: 2px;\n}\n",
      },
      check: ({ code }) => {
        if (/outline\s*:\s*(none|0)\b/.test(code.css)) return 'Remove the `outline: none` rule.';
        if (!/:focus-visible/.test(code.css)) return 'Add a `button:focus-visible` rule.';
        return /:focus-visible\s*\{[^}]*outline\s*:\s*\d/.test(code.css) || 'Give the focus-visible rule a visible outline, e.g. `outline: 3px solid #6a4cf0;`';
      },
    },
    {
      type: 'explain',
      title: 'Color and contrast',
      body: [
        "Light grey text on a white background might look elegant, but many people can't read it. WCAG asks for a **contrast ratio** of at least:",
        "- **4.5 : 1** for normal text",
        "- **3 : 1** for large text (about 24px, or 19px bold) and for icons and input borders",
        "Check contrast with your browser's DevTools (inspect a text element and hover its color) or a free online contrast checker.",
        "**Don't rely on color alone.** About 1 in 12 men have some form of color blindness:",
        { code: `<!-- ❌ only color shows the error -->\n<input style="border-color: red">\n\n<!-- ✅ color + icon + text -->\n<input aria-describedby="email-error" style="border-color: red">\n<p id="email-error">⚠️ Please enter a valid email address.</p>`, lang: 'html' },
      ],
    },
    {
      type: 'explain',
      title: 'ARIA basics',
      body: [
        "**ARIA** attributes add extra accessibility information when HTML alone isn't enough. The **first rule of ARIA**: if a native HTML element does the job, use that instead. But a few attributes are genuinely essential:",
        { code: `<!-- Name an icon-only button -->\n<button aria-label="Close">✕</button>\n\n<!-- Announce messages that appear dynamically -->\n<p aria-live="polite" id="status"></p>\n\n<!-- Tell screen readers whether a menu is open -->\n<button aria-expanded="false" aria-controls="menu">Menu</button>\n\n<!-- Hide purely decorative things from screen readers -->\n<span aria-hidden="true">🎉</span>`, lang: 'html' },
        "- `aria-label` gives an element an accessible name when there's no visible text.",
        "- `aria-live=\"polite\"` makes screen readers announce text that JavaScript puts into that element: \"Item added\", \"3 results found\".",
        "- `aria-expanded` should be updated with JavaScript when the thing it controls opens and closes.",
      ],
    },
    {
      type: 'try',
      title: 'Name the icon buttons',
      body: ["A screen reader announces these buttons as just \"button\". Users have no idea what they do."],
      goal: [
        "- Give each icon button an `aria-label`: **Previous track**, **Play** and **Next track**",
        "- Make the `#status` message a live region with `aria-live=\"polite\"`",
      ],
      hint: "`<button aria-label=\"Previous track\">⏮</button>`",
      starter: {
        html: "<div class=\"player\">\n  <button class=\"prev\">⏮</button>\n  <button class=\"play\">▶</button>\n  <button class=\"next\">⏭</button>\n</div>\n<p id=\"status\"></p>\n",
        css: ".player button {\n  font-size: 24px;\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  border: 1px solid #ccc;\n  background: white;\n}\n",
        js: "document.querySelector(\".play\").addEventListener(\"click\", () => {\n  document.querySelector(\"#status\").textContent = \"Now playing: Lo-fi beats to code to\";\n});\n",
      },
      solution: {
        html: "<div class=\"player\">\n  <button class=\"prev\" aria-label=\"Previous track\">⏮</button>\n  <button class=\"play\" aria-label=\"Play\">▶</button>\n  <button class=\"next\" aria-label=\"Next track\">⏭</button>\n</div>\n<p id=\"status\" aria-live=\"polite\"></p>\n",
        css: ".player button {\n  font-size: 24px;\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  border: 1px solid #ccc;\n  background: white;\n}\n",
        js: "document.querySelector(\".play\").addEventListener(\"click\", () => {\n  document.querySelector(\"#status\").textContent = \"Now playing: Lo-fi beats to code to\";\n});\n",
      },
      check: ({ $ }) => {
        const want = { '.prev': 'previous', '.play': 'play', '.next': 'next' };
        for (const [sel, word] of Object.entries(want)) {
          const label = ($(sel).getAttribute('aria-label') || '').toLowerCase();
          if (!label.includes(word)) return `The \`${sel}\` button needs an \`aria-label\` (e.g. "${word[0].toUpperCase() + word.slice(1)}…").`;
        }
        return $('#status').getAttribute('aria-live') === 'polite' || 'Add `aria-live="polite"` to `#status`.';
      },
    },
    {
      type: 'explain',
      title: 'Testing accessibility',
      body: [
        "You don't need special skills to catch most problems. Build these checks into your routine:",
        "1. **Keyboard test**: unplug the mouse (figuratively). Can you reach and use everything with Tab, Enter, Space and the arrow keys? Can you always see where focus is?",
        "2. **Zoom test**: zoom the browser to 200%. Does anything overlap or get cut off?",
        "3. **Automated check**: in Chrome or Edge DevTools, run a **Lighthouse** accessibility audit. It catches missing alt text, labels and low contrast.",
        "4. **Screen reader**: Windows has **Narrator** built in (Ctrl+Win+Enter), and **NVDA** is free. On Mac, use **VoiceOver** (Cmd+F5). Try navigating by headings and landmarks.",
        "> Automated tools find maybe 30–40% of issues. The keyboard test catches a big chunk of the rest, and it takes 2 minutes.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-accessible-todo': [
    {
      type: 'explain',
      title: 'Your mission: an accessibility audit',
      body: [
        "Real developers often inherit code with accessibility problems. Here's a to-do app that *looks* fine but is full of them.",
        "Your job: find and fix every issue. Use the checklist, and test with the keyboard as you go (click in the preview, then use Tab).",
        "Problems hiding in the starter code include:",
        "- fake buttons made from `div`s",
        "- an input with no label",
        "- icon-only buttons with no names",
        "- a removed focus outline",
        "- no landmarks or proper heading",
        "- low-contrast text",
        "- status changes that screen readers never announce",
      ],
    },
    {
      type: 'project',
      title: 'Make the to-do app accessible',
      body: ["Keep the class names (`add-btn`, `delete-btn`, `todo-text`) and `#todo-input`, `#todo-list` and `#status` IDs, since the JavaScript uses them."],
      tasks: [
        "Wrap the app in `<main>` and turn the title `div` into an `<h1>`",
        "Give the input a real `<label>` (visible or visually hidden), linked with `for`/`id`",
        "Turn the \"Add\" `div` into a `<button>`, and wrap the input and button in a `<form>` so Enter works",
        "Make each delete control a `<button>` with an `aria-label` like `Delete Buy milk`",
        "Remove `outline: none` and add a visible `:focus-visible` style",
        "Fix the low-contrast grey text (aim for a darker color like `#555`)",
        "Make `#status` an `aria-live=\"polite\"` region so additions and deletions are announced",
      ],
      hint: [
        ["A common \"visually hidden\" class keeps a label available to screen readers without showing it:", { code: ".visually-hidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n}", lang: 'css' }],
        ["When you switch to a `<form>`, listen for `submit` (with `preventDefault()`) instead of `click`."],
        ["Give the delete button its name in JavaScript:", { code: "del.setAttribute(\"aria-label\", `Delete ${text}`);", lang: 'js' }],
      ],
      starter: {
        html: "<div class=\"app\">\n  <div class=\"title\">My To-dos</div>\n\n  <div class=\"row\">\n    <input id=\"todo-input\" type=\"text\" placeholder=\"New task\">\n    <div class=\"add-btn\">＋</div>\n  </div>\n\n  <ul id=\"todo-list\"></ul>\n  <p id=\"status\" class=\"hint\"></p>\n</div>\n",
        css: "body {\n  font-family: sans-serif;\n  background: #f0f2f8;\n}\n\n.app {\n  max-width: 400px;\n  margin: 0 auto;\n  background: white;\n  padding: 20px;\n  border-radius: 16px;\n}\n\n.title {\n  font-size: 28px;\n  font-weight: bold;\n}\n\n.row {\n  display: flex;\n  gap: 8px;\n  margin: 12px 0;\n}\n\n#todo-input {\n  flex: 1;\n  padding: 10px;\n  font-size: 16px;\n}\n\n.add-btn, .delete-btn {\n  cursor: pointer;\n  padding: 8px 12px;\n  background: #6a4cf0;\n  color: white;\n  border-radius: 8px;\n}\n\n.delete-btn {\n  background: #c53b3b;\n}\n\n#todo-list {\n  list-style: none;\n  padding: 0;\n}\n\n#todo-list li {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 0;\n}\n\n.hint {\n  color: #c8c8c8;\n}\n\n*:focus {\n  outline: none;\n}\n",
        js: "const input = document.querySelector(\"#todo-input\");\nconst list = document.querySelector(\"#todo-list\");\nconst status = document.querySelector(\"#status\");\n\nfunction addTodo(text) {\n  const li = document.createElement(\"li\");\n\n  const span = document.createElement(\"span\");\n  span.className = \"todo-text\";\n  span.textContent = text;\n\n  const del = document.createElement(\"div\");\n  del.className = \"delete-btn\";\n  del.textContent = \"🗑\";\n  del.addEventListener(\"click\", () => {\n    li.remove();\n    status.textContent = `Deleted \"${text}\"`;\n  });\n\n  li.append(span, del);\n  list.append(li);\n  status.textContent = `Added \"${text}\"`;\n}\n\ndocument.querySelector(\".add-btn\").addEventListener(\"click\", () => {\n  const text = input.value.trim();\n  if (!text) return;\n  addTodo(text);\n  input.value = \"\";\n});\n\naddTodo(\"Buy milk\");\naddTodo(\"Learn accessibility\");\n",
      },
      solution: {
        html: "<main class=\"app\">\n  <h1 class=\"title\">My To-dos</h1>\n\n  <form class=\"row\" id=\"todo-form\">\n    <label for=\"todo-input\" class=\"visually-hidden\">New task</label>\n    <input id=\"todo-input\" type=\"text\" placeholder=\"e.g. Water the plants\">\n    <button type=\"submit\" class=\"add-btn\">Add</button>\n  </form>\n\n  <ul id=\"todo-list\"></ul>\n  <p id=\"status\" class=\"hint\" aria-live=\"polite\"></p>\n</main>\n",
        css: "body {\n  font-family: sans-serif;\n  background: #f0f2f8;\n}\n\n.app {\n  max-width: 400px;\n  margin: 0 auto;\n  background: white;\n  padding: 20px;\n  border-radius: 16px;\n}\n\n.title {\n  font-size: 28px;\n  margin: 0;\n}\n\n.row {\n  display: flex;\n  gap: 8px;\n  margin: 12px 0;\n}\n\n#todo-input {\n  flex: 1;\n  padding: 10px;\n  font-size: 16px;\n}\n\n.add-btn, .delete-btn {\n  cursor: pointer;\n  padding: 8px 12px;\n  background: #6a4cf0;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n}\n\n.delete-btn {\n  background: #c53b3b;\n}\n\n#todo-list {\n  list-style: none;\n  padding: 0;\n}\n\n#todo-list li {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 0;\n}\n\n.hint {\n  color: #555;\n}\n\n:focus-visible {\n  outline: 3px solid #6a4cf0;\n  outline-offset: 2px;\n}\n\n.visually-hidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n}\n",
        js: "const form = document.querySelector(\"#todo-form\");\nconst input = document.querySelector(\"#todo-input\");\nconst list = document.querySelector(\"#todo-list\");\nconst status = document.querySelector(\"#status\");\n\nfunction addTodo(text) {\n  const li = document.createElement(\"li\");\n\n  const span = document.createElement(\"span\");\n  span.className = \"todo-text\";\n  span.textContent = text;\n\n  const del = document.createElement(\"button\");\n  del.type = \"button\";\n  del.className = \"delete-btn\";\n  del.textContent = \"🗑\";\n  del.setAttribute(\"aria-label\", `Delete ${text}`);\n  del.addEventListener(\"click\", () => {\n    li.remove();\n    status.textContent = `Deleted \"${text}\"`;\n    input.focus();\n  });\n\n  li.append(span, del);\n  list.append(li);\n  status.textContent = `Added \"${text}\"`;\n}\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const text = input.value.trim();\n  if (!text) return;\n  addTodo(text);\n  input.value = \"\";\n});\n\naddTodo(\"Buy milk\");\naddTodo(\"Learn accessibility\");\n",
      },
      check: ({ $, $$, code }) => {
        if (!$('main')) return 'Wrap the app in a `<main>` element.';
        if (!$('h1')) return 'Use an `<h1>` for the title.';
        const input = $('#todo-input');
        if (!input.labels || !input.labels.length) return 'Link a `<label>` to `#todo-input`.';
        if (!$('button.add-btn')) return 'The add control should be a `<button>`.';
        if (!$('form #todo-input')) return 'Wrap the input and button in a `<form>`.';
        const dels = $$('.delete-btn');
        if (!dels.length) return 'There should be some todos with delete buttons.';
        if (dels.some((d) => d.tagName !== 'BUTTON')) return 'The delete controls should be `<button>` elements.';
        if (dels.some((d) => !(d.getAttribute('aria-label') || '').toLowerCase().includes('delete'))) return 'Give every delete button an `aria-label` like "Delete Buy milk".';
        if (/outline\s*:\s*(none|0)\b/.test(code.css)) return 'Remove the `outline: none` rule.';
        if (!/:focus-visible/.test(code.css)) return 'Add a visible `:focus-visible` style.';
        if (getComputedStyle($('#status')).color === 'rgb(200, 200, 200)') return 'The `#status` text is still low-contrast light grey.';
        return $('#status').getAttribute('aria-live') === 'polite' || 'Add `aria-live="polite"` to `#status`.';
      },
      success: "You turned an inaccessible app into one that works for everyone. ♿🎉",
    },
    {
      type: 'explain',
      title: 'Module 6 complete',
      body: [
        "You now build things that work for everyone:",
        "- Landmarks (`header`, `nav`, `main`, `footer`), articles, figures and tables",
        "- Real buttons for actions, links for navigation",
        "- Meaningful alt text and labelled form controls",
        "- Visible focus, keyboard support and sufficient contrast",
        "- ARIA where it helps: `aria-label`, `aria-live`, `aria-expanded`",
        "> From now on, keep doing the 2-minute keyboard test on everything you build. It's a habit that sets great developers apart.",
        "Next up is **Module 7: Synchronous & Asynchronous JavaScript**: timers, promises, and loading real data from the internet.",
      ],
    },
  ],
});
