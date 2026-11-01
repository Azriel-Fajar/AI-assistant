# Theme: grid-pulpen (Kertas Grid + Pulpen)

**Identity:** a smart student's notebook. Everything is drawn live with a blue ballpoint
on grid paper; a red pen marks the one thing that matters. Calm, clear, friendly.
Approved by Azriel 2026-11-01 (option 2 of the paper-doodle mockups); he later found the
render stiff, so prefer chalkboard/manim/kinetic/hud unless he asks for this one.
`example/index.html` is the full 20s "How AI Works" build. It predates `shared/motion.js` and
`sfx-synth.mjs` (SFX placed as manual `<audio>` tags): for a new build, add Motion recipes and
log SFX events instead.

## Canvas and safe zones (1080x1920, 9:16)

| Zone | y range | Use |
|---|---|---|
| Top UI | 0–200 | nothing important (TikTok/IG top bar) |
| Visual | 220–1150 | title + doodles |
| Caption | 1250–1500 | captions only |
| Bottom UI | 1536–1920 | nothing important (platform buttons, description) |

Horizontal: content between x 80 and x 940 (right side has like/comment buttons).

## Palette (only these)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#fdfdfb` | background |
| `--grid` | `#dde6f3` | grid lines, 72px squares |
| `--ink` | `#1d3b8f` | all text and strokes by default |
| `--ink-soft` | `#5b72b5` | secondary labels, small notes |
| `--wash` | `#e9eefa` | rare soft fill inside a shape (bars, boxes) |
| `--red` | `#d83a3a` | emphasis only: circle, underline, cross, one keyword |

Max 2 red marks per scene. Red is never a background.

## Type

Font: **Kalam** (handwritten), bundled in `assets/fonts/` (SIL OFL 1.1). HyperFrames does
not auto-supply it, so the `@font-face` in theme.css must ship with the project.

| Class | Size / weight | Use |
|---|---|---|
| `.hand-title` | 104px / 700, line-height 1.05 | one per scene, max ~6 words |
| `.hand-body` | 60px / 400 | short labels inside doodles |
| `.hand-note` | 44px / 400, `--ink-soft` | tiny annotations |
| `.caption` | 58px / 700 | captions (see below) |

Wrap with `max-width`, never `<br>` in body text.

## Drawing rules

- Doodles are inline `<svg class="doodle">`: `fill:none`, stroke `--ink`, width 7, round caps
  and joins (set by theme.css). Red strokes: add class `red`.
- Hand-made shapes: draw circles, boxes, arrows as slightly wobbly `<path>`s, not perfect
  `<circle>`/`<rect>`. Arrows end with a 2-stroke open head.
- Simple metaphors a layperson gets in one glance: documents, chat bubble, brain, nodes and
  lines, bars, arrows, question mark, check, cross. One idea per scene.
- No emoji, no photos, no icons fonts, no gradients, no glow, no drop shadows.

## Motion vocabulary (`assets/doodle.js`)

| Helper | What it does | Duration |
|---|---|---|
| `Doodle.draw(tl, sel, at, dur)` | strokes appear as if drawn, path by path | 0.4–1.0s |
| `Doodle.write(tl, sel, at, dur?)` | text revealed left to right like handwriting | auto: 0.035s/char, 0.3–1.2s |
| `Doodle.pop(tl, sel, at)` | small item lands with a tiny overshoot | 0.35s |
| `Doodle.pan(tl, sheetSel, index, at)` | camera slides to scene `index` on the same sheet | 0.6s |
| `Doodle.captions(tl, boxSel, groups)` | builds timed caption lines | from timings |

- Doodles never fade in: they are drawn. Text is written. Only `pop` may scale.
- Each element starts at its keyword's time minus ~0.1s (eye sees it as the word lands).
- Scene structure: title written first (at scene start + 0.15s), doodles on keywords,
  red mark last, on the scene's key word.
- Vary eases inside a scene (`power1.inOut` draw, `none` write, `back.out(2)` pop).

## Transition: one long sheet

All scenes sit on one tall grid sheet (`.sheet`), scene `i` at `top: i*1920px`. Between
scenes the camera pans up with `Doodle.pan`, starting 0.3s before the next scene's start.
The pan is the exit; no element fades out before it. The last scene may hold to the end.

## Sound

| Moment | SFX intent (`media-use resolve --type sfx --intent`) | Volume |
|---|---|---|
| Each pan | `whoosh` | 0.30 |
| Small item pops in | `pop` | 0.45 |
| Red circle / underline | `click` | 0.40 |

Max about one SFX every 2 seconds; the voice leads. Music bed per explainer-video.

## Captions

**Not used** (Azriel 2026-11-01: no captions in videos). The visual zone extends to y 1536.
Kept only for a video where he explicitly asks for captions:
box `.caption-box` fixed in the caption zone. Lines of 2–4 words, Kalam 700 58px, `--ink`
on a paper strip with a dashed ink top border. The scene keyword inside a caption gets
class `key` (red). Captions switch instantly (no animation), they never overlap.

## Check before render

- [ ] Only palette tokens used (grep the composition for `#` colors outside theme.css).
- [ ] Every doodle drawn with `Doodle.draw`, every title written with `Doodle.write`.
- [ ] ≤2 red marks per scene; red lands on the spoken keyword.
- [ ] Nothing in top 200px, bottom 384px, or right of x 940 except the sheet itself.
- [ ] Text ≥44px; snapshot frames readable on a phone.
