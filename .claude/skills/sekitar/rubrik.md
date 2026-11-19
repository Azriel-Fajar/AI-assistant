# Reviewer rubric (automatic mode)

The reviewer replaces Azriel's approvals when an unattended run (the old `produksi-harian`, archived 19 Nov 2026) runs `sekitar`. Since 5 Nov 2026 (Azriel: the original author approves quickly, so review only what is crucial) a film gets **two reviewer gates**: `fakta` on the script and `look` on the storyboard. Everything else is the maker's own self-check below, with no reviewer: the 5 Nov films used 7 reviewers each (21% of a film's Claude usage), and most still ended PERLU CEK.

Each gate gets a **fresh** reviewer (an Agent with no part in making the film, started with `model: "sonnet"`), given only file paths and this rubric. It returns JSON and nothing else:

```json
{"gate": "fakta|look", "scores": {"<criterion>": 1-10}, "pass": true, "fixes": ["concrete change, with the line id, second or element"]}
```

**Before calling a reviewer**, the maker scores its own work against the gate's table and fixes anything under 8 first, so the first review usually passes.

**Known round-1 failures (Nov 2026 runs), check these first:**
- `look`: a person cut off at the frame edge; the camera inside or through a body (legs, torso); a head hidden behind a card or tag; an empty or blank frame at a shot change; a shot where only the camera moves (`latar-gerak` 7).
- `fakta`: a number or date in `say`/`show` with no row in the source table, or rounded past what the source says.

**Pass (since 16 Nov 2026, Azriel, to save usage: film 1 of 16 Nov took about 70 steps, with both gates re-reviewed):**
- `fakta`: the hard `fakta` criterion at 10, `kejutan` ≥ 8. All fixes go in one edit. A **re-review happens only when the hard `fakta` criterion was under 10** (a claim was unsourced, over-claimed or wrong), by a new reviewer told the earlier fixes. If `kejutan` alone was under 8, apply the fixes and go on with no re-review. If the re-review fails too, cut the unsourced claim, and if the film no longer stands without it, stop and report; otherwise go on with the gate marked **PERLU CEK**. Never publish a film with an unsourced claim.
- `look`: every criterion ≥ 7. A failed gate gets all its fixes applied in one edit and **no re-review**: the maker re-checks the fixed frames itself with one `stills.mjs` pass on the changed seconds only. The report lists the round-1 scores and the fixes.

## Gate 1: fakta (script.json + source table), after step 2

| Criterion | 10 means |
|---|---|
| fakta (*hard*) | Every claim in `say` and `show` is in the source table with a working URL and the right label (`resmi`, `media`, `model`); nothing says more than its source; health or safety topics carry no advice beyond the sources |
| kejutan | The surprise is stated plainly once, and the twist ("Nggak juga.") is honest, not a straw man |

## Gate 2: look (stills every 2 s plus the key moments), after step 4

| Criterion | 10 means |
|---|---|
| terbaca | The subject is clear on a phone screen, below y≈520 px, never hidden by a card, the header, a tag or the caption |
| latar-gerak | Every shot stands on the floor with the objects' shadows on it (depth) and happens in a real place built from `props.tsx` (room, street, kitchen, people where people belong), never a lone object on a bare floor; the topic's object has its real shape and detail; something besides the camera moves in every shot |
| label | Tags point at the part they name, nothing is clipped at the frame edge, no text collides with other text |
| warna-jujur | Colour only on what the sentence is about; no pill badge on screen; a calculated number says "hitungan kami" in its card kicker |
| cocok-kata | Each frame shows what the voice says at that second |
| bersih | No floating or intersecting parts, no empty or broken frame, no blur on camera moves, nothing flashing |

## Self-check only (no reviewer)

The maker checks these itself and notes any shortfall in the report.

**Script, before gate `fakta`:**
- **hook:** sound or conflict on the first frame, then the question, then "Intip baliknya." by about second 7; its shape and words differ from the last 5 films. Of the 3 hook options, the maker picks the strongest and says why in the report.
- **bahasa:** casual Indonesian (nggak, kok, tapi, jadi), short lines, one idea each, 100–190 words, no "tahukah kamu", no hype, no academic words.
- **struktur:** hook, stakes, one cause chain, twist, at most 3 steps, reframe, and a last line with id `cta` asking to follow.

**Film, after the render (replaces the old `akhir` gate):**
- **cek-teknis (*hard*):** `check.py` prints `RESULT: all pass`, and the captions in the final message respect the platform limits. A failure gets fixed and re-rendered to `<slug>_v2.mp4`.
- **lembar-review:** look at every `review/sheet_*.jpg` once against the look criteria. Fix and re-render only for a real error (clipped label, tag pointing at nothing, broken or empty frame), not for taste.
- **caption:** hard words (names, numbers) sit on the right frames per `timing.json`.
- **teks-unggah:** the captions in the final message follow [UPLOAD.md](UPLOAD.md), every claim from the source table, and health or safety films carry the disclaimer.
