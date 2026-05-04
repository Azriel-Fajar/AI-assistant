# Homework Bot

Telegram bot: send "Stats homework due Friday" → adds deadline + study blocks to Google Calendar.

## Setup

### 1. Create Telegram Bot
1. Open Telegram, search @BotFather
2. Send `/newbot`, follow prompts, copy the token

### 2. Create Google Service Account
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project, enable Google Calendar API
3. IAM & Admin > Service Accounts > Create
4. Download JSON key
5. Base64 encode it:
   - Linux/Mac: `base64 -i service-account.json | tr -d '\n'`
   - Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))`
6. Share your Google Calendar with the service account email (give "Make changes to events" permission)

### 3. Local Development
```bash
cp .env.example .env
# Fill in .env values
pip install -r requirements.txt
python main.py
```

### 4. Deploy to Railway
1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) > New Project > Deploy from GitHub
3. Add these env vars in the Railway Variables tab:
   - `TELEGRAM_BOT_TOKEN`
   - `GOOGLE_CALENDAR_ID`
   - `GOOGLE_SERVICE_ACCOUNT_JSON` (base64-encoded JSON)
   - `TIMEZONE` (e.g. `Asia/Jakarta`)
4. Deploy — Railway auto-detects Procfile and starts `python main.py`
5. Check Deploy Logs — should see "Bot starting..."

## Usage

Send any message in this format:
```
<subject> due <date>
```

Examples:
- `Stats homework due Friday`
- `Probability assignment due in 7 days`
- `Web dev project due May 15`

Bot replies with confirmation and adds 3 events to Google Calendar:
- All-day deadline event
- Study block 2 days before (8-10 PM, with reminder)
- Study block 1 day before (8-10 PM)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `GOOGLE_CALENDAR_ID` | From Google Calendar settings > Integrate calendar |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Base64-encoded service account JSON |
| `TIMEZONE` | IANA timezone string (default: `Asia/Jakarta`) |

## Security

- Never commit `.env` or your service account JSON file — both are in `.gitignore`
- Grant the service account only "Make changes to events" on your specific calendar, not project-wide IAM roles
- The base64-encoded service account JSON is sensitive — treat it like a password

## Running Tests
```bash
pytest tests/ -v
```
