---
name: reference-manim-setup
description: Manim animation library install + Rielcode ad starter scene location and render commands
metadata:
  type: reference
---

Manim Community v0.20.1 installed as global uv tool, pinned to Python 3.13 (Python 3.14 fails: glcontext needs C++ build tools, no prebuilt wheel). FFmpeg 8.1.1 via winget (Gyan.FFmpeg).

Gotcha: Smart App Control (Windows) blocked PyAV DLLs ("Application Control policy has blocked this file"). Had to disable SAC (permanent, no re-enable without OS reinstall). No reboot needed after.

`manim` command works from any folder. Starter Rielcode ad scene at manim-ads/rielcode_ad.py (brand tokens from [[reference_rielcode_rebrand_assets]] / my-video theme.ts: cream #f4f1e9, forest green #2e4636, Fraunces + Inter).

Render: `manim -ql f.py Scene` (480p preview), `-qh` (1080p), `-qh -r 1080,1920` (vertical reels). Output in media/videos/. LaTeX not installed (only needed for Tex/MathTex, not Text).
