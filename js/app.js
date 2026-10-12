/* app.js — routing, sidebar and lesson pages.
   URLs look like  #/m02/loops/3  (module / chapter / step number).
   Every chapter is always open: progress is tracked, never enforced. */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = Highlight.esc;
  const main = $('#main');
  const sidebar = $('#sidebar');
  const openModules = new Set();
  const STATUS = {
    done: { icon: '✓', label: 'completed' },
    progress: { icon: '◐', label: 'in progress' },
    todo: { icon: '○', label: 'not started' },
    soon: { icon: '·', label: 'coming soon' },
  };
  const KIND_LABEL = { explain: 'Learn', try: 'Try it', project: 'Mini project', capstone: 'Capstone', local: 'On your computer' };
  let workspace = null;
  let route = {};

  /* ---------- text rendering ---------- */

  // Inline markup for lesson text: `code`, **bold**, [link](https://…)
  function inline(s) {
    const codes = [];
    let out = String(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    out = esc(out)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return out.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + esc(codes[i]) + '</code>');
  }

  function codeBlock(code, lang = 'html', label) {
    const clean = code.replace(/^\n+/, '').replace(/\s+$/, '');
    const name = label || Editor.LABELS[lang] || { text: 'Diagram', bash: 'Terminal' }[lang] || lang;
    return `<figure class="codeblock"><figcaption>${esc(name)}</figcaption><pre><code>${Highlight.highlight(clean, lang)}</code></pre></figure>`;
  }

  // Lesson body: an array of paragraphs ("- " list items, "1. " numbered, "> " tip, "### " heading)
  // plus {code, lang} blocks and {output} console blocks.
  function renderBody(items) {
    if (items == null) return '';
    let html = '';
    let list = null;
    const flush = () => {
      if (list) html += `<${list.tag} class="body-list">${list.items.join('')}</${list.tag}>`;
      list = null;
    };
    [].concat(items).forEach((item) => {
      if (typeof item === 'string') {
        const m = /^(- |\d+\. )/.exec(item);
        if (m) {
          const tag = m[1] === '- ' ? 'ul' : 'ol';
          if (!list || list.tag !== tag) { flush(); list = { tag, items: [] }; }
          list.items.push(`<li>${inline(item.slice(m[0].length))}</li>`);
          return;
        }
        flush();
        if (item.startsWith('> ')) html += `<div class="callout">${inline(item.slice(2))}</div>`;
        else if (item.startsWith('### ')) html += `<h3>${inline(item.slice(4))}</h3>`;
        else html += `<p>${inline(item)}</p>`;
      } else if (item && item.code != null) {
        flush();
        html += codeBlock(item.code, item.lang, item.label);
      } else if (item && item.output != null) {
        flush();
        html += `<div class="output"><div class="output-label">Console output</div><pre>${esc(item.output.replace(/^\n+|\s+$/g, ''))}</pre></div>`;
      }
    });
    flush();
    return html;
  }

  /* ---------- progress helpers ---------- */

  const hashFor = (m, ch, i) => `#/${m.id}${ch ? '/' + ch.id : ''}${ch && i != null ? '/' + (i + 1) : ''}`;

  function chapterStats(m, ch) {
    const total = ch.steps.length;
    let done = 0;
    for (let i = 0; i < total; i++) if (Progress.isDone(Course.stepKey(m, ch, i))) done++;
    return { done, total };
  }
  function chapterStatus(m, ch) {
    const { done, total } = chapterStats(m, ch);
    if (!total) return 'soon';
    if (done === total) return 'done';
    return done ? 'progress' : 'todo';
  }
  function sumStats(pairs) {
    return pairs.reduce((acc, { m, ch }) => {
      const s = chapterStats(m, ch);
      return { done: acc.done + s.done, total: acc.total + s.total };
    }, { done: 0, total: 0 });
  }
  const moduleStats = (m) => sumStats(m.chapters.map((ch) => ({ m, ch })));
  const pct = ({ done, total }) => (total ? Math.round((done / total) * 100) : 0);
  const bar = (stats) => `<span class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct(stats)}"><span style="width:${pct(stats)}%"></span></span>`;

  function firstStepHash() {
    const first = Course.flatChapters().find(({ ch }) => ch.steps.length);
    return first ? hashFor(first.m, first.ch, 0) : '#/';
  }

  /* ---------- chrome: sidebar, top bar, toast ---------- */

  function renderSidebar(scrollToCurrent) {
    sidebar.innerHTML = `
      <nav class="side-nav" aria-label="Course">
        <a class="side-home" href="#/" ${!route.m ? 'aria-current="page"' : ''}>&#8962; Overview</a>
        ${Course.modules.map((m) => {
          const stats = moduleStats(m);
          return `
          <details class="side-module" data-mod="${m.id}" ${openModules.has(m.id) ? 'open' : ''}>
            <summary>
              <span class="mod-badge">${esc(m.badge)}</span>
              <span class="mod-title">${esc(m.title)}</span>
              <span class="mod-pct">${stats.total ? pct(stats) + '%' : 'soon'}</span>
            </summary>
            <ul>
              ${m.chapters.map((ch) => {
                const st = chapterStatus(m, ch);
                const current = route.m === m.id && route.c === ch.id;
                return `<li><a class="side-ch st-${st}" href="${hashFor(m, ch)}" ${current ? 'aria-current="page"' : ''}>
                  <span class="st-icon" aria-hidden="true">${STATUS[st].icon}</span>
                  <span class="side-ch-title">${esc(ch.title)}</span>
                  <span class="sr-only">(${STATUS[st].label})</span></a></li>`;
              }).join('')}
            </ul>
          </details>`;
        }).join('')}
      </nav>
      <div class="side-foot">
        <p>Every chapter is unlocked. Jump anywhere, anytime.</p>
        <button type="button" class="link-btn" id="resetBtn">Reset all progress</button>
      </div>`;

    sidebar.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', () => {
      if (d.open) openModules.add(d.dataset.mod); else openModules.delete(d.dataset.mod);
    }));
    $('#resetBtn').addEventListener('click', () => {
      if (confirm('Reset ALL progress, checklists and saved code? This cannot be undone.')) {
        Progress.reset();
        toast('Progress reset.');
        render();
      }
    });

    if (scrollToCurrent) {
      const a = sidebar.querySelector('.side-ch[aria-current]');
      if (a) {
        const r = a.getBoundingClientRect();
        const sr = sidebar.getBoundingClientRect();
        if (r.top < sr.top || r.bottom > sr.bottom) sidebar.scrollTop += r.top - sr.top - sr.height / 3;
      }
    }
  }

  function renderOverall() {
    const stats = sumStats(Course.flatChapters());
    $('#overall').innerHTML = `${bar(stats)}<span class="overall-pct">${pct(stats)}%</span>`;
    $('#overall').title = `${stats.done} of ${stats.total} steps completed`;
  }

  function refreshProgress() {
    renderSidebar(false);
    renderOverall();
    document.querySelectorAll('.step-dot').forEach((dot) => dot.classList.toggle('done', Progress.isDone(dot.dataset.key)));
    const badge = $('.done-badge');
    if (badge && route.key) badge.hidden = !Progress.isDone(route.key);
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- pages ---------- */

  function renderHome() {
    const stats = sumStats(Course.flatChapters());
    const last = Progress.getLast();
    const first = firstStepHash();
    main.innerHTML = `
      <div class="page home">
        <section class="hero">
          <p class="eyebrow">Your learning path</p>
          <h1>From your first HTML tag to full-stack apps</h1>
          <p class="lead">Bite-sized lessons with a live code editor, mini projects after each module and three capstone projects. Nothing is locked, so jump to any chapter whenever you like.</p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="${last || first}">${last ? 'Continue where you left off &rarr;' : 'Start learning &rarr;'}</a>
            ${last ? `<a class="btn btn-ghost" href="${first}">Start from the beginning</a>` : ''}
          </div>
          <div class="hero-progress">${bar(stats)}<span>${stats.done} of ${stats.total} available steps done</span></div>
        </section>
        <h2 class="section-title">All modules</h2>
        <div class="module-grid">
          ${Course.modules.map((m) => {
            const s = moduleStats(m);
            return `
            <a class="module-card ${m.badge === '★' ? 'is-capstone' : ''}" href="${hashFor(m)}">
              <span class="mod-badge lg">${esc(m.badge)}</span>
              <span class="module-card-body">
                <span class="module-card-title">${esc(m.title)}</span>
                <span class="module-card-blurb">${esc(m.blurb)}</span>
                <span class="module-card-meta">
                  ${s.total ? `${bar(s)}<span>${pct(s)}%</span>` : '<span class="tag">Coming soon</span>'}
                  <span class="muted">${m.chapters.length} chapter${m.chapters.length > 1 ? 's' : ''}</span>
                </span>
              </span>
            </a>`;
          }).join('')}
        </div>
      </div>`;
  }

  function renderModule(m) {
    const s = moduleStats(m);
    main.innerHTML = `
      <div class="page">
        <a class="crumb" href="#/">&larr; All modules</a>
        <header class="module-head">
          <span class="mod-badge xl">${esc(m.badge)}</span>
          <div>
            <h1>${esc(m.title)}</h1>
            <p class="lead">${esc(m.blurb)}</p>
            ${s.total ? `<div class="hero-progress">${bar(s)}<span>${s.done} of ${s.total} steps done</span></div>` : ''}
          </div>
        </header>
        <ol class="chapter-list">
          ${m.chapters.map((ch, i) => {
            const st = chapterStatus(m, ch);
            const cs = chapterStats(m, ch);
            const tag = ch.kind === 'lesson' ? '' : `<span class="tag tag-${ch.kind}">${ch.kind === 'project' ? 'Mini project' : 'Capstone'}</span>`;
            return `
            <li><a class="chapter-row st-${st}" href="${hashFor(m, ch)}">
              <span class="chapter-num">${st === 'done' ? '✓' : i + 1}</span>
              <span class="chapter-info">
                <span class="chapter-title">${esc(ch.title)} ${tag}</span>
                <span class="muted">${cs.total ? `${cs.total} steps &middot; ${cs.done} done` : 'Coming soon'}</span>
              </span>
              <span class="chapter-go" aria-hidden="true">&rarr;</span>
            </a></li>`;
          }).join('')}
        </ol>
      </div>`;
  }

  function renderComingSoon(m, ch) {
    main.innerHTML = `
      <div class="page">
        <a class="crumb" href="${hashFor(m)}">&larr; Module ${esc(m.badge)}: ${esc(m.title)}</a>
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">&#128679;</div>
          <h1>${esc(ch.title)}</h1>
          <p>This chapter is part of your path but its lessons haven't been written yet. They're coming in a later build.</p>
          <p class="muted">${esc(m.blurb)}</p>
          <a class="btn btn-primary" href="#/">Back to all modules</a>
        </div>
      </div>`;
  }

  function neighbours(m, ch, idx) {
    const flat = Course.flatChapters();
    const pos = flat.findIndex((x) => x.ch === ch);
    let next;
    if (idx < ch.steps.length - 1) next = hashFor(m, ch, idx + 1);
    else next = flat[pos + 1] ? hashFor(flat[pos + 1].m, flat[pos + 1].ch) : '#/';
    let prev;
    if (idx > 0) prev = hashFor(m, ch, idx - 1);
    else if (flat[pos - 1]) {
      const p = flat[pos - 1];
      prev = p.ch.steps.length ? hashFor(p.m, p.ch, p.ch.steps.length - 1) : hashFor(p.m, p.ch);
    } else prev = hashFor(m);
    return { next, prev, isLast: idx === ch.steps.length - 1, nextChapter: flat[pos + 1] };
  }

  function renderLesson(m, ch, idx) {
    idx = Math.max(0, Math.min(idx, ch.steps.length - 1));
    const step = ch.steps[idx];
    const key = Course.stepKey(m, ch, idx);
    route.key = key;
    Progress.setLast(hashFor(m, ch, idx));

    const kind = step.type === 'project' && ch.kind === 'capstone' ? 'capstone' : step.type;
    const wide = !!step.starter;
    const nav = neighbours(m, ch, idx);

    main.innerHTML = `
      <div class="lesson ${wide ? 'wide' : ''}">
        <header class="lesson-head">
          <a class="crumb" href="${hashFor(m)}">Module ${esc(m.badge)} &middot; ${esc(m.title)}</a>
          <h1 class="chapter-heading">${esc(ch.title)}</h1>
          <nav class="step-dots" aria-label="Steps in this chapter">
            ${ch.steps.map((s, i) => {
              const k = Course.stepKey(m, ch, i);
              return `<a class="step-dot ${Progress.isDone(k) ? 'done' : ''}" data-key="${k}" href="${hashFor(m, ch, i)}"
                ${i === idx ? 'aria-current="step"' : ''} title="${i + 1}. ${esc(s.title)}"><span class="sr-only">Step ${i + 1}: ${esc(s.title)}</span></a>`;
            }).join('')}
          </nav>
        </header>

        <section class="step step-${step.type}" aria-labelledby="stepTitle">
          <div class="step-text">
            <div class="step-meta">
              <span class="kind kind-${kind}">${KIND_LABEL[kind] || 'Learn'}</span>
              <span class="muted">Step ${idx + 1} of ${ch.steps.length}</span>
              <span class="done-badge" ${Progress.isDone(key) ? '' : 'hidden'}>&#10003; Completed</span>
            </div>
            <h2 id="stepTitle">${esc(step.title)}</h2>
            ${renderBody(step.body)}
            ${step.goal ? `<div class="goal"><span class="goal-label">Your goal</span>${renderBody(step.goal)}</div>` : ''}
            ${step.tasks ? renderTasks(step, key) : ''}
            ${renderHints(step.hint)}
          </div>
          ${step.starter ? `
            <div class="ws-host"></div>
            <div class="feedback" role="status" aria-live="polite"></div>
            ${renderSolution(step.solution)}` : ''}
          ${!step.starter && step.type !== 'explain' ? `<div class="manual-done"><button type="button" class="btn btn-secondary" id="markDone">${Progress.isDone(key) ? '&#10003; Marked as done' : 'Mark this step as done'}</button></div>` : ''}
        </section>

        <footer class="lesson-nav">
          <a class="btn btn-ghost" href="${nav.prev}" id="prevBtn">&larr; Back</a>
          <span class="muted nav-count">${idx + 1} / ${ch.steps.length}</span>
          <button type="button" class="btn btn-primary" id="nextBtn">${nav.isLast ? (nav.nextChapter ? 'Finish chapter &rarr;' : 'Finish course 🎉') : 'Continue &rarr;'}</button>
        </footer>
      </div>`;

    // Live editor
    if (step.starter) {
      const feedback = $('.feedback');
      workspace = Editor.create($('.ws-host'), {
        key,
        starter: step.starter,
        mode: step.mode || (step.starter.jsx != null ? 'react' : step.starter.sql != null ? 'sql' : step.starter.html == null && step.starter.css == null ? 'js' : 'web'),
        check: step.check,
        checkDelay: step.checkDelay,
        extra: { setup: step.setup, sqlite: step.sqlite, tryRequests: step.tryRequests, env: step.env },
        onResult: ({ pass, msg }) => {
          if (pass) {
            feedback.innerHTML = `<div class="fb fb-pass"><strong>&#10003; Correct!</strong> ${inline(step.success || 'Nice work. Continue when you are ready.')}</div>`;
            if (!Progress.isDone(key)) { Progress.setDone(key); refreshProgress(); }
            $('#nextBtn').classList.add('pulse');
          } else {
            feedback.innerHTML = `<div class="fb fb-fail"><strong>Not quite.</strong> ${inline(msg)}
              <button type="button" class="link-btn" id="forceDone">Mark as done anyway</button></div>`;
            $('#forceDone').addEventListener('click', () => {
              Progress.setDone(key); refreshProgress();
              feedback.innerHTML = '<div class="fb fb-pass">Marked as done.</div>';
            });
          }
        },
      });
      const useBtn = $('[data-use-solution]');
      if (useBtn) useBtn.addEventListener('click', () => {
        if (confirm('Replace your code with the solution?')) workspace.setFiles(step.solution);
      });
    }

    // Project checklist
    main.querySelectorAll('.task-list input').forEach((box) => box.addEventListener('change', () => {
      const ticks = Array.from(main.querySelectorAll('.task-list input')).map((b) => b.checked);
      Progress.setTasks(key, ticks);
      if (ticks.every(Boolean) && !Progress.isDone(key)) {
        Progress.setDone(key);
        toast('Checklist complete! 🎉');
      }
      refreshProgress();
    }));

    const markDone = $('#markDone');
    if (markDone) markDone.addEventListener('click', () => {
      const now = !Progress.isDone(key);
      Progress.setDone(key, now);
      markDone.innerHTML = now ? '&#10003; Marked as done' : 'Mark this step as done';
      refreshProgress();
    });

    $('#nextBtn').addEventListener('click', () => goNext(m, ch, idx));
  }

  function goNext(m, ch, idx) {
    const step = ch.steps[idx];
    const key = Course.stepKey(m, ch, idx);
    if (step.type === 'explain') Progress.setDone(key);
    const nav = neighbours(m, ch, idx);
    if (nav.isLast) {
      const { done, total } = chapterStats(m, ch);
      toast(done === total ? `Chapter complete! 🎉 ${ch.title}` : `Chapter finished. ${total - done} step(s) not marked done yet; you can come back anytime.`);
    }
    location.hash = nav.next;
  }

  function renderTasks(step, key) {
    const ticks = Progress.getTasks(key);
    return `<div class="tasks"><h3>Your checklist</h3><ul class="task-list">
      ${step.tasks.map((t, i) => `<li><label><input type="checkbox" ${ticks[i] ? 'checked' : ''}><span>${inline(t)}</span></label></li>`).join('')}
    </ul></div>`;
  }

  function renderHints(hint) {
    if (!hint) return '';
    const hints = Array.isArray(hint) && hint.every((h) => Array.isArray(h)) ? hint : [hint];
    return hints.map((h, i) => `<details class="hint"><summary>&#128161; ${hints.length > 1 ? `Hint ${i + 1}` : 'Need a hint?'}</summary>${renderBody(h)}</details>`).join('');
  }

  function renderSolution(solution) {
    if (!solution) return '';
    return `<details class="solution"><summary>Show solution</summary>
      ${Object.entries(solution).map(([f, code]) => codeBlock(code, Editor.LANGS[f] || f)).join('')}
      <button type="button" class="btn btn-ghost" data-use-solution>Copy solution into the editor</button>
    </details>`;
  }

  /* ---------- router ---------- */

  function parseHash() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    return { m: parts[0], c: parts[1], s: parts[2] ? parseInt(parts[2], 10) - 1 : 0 };
  }

  function render() {
    if (workspace) { workspace.destroy(); workspace = null; }
    route = parseHash();
    const m = route.m && Course.getModule(route.m);
    const ch = m && route.c && Course.getChapter(m, route.c);
    if (m) openModules.add(m.id);

    if (!m) { route = {}; renderHome(); }
    else if (!ch) { route.c = null; renderModule(m); }
    else if (!ch.steps.length) renderComingSoon(m, ch);
    else renderLesson(m, ch, isNaN(route.s) ? 0 : route.s);

    renderSidebar(true);
    renderOverall();
    closeMenu();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  /* ---------- mobile menu, theme, keyboard ---------- */

  const menuBtn = $('#menuBtn');
  const scrim = $('#scrim');
  function closeMenu() {
    sidebar.classList.remove('open');
    scrim.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    const open = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    scrim.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  scrim.addEventListener('click', closeMenu);

  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('learnpath.theme', root.dataset.theme); } catch (e) {}
  });

  // ← / → move between steps (when you're not typing in an editor or form).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable], summary, details')) return;
    if (e.key === 'ArrowRight' && $('#nextBtn')) $('#nextBtn').click();
    if (e.key === 'ArrowLeft' && $('#prevBtn')) location.hash = $('#prevBtn').getAttribute('href');
  });

  window.addEventListener('hashchange', render);
  render();
})();
