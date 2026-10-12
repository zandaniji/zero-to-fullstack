/* editor.js — the live code workspace used by "Try it" and project steps.
   Your code runs inside a sandboxed <iframe>; console output and check
   results are sent back to this page with postMessage. */
const Editor = (() => {
  const LABELS = { html: 'HTML', css: 'CSS', js: 'JavaScript', jsx: 'App.jsx', sql: 'SQL' };
  const LANGS = { html: 'html', css: 'css', js: 'js', jsx: 'jsx', sql: 'sql' };
  const MODE_LABELS = { express: { js: 'server.js' }, sql: { sql: 'query.sql' } };
  const PREVIEW_LABELS = { web: 'Preview', react: 'Preview', sql: 'Results', express: 'API tester' };
  const REACT_CDN = [
    'https://unpkg.com/react@18.3.1/umd/react.development.js',
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
    'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js',
  ];
  const SQL_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
  // Hooks and helpers made global so React exercises can use real "import" lines.
  const REACT_PRELUDE = "if (window.React) { ['useState','useEffect','useRef','useReducer','useContext','createContext','useMemo','useCallback','useId','Fragment','StrictMode'].forEach(function (k) { window[k] = React[k]; }); window.createRoot = ReactDOM.createRoot; } else { console.error('React could not load. React exercises need an internet connection.'); }";
  const PLAYGROUND_CSS = [
    'body{font-family:system-ui,"Segoe UI",sans-serif;margin:0;padding:10px;color:#1a1c2b;font-size:14px}',
    'table{border-collapse:collapse;width:100%;margin:0 0 4px;font-size:13px}th,td{border:1px solid #dfe2ec;padding:5px 8px;text-align:left}th{background:#eef0f8}',
    '.meta{color:#5d6279;margin:0 0 12px}.err{color:#c53b3b;font-weight:600}.hint{color:#5d6279}',
    '#api-tester .row{display:flex;gap:6px}#api-tester select,#api-tester input,#api-tester textarea,#api-tester button{font:inherit;padding:6px 8px;border:1px solid #c5c9d6;border-radius:6px}',
    '#api-tester input{flex:1;min-width:0;font-family:Consolas,monospace}#api-tester textarea{width:100%;box-sizing:border-box;margin-top:6px;font-family:Consolas,monospace}',
    '#api-tester button{background:#6a4cf0;color:#fff;border-color:#6a4cf0;cursor:pointer}#api-tester .preset{background:#fff;color:#6a4cf0;margin:6px 6px 0 0;font-size:12px;font-family:Consolas,monospace}',
    '#t-out .status{display:inline-block;margin-top:10px;padding:2px 8px;border-radius:6px;font-weight:700}.s2{background:#e2f6ea;color:#138a4b}.s4{background:#fff4dc;color:#8a5a00}.s5{background:#fdeaea;color:#c53b3b}',
    '#t-out pre{background:#1d1f2d;color:#e7e8f3;padding:8px 10px;border-radius:6px;overflow:auto;max-height:180px;margin:6px 0 0;font-size:12.5px}',
  ].join('\n');
  let runCounter = 0;

  /* ---------- code that runs INSIDE the preview iframe ---------- */

  // Captures console output and errors, and adds a guard that stops runaway loops.
  function bridge(runId, lineOffset, storageData) {
    var logs = [];
    window.__logs = logs;
    window.__lineOffset = lineOffset;
    function send(type, data) {
      parent.postMessage({ __learnpath: true, runId: runId, type: type, data: data }, '*');
    }
    function fmt(v, depth) {
      if (typeof v === 'string') return depth ? JSON.stringify(v) : v;
      if (typeof v === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';
      if (v === undefined) return 'undefined';
      if (v === null) return 'null';
      if (typeof v === 'bigint') return v + 'n';
      if (typeof v !== 'object') return String(v);
      if (v instanceof Error) return v.name + ': ' + v.message;
      if (v.nodeType === 1) return '<' + v.nodeName.toLowerCase() + '>';
      if (depth > 3) return Array.isArray(v) ? '[…]' : '{…}';
      if (Array.isArray(v)) return '[' + v.map(function (x) { return fmt(x, depth + 1); }).join(', ') + ']';
      if (v instanceof Map) return 'Map(' + v.size + ') {' + Array.from(v).map(function (e) { return fmt(e[0], depth + 1) + ' => ' + fmt(e[1], depth + 1); }).join(', ') + '}';
      if (v instanceof Set) return 'Set(' + v.size + ') {' + Array.from(v).map(function (x) { return fmt(x, depth + 1); }).join(', ') + '}';
      try {
        var keys = Object.keys(v);
        var name = v.constructor && v.constructor.name && v.constructor.name !== 'Object' ? v.constructor.name + ' ' : '';
        if (!keys.length) return name + '{}';
        return name + '{ ' + keys.map(function (k) { return k + ': ' + fmt(v[k], depth + 1); }).join(', ') + ' }';
      } catch (e) { return String(v); }
    }
    ['log', 'info', 'warn', 'error', 'debug', 'table'].forEach(function (level) {
      var original = console[level];
      console[level] = function () {
        var text = Array.prototype.map.call(arguments, function (a) { return fmt(a, 0); }).join(' ');
        if (/in-browser Babel transformer/.test(text)) return;   // noise from the React preview setup
        logs.push(text);
        send('console', { level: level === 'debug' || level === 'table' ? 'log' : level, text: text });
        if (original) original.apply(console, arguments);
      };
    });
    window.onerror = function (msg, src, line) {
      var offset = window.__lineOffset;
      var userLine = line - offset;
      var text = String(msg) + (offset >= 0 && userLine > 0 ? '  (line ' + userLine + ')' : '');
      // A few names are reserved by the browser itself; explain that clearly.
      var reserved = /Identifier '(top|parent|self|window|document|location|frames|history|navigator)' has already been declared/.exec(text);
      if (reserved) text += '. "' + reserved[1] + '" is a built-in browser variable, so pick a different name.';
      send('console', { level: 'error', text: text });
    };
    window.addEventListener('unhandledrejection', function (e) {
      send('console', { level: 'error', text: 'Uncaught (in promise) ' + fmt(e.reason, 1) });
    });
    // The sandbox blocks real localStorage, so provide one that the app saves for you.
    var store = storageData || {};
    var has = function (k) { return Object.prototype.hasOwnProperty.call(store, k); };
    var sync = function () { send('storage', JSON.parse(JSON.stringify(store))); };
    var fakeStorage = {
      getItem: function (k) { k = String(k); return has(k) ? store[k] : null; },
      setItem: function (k, v) { store[String(k)] = String(v); sync(); },
      removeItem: function (k) { delete store[String(k)]; sync(); },
      clear: function () { store = {}; sync(); },
      key: function (i) { var keys = Object.keys(store); return i < keys.length ? keys[i] : null; },
      get length() { return Object.keys(store).length; },
    };
    try { Object.defineProperty(window, 'localStorage', { value: fakeStorage, configurable: true }); } catch (e) {}
    // Loop guard: inserted into every loop body. Stops loops that run > 3 seconds.
    var count = 0, start = 0, last = 0;
    window.__lg = function () {
      if ((++count & 1023) !== 0) return;
      var now = Date.now();
      if (now - last > 100) start = now;
      last = now;
      if (now - start > 3000) throw new Error('This loop ran for over 3 seconds, so it was stopped. Does its condition ever become false?');
    };
  }

  // Runs a lesson's check function after your code, and reports pass/fail.
  function checkRunner(runId, checkFn, code, delay) {
    function finish(res) {
      parent.postMessage({ __learnpath: true, runId: runId, type: 'check', data: {
        pass: res === true,
        msg: res === true ? '' : (typeof res === 'string' ? res : 'Not quite yet. Re-read the goal and try again.'),
      } }, '*');
    }
    window.addEventListener('load', function () {
      setTimeout(function () {
        // Some exercises load an engine first (SQL, SQLite); wait until it's ready.
        Promise.resolve(window.__ready).then(runCheck, function () {
          finish('The exercise could not load its engine. Check your internet connection and try again.');
        });
      }, delay);
    });
    function runCheck() {
        var doc = document;
        var ctx = {
          doc: doc, win: window, code: code, logs: (window.__logs || []).slice(),
          $: function (s) { return doc.querySelector(s); },
          $$: function (s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); },
          css: function (s, prop) { var el = doc.querySelector(s); return el ? getComputedStyle(el).getPropertyValue(prop).trim() : null; },
          text: function (s) { var el = doc.querySelector(s); return el ? el.textContent.trim() : ''; },
          norm: function (s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().toLowerCase(); },
          // Look up anything your code declared at the top level, even const/let/class.
          get: function (name) { try { return (0, eval)(name); } catch (e) { return undefined; } },
          wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
          // Set an input's value the way a user would (works with React too).
          setValue: function (el, value) {
            if (typeof el === 'string') el = doc.querySelector(el);
            var proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          },
          // Express playground: send a request to your server.
          request: function (method, url, body, headers) { return window.__request ? window.__request(method, url, body, headers) : Promise.resolve({ status: 0, body: null, text: '' }); },
          // SQL mode: what your query returned, and a way to inspect the database afterwards.
          results: window.__sqlResults || [],
          query: function (sql) {
            if (!window.__db) return [];
            var r = window.__db.exec(sql);
            if (!r.length) return [];
            return r[0].values.map(function (row) { var o = {}; r[0].columns.forEach(function (c, i) { o[c] = row[i]; }); return o; });
          },
        };
        try { Promise.resolve(checkFn(ctx)).then(finish, function (e) { finish(e && e.message || String(e)); }); }
        catch (e) { finish(e && e.message || String(e)); }
    }
  }

  /* ---------- building the preview document ---------- */

  // Inserts __lg(); at the start of every for / while / do loop body.
  function guardLoops(src) {
    const n = src.length;
    const isIdChar = (ch) => !!ch && /[\w$]/.test(ch);
    const skipString = (j) => {
      const q = src[j];
      j++;
      while (j < n && src[j] !== q) { if (src[j] === '\\') j++; j++; }
      return j + 1;
    };
    let out = '';
    let i = 0;
    while (i < n) {
      const c = src[i];
      if (c === '"' || c === "'" || c === '`') { const j = skipString(i); out += src.slice(i, j); i = j; continue; }
      if (c === '/' && src[i + 1] === '/') { let j = src.indexOf('\n', i); if (j < 0) j = n; out += src.slice(i, j); i = j; continue; }
      if (c === '/' && src[i + 1] === '*') { let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; out += src.slice(i, j); i = j; continue; }
      const kw = !isIdChar(src[i - 1]) && /^(for|while|do)(?![\w$])/.exec(src.slice(i, i + 6));
      if (kw) {
        let j = i + kw[1].length;
        if (kw[1] !== 'do') {
          while (j < n && /\s/.test(src[j])) j++;
          if (src[j] !== '(') { out += src.slice(i, j); i = j; continue; }
          let depth = 0;
          for (; j < n; j++) {
            const ch = src[j];
            if (ch === '"' || ch === "'" || ch === '`') { j = skipString(j) - 1; continue; }
            if (ch === '(') depth++;
            else if (ch === ')' && --depth === 0) { j++; break; }
          }
        }
        let k = j;
        while (k < n && /\s/.test(src[k])) k++;
        if (src[k] === '{') { out += src.slice(i, k + 1) + '__lg();'; i = k + 1; }
        else { out += src.slice(i, j); i = j; }
        continue;
      }
      out += c;
      i++;
    }
    return out;
  }

  const safeScript = (s) => s.replace(/<\/script/gi, '<\\/script');
  const jsonForScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

  // A method like `check(ctx) {}` stringifies without "function"; make it a valid expression.
  function fnSource(fn) {
    const src = fn.toString();
    return /^(async\s+)?(function\b|\(|[A-Za-z_$][\w$]*\s*=>)/.test(src) ? src : 'function ' + src;
  }

  // Real React projects start with import/export lines. The preview has React as a
  // global instead, so drop those lines (keeping line numbers the same).
  function stripModuleSyntax(code) {
    return code
      .replace(/^[ \t]*import\s+[^;\n]*?from\s+['"](react|react-dom|react-dom\/client)['"];?[ \t]*$/gm, '')
      .replace(/^[ \t]*import\s+['"][^'"]+\.css['"];?[ \t]*$/gm, '')
      .replace(/^([ \t]*)export\s+default\s+(?=function|class)/gm, '$1')
      .replace(/^([ \t]*)export\s+(?=function|const|let|class)/gm, '$1');
  }

  function buildDoc(files, mode, runId, checkSrc, checkDelay, extra = {}) {
    const react = mode === 'react';
    let doc = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
      + '<meta name="viewport" content="width=device-width, initial-scale=1">'
      + '<style>:root{color-scheme:light}</style>'
      + '<script>(' + bridge.toString() + ')(' + runId + ', __OFFSET__, ' + jsonForScript(Progress.getSandbox()) + ');<\/script>';
    if (react) {
      REACT_CDN.forEach((src) => { doc += '<script src="' + src + '"><\/script>'; });
      doc += '<script>' + REACT_PRELUDE + '<\/script>';
    }
    if (mode === 'sql' || (mode === 'express' && extra.sqlite)) doc += '<script src="' + SQL_CDN + 'sql-wasm.js"><\/script>';
    if (mode === 'sql' || mode === 'express') doc += '<style>' + PLAYGROUND_CSS + '</style>';
    if (mode === 'express') {
      const opts = { tryRequests: extra.tryRequests || [], sqlite: !!extra.sqlite, sqlBase: SQL_CDN, env: extra.env };
      doc += '<script>(' + SandboxRuntimes.expressRuntime.toString() + ')(' + jsonForScript(opts) + ');<\/script>';
    }
    if (files.css) doc += '<style>\n' + files.css.replace(/<\/style/gi, '<\\/style') + '\n</style>';
    doc += '</head><body>';
    if (files.html) doc += '\n' + files.html + '\n';
    else if (react) doc += '<div id="root"></div>';

    let offset = -1;
    if (mode === 'sql') {
      doc += '<div id="sql-results"><p class="meta">Loading the SQL engine…</p></div>'
        + '<script>(' + SandboxRuntimes.sqlRuntime.toString() + ')(' + jsonForScript(files.sql || '') + ', '
        + jsonForScript(extra.setup || '') + ', ' + jsonForScript(SQL_CDN) + ');<\/script>';
    } else if (react && files.jsx) {
      doc += '<script type="text/babel" data-presets="react">\n' + safeScript(stripModuleSyntax(files.jsx)) + '\n<\/script>';
    } else if (files.js) {
      if (mode === 'express' && extra.sqlite) {
        // Runs once the SQLite engine has loaded (see SandboxRuntimes.expressRuntime).
        doc += '<script type="text/plain" id="__user">' + safeScript(guardLoops(files.js)) + '<\/script>';
      } else {
        const open = '<script>\n';
        offset = (doc + open).split('\n').length - 1;
        doc += open + safeScript(guardLoops(files.js)) + '\n<\/script>';
      }
    }
    if (checkSrc) {
      doc += '<script>(' + checkRunner.toString() + ')(' + runId + ', ' + checkSrc + ', '
        + jsonForScript(files) + ', ' + (checkDelay || (react ? 800 : 200)) + ');<\/script>';
    }
    doc += '</body></html>';
    return doc.replace('__OFFSET__', String(offset));
  }

  /* ---------- textarea editing helpers ---------- */

  function insertText(ta, text) {
    ta.focus();
    // execCommand keeps the browser's undo history working; fall back if unsupported.
    if (!document.execCommand('insertText', false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function selectedLines(ta) {
    const v = ta.value;
    const start = v.lastIndexOf('\n', ta.selectionStart - 1) + 1;
    let end = v.indexOf('\n', ta.selectionEnd - (ta.selectionEnd > ta.selectionStart ? 1 : 0));
    if (end < 0) end = v.length;
    return { start, end, text: v.slice(start, end) };
  }

  function indent(ta, out) {
    if (ta.selectionStart === ta.selectionEnd && !out) return insertText(ta, '  ');
    const { start, end, text } = selectedLines(ta);
    const lines = text.split('\n');
    const changed = lines.map((l) => (out ? l.replace(/^ {1,2}/, '') : '  ' + l)).join('\n');
    ta.setSelectionRange(start, end);
    insertText(ta, changed);
    ta.setSelectionRange(start, start + changed.length);
  }

  function newline(ta) {
    const v = ta.value;
    const pos = ta.selectionStart;
    const lineStart = v.lastIndexOf('\n', pos - 1) + 1;
    const current = v.slice(lineStart, pos);
    const base = /^[ \t]*/.exec(current)[0];
    const before = v.slice(0, pos).trimEnd().slice(-1);
    const after = v.slice(ta.selectionEnd).trimStart();
    const opensBlock = '{(['.includes(before) && before !== '';
    const opensTag = before === '>' && /<([A-Za-z][\w-]*)[^<]*>$/.test(v.slice(lineStart, pos).trimEnd()) && !/<\/|\/>$/.test(current.trimEnd().slice(-2));
    if ((opensBlock && '})]'.includes(after[0] || 'x')) || (opensTag && after.startsWith('</'))) {
      insertText(ta, '\n' + base + '  ' + '\n' + base);
      const caret = ta.selectionStart - base.length - 1;
      ta.setSelectionRange(caret, caret);
    } else {
      insertText(ta, '\n' + base + (opensBlock || opensTag ? '  ' : ''));
    }
  }

  /* ---------- the workspace component ---------- */

  function create(host, opts) {
    const { key, starter, mode = 'web', check, checkDelay, onResult, extra } = opts;
    const files = Object.keys(starter);
    const saved = Progress.getCode(key);
    const values = {};
    files.forEach((f) => { values[f] = saved && typeof saved[f] === 'string' ? saved[f] : starter[f]; });
    const consoleOnly = mode === 'js';
    // Re-run automatically while typing (React waits longer: compiling JSX is slower).
    const liveDelay = { web: 500, react: 1200 }[mode];
    const label = (f) => (MODE_LABELS[mode] && MODE_LABELS[mode][f]) || LABELS[f] || f;

    host.innerHTML = `
      <div class="ws ${consoleOnly ? 'ws-console-only' : ''}">
        <div class="ws-left">
          <div class="ws-bar">
            <div class="ws-tabs" role="tablist" aria-label="Code files">
              ${files.map((f, i) => `<button type="button" role="tab" class="ws-tab" data-file="${f}" aria-selected="${i === 0}">${label(f)}</button>`).join('')}
            </div>
            <button type="button" class="ws-mini" data-act="reset" title="Go back to the starter code">&#8634; Reset</button>
          </div>
          ${files.map((f, i) => `
            <div class="code-wrap" data-file="${f}" ${i === 0 ? '' : 'hidden'}>
              <pre class="gutter" aria-hidden="true"></pre>
              <textarea class="code" data-file="${f}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${label(f)} code editor"></textarea>
            </div>`).join('')}
          <div class="ws-help">Tab indents &middot; Esc then Tab leaves the editor &middot; Ctrl+Enter runs</div>
        </div>
        <div class="ws-right">
          <div class="pane preview-pane preview-${mode}" ${consoleOnly ? 'hidden' : ''}>
            <div class="pane-label">${PREVIEW_LABELS[mode] || 'Preview'}</div>
            <iframe title="Preview of your code" sandbox="allow-scripts allow-modals allow-forms"></iframe>
          </div>
          <div class="pane console-pane">
            <div class="pane-label">Console <button type="button" class="ws-mini" data-act="clear">Clear</button></div>
            <div class="console-lines" role="log" aria-live="polite"></div>
          </div>
        </div>
      </div>
      <div class="ws-actions">
        <button type="button" class="btn btn-secondary" data-act="run">&#9654; Run</button>
        ${check ? '<button type="button" class="btn btn-primary" data-act="check">&#10003; Check my code</button>' : ''}
      </div>`;

    const iframe = host.querySelector('iframe');
    const consoleEl = host.querySelector('.console-lines');
    const areas = {};
    host.querySelectorAll('textarea.code').forEach((ta) => { areas[ta.dataset.file] = ta; });

    let runId = 0;
    let checkTimer = null;
    let saveTimer = null;
    let liveTimer = null;
    let placeholder = null;

    function updateGutter(ta) {
      const lines = ta.value.split('\n').length;
      const gutter = ta.previousElementSibling;
      let s = '';
      for (let i = 1; i <= lines; i++) s += i + '\n';
      gutter.textContent = s;
      gutter.scrollTop = ta.scrollTop;
    }

    function addLine(level, text) {
      if (placeholder) { placeholder.remove(); placeholder = null; }
      const line = document.createElement('div');
      line.className = 'console-line cl-' + level;
      line.textContent = text;
      consoleEl.appendChild(line);
      while (consoleEl.childElementCount > 500) consoleEl.firstElementChild.remove();
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function clearConsole() {
      consoleEl.innerHTML = '';
      placeholder = null;
    }

    function showPlaceholder(text) {
      clearConsole();
      placeholder = document.createElement('div');
      placeholder.className = 'console-line cl-hint';
      placeholder.textContent = text;
      consoleEl.appendChild(placeholder);
    }

    function run(withCheck) {
      runId = ++runCounter;
      showPlaceholder(consoleOnly
        ? '(nothing logged yet — use console.log() to print something)'
        : mode === 'express' ? 'Server logs (console.log) show up here.' : 'Console output from your code shows up here.');
      clearTimeout(checkTimer);
      checkTimer = null;
      const src = withCheck && check ? fnSource(check) : null;
      const all = { html: '', css: '', js: '', jsx: '', ...values };
      iframe.srcdoc = buildDoc(all, mode, runId, src, checkDelay, extra);
      if (src) {
        checkTimer = setTimeout(() => {
          checkTimer = null;
          if (onResult) onResult({ pass: false, msg: 'The check timed out. Does your code finish running without errors?' });
        }, 8000 + (checkDelay || 0));
      }
    }

    function onMessage(e) {
      const d = e.data;
      if (!d || !d.__learnpath || d.runId !== runId || e.source !== iframe.contentWindow) return;
      if (d.type === 'console') addLine(d.data.level, d.data.text);
      else if (d.type === 'storage') Progress.setSandbox(d.data);
      else if (d.type === 'check' && checkTimer) {
        clearTimeout(checkTimer);
        checkTimer = null;
        if (onResult) onResult(d.data);
      }
    }
    window.addEventListener('message', onMessage);

    function persist() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => Progress.setCode(key, { ...values }), 300);
    }

    function setFiles(newFiles) {
      files.forEach((f) => {
        values[f] = newFiles[f] != null ? newFiles[f] : starter[f];
        areas[f].value = values[f];
        updateGutter(areas[f]);
      });
      persist();
      run(false);
    }

    // Wire up each textarea.
    Object.entries(areas).forEach(([f, ta]) => {
      ta.value = values[f];
      updateGutter(ta);
      ta.addEventListener('input', () => {
        values[f] = ta.value;
        updateGutter(ta);
        persist();
        if (liveDelay) { clearTimeout(liveTimer); liveTimer = setTimeout(() => run(false), liveDelay); }
      });
      ta.addEventListener('scroll', () => { ta.previousElementSibling.scrollTop = ta.scrollTop; });
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { ta.dataset.escaped = '1'; return; }
        const escaped = ta.dataset.escaped === '1';
        delete ta.dataset.escaped;
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(false); return; }
        if (e.key === 'Tab' && !escaped && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); indent(ta, e.shiftKey); return; }
        if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); newline(ta); }
      });
    });

    // Tabs, buttons.
    host.addEventListener('click', (e) => {
      const tab = e.target.closest('.ws-tab');
      if (tab) {
        host.querySelectorAll('.ws-tab').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        host.querySelectorAll('.code-wrap').forEach((w) => { w.hidden = w.dataset.file !== tab.dataset.file; });
        areas[tab.dataset.file].focus();
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.dataset.act === 'run') run(false);
      if (act.dataset.act === 'check') run(true);
      if (act.dataset.act === 'clear') clearConsole();
      if (act.dataset.act === 'reset' && confirm('Reset to the starter code? Your changes in this step will be lost.')) {
        Progress.clearCode(key);
        setFiles(starter);
      }
    });

    if (consoleOnly) showPlaceholder('Press ▶ Run to execute your code.');
    else run(false);

    return {
      run,
      setFiles,
      destroy() {
        window.removeEventListener('message', onMessage);
        clearTimeout(checkTimer); clearTimeout(liveTimer);
        if (saveTimer) { clearTimeout(saveTimer); Progress.setCode(key, { ...values }); }
      },
    };
  }

  return { create, LABELS, LANGS };
})();
