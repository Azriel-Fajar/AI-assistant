---
name: Remotion Fast Paced 3s Per Frame
description: Rule for Remotion ad renders -- fast-paced, max 3 seconds per scene/frame, use new redesign theme (cream + forest green)
metadata:
  type: feedback
---

When rendering any Rielcode video/ad from Remotion (`my-video/`), follow these rules:

1. **Fast-paced.** No slow holds. Each scene/segment punchy and moving.
2. **Scene length is content-driven, not a hard cap.** ~3s is the default for body/montage scenes (fast-paced, no slow holds). But a strong hook may run longer if the content needs it. Let a good hook play as long as it lands; a couple extra seconds is fine. At fps=30, 3s = 90 frames; body scenes prefer 45-60 frames (1.5-2s). Hooks: as long as the hook works.
3. **Use the new redesign theme.** `my-video/src/RielcodeAd/theme.ts` already holds the new brand palette (bg cream #f4f1e9, green #2e4636, editorial). The last published ad used the OLD design. All new ads must use this current theme, matching the rielcode.com redesign [[project_rielcode_figma_redesign]] [[project_redesign_launch]].

**Why:** Old ad creative was slow and used the pre-redesign look. Azriel wants new ads fast-paced (max 3s/frame) and on the new website design so ads match the live brand.

**How to apply:** Build/edit compositions so no single scene exceeds 90 frames. Verify durations before rendering. Always pull colors/logo from theme.ts, never hardcode old palette. Serialize renders, never two at once [[feedback_remotion_serialize_renders]]. Reuse helpers from [[reference_remotion_video_project]].
