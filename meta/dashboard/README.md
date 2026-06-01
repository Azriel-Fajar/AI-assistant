# Meta Dashboard

Local web dashboard for monitoring Rielcode's Meta ads (last 7 days) and Facebook Page Messenger DMs in one place. Read-only.

## Run

```bash
bash meta/dashboard/run.sh
```

First run creates a venv (`meta/dashboard/.venv`) and installs Flask. Then open http://localhost:5000

Use a different port: `PORT=8000 bash meta/dashboard/run.sh`

## Credentials

Reads `JARVIS/.env` (same file the `meta/ads-report.mjs` and `meta/dms-report.mjs` CLI scripts use). Keys:

- `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` - ads card
- `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID` - DMs card
- `META_API_VERSION` - optional, defaults to `v23.0`

To create the tokens, see [meta/SETUP.md](../SETUP.md). `.env` is gitignored; never commit it.

## What it shows

- **Ads** - per-campaign spend, impressions, clicks, CTR, results (leads/purchases), 7-day total, and warning flags (spending-but-not-delivering, spend-with-zero-clicks).
- **Messenger DMs** - 20 newest conversations, last message with You/Them tag. Click a conversation for the full thread.

The **Refresh** button reloads live data. Same numbers as the CLI scripts (`node meta/ads-report.mjs`, `node meta/dms-report.mjs`).
