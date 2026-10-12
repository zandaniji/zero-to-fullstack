/* highlight.js — a tiny syntax highlighter for the code examples in lessons. */
const Highlight = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const JS_KEYWORDS = 'const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|new|class|extends|super|import|export|from|as|async|await|try|catch|finally|throw|typeof|instanceof|of|in|this|null|undefined|true|false|delete|void|yield|static|get|set';
  const SQL_KEYWORDS = 'select|from|where|insert|into|values|update|set|delete|create|table|drop|alter|add|primary|key|foreign|references|not|null|and|or|order|by|group|having|limit|offset|join|left|right|inner|outer|on|as|distinct|count|sum|avg|min|max|integer|text|real|boolean|default|unique|autoincrement|asc|desc|like|in|is|exists';

  const js = [
    ['com', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['str', /`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y],
    ['kw', new RegExp('\\b(?:' + JS_KEYWORDS + ')\\b', 'y')],
    ['num', /\b\d[\d_]*(?:\.\d+)?\b/y],
    ['fn', /[A-Za-z_$][\w$]*(?=\s*\()/y],
    ['', /[A-Za-z_$][\w$]*/y],
  ];

  const RULES = {
    js,
    jsx: [js[0], js[1], ['tag', /<\/?[A-Za-z][\w.]*|\/>/y], ...js.slice(2)],
    html: [
      ['com', /<!--[\s\S]*?-->/y],
      ['tag', /<!DOCTYPE[^>]*>|<\/?[A-Za-z][\w-]*|\/?>/iy],
      ['attr', /[A-Za-z-:@]+(?==)/y],
      ['str', /(?<==)(?:"[^"]*"|'[^']*')/y],
      ['', /[A-Za-z]+/y],
    ],
    css: [
      ['com', /\/\*[\s\S]*?\*\//y],
      ['sel', /^[^{}\n]+?(?=\s*\{)/my],
      ['str', /"[^"\n]*"|'[^'\n]*'/y],
      ['kw', /@[\w-]+/y],
      ['prop', /(?<=[{;][ \t]*|^[ \t]+)[a-z-]+(?=\s*:)/my],
      ['num', /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|vmin|vmax|ms|s|fr|deg|ch)?/y],
      ['', /[A-Za-z-]+/y],
    ],
    sql: [
      ['com', /--[^\n]*/y],
      ['str', /'(?:''|[^'])*'/y],
      ['kw', new RegExp('\\b(?:' + SQL_KEYWORDS + ')\\b', 'iy')],
      ['num', /\b\d+(?:\.\d+)?\b/y],
      ['', /[A-Za-z_]\w*/y],
    ],
    bash: [
      ['com', /#[^\n]*/y],
      ['str', /"[^"\n]*"|'[^'\n]*'/y],
      ['kw', /\b(?:npm|npx|node|cd|mkdir|git|ls|curl)\b/y],
      ['', /[A-Za-z_][\w-]*/y],
    ],
  };

  function highlight(code, lang) {
    const rules = RULES[lang];
    if (!rules) return esc(code);
    let out = '';
    let plain = '';
    let i = 0;
    outer: while (i < code.length) {
      for (const [cls, re] of rules) {
        re.lastIndex = i;
        const m = re.exec(code);
        if (m && m[0].length) {
          if (plain) { out += esc(plain); plain = ''; }
          out += cls ? `<span class="tok-${cls}">${esc(m[0])}</span>` : esc(m[0]);
          i += m[0].length;
          continue outer;
        }
      }
      plain += code[i++];
    }
    return out + esc(plain);
  }

  return { highlight, esc };
})();
