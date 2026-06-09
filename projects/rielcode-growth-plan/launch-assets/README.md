# Launch Assets — Rielcode Redesign (2026-06-10)

All built via Remotion (`my-video/src/RielcodeAd/LaunchAd.tsx`). Brand theme reused (cream + forest green, Playfair serif + Inter). Code `LAUNCH10`, 10% off any package, valid through 30 June 2026. Captions baked on-screen, work muted.

## Files

| File | Size | Use | Notes |
|------|------|-----|-------|
| `launch-reel-9x16.mp4` | 1080x1920, 18s | IG Reel + TikTok | 4 scenes: hook > site reveal (scroll-pan of real redesign) > code > CTA |
| `launch-feed-4x5.mp4` | 1080x1350, 5s | IG feed post | "New site is live" + LAUNCH10 badge |
| `launch-story-9x16.mp4` | 1080x1920, 5s | IG/FB Story | code badge + "Link in bio" |
| `launch-wa-9x16.mp4` | 1080x1920, 5s | WhatsApp Status broadcast | green block + code + "Reply to get yours" |
| `v-*.png` | — | verify frames only | not for posting |

## Source footage
- Real redesign captured from local `http://127.0.0.1:8000/en/` -> `my-video/public/site-redesign.png` (1920x5557). Reel pans it inside browser chrome = scroll-through.
- **Before posting:** if site changed after capture, re-screenshot live rielcode.com, overwrite `site-redesign.png`, re-render Reel.

## Re-render
```
cd my-video
npx remotion render Launch-Reel-9x16 out/launch-reel-9x16.mp4
npx remotion render Launch-Feed-4x5 out/launch-feed-4x5.mp4
npx remotion render Launch-Story-9x16 out/launch-story-9x16.mp4
npx remotion render Launch-WA-9x16 out/launch-wa-9x16.mp4
```

## Optional
- Reel has NO voiceover track (silent + baked captions). Add 15-20s English VO over visuals if recording clean audio in time (plan recommends founder voice).

## Captions
See `../launch-2026-06-10-captions.md` (ID + EN per platform).
