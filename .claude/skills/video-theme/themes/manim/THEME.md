# Theme: manim

**Identity:** 3Blue1Brown-style maths explainer. Black stage, LaTeX serif, shapes that are
*created*, *transformed* and *grouped* with smooth easing. Calm and precise; every motion shows a
relationship (this becomes that, these are one thing). Built 2026-11-01 from the `d-manim` spike.
An HTML imitation of Manim's look, not the Manim library.

**Audio:** music bed (Azriel's file, ducked) + soft SFX (`tick`, `chime`, `swish`, `whoosh`, `typing`).

## Files

| File | Use |
|---|---|
| `assets/theme.css` | tokens, `text`, `.shape` |
| `assets/manim.js` | `Manim.write`, `create`, `growArrow`, `transform`, `fadeOutUp`, `indicate`, `circumscribe` |
| `assets/MorphSVGPlugin.min.js` | needed by `Manim.transform` (GSAP plugin, free since 3.13) |
| `assets/fonts/` | KaTeX_Main regular + italic (MIT) |
| `example/index.html` | verified 2-scene build |

Plus `../../shared/motion.js` (push, punch, squash, counter, sfx).

## Palette (Manim colours)

`--bg #0e0e0e` · `--white #ece9e1` · `--blue #58c4dd` (inputs, first idea) ·
`--yellow #f7d96f` (the answer, keywords) · `--green #83c167` (result / correct) ·
`--red #fc6255` (wrong / contrast) · `--grey #888888` (labels).

## Layout

9:16 means vertical flows: stack cause → arrow → effect top to bottom (y 560–1540).
Titles 96–120px, 2 lines max. Diagrams use the full width (x 120–960).

## Motion rules

- Text always `Manim.write` (outline then fill). Shapes always `Manim.create`. Arrows `growArrow`.
- Show relationships with `transform` (a copy morphs into the next idea), recolouring a group,
  braces + labels, `circumscribe`. This is what makes the style feel smart.
- Easing `Manim.SMOOTH`; only pops (`back.out`) for dots appearing in a lagged group.
- Keyword: `indicate` (+chime) or a recolour, plus a gentle `Motion.punch` (≤1.05).
- Life: small wobble/rotation on symbols, `ApplyWave` (y stagger) on groups, `Motion.squash` on results.
- Camera: `Motion.push` 1.0 → 1.04 per scene. No shakes (too loud for this style).

## Transition

`Manim.fadeOutUp(tl, "#sN", nextStart - 0.28)` + soft `whoosh` (gain 0.5). Next scene writes in.

## Check before render

- [ ] Transform copies start hidden with `style="opacity:0"` (not `tl.set` at 0).
- [ ] Coloured text uses `style="fill:..;stroke:.."` or tspans (CSS overrides the fill attribute).
- [ ] Each scene shows at least one relationship (transform, group recolour, brace, circumscribe).
