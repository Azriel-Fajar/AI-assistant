# Theme: kinetic

**Identity:** kinetic typography in 3D space, no footage. Every spoken word lands as bold lowercase
type placed *in* a scene that one camera dollies through; punchlines flood to a red grid card.
Energetic, confident. Built 2026-11-01 from the "Kinetic Type" workflow guide (recipes + numbers),
adapted for voiceover-only videos (no subject cutout).

**Audio:** SFX only, no music. Voice ~8 dB above SFX (`data-volume` ≈ 0.55).

## Files

| File | Use |
|---|---|
| `assets/theme.css` | plate, `.card` (red grid), `.drop`, `.w` word classes, `.arc` |
| `assets/kinetic.js` | `Kinetic.dolly` (3D camera + parallax), `arcIn` (text on arc), `inkWipe`, `rack` (focus blur) |
| `assets/fonts/` | Poppins 900/600, Six Caps (OFL) |
| `example/index.html` | verified 2-scene build (plate → ink wipe → red card) |

Entrances come from `../../shared/motion.js`: `slam`, `swing`, `stretch`, `popLetters`, `drop`, `slide`, `fade`, `shake`, `counter`.

## Palette

Plate `#e9e6e1`→`#c9c4bc` (light studio wall) · ink `#161616` · red `#b51722` (emphasis on plate) ·
grey `#7d7d7d` (connecting words) · white `#f4f4f4` (on cards) · card radial `#c70808`/`#ae0606`/`#880404`
with a faint 216px grid · slam shadow `#5e0006`.

## Typography

- Main: Poppins 900, lowercase, tracking -0.05em, line-height 0.85 (stacked words nearly touch).
- Emphasis words 2–3× bigger (and red on the plate). Connecting words small (`.small`, grey on plate).
- `.cond` Six Caps uppercase with an 8px same-colour stroke: one tall word per scene (MILLIONS, WANT IT).
- `.hard` hard offset shadow on slams.

## Scene structure

```
<div id="sN" class="layer clip">                 (+ class "card on-card" for red cards)
  <div id="worldN" class="layer world">          Kinetic.dolly animates z (parallax)
    <div id="shakeN" class="layer">              optional, for Motion.shake
      <div class="w ..." style="left;top;font-size;transform:translateZ(z)">word</div>
```

Words live in the world at a depth: `translateZ(150..250px)` for the hero word (grows faster),
`translateZ(-300px)` for background data (counters). Arc text = SVG `<textPath>` on a curve.

## Recipes (word on its spoken frame, from `at()`)

| Recipe | Use for | SFX |
|---|---|---|
| `Motion.swing(dir)` | hero word of a scene | `hit` |
| `Motion.slam` | punch words | `hit` |
| `Motion.stretch` | the tall `.cond` word | `hit` |
| `Motion.popLetters` | a word that should feel typed/alive | `pop` |
| `Motion.drop` / `slide` / `fade` | connecting words | `pop` / `swish` / none |
| `Kinetic.arcIn` | a phrase on a curve | `swish` |
| `Kinetic.rack` | blur earlier words when focus moves to the new line | — |
| `Kinetic.inkWipe` | cut to a red card on a punchline | `whoosh` (auto) |
| `Motion.counter` | numbers | `typing` |

Every scene: `Kinetic.dolly` 1.0 → 1.10–1.16. Biggest word: slam + `Motion.shake`.

## Check before render

- [ ] No word overlaps another unintentionally (check the hero word's dots/ascenders).
- [ ] Every word starts on its spoken time; nothing pre-visible (entrances use `fromTo`).
- [ ] One `.cond` word max per scene; red only on emphasis.
- [ ] Words stay inside x 60–1010, y 220–1536 at the END of the dolly (it scales them up).
