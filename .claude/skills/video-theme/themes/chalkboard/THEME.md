# Theme: chalkboard

**Identity:** a teacher explaining on a green board. Chalk is written and drawn live, everything
breathes with a hand-made 8 fps boil, the eraser wipes between ideas. Warm, clear, a bit playful.
Built 2026-11-01 from the approved `e-chalk-live` spike.

**Audio:** music bed (Azriel's file, ducked) + chalk SFX from `sfx-synth.mjs`.

## Files

| File | Use |
|---|---|
| `assets/theme.css` | tokens, board, tray, eraser, `text`/`.t`/`.h`/`.ln` |
| `assets/chalk.js` | `Chalk.filter()`, `Chalk.write`, `Chalk.draw`, `Chalk.erase` (all log SFX) |
| `assets/fonts/` | Cabin Sketch 700 (titles), Architects Daughter (notes); OFL |
| `example/index.html` | verified 2-scene build: copy its structure |

Also load `../../shared/motion.js` (`Motion`: push, punch, shake, boil, float, squash, hop, arcTo, puff, sfx).

## Canvas (1080x1920)

Content y 220–1536, x 80–940. Tray sits at y 1840 (decor only). No captions.

## Palette

`--board #233a2c` · `--board2 #31503c` (centre glow) · `--chalk #f3f0e6` (default) ·
`--yellow #f4e285` (keywords, numbers) · `--pink #f2a7b5` (circles, underlines, arrows to the answer) ·
`--blue #a8d8ea` (objects, icons). No other colours.

## Structure per scene

```
<div id="sN" class="layer clip">            timed clip
  <div id="pushN" class="layer">            slow camera push (Motion.push)
    <div id="punchN" class="layer">         accent zoom + shake (Motion.punch / shake)
      <svg class="layer"><g id="bN" filter="url(#chalk)"> ... chalk marks ... </g>
                         <g id="dustN"></g></svg>   (dust outside the filter)
```

Call `Chalk.filter()` once before building. Text = SVG `<text class="t|h">` filled by `Chalk.write`.
Drawings = `<path class="ln">` (add `stroke="var(--pink)"` etc.) drawn by `Chalk.draw`.
Colour inline on text with `style="fill:..;stroke:.."` (CSS beats the fill attribute).

## Motion rules

- Title written at scene start; each drawing starts on its spoken word (`at()`), ~0.1s early.
- Keyword: `Motion.punch` + chalk `tap`. Biggest word of the scene: punch + `shake` + `puff` + strong tap.
- After a drawing finishes, give it one beat of life: `squash` (objects landing), `hop` (icons),
  head tilt / arm (characters), `float` (thought marks), flick (arrows).
- Use arcs (`Motion.arcTo`) when things travel; show transformations (icons fly into the word they become).
- `Motion.boil` on every board group for the whole scene. `Motion.push` 1.0 → 1.05 per scene.
- One focus at a time: never start two drawings on the same word.

## Transition

`Chalk.erase(tl, "#eraser", "#sN", nextStart - 0.28, 560, 1100)` + two `.streak` smears
(scaleX from 0, left then right). Streaks stay as old-board smudges.

## Sound (sfx-synth voices)

`chalk` (auto from write/draw) · `tap` (keywords, tally slashes; `strong:true` on the big word) ·
`erase` (auto) · `swish` (things flying). `<audio id="sfx" data-volume="0.45">` ≈ 10 LU under the voice.

## Check before render

- [ ] Every chalk mark inside a `filter="url(#chalk)"` group; dust outside it.
- [ ] Nothing visible before its word (scrub the first frame of each scene).
- [ ] Each scene has: push, ≥1 punch on the keyword, ≥1 beat of secondary life.
- [ ] Colours only from the palette; yellow only on keywords/numbers.
