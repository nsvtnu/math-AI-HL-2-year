// ============================================================
// Store — all persistence in localStorage. No network, ever.
// ============================================================
(function () {
'use strict';

const KEY = 'aihl-orbit-v1';

const DEFAULTS = {
  theme: 'light',
  xp: 0,
  streak: { last: '', days: 0 },
  flags: {},        // qid -> 'easy' | 'med' | 'hard' | 'review'
  attempts: [],     // { q, u, ok, ts }   (u = unit id)
  over: {},         // syllabus code -> 'done' | 'need'  (personal override)
};

let state = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && typeof raw === 'object') return Object.assign({}, DEFAULTS, raw);
  } catch (e) { /* fresh */ }
  return JSON.parse(JSON.stringify(DEFAULTS));
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* blocked */ }
}
function dayKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function bumpStreak() {
  const t = dayKey(new Date());
  if (state.streak.last === t) return;
  const yk = dayKey(new Date(Date.now() - 86400000));
  state.streak.days = (state.streak.last === yk) ? state.streak.days + 1 : 1;
  state.streak.last = t;
}

const S = {
  get theme() { return state.theme; },
  toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    save();
    document.documentElement.setAttribute('data-theme', state.theme);
  },
  applyTheme() { document.documentElement.setAttribute('data-theme', state.theme); },

  get xp() { return state.xp; },
  get streakDays() {
    const t = dayKey(new Date()), yk = dayKey(new Date(Date.now() - 86400000));
    return (state.streak.last === t || state.streak.last === yk) ? state.streak.days : 0;
  },

  addAttempt(rec) {                    // {q, u, ok}
    bumpStreak();
    state.attempts.push(Object.assign({ ts: Date.now() }, rec));
    if (rec.ok && rec.first) state.xp += 10;
    save();
  },
  get attempts() { return state.attempts; },

  flag(qid, val) {
    if (state.flags[qid] === val) delete state.flags[qid];
    else state.flags[qid] = val;
    save();
  },
  flagOf(qid) { return state.flags[qid] || null; },
  flagged(val) { return Object.keys(state.flags).filter(k => state.flags[k] === val); },

  setOver(code, val) {                 // cycle personal syllabus status
    if (val) state.over[code] = val; else delete state.over[code];
    save();
  },
  overOf(code) { return state.over[code] || null; },

  unitStats(unitId, bank) {
    const qs = bank.filter(q => q.unit === unitId);
    const correct = new Set();
    let n = 0, ok = 0;
    state.attempts.forEach(a => {
      if (a.u !== unitId) return;
      n++;
      if (a.ok) { ok++; correct.add(a.q); }
    });
    return { total: qs.length, correct: correct.size, attempts: n, acc: n ? Math.round(100 * ok / n) : null };
  },
  overall() {
    const att = state.attempts;
    return {
      attempts: att.length,
      correct: att.filter(a => a.ok).length,
      acc: att.length ? Math.round(100 * att.filter(a => a.ok).length / att.length) : null,
    };
  },
};

window.S = S;
})();
