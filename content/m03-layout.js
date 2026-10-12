/* Module 3 — Layout: Flexbox & Grid */
Course.addContent('m03', {

  /* ---------------------------------------------------------------- */
  'display-position': [
    {
      type: 'explain',
      title: 'The display property',
      body: [
        "Every element has a `display` value that controls how it takes up space. You met two in Module 1:",
        "- `block`: starts on a new line and fills the full width (`div`, `p`, `h1`, `section`).",
        "- `inline`: flows inside text and ignores width/height (`a`, `span`, `strong`).",
        "Two more that you'll use constantly:",
        "- `inline-block`: sits in a line like inline, but respects width, height and vertical padding. Great for buttons and nav links.",
        "- `none`: removes the element from the page completely.",
        { code: `.nav a {\n  display: inline-block;\n  padding: 8px 12px;\n}\n\n.popup {\n  display: none;   /* hidden until JavaScript shows it */\n}`, lang: 'css' },
        "Later in this module you'll meet the two most powerful values: `flex` and `grid`.",
      ],
    },
    {
      type: 'try',
      title: 'Tidy up a nav bar',
      body: ["This nav has cramped links and an annoying ad."],
      goal: [
        "- Make the `nav a` links `display: inline-block` with `padding: 8px 12px`",
        "- Hide the `.ad` completely with `display: none`",
      ],
      hint: "Two rules: `nav a { ... }` and `.ad { ... }`",
      starter: {
        html: "<nav>\n  <a href=\"#\">Home</a>\n  <a href=\"#\">Blog</a>\n  <a href=\"#\">Contact</a>\n</nav>\n<div class=\"ad\">🔥 BUY NOW!!! 🔥</div>\n<p>Welcome to my site.</p>\n",
        css: "nav {\n  background-color: #1d1f2d;\n}\n\nnav a {\n  color: white;\n}\n\n.ad {\n  background-color: red;\n  color: yellow;\n  font-size: 32px;\n}\n",
      },
      solution: {
        html: "<nav>\n  <a href=\"#\">Home</a>\n  <a href=\"#\">Blog</a>\n  <a href=\"#\">Contact</a>\n</nav>\n<div class=\"ad\">🔥 BUY NOW!!! 🔥</div>\n<p>Welcome to my site.</p>\n",
        css: "nav {\n  background-color: #1d1f2d;\n}\n\nnav a {\n  color: white;\n  display: inline-block;\n  padding: 8px 12px;\n}\n\n.ad {\n  background-color: red;\n  color: yellow;\n  font-size: 32px;\n  display: none;\n}\n",
      },
      check: ({ css }) => {
        if (css('nav a', 'display') !== 'inline-block') return 'The nav links should be `display: inline-block`.';
        if (css('nav a', 'padding-top') !== '8px' || css('nav a', 'padding-left') !== '12px') return 'Give the links `padding: 8px 12px`.';
        if (css('.ad', 'display') !== 'none') return 'Hide the ad with `display: none`.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'position: relative',
      body: [
        "The `position` property lets you nudge or pin elements. The default is `static`, the normal flow of the page.",
        "`position: relative` lets you shift an element from where it *would* have been, using `top`, `right`, `bottom` and `left`:",
        { code: `.nudge {\n  position: relative;\n  top: 10px;    /* moves it 10px DOWN */\n  left: 20px;   /* moves it 20px RIGHT */\n}`, lang: 'css' },
        "The space it originally took up stays reserved, so other elements don't move.",
        "> On its own, `relative` is rarely used for nudging. Its real superpower is being an **anchor** for absolutely positioned children. That's next.",
      ],
    },
    {
      type: 'explain',
      title: 'position: absolute',
      body: [
        "`position: absolute` takes an element **out of the normal flow** and places it relative to its nearest *positioned* ancestor (one that has `position` set to anything but `static`).",
        { code: `<div class="card">\n  <span class="badge">NEW</span>\n  <h3>Wireless headphones</h3>\n</div>`, lang: 'html' },
        { code: `.card {\n  position: relative;   /* the anchor */\n}\n\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;           /* pinned to the card's top-right corner */\n}`, lang: 'css' },
        "This parent-relative / child-absolute pattern is everywhere: badges, close buttons, icons over images, dropdown menus.",
        "> If no ancestor is positioned, the absolute element anchors to the whole page, which is usually not what you want!",
      ],
    },
    {
      type: 'try',
      title: 'Add a corner badge',
      body: ["Let's pin a \"SALE\" badge to the corner of a product card."],
      goal: [
        "- Make `.card` the anchor with `position: relative`",
        "- Make `.badge` `position: absolute` with `top: 8px` and `right: 8px`",
      ],
      hint: "The parent gets `relative`; the child gets `absolute` plus `top` and `right`.",
      starter: {
        html: "<div class=\"card\">\n  <span class=\"badge\">SALE</span>\n  <h3>Cozy sweater</h3>\n  <p>$29.99</p>\n</div>\n",
        css: ".card {\n  width: 220px;\n  padding: 16px;\n  border: 1px solid #ccc;\n  border-radius: 12px;\n  font-family: sans-serif;\n}\n\n.badge {\n  background-color: crimson;\n  color: white;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 4px 8px;\n  border-radius: 6px;\n}\n",
      },
      solution: {
        html: "<div class=\"card\">\n  <span class=\"badge\">SALE</span>\n  <h3>Cozy sweater</h3>\n  <p>$29.99</p>\n</div>\n",
        css: ".card {\n  width: 220px;\n  padding: 16px;\n  border: 1px solid #ccc;\n  border-radius: 12px;\n  font-family: sans-serif;\n  position: relative;\n}\n\n.badge {\n  background-color: crimson;\n  color: white;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 4px 8px;\n  border-radius: 6px;\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}\n",
      },
      check: ({ css }) => {
        if (css('.card', 'position') !== 'relative') return 'Give `.card` `position: relative`.';
        if (css('.badge', 'position') !== 'absolute') return 'Give `.badge` `position: absolute`.';
        if (css('.badge', 'top') !== '8px' || css('.badge', 'right') !== '8px') return 'Set `top: 8px` and `right: 8px` on the badge.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'fixed, sticky and z-index',
      body: [
        "Two more positions for elements that stay put while you scroll:",
        "- `position: fixed`: pinned to the browser window. Think chat bubbles and \"back to top\" buttons.",
        "- `position: sticky`: scrolls normally until it hits an edge, then sticks. Perfect for headers.",
        { code: `header {\n  position: sticky;\n  top: 0;            /* stick when it reaches the top */\n  background: white;\n}\n\n.chat-button {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n}`, lang: 'css' },
        "When elements overlap, `z-index` decides which is on top. Higher numbers win, but it only works on positioned elements.",
        { code: `.modal { position: fixed; z-index: 100; }`, lang: 'css' },
      ],
    },
    {
      type: 'try',
      title: 'A sticky header',
      body: ["Scroll the preview: right now the header scrolls away."],
      goal: "Make the `header` stick to the top with `position: sticky` and `top: 0`.",
      hint: "`header { position: sticky; top: 0; }`",
      starter: {
        html: "<header>My Blog</header>\n<p>Scroll down…</p>\n<p style=\"height: 300px\">Lots of content here.</p>\n<p style=\"height: 300px\">Even more content.</p>\n<p>The end!</p>\n",
        css: "body {\n  margin: 0;\n  font-family: sans-serif;\n}\n\nheader {\n  background-color: #6a4cf0;\n  color: white;\n  padding: 12px 16px;\n  font-weight: bold;\n}\n\np {\n  padding: 0 16px;\n}\n",
      },
      solution: {
        html: "<header>My Blog</header>\n<p>Scroll down…</p>\n<p style=\"height: 300px\">Lots of content here.</p>\n<p style=\"height: 300px\">Even more content.</p>\n<p>The end!</p>\n",
        css: "body {\n  margin: 0;\n  font-family: sans-serif;\n}\n\nheader {\n  background-color: #6a4cf0;\n  color: white;\n  padding: 12px 16px;\n  font-weight: bold;\n  position: sticky;\n  top: 0;\n}\n\np {\n  padding: 0 16px;\n}\n",
      },
      check: ({ css }) => {
        if (css('header', 'position') !== 'sticky') return 'Give the header `position: sticky`.';
        return css('header', 'top') === '0px' || 'Add `top: 0` so it knows where to stick.';
      },
      success: "Scroll the preview and watch it stick.",
    },
    {
      type: 'explain',
      title: 'Units: px, %, rem, vw and vh',
      body: [
        "So far you've mostly used `px`. Here are the other units you'll see:",
        "- `%`: relative to the parent. `width: 50%` is half the parent's width.",
        "- `rem`: relative to the root font size (usually 16px). `2rem` = 32px. Great for font sizes and spacing.",
        "- `em`: relative to the element's own font size.",
        "- `vw` / `vh`: 1% of the viewport (browser window) width / height. `height: 100vh` fills the screen.",
        { code: `.hero {\n  min-height: 80vh;     /* most of the screen */\n  padding: 2rem;\n}\n\n.half {\n  width: 50%;\n}`, lang: 'css' },
        "> When something overflows its box, `overflow: auto` adds scrollbars and `overflow: hidden` clips it.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'flexbox': [
    {
      type: 'explain',
      title: 'Why Flexbox?',
      body: [
        "Lining things up in a row, spacing them evenly and centering them used to be painful in CSS. **Flexbox** makes it easy.",
        "Put `display: flex` on a **container**, and its direct children (the **flex items**) line up in a row:",
        { code: `<div class="row">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>`, lang: 'html' },
        { code: `.row {\n  display: flex;\n}`, lang: 'css' },
        "Flexbox works along two axes:",
        "- the **main axis**: the direction items flow (left → right by default)",
        "- the **cross axis**: perpendicular to it (top → bottom by default)",
        "> 🎮 Want extra practice? [Flexbox Froggy](https://flexboxfroggy.com) is a fun free game for learning these properties.",
      ],
    },
    {
      type: 'try',
      title: 'Your first flex container',
      body: ["These three boxes are stacked because `div`s are block elements."],
      goal: "Make `.row` a flex container so the boxes sit side by side.",
      hint: "`.row { display: flex; }`",
      starter: {
        html: "<div class=\"row\">\n  <div class=\"box\">1</div>\n  <div class=\"box\">2</div>\n  <div class=\"box\">3</div>\n</div>\n",
        css: ".row {\n  background-color: #ece7ff;\n  padding: 8px;\n}\n\n.box {\n  background-color: #6a4cf0;\n  color: white;\n  padding: 20px;\n  margin: 4px;\n  font-family: sans-serif;\n  font-weight: bold;\n}\n",
      },
      solution: {
        html: "<div class=\"row\">\n  <div class=\"box\">1</div>\n  <div class=\"box\">2</div>\n  <div class=\"box\">3</div>\n</div>\n",
        css: ".row {\n  background-color: #ece7ff;\n  padding: 8px;\n  display: flex;\n}\n\n.box {\n  background-color: #6a4cf0;\n  color: white;\n  padding: 20px;\n  margin: 4px;\n  font-family: sans-serif;\n  font-weight: bold;\n}\n",
      },
      check: ({ css }) => css('.row', 'display') === 'flex' || 'Set `display: flex` on `.row`.',
    },
    {
      type: 'explain',
      title: 'justify-content: spacing along the row',
      body: [
        "`justify-content` controls how items are spaced along the **main axis**:",
        { code: `.row { justify-content: flex-start; }    /* default: packed at the start */\n.row { justify-content: center; }        /* packed in the middle */\n.row { justify-content: flex-end; }      /* packed at the end */\n.row { justify-content: space-between; } /* first & last at the edges, even gaps between */\n.row { justify-content: space-around; }  /* even space around each item */\n.row { justify-content: space-evenly; }  /* perfectly equal gaps */`, lang: 'css' },
        "`space-between` is the classic navbar layout: logo on the left, links on the right.",
      ],
    },
    {
      type: 'try',
      title: 'Build a navbar',
      body: ["The `nav` has two children: the logo and a group of links."],
      goal: "Make `nav` a flex container and push the logo and the links to opposite ends with `justify-content: space-between`.",
      hint: "`nav { display: flex; justify-content: space-between; }`",
      starter: {
        html: "<nav>\n  <strong class=\"logo\">🍕 PizzaPlace</strong>\n  <div class=\"links\">\n    <a href=\"#\">Menu</a>\n    <a href=\"#\">Order</a>\n  </div>\n</nav>\n",
        css: "nav {\n  background-color: #1d1f2d;\n  color: white;\n  padding: 14px 16px;\n  font-family: sans-serif;\n}\n\nnav a {\n  color: white;\n  margin-left: 12px;\n}\n",
      },
      solution: {
        html: "<nav>\n  <strong class=\"logo\">🍕 PizzaPlace</strong>\n  <div class=\"links\">\n    <a href=\"#\">Menu</a>\n    <a href=\"#\">Order</a>\n  </div>\n</nav>\n",
        css: "nav {\n  background-color: #1d1f2d;\n  color: white;\n  padding: 14px 16px;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: space-between;\n}\n\nnav a {\n  color: white;\n  margin-left: 12px;\n}\n",
      },
      check: ({ css }) => {
        if (css('nav', 'display') !== 'flex') return 'Make `nav` a flex container.';
        return css('nav', 'justify-content') === 'space-between' || 'Use `justify-content: space-between`.';
      },
    },
    {
      type: 'explain',
      title: 'align-items and perfect centering',
      body: [
        "`align-items` lines items up along the **cross axis** (vertically, in a row):",
        { code: `.row { align-items: stretch; }    /* default: items fill the height */\n.row { align-items: flex-start; } /* top */\n.row { align-items: center; }     /* middle */\n.row { align-items: flex-end; }   /* bottom */`, lang: 'css' },
        "Combine both and you get the famous **perfect centering** trick:",
        { code: `.stage {\n  display: flex;\n  justify-content: center;  /* horizontally */\n  align-items: center;      /* vertically */\n  height: 300px;\n}`, lang: 'css' },
        "> For years, \"how do I center a div?\" was the most-asked CSS question. Now you know!",
      ],
    },
    {
      type: 'try',
      title: 'Center a div',
      body: ["The rite of passage of every web developer."],
      goal: "Center `.box` both horizontally and vertically inside `.stage`.",
      hint: "On `.stage`: `display: flex`, `justify-content: center` and `align-items: center`.",
      starter: {
        html: "<div class=\"stage\">\n  <div class=\"box\">I'm centered!</div>\n</div>\n",
        css: ".stage {\n  height: 200px;\n  background-color: #e2f6ea;\n  border-radius: 12px;\n}\n\n.box {\n  background-color: #138a4b;\n  color: white;\n  padding: 16px 24px;\n  border-radius: 10px;\n  font-family: sans-serif;\n}\n",
      },
      solution: {
        html: "<div class=\"stage\">\n  <div class=\"box\">I'm centered!</div>\n</div>\n",
        css: ".stage {\n  height: 200px;\n  background-color: #e2f6ea;\n  border-radius: 12px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.box {\n  background-color: #138a4b;\n  color: white;\n  padding: 16px 24px;\n  border-radius: 10px;\n  font-family: sans-serif;\n}\n",
      },
      check: ({ $ }) => {
        const s = $('.stage').getBoundingClientRect();
        const b = $('.box').getBoundingClientRect();
        const dx = Math.abs((s.left + s.width / 2) - (b.left + b.width / 2));
        const dy = Math.abs((s.top + s.height / 2) - (b.top + b.height / 2));
        if (b.width > s.width - 10) return 'The box is stretching across the whole stage. Is `.stage` a flex container?';
        if (dx > 2) return 'The box isn\'t centered horizontally yet.';
        if (dy > 2) return 'The box isn\'t centered vertically yet.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Direction, gap and wrapping',
      body: [
        "A few more container properties:",
        { code: `.container {\n  display: flex;\n  flex-direction: column; /* stack vertically instead (main axis is now top → bottom) */\n  gap: 16px;              /* space between items, no margins needed */\n  flex-wrap: wrap;        /* allow items to wrap onto new lines */\n}`, lang: 'css' },
        "- `flex-direction` can be `row` (default), `column`, `row-reverse` or `column-reverse`.",
        "- `gap` is the cleanest way to space items. It only adds space *between* them.",
        "- Without `flex-wrap: wrap`, items squeeze onto one line. With it, they flow to the next line like words in a paragraph.",
        "> With `flex-direction: column`, the axes swap: `justify-content` now works vertically and `align-items` horizontally.",
      ],
    },
    {
      type: 'try',
      title: 'A wrapping card row',
      body: ["Make the cards form a neat, wrapping row."],
      goal: "On `.cards`: use `display: flex`, a `gap` of `16px`, and `flex-wrap: wrap`.",
      hint: "Three properties on `.cards`.",
      starter: {
        html: "<div class=\"cards\">\n  <div class=\"card\">🍎 Apples</div>\n  <div class=\"card\">🍌 Bananas</div>\n  <div class=\"card\">🍒 Cherries</div>\n  <div class=\"card\">🥝 Kiwis</div>\n  <div class=\"card\">🥭 Mangoes</div>\n</div>\n",
        css: ".cards {\n\n}\n\n.card {\n  width: 120px;\n  padding: 16px;\n  background-color: #fff4dc;\n  border: 1px solid #f0d9a8;\n  border-radius: 10px;\n  font-family: sans-serif;\n}\n",
      },
      solution: {
        html: "<div class=\"cards\">\n  <div class=\"card\">🍎 Apples</div>\n  <div class=\"card\">🍌 Bananas</div>\n  <div class=\"card\">🍒 Cherries</div>\n  <div class=\"card\">🥝 Kiwis</div>\n  <div class=\"card\">🥭 Mangoes</div>\n</div>\n",
        css: ".cards {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n\n.card {\n  width: 120px;\n  padding: 16px;\n  background-color: #fff4dc;\n  border: 1px solid #f0d9a8;\n  border-radius: 10px;\n  font-family: sans-serif;\n}\n",
      },
      check: ({ css }) => {
        if (css('.cards', 'display') !== 'flex') return 'Make `.cards` a flex container.';
        if (css('.cards', 'column-gap') !== '16px') return 'Add `gap: 16px`.';
        return css('.cards', 'flex-wrap') === 'wrap' || 'Add `flex-wrap: wrap`.';
      },
    },
    {
      type: 'explain',
      title: 'Growing and shrinking: flex: 1',
      body: [
        "Properties on flex **items** control how they share space. The most useful is `flex: 1`, which means *take up all the leftover space*:",
        { code: `<div class="layout">\n  <aside class="sidebar">Menu</aside>\n  <main class="content">Main content</main>\n</div>`, lang: 'html' },
        { code: `.layout {\n  display: flex;\n}\n\n.sidebar {\n  width: 200px;    /* fixed width */\n}\n\n.content {\n  flex: 1;         /* fills the rest */\n}`, lang: 'css' },
        "If two items both have `flex: 1`, they split the space equally. `flex: 2` takes twice as much as `flex: 1`.",
      ],
    },
    {
      type: 'try',
      title: 'Sidebar layout',
      body: ["A fixed sidebar with a flexible main area is one of the most common page layouts."],
      goal: [
        "- Make `.layout` a flex container",
        "- Give `.sidebar` a `width` of `150px`",
        "- Make `.content` fill the remaining space with `flex: 1`",
      ],
      hint: "`.content { flex: 1; }`",
      starter: {
        html: "<div class=\"layout\">\n  <aside class=\"sidebar\">📁 Menu</aside>\n  <main class=\"content\">📄 This area should stretch to fill the rest of the width.</main>\n</div>\n",
        css: ".layout {\n  min-height: 160px;\n  font-family: sans-serif;\n}\n\n.sidebar {\n  background-color: #1d1f2d;\n  color: white;\n  padding: 16px;\n}\n\n.content {\n  background-color: #eef0f8;\n  padding: 16px;\n}\n",
      },
      solution: {
        html: "<div class=\"layout\">\n  <aside class=\"sidebar\">📁 Menu</aside>\n  <main class=\"content\">📄 This area should stretch to fill the rest of the width.</main>\n</div>\n",
        css: ".layout {\n  min-height: 160px;\n  font-family: sans-serif;\n  display: flex;\n}\n\n.sidebar {\n  background-color: #1d1f2d;\n  color: white;\n  padding: 16px;\n  width: 150px;\n}\n\n.content {\n  background-color: #eef0f8;\n  padding: 16px;\n  flex: 1;\n}\n",
      },
      check: ({ css }) => {
        if (css('.layout', 'display') !== 'flex') return 'Make `.layout` a flex container.';
        if (css('.sidebar', 'width') !== '150px') return 'Give `.sidebar` `width: 150px`.';
        if (css('.content', 'flex-grow') !== '1') return 'Give `.content` `flex: 1`.';
        return true;
      },
    },
  ],

  /* ---------------------------------------------------------------- */
  'grid': [
    {
      type: 'explain',
      title: 'CSS Grid: rows and columns',
      body: [
        "Flexbox is great for one direction (a row *or* a column). **Grid** is built for two dimensions: rows *and* columns at the same time.",
        { code: `.gallery {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;  /* three equal columns */\n  gap: 12px;\n}`, lang: 'css' },
        "- `grid-template-columns` defines the columns. Each value is one column's width.",
        "- `fr` means *fraction of the free space*. `1fr 1fr 1fr` is three equal columns; `2fr 1fr` makes the first twice as wide.",
        "- Children are placed into the cells automatically, left to right, wrapping into new rows.",
        "> 🎮 Practice game: [Grid Garden](https://cssgridgarden.com).",
      ],
    },
    {
      type: 'try',
      title: 'Three equal columns',
      body: ["Turn this list of photos into a tidy grid."],
      goal: "Make `.gallery` a grid with **three equal columns** and a `gap` of `12px`.",
      hint: "`grid-template-columns: 1fr 1fr 1fr;`",
      starter: {
        html: "<div class=\"gallery\">\n  <div class=\"photo\">🌄</div>\n  <div class=\"photo\">🏝️</div>\n  <div class=\"photo\">🏔️</div>\n  <div class=\"photo\">🌋</div>\n  <div class=\"photo\">🏜️</div>\n  <div class=\"photo\">🌅</div>\n</div>\n",
        css: ".gallery {\n\n}\n\n.photo {\n  background-color: #ece7ff;\n  font-size: 40px;\n  text-align: center;\n  padding: 16px;\n  border-radius: 10px;\n}\n",
      },
      solution: {
        html: "<div class=\"gallery\">\n  <div class=\"photo\">🌄</div>\n  <div class=\"photo\">🏝️</div>\n  <div class=\"photo\">🏔️</div>\n  <div class=\"photo\">🌋</div>\n  <div class=\"photo\">🏜️</div>\n  <div class=\"photo\">🌅</div>\n</div>\n",
        css: ".gallery {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 12px;\n}\n\n.photo {\n  background-color: #ece7ff;\n  font-size: 40px;\n  text-align: center;\n  padding: 16px;\n  border-radius: 10px;\n}\n",
      },
      check: ({ css }) => {
        if (css('.gallery', 'display') !== 'grid') return 'Make `.gallery` `display: grid`.';
        const cols = css('.gallery', 'grid-template-columns').split(' ');
        if (cols.length !== 3) return `You have ${cols.length} column(s). You need 3.`;
        if (new Set(cols).size !== 1) return 'The three columns should be equal widths (`1fr 1fr 1fr`).';
        return css('.gallery', 'column-gap') === '12px' || 'Add `gap: 12px`.';
      },
    },
    {
      type: 'explain',
      title: 'repeat(), minmax() and auto-fill',
      body: [
        "Typing `1fr` many times gets old. `repeat()` does it for you:",
        { code: `grid-template-columns: repeat(4, 1fr);  /* same as 1fr 1fr 1fr 1fr */`, lang: 'css' },
        "Now the magic line that makes a grid **responsive without any media queries**:",
        { code: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\n  gap: 12px;\n}`, lang: 'css' },
        "Read it as: *fit as many columns as you can, each at least 150px wide, and share any leftover space.* On a phone you get 2 columns; on a big screen, 6 or more.",
        "> `auto-fit` is similar to `auto-fill`. The difference only shows when there are fewer items than columns: `auto-fit` stretches them to fill the row.",
      ],
    },
    {
      type: 'try',
      title: 'A responsive gallery',
      body: ["Make a gallery that adapts to any screen size automatically."],
      goal: "Use `repeat(auto-fill, minmax(100px, 1fr))` for `.gallery`'s columns.",
      hint: "Copy the pattern from the last step and change 150px to 100px. Drag the edge of your browser window to see it reflow.",
      starter: {
        html: "<div class=\"gallery\">\n  <div class=\"tile\">🐶</div>\n  <div class=\"tile\">🐱</div>\n  <div class=\"tile\">🐭</div>\n  <div class=\"tile\">🐹</div>\n  <div class=\"tile\">🐰</div>\n  <div class=\"tile\">🦊</div>\n  <div class=\"tile\">🐻</div>\n  <div class=\"tile\">🐼</div>\n</div>\n",
        css: ".gallery {\n  display: grid;\n  gap: 10px;\n}\n\n.tile {\n  background-color: #fff4dc;\n  font-size: 36px;\n  text-align: center;\n  padding: 12px;\n  border-radius: 10px;\n}\n",
      },
      solution: {
        html: "<div class=\"gallery\">\n  <div class=\"tile\">🐶</div>\n  <div class=\"tile\">🐱</div>\n  <div class=\"tile\">🐭</div>\n  <div class=\"tile\">🐹</div>\n  <div class=\"tile\">🐰</div>\n  <div class=\"tile\">🦊</div>\n  <div class=\"tile\">🐻</div>\n  <div class=\"tile\">🐼</div>\n</div>\n",
        css: ".gallery {\n  display: grid;\n  gap: 10px;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n}\n\n.tile {\n  background-color: #fff4dc;\n  font-size: 36px;\n  text-align: center;\n  padding: 12px;\n  border-radius: 10px;\n}\n",
      },
      check: ({ code, css }) => {
        if (!/repeat\(\s*auto-(fill|fit)/.test(code.css)) return 'Use `repeat(auto-fill, ...)`.';
        if (!/minmax\(\s*100px/.test(code.css)) return 'Use `minmax(100px, 1fr)` for the column size.';
        return css('.gallery', 'grid-template-columns').split(' ').length > 1 || 'The grid should have more than one column.';
      },
    },
    {
      type: 'explain',
      title: 'Spanning rows and columns',
      body: [
        "Grid items can stretch across several cells:",
        { code: `.featured {\n  grid-column: span 2;   /* 2 columns wide */\n  grid-row: span 2;      /* 2 rows tall */\n}`, lang: 'css' },
        "You can also place items by **grid line numbers**. Lines are the edges between columns, counted from 1:",
        { code: `.banner {\n  grid-column: 1 / 4;    /* from line 1 to line 4 = columns 1, 2 and 3 */\n}\n\n.full-width {\n  grid-column: 1 / -1;   /* -1 is always the last line */\n}`, lang: 'css' },
      ],
    },
    {
      type: 'try',
      title: 'Feature an item',
      body: ["One product deserves the spotlight."],
      goal: "Make `.featured` span **2 columns**.",
      hint: "`.featured { grid-column: span 2; }`",
      starter: {
        html: "<div class=\"shop\">\n  <div class=\"item featured\">⭐ Product of the week</div>\n  <div class=\"item\">Mug</div>\n  <div class=\"item\">Hat</div>\n  <div class=\"item\">Socks</div>\n  <div class=\"item\">Bag</div>\n</div>\n",
        css: ".shop {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  font-family: sans-serif;\n}\n\n.item {\n  background-color: #eef0f8;\n  padding: 24px 12px;\n  border-radius: 10px;\n  text-align: center;\n}\n\n.featured {\n  background-color: #6a4cf0;\n  color: white;\n  font-weight: bold;\n}\n",
      },
      solution: {
        html: "<div class=\"shop\">\n  <div class=\"item featured\">⭐ Product of the week</div>\n  <div class=\"item\">Mug</div>\n  <div class=\"item\">Hat</div>\n  <div class=\"item\">Socks</div>\n  <div class=\"item\">Bag</div>\n</div>\n",
        css: ".shop {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  font-family: sans-serif;\n}\n\n.item {\n  background-color: #eef0f8;\n  padding: 24px 12px;\n  border-radius: 10px;\n  text-align: center;\n}\n\n.featured {\n  background-color: #6a4cf0;\n  color: white;\n  font-weight: bold;\n  grid-column: span 2;\n}\n",
      },
      check: ({ $, $$ }) => {
        const fw = $('.featured').getBoundingClientRect().width;
        const ow = $$('.item:not(.featured)')[0].getBoundingClientRect().width;
        return (fw > ow * 1.8 && fw < ow * 2.4) || 'The featured item should be exactly 2 columns wide.';
      },
    },
    {
      type: 'explain',
      title: 'Named areas: whole-page layouts',
      body: [
        "`grid-template-areas` lets you *draw* your layout with names. It's very readable:",
        { code: `.page {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas:\n    "header  header"\n    "sidebar main"\n    "footer  footer";\n  gap: 10px;\n}\n\nheader { grid-area: header; }\naside  { grid-area: sidebar; }\nmain   { grid-area: main; }\nfooter { grid-area: footer; }`, lang: 'css' },
        "Each quoted string is a row, and each word is a cell. Repeating a name makes that area span those cells, so the header spans both columns here.",
      ],
    },
    {
      type: 'try',
      title: 'Lay out a whole page',
      body: ["Use named grid areas to build a classic page layout."],
      goal: [
        "Make `.page` a grid so that:",
        "- the `header` spans the full width at the top",
        "- the `aside` sits on the left and `main` on the right, side by side",
        "- the `footer` spans the full width at the bottom",
      ],
      hint: [
        ["Start with `display: grid` and `grid-template-columns: 120px 1fr` on `.page`."],
        ["Then add `grid-template-areas` with three rows, and give each element its `grid-area`."],
      ],
      starter: {
        html: "<div class=\"page\">\n  <header>Header</header>\n  <aside>Sidebar</aside>\n  <main>Main content</main>\n  <footer>Footer</footer>\n</div>\n",
        css: ".page {\n  font-family: sans-serif;\n  gap: 8px;\n}\n\n.page > * {\n  background-color: #ece7ff;\n  padding: 16px;\n  border-radius: 8px;\n}\n\nmain {\n  min-height: 100px;\n}\n",
      },
      solution: {
        html: "<div class=\"page\">\n  <header>Header</header>\n  <aside>Sidebar</aside>\n  <main>Main content</main>\n  <footer>Footer</footer>\n</div>\n",
        css: ".page {\n  font-family: sans-serif;\n  gap: 8px;\n  display: grid;\n  grid-template-columns: 120px 1fr;\n  grid-template-areas:\n    \"header  header\"\n    \"sidebar main\"\n    \"footer  footer\";\n}\n\n.page > * {\n  background-color: #ece7ff;\n  padding: 16px;\n  border-radius: 8px;\n}\n\nmain {\n  min-height: 100px;\n}\n\nheader { grid-area: header; }\naside  { grid-area: sidebar; }\nmain   { grid-area: main; }\nfooter { grid-area: footer; }\n",
      },
      check: ({ $ }) => {
        const r = (s) => $(s).getBoundingClientRect();
        const page = r('.page'), h = r('header'), a = r('aside'), m = r('main'), f = r('footer');
        if (Math.abs(h.width - page.width) > 2) return 'The header should span the full width.';
        if (Math.abs(f.width - page.width) > 2) return 'The footer should span the full width.';
        if (Math.abs(a.top - m.top) > 2 || a.left >= m.left) return 'The aside and main should sit side by side, with the aside on the left.';
        if (!(h.bottom <= a.top && m.bottom <= f.top)) return 'The order should be header, then aside + main, then footer.';
        return true;
      },
    },
    {
      type: 'explain',
      title: 'Flexbox or Grid?',
      body: [
        "Both are great, and real sites use both together. A simple rule of thumb:",
        "- **Flexbox** for laying things out in **one direction**: navbars, button groups, centering, items in a card.",
        "- **Grid** for **two-dimensional** layouts: page structure, galleries, dashboards, anything with rows *and* columns.",
        { code: `/* Grid for the page */\n.page { display: grid; grid-template-columns: 250px 1fr; }\n\n/* Flexbox inside the header */\n.header { display: flex; justify-content: space-between; align-items: center; }`, lang: 'css' },
        "> Use your browser's DevTools: when you inspect a flex or grid container, there's a badge that overlays the layout lines on the page. It makes debugging much easier.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'responsive': [
    {
      type: 'explain',
      title: 'What is responsive design?',
      body: [
        "More than half of web traffic comes from phones. **Responsive design** means one website that looks good on every screen size.",
        "Step one is always this tag in the `<head>`. Without it, phones pretend to be a desktop and shrink everything:",
        { code: `<meta name="viewport" content="width=device-width, initial-scale=1">`, lang: 'html' },
        "The main tools of responsive design:",
        "- **Flexible layouts**: flexbox, grid, `%` and `fr` instead of fixed widths",
        "- **Flexible images**: images that shrink with their container",
        "- **Media queries**: CSS that only applies at certain screen sizes",
      ],
    },
    {
      type: 'explain',
      title: 'Media queries',
      body: [
        "A **media query** wraps CSS rules that only apply when a condition is true:",
        { code: `/* Phones first: one column by default */\n.cards {\n  display: flex;\n  flex-direction: column;\n}\n\n/* Screens 600px and wider: switch to a row */\n@media (min-width: 600px) {\n  .cards {\n    flex-direction: row;\n  }\n}`, lang: 'css' },
        "This is called **mobile-first**: write the simple phone layout first, then use `min-width` queries to enhance it for bigger screens.",
        "Common breakpoints are around `600px` (large phones), `768px` (tablets) and `1024px` (laptops), but pick whatever makes *your* design look good.",
      ],
    },
    {
      type: 'try',
      title: 'Mobile-first cards',
      body: [
        "The cards are stacked in a column, which is perfect for phones.",
        "> The preview here is narrow, so you may not see the row layout. To test it, change `600px` to `300px` temporarily, or drag your browser window wider.",
      ],
      goal: "Add a media query so that at `min-width: 600px`, `.cards` uses `flex-direction: row`.",
      hint: "`@media (min-width: 600px) { .cards { flex-direction: row; } }`",
      starter: {
        html: "<div class=\"cards\">\n  <div class=\"card\">Plan</div>\n  <div class=\"card\">Build</div>\n  <div class=\"card\">Launch</div>\n</div>\n",
        css: ".cards {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  font-family: sans-serif;\n}\n\n.card {\n  flex: 1;\n  background-color: #e2f6ea;\n  padding: 20px;\n  border-radius: 10px;\n}\n\n/* Add your media query below */\n",
      },
      solution: {
        html: "<div class=\"cards\">\n  <div class=\"card\">Plan</div>\n  <div class=\"card\">Build</div>\n  <div class=\"card\">Launch</div>\n</div>\n",
        css: ".cards {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  font-family: sans-serif;\n}\n\n.card {\n  flex: 1;\n  background-color: #e2f6ea;\n  padding: 20px;\n  border-radius: 10px;\n}\n\n/* Add your media query below */\n@media (min-width: 600px) {\n  .cards {\n    flex-direction: row;\n  }\n}\n",
      },
      check: ({ doc }) => {
        for (const sheet of doc.styleSheets) {
          for (const rule of sheet.cssRules) {
            if (rule.media && /min-width/.test(rule.media.mediaText)) {
              for (const inner of rule.cssRules) {
                if (inner.selectorText && inner.selectorText.includes('.cards') && inner.style.flexDirection === 'row') return true;
              }
            }
          }
        }
        return 'Add an `@media (min-width: 600px)` block that sets `.cards { flex-direction: row; }`.';
      },
    },
    {
      type: 'explain',
      title: 'Flexible images and fluid text',
      body: [
        "Images have a fixed size by default and can burst out of small screens. This rule fixes that, and many developers add it to every project:",
        { code: `img {\n  max-width: 100%;  /* never wider than its container */\n  height: auto;     /* keep the proportions */\n}`, lang: 'css' },
        "For text that scales smoothly with the screen, use `clamp(min, preferred, max)`:",
        { code: `h1 {\n  font-size: clamp(1.75rem, 5vw, 3rem);\n}`, lang: 'css' },
        "The heading grows with the window width (`5vw`) but never goes below `1.75rem` or above `3rem`.",
      ],
    },
    {
      type: 'try',
      title: 'Responsive image and heading',
      body: ["The image is 800px wide and overflows the preview."],
      goal: [
        "- Make `img` responsive with `max-width: 100%` and `height: auto`",
        "- Give `h1` a fluid `font-size` using `clamp()`",
      ],
      hint: "`h1 { font-size: clamp(1.5rem, 6vw, 3rem); }`",
      starter: {
        html: "<h1>Explore the mountains</h1>\n<img src=\"https://picsum.photos/id/1018/800/400\" alt=\"A mountain range under a cloudy sky\">\n",
        css: "body {\n  font-family: sans-serif;\n}\n",
      },
      solution: {
        html: "<h1>Explore the mountains</h1>\n<img src=\"https://picsum.photos/id/1018/800/400\" alt=\"A mountain range under a cloudy sky\">\n",
        css: "body {\n  font-family: sans-serif;\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\nh1 {\n  font-size: clamp(1.5rem, 6vw, 3rem);\n}\n",
      },
      check: ({ css, code }) => {
        if (css('img', 'max-width') !== '100%') return 'Give `img` `max-width: 100%`.';
        if (!/height\s*:\s*auto/.test(code.css)) return 'Add `height: auto` to keep the image\'s proportions.';
        return /font-size\s*:\s*clamp\(/.test(code.css) || 'Use `clamp()` for the `h1` font-size.';
      },
    },
    {
      type: 'explain',
      title: 'Testing on different screens',
      body: [
        "You don't need a drawer full of phones to test responsive designs:",
        "1. Open DevTools (**F12**).",
        "2. Click the **device toolbar** icon (a phone and tablet), or press **Ctrl+Shift+M**.",
        "3. Pick a device like \"iPhone 14\" or drag the edges to any width.",
        "Things to look out for on small screens:",
        "- Horizontal scrolling (something is too wide)",
        "- Text that's too small to read, or buttons too small to tap (aim for at least 44×44px)",
        "- Layouts that should stack but stay side by side",
        "> Combine techniques: `repeat(auto-fill, minmax())` grids, flex-wrap, `max-width: 100%` images and a couple of media queries handle almost every layout.",
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  'project-landing-page': [
    {
      type: 'explain',
      title: "What you'll build",
      body: [
        "Time to build a **responsive landing page** for a product or idea of your choice: a coffee shop, an app, a band, anything!",
        "It has four sections, each practising a different layout tool:",
        "- **Header**: logo + nav links with flexbox `space-between`",
        "- **Hero**: big centered headline and call-to-action button (flexbox centering)",
        "- **Features**: a grid of 3 feature cards that collapses to one column on phones",
        "- **Footer**: simple centered text",
        "> Tip: build one section at a time and check the preview after each change.",
      ],
    },
    {
      type: 'project',
      title: 'Responsive landing page',
      body: ["The HTML structure is ready with placeholder text. Make it yours, then bring it to life with CSS."],
      tasks: [
        "Replace the placeholder text with your own product or idea",
        "Header: use flexbox to put the logo on the left and the nav links on the right, vertically centered",
        "Hero: center the content both ways with flexbox, give it a `min-height` and a background color or gradient",
        "Style the call-to-action link as a button",
        "Features: lay out the cards with CSS Grid, gap included",
        "Make the features responsive: 1 column on narrow screens, 3 on wide ones (media query or `auto-fit` + `minmax`)",
        "Footer: centered text with some padding",
        "Add `* { box-sizing: border-box; }` and responsive images if you use any",
      ],
      hint: [
        ["For the hero, `flex-direction: column` stacks the heading, text and button, then `justify-content: center` and `align-items: center` center them."],
        ["A nice gradient: `background: linear-gradient(135deg, #6a4cf0, #b06ab3);`"],
        ["Responsive features without a media query: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));`"],
      ],
      starter: {
        html: "<header class=\"site-header\">\n  <strong class=\"logo\">☕ BeanThere</strong>\n  <nav>\n    <a href=\"#features\">Features</a>\n    <a href=\"#\">Menu</a>\n    <a href=\"#\">Contact</a>\n  </nav>\n</header>\n\n<section class=\"hero\">\n  <h1>Coffee that keeps up with you</h1>\n  <p>Freshly roasted beans, delivered every week.</p>\n  <a class=\"cta\" href=\"#\">Start your subscription</a>\n</section>\n\n<section class=\"features\" id=\"features\">\n  <div class=\"feature\">\n    <h3>🌱 Ethically sourced</h3>\n    <p>We work directly with farmers.</p>\n  </div>\n  <div class=\"feature\">\n    <h3>🔥 Roasted weekly</h3>\n    <p>Always fresh, never stale.</p>\n  </div>\n  <div class=\"feature\">\n    <h3>📦 Free delivery</h3>\n    <p>Straight to your door.</p>\n  </div>\n</section>\n\n<footer class=\"site-footer\">\n  <p>© 2026 BeanThere</p>\n</footer>\n",
        css: "* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  font-family: \"Segoe UI\", Arial, sans-serif;\n}\n\n/* Header */\n\n\n/* Hero */\n\n\n/* Features */\n\n\n/* Footer */\n\n",
      },
      solution: {
        html: "<header class=\"site-header\">\n  <strong class=\"logo\">☕ BeanThere</strong>\n  <nav>\n    <a href=\"#features\">Features</a>\n    <a href=\"#\">Menu</a>\n    <a href=\"#\">Contact</a>\n  </nav>\n</header>\n\n<section class=\"hero\">\n  <h1>Coffee that keeps up with you</h1>\n  <p>Freshly roasted beans, delivered every week.</p>\n  <a class=\"cta\" href=\"#\">Start your subscription</a>\n</section>\n\n<section class=\"features\" id=\"features\">\n  <div class=\"feature\">\n    <h3>🌱 Ethically sourced</h3>\n    <p>We work directly with farmers.</p>\n  </div>\n  <div class=\"feature\">\n    <h3>🔥 Roasted weekly</h3>\n    <p>Always fresh, never stale.</p>\n  </div>\n  <div class=\"feature\">\n    <h3>📦 Free delivery</h3>\n    <p>Straight to your door.</p>\n  </div>\n</section>\n\n<footer class=\"site-footer\">\n  <p>© 2026 BeanThere</p>\n</footer>\n",
        css: "* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  font-family: \"Segoe UI\", Arial, sans-serif;\n  color: #2b2118;\n}\n\n/* Header */\n.site-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n  background-color: #2b2118;\n}\n\n.logo {\n  color: #f5e6d3;\n  font-size: 20px;\n}\n\n.site-header nav {\n  display: flex;\n  gap: 16px;\n}\n\n.site-header a {\n  color: #f5e6d3;\n  text-decoration: none;\n}\n\n/* Hero */\n.hero {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  min-height: 60vh;\n  padding: 40px 20px;\n  background: linear-gradient(135deg, #6f4e37, #c08552);\n  color: white;\n}\n\n.hero h1 {\n  font-size: clamp(2rem, 6vw, 3.5rem);\n  margin: 0 0 12px;\n}\n\n.cta {\n  display: inline-block;\n  margin-top: 16px;\n  padding: 14px 28px;\n  background-color: #f5e6d3;\n  color: #2b2118;\n  font-weight: bold;\n  text-decoration: none;\n  border-radius: 999px;\n}\n\n/* Features */\n.features {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 20px;\n  padding: 40px 24px;\n  max-width: 1000px;\n  margin: 0 auto;\n}\n\n@media (min-width: 700px) {\n  .features {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n\n.feature {\n  background-color: #fbf6f0;\n  padding: 20px;\n  border-radius: 14px;\n}\n\n/* Footer */\n.site-footer {\n  text-align: center;\n  padding: 24px;\n  background-color: #2b2118;\n  color: #f5e6d3;\n}\n",
      },
      check: ({ css, code }) => {
        if (css('.site-header', 'display') !== 'flex') return 'Make the header a flex container.';
        if (css('.site-header', 'justify-content') !== 'space-between') return 'Use `justify-content: space-between` on the header.';
        if (css('.hero', 'display') !== 'flex') return 'Use flexbox to center the hero content.';
        if (css('.features', 'display') !== 'grid') return 'Lay out `.features` with CSS Grid.';
        if (!/@media|auto-fit|auto-fill/.test(code.css)) return 'Make the features responsive with a media query or `auto-fit`/`auto-fill`.';
        if (css('.site-footer', 'text-align') !== 'center') return 'Center the footer text.';
        return true;
      },
      success: "That's a real, responsive landing page! 🎉 Don't forget to tick the checklist.",
    },
    {
      type: 'explain',
      title: 'Module 3 complete',
      body: [
        "You can now build almost any layout you'll see on the web:",
        "- `display`, `position` (relative, absolute, fixed, sticky) and `z-index`",
        "- **Flexbox** for rows, columns, spacing and centering",
        "- **Grid** for two-dimensional layouts, spanning and named areas",
        "- **Responsive design** with media queries, fluid units and flexible images",
        "> Challenge: open a website you like, press F12 and inspect its layout. Can you spot where it uses flex and where it uses grid?",
        "Next up is **Module 4: Arrays, Functions & Objects**, the tools for organising data and logic in JavaScript.",
      ],
    },
  ],
});
