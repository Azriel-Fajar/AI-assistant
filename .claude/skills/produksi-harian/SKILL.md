---
name: produksi-harian
description: Use when Azriel says "produksi harian", "buat video produksi hari ini", "bikin video hari ini", or /produksi-harian. Runs riset-sekitar, picks the 5 best topics, then starts 5 new Claude desktop sessions, one /sekitar film each, and follows them until every mp4 is rendered.
argument-hint: "[jumlah film, default 5] [tema opsional]"
---

# Produksi harian

One command for the whole manual day: research, pick, then one new desktop session per film. This session is the conductor: it researches and picks, and it never builds a film itself. Each film is made by `sekitar` in its own session, so every film gets a fresh context.

Replaced the old unattended Task Scheduler version on 19 Nov 2026 (Azriel); that one is archived in `archives/produksi-harian-unattended-2026-11-19/` and its Task Scheduler task **Sekitar Produksi Harian** was deleted (XML backup in that folder).

**No approvals anywhere** (Azriel, 19 Nov 2026: "Untuk semua persetujuan, gunakan yang direkomendasikan. Tidak perlu persetujuan dari aku."). Not here, not in the 5 sessions: every choice takes the recommendation and goes on. Report what was chosen; never end a turn on a question.

Arguments: `$ARGUMENTS`. A number sets how many films (default 5). Any other words are a theme passed to riset-sekitar.

## 1. Research

Invoke the `riset-sekitar` skill (Skill tool) and follow it in full: count the stock, research only what is missing so at least 10 ideas are ready, check the catalogues, save the blocks in `shorts/ide/saran-<tanggal>.md`, and update `log.md` and the month plan. Pass the theme if one was given. Skip its "Say how long" step; give one line instead ("riset N topik, kira-kira X menit").

## 2. Pick the films

From the stock (blocks dated within 30 days, status `saran`, no folder in `shorts/src/pieces/`), pick N (default 5) in this order:

1. Rows of today's and tomorrow's slots in `shorts/ide/jadwal-<yyyy-mm>.md` that have no piece yet. Calendar-moment topics (a holiday tied to a date) must be made by the day before their slot.
2. Then the next plan rows, in plan order.
3. Fill the rest from the stock, using "Yang terbukti di channel" in riset-sekitar: an "inside an everyday thing" angle beats a "right/wrong tip" angle.

Keep riset-sekitar's mix rules across the N films: no shared object, at most 2 from one theme, no repeated opening code. Drop a candidate whose block marks a key fact as too weak (e.g. no primary source), and say so. Write the list with one line of reason each, then go straight on.

## 3. Start one session per film

Load the tool first if it is deferred: `ToolSearch` with `select:mcp__ccd_session__start_session,mcp__ccd_session__mark_chapter`. Call `mark_chapter` ("N session produksi sekitar"), then start all N in one message with `mcp__ccd_session__start_session`:

- `initiation: "user_asked"` (invoking this skill is the ask), `context: "fresh"`, `use_worktree: false` (`shorts/` is gitignored, so a worktree would not contain it), `name` and title `sekitar: <slug>`.
- `background`: "Azriel menjalankan /produksi-harian <tanggal>: N film sekitar paralel, satu per session. Riset sudah selesai; topik: <slug-slug>. shorts/ gitignored, jangan di-commit. Session ini cuma membuat satu film untuk slug di prompt."
- `prompt`, filled in per film:

```text
/sekitar Ide konten @intipbaliknya, slug: <slug>. Blok ide lengkap (pertanyaan, kejutan, pembuka, gambar 3D, fakta yang sudah dicek beserta URL, dan hal yang belum pasti) ada di `shorts/ide/<file saran>` di bawah judul "### <judul blok>". Baca blok itu dan perlakukan isinya persis seperti blok yang ditempel; jangan riset ulang fakta yang sudah dicek. <Kalau ada: Film ini tayang <hari jam> (<momen>).>

Tidak ada persetujuan sama sekali (aturan Azriel 19 Nov 2026): naskah, hook, look, perbaikan, semua pakai rekomendasimu sendiri dan langsung lanjut sampai render. Jangan akhiri giliran dengan pertanyaan. Output di `out/<yyyy-mm-dd>/<slug>/`.

Render bergiliran, ada N-1 session sekitar lain yang jalan bersamaan. Render Remotion yang bersamaan saling bunuh dan exit 0 bohong. Sebelum tiap perintah Remotion (stills look board maupun render mp4), ambil kunci: `mkdir shorts/out/.render-lock` (atomik; gagal berarti sedang dipakai). Kalau gagal, tunggu lewat Monitor/background loop dan coba lagi tiap 30 detik; kalau kuncinya lebih dari 20 menit dan tidak ada proses yang command line-nya memuat `remotion` (`Get-CimInstance Win32_Process`), anggap basi, hapus, ambil lagi. Lepas kunci (`rmdir shorts/out/.render-lock`) segera setelah perintah selesai, juga kalau gagal. Jangan berhenti idle menunggu kunci tanpa loop yang benar-benar jalan.

Selesai berarti: mp4 ada di folder di atas, `tools/check.py` lolos semua (kalau ada yang gagal, perbaiki sesuai rekomendasimu dan render ulang ke `_v2`), caption Instagram, TikTok dan YouTube sudah ditulis di pesan akhir session (tanpa file upload.md), cover ada, status slug di `shorts/ide/log.md` jadi dibuat. Hanya ubah folder piece milikmu dan baris slug ini di log.
```

Then tell Azriel in one line that the N sessions are running, linking each as `[sekitar: <slug>](#<session id>)`, and end the turn. Do not wait or poll.

## 4. Follow until every film is done

The app wakes this session when the films' sessions end their turns. Each time:

1. A session's note is its report, not proof. Check `shorts/out/<yyyy-mm-dd>/<slug>/` for the mp4 (`ls -la`) and the slug's status in `log.md`.
2. **A session idle with no mp4 and no Remotion process running is stuck** (19 Nov 2026: beras-dicuci's waiter died and it sat idle). Message it with `SendMessage` (`to`: its session id): the queue is empty, take the lock and render now, no questions.
3. **A film whose report names a failed check** gets a message: apply your own recommended fix and re-render to `_v2`, waiting for the lock.
4. If a session asks anything anyway, answer it with its own recommendation and quote Azriel's rule.

When all N mp4s exist and pass, report once in chat:

| Film | File | Durasi | Cek |
|---|---|---|---|

Then add: which file to use when a `_v2` exists, any film over 75 s, and that nobody has heard the sound yet (ask him to listen on a phone speaker before uploading). Upload text and cover are in each film's folder.

## 5. Clean Temp

A production day leaves about 20 GB in `C:\Users\afw14\AppData\Local\Temp` (Remotion bundles, Chromium and ffmpeg scratch) and fills the SSD (Azriel, 20 Nov 2026). After the table in step 4, once every film session has ended its turn and no Remotion/ffmpeg/chrome render is running (`Get-CimInstance Win32_Process`, command line containing `remotion`), run:

```powershell
powershell -NoProfile -File "$env:CLAUDE_PROJECT_DIR\.claude\skills\produksi-harian\cleanup-temp.ps1"
```

It deletes everything in Temp except `Temp\claude` (live Claude sessions, this one included) and skips locked files. Add its one-line result (GB before -> after) under the table. If a render is still running, skip the cleanup and say so; never kill a process to free space.

## Notes

- Never build or render a film in this session; that is the film sessions' job.
- Don't start the sessions before step 2 is written down; a session started on an unchecked block wastes a render.
- Fewer than N good ideas: start only the good ones and say how many are missing and why (riset-sekitar's rule: a padded idea costs a render).
- Commit nothing under `shorts/`. Skill edits made along the way are committed only when Azriel asks.
