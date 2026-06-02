---
name: quiz-auto
description: Read a Google Drive module PDF and auto-answer the matching Google Form. Invoked per form with a Drive link + Form URL. Headed Chromium, persistent profile, leaves form unsubmitted for human review.
---

# quiz-auto

Per-form workflow. One module PDF, one Google Form, one run.

## Inputs (ask if missing)

1. Google Drive link to module PDF.
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

### 2. Read module

Read cached PDF in `pages: "1-10"` chunks if >10 pages. Extract key terms, acronyms, concepts. Build in-memory answer map.

### 3. Probe form

```bash
node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode probe
```

Walks all pages, force-clicks first option per required question, stops at Submit (never clicks). Output: `cache/probe.json`. Browser closes automatically after probe completes.

**Immediately after**, build answers and proceed to Step 4. No waiting.

### 4. Answer

Filename: `answers_module<N>.json` where `<N>` = module number from PDF filename or Drive link. Ask if ambiguous. Never merge across forms.

Answers from module PDF first. Not in PDF → mark MISS. **Never default-click first option in answer mode** — match or miss only.

Each entry uses `keyword` (substring of question text) + `answer` (exact option text):
```json
[{"keyword": "What does TCP stand for", "answer": "Transmission Control Protocol"}]
```
Do NOT use `heading` as the field name — runner matches via `q.heading.includes(a.keyword)`.

```bash
node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode answer --answers ".claude/skills/quiz-auto/cache/answers_module<N>.json"
```

Expected: `N/M answered`, MISS list, browser left open.

### 5. Resolve MISSes

1. Re-check PDF for question keywords. If found, patch answers file.
2. Web search: `"<question text>" site:quizlet.com OR site:examtopics.com` — match against probe `options[]`.
3. If found, patch and re-run:
   ```bash
   node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode answer --answers ".claude/skills/quiz-auto/cache/answers_module<N>.json"
   ```
4. Ambiguous/no source → log UNRESOLVED. Do not guess.

Report: total answered, unresolved count, browser open. **Do NOT submit.**

### 6. Cleanup

```bash
echo [] > ".claude/skills/quiz-auto/cache/probe.json"
```

## Rules

- ONE runner at a time. Parallel runs crash both (shared `.pw-profile`).
- Email checkbox (`Record <id>@student.uksw.edu...`) auto-ticked each page.
- Watchdog: 20s idle → browser closes, exit code 3.
- First run: sign in to Google when prompted, press Enter. Profile persists.
- Archive: each answer run writes `cache/archive/<moduleN>_<formTitle>_<YYYYMMDD-HHMM>.json`.

## Files

- `run.js` — Playwright runner (`probe` | `answer`)
- `cache/` — module.pdf, answers_module<N>.json, probe.json, archive/
