// ============================================================
// Viz — interactive diagrams, drawn with plain SVG. No libraries.
// A note body drops in <div class="viz" data-viz="sinusoid"></div>
// and the app mounts the matching widget after rendering.
// ============================================================
(function () {
'use strict';

const NS = 'http://www.w3.org/2000/svg';
function E(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function H(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}
const fmt = (v, n) => (Math.round(v * Math.pow(10, n == null ? 2 : n)) / Math.pow(10, n == null ? 2 : n)).toString();

// ---------- shell: title, canvas area, controls, readout ----------
function shell(host, title, note) {
  host.innerHTML = '';
  const box = H('div', 'viz-box', host);
  H('div', 'viz-title', box, title);
  const stage = H('div', 'viz-stage', box);
  const ctrls = H('div', 'viz-ctrls', box);
  const read = H('div', 'viz-read', box);
  if (note) H('div', 'viz-note', box, note);
  return { box, stage, ctrls, read };
}

function slider(ctrls, label, min, max, step, val, onin) {
  const wrap = H('label', 'viz-slider', ctrls);
  const cap = H('span', 'viz-slabel', wrap);
  const inp = document.createElement('input');
  inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = val;
  wrap.appendChild(inp);
  const set = v => { cap.textContent = label + ' = ' + fmt(+v); };
  set(val);
  inp.addEventListener('input', () => { set(inp.value); onin(+inp.value); });
  return { input: inp, get value() { return +inp.value; }, set(v) { inp.value = v; set(v); } };
}

function toggle(ctrls, label, on, onch) {
  const b = H('button', 'viz-toggle' + (on ? ' on' : ''), ctrls, label);
  b.onclick = () => { on = !on; b.className = 'viz-toggle' + (on ? ' on' : ''); onch(on); };
  return b;
}

// ---------- coordinate plotter ----------
function Plot(stage, o) {
  o = Object.assign({ w: 480, h: 280, xmin: -1, xmax: 10, ymin: -3, ymax: 3, pad: 30 }, o);
  const svg = E('svg', { viewBox: '0 0 ' + o.w + ' ' + o.h, class: 'viz-svg', preserveAspectRatio: 'xMidYMid meet' }, stage);
  const X = x => o.pad + (x - o.xmin) / (o.xmax - o.xmin) * (o.w - 2 * o.pad);
  const Y = y => o.h - o.pad - (y - o.ymin) / (o.ymax - o.ymin) * (o.h - 2 * o.pad);
  const invX = px => o.xmin + (px - o.pad) / (o.w - 2 * o.pad) * (o.xmax - o.xmin);
  const invY = py => o.ymin + (o.h - o.pad - py) / (o.h - 2 * o.pad) * (o.ymax - o.ymin);

  function grid(stepX, stepY) {
    const g = E('g', { class: 'viz-grid' }, svg);
    for (let x = Math.ceil(o.xmin / stepX) * stepX; x <= o.xmax; x += stepX)
      E('line', { x1: X(x), y1: Y(o.ymin), x2: X(x), y2: Y(o.ymax) }, g);
    for (let y = Math.ceil(o.ymin / stepY) * stepY; y <= o.ymax; y += stepY)
      E('line', { x1: X(o.xmin), y1: Y(y), x2: X(o.xmax), y2: Y(y) }, g);
    return g;
  }
  function axes(labels) {
    const g = E('g', { class: 'viz-axis' }, svg);
    const y0 = Math.min(Math.max(0, o.ymin), o.ymax), x0 = Math.min(Math.max(0, o.xmin), o.xmax);
    E('line', { x1: X(o.xmin), y1: Y(y0), x2: X(o.xmax), y2: Y(y0) }, g);
    E('line', { x1: X(x0), y1: Y(o.ymin), x2: X(x0), y2: Y(o.ymax) }, g);
    if (labels) {
      const t1 = E('text', { x: X(o.xmax) - 4, y: Y(y0) - 6, class: 'viz-lab', 'text-anchor': 'end' }, svg);
      t1.textContent = labels[0];
      const t2 = E('text', { x: X(x0) + 6, y: Y(o.ymax) + 12, class: 'viz-lab' }, svg);
      t2.textContent = labels[1];
    }
    return g;
  }
  function curve(fn, cls, samples) {
    const n = samples || 240;
    let d = '', pen = false;
    for (let i = 0; i <= n; i++) {
      const x = o.xmin + (o.xmax - o.xmin) * i / n;
      const y = fn(x);
      if (!isFinite(y) || y < o.ymin - 50 || y > o.ymax + 50) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1) + ' ';
      pen = true;
    }
    return E('path', { d: d, class: cls || 'viz-curve', fill: 'none' }, svg);
  }
  return { svg, X, Y, invX, invY, grid, axes, curve, opts: o,
           g: cls => E('g', { class: cls || '' }, svg),
           clear: g => { while (g.firstChild) g.removeChild(g.firstChild); } };
}

// ============================================================
// Widgets
// ============================================================
const W = {};

// ---- 1. sinusoid explorer ----
W.sinusoid = host => {
  const s = shell(host, 'Sinusoid explorer', 'Move the dials and watch which feature of the wave each one controls.');
  const p = Plot(s.stage, { xmin: 0, xmax: 12, ymin: -6, ymax: 10 });
  p.grid(1, 2); p.axes(['t', 'y']);
  const mid = E('line', { class: 'viz-dash' }, p.svg);
  const g = p.g();
  const A = slider(s.ctrls, 'a (amplitude)', 0.5, 4, 0.1, 2, draw);
  const B = slider(s.ctrls, 'b', 0.2, 2, 0.05, 0.5, draw);
  const C = slider(s.ctrls, 'c (shift)', 0, 6, 0.1, 0, draw);
  const D = slider(s.ctrls, 'd (midline)', -2, 6, 0.5, 2, draw);
  function draw() {
    p.clear(g);
    const a = A.value, b = B.value, c = C.value, d = D.value;
    const path = p.curve(t => a * Math.sin(b * (t - c)) + d, 'viz-curve');
    g.appendChild(path);
    mid.setAttribute('x1', p.X(0)); mid.setAttribute('x2', p.X(12));
    mid.setAttribute('y1', p.Y(d)); mid.setAttribute('y2', p.Y(d));
    s.read.innerHTML = 'period = 2&pi;/b = <b>' + fmt(2 * Math.PI / b) + '</b> &nbsp;·&nbsp; max = <b>' +
      fmt(d + a) + '</b> &nbsp;·&nbsp; min = <b>' + fmt(d - a) + '</b> &nbsp;·&nbsp; midline y = <b>' + fmt(d) + '</b>';
  }
  draw();
};

// ---- 2. Argand plane ----
W.argand = host => {
  const s = shell(host, 'Argand plane', 'Drag the point. Multiplying by z rotates by arg z and scales by |z|.');
  const p = Plot(s.stage, { w: 380, h: 320, xmin: -5, xmax: 5, ymin: -5, ymax: 5 });
  p.grid(1, 1); p.axes(['Re', 'Im']);
  const g = p.g();
  let z = { x: 3, y: 2 };
  let showSq = false;
  toggle(s.ctrls, 'show z²', false, v => { showSq = v; draw(); });
  function arrow(x, y, cls) {
    E('line', { x1: p.X(0), y1: p.Y(0), x2: p.X(x), y2: p.Y(y), class: cls }, g);
    E('circle', { cx: p.X(x), cy: p.Y(y), r: 5, class: cls + '-dot' }, g);
  }
  function draw() {
    p.clear(g);
    arrow(z.x, z.y, 'viz-vec');
    if (showSq) arrow(z.x * z.x - z.y * z.y, 2 * z.x * z.y, 'viz-vec2');
    const r = Math.hypot(z.x, z.y), th = Math.atan2(z.y, z.x);
    E('path', { d: 'M ' + p.X(0.9) + ' ' + p.Y(0) + ' A 30 30 0 0 ' + (th > 0 ? '0' : '1') + ' ' +
      p.X(0.9 * Math.cos(th)) + ' ' + p.Y(0.9 * Math.sin(th)), class: 'viz-arc', fill: 'none' }, g);
    s.read.innerHTML = 'z = <b>' + fmt(z.x, 1) + (z.y < 0 ? ' − ' : ' + ') + fmt(Math.abs(z.y), 1) + 'i</b>' +
      ' &nbsp;·&nbsp; |z| = <b>' + fmt(r) + '</b> &nbsp;·&nbsp; arg z = <b>' + fmt(th, 2) + '</b> rad (' + fmt(th * 180 / Math.PI, 1) + '°)' +
      (showSq ? ' &nbsp;·&nbsp; |z²| = <b>' + fmt(r * r) + '</b>, arg doubles' : '');
  }
  function grab(ev) {
    const r = p.svg.getBoundingClientRect();
    const t = ev.touches ? ev.touches[0] : ev;
    const vx = (t.clientX - r.left) / r.width * p.opts.w, vy = (t.clientY - r.top) / r.height * p.opts.h;
    z = { x: Math.max(-5, Math.min(5, p.invX(vx))), y: Math.max(-5, Math.min(5, p.invY(vy))) };
    draw(); ev.preventDefault();
  }
  let down = false;
  p.svg.addEventListener('pointerdown', e => { down = true; grab(e); });
  p.svg.addEventListener('pointermove', e => { if (down) grab(e); });
  window.addEventListener('pointerup', () => { down = false; });
  draw();
};

// ---- 3. tangent / derivative ----
W.tangent = host => {
  const s = shell(host, 'The derivative is a gradient', 'Drag along the curve. The line is the tangent; its slope is f′(x).');
  const p = Plot(s.stage, { xmin: -3.2, xmax: 3.2, ymin: -4, ymax: 6 });
  p.grid(1, 1); p.axes(['x', 'y']);
  const fns = {
    'x³ − 3x': [x => x ** 3 - 3 * x, x => 3 * x * x - 3, 'f(x) = x³ − 3x', "f′(x) = 3x² − 3"],
    'x²': [x => x * x, x => 2 * x, 'f(x) = x²', "f′(x) = 2x"],
    'sin x': [Math.sin, Math.cos, 'f(x) = sin x', "f′(x) = cos x"],
  };
  let key = 'x³ − 3x', a = 1;
  const sel = H('select', 'viz-select', s.ctrls);
  Object.keys(fns).forEach(k => { const o = H('option', '', sel, k); o.value = k; });
  sel.onchange = () => { key = sel.value; draw(); };
  const A = slider(s.ctrls, 'x', -3, 3, 0.05, 1, v => { a = v; draw(); });
  const g = p.g();
  function draw() {
    p.clear(g);
    const [f, df, flab, dlab] = fns[key];
    g.appendChild(p.curve(f, 'viz-curve'));
    const y = f(a), m = df(a);
    const dx = 1.6;
    E('line', { x1: p.X(a - dx), y1: p.Y(y - m * dx), x2: p.X(a + dx), y2: p.Y(y + m * dx), class: 'viz-tangent' }, g);
    E('circle', { cx: p.X(a), cy: p.Y(y), r: 5, class: 'viz-point' }, g);
    s.read.innerHTML = flab + ' &nbsp;·&nbsp; ' + dlab + '<br>at x = <b>' + fmt(a) + '</b>: f(x) = <b>' + fmt(y) +
      '</b>, gradient f′(x) = <b>' + fmt(m) + '</b>' +
      (Math.abs(m) < 0.06 ? ' &nbsp;<span class="viz-flag">stationary point</span>' : (m > 0 ? ' (increasing)' : ' (decreasing)'));
  }
  A.input.addEventListener('input', draw);
  draw();
};

// ---- 4. area / trapezoidal rule ----
W.area = host => {
  const s = shell(host, 'Area under a curve', 'More strips, better estimate. Notice whether the chords sit above or below the curve.');
  const p = Plot(s.stage, { xmin: 0, xmax: 4, ymin: 0, ymax: 17 });
  p.grid(1, 4); p.axes(['x', 'y']);
  const g = p.g();
  let n = 4;
  const N = slider(s.ctrls, 'strips n', 1, 20, 1, 4, v => { n = v; draw(); });
  const f = x => x * x + 1;
  const exact = (64 / 3) + 4;   // ∫₀⁴ (x²+1) dx
  function draw() {
    p.clear(g);
    const h = 4 / n;
    let est = 0;
    for (let i = 0; i < n; i++) {
      const x0 = i * h, x1 = x0 + h;
      est += h / 2 * (f(x0) + f(x1));
      E('polygon', { points: [[p.X(x0), p.Y(0)], [p.X(x0), p.Y(f(x0))], [p.X(x1), p.Y(f(x1))], [p.X(x1), p.Y(0)]].map(q => q.join(',')).join(' '), class: 'viz-strip' }, g);
    }
    g.appendChild(p.curve(f, 'viz-curve'));
    s.read.innerHTML = 'trapezoid estimate = <b>' + fmt(est) + '</b> &nbsp;·&nbsp; exact ∫ = <b>' + fmt(exact) +
      '</b> &nbsp;·&nbsp; error = <b>' + fmt(est - exact) + '</b><br>' +
      '<span class="viz-flag">' + (est > exact ? 'overestimate — the curve is concave up, so chords sit above it' : 'estimate') + '</span>';
  }
  draw();
};

// ---- 5. slope field + Euler ----
W.slopefield = host => {
  const s = shell(host, 'Slope field and Euler’s method', 'The dashes are the gradient at every point. Euler walks the flow in straight steps.');
  const p = Plot(s.stage, { xmin: 0, xmax: 5, ymin: -1, ymax: 6 });
  p.axes(['x', 'y']);
  const field = p.g('viz-field');
  const g = p.g();
  let h = 0.5, y0 = 1;
  const fns = { 'dy/dx = x + y': (x, y) => x + y, 'dy/dx = y': (x, y) => y, 'dy/dx = x − y': (x, y) => x - y };
  let key = 'dy/dx = x + y';
  const sel = H('select', 'viz-select', s.ctrls);
  Object.keys(fns).forEach(k => { const o = H('option', '', sel, k); o.value = k; });
  sel.onchange = () => { key = sel.value; drawField(); draw(); };
  slider(s.ctrls, 'step h', 0.1, 1, 0.05, 0.5, v => { h = v; draw(); });
  slider(s.ctrls, 'y(0)', 0, 3, 0.1, 1, v => { y0 = v; draw(); });
  function drawField() {
    p.clear(field);
    const f = fns[key];
    for (let x = 0.25; x <= 5; x += 0.5) for (let y = -0.75; y <= 6; y += 0.75) {
      const m = f(x, y), ang = Math.atan(m), L = 11;
      E('line', { x1: p.X(x) - L * Math.cos(ang), y1: p.Y(y) + L * Math.sin(ang),
                  x2: p.X(x) + L * Math.cos(ang), y2: p.Y(y) - L * Math.sin(ang) }, field);
    }
  }
  function draw() {
    p.clear(g);
    const f = fns[key];
    let x = 0, y = y0, d = 'M ' + p.X(0) + ' ' + p.Y(y0) + ' ', steps = 0;
    while (x < 5 - 1e-9 && steps < 400) {
      y = y + h * f(x, y); x = x + h; steps++;
      if (y > 8 || y < -3) break;
      d += 'L ' + p.X(x) + ' ' + p.Y(y) + ' ';
      E('circle', { cx: p.X(x), cy: p.Y(y), r: 3, class: 'viz-point' }, g);
    }
    E('path', { d: d, class: 'viz-tangent', fill: 'none' }, g);
    s.read.innerHTML = 'after ' + steps + ' steps of h = <b>' + fmt(h) + '</b>: y ≈ <b>' + fmt(y) + '</b> at x = ' + fmt(x) +
      '<br><span class="viz-flag">smaller h hugs the true curve more closely</span>';
  }
  drawField(); draw();
};

// ---- 6. phase portrait ----
W.phase = host => {
  const s = shell(host, 'Phase portrait', 'Eigenvalue signs decide the shape. Change the matrix and watch the behaviour flip.');
  const p = Plot(s.stage, { w: 360, h: 320, xmin: -4, xmax: 4, ymin: -4, ymax: 4 });
  p.axes(['x', 'y']);
  const g = p.g();
  let a = 1, b = 4, c = 1, d = 1;
  slider(s.ctrls, 'a', -3, 3, 0.5, 1, v => { a = v; draw(); });
  slider(s.ctrls, 'b', -3, 4, 0.5, 4, v => { b = v; draw(); });
  slider(s.ctrls, 'c', -3, 3, 0.5, 1, v => { c = v; draw(); });
  slider(s.ctrls, 'd', -3, 3, 0.5, 1, v => { d = v; draw(); });
  function draw() {
    p.clear(g);
    for (let i = 0; i < 16; i++) {
      const th = i / 16 * 2 * Math.PI;
      let x = 3.6 * Math.cos(th), y = 3.6 * Math.sin(th), dd = '';
      for (let k = 0; k < 160; k++) {
        const dx = a * x + b * y, dy = c * x + d * y;
        const n = Math.hypot(dx, dy) || 1;
        x -= dx / n * 0.06; y -= dy / n * 0.06;      // integrate backwards for readable inflow
        if (Math.abs(x) > 4.2 || Math.abs(y) > 4.2) break;
        dd += (dd ? 'L' : 'M') + p.X(x).toFixed(1) + ' ' + p.Y(y).toFixed(1) + ' ';
      }
      if (dd) E('path', { d: dd, class: 'viz-flow', fill: 'none' }, g);
    }
    E('circle', { cx: p.X(0), cy: p.Y(0), r: 4, class: 'viz-point' }, g);
    const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
    let kind, l1, l2;
    if (disc >= 0) {
      l1 = (tr + Math.sqrt(disc)) / 2; l2 = (tr - Math.sqrt(disc)) / 2;
      kind = (l1 > 0 && l2 > 0) ? 'unstable node (source)' : (l1 < 0 && l2 < 0) ? 'stable node (sink)' : 'saddle point';
      s.read.innerHTML = 'λ = <b>' + fmt(l1) + '</b>, <b>' + fmt(l2) + '</b> &nbsp;·&nbsp; <span class="viz-flag">' + kind + '</span>';
    } else {
      const re = tr / 2, im = Math.sqrt(-disc) / 2;
      kind = re < 0 ? 'stable spiral' : re > 0 ? 'unstable spiral' : 'centre — closed orbits';
      s.read.innerHTML = 'λ = <b>' + fmt(re) + ' ± ' + fmt(im) + 'i</b> &nbsp;·&nbsp; <span class="viz-flag">' + kind + '</span>';
    }
  }
  draw();
};

// ---- 7. graph theory ----
W.graph = host => {
  const s = shell(host, 'Graph explorer', 'Click two vertices to add or remove an edge. Degrees update live.');
  const p = Plot(s.stage, { w: 380, h: 300, xmin: 0, xmax: 10, ymin: 0, ymax: 8, pad: 24 });
  const g = p.g();
  const V = [[2,6],[5,7],[8,6],[8,2.5],[5,1],[2,2.5]];
  let edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3]];
  let sel = null;
  function deg(i) { return edges.reduce((n, e) => n + (e[0] === i) + (e[1] === i), 0); }
  function draw() {
    p.clear(g);
    edges.forEach(e => E('line', { x1: p.X(V[e[0]][0]), y1: p.Y(V[e[0]][1]), x2: p.X(V[e[1]][0]), y2: p.Y(V[e[1]][1]), class: 'viz-edge' }, g));
    V.forEach((v, i) => {
      E('circle', { cx: p.X(v[0]), cy: p.Y(v[1]), r: 15, class: 'viz-node' + (sel === i ? ' sel' : ''), 'data-i': i }, g);
      const t = E('text', { x: p.X(v[0]), y: p.Y(v[1]) + 4, class: 'viz-nodelab', 'text-anchor': 'middle' }, g);
      t.textContent = deg(i);
    });
    const odd = V.map((_, i) => deg(i)).filter(d => d % 2).length;
    const verdict = odd === 0 ? 'every degree even → Eulerian CIRCUIT exists'
      : odd === 2 ? 'exactly two odd vertices → Eulerian TRAIL (no return)'
      : odd + ' odd vertices → no Eulerian trail or circuit';
    s.read.innerHTML = 'edges = <b>' + edges.length + '</b> &nbsp;·&nbsp; Σdeg = <b>' + V.map((_, i) => deg(i)).reduce((x, y) => x + y, 0) +
      '</b> = 2 × edges &nbsp;·&nbsp; odd-degree vertices = <b>' + odd + '</b><br><span class="viz-flag">' + verdict + '</span>';
  }
  p.svg.addEventListener('click', ev => {
    const i = ev.target.getAttribute && ev.target.getAttribute('data-i');
    if (i === null || i === undefined) return;
    const k = +i;
    if (sel === null) { sel = k; }
    else if (sel === k) { sel = null; }
    else {
      const ix = edges.findIndex(e => (e[0] === sel && e[1] === k) || (e[0] === k && e[1] === sel));
      if (ix >= 0) edges.splice(ix, 1); else edges.push([sel, k]);
      sel = null;
    }
    draw();
  });
  draw();
};

// ---- 8. normal distribution / p-value ----
W.normal = host => {
  const s = shell(host, 'p-values on the normal curve', 'The shaded tail IS the p-value: how extreme your sample looks if H₀ were true.');
  const p = Plot(s.stage, { xmin: -4, xmax: 4, ymin: 0, ymax: 0.45, pad: 28 });
  p.axes(['z', '']);
  const g = p.g();
  let z = 2, two = false;
  slider(s.ctrls, 'test statistic z', -3.5, 3.5, 0.05, 2, v => { z = v; draw(); });
  toggle(s.ctrls, 'two-tailed', false, v => { two = v; draw(); });
  const pdf = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  function cdf(x) {                       // Abramowitz-Stegun
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = pdf(x) * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - d : d;
  }
  function shade(lo, hi) {
    let d = 'M ' + p.X(lo) + ' ' + p.Y(0) + ' ';
    for (let i = 0; i <= 60; i++) { const x = lo + (hi - lo) * i / 60; d += 'L ' + p.X(x) + ' ' + p.Y(pdf(x)) + ' '; }
    d += 'L ' + p.X(hi) + ' ' + p.Y(0) + ' Z';
    E('path', { d: d, class: 'viz-shade' }, g);
  }
  function draw() {
    p.clear(g);
    g.appendChild(p.curve(pdf, 'viz-curve'));
    if (two) { shade(Math.abs(z), 4); shade(-4, -Math.abs(z)); }
    else if (z >= 0) shade(z, 4); else shade(-4, z);
    E('line', { x1: p.X(z), y1: p.Y(0), x2: p.X(z), y2: p.Y(0.42), class: 'viz-tangent' }, g);
    const tail = z >= 0 ? 1 - cdf(z) : cdf(z);
    const pv = two ? 2 * (1 - cdf(Math.abs(z))) : tail;
    s.read.innerHTML = 'p-value = <b>' + pv.toFixed(4) + '</b> &nbsp;·&nbsp; ' +
      '<span class="viz-flag">' + (pv < 0.01 ? 'p < 0.01 — strong evidence against H₀'
        : pv < 0.05 ? 'p < 0.05 — reject H₀ at the 5% level'
        : 'p > 0.05 — insufficient evidence to reject H₀') + '</span>';
  }
  draw();
};

// ---- 9. matrix transformation ----
W.matrix = host => {
  const s = shell(host, 'Matrices move the plane', 'The columns are where (1,0) and (0,1) land. |det| is the area factor.');
  const p = Plot(s.stage, { w: 340, h: 320, xmin: -3, xmax: 3, ymin: -3, ymax: 3 });
  p.grid(1, 1); p.axes(['x', 'y']);
  const g = p.g();
  let a = 1, b = 0, c = 0, d = 1;
  slider(s.ctrls, 'a', -2, 3, 0.25, 1, v => { a = v; draw(); });
  slider(s.ctrls, 'b', -2, 3, 0.25, 0, v => { b = v; draw(); });
  slider(s.ctrls, 'c', -2, 3, 0.25, 0, v => { c = v; draw(); });
  slider(s.ctrls, 'd', -2, 3, 0.25, 1, v => { d = v; draw(); });
  function draw() {
    p.clear(g);
    const unit = [[0,0],[1,0],[1,1],[0,1]];
    E('polygon', { points: unit.map(q => p.X(q[0]) + ',' + p.Y(q[1])).join(' '), class: 'viz-ghost' }, g);
    const img = unit.map(q => [a * q[0] + b * q[1], c * q[0] + d * q[1]]);
    E('polygon', { points: img.map(q => p.X(q[0]) + ',' + p.Y(q[1])).join(' '), class: 'viz-strip' }, g);
    E('line', { x1: p.X(0), y1: p.Y(0), x2: p.X(a), y2: p.Y(c), class: 'viz-vec' }, g);
    E('line', { x1: p.X(0), y1: p.Y(0), x2: p.X(b), y2: p.Y(d), class: 'viz-vec2' }, g);
    const det = a * d - b * c;
    s.read.innerHTML = 'det = ad − bc = <b>' + fmt(det) + '</b> &nbsp;·&nbsp; areas ×<b>' + fmt(Math.abs(det)) + '</b>' +
      '<br><span class="viz-flag">' + (Math.abs(det) < 1e-9 ? 'det = 0 — the plane is squashed flat onto a line, no inverse'
        : det < 0 ? 'negative det — orientation is flipped (mirrored)' : 'orientation preserved') + '</span>';
  }
  draw();
};

// ---- 10. logistic growth ----
W.logistic = host => {
  const s = shell(host, 'Logistic growth', 'Exponential at first, then the ceiling bites. Steepest at exactly L/2.');
  const p = Plot(s.stage, { xmin: 0, xmax: 20, ymin: 0, ymax: 1100 });
  p.grid(5, 250); p.axes(['t', 'P']);
  const g = p.g();
  let L = 1000, C = 19, k = 0.4;
  slider(s.ctrls, 'L (ceiling)', 200, 1000, 50, 1000, v => { L = v; draw(); });
  slider(s.ctrls, 'C', 2, 40, 1, 19, v => { C = v; draw(); });
  slider(s.ctrls, 'k (rate)', 0.1, 1, 0.05, 0.4, v => { k = v; draw(); });
  function draw() {
    p.clear(g);
    const f = t => L / (1 + C * Math.exp(-k * t));
    g.appendChild(p.curve(f, 'viz-curve'));
    E('line', { x1: p.X(0), y1: p.Y(L), x2: p.X(20), y2: p.Y(L), class: 'viz-dash' }, g);
    const tHalf = Math.log(C) / k;
    if (tHalf <= 20) {
      E('circle', { cx: p.X(tHalf), cy: p.Y(L / 2), r: 5, class: 'viz-point' }, g);
      E('line', { x1: p.X(tHalf), y1: p.Y(0), x2: p.X(tHalf), y2: p.Y(L / 2), class: 'viz-dash' }, g);
    }
    s.read.innerHTML = 'P(0) = <b>' + fmt(L / (1 + C), 1) + '</b> &nbsp;·&nbsp; ceiling L = <b>' + L +
      '</b> &nbsp;·&nbsp; fastest growth at t = ln(C)/k = <b>' + fmt(tHalf) + '</b>, where P = L/2 = <b>' + fmt(L / 2, 0) + '</b>';
  }
  draw();
};

// ---- 11. vectors ----
W.vectors = host => {
  const s = shell(host, 'Vectors: dot product and angle', 'Drag either arrow. The dot product goes to zero exactly at 90°.');
  const p = Plot(s.stage, { w: 360, h: 320, xmin: -5, xmax: 5, ymin: -5, ymax: 5 });
  p.grid(1, 1); p.axes(['x', 'y']);
  const g = p.g();
  let a = { x: 4, y: 1 }, b = { x: 1, y: 3 }, drag = null;
  function draw() {
    p.clear(g);
    E('line', { x1: p.X(0), y1: p.Y(0), x2: p.X(a.x), y2: p.Y(a.y), class: 'viz-vec' }, g);
    E('circle', { cx: p.X(a.x), cy: p.Y(a.y), r: 7, class: 'viz-vec-dot', 'data-v': 'a' }, g);
    E('line', { x1: p.X(0), y1: p.Y(0), x2: p.X(b.x), y2: p.Y(b.y), class: 'viz-vec2' }, g);
    E('circle', { cx: p.X(b.x), cy: p.Y(b.y), r: 7, class: 'viz-vec2-dot', 'data-v': 'b' }, g);
    E('line', { x1: p.X(a.x), y1: p.Y(a.y), x2: p.X(a.x + b.x), y2: p.Y(a.y + b.y), class: 'viz-dash' }, g);
    E('line', { x1: p.X(b.x), y1: p.Y(b.y), x2: p.X(a.x + b.x), y2: p.Y(a.y + b.y), class: 'viz-dash' }, g);
    const dot = a.x * b.x + a.y * b.y;
    const ang = Math.acos(dot / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y))) * 180 / Math.PI;
    s.read.innerHTML = 'a·b = <b>' + fmt(dot) + '</b> &nbsp;·&nbsp; |a| = <b>' + fmt(Math.hypot(a.x, a.y)) +
      '</b>, |b| = <b>' + fmt(Math.hypot(b.x, b.y)) + '</b> &nbsp;·&nbsp; angle = <b>' + fmt(ang, 1) + '°</b><br>' +
      '<span class="viz-flag">' + (Math.abs(dot) < 0.25 ? 'dot ≈ 0 → perpendicular' : dot > 0 ? 'positive dot → angle under 90°' : 'negative dot → obtuse angle') + '</span>';
  }
  function at(ev) {
    const r = p.svg.getBoundingClientRect();
    const t = ev.touches ? ev.touches[0] : ev;
    return { x: p.invX((t.clientX - r.left) / r.width * p.opts.w), y: p.invY((t.clientY - r.top) / r.height * p.opts.h) };
  }
  p.svg.addEventListener('pointerdown', ev => {
    const v = ev.target.getAttribute && ev.target.getAttribute('data-v');
    if (v) drag = v; else {
      const q = at(ev);
      drag = (Math.hypot(q.x - a.x, q.y - a.y) < Math.hypot(q.x - b.x, q.y - b.y)) ? 'a' : 'b';
    }
    ev.preventDefault();
  });
  p.svg.addEventListener('pointermove', ev => {
    if (!drag) return;
    const q = at(ev);
    const c = { x: Math.max(-5, Math.min(5, q.x)), y: Math.max(-5, Math.min(5, q.y)) };
    if (drag === 'a') a = c; else b = c;
    draw(); ev.preventDefault();
  });
  window.addEventListener('pointerup', () => { drag = null; });
  draw();
};

// ---- 12. Markov convergence ----
W.markov = host => {
  const s = shell(host, 'Markov chain converging', 'Wherever it starts, the long run settles on the same steady state.');
  const p = Plot(s.stage, { xmin: 0, xmax: 14, ymin: 0, ymax: 1.05, pad: 30 });
  p.grid(2, 0.25); p.axes(['step n', 'P(state 1)']);
  const g = p.g();
  let stay1 = 0.9, stay2 = 0.7, start = 1;
  slider(s.ctrls, 'P(stay in 1)', 0.05, 0.95, 0.05, 0.9, v => { stay1 = v; draw(); });
  slider(s.ctrls, 'P(stay in 2)', 0.05, 0.95, 0.05, 0.7, v => { stay2 = v; draw(); });
  slider(s.ctrls, 'start P(state 1)', 0, 1, 0.05, 1, v => { start = v; draw(); });
  function draw() {
    p.clear(g);
    const steady = (1 - stay2) / ((1 - stay1) + (1 - stay2));
    E('line', { x1: p.X(0), y1: p.Y(steady), x2: p.X(14), y2: p.Y(steady), class: 'viz-dash' }, g);
    [start, 0, 0.5].forEach((s0, i) => {
      let x = s0, d = 'M ' + p.X(0) + ' ' + p.Y(x) + ' ';
      for (let n = 1; n <= 14; n++) {
        x = stay1 * x + (1 - stay2) * (1 - x);
        d += 'L ' + p.X(n) + ' ' + p.Y(x) + ' ';
      }
      E('path', { d: d, class: i === 0 ? 'viz-curve' : 'viz-flow', fill: 'none' }, g);
      if (i === 0) for (let n = 0, y = s0; n <= 14; n++) {
        E('circle', { cx: p.X(n), cy: p.Y(y), r: 3, class: 'viz-point' }, g);
        y = stay1 * y + (1 - stay2) * (1 - y);
      }
    });
    s.read.innerHTML = 'steady state P(state 1) = <b>' + fmt(steady, 3) + '</b>' +
      '<br><span class="viz-flag">all three starting points converge to the same line — the long run forgets where it began</span>';
  }
  draw();
};

// ---- 13. Poisson distribution ----
W.poisson = host => {
  const s = shell(host, 'Poisson distribution', 'Slide the mean. Notice the spread grows with it — mean and variance stay equal.');
  const p = Plot(s.stage, { xmin: -0.5, xmax: 15, ymin: 0, ymax: 0.42, pad: 30 });
  p.axes(['k', 'P(X = k)']);
  const g = p.g();
  let m = 2;
  slider(s.ctrls, 'mean m', 0.5, 10, 0.5, 2, v => { m = v; draw(); });
  function draw() {
    p.clear(g);
    let fact = 1;
    for (let k = 0; k <= 15; k++) {
      if (k > 0) fact *= k;
      const pr = Math.exp(-m) * Math.pow(m, k) / fact;
      const w = (p.X(1) - p.X(0)) * 0.62;
      E('rect', { x: p.X(k) - w / 2, y: p.Y(Math.min(pr, 0.42)), width: w,
                  height: Math.max(0, p.Y(0) - p.Y(Math.min(pr, 0.42))), class: 'viz-strip' }, g);
    }
    E('line', { x1: p.X(m), y1: p.Y(0), x2: p.X(m), y2: p.Y(0.4), class: 'viz-tangent' }, g);
    s.read.innerHTML = 'E(X) = <b>' + fmt(m, 1) + '</b> &nbsp;·&nbsp; Var(X) = <b>' + fmt(m, 1) +
      '</b> &nbsp;·&nbsp; sd = <b>' + fmt(Math.sqrt(m)) + '</b><br>' +
      'P(X = 0) = <b>' + Math.exp(-m).toFixed(4) + '</b> &nbsp;·&nbsp; ' +
      '<span class="viz-flag">mean = variance is the Poisson fingerprint</span>';
  }
  draw();
};

// ---- 14. log-log linearisation ----
W.loglog = host => {
  const s = shell(host, 'Why logs straighten a curve', 'The same data, twice. On log-log axes a power law becomes a straight line of gradient n.');
  const p = Plot(s.stage, { xmin: -0.2, xmax: 10, ymin: -0.3, ymax: 5.2, pad: 32 });
  const ax = p.g('viz-axis'); const g = p.g();
  let n = 2, a = 1.5, log = false;
  slider(s.ctrls, 'power n', 0.5, 3, 0.1, 2, v => { n = v; draw(); });
  slider(s.ctrls, 'a', 0.5, 4, 0.1, 1.5, v => { a = v; draw(); });
  toggle(s.ctrls, 'log-log axes', false, v => { log = v; draw(); });
  const xs = [1, 1.6, 2.4, 3.5, 5, 6.8, 9];
  function draw() {
    p.clear(ax); p.clear(g);
    E('line', { x1: p.X(0), y1: p.Y(0), x2: p.X(10), y2: p.Y(0) }, ax);
    E('line', { x1: p.X(0), y1: p.Y(-0.3), x2: p.X(0), y2: p.Y(5.2) }, ax);
    const pts = xs.map(x => {
      const y = a * Math.pow(x, n);
      return log ? [Math.log10(x) * 9 + 0.4, Math.log10(y) * 2 + 1.4] : [x, y / 12];
    });
    let d = '';
    pts.forEach((q, i) => { d += (i ? 'L' : 'M') + p.X(q[0]) + ' ' + p.Y(q[1]) + ' '; });
    E('path', { d: d, class: 'viz-curve', fill: 'none' }, g);
    pts.forEach(q => E('circle', { cx: p.X(q[0]), cy: p.Y(q[1]), r: 4, class: 'viz-point' }, g));
    const t1 = E('text', { x: p.X(9.6), y: p.Y(-0.05), class: 'viz-lab', 'text-anchor': 'end' }, g);
    t1.textContent = log ? 'log x' : 'x';
    const t2 = E('text', { x: p.X(0.25), y: p.Y(5.0), class: 'viz-lab' }, g);
    t2.textContent = log ? 'log y' : 'y';
    s.read.innerHTML = 'model: y = <b>' + fmt(a, 1) + '</b>x<sup><b>' + fmt(n, 1) + '</b></sup>' +
      '<br><span class="viz-flag">' + (log
        ? 'log y = log a + n log x — a straight line whose gradient IS n'
        : 'on ordinary axes it is a curve, and you cannot read n off it') + '</span>';
  }
  draw();
};

// ---------- mounting ----------
function mountAll(root) {
  (root || document).querySelectorAll('.viz[data-viz]').forEach(host => {
    if (host.dataset.mounted) return;
    const fn = W[host.dataset.viz];
    if (!fn) { host.innerHTML = ''; return; }
    try { fn(host); host.dataset.mounted = '1'; }
    catch (e) { host.innerHTML = '<div class="viz-box viz-note">This diagram could not load.</div>'; }
  });
}

window.VIZ = { mount: mountAll, widgets: W, names: Object.keys(W) };
})();
