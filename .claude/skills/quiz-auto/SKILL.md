---
name: quiz-auto
description: Read a Google Drive module PDF and auto-answer the matching Google Form. Invoked per form with a Drive link + Form URL. Headed Chromium, persistent profile, leaves form unsubmitted for human review.
---

# quiz-auto

Per-form workflow. One module PDF, one Google Form, one run.

## Inputs (ask if missing)

1. Google Drive link to module PDF (or confirm PDF already cached).
2. Google Form URL.

## Steps

### 1. Download PDF

Cache dir: `.claude/skills/quiz-auto/cache/`

Extract Drive file ID, then:
```bash
curl -L -o ".claude/skills/quiz-auto/cache/module.pdf" "https://drive.google.com/uc?export=download&id=<ID>"
```

Fallback (restricted/large):
```bash
cd "d:/Main Storage/Documents/JARVIS/tools/google" && node gdrive/index.js download <ID>
```

Verify: file >10KB, starts with `%PDF`. If not, ask user for working link.

### 2. Probe form (ALL pages, browser closes after)

```bash
node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode probe
```

Walks all pages, force-clicks first option per required question to pass validation, stops at Submit (never clicks). Output: `cache/probe.json` with every question + all options. Browser closes automatically.

**Wait for probe to finish before continuing.**

### 3. Build ALL answers before opening browser

Read `cache/probe.json`. For every question in every page:
- Match against module PDF knowledge first.
- If not in PDF, use CompTIA/course knowledge.
- If genuinely unknown, mark MISS (do not guess randomly).

Build the complete `answers_module<N>.json` covering **all questions from all pages** before running answer mode.

Filename: `answers_module<N>.json` where `<N>` = module number from PDF filename or Drive link. Ask if ambiguous. Never merge across forms.

Each entry uses `keyword` (substring of question text) + `answer` (exact option text from probe.json):
```json
[{"keyword": "What does TCP stand for", "answer": "Transmission Control Protocol"}]
```
Do NOT use `heading` as the field name — runner matches via `q.heading.includes(a.keyword)`.

### 4. Answer (one pass, all pages)

Run once with complete answers — should reach Submit with 0 MISSes:

```bash
node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode answer --answers ".claude/skills/quiz-auto/cache/answers_module<N>.json"
```

Expected: `N/N answered`, browser left open at Submit. If MISSes remain, patch answers and re-run — do NOT run page by page.

Also writes study docs:
- `cache/study_module<N>.json` — every question, full text, all options, chosen answer.
- `cache/study_module<N>.md` — same, Markdown, correct option bolded + ✅.

### 5. Resolve MISSes (if any)

1. Re-check probe.json options — ensure answer text matches exactly.
2. Web search: `"<question text>" site:quizlet.com OR site:examtopics.com` — match against probe `options[]`.
3. Patch answers file and re-run answer mode.
4. Genuinely ambiguous → log UNRESOLVED. Do not guess.

Report: total answered, unresolved count, browser open. **Do NOT submit.**

### 6. Cleanup

```bash
echo [] > ".claude/skills/quiz-auto/cache/probe.json"
```

## Rules

- ONE runner at a time. Parallel runs crash both (shared `.pw-profile`).
- Profile location: `<project-root>/.pw-profile` — copy from global `~/.pw-profile` if session missing.
- Always run from JARVIS project dir: `cd "C:/Users/afw14/OneDrive/Documents/JARVIS"` before node commands.
- Email checkbox (`Record <id>@student.uksw.edu...`) auto-ticked each page.
- Watchdog: 20s idle → browser closes, exit code 3.
- Archive: each answer run writes `cache/archive/<formId>_<formTitle>_<YYYYMMDD-HHMM>.json`.

## Files

- `run.js` — Playwright runner (`probe` | `answer`)
- `cache/` — module.pdf, answers_module<N>.json, probe.json, study_module<N>.json, study_module<N>.md, archive/
