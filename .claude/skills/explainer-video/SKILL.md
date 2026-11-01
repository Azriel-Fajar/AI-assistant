---
name: explainer-video
description: Use when Azriel wants an animated explainer or motion-graphics video driven by a voiceover (ElevenLabs or any VO), e.g. "buat video penjelasan tentang X", "video animasi", "motion graphics", "explainer video", "jelaskan X jadi video", "bikin video dari voiceover ini". Writes the script, takes his VO, timestamps every word, plans a cue sheet (visual hit + sound hit per keyword), shows a storyboard, builds with HyperFrames and code-made SFX, self-reviews. Look, motion and sound style come from the video-theme skill.
argument-hint: "[topik] [tema: manim (default)|chalkboard|kinetic|hud|grid-pulpen]"
---

# Explainer / Motion-Graphics Video

Voiceover in, animated video out (default: under 30s, 9:16 1080x1920, one master for TikTok,
Reels, Shorts). This skill owns WHAT is said and WHEN things happen. Look, motion recipes and
whether there is music come from `video-theme`.

Read first:
- `.claude/skills/video-studio/SKILL.md`: path rules (kit root = `video-studio/`, run commands there).
- `.claude/skills/video-theme/SKILL.md` and the chosen `themes/<id>/THEME.md` + `example/index.html`.

**Standing rules (Azriel 2026-11-01):** English by default · **no captions** (VO carries the
words; visuals fill y 220–1536) · Azriel records the VO himself · every motion lands on a spoken word.

## 1. Brief

Topic, theme, length, language. No theme named → **manim** (default). Ask only what is missing.

## 2. Script + cue sheet (approve before he records)

Create the project (`npm run new-video -- <slug>`), write `video-projects/<slug>/script.md`:

```
# hook
How does [AI] answer your questions?

# data
AI learns from millions of examples. That's called [data].
```

- Blank line between scenes, optional `# id`, keywords in `[brackets]` (1–2 per scene).
- **One idea per sentence = one scene.** Scene 1 hooks. The last scene lands the takeaway.
- Mark the **biggest line**; the sentence before it stays calm (room for a riser → drop in SFX themes).
- Optional CTA word at the end (becomes the last card).
- Under 30s ≈ max 70 English words (55 words = 20s measured) or ~48 Indonesian words.
- Short words, no em dashes, no hype.

Show the script with a **cue sheet** (one row per keyword / scene start):

| ~time | word | on screen | sound |
|---|---|---|---|
| scene 1 | "AI" | giant AI slams in | hit |

Wait for "ok". Then tell Azriel: record it exactly as written (one idea per sentence, keywords
clear, a breath before the big line), export mp3/wav. Music file only if the theme's Audio says music.

## 3. Assets in

`video-projects/<slug>/assets/vo.<ext>` (+ `music.<ext>`). Never edit originals.
Check VO length with ffprobe; over target → tell Azriel before building.
(Linux + logged-in `heygen` CLI: music may come from `npx -y hyperframes@0.8.226 media-use resolve --type bgm`.)

## 4. Word timestamps

From `video-studio/` (PowerShell):

```
$env:PYTHONIOENCODING = "utf-8"
python3.13 scripts/transcribe-whisper.py video-projects/<slug>/assets/vo.mp3 --language en --prompt-file video-projects/<slug>/script.md
node ../.claude/skills/explainer-video/scripts/scene-timing.mjs video-projects/<slug>/script.md video-projects/<slug>/assets/vo.json --out video-projects/<slug>/scenes.json
```

`scenes.js` (`window.SCENES`) gives duration, scene start/end, keyword times and every word's time.
Anchor words are lowercase without punctuation ("That's" → `thats`). `unmatched` > 0 → the VO
differs; the VO is the truth: fix `script.md` to what was said and rerun. Show the printed table.

## 5. Build

Copy theme assets + `video-theme/shared/motion.js` + `gsap.min.js` into `assets/`. Write
`index.html` from the theme's `example/index.html` (same head, layers, `S` and `at()` helpers):

- Root `main`, 1080x1920, `data-duration` = SCENES duration (+0.3s tail). `meta.json` 1080x1920.
- Every visual starts on its word: `at(scene, "word", nth)`. Keyword = visual hit + sound hit.
- Apply the theme's motion rules and the shared principles (camera push + punch, weight,
  secondary action, arcs, one focus at a time).
- Sounds are **logged, not placed**: theme helpers and `Motion.*(…, snd)` / `Motion.sfx()` push
  events to `window.__sfxEvents`. One `<audio id="sfx" src="assets/sfx.wav">` carries them all.
- Audio tags: `vo` (data-duration = VO length), `bed` (music themes only), `sfx`.
- HyperFrames rules: paused timeline on `window.__timelines["main"]`, no `Math.random`, no
  `repeat: -1`; later scenes hidden at t=0 (opacity 0 / clip / transparent overlay).

## 6. Storyboard gate

```
npx hyperframes lint
npx hyperframes snapshot --at <one time per scene, at its keyword> --no-end --describe false
```

Stitch the PNGs (ffmpeg `hstack`), READ the sheet yourself, fix, then show Azriel one frame per
scene with time, line, visual and sound. Wait for "go" (skip only if he says so).

## 7. Sound + render

From `video-studio/`:
```
node ../.claude/skills/explainer-video/scripts/sfx-synth.mjs video-projects/<slug> --duration <D>
```
Music themes: build the ducked bed (theme says how loud):
```
ffmpeg -y -i assets/music.mp3 -i assets/vo.mp3 -filter_complex "[0:a]atrim=0:D,asetpts=N/SR/TB,volume=0.8,afade=t=in:d=1,afade=t=out:st=D-2:d=2[m];[1:a]apad[k];[m][k]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350[bed]" -map "[bed]" -c:a aac -b:a 192k assets/music-bed.m4a
```
(short music: `aloop=-1:size=2e9,` before `atrim`). Then `npx hyperframes render --quality draft --output renders/draft-1.mp4`.

**Levels:** voice ≈ 8 dB above SFX (sfx `data-volume` 0.35–0.55), music bed ≈ 15 LU under the
voice. Measure spans with `ffmpeg -nostats -ss 3 -t 10 -i <file> -filter_complex ebur128 -f null -`.

## 8. Self-review (before Azriel sees it)

Numbered review sheet, every 0.5s, timestamp burned in:
```
ffmpeg -i renders/draft-1.mp4 -vf "fps=2,scale=216:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':fontsize=16:fontcolor=yellow:box=1:boxcolor=black,tile=8x3" renders/review_%02d.png
```
Read every sheet. Fix: anything before its word, off-screen, overlapping, unreadable, stray marks,
dead frames, theme "Check before render". Re-render as `draft-2`… never overwrite.

## 9. Deliver + iterate

1. Master: `ffmpeg -y -i renders/draft-N.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k renders/draft-N-social.mp4`
   then confirm `I ≈ -14 LUFS`, peak ≤ -1.5 dBTP with ebur128.
2. Send the `-social.mp4` path + cue sheet. Changes come as **timestamp + word + one change**
   ("at 0:07 make 'data' slam 3 frames later").
3. After his OK: `--quality high --output renders/final.mp4`, master to `final-social.mp4`, verify.

## Other engines (when a theme here doesn't fit)

| Need | Use | Notes |
|---|---|---|
| One of 70+ film styles (watercolor, ukiyoe, blueprint, swiss-motion, hologram-hud…) | plugin `lemo-opuscar` (`/lemo-opuscar:lemo-opuscar`) | its own pipeline; tell it Azriel supplies the voice; it may score music itself |
| Hand-painted mascot cartoon | `video-studio/claude-animation-base/` (open that folder, read ANIMATION_GUIDE.md) | the mascot is Anthropic's: personal use, not Rielcode ads |
| Paper-collage B-roll clip | skill `gbro-collage-broll` | needs GEMINI_API_KEY (paid video gen) + stills (built for Codex image_gen); ask before any paid call |
| Words behind Azriel on camera | not installed (Kinetic Type full pipeline, ~8 GB AI cutout) | only when he films himself |

## Notes

- Never generate the real voiceover. Test VOs (`python3.13 -m edge_tts --voice en-US-AndrewNeural …`) are labeled as tests.
- Never invent timing: every time comes from `scenes.json`.
- Test material for themes: `video-projects/style-samples/shared/` (8s VO, scenes.js).
