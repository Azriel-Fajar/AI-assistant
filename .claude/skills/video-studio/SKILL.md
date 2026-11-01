---
name: video-studio
description: Use when Azriel sends footage, photos, or audio to edit into a social video (Instagram Reels, TikTok, YouTube, Shorts), or says "edit video", "bikin reel", "potong silence", "tambah caption/SFX". Entry point to the Herk Edit Kit + HyperFrames setup in video-studio/; routes to edit-video, short-form-edit, cut-silences, cut-mistakes, motion-showreel, make-a-video, website-to-hyperframes.
---

# Video Studio (Herk Edit Kit + HyperFrames)

Kit skills live in `.claude/skills/` (cut-mistakes, cut-silences, edit-video, gsap,
hyperframes, hyperframes-cli, hyperframes-registry, hyperframes-video-beats,
make-a-video, motion-showreel, short-form-edit, style-library, video-storytelling,
website-to-hyperframes). Their support files live in `video-studio/`.
Source: github.com/nateherkai/herk-edit-kit, commit in `video-studio/.kit-version`.

A finished `sekitar` render (`shorts/out/<slug>/<slug>.mp4`) is edited here like any footage. Don't re-caption it: it already has captions.

## Path rules (the kit assumed one repo root; JARVIS splits it)

- Kit root = `video-studio/`. Run every kit command from there (or from a project inside it).
- Kit text `node .claude/skills/<skill>/scripts/x.mjs` → from kit root run `node ../.claude/skills/<skill>/scripts/x.mjs`.
- `scripts/`, `style-library/`, `style-templates/`, `docs/`, `MOTION_PHILOSOPHY.md`, `video-projects/` resolve from kit root.
- `../<skill>/SKILL.md` references between skills work as written.

## Transcription: local only, free

Never default to ElevenLabs (paid, no key). Use faster-whisper on the GPU:

```
$env:PYTHONIOENCODING = "utf-8"
python3.13 scripts/transcribe-whisper.py video-projects/<slug>/assets/raw.mp4 --language id
```

Writes `raw.json` beside the source in the kit format (`words[{text,start,end}]`, ffprobe duration).
`--model large-v3` for harder audio. Use `python3.13`, not `python` (3.14 has no packages).

## Sound effects and music: free CC0 first

Pinned kit CLI (0.7.109) lacks `media-use`. Run from the project folder:

```
npx -y hyperframes@0.8.226 media-use resolve --type sfx --intent "whoosh"
```

Saves to `.media/audio/sfx/`, license + credit in `.media/manifest.jsonl` (Openverse CC0/CC BY).
Check the license before posting; CC BY needs credit in the caption.
`media-use generate` and HeyGen music cost credits: ask Azriel first.
Voiceover: Azriel supplies his own VO files (no TTS key, Kokoro not installed).

## Workflow when Azriel sends media

1. `npm run new-video -- <slug>` (kebab-case), copy media into `video-projects/<slug>/assets/`. Never modify raw files.
2. Pick the skill:

| Goal | Skill | Size |
|---|---|---|
| Reels / TikTok / YT Shorts / short ad | `short-form-edit` | 1080x1920 |
| YouTube long-form | `edit-video` | 1920x1080 |
| Brand reel cut to music | `motion-showreel` | per brief |
| Animated explainer / motion graphics synced to Azriel's voiceover | `explainer-video` (+ `video-theme`) | 1080x1920 |
| Motion graphics from a brief, no footage | `make-a-video` | per brief |
| Promo from rielcode.com or a demo site | `website-to-hyperframes` | per brief |
| One step only | `cut-silences`, `cut-mistakes` | - |

3. Show proposed mistake cuts + storyboard before rendering. Render `--quality draft` first, Azriel reviews, then final.
4. Deliver MP4 path + what was cut/added. Same edit for several platforms = one 9:16 master; re-frame for 16:9 only if asked.

## Rielcode content rules

- Captions/on-screen text in Indonesian unless told otherwise; explainer videos default to English. No em dashes, no hype.
- Ads: customer POV (what they get), fast pace, max ~3s per scene.
- Vertical safe zone: keep text out of the bottom ~20% and right edge (platform UI).
- Brand logos: see memory `reference_rielcode_rebrand_assets`.

## Housekeeping

- `video-projects/`, renders, `.env`, `node_modules/` are gitignored but still sync to OneDrive. Move finished projects off OneDrive after posting.
- Verified 2026-11-01: `npx hyperframes doctor`, demo render (8s 1080p), whisper → cut-silences (17.2s → 6.6s), SFX resolve.
