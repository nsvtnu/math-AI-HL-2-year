// ============================================================
// Math in $...$ / $$...$$ rendered by MiniTeX. L = String.raw
// keeps backslashes intact. Avoid "${" inside L`...`.
// Note blocks: .fbox formula · .wex worked example · .warn trap · .tip exam tip
// ============================================================
const L = String.raw;

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
  { d: '2026-11-23', dow: 'Mon', unit: '', what: 'Fall break' },
  { d: '2026-11-30', dow: 'Mon', unit: '', what: 'Summative 5', assess: true },
  { d: '2026-12-02', dow: 'Wed', unit: '3.7', what: 'Confidence intervals, t-test, z-test' },
  { d: '2026-12-04', dow: 'Fri', unit: '3.7', what: 'Chi-square test for independence / goodness of fit' },
  { d: '2026-12-08', dow: 'Tue', unit: '3.7', what: 'Poisson mean / linear correlation / population proportion tests' },
  { d: '2026-12-10', dow: 'Thu', unit: '3.7', what: 'Type I and Type II errors' },
  { d: '2026-12-14', dow: 'Mon', unit: '3.7', what: 'Review' },
  { d: '2026-12-16', dow: 'Wed', unit: '3.7', what: 'Review' },
  { d: '2026-12-18', dow: 'Fri', unit: '', what: 'Summative 6', assess: true },
  { d: '2026-12-21', dow: 'Mon', unit: '', what: 'Winter break' },
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
// Scheduled units 
// ============================================================
const UNITS = [
{
id: 'u31', code: '3.1', title: 'Complex Numbers & Sinusoids',
sub: 'Argand geometry, polar form, and why adding sine waves is secretly complex-number addition.',
syll: 'AI HL 1.12, 1.13 · 2.5 · 3.8',
video: { link: 'https://www.youtube.com/watch?v=MzCS_8Rzja8&list=PLxcp7t9hUM7A4kb2MbfUcH9qRPq7Qqd5I', title: 'Organic Chemistry Tutor – Complex Numbers Playlist', : '' },
notes: [
{ h: 'Sinusoidal models — the anatomy', body: L`
<p>Anything that repeats on a fixed cycle — tides, daylight hours, a Ferris wheel seat, alternating current — gets modelled by a sinusoid. The general form has four dials, and you should know exactly what each one does:</p>
<div class="fbox">$f(t) = a\sin(b(t - c)) + d$</div>
<ul>
<li><b>Amplitude</b> $|a|$ — vertical distance from the midline to a peak. Negative $a$ flips the wave upside down.</li>
<li><b>Period</b> $= \frac{2\pi}{b}$ in radians (or $\frac{360°}{b}$ in degrees) — time for one full cycle. Note it is $b$ that appears in the formula, not the period itself.</li>
<li><b>Midline</b> $y = d$ — the horizontal axis the wave oscillates around.</li>
<li><b>Phase shift</b> $c$ — slides the whole wave right by $c$ (because the bracket reads $t - c$).</li>
</ul>
<p>Cosine is just a shifted sine: $\cos t = \sin(t + \frac{\pi}{2})$. Use whichever starts in the right place: sine starts at the midline going up, cosine starts at a maximum.</p>
<div class="warn"><b>Trap:</b> in $\sin(2t - 3)$ the phase shift is NOT 3. Factor first: $\sin(2(t - 1.5))$, so the shift is 1.5. The IB writes both forms deliberately.</div>
<div class="viz" data-viz="sinusoid"></div>` },

{ h: 'Fitting a sinusoid to data', body: L`
<p>Real questions hand you a max, a min, and timing information, and ask for the model. The workflow is always the same four steps — extract the dials in this order:</p>
<ol class="steps">
<li>Midline: $d = \frac{\text{max} + \text{min}}{2}$</li>
<li>Amplitude: $a = \frac{\text{max} - \text{min}}{2}$</li>
<li>Period from the context (one rotation, one day, one year…), then $b = \frac{2\pi}{\text{period}}$</li>
<li>Shift $c$: match one known point (e.g. where the max happens) by sliding sine or cosine to it.</li>
</ol>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A Ferris wheel has its lowest seat 2 m above ground and highest 30 m; one rotation takes 4 minutes, and you board at the bottom at $t = 0$. Model your height.</p>
<ol class="steps">
<li>Midline $d = \frac{30 + 2}{2} = 16$, amplitude $a = \frac{30 - 2}{2} = 14$.</li>
<li>Period 4 min → $b = \frac{2\pi}{4} = \frac{\pi}{2}$.</li>
<li>At $t = 0$ we are at the MINIMUM, which is what an upside-down cosine does: use $-\cos$.</li>
<li>$h(t) = 16 - 14\cos(\frac{\pi}{2}t)$. Check: $h(0) = 2$ ✓, $h(2) = 30$ ✓.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Choosing $-\cos$ (start at min), $\cos$ (start at max) or $\pm\sin$ (start at midline) kills the phase-shift algebra entirely. Only reach for $c$ when the start point is somewhere awkward.</div>` },

{ h: 'Complex numbers: Cartesian arithmetic', body: L`
<p>Define $i$ by $i^2 = -1$. A complex number $z = x + iy$ has a <b>real part</b> $x$ and an <b>imaginary part</b> $y$ (a real number — the part multiplied by $i$). Arithmetic works exactly like algebra with the extra rule $i^2 = -1$:</p>
<ul>
<li><b>Add / subtract:</b> combine real with real, imaginary with imaginary.</li>
<li><b>Multiply:</b> expand brackets, replace $i^2$ with $-1$.</li>
<li><b>Conjugate:</b> $z^* = x - iy$ (flip the sign of the imaginary part). Key fact: $zz^* = x^2 + y^2$, a real number.</li>
<li><b>Divide:</b> multiply top and bottom by the conjugate of the bottom.</li>
</ul>
<div class="wex"><div class="wex-t">Worked example — division</div>
<p>Compute $\frac{3 + 2i}{1 - i}$.</p>
<ol class="steps">
<li>Multiply by the conjugate: $\frac{(3+2i)(1+i)}{(1-i)(1+i)}$.</li>
<li>Bottom: $1 - i^2 = 1 + 1 = 2$.</li>
<li>Top: $3 + 3i + 2i + 2i^2 = 3 + 5i - 2 = 1 + 5i$.</li>
<li>Answer: $\frac{1}{2} + \frac{5}{2}i$.</li>
</ol></div>
<p>Powers of $i$ cycle with period 4: $i, -1, -i, 1, i, -1, \ldots$ — so $i^{2027} = i^{3} = -i$ (2027 mod 4 = 3). Also useful: solving $z^2 = -9$ gives $z = \pm 3i$; quadratics with negative discriminant now have two complex roots, always a conjugate pair.</p>` },

{ h: 'The Argand plane: modulus & argument', body: L`
<p>$z = x + iy$ is a <b>point</b> — equivalently an arrow from the origin — in the Argand plane: real axis across, imaginary axis up. Addition is tip-to-tail arrow addition, and the conjugate $z^*$ is the mirror image in the real axis. Two numbers describe any arrow:</p>
<div class="fbox">modulus $|z| = \sqrt{x^2 + y^2}$ (length) &nbsp;·&nbsp; argument $\theta = \arg z$ (angle from the positive real axis, usually $-\pi &lt; \theta \le \pi$)</div>
<div class="wex"><div class="wex-t">Worked example — 2nd quadrant care</div>
<p>Find the modulus and argument of $z = -1 + i$.</p>
<ol class="steps">
<li>$|z| = \sqrt{(-1)^2 + 1^2} = \sqrt{2}$.</li>
<li>Naive angle: $\arctan\frac{1}{-1} = -\frac{\pi}{4}$ — but the point $(-1, 1)$ is in the SECOND quadrant, so that is wrong.</li>
<li>Sketch it: the arrow points up-left, $\frac{\pi}{4}$ above the negative real axis, so $\arg z = \pi - \frac{\pi}{4} = \frac{3\pi}{4}$.</li>
</ol></div>
<div class="warn"><b>Trap:</b> $\arctan\frac{y}{x}$ only lands in the right quadrant when $x &gt; 0$. ALWAYS sketch the point before writing down an argument — quadrants 2 and 3 need a correction by $\pm\pi$.</div>
<div class="viz" data-viz="argand"></div>` },

{ h: 'Polar & Euler form: multiplication is rotation', body: L`
<p>Once you know $r = |z|$ and $\theta = \arg z$, you can rebuild the number. Three equivalent costumes:</p>
<div class="fbox">$z = r(\cos\theta + i\sin\theta) = r\,\text{cis}\,\theta = re^{i\theta}$</div>
<p>Converting back: $x = r\cos\theta$, $y = r\sin\theta$. The payoff is what multiplication becomes:</p>
<div class="fbox">$z_1 z_2$: multiply moduli, ADD arguments &nbsp;·&nbsp; $\frac{z_1}{z_2}$: divide moduli, SUBTRACT arguments</div>
<p>Multiplying by $re^{i\theta}$ is literally "rotate by $\theta$ and scale by $r$". Multiplying by $i = e^{i\pi/2}$ rotates a quarter turn. Repeated multiplication gives powers:</p>
<div class="fbox">De Moivre: $z^n = r^n\,\text{cis}(n\theta)$</div>
<div class="wex"><div class="wex-t">Worked example — a power without pain</div>
<p>Compute $(1 + i)^8$.</p>
<ol class="steps">
<li>Convert: $|1+i| = \sqrt{2}$, $\arg(1+i) = \frac{\pi}{4}$, so $1+i = \sqrt{2}\,e^{i\pi/4}$.</li>
<li>De Moivre: $(1+i)^8 = (\sqrt{2})^8 e^{i \cdot 8\pi/4} = 16\,e^{i 2\pi}$.</li>
<li>$e^{i2\pi} = 1$, so the answer is $16$. (Expanding brackets eight times is the tourist route.)</li>
</ol></div>
<p><b>Roots:</b> every non-zero $z$ has exactly $n$ distinct $n$th roots, equally spaced around a circle of radius $r^{1/n}$ — take $\frac{\theta}{n}$ and keep adding $\frac{2\pi}{n}$.</p>` },

{ h: 'Phasors: adding sinusoids the smart way', body: L`
<p>Here is the punchline the whole unit builds to. A wave $a\sin(\omega t + \varphi)$ can be stored as the complex number $ae^{i\varphi}$ — a <b>phasor</b>: amplitude and phase, with the frequency understood. Adding two same-frequency waves = adding their phasors as arrows, and the sum is <em>still</em> a sinusoid at that frequency. Special case you must know cold:</p>
<div class="fbox">$a\sin\omega t + b\cos\omega t = R\sin(\omega t + \varphi)$ with $R = \sqrt{a^2 + b^2}$, $\tan\varphi = \frac{b}{a}$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Write $3\sin t + 4\cos t$ as a single sinusoid, and state its maximum value.</p>
<ol class="steps">
<li>$R = \sqrt{3^2 + 4^2} = 5$ (the 3-4-5 triangle strikes again).</li>
<li>$\tan\varphi = \frac{4}{3}$, so $\varphi = \arctan\frac{4}{3} \approx 0.927$.</li>
<li>$3\sin t + 4\cos t = 5\sin(t + 0.927)$; maximum value $5$, first reached when $t + 0.927 = \frac{\pi}{2}$.</li>
</ol></div>
<p>Why anyone cares: this is how engineers add AC voltages and how two sound waves combine. Same frequency in, same frequency out — only amplitude and phase change. That closes the loop back to the sinusoidal models we started with.</p>` },
],
},
{
id: 'u32', code: '3.2', title: 'Differentiation & Antidifferentiation',
sub: 'The full HL derivative toolkit, then running it in reverse.',
syll: 'AI HL 5.9 · 5.11',
video: { id: '9vKqVkMQHKk', title: '3Blue1Brown — The paradox of the derivative', why: 'Why a "rate of change at an instant" is not nonsense. Watch before the rules.' },
notes: [
{ h: 'What a derivative actually is', body: L`
<p>The derivative $f'(x)$ is the <b>gradient of the curve at a point</b> — formally, the limit of the gradient of chords through the point as they shrink:</p>
<div class="fbox">$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$</div>
<p>Three ways to read the same object:</p>
<ul>
<li><b>Geometrically:</b> slope of the tangent line at $x$.</li>
<li><b>Dynamically:</b> instantaneous rate of change — if $s(t)$ is position, $s'(t)$ is velocity.</li>
<li><b>As a function:</b> $f'$ is a new function, the "gradient machine" — feed it any $x$, get the slope there.</li>
</ul>
<p>Notation is interchangeable: $f'(x)$, $y'$, $\frac{dy}{dx}$, $\frac{d}{dx}f(x)$ all mean the same thing. The $\frac{dy}{dx}$ form earns its keep in related rates and DEs, where "small change in $y$ per small change in $x$" is the useful reading.</p>
<div class="tip"><b>Tip:</b> Sign reading: $f' &gt; 0$ ⇒ increasing, $f' &lt; 0$ ⇒ decreasing, $f' = 0$ ⇒ stationary. Half of unit 3.3 is just this sentence applied repeatedly.</div>
<div class="viz" data-viz="tangent"></div>` },

{ h: 'Power rule — and the art of rewriting first', body: L`
<div class="fbox">$\frac{d}{dx}x^n = nx^{n-1}$ for ANY real $n$ — including negative and fractional</div>
<p>Constants multiply through, sums differentiate term by term, and constants alone die: $\frac{d}{dx}(5x^3 - 2x + 7) = 15x^2 - 2$. The real skill is <b>rewriting before differentiating</b> — get everything into $x^n$ form first:</p>
<ul>
<li>$\sqrt{x} = x^{1/2}$, $\sqrt[3]{x} = x^{1/3}$</li>
<li>$\frac{1}{x} = x^{-1}$, $\frac{4}{x^2} = 4x^{-2}$</li>
<li>$\frac{x^3 + 2x}{x} = x^2 + 2$ (split the fraction — do NOT reach for the quotient rule)</li>
</ul>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Differentiate $y = 3\sqrt{x} - \frac{2}{x^2} + 5$.</p>
<ol class="steps">
<li>Rewrite: $y = 3x^{1/2} - 2x^{-2} + 5$.</li>
<li>Power rule per term: $y' = \frac{3}{2}x^{-1/2} + 4x^{-3}$.</li>
<li>Tidy back: $y' = \frac{3}{2\sqrt{x}} + \frac{4}{x^3}$.</li>
</ol></div>
<div class="warn"><b>Trap:</b> differentiating $\frac{4}{x^2}$ as "$\frac{4}{2x}$" (differentiating top and bottom separately) is the classic L. Rewrite as $4x^{-2}$ first, every time.</div>` },

{ h: 'The transcendental table (radians only!)', body: L`
<div class="fbox">$\frac{d}{dx}\sin x = \cos x$ · $\frac{d}{dx}\cos x = -\sin x$ · $\frac{d}{dx}\tan x = \frac{1}{\cos^2 x}$ · $\frac{d}{dx}e^x = e^x$ · $\frac{d}{dx}\ln x = \frac{1}{x}$</div>
<p>These five + the power rule + the three combination rules below = every derivative in the course. Memorise the sign pattern: sine's derivative is plain cosine; it is COSINE that picks up the minus. And $e^x$ is the celebrity: the only function that is its own derivative — the slope at every point equals the height. That is the reason $e$ shows up in every growth model.</p>
<div class="warn"><b>Trap:</b> the trig derivatives are ONLY true in radians. Degree mode makes an unwanted factor $\frac{\pi}{180}$ appear and silently wrecks every calculus answer. Check the GDC mode before every paper — this is a free mark you can lose in second one.</div>` },

{ h: 'Chain rule — the inside-outside game', body: L`
<p>For a composite function ("function of a function"), differentiate the <b>outside</b> (leaving the inside untouched), then multiply by the derivative of the <b>inside</b>:</p>
<div class="fbox">$\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$ — outside first, times inside's derivative</div>
<div class="wex"><div class="wex-t">Worked examples — the four standard shapes</div>
<ol class="steps">
<li>$(2x+1)^5$: outside $u^5$, inside $2x+1$ → $5(2x+1)^4 \times 2 = 10(2x+1)^4$.</li>
<li>$e^{3x^2}$: outside $e^u$, inside $3x^2$ → $e^{3x^2} \times 6x = 6xe^{3x^2}$.</li>
<li>$\ln(5x - 2)$: outside $\ln u$ → $\frac{1}{5x-2} \times 5 = \frac{5}{5x-2}$.</li>
<li>$\sin(3x)$: → $\cos(3x) \times 3 = 3\cos 3x$.</li>
</ol></div>
<p>Layered composites just chain further: $\frac{d}{dx}\sin^2(3x)$ is outside "square", middle "sin", inside "3x": $2\sin(3x) \cdot \cos(3x) \cdot 3$.</p>
<div class="warn"><b>Trap:</b> forgetting the inside derivative (the ×2, ×5, ×6x above) is the single most common lost mark in HL calculus. If the inside is anything other than plain $x$, a factor is owed.</div>` },

{ h: 'Product & quotient rules', body: L`
<p>For a product you cannot expand (like $x^2 e^x$) or a genuine quotient:</p>
<div class="fbox">Product: $(uv)' = u'v + uv'$ &nbsp;·&nbsp; Quotient: $\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$</div>
<div class="wex"><div class="wex-t">Worked example — product</div>
<p>$y = x^2 e^x$: take $u = x^2$, $v = e^x$; then $y' = 2x\,e^x + x^2 e^x = xe^x(2 + x)$.</p>
</div>
<div class="wex"><div class="wex-t">Worked example — quotient</div>
<p>$y = \frac{\sin x}{x}$: $y' = \frac{\cos x \cdot x - \sin x \cdot 1}{x^2} = \frac{x\cos x - \sin x}{x^2}$.</p>
</div>
<div class="warn"><b>Trap:</b> the quotient rule's numerator is a SUBTRACTION and order matters — "low d-high minus high d-low", all over low squared. Writing the terms backwards flips the sign of the whole answer.</div>
<div class="tip"><b>Tip:</b> Before using the quotient rule, ask if you even need it: $\frac{x^3 + 2x}{x}$ simplifies, $\frac{5}{x^2}$ is a power. The quotient rule is for quotients that refuse to simplify.</div>` },

{ h: 'Antidifferentiation — the table in reverse', body: L`
<p>An <b>antiderivative</b> of $f$ is any function whose derivative is $f$. The indefinite integral collects all of them (hence the $+c$). Power rule backwards — raise the power, divide by the new power:</p>
<div class="fbox">$\int x^n dx = \frac{x^{n+1}}{n+1} + c$ $(n \ne -1)$ · $\int \frac{1}{x}dx = \ln|x| + c$ · $\int e^x dx = e^x + c$ · $\int \sin x\,dx = -\cos x + c$ · $\int \cos x\,dx = \sin x + c$</div>
<p>The $n = -1$ case is exactly where $\ln$ enters — dividing by zero is not an option, so nature swaps in the logarithm. For a <b>linear inside</b> $ax + b$, integrate as usual then divide by $a$:</p>
<div class="fbox">$\int \cos(3x)dx = \frac{\sin 3x}{3} + c$ &nbsp;·&nbsp; $\int e^{2x+1}dx = \frac{1}{2}e^{2x+1} + c$ &nbsp;·&nbsp; $\int (2x-5)^4 dx = \frac{(2x-5)^5}{10} + c$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$\int \left(6x^2 - \frac{4}{x} + \sin 2x\right) dx = 2x^3 - 4\ln|x| - \frac{\cos 2x}{2} + c$ — term by term, one $+c$ for the lot.</p>
</div>
<div class="warn"><b>Trap:</b> "divide by the inside's coefficient" ONLY works when the inside is linear. $\int e^{x^2} dx$ is NOT $\frac{e^{x^2}}{2x}$ — that expression is not even an antiderivative (differentiate it and see the mess). Non-linear insides are beyond the course's toolkit.</div>` },

{ h: 'The +c and boundary conditions', body: L`
<p>Infinitely many curves share the same gradient function — they are vertical shifts of each other. The $+c$ is the whole family; a <b>boundary condition</b> (one known point) picks out the family member you want.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A curve has $\frac{dy}{dx} = 3x^2 - 4$ and passes through $(2, 1)$. Find it.</p>
<ol class="steps">
<li>Integrate: $y = x^3 - 4x + c$.</li>
<li>Feed in the point: $1 = 8 - 8 + c$, so $c = 1$.</li>
<li>Curve: $y = x^3 - 4x + 1$.</li>
</ol></div>
<p>Same logic twice over: given $f''$ and two facts, integrate twice, collecting a constant at EACH integration and solving for both. This is also how kinematics runs: acceleration → velocity → position, one boundary condition per step.</p>` },
],
},
{
id: 'u33', code: '3.3', title: 'Applications of Differentiation',
sub: 'Tangents, normals, max/min tests, optimisation and related rates.',
syll: 'AI HL 5.4 · 5.6 · 5.7 · 5.9 · 5.10',
video: { id: 'BLkz5LGWihw', title: '3Blue1Brown — Higher order derivatives', why: 'What the second derivative actually measures, which is the whole max/min test.' },
notes: [
{ h: 'Tangents & normals — the 3-step ritual', body: L`
<p>The tangent at $x = a$ is the line through the point with the curve's slope; the normal is perpendicular to it. Every tangent/normal question is the same ritual:</p>
<ol class="steps">
<li><b>Point:</b> $y_1 = f(a)$ — from the original function.</li>
<li><b>Gradient:</b> $m = f'(a)$ — from the derivative.</li>
<li><b>Line:</b> $y - y_1 = m(x - x_1)$. For the normal, use $-\frac{1}{m}$ instead.</li>
</ol>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Find the tangent and normal to $y = x^2 - 3x$ at $x = 2$.</p>
<ol class="steps">
<li>Point: $y(2) = 4 - 6 = -2$, so $(2, -2)$.</li>
<li>Gradient: $y' = 2x - 3$, so $m = 1$.</li>
<li>Tangent: $y + 2 = 1(x - 2)$, i.e. $y = x - 4$. Normal: slope $-1$, $y = -x$.</li>
</ol></div>
<div class="warn"><b>Trap:</b> plugging $a$ into $f'$ to get the $y$-coordinate. The POINT comes from $f$; only the SLOPE comes from $f'$. Mixing these up is the most common lost mark on this topic.</div>
<div class="tip"><b>Tip:</b> "The tangent at P is horizontal" translates to $f'(a) = 0$. "The tangent is parallel to $y = 5x$" translates to $f'(a) = 5$. Most disguised questions are one of these translations.</div>` },

{ h: 'Stationary points & the first-derivative test', body: L`
<p>Where $f'(a) = 0$ the curve is momentarily flat — a <b>stationary point</b>. To classify it, look at the SIGN of $f'$ on each side (a sign table is the cleanest layout):</p>
<div class="fbox">$f'$ goes $+ \to 0 \to -$: local maximum · $- \to 0 \to +$: local minimum · same sign both sides: horizontal inflection</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Find and classify the stationary points of $f(x) = x^3 - 3x$.</p>
<ol class="steps">
<li>$f'(x) = 3x^2 - 3 = 3(x-1)(x+1) = 0$ at $x = \pm 1$.</li>
<li>Signs of $f'$: for $x &lt; -1$ positive, between $-1$ and $1$ negative, after $1$ positive.</li>
<li>So $x = -1$ is a local max ($+ \to -$), value $f(-1) = 2$; and $x = 1$ is a local min, value $-2$.</li>
</ol></div>
<p>Note "local": a local max need not be the biggest value overall. On a closed interval, the global max/min lives either at a stationary point or at an ENDPOINT — check both.</p>
<div class="viz" data-viz="tangent"></div>` },

{ h: 'Second derivative, concavity & inflection', body: L`
<p>$f''$ measures how the slope itself is changing — the curve's <b>concavity</b>:</p>
<div class="fbox">$f'' &gt; 0$: concave up (cup, slope increasing) · $f'' &lt; 0$: concave down (frown, slope decreasing)</div>
<p>That gives the quick classification at a stationary point:</p>
<div class="fbox">$f'(a) = 0$ and $f''(a) &lt; 0$: local max · $f''(a) &gt; 0$: local min · $f''(a) = 0$: NO verdict — fall back to the sign table</div>
<p>An <b>inflection point</b> is where concavity flips: $f'' = 0$ <em>and</em> $f''$ changes sign there. The "and" is load-bearing: $y = x^4$ has $f''(0) = 0$ at what is actually a minimum — no sign change, no inflection.</p>
<div class="tip"><b>Tip:</b> Curve-sketch questions love the chain: $f$ tells height, $f'$ tells direction, $f''$ tells bend. Given a graph of $f'$, you read stationary points of $f$ where $f'$ crosses zero, and inflections of $f$ where $f'$ has its own max/min.</div>` },

{ h: 'Optimisation — the six-step recipe', body: L`
<p>"Find the largest/cheapest/fastest…" = find where a derivative is zero, with a story attached. The recipe:</p>
<ol class="steps">
<li>Draw a diagram; name the variables.</li>
<li>Write the quantity to optimise as a formula.</li>
<li>Use the constraint to eliminate variables until ONE remains.</li>
<li>Differentiate, set to zero, solve.</li>
<li>Justify it is a max/min ($f''$ sign or sign table) — the justification carries marks.</li>
<li>Answer the actual question asked (the area, the cost — not just $x$).</li>
</ol>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A farmer has 40 m of fence for a rectangular pen against a wall (wall needs no fence). Maximise the area.</p>
<ol class="steps">
<li>Sides: width $x$ (two of them) and length $y$ (one). Constraint: $2x + y = 40$.</li>
<li>Area $A = xy = x(40 - 2x) = 40x - 2x^2$.</li>
<li>$A' = 40 - 4x = 0$ → $x = 10$.</li>
<li>$A'' = -4 &lt; 0$, so it is a maximum. ✓</li>
<li>$y = 20$, and $A = 10 \times 20 = 200$ m² — the answer is 200 m², not "$x = 10$".</li>
</ol></div>
<div class="warn"><b>Trap:</b> in modelling contexts the best value can sit on the DOMAIN BOUNDARY where $f' \ne 0$ (e.g. "x is at most 8"). After finding stationary points, compare with endpoint values before declaring a winner.</div>` },

{ h: 'Related rates — differentiate the relationship', body: L`
<p>Two quantities are linked by a formula and both change with time. Differentiate the <em>relationship itself</em> with respect to $t$ (chain rule makes every variable sprout a $\frac{d}{dt}$), THEN substitute the snapshot numbers:</p>
<div class="fbox">$A = \pi r^2 \Rightarrow \frac{dA}{dt} = 2\pi r\,\frac{dr}{dt}$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A spherical balloon is inflated at 20 cm³/s. How fast is the radius growing when $r = 5$ cm? ($V = \frac{4}{3}\pi r^3$)</p>
<ol class="steps">
<li>Differentiate the relation w.r.t. $t$: $\frac{dV}{dt} = 4\pi r^2 \frac{dr}{dt}$.</li>
<li>Substitute the snapshot LAST: $20 = 4\pi \cdot 25 \cdot \frac{dr}{dt}$.</li>
<li>$\frac{dr}{dt} = \frac{20}{100\pi} = \frac{1}{5\pi} \approx 0.064$ cm/s.</li>
</ol></div>
<div class="warn"><b>Trap:</b> substituting $r = 5$ BEFORE differentiating freezes the radius and kills the rate (derivative of a constant = 0). Numbers go in last — this is the single rule of related rates.</div>
<div class="tip"><b>Tip:</b> Translation table: "inflated at 20 cm³/s" = $\frac{dV}{dt} = 20$; "draining" = negative rate; "how fast is X changing" = find $\frac{dX}{dt}$. Write the rates down before touching any algebra.</div>` },

{ h: 'Piecewise functions: continuity & smoothness', body: L`
<p>At a join $x = a$ between two pieces:</p>
<div class="fbox">Continuous: both pieces give the SAME VALUE at $a$ · Differentiable (smooth): additionally both give the same DERIVATIVE at $a$</div>
<p>Differentiable ⇒ continuous, never the other way: a corner (like $|x|$ at 0) is continuous but not differentiable — the slope jumps.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$f(x) = x^2$ for $x \le 1$ and $f(x) = ax + b$ for $x &gt; 1$. Find $a, b$ making $f$ smooth at $x = 1$.</p>
<ol class="steps">
<li>Match values: $1^2 = a + b$.</li>
<li>Match derivatives: $2x$ vs $a$ at $x = 1$ → $a = 2$.</li>
<li>Then $b = 1 - 2 = -1$. So the line $y = 2x - 1$ — which is exactly the tangent to $x^2$ at the join. Not a coincidence.</li>
</ol></div>` },
],
},
{
id: 'u34', code: '3.4', title: 'Integration: Areas & Solids',
sub: 'Definite integrals, area between curves, the trapezoidal rule, and volumes of revolution.',
syll: 'AI HL 5.5 · 5.8 · 5.11 · 5.12',
video: { id: 'rfG8ce4nNh0', title: '3Blue1Brown — Integration and the fundamental theorem', why: 'Why area and antiderivatives are the same idea running backwards.' },
notes: [
{ h: 'The definite integral & the fundamental theorem', body: L`
<p>$\int_a^b f(x)\,dx$ accumulates $f$ over $[a, b]$ — geometrically, the signed area between curve and $x$-axis. The <b>Fundamental Theorem of Calculus</b> says you evaluate it with any antiderivative:</p>
<div class="fbox">$\int_a^b f(x)dx = F(b) - F(a)$ where $F' = f$ — antidifferentiate, then top minus bottom</div>
<p>No $+c$ needed — it cancels in the subtraction. Properties worth having on tap:</p>
<ul>
<li>Reversed limits flip the sign: $\int_b^a = -\int_a^b$.</li>
<li>Adjacent intervals add: $\int_a^b + \int_b^c = \int_a^c$.</li>
<li>Constants pull out; sums split term by term.</li>
</ul>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$\int_1^3 (3x^2 - 2x)\,dx = \left[x^3 - x^2\right]$ from 1 to 3 $= (27 - 9) - (1 - 1) = 18$.</p>
</div>
<div class="tip"><b>Tip:</b> On the GDC you can evaluate any definite integral numerically — use it to CHECK hand work, and to answer "unintegratable" modelling questions directly. Paper 1 wants the algebra; papers with tech want the number.</div>` },

{ h: 'Signed area vs geometric area', body: L`
<p>Integrals count area <b>below the axis as negative</b>. So $\int_0^{2\pi} \sin x\,dx = 0$ — the two lobes cancel. If a question wants the GEOMETRIC area (paint, fabric, land):</p>
<ol class="steps">
<li>Find where the curve crosses the axis (roots) inside the interval.</li>
<li>Split the integral at each root.</li>
<li>Add the absolute values of the pieces.</li>
</ol>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Total area between $y = x^2 - 4$ and the $x$-axis on $[0, 3]$.</p>
<ol class="steps">
<li>Root inside the interval: $x = 2$.</li>
<li>$\int_0^2 (x^2 - 4)dx = \left[\frac{x^3}{3} - 4x\right]_0^2 = \frac{8}{3} - 8 = -\frac{16}{3}$ (below axis ✓).</li>
<li>$\int_2^3 (x^2 - 4)dx = (9 - 12) - (\frac{8}{3} - 8) = \frac{7}{3}$.</li>
<li>Total area $= \frac{16}{3} + \frac{7}{3} = \frac{23}{3}$. A single integral over $[0,3]$ would have given $-3$ — wrong kind of answer entirely.</li>
</ol></div>` },

{ h: 'Area between two curves', body: L`
<div class="fbox">$A = \int_a^b (\text{top} - \text{bottom})\,dx$ — limits at the intersections, found by solving $f = g$</div>
<p>This formula quietly handles the below-axis problem for you: top minus bottom is a positive height wherever you are, so no splitting is needed — <em>unless the curves cross inside the interval</em>, in which case split at the crossing and swap the roles.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Area enclosed by $y = x^2$ and $y = x + 2$.</p>
<ol class="steps">
<li>Intersect: $x^2 = x + 2$ → $(x-2)(x+1) = 0$ → $x = -1, 2$.</li>
<li>Between them the line is on top (test $x = 0$: line gives 2, parabola 0).</li>
<li>$A = \int_{-1}^{2}(x + 2 - x^2)dx = \left[\frac{x^2}{2} + 2x - \frac{x^3}{3}\right]_{-1}^{2} = \frac{10}{3} - (-\frac{7}{6}) = \frac{9}{2}$.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Sketch first, always — the GDC draws both curves in seconds, shows who is on top, and its intersect function hands you the limits. Most dropped marks here are limits or top/bottom guessed without a picture.</div>` },

{ h: 'Trapezoidal rule — integrating from data', body: L`
<p>When you only have sampled values (or an unintegratable function), chop $[a,b]$ into $n$ equal strips and pretend each strip's top is a straight chord:</p>
<div class="fbox">$\int_a^b y\,dx \approx \frac{h}{2}\left[y_0 + y_n + 2(y_1 + \dots + y_{n-1})\right]$, $h = \frac{b-a}{n}$</div>
<p>Ends once, middles twice. $n$ strips need $n + 1$ heights (fencepost alert).</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>River depth every 2 m across an 8 m stream: 0, 1.8, 2.6, 2.1, 0. Estimate the cross-section area.</p>
<ol class="steps">
<li>$h = 2$, ends $0 + 0$, middles $1.8 + 2.6 + 2.1 = 6.5$.</li>
<li>$A \approx \frac{2}{2}\left[0 + 0 + 2(6.5)\right] = 13$ m².</li>
</ol></div>
<p><b>Over- or underestimate?</b> Concave-up curve → chords sit above the curve → overestimate; concave-down → underestimate. Sketch one strip and the answer is visible; examiners want that reasoning, not a memorised sentence.</p>
<div class="viz" data-viz="area"></div>` },

{ h: 'Volumes of revolution', body: L`
<p>Spin the region under $y = f(x)$ about the $x$-axis: every cross-section is a disc of radius $y$ and thickness $dx$, so summing disc volumes $\pi y^2\,dx$ gives:</p>
<div class="fbox">$V = \pi \int_a^b y^2\,dx$ &nbsp;·&nbsp; about the $y$-axis: $V = \pi \int_c^d x^2\,dy$ (rearrange to $x$ in terms of $y$ first)</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>The region under $y = 2\sqrt{x}$ from $x = 0$ to $4$, rotated about the $x$-axis.</p>
<ol class="steps">
<li>Square the WHOLE expression: $y^2 = 4x$.</li>
<li>$V = \pi\int_0^4 4x\,dx = \pi\left[2x^2\right]_0^4 = 32\pi$.</li>
</ol></div>
<div class="warn"><b>Trap:</b> $(2\sqrt{x})^2 = 4x$, not $2x$ — the coefficient gets squared too. Squaring is where most volume marks die.</div>
<div class="tip"><b>Tip:</b> Sanity-check against geometry: $y = 2$ on $[0, 3]$ spun about the $x$-axis is a cylinder, and the formula gives $\pi\int_0^3 4\,dx = 12\pi$ ✓. If your integrand does not reduce to something sane on a simple case, the setup is wrong.</div>` },
],
},
{
id: 'u35', code: '3.5', title: 'Differential Equations',
sub: 'Separation of variables, slope fields, Euler, and coupled systems — the HL boss level.',
syll: 'AI HL 5.14 – 5.17 (+5.18 via systems)',
video: { id: 'p_di4Zn4wz4', title: '3Blue1Brown — Differential equations, a tourist\'s guide', why: 'Slope fields, phase space and why DEs are usually solved numerically.' },
notes: [
{ h: 'What a DE is (and how to verify a solution)', body: L`
<p>A <b>differential equation</b> relates a function to its own derivatives — it describes how something CHANGES, and solving it recovers what the thing IS. The solution is a <em>function</em> (or a family of functions), not a number. A <b>general solution</b> carries an arbitrary constant; an <b>initial condition</b> pins it to a <b>particular solution</b>.</p>
<div class="wex"><div class="wex-t">Worked example — verifying</div>
<p>Show $y = 5e^{3x}$ solves $\frac{dy}{dx} = 3y$.</p>
<ol class="steps">
<li>Differentiate the candidate: $\frac{dy}{dx} = 15e^{3x}$.</li>
<li>Compute the right side: $3y = 15e^{3x}$. Equal ⇒ it is a solution. ✓</li>
</ol></div>
<div class="tip"><b>Tip:</b> Verification questions are free marks: differentiate, substitute, compare. No solving technique needed. If a "show that" DE question appears, this is all it wants.</div>` },

{ h: 'Writing DEs from sentences', body: L`
<p>Modelling questions hand you a sentence; you write the DE. The dictionary:</p>
<ul>
<li>"Rate of change of $P$ proportional to $P$" → $\frac{dP}{dt} = kP$ (exponential growth/decay).</li>
<li>"Cools at a rate proportional to the temperature difference from the room ($T_r$)" → $\frac{dT}{dt} = -k(T - T_r)$ (Newton cooling).</li>
<li>"Growth proportional to both $P$ and the remaining capacity" → $\frac{dP}{dt} = kP(1 - \frac{P}{L})$ (logistic).</li>
</ul>
<p>Sign check: decay and cooling need the negative; growth is positive. Say which and why — the justification is usually a mark.</p>` },

{ h: 'Separation of variables', body: L`
<p>If the DE factors as $\frac{dy}{dx} = f(x)g(y)$, drag all $y$'s left and all $x$'s right, then integrate BOTH sides:</p>
<div class="fbox">$\int \frac{dy}{g(y)} = \int f(x)\,dx$ — add the $+c$ at the moment of integrating (one $c$, right side)</div>
<div class="wex"><div class="wex-t">Worked example — the GOAT</div>
<p>Solve $\frac{dy}{dx} = ky$ with $y(0) = A$.</p>
<ol class="steps">
<li>Separate: $\int\frac{dy}{y} = \int k\,dx$.</li>
<li>Integrate: $\ln|y| = kx + c$.</li>
<li>Exponentiate: $y = e^{kx + c} = e^c e^{kx}$; rename the constant: $y = Ce^{kx}$.</li>
<li>Initial condition: $C = A$, so $y = Ae^{kx}$. Change proportional to size ⇒ exponential — the most important sentence in modelling.</li>
</ol></div>
<div class="wex"><div class="wex-t">Worked example — with an initial condition</div>
<p>Solve $\frac{dy}{dx} = \frac{x}{y}$, $y(0) = 2$.</p>
<ol class="steps">
<li>$\int y\,dy = \int x\,dx$ → $\frac{y^2}{2} = \frac{x^2}{2} + c$.</li>
<li>At $(0, 2)$: $2 = 0 + c$ → $c = 2$.</li>
<li>$y^2 = x^2 + 4$, so $y = \sqrt{x^2 + 4}$ (positive root — it must pass through $y = 2 &gt; 0$).</li>
</ol></div>
<div class="warn"><b>Trap:</b> $e^{kx + c}$ is NOT "$e^{kx} + c$" — the constant multiplies after exponentiating. Writing $y = Ae^{kx}$ where $A$ absorbed $e^c$ is the clean move.</div>` },

{ h: 'Slope fields — the flow map', body: L`
<p>A DE $\frac{dy}{dx} = f(x, y)$ assigns a gradient to EVERY point of the plane. Drawing a small dash with that gradient at each grid point gives the <b>slope field</b>; solution curves "surf" the dashes. Different initial conditions pick different curves, and solution curves never cross.</p>
<p>How to work with them:</p>
<ul>
<li><b>Sketching a solution:</b> start at the initial point, follow the dashes forward AND backward, always tangent to the local dash.</li>
<li><b>Matching a field to its DE:</b> interrogate special places — where is the slope 0? Where is it independent of $x$ (dashes identical along horizontal lines ⇒ DE has no $x$)? Positive vs negative regions?</li>
<li><b>Isoclines:</b> the set of points where the slope equals a constant $m$ is the curve $f(x,y) = m$ — useful for sketching fields by hand.</li>
</ul>
<div class="tip"><b>Tip:</b> Exam MCQ strategy: compute the slope at one or two easy points (like the origin, or a point where $x = 0$) and eliminate fields that disagree. Two points usually kill three options.</div>
<div class="viz" data-viz="slopefield"></div>` },

{ h: "Euler's method — pretend it's straight", body: L`
<p>When a DE will not separate, walk numerically: pretend the curve is straight for a tiny step $h$, then re-aim.</p>
<div class="fbox">$x_{n+1} = x_n + h$, $\quad y_{n+1} = y_n + h \cdot f(x_n, y_n)$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$\frac{dy}{dx} = x + y$, $y(0) = 1$, step $h = 0.1$. Estimate $y(0.3)$.</p>
<ol class="steps">
<li>Slope at $(0, 1)$: $1$. New $y = 1 + 0.1(1) = 1.1$.</li>
<li>Slope at $(0.1, 1.1)$: $1.2$. New $y = 1.1 + 0.12 = 1.22$.</li>
<li>Slope at $(0.2, 1.22)$: $1.42$. New $y = 1.22 + 0.142 = 1.362$.</li>
<li>So $y(0.3) \approx 1.36$. Lay it out as a table of $x_n$, $y_n$, slope — markschemes are structured around exactly that table.</li>
</ol></div>
<p>Accuracy: halving $h$ roughly halves the error (but doubles the work — this is what the GDC spreadsheet is for). Euler UNDERestimates when the true curve is concave up (each straight step sags below the curve), and overestimates when concave down.</p>
<div class="warn"><b>Trap:</b> the slope is always evaluated at the CURRENT point $(x_n, y_n)$ — both coordinates. Using the new $x$ with the old $y$, or forgetting to update $x$ at all, silently derails the whole table.</div>` },

{ h: 'Coupled systems & phase portraits', body: L`
<p>Two interacting quantities (predator–prey, competing species, love affairs if you believe the textbooks) give a <b>coupled system</b>:</p>
<div class="fbox">$\frac{dx}{dt} = ax + by$, $\quad \frac{dy}{dt} = cx + dy$ — in matrix form $\dot{\mathbf{x}} = M\mathbf{x}$ with $M$ = <span class="mx"><span>a</span><span>b</span><span>c</span><span>d</span></span></div>
<p>The <b>phase portrait</b> plots trajectories in the $x$–$y$ plane (time implicit). The eigenvalues of $M$ (Gap Zone → Matrices if rusty) decide the picture:</p>
<div class="fbox">both $\lambda &lt; 0$: stable node (everything falls in) · both $&gt; 0$: unstable node (everything flees) · opposite signs: saddle (in along one eigenvector, out along the other) · complex $\lambda$: spirals — stable if the real part $&lt; 0$, growing if $&gt; 0$</div>
<p>Exact solutions are built from the eigen-pairs:</p>
<div class="fbox">$\mathbf{x}(t) = Ae^{\lambda_1 t}\mathbf{v}_1 + Be^{\lambda_2 t}\mathbf{v}_2$ — constants $A, B$ from the initial point</div>
<div class="wex"><div class="wex-t">Worked example — classify without solving</div>
<p>$M$ = <span class="mx"><span>1</span><span>4</span><span>1</span><span>1</span></span>: trace $= 2$, det $= 1 - 4 = -3$. Eigenvalues solve $\lambda^2 - 2\lambda - 3 = 0$ → $\lambda = 3, -1$. Opposite signs ⇒ SADDLE: trajectories approach along the $\lambda = -1$ eigenvector direction, then get flung out along the $\lambda = 3$ direction.</p>
</div>
<p><b>Euler for systems</b> is the same one-step logic run on both variables at once, always from CURRENT values: $x_{n+1} = x_n + h(ax_n + by_n)$, $y_{n+1} = y_n + h(cx_n + dy_n)$.</p>
<div class="warn"><b>Trap:</b> updating $x$ first and then using the NEW $x$ to update $y$ inside the same step. Both updates use the old pair $(x_n, y_n)$ — compute both slopes before moving anything.</div>
<div class="viz" data-viz="phase"></div>` },
],
},
{
id: 'u36', code: '3.6', title: 'Graph Theory',
sub: 'Networks, adjacency matrices, Eulerian trails, spanning trees, Chinese postman & TSP.',
syll: 'AI HL 3.14 – 3.16',
video: { id: 'LFKZLXVO-Dg', title: 'Reducible — Introduction to graph theory', why: 'Vertices, edges and why the Eulerian result works — the vocabulary made visual.' },
notes: [
{ h: 'The vocabulary bank', body: L`
<p>A <b>graph</b> is dots and lines: <b>vertices</b> joined by <b>edges</b>. Nearly every mark in this unit starts with a definition, so nail the vocabulary:</p>
<ul>
<li><b>Degree</b> of a vertex — number of edge-ends meeting it (a loop counts twice).</li>
<li><b>Simple</b> — no loops, no repeated edges. <b>Connected</b> — you can walk between any two vertices.</li>
<li><b>Complete</b> $K_n$ — every pair joined: $\frac{n(n-1)}{2}$ edges.</li>
<li><b>Weighted</b> — edges carry numbers (distance, cost); <b>directed</b> — edges are one-way arrows (in-degree and out-degree separate).</li>
<li><b>Walk</b> — any vertex-to-vertex stroll (repeats allowed); <b>trail</b> — no repeated EDGE; <b>path</b> — no repeated VERTEX; <b>cycle</b> — path returning to its start.</li>
<li><b>Tree</b> — connected with no cycles; always exactly $n - 1$ edges. <b>Spanning tree</b> — a tree inside a graph touching every vertex.</li>
<li><b>Subgraph</b> — a graph formed from some of the vertices and edges of another.</li>
</ul>
<div class="tip"><b>Tip:</b> Trail vs path (edges vs vertices) is a favourite one-mark ambush. Trail = mail-trail: you may revisit a corner but never re-walk a street.</div>` },

{ h: 'The handshake lemma', body: L`
<p>Every edge has two ends, so summing degrees counts each edge twice:</p>
<div class="fbox">$\sum \deg(v) = 2e$ — hence the number of ODD-degree vertices is always EVEN</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Can a graph have degrees 3, 3, 3, 3, 2?</p>
<ol class="steps">
<li>Sum $= 14$, so $e = 7$ — the sum test passes.</li>
<li>Odd-degree vertices: four of them — even ✓. So no contradiction; such a graph exists (draw $K_4$ plus a vertex tapped into one edge... or just trust the lemma both ways: an ODD count of odd degrees would have been impossible).</li>
</ol></div>
<p>This lemma is the engine behind the Eulerian results below and behind "explain why no such graph exists" questions — if the degree list sums odd or has an odd number of odd entries, it cannot be drawn.</p>
<div class="viz" data-viz="graph"></div>` },

{ h: 'Adjacency matrices & counting walks', body: L`
<p>Number the vertices; put $A_{ij}$ = number of edges from $i$ to $j$. For undirected graphs $A$ is symmetric; for directed graphs it need not be; for weighted graphs store weights instead (with a separate convention for "no edge"). The killer theorem:</p>
<div class="fbox">$(A^k)_{ij}$ = number of WALKS of length $k$ from $i$ to $j$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Triangle graph on vertices 1, 2, 3 (each pair joined). How many walks of length 2 from 1 to 1, and from 1 to 2?</p>
<ol class="steps">
<li>Walks 1→1 of length 2: via 2 or via 3, so 2. That is $(A^2)_{11} = 2$ — equal to $\deg(1)$, as any out-and-back works.</li>
<li>Walks 1→2 of length 2: only 1→3→2, so 1. ✓ Matches $(A^2)_{12} = 1$.</li>
</ol></div>
<div class="tip"><b>Tip:</b> On the GDC, store $A$ once and raise it to powers — questions asking for "number of routes using exactly 4 flights" are just $(A^4)_{ij}$ read straight off the screen. The diagonal of $A^2$ lists the degrees (undirected, simple).</div>` },

{ h: 'Eulerian trails & circuits', body: L`
<p>Eulerian = about EDGES (walk every edge exactly once). The complete theory fits in one box:</p>
<div class="fbox">Eulerian CIRCUIT (return to start): connected + ALL degrees even · Eulerian TRAIL (no return): connected + exactly TWO odd vertices — start at one odd vertex, finish at the other · more than two odd vertices: neither exists</div>
<p>Why: each visit to a vertex uses two edge-ends (in + out), so interior vertices must have even degree; only a start and an end can be odd.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A graph has degrees 2, 3, 4, 3, 4. Eulerian circuit, trail, or neither?</p>
<ol class="steps">
<li>Odd-degree vertices: the two 3's — exactly two.</li>
<li>So (assuming connected): an Eulerian TRAIL exists between the two degree-3 vertices, but no circuit.</li>
</ol></div>
<p><b>Hamiltonian</b> is the vertex twin (visit every VERTEX once) — and there is NO clean test for it. That asymmetry (edges: easy theorem; vertices: no theorem) is itself a favourite exam question. For Hamiltonian questions you exhibit a cycle or argue directly.</p>` },

{ h: 'Minimum spanning trees: Kruskal & Prim', body: L`
<p>Cheapest set of edges connecting every vertex = <b>minimum spanning tree</b> ($n - 1$ edges, no cycles). Two greedy algorithms, both correct:</p>
<ul>
<li><b>Kruskal:</b> sort edges by weight; repeatedly take the cheapest edge that does NOT close a cycle, until $n - 1$ edges are placed. (Edge-focused — can grow in disconnected clumps that merge later.)</li>
<li><b>Prim:</b> start at any vertex; repeatedly add the cheapest edge from the tree-so-far to a NEW vertex. (Tree-focused — one growing blob; this is the one that runs naturally from a weight matrix on the GDC.)</li>
</ul>
<div class="wex"><div class="wex-t">Worked example — Kruskal</div>
<p>Edges (weight): AB(1), CD(2), AC(3), BC(4), BD(5).</p>
<ol class="steps">
<li>Take AB(1) ✓, CD(2) ✓, AC(3) ✓ — now all four vertices connected with 3 = $n-1$ edges.</li>
<li>BC(4) would close cycle A-B-C — reject. Done: MST = AB + CD + AC, total weight 6.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Method marks come from showing the ORDER you considered/added edges and noting any rejection with the cycle it would close. A bare final tree scores worse than a documented greedy run.</div>` },

{ h: 'Chinese postman (route inspection)', body: L`
<p>Walk EVERY EDGE at least once and return to the start, minimising total distance. If every degree is even, the graph is Eulerian and the answer is simply the total weight. Odd-degree vertices are the obstruction — each pair of them forces some edges to be walked twice:</p>
<ol class="steps">
<li>List the odd-degree vertices (always an even number of them).</li>
<li>Pair them up; for each pairing, sum the SHORTEST PATHS between the pairs.</li>
<li>Choose the cheapest pairing; those path edges get walked twice.</li>
<li>Answer = total weight of all edges + cheapest pairing cost.</li>
</ol>
<div class="wex"><div class="wex-t">Worked example — four odd vertices</div>
<p>Odd vertices A, B, C, D with shortest paths AB = 5, CD = 4, AC = 3, BD = 3, AD = 6, BC = 7. Total edge weight 60.</p>
<ol class="steps">
<li>Pairings: (AB)+(CD) $= 9$; (AC)+(BD) $= 6$; (AD)+(BC) $= 13$.</li>
<li>Cheapest is 6 → postman route $= 60 + 6 = 66$, repeating the edges along the A–C and B–D shortest paths.</li>
</ol></div>
<div class="warn"><b>Trap:</b> pair distances are SHORTEST PATHS through the graph, not necessarily direct edges — check for cheaper multi-edge routes before summing pairings.</div>` },

{ h: 'Travelling salesman: bounds', body: L`
<p>Visit every VERTEX and return — minimising weight. Exact answers are computationally brutal, so the IB asks you to TRAP the optimum between bounds:</p>
<div class="fbox">Upper bound: any actual tour works — use the NEAREST-NEIGHBOUR algorithm (from a start vertex, always visit the nearest unvisited vertex, finally return) · Lower bound: DELETE a vertex; find the MST of what remains; add back the two cheapest deleted edges</div>
<p>Why they work: the true optimum is a tour, so any constructed tour is ≥ it (upper); removing a vertex from the optimal tour leaves a spanning path, which weighs at least the MST, plus the two edges at the deleted vertex weigh at least the two cheapest ones (lower).</p>
<div class="wex"><div class="wex-t">Worked example — structure</div>
<ol class="steps">
<li>Nearest neighbour from A gives tour A→C→B→D→A with weight, say, 23 → optimum ≤ 23.</li>
<li>Delete D: MST of A, B, C weighs 11; two cheapest edges at D are 4 and 5 → optimum ≥ 20.</li>
<li>Conclusion to write: $20 \le \text{optimal} \le 23$. Different deleted vertices give different lower bounds — the BEST lower bound is the largest one.</li>
</ol></div>
<div class="tip"><b>Tip:</b> In a table (matrix) question, nearest-neighbour is just "scan the row for the smallest unused entry". Cross out visited columns as you go — the bookkeeping is the marks.</div>` },
],
},
{
id: 'u37', code: '3.7', title: 'Inference & Hypothesis Testing',
sub: 'Confidence intervals, z/t/chi-square/Poisson/correlation tests, and Type I/II errors.',
syll: 'AI HL 4.11 · 4.16 · 4.18',
video: { id: 'vemZtEM63GY', title: 'StatQuest — p-values, clearly explained', why: 'The definition that examiners want, in plain language.' },
notes: [
{ h: 'The big idea: sample → population', body: L`
<p>You never see the whole population — you see a sample and want to reason backwards. Everything in this unit is one of two moves:</p>
<ul>
<li><b>Estimation:</b> "given this sample, what is the population mean plausibly?" → confidence intervals.</li>
<li><b>Testing:</b> "someone claims the mean is 500; does my sample give evidence against that?" → hypothesis tests.</li>
</ul>
<p>Both moves run on the same engine: knowing how sample means BEHAVE. Sample statistics wobble from sample to sample; the pattern of that wobble is the <b>sampling distribution</b>.</p>` },

{ h: 'The sampling distribution of the mean', body: L`
<div class="fbox">If $X \sim N(\mu, \sigma^2)$, then $\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)$ — means wobble LESS than individuals, by factor $\sqrt{n}$</div>
<p>And by the <b>Central Limit Theorem</b>, for large $n$ (≈30+) this holds approximately even when the population is NOT normal. (Full story: Gap Zone → Estimators & CLT — read it before this unit if possible.)</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Bags of flour: $\mu = 1000$ g, $\sigma = 12$ g. Find $P(\bar{X} &lt; 995)$ for a sample of 16 bags.</p>
<ol class="steps">
<li>$\bar{X} \sim N(1000, \frac{144}{16})$, i.e. standard deviation $\frac{12}{4} = 3$.</li>
<li>GDC normal cdf with mean 1000, sd 3: $P(\bar{X} &lt; 995) \approx 0.0478$.</li>
<li>Note a single bag under 995 g is common ($P \approx 0.34$); a sample MEAN under 995 is rare. That gap is the whole point of inference.</li>
</ol></div>` },

{ h: 'Confidence intervals', body: L`
<p>A 95% confidence interval for $\mu$ is built so that the METHOD captures the true mean in 95% of samples. Which flavour:</p>
<div class="fbox">z-interval: $\sigma$ known (rare, textbook-flavoured) · t-interval: only the sample sd known (real life, and the IB default for data)</div>
<p>Both on the GDC: enter data or summary stats, read off the interval. Width behaviour you should be able to explain: wider for higher confidence, narrower for bigger $n$ (shrinks like $\frac{1}{\sqrt{n}}$ — quadruple the sample to halve the width).</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Sample of 25 batteries: $\bar{x} = 41.2$ h, $s = 3.5$ h. 95% CI for the mean life?</p>
<ol class="steps">
<li>$\sigma$ unknown → t-interval, df $= 24$.</li>
<li>GDC: TInterval → $(39.76, 42.64)$ (3 s.f.).</li>
<li>Interpretation sentence: "We are 95% confident the interval from 39.8 to 42.6 hours contains the true mean battery life."</li>
</ol></div>
<div class="warn"><b>Trap:</b> the wording "there is a 95% probability that $\mu$ is in THIS interval" loses the mark — $\mu$ is fixed, the INTERVAL is what varies. Confidence lives in the method, not in one interval.</div>` },

{ h: 'Hypothesis tests — the choreography', body: L`
<p>Every test is the same five-step dance; only the GDC menu item changes.</p>
<ol class="steps">
<li>Hypotheses: $H_0$ is the status quo and always carries the equality (e.g. $\mu = 500$); $H_1$ is what you suspect ($\mu \ne 500$ two-tailed, or $&lt;$ / $&gt;$ one-tailed — read the wording).</li>
<li>Significance level $\alpha$ (given, usually 5% or 1%).</li>
<li>Run the test on the GDC → p-value.</li>
<li>Decision: p $&lt; \alpha$ → reject $H_0$; otherwise fail to reject.</li>
<li>Conclusion IN CONTEXT, with the p-value quoted.</li>
</ol>
<div class="fbox">The p-value = the probability, ASSUMING $H_0$ IS TRUE, of a result at least as extreme as the one observed. Small p ⇒ the data are weird under $H_0$ ⇒ evidence against it.</div>
<div class="wex"><div class="wex-t">Worked example — one-sample t</div>
<p>A cereal box claims $\mu = 500$ g. Sample of 20: $\bar{x} = 494$, $s = 11$. Test at 5% whether the mean is LESS than claimed.</p>
<ol class="steps">
<li>$H_0: \mu = 500$; $H_1: \mu &lt; 500$ (one-tailed — the suspicion is "less").</li>
<li>GDC t-test → p $\approx 0.0125$.</li>
<li>$0.0125 &lt; 0.05$ → reject $H_0$: significant evidence at the 5% level that the mean fill is below 500 g.</li>
</ol></div>
<div class="warn"><b>Trap:</b> never write "accept $H_0$" — a big p-value means INSUFFICIENT EVIDENCE against it, not proof of it. The wording mark is real and examiners collect it every session.</div>
<div class="viz" data-viz="normal"></div>` },

{ h: 'The test menu — picking the right one', body: L`
<p>Read the question, identify the parameter, pick from the menu:</p>
<ul>
<li><b>Mean, $\sigma$ known</b> → z-test. <b>Mean, $\sigma$ unknown</b> → t-test (one-sample, or TWO-sample for comparing groups — pooled if told sds equal).</li>
<li><b>Proportion</b> ("what fraction of voters…") → 1-prop z-test; comparing two fractions → 2-prop z-test.</li>
<li><b>Poisson rate</b> ("average number of calls per hour changed?") → test on a Poisson mean (binomial/Poisson probabilities from the GDC).</li>
<li><b>Correlation</b> ("is there a linear association?") → test $H_0: \rho = 0$ using the t-statistic for $r$ — output straight from the GDC's LinRegTTest.</li>
<li><b>Category counts</b> → chi-square (next section).</li>
</ul>
<div class="tip"><b>Tip:</b> One-tailed or two? "Changed / different" ⇒ two-tailed. "Increased / decreased / more / less" ⇒ one-tailed. Halving or doubling a p-value by picking the wrong tails is a classic self-inflicted wound.</div>` },

{ h: 'Chi-square tests: GOF & independence', body: L`
<p>Chi-square compares OBSERVED counts with EXPECTED counts.</p>
<div class="fbox">Goodness of fit: does data match claimed proportions? df $= k - 1$ · Independence (contingency table): are two variables related? df $= (r-1)(c-1)$, expected $= \frac{\text{row total} \times \text{column total}}{\text{grand total}}$</div>
<div class="wex"><div class="wex-t">Worked example — independence setup</div>
<p>150 students: rows = year (75, 75), columns = prefers cats/dogs (90, 60). Expected count for Year 1 × cats?</p>
<ol class="steps">
<li>$E = \frac{75 \times 90}{150} = 45$. Fill the whole expected table the same way.</li>
<li>df $= (2-1)(2-1) = 1$. GDC chi-square test → p-value; compare with $\alpha$; conclude in context ("evidence of an association between year and pet preference" or not).</li>
</ol></div>
<p>$H_0$ is always "independent / follows the claimed distribution"; $H_1$ "not". Conditions: expected counts should all be ≥ 5 — if not, COMBINE adjacent categories and recompute df.</p>
<div class="warn"><b>Trap:</b> df uses the number of CATEGORIES, not the sample size. And GOF expected counts come from the claimed model times $n$ — forgetting to scale proportions up to counts breaks everything downstream.</div>` },

{ h: 'Type I & Type II errors', body: L`
<div class="fbox">Type I: rejecting $H_0$ when it is TRUE — false alarm, probability $= \alpha$ · Type II: failing to reject $H_0$ when it is FALSE — missed detection, probability $= \beta$</div>
<div class="wex"><div class="wex-t">Worked example — in context</div>
<p>Drug test with $H_0$: "drug has no effect". Type I = concluding the drug works when it does not (false hope, wasted money). Type II = concluding nothing when the drug actually works (a real treatment shelved). Writing both IN CONTEXT like this is exactly what the question wants.</p>
</div>
<p>The trade-off: shrinking $\alpha$ (a stricter test) makes false alarms rarer but missed detections MORE likely — you cannot minimise both for free. The escape hatch is a bigger sample: more data shrinks $\beta$ at fixed $\alpha$. (The quantity $1 - \beta$ is called the power of the test.)</p>
<div class="tip"><b>Tip:</b> Which error is worse depends on the story — a fire alarm tolerates Type I (annoying) to avoid Type II (catastrophic); criminal courts do the reverse. Expect a "which error is more serious here and why" part.</div>` },
],
},
{
id: 'u38', code: 'Jan', title: 'Log-Log Plots & Linearisation',
sub: 'Turning curves into straight lines to identify models — the January special.',
syll: 'AI HL 2.10',
video: { id: 'Kas0tIxDvrg', title: '3Blue1Brown — Exponential growth and epidemics', why: 'Shows why exponential data gets read on logarithmic axes.' },
notes: [
{ h: 'Why take logs at all', body: L`
<p>Straight lines are the only shape humans can reliably fit by eye and read parameters from. Logs convert multiplicative structure into additive structure — turning the two big model families into lines:</p>
<div class="fbox">Power law $y = ax^n$: $\ \log y = \log a + n\log x$ → straight on LOG-LOG axes, slope $= n$, intercept $= \log a$</div>
<div class="fbox">Exponential $y = ab^x$: $\ \log y = \log a + x\log b$ → straight on SEMI-LOG axes (log $y$ only), slope $= \log b$, intercept $= \log a$</div>
<p>The diagnostic runs backwards too: plot the data both ways, and WHICHEVER plot straightens the data names the model family. That one sentence is most of the January lesson.</p>
<div class="viz" data-viz="loglog"></div>` },

{ h: 'Worked: recovering a power law', body: L`
<div class="wex"><div class="wex-t">Worked example</div>
<p>Data straightens on log-log axes; the line passes through $(\log x, \log y) = (1, 2.3)$ and $(3, 6.9)$ (base-10 logs). Find the model.</p>
<ol class="steps">
<li>Slope: $n = \frac{6.9 - 2.3}{3 - 1} = 2.3$. So $y = ax^{2.3}$.</li>
<li>Intercept: extend to $\log x = 0$: $\log a = 2.3 - 2.3 \times 1 = 0$, so $a = 10^0 = 1$.</li>
<li>Model: $y = x^{2.3}$. Always convert the intercept back with $a = 10^{\text{intercept}}$ — leaving it as a log is the classic half-answer.</li>
</ol></div>` },

{ h: 'Worked: recovering an exponential', body: L`
<div class="wex"><div class="wex-t">Worked example</div>
<p>Data straightens on semi-log axes; the fitted line is $\log y = 0.30 + 0.12x$ (base 10). Find the model.</p>
<ol class="steps">
<li>Intercept: $a = 10^{0.30} \approx 2.0$.</li>
<li>Slope: $\log b = 0.12$, so $b = 10^{0.12} \approx 1.32$.</li>
<li>Model: $y = 2.0 \times 1.32^x$ — i.e. 32% growth per unit of $x$.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Sanity checks: on log-log, doubling behaviour depends on the POWER; on semi-log, equal $x$-steps multiply $y$ by equal factors. And $R^2$ closeness between two candidate linearisations is a legitimate tiebreaker — quote it. Base $e$ works identically with $\ln$ throughout (then $b = e^{\text{slope}}$).</div>` },
],
},
];

// ============================================================
// Gaps you might have
// ============================================================
const GAPS = [
{
id: 'g1', title: 'Matrices & Eigenvalues', syll: 'AI HL 1.14 · 1.15',
why: 'Not on the calendar, but unit 3.5 (coupled DEs) and Markov chains quietly depend on it.',
sub: 'Operations, determinants, inverses, eigenvalues & eigenvectors.',
video: { id: 'PFDu9oVAE-g', title: '3Blue1Brown — Eigenvectors and eigenvalues', why: 'Required viewing: turns the formula into a picture you can actually see.' },
notes: [
{ h: 'Matrix arithmetic', body: L`
<p>A matrix is a grid of numbers; an $m \times n$ matrix has $m$ rows and $n$ columns (rows first, always). Add and subtract entrywise (same shape required); multiply by a scalar entrywise. Matrix MULTIPLICATION is row-into-column:</p>
<div class="fbox">$(AB)_{ij}$ = row $i$ of $A$ dotted with column $j$ of $B$ — shapes must chain: $(m \times n)(n \times p) = m \times p$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Compute <span class="mx"><span>1</span><span>2</span><span>3</span><span>4</span></span> <span class="mx"><span>5</span><span>6</span><span>7</span><span>8</span></span>.</p>
<ol class="steps">
<li>Top-left: row (1, 2) · column (5, 7) $= 5 + 14 = 19$. Top-right: (1, 2)·(6, 8) $= 22$.</li>
<li>Bottom-left: (3, 4)·(5, 7) $= 43$. Bottom-right: (3, 4)·(6, 8) $= 50$.</li>
<li>Result: <span class="mx"><span>19</span><span>22</span><span>43</span><span>50</span></span>.</li>
</ol></div>
<p>Order MATTERS: $AB \ne BA$ in general (often the shapes do not even allow both). The identity $I$ (1's on the diagonal) acts like the number 1: $AI = IA = A$.</p>
<div class="tip"><b>Tip:</b> The GDC multiplies, inverts and powers matrices natively — learn the matrix editor keystrokes now; units 3.5, 3.6 and Markov chains all lean on it.</div>` },

{ h: 'Determinant & inverse (2×2)', body: L`
<p>For $M$ = <span class="mx"><span>a</span><span>b</span><span>c</span><span>d</span></span>:</p>
<div class="fbox">$\det M = ad - bc$ &nbsp;·&nbsp; $M^{-1} = \frac{1}{ad - bc}$ <span class="mx"><span>d</span><span>−b</span><span>−c</span><span>a</span></span> — swap the diagonal, negate the off-diagonal, divide by det</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Invert $M$ = <span class="mx"><span>2</span><span>1</span><span>5</span><span>3</span></span>.</p>
<ol class="steps">
<li>$\det = 2 \times 3 - 1 \times 5 = 1$.</li>
<li>$M^{-1}$ = <span class="mx"><span>3</span><span>−1</span><span>−5</span><span>2</span></span>. Check: $MM^{-1} = I$ ✓ (30 seconds well spent).</li>
</ol></div>
<p>$\det M = 0$ ⟺ no inverse ("singular") — the matrix squashes the plane flat and cannot be undone. $|\det M|$ is also the area scale factor of the map (see Matrix Transformations).</p>` },

{ h: 'Solving systems with matrices', body: L`
<p>A linear system is one matrix equation:</p>
<div class="fbox">$M\mathbf{x} = \mathbf{b} \Rightarrow \mathbf{x} = M^{-1}\mathbf{b}$ (when $\det M \ne 0$)</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Solve $2x + y = 4$, $5x + 3y = 9$.</p>
<ol class="steps">
<li>$M$ = <span class="mx"><span>2</span><span>1</span><span>5</span><span>3</span></span>, $\mathbf{b}$ = <span class="mx mxv"><span>4</span><span>9</span></span>; from the previous example $M^{-1}$ = <span class="mx"><span>3</span><span>−1</span><span>−5</span><span>2</span></span>.</li>
<li>$\mathbf{x} = M^{-1}\mathbf{b}$ = <span class="mx mxv"><span>3</span><span>−2</span></span>, i.e. $x = 3$, $y = -2$. Check in an original equation ✓.</li>
</ol></div>
<p>For $3 \times 3$ and beyond: same idea, GDC does the inverting. If $\det = 0$ the system has either NO solution or INFINITELY many — the matrix cannot tell you which; look at whether the equations contradict or repeat.</p>` },

{ h: 'Eigenvalues', body: L`
<p>An <b>eigenvector</b> of $M$ is a direction the map only STRETCHES (no rotation off the line): $M\mathbf{v} = \lambda\mathbf{v}$, and the stretch factor $\lambda$ is its <b>eigenvalue</b>. They are found from:</p>
<div class="fbox">$\det(M - \lambda I) = 0$ — for a 2×2 this is always $\lambda^2 - (\text{trace})\lambda + \det = 0$, where trace $= a + d$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Eigenvalues of $M$ = <span class="mx"><span>4</span><span>1</span><span>2</span><span>3</span></span>.</p>
<ol class="steps">
<li>Trace $= 7$, $\det = 12 - 2 = 10$.</li>
<li>Characteristic equation: $\lambda^2 - 7\lambda + 10 = 0$ → $(\lambda - 5)(\lambda - 2) = 0$.</li>
<li>$\lambda = 5$ and $\lambda = 2$. Check: sum $= 7 =$ trace ✓, product $= 10 = \det$ ✓.</li>
</ol></div>
<div class="tip"><b>Tip:</b> The trace/det checks catch sign slips instantly — use them every single time. Complex eigenvalues (negative discriminant) are fine and meaningful: they signal ROTATION, which is exactly what makes spirals in unit 3.5.</div>
<div class="viz" data-viz="phase"></div>` },

{ h: 'Eigenvectors — and why any of this matters', body: L`
<p>For each $\lambda$, solve $(M - \lambda I)\mathbf{v} = \mathbf{0}$. The two equations will be multiples of each other (that is the point — det is zero), so one equation determines the DIRECTION and any scalar multiple works.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Continue $M$ = <span class="mx"><span>4</span><span>1</span><span>2</span><span>3</span></span> with $\lambda = 5$.</p>
<ol class="steps">
<li>$M - 5I$ = <span class="mx"><span>−1</span><span>1</span><span>2</span><span>−2</span></span>; the first row says $-v_1 + v_2 = 0$, i.e. $v_2 = v_1$.</li>
<li>Eigenvector $\mathbf{v}_1$ = <span class="mx mxv"><span>1</span><span>1</span></span> (or any multiple). For $\lambda = 2$: row gives $2v_1 + v_2 = 0$ → $\mathbf{v}_2$ = <span class="mx mxv"><span>1</span><span>−2</span></span>.</li>
<li>Verify one: $M\mathbf{v}_1$ = <span class="mx mxv"><span>5</span><span>5</span></span> $= 5\mathbf{v}_1$ ✓.</li>
</ol></div>
<p><b>Where this cashes out:</b> phase portraits in unit 3.5 (eigen-directions are the straight-line trajectories; eigenvalue signs decide stability), Markov steady states (eigenvector for $\lambda = 1$), and matrix powers ($M^n$ acts like $\lambda^n$ along each eigen-direction — the reason long-run behaviour is governed by the biggest eigenvalue).</p>` },
],
},
{
id: 'g2', title: 'Matrix Transformations', syll: 'AI HL 3.9',
why: 'Geometric transformations as 2×2 matrices — absent from the calendar.',
sub: 'Rotations, reflections, stretches, and determinant = area factor.',
video: { id: 'kYB8IZa5AuE', title: '3Blue1Brown — Linear transformations and matrices', why: 'Why the columns of a matrix are where the basis arrows land.' },
notes: [
{ h: 'Matrices move the plane', body: L`
<p>Multiplying position vectors by a 2×2 matrix transforms the whole plane, and the matrix is easy to READ:</p>
<div class="fbox">Column 1 = image of $(1, 0)$ · Column 2 = image of $(0, 1)$ — the columns ARE the transformed basis arrows</div>
<div class="wex"><div class="wex-t">Worked example — find the matrix from a description</div>
<p>Find the matrix reflecting in the $x$-axis.</p>
<ol class="steps">
<li>$(1, 0)$ stays $(1, 0)$; $(0, 1)$ flips to $(0, -1)$.</li>
<li>Columns in order: $M$ = <span class="mx"><span>1</span><span>0</span><span>0</span><span>−1</span></span>. Done — no formula sheet needed if you can picture two arrows.</li>
</ol></div>
<p>To transform a shape, multiply each vertex (stack vertices as columns and do it in one multiplication on the GDC).</p>
<div class="viz" data-viz="matrix"></div>` },

{ h: 'The standard catalogue', body: L`
<div class="fbox">Rotation by $\theta$ anticlockwise about O: columns $(\cos\theta, \sin\theta)$ and $(-\sin\theta, \cos\theta)$</div>
<div class="fbox">Reflections: in the $x$-axis, $y$-axis, $y = x$ (columns $(0,1)$ and $(1,0)$), and $y = -x$ · Stretch factor $k$ along an axis: diagonal matrix · Enlargement factor $k$: $kI$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Rotate the point $(2, 1)$ by $90°$ anticlockwise.</p>
<ol class="steps">
<li>$\theta = 90°$: matrix columns $(0, 1)$ and $(-1, 0)$.</li>
<li>Image $= (0 \times 2 - 1 \times 1,\ 1 \times 2 + 0 \times 1) = (-1, 2)$. Sketch to confirm the quarter-turn ✓.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Do not memorise blindly — REBUILD from the columns rule: where do $(1,0)$ and $(0,1)$ land? Ten seconds of sketching regenerates the whole catalogue under exam pressure.</div>` },

{ h: 'Composition — order matters', body: L`
<div class="fbox">Applying $A$ first, then $B$, is the single matrix $BA$ — the FIRST transformation sits NEAREST the vector: $B(A\mathbf{x}) = (BA)\mathbf{x}$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Rotate $90°$ anticlockwise (call it $R$), THEN reflect in the $x$-axis (call it $F$). One matrix?</p>
<ol class="steps">
<li>Required product: $FR$ (first transformation on the right).</li>
<li>$FR$ = <span class="mx"><span>1</span><span>0</span><span>0</span><span>−1</span></span><span class="mx"><span>0</span><span>−1</span><span>1</span><span>0</span></span> = <span class="mx"><span>0</span><span>−1</span><span>−1</span><span>0</span></span> — which is reflection in $y = -x$. Reversing the order gives reflection in $y = x$ instead: order genuinely changes the answer.</li>
</ol></div>` },

{ h: 'Determinant = area scale factor', body: L`
<div class="fbox">area of image $= |\det M| \times$ area of object · $\det &lt; 0$ ⇒ orientation flipped (the plane got mirrored)</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A triangle of area 5 is transformed by $M$ = <span class="mx"><span>3</span><span>1</span><span>0</span><span>2</span></span>. Image area?</p>
<ol class="steps">
<li>$\det M = 6$, so image area $= 6 \times 5 = 30$. Positive det: orientation preserved.</li>
</ol></div>
<p>Consistency checks that examiners love: rotations and reflections have $|\det| = 1$ (they move shapes rigidly), stretches multiply areas by their factors, and a singular matrix ($\det = 0$) flattens all of 2D onto a line — area 0, information destroyed, no inverse. All four facts are the same fact.</p>` },
],
},
{
id: 'g3', title: 'Vectors', syll: 'AI HL 3.10 – 3.13',
why: 'A whole AHL block (dot/cross products, vector lines, vector kinematics) with zero calendar slots.',
sub: 'Components, products, lines, and motion.',
video: { id: 'fNk_zzaMoSs', title: '3Blue1Brown — Vectors, what even are they?', why: 'The three ways to read a vector, reconciled in ten minutes.' },
notes: [
{ h: 'Vectors as displacements', body: L`
<p>A vector is a magnitude + direction package — "3 km north-east" — written in components $\mathbf{v} = (v_1, v_2, v_3)$. Position vectors point from the origin to a point; displacement between points:</p>
<div class="fbox">$\vec{AB} = \mathbf{b} - \mathbf{a}$ (destination minus start) &nbsp;·&nbsp; $|\mathbf{v}| = \sqrt{v_1^2 + v_2^2 + v_3^2}$ &nbsp;·&nbsp; unit vector $\hat{\mathbf{v}} = \frac{\mathbf{v}}{|\mathbf{v}|}$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$A(1, 2, 3)$, $B(4, -2, 3)$: $\vec{AB} = (3, -4, 0)$, $|\vec{AB}| = \sqrt{9 + 16} = 5$, unit vector $\frac{1}{5}(3, -4, 0)$.</p>
</div>
<p>Adding vectors chains displacements tip-to-tail; scalar multiples stretch (negative flips). Parallel ⟺ one is a scalar multiple of the other — the go-to test for "show A, B, C are collinear": show $\vec{AB} = k\,\vec{AC}$.</p>` },

{ h: 'The dot product — angles & perpendicularity', body: L`
<div class="fbox">$\mathbf{a}\cdot\mathbf{b} = a_1b_1 + a_2b_2 + a_3b_3 = |\mathbf{a}||\mathbf{b}|\cos\theta$ — a NUMBER</div>
<p>Both formulas at once give the angle machine: $\cos\theta = \frac{\mathbf{a}\cdot\mathbf{b}}{|\mathbf{a}||\mathbf{b}|}$. Sign reading: positive dot = angle under $90°$; zero = PERPENDICULAR; negative = obtuse.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Angle between $(1, 2, 2)$ and $(2, -1, 2)$?</p>
<ol class="steps">
<li>Dot: $2 - 2 + 4 = 4$. Magnitudes: both $\sqrt{9} = 3$.</li>
<li>$\cos\theta = \frac{4}{9}$ → $\theta \approx 63.6°$.</li>
</ol></div>
<div class="wex"><div class="wex-t">Worked example — find the unknown</div>
<p>Find $k$ so that $(k, 3, -1)$ ⟂ $(2, k, 4)$: dot $= 2k + 3k - 4 = 0$ → $k = \frac{4}{5}$.</p>
</div>
<div class="viz" data-viz="vectors"></div>` },

{ h: 'The cross product — perpendiculars & areas', body: L`
<div class="fbox">$\mathbf{a}\times\mathbf{b}$ is a VECTOR ⟂ to both, magnitude $|\mathbf{a}||\mathbf{b}|\sin\theta$ = area of the parallelogram they span (half it for the triangle)</div>
<p>Components — each entry is a little 2×2 determinant, cyclic pattern:</p>
<div class="fbox">$\mathbf{a}\times\mathbf{b} = (a_2b_3 - a_3b_2,\ a_3b_1 - a_1b_3,\ a_1b_2 - a_2b_1)$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$\mathbf{a} = (1, 0, 2)$, $\mathbf{b} = (0, 3, 1)$.</p>
<ol class="steps">
<li>$\mathbf{a}\times\mathbf{b} = (0 \times 1 - 2 \times 3,\ 2 \times 0 - 1 \times 1,\ 1 \times 3 - 0 \times 0) = (-6, -1, 3)$.</li>
<li>Check with a dot product: $(-6, -1, 3)\cdot(1, 0, 2) = -6 + 0 + 6 = 0$ ✓ perpendicular.</li>
<li>Triangle area on $\mathbf{a}, \mathbf{b}$: $\frac{1}{2}\sqrt{36 + 1 + 9} = \frac{1}{2}\sqrt{46}$.</li>
</ol></div>
<div class="warn"><b>Trap:</b> $\mathbf{a}\times\mathbf{b} = -(\mathbf{b}\times\mathbf{a})$ — order flips the sign. And the middle component is the one everyone botches; the GDC computes cross products, so verify there when allowed.</div>` },

{ h: 'Vector equation of a line', body: L`
<div class="fbox">$\mathbf{r} = \mathbf{a} + t\mathbf{b}$ — a point on the line, plus $t$ copies of the direction. $t$ is the dial: each value names a point</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Line through $P(1, 2, 0)$ and $Q(3, 3, 4)$.</p>
<ol class="steps">
<li>Direction: $\vec{PQ} = (2, 1, 4)$.</li>
<li>$\mathbf{r} = (1, 2, 0) + t(2, 1, 4)$. (Using Q as the anchor, or doubling the direction, gives a DIFFERENT-LOOKING but equally correct answer — lines have many outfits.)</li>
</ol></div>
<p>Intersection of two lines: use different parameters ($t$ and $s$), set components equal, solve two equations — then CHECK the third. In 3D, lines that are not parallel and never meet are <b>skew</b>; that third-equation check is what detects them.</p>` },

{ h: 'Vector kinematics', body: L`
<p>Constant-velocity motion is a line with TIME as the parameter:</p>
<div class="fbox">$\mathbf{r}(t) = \mathbf{r}_0 + t\mathbf{v}$ — start position + time × velocity · speed $= |\mathbf{v}|$</div>
<div class="wex"><div class="wex-t">Worked example — closest approach</div>
<p>Ship A: $\mathbf{r}_A = (0, 0) + t(3, 4)$. Ship B: $\mathbf{r}_B = (10, 5) + t(1, 2)$. Minimum distance?</p>
<ol class="steps">
<li>Separation: $\mathbf{d}(t) = \mathbf{r}_B - \mathbf{r}_A = (10 - 2t,\ 5 - 2t)$.</li>
<li>$|\mathbf{d}|^2 = (10-2t)^2 + (5-2t)^2 = 8t^2 - 60t + 125$ — minimise the SQUARE (same minimiser, no square roots).</li>
<li>Vertex at $t = \frac{60}{16} = 3.75$; $|\mathbf{d}|^2 = 12.5$, so min distance $= \sqrt{12.5} \approx 3.54$.</li>
</ol></div>
<div class="tip"><b>Tip:</b> "When are they closest" and "do they collide" are different questions: collision needs SAME position at the SAME $t$. Also, distance-from-origin questions: minimise $|\mathbf{r}(t)|^2$ the same way.</div>` },
],
},
{
id: 'g4', title: 'Markov Chains', syll: 'AI HL 4.19',
why: 'Transition matrices + steady states are examinable and not scheduled this semester.',
sub: 'Transition matrices, powers, and steady states.',
video: { id: 'i3AkTO9HLXo', title: 'Normalized Nerd — Markov chains clearly explained', why: 'States, transition matrices and steady states, built up from scratch.' },
notes: [
{ h: 'States & the transition matrix', body: L`
<p>A Markov chain is a system hopping between <b>states</b> (sunny/rainy, brand A/brand B) where the probability of the next state depends only on the CURRENT one. Store the hop probabilities in a <b>transition matrix</b> $T$: entry in row $i$, column $j$ = P(next state $i$ | current state $j$) — so each COLUMN sums to 1.</p>
<div class="wex"><div class="wex-t">Worked example — build T from a story</div>
<p>If sunny today, 80% sunny tomorrow. If rainy, 60% rainy tomorrow. States (sunny, rainy):</p>
<ol class="steps">
<li>From sunny (column 1): stays sunny 0.8, turns rainy 0.2.</li>
<li>From rainy (column 2): turns sunny 0.4, stays rainy 0.6.</li>
<li>$T$ = <span class="mx"><span>0.8</span><span>0.4</span><span>0.2</span><span>0.6</span></span>. Columns sum to 1 ✓.</li>
</ol></div>
<div class="warn"><b>Trap:</b> some textbooks put the probabilities in ROWS instead (rows sum to 1, and you multiply on the other side). Either works — but mixing conventions mid-question produces nonsense. State yours and stick to it.</div>` },

{ h: 'Stepping forward with matrix powers', body: L`
<p>If $\mathbf{s}_n$ is the probability distribution over states after $n$ steps (a column vector summing to 1):</p>
<div class="fbox">$\mathbf{s}_{n+1} = T\mathbf{s}_n$, so $\mathbf{s}_n = T^n\mathbf{s}_0$ — and $(T^n)_{ij}$ = P(state $i$ after $n$ steps | started in $j$)</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Sunny today. P(rainy in 2 days)?</p>
<ol class="steps">
<li>$\mathbf{s}_0$ = <span class="mx mxv"><span>1</span><span>0</span></span>. Compute $T^2$ on the GDC: <span class="mx"><span>0.72</span><span>0.56</span><span>0.28</span><span>0.44</span></span>.</li>
<li>Answer = row "rainy", column "sunny" of $T^2$: $0.28$.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Sanity check every power: columns must STILL sum to 1. If they do not, the matrix went in transposed.</div>` },

{ h: 'The steady state', body: L`
<p>Run the chain long enough and the distribution settles to a $\mathbf{s}$ with $T\mathbf{s} = \mathbf{s}$ — an <b>eigenvector for $\lambda = 1$</b>, normalised so its entries sum to 1 (every transition matrix has $\lambda = 1$; that is why steady states exist).</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Steady state of the weather chain?</p>
<ol class="steps">
<li>$T\mathbf{s} = \mathbf{s}$ with $\mathbf{s} = (p, 1 - p)$: first row gives $0.8p + 0.4(1 - p) = p$.</li>
<li>$0.4 + 0.4p = p$ → $p = \frac{2}{3}$. Steady state: $(\frac{2}{3}, \frac{1}{3})$ — long-run it is sunny two days in three.</li>
<li>GDC cross-check: raise $T$ to a big power (say $T^{50}$) — every column converges to $(\frac{2}{3}, \frac{1}{3})$ ✓.</li>
</ol></div>
<p>Note what the convergence of ALL columns means: the long-run forecast does not care where the chain started. For a regular chain (some power of $T$ has all entries positive), the steady state is unique and always takes over — a sentence worth writing in conclusions.</p>
<div class="viz" data-viz="markov"></div>` },
],
},
{
id: 'g5', title: 'Estimators, Combinations & CLT', syll: 'AI HL 4.14 · 4.15',
why: 'The theory the 3.7 inference unit stands on — worth learning BEFORE December.',
sub: 'Linear transformations of random variables, unbiased estimates, central limit theorem.',
video: { id: 'YAlJCEDH2uY', title: 'StatQuest — The Central Limit Theorem', why: 'Why normal-based inference is legal on non-normal data.' },
notes: [
{ h: 'Mean & variance under transformations', body: L`
<p>Shift and scale a random variable, and its mean/variance respond differently:</p>
<div class="fbox">$E(aX + b) = aE(X) + b$ &nbsp;·&nbsp; $\text{Var}(aX + b) = a^2\,\text{Var}(X)$ — shifts move the mean but NOT the spread; scales hit variance SQUARED</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Temperatures have mean 20 °C, sd 3 °C. In Fahrenheit ($F = 1.8C + 32$): mean $= 1.8 \times 20 + 32 = 68$; sd $= 1.8 \times 3 = 5.4$ (variance $\times 1.8^2$; the +32 does nothing to spread).</p>
</div>` },

{ h: 'Combining variables — nX is NOT the sum of n copies', body: L`
<div class="fbox">Independent $X, Y$: $E(X \pm Y) = E(X) \pm E(Y)$ · $\text{Var}(X \pm Y) = \text{Var}(X) + \text{Var}(Y)$ — variances ADD even when SUBTRACTING</div>
<p>And the distinction the IB tests every single year:</p>
<div class="fbox">$X_1 + X_2 + \dots + X_n$ (n independent copies): variance $= n\sigma^2$ · $nX$ (one copy, scaled): variance $= n^2\sigma^2$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>An egg weighs N(60, 4²) grams. Compare "a box of 6 eggs" with "6 × one egg's weight".</p>
<ol class="steps">
<li>Box: mean $360$, variance $6 \times 16 = 96$, sd $\approx 9.8$ — real boxes mix heavy and light eggs; wobble partially cancels.</li>
<li>$6X$: mean $360$, variance $36 \times 16 = 576$, sd $= 24$ — one egg's luck amplified six-fold.</li>
<li>Same mean, WILDLY different spread. Read the story: physically separate objects ⇒ sum of copies.</li>
</ol></div>
<p>Linear combinations of independent NORMAL variables are normal — so all of these have full normal machinery available.</p>` },

{ h: 'Unbiased estimators (the n−1 mystery solved)', body: L`
<p>A statistic is an <b>unbiased estimator</b> if its long-run average equals the parameter it estimates. The sample mean $\bar{x}$ is unbiased for $\mu$. But the raw sample variance (dividing by $n$) systematically UNDERSHOOTS $\sigma^2$ — samples cluster around their own mean, not the true one. Dividing by $n - 1$ exactly repairs the bias:</p>
<div class="fbox">$s_{n-1}^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$ — the unbiased estimate; on the GDC it is the "$s$" (not "$\sigma$") output</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Data: 2, 4, 6. $\bar{x} = 4$; squared deviations $4 + 0 + 4 = 8$; unbiased variance $= \frac{8}{2} = 4$ (the biased version would say $\frac{8}{3} \approx 2.7$).</p>
</div>
<div class="tip"><b>Tip:</b> In inference (unit 3.7) you ALWAYS feed the $s_{n-1}$ flavour into t-machinery. When a question says "estimate the population variance from this sample", it wants $n - 1$.</div>` },

{ h: 'The Central Limit Theorem', body: L`
<div class="fbox">For a random sample of size $n$ from ANY distribution with mean $\mu$, sd $\sigma$: $\ \bar{X} \approx N\left(\mu, \frac{\sigma^2}{n}\right)$ for large $n$ (rule of thumb $n \ge 30$)</div>
<p>The parent can be skewed, lumpy, discrete — averaging washes it toward the bell. That is why normal-based inference is legal on decidedly non-normal data, and it is the single most important theorem in applied statistics.</p>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Supermarket receipts: mean 38, sd 20, heavily right-skewed. P(mean of 100 receipts exceeds 42)?</p>
<ol class="steps">
<li>CLT: $\bar{X} \approx N(38, \frac{400}{100})$, sd $= 2$.</li>
<li>$P(\bar{X} &gt; 42) = P(Z &gt; 2) \approx 0.0228$. No normality of receipts needed — $n = 100$ does the heavy lifting.</li>
</ol></div>
<div class="warn"><b>Trap:</b> the CLT is about the SAMPLE MEAN's distribution, not individuals. P(one receipt &gt; 42) is a different (and unanswerable-without-the-distribution) question.</div>
<div class="viz" data-viz="normal"></div>` },
],
},
{
id: 'g6', title: 'Poisson Distribution', syll: 'AI HL 4.17',
why: 'The 3.7 unit tests a Poisson MEAN — the distribution itself never gets a lesson.',
sub: 'Counting rare events: model, formula, properties.',
video: { id: 'jmqZG6roVqU', title: 'jbstatistics — An introduction to the Poisson distribution', why: 'The conditions and the formula, precisely stated.' },
notes: [
{ h: 'The model & the formula', body: L`
<p>$X \sim \text{Po}(m)$ counts events in a fixed window (calls per hour, typos per page, goals per match) under three conditions: events occur <b>singly</b>, <b>independently</b>, and at a <b>constant average rate</b>. Quoting these conditions in context is a standard mark.</p>
<div class="fbox">$P(X = k) = \frac{e^{-m}m^k}{k!}$ &nbsp;·&nbsp; $E(X) = \text{Var}(X) = m$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>A call centre gets 3 calls/minute on average. P(exactly 5 calls in a minute)? P(at most 2)?</p>
<ol class="steps">
<li>$P(X = 5) = \frac{e^{-3}3^5}{5!} = \frac{243e^{-3}}{120} \approx 0.101$.</li>
<li>$P(X \le 2)$: GDC poissoncdf(3, 2) $\approx 0.423$. (Pdf = exactly; cdf = at most — the eternal menu choice.)</li>
</ol></div>
<div class="warn"><b>Trap:</b> "P(X &lt; 3)" means $P(X \le 2)$ for a discrete variable. Off-by-one on the cdf boundary is the most common Poisson error in existence.</div>
<div class="viz" data-viz="poisson"></div>` },

{ h: 'The fingerprint: mean = variance', body: L`
<p>Mean equal to variance is the Poisson signature, and questions use it two ways:</p>
<ul>
<li><b>Justify the model:</b> compute the sample mean and sample variance of count data; if they are close, that SUPPORTS Poisson (say exactly that, with the two numbers).</li>
<li><b>Spot the fraud:</b> variance far above the mean ("overdispersion" — e.g. events arriving in bursts, violating independence) means Poisson is a bad fit.</li>
</ul>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Accidents per week over 40 weeks: sample mean 2.1, sample variance 2.24. Comment: mean ≈ variance, consistent with events occurring singly, independently, at constant rate — Poisson is reasonable.</p>
</div>` },

{ h: 'Scaling & adding rates', body: L`
<div class="fbox">Rates scale with the window: 3/minute ⇒ Po(9) for 3 minutes, Po(1.5) for 30 s · Independent Poissons add: Po(a) + Po(b) ~ Po(a + b)</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Emails arrive at 2/hour, texts at 5/hour, independently. P(more than 3 messages in 30 minutes)?</p>
<ol class="steps">
<li>Combined rate 7/hour → half an hour: $m = 3.5$.</li>
<li>$P(X &gt; 3) = 1 - P(X \le 3) = 1 - \text{poissoncdf}(3.5, 3) \approx 0.463$.</li>
</ol></div>
<div class="tip"><b>Tip:</b> Poisson vs binomial: binomial has a FIXED NUMBER of trials each succeeding or failing; Poisson counts events in continuous time/space with no natural "number of attempts". "Out of 20 seeds, how many germinate" = binomial; "how many meteors per hour" = Poisson.</div>` },
],
},
{
id: 'g7', title: 'Second-Order DEs', syll: 'AI HL 5.18',
why: 'The calendar covers systems — confirm the second-order → coupled conversion gets taught.',
sub: 'Reducing d²x/dt² equations to coupled first-order systems.',
video: { id: 'p_di4Zn4wz4', title: '3Blue1Brown — Differential equations, a tourist\'s guide', why: 'Opens with the pendulum: a second-order equation turned into a system.' },
notes: [
{ h: 'The conversion trick', body: L`
<p>The syllabus does not want a new solving technique — it wants ONE move: turn a second-order equation into a first-order SYSTEM by naming the velocity.</p>
<div class="fbox">Given $\ddot{x} = f(x, \dot{x})$, define $y = \dot{x}$. Then: $\ \dot{x} = y$, $\ \dot{y} = f(x, y)$ — a coupled system, ready for Euler and phase-plane analysis</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>Damped oscillator $\ddot{x} + 2\dot{x} + 5x = 0$.</p>
<ol class="steps">
<li>Set $y = \dot{x}$; rearrange: $\ddot{x} = -5x - 2y$.</li>
<li>System: $\dot{x} = y$, $\ \dot{y} = -5x - 2y$, i.e. matrix <span class="mx"><span>0</span><span>1</span><span>−5</span><span>−2</span></span>.</li>
<li>Eigenvalues: $\lambda^2 + 2\lambda + 5 = 0$ → $\lambda = -1 \pm 2i$. Complex with NEGATIVE real part ⇒ decaying spiral in the phase plane ⇒ the mass oscillates with shrinking swings. Exactly what damping should do — the maths agrees with the physics.</li>
</ol></div>` },

{ h: 'Euler on a second-order equation', body: L`
<p>Once converted, Euler runs exactly as in unit 3.5 — both variables updated from CURRENT values:</p>
<div class="fbox">$x_{n+1} = x_n + h\,y_n$ &nbsp;·&nbsp; $y_{n+1} = y_n + h\,f(x_n, y_n)$</div>
<div class="wex"><div class="wex-t">Worked example</div>
<p>$\ddot{x} = -4x$, $x(0) = 1$, $\dot{x}(0) = 0$, $h = 0.1$. Two steps:</p>
<ol class="steps">
<li>Step 1: $x_1 = 1 + 0.1(0) = 1$; $y_1 = 0 + 0.1(-4 \times 1) = -0.4$.</li>
<li>Step 2: $x_2 = 1 + 0.1(-0.4) = 0.96$; $y_2 = -0.4 + 0.1(-4 \times 1) = -0.8$.</li>
<li>(True solution $x = \cos 2t$ has $x(0.2) \approx 0.921$ — Euler lags but tracks; smaller $h$ closes the gap.)</li>
</ol></div>` },

{ h: 'SHM — the flagship example', body: L`
<div class="fbox">$\ddot{x} = -\omega^2 x$ — solution $x = A\cos(\omega t) + B\sin(\omega t)$, period $\frac{2\pi}{\omega}$; equivalently $R\cos(\omega t - \varphi)$</div>
<p>As a system: $\dot{x} = y$, $\dot{y} = -\omega^2 x$; eigenvalues $\pm i\omega$ (purely imaginary ⇒ closed orbits). Phase-plane trajectories are ELLIPSES: the state $(x, y)$ circulates forever — oscillation with no decay. Add a $-k\dot{x}$ damping term and the real part of the eigenvalues goes negative: the ellipse becomes an inward spiral. This pair of pictures (ellipse vs spiral) is the exam's favourite second-order visual.</p>
<div class="viz" data-viz="phase"></div>` },
],
},
{
id: 'g8', title: 'Logistic & Further Models', syll: 'AI HL 2.9 · 2.10',
why: 'HL modelling menu (logistic, log models, piecewise) not visible on the calendar.',
sub: 'Growth with a ceiling, and the rest of the HL model menu.',
video: { id: 'gxAaO2rsdIs', title: '3Blue1Brown — Simulating an epidemic', why: 'Watch growth run into a ceiling and level off — the logistic S-curve, live.' },
notes: [
{ h: 'The logistic function — growth with a ceiling', body: L`
<div class="fbox">$f(x) = \frac{L}{1 + Ce^{-kx}}$ — S-curve: near-exponential start, then levelling off at the carrying capacity $L$</div>
<p>Anatomy: as $x \to \infty$, $f \to L$ (the ceiling); $f(0) = \frac{L}{1 + C}$ (so $C$ sets the start); $k$ controls steepness; growth is FASTEST at half the ceiling, $f = \frac{L}{2}$ — the inflection point. Populations, epidemics, and product adoption all wear this curve.</p>
<div class="wex"><div class="wex-t">Worked example — fitting from three facts</div>
<p>A rumour spreads through a school of 1000. At $t = 0$, 50 people know; at $t = 2$ days, 200 know. Model it.</p>
<ol class="steps">
<li>Ceiling: $L = 1000$.</li>
<li>$f(0) = 50$: $\ \frac{1000}{1 + C} = 50$ → $C = 19$.</li>
<li>$f(2) = 200$: $\ 1 + 19e^{-2k} = 5$ → $e^{-2k} = \frac{4}{19}$ → $k = \frac{1}{2}\ln\frac{19}{4} \approx 0.779$.</li>
<li>$f(t) = \frac{1000}{1 + 19e^{-0.779t}}$. Fit parameters in that order every time: ceiling → start → one more point.</li>
</ol></div>
<div class="viz" data-viz="logistic"></div>` },

{ h: 'The HL model menu & fingerprints', body: L`
<p>Model-selection questions give data or a description; you name the family. Diagnose by fingerprint:</p>
<ul>
<li><b>Constant differences</b> in $y$ per unit $x$ → linear. Constant SECOND differences → quadratic.</li>
<li><b>Constant ratios</b> (equal % changes) → exponential $ab^x$ or $ae^{kx} + c$ (the $+c$ version has a horizontal asymptote ≠ 0).</li>
<li><b>Straight on log-log</b> → power $ax^n$; <b>straight on semi-log</b> → exponential (unit Jan's whole business).</li>
<li><b>Periodic</b> → sinusoidal. <b>Ceiling / S-shape</b> → logistic. <b>Slowing growth, no ceiling</b> → $a + b\ln x$ (log model, only for $x &gt; 0$).</li>
<li><b>Different regimes</b> (e.g. rates that change at a threshold) → piecewise; check continuity at the joins.</li>
</ul>
<div class="tip"><b>Tip:</b> Two-model questions ("compare an exponential and a logistic fit") want BEHAVIOUR arguments: what does each predict long-run, and which is physically plausible? A population cannot grow unboundedly — that sentence is a mark.</div>` },

{ h: 'Non-linear regression & R²', body: L`
<p>The GDC fits all these families by least squares (this is AI HL 4.13's non-linear regression, adjacent and worth absorbing here). The coefficient of determination $R^2$ measures the fraction of variation the model explains — closer to 1 is tighter, and comparing $R^2$ across candidate models is a legitimate selection argument (mention it alongside a behaviour argument, not instead of one).</p>
<div class="warn"><b>Trap:</b> a high $R^2$ on the DATA RANGE says nothing about extrapolation. An exponential and a logistic can both fit early epidemic data with $R^2 &gt; 0.99$ and then diverge catastrophically. Interpolation: trust; extrapolation: justify with the model's built-in behaviour.</div>` },
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
  { code: '1.9', name: 'Laws of logarithms (AHL)', st: 'y1' },
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
  { code: '2.7', name: 'Composite & inverse functions (AHL)', st: 'y1' },
  { code: '2.8', name: 'Transformations of graphs (AHL)', st: 'y1' },
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
  { code: '4.12', name: 'Reliability & validity of data (AHL)', st: 'y1' },
  { code: '4.13', name: 'Non-linear regression, R² (AHL)', st: 'gap', ref: 'g8' },
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
