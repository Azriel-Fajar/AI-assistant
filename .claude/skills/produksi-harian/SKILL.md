---
name: produksi-harian
description: Runs @dibaliknyaapa's daily video production unattended, 3 films a day (one per session). Picks the next topic from the month plan, researches it if needed, makes the film with sekitar in automatic mode (AI reviewer gates instead of Azriel's approvals), writes the upload text and a report, researches the next 2 topics, and notifies Azriel's phone. Started every day by Windows Task Scheduler (run.ps1), or by hand. Use when Azriel says "produksi harian", "buat video hari ini", "jalankan workflow harian", or "/produksi-harian".
---

# Produksi harian

One session makes one finished film. `run.ps1` makes 3 films a day (since 2 Nov 2026), one per run at 03:00, 08:10 and 13:20, each in a fresh context so the third film gets the same care as the first. The argument says which one this is (`1/3`, `2/3`, `3/3`). A film session does steps 1–3 and 6, nothing else.

**Started by hand** (no argument), the session takes the place of the first of today's slots without a `shorts/log/produksi-<yyyy-mm-dd>-<n>.done` marker and acts as film `n/3`. When it ends with the film made, it creates that marker, so `run.ps1` skips the slot and runs only its `riset n/3` (Azriel, 3 Nov 2026: auto or manual, never 4 films a day). If all three markers exist, it still makes the film as an extra, writes no marker, and says so in the report.

After each film `run.ps1` starts a **research session** with the argument `riset 1/3` (or `2/3`, `3/3`). It does steps 4 and 5 only, in a fresh small context, then adds its part to the report (step 6). Research used to run at the end of the film session, on top of a context of nearly 300k tokens that every step re-read, so the split saves Claude usage (3 Nov 2026).

Nobody watches it run: **never ask a question.** When a choice is needed, take the default written here and note it in the report. Work lean (below).

Everything happens in `shorts/` at the JARVIS root (gitignored, never committed). Today is the local date (UTC+7). One session at a time: if `shorts/.produksi.lock` exists and is younger than 3 hours, stop; otherwise create it, and delete it at the end even when a step fails.

Gemini's free tier allows 10 voice requests a day (reset at midnight Pacific time, 15:00 WIB); a film spends 1–3. If Gemini refuses with 429 or a quota message, create `shorts/.stop-run` so `run.ps1` starts no more sessions today, and say so in the report.

## Work lean

Every step re-reads the whole conversation, and the late steps re-read nearly 300k tokens each. The palu-kaca-bus film (3 Nov 2026) took 62 steps; aim for about **40 per film**. Fewer steps come from doing more per step, never from doing less:

- **Parallel calls.** Tools that don't depend on each other go out in one step: read SKILL.md, STYLE.md, rubrik.md and one example piece together; all web searches together; all source fetches together.
- **Chained commands.** One shell call per job: lock + plan + log + idea block + last 5 hooks in one command; typecheck + stills; render + `check.py` + cover.
- **Read once.** Read the plan rows for this film once, not in slices. Read one example piece, not two, and only the parts of kit files you need (`grep -n` first).
- **One edit per round.** Apply all of a reviewer's fixes, or all fixes from one storyboard look, in a single edit, then re-check once.
- **Self-check before each gate** (`sekitar/rubrik.md`), so the first review usually passes.
- **Known commands.** `stills.mjs` takes the project as `.` from `shorts/`. Pick the cover frame from the storyboard before rendering it, not by rendering several.

**Quality comes first.** Never skip a source check, a storyboard look, a gate, a re-review after fixes, or `check.py` to save steps. When the film needs more steps, take them. 40 is a target, not a limit. The report names the step count.

## 1. Pick the film

Read `shorts/ide/jadwal-<yyyy-mm>.md` for this month and next month (when it exists) and `shorts/ide/log.md`.

- **Target:** the earliest plan row dated today or later whose slug is not `dibuat` in the log. Films are made ahead of their upload dates, so the stock grows; that is intended. If nothing qualifies, skip to step 4.
- A plan row dated before today and not made is missed: mark it `ditunda` in the log and say so in the report. Don't make old films.
- If the plans have under 6 unmade rows left (two days of films), add the next topics with `riset-sekitar`'s rules before going on, starting from the stock ideas in `saran-*.md`. Fill `(kosong)` rows first, then add dates: 3 rows per date, slots 12.00, 15.00, 19.00 (Azriel, 2 Nov 2026), keeping calendar-moment topics on their dates. A row past the month's end goes into next month's `jadwal-<yyyy-mm>.md` (create it with the same header and Pendataan table). Every plan row also gets a Pendataan row with the same date and slot.

## 2. Research it if needed

If no `saran-*.md` block in `shorts/ide/` has the slug, follow `riset-sekitar`'s SKILL.md for that one slug: check the facts, write the block, keep the log row. If the facts don't hold, swap in a stock idea of a different theme, update the plan row, and note the swap.

## 3. Make it

Follow `sekitar`'s SKILL.md in **Automatic mode**, with the block as the idea, in the style that SKILL.md names as current. Its three reviewer gates use `sekitar/rubrik.md`. When the film passes `akhir`, set its log status to `dibuat`.

## 4. Prepare the next days

Research session only. For the next 2 plan rows without a block, run `riset-sekitar` for each slug (6 a day against 3 films, so the plan's unchecked `baru` rows get checked well before their day). Its overlap check covers every account in `shorts/ide/akun-referensi.md`. Research only; don't script or render ahead.

## 5. Read the numbers

Only in research session `riset 1/3`, or when started by hand. `node tools/google-dibaliknyaapa/stats.js` prints every YouTube video of the channel (logged in as the channel's own Google account, not `tools/google`'s) with views, likes and comments. Save the output as `shorts/log/yt-<yyyy-mm-dd>.json`. Match each video to its slug by the YouTube title in `shorts/out/<slug>/upload.md` (spacing may differ), then in the plan's **Pendataan** table:

- **Jam:** the real upload time in WIB, when the cell is `?` or differs.
- **Views 24 jam:** once the video is 24 hours old and the YT part is empty, fill it with the current views and the age, e.g. `– / – / 2.089 (28j)`. **Views 7 hari:** the same once it is 7 days old. Never overwrite a filled number. TikTok and IG stay `–` until their APIs are set up.

Put a short **Statistik YouTube** part in the film's report (step 6): subscribers, and per video its age, views, likes and comments, best first. Where `analytics` is filled (YouTube Analytics lags 2-3 days, so new videos show `null`), add average % watched, engaged views and the retention points, and name the steepest drop. If `stats.js` fails, note the error and go on; numbers never stop a film.

## 6. Report and notify

Write `shorts/out/<slug>/LAPORAN.md` in casual Indonesian, short:

- Status: **SIAP UPLOAD** (all gates passed) or **PERLU CEK** (which gate, why).
- The upload slot from the plan's **Pendataan** table ("Upload Sel 3 Nov jam 19.00"), so he can schedule it on all three platforms in the morning.
- Final video, cover and `upload.md` paths, then all of `upload.md` pasted in, ready to copy on a phone.
- Gate scores per round, what the reviewer fixed, what is estimated, the weakest moment.
- Steps used for the film (count your tool-call turns), against the target of about 40.
- What Azriel must still check: the sound on a phone speaker, and the captions on the hard words.
- Swaps and missed days.

The research session doesn't write a new report. For `riset n/3`, it finds the n-th row dated today in `shorts/out/HARIAN.md`. That row is the film made by session `n/3`. It then adds a **Riset hari berikutnya** part to that film's `LAPORAN.md`: the slugs it checked, swaps, and overlaps it found. Session `riset 1/3` also adds **Statistik YouTube**. If that row doesn't exist, it writes `shorts/out/riset-<yyyy-mm-dd>.md` instead. It sends no notification unless it fails (`Title: Riset gagal`, naming the step).

Add a row to `shorts/out/HARIAN.md` (create it with the header if missing):

```markdown
| tanggal | slug | status | video | catatan |
|---|---|---|---|---|
```

Then notify his phone:

```bash
curl -s -o /dev/null -H "Title: Video <dd MMM> <SIAP UPLOAD|PERLU CEK>" -d "<judul>. Buka shorts/out/<slug>/LAPORAN.md." ntfy.sh/JARVIS
```

If a step fails beyond repair, still write the report with the error and send `Title: Produksi gagal` naming the step. A run never ends silently.

## Schedule

Task Scheduler task **Sekitar Produksi Harian** runs `run.ps1` (next to this file) daily at 03:00, 08:10 and 13:20. Each run makes **one film**: the next film `n/3` of today, then its `riset n/3`. So the 3 films land in 3 separate 5-hour Claude usage windows (Azriel, 3 Nov 2026). It runs them in lean mode, with project settings only. That means no user plugins, hooks or MCP servers, which saves about 13k tokens on every step; Opus and effort high are pinned in `headless-settings.json`. It skips any session with a `shorts/log/produksi-<date>-<n>.done` (or `<n>-riset.done`) marker, including a film slot already taken by a session started by hand, and stops early if a session exits with an error or leaves `shorts/.stop-run` (kept until the next 15:00 Gemini reset). A session that hits Claude's 5-hour usage limit (on 3 Nov one film used up the whole 03:00 window) gets its stale lock removed and a `Produksi tertunda` notification. The 08:10 or 13:20 run then resumes it in a fresh window. Those two runs share the window with Azriel's own Claude use that day. It wakes the PC from sleep, and catches up later if the PC was off. The PC must be asleep or on, not shut down, with Azriel signed in to Windows before it went to sleep (a PC put to sleep from the lock screen after a fresh boot has no session, so nothing runs), and on internet. After a run, `run.ps1` waits 5 minutes for OneDrive to upload, then puts the PC back to sleep only if nobody has touched keyboard or mouse for 15 minutes. If the PC was shut down at 03:00, the run starts a few minutes after his next sign-in. `run.ps1` writes each session to `shorts/log/produksi-<date>-<n>.log`. To change the time: `Set-ScheduledTask -TaskName 'Sekitar Produksi Harian' -Trigger (New-ScheduledTaskTrigger -Daily -At 04:00)`.
