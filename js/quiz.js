// ============================================================
// Quiz engine — renders questions, checks answers, logs progress.
// Numeric answers accept expressions: 1/3, 8*pi, sqrt(2), 2*ln(2)
// ============================================================
(function () {
'use strict';

// ---------- tiny expression evaluator ----------
const CONST = { pi: Math.PI, e: Math.E };
const FUNCS = { sqrt: Math.sqrt, ln: Math.log, log: Math.log10, exp: Math.exp, sin: Math.sin, cos: Math.cos, tan: Math.tan, abs: Math.abs };

function tokenize(s) {
  const t = [];
  let i = 0;
  s = s.replace(/\s+/g, '').replace(/−/g, '-');
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      t.push({ k: 'num', v: parseFloat(s.slice(i, j)) });
      i = j;
    } else if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      t.push({ k: 'id', v: s.slice(i, j).toLowerCase() });
      i = j;
    } else if ('+-*/^(),'.includes(c)) {
      t.push({ k: c }); i++;
    } else {
      throw new Error('bad char ' + c);
    }
  }
  // implicit multiplication: 2pi, 3(…), )( , pi( etc.
  const out = [];
  for (let k = 0; k < t.length; k++) {
    out.push(t[k]);
    const a = t[k], b = t[k + 1];
    if (!b) continue;
    const aEnds = a.k === 'num' || a.k === ')' || (a.k === 'id' && !FUNCS[a.v]);
    const bStarts = b.k === 'num' || b.k === '(' || b.k === 'id';
    if (aEnds && bStarts) out.push({ k: '*' });
  }
  return out;
}

function evalExpr(s) {
  const t = tokenize(s);
  let p = 0;
  function expr() {
    let v = term();
    while (p < t.length && (t[p].k === '+' || t[p].k === '-')) {
      const op = t[p++].k;
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  function term() {
    let v = unary();
    while (p < t.length && (t[p].k === '*' || t[p].k === '/')) {
      const op = t[p++].k;
      const r = unary();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }
  function unary() {
    if (p < t.length && t[p].k === '-') { p++; return -unary(); }
    if (p < t.length && t[p].k === '+') { p++; return unary(); }
    return power();
  }
  function power() {
    const base = atom();
    if (p < t.length && t[p].k === '^') { p++; return Math.pow(base, unary()); }
    return base;
  }
  function atom() {
    const tk = t[p];
    if (!tk) throw new Error('unexpected end');
    if (tk.k === 'num') { p++; return tk.v; }
    if (tk.k === 'id') {
      p++;
      if (FUNCS[tk.v]) {
        if (!t[p] || t[p].k !== '(') throw new Error('need (');
        p++;
        const v = expr();
        if (!t[p] || t[p].k !== ')') throw new Error('need )');
        p++;
        return FUNCS[tk.v](v);
      }
      if (CONST[tk.v] !== undefined) return CONST[tk.v];
      throw new Error('unknown ' + tk.v);
    }
    if (tk.k === '(') {
      p++;
      const v = expr();
      if (!t[p] || t[p].k !== ')') throw new Error('need )');
      p++;
      return v;
    }
    throw new Error('unexpected ' + tk.k);
  }
  const v = expr();
  if (p !== t.length) throw new Error('trailing input');
  if (!isFinite(v)) throw new Error('not finite');
  return v;
}

function checkNumeric(input, ansExpr, tolAbs) {
  const parseList = s => String(s).split(',').map(x => x.trim()).filter(Boolean).map(evalExpr);
  let got, want;
  try { got = parseList(input); want = parseList(ansExpr); } catch (e) { return { ok: false, parsed: false }; }
  if (!got.length || got.length !== want.length) return { ok: false, parsed: got.length > 0 };
  const used = new Array(want.length).fill(false);
  const tolFor = w => tolAbs != null ? tolAbs : Math.max(0.001, Math.abs(w) * 0.002);
  for (const g of got) {
    let hit = -1;
    for (let i = 0; i < want.length; i++) {
      if (!used[i] && Math.abs(g - want[i]) <= tolFor(want[i])) { hit = i; break; }
    }
    if (hit === -1) return { ok: false, parsed: true };
    used[hit] = true;
  }
  return { ok: true, parsed: true };
}

// ---------- question renderer ----------
const DLBL = { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Challenge' };

function render(q, host) {
  const card = document.createElement('div');
  card.className = 'card q-card';
  card.id = 'q-' + q.id;

  const head = document.createElement('div');
  head.className = 'q-head';
  head.innerHTML = '<span class="badge d' + q.d + '">' + DLBL[q.d] + '</span>' +
    '<span class="badge sub">' + q.sub + '</span><span class="q-id">' + q.id + '</span>';
  card.appendChild(head);

  const stem = document.createElement('div');
  stem.className = 'q-stem';
  stem.innerHTML = MT.render(q.q);
  card.appendChild(stem);

  let logged = false;
  const logOnce = ok => {
    if (logged) return;
    logged = true;
    const first = !S.attempts.some(a => a.q === q.id && a.ok);
    S.addAttempt({ q: q.id, u: q.unit, ok, first });
    if (window.App) App.refreshChips();
  };

  // Kitty reaction bubble — the mascot cheers or giggles at you
  const showKittyReaction = (correct, container) => {
    const msgs = correct ?
      ['Purrfect!', 'Meow-nificent!', 'Pawsome!', 'The kitty approves.', 'Nailed it.'] :
      ['Mrrp... not quite.', 'The kitty giggles.', 'Hiss. Try again!', 'Meow? Nope.', 'The kitty judges you, lovingly.'];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    const old = container.querySelector('.kitty-pop');
    if (old) old.remove();
    const pop = document.createElement('div');
    pop.className = 'kitty-pop ' + (correct ? 'happy' : 'sad');
    pop.innerHTML = KITTY.svg(26) + '<span>' + msg + '</span>';
    container.appendChild(pop);
    setTimeout(() => pop.remove(), 1700);
  };

  if (q.type === 'mcq') {
    const opts = document.createElement('div');
    opts.className = 'q-opts';
    q.opts.forEach((o, oi) => {
      const b = document.createElement('button');
      b.className = 'q-opt';
      b.innerHTML = MT.render(o);
      b.onclick = () => {
        if (oi === q.a) {
          logOnce(!card.querySelector('.q-opt.wrong'));
          b.classList.add('correct');
          opts.querySelectorAll('.q-opt').forEach(x => (x.disabled = true));
          showKittyReaction(true, card);
        } else {
          logOnce(false);
          b.classList.add('wrong');
          b.disabled = true;
          showKittyReaction(false, card);
        }
      };
      opts.appendChild(b);
    });
    card.appendChild(opts);
  } else {
    const row = document.createElement('div');
    row.className = 'num-row';
    const inp = document.createElement('input');
    inp.className = 'num-in';
    inp.placeholder = q.hint || 'answer';
    inp.autocomplete = 'off';
    const btn = document.createElement('button');
    btn.className = 'btn small';
    btn.textContent = 'Check';
    const verdict = document.createElement('span');
    verdict.className = 'verdict';
    const doCheck = () => {
      if (!inp.value.trim()) return;
      const res = checkNumeric(inp.value, q.ans, q.tol);
      logOnce(res.ok);
      inp.classList.remove('ok', 'no');
      inp.classList.add(res.ok ? 'ok' : 'no');
      verdict.className = 'verdict ' + (res.ok ? 'ok' : 'no');
      verdict.textContent = res.ok ? '✓ correct' : (res.parsed ? '✗ not quite — try again or reveal' : "✗ couldn't read that (try e.g. 1/3, 8*pi, sqrt(2))");
      showKittyReaction(res.ok, card);
    };
    btn.onclick = doCheck;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') doCheck(); });
    row.appendChild(inp); row.appendChild(btn); row.appendChild(verdict);
    card.appendChild(row);
  }

  // ---- hidden answer / solution ----
  const actions = document.createElement('div');
  actions.className = 'q-actions';
  const ansBox = document.createElement('div');
  ansBox.className = 'ans-box';
  ansBox.hidden = true;
  ansBox.innerHTML = '<b>Answer:</b> ' + MT.render(q.type === 'mcq' ? q.opts[q.a] : (q.ansTeX || q.ans));
  const solBox = document.createElement('div');
  solBox.className = 'sol-box';
  solBox.hidden = true;
  solBox.innerHTML = '<b>Solution</b>' +
    (q.sol || []).map((s, i) => '<div class="sol-step">' + (i + 1) + '. ' + MT.render(s) + '</div>').join('') +
    (q.mist ? '<div class="mist-box"><b>Common mistake:</b> ' + MT.render(q.mist) + '</div>' : '');
  const mkBtn = (label, box) => {
    const b = document.createElement('button');
    b.className = 'reveal-btn';
    b.textContent = label;
    b.onclick = () => { box.hidden = !box.hidden; };
    return b;
  };
  actions.appendChild(mkBtn('Show answer', ansBox));
  actions.appendChild(mkBtn('Full solution', solBox));
  card.appendChild(actions);
  card.appendChild(ansBox);
  card.appendChild(solBox);

  // ---- personal difficulty flags ----
  const flags = document.createElement('div');
  flags.className = 'flag-row';
  flags.innerHTML = '<span class="flag-lbl">Mark:</span>';
  const FL = [['easy', 'Easy'], ['med', 'Medium'], ['hard', 'Hard'], ['review', 'Review later']];
  FL.forEach(([val, label]) => {
    const f = document.createElement('button');
    f.className = 'flag';
    f.textContent = label;
    const sync = () => {
      f.className = 'flag' + (S.flagOf(q.id) === val ? ' on-' + val : '');
    };
    sync();
    f.onclick = () => {
      S.flag(q.id, val);
      flags.querySelectorAll('.flag').forEach((x, i) => {
        x.className = 'flag' + (S.flagOf(q.id) === FL[i][0] ? ' on-' + FL[i][0] : '');
      });
    };
    flags.appendChild(f);
  });
  card.appendChild(flags);

  host.appendChild(card);
}

function renderList(qs, host, emptyMsg) {
  if (!qs.length) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = emptyMsg || 'Nothing here yet.';
    host.appendChild(d);
    return;
  }
  qs.forEach(q => render(q, host));
}

window.Quiz = { render, renderList, evalExpr, checkNumeric };
})();
