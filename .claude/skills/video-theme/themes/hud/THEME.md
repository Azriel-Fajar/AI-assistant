# Theme: hud

**Identity:** a motion-graphics "control room". Black stage, orange hits, a HUD frame that never
leaves (so many scenes still feel like one piece), flash cards, counters, lock-on brackets, glitch
cuts and one big drop. Punchy, techy. Built 2026-11-01, inspired by the "Level 5" workflow guide
(its scene grammar and sound rules, not its creator's branding or handle).

**Audio:** SFX only, no music. Every keyword gets a sound; one riser → drop on the biggest line.

## Files

| File | Use |
|---|---|
| `assets/theme.css` | tokens, type roles (`.title .ui .mono .serif`), `.ca` (chromatic aberration), `.bloom`, backgrounds, HUD chrome, `.vignette .grain .flash .bracket` |
| `assets/hud.js` | `HUD.frame` (always-on HUD from SCENES), `grain`, `glitch`, `lockOn`, `flash`, `type` |
| `assets/fonts/` | Unbounded 900, Space Grotesk 500/700, JetBrains Mono 500, Instrument Serif italic (OFL) |
| `example/index.html` | verified 2-scene build: flash card → glitch → counter ring → riser/drop |

Plus `../../shared/motion.js` (slam, stretch, fade, squash, shake, push, counter, sfx).

## Palette and type

Black `#0b0a09` · orange `#ff5a26` (keywords, hits) · red `#ff3b1f` (playhead, errors) ·
warm white `#eceae4` (text) · indigo `#1b1d4a` (the one quiet, honest line).
Unbounded 900 = titles/drops · Space Grotesk = UI text · JetBrains Mono = data, timecodes ·
Instrument Serif italic = the emotional line.

## Layers (top to bottom)

`#hud` (HUD.frame) · `#fx` (vignette + HUD.grain) · `#flash` · scenes `#s1..#sN`.
Later scenes start with `style="opacity:0"` and `tl.set(opacity 1)` when the cut's glitch ends.
HUD chrome at the very top/bottom sits under platform UI: decorative only. Real content: y 220–1536.

## Scene library (pick one per idea)

| Scene | Use for | Build with |
|---|---|---|
| Flash card | the hook, one giant word | `.bg-orange`, `.title` 400–500px black, `Motion.slam` + `shake` |
| Composer | "you ask / you type" | white pill + `HUD.type` + `squash` |
| Counter ring | numbers, scale | SVG ring dashoffset + `Motion.counter` |
| Lock-on | the one thing to notice | `HUD.lockOn` box around it |
| Stacked verbs | any 3-step list | three `.title` lines slammed on their words |
| Drop | the biggest line | riser SFX from the line before, then `slam` + `HUD.flash` + `shake` + `drop` SFX |
| Quiet line | an honest/emotional sentence | `.bg-indigo` + `.serif`, slow `fade`, no hits |

## Sound map

whoosh = every cut (with `HUD.glitch` = glitch) · blip = keywords (auto from the HUD readout) ·
hit = big words · riser → drop = biggest line · pop = UI cards · typing = typed text · stamp = lock-on.
`data-volume` ≈ 0.55 so the voice sits ~8 dB above.

## Check before render

- [ ] Only scene 1 visible at t=0 (later scenes start at opacity 0).
- [ ] One drop per video. Leave the line before it calm so the riser has room.
- [ ] Big titles fit inside 1080 at the end of `push` (≤ 250px for 4-letter Unbounded words).
- [ ] No captions; the HUD keyword readout is the only spoken-word text besides the visuals.
