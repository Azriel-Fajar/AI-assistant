---
name: reference_meta_dashboard
description: Meta Ads dashboard -- Flask app location, how it works, how to check live campaign data
metadata:
  type: reference
---

Meta Ads dashboard is a Flask app at `meta/dashboard/` in the JARVIS repo.

**Key files:**
- `meta/dashboard/app.py` -- Flask routes (`/`, `/api/ads`, `/api/dms`, `/api/thread`)
- `meta/dashboard/meta_api.py` -- Graph API client (ads + Messenger DMs)
- `meta/dashboard/templates/index.html` -- UI: ad performance table + Messenger inbox
- `meta/dashboard/config.py` -- reads `.env` for tokens

**How it works:**
- Pulls live data from Meta Graph API (campaign-level, last 7 days)
- Auto-shows all campaigns with spend -- no hardcoded list, no manual updates needed
- 60s TTL in-memory cache
- New campaigns appear automatically on next refresh

**To check live data without running the dashboard:**
```bash
node meta/ads-report.mjs
```

**Ad account:** `act_4261716744142144`

**How to apply:** When user mentions "meta ads dashboard", read `meta/dashboard/app.py` and run `node meta/ads-report.mjs` to pull current campaign data.
