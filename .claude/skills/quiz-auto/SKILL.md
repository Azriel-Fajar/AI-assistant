---
name: quiz-auto
description: Read a Google Drive module PDF and auto-answer the matching Google Form. Invoked per form with a Drive link + Form URL. Headed Chromium, persistent profile, leaves form unsubmitted for human review.
---

# quiz-auto

Per-form workflow. One module PDF, one Google Form, one run.

## Inputs (ask user if missing)

1. Google Drive link to the module PDF (file or folder share link).
2. Google Form URL.

## Steps

### 1. Resolve + download module PDF

Cache dir: `.claude/skills/quiz-auto/cache/`.

Extract Drive file ID from the link:
- `drive.google.com/file/d/<ID>/...` → `<ID>`
- `drive.google.com/open?id=<ID>` → `<ID>`
- folder `/folders/<ID>` → list folder via gdrive CLI, ask user which file if multiple

Download with `curl` (works for "anyone with link" shares):
```bash
curl -L -o ".claude/skills/quiz-auto/cache/module.pdf" "https://drive.google.com/uc?export=download&id=<ID>"
```

If file is restricted or returns HTML (Google virus-scan interstitial for large files), fall back to `tools/google/gdrive/index.js`:
```bash
cd "d:/Main Storage/Documents/JARVIS/tools/google" && npm install   # one-time, if commander missing
node gdrive/index.js download <ID>
```

Verify PDF: file >10KB and starts with `%PDF`. If not, re-prompt user for a working link.

### 2. Read module

Use the Read tool on the cached PDF. If >10 pages, read in `pages: "1-10"` chunks. Extract:
- Key terms + definitions
- Acronyms + expansions
- Concepts likely to be quiz targets

Build an in-memory answer map. Format mirrors `scripts/playwright/gform-answer-all.js`:
```js
const ANSWERS = [
  { keyword: '<substring of question heading>', answer: '<exact option text>' },
  ...
];
```

### 3. Probe the form

Run the probe to enumerate questions + options across ALL pages in one pass. Probe force-clicks the first option per required question (verifying `aria-checked`) so every page passes validation and Next advances — it walks the entire multi-page form, then stops at Submit (never clicks it):
```bash
node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode probe
```

Output is JSON: `[{heading, options[]}]`. Browser stays open after probe -- use it to browse reference material if needed. Cross-reference each question against the module knowledge to fill the answer map. For ambiguous questions, log uncertainty and skip — do not guess.

**Immediately after probe finishes**, without waiting for user input, build answers and proceed to Step 4.

### 4. Answer

**Per-form file only.** Never use a shared master answers.json. Filename: `answers_<formId>.json` where `<formId>` = first 24 chars of the `/forms/d/(e/)?<ID>` path. Each form gets its own file; never merge answers across forms.

Answers grounded in THIS form's module PDF first. If a question is not covered by the PDF, mark as MISS — Step 5 will resolve via web search. **Never click first option as a default in answer mode.** Probe mode is the only mode that clicks first option (to satisfy validation and advance pages); answer mode must match-or-miss.

Form Qs randomize per session, but matching is by question heading (not position), so probe.json from one session maps correctly onto the next. Build the full answer map from the single probe dump, then run answer mode once.

```json
[{"keyword": "...", "answer": "..."}]
```

Run:
```bash
node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode answer --answers ".claude/skills/quiz-auto/cache/answers_<formId>.json"
```

Expected: `N/M answered`, MISS list (if any), browser left open.

### 5. Resolve MISSes via web search

For each MISS question output by answer mode:

1. **Re-check module PDF first** — search for keywords from the question heading. If found, patch `answers.json` directly.
2. **If still not found**, web-search for the answer:
   - Query: `"<exact question heading text>" site:quizlet.com OR site:examtopics.com OR site:certmaster.com CompTIA`
   - Fall back to: `CompTIA Network+ N10-009 "<key phrase from question>" answer`
   - Read the top result(s) and extract the correct answer.
   - Cross-reference the answer against the available `options[]` from probe — pick the option that matches.
   - If web search finds a clear answer, add it to `answers.json`.
   - If ambiguous or no credible source, log as UNRESOLVED — do not guess.
3. After patching `answers.json`, re-run answer mode immediately (same browser session must still be open):
   ```bash
   node ".claude/skills/quiz-auto/run.js" --form-url "<URL>" --mode answer --answers ".claude/skills/quiz-auto/cache/answers_<formId>.json"
   ```
4. Report to user: total answered, any remaining unresolved, browser open for review.
- **Do NOT submit.** User submits manually after visual review.

### 6. Cleanup

After answering is complete (all MISSes resolved or accepted), clear probe.json:
```bash
echo [] > ".claude/skills/quiz-auto/cache/probe.json"
```

## Grouped output by page

Probe writes `cache/probe.json` with questions grouped by form page (blank line between groups, valid JSON).
Answer mode rewrites `answers.json` after run — entries reordered to match page traversal, 5/page (or whatever the form has), blank line between page groups. Orphan entries (no matching question) bucketed at the end. Makes review/diff per-page trivial.

## Per-form archive

Each answer run writes a permanent record to `cache/archive/<formId>_<formTitle>_<YYYYMMDD-HHMM>.json` containing: form URL, label (auto-derived from form title), run timestamp, answered/total, miss list, `questionsByPage`, `answersByPage`. Label sourced from form heading or `<title>` (Google Forms suffix stripped), sanitized to filename-safe chars. Browse `cache/archive/` later to see every form done.

## Email checkbox

Forms with "Record <id>@student.uksw.edu as the email to be included with my response" auto-ticked each page. No config needed.

## Watchdog

Runner has 20s idle watchdog. No progress (no new question, no answer click, no Next nav) for 20s → browser auto-closes, exit code 3, prints state dump: page #, answers placed, current URL. Use for troubleshooting (selector drift, modal, hung nav). After answering each page, runner clicks Next explicitly and logs `Clicking Next → page N+1`. Stops at Submit button (never clicks).

Probe walks all pages in one pass: it force-clicks the first option on every required question and verifies `aria-checked` before advancing (fixes an old click→state race that stalled probe on page 1). So one probe = full multi-page dump; expect ~2 runs total per form (probe + answer), not one run per page.

## Concurrency

ONE runner at a time. All runs share a single `.pw-profile` — launching a second run while one is open crashes both ("browser has been closed"). Never fire parallel runs; wait for one to finish before the next.

## Account session

First run: if `.pw-profile/Default/Cookies` missing, runner prints "Sign in to Google in the open window, then press Enter" and waits. Profile persists.

## Files

- `run.js` — Playwright runner, modes: `probe` | `answer`
- `cache/` — module.pdf + answers.json per run (overwritten each run; archive manually if needed)
