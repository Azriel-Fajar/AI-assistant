# Merdeka Campaign: 17 Agustus 2026 Promo Video

Plan for the Independence Day Meta Ads promo. Status: **VIDEO BUILT, SILENT, AWAITING VO.**

Built 2026-07-26: both angles, all 4 ratios, plus a per-friend render for each of the 8 referral codes. 24 files total. Everything renders silent until the 10 VO mp3s land in `my-video/public/`; the scenes already accept a `vo` prop, so wiring is one line per scene with no rebuild.

- Ads: `my-video/out/merdeka/Merdeka-{M1,M2}-{9x16,4x5,1x1,16x9}.mp4`
- Referrals: `my-video/out/merdeka/<CODE>/{reel-9x16,feed-4x5}.mp4`
- Batch script: `my-video/render-merdeka-referrals.mjs`
- Kits to forward: `projects/rielcode-growth-plan/referral-kits-merdeka.md`

Remaining before launch: VO clips, then upload + icebreakers + budget top-up.

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
- Reuse `theme.ts` (cream #f4f1e9, forest green #2e4636) as the spine. Azriel expanded the Indonesian theming on 2026-07-26: red-white is a full accent system, not one hook moment. Built in: kawung batik texture field on every scene, umbul-umbul bunting on hook + CTA, waving Merah Putih stripe in the hook, red check marks, gold "Dirgahayu RI ke-81" line. Green still carries the brand; red-white is seasonal.
- No flag graphic in the solution scene: red-over-white on cream reads as a floating red dash even with an outline. Dropped 2026-07-26. Flag motifs only survive on green backgrounds or against the bunting.
- Code badge uses Inter, not Playfair. Playfair's old-style numerals render "MERDEKA10" as "MERDEKAio", which is unusable for a code people must type.
- 4 ratios per angle: 1x1, 4x5, 16x9, 9x16 (reuse `adRatios` pattern from Root.tsx).
- Max 3s (90 frames) per scene, fast-paced (per feedback_remotion_fast_paced_3s_frame).
- VO: Azriel supplies AI VO mp3s into `my-video/public/` (no TTS key), wired per scene like A6-A8.
- Renders serialized, one at a time; verify output file count = angles x ratios (per feedback_remotion_serialize_renders).

## Scripts

Two angles for testing. Each ~15s = 5 scenes x 3s. VO Indonesian, customer POV.

### Angle M1: "Bisnis Merdeka" — BUILT

Matches `src/RielcodeAd/MerdekaAd.tsx` as rendered. Record to these lengths; scenes 1-4 are 90 frames (3.0s), scene 5 is 105 frames (3.5s). Keep each clip a touch under so it never clips.

| # | File | Max | VO | On screen |
|---|---|---|---|---|
| 1 | `vo-merdeka-m1-1.mp3` | 2.8s | "Tahun ini, bisnismu bisa merdeka juga." | Bisnis Merdeka, bunting, 81 Tahun Indonesia |
| 2 | `vo-merdeka-m1-2.mp3` | 2.8s | "Selama ini jualanmu numpang di marketplace dan algoritma." | Numpang lapak orang? Kena potongan tiap transaksi? Tenggelam kalau algoritma berubah? |
| 3 | `vo-merdeka-m1-3.mp3` | 2.8s | "Punya website sendiri. Alamat bisnismu di internet." | Alamat bisnismu sendiri. / namausahamu.com |
| 4 | `vo-merdeka-m1-4.mp3` | 2.8s | "Domain, hosting, admin panel, semua sudah termasuk." | Sudah termasuk + 7 item list |
| 5 | `vo-merdeka-m1-5.mp3` | 3.3s | "Mulai 1 juta. Pakai kodenya, diskon 10% sampai 31 Agustus." | 10% DISKON, mulai 1 juta, `{code}`, WA |

Scene 4 VO changed from the original "admin panel" line: the scene now lists 7 Starter inclusions, so the VO names the top three instead of one.

### Angle M2: "Investasi, Bukan Gratisan" — NOT BUILT YET

| # | File | Max | VO | On screen |
|---|---|---|---|---|
| 1 | `vo-merdeka-m2-1.mp3` | 2.8s | "Website gratisan itu ada. Tapi yang menghasilkan, tidak gratis." | Gratis vs Menghasilkan |
| 2 | `vo-merdeka-m2-2.mp3` | 2.8s | "Website itu investasi. Alat supaya bisnismu ditemukan pembeli." | Investasi bisnis, bukan biaya |
| 3 | `vo-merdeka-m2-3.mp3` | 2.8s | "Lihat demo tampilan websitemu dulu, gratis. Lanjut kalau cocok." | Demo tampilan gratis dulu |
| 4 | `vo-merdeka-m2-4.mp3` | 2.8s | "Mulai 1 juta, DP 30% baru mulai dikerjakan." | Mulai 1jt, DP 30% |
| 5 | `vo-merdeka-m2-5.mp3` | 3.3s | "Pakai kodenya, diskon 10% sampai akhir Agustus." | 10% DISKON, `{code}`, sampai 31 Agustus |

Note: M2 scene 4 states DP 30% on purpose, it screens out non-buyers.

### VO is code-agnostic (locked)

VO never speaks a code out loud. It says "pakai kodenya" and the code appears on screen only, driven by the `code` prop. Same rule `render-referrals.mjs` already relies on (see its header comment).

Why: this video ships to Azriel AND to all 8 referral friends. Azriel's copy shows MERDEKA10; each friend's shows their own code (BRY10, YEZ10, CYN10, LIN10, NAND24, FRED14, SIDE07, CAL10). If VO said "MERDEKA10", the friend's badge and audio would contradict, and their code would never get used, which breaks referral tracking and their payout.

One VO set of 10 clips (2 angles x 5 scenes) covers all 9 recipients.

### Where to put the VO files

Drop the mp3s in `my-video/public/` using the exact filenames in the tables above. The scenes already accept a `vo` prop and render silent when it is absent, so wiring is a one-line change per scene once the files land, no rebuild of the composition needed.

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

1. ~~Confirm code name MERDEKA10~~ — confirmed 2026-07-26.
2. ~~Discount codes live in admin~~ — Azriel confirmed MERDEKA10 + all 8 referral codes active 2026-07-26.
3. **Supply VO mp3s** — 10 clips, filenames and max durations in the script tables above. Drop in `my-video/public/`.
4. **Budget amount + top-up date.** Ad account was paused for funds as of Jul 2026. IDR 500k+ before launch to avoid a learning reset.
5. ~~SIDE07 and CAL10 have no friend name on record~~ — SIDE07 = Misael, CAL10 = Calvin. Confirmed 2026-07-26, kits filled in.
