---
name: Parallaxnet AIOS Project
description: PT Parallaxnet Siber Indonesia AIOS workspace + PHP dashboard; locations, stack, pending items
metadata:
  type: project
---

PT. Parallaxnet Siber Indonesia (EdTech, parallaxnet.id) engaged Azriel 2026-06-11 to build their AI operating system + data dashboard. No payment negotiation, pure execution, trust-building phase.

- AIOS workspace: `C:\Users\afw14\OneDrive\Documents\Parallaxnet AI` (own git repo, own CLAUDE.md with self-learning protocol + strict no-em-dash rule). Skills: meeting-notes, data-import, dashboard-report, follow-up-tracker, audio-to-text.
- Dashboard: `C:\xampp\htdocs\parallaxnet-dashboard`, pure PHP 8 + MySQL db `parallaxnet_dashboard` + Chart.js + Bootstrap 5, Indonesian UI. Local login admin / parallaxnet2026. Verified end-to-end with Playwright 2026-06-11 (charts, 6-month cert alerts, CSV import with mapping preview + dedupe-update).
- Hosting: RumahWeb shared (PHP+MySQL only), target subdomain of parallaxnet.id, Azriel has cPanel. Steps in dashboard `DEPLOY.md`. See [[Rumahweb Hosting]] constraints.
- Audio transcription: `tools/transcribe.py` in workspace, faster-whisper on GPU (see [[Faster-Whisper Local Setup]]).

**Why:** active client engagement, second Parallaxnet-family client after Canada (Ali).

**How to apply:** waiting on master Excel from Yurika (swap mock data via /data-import) and subdomain name from Pak Wibowo before deploy. Key people: Pak Wibowo (ops lead), Pak Joko (CEO), Yurika (master data), Intan/Fatwa (data entry), Mazhar Durrani (US CEO). Phase 2 deferred: AI prediction layer, LMS integration.
