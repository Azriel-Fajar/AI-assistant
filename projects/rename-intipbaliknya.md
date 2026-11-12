# Rename: dibaliknya.apa -> intipbaliknya

Plan: Monday 2026-11-09 (after usage reset). Status: code side done 2026-11-09 (Claude). Platform edits + banner uploaded by Azriel 2026-11-09. DONE.

**Why:** current name hard to spell/remember. New name = sign-off "Intip baliknya." Only 49 subs (7 Nov), so the cost of renaming is low now.

**Format:** `intipbaliknya` (no dot). Display name: `Intip Baliknya | Edukasi 3D`.

## 0. Before starting
- [x] Check that `intipbaliknya` is free on YouTube, TikTok and IG. If any one is taken, stop and pick one name for all three.
- [x] Note the old handles and links (for redirects/bios).

## 1. Platforms (manual)
| Platform | Change | Note |
|---|---|---|
| YouTube | Handle + channel name + description + banner if it shows the name | Handle can change 2x per 14 days. The old @ link can stop working |
| TikTok | Username + name + bio | Username can change once every 30 days |
| IG | Username + name + bio | Old username can be taken by someone else, so change it right away |

- [x] Bios: general and informative, no specific video examples (per the bio rule).
- [x] Update any link-in-bio that points to the other platforms.

## 2. Code / skills (Claude does it, ~12 files)
- [x] `.claude/skills/sekitar/engine/src/kit/theme.ts` + `overlay.tsx`: **handle shown on screen in the videos**. Most important.
- [x] `.claude/skills/sekitar/SKILL.md`, `UPLOAD.md`
- [x] `.claude/skills/produksi-harian/SKILL.md` + `headless-context.md`
- [x] `.claude/skills/riset-sekitar/SKILL.md`
- [x] Copies in `~/.claude/skills` (duplicates)
- [x] `tools/google-dibaliknyaapa/`: change only the README/text. Leave the folder name and auth alone, because the token is tied to the Google account, not the handle.
- [x] Memory `project_sekitar_shorts.md` (handle @dibaliknya.apa)
- [x] `decisions/log.md`: append a decision entry, don't edit old entries

## 3. Check
- [x] Render 1 test film: handle on screen = intipbaliknya
- [x] `node ../tools/google-dibaliknyaapa/stats.js` still runs (exit 0)
- [ ] Next day's upload text uses the new name

## 4. Copy for the platforms (2026-11-09)
Banner: `shorts/brand/banner-yt-2560x1440.png` (old one in `shorts/brand/arsip-dibaliknyaapa/`, source `shorts/brand/banner-yt.html`). Profile picture unchanged (`profil-800.png`, no text).

| Field | Text |
|---|---|
| Handle (all) | `intipbaliknya` |
| Name (all) | `Intip Baliknya \| Edukasi 3D` |
| IG bio (≤150) | Cara kerja hal sehari-hari, dijelaskan lewat animasi 3D singkat. / Video baru setiap hari. / Intip baliknya. |
| TikTok bio (≤80) | Cara kerja hal sehari-hari dalam animasi 3D. Intip baliknya. |
| YouTube description | `shorts/brand/deskripsi-youtube.txt`, section Tentang (unchanged) |
