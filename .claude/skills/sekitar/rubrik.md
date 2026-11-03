# Reviewer rubric (automatic mode)

The reviewer replaces Azriel's approvals when `produksi-harian` runs `sekitar` unattended. Each gate gets a **fresh** reviewer (an Agent with no part in making the film, started with `model: "sonnet"`), given only file paths and this rubric. Sonnet since 3 Nov 2026, to save Claude usage; on trial until Azriel judges the films. It returns JSON and nothing else:

```json
{"gate": "naskah|look|akhir", "scores": {"<criterion>": 1-10}, "pass": true, "fixes": ["concrete change, with the line id, second or element"]}
```

**Before calling a reviewer**, the maker scores its own work against the gate's table and fixes anything under 8 first. This doesn't replace the reviewer, it only spares rounds: the bus film needed 3 naskah rounds on 3 Nov 2026.

**Pass:** every criterion ≥ 8, and any criterion marked *hard* at 10. A failed gate gets its fixes applied and is reviewed again by a new reviewer, at most 3 rounds. After the third failure the film still goes on, with the gate marked **PERLU CEK** in the report, unless a *hard* criterion failed: then stop and report, never publish a film with an unsourced claim.

## Gate 1: naskah (script.json + source table)

| Criterion | 10 means |
|---|---|
| fakta (*hard*) | Every claim in `say` and `show` is in the source table with a working URL and the right label (`resmi`, `media`, `model`); nothing says more than its source; health or safety topics carry no advice beyond the sources |
| hook | Sound or conflict on the first frame, then the question, then "Intip baliknya." by about second 7; its shape differs from the last 5 films (`src/pieces/*/script.json`, first lines) |
| kejutan | The surprise is stated plainly once, and the twist ("Nggak juga.") is honest, not a straw man |
| bahasa | Casual Indonesian (nggak, kok, tapi, jadi), short lines, one idea each, 100–190 words, no "tahukah kamu", no hype, no academic words |
| struktur | Hook, stakes, one cause chain, twist, at most 3 steps, reframe, and a last line with id `cta` asking to follow |

## Gate 2: look (stills every 2 s plus the key moments)

| Criterion | 10 means |
|---|---|
| terbaca | The subject is clear on a phone screen, below y≈520 px, never hidden by a card, the header, a tag or the caption |
| latar-gerak | There is a setting (not an object on an empty floor), and something besides the camera moves in every shot |
| label | Tags point at the part they name, nothing is clipped at the frame edge, no text collides with other text |
| warna-jujur | Colour only on what the sentence is about; an honesty badge on every simplified, enlarged, slowed or calculated shot |
| cocok-kata | Each frame shows what the voice says at that second |
| bersih | No floating or intersecting parts, no empty or broken frame, no blur on camera moves, nothing flashing |

## Gate 3: akhir (rendered film)

| Criterion | 10 means |
|---|---|
| cek-teknis (*hard*) | `check.py` prints `RESULT: all pass`, and `upload_check.py` passes |
| lembar-review | Every `review/sheet_*.jpg` passes the look criteria above |
| caption | Caption words match the voice; hard words (names, numbers) sit on the right frames per `timing.json` |
| teks-unggah | `upload.md` follows the Upload text rules in SKILL.md, every claim from the source table, health/safety films carry the disclaimer |
