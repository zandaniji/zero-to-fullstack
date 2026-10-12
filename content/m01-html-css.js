/* Module 1 — HTML & CSS Basics */
Course.addContent('m01', {

  /* ---------------------------------------------------------------- */
  'web-and-first-page': [
    {
      type: 'explain',
      title: 'What happens when you open a website?',
      body: [
        "When you type an address into your browser, it asks a computer somewhere (a **server**) for that page. The server sends back some files, and your browser turns them into what you see.",
        "Almost every website is built from three languages that work together:",
        "- **HTML** gives the page its structure and content: headings, text, images, buttons.",
        "- **CSS** controls how it looks: colors, fonts, spacing and layout.",
        "- **JavaScript** makes it interactive: reacting to clicks, loading data, updating the page.",
        "> Think of a house: HTML is the walls and rooms, CSS is the paint and furniture, and JavaScript is the electricity that makes things work.",
      ],
    },
    {
      type: 'explain',
      title: 'HTML is made of elements',
      body: [
        "HTML describes content using **tags**. Most tags come in pairs: an opening tag like `<p>` and a closing tag like `</p>`, which has a slash.",
        { code: `<p>Hello there!</p>`, lang: 'html' },
        "The opening tag, the content and the closing tag together make an **element**. Here `p` stands for *paragraph*.",
        "The browser never shows the tags themselves, only the content inside them. The tags tell it *what kind* of content it is.",
      ],
    },
    {
      type: 'try',
      title: 'Write your first element',
      body: ["Time to write some HTML! The editor is on the left and the preview on the right updates as you type."],
      goal: "Add an `<h1>` heading that says **Hello, World!**",
      hint: "Type `<h1>`, then the text, then the closing tag `</h1>`.",
      starter: { html: "<!-- Write your h1 on the line below -->\n" },
      solution: { html: "<!-- Write your h1 on the line below -->\n<h1>Hello, World!</h1>\n" },
      check: ({ $, norm }) => {
        const h = $('h1');
        if (!h) return 'There is no `<h1>` element yet.';
        if (!norm(h.textContent).includes('hello, world')) return 'Your `<h1>` should say "Hello, World!"';
        return true;
      },
      success: "You just wrote your first line of HTML.",
    },
    {
      type: 'explain',
      title: 'Headings and paragraphs',
      body: [
        "HTML has six heading levels, from `<h1>` (most important) down to `<h6>` (least important). Use them like the outline of a document, not just to make text big.",
        { code: `<h1>My Travel Blog</h1>\n<h2>Trip to Japan</h2>\n<p>We started our trip in Tokyo...</p>\n<h2>Trip to Peru</h2>\n<p>Machu Picchu was amazing.</p>`, lang: 'html' },
        "A page usually has **one** `<h1>` for its main title. Sections get `<h2>`, sub-sections `<h3>` and so on.",
        "Paragraphs of text go in `<p>` elements. The browser adds some space between paragraphs automatically.",
      ],
    },
    {
      type: 'try',
      title: 'Build a mini page',
      body: ["Let's add a section to the page."],
      goal: ["Below the `<h1>`, add:", "- an `<h2>` that says **About me**", "- a `<p>` with a sentence about yourself"],
      hint: "Each element needs its own opening and closing tag, e.g. `<h2>About me</h2>`.",
      starter: { html: "<h1>Welcome to my page</h1>\n" },
      solution: { html: "<h1>Welcome to my page</h1>\n<h2>About me</h2>\n<p>I'm learning to code so I can build my own apps.</p>\n" },
      check: ({ $, norm }) => {
        const h2 = $('h2');
        if (!h2) return 'Add an `<h2>` element.';
        if (!norm(h2.textContent).includes('about me')) return 'Your `<h2>` should say "About me".';
        const p = $('p');
        if (!p || !p.textContent.trim()) return 'Add a `<p>` paragraph with some text in it.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'The page skeleton',
      body: [
        "A complete HTML file has a standard structure that wraps around your content:",
        { code: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>My first page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>`, lang: 'html' },
        "- `<!DOCTYPE html>` tells the browser this is a modern HTML page.",
        "- `<html>` wraps everything. `lang=\"en\"` says the page is in English.",
        "- `<head>` holds information *about* the page, like its `<title>` (shown in the browser tab).",
        "- `<body>` holds everything you actually see.",
        "> In this course's editor you only write what goes inside `<body>`. The editor adds the rest for you. When you build a real site on your computer, you'll write the full skeleton.",
      ],
    },
    {
      type: 'explain',
      title: 'Nesting, indentation and comments',
      body: [
        "Elements can go inside other elements. This is called **nesting**. The inner element must be closed *before* the outer one:",
        { code: `<!-- ✅ Correct: strong closes before p -->\n<p>This is <strong>important</strong> text.</p>\n\n<!-- ❌ Wrong: the tags overlap -->\n<p>This is <strong>important</p></strong>`, lang: 'html' },
        "We indent nested elements to make the structure easy to read. The browser doesn't care about the spaces, but humans do.",
        "Text between `<!--` and `-->` is a **comment**. The browser ignores it, so it's handy for notes to yourself.",
      ],
    },
    {
      type: 'try',
      title: 'Fix the broken nesting',
      body: ["Browsers try to guess what you meant when tags overlap, but you shouldn't rely on that."],
      goal: "Fix the code so `<strong>` is closed **before** `</p>`.",
      hint: "The closing tags should be in the reverse order of the opening tags: `</strong></p>`.",
      starter: { html: "<p>Always close your tags in the <strong>right order</p></strong>\n" },
      solution: { html: "<p>Always close your tags in the <strong>right order</strong></p>\n" },
      check: ({ code }) => {
        const c = code.html.replace(/\s+/g, '');
        if (c.includes('</p></strong>')) return 'The tags still overlap: `</p>` comes before `</strong>`.';
        if (!c.includes('</strong></p>')) return 'Make sure the paragraph ends with `</strong></p>`.';
        return true;
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'text-links-images': [
    {
      type: 'explain',
      title: 'Making text stand out',
      body: [
        "Inside a paragraph you can mark up words that matter:",
        { code: `<p>Please <strong>do not</strong> touch the wet paint.</p>\n<p>I <em>really</em> love pizza.</p>\n<p>Line one<br>Line two</p>`, lang: 'html' },
        "- `<strong>` marks text as **important** (shown in bold).",
        "- `<em>` adds *emphasis*, like stressing a word when you speak (shown in italics).",
        "- `<br>` forces a line break. It has no closing tag because it has no content.",
        "> Screen readers announce `<strong>` and `<em>` differently, so they carry meaning, not just looks.",
      ],
    },
    {
      type: 'try',
      title: 'Bold and italic',
      body: ["Let's practise inline elements."],
      goal: "Wrap the word **fun** in `<strong>` and the word **useful** in `<em>`.",
      hint: "Put the tags right around the word: `<strong>fun</strong>`.",
      starter: { html: "<p>Learning to code is fun and useful.</p>\n" },
      solution: { html: "<p>Learning to code is <strong>fun</strong> and <em>useful</em>.</p>\n" },
      check: ({ $, norm }) => {
        const s = $('strong'), e = $('em');
        if (!s || norm(s.textContent) !== 'fun') return 'Wrap exactly the word "fun" in `<strong>`.';
        if (!e || norm(e.textContent) !== 'useful') return 'Wrap exactly the word "useful" in `<em>`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Links',
      body: [
        "Links are made with the `<a>` (anchor) element. The `href` **attribute** says where the link goes:",
        { code: `<a href="https://www.wikipedia.org">Visit Wikipedia</a>`, lang: 'html' },
        "**Attributes** give extra information to an element. They go inside the opening tag and look like `name=\"value\"`.",
        "To open a link in a new tab, add `target=\"_blank\"`:",
        { code: `<a href="https://www.wikipedia.org" target="_blank">Wikipedia (new tab)</a>`, lang: 'html' },
        "Links can also go to other pages on your own site: `<a href=\"about.html\">About</a>`.",
      ],
    },
    {
      type: 'try',
      title: 'Add a link',
      body: ["MDN Web Docs is the best reference for HTML, CSS and JavaScript. Bookmark it!"],
      goal: "Add a link to `https://developer.mozilla.org` with the text **MDN Web Docs**.",
      hint: "`<a href=\"...\">text</a>`. Put the address inside the quotes.",
      starter: { html: "<p>My favourite place to look things up:</p>\n" },
      solution: { html: "<p>My favourite place to look things up:</p>\n<a href=\"https://developer.mozilla.org\" target=\"_blank\">MDN Web Docs</a>\n" },
      check: ({ $, norm }) => {
        const a = $('a[href*="developer.mozilla.org"]');
        if (!a) return 'No link with `href="https://developer.mozilla.org"` found.';
        if (!norm(a.textContent).includes('mdn')) return 'The link text should say "MDN Web Docs".';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Images',
      body: [
        "Images use the `<img>` element. Like `<br>`, it has no closing tag.",
        { code: `<img src="https://picsum.photos/id/237/300/200" alt="A black puppy looking up" width="300">`, lang: 'html' },
        "- `src` is the image's address (a URL or a file path like `images/dog.jpg`).",
        "- `alt` describes the image. Screen readers read it out, and it shows if the image fails to load.",
        "- `width` (and `height`) set its size in pixels.",
        "> Always write `alt` text. Describe what the image shows, as if telling someone over the phone.",
      ],
    },
    {
      type: 'try',
      title: 'Add an image',
      body: ["The preview needs an internet connection to load this image. If you're offline you'll see the alt text instead."],
      goal: "Add an `<img>` with `src=\"https://picsum.photos/id/1025/300/200\"` and a helpful `alt` description (it's a dog wrapped in a blanket).",
      hint: "`<img src=\"...\" alt=\"...\">`. No closing tag needed.",
      starter: { html: "<h2>My favourite animal</h2>\n" },
      solution: { html: "<h2>My favourite animal</h2>\n<img src=\"https://picsum.photos/id/1025/300/200\" alt=\"A pug wrapped in a blanket\">\n" },
      check: ({ $ }) => {
        const img = $('img');
        if (!img) return 'Add an `<img>` element.';
        if (!img.getAttribute('src')) return 'Your image needs a `src` attribute.';
        if (!img.getAttribute('alt') || img.getAttribute('alt').trim().length < 3) return 'Add an `alt` attribute that describes the image.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Lists',
      body: [
        "There are two main kinds of lists. Each item goes in an `<li>` (list item).",
        { code: `<!-- Unordered list: bullet points -->\n<ul>\n  <li>Milk</li>\n  <li>Eggs</li>\n</ul>\n\n<!-- Ordered list: numbered steps -->\n<ol>\n  <li>Crack the eggs</li>\n  <li>Whisk them</li>\n</ol>`, lang: 'html' },
        "Use `<ul>` when order doesn't matter and `<ol>` when it does, like steps in a recipe.",
      ],
    },
    {
      type: 'try',
      title: 'Make a list',
      body: ["Lists are everywhere: navigation menus, shopping carts, to-do apps…"],
      goal: ["Create an unordered list (`<ul>`) with **at least 3** of your hobbies."],
      hint: "Start with `<ul>`, put each hobby in its own `<li>…</li>`, then close with `</ul>`.",
      starter: { html: "<h2>My hobbies</h2>\n" },
      solution: { html: "<h2>My hobbies</h2>\n<ul>\n  <li>Cooking</li>\n  <li>Hiking</li>\n  <li>Video games</li>\n</ul>\n" },
      check: ({ $$ }) => {
        const items = $$('ul > li');
        if (!items.length) return 'Add a `<ul>` with `<li>` items inside.';
        if (items.length < 3) return `You have ${items.length} item(s). Add at least 3.`;
        if (items.some((li) => !li.textContent.trim())) return 'One of your list items is empty.';
        return true;
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'css-basics': [
    {
      type: 'explain',
      title: 'What CSS looks like',
      body: [
        "CSS is a list of **rules**. Each rule picks some elements and says how they should look:",
        { code: `h1 {\n  color: purple;\n  font-size: 40px;\n}`, lang: 'css' },
        "- `h1` is the **selector**: which elements to style.",
        "- `color` and `font-size` are **properties**: what to change.",
        "- `purple` and `40px` are **values**.",
        "Each property–value pair ends with a semicolon `;`, and the whole rule is wrapped in curly braces `{ }`.",
        "> On a real website your CSS lives in a separate file (like `style.css`) that's linked from the HTML `<head>` with `<link rel=\"stylesheet\" href=\"style.css\">`. In the editor, just use the **CSS** tab.",
      ],
    },
    {
      type: 'try',
      title: 'Your first CSS rule',
      body: ["Switch to the **CSS** tab in the editor to write your rule."],
      goal: "Make the `h1` text color `tomato`.",
      hint: "In the CSS tab: `h1 { color: tomato; }`",
      starter: { html: "<h1>My Website</h1>\n<p>Welcome to my corner of the internet.</p>\n", css: "/* Write your CSS here */\n" },
      solution: { html: "<h1>My Website</h1>\n<p>Welcome to my corner of the internet.</p>\n", css: "h1 {\n  color: tomato;\n}\n" },
      check: ({ css }) => css('h1', 'color') === 'rgb(255, 99, 71)' || 'The `h1` isn\'t tomato-colored yet. Check your selector and spelling.',
    },
    {
      type: 'explain',
      title: 'Classes and IDs',
      body: [
        "Styling every `<p>` the same way is limiting. **Classes** let you style specific elements:",
        { code: `<p class="note">Remember to save your work!</p>\n<p>A normal paragraph.</p>\n<h1 id="main-title">Dashboard</h1>`, lang: 'html' },
        { code: `.note {\n  background-color: lightyellow;\n}\n\n#main-title {\n  color: navy;\n}`, lang: 'css' },
        "- A class selector starts with a dot: `.note`. Many elements can share a class.",
        "- An ID selector starts with `#`: `#main-title`. An ID must be **unique** on the page.",
        "- An element can have several classes: `class=\"note important\"`.",
        "> Prefer classes for styling. IDs are better kept for links and JavaScript.",
      ],
    },
    {
      type: 'try',
      title: 'Style with a class',
      body: ["Two of these paragraphs have `class=\"note\"`."],
      goal: "Give only the `.note` paragraphs a `background-color` of `yellow`.",
      hint: "Use a class selector, which starts with a dot: `.note { ... }`",
      starter: {
        html: "<p class=\"note\">Tip: drink water.</p>\n<p>This is a regular paragraph.</p>\n<p class=\"note\">Tip: take breaks.</p>\n",
        css: "/* Style the notes */\n",
      },
      solution: {
        html: "<p class=\"note\">Tip: drink water.</p>\n<p>This is a regular paragraph.</p>\n<p class=\"note\">Tip: take breaks.</p>\n",
        css: ".note {\n  background-color: yellow;\n}\n",
      },
      check: ({ $$ }) => {
        const yellow = (el) => getComputedStyle(el).backgroundColor === 'rgb(255, 255, 0)';
        if (!$$('.note').every(yellow)) return 'The `.note` paragraphs don\'t have a yellow background yet.';
        if ($$('p:not(.note)').some(yellow)) return 'The regular paragraph turned yellow too. Use the `.note` class selector instead of `p`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Colors in CSS',
      body: [
        "There are several ways to write a color:",
        { code: `p {\n  color: crimson;                 /* named color (140+ of them) */\n  color: #6a4cf0;                 /* hex: red, green, blue */\n  color: rgb(106, 76, 240);       /* rgb: each 0–255 */\n  color: rgb(106 76 240 / 50%);   /* with transparency */\n  color: hsl(252, 85%, 62%);      /* hue, saturation, lightness */\n}`, lang: 'css' },
        "When the same property appears twice, the last one wins, so this paragraph ends up `hsl(...)`.",
        "- `color` changes the **text** color.",
        "- `background-color` changes the **background**.",
        "> Hex colors are the most common in real projects. Tools like your browser's DevTools have a color picker to find them.",
      ],
    },
    {
      type: 'explain',
      title: 'Styling text',
      body: [
        "Here are the text properties you'll use all the time:",
        { code: `body {\n  font-family: Arial, Helvetica, sans-serif;\n  line-height: 1.5;\n}\n\nh1 {\n  font-size: 36px;\n  font-weight: bold;\n  text-align: center;\n}\n\na {\n  text-decoration: none;  /* removes the underline */\n}`, lang: 'css' },
        "- `font-family` takes a list. If the first font isn't installed, the browser tries the next. Always end with a generic family like `sans-serif` or `serif`.",
        "- `font-size` is often in `px` or `rem` (relative to the page's base size).",
        "- `font-weight` can be `normal`, `bold`, or a number like `400` or `700`.",
        "- `text-align` can be `left`, `center`, `right` or `justify`.",
        "- `line-height` sets the space between lines. `1.5` means 1.5× the font size.",
      ],
    },
    {
      type: 'try',
      title: 'Typography makeover',
      body: ["The default fonts look a bit old-fashioned. Let's fix that."],
      goal: [
        "- Give `body` a `font-family` that ends with `sans-serif`",
        "- Center the `h1` with `text-align`",
        "- Make the `p` text `18px`",
      ],
      hint: "You need three rules: `body { ... }`, `h1 { ... }` and `p { ... }`.",
      starter: {
        html: "<h1>The Daily Bug</h1>\n<p>Local developer finally fixes the bug that has haunted them for weeks. \"It was a missing semicolon,\" they said.</p>\n",
        css: "",
      },
      solution: {
        html: "<h1>The Daily Bug</h1>\n<p>Local developer finally fixes the bug that has haunted them for weeks. \"It was a missing semicolon,\" they said.</p>\n",
        css: "body {\n  font-family: Arial, Helvetica, sans-serif;\n}\n\nh1 {\n  text-align: center;\n}\n\np {\n  font-size: 18px;\n}\n",
      },
      check: ({ css }) => {
        if (!/sans-serif\s*$/.test(css('body', 'font-family'))) return 'The `body` font-family should end with `sans-serif`.';
        if (css('h1', 'text-align') !== 'center') return 'The `h1` isn\'t centered yet.';
        if (css('p', 'font-size') !== '18px') return 'The `p` font-size should be `18px`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'The cascade: which rule wins?',
      body: [
        "CSS stands for *Cascading* Style Sheets. When two rules style the same element, the browser picks a winner:",
        "1. **More specific selectors win**: an ID beats a class, and a class beats an element.",
        "2. **If they're equally specific, the later rule wins.**",
        { code: `p { color: gray; }        /* element: least specific */\n.intro { color: green; }  /* class: wins over p */\n#hero { color: red; }     /* id: wins over .intro */`, lang: 'css' },
        { code: `<p class="intro" id="hero">What color am I?</p>`, lang: 'html' },
        "This paragraph is red. Remove the `#hero` rule and it becomes green.",
        "Some properties also **inherit**: if you set `font-family` or `color` on `body`, the elements inside it use it too. That's why styling `body` is a great place to start.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'box-model': [
    {
      type: 'explain',
      title: 'Every element is a box',
      body: [
        "To the browser, every element is a rectangle made of four layers:",
        { code: `┌──────────── margin ────────────┐\n│  ┌───────── border ─────────┐  │\n│  │  ┌───── padding ──────┐  │  │\n│  │  │                    │  │  │\n│  │  │      content       │  │  │\n│  │  │                    │  │  │\n│  │  └────────────────────┘  │  │\n│  └──────────────────────────┘  │\n└────────────────────────────────┘`, lang: 'text' },
        "- **Content**: the text or image itself.",
        "- **Padding**: space *inside* the border, around the content.",
        "- **Border**: a line around the padding.",
        "- **Margin**: space *outside* the border, pushing other elements away.",
        "> Right-click any element on a website and choose **Inspect**. DevTools shows this exact box diagram for it.",
      ],
    },
    {
      type: 'try',
      title: 'Build a card',
      body: ["Cards are boxes with padding, a border and some margin. You'll see them on almost every website."],
      goal: [
        "Style `.card` with:",
        "- `padding: 20px`",
        "- `border: 2px solid #6a4cf0`",
        "- `margin: 16px`",
      ],
      hint: "The border shorthand takes width, style and color: `border: 2px solid #6a4cf0;`",
      starter: {
        html: "<div class=\"card\">\n  <h2>Card title</h2>\n  <p>Cards group related content together.</p>\n</div>\n",
        css: ".card {\n  background-color: #f4f1ff;\n}\n",
      },
      solution: {
        html: "<div class=\"card\">\n  <h2>Card title</h2>\n  <p>Cards group related content together.</p>\n</div>\n",
        css: ".card {\n  background-color: #f4f1ff;\n  padding: 20px;\n  border: 2px solid #6a4cf0;\n  margin: 16px;\n}\n",
      },
      check: ({ css }) => {
        if (css('.card', 'padding-top') !== '20px') return 'The card needs `padding: 20px`.';
        if (css('.card', 'border-top-width') !== '2px' || css('.card', 'border-top-style') !== 'solid') return 'The card needs a `2px solid` border.';
        if (css('.card', 'margin-top') !== '16px') return 'The card needs `margin: 16px`.';
        return true;
      },
      success: "That's a real card component. Notice `<div>`: a generic box with no special meaning, used for grouping and styling.",
    },
    {
      type: 'explain',
      title: 'Shorthand for each side',
      body: [
        "`padding` and `margin` can take 1 to 4 values. They go clockwise, starting from the top:",
        { code: `.box {\n  padding: 10px;                /* all four sides */\n  padding: 10px 20px;           /* top+bottom  left+right */\n  padding: 10px 20px 30px 40px; /* top right bottom left */\n\n  margin-top: 24px;             /* or set one side only */\n}`, lang: 'css' },
        "> To remember the 4-value order, think **TRouBLe**: Top, Right, Bottom, Left.",
      ],
    },
    {
      type: 'explain',
      title: 'box-sizing: border-box',
      body: [
        "By default, `width` only sets the *content* size. Padding and border are added on top, so a `200px` wide box with `20px` padding is actually `240px` wide. That's confusing!",
        "Almost every developer adds this at the top of their CSS:",
        { code: `* {\n  box-sizing: border-box;\n}`, lang: 'css' },
        "`*` is the **universal selector**: it matches every element. With `border-box`, `width: 200px` means the whole box, including padding and border, is 200px. Much easier.",
      ],
    },
    {
      type: 'explain',
      title: 'Width and centering',
      body: [
        "You can control an element's size with `width`, and limit it with `max-width`:",
        { code: `.container {\n  max-width: 600px;   /* never wider than 600px */\n  margin: 0 auto;     /* center it horizontally */\n}`, lang: 'css' },
        "`margin: 0 auto` means 0 on top and bottom, and **auto** on left and right. Auto margins split the leftover space equally, which centers the box.",
        "`max-width` is better than `width` here: on a small phone screen the box can shrink, but on a big screen it stops at 600px.",
      ],
    },
    {
      type: 'try',
      title: 'Center a container',
      body: ["Readable websites keep their text from stretching across huge screens."],
      goal: "Give `.container` a `max-width` of `400px` and center it with `margin: 0 auto`.",
      hint: "`.container { max-width: 400px; margin: 0 auto; }`",
      starter: {
        html: "<div class=\"container\">\n  <h1>Centered!</h1>\n  <p>This container should sit in the middle of the page, no matter how wide the window is.</p>\n</div>\n",
        css: ".container {\n  background-color: #e2f6ea;\n  padding: 16px;\n}\n",
      },
      solution: {
        html: "<div class=\"container\">\n  <h1>Centered!</h1>\n  <p>This container should sit in the middle of the page, no matter how wide the window is.</p>\n</div>\n",
        css: ".container {\n  background-color: #e2f6ea;\n  padding: 16px;\n  max-width: 400px;\n  margin: 0 auto;\n}\n",
      },
      check: ({ css, code }) => {
        if (css('.container', 'max-width') !== '400px') return 'Set `max-width: 400px` on `.container`.';
        if (!/margin\s*:[^;]*auto/.test(code.css) && !/margin-(left|right)\s*:\s*auto/.test(code.css)) return 'Use `margin: 0 auto` to center it.';
        if (css('.container', 'margin-left') !== css('.container', 'margin-right')) return 'The left and right margins should be equal.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Rounded corners, block and inline',
      body: [
        "`border-radius` rounds the corners of a box. `50%` on a square makes a circle:",
        { code: `.button { border-radius: 8px; }\n.avatar { border-radius: 50%; }`, lang: 'css' },
        "Elements also come in two main flavours:",
        "- **Block** elements (`<div>`, `<p>`, `<h1>`, `<ul>`) start on a new line and stretch to full width.",
        "- **Inline** elements (`<a>`, `<strong>`, `<em>`, `<img>`) sit inside a line of text, only as wide as their content.",
        "You can change this with `display: block`, `display: inline` or `display: inline-block`. You'll learn much more about `display` in the Layout module.",
      ],
    },
    {
      type: 'try',
      title: 'Turn a link into a button',
      body: ["Lots of \"buttons\" on websites are actually links styled to look like buttons."],
      goal: [
        "Style `.button` with:",
        "- `padding: 12px 24px`",
        "- `border-radius: 8px`",
        "- `text-decoration: none` (removes the underline)",
        "- white text on a colored background of your choice",
      ],
      hint: "Use `color: white;` for the text and `background-color` for the button color.",
      starter: {
        html: "<p>Ready to start?</p>\n<a class=\"button\" href=\"#\">Sign up</a>\n",
        css: ".button {\n  display: inline-block;\n}\n",
      },
      solution: {
        html: "<p>Ready to start?</p>\n<a class=\"button\" href=\"#\">Sign up</a>\n",
        css: ".button {\n  display: inline-block;\n  padding: 12px 24px;\n  border-radius: 8px;\n  text-decoration: none;\n  color: white;\n  background-color: #6a4cf0;\n  font-weight: bold;\n}\n",
      },
      check: ({ css }) => {
        if (css('.button', 'padding-left') !== '24px' || css('.button', 'padding-top') !== '12px') return 'Use `padding: 12px 24px`.';
        if (css('.button', 'border-top-left-radius') !== '8px') return 'Add `border-radius: 8px`.';
        if (!css('.button', 'text-decoration-line').startsWith('none')) return 'Remove the underline with `text-decoration: none`.';
        if (css('.button', 'color') !== 'rgb(255, 255, 255)') return 'Make the text `white`.';
        const bg = css('.button', 'background-color');
        if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') return 'Give the button a `background-color`.';
        return true;
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-profile-card': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "Time to put Module 1 together! You'll build a **profile card**: the kind of thing you see on social sites and portfolios.",
        "It uses everything so far: headings, paragraphs, images, lists, links, classes, colors, fonts, the box model and centering.",
        "There's no single right answer. Make it yours: your name, your colors, your hobbies.",
        "> Work through the checklist on the next step. Tick items off as you go; your progress is saved.",
      ],
    },
    {
      type: 'project',
      title: 'Profile card',
      body: ["The starter gives you a bare structure. Fill it in and style it until it looks like something you'd be proud to share."],
      tasks: [
        "Wrap everything in a `<div class=\"card\">`",
        "Add an avatar `<img>` with good `alt` text and make it round with `border-radius: 50%`",
        "Put your name in an `<h1>` and a short bio in a `<p>`",
        "Add a `<ul>` with at least 3 hobbies or skills",
        "Add a link styled to look like a button",
        "Give the card padding, a border or background, rounded corners, and center it with `max-width` + `margin: 0 auto`",
        "Set a nice `font-family` on `body`",
      ],
      hint: [
        ["Start with the HTML. Get all the content in first, then switch to CSS."],
        ["To center the text inside the card, add `text-align: center` to `.card`."],
        ["A soft shadow looks great on cards: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`"],
      ],
      starter: {
        html: "<div class=\"card\">\n  <!-- avatar image -->\n\n  <!-- your name and bio -->\n\n  <!-- list of hobbies -->\n\n  <!-- a button-style link -->\n\n</div>\n",
        css: "* {\n  box-sizing: border-box;\n}\n\nbody {\n  background-color: #f0f2f8;\n}\n\n.card {\n\n}\n",
      },
      solution: {
        html: "<div class=\"card\">\n  <img class=\"avatar\" src=\"https://picsum.photos/id/64/160/160\" alt=\"Portrait of Alex smiling\">\n\n  <h1>Alex Rivera</h1>\n  <p class=\"bio\">Aspiring web developer. I like turning ideas into things people can click on.</p>\n\n  <ul class=\"skills\">\n    <li>HTML &amp; CSS</li>\n    <li>Photography</li>\n    <li>Rock climbing</li>\n  </ul>\n\n  <a class=\"button\" href=\"mailto:alex@example.com\">Say hello</a>\n</div>\n",
        css: "* {\n  box-sizing: border-box;\n}\n\nbody {\n  background-color: #f0f2f8;\n  font-family: \"Segoe UI\", Arial, sans-serif;\n  padding: 24px 12px;\n}\n\n.card {\n  max-width: 340px;\n  margin: 0 auto;\n  padding: 28px 24px;\n  background-color: white;\n  border-radius: 16px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n  text-align: center;\n}\n\n.avatar {\n  width: 120px;\n  height: 120px;\n  border-radius: 50%;\n  border: 4px solid #ece7ff;\n}\n\nh1 {\n  margin: 12px 0 4px;\n  color: #1a1c2b;\n}\n\n.bio {\n  color: #5d6279;\n  line-height: 1.5;\n}\n\n.skills {\n  list-style: none;\n  padding: 0;\n  margin: 16px 0 24px;\n}\n\n.skills li {\n  display: inline-block;\n  background-color: #ece7ff;\n  color: #6a4cf0;\n  padding: 4px 12px;\n  margin: 4px 2px;\n  border-radius: 99px;\n  font-size: 14px;\n}\n\n.button {\n  display: inline-block;\n  padding: 12px 28px;\n  background-color: #6a4cf0;\n  color: white;\n  text-decoration: none;\n  border-radius: 10px;\n  font-weight: bold;\n}\n",
      },
      check: ({ $, $$, css }) => {
        if (!$('.card')) return 'Wrap everything in `<div class="card">`.';
        const img = $('.card img');
        if (!img) return 'Add an avatar `<img>` inside the card.';
        if (!img.getAttribute('alt') || !img.getAttribute('alt').trim()) return 'Your avatar needs `alt` text.';
        if (getComputedStyle(img).borderTopLeftRadius !== '50%') return 'Make the avatar round with `border-radius: 50%`.';
        if (!$('.card h1')) return 'Add your name in an `<h1>`.';
        if (!$('.card p')) return 'Add a short bio in a `<p>`.';
        if ($$('.card ul li').length < 3) return 'Add a `<ul>` with at least 3 items.';
        if (!$('.card a')) return 'Add a link styled like a button.';
        if (css('.card', 'max-width') === 'none') return 'Give `.card` a `max-width` so it doesn\'t stretch too wide.';
        if (css('.card', 'margin-left') !== css('.card', 'margin-right')) return 'Center the card with `margin: 0 auto`.';
        return true;
      },
      success: "Your profile card is done! 🎉 Make sure to tick off the checklist too.",
    },
    {
      type: 'explain',
      title: 'Take it further: build it on your computer',
      body: [
        "Great work finishing Module 1! Want to see your card as a real web page? Try this:",
        "1. Create a new folder on your computer called `profile-card`.",
        "2. Inside it, create a file called `index.html` and paste in the full page skeleton (from chapter 1), with your card HTML inside `<body>`.",
        "3. Create a file called `style.css` and paste in your CSS.",
        "4. In the `<head>` of `index.html`, add `<link rel=\"stylesheet\" href=\"style.css\">`.",
        "5. Double-click `index.html` to open it in your browser.",
        "> A free code editor like **VS Code** makes this much nicer: it highlights your code, auto-closes tags and has a Live Server extension that refreshes the page as you save.",
        "Next up is **Module 2: Interactive JavaScript**, where your pages start to think.",
      ],
    },
  ],
});
