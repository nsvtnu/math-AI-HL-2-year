// ============================================================
// Orbit data — teacher calendar, units, gap topics, syllabus map
// Math in $...$ / $$...$$ rendered by MiniTeX. L = String.raw
// keeps backslashes intact. Avoid "${" inside L`...`.
// ============================================================
const L = String.raw;

// ---- The teacher's calendar (semester 1), transcribed from the sheet ----
// y-m-d used for countdowns. unit '' = review/assessment/break rows.
const CAL = [
  { d: '2026-08-18', dow: 'Tue', unit: '3.1', what: 'Modelling with sinusoidal curves' },
  { d: '2026-08-20', dow: 'Thu', unit: '3.1', what: 'Geometry of complex numbers' },
  { d: '2026-08-24', dow: 'Mon', unit: '3.1', what: 'Adding sine curves with complex numbers' },
  { d: '2026-08-26', dow: 'Wed', unit: '3.2', what: 'Differentiation motivation — power rule & transcendental functions' },
  { d: '2026-08-28', dow: 'Fri', unit: '3.2', what: 'Product, chain and quotient rules' },
  { d: '2026-09-01', dow: 'Tue', unit: '', what: 'Review' },
  { d: '2026-09-03', dow: 'Thu', unit: '', what: 'Summative 1', assess: true },
  { d: '2026-09-07', dow: 'Mon', unit: '3.2', what: 'Antidifferentiation rules' },
  { d: '2026-09-09', dow: 'Wed', unit: '3.2', what: 'Antidifferentiation rules' },
  { d: '2026-09-14', dow: 'Mon', unit: '3.3', what: 'Tangent & normal lines / piecewise functions' },
  { d: '2026-09-17', dow: 'Thu', unit: '3.3', what: 'First & second derivative tests / optimisation' },
  { d: '2026-09-21', dow: 'Mon', unit: '3.3', what: 'Related rates' },
  { d: '2026-09-23', dow: 'Wed', unit: '3.3', what: 'Related rates' },
  { d: '2026-09-25', dow: 'Fri', unit: '', what: 'Review' },
  { d: '2026-09-29', dow: 'Tue', unit: '', what: 'Summative 2', assess: true },
  { d: '2026-10-01', dow: 'Thu', unit: '3.4', what: 'Area between curves / numeric integration' },
  { d: '2026-10-05', dow: 'Mon', unit: '3.4', what: 'Solids of revolution' },
  { d: '2026-10-07', dow: 'Wed', unit: '3.5', what: 'Separating variables' },
  { d: '2026-10-09', dow: 'Fri', unit: '', what: 'Review' },
  { d: '2026-10-13', dow: 'Tue', unit: '', what: 'Summative 3', assess: true },
  { d: '2026-10-15', dow: 'Thu', unit: '3.5', what: 'Slope fields' },
  { d: '2026-10-21', dow: 'Wed', unit: '3.5', what: "Euler's method" },
  { d: '2026-10-27', dow: 'Tue', unit: '3.5', what: 'Systems of differential equations' },
  { d: '2026-10-29', dow: 'Thu', unit: '3.5', what: 'Systems of differential equations' },
  { d: '2026-11-03', dow: 'Tue', unit: '3.5', what: "Euler's method for coupled differential equations" },
  { d: '2026-11-05', dow: 'Thu', unit: '', what: 'Review' },
  { d: '2026-11-09', dow: 'Mon', unit: '', what: 'Summative 4', assess: true },
  { d: '2026-11-11', dow: 'Wed', unit: '3.6', what: 'Graph theory' },
  { d: '2026-11-17', dow: 'Tue', unit: '3.6', what: 'Graph theory' },
  { d: '2026-11-19', dow: 'Thu', unit: '3.6', what: 'Graph theory' },
  { d: '2026-11-23', dow: 'Mon', unit: '', what: 'Fall break 🍂' },
  { d: '2026-11-30', dow: 'Mon', unit: '', what: 'Summative 5', assess: true },
  { d: '2026-12-02', dow: 'Wed', unit: '3.7', what: 'Confidence intervals, t-test, z-test' },
  { d: '2026-12-04', dow: 'Fri', unit: '3.7', what: 'Chi-square test for independence / goodness of fit' },
  { d: '2026-12-08', dow: 'Tue', unit: '3.7', what: 'Poisson mean / linear correlation / population proportion tests' },
  { d: '2026-12-10', dow: 'Thu', unit: '3.7', what: 'Type I and Type II errors' },
  { d: '2026-12-14', dow: 'Mon', unit: '3.7', what: 'Review' },
  { d: '2026-12-16', dow: 'Wed', unit: '3.7', what: 'Review' },
  { d: '2026-12-18', dow: 'Fri', unit: '', what: 'Summative 6', assess: true },
  { d: '2026-12-21', dow: 'Mon', unit: '', what: 'Winter break ❄️' },
  { d: '2027-01-06', dow: 'Wed', unit: '', what: 'Log-log plots' },
  { d: '2027-01-08', dow: 'Fri', unit: '', what: 'Review' },
  { d: '2027-01-12', dow: 'Tue', unit: '', what: 'Review' },
  { d: '2027-01-14', dow: 'Thu', unit: '', what: 'Review' },
  { d: '2027-01-18', dow: 'Mon', unit: '', what: 'Final Exam — Semester 1', assess: true },
  { d: '2027-01-20', dow: 'Wed', unit: '3.8', what: 'Unit 3.8 begins (semester 2)' },
];

const ASSESS = [
  { name: 'Summative 1', d: '2026-09-03', covers: '3.1 – 3.2 (complex numbers, differentiation rules)' },
  { name: 'Summative 2', d: '2026-09-29', covers: '3.2 – 3.3 (antidifferentiation, applications)' },
  { name: 'Summative 3', d: '2026-10-13', covers: '3.4 – 3.5 (integration, separable DEs)' },
  { name: 'Summative 4', d: '2026-11-09', covers: '3.5 (differential equations, Euler, systems)' },
  { name: 'Summative 5', d: '2026-11-30', covers: '3.6 (graph theory)' },
  { name: 'Summative 6', d: '2026-12-18', covers: '3.7 (inference & hypothesis testing)' },
  { name: 'Final Exam S1', d: '2027-01-18', covers: 'Everything from semester 1' },
];

// ============================================================
// Scheduled units (teacher's 3.x numbering)
// ============================================================
const UNITS = [
{
id: 'u31', code: '3.1', emoji: '🌀', title: 'Complex Numbers & Sinusoids',
sub: 'Argand geometry, polar form, and why adding sine waves is secretly complex-number addition.',
syll: 'AI HL 1.12, 1.13 · 2.5 · 3.8',
notes: [
{ h: 'Sinusoidal models', body: L`
<p>Everything periodic — tides, temperature, Ferris wheels — gets modelled by</p>
<div class="fbox">$f(t) = a\sin(b(t - c)) + d$ &nbsp;·&nbsp; amplitude $|a|$, period $\frac{360°}{b}$ (or $\frac{2\pi}{b}$ in radians), midline $y = d$, horizontal shift $c$</div>
<p>Fitting workflow: midline $d$ = (max + min)/2, amplitude $a$ = (max − min)/2, $b$ from the period, then slide with $c$. Sketch first, algebra second.</p>` },
{ h: 'Complex numbers as geometry', body: L`
<p>$z = x + iy$ is a <b>point</b> (or arrow) in the Argand plane: real axis across, imaginary axis up. Adding complex numbers = adding arrows tip-to-tail. Two measurements describe the arrow:</p>
<div class="fbox">modulus $|z| = \sqrt{x^2 + y^2}$ &nbsp;·&nbsp; argument $\theta = \arg z$ (angle from positive real axis)</div>
<p>Example: $|3 - 4i| = \sqrt{9+16} = 5$, $\arg(1+i) = \frac{\pi}{4}$.</p>` },
{ h: 'Polar / Euler form & De Moivre', body: L`
<div class="fbox">$z = r(\cos\theta + i\sin\theta) = r\,\text{cis}\,\theta = re^{i\theta}$</div>
<p><b>Multiplying</b> complex numbers: multiply moduli, <b>add</b> arguments. That single sentence is most of the topic. Raising to powers is repeated multiplication:</p>
<div class="fbox">De Moivre: $z^n = r^n \text{cis}(n\theta)$</div>
<p>Example: $(1+i)^8 = (\sqrt{2})^8 \text{cis}(8 \cdot \frac{\pi}{4}) = 16\,\text{cis}(2\pi) = 16$.</p>` },
{ h: 'Adding sine curves with phasors', body: L`
<p>A wave $a\sin(\omega t + \varphi)$ can be stored as the complex number $a e^{i\varphi}$ (a <b>phasor</b> — amplitude and phase, frequency understood). Adding two same-frequency waves = adding their phasors as arrows; the result is <em>still</em> a sinusoid with that frequency.</p>
<div class="fbox">$a\sin\omega t + b\cos\omega t = R\sin(\omega t + \varphi)$ with $R = \sqrt{a^2+b^2}$, $\tan\varphi = \frac{b}{a}$</div>
<p>Example: $3\sin t + 4\cos t$ has amplitude $\sqrt{3^2+4^2} = 5$. The 3-4-5 triangle strikes again.</p>` },
],
},
{
id: 'u32', code: '3.2', emoji: '⚡', title: 'Differentiation & Antidifferentiation',
sub: 'The full HL derivative toolkit, then running it in reverse.',
syll: 'AI HL 5.9 · 5.11',
notes: [
{ h: 'The derivative table (radians only!)', body: L`
<div class="fbox">$\frac{d}{dx}x^n = nx^{n-1}$ · $\frac{d}{dx}\sin x = \cos x$ · $\frac{d}{dx}\cos x = -\sin x$ · $\frac{d}{dx}\tan x = \frac{1}{\cos^2 x}$ · $\frac{d}{dx}e^x = e^x$ · $\frac{d}{dx}\ln x = \frac{1}{x}$</div>
<p>These six + three rules below = every derivative in the course. Trig calculus only works in <b>radians</b> — check your GDC mode before every paper.</p>` },
{ h: 'Chain, product, quotient', body: L`
<div class="fbox">Chain: $\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}$ — outside first (inside untouched), times inside's derivative</div>
<div class="fbox">Product: $(uv)' = u'v + uv'$ &nbsp;·&nbsp; Quotient: $\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$</div>
<p>Example: $\frac{d}{dx}(2x+1)^5 = 5(2x+1)^4 \times 2 = 10(2x+1)^4$. The ×2 (inside derivative) is the most-forgotten factor in the whole course.</p>` },
{ h: 'Antidifferentiation', body: L`
<p>Integration reverses the table. Power rule backwards — raise the power, divide by it:</p>
<div class="fbox">$\int x^n dx = \frac{x^{n+1}}{n+1} + c$ $(n \ne -1)$ · $\int \frac{1}{x}dx = \ln|x| + c$ · $\int e^x dx = e^x + c$ · $\int \sin x\, dx = -\cos x + c$ · $\int \cos x\, dx = \sin x + c$</div>
<p>Linear inside? Divide by its coefficient: $\int \cos(3x)dx = \frac{\sin 3x}{3} + c$, $\int e^{2x+1}dx = \frac{1}{2}e^{2x+1} + c$.</p>
<p>The $+c$ is not decoration — infinitely many curves share a gradient function. Given a point, solve for $c$.</p>` },
],
},
{
id: 'u33', code: '3.3', emoji: '⛰️', title: 'Applications of Differentiation',
sub: 'Tangents, normals, max/min tests, optimisation and related rates.',
syll: 'AI HL 5.4 · 5.6 · 5.7 · 5.9 · 5.10',
notes: [
{ h: 'Tangents & normals (3-step ritual)', body: L`
<ol><li><b>Point:</b> $y_1 = f(a)$ — from the original function.</li>
<li><b>Gradient:</b> $m = f'(a)$ — from the derivative.</li>
<li><b>Line:</b> $y - y_1 = m(x - x_1)$. Normal: use $-\frac{1}{m}$ instead.</li></ol>` },
{ h: 'First & second derivative tests', body: L`
<p>Stationary points: solve $f'(x) = 0$. Classify:</p>
<div class="fbox">$f''(a) &lt; 0$: local max (frown) · $f''(a) &gt; 0$: local min (cup) · $f''(a) = 0$: no verdict — check the sign of $f'$ either side</div>
<p>Inflection point: $f'' = 0$ <em>and</em> $f''$ changes sign (concavity flips). $f''=0$ alone proves nothing — $y = x^4$ has $f''(0)=0$ at a minimum.</p>` },
{ h: 'Optimisation recipe', body: L`
<ol><li>Diagram, name variables.</li><li>Write the target quantity.</li><li>Use the constraint to reach <b>one variable</b>.</li><li>Differentiate, set to 0, solve.</li><li>Justify max/min ($f''$ sign or sign table).</li><li>Answer the question actually asked (value, not just $x$).</li></ol>
<p>Check endpoints of the domain too — in modelling questions the best value sometimes lives on the boundary where $f' \ne 0$.</p>` },
{ h: 'Related rates', body: L`
<p>Two quantities linked by a formula, both changing in time? Differentiate the <em>relationship</em> with respect to $t$ using the chain rule:</p>
<div class="fbox">$A = \pi r^2 \Rightarrow \frac{dA}{dt} = 2\pi r \frac{dr}{dt}$</div>
<p>Recipe: write the geometric relation → differentiate w.r.t. $t$ → substitute the snapshot values <em>last</em>. Substituting numbers before differentiating is the classic L (it freezes the quantity and kills the rate).</p>` },
{ h: 'Piecewise functions', body: L`
<p>At a join $x = a$: <b>continuous</b> if both pieces give the same value; <b>differentiable</b> (smooth) if additionally both pieces give the same derivative at $a$. Corners are continuous but not differentiable.</p>` },
],
},
{
id: 'u34', code: '3.4', emoji: '📏', title: 'Integration: Areas & Solids',
sub: 'Definite integrals, area between curves, the trapezoidal rule, and volumes of revolution.',
syll: 'AI HL 5.5 · 5.8 · 5.11 · 5.12',
notes: [
{ h: 'Definite integrals & area', body: L`
<div class="fbox">$\int_a^b f(x)dx = F(b) - F(a)$ where $F' = f$ — antidifferentiate, top minus bottom</div>
<p>Integrals count area <b>below the axis as negative</b>. For geometric area, split at the roots and add absolute values. Area between curves: $\int_a^b (\text{top} - \text{bottom})\,dx$ with limits at the intersections (solve $f = g$).</p>` },
{ h: 'Trapezoidal rule (numeric integration)', body: L`
<div class="fbox">$\int_a^b y\,dx \approx \frac{h}{2}\left[y_0 + y_n + 2(y_1 + \dots + y_{n-1})\right]$, $h = \frac{b-a}{n}$</div>
<p>Ends once, middles twice. $n$ strips need $n{+}1$ heights (fencepost alert). Concave-up curve → chords sit above → <b>overestimate</b>; concave-down → underestimate. Sketch one strip to see it.</p>` },
{ h: 'Solids of revolution', body: L`
<p>Spin the region under $y = f(x)$ about the $x$-axis; every slice is a disc of radius $y$, thickness $dx$:</p>
<div class="fbox">$V = \pi \int_a^b y^2\, dx$ &nbsp;·&nbsp; about the $y$-axis: $V = \pi \int x^2\, dy$</div>
<p>Square <em>the whole expression</em>: $(2\sqrt{x})^2 = 4x$. Sanity-check simple cases against geometry ($y = 2$ on $[0,3]$ gives a cylinder, $12\pi$).</p>` },
],
},
{
id: 'u35', code: '3.5', emoji: '🧬', title: 'Differential Equations',
sub: 'Separation of variables, slope fields, Euler, and coupled systems — the HL boss level.',
syll: 'AI HL 5.14 – 5.17 (+5.18 via systems)',
notes: [
{ h: 'Separable equations', body: L`
<div class="fbox">$\frac{dy}{dx} = f(x)g(y) \Rightarrow \int \frac{dy}{g(y)} = \int f(x)dx$</div>
<p>Sort variables to opposite sides, integrate both, add $+c$ <em>at the moment of integrating</em>. The GOAT example: $\frac{dy}{dx} = ky \Rightarrow y = Ae^{kx}$ — change proportional to size ⇒ exponential. ($A$ absorbs $e^c$; it is NOT "$e^{kx} + c$".)</p>` },
{ h: 'Slope fields', body: L`
<p>A DE assigns a gradient to every point in the plane; drawing a small dash at each grid point gives a <b>slope field</b> — a flow map. Solution curves surf the flow; different initial conditions give different curves that never cross. To sketch: follow the dashes from the starting point, both directions.</p>` },
{ h: "Euler's method", body: L`
<div class="fbox">$x_{n+1} = x_n + h$, $\quad y_{n+1} = y_n + h \cdot f(x_n, y_n)$</div>
<p>"Pretend the curve is straight for a tiny step, repeat." Keep a table of $(x_n, y_n, \text{slope})$ — markschemes are structured around it. Smaller $h$ = more accurate (error roughly halves with $h$). Slope always uses the <em>current</em> point, both coordinates.</p>` },
{ h: 'Coupled systems & phase portraits', body: L`
<p>Predator–prey style: $\frac{dx}{dt} = ax + by$, $\frac{dy}{dt} = cx + dy$, i.e. $\dot{\mathbf{x}} = M\mathbf{x}$. The <b>eigenvalues</b> of $M$ decide the long-run behaviour:</p>
<div class="fbox">both $\lambda &lt; 0$: stable sink · both $&gt; 0$: source · opposite signs: saddle · complex $\lambda$: spirals (stable if real part $&lt; 0$)</div>
<p>Exact solutions: $\mathbf{x} = Ae^{\lambda_1 t}\mathbf{v}_1 + Be^{\lambda_2 t}\mathbf{v}_2$. Euler for systems updates <em>both</em> variables each step using the current values of both. (Needs matrices + eigenvalues — if those feel shaky, hit the Gap Zone first.)</p>` },
],
},
{
id: 'u36', code: '3.6', emoji: '🕸️', title: 'Graph Theory',
sub: 'Networks, adjacency matrices, Eulerian trails, spanning trees, Chinese postman & TSP.',
syll: 'AI HL 3.14 – 3.16',
notes: [
{ h: 'Vocabulary & the handshake lemma', body: L`
<p><b>Graph</b> = vertices + edges. Degree = edges at a vertex. Simple, connected, complete ($K_n$ has $\frac{n(n-1)}{2}$ edges), weighted, directed, subgraph, tree (connected, no cycles, $n-1$ edges).</p>
<div class="fbox">Handshake lemma: $\sum \deg(v) = 2 \times$ number of edges (so the number of odd-degree vertices is always even)</div>` },
{ h: 'Adjacency matrices', body: L`
<p>$A_{ij}$ = number of edges between $i$ and $j$. The killer fact:</p>
<div class="fbox">$(A^k)_{ij}$ = number of walks of length $k$ from $i$ to $j$</div>
<p>Compute powers on the GDC. For directed/weighted graphs the matrix stores direction/weights instead.</p>` },
{ h: 'Eulerian & Hamiltonian', body: L`
<p><b>Eulerian circuit</b> (every edge once, return to start): exists ⟺ connected and <em>every</em> vertex has even degree. <b>Eulerian trail</b> (no return): exactly two odd vertices — start at one, end at the other. <b>Hamiltonian</b> (every vertex once): no neat test — that asymmetry is a favourite exam question.</p>` },
{ h: 'Minimum spanning trees', body: L`
<p>Cheapest way to connect everything. <b>Kruskal:</b> repeatedly add the cheapest edge that doesn't close a cycle. <b>Prim:</b> grow from any vertex, always adding the cheapest edge leaving the tree so far. Both greedy, both give an MST with $n-1$ edges; show the order you added edges for method marks.</p>` },
{ h: 'Chinese postman & travelling salesman', body: L`
<p><b>Chinese postman</b> (walk every <em>edge</em>, return): if all degrees even, answer = total weight. Otherwise pair up the odd vertices via cheapest connecting paths and repeat those edges — add the cheapest pairing to the total.</p>
<p><b>TSP</b> (visit every <em>vertex</em>): exact answer is hard, so IB wants bounds — <b>upper bound</b>: nearest-neighbour algorithm result; <b>lower bound</b>: delete a vertex, find MST of the rest, add back the two cheapest deleted edges.</p>` },
],
},
{
id: 'u37', code: '3.7', emoji: '🧪', title: 'Inference & Hypothesis Testing',
sub: 'Confidence intervals, z/t/chi-square/Poisson/correlation tests, and Type I/II errors.',
syll: 'AI HL 4.11 · 4.16 · 4.18',
notes: [
{ h: 'The sampling distribution (why any of this works)', body: L`
<div class="fbox">$\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)$ — sample means vary less than individuals, by factor $\sqrt{n}$</div>
<p>That's the bridge from "one sample" to "conclusion about the population". (See the Gap Zone → Estimators & CLT for the full story behind it.)</p>` },
{ h: 'Confidence intervals', body: L`
<p>A 95% CI for $\mu$: an interval built so the method captures the true mean 95% of the time. On the GDC: <b>z-interval</b> when $\sigma$ is known, <b>t-interval</b> when you only have the sample standard deviation (almost always real life). Interpretation marks: "we are 95% confident the interval contains $\mu$" — NOT "95% chance $\mu$ is in this interval".</p>` },
{ h: 'Hypothesis test choreography', body: L`
<ol><li>State $H_0$ (status quo, has the $=$) and $H_1$ (one- or two-tailed).</li>
<li>Compute the test statistic / p-value on the GDC.</li>
<li>Compare p-value with significance level $\alpha$.</li>
<li>Conclude <em>in context</em>: p $&lt; \alpha$ → reject $H_0$; otherwise "insufficient evidence to reject" (never "accept $H_0$").</li></ol>
<p>The p-value = probability, assuming $H_0$ true, of a result at least this extreme. Tests on the menu: z (σ known), t (σ unknown, incl. two-sample), proportion, Poisson mean, and the test for zero correlation.</p>` },
{ h: 'Chi-square tests', body: L`
<p><b>Goodness of fit</b>: does data match claimed proportions? df $= k - 1$. <b>Independence</b> (contingency table): df $= (r-1)(c-1)$, expected count $= \frac{\text{row} \times \text{col}}{\text{total}}$. IB wants expected counts ≥ 5 (combine categories if not).</p>` },
{ h: 'Type I & Type II errors', body: L`
<div class="fbox">Type I: reject $H_0$ when it's true — probability $= \alpha$ · Type II: fail to reject $H_0$ when it's false — probability $\beta$</div>
<p>Memory hook: Type I = false alarm 🚨, Type II = missed detection 😴. Shrinking $\alpha$ makes false alarms rarer but missed detections likelier — you trade one for the other.</p>` },
],
},
{
id: 'u38', code: 'Jan', emoji: '📈', title: 'Log-Log Plots & Linearisation',
sub: 'Turning curves into straight lines to identify models — the January special.',
syll: 'AI HL 2.10',
notes: [
{ h: 'Why take logs?', body: L`
<p>Straight lines are easy to fit and read; curves aren't. Logs turn multiplicative laws into additive ones:</p>
<div class="fbox">Power law $y = ax^n$: $\log y = \log a + n \log x$ → straight on <b>log-log</b> axes, slope $= n$</div>
<div class="fbox">Exponential $y = ab^x$: $\log y = \log a + x\log b$ → straight on <b>semi-log</b> axes (log $y$ only), slope $= \log b$</div>
<p>Diagnostic: plot both ways — whichever plot straightens your data tells you the model family. Then slope + intercept hand you the parameters.</p>` },
],
},
];

// ============================================================
// Gap Zone — on the AI HL syllabus but NOT on the semester calendar
// ============================================================
const GAPS = [
{
id: 'g1', emoji: '🧮', title: 'Matrices & Eigenvalues', syll: 'AI HL 1.14 · 1.15',
why: 'Not on the calendar, but unit 3.5 (coupled DEs) and Markov chains quietly depend on it.',
sub: 'Operations, determinants, inverses, eigenvalues & eigenvectors.',
notes: [
{ h: 'Matrix basics', body: L`
<p>Add/subtract entrywise; multiply row-into-column (sizes must chain: $(m\times n)(n\times p) = m \times p$). Order matters: $AB \ne BA$ in general. Identity $I$ acts like 1.</p>` },
{ h: 'Determinant & inverse (2×2)', body: L`
<p>For $M$ with rows $(a, b)$ and $(c, d)$:</p>
<div class="fbox">$\det M = ad - bc$ &nbsp;·&nbsp; $M^{-1} = \frac{1}{ad - bc} \times$ (swap $a$ and $d$, negate $b$ and $c$)</div>
<p>Invertible ⟺ $\det \ne 0$. Solving systems: $M\mathbf{x} = \mathbf{b} \Rightarrow \mathbf{x} = M^{-1}\mathbf{b}$ (3×3 and beyond: GDC). $|\det|$ is also the area scale factor — see Matrix Transformations.</p>` },
{ h: 'Eigenvalues & eigenvectors', body: L`
<p>An eigenvector of $M$ is a direction the map only <em>stretches</em>: $M\mathbf{v} = \lambda\mathbf{v}$.</p>
<div class="fbox">Find $\lambda$: solve $\det(M - \lambda I) = 0$ — for 2×2: $\lambda^2 - (\text{trace})\lambda + \det = 0$</div>
<p>Then each eigenvector from $(M - \lambda I)\mathbf{v} = \mathbf{0}$. Checks: sum of $\lambda$'s = trace, product = det. These run phase portraits (unit 3.5) and Markov steady states.</p>` },
],
},
{
id: 'g2', emoji: '🔄', title: 'Matrix Transformations', syll: 'AI HL 3.9',
why: 'Geometric transformations as 2×2 matrices — absent from the calendar.',
sub: 'Rotations, reflections, stretches, and determinant = area factor.',
notes: [
{ h: 'Standard matrices', body: L`
<p>A 2×2 matrix moves the plane; its columns are the images of $(1,0)$ and $(0,1)$.</p>
<div class="fbox">Rotation by $\theta$ (CCW): columns $(\cos\theta, \sin\theta)$ and $(-\sin\theta, \cos\theta)$ · Reflection in $y = x$: columns $(0,1)$ and $(1,0)$ · Stretch: diagonal matrix</div>
<p>Composite transformation = matrix product, applied <b>right-to-left</b> ($BA$ = "$A$ first, then $B$").</p>` },
{ h: 'Determinant = area scale factor', body: L`
<div class="fbox">area of image $= |\det M| \times$ area of object &nbsp;·&nbsp; negative det = orientation flipped</div>
<p>Example: stretch with diagonal $(2, 3)$ scales areas by $6$. Rotations/reflections have $|\det| = 1$ — they move shapes without resizing.</p>` },
],
},
{
id: 'g3', emoji: '➡️', title: 'Vectors', syll: 'AI HL 3.10 – 3.13',
why: 'A whole AHL block (dot/cross products, vector lines, vector kinematics) with zero calendar slots.',
sub: 'Components, products, lines, and motion.',
notes: [
{ h: 'Components & magnitude', body: L`
<p>$\mathbf{v} = (v_1, v_2, v_3)$; magnitude $|\mathbf{v}| = \sqrt{v_1^2 + v_2^2 + v_3^2}$; unit vector $\hat{\mathbf{v}} = \mathbf{v}/|\mathbf{v}|$. Displacement from A to B: $\mathbf{b} - \mathbf{a}$.</p>` },
{ h: 'Dot & cross products', body: L`
<div class="fbox">$\mathbf{a}\cdot\mathbf{b} = a_1b_1 + a_2b_2 + a_3b_3 = |\mathbf{a}||\mathbf{b}|\cos\theta$ — a number; $= 0$ ⟺ perpendicular</div>
<div class="fbox">$|\mathbf{a}\times\mathbf{b}| = |\mathbf{a}||\mathbf{b}|\sin\theta$ — a vector ⟂ to both; magnitude = parallelogram area</div>
<p>Angle between vectors: $\cos\theta = \frac{\mathbf{a}\cdot\mathbf{b}}{|\mathbf{a}||\mathbf{b}|}$. Cross products: compute per component or GDC; direction by right-hand rule.</p>` },
{ h: 'Vector lines & kinematics', body: L`
<div class="fbox">Line: $\mathbf{r} = \mathbf{a} + t\mathbf{b}$ (point + $t \times$ direction)</div>
<p>Moving object: $\mathbf{r}(t) = \mathbf{r}_0 + t\mathbf{v}$, speed $= |\mathbf{v}|$. Closest approach of two objects: minimise $|\mathbf{r}_1 - \mathbf{r}_2|$ (or find where relative displacement ⟂ relative velocity).</p>` },
],
},
{
id: 'g4', emoji: '🔗', title: 'Markov Chains', syll: 'AI HL 4.19',
why: 'Transition matrices + steady states are examinable and not scheduled this semester.',
sub: 'Transition matrices, powers, and steady states.',
notes: [
{ h: 'Setup', body: L`
<p>A system hops between <b>states</b> with fixed probabilities each step. Store them in a <b>transition matrix</b> $T$ where each <em>column</em> lists the probabilities of leaving one state (columns sum to 1 — some books use rows; be consistent!). If $\mathbf{s}_n$ is the state distribution, then</p>
<div class="fbox">$\mathbf{s}_{n+1} = T\mathbf{s}_n$, so $\mathbf{s}_n = T^n \mathbf{s}_0$ — powers of $T$ on the GDC</div>` },
{ h: 'Steady state', body: L`
<p>Long-run distribution $\mathbf{s}$ satisfies $T\mathbf{s} = \mathbf{s}$ — it's an <b>eigenvector for $\lambda = 1$</b>, normalised so entries sum to 1. Solve the linear equations, or raise $T$ to a big power on the GDC and read off the stabilising columns.</p>` },
],
},
{
id: 'g5', emoji: '📊', title: 'Estimators, Combinations & CLT', syll: 'AI HL 4.14 · 4.15',
why: 'The theory the 3.7 inference unit stands on — worth learning BEFORE December.',
sub: 'Linear transformations of random variables, unbiased estimates, central limit theorem.',
notes: [
{ h: 'Algebra of expectation & variance', body: L`
<div class="fbox">$E(aX + b) = aE(X) + b$ &nbsp;·&nbsp; $\text{Var}(aX + b) = a^2\,\text{Var}(X)$</div>
<div class="fbox">Independent: $E(X \pm Y) = E(X) \pm E(Y)$, $\text{Var}(X \pm Y) = \text{Var}(X) + \text{Var}(Y)$ — variances ADD even when subtracting</div>
<p>Linear combos of independent normals are normal. That's how $\bar{X} \sim N(\mu, \sigma^2/n)$ drops out.</p>` },
{ h: 'Unbiased estimators & CLT', body: L`
<p>$\bar{x}$ is an unbiased estimate of $\mu$; for variance the unbiased version divides by $n - 1$ (the GDC's $s_{n-1}$). <b>Central Limit Theorem:</b> for large $n$ (≈30+), $\bar{X}$ is approximately normal <em>whatever</em> the parent distribution — the licence to run z/t machinery on non-normal data.</p>` },
],
},
{
id: 'g6', emoji: '📞', title: 'Poisson Distribution', syll: 'AI HL 4.17',
why: 'The 3.7 unit tests a Poisson MEAN — the distribution itself never gets a lesson.',
sub: 'Counting rare events: model, formula, properties.',
notes: [
{ h: 'The model', body: L`
<p>$X \sim \text{Po}(m)$ counts events in a fixed interval when events occur singly, independently, at constant average rate $m$.</p>
<div class="fbox">$P(X = k) = \frac{e^{-m} m^k}{k!}$ &nbsp;·&nbsp; $E(X) = \text{Var}(X) = m$</div>
<p>Mean = variance is the Poisson fingerprint (use it to justify the model from data). Additive: independent Po($a$) + Po($b$) ~ Po($a+b$) — scale the rate to the interval asked about.</p>` },
],
},
{
id: 'g7', emoji: '🎢', title: 'Second-Order DEs', syll: 'AI HL 5.18',
why: 'The calendar covers systems — confirm the second-order → coupled conversion gets taught.',
sub: 'Reducing d²x/dt² equations to coupled first-order systems.',
notes: [
{ h: 'The conversion trick', body: L`
<p>Given $\frac{d^2x}{dt^2} = f(x, \frac{dx}{dt})$, define $y = \frac{dx}{dt}$. Then:</p>
<div class="fbox">$\frac{dx}{dt} = y$, $\quad \frac{dy}{dt} = f(x, y)$ — a coupled system, ready for Euler / phase portraits</div>
<p>Example (SHM): $\ddot{x} = -\omega^2 x$ becomes $\dot{x} = y$, $\dot{y} = -\omega^2 x$; trajectories are ellipses in the phase plane, solution $x = A\cos(\omega t + \varphi)$ — oscillation forever.</p>` },
],
},
{
id: 'g8', emoji: '🦠', title: 'Logistic & Further Models', syll: 'AI HL 2.9 · 2.10',
why: 'HL modelling menu (logistic, log models, piecewise) not visible on the calendar.',
sub: 'Growth with a ceiling, and the rest of the HL model menu.',
notes: [
{ h: 'The logistic function', body: L`
<div class="fbox">$f(x) = \frac{L}{1 + Ce^{-kx}}$ — S-curve: exponential start, levelling at the carrying capacity $L$</div>
<p>As $x \to \infty$, $f \to L$; growth is fastest at $f = \frac{L}{2}$ (the inflection). Fit $L$ from the ceiling, then $C$ from $f(0)$, then $k$ from another point.</p>` },
{ h: 'Choosing a model', body: L`
<p>HL menu: linear, quadratic/cubic, exponential $ab^x$ / $ae^{kx} + c$, power $ax^n$, sinusoidal, logistic, piecewise. Diagnose from behaviour: constant differences → linear; constant ratios → exponential; ceiling → logistic; periodic → sinusoidal; straight on log-log → power (see unit Jan · Log-Log Plots).</p>` },
],
},
];

// ============================================================
// Full AI HL syllabus map with alignment status
// st: 'sched' (on calendar) | 'gap' (missing) | 'y1' (assumed year 1)
// ============================================================
const SYLL = [
{ topic: 'Topic 1 — Number & Algebra', items: [
  { code: '1.1', name: 'Standard form & operations', st: 'y1' },
  { code: '1.2', name: 'Arithmetic sequences & series', st: 'y1' },
  { code: '1.3', name: 'Geometric sequences & series', st: 'y1' },
  { code: '1.4', name: 'Financial apps: compound interest, depreciation', st: 'y1' },
  { code: '1.5', name: 'Exponents & logarithms (intro)', st: 'y1' },
  { code: '1.6', name: 'Approximation, bounds, percentage error', st: 'y1' },
  { code: '1.7', name: 'Annuities & amortisation (tech)', st: 'y1' },
  { code: '1.8', name: 'Systems of equations & polynomials (tech)', st: 'y1' },
  { code: '1.9', name: 'Laws of logarithms (AHL)', st: 'y1', note: 'Confirm covered last year' },
  { code: '1.10', name: 'Rational exponents, simplification (AHL)', st: 'y1' },
  { code: '1.11', name: 'Infinite geometric series (AHL)', st: 'y1' },
  { code: '1.12', name: 'Complex numbers: Cartesian form (AHL)', st: 'sched', when: 'Unit 3.1 · Aug' },
  { code: '1.13', name: 'Polar/Euler form, De Moivre, sinusoid addition (AHL)', st: 'sched', when: 'Unit 3.1 · Aug' },
  { code: '1.14', name: 'Matrices: operations, det, inverse, systems (AHL)', st: 'gap', ref: 'g1' },
  { code: '1.15', name: 'Eigenvalues & eigenvectors 2×2 (AHL)', st: 'gap', ref: 'g1', note: 'Needed for unit 3.5 phase portraits!' },
]},
{ topic: 'Topic 2 — Functions', items: [
  { code: '2.1', name: 'Straight lines, gradients, intercepts', st: 'y1' },
  { code: '2.2', name: 'Function concept, notation, inverse (informal)', st: 'y1' },
  { code: '2.3', name: 'Graphing with technology', st: 'y1' },
  { code: '2.4', name: 'Key features of graphs', st: 'y1' },
  { code: '2.5', name: 'Modelling: linear → sinusoidal', st: 'sched', when: 'Sinusoids in unit 3.1' },
  { code: '2.6', name: 'Modelling process & selection', st: 'y1' },
  { code: '2.7', name: 'Composite & inverse functions (AHL)', st: 'y1', note: 'Confirm covered last year' },
  { code: '2.8', name: 'Transformations of graphs (AHL)', st: 'y1', note: 'Confirm covered last year' },
  { code: '2.9', name: 'Further models: logistic, log, piecewise (AHL)', st: 'gap', ref: 'g8' },
  { code: '2.10', name: 'Linearising with logs: log-log & semi-log (AHL)', st: 'sched', when: 'Jan 6 lesson' },
]},
{ topic: 'Topic 3 — Geometry & Trigonometry', items: [
  { code: '3.1', name: '3D geometry: distance, midpoint, solids', st: 'y1' },
  { code: '3.2', name: 'Right-angled trig, sine & cosine rules, area', st: 'y1' },
  { code: '3.3', name: 'Applications: bearings, elevation/depression', st: 'y1' },
  { code: '3.4', name: 'Arc length & sector area (degrees)', st: 'y1' },
  { code: '3.5', name: 'Perpendicular bisectors', st: 'y1' },
  { code: '3.6', name: 'Voronoi diagrams', st: 'y1' },
  { code: '3.7', name: 'Radian measure (AHL)', st: 'sched', when: 'Used from unit 3.1 onward' },
  { code: '3.8', name: 'Unit circle & sinusoidal graphs (AHL)', st: 'sched', when: 'Unit 3.1 · Aug' },
  { code: '3.9', name: 'Matrix transformations of the plane (AHL)', st: 'gap', ref: 'g2' },
  { code: '3.10', name: 'Vectors: concept & components (AHL)', st: 'gap', ref: 'g3' },
  { code: '3.11', name: 'Vector equation of a line (AHL)', st: 'gap', ref: 'g3' },
  { code: '3.12', name: 'Dot & cross products, angles (AHL)', st: 'gap', ref: 'g3' },
  { code: '3.13', name: 'Vector kinematics (AHL)', st: 'gap', ref: 'g3' },
  { code: '3.14', name: 'Graph theory: graphs & terminology (AHL)', st: 'sched', when: 'Unit 3.6 · Nov' },
  { code: '3.15', name: 'Adjacency matrices, walks, trees (AHL)', st: 'sched', when: 'Unit 3.6 · Nov' },
  { code: '3.16', name: 'MST, Chinese postman, TSP (AHL)', st: 'sched', when: 'Unit 3.6 · Nov' },
]},
{ topic: 'Topic 4 — Statistics & Probability', items: [
  { code: '4.1', name: 'Sampling & data collection', st: 'y1' },
  { code: '4.2', name: 'Presentation of data', st: 'y1' },
  { code: '4.3', name: 'Central tendency & dispersion', st: 'y1' },
  { code: '4.4', name: 'Pearson correlation & linear regression', st: 'y1' },
  { code: '4.5', name: 'Probability concepts', st: 'y1' },
  { code: '4.6', name: 'Combined & conditional probability', st: 'y1' },
  { code: '4.7', name: 'Discrete random variables', st: 'y1' },
  { code: '4.8', name: 'Binomial distribution', st: 'y1' },
  { code: '4.9', name: 'Normal distribution', st: 'y1' },
  { code: '4.10', name: "Spearman's rank correlation", st: 'y1' },
  { code: '4.11', name: 'Chi-square & t-test (SL level)', st: 'sched', when: 'Deepened in unit 3.7 · Dec' },
  { code: '4.12', name: 'Reliability & validity of data (AHL)', st: 'y1', note: 'Confirm covered last year' },
  { code: '4.13', name: 'Non-linear regression, R² (AHL)', st: 'gap', ref: 'g8', note: 'Partly touched by log-log lesson' },
  { code: '4.14', name: 'Linear transforms of RVs, unbiased estimators (AHL)', st: 'gap', ref: 'g5' },
  { code: '4.15', name: 'Combining normal variables, CLT (AHL)', st: 'gap', ref: 'g5', note: 'Foundation for unit 3.7!' },
  { code: '4.16', name: 'Confidence intervals (AHL)', st: 'sched', when: 'Unit 3.7 · Dec' },
  { code: '4.17', name: 'Poisson distribution (AHL)', st: 'gap', ref: 'g6', note: 'Only the TEST is scheduled, not the distribution' },
  { code: '4.18', name: 'Hypothesis tests, Type I/II errors (AHL)', st: 'sched', when: 'Unit 3.7 · Dec' },
  { code: '4.19', name: 'Transition matrices & Markov chains (AHL)', st: 'gap', ref: 'g4' },
]},
{ topic: 'Topic 5 — Calculus', items: [
  { code: '5.1', name: 'Limits & derivative concept', st: 'sched', when: 'Unit 3.2 · Aug' },
  { code: '5.2', name: 'Increasing/decreasing functions', st: 'sched', when: 'Unit 3.3 · Sep' },
  { code: '5.3', name: 'Derivatives of polynomials', st: 'sched', when: 'Unit 3.2 · Aug' },
  { code: '5.4', name: 'Tangents & normals', st: 'sched', when: 'Unit 3.3 · Sep' },
  { code: '5.5', name: 'Integration intro, boundary condition, areas', st: 'sched', when: 'Units 3.2/3.4' },
  { code: '5.6', name: 'Stationary points, optimisation', st: 'sched', when: 'Unit 3.3 · Sep' },
  { code: '5.7', name: 'Optimisation in context', st: 'sched', when: 'Unit 3.3 · Sep' },
  { code: '5.8', name: 'Trapezoidal rule', st: 'sched', when: 'Unit 3.4 · Oct' },
  { code: '5.9', name: 'Derivatives: sin, cos, tan, eˣ, ln x; chain/product/quotient (AHL)', st: 'sched', when: 'Unit 3.2 · Aug' },
  { code: '5.10', name: 'Second derivative & concavity (AHL)', st: 'sched', when: 'Unit 3.3 · Sep' },
  { code: '5.11', name: 'Standard integrals incl. linear composites (AHL)', st: 'sched', when: 'Unit 3.2 · Sep' },
  { code: '5.12', name: 'Areas & volumes of revolution (AHL)', st: 'sched', when: 'Unit 3.4 · Oct' },
  { code: '5.13', name: 'Kinematics with calculus (AHL)', st: 'gap', note: 'Not on any calendar row — flag to teacher' },
  { code: '5.14', name: 'Setting up & separable DEs (AHL)', st: 'sched', when: 'Unit 3.5 · Oct' },
  { code: '5.15', name: 'Slope fields (AHL)', st: 'sched', when: 'Unit 3.5 · Oct' },
  { code: '5.16', name: "Euler's method (AHL)", st: 'sched', when: 'Unit 3.5 · Oct/Nov' },
  { code: '5.17', name: 'Coupled systems & phase portraits (AHL)', st: 'sched', when: 'Unit 3.5 · Oct/Nov' },
  { code: '5.18', name: 'Second-order DEs via coupled systems (AHL)', st: 'gap', ref: 'g7', note: 'Likely folded into 3.5 — confirm' },
]},
];
