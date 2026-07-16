# Merdeka Campaign: 17 Agustus 2026 Promo Video

Plan for the Independence Day Meta Ads promo. Status: PLAN APPROVED, BUILD PENDING. No video built yet; scripts below await Azriel's approval + VO recording.

## Offer

- Code: **MERDEKA10** (proposal, Azriel can rename before build).
- 10% off all packages.
- Valid: launch (~11 Aug 2026) through **31 Aug 2026**. After 31 Aug, never offer it (same rule as LAUNCH10, which is expired and must not be quoted).
- Gate: discount code feature must be live on rielcode.com quote flow before launch (same gate LAUNCH10 used).

## Positioning: filter for committed buyers

Problem with current ads: attracts freebie-mindset leads. Some misread "Contoh Gratis" as "free website, pay only if it earns revenue." Goal: fewer messages, higher intent.

Copy rules (locked, apply to every script/caption/icebreaker):

1. **Price visible in the ad.** "Mulai 1 juta" on screen and in caption. Freebie-seekers self-filter before they message.
2. **"Demo tampilan gratis" phrasing only.** Never "lihat hasilnya dulu" or anything readable as pay-on-success (per memory feedback_ad_copy_demo_ambiguity). The free thing is a design mockup, said explicitly.
3. **Customer POV VO.** What THEY get, never "kami buat/aku bantu" (per feedback_ad_script_customer_pov).
4. **Merdeka theme = business independence**, not generic patriotism. Own website = not renting visibility from marketplace fees and IG algorithm. "Bisnis punya alamat sendiri di internet."
5. Mention DP 30% in body copy where payment comes up. Signals real transaction, filters non-buyers.

## Video spec (locked constraints)

- Remotion project `my-video/`, new composition `src/RielcodeAd/MerdekaAd.tsx`, registered in `Root.tsx` under a `Merdeka` folder.
- Reuse `theme.ts` (cream #f4f1e9, forest green #2e4636). Allowed: one brief red-white accent moment (flag stripe motif) inside the hook scene; do not re-theme the whole ad.
- 4 ratios per angle: 1x1, 4x5, 16x9, 9x16 (reuse `adRatios` pattern from Root.tsx).
- Max 3s (90 frames) per scene, fast-paced (per feedback_remotion_fast_paced_3s_frame).
- VO: Azriel supplies AI VO mp3s into `my-video/public/` (no TTS key), wired per scene like A6-A8.
- Renders serialized, one at a time; verify output file count = angles x ratios (per feedback_remotion_serialize_renders).

## Scripts

Two angles for testing. Each ~15s = 5 scenes x 3s. VO Indonesian, customer POV.

### Angle M1: "Bisnis Merdeka"

| Scene | VO | On-screen text |
|---|---|---|
| 1 Hook | "Tahun ini, bisnismu bisa merdeka juga." | BISNIS MERDEKA (red-white accent moment) |
| 2 Problem | "Selama ini jualanmu numpang di marketplace dan algoritma." | Numpang lapak? Kena potongan? |
| 3 Solution | "Punya website sendiri. Domain sendiri. Alamat bisnismu di internet." | namausahamu.com |
| 4 Proof | "Lengkap dengan admin panel, bisa update sendiri kapan saja." | Admin panel + demo tampilan gratis |
| 5 CTA | "Mulai 1 juta. Kode MERDEKA10, diskon 10% sampai 31 Agustus." | MERDEKA10, mulai 1jt, chat WA |

### Angle M2: "Investasi, Bukan Gratisan"

| Scene | VO | On-screen text |
|---|---|---|
| 1 Hook | "Website gratisan itu ada. Tapi yang menghasilkan, tidak gratis." | Gratis vs Menghasilkan |
| 2 Reframe | "Website itu investasi. Alat supaya bisnismu ditemukan pembeli." | Investasi bisnis, bukan biaya |
| 3 Offer | "Lihat demo tampilan websitemu dulu, gratis. Lanjut kalau cocok." | Demo tampilan gratis dulu |
| 4 Terms | "Mulai 1 juta, DP 30% baru mulai dikerjakan." | Mulai 1jt, DP 30% |
| 5 CTA | "Kode MERDEKA10, diskon 10% sampai akhir Agustus." | MERDEKA10, sampai 31 Agustus |

Note: M2 scene 4 states DP 30% on purpose, it screens out non-buyers.

## Meta Ads setup

- Ride inside v3 WhatsApp campaign (conversations objective). Never revert to v1 Messenger.
- Dupe-winner rule: keep current control (Contoh Gratis / A6-A8 winners) ON; pause old ads only after Merdeka ads prove. New ads start Processing/Rp0, normal.
- Click-to-WA icebreakers: Indonesian, demo/price driven, include MERDEKA10 and "mulai 1jt". Edit in ad template, not Meta English defaults.
- Caption per ratio: same copy rules; state price; "demo tampilan gratis" only.
- Prereq: top up ad balance (account currently paused for funds). IDR 500k+ to avoid learning reset (per project_meta_ads_v3_budget pattern).

## Timeline (today 2026-07-16)

| Date | Milestone |
|---|---|
| 16 Jul | Plan committed (done) |
| by 1 Aug | Azriel approves scripts + final code name; discount feature verified live on rielcode.com |
| 4-8 Aug | Build MerdekaAd.tsx, Azriel records/supplies VO mp3s, render 2 angles x 4 ratios serialized |
| 10-11 Aug | Upload to Meta, set icebreakers, top up budget, launch |
| 17 Aug | Peak day |
| 31 Aug | Promo ends, pause Merdeka ads, retire MERDEKA10 |

## Open items for Azriel

1. Confirm code name MERDEKA10 or rename.
2. Confirm discount feature works on rielcode.com (LAUNCH10 gate infra).
3. Supply VO mp3s per scene when scripts approved (10 clips: 2 angles x 5 scenes).
4. Budget amount + top-up date for the launch window.
