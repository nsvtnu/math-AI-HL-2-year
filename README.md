# Mathkitty




## Run it

## What's inside

- **Mission control** — assessment countdowns (Summatives 1–6 + final), progress stats, unit grid.
- **Units 3.1–3.7 + January** — notes + practice questions with hidden answers, full step-by-step solutions, and common-mistake warnings.
- **Gap Zone** — 8 syllabus topics missing from the semester calendar (matrices & eigenvalues, matrix transformations, vectors, Markov chains, estimators & CLT, Poisson, second-order DEs, logistic models).
- **Syllabus map** — every AI HL item vs the calendar
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
