# Google CLI Design Spec
_Date: 2026-05-17_

## Overview

Three separate CLI tools (`gcal`, `gmail`, `gdrive`) for Google Calendar, Gmail, and Google Drive. Live in `tools/google/` inside JARVIS repo, installed globally via `npm link`. No NL layer -- Claude handles natural language translation, CLIs use structured commands.

---

## Architecture

```
tools/google/
├── package.json          # bin: { gcal, gmail, gdrive }
├── config.json           # gitignored: google client id/secret, timezone
├── auth/
│   ├── oauth.js          # OAuth2 flow, token storage, auto-refresh
│   └── tokens.json       # gitignored: stored credentials
├── lib/
│   ├── output.js         # colored tables (cli-table3 + chalk) + --json flag
│   └── error.js          # shared error handling, exit codes
├── gcal/
│   └── index.js          # gcal entry point + all commands
├── gmail/
│   └── index.js          # gmail entry point + all commands
└── gdrive/
    └── index.js          # gdrive entry point + all commands
```

---

## Authentication

- Shared OAuth2 module (`auth/oauth.js`) used by all three CLIs
- First-time: `gcal auth` opens browser → Google OAuth consent screen
- Token saved to `auth/tokens.json`
- Auto-refresh on expiry, silent retry
- One auth covers all three CLIs (scopes combined at login)

**OAuth scopes:**
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/drive`

---

## Natural Language

None built into the CLI. Claude (in JARVIS) translates user's natural language into structured CLI commands and executes them. CLIs are purely structured commands.

---

## Commands

### gcal

```
gcal auth                                          # OAuth setup
gcal list [--date today|week|<date>]               # list events
gcal add --title <t> --date <d> --time <t> [--duration <m>] [--attendees <emails>]
gcal update <event-id> [--title] [--date] [--time]
gcal delete <event-id>
gcal search <query>
gcal remind --event <id> --before <minutes>
gcal recurring --list
gcal recurring --add --title <t> --freq daily|weekly|monthly --time <t>
```

### gmail

```
gmail list [--unread] [--label <label>]
gmail read <message-id>
gmail send --to <email> --subject <s> --body <b>
gmail reply <message-id> --body <b>
gmail delete <message-id>
gmail search <query>
gmail label --list
gmail label --add <message-id> --name <label>
gmail drafts --list
gmail drafts --send <draft-id>
gmail attachment --download <message-id> [--out <path>]
```

### gdrive

```
gdrive list [--folder <name>]
gdrive upload <local-path> [--to <folder>]
gdrive download <file-id|name> [--out <path>]
gdrive delete <file-id>
gdrive search <query>
gdrive share <file-id> --with <email> --role viewer|editor|commenter
gdrive move <file-id> --to <folder>
gdrive copy <file-id> --to <folder>
gdrive permissions --list <file-id>
gdrive permissions --remove <file-id> --user <email>
```

---

## Output

**Default (colored table):**
```
┌─────────────────────┬──────────────┬───────────┐
│ Title               │ Date         │ Time      │
├─────────────────────┼──────────────┼───────────┤
│ Ali client call     │ May 18       │ 3:00 PM   │
└─────────────────────┴──────────────┴───────────┘
```

**`--json` flag (machine-readable):**
```json
[{ "title": "Ali client call", "date": "2026-05-18", "time": "15:00" }]
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| No token | `"Run 'gcal auth' first"` |
| Token expired | Auto-refresh, silent retry |
| OAuth revoked | Prompt re-auth |
| Event not found | `"No matching event. Try: gcal list --date week"` |
| Gmail send fail | Auto-save to drafts, notify user |
| Drive permission denied | Show which permission is missing |
| No internet | `"No connection. Check network."` |
| All errors | Non-zero exit code |

**`--debug` flag:** shows raw Google API request/response for troubleshooting.

---

## Safety Rails

- Delete operations confirm: `"Delete 'Ali client call'? (y/n)"`
- Send email confirms recipient + subject before sending
- `--yolo` flag skips all confirmations

---

## Config

`tools/google/config.json` (gitignored):
```json
{
  "google_client_id": "...",
  "google_client_secret": "...",
  "default_timezone": "Asia/Jakarta"
}
```

---

## Setup (First Time)

```powershell
# 1. Google Cloud Console (one-time ~5 min)
#    - Create project
#    - Enable Calendar API, Gmail API, Drive API
#    - Create OAuth 2.0 credentials (Desktop app type)
#    - Copy client ID + secret to config.json

# 2. Install
cd tools/google
npm install
npm link

# 3. Auth (covers all three CLIs)
gcal auth
```

---

## Dependencies

```json
{
  "googleapis": "^140.0.0",
  "chalk": "^5.0.0",
  "cli-table3": "^0.6.0",
  "commander": "^12.0.0",
  "open": "^10.0.0"
}
```

---

## Gitignore Additions

```
tools/google/auth/tokens.json
tools/google/config.json
```

---

## Out of Scope (Phase 1)

- NL layer inside CLI (Claude handles this externally)
- Figma, YouTube, Instagram, TikTok CLIs (separate specs)
- Multi-account Google support
- Offline mode / caching
