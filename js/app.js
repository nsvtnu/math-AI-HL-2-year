// ============================================================
(function () {
'use strict';

const view = document.getElementById('view');
const nav = document.getElementById('nav');
const sidebar = document.getElementById('sidebar');
const crumb = document.getElementById('crumb');

S.applyTheme();

// If a data file fails to parse, every page would otherwise render blank.
// Say what broke instead.
const DATA_OK = (() => {
  try { return [UNITS, GAPS, SYLL, BANK, CAL, ASSESS, RESOURCES].every(x => x !== undefined); }
  catch (e) { return false; }
})();
if (!DATA_OK) {
  view.innerHTML = '<h1 class="page-title">A data file did not load</h1>' +
    '<div class="card"><p>The lessons and questions live in <code>data/units.js</code> and ' +
    '<code>data/bank.js</code>. One of them has a typo, so the whole file was rejected.</p>' +
    '<p>Usual causes: a missing quote, comma or closing brace — or leftover merge markers ' +
    'like <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> ' +
    'from a failed sync.</p><p>Open the browser console (right-click &rarr; Inspect &rarr; Console) ' +
    'and it names the exact line.</p></div>';
  return;
}

// ---------- helpers ----------
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
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
  document.getElementById('xp-pill').textContent = 'XP ' + S.xp;
  document.getElementById('streak-pill').textContent = 'Streak ' + S.streakDays;
}

// ---------- nav ----------
function buildNav() {
  const route = location.hash || '#home';
  let html = '';
  const item = (hash, emoji, label, extra) =>
    '<button class="nav-item' + (route === hash ? ' active' : '') + '" data-go="' + hash + '">' +
    '<span class="nav-label">' + label + '</span>' +
    (extra || '') + '</button>';

  html += item('#home', '', 'Mission control');
  html += item('#timeline', '', 'Semester timeline');
  html += item('#syllabus', '', 'Syllabus map');
  html += item('#review', '', 'Review queue', '<span class="nav-count">' + S.flagged('review').length + '</span>');
  html += item('#resources', '', 'Resource hub');
  if (Cloud.isConfigured) html += item('#leaderboard', '', 'Leaderboard');

  html += '<div class="nav-section">Units</div>';
  UNITS.forEach(u => {
    const st = S.unitStats(u.id, BANK);
    html += item('#unit/' + u.id, u.emoji, u.code + ' · ' + u.title,
      st.correct ? '<span class="nav-count">' + st.correct + '/' + st.total + '</span>' : '');
  });

  html += '<div class="nav-section">Gaps</div>';
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
  html += '<h1 class="page-title">Mission control</h1>';
  html += '<div class="page-sub">The AI HL syllabus — and the gaps between.</div>';

  html += '<div class="hero-stats">' +
    '<div class="stat"><div class="big">' + o.attempts + '</div><div class="lbl">answers submitted</div></div>' +
    '<div class="stat"><div class="big">' + (o.acc === null ? '—' : o.acc + '%') + '</div><div class="lbl">accuracy</div></div>' +
    '<div class="stat"><div class="big">' + S.flagged('review').length + '</div><div class="lbl">flagged for review</div></div>' +
    '<div class="stat"><div class="big">' + (next ? daysUntil(next.d) + 'd' : 'done') + '</div><div class="lbl">' + (next ? 'until ' + next.name : 'no assessments left') + '</div></div>' +
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
  view.appendChild(el('<h2 class="sec">Units</h2>'));
  view.appendChild(grid1);
  UNITS.forEach(u => grid1.appendChild(unitCard(u)));

  view.appendChild(el('<h2 class="sec">Gaps</h2>'));
  view.appendChild(el('<div class="card gap-banner">These ' + GAPS.length + ' topics (' + gapsTotal + ' questions) are examinable in AI HL.</div>'));
  const grid2 = el('<div class="grid2"></div>');
  view.appendChild(grid2);
  GAPS.forEach(g => grid2.appendChild(unitCard(g)));
}

function unitCard(u) {
  const st = S.unitStats(u.id, BANK);
  const pct = st.total ? Math.round(100 * st.correct / st.total) : 0;
  const c = el('<div class="card unit-card">' +
    '<span class="badge ' + (isGap(u.id) ? 'gap">GAP · ' + u.syll : 'sched">' + (u.code === 'Jan' ? 'Jan lesson' : 'Unit ' + u.code)) + '</span>' +
    '<h3>' + u.title + '</h3>' +
    '<div class="uc-sub">' + u.sub + '</div>' +
    '<div class="prog-track"><div class="prog-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="uc-meta"><span>' + st.correct + '/' + st.total + ' solved</span><span>' + (st.acc === null ? 'not started' : st.acc + '% accuracy') + '</span></div>' +
    '</div>');
  c.onclick = () => { location.hash = '#unit/' + u.id; };
  return c;
}


// ---------- per-unit video ----------
// Accepts whatever you paste: a full watch link, a youtu.be link, a
// playlist link, or a bare 11-character id.
function ytEmbed(raw) {
  raw = String(raw || '').trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return 'https://www.youtube-nocookie.com/embed/' + raw;
  let vid = '', list = '';
  let m = raw.match(/[?&]v=([\w-]{11})/) || raw.match(/youtu\.be\/([\w-]{11})/) || raw.match(/\/embed\/([\w-]{11})/);
  if (m) vid = m[1];
  m = raw.match(/[?&]list=([\w-]+)/);
  if (m) list = m[1];
  if (vid) return 'https://www.youtube-nocookie.com/embed/' + vid + (list ? '?list=' + list : '');
  if (list) return 'https://www.youtube-nocookie.com/embed/videoseries?list=' + list;
  return null;
}
function ytWatch(raw) {
  raw = String(raw || '').trim();
  if (/^[\w-]{11}$/.test(raw)) return 'https://www.youtube.com/watch?v=' + raw;
  return /^https?:\/\//i.test(raw) ? raw : null;
}

function videoCard(v) {
  const raw = v.url || v.id || v.link || '';
  const embed = ytEmbed(raw), watch = ytWatch(raw);
  const c = el('<div class="vid-card">' +
    '<div class="vid-meta"><div class="vid-name">' + esc(v.title || 'Video for this unit') + '</div>' +
    '<div class="vid-why">' + esc(v.why || '') + '</div></div></div>');
  const play = el('<button class="vid-play" title="Play here">&#9654;</button>');
  play.onclick = () => {
    if (c.querySelector('iframe')) return;
    if (!embed) { if (watch) window.open(watch, '_blank', 'noopener'); return; }
    const f = document.createElement('iframe');
    f.className = 'vid-frame';
    f.src = embed;
    f.allow = 'accelerometer; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    f.loading = 'lazy';
    c.appendChild(f);
  };
  c.insertBefore(play, c.firstChild);
  if (watch) {
    const out = el('<a class="vid-out" href="' + esc(watch) + '" target="_blank" rel="noopener">open on YouTube</a>');
    c.querySelector('.vid-meta').appendChild(out);
  }
  return c;
}

// ---------- class materials ----------
// Shared links live in Firestore and are published by the owner only.
// Files stay in this browser, so they are private to whoever saved them.
function materials(unitId) {
  const canEdit = window.Cloud && Cloud.canEditMaterials && Cloud.canEditMaterials();
  const box = el('<div class="mats"><div class="mats-head"><h3>Class materials</h3>' +
    '<span class="mats-status"></span></div><div class="mats-list"></div></div>');
  const listEl = box.querySelector('.mats-list');
  const status = box.querySelector('.mats-status');
  const say = t => { status.textContent = t; if (t) setTimeout(() => { if (status.textContent === t) status.textContent = ''; }, 2400); };

  let shared = [];

  function sharedRow(m, ix) {
    const row = el('<div class="mat-row"><span class="mat-ico">link</span>' +
      '<a class="mat-name" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(m.label) + '</a>' +
      '<span class="mat-meta">shared with the class</span></div>');
    if (canEdit) {
      const del = el('<button class="mat-del" title="Remove for everyone">remove</button>');
      del.onclick = async () => {
        if (!confirm('Remove "' + m.label + '" for the whole class?')) return;
        const next = shared.slice(); next.splice(ix, 1);
        try { await Cloud.setMaterials(unitId, next); shared = next; say('removed'); render(); }
        catch (e) { say(e.message); }
      };
      row.appendChild(del);
    }
    return row;
  }

  async function localRows() {
    if (!FILES.available) return [];
    let recs = [];
    try { recs = await FILES.list(unitId); } catch (e) { return []; }
    return recs.map(r => {
      const isImg = /^image\//.test(r.type);
      const row = el('<div class="mat-row"><span class="mat-ico">' + (isImg ? 'image' : /pdf/.test(r.type) ? 'pdf' : 'file') + '</span>' +
        '<span class="mat-name">' + esc(r.name) + '</span>' +
        '<span class="mat-meta">' + FILES.sizeText(r.size) + ' · only on this device</span></div>');
      const open = el('<button class="mat-open">open</button>');
      open.onclick = () => {
        const url = URL.createObjectURL(r.blob);
        if (isImg) {
          const nxt = row.nextElementSibling;
          if (nxt && nxt.classList.contains('mat-prev')) { nxt.remove(); URL.revokeObjectURL(url); return; }
          const pv = el('<div class="mat-prev"></div>');
          const img = document.createElement('img');
          img.src = url; img.alt = r.name;
          pv.appendChild(img);
          row.after(pv);
        } else {
          window.open(url, '_blank', 'noopener');
          setTimeout(() => URL.revokeObjectURL(url), 60000);
        }
      };
      row.appendChild(open);
      if (canEdit) {
        const del = el('<button class="mat-del" title="Delete from this device">remove</button>');
        del.onclick = async () => {
          if (!confirm('Delete "' + r.name + '" from this device?')) return;
          await FILES.remove(r.id); render();
        };
        row.appendChild(del);
      }
      return row;
    });
  }

  async function render() {
    listEl.innerHTML = '';
    shared.forEach((m, ix) => listEl.appendChild(sharedRow(m, ix)));
    (await localRows()).forEach(r => listEl.appendChild(r));
    if (!listEl.children.length) {
      listEl.appendChild(el('<div class="mats-empty">' +
        (canEdit ? 'Nothing here yet. Add a link to a handout, or drop a file below.'
                 : 'No materials for this unit yet.') + '</div>'));
    }
  }

  // ----- owner-only controls -----
  function editor() {
    const wrap = el('<div class="mats-edit"></div>');
    const drop = el('<div class="mats-drop" tabindex="0"><b>Drop a file here</b>, paste a screenshot, or ' +
      '<span class="mats-link">choose one</span><br>' +
      '<span class="mats-hint">Kept on this device only — to share with the class, add a link instead.</span></div>');
    const input = document.createElement('input');
    input.type = 'file'; input.multiple = true; input.style.display = 'none';

    async function take(files) {
      if (!FILES.available) { say('this browser cannot store files'); return; }
      let n = 0;
      for (const f of files) {
        if (f.size > 40 * 1024 * 1024) { say(f.name + ' is over 40 MB'); continue; }
        try { await FILES.add(unitId, f); n++; } catch (e) { say('could not save ' + f.name); }
      }
      if (n) say(n + (n === 1 ? ' file saved' : ' files saved'));
      render();
    }
    drop.onclick = () => input.click();
    input.onchange = () => { take([...input.files]); input.value = ''; };
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => { if (e.dataTransfer && e.dataTransfer.files.length) take([...e.dataTransfer.files]); });
    drop.addEventListener('paste', e => {
      const imgs = [...(e.clipboardData ? e.clipboardData.items : [])]
        .filter(i => i.kind === 'file').map(i => i.getAsFile()).filter(Boolean);
      if (imgs.length) { e.preventDefault(); take(imgs); }
    });

    const form = el('<div class="mats-form">' +
      '<input class="mat-lab" placeholder="what is it? e.g. Worksheet 3.2" maxlength="60">' +
      '<input class="mat-url" placeholder="https://…"></div>');
    const save = el('<button class="btn small">Share with class</button>');
    save.onclick = async () => {
      const lab = form.querySelector('.mat-lab').value.trim();
      const url = form.querySelector('.mat-url').value.trim();
      if (!lab || !/^https?:\/\//i.test(url)) { say('need a name and a link starting with http'); return; }
      if (!Cloud.user) { say('sign in first'); return; }
      const next = shared.concat([{ label: lab, url: url }]);
      save.disabled = true;
      try {
        await Cloud.setMaterials(unitId, next);
        shared = next;
        form.querySelector('.mat-lab').value = '';
        form.querySelector('.mat-url').value = '';
        say('shared with the class');
        render();
      } catch (e) { say(e.message); }
      save.disabled = false;
    };
    form.appendChild(save);
    wrap.appendChild(drop);
    wrap.appendChild(input);
    wrap.appendChild(form);
    return wrap;
  }

  render();
  if (canEdit) box.appendChild(editor());

  if (window.Cloud && Cloud.user) {
    Cloud.getMaterials(unitId).then(items => {
      if (items) { shared = items; render(); }
    }).catch(() => {});
  }
  return box;
}

// ---------- your own notes for a unit ----------
function myNotes(unitId) {
  const box = el('<div class="mynotes"><div class="mynotes-head"><h3>My notes</h3>' +
    '<span class="mynotes-status"></span></div></div>');
  const status = box.querySelector('.mynotes-status');
  const ta = document.createElement('textarea');
  ta.placeholder = 'Anything from class that is not above — your teacher\'s wording, a worked example from the board, a question to ask.';
  ta.value = S.noteOf(unitId);
  box.appendChild(ta);
  let t = null;
  ta.addEventListener('input', () => {
    status.textContent = 'saving…';
    clearTimeout(t);
    t = setTimeout(() => {
      S.setNote(unitId, ta.value);
      status.textContent = 'saved';
      if (window.Cloud && Cloud.user) Cloud.sync();
      setTimeout(() => { status.textContent = ''; }, 1600);
    }, 600);
  });
  return box;
}

function renderUnit(id, tab, focusQ) {
  const u = unitById(id);
  if (!u) return renderHome();
  crumb.textContent = (isGap(id) ? 'Gap zone · ' : 'Unit ' + u.code + ' · ') + u.title;
  tab = tab || 'notes';

  let html = '<div>';
  html += '<span class="badge ' + (isGap(id) ? 'gap">Gap' : 'sched">Unit ' + u.code) + '</span> ';
  html += '<span class="badge sub">' + u.syll + '</span>';
  html += '<h1 class="page-title">' + u.title + '</h1>';
  html += '<div class="page-sub">' + u.sub + (u.why ? ' <b>Why it\'s here:</b> ' + u.why : '') + '</div>';
  html += '<div class="tabs">' +
    '<button class="tab' + (tab === 'notes' ? ' on' : '') + '" data-t="notes">Notes</button>' +
    '<button class="tab' + (tab === 'practice' ? ' on' : '') + '" data-t="practice">Practice (' + qsOf(id).length + ')</button>' +
    '</div></div>';
  view.innerHTML = html;

  view.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => renderUnit(id, t.dataset.t);
  });

  if (tab === 'notes') {
    const wrap = el('<div class="note-sec"></div>');
    if (u.video) wrap.appendChild(videoCard(u.video));
    if (u.notes.length > 3) {
      const toc = el('<div class="note-toc"></div>');
      u.notes.forEach((n, ix) => {
        const chip = el('<button class="toc-chip">' + n.h + '</button>');
        chip.onclick = () => {
          const t = document.getElementById('note-' + id + '-' + ix);
          if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        toc.appendChild(chip);
      });
      wrap.appendChild(toc);
    }
    u.notes.forEach((n, ix) => {
      wrap.appendChild(el('<div class="card" id="note-' + id + '-' + ix + '"><h3>' + n.h + '</h3>' + MT.render(n.body) + '</div>'));
    });
    wrap.appendChild(materials(id));
    wrap.appendChild(myNotes(id));
    const go = el('<button class="btn">Practice this unit →</button>');
    go.onclick = () => renderUnit(id, 'practice');
    wrap.appendChild(go);
    view.appendChild(wrap);
    if (window.VIZ) VIZ.mount(wrap);
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
  let html = '<h1 class="page-title">Semester timeline</h1><div class="card">';
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
  sched: { cls: 'st-sched', label: 'Scheduled' },
  gap: { cls: 'st-gap', label: 'Gap' },
  y1: { cls: 'st-y1', label: 'Year 1' },
  done: { cls: 'st-done', label: '✓ Confident' },
  need: { cls: 'st-need', label: '✎ Needs work' },
};

function renderSyllabus() {
  crumb.textContent = 'Syllabus map';
  view.innerHTML = '<h1 class="page-title">AI HL syllabus map</h1>' +
    '<div class="legend"><span class="st st-sched">Scheduled</span><span class="st st-gap">Gap</span><span class="st st-y1">Year 1</span><span class="st st-done">✓ Confident</span><span class="st st-need">✎ Needs work</span></div>';

  SYLL.forEach(group => {
    const card = el('<div class="card"><h3 style="margin:2px 0 8px">' + group.topic + '</h3></div>');
    group.items.forEach(it => {
      const row = el('<div class="syll-item"><span class="syll-code">' + it.code + '</span>' +
        '<span class="syll-name">' + it.name +
        (it.when ? '<span class="syll-note">' + it.when + '</span>' : '') +
        (it.note ? '<span class="syll-note">' + it.note + '</span>' : '') +
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
  view.innerHTML = '<h1 class="page-title">Review queue</h1>';
  const ids = S.flagged('review');
  Quiz.renderList(BANK.filter(q => ids.includes(q.id)), view,
    'Queue\'s empty. Flag tricky questions with "Review later" and they\'ll collect here.');
}

function renderResources() {
  crumb.textContent = 'Resource hub';
  view.innerHTML = '<h1 class="page-title">Resource hub</h1>';
  RESOURCES.forEach(cat => {
    const card = el('<div class="card"><h3 style="margin:2px 0 6px">' + cat.cat + '</h3>' +
      (cat.blurb ? '<div class="page-sub" style="margin-bottom:10px">' + cat.blurb + '</div>' : '') + '</div>');
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

function renderLeaderboard() {
  crumb.textContent = 'Leaderboard';
  view.innerHTML = '<h1 class="page-title">Class leaderboard</h1>';
  if (!Cloud.isConfigured) {
    view.appendChild(el('<div class="card">The cloud backend is not connected yet — follow SETUP-BACKEND.md in the repo (about 5 minutes).</div>'));
    return;
  }
  if (!Cloud.user) {
    const c = el('<div class="card">Sign in to see the leaderboard and appear on it. </div>');
    const b = el('<button class="btn">Sign in</button>');
    b.onclick = openAuth;
    c.appendChild(b);
    view.appendChild(c);
    return;
  }
  const card = el('<div class="card">Loading…</div>');
  view.appendChild(card);
  Cloud.leaderboard().then(rows => {
    if (!rows || !rows.length) { card.textContent = 'Nobody on the board yet — answer a question to claim rank 1.'; return; }
    card.innerHTML = '';
    rows.forEach((r, i) => {
      const streak = liveStreak(r);
      card.appendChild(el('<div class="lb-row' + (r.username === Cloud.user ? ' me' : '') + '">' +
        '<span class="lb-rank">' + (i + 1) + '</span>' +
        '<span class="lb-kitty">' + KITTY.svg(22) + '</span>' +
        '<span class="lb-name">' + esc(r.username) + '</span>' +
        '<span class="lb-num"><b>' + r.xp + '</b> XP</span>' +
        '<span class="lb-num">' + r.solved + ' solved</span>' +
        '<span class="lb-num">' + (streak ? streak + 'd streak' : '—') + '</span>' +
        '</div>'));
    });
  }).catch(() => { card.textContent = 'Could not load the leaderboard — check your connection and try again.'; });
}
function liveStreak(row) {
  const st = row.streak_last ? { last: row.streak_last, days: row.streak_days } : null;
  if (!st || !st.days) return 0;
  const today = new Date(), y = new Date(Date.now() - 86400000);
  const k = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  return (st.last === k(today) || st.last === k(y)) ? st.days : 0;
}

// ---------- account & auth ----------
const acctWrap = document.getElementById('account-wrap');
let syncState = 'off';
Cloud.onStatus(st => { syncState = st; renderAccount(); });

const SYNC_LABEL = { syncing: 'syncing\u2026', ok: 'progress saved', error: 'sync failed', off: 'signed in' };

function renderAccount() {
  if (!Cloud.isConfigured) { acctWrap.innerHTML = ''; return; }
  acctWrap.innerHTML = '';

  if (!Cloud.user) {
    const b = el('<button class="btn small acct-btn">Sign in</button>');
    b.onclick = openAuth;
    acctWrap.appendChild(b);
    return;
  }

  const label = SYNC_LABEL[syncState] || SYNC_LABEL.off;
  const chip = el('<button class="acct-chip" title="' + esc(Cloud.user) + ' \u2014 ' + label + '">' +
    KITTY.svg(20) + '<span class="acct-name">' + esc(Cloud.user) + '</span>' +
    '<span class="acct-dot ' + syncState + '"></span></button>');
  const menu = el('<div class="acct-menu" hidden>' +
    '<div class="acct-menu-name">' + esc(Cloud.user) + '</div>' +
    '<div class="acct-sync ' + syncState + '">' + label + '</div>' +
    (Cloud.adminConfigured ? '' :
      '<div class="acct-uid">your account id — paste into js/config.js as adminUid:' +
      '<code>' + esc(Cloud.uid) + '</code></div>') +
    '</div>');
  const out = el('<button class="acct-out">Sign out</button>');
  out.onclick = () => Cloud.logOut().then(() => { renderAccount(); buildNav(); route(); });
  menu.appendChild(out);
  chip.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; };
  acctWrap.appendChild(chip);
  acctWrap.appendChild(menu);
}

// one listener for the whole app, so re-rendering the chip cannot pile them up
document.addEventListener('click', () => {
  const m = document.querySelector('.acct-menu');
  if (m) m.hidden = true;
});

const authOverlay = document.getElementById('auth-overlay');
const authError = document.getElementById('auth-error');
document.getElementById('auth-kitty').innerHTML = KITTY.svg(44);

function openAuth() {
  authError.hidden = true;
  authOverlay.hidden = false;
  document.getElementById('auth-user').focus();
}
function closeAuth() { authOverlay.hidden = true; }
document.getElementById('auth-close').onclick = closeAuth;
authOverlay.addEventListener('click', e => { if (e.target === authOverlay) closeAuth(); });

function authGo(fn) {
  const u = document.getElementById('auth-user').value.trim();
  const p = document.getElementById('auth-pass').value;
  authError.hidden = true;
  fn(u, p).then(() => {
    closeAuth();
    renderAccount(); buildNav(); route();
  }).catch(e => {
    authError.textContent = e.message;
    authError.hidden = false;
  });
}
document.getElementById('auth-login').onclick = () => authGo(Cloud.logIn);
document.getElementById('auth-signup').onclick = () => authGo(Cloud.signUp);
document.getElementById('auth-pass').addEventListener('keydown', e => { if (e.key === 'Enter') authGo(Cloud.logIn); });

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
document.getElementById('brand-logo').innerHTML = KITTY.svg(30);
document.getElementById('theme-btn').onclick = () => S.toggleTheme();
document.getElementById('reset-btn').onclick = () => {
  const warn = Cloud.user
    ? 'Erase all your progress?\n\nThis clears XP, streak, flags and syllabus marks on this device, and the next sync will clear them in the cloud too.'
    : 'Erase all your progress on this device?\n\nXP, streak, flags and syllabus marks will be cleared. This cannot be undone.';
  if (!confirm(warn)) return;
  S.resetProgress();
  if (Cloud.user) Cloud.sync();
  route();
};
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
  else if (page === 'leaderboard') renderLeaderboard();
  else renderHome();
  buildNav();
  refreshChips();
}
window.addEventListener('hashchange', route);

// ---------- PWA ----------
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    // Take a waiting update immediately, then reload once so a stale
    // (or broken) cached build never sticks around.
    if (reg.waiting) reg.waiting.postMessage('skip-waiting');
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) sw.postMessage('skip-waiting');
      });
    });
    setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
  }).catch(() => { /* file:// or blocked — app still works */ });

  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    location.reload();
  });
}

window.App = { refreshChips };
renderAccount();
route();
})();
