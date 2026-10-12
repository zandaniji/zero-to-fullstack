/* progress.js — remembers your progress in this browser (localStorage).
   Nothing here ever locks a chapter; it only records what you've done. */
const Progress = (() => {
  const KEY = 'learnpath.v1';
  const empty = () => ({ done: {}, code: {}, tasks: {}, last: null, sandbox: {} });
  let data = empty();

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) data = Object.assign(empty(), JSON.parse(raw));
  } catch (e) { /* private mode or blocked storage: progress just won't persist */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  return {
    isDone: (key) => !!data.done[key],
    setDone(key, value = true) {
      if (value) data.done[key] = true; else delete data.done[key];
      save();
    },

    getCode: (key) => data.code[key] || null,
    setCode(key, files) { data.code[key] = files; save(); },
    clearCode(key) { delete data.code[key]; save(); },

    getTasks: (key) => data.tasks[key] || [],
    setTasks(key, ticks) { data.tasks[key] = ticks; save(); },

    // localStorage used by your code inside the editor (shared by all exercises).
    getSandbox: () => data.sandbox || {},
    setSandbox(store) { data.sandbox = store; save(); },

    getLast: () => data.last,
    setLast(hash) { data.last = hash; save(); },

    reset() { data = empty(); save(); },
  };
})();
