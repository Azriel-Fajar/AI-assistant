---
name: Remotion Video Project
description: my-video/ is the Remotion project for all Rielcode video/ad assets; reuse theme + helpers
metadata:
  type: reference
---

Rielcode video assets are built with Remotion in `my-video/` (root of JARVIS). Render from there: `cd my-video && npx remotion render <CompositionId> out/<file>.mp4`.

Key files:
- `src/Root.tsx` — registers all compositions (Folders: Launch, Promo, Angles).
- `src/RielcodeAd/theme.ts` — brand tokens (cream `#f4f1e9`, forest green `#2e4636`, Playfair serif + Inter sans). Reuse, do not reinvent.
- `src/RielcodeAd/PromoAd.tsx` — 4-orientation promo ad (9x16, 4x5, 1x1, 16x9). Good base to copy from.
- `src/RielcodeAd/LaunchAd.tsx` — redesign launch assets (Reel + Feed + Story + WA).
- `public/` — static assets: logo `rielcode-rielcode-cream-on-transparent.png`, `music.mp3`, VO mp3s, screenshots.

Reuse helpers from PromoAd/LaunchAd: `reveal()`, `sp()` spring, `LogoMark`, `Rule`, `Label`, `CodeBadge`. Captions baked on-screen so video works muted.

`@remotion/google-fonts` is in package.json but went missing from node_modules once; if render errors "Cannot find module @remotion/google-fonts", run `npm install @remotion/google-fonts@<remotion version>` in `my-video/`.

Verify renders by extracting stills: `npx remotion still <Id> out/check.png --frame=N`, then Read the PNG. Check audio track present via `@remotion/media-parser` (`tracks` field). See [[project_rielcode_q3_rebuild]].
