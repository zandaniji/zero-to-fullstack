/* course.js — the full curriculum outline.
   Each module file (m01-…, m02-…) fills in the steps with Course.addContent().
   Chapters without steps yet show as "coming soon" but stay clickable. */
const Course = (() => {
  // [chapter id, title, kind?]  kind: 'project' | 'capstone'
  const OUTLINE = [
    { id: 'm01', badge: '1', title: 'HTML & CSS Basics', blurb: 'How the web works, your first HTML page, and styling it with CSS.', chapters: [
      ['web-and-first-page', 'How the web works & your first page'],
      ['text-links-images', 'Text, links, images & lists'],
      ['css-basics', 'CSS selectors, colors & fonts'],
      ['box-model', 'The box model & spacing'],
      ['project-profile-card', 'Mini project: Profile card', 'project'],
    ] },
    { id: 'm02', badge: '2', title: 'Interactive JavaScript', blurb: 'Variables, operators, comparisons, conditions and loops: the logic behind every program.', chapters: [
      ['variables-types', 'Variables & data types'],
      ['strings-numbers', 'Strings, numbers & operators'],
      ['comparisons', 'Comparisons & logic'],
      ['conditions', 'Conditions: if, else, switch'],
      ['loops', 'Loops: for, while, for…of'],
      ['project-guessing-game', 'Mini project: Number guessing robot', 'project'],
    ] },
    { id: 'm03', badge: '3', title: 'Layout: Flexbox & Grid', blurb: 'Position elements, build layouts with Flexbox and Grid, and make them responsive.', chapters: [
      ['display-position', 'Display & positioning'],
      ['flexbox', 'Flexbox'],
      ['grid', 'CSS Grid'],
      ['responsive', 'Responsive design & media queries'],
      ['project-landing-page', 'Mini project: Responsive landing page', 'project'],
    ] },
    { id: 'm04', badge: '4', title: 'Arrays, Functions & Objects', blurb: 'Organise data and reuse logic, the building blocks of real apps.', chapters: [
      ['arrays', 'Arrays'],
      ['functions', 'Functions, callbacks, map & filter'],
      ['objects', 'Objects & JSON'],
      ['project-grade-calculator', 'Mini project: Grade calculator', 'project'],
    ] },
    { id: 'm05', badge: '5', title: 'DOM & Events', blurb: 'Use JavaScript to change the page and respond to clicks, typing and forms.', chapters: [
      ['dom-select-change', 'Selecting & changing elements'],
      ['events', 'Events & listeners'],
      ['forms', 'Forms & user input'],
      ['project-todo', 'Mini project: To-do app', 'project'],
    ] },
    { id: 'm06', badge: '6', title: 'Semantic HTML & Accessibility', blurb: 'Write HTML that means something and works for everyone, including keyboard and screen reader users.', chapters: [
      ['semantic-elements', 'Semantic elements'],
      ['accessibility-basics', 'Accessibility essentials'],
      ['project-accessible-todo', 'Mini project: Make the to-do app accessible', 'project'],
    ] },
    { id: 'm07', badge: '7', title: 'Synchronous & Asynchronous JS', blurb: 'The event loop, callbacks, promises, async/await and fetching data from APIs.', chapters: [
      ['event-loop', 'Sync vs async & the event loop'],
      ['callbacks-promises', 'Callbacks & promises'],
      ['async-await-fetch', 'async/await & fetch'],
      ['project-quote-fetcher', 'Mini project: Random quote fetcher', 'project'],
    ] },
    { id: 'm08', badge: '8', title: 'JavaScript Classes', blurb: 'Model things in code with classes, inheritance and modules.', chapters: [
      ['classes-basics', 'Classes & constructors'],
      ['inheritance', 'Inheritance, getters & setters'],
      ['modules', 'Modules: import & export'],
      ['project-bank-account', 'Mini project: Bank account simulator', 'project'],
    ] },
    { id: 'c1', badge: '★', title: 'Capstone 1: Expense Tracker', blurb: 'Build a complete vanilla JavaScript app using everything from Modules 1–8.', chapters: [
      ['expense-tracker', 'Build an expense tracker', 'capstone'],
    ] },
    { id: 'm09', badge: '9', title: 'React: Introduction', blurb: 'Components, JSX, props and state: how modern UIs are built.', chapters: [
      ['why-react-jsx', 'Why React? & JSX'],
      ['components-props', 'Components & props'],
      ['state', 'State with useState'],
      ['events-lists', 'Events, conditionals & lists'],
      ['project-tip-calculator', 'Mini project: Tip calculator', 'project'],
    ] },
    { id: 'm10', badge: '10', title: 'React: Deep Dive', blurb: 'Effects, forms, shared state, context, custom hooks and real project setup.', chapters: [
      ['use-effect', 'useEffect & fetching data'],
      ['controlled-forms', 'Controlled forms'],
      ['lifting-state', 'Lifting state & composition'],
      ['context-reducer-hooks', 'Context, useReducer & custom hooks'],
      ['vite-router', 'Vite setup & React Router'],
      ['project-show-search', 'Mini project: TV show search app', 'project'],
    ] },
    { id: 'c2', badge: '★', title: 'Capstone 2: React App', blurb: 'Build a multi-page React app on your own computer with Vite.', chapters: [
      ['react-app', 'Build a multi-page React app', 'capstone'],
    ] },
    { id: 'm11', badge: '11', title: 'Node.js & Express', blurb: 'Run JavaScript on a server and build your first REST API.', chapters: [
      ['node-npm', 'Node.js & npm basics'],
      ['first-server', 'Your first Express server'],
      ['middleware-rest', 'Middleware, JSON & REST'],
      ['errors-env', 'Error handling & environment variables'],
      ['project-notes-api', 'Mini project: Notes REST API', 'project'],
    ] },
    { id: 'm12', badge: '12', title: 'Databases', blurb: 'Store data for real: SQL, data modeling, and connecting Express to SQLite.', chapters: [
      ['sql-vs-nosql', 'What is a database? SQL vs NoSQL'],
      ['sql-basics', 'SQL basics'],
      ['modeling', 'Modeling data & relationships'],
      ['express-sqlite', 'Express + SQLite'],
      ['project-notes-db', 'Mini project: Persist the notes API', 'project'],
    ] },
    { id: 'm13', badge: '13', title: 'Backend Essentials', blurb: 'Authentication, validation, security, connecting front to back, testing and deployment.', chapters: [
      ['auth', 'Authentication: hashing, sessions & JWT'],
      ['validation-security', 'Validation, CORS & security'],
      ['react-express', 'Connecting React to Express'],
      ['testing-deploy', 'Testing & deployment'],
    ] },
    { id: 'c3', badge: '★', title: 'Final Capstone: Full-Stack App', blurb: 'A task manager with React, Express, SQLite and login, built end to end.', chapters: [
      ['fullstack-task-manager', 'Build a full-stack task manager', 'capstone'],
    ] },
  ];

  const modules = OUTLINE.map((m) => ({
    ...m,
    chapters: m.chapters.map(([id, title, kind]) => ({ id, title, kind: kind || 'lesson', steps: [] })),
  }));

  const getModule = (id) => modules.find((m) => m.id === id);
  const getChapter = (m, id) => m && m.chapters.find((c) => c.id === id);

  function addContent(moduleId, chapters) {
    const m = getModule(moduleId);
    if (!m) return console.warn('Unknown module', moduleId);
    Object.entries(chapters).forEach(([chId, steps]) => {
      const ch = getChapter(m, chId);
      if (ch) ch.steps = steps;
      else console.warn('Unknown chapter', moduleId, chId);
    });
  }

  // Every chapter in course order, for next/previous navigation.
  const flatChapters = () => modules.flatMap((m) => m.chapters.map((ch) => ({ m, ch })));
  const stepKey = (m, ch, i) => `${m.id}/${ch.id}/${i}`;

  return { modules, getModule, getChapter, addContent, flatChapters, stepKey };
})();
