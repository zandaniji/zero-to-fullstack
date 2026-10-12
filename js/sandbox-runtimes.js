/* sandbox-runtimes.js — code that runs INSIDE the preview iframe for the SQL and
   Express playgrounds. The editor copies these functions into the preview with
   toString(), so each one must be self-contained (no outside variables). */
const SandboxRuntimes = (() => {

  /* ---------- SQL: run your SQL against a fresh in-memory SQLite database ---------- */
  function sqlRuntime(userSql, setupSql, base) {
    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    }
    window.__sqlResults = [];
    window.__ready = initSqlJs({ locateFile: function (f) { return base + f; } }).then(function (SQL) {
      var db = new SQL.Database();
      window.__db = db;
      if (setupSql) {
        try { db.run(setupSql); } catch (e) { console.error('Setup error: ' + e.message); }
      }
      var html = '';
      try {
        var results = userSql.trim() ? db.exec(userSql) : [];
        window.__sqlResults = results;
        results.forEach(function (r) {
          html += '<table><thead><tr>' + r.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>'
            + r.values.map(function (row) {
              return '<tr>' + row.map(function (v) { return '<td>' + (v === null ? '<i>NULL</i>' : esc(v)) + '</td>'; }).join('') + '</tr>';
            }).join('')
            + '</tbody></table><p class="meta">' + r.values.length + ' row' + (r.values.length === 1 ? '' : 's') + '</p>';
        });
        if (!results.length) {
          html = userSql.trim()
            ? '<p class="meta">✓ Ran successfully (' + db.getRowsModified() + ' row(s) changed by the last statement). Add a SELECT to see the data.</p>'
            : '<p class="meta">Write some SQL and press Run.</p>';
        }
      } catch (e) {
        html = '<p class="err">⚠️ ' + esc(e.message) + '</p>';
        console.error(e.message);
      }
      document.getElementById('sql-results').innerHTML = html;
    }, function () {
      document.getElementById('sql-results').innerHTML = '<p class="err">Could not load the SQL engine. SQL exercises need an internet connection.</p>';
      throw new Error('The SQL engine failed to load.');
    });
  }

  /* ---------- Express: a small, faithful Express 5 look-alike + an API tester ---------- */
  function expressRuntime(opts) {
    var STATUS = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error' };
    var slice = function (a, i) { return Array.prototype.slice.call(a, i || 0); };
    var flat = function (arr) { return arr.reduce(function (acc, x) { return acc.concat(Array.isArray(x) ? flat(x) : [x]); }, []); };

    // '/notes/:id' matched against '/notes/7' → { params: { id: '7' }, matched: '/notes/7' }
    function matchPath(pattern, path, end) {
      var p = String(pattern).split('/').filter(Boolean);
      var s = String(path).split('/').filter(Boolean);
      if (end ? p.length !== s.length : p.length > s.length) return null;
      var params = {};
      for (var i = 0; i < p.length; i++) {
        if (p[i][0] === ':') params[p[i].slice(1)] = decodeURIComponent(s[i]);
        else if (p[i].toLowerCase() !== s[i].toLowerCase()) return null;
      }
      return { params: params, matched: '/' + s.slice(0, p.length).join('/') };
    }

    function createRouter() {
      var stack = [];
      function router(req, res, next) { router.handle(req, res, next); }
      router.stack = stack;
      function add(method, path, fns) {
        fns.forEach(function (fn) {
          if (typeof fn !== 'function') {
            throw new TypeError((method ? method.toLowerCase() : 'use') + '() requires a callback function but got ' + (fn === undefined ? 'undefined' : 'a ' + typeof fn));
          }
          stack.push({ method: method, path: path, fn: fn, end: !!method });
        });
      }
      ['get', 'post', 'put', 'patch', 'delete', 'all'].forEach(function (m) {
        router[m] = function (path) { add(m.toUpperCase(), path, flat(slice(arguments, 1))); return router; };
      });
      router.use = function (path) {
        var fns = slice(arguments);
        if (typeof path === 'string') fns = fns.slice(1); else path = '/';
        add(null, path, flat(fns));
        return router;
      };
      router.handle = function (req, res, out) {
        var idx = 0;
        var basePath = req.path;
        function next(err) {
          if (err === 'route' || err === 'router') err = undefined;
          if (res.headersSent) return;
          var layer = stack[idx++];
          if (!layer) return out(err);
          var m = matchPath(layer.path, basePath, layer.end);
          if (!m || (layer.method && layer.method !== 'ALL' && layer.method !== req.method)) return next(err);
          var fn = layer.fn;
          var isErrorHandler = fn.length === 4;
          if (err ? !isErrorHandler : isErrorHandler) return next(err);
          req.params = layer.end ? m.params : Object.assign({}, req.params, m.params);
          try {
            var result;
            if (!layer.end && typeof fn.handle === 'function') {
              // A mounted router: strip the prefix while it runs.
              var savedPath = req.path, savedBase = req.baseUrl;
              var prefix = m.matched === '/' ? '' : m.matched;
              req.baseUrl = savedBase + prefix;
              req.path = basePath.slice(prefix.length) || '/';
              result = fn.handle(req, res, function (e) { req.path = savedPath; req.baseUrl = savedBase; next(e); });
            } else {
              result = err ? fn(err, req, res, next) : fn(req, res, next);
            }
            // Express 5 passes rejected promises (async handlers) to the error handler.
            if (result && typeof result.then === 'function') result.then(null, function (e) { next(e || new Error('Rejected promise')); });
          } catch (e) {
            next(e);
          }
        }
        next();
      };
      return router;
    }

    function express() {
      var app = createRouter();
      var settings = { env: 'development' };
      var routeGet = app.get;
      app.get = function (name) {
        if (arguments.length === 1 && typeof name === 'string') return settings[name];
        return routeGet.apply(app, arguments);
      };
      app.set = function (k, v) { settings[k] = v; return app; };
      app.locals = {};
      app.listen = function () {
        var args = slice(arguments);
        var cb = args.filter(function (a) { return typeof a === 'function'; })[0];
        app.__listening = true;
        app.__port = args[0];
        if (cb) setTimeout(cb, 0);
        return { close: function (fn) { app.__listening = false; if (fn) fn(); }, address: function () { return { port: Number(app.__port) || 3000 }; } };
      };
      window.__app = app;
      return app;
    }
    express.Router = function () { return createRouter(); };
    express.json = function () {
      return function jsonParser(req, res, next) {
        if (req.__raw !== undefined && /json/.test(req.headers['content-type'] || '')) {
          try { req.body = req.__raw === '' ? {} : JSON.parse(req.__raw); }
          catch (e) { var err = new SyntaxError('Invalid JSON in request body: ' + e.message); err.status = 400; return next(err); }
        }
        next();
      };
    };
    express.urlencoded = function () { return function (req, res, next) { next(); }; };
    express.static = function () { return function (req, res, next) { next(); }; };

    var modules = {
      express: express,
      cors: function (o) {
        return function cors(req, res, next) {
          res.set('Access-Control-Allow-Origin', (o && o.origin) || '*');
          if (req.method === 'OPTIONS') return res.sendStatus(204);
          next();
        };
      },
      dotenv: { config: function () { return { parsed: {} }; } },
    };
    window.require = function (name) {
      if (name === 'node:sqlite') {
        if (window.__DatabaseSync) return { DatabaseSync: window.__DatabaseSync };
        throw new Error("node:sqlite isn't available in this exercise.");
      }
      if (modules[name]) return modules[name];
      throw new Error("Cannot find module '" + name + "'. The browser playground only has express, cors, dotenv and node:sqlite.");
    };
    window.module = { exports: {} };
    window.exports = window.module.exports;
    window.process = { env: Object.assign({ PORT: '3000', NODE_ENV: 'development' }, opts.env || {}), exit: function () {}, on: function () {}, argv: [] };

    // Send a fake HTTP request to your app. Resolves with { status, headers, body, text }.
    window.__request = function (method, url, body, headers) {
      return new Promise(function (resolve) {
        var app = window.__app;
        if (!app) return resolve({ status: 0, body: null, text: 'No Express app found. Did you call express()?' });
        if (!app.__listening) return resolve({ status: 0, body: null, text: 'Could not connect: the server is not running. Did you call app.listen()?' });
        var u = new URL(url, 'http://localhost');
        var hdrs = {};
        Object.keys(headers || {}).forEach(function (k) { hdrs[k.toLowerCase()] = headers[k]; });
        var raw = body == null || body === '' ? undefined : (typeof body === 'string' ? body : JSON.stringify(body));
        if (raw !== undefined && !hdrs['content-type']) hdrs['content-type'] = 'application/json';
        var query = {};
        u.searchParams.forEach(function (v, k) { query[k] = v; });
        var req = {
          method: String(method || 'GET').toUpperCase(), url: u.pathname + u.search, originalUrl: u.pathname + u.search,
          path: u.pathname, baseUrl: '', query: query, params: {}, headers: hdrs, body: undefined, __raw: raw, app: app,
          get: function (h) { return hdrs[String(h).toLowerCase()]; },
        };
        req.header = req.get;
        var done = false;
        var res = {
          statusCode: 200, headers: {}, headersSent: false, locals: {},
          status: function (c) { this.statusCode = c; return this; },
          set: function (k, v) { this.headers[String(k).toLowerCase()] = v; return this; },
          get: function (k) { return this.headers[String(k).toLowerCase()]; },
          json: function (obj) { this.set('content-type', 'application/json'); return this.__finish(JSON.stringify(obj === undefined ? null : obj)); },
          send: function (b) {
            if (b !== null && typeof b === 'object') return this.json(b);
            if (!this.headers['content-type']) this.set('content-type', 'text/html');
            return this.__finish(b == null ? '' : String(b));
          },
          sendStatus: function (c) { this.statusCode = c; return this.send(STATUS[c] || String(c)); },
          end: function (b) { return this.__finish(b == null ? '' : String(b)); },
          __finish: function (text) {
            if (done) { console.error('Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client. (Did you send two responses? Use "return res.json(...)".)'); return this; }
            done = true;
            this.headersSent = true;
            var parsed = text;
            try { parsed = JSON.parse(text); } catch (e) { /* plain text */ }
            resolve({ status: this.statusCode, headers: this.headers, body: parsed, text: text });
            return this;
          },
        };
        res.header = res.set;
        app.handle(req, res, function (err) {
          if (done) return;
          if (err) {
            var status = err.status || err.statusCode || 500;
            if (status >= 500) console.error((err && err.stack ? String(err.stack).split('\n')[0] : String(err)));
            res.status(status).send(status >= 500 ? 'Internal Server Error' : (err.message || STATUS[status]));
          } else {
            res.status(404).send('Cannot ' + req.method + ' ' + req.path);
          }
        });
        setTimeout(function () {
          if (!done) {
            done = true;
            resolve({ status: 0, body: null, text: 'No response after 3 seconds. Every route must send a response (res.json, res.send…) or call next().' });
          }
        }, 3000);
      });
    };

    // The API tester panel shown in the preview.
    document.addEventListener('DOMContentLoaded', function () {
      var presets = opts.tryRequests || [];
      var first = presets[0] || { method: 'GET', url: '/' };
      var root = document.createElement('div');
      root.id = 'api-tester';
      root.innerHTML =
        '<div class="row">'
        + '<select id="t-method" aria-label="HTTP method"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select>'
        + '<input id="t-url" aria-label="URL path" spellcheck="false">'
        + '<button id="t-send" type="button">Send</button>'
        + '</div>'
        + '<textarea id="t-body" rows="3" spellcheck="false" aria-label="Request body (JSON)" placeholder="Request body as JSON"></textarea>'
        + '<div id="t-presets"></div>'
        + '<div id="t-out" aria-live="polite"><p class="hint">Send a request to your server ↑</p></div>';
      document.body.appendChild(root);
      var m = document.getElementById('t-method'), u = document.getElementById('t-url'), b = document.getElementById('t-body');
      var out = document.getElementById('t-out');
      function fill(p) {
        m.value = (p.method || 'GET').toUpperCase();
        u.value = p.url || '/';
        b.value = p.body == null ? '' : (typeof p.body === 'string' ? p.body : JSON.stringify(p.body, null, 2));
        toggleBody();
      }
      function toggleBody() { b.hidden = !/POST|PUT|PATCH/.test(m.value); }
      function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
      function send() {
        out.innerHTML = '<p class="hint">Sending…</p>';
        var body = b.hidden ? undefined : b.value;
        window.__request(m.value, u.value || '/', body).then(function (r) {
          var cls = r.status >= 500 || r.status === 0 ? 's5' : r.status >= 400 ? 's4' : 's2';
          var text = typeof r.body === 'object' && r.body !== null ? JSON.stringify(r.body, null, 2) : r.text;
          out.innerHTML = '<div class="status ' + cls + '">' + (r.status ? r.status + ' ' + (STATUS[r.status] || '') : 'No response') + '</div><pre>' + esc(text || '(empty body)') + '</pre>';
        });
      }
      m.addEventListener('change', toggleBody);
      document.getElementById('t-send').addEventListener('click', send);
      u.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
      var presetsEl = document.getElementById('t-presets');
      presets.forEach(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'preset';
        btn.textContent = (p.method || 'GET').toUpperCase() + ' ' + p.url;
        btn.addEventListener('click', function () { fill(p); send(); });
        presetsEl.appendChild(btn);
      });
      fill(first);
    });

    // node:sqlite look-alike (DatabaseSync) on top of sql.js, when the exercise needs a database.
    if (opts.sqlite) {
      window.__ready = initSqlJs({ locateFile: function (f) { return opts.sqlBase + f; } }).then(function (SQL) {
        var clean = function (args) { return slice(args).map(function (v) { return v === undefined ? null : typeof v === 'boolean' ? Number(v) : v; }); };
        function DatabaseSync() { this._db = new SQL.Database(); }
        DatabaseSync.prototype.exec = function (sql) { this._db.exec(sql); };
        DatabaseSync.prototype.close = function () {};
        DatabaseSync.prototype.prepare = function (sql) {
          var db = this._db;
          function rows(args, limit) {
            var st = db.prepare(sql);
            try {
              st.bind(clean(args));
              var out = [];
              while (st.step()) { out.push(st.getAsObject()); if (limit && out.length >= limit) break; }
              return out;
            } finally { st.free(); }
          }
          return {
            all: function () { return rows(arguments); },
            get: function () { return rows(arguments, 1)[0]; },
            run: function () {
              db.run(sql, clean(arguments));
              var changes = db.getRowsModified();
              var id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
              return { changes: changes, lastInsertRowid: id };
            },
          };
        };
        window.__DatabaseSync = DatabaseSync;
        // Now that the database engine is ready, run your server code.
        return new Promise(function (resolve) {
          function start() {
            window.__lineOffset = 0;
            var s = document.createElement('script');
            s.textContent = document.getElementById('__user').textContent;
            document.body.appendChild(s);
            resolve();
          }
          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
        });
      }, function () {
        console.error('Could not load the SQLite engine. This exercise needs an internet connection.');
        throw new Error('SQLite failed to load.');
      });
    }
  }

  return { sqlRuntime, expressRuntime };
})();
