// ============================================================
// Store 
// ============================================================
(function () {
'use strict';

const KEY = 'aihl-orbit-v1';

const DEFAULTS = {
  theme: 'light',
  xp: 0,
  streak: { last: '', days: 0 },
  flags: {},        // qid -> 'easy' | 'med' | 'hard' | 'review'
  attempts: [],     // { q, u, ok, first, ts }   (u = unit id)
  over: {},         // syllabus code -> 'done' | 'need'  (personal override)
  mynotes: {},      // unit id -> your own typed notes
  synced: 0,        // how many attempts the cloud has already stored
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

  noteOf(unitId) { return state.mynotes[unitId] || ''; },
  setNote(unitId, text) {
    if (text && text.trim()) state.mynotes[unitId] = text;
    else delete state.mynotes[unitId];
    save();
  },

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

  resetProgress() {
    const theme = state.theme;
    state = JSON.parse(JSON.stringify(DEFAULTS));
    state.theme = theme;
    save();
  },
  // ---------- cloud sync support ----------
  unsyncedAttempts() { return state.attempts.slice(state.synced); },
  markSynced() { state.synced = state.attempts.length; save(); },
  exportData() {
    return { flags: state.flags, over: state.over, streak: state.streak, mynotes: state.mynotes };
  },
  // Merge the cloud copy with this device, then recompute xp + streak
  // from the combined attempt log so every device agrees.
  mergeCloud(remoteAttempts, remoteData) {
    const seen = new Set();
    const all = [];
    state.attempts.concat(remoteAttempts || []).forEach(a => {
      const k = a.q + '|' + a.ts;
      if (seen.has(k)) return;
      seen.add(k);
      all.push(a);
    });
    all.sort((a, b) => a.ts - b.ts);
    // an attempt that already lives on the server counts as synced;
    // exact bookkeeping: everything currently merged minus local-fresh ones
    const freshLocal = state.attempts.slice(state.synced)
      .filter(a => !(remoteAttempts || []).some(r => r.q === a.q && r.ts === a.ts));
    state.attempts = all;
    state.synced = all.length - freshLocal.length;
    // recompute xp: 10 per question ever answered correctly
    const solved = new Set();
    all.forEach(a => { if (a.ok) solved.add(a.q); });
    state.xp = solved.size * 10;
    // recompute streak from the days you actually practised
    const days = new Set(all.map(a => dayKey(new Date(a.ts))));
    let d = new Date(), run = 0;
    if (!days.has(dayKey(d))) d = new Date(Date.now() - 86400000);   // streak may end yesterday
    while (days.has(dayKey(d))) { run++; d = new Date(d.getTime() - 86400000); }
    if (run) state.streak = { last: dayKey(new Date(days.has(dayKey(new Date())) ? Date.now() : Date.now() - 86400000)), days: run };
    // flags / overrides: remote first, local edits win
    state.flags = Object.assign({}, (remoteData && remoteData.flags) || {}, state.flags);
    state.over = Object.assign({}, (remoteData && remoteData.over) || {}, state.over);
    state.mynotes = Object.assign({}, (remoteData && remoteData.mynotes) || {}, state.mynotes);
    save();
  },
};

window.S = S;
})();
