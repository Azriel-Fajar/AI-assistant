# Upload text

Rules for `out/<slug>/upload.md`, step 7 of [SKILL.md](SKILL.md). Read this file at step 7, not before.

**Upload text.** [examples/keran/upload.md](examples/keran/upload.md) shows the file layout only; its wording predates the style below. Written fresh for each film, never from a fill-in template, for the same reason as *Stay monetisable* in [SKILL.md](SKILL.md). Indonesian, in the style Azriel set on the first upload (bau-hujan, 1 Nov 2026): a curiosity hook line, then a clear, slightly formal explanation that addresses the viewer as "Anda". Every number or claim needs a source already in the script's table; nothing new appears here. All three carry **sources by name, not links**, plus the assumptions behind any `model` number, and an affiliate disclosure if a link pays. Hashtags: the broad pair `#faktaunik #sains`, then the topic and the object; never `#fyp`, `#viral`, `#shorts`. Each platform gets its own wording:

| | TikTok | Instagram | YouTube Shorts |
|---|---|---|---|
| Text | Caption, ≤2,200 (API limit, the safe one; in-app is reported as 4,000) | Caption, ≤2,200 | Title ≤100, description ≤5,000 |
| Lead with | The hook line, the same one as the YouTube title without its hashtags | The hook line first, ≤125 characters, because the rest folds under "more" | A hook title, key words early, ending in `#faktaunik #sains`. Vary the hook pattern per film (see **Title hooks** below); never "Rahasia ... yang jarang orang tahu" by default |
| Then | The common belief against the fact, the cause in 2–3 sentences, a comment prompt ("Fenomena alam apa yang ingin Anda ketahui selanjutnya?"), sources | The name of the thing, the cause, one reason to save or share it plus the comment prompt, sources | A plain summary of what the film shows, sources as a list, then an SEO block: an opening question ("Pernah penasaran kenapa ...?"), 2–3 short paragraphs that use the key terms (what people believe, what is true, how it works, who the video is for), a CTA to subscribe and comment the next topic, topic hashtags last |
| Hashtags | `#faktaunik #sains` + 2–3 topic tags (5 max) | `#faktaunik #sains` + up to 3 topic tags (limit 5) | Title: `#faktaunik #sains`; description: 3 topic tags. Over 60 voids all |

**Title hooks.** Each title is a hook in its own right, unique to its film, never a reused frame. Before writing, read the YouTube titles in the last 5 (in automatic mode `produksi-harian`'s `target.py` has already printed them) `out/*/upload.md` and `out/*/*/upload.md` (daily films move to `out/<yyyy-mm-dd>/<slug>/`) and pick a pattern none of them used; the pattern word ("Rahasia", "Ternyata", ...) appears at most once in any 5 titles. Patterns to rotate, examples only, never copy their wording:
- Belief flip: "Bukan kotor, bau hujan itu dari bakteri tanah"
- Surprising number: "Kaca bus cuma butuh 1 titik untuk pecah"
- Hidden mechanism: "Kartu e-toll hidup dari gelombang radio, bukan baterai"
- Wrong habit: "Menguras bak tiap minggu tidak membunuh telur nyamuk"
- Cut-off reveal: "Ini yang terjadi saat kartu e-toll ditempel"
- Question: "Kenapa jentik nyamuk balik lagi setelah bak dikuras?"
- Rahasia / Ternyata: allowed, just not as the default.
The claim in the title must be in the script's source table, like any other. TikTok and Instagram open with the same hook line.

**Settings** go in the same file:
- Cover: the frame from above.
- YouTube: not made for kids, language Indonesian, category Education.
- AI label: YouTube "altered content" **No** for a film in the kit's animated style, since its policy exempts non-realistic animation and script help, and the narrator imitates no real person. Instagram and TikTok **on**: Meta's rule names realistic-sounding audio, and TikTok's page couldn't be read, so the label is the safe side. Answer YouTube **Yes** if a film ever shows realistic footage or makes a real person seem to speak.
- First comment: one real question the film leaves open, to pin.

These limits were read on 1 Nov 2026. YouTube's title, description and hashtag rules and TikTok's API limit are from official pages. Instagram's 2,200, 125 and 5, and TikTok's 3–5, are from secondary sources. Platforms change them: if one refuses a text, recheck and update this file.
