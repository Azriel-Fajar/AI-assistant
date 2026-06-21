---
name: Free Demo Ads A6-A8 Jun 2026
description: 3 new v3 ads (A6 Free Demo, A7 Risk-Free, A8 Fast) built + rendered in 4 ratios, uploaded into v3 campaign to test vs Contoh Gratis winner
metadata:
  type: project
---

Built 3 new ad angles 2026-06-21, all clone the "free demo" core (winner = Contoh Gratis, 39 convos at Rp10,030). Comps in my-video/: Angle6-FreeDemo (curiosity), Angle7-FreeDemoRiskFree, Angle8-FreeDemoFast. Defined in src/RielcodeAd/angles.ts, mapped in Root.tsx.

**Render facts (non-obvious):**
- Each angle rendered in 4 ratios: 1x1, 4x5, 16x9, 9x16 (FreeDemo folder in Root.tsx, adRatios array). Old angles 1-5 stay 1x1 only.
- Per-ad durationInFrames: A6 300f (10s), A7/A8 270f (9s), sized to VO length + ~1.5s exit tail. AdBase EXIT_START + CTA pulse made relative to durationInFrames (was hardcoded 400/300).
- AdBase has backing music (music.mp3, volume 0.2 fade in/out) AND VO at volume={2} (2x). VO+music mix to one AAC track on render.
- Reference panel images = demo-cafe.png + demo-salon.png (swapped from old parallaxnet pngs).
- VO mp3s (vo-angle6/7/8.mp3) recorded externally by Azriel, one file per ad covering all 3 scenes [[feedback_video_voiceover]].
- 12 output files in my-video/out/. Render one at a time [[feedback_remotion_serialize_renders]], fast-paced 3s scenes [[feedback_remotion_fast_paced_3s_frame]], customer POV [[feedback_ad_script_customer_pov]].

**Upload state (2026-06-21):** 3 ads uploaded INTO existing v3 campaign (NOT new campaign), status "Processing" (in Meta review), Rp0 spend, 0 convos. Contoh Gratis still the only Active deliverer. The 2 dead ads (3 Hari Jadi, Rielcode WA Convos v3) already toggled OFF. Plan at my-video/NEXT-ADS-PLAN.md.

**Next:** wait for 3 ads to go Active + gather data, compare to Contoh Gratis Rp10,030/convo benchmark on CTR + depth-5. Meta upload = 9x16 (Reels/Stories) + 4x5 (feed) + 1x1; skip 16x9 for Meta.

Related: [[project_meta_ads_v3_finding]] [[project_demo_sites]] [[reference_remotion_video_project]] [[feedback_ad_test_dupe_winner]]
