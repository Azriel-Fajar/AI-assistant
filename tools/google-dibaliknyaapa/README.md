# Google tools: @intipbaliknya

YouTube stats for the @intipbaliknya channel (formerly @intipbaliknya; folder name kept, token is tied to the Google account), logged in as the channel's own Google account. Separate from `tools/google` (Azriel's main account). No `npm install`: Node 18+ only.

## Google Cloud setup (one-time, new account)

1. https://console.cloud.google.com, signed in as the channel's account, in the project with YouTube Data API v3 enabled. Also enable **YouTube Analytics API**.
2. **Google Auth Platform → Branding/Audience** (OAuth consent screen): User type **External**, fill app name + email. Under **Audience**, click **Publish app** (In production). In Testing mode the login expires every 7 days, which breaks the daily run.
3. **Clients → Create client → Desktop app**. Download the JSON and save it here as `credentials.json`.

## Log in

```
node tools/google-dibaliknyaapa/auth.js
```

Google warns "app isn't verified": **Advanced → Go to (app)**. Pick the @intipbaliknya channel (formerly @intipbaliknya; folder name kept, token is tied to the Google account). Token lands in `tokens.json`.

## Use

```
node tools/google-dibaliknyaapa/stats.js
```

JSON: channel, subscribers, and every video (id, title, published, status, views, likes, comments), oldest first. Each video also has `analytics` (avg view seconds and %, engaged views, shares, subscribers gained, retention at 5/25/50/75%/end): `null` until YouTube Analytics has data, 2-3 days after upload.

`credentials.json` and `tokens.json` are gitignored. Never commit them.
