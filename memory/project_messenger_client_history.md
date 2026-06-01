---
name: project_messenger_client_history
description: Rielcode Facebook Messenger client conversations are synced to meta/clients/ - read them when asked about a lead
metadata:
  type: project
---

Rielcode's Facebook Page Messenger conversations are exported to `meta/clients/` as one markdown file per client (full message history, oldest-first), with a roster in `meta/clients/index.md`.

**When Azriel asks about a lead, client, or "what did X say", read the relevant file in `meta/clients/` first** before answering. The index lists everyone by last-active date.

Refresh with `node meta/dms-sync.mjs` (re-pulls all threads, updates files, adds new clients). The script needs a Page access token in `.env` (see [[project_meta_ads_wa_leadgen]] and meta/SETUP.md). These files are committed to the repo so history is available on any device.

**Why:** gives the assistant real context on each lead - who they are, what they asked, quotes given (e.g. "IDR 500,000 or $30"), and where the conversation stands.
