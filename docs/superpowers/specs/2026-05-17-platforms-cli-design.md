# Platforms CLI Design Spec
_Date: 2026-05-17_

## Overview

Four CLI tools for Figma, YouTube, Instagram, and TikTok. Split across two packages:
- `tools/figma/` — Figma design tool (`figma` command), PAT auth. Single account serves dual purpose: college project designs + Rielcode mobile app mockups.
- `tools/social/` — Instagram + TikTok (`ig`, `tt` commands), OAuth auth

YouTube extends the existing `tools/google/` package — shares Google OAuth already used by `gcal`, `gmail`, `gdrive`. Adds a `yt` command and YouTube API scope to the existing auth flow.

---

## Architecture

```
tools/
├── google/                   # existing package — extended
│   ├── auth/
│   │   └── oauth.js          # adds YouTube scope to existing scopes
│   ├── youtube/
│   │   └── index.js          # yt entry point + all commands
│   └── package.json          # adds bin: { yt }
│
├── social/                   # new package
│   ├── package.json          # bin: { ig, tt }
│   ├── config.json           # gitignored: Meta app id/secret, TikTok app id/secret
│   ├── auth/
│   │   ├── instagram.js      # Meta OAuth2 flow, token storage, auto-refresh
│   │   ├── tiktok.js         # TikTok OAuth2 flow, token storage, auto-refresh
│   │   └── tokens.json       # gitignored
│   ├── lib/
│   │   ├── output.js         # colored tables + --json flag (same pattern as google)
│   │   └── error.js          # shared error handling, exit codes
│   ├── instagram/
│   │   └── index.js
│   └── tiktok/
│       └── index.js
│
└── figma/                    # new package
    ├── package.json          # bin: { figma }
    ├── config.json           # gitignored: PAT token storage
    ├── auth/
    │   └── token.js          # store/retrieve PAT, validate on startup
    ├── lib/
    │   ├── output.js
    │   └── error.js
    └── figma/
        └── index.js
```

---

## Authentication

### YouTube (`yt`)
- Shares `tools/google/auth/oauth.js`
- Adds `https://www.googleapis.com/auth/youtube` to existing OAuth scopes
- Re-running `gcal auth` (or new `yt auth`) picks up the new scope
- No separate token file — uses existing `tools/google/auth/tokens.json`

### Instagram (`ig`)
- Meta OAuth2, Desktop app type
- Scopes: `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_messages`
- First-time: `ig auth` opens browser → Meta consent screen
- Token saved to `tools/social/auth/tokens.json`
- Auto-refresh on expiry

### TikTok (`tt`)
- TikTok OAuth2
- Scopes: `user.info.basic`, `video.upload`, `video.list`, `comment.list`, `comment.create`, `message.send`
- First-time: `tt auth` opens browser → TikTok consent screen
- Token saved to `tools/social/auth/tokens.json`
- Auto-refresh on expiry

### Figma (`figma`)
- Personal Access Token (PAT) — no OAuth needed
- `figma auth --token <pat>` stores token to `tools/figma/config.json`
- Token validated on every command startup with a lightweight `/me` check

---

## Commands

### yt (YouTube)

```
yt auth                                              # re-run Google OAuth with YouTube scope
yt upload <file> --title <t> --description <d>       # upload video
         [--tags <tag1,tag2>] [--privacy public|private|unlisted]
yt list [--limit <n>]                                # list channel videos
yt analytics [--video <id>] [--period 7d|30d|90d]   # channel or video analytics
yt comments list <video-id>                          # list comments on video
yt comments reply <comment-id> --body <b>            # reply to comment
yt comments delete <comment-id>                      # delete comment
yt search <query>                                    # search YouTube
```

### ig (Instagram)

```
ig auth                                              # Meta OAuth setup (DM scope requires Meta app review)
ig post --image <path> --caption <text>              # create feed post
        [--tags <#tag1 #tag2>]
ig reels --video <path> --caption <text>             # post Reel
         [--tags <#tag1 #tag2>] [--cover <image-path>]
ig stories --image <path> [--caption <text>]         # create story
ig list [--limit <n>]                                # list posts
ig analytics [--post <id>] [--period 7d|30d]         # account or post insights
ig comments list <post-id>                           # list comments on post
ig comments reply <comment-id> --body <b>            # reply to comment
ig comments delete <comment-id>                      # delete comment
ig dms list                                          # list DM threads
ig dms read <thread-id>                              # read DM thread
ig dms send <thread-id> --body <b>                   # send DM reply
```

### tt (TikTok)

```
tt auth                                              # TikTok OAuth setup
tt upload <file> --title <t> --description <d>       # upload video
         [--privacy public|private|friends]
tt list [--limit <n>]                                # list posted videos
tt analytics [--video <id>] [--period 7d|30d]        # account or video analytics
tt comments list <video-id>                          # list comments on video
tt comments reply <comment-id> --body <b>            # reply to comment
tt dms list                                          # list DM conversations
tt dms read <conversation-id>                        # read DM conversation
tt dms send <conversation-id> --body <b>             # send DM reply
```

### figma

```
figma auth --token <pat>                             # store PAT
figma files [--team <team-id>]                       # list Figma files
figma export <file-id> [--node <node-id>]            # export assets
            [--format png|svg|pdf] [--out <path>]
figma inspect <file-id> [--node <node-id>]           # print design properties (colors, fonts, spacing)
figma download <file-id> --out <path>                # download raw .fig file
figma comments list <file-id>                        # list comments on file
figma comments add <file-id> --message <m>           # add comment
figma versions <file-id>                             # list version history
```

---

## Output

Same pattern as Google CLIs.

**Default (colored table):**
```
┌──────────────────────┬──────────┬─────────┬──────────┐
│ Title                │ Views    │ Likes   │ Date     │
├──────────────────────┼──────────┼─────────┼──────────┤
│ Rielcode Intro Short │ 1,204    │ 87      │ May 15   │
└──────────────────────┴──────────┴─────────┴──────────┘
```

**`--json` flag:**
```json
[{ "title": "Rielcode Intro Short", "views": 1204, "likes": 87, "date": "2026-05-15" }]
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| No token / PAT | `"Run '<cmd> auth' first"` |
| Token expired | Auto-refresh, silent retry |
| OAuth revoked | Prompt re-auth |
| Upload fail | Show API error, exit non-zero |
| Rate limit hit | `"Rate limit reached. Retry after <time>."` |
| No internet | `"No connection. Check network."` |
| Invalid file path | `"File not found: <path>"` |
| All errors | Non-zero exit code |

**`--debug` flag:** shows raw API request/response.

---

## Safety Rails

- Delete/remove operations confirm: `"Delete comment '<preview>'? (y/n)"`
- Video upload confirms title + privacy before uploading
- `--yolo` flag skips all confirmations

---

## Config

**`tools/social/config.json`** (gitignored):
```json
{
  "meta_app_id": "...",
  "meta_app_secret": "...",
  "tiktok_app_id": "...",
  "tiktok_app_secret": "..."
}
```

**`tools/figma/config.json`** (gitignored):
```json
{
  "figma_pat": "..."
}
```

---

## Setup (First Time)

### YouTube
```powershell
# 1. Google Cloud Console
#    - Enable YouTube Data API v3 on existing project
#    - No new credentials needed (reuse existing OAuth client)

# 2. Re-auth to pick up YouTube scope
yt auth   # or: gcal auth (same flow)
```

### Instagram
```powershell
# 1. Meta Developer Console
#    - Create app → Instagram product → get App ID + Secret
#    - Copy to tools/social/config.json

# 2. Install + link
cd tools/social
npm install
npm link

# 3. Auth
ig auth
```

### TikTok
```powershell
# 1. TikTok Developer Portal
#    - Create app, enable required scopes
#    - Copy App ID + Secret to tools/social/config.json

# 2. Already installed via social package
tt auth
```

### Figma
```powershell
# 1. Figma → Settings → Personal Access Tokens → Generate token

# 2. Install + link
cd tools/figma
npm install
npm link

# 3. Auth
figma auth --token <your-token>
```

---

## Dependencies

### tools/google (additions)
No new dependencies — YouTube Data API uses same `googleapis` package.

### tools/social
```json
{
  "axios": "^1.6.0",
  "chalk": "^5.0.0",
  "cli-table3": "^0.6.0",
  "commander": "^12.0.0",
  "open": "^10.0.0"
}
```
_(Meta and TikTok APIs use REST, not official Node SDKs — axios preferred)_

### tools/figma
```json
{
  "axios": "^1.6.0",
  "chalk": "^5.0.0",
  "cli-table3": "^0.6.0",
  "commander": "^12.0.0",
  "form-data": "^4.0.0"
}
```

---

## Gitignore Additions

```
tools/social/auth/tokens.json
tools/social/config.json
tools/figma/config.json
```

---

## Out of Scope (Phase 1)

- Scheduling posts (post at a future time)
- Bulk upload / batch operations
- TikTok Live
- Figma plugin development
- Multi-account support (any platform)
- NL layer inside CLI (Claude handles this externally)
