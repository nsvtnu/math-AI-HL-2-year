// ============================================================
// MiniTeX — a tiny self-contained math renderer (no libraries).
// Supports: $inline$ and $$display$$ segments containing:
//   \frac{a}{b}  \sqrt{x}  \mathbf{v}  \text{words}
//   ^{sup} ^x   _{sub} _x
//   greek + symbol commands (\pi \theta \le \ge \ne \times ...)
//   function names (\sin \cos \ln \log ...) rendered upright
// Everything else renders as italic letters / plain digits.
// ============================================================
(function () {
'use strict';

const SYM = {
  pi: 'π', theta: 'θ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ',
  lambda: 'λ', mu: 'μ', sigma: 'σ', phi: 'φ', varphi: 'φ', omega: 'ω',
  Delta: 'Δ', Sigma: 'Σ', Omega: 'Ω',
  le: ' ≤ ', ge: ' ≥ ', ne: ' ≠ ', approx: ' ≈ ', equiv: ' ≡ ',
  times: ' × ', cdot: ' · ', div: ' ÷ ', pm: ' ± ', mp: ' ∓ ',
  to: ' → ', Rightarrow: ' ⇒ ', iff: ' ⇔ ', implies: ' ⇒ ',
  infty: '∞', circ: '∘', deg: '°', degree: '°',
  cap: ' ∩ ', cup: ' ∪ ', in: ' ∈ ', notin: ' ∉ ', subset: ' ⊂ ',
  ldots: '…', dots: '…', cdots: '⋯',
  sum: 'Σ', int: '∫', prod: 'Π',
  angle: '∠', triangle: '△', parallel: ' ∥ ', perp: ' ⊥ ',
  sim: ' ∼ ', propto: ' ∝ ', forall: '∀', exists: '∃', emptyset: '∅',
  prime: '′', quad: '  ', mid: ' | ',
};
const FN = ['arcsin','arccos','arctan','sinh','cosh','tanh','sin','cos','tan','sec','csc','cot','ln','log','exp','lim','max','min','arg','mod','Re','Im','var','gcd'];

function esc(c) {
  return c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c;
}

// parse math source -> HTML
function math(src) {
  let i = 0;
  const n = src.length;

  function command() {                       // after '\'
    let name = '';
    while (i < n && /[a-zA-Z]/.test(src[i])) name += src[i++];
    if (name === 'frac') {
      const a = grp(), b = grp();
      return '<span class="mfrac"><span class="fnum">' + a + '</span><span class="fden">' + b + '</span></span>';
    }
    if (name === 'sqrt') return '<span class="msqrt-sign">√</span><span class="msqrt">' + grp() + '</span>';
    if (name === 'mathbf' || name === 'vec' || name === 'boldsymbol') return '<b>' + grp() + '</b>';
    if (name === 'text' || name === 'mathrm') return '<span class="fn">' + grp() + '</span>';
    if (FN.includes(name)) return '<span class="fn">' + name + '</span>';
    if (SYM[name] !== undefined) return SYM[name];
    if (name === 'left' || name === 'right' || name === 'displaystyle') return '';
    if (name === '') { // escaped char like \{ \} \, \; \!
      const c = src[i++] || '';
      if (c === ',' || c === ';') return '&thinsp;';
      if (c === '!') return '';
      return esc(c);
    }
    return '<span class="fn">' + name + '</span>';   // unknown: show upright
  }

  function grp() {                           // read {…} (or single atom)
    if (src[i] === '{') {
      i++;
      let depth = 1, out = '';
      const start = i;
      while (i < n && depth > 0) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') depth--;
        if (depth > 0) i++;
      }
      const inner = src.slice(start, i);
      i++; // consume '}'
      return math(inner);
    }
    return atom();
  }

  function atom() {                          // single char or command
    if (i >= n) return '';
    const c = src[i];
    if (c === '\\') { i++; return command(); }
    if (c === '{') return grp();
    i++;
    return charHTML(c);
  }

  function charHTML(c) {
    if (/[a-zA-Z]/.test(c)) return '<i>' + c + '</i>';
    if (c === '-') return ' − ';
    if (c === '+') return ' + ';
    if (c === '=') return ' = ';
    if (c === '<') return ' &lt; ';
    if (c === '>') return ' &gt; ';
    if (c === '*') return ' × ';
    return esc(c);
  }

  let out = '';
  while (i < n) {
    const c = src[i];
    if (c === '\\') { i++; out += command(); continue; }
    if (c === '{') { out += grp(); continue; }
    if (c === '^') { i++; out += '<sup>' + grp() + '</sup>'; continue; }
    if (c === '_') { i++; out += '<sub>' + grp() + '</sub>'; continue; }
    i++;
    out += charHTML(c);
  }
  return out;
}

// transform $$..$$ and $..$ inside a content string
function render(str) {
  if (str == null) return '';
  let out = '';
  let i = 0;
  const n = str.length;
  while (i < n) {
    if (str[i] === '$') {
      const display = str[i + 1] === '$';
      const open = display ? 2 : 1;
      const close = str.indexOf(display ? '$$' : '$', i + open);
      if (close === -1) { out += str.slice(i); break; }
      const inner = str.slice(i + open, close);
      const html = '<span class="mt">' + math(inner) + '</span>';
      out += display ? '<span class="mt-block">' + html + '</span>' : html;
      i = close + open;
    } else {
      out += str[i++];
    }
  }
  return out;
}

window.MT = { render, math };
})();
