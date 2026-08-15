# WhatsApp Ad-Lead Close Scripts

_Built 2026-06-17 from funnel analysis of 39 Meta Ads WhatsApp chats. Rewritten 2026-08-15 after the 8-chat August batch._

Exact copy-paste wording. The reasoning behind each answer lives in `references/sops/customer-handling.md` 1.2. Message length rules are in SOP 1.2b and are not optional.

## Diagnosis

**June, 39 chats, 0 paid:**

1. **Double greeting, no hook** - 21/39 ghosted right after greeting.
2. **Price then silence** - 7 quoted, no close attempt, ended on "mau dijelasin?".
3. **Over-discovery** - quote came too late or never.

**August, 8 chats, 0 paid:**

4. **Open-ended greeting** - 6/8 died on "cerita dulu bisnis kakak di bidang apa". A stranger will not do homework.
5. **Wall-of-text quote** - the 2 engaged leads both got 17 lines carrying tier, features, demo, timeline, promo, and DP at once. Both went quiet. One retained only the price and replied "gak ada yang 500 ribuan".
6. **No follow-up sent, ever** - all 8 chats ended on a Rielcode message. Zero nudges.

Root cause June: discovery loop, not a close loop. Root cause August: correct content, unusable packaging, and no second touch.

## Tone rules (apply to all scripts)

- Warm "kak", soft 🙏🏻, short one-idea lines.
- Use "kami" not "saya".
- No em dashes. No hype openers ("wah cocok banget kak", "mantap kak"). No fake urgency. No lo/gue.
- Banned: "colek saya", "santai aja" (use "tidak masalah"), "gak masalah" (use "tidak masalah").
- Ask the need first. No price or demo in the first message.
- Plain copy-paste blocks. No markdown, it breaks on paste.

**Current promo: MERDEKA10, 10% off, through 31 Aug 2026. LAUNCH10 is expired, never offer it.**

---

## 1. Auto-greeting (set in the WA Business app, not here)

Numbered options, not an open question. Reply cost is one character.

```
Halo kak, terimakasih sudah hubungi Rielcode 🙏🏻

Biar kami bisa kasih gambaran yang paling pas, websitenya buat keperluan apa kak?
1. Profil usaha
2. Katalog produk
3. Toko online

Boleh balas nomornya saja kak, sekalian bidang usahanya kalau berkenan 😊
```

Do not send a second "ada yang bisa dibantu" after this. The greeting already asks. Wait, then go to script 2.

Rough tier mapping from their answer: 1 leans Starter, 2 leans Starter or Pro, 3 leans Pro or Premium plus the Catalog add-on. Confirm against `references/rielcode-pricing.md` before quoting.

---

## 2. Quote, message 1 of 2

One tier, four features inline, one niche demo, promo, one question. Then stop.

Read the pricing file before sending. Never list features from memory.

```
Baik kak, untuk [industri] biasanya paling kepakai [paket] [harga].

Isinya [fitur 1], [fitur 2], [fitur 3], plus Admin Panel biar kakak bisa ganti foto dan harga sendiri.

Lagi ada promo MERDEKA10 diskon 10 persen sampai 31 Agustus, jadi [harga diskon].

Ini contoh yang mirip kak:
rielcode.com/demos/[niche]/

Desainnya masih draft kasar ya kak, nanti disesuaikan penuh sama usaha kakak. Modelnya cocok sama yang kakak bayangin?
```

Rules:

- One tier. Do not present a menu. Quoting two tiers anchors them on the cheaper one before they see value in either.
- Four features maximum, chosen for their niche.
- One demo link, the closest niche. Never the `/demos/` hub, it makes them browse.
- Trailing slash on the URL or the CSS 404s.
- Always say the design is a rough draft.
- Starter and Pro always include CMS. Never omit it.
- No timeline, no DP in this message.

Filled example, furniture:

```
Baik kak, untuk furnitur biasanya paling kepakai Starter 1 juta.

Isinya 1 sampai 2 halaman, desain custom, domain sama hosting gratis 1 tahun, plus Admin Panel biar kakak bisa ganti foto dan harga produk sendiri.

Lagi ada promo MERDEKA10 diskon 10 persen sampai 31 Agustus, jadi 900 ribu.

Ini contoh yang mirip kak:
rielcode.com/demos/bengkel-interior/

Desainnya masih draft kasar ya kak, nanti disesuaikan penuh sama produk kakak. Modelnya cocok sama yang kakak bayangin?
```

---

## 3. Quote, message 2 of 2

Only after they reply to message 1. Timeline and DP, nothing else.

```
Estimasi [X] hari kerja kak, dihitung setelah materi dari kakak lengkap.

Kalau kakak cocok, kami mulai dengan DP 30 persen yaitu [DP] setelah promo. Setelah DP masuk kami kirim daftar materinya dan langsung mulai pengerjaan 🙏🏻
```

Estimates: Student 1-3 days, Starter 3-5, Pro 7-10, Premium 10-14. Always an estimate, never a date.

DP after MERDEKA10: Student 135rb, Starter 270rb, Pro 540rb, Premium 1.35jt.

Do not ask for materials here. That happens after the DP lands. See SOP 1.4.

---

## 4. Ghost re-engage (no reply 1-2 days after the quote)

One nudge. Gives an out, keeps the door open, restates the next step.

```
Halo kak, izin cek lagi soal website [industri] nya 🙏🏻

Kalau demonya belum sreg, tidak masalah kak, warna sama modelnya bisa kami sesuaikan penuh sama usaha kakak. Yang di link itu masih draft kasar.

Kalau kakak mau mulai, DP 30 persen nya [DP] setelah promo MERDEKA10. Setelah DP masuk kami kirim daftar materi yang dibutuhkan dan langsung mulai pengerjaan.
```

One nudge only. No reply after 3 more days means archive to `leads/archive.md`.

---

## 4b. Greeting-drop re-engage (no reply after the greeting)

They never told you their industry, so there is nothing to quote. Re-ask with the easy version.

```
Halo kak, izin menyapa lagi 🙏🏻

Biar lebih gampang, websitenya kira-kira buat keperluan apa kak?
1. Profil usaha
2. Katalog produk
3. Toko online

Balas nomornya saja juga tidak masalah kak, nanti kami kirimkan contoh yang paling mendekati.
```

---

## 5. Budget objection ("belum cukup budget" / "ada yang 500 ribuan")

Now the smaller tier appears, alone, in its own message. Never comment on their money.

```
Ada kak, Student 500 ribu, isinya 1 halaman dengan desain custom dan tombol WhatsApp.

Satu catatan penting kak, di paket ini domain dan hosting belum termasuk, jadi terpisah sekitar 250 sampai 400 ribu per tahun dan dibayar langsung ke penyedia hostingnya.

Kalau mau yang sudah sekalian lengkap, Starter 900 ribu setelah promo sudah termasuk domain, hosting 1 tahun, dan Admin Panel.

Fitur lain bisa ditambah bertahap nanti kak, jadi tidak harus sekaligus di awal.
```

Student has no domain, no hosting, and no CMS. Always state that, otherwise the upgrade later feels like a bait.

---

## 6. Price pushback ("kok mahal ya kak" / "ada yang 300rb")

Answer with what the tier buys. Never attack the competitor, never drop the price unprompted.

```
Paham kak. Harga itu sudah sepaket ya kak, bukan cuma halamannya.

Di dalamnya sudah termasuk domain dan hosting gratis 1 tahun, yang kalau beli sendiri sekitar 250 sampai 400 ribu per tahun. Desainnya juga custom, bukan template, dan ada Admin Panel biar kakak bisa ganti isinya sendiri tanpa hubungi kami tiap kali.

Dengan MERDEKA10 sampai 31 Agustus, jadi [harga diskon] kak.
```

---

## Rule of thumb

- Industry known, quote in the next message. Do not run a discovery loop.
- Quote is two messages. Recommendation and demo first, DP after they react.
- One tier per message. Second tier only on pushback.
- Never end on "mau dijelasin?". Every message ends on a concrete next step.
- One nudge if they ghost, then archive after 3 days.
- Read `references/rielcode-pricing.md` before every quote.
