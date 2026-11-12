---
name: sekitar
description: Turn an idea about everyday things into a finished vertical 3D explainer video in the style of kitabedah.idn. Use when Azriel has a content idea for his education account, or says "bikin konten", "bikin video edukasi", "video kayak kitabedah", "bedah <benda>", "video kenapa <hal sehari-hari>", "ini ide konten". For 2D motion graphics use explainer-video instead; for ideas use riset-sekitar.
argument-hint: "[ide konten]"
---

# Sekitar

An idea goes in; a checked 40–75 s vertical film comes out. Picture is Remotion + Three.js, sound is synthesised here, and the voice is the clock: every camera move, label and effect hangs on a spoken word.

Measurements and what is proven or guessed about the reference: [STYLE.md](STYLE.md). A complete worked piece: [examples/keran/](examples/keran/). Read both before the first build of a session.

**Project:** `shorts/` at the JARVIS root (pieces in `src/pieces/<slug>/`). It is in `.gitignore` because the JARVIS repo is public: never commit it, and never `git add -f` it. Run commands from `shorts/`: `<project>` is that folder, `<skill>` is `../.claude/skills/sekitar`, `<piece>` is `src/pieces/<slug>`. Run `python3.13 <skill>/tools/setup.py --piece <slug>` first: it refreshes the engine from this skill and installs anything missing. Edit the engine here in `engine/`, never the project's copy. Official Remotion guidance sits in the project's `.claude/skills/` (`remotion-markup/3d.md`, `remotion-render`); read it there only when the kit doesn't cover something.

**Python:** on Windows use `python3.13` for every tool here; the default `python` (3.14) has no faster-whisper. On Arch, `python`.

**Say how long before anything slow.** A 60 s film took 2.9 min to render on Azriel's laptop (bau-hujan, 1 Nov 2026, about 600 objects, concurrency 4); 7.3 min on the original author's. A storyboard takes about 1 s per frame.

**Account:** `@intipbaliknya` on Instagram, TikTok and YouTube, display name `Intip Baliknya | Edukasi 3D` (renamed from @dibaliknyaapa / @dibaliknya.apa on 9 Nov 2026; first film uploaded 1 Nov). Hashtag `#intipbaliknya`. **Sign-off: "Intip baliknya."**, spoken as the last line of the hook by second 7, right after the question, so every film says it. `voice.py` adds 0.6 s of silence after it, so it lands before the film moves on; any other line can take `"pause": <seconds>` in script.json. `Watermark` in `overlay.tsx` puts the logo (`shorts/brand/logo-1warna.svg`) and `@intipbaliknya`, faint, top right on every frame (Azriel, 4 Nov 2026); if the logo changes, copy its paths into `Watermark`.

**Narrator:** Gemini's **Achird** (default in `voice.py`), picked by Azriel from samples on 1 Nov 2026 over Sadaltager, the original skill's voice.

**Every time Azriel starts a new video, remind him of these first, in Indonesian, briefly:**
- Tonton hasil di pemutar Windows atau HP, bukan preview VS Code (preview-nya sering tanpa suara).
- Jangan pakai laptop untuk kerja berat saat render, per 60 detik video sekitar 3 menit.
- Pastikan internet nyala saat riset dan buat suara. Render jalan offline.
- Jangan unggah video bersuara edge-tts kalau akunnya mau dimonetisasi.

## Automatic mode

When `produksi-harian` runs this skill unattended (Azriel chose this on 1 Nov 2026), nobody is there to approve, so:

- **Never ask.** Skip the reminders. Only the crucial approvals get a fresh reviewer from [rubrik.md](rubrik.md) (Azriel, 5 Nov 2026): gate `fakta` after step 2 and gate `look` after step 4 (the merged look gate let thin, placeless films through, so `look` stays its own gate). Apply all its fixes in one edit and re-review once; if it still fails, keep the best version and note what is left in the report. Hook, language, structure and the rendered film are the maker's own self-check in rubrik.md, with no reviewer.
- **Hook:** write the 3 options as usual and pick the strongest yourself; say why in the report.
- **Voice:** Gemini only, `--takes 2 --until 0.85`: it stops at the first take with `match` ≥ 0.85, so a film spends 1–2 of the free tier's 10 requests a day and 5 films fit in one day (Azriel, 5 Nov 2026: max 2 takes, 1 if it can). If `public/pieces/<slug>/takes/` already holds Gemini takes for this script, run `voice.py <piece> --reuse` first: it spends no quota. If the best `match` is still under 0.8, generate no more: the film is PERLU CEK. If Gemini fails, stop and report; edge-tts never goes into an automatic film.
- **Look:** `stills.mjs ... every=2 --scale=0.25` plus the 3–4 key moments, self-check against the `look` criteria in rubrik.md, fix, then gate `look`.
- **Render:** in the foreground, chained with `check.py` in one call (Bash `timeout: 600000`), not in the background with polling. After the render, run the film self-check in rubrik.md (check scripts, one look at each review sheet). A re-render goes to `<slug>_v2.mp4`; the report names the final file.
- **Facts are hard:** if a claim can't be sourced, cut it; if the film no longer stands without it, stop, report, and let `produksi-harian` swap the topic.
- Azriel's check moves to the end: he watches the finished film and reads `LAPORAN.md` before he uploads by hand.

## Related skills

- **riset-sekitar:** finds and stocks ideas; its blocks paste straight into `/sekitar`.
- **explainer-video:** 2D motion graphics on HyperFrames, no captions. Use it when the topic is an idea or a system, not a physical object.
- **video-theme:** lists sekitar as its 3D option. Its themes are HyperFrames-only; sekitar keeps its own look in `engine/src/kit/theme.ts`.
- **video-studio:** post-editing of a finished render (trim, join with real footage, re-cut per platform). Hand it `out/<slug>/<slug>.mp4`.

**Captions stay on in sekitar** (Azriel, 1 Nov 2026). The no-caption rule is for explainer-video only. Since 3 Nov 2026 they follow the grammar of the fig. Why short Azriel liked (youtube.com/shorts/7urjYoPsSEo): 1–2 words at a time, centred low on the screen (y=1300; Azriel moved it off the top on 3 Nov 2026), wide heavy caps in ink with a white outline, key terms coloured by meaning. Colours come only from this account's `theme.ts` (orange key term, red the problem, blue water), never fig. Why's neon palette. Pass `keywords` to `Frame` as a list (orange) or a `{ word: T.red }` map.

## Non-negotiables

1. **Facts before pictures.** Every claim on screen or in the voice gets a web-checked source, labelled `resmi` (official), `media`, or `model` (our own calculation or assumption). No source, no claim. Number assumptions are said on screen in the card kicker.
2. **Not a clone.** Copy the grammar, never the brand: no "Kita Bedah", "kita bedah", its logo, its name, its reference frames as assets, or its topics by default. Azriel's account gets its own name and sign-off.
3. **Their paid material stays out.** Their guide, class and skill package are sold, and their terms forbid recording or downloading the class. Learn only from their public videos and pages, keep downloads in the scratchpad, and never commit them.
4. **Azriel approves the script before any 3D work,** and the look before the render. A wrong angle caught in text costs a minute.
5. **Done is measured.** `tools/check.py` passes and you have looked at the contact sheets. You cannot hear the mix: say so, and ask Azriel to listen on a phone speaker.

## The flow

### 1. Angle and facts
Turn the idea into one question a neighbour would ask, one that has a surprise in it. Good shapes: "X vs Y, yang mahal cuma bayar merek?", "Kata ibu A, kata pabrik B, siapa yang benar?", "Kok bisa …?", "Beneran …?". Search the sources. If the honest answer is boring or unverifiable, say so and offer a better angle rather than padding.

**Stay monetisable.** YouTube refuses "AI-generated content made with generic or unoriginal templates giving the impression of mass production" across a whole channel, so no two films may share an opening, an object or a camera path: original research, a real angle and a world built for that topic are what keep the channel eligible. Never reuse anyone's footage.

### 2. Script check-in
Write `src/pieces/<slug>/script.json`, one line per beat. `say` is spelled as spoken ("dua puluh satu liter"); `show` is what the caption prints ("21 liter") and is optional. Follow the grammar:

| beat | time | job |
|---|---|---|
| Hook | 0–7 s | Starts on the first frame with a sound or a conflict, then the question, then the sign-off "Intip baliknya.", then into the film |
| Stakes | to ~25% | The number that makes it matter, in things people picture (galon, tagihan, rupiah) |
| Mechanism | middle | One cause chain. Each sentence moves the picture. Short words, one idea a line |
| Twist | ~60% | "Jadi yang murah salah? Nggak juga." The honest exception |
| Do this | ~75% | At most 3 steps they can do today |
| Reframe | end | One line that restates the surprise, then the CTA |

**The CTA is its own motion graphic** (Azriel, 1 Nov 2026). The last line has id `cta` and asks to follow ("Ikuti buat ..."). From that line `Frame` lays the follow end card over the film: a paper panel with the brand's peeled corner, the profile picture, name and both handles, Instagram/YouTube first and TikTok second (`ACCOUNT` in `theme.ts`), and a hand tapping "+ Ikuti" until it reads "✓ Mengikuti". `sound.py` adds its tap and ding, and `voice.py`'s default 1.3 s tail lets it rest. A piece animates nothing for the `cta` line.

**A new hook every film.** Before writing it, list the opening line of every earlier film (`src/pieces/*/script.json`, first line, plus `ide/log.md`). Offer Azriel 3 hook options in different shapes and let him pick. Shapes: a sound of the object ("Tik. Tik. Tik."), a price or number contrast, a quoted belief ("Kata tukang servis …"), the failure moment on screen, a direct challenge to the viewer, a before/after, a side-by-side comparison ("Api biru. Api kuning."), a belief stated then flatly denied, a sense other than sight (a smell, a feel). None may repeat the shape of the last 5 films or reuse their words. If riset-sekitar's block gives a `Pembuka`, make it one of the 3.

Casual Indonesian: *nggak, kok, tapi, jadi*. No academic words, no "tahukah kamu", no hype. 100–190 words. Show Azriel the script and a source table; wait for approval.

### 3. Voice
`python3.13 <skill>/tools/voice.py <piece> --takes 3` narrates the whole script in one session each take, scores the takes (words heard against the script, pace), trims long pauses, keeps the best, and writes `timing.json` plus `public/pieces/<slug>/voice.wav`. It prints each take's numbers: show them, and read a low `match` (<0.8) as a voice that misread something. `--reuse` re-times the takes already on disk without spending API quota. `--sample Charon,Achird` makes a short clip per voice for Azriel to choose from.

- `--engine gemini` (default when `GEMINI_API_KEY` is set): Google's `gemini-3.8-flash-tts`, same family as the reference voice. Voice via `"gemini_voice"` in the script (default `Achird`); the delivery prompt via `"style"`. Costs cents a film; on the free tier Google may use the text to improve its products. Set the key once with `setx GEMINI_API_KEY "<key>"` (key from aistudio.google.com); `voice.py` reads it from the user environment even in a terminal opened before.
- `--engine elevenlabs` (needs `ELEVENLABS_API_KEY` and `"eleven_voice"`, a voice id, in the script; model via `"eleven_model"`, default `eleven_v4`): about 1 credit per character. Its free plan refuses Voice Library voices over the API (402, tested 1 Nov 2026) and has no commercial license, so Indonesian voices need a paid plan. Use it only if Azriel asks.
- `--engine edge` (fallback, no key): Microsoft's unofficial read-aloud voice `id-ID-ArdiNeural`. Draft only: tell Azriel, and don't publish a monetised video with it.

Never put a key in a file. It lives in the environment.

### 4. Look check-in
Write `piece.tsx` (start from the example) and `sfx.json`. Then `node <skill>/tools/stills.mjs <project> <slug> out/<slug>/look.jpg "1,14,30,50" --scale=0.3` for 3–4 very different moments; check every-3-seconds with `every=3` before rendering. Show the board and wait for a yes.

**Picture rules, all measured from the reference:**
- **One continuous world, no hard cuts.** Move the camera between places with an eased move, never blurred: blur makes viewers dizzy (Azriel, 1 Nov 2026). A new move about every 3–6 s; `camAt` pushes slowly in between so nothing freezes.
- **Flat minimal cartoon standing on a floor** (Azriel, 4 Nov 2026 for flat cartoon; 5 Nov 2026 for the floor: objects on bare white had no depth). `Frame` lays a `GridFloor` at y = 0 by default and paints the page the floor's colour, so the far floor melts into it like a horizon. Stand objects on y = 0 so their shadows fall on it; a thing in the air still shows its height by its shadow. Add a topic surface where it fits (a road, a counter, a cutting board), and for a night, electric or dark topic pass a dark floor (`floor={{ color, lineColor }}`, `mark="#FFFFFF"`) with weather moving in front. Anything below y = 0 is hidden by the floor: move the floor down (`floor={{ pos: [0, -2, 0] }}`) for a cut-away below ground, and pass `floor={false}` only for a shot that must float. Keep the action within ~25 units of the origin, where the grid lines show. No sky and no ground block: the floor and the props make the place.
- **Every shot happens in a place, built from the kit's props** (Azriel, 5 Nov 2026: the 5 Nov films were lone objects with no world and looked cheap; a friend's account gets rich scenes at about 17% of a usage window per film by reusing parts). `engine/src/kit/props.tsx` has `Person` (walks, raises an arm), `Room` (tiled floor, two walls, a window), `Window`, `House` (lit at night), `Tree`, `Road` (scrolling centre line, kerbs), `StreetLamp`, `Rain` (streaks and rings), `Pylon` + `pylonTips` + `Cable` (SUTET). Set the scene where the thing really lives (a stove in a kitchen, a bill in a shop, a phone in a hand in a room), with a person wherever people are part of the story, then model only the topic's own object in `piece.tsx` with real shape and detail: check what it really looks like first. When a film needs a setting part that isn't in `props.tsx` and could serve other films (a table, a car, a counter, a bathroom), add it to `props.tsx` rather than the piece, so the next film gets it free. Flat colours, full-ink edges (Azriel kept them, 5 Nov 2026), no halftone (`HALFTONE` is off in `prims.tsx`). `piece.tsx` stays near 15k characters because the setting comes from the kit, not because the world is empty.
- **Something moves in every shot,** besides the camera: weather, sway, particles, a part working. A card held over a still scene is a dead spot.
- **Build the object with kit parts** (`Box`, `Cyl`, `Lathe`, `Tube`, `Tiles`). `Lathe` with `cut` is the signature shot: a section that opens the thing, with the wall cut in a loud colour (`capColor`). Start solid and open it on the word that says so.
- **Chrome, brass and water reflect:** put one `Env` in the scene, then give those parts `metal`/`rough`; `Lathe` takes `smooth` for round shading. Keep the rest flat. It barely slows the render (1 Nov 2026, about 8 min for 59 s). A deep bowl hides its floor from a low camera: floor-to-rim height must stay under radius × tan(camera elevation).
- **Windows are openings, never stickers** (Azriel, 3 Nov 2026; glitched on palu-kaca-bus and etoll-tanpa-baterai). A thin glass box laid a few mm over a solid body flickers: the body's shadow and edge lines fight it. Build the frame around a gap (roof + pillars, as in palu-kaca-bus's bus side), put the glass inside the gap with `edge={false} shadow={false}`, and show dark interior behind it. The same goes for any flat decal on a moving or shadowed surface: lift it at least 1% of the object's size. Vibration is a slow sine (≤ ~2 Hz): `sin(40*t)` aliases into random jumps at 30 fps.
- **Colour only what the sentence is about.** Everything else stays white, steel or dark. Water blue, heat orange-red, good green, bad red, copper for windings. Yellow is reserved for attention.
- **Exaggerate honestly:** enlarge small parts and slow fast ones. No pill badge on screen (Azriel, 3 Nov 2026: "Diperbesar · gerak lambat" pills are not wanted; `Badge` now draws nothing). Say what was simplified, enlarged, slowed or sped up in the upload text's notes instead, and keep a calculated number's "hitungan kami" in its card kicker.
- **Watermark corner stays clear.** `Frame` draws `Watermark` (top right, 104 px, 42% opacity, 1.4 px blur), empty until the account has a logo; a piece never adds its own. Keep that corner clear anyway so nothing moves when the logo arrives. A film on a dark page passes `mark="#FFFFFF"` to `Frame`. Its fit under the TikTok, Instagram and YouTube icons is untested until the first upload: ask Azriel to check each app's preview.
- **Upper part is for reading:** the top stays clear: no `Header` in new films, no white fade (Azriel, 3 Nov 2026). Only the watermark sits there. Caption at y=1300, so keep the key part of the shot between y≈450 and y≈1250. Cards sit at y≈440. Nothing important below y≈1500: TikTok's UI lives there.
- **Numbers become objects** where possible: 34 galon pop in rather than a figure on a card. Rows in `Steps` and stats light up only when spoken.
- **Tags point at the part being named,** `to={at(worldPoint)}`, appearing on the word. `Pop` sound words at most every ~8 s.

Cue from words, never seconds: `S('line')`, `E('line')`, `W('line','word')`. All motion comes from `t`; never `useFrame`, `Math.random` or the clock.

### 5. Sound
`sfx.json` lists effects by word (`drip`, `pop`, `tick`, `thud`, `whoosh`, `ding`, `crack`, `squeak`, `buzz`; 8–15 a film, on actions, not on decoration; set a small negative `offset` so a hit lands in the pause before its word, as the reference does, because under a word it gets masked). `python3.13 <skill>/tools/sound.py <piece>` synthesises the bed, different per film (key, tempo, chords seeded by the slug) and per section (its layers change at a line start every 7 s or more, with one near-silent breath), 13 dB under the voice and ducking while the narrator speaks (Azriel, 3 Nov 2026: the old bed was too loud and samey). `"bed": false` in script.json drops it for a film. It mixes it under the voice and masters to −14 LUFS. Nothing needs licensing because nothing is sampled. To add a kind of effect, add a case to `make()`.

### 6. Render and check
```powershell
cd shorts
npx remotion render <slug> out/<slug>/<slug>.mp4 --concurrency=4
python3.13 <skill>/tools/check.py out/<slug>/<slug>.mp4 src/pieces/<slug>
```
Run the render in the background, and read its output for errors before trusting the check. Windows refuses to overwrite a video that is open in a player (`EPERM`), so a re-render goes to a new name (`<slug>_v2.mp4`). Look at every `review/sheet_*.jpg` for clipped labels, tags pointing at nothing and parts hidden behind a card or the wall. A check failure or a visible error gets fixed, not reported as-is. Note on the caption sync: words the recogniser missed are placed by syllable share, so ask Azriel to check the captions on a low-`match` take.

### 7. Deliver
- Cover: `npx remotion still <slug> out/<slug>/cover.jpg --frame=<n>` on the frame that best states the question (usually frame 0).
- `out/<slug>/upload.md`: ready-to-paste text per platform, format in [examples/keran/upload.md](examples/keran/upload.md). `python3.13 <skill>/tools/upload_check.py out/<slug>/upload.md` must pass. Rules in [UPLOAD.md](UPLOAD.md).
- Report: file paths, the check table, and the weakest moment. Say what was estimated. Ask Azriel to listen on a phone. Paste all of `upload.md` in the message too, so he can copy it on his phone.

**Upload text:** the rules (platform table, title hooks, settings) are in [UPLOAD.md](UPLOAD.md). Read it at this step, not before.

### 8. Learn
When a film is published, record its views at 7 days in the piece's `LOG.md`, and add a rule here only after a pattern shows across several films, not one.

## New device
`winget install Gyan.FFmpeg`, Node 18+, `python3.13 -m pip install faster-whisper edge-tts numpy`, then `tools/setup.py`, then `npx skills add remotion-dev/skills --agent claude-code --yes` inside `shorts/`. `shorts/` is not in git, so a new machine starts it empty (OneDrive syncs it between the Windows machines only). Remotion's free license covers an individual or a company of up to 3 people, commercially.
