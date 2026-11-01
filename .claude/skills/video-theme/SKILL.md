---
name: video-theme
description: Use when choosing, applying, or adding a visual theme / motion-graphics style for a HyperFrames video (colors, fonts, drawing style, motion recipes, transitions, SFX, music or not), or when someone says "tema video", "ganti tema", "tambah tema baru", "style video", "motion graphics style". Holds every theme in themes/<id>/ plus shared motion recipes. explainer-video loads it before building any scene.
---

# Video Theme

One skill, many themes. A theme decides how a video LOOKS, MOVES and SOUNDS. It never decides
what the video says or when things happen (explainer-video owns script and timing).

## Themes

| id | Look | Audio | Pick when |
|---|---|---|---|
| `chalkboard` | green board, chalk written live, boil, eraser cuts | music + chalk SFX | friendly teaching, "let me explain" |
| `manim` | 3Blue1Brown: black, LaTeX serif, create/transform/brace | music + soft SFX | logic, maths, systems, how-it-works |
| `kinetic` | 3D kinetic type on a plate, red grid cards, ink wipe | SFX only | punchy statements, hooks, opinions |
| `hud` | black + orange control room, HUD frame, glitch, drop | SFX only | tech/AI topics, high energy, one big reveal |
| `grid-pulpen` | grid paper, blue ballpoint doodles | music + pen SFX | calm notebook style (first theme; felt stiff, prefer the four above) |

**Default: `manim`** (Azriel's choice, 2026-11-01). No theme named → use manim. Switch only
when he names another theme or the topic clearly fits another "Pick when" row (then ask once).

## Every theme folder

```
themes/<id>/THEME.md        identity, palette, type, structure, motion rules, sound, checks
themes/<id>/assets/         theme.css, <id>.js helpers, fonts/ (all copied into the project)
themes/<id>/example/        index.html: a verified 2-scene build using scenes.js + at()
shared/motion.js            Motion.*: camera (push, punch, shake, rackFocus), entrances (slam, swing,
                            stretch, drop, slide, fade, popLetters), life (squash, hop, float, boil,
                            arcTo, puff), wipe, counter, sfx(). Every recipe can log an SFX event.
```

## Applying a theme

1. Read `themes/<id>/THEME.md` fully. Its rules override the hyperframes house style.
2. Copy `themes/<id>/assets/*` (with `fonts/`) and `shared/motion.js` into the project's `assets/`.
   Also copy `video-studio/node_modules/gsap/dist/gsap.min.js` if missing.
3. Start `index.html` from `themes/<id>/example/index.html`: same head, same layer structure,
   same `S`/`at()` helpers. Replace the scenes, keep the patterns.
4. Use only the theme's palette, fonts and helpers. Anything else is a theme violation: fix it.
5. Audio follows the theme's **Audio** line (music bed or SFX only).
6. Run the theme's "Check before render" list.

## Motion principles (all themes)

Researched 2026-11-01 (12 animation principles + short-form explainer practice):
- The camera never sits still: slow `push` per scene + `punch` on the keyword.
- Things have weight: `squash` when they land, overshoot on entrances, `shake` on the biggest word.
- Secondary action: after a thing appears, give it one beat of life (hop, tilt, float, wobble).
- Arcs, not straight lines, when things travel (`arcTo`); show transformations (A becomes B).
- One focus at a time; reveal each visual on its spoken word; stillness after motion is fine.
- No captions (voiceover carries the words); visuals fill y 220–1536.

## Adding a new theme

1. Mock or spike it first (one 8s sample with Azriel's VO) and get his OK.
2. Create `themes/<new-id>/` with THEME.md, assets/ (css, helpers, OFL/MIT fonts), example/index.html.
   Helpers must be synchronous and deterministic (no `Math.random`, no `repeat: -1`) and log SFX events.
3. Verify: assemble a test project from the example + `video-studio/video-projects/style-samples/shared`
   (vo-8s.m4a, scenes.js), run sfx-synth, `npx hyperframes lint`, render draft, read a frame sheet.
4. Add a row to the table above.

For 70+ further film styles see the **lemo-opuscar** plugin (its own pipeline; tell it Azriel
supplies the voice). Style ideas from there can be rebuilt here as themes.
