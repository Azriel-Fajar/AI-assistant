# Meta Ads reporting - one-time setup

Goal: get a read-only token so `node meta/ads-report.mjs` can pull your campaign spend and results.

You only need two Meta products: **Marketing API** (umbrella) and **Ads Insights API** (the read endpoint, part of Marketing API). Skip Conversions API, Commerce API, Catalog API, and Signals Gateway. None are needed to check ads.

## Steps (you do these once)

### 0. Register as a Meta developer (first time only)
- Go to https://developers.facebook.com/ -> Get Started.
- Phone verify gotcha: if "Send Verification SMS" errors with "complete this action in Accounts Center", open the **Accounts Center** link and confirm your phone there first, OR use the "adding a credit card" option to verify instead (no charge for verification).
- Role question: pick **Developer**. Finish registration.

### 1. Create a Business app
- https://developers.facebook.com/apps/ -> Create app.
- App name: something internal like `rielcode-reporting` (no "facebook"/"meta"/"instagram" in the name, Meta rejects those).
- Use case: **Create & manage ads with Marketing API** (this includes Ads Insights). Skip the others.
- Link it to your Rielcode business. "Unverified business" is fine for reporting your own ad account. Create app.

### 2. Create the System User
- https://business.facebook.com/ -> Business Settings -> Users -> **System Users** -> Add -> name it (e.g. "rielcode-reporting").

### 3. IMPORTANT - do BOTH grants BEFORE generating the token
The token only offers permissions the System User actually has. Skip either step below and the token wizard shows "No permissions available".

**3a. Add the System User to the app (app role):**
- Business Settings -> Accounts -> **Apps** -> select `rielcode-reporting` -> Add People / Assign -> pick the System User -> Full control (or Develop) -> Save.

**3b. Assign the Ad Account asset:**
- Business Settings -> Accounts -> **Ad Accounts** -> select your account -> Assign the System User -> at least **View Performance**.

### 4. Generate the token (read-only)
- System Users -> select the user -> **Generate Token**.
- Select app: `rielcode-reporting`.
- Expiry: **Never** (System User tokens support this; keeps reporting working without re-issuing).
- Permissions, check these TWO only:
  - `ads_read`
  - `business_management`
  - Do NOT add `ads_management` unless you later want the assistant to actually change budgets/campaigns. Read-only = if the token leaks, nobody can spend your money or alter campaigns. Upgrade later in 2 min by re-issuing with `ads_management`.
- **Copy the token now.** Meta shows it once. This is your `META_ACCESS_TOKEN`.

### 5. Find your Ad Account ID
- Open Ads Manager. Top of the page shows `Account: 123456789...`.
- Your `META_AD_ACCOUNT_ID` is that number prefixed with `act_`, e.g. `act_123456789`. The bare placeholder `act_` will error.

## 6. Put the values in .env (NOT committed)

Add to `/opt/lampp/htdocs/rielcode-laravel/.env` (already gitignored):

```
META_ACCESS_TOKEN=your-system-user-token-here
META_AD_ACCOUNT_ID=act_123456789
META_API_VERSION=v23.0
```

`META_API_VERSION`: `v23.0` is a stable supported version. Latest is `v25.0` (Feb 2026) if you want to bump it; the script works on any of them.

## 7. Test

```
node meta/ads-report.mjs
```

You should see a table of campaigns with spend, impressions, clicks, CTR, and results for the last 7 days. If the token is wrong or expired, the script prints exactly what to fix.

## Security
- The token is a password to your ad account. It lives only in `.env`, which git ignores. Never paste it into chat, commit it, or share a screenshot of it.
- If a token ever leaks, regenerate it in Business Settings -> System Users (step 4); the old one dies.

Refs:
- Insights API: https://developers.facebook.com/docs/marketing-api/insights/
- Marketing API changelog: https://developers.facebook.com/docs/graph-api/changelog
