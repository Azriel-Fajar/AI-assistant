---
name: analisis-mingguan
description: Weekly unattended analysis of the @intipbaliknya YouTube channel. Pulls the channel's own stats and YouTube Analytics, compares title patterns, title length, upload hour and retention, checks last week's rule changes, then applies data-backed changes to the upload-text rules (sekitar UPLOAD.md + upload_check.py) and the topic notes in riset-sekitar, commits and pushes, writes a report and notifies Azriel's phone. Started every Sunday 09:00 by Windows Task Scheduler (run.ps1), or by hand. Use when Azriel says "analisis mingguan", "analisis channel", "cek performa channel minggu ini", or "/analisis-mingguan".
---

# Analisis mingguan

One session, once a week (Sunday 09:00, Azriel 16 Nov 2026). Headless: no CLAUDE.md, no memory, nobody watching. **Never ask a question**; take the default written here and note it in the report. Working directory is `shorts/` (gitignored, never committed); the JARVIS root is `..`.

Started by hand in a normal session, do the same steps from `shorts/`.

## 1. Numbers

One shell call, in `shorts/`:

```
mkdir -p analisis && node ../tools/google-dibaliknyaapa/stats.js > log/yt-<yyyy-mm-dd>.json && python3.13 ../.claude/skills/analisis-mingguan/analisis.py log/yt-<yyyy-mm-dd>.json
```

`stats.js` logs in as the channel's own Google account (read-only scopes: it cannot change videos on YouTube). `analisis.py` prints the week's totals against the stats file from ~7 days earlier, dead videos, a table per video, and medians per title pattern, core-title length and upload hour. If `stats.js` fails, write the report with the error, send the notification with `Title: Analisis gagal`, and stop: no numbers, no changes.

The main measure is **engaged views** (YouTube changed how `views` counts on 27 Aug 2026; engaged views did not change), then **% watched**. Raw views are context only. Groups use videos at least 3 days old with analytics; dead videos (≥2 days, <50 views) are left out of groups and listed on their own, because their problem is distribution, not the title.

Read only the parts of `upload.md` or `script.json` you need (the `slug` column gives the folder), e.g. to compare the hook line of the best and worst films.

## 2. Check last week's changes first

`shorts/analisis/perubahan.md` lists every rule change this skill made (create it with the header below if missing):

```markdown
| tanggal | file | aturan | alasan (angka saat itu) | status |
|---|---|---|---|---|
```

For each row with status `aktif` that is at least 7 days old: compare videos uploaded after the change (≥3 days old) with the group it was meant to beat, using the same measure. Set the status to `terbukti` (kept), `belum cukup data` (fewer than 4 videos under the rule), or `dibatalkan` when videos under the rule have a median engaged views at least 20% lower with n ≥ 5; then undo that rule in the file it changed (an edit, never `git checkout` or `git reset`).

## 3. Decide changes

A change needs **all** of:

- both groups n ≥ 5 (n ≥ 4 only for undoing a rule that `analisis.py` shows failing),
- median engaged views at least 30% apart,
- % watched or like rate pointing the same way,
- no plausible bigger cause in the table (e.g. one topic or one upload day carrying the whole group).

At most **2 changes a week**. No pattern that passes is a normal outcome: change nothing and say so.

**Allowed files** (the only ones this session edits besides `shorts/`):

| File | What may change |
|---|---|
| `../.claude/skills/sekitar/UPLOAD.md` | Title hooks (patterns, length, examples), description order and opener, hashtags, tags box, first comment. Keep the data line in **Title hooks** current with this week's numbers. |
| `../.claude/skills/sekitar/tools/upload_check.py` | Only checks that enforce a rule changed in UPLOAD.md this week, or removing a check for a rule that was undone. |
| `../.claude/skills/riset-sekitar/SKILL.md` | Only the section `## Yang terbukti di channel` (add it at the end of the file if missing): short bullets on which topic kinds, objects and angles do well or badly, each with its numbers and date. Rewrite it each week; keep it under 15 bullets. |
| `../decisions/log.md` | Append one line per change: `[YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: analisis-mingguan` |

Never touch: fact and source rules, the `fakta` or `look` gates, STYLE.md, rubrik.md, the kit, the engine, video length, voice, visuals, the upload schedule, produksi-harian. Ideas in those areas go in the report under **Usulan** for Azriel to decide.

## 4. Apply and verify

1. Before editing, run `git -C .. status --short -- <file>` for each file you will change. A file that already has uncommitted changes is not yours to commit: skip changes to it and say so in the report.
2. Make the edits. Add a row to `analisis/perubahan.md` for each change (status `aktif`, with the numbers).
3. Verify: `python3.13 -m py_compile ../.claude/skills/sekitar/tools/upload_check.py` and run `upload_check.py` on the newest `out/*/*/upload.md`. Exit 0 or 1 is fine (an old file may fail a new rule); a Python traceback is not: fix the edit.
4. Copy each edited skill file to the same path under `~/.claude/skills/` when that copy exists, and check with `diff -q`.
5. Commit and push from the root (Azriel, 16 Nov 2026), staging only the files you changed by name, never `git add -A` or anything in `shorts/`:

```
git -C .. add <files> && git -C .. commit -m "analisis-mingguan <yyyy-mm-dd>: <short summary>" -m "<one line per change, with the numbers>" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git -C .. push origin main
```

If the push fails, leave the commit, and report the error.

## 5. Report and notify

Write `shorts/analisis/<yyyy-mm-dd>.md` in casual Indonesian, short, tables and bullets, no emojis, no em dashes:

- **Minggu ini:** views, subscribers, videos vs last week.
- **Terbaik 3 / terburuk 3** (by engaged views, ≥3 days old) with % watched and retention, and one line each on why, if the table or the hook line shows it.
- **Video mati:** each one, with "cek Studio > Konten > kolom Pembatasan".
- **Pola:** the group tables that matter, in one line each.
- **Evaluasi perubahan lama:** each row checked in step 2.
- **Diterapkan:** each change, before → after, the numbers, the commit hash. Or "Tidak ada perubahan: <why>".
- **Usulan** (not applied): at most 3, for areas outside the allowed files.

Then:

```
curl -s -o /dev/null -H "Title: Analisis mingguan" -d "<views minggu ini, subscriber +n, n perubahan diterapkan>. Buka shorts/analisis/<yyyy-mm-dd>.md" ntfy.sh/JARVIS
```

If a step fails beyond repair, still write the report with the error and send `Title: Analisis gagal` naming the step. A run never ends silently.

## Schedule

Task Scheduler task **Sekitar Analisis Mingguan** runs `run.ps1` (next to this file) every Sunday at 09:00, away from the 15:30 and 20:30 production runs. Same lean headless mode as `produksi-harian` (its `headless-settings.json` and `headless-mcp.json`), with `headless-context.md` from this folder. If `shorts/.produksi.lock` is younger than 3 hours, `run.ps1` waits up to 2 hours for it to clear so the two never edit at once.
