# Mathkitty

An IB Mathematics AI HL study companion built around the teacher's actual semester calendar, cross-checked against the official syllabus, with a Gap Zone for examinable topics that are not on the plan. Now with a pixel kitten who cheers when you get questions right and giggles when you get them wrong.

Zero dependencies. Zero internet needed. Zero build steps. Plain HTML + CSS + JS — even the math renderer and the mascot are written from scratch.

## Run it

Double-click `index.html`. That is the whole installation.

For the full PWA experience (installable app + offline cache), serve the folder over localhost once:

```bash
python3 -m http.server 4175
```

then open http://localhost:4175 and install from the browser menu.

## What is inside

- **Mission control** — assessment countdowns, progress stats
- **Units 3.1–3.7 + January** — full structured notes with worked examples, plus practice questions with hidden solutions
- **Gap Zone** — lessons for the 8 syllabus areas missing from the calendar
- **Syllabus map** — every AI HL item vs the calendar, with personal confident/needs-work marks
- **Semester timeline**, **review queue**, **resource hub**, and full-text search (press `/`)

## Design

Vintage Garden palette: sand, mocha, chocolate, espresso, baby pink, blush, dusty rose, mauve, sage, meadow, olive, moss. Light and dark themes both draw only from these swatches.

Progress (XP, streak, flags, syllabus marks) lives in localStorage — private to the browser, no accounts, no tracking.
