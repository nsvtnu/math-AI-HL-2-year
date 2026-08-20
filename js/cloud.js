// ============================================================
// Cloud — accounts, sync, leaderboard, class stats (Supabase).
// Plain fetch() against Supabase's REST APIs; no libraries.
// The app works fully offline / logged out — this layer only
// adds sync on top when configured and signed in.
// ============================================================
(function () {
'use strict';

const SKEY = 'mathkitty-session';
const cfg = typeof CLOUD_CONFIG !== 'undefined' ? CLOUD_CONFIG : {};
const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(cfg.url || '') && (cfg.anonKey || '').length > 20;

let session = loadSession();
let statusCb = null;
let statCache = null;         // qid -> {attempts, pct}
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

// usernames become emails internally; Supabase auth wants email+password
function emailFor(username) { return username.toLowerCase() + '@users.mathkitty.app'; }
function validUsername(u) { return /^[A-Za-z0-9_]{3,16}$/.test(u); }

async function api(path, opts) {
  opts = opts || {};
  const headers = Object.assign({
    apikey: cfg.anonKey,
    Authorization: 'Bearer ' + (session ? session.access_token : cfg.anonKey),
    'Content-Type': 'application/json',
  }, opts.headers || {});
  const res = await fetch(cfg.url + path, Object.assign({}, opts, { headers }));
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  if (!res.ok) {
    const msg = (body && (body.msg || body.message || body.error_description || body.error)) || ('HTTP ' + res.status);
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return body;
}

async function ensureFresh() {
  if (!session) throw new Error('Not signed in');
  if (Date.now() < (session.expires_at - 60) * 1000) return;
  const body = await api('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  }).catch(e => { saveSession(null); setStatus('off'); throw e; });
  saveSession({
    access_token: body.access_token, refresh_token: body.refresh_token,
    expires_at: body.expires_at || Math.floor(Date.now() / 1000) + (body.expires_in || 3600),
    user_id: session.user_id, username: session.username,
  });
}

function sessionFromAuth(body, username) {
  return {
    access_token: body.access_token, refresh_token: body.refresh_token,
    expires_at: body.expires_at || Math.floor(Date.now() / 1000) + (body.expires_in || 3600),
    user_id: body.user.id, username: username,
  };
}

async function signUp(username, password) {
  if (!validUsername(username)) throw new Error('Username: 3-16 letters, numbers or _');
  if ((password || '').length < 6) throw new Error('Password needs at least 6 characters');
  const taken = await api('/rest/v1/profiles?select=username&username=eq.' + encodeURIComponent(username.toLowerCase()));
  if (taken && taken.length) throw new Error('That username is taken');
  const body = await api('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email: emailFor(username), password }),
  });
  if (!body.access_token) throw new Error('Sign-up needs email confirmation switched OFF in Supabase (see setup guide)');
  saveSession(sessionFromAuth(body, username.toLowerCase()));
  await api('/rest/v1/profiles', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ id: session.user_id, username: username.toLowerCase() }),
  });
  await sync();
}

async function logIn(username, password) {
  const body = await api('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email: emailFor(username), password }),
  }).catch(e => { throw new Error(/invalid/i.test(e.message) ? 'Wrong username or password' : e.message); });
  saveSession(sessionFromAuth(body, username.toLowerCase()));
  await sync();
}

async function logOut() {
  try { await ensureFresh(); await api('/auth/v1/logout', { method: 'POST' }); } catch (e) {}
  saveSession(null);
  statCache = null;
  setStatus('off');
}

// ---------- sync ----------
async function sync() {
  if (!configured || !session || syncing) return;
  syncing = true;
  setStatus('syncing');
  try {
    await ensureFresh();
    // pull
    const uid = session.user_id;
    const remoteAttempts = await api('/rest/v1/attempts?select=q,u,ok,first,ts&user_id=eq.' + uid + '&order=ts.asc&limit=10000');
    const rows = await api('/rest/v1/states?select=data&user_id=eq.' + uid);
    const remoteData = rows && rows[0] ? rows[0].data : {};
    S.mergeCloud(
      (remoteAttempts || []).map(a => ({ q: a.q, u: a.u, ok: a.ok, first: a.first, ts: Date.parse(a.ts) })),
      remoteData || {}
    );
    // push attempts the server has not seen
    const fresh = S.unsyncedAttempts();
    if (fresh.length) {
      await api('/rest/v1/attempts', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(fresh.map(a => ({
          user_id: uid, q: a.q, u: a.u, ok: !!a.ok, first: !!a.first, ts: new Date(a.ts).toISOString(),
        }))),
      });
      S.markSynced();
    }
    // push merged state doc
    await api('/rest/v1/states', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: uid, data: S.exportData(), updated_at: new Date().toISOString() }),
    });
    setStatus('ok');
    if (window.App) App.refreshChips();
  } catch (e) {
    setStatus(session ? 'error' : 'off');
  } finally {
    syncing = false;
  }
}

function notifyAttempt() {                 // debounced push after answering
  if (!configured || !session) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(sync, 2500);
}

// ---------- leaderboard & class stats ----------
async function leaderboard() {
  await ensureFresh();
  return api('/rest/v1/rpc/leaderboard', { method: 'POST', body: '{}' });
}

async function qstat(qid) {
  if (!configured || !session) return null;
  if (!statCache) {
    try {
      await ensureFresh();
      const rows = await api('/rest/v1/rpc/question_stats', { method: 'POST', body: '{}' });
      statCache = {};
      (rows || []).forEach(r => { statCache[r.q] = { attempts: r.attempts, pct: r.correct_pct }; });
    } catch (e) { statCache = {}; }
  }
  return statCache[qid] || null;
}

window.Cloud = {
  get isConfigured() { return configured; },
  get user() { return session ? session.username : null; },
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
