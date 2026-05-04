import os
import base64
import json
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
GOOGLE_CALENDAR_ID = os.environ["GOOGLE_CALENDAR_ID"]
TIMEZONE = os.getenv("TIMEZONE", "Asia/Jakarta")

# Validate at import time that the var exists (actual decode happens at call time)
if "GOOGLE_SERVICE_ACCOUNT_JSON" not in os.environ:
    raise EnvironmentError("GOOGLE_SERVICE_ACCOUNT_JSON env var is required")

def get_service_account_info() -> dict:
    raw = os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"]
    try:
        decoded = base64.b64decode(raw).decode("utf-8")
    except Exception:
        raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON must be a valid base64-encoded string")
    try:
        return json.loads(decoded)
    except json.JSONDecodeError as e:
        raise ValueError(f"GOOGLE_SERVICE_ACCOUNT_JSON decoded to invalid JSON: {e}")
