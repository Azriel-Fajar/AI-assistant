---
name: riset-sekitar
description: Research what to film next for Azriel's 3D education account, finding unusual everyday topics for the sekitar skill. Use when Azriel wants ideas rather than bringing one, or says "cari ide konten", "riset ide video", "ide video apa", "topik unik", "video affiliate", "keranjang kuning", "barang apa yang bagus buat affiliate", "barang populer". If he already has an idea, use sekitar.
argument-hint: "[tema atau barang, opsional]"
---

# Riset Sekitar

Finds what is worth filming and hands the chosen idea to `sekitar`. Nothing is scripted or rendered here.

**Account: @dibaliknyaapa (Instagram, YouTube), @dibaliknya.apa (TikTok); sign-off "Intip baliknya."** (1 Nov 2026). `sekitar`'s SKILL.md holds both; if they change, update the `/sekitar` line in the block template below.

**Every run leaves at least 10 unused ideas ready, all without a product, and researches only what's missing.** Azriel picks what he likes, so unpicked ideas stay in stock instead of costing a new search. **Upload target: 3 videos a day**, at 12.00, 15.00, 19.00 WIB (Azriel, 2 Nov 2026; was 1 a day). The month's plan is `shorts/ide/jadwal-<yyyy-mm>.md`: research in its order, ahead of the films (the daily runs research 6 rows a day, so the plan's unchecked `baru` rows get checked over the month), and turn its `saran` rows without a block into blocks before finding anything new. When a planned idea fails its fact check, swap in a stock idea of a different theme and fix the plan. If the research can't honestly fill the gap, widen the search first. If it still can't, deliver fewer and say how many are missing and why. A padded idea costs a 7-minute render and a script session.

**Keranjang kuning is paused, because there is no account yet.** TikTok Shop affiliate needs a follower minimum (600 followers and a post in the past 28 days, as an app showed on 1 Nov 2026). Keep products out of the research and the report, even when a topic is about a product type, and don't name a brand to buy. If he asks for affiliate ideas, remind him it's paused and ask if it's back on. Only his word turns it back on; then read [references/keranjang.md](references/keranjang.md) and [references/aturan-keranjang.md](references/aturan-keranjang.md) and ask how to split the 10.

**Say how long before researching:** roughly 1–2 minutes per new idea, with internet on. A run of 6 suggestions took about 10 minutes (1 Nov 2026). A run that only reads the stock takes seconds.

Report in casual Indonesian, in short sentences with terms explained (he won't ask what a term means).

**When `produksi-harian` runs this unattended,** research only the slugs it names, never ask, skip the time estimate and the chat report (the run's `LAPORAN.md` carries it), and still save every block and log row.

## 1. Count the stock first

Everything lives in `shorts/ide/` at the JARVIS root: `log.md` holds each idea's status, and `saran-<tanggal>.md` holds its paste-ready block. `shorts/` is gitignored because the JARVIS repo is public; never commit it. Read only the log. Grep the saran files for `^/sekitar` (one per block, with its slug) and `^## ` (titles): 10 ideas already take 18 KB.

**Stock** is every block in a `saran-*.md` file dated within the last 30 days whose slug has status `saran` in the log and no folder in `shorts/src/pieces/`. Older blocks don't count, because facts and seasons go stale; re-check one before offering it again.

- **Stock of 10 or more:** don't search. List the stock titles and the file paths, then stop.
- **Stock under 10:** research only the difference. Log rows with status `saran` and no block come first, re-checked and written as blocks, because they cost less than a new search.
- **If Azriel names a theme or says he wants new ideas anyway,** research what he asked for, whatever the stock.

## 2. Check what's already done, before choosing anything

Skip this and everything after it if the stock is already enough.

- **Read every similar account's whole catalogue first,** not only the reference's. The accounts are listed in `shorts/ide/akun-referensi.md` (Kitabedah, Kok Bisa?, Dolewak on 2 Nov 2026; on 2 Nov, 10 topics of the November plan clashed with them). Their topics are off the table by default, so take an angle they didn't, or drop the topic and say so if the object and angle overlap. In the original author's first test, every finalist picked before this check (jemuran apek, petir, power bank, aki soak) turned out to be one of Kitabedah's videos. Web search doesn't find their titles, so list them with yt-dlp, installed in the scratchpad, into `shorts/ide/katalog/<nama>.txt` (UTF-8). Refresh a catalogue only when its file is over a day old; the daily runs share it:
  ```powershell
  python3.13 -m pip install --quiet --target <scratchpad>\ytlib yt-dlp
  $env:PYTHONPATH="<scratchpad>\ytlib"; $env:PYTHONIOENCODING="utf-8"
  python3.13 -m yt_dlp --flat-playlist --extractor-args "youtube:lang=id" --print title --no-warnings "<URL katalog>"
  ```
  `lang=id` keeps the original Indonesian titles (without it YouTube returns English machine translations). Match on the object and the question, with word boundaries ("embun" must not hit "pembunuh"). If a download fails, say which account's check wasn't done.
- **Their catalogues are also an idea source:** a topic class that keeps coming back there is what the audience watches. Take the object class, never their angle. When a search turns up another account in the same niche, add it to `akun-referensi.md` (TikTok- or Instagram-only accounts: note the handle and check their topics by web search).
- Don't suggest a topic or object already in the log as `dibuat`, already in `shorts/src/pieces/` (films started without a block never reach the log), or still in stock, because YouTube refuses channels that look mass-produced and `sekitar` forbids two films sharing an object.
- If Azriel gave a theme or product, research that.

## 3. Topics without a product

Gather about one and a half times the number missing, and keep the best. Across the new ideas, the stock and the films already made, use no object twice, keep at most 3 from one theme (dapur, motor, listrik, hujan) and no two with the same opening shape, so a week of uploads doesn't look mass-produced. Good places to look:

- **Belief vs fact:** what parents, repairmen or sellers say, against what a manufacturer or regulator says.
- **Fresh official data:** PLN, PDAM, BMKG, BPOM, BPS, Kemenkes, ministries.
- **This month:** the season, a holiday, a price or tariff change, a local news story. Say why it fits now.
- **Things nobody looks at:** an object used daily whose inside would surprise people.

Keep a candidate only if all of these hold:

1. A neighbour would actually ask it.
2. The answer surprises. Write the surprise in one sentence. If you can't, it's trivia.
3. At least one key number or fact has an official or primary source.
4. Its mechanism can be built in `sekitar`'s 3D kit, one cause chain in 40–75 s. Say what the cutaway shows. A whole motorbike looks simple in the kit; one part looks fine.
5. It touches money or safety, or is plainly fun. The reference's top topics are money and safety on things people own.

## 4. Report in chat

Show the new blocks in full, then list the older stock by title with its file, so nothing is pasted twice. Say what you couldn't verify. **Azriel pastes each suggestion into a new chat to start `sekitar`, and that chat knows nothing of this research.** So each no-product suggestion is one heading plus one code block that stands alone, with full plain URLs (code blocks don't show links). Keep every fact, source and doubt inside the block. Use this shape:

````markdown
## Tanpa barang

### 1. <pertanyaan sebagai judul video>
```text
/sekitar Ini ide konten akun edukasi 3D-ku @dibaliknyaapa (akun belum dibuat), tanpa keranjang kuning, tanpa barang dan merek yang dijual. Slug: <slug>.

Pertanyaan: <pertanyaan sebagai judul video>
Kejutan: <satu kalimat>
Kenapa sekarang: <kalau ada>
Pembuka: <bunyi atau konflik di detik pertama, beda dari saran lain dan film yang sudah dibuat>
Gambar 3D: <apa yang dibuka di cutaway>

Fakta sudah dicek <tanggal>, tidak perlu dicari ulang:
- <fakta> | <resmi/media/model> | <URL>

Belum pasti, cek dulu sebelum naskah atau jangan dipakai:
- <yang masih perlu dicek>

Mulai dari langkah naskah. Setelah kusetujui, ubah status topik ini di shorts/ide/log.md jadi dipilih, dan jadi dibuat setelah videonya jadi.
```

## Pilihanku
<5 ide yang difilm duluan, urut, dan alasannya, 1–2 kalimat>
````

## 5. Save, log and hand off

Save every new block to `shorts/ide/saran-<tanggal>.md`, adding to the file if that date already has one, so the ideas survive the chat closing. Append each suggestion to `shorts/ide/log.md`, creating the file if needed. The slug must match the one in its block.

```markdown
| tanggal | jenis | slug | topik | barang | status |
|---|---|---|---|---|---|
| 2026-11-01 | tanpa barang | <slug> | <topik> | - | saran |
```

`status` is `saran`, `dipilih`, `dibuat`, `ditolak` or `ditunda`. When Azriel picks one, change its status and start `sekitar` with the idea, its sources and the claims already checked, so nothing gets searched twice.

When a film is published, its views are recorded by `sekitar` in the piece's `LOG.md`. Add a rule here only after a pattern shows across several films.
