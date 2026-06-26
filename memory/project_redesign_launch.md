---
name: Rielcode Redesign Launch
description: rielcode.com redesign launch 2026-06-10; assets + captions built, LAUNCH10 promo, gate = discount feature live
metadata:
  type: project
---

Rielcode.com redesign launch, target date 2026-06-10. New editorial site (serif "Websites with uncommon polish", cream + forest green, Starter/Pro/Premium pricing).

**Why:** Announce redesign across IG (feed + Reel + Story), TikTok, WhatsApp Status. Drive checkout with promo code `LAUNCH10` = 10% off any package (add-ons excluded), valid through 30 June 2026. Referral codes (per-referrer) are the secondary angle.

**How to apply:**
- Plan: `projects/rielcode-growth-plan/launch-2026-06-10-redesign.md`.
- Captions (ID + EN, 4 platforms, brand voice): `projects/rielcode-growth-plan/launch-2026-06-10-captions.md`.
- 4 video assets built via Remotion `LaunchAd.tsx`, with AI VO + baked captions: `projects/rielcode-growth-plan/launch-assets/` (Reel 9x16 18s, Feed 4x5, Story 9x16, WA 9x16). See README there.
- Pre-launch gate (Azriel-side): discount feature must be live (plan `docs/superpowers/plans/2026-06-08-referee-discount-and-promo-codes.md`), `LAUNCH10` created in admin, E2E tested (10% applied + `uses` increments), site deployed to prod.
- Footage = scroll-pan of real site screenshot captured from local `http://127.0.0.1:8000/en/`. If site changes, re-screenshot and re-render Reel (also update `SITE_H` in LaunchAd.tsx to new screenshot height).
- After Jun 30: deactivate `LAUNCH10` in admin (no expiry field in schema).
- Per-referrer video variants: `LaunchAd.tsx` compositions take optional `code` prop (defaults to brand `LAUNCH10`). Badge auto-shrinks for long codes. VO is code-aware: `code === CODE` uses `vo-launch-code.mp3` (speaks LAUNCH10), else `vo-launch-code-ref.mp3` (code-agnostic). Both Reel CodeScene and the 3 statics (StaticVO) are code-aware.
- Batch render referral codes: `node render-referrals.mjs` (or pass codes as args) → `out/referrals/<CODE>/{reel,feed,story,wa}.mp4`. Codes list at top of script. 7 codes done 2026-06-09: SIDE07, NAND24, FRED14, CYN10, YEZ10, BRY10, LIN10 = 28 videos.
See [[reference_remotion_video_project]], [[feedback_video_voiceover]], and [[feedback_remotion_serialize_renders]].
