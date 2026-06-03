---
name: Meta Ads Dashboard
description: Flask app at meta/dashboard/; run command and how to restart it
metadata:
  type: reference
---

Flask dashboard for Meta ads + Messenger DMs.

**Run command** (from JARVIS project root):
```
python -m flask --app meta.dashboard.app run
```

Do NOT run `python app.py` directly -- fails with relative import error.

**Kill & restart** if stale process lingers on port 5000:
```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**What it shows:** All campaigns (including zero-spend), last 30 days insights, Status column, Messenger inbox.

[[project_meta_ads_wa_leadgen]]
