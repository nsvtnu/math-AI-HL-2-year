# 🛰 Orbit — AI HL Semester Companion

An IB Mathematics AI HL study platform built around **your teacher's actual semester calendar**, cross-checked against the official syllabus, with a **Gap Zone** for examinable topics that aren't on the plan.

**Zero dependencies. Zero internet. Zero build steps.** Plain HTML + CSS + JS — even the math renderer is written from scratch (no KaTeX/MathJax).

## Run it

Double-click `index.html`. That's the whole installation.

For the full PWA experience (installable app + service-worker cache), serve the folder over localhost once, e.g.:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`, and use your browser's "Install app" button. After that it works with the network fully off — flights included.

## What's inside

- **Mission control** — assessment countdowns (Summatives 1–6 + final), progress stats, unit grid.
- **Teacher units 3.1–3.7 + January** — notes + practice questions with hidden answers, full step-by-step solutions, and common-mistake warnings.
- **Gap Zone** — 8 syllabus topics missing from the semester calendar (matrices & eigenvalues, matrix transformations, vectors, Markov chains, estimators & CLT, Poisson, second-order DEs, logistic models).
- **Syllabus map** — every AI HL item vs the calendar: scheduled / gap / assumed year 1, with your own confident/needs-work overrides.
- **Semester timeline** — the full calendar with a "you are here" marker.
- **Review queue** — anything you flag 🔖 collects here.
- **Search** (`/` or `Ctrl/Cmd-K`) — notes, questions, syllabus, everything.
- **Progress** — XP, streak, per-unit accuracy. All stored in `localStorage`, never leaves your machine.

## Files

```
index.html            app shell
css/app.css           dark + light themes, responsive layout
js/mtex.js            MiniTeX — self-contained math renderer
js/store.js           localStorage state (progress, flags, XP, streak)
js/quiz.js            question engine + numeric expression checker
js/app.js             router, pages, search, PWA registration
data/units.js         calendar, unit notes, gap lessons, syllabus map
data/bank.js          question bank (70 questions, solutions, mistakes)
sw.js                 offline cache
manifest.webmanifest  PWA manifest
```
