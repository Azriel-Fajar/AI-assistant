# Next v3 Ads — Free Demo Hook (build day: Jun 21-22, 2026)

Winner = "Contoh Gratis" (63/63 deep convos). These 3 clone the free-demo core, different lever.
All ride INSIDE existing v3 campaign. No new campaign. No new Sales campaign until pixel has 30-50 leads.

## Constraints (locked)
- Max 3s (90 frames) per scene, fast-paced.
- Customer POV ("kamu dapat X"), not seller POV ("aku buat").
- New redesign theme.ts, not old design.
- Never run 2 renders at once. Verify file count after each.
- VO: Azriel records AI mp3 externally, drops in my-video/public/.

## Comp IDs (already registered in Root.tsx via angles.ts)
- Angle6-FreeDemo
- Angle7-FreeDemoRiskFree
- Angle8-FreeDemoFast

## Render (ONE at a time)
```
cd my-video
npx remotion render Angle6-FreeDemo out/angle6.mp4
npx remotion render Angle7-FreeDemoRiskFree out/angle7.mp4
npx remotion render Angle8-FreeDemoFast out/angle8.mp4
```
Confirm file exists before next render.

---

# VIDEO SCRIPTS (per scene, 90-frame = 3s max each)

AdBase plays: Scene1 hook headline -> Scene2 body -> Scene3 CTA. VO runs over all 3.
Record VO as single mp3 per ad. File names MUST match angles.ts exactly.

## A6 — Free Demo (Curiosity)  -> vo-angle6.mp3
- Scene 1 (0-3s) HOOK: text "See your business as a website."
  VO: "Penasaran bisnismu kelihatan kayak apa kalau jadi website?"
- Scene 2 (3-6s) BODY: text "Free working demo first. Pay only if you love it. No deposit."
  VO: "Kami buatin demo-nya dulu, gratis. Kamu cuma bayar kalau suka."
- Scene 3 (6-9s) CTA: text "Chat us, get your free demo"
  VO: "Chat sekarang, ambil demo gratismu."

## A7 — Free Demo Risk-Free  -> vo-angle7.mp3
- Scene 1 HOOK: text "Pay nothing until you see it."
  VO: "Nggak usah bayar dulu sampai kamu lihat hasilnya."
- Scene 2 BODY: text "Send your business name. Get a real demo page. Zero upfront."
  VO: "Kirim nama bisnismu, kami buatin halaman demo-nya. Tanpa DP, tanpa risiko."
- Scene 3 CTA: text "Get my free demo"
  VO: "Chat sekarang."

## A8 — Free Demo Fast  -> vo-angle8.mp3
- Scene 1 HOOK: text "Your demo site, ready in 3 days."
  VO: "Website demo bisnismu, jadi dalam 3 hari."
- Scene 2 BODY: text "No deposit. We design it, you decide."
  VO: "Tanpa DP. Kami desain, kamu yang putuskan."
- Scene 3 CTA: text "Start free, chat now"
  VO: "Mulai gratis, chat sekarang."

---

## After render -> upload
3 ads INTO v3 campaign. Fair test vs Contoh Gratis winner.
Once 1-2 ads confirm CTR/depth-5, pause the 2 dead ads (Original v3 + 3 Hari Jadi).
