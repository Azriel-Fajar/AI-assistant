---
name: produksi-harian
description: Runs @intipbaliknya's daily video production unattended, 5 films a day (one per session) plus one research session a day. Picks the next topic from the month plan, researches it if needed, makes the film with sekitar in automatic mode (AI reviewer gates on facts and look instead of Azriel's approvals), writes the upload text and a report, researches the next topics, and notifies Azriel's phone. Started every day by Windows Task Scheduler (run.ps1), or by hand. Use when Azriel says "produksi harian", "buat video hari ini", "jalankan workflow harian", or "/produksi-harian".
---

# Produksi harian

One session makes one finished film. `run.ps1` makes 5 films a day (again since 10 Nov 2026, Azriel; 3 on 9–10 Nov): 3 in the 15:30 run and 2 in the 20:40 run, each in a fresh context so the last film gets the same care as the first.

**Each film is three sessions** (two since 9 Nov 2026, `laporan` split off 10 Nov 2026): every step re-reads the whole context, and the picture work used to carry 100–150k tokens of research and script (about 12% of a film's usage); then the upload text and report, about 10 light steps, each re-read the 200k-token picture context (about a third of a `gambar` session, 10 Nov 2026). The argument says which slot and which part:

- **`<n>/5 naskah`** does steps 1, 2 and step 3's part A, then writes the handoff (step 3) and ends. It creates no `.done` marker itself (`run.ps1` writes `produksi-<date>-<n>-a.done`), except when the slot ends here (`TARGET none`, or the film stopped on facts or Gemini): then it writes the report (step 6) and creates `shorts/log/produksi-<yyyy-mm-dd>-<n>.done`, so no picture session follows.
- **`<n>/5 gambar`** skips steps 1 and 2: it reads the handoff, does step 3's part B, adds its notes to the handoff and ends. No upload text, no report. It never runs `target.py film` (it would print the same target) and never researches. `run.ps1` writes `produksi-<date>-<n>-b.done`.
- **`<n>/5 laporan`** does step 3's part C (upload text) and step 6 (report, notify, `<n>.done`). It never renders, opens images or reads the picture files.

**Started by hand** (no argument), the session takes the place of the first of today's slots without a `shorts/log/produksi-<yyyy-mm-dd>-<n>.done` marker and acts as film `n/5`, all three parts in one session (no handoff needed; if that slot has a `-b.done` marker, it starts from the handoff as `laporan`, else with a `-a.done` marker as `gambar`). When it ends with the film made, it creates that marker, so `run.ps1` skips the slot (Azriel, 3 Nov 2026: auto or manual, never more than today's films). If all five markers exist, it still makes the film as an extra, writes no marker, and says so in the report.

**One research session a day**, argument `riset`, does steps 4 and 5 only, then its part of step 6. `run.ps1` starts it after the day's last film: in any run once all five films are done (normally the 20:40 run), or in the 20:40 run at the latest. When one of the next 5 films has no idea block (`target.py gaps 5` > 0, e.g. after days the PC was off), it runs **before** the films instead, so the films find their blocks ready (9 Nov 2026: four films researched their own topics in the film context). Research used to run as a small session after every film (5 a day), and each paid the whole starting context again; one batch a day saves that (5 Nov 2026).

**Headless sessions start in `shorts/`.** The JARVIS root is `..` and the skills are in `../.claude/skills/`. They run without CLAUDE.md or memory (see Schedule), so what they need is in this file, in `sekitar`'s and `riset-sekitar`'s SKILL.md, and in `headless-context.md` next to this file.

Nobody watches it run: **never ask a question.** When a choice is needed, take the default written here and note it in the report. Work lean (below).

Everything happens in `shorts/` at the JARVIS root (gitignored, never committed). Today is the local date (UTC+7). One session at a time: if `shorts/.produksi.lock` exists and is younger than 3 hours, stop; otherwise create it, and delete it at the end even when a step fails.

Gemini's free tier allows 10 voice requests a day (reset at midnight Pacific time, 15:00 WIB); a film spends 1–2, so 5 films use at most 10. If Gemini refuses with 429 or a quota message, create `shorts/.stop-run` so `run.ps1` starts no more film sessions today, and say so in the report.

## Work lean

Every step re-reads the whole conversation, and the late steps re-read 200k tokens or more each. The palu-kaca-bus film (3 Nov 2026) took 62 steps; aim for about **35 per film**. Fewer steps come from doing more per step, never from doing less:

- **Parallel calls.** Tools that don't depend on each other go out in one step: read sekitar's SKILL.md, STYLE.md, rubrik.md and one example piece together (UPLOAD.md only at step 7); all web searches together; all source fetches together.
- **Chained commands.** One shell call per job: lock + `target.py film` in one command; typecheck + stills; render + `check.py` + cover.
- **Never read the plan or the log yourself.** `python3.13 ../.claude/skills/produksi-harian/target.py film` prints the target row, its idea block, missed rows, the unmade count, the last 5 hooks and the last 5 YouTube titles. Reading the plan table cost 29k characters that every later step re-read (5 Nov 2026). Edit the plan and log with targeted edits only.
- **Read once.** Read one example piece, not two, and only the parts of kit files you need (`grep -n` first).
- **One edit per round.** Apply all of a reviewer's fixes, or all fixes from one storyboard look, in a single edit, then re-check once.
- **Self-check before each gate** (`sekitar/rubrik.md`), so the first review usually passes.
- **Look at each board once.** Read a stills board yourself once per round, and let the reviewer read the re-made board after fixes; don't open the same board twice in one round. Cut `every=2` boards to `--scale=0.25`.
- **Lean films, rich scenes.** Settings come from `sekitar/engine/src/kit/props.tsx` (5 Nov 2026), so `piece.tsx` stays near 15k characters while every shot has a place; one Write, then edits, never a second full Write.
- **Known commands.** `stills.mjs` takes the project as `.` from `shorts/`. Pick the cover frame from the storyboard before rendering it, not by rendering several.
- **Web research in a subagent.** In a film session, web searches and page fetches never run in your own context: one `general-purpose` Agent (same model, no `model` override) gets the slug, the claims to check and the source rules, and returns only a compact source table (claim, label, URL, verdict). Its 10–20 search results stay out of the 30+ steps that follow. The fakta reviewer stays as `rubrik.md` says.
- **Small outputs.** No single tool output over about 15k characters: `cat` files one or two at a time, `grep -n` or `sed -n` ranges for big ones, `| tail` on noisy commands. When a tool says its output was saved to a file, read only the part you need from it, never the whole file (a session read 65k characters of its own saved output back, 9 Nov 2026).
- **Render in the foreground.** `npx remotion render ... && python3.13 <skill>/tools/check.py ...` in one Bash call with `timeout: 600000`; a 60 s film renders in about 3 min. No background render, no Monitor, no sleep or tail polling (polling cost 8 steps at 210k context on microsleep, 9 Nov 2026).
- **Each image once.** Never Read the same jpg twice; after a fix, look at a new still with a new name.
- **Look before the final render.** The key moments and cover frame pass the look self-check before `remotion render`, so a v2 or v3 render is for a real error found on the review sheets, not for something a still would have shown.

**Quality comes first.** Never skip a source check, a storyboard look, a gate, the one re-review after fixes, or `check.py` to save steps. When the film needs more steps, take them. 35 is a target, not a limit. The report names the step count.

## 1. Pick the film

Run `target.py film` (above).

- **Target:** its `TARGET` row: the earliest plan row dated today or later (tomorrow or later from 12:00) whose slug is not `dibuat` in the log. Films are made ahead of their upload dates, so the stock grows; that is intended. If it prints `TARGET none`, research the next topics (step 4) in this session instead of making a film, and report that.
- Each `MISSED` row is a plan row dated before today and not made: mark it `ditunda` in the log and say so in the report. Don't make old films.
- If the unmade count is under 10 (two days of films), add the next topics with `riset-sekitar`'s rules before going on, starting from the stock ideas in `saran-*.md`. Fill `(kosong)` rows first, then add dates: 5 rows per date, slots 07.00, 10.00, 13.00, 15.00, 19.00 (Azriel, from 6 Nov 2026; 17.00 and 20.00 on 5 Nov; 3 at 12.00, 15.00, 19.00 before 5 Nov), keeping calendar-moment topics on their dates. A row past the month's end goes into next month's `jadwal-<yyyy-mm>.md` (create it with the same header and Pendataan table). Every plan row also gets a Pendataan row with the same date and slot.

## 2. Research it if needed

If `target.py` printed `BLOCK none`, give that one slug to a `general-purpose` Agent (same model): it reads `../.claude/skills/riset-sekitar/SKILL.md` itself, checks the facts, appends the block to today's `ide/saran-<yyyy-mm-dd>.md` and returns only the block. Don't read riset-sekitar's SKILL.md in the film session. Keep the log row. If the facts don't hold, swap in a stock idea of a different theme, update the plan row, and note the swap.

## 3. Make it

Follow `sekitar`'s SKILL.md in **Automatic mode**, with the block as the idea, in the style that SKILL.md names as current. Its two reviewer gates (`fakta`, `look`) and the self-checks use `sekitar/rubrik.md`. When the film is finished and `check.py` passes, set its log status to `dibuat`.

Read only the parts of sekitar's SKILL.md each part uses (`S=../.claude/skills/sekitar`):

- **Part A (`naskah`): sekitar steps 1–3.** Angle and facts, script, self-check, gate `fakta`, voice. Read `awk '/^## Related skills/{s=1} /^## Non-negotiables/{s=0} /^### 4\. Look/{exit} !s' $S/SKILL.md` and `$S/rubrik.md`; not STYLE.md, the example or the kit. Then write `src/pieces/<slug>/HANDOFF.md`, short: slug, upload slot, the idea block's `Gambar 3D` line, the 3 hook options with the pick and why, gate `fakta` scores and fixes per round, voice takes and best `match`, what is estimated, swaps and missed rows, scene ideas for the picture (place, props, the signature shot), and the steps this session used. Also write the slug alone into `log/produksi-<yyyy-mm-dd>-<n>.handoff`. Then end.
- **Part B (`gambar`): sekitar steps 4–7.** Read the slug from `log/produksi-<yyyy-mm-dd>-<n>.handoff`, then in one step: `HANDOFF.md`, `script.json`, `sources.md`, `awk '/^## Related skills/{s=1} /^\*\*Captions stay on/{s=0} /^### 1\. Angle/{s=1} /^### 4\. Look/{s=0} /^### 8\. Learn/{s=1} !s' $S/SKILL.md`, STYLE.md, rubrik.md and one example piece. `timing.json` and the voice already exist: never run `voice.py` again except with `--reuse`. Piece, sound, storyboard, gate `look`, render, check, the review sheets, the cover (sekitar step 7's first bullet), then set the log status to `dibuat` with one targeted edit. Then append a `## Gambar` part to `HANDOFF.md`, short: final video and cover paths, the `check.py` table, gate `look` scores and fixes per round, the weakest moment, what the picture simplifies (the upload text notes it), the hard caption words, anything else Azriel must check, and the steps this session used. A `gambar` session that can't finish writes the error and the failed step there instead (no `dibuat`), so the report still goes out. Then end.
- **Part C (`laporan`): sekitar step 7's upload text, then step 6.** Read the slug from `log/produksi-<yyyy-mm-dd>-<n>.handoff`, then in one step: `HANDOFF.md`, `script.json`, `$S/UPLOAD.md`, `$S/examples/keran/upload.md` and `target.py film`, used only for the last 5 hooks and YouTube titles (ignore its `TARGET` and `MISSED` lines; part A handled them). Not STYLE.md, rubrik.md, sekitar's SKILL.md, `piece.tsx` or any image. Write `upload.md` once, `upload_check.py` must pass, then step 6. When `HANDOFF.md` holds a `gambar` error, skip the upload text and report **PERLU CEK** with that error.

## 4. Prepare the next days

Research session only. Done the way the original author does it (Azriel, 5 Nov 2026): gather 10, research only the best.

1. `target.py riset 10` prints the candidates: the next 10 plan rows without an idea block.
2. **Screen all 10 cheaply, with no web search.** Check each against the catalogues in `shorts/ide/katalog/` (every account in `shorts/ide/akun-referensi.md`; match the object and the question with word boundaries; refresh a catalogue only when its file is over a day old, as `riset-sekitar` says), against `riset-sekitar`'s rules 6 (Sering) and 7 (Berguna), and on whether the surprise is likely to hold and be sourceable. Score each 1–10 with a one-line reason.
3. **The best 6** (5 films and 1 spare) get `riset-sekitar`'s full fact check and a block. They take the earliest of the 10 slots; the other 4 move to the later slots, stay `baru`, and are candidates again tomorrow. Calendar-moment topics stay on their dates. After moving rows, check the plan header's opening-shape and theme-spacing rules, and move the matching Pendataan rows too.
4. A candidate that fails the screen or the fact check is logged `ditolak` with the reason, and a stock idea from `saran-*.md` or a later `baru` row of a different theme takes its slot, as `riset-sekitar` says.

Research only; don't script or render ahead.

## 5. Read the numbers

Research session only (not in a film session: it cost a film session steps, 4 Nov 2026). `node ../tools/google-dibaliknyaapa/stats.js` prints every YouTube video of the channel (logged in as the channel's own Google account, not `tools/google`'s) with views, likes and comments. Save the output as `shorts/log/yt-<yyyy-mm-dd>.json`. Match each video to its slug by the YouTube title in `shorts/out/<yyyy-mm-dd>/<slug>/upload.md` (spacing may differ), then in the plan's **Pendataan** table:

- **Jam:** the real upload time in WIB, when the cell is `?` or differs.
- **Views 24 jam:** once the video is 24 hours old and the YT part is empty, fill it with the current views and the age, e.g. `– / – / 2.089 (28j)`. **Views 7 hari:** the same once it is 7 days old. Never overwrite a filled number. TikTok and IG stay `–` until their APIs are set up.

Put a short **Statistik YouTube** part in the research report (step 6): subscribers, and per video its age, views, likes and comments, best first. Where `analytics` is filled (YouTube Analytics lags 2-3 days, so new videos show `null`), add average % watched, engaged views and the retention points, and name the steepest drop. If `stats.js` fails, note the error and go on; numbers never stop a session.

## 6. Report and notify

**Film session** (part C, or part A when the slot ended there). First move the film's folder into today's day folder: `shorts/out/<slug>/` becomes `shorts/out/<yyyy-mm-dd>/<slug>/` (create the day folder if missing), so Azriel can tell which films were made on which day (Azriel, 4 Nov 2026). The date is the day the session runs, not the upload date. All paths below, and in the report, use the new place.

Write `shorts/out/<yyyy-mm-dd>/<slug>/LAPORAN.md` in casual Indonesian, short:

- Status: **SIAP UPLOAD** (both gates passed and the film self-check is clean) or **PERLU CEK** (which gate or check, why).
- The upload slot from the plan's **Pendataan** table ("Upload Sel 3 Nov jam 19.00"), so he can schedule it on all three platforms in the morning.
- Final video, cover and `upload.md` paths, then all of `upload.md` pasted in, ready to copy on a phone.
- Gate scores per round, what the reviewer fixed, which hook was picked and why, what is estimated, the weakest moment.
- Steps used for the film: part A's and part B's counts from `HANDOFF.md` plus your own tool-call turns, against the target of about 35. Count from memory; never read a transcript or log to count.
- What Azriel must still check: the sound on a phone speaker, and the captions on the hard words.
- Swaps and missed days.

Add a row to `shorts/out/HARIAN.md` (create it with the header if missing):

```markdown
| tanggal | slug | status | video | catatan |
|---|---|---|---|---|
```

Then notify his phone:

```bash
curl -s -o /dev/null -H "Title: Video <dd MMM> <SIAP UPLOAD|PERLU CEK>" -d "<judul>. Buka shorts/out/<yyyy-mm-dd>/<slug>/LAPORAN.md." ntfy.sh/JARVIS
```

**Research session.** Write `shorts/out/<yyyy-mm-dd>/RISET.md` in casual Indonesian, short: the 10 candidates with their screen scores and reasons, the 6 checked, rows moved, swaps, overlaps found, and **Statistik YouTube**. Add a row to `HARIAN.md` with slug `riset`, status `RISET` and the file's path in the video column. It sends no notification unless it fails (`Title: Riset gagal`, naming the step).

If a step fails beyond repair, still write the report with the error and send `Title: Produksi gagal` naming the step. A run never ends silently.

## Schedule

Task Scheduler task **Sekitar Produksi Harian** runs `run.ps1` (next to this file) daily at 15:30, half an hour after the 15:00 Gemini reset (Azriel, 10 Nov 2026: at 03:00 he often didn't wake in time to upload; now the films are ready the evening before, so he schedules the next morning's uploads at night), and at 20:40. The 15:30 run makes **three films** (each a `naskah`, a `gambar` and a `laporan` session; a run that starts before 20:00 makes three), the 20:40 run the remaining **two** and then the day's **research session**. So the 5 films spread over 2 separate 5-hour Claude usage windows (10 Nov 2026: 3 films used up one window). From 12:00 on, `target.py` targets tomorrow's plan rows, so an afternoon film is for tomorrow's slots.

It runs them in **lean mode** from `shorts/` as the working directory: project settings only (`shorts/` has none), so no user plugins, hooks or MCP servers; CLAUDE.md files off (`CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`); auto-memory, bundled skills and most of the skill listing off (`headless-settings.json`, `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS=1`); `headless-context.md` appended to the system prompt as the only standing context. That cut the starting context from about 50k to 33k tokens on every step (tested 5 Nov 2026). The prompt tells the session to read this file, because `shorts/` has no skills of its own. `--bare` would cut more but only works with an API key, not the Claude subscription. Opus and effort high are pinned in `headless-settings.json` (Azriel kept high on 5 Nov 2026).

It skips any session with a `shorts/log/produksi-<date>-<n>.done` (or `produksi-<date>-riset.done`) marker, and a film whose `<n>-b.done` exists starts at `laporan`, one whose `<n>-a.done` exists at `gambar` (both also after `.stop-run`, since the voice is already made), including a film slot already taken by a session started by hand. It stops starting films if a session exits with an error or leaves `shorts/.stop-run` (kept until the next 15:00 Gemini reset); `.stop-run` doesn't stop the research session, which needs no Gemini. A session that hits Claude's 5-hour usage limit (on 3 Nov one film used up the whole 03:00 window) gets its stale lock removed and a `Produksi tertunda` notification. The 20:40 run then resumes it in a fresh window (a slot still unfinished after 20:40 is skipped; the next day's run goes on to the next day's rows). Both runs share the window with Azriel's own Claude use that day. It wakes the PC from sleep, and catches up later if the PC was off. The PC must be asleep or on, not shut down, with Azriel signed in to Windows before it went to sleep (a PC put to sleep from the lock screen after a fresh boot has no session, so nothing runs), and on internet. After a run, `run.ps1` waits 5 minutes for OneDrive to upload, then puts the PC back to sleep only if nobody has touched keyboard or mouse for 15 minutes. If the PC was shut down at 15:30, the run starts a few minutes after his next sign-in. `run.ps1` writes each session to `shorts/log/produksi-<date>-<n>.log`. To change the times: `Set-ScheduledTask -TaskName 'Sekitar Produksi Harian' -Trigger (New-ScheduledTaskTrigger -Daily -At 15:30), (New-ScheduledTaskTrigger -Daily -At 20:40)` (check the task isn't Running first: changing a running task kills it).
