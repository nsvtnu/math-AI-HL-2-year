// ============================================================
// Orbit app — router, dashboard, units, syllabus map, search
// ============================================================
(function () {
'use strict';

const view = document.getElementById('view');
const nav = document.getElementById('nav');
const sidebar = document.getElementById('sidebar');
const crumb = document.getElementById('crumb');

S.applyTheme();

// ---------- helpers ----------
function el(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.firstElementChild;
}
function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return M[m - 1] + ' ' + d;
}
function daysUntil(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d) - t) / 86400000);
}
function unitById(id) { return UNITS.find(u => u.id === id) || GAPS.find(g => g.id === id); }
function isGap(id) { return id[0] === 'g'; }
function qsOf(id) { return BANK.filter(q => q.unit === id); }

function refreshChips() {
  document.getElementById('xp-pill').textContent = '⚡ ' + S.xp;
  document.getElementById('streak-pill').textContent = '🔥 ' + S.streakDays;
}

// ---------- nav ----------
function buildNav() {
  const route = location.hash || '#home';
  let html = '';
  const item = (hash, emoji, label, extra) =>
    '<button class="nav-item' + (route === hash ? ' active' : '') + '" data-go="' + hash + '">' +
    '<span class="nav-emoji">' + emoji + '</span><span class="nav-label">' + label + '</span>' +
    (extra || '') + '</button>';

  html += item('#home', '🛰', 'Mission control');
  html += item('#timeline', '🗓', 'Semester timeline');
  html += item('#syllabus', '🗺', 'Syllabus map');
  html += item('#review', '🔖', 'Review queue', '<span class="nav-count">' + S.flagged('review').length + '</span>');
  html += item('#resources', '🧭', 'Resource hub');

  html += '<div class="nav-section">Teacher units</div>';
  UNITS.forEach(u => {
    const st = S.unitStats(u.id, BANK);
    html += item('#unit/' + u.id, u.emoji, u.code + ' · ' + u.title,
      st.correct ? '<span class="nav-count">' + st.correct + '/' + st.total + '</span>' : '');
  });

  html += '<div class="nav-section">Gap zone — not on the calendar</div>';
  GAPS.forEach(g => {
    const st = S.unitStats(g.id, BANK);
    html += item('#unit/' + g.id, g.emoji, g.title,
      st.correct ? '<span class="nav-count">' + st.correct + '/' + st.total + '</span>' : '');
  });

  nav.innerHTML = html;
  nav.querySelectorAll('[data-go]').forEach(b => {
    b.onclick = () => { location.hash = b.dataset.go; sidebar.classList.remove('open'); };
  });
}

// ---------- pages ----------
function renderHome() {
  crumb.textContent = 'Mission control';
  const o = S.overall();
  const gapsTotal = GAPS.reduce((n, g) => n + qsOf(g.id).length, 0);
  const next = ASSESS.find(a => daysUntil(a.d) >= 0);

  let html = '<div>';
  html += '<h1 class="page-title">Mission control 🛰</h1>';
  html += '<div class="page-sub">Your teacher\'s semester, the official AI HL syllabus, and the gaps between them — all offline.</div>';

  html += '<div class="hero-stats">' +
    '<div class="stat"><div class="big">' + o.attempts + '</div><div class="lbl">answers submitted</div></div>' +
    '<div class="stat"><div class="big">' + (o.acc === null ? '—' : o.acc + '%') + '</div><div class="lbl">accuracy</div></div>' +
    '<div class="stat"><div class="big">' + S.flagged('review').length + '</div><div class="lbl">flagged for review</div></div>' +
    '<div class="stat"><div class="big">' + (next ? daysUntil(next.d) + 'd' : '🎉') + '</div><div class="lbl">' + (next ? 'until ' + next.name : 'no assessments left') + '</div></div>' +
    '</div>';

  html += '<h2 class="sec">Assessment countdown</h2><div class="assess-strip">';
  ASSESS.forEach(a => {
    const dd = daysUntil(a.d);
    const cls = dd < 0 ? ' past' : (next && a.d === next.d ? ' next' : '');
    html += '<div class="assess-card' + cls + '"><div class="ac-name">' + a.name + '</div>' +
      '<div class="ac-date">' + fmtDate(a.d) + ' · ' + a.covers + '</div>' +
      '<div class="ac-count">' + (dd < 0 ? 'done' : dd === 0 ? 'TODAY' : dd + ' days') + '</div></div>';
  });
  html += '</div>';
  html += '</div>';
  view.innerHTML = html;

  const grid1 = el('<div class="grid2"></div>');
  view.appendChild(el('<h2 class="sec">Teacher units (on the calendar)</h2>'));
  view.appendChild(grid1);
  UNITS.forEach(u => grid1.appendChild(unitCard(u)));

  view.appendChild(el('<h2 class="sec">⚠ Gap zone — on the syllabus, not on the calendar</h2>'));
  view.appendChild(el('<div class="card gap-banner">These ' + GAPS.length + ' topics (' + gapsTotal + ' questions) are examinable in AI HL but have no slot on the semester plan. Some may be scheduled for semester 2 or already covered last year — learn them here either way, and confirm with your teacher. 🎯</div>'));
  const grid2 = el('<div class="grid2"></div>');
  view.appendChild(grid2);
  GAPS.forEach(g => grid2.appendChild(unitCard(g)));
}

function unitCard(u) {
  const st = S.unitStats(u.id, BANK);
  const pct = st.total ? Math.round(100 * st.correct / st.total) : 0;
  const c = el('<div class="card unit-card">' +
    '<span class="badge ' + (isGap(u.id) ? 'gap">GAP · ' + u.syll : 'sched">' + (u.code === 'Jan' ? 'Jan lesson' : 'Unit ' + u.code)) + '</span>' +
    '<h3>' + u.emoji + ' ' + u.title + '</h3>' +
    '<div class="uc-sub">' + u.sub + '</div>' +
    '<div class="prog-track"><div class="prog-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="uc-meta"><span>' + st.correct + '/' + st.total + ' solved</span><span>' + (st.acc === null ? 'not started' : st.acc + '% accuracy') + '</span></div>' +
    '</div>');
  c.onclick = () => { location.hash = '#unit/' + u.id; };
  return c;
}

function renderUnit(id, tab, focusQ) {
  const u = unitById(id);
  if (!u) return renderHome();
  crumb.textContent = (isGap(id) ? 'Gap zone · ' : 'Unit ' + u.code + ' · ') + u.title;
  tab = tab || 'notes';

  let html = '<div>';
  html += '<span class="badge ' + (isGap(id) ? 'gap">Gap — not on the calendar' : 'sched">On the calendar · unit ' + u.code) + '</span> ';
  html += '<span class="badge sub">' + u.syll + '</span>';
  html += '<h1 class="page-title">' + u.emoji + ' ' + u.title + '</h1>';
  html += '<div class="page-sub">' + u.sub + (u.why ? ' <b>Why it\'s here:</b> ' + u.why : '') + '</div>';
  html += '<div class="tabs">' +
    '<button class="tab' + (tab === 'notes' ? ' on' : '') + '" data-t="notes">📖 Notes</button>' +
    '<button class="tab' + (tab === 'practice' ? ' on' : '') + '" data-t="practice">✏️ Practice (' + qsOf(id).length + ')</button>' +
    '</div></div>';
  view.innerHTML = html;

  view.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => renderUnit(id, t.dataset.t);
  });

  if (tab === 'notes') {
    const wrap = el('<div class="note-sec"></div>');
    u.notes.forEach(n => {
      wrap.appendChild(el('<div class="card"><h3>' + n.h + '</h3>' + MT.render(n.body) + '</div>'));
    });
    const go = el('<button class="btn">✏️ Practice this unit →</button>');
    go.onclick = () => renderUnit(id, 'practice');
    wrap.appendChild(go);
    view.appendChild(wrap);
  } else {
    Quiz.renderList(qsOf(id), view);
    buildNav(); // counts may change as they answer; rebuild on entry
  }

  if (focusQ) {
    const target = document.getElementById('q-' + focusQ);
    if (target) {
      target.scrollIntoView({ block: 'center' });
      target.style.outline = '2px solid var(--acc)';
      setTimeout(() => { target.style.outline = ''; }, 1800);
    }
  }
}

function renderTimeline() {
  crumb.textContent = 'Semester timeline';
  let html = '<h1 class="page-title">🗓 Semester timeline</h1>' +
    '<div class="page-sub">Transcribed from your teacher\'s calendar. Highlighted row = where you are now.</div><div class="card">';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let marked = false;
  CAL.forEach(r => {
    const dd = daysUntil(r.d);
    let cls = 'tl-row' + (r.assess ? ' tl-assess' : '');
    if (!marked && dd >= 0) { cls += ' tl-today'; marked = true; }
    html += '<div class="' + cls + '"><span class="tl-date">' + fmtDate(r.d) + ' ' + r.dow + '</span>' +
      '<span class="tl-unit">' + (r.unit || '—') + '</span><span class="tl-what">' + r.what + '</span></div>';
  });
  html += '</div>';
  view.innerHTML = html;
}

const ST_META = {
  sched: { cls: 'st-sched', label: '📅 Scheduled' },
  gap: { cls: 'st-gap', label: '⚠ Gap' },
  y1: { cls: 'st-y1', label: 'Year 1' },
  done: { cls: 'st-done', label: '✓ Confident' },
  need: { cls: 'st-need', label: '✎ Needs work' },
};

function renderSyllabus() {
  crumb.textContent = 'Syllabus map';
  view.innerHTML = '<h1 class="page-title">🗺 AI HL syllabus map</h1>' +
    '<div class="page-sub">Every syllabus item vs your teacher\'s calendar. Click a status chip to cycle your own mark: auto → ✓ confident → ✎ needs work.</div>' +
    '<div class="legend"><span class="st st-sched">📅 Scheduled</span><span class="st st-gap">⚠ Gap</span><span class="st st-y1">Year 1</span><span class="st st-done">✓ Confident</span><span class="st st-need">✎ Needs work</span></div>';

  SYLL.forEach(group => {
    const card = el('<div class="card"><h3 style="margin:2px 0 8px">' + group.topic + '</h3></div>');
    group.items.forEach(it => {
      const row = el('<div class="syll-item"><span class="syll-code">' + it.code + '</span>' +
        '<span class="syll-name">' + it.name +
        (it.when ? '<span class="syll-note">📅 ' + it.when + '</span>' : '') +
        (it.note ? '<span class="syll-note">💡 ' + it.note + '</span>' : '') +
        '</span></div>');
      const st = document.createElement('button');
      const sync = () => {
        const eff = S.overOf(it.code) || it.st;
        const m = ST_META[eff];
        st.className = 'st ' + m.cls;
        st.textContent = m.label;
      };
      sync();
      st.onclick = () => {
        const cur = S.overOf(it.code);
        S.setOver(it.code, cur === null ? 'done' : cur === 'done' ? 'need' : null);
        sync();
      };
      st.title = 'Click to cycle: auto → confident → needs work';
      row.appendChild(st);
      if (it.ref) {
        const go = el('<button class="reveal-btn" style="flex-shrink:0">study →</button>');
        go.onclick = () => { location.hash = '#unit/' + it.ref; };
        row.appendChild(go);
      }
      card.appendChild(row);
    });
    view.appendChild(card);
  });
}

function renderReview() {
  crumb.textContent = 'Review queue';
  view.innerHTML = '<h1 class="page-title">🔖 Review queue</h1>' +
    '<div class="page-sub">Everything you flagged "review later". Clear the queue before each summative.</div>';
  const ids = S.flagged('review');
  Quiz.renderList(BANK.filter(q => ids.includes(q.id)), view,
    'Queue\'s empty. Flag tricky questions with 🔖 Review later and they\'ll collect here.');
}

function renderResources() {
  crumb.textContent = 'Resource hub';
  view.innerHTML = '<h1 class="page-title">🧭 Resource hub</h1>' +
    '<div class="page-sub">Curated external firepower, mapped to your units. Links need internet — everything marked ★ also works offline once installed. Best workflow: watch the video BEFORE the unit starts in class, practise in Orbit, then go deeper.</div>';
  RESOURCES.forEach(cat => {
    const card = el('<div class="card"><h3 style="margin:2px 0 6px">' + cat.cat + '</h3>' +
      '<div class="page-sub" style="margin-bottom:10px">' + cat.blurb + '</div></div>');
    cat.items.forEach(r => {
      card.appendChild(el('<div class="res-item">' +
        '<a href="' + r.url + '" target="_blank" rel="noopener">' + r.name + ' ↗</a>' +
        '<div class="res-what">' + r.what + '</div>' +
        '<div class="res-tags">' + r.tags.map(t => '<span class="badge sub">' + t + '</span>').join(' ') + '</div>' +
        '</div>'));
    });
    view.appendChild(card);
  });
}

// ---------- search ----------
let INDEX = null;
function buildIndex() {
  if (INDEX) return INDEX;
  INDEX = [];
  const strip = s => String(s).replace(/\$[^$]*\$/g, ' ').replace(/<[^>]*>/g, ' ').toLowerCase();
  UNITS.concat(GAPS).forEach(u => {
    u.notes.forEach(n => INDEX.push({
      kind: isGap(u.id) ? 'gap notes' : 'unit ' + u.code + ' notes',
      title: u.title + ' — ' + n.h,
      text: strip(u.title + ' ' + u.sub + ' ' + n.h + ' ' + n.body + ' ' + u.syll),
      go: '#unit/' + u.id,
    }));
  });
  BANK.forEach(q => INDEX.push({
    kind: 'question',
    title: (unitById(q.unit) || {}).title + ' · ' + q.sub,
    text: strip(q.q + ' ' + q.sub + ' ' + (q.sol || []).join(' ')),
    snip: strip(q.q).slice(0, 90),
    go: '#unit/' + q.unit, tab: 'practice', focus: q.id,
  }));
  RESOURCES.forEach(cat => cat.items.forEach(r => INDEX.push({
    kind: 'resource',
    title: r.name,
    text: strip(cat.cat + ' ' + r.name + ' ' + r.what + ' ' + r.tags.join(' ')),
    snip: strip(r.what).slice(0, 90),
    go: '#resources',
  })));
  SYLL.forEach(g => g.items.forEach(it => INDEX.push({
    kind: 'syllabus',
    title: it.code + ' ' + it.name,
    text: strip(g.topic + ' ' + it.code + ' ' + it.name + ' ' + (it.note || '')),
    go: '#syllabus',
  })));
  return INDEX;
}

const overlay = document.getElementById('search-overlay');
const sInput = document.getElementById('search-input');
const sResults = document.getElementById('search-results');

function openSearch() {
  overlay.hidden = false;
  sInput.value = '';
  sResults.innerHTML = '<div class="sr-empty">Type to search notes, questions and the syllabus map…</div>';
  sInput.focus();
}
function closeSearch() { overlay.hidden = true; }

function runSearch() {
  const terms = sInput.value.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) { sResults.innerHTML = ''; return; }
  const scored = buildIndex().map(e => {
    let s = 0;
    terms.forEach(t => {
      if (e.title.toLowerCase().includes(t)) s += 3;
      if (e.text.includes(t)) s += 1;
    });
    return { e, s };
  }).filter(x => x.s >= terms.length).sort((a, b) => b.s - a.s).slice(0, 20);
  if (!scored.length) {
    sResults.innerHTML = '<div class="sr-empty">No hits. Try a broader word — e.g. "euler", "poisson", "eigen".</div>';
    return;
  }
  sResults.innerHTML = '';
  scored.forEach(({ e }) => {
    const b = el('<button class="sr-item"><span class="sr-kind">' + e.kind + '</span>' +
      '<div class="sr-title">' + e.title + '</div>' +
      (e.snip ? '<div class="sr-snip">' + e.snip + '…</div>' : '') + '</button>');
    b.onclick = () => {
      closeSearch();
      if (e.focus) {
        location.hash = e.go;                    // ensure route
        renderUnit(e.go.split('/')[1], 'practice', e.focus);
        buildNav();
      } else {
        location.hash = e.go;
        if (location.hash === e.go) route();     // same-hash: force re-render
      }
    };
    sResults.appendChild(b);
  });
}

document.getElementById('search-open').onclick = openSearch;
sInput.addEventListener('input', runSearch);
overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) &&
      overlay.hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    e.preventDefault();
    openSearch();
  }
});

// ---------- chrome ----------
document.getElementById('theme-btn').onclick = () => S.toggleTheme();
document.getElementById('menu-btn').onclick = e => { e.stopPropagation(); sidebar.classList.toggle('open'); };
document.addEventListener('click', e => {
  if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target.id !== 'menu-btn') {
    sidebar.classList.remove('open');
  }
});

// ---------- router ----------
function route() {
  sidebar.classList.remove('open');
  window.scrollTo(0, 0);
  const h = location.hash || '#home';
  const [page, arg] = h.slice(1).split('/');
  if (page === 'unit' && arg) renderUnit(arg);
  else if (page === 'timeline') renderTimeline();
  else if (page === 'syllabus') renderSyllabus();
  else if (page === 'review') renderReview();
  else if (page === 'resources') renderResources();
  else renderHome();
  buildNav();
  refreshChips();
}
window.addEventListener('hashchange', route);

// ---------- PWA ----------
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* file:// or blocked — app still works */ });
}

window.App = { refreshChips };
route();
})();
