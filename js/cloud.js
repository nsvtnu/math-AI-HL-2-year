// ============================================================
// Cloud — accounts, sync, leaderboard, class stats (Firebase).
// Plain fetch() against the Firebase Auth + Firestore REST APIs;
// no SDKs, no build step. The app works fully offline and
// signed out — this layer only adds sync on top.
//
// Firestore layout:
//   users/{uid}        private: attempts log, flags, syllabus marks
//   leaderboard/{uid}  public row: username, xp, solved, streak
//   qstats/{qid}       public counters: attempts, correct
// ============================================================
(function () {
'use strict';

const SKEY = 'mathkitty-session';
const cfg = typeof CLOUD_CONFIG !== 'undefined' ? CLOUD_CONFIG : {};
const configured = /^AIza[\w-]{30,}$/.test(cfg.apiKey || '') && /^[a-z0-9-]{4,}$/.test(cfg.projectId || '');
const DOC_PATH = 'projects/' + cfg.projectId + '/databases/(default)/documents';
const DOCS = 'https://firestore.googleapis.com/v1/' + DOC_PATH;

let session = loadSession();
let statusCb = null;
let statCache = null;
let pushTimer = null;
let syncing = false;

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SKEY)) || null; } catch (e) { return null; }
}
function saveSession(s) {
  session = s;
  try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch (e) {}
}
function setStatus(st) { if (statusCb) statusCb(st); }   // 'off' | 'syncing' | 'ok' | 'error'

// Usernames are mapped to internal addresses; no real mail is ever sent.
function emailFor(username) { return username.toLowerCase() + '@users.mathkitty.app'; }
function validUsername(u) { return /^[A-Za-z0-9_]{3,16}$/.test(u); }

// ---------- Firestore value encoding ----------
function enc(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } };
  const fields = {};
  Object.keys(v).forEach(k => { fields[k] = enc(v[k]); });
  return { mapValue: { fields } };
}
function dec(f) {
  if (!f) return null;
  if ('booleanValue' in f) return f.booleanValue;
  if ('integerValue' in f) return Number(f.integerValue);
  if ('doubleValue' in f) return f.doubleValue;
  if ('stringValue' in f) return f.stringValue;
  if ('timestampValue' in f) return Date.parse(f.timestampValue);
  if ('arrayValue' in f) return (f.arrayValue.values || []).map(dec);
  if ('mapValue' in f) return decFields(f.mapValue.fields || {});
  return null;
}
function decFields(fields) {
  const o = {};
  Object.keys(fields || {}).forEach(k => { o[k] = dec(fields[k]); });
  return o;
}

// ---------- transport ----------
const AUTH_MSG = {
  API_KEY_INVALID: 'The Firebase apiKey in js/config.js is wrong — re-copy it from Project settings',
  API_KEY_NOT_VALID: 'The Firebase apiKey in js/config.js is wrong — re-copy it from Project settings',
  EMAIL_EXISTS: 'That username is taken',
  EMAIL_NOT_FOUND: 'Wrong username or password',
  INVALID_PASSWORD: 'Wrong username or password',
  INVALID_LOGIN_CREDENTIALS: 'Wrong username or password',
  WEAK_PASSWORD: 'Password needs at least 6 characters',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many tries — wait a minute and retry',
  CONFIGURATION_NOT_FOUND: 'Email/Password sign-in is not switched on in Firebase yet (setup step 2)',
  OPERATION_NOT_ALLOWED: 'Email/Password sign-in is not switched on in Firebase yet (setup step 2)',
};

async function authCall(method, body) {
  const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:' + method + '?key=' + cfg.apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ returnSecureToken: true }, body)),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const raw = ((data.error || {}).message || 'SIGN_IN_FAILED').split(' :')[0];
    const key = Object.keys(AUTH_MSG).find(k => raw.indexOf(k) === 0);
    throw new Error(key ? AUTH_MSG[key] : raw.replace(/_/g, ' ').toLowerCase());
  }
  return data;
}

async function store(path, opts) {
  opts = opts || {};
  await ensureFresh();
  const res = await fetch(DOCS + path, Object.assign({}, opts, {
    headers: Object.assign({
      Authorization: 'Bearer ' + session.id_token,
      'Content-Type': 'application/json',
    }, opts.headers || {}),
  }));
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = ((data || {}).error || {}).message || ('HTTP ' + res.status);
    const err = new Error(/permission|PERMISSION/i.test(msg)
      ? 'Firestore rules are blocking this — publish the rules from firestore-rules.txt (setup step 4)'
      : msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function ensureFresh() {
  if (!session) throw new Error('Not signed in');
  if (Date.now() < session.expires_at - 60000) return;
  const res = await fetch('https://securetoken.googleapis.com/v1/token?key=' + cfg.apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(session.refresh_token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id_token) { saveSession(null); setStatus('off'); throw new Error('Session expired — sign in again'); }
  saveSession({
    id_token: data.id_token, refresh_token: data.refresh_token,
    expires_at: Date.now() + Number(data.expires_in || 3600) * 1000,
    uid: session.uid, username: session.username,
  });
}

function sessionFrom(data, username) {
  return {
    id_token: data.idToken, refresh_token: data.refreshToken,
    expires_at: Date.now() + Number(data.expiresIn || 3600) * 1000,
    uid: data.localId, username: username.toLowerCase(),
  };
}

// ---------- accounts ----------
async function signUp(username, password) {
  if (!validUsername(username)) throw new Error('Username: 3-16 letters, numbers or _');
  if ((password || '').length < 6) throw new Error('Password needs at least 6 characters');
  const data = await authCall('signUp', { email: emailFor(username), password });
  saveSession(sessionFrom(data, username));
  await sync();
}

async function logIn(username, password) {
  if (!username || !password) throw new Error('Enter a username and password');
  const data = await authCall('signInWithPassword', { email: emailFor(username), password });
  saveSession(sessionFrom(data, username));
  await sync();
}

async function logOut() {
  saveSession(null);
  statCache = null;
  setStatus('off');
}

// ---------- sync ----------
function solvedCount() {
  const s = new Set();
  S.attempts.forEach(a => { if (a.ok) s.add(a.q); });
  return s.size;
}

async function sync() {
  if (!configured || !session || syncing) return;
  syncing = true;
  setStatus('syncing');
  try {
    // pull this account's document (404 on a brand-new account is fine)
    let remote = {};
    try {
      const doc = await store('/users/' + session.uid);
      remote = decFields((doc || {}).fields);
    } catch (e) {
      if (e.status !== 404) throw e;
    }
    S.mergeCloud(remote.attempts || [], remote);
    S.markSynced();

    // push the merged document back
    await store('/users/' + session.uid, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: enc(Object.assign({ username: session.username, attempts: S.attempts }, S.exportData())).mapValue.fields,
      }),
    });

    // push the public leaderboard row
    await store('/leaderboard/' + session.uid, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: enc({
          username: session.username,
          xp: S.xp,
          solved: solvedCount(),
          streakLast: (S.exportData().streak || {}).last || '',
          streakDays: (S.exportData().streak || {}).days || 0,
          updated: Date.now(),
        }).mapValue.fields,
      }),
    });

    setStatus('ok');
    if (window.App) App.refreshChips();
  } catch (e) {
    setStatus(session ? 'error' : 'off');
  } finally {
    syncing = false;
  }
}

// Called after each answer: bump the class counters, queue a sync.
function notifyAttempt(qid, ok) {
  if (!configured || !session) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(sync, 2500);
  if (!qid) return;
  const transforms = [{ fieldPath: 'attempts', increment: { integerValue: '1' } }];
  if (ok) transforms.push({ fieldPath: 'correct', increment: { integerValue: '1' } });
  store(':commit', {
    method: 'POST',
    body: JSON.stringify({
      writes: [{
        update: { name: DOC_PATH + '/qstats/' + qid, fields: {} },
        updateMask: { fieldPaths: [] },
        updateTransforms: transforms,
      }],
    }),
  }).then(() => {
    if (statCache && statCache[qid]) {          // keep the on-screen number current
      statCache[qid].attempts++;
      if (ok) statCache[qid].correctN++;
      statCache[qid].pct = Math.round(100 * statCache[qid].correctN / statCache[qid].attempts);
    }
  }).catch(() => {});
}

// ---------- shared class materials (admin publishes, class reads) ----------
async function getMaterials(unitId) {
  if (!configured || !session) return null;
  try {
    const doc = await store('/materials/' + unitId);
    const d = decFields((doc || {}).fields);
    return Array.isArray(d.items) ? d.items : [];
  } catch (e) {
    if (e.status === 404) return [];
    return null;
  }
}

async function setMaterials(unitId, items) {
  // The Firestore rules are the real gate; this only avoids a pointless
  // round trip when we already know the user is not the owner.
  if (!canEditMaterials()) throw new Error('Only the class owner can publish materials');
  await store('/materials/' + unitId, {
    method: 'PATCH',
    body: JSON.stringify({ fields: enc({ items: items, updated: Date.now() }).mapValue.fields }),
  });
}

function isAdmin() {
  return !!(session && cfg.adminUid && session.uid === cfg.adminUid);
}
// Before an owner is configured nobody is locked out — the controls stay
// visible so the first person can set themselves up.
function canEditMaterials() {
  return !!session && (!cfg.adminUid || isAdmin());
}

// ---------- leaderboard & class stats ----------
async function leaderboard() {
  const rows = await store(':runQuery', {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'leaderboard' }],
        orderBy: [{ field: { fieldPath: 'xp' }, direction: 'DESCENDING' }],
        limit: 100,
      },
    }),
  });
  return (rows || []).filter(r => r.document).map(r => {
    const d = decFields(r.document.fields);
    return {
      username: d.username, xp: d.xp || 0, solved: d.solved || 0,
      streak_last: d.streakLast || '', streak_days: d.streakDays || 0,
    };
  });
}

async function qstat(qid) {
  if (!configured || !session) return null;
  if (!statCache) {
    statCache = {};
    try {
      const page = await store('/qstats?pageSize=400');
      (page.documents || []).forEach(doc => {
        const id = doc.name.split('/').pop();
        const d = decFields(doc.fields);
        const n = d.attempts || 0, c = d.correct || 0;
        if (n) statCache[id] = { attempts: n, correctN: c, pct: Math.round(100 * c / n) };
      });
    } catch (e) { /* leave empty; stats are a bonus */ }
  }
  return statCache[qid] || null;
}

window.Cloud = {
  get isConfigured() { return configured; },
  get user() { return session ? session.username : null; },
  get uid() { return session ? session.uid : null; },
  get adminConfigured() { return !!cfg.adminUid; },
  isAdmin, canEditMaterials, getMaterials, setMaterials,
  signUp, logIn, logOut, sync, notifyAttempt, leaderboard, qstat,
  onStatus(cb) { statusCb = cb; },
};

// background triggers
if (configured && session) {
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  setTimeout(sync, 800);
}
})();
