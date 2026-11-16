# Upload text

Rules for `out/<slug>/upload.md`, step 7 of [SKILL.md](SKILL.md). Read this file at step 7, not before.

**Upload text.** [examples/keran/upload.md](examples/keran/upload.md) shows the file layout only; its wording predates the style below. Written fresh for each film, never from a fill-in template, for the same reason as *Stay monetisable* in [SKILL.md](SKILL.md). Indonesian, in the style Azriel set on the first upload (bau-hujan, 1 Nov 2026): a curiosity hook line, then a clear, slightly formal explanation that addresses the viewer as "Anda". Every number or claim needs a source already in the script's table; nothing new appears here. All three carry **sources by name, not links**, plus the assumptions behind any `model` number, and an affiliate disclosure if a link pays. Hashtags: the broad pair `#faktaunik #sains`, then the topic and the object; never `#fyp`, `#viral`, `#shorts`. Each platform gets its own wording:

| | TikTok | Instagram | YouTube Shorts |
|---|---|---|---|
| Text | Caption, ≤2,200 (API limit, the safe one; in-app is reported as 4,000) | Caption, ≤2,200 | Title ≤100, description ≤5,000 |
| Lead with | The hook line, the same one as the YouTube title without its hashtags | The hook line first, ≤125 characters, because the rest folds under "more" | A hook title that **withholds the answer**, key words early, core title (without hashtags) **≤50 characters**, ending in `#faktaunik #sains`. See **Title hooks** below |
| Then | The common belief against the fact, the cause in 2–3 sentences, a comment prompt ("Fenomena alam apa yang ingin Anda ketahui selanjutnya?"), sources | The name of the thing, the cause, one reason to save or share it plus the comment prompt, sources | In this order: (1) first line = the search question with the key words ("Kenapa jari keriput setelah lama berendam?"), never "Video ini ..." since this line shows in search; (2) a plain summary of what the film shows; (3) the SEO block: 2–3 short paragraphs that use the key terms (what people believe, what is true, how it works, who the video is for); (4) a CTA to subscribe and comment the next topic; (5) sources and the simplification note as a list; (6) topic hashtags last. Sources go below the CTA so the explanation and CTA are not buried |
| Hashtags | `#faktaunik #sains` + 2–3 topic tags (5 max) | `#faktaunik #sains` + up to 3 topic tags (limit 5) | Title: `#faktaunik #sains`; description: 3 topic tags. Over 60 voids all |
| Tags | – | – | Studio "Tags" box, one comma-separated line ready to paste, ≤500 characters: 5–8 topic tags in Indonesian: the object, the phenomenon, what a viewer would type to search it ("kenapa ...", "cara kerja ..."), plus `fakta unik, sains, edukasi`. No `tips`, `tutorial`, `FYP`, `3D` (Azriel dropped them 16 Nov 2026: the films are not tutorials and FYP is a TikTok term; tags carry little weight on YouTube) |

**Title hooks.** Each title is a hook in its own right, unique to its film. The title names the thing and the puzzle; the film gives the answer. Channel data (16 Nov 2026, 32 Shorts): titles that withheld the answer ("Ini yang terjadi ...", "Rahasia ...") had median 2,300–2,450 views; titles that stated the answer ("Lalat tidak bisa menggigit, makanan Anda dicairkan dulu pakai ludahnya") had median 1,466. Core titles ≤62 characters beat longer ones (2,052 vs 1,619). Before writing, read the YouTube titles in the last 5 (in automatic mode `produksi-harian`'s `target.py` has already printed them) `out/*/upload.md` and `out/*/*/upload.md` (daily films move to `out/<yyyy-mm-dd>/<slug>/`); the same opening words appear at most twice in any 5 titles. Patterns, examples only, never copy their wording:
- Cut-off reveal: "Ini yang terjadi saat kartu e-toll ditempel"
- Question: "Kenapa jentik nyamuk balik lagi setelah bak dikuras?"
- Rahasia / Ternyata: "Rahasia kartu e-toll tanpa baterai"
- Choice: "Tim talenan kayu atau plastik?"
- Belief flip, payoff withheld: "Bukan air, ini yang bikin jari keriput"
A title that states the full answer (fact + cause) is the wrong shape; rewrite it so the cause stays in the film. The claim in the title must be in the script's source table, like any other. TikTok and Instagram open with the same hook line.

**Settings** go in the same file:
- Cover: the frame from above.
- YouTube: not made for kids, language Indonesian, category Education.
- AI label: YouTube "altered content" **No** for a film in the kit's animated style, since its policy exempts non-realistic animation and script help, and the narrator imitates no real person. Instagram and TikTok **on**: Meta's rule names realistic-sounding audio, and TikTok's page couldn't be read, so the label is the safe side. Answer YouTube **Yes** if a film ever shows realistic footage or makes a real person seem to speak.
- First comment: one real question the film leaves open, to pin. Prefer a two-sided choice viewers can answer in one word ("Tim A atau tim B?"); the one choice title so far drew comments and a 2.8% like rate against a 1.6% channel average.

These limits were read on 1 Nov 2026. YouTube's title, description and hashtag rules and TikTok's API limit are from official pages. Instagram's 2,200, 125 and 5, and TikTok's 3–5, are from secondary sources. Platforms change them: if one refuses a text, recheck and update this file.
