# Google CLI Tools

Three CLI tools: `gcal` (Calendar), `gmail` (Gmail), `gdrive` (Drive).

## Google Cloud Setup (one-time, ~5 min)

1. Go to https://console.cloud.google.com
2. Create a new project (e.g. "jarvis-google-cli")
3. Enable these APIs:
   - Google Calendar API
   - Gmail API
   - Google Drive API
4. Go to APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: **Desktop app**
6. Download the credentials, copy client_id and client_secret

## Config

Copy config into `tools/google/config.json`:

```json
{
  "google_client_id": "YOUR_CLIENT_ID",
  "google_client_secret": "YOUR_CLIENT_SECRET",
  "default_timezone": "Asia/Jakarta"
}
```

## Install

```powershell
cd tools/google
npm install
npm link
gcal auth
```

One auth covers all three CLIs.

## Usage

```
gcal list --date today
gcal add --title "Meeting" --date tomorrow --time 15:00
gmail list --unread
gmail send --to ali@email.com --subject "Update" --body "Here's the update"
gdrive list
gdrive upload --file invoice.pdf --to Rielcode/invoices
```

Add `--json` to any command for machine-readable output.
Add `--yolo` to skip confirmations on delete/send.
