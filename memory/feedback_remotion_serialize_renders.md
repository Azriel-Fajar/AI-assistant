---
name: Serialize Remotion Renders
description: never run two Remotion renders at once; concurrent renders collide and silently kill one mid-batch
metadata:
  type: feedback
---

Never run two Remotion render processes concurrently on the same machine.

**Why:** On 2026-06-09 a background batch render (`render-referrals.mjs`) was running while a second brand-asset re-render launched. The two remotion/Chrome processes fought for CPU and the headless browser, and the batch died mid-way (BRY10 got only 1 of 4 assets, LIN10 never started) while still reporting exit 0 — silent partial failure.

**How to apply:**
- Run renders one at a time. Wait for an in-flight render (background or foreground) to finish before starting another.
- After any batch render, verify file counts per output dir, not just exit code. Exit 0 can hide a killed sub-render.
- Foreground renders are safer than background when something else might also render.
See [[project_redesign_launch]] and [[reference_remotion_video_project]].
