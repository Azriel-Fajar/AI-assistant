---
name: produksi-harian
description: Runs @dibaliknyaapa's daily video production unattended. Picks the day's topic from the month plan, researches it if needed, makes the film with sekitar in automatic mode (AI reviewer gates instead of Azriel's approvals), writes the upload text and a report, researches the next 2 days, and notifies Azriel's phone. Started every day by Windows Task Scheduler (run.ps1), or by hand. Use when Azriel says "produksi harian", "buat video hari ini", "jalankan workflow harian", or "/produksi-harian".
---

# Produksi harian

One run makes one finished film and prepares the next ones. Nobody watches it run: **never ask a question.** When a choice is needed, take the default written here and note it in the report.

Everything happens in `shorts/` at the JARVIS root (gitignored, never committed). Today is the local date (UTC+7). One run at a time: if `shorts/.produksi.lock` exists and is younger than 3 hours, stop; otherwise create it, and delete it at the end even when a step fails.

## 1. Pick the film

Read `shorts/ide/jadwal-<yyyy-mm>.md` (next month's too near the end of a month) and `shorts/ide/log.md`.

- **Target:** the earliest plan row dated today or later whose slug is not `dibuat` in the log. That is today's film, or, when today's is done, the next day's (working ahead), but never more than 3 days ahead. If nothing qualifies, skip to step 4.
- A plan row dated before today and not made is missed: mark it `ditunda` in the log and say so in the report. Don't make old films.
- If the month has no plan, or the plan has under 3 rows left, add the next topics with `riset-sekitar`'s rules before going on.

## 2. Research it if needed

If no `saran-*.md` block in `shorts/ide/` has the slug, follow `riset-sekitar`'s SKILL.md for that one slug: check the facts, write the block, keep the log row. If the facts don't hold, swap in a stock idea of a different theme, update the plan row, and note the swap.

## 3. Make it

Follow `sekitar`'s SKILL.md in **Automatic mode**, with the block as the idea, in the style that SKILL.md names as current. Its three reviewer gates use `sekitar/rubrik.md`. When the film passes `akhir`, set its log status to `dibuat`.

## 4. Prepare the next days

For the next 2 plan rows without a block, run `riset-sekitar` for each slug, so the following runs start from checked facts. Research only; don't script or render ahead.

## 5. Report and notify

Write `shorts/out/<slug>/LAPORAN.md` in casual Indonesian, short:

- Status: **SIAP UPLOAD** (all gates passed) or **PERLU CEK** (which gate, why).
- Final video, cover and `upload.md` paths, then all of `upload.md` pasted in, ready to copy on a phone.
- Gate scores per round, what the reviewer fixed, what is estimated, the weakest moment.
- What Azriel must still check: the sound on a phone speaker, and the captions on the hard words.
- Research done for the next days, swaps, missed days.

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

Task Scheduler task **Sekitar Produksi Harian** runs `run.ps1` (next to this file) daily at 03:00, wakes the PC from sleep, and catches up later if the PC was off. The PC must be asleep or on, not shut down, with Azriel signed in to Windows before it went to sleep (a PC put to sleep from the lock screen after a fresh boot has no session, so nothing runs), and on internet. After a run, `run.ps1` waits 5 minutes for OneDrive to upload, then puts the PC back to sleep only if nobody has touched keyboard or mouse for 15 minutes. If the PC was shut down at 03:00, the run starts a few minutes after his next sign-in. `run.ps1` writes the whole session to `shorts/log/produksi-<date>.log`. To change the time: `Set-ScheduledTask -TaskName 'Sekitar Produksi Harian' -Trigger (New-ScheduledTaskTrigger -Daily -At 04:00)`.
