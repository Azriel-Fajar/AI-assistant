"""Tiny .env reader, mirrors the loader in ../ads-report.mjs (no python-dotenv dep)."""
import os
import re

# JARVIS root = two levels up from this file (meta/dashboard/config.py -> JARVIS/).
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_LINE = re.compile(r"^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$")


def _load_env():
    out = {}
    try:
        with open(os.path.join(ROOT, ".env"), encoding="utf-8") as fh:
            for line in fh:
                m = _LINE.match(line)
                if not m:
                    continue
                v = m.group(2)
                if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                    v = v[1:-1]
                out[m.group(1)] = v
    except FileNotFoundError:
        pass  # missing keys surface as friendly errors downstream
    return out


_env = _load_env()


def _get(key):
    return _env.get(key) or os.environ.get(key)


TOKEN = _get("META_ACCESS_TOKEN")
PAGE_TOKEN = _get("META_PAGE_ACCESS_TOKEN") or TOKEN
_account = _get("META_AD_ACCOUNT_ID") or ""
ACCOUNT_ID = _account if _account.startswith("act_") else ("act_" + _account if _account else "")
PAGE_ID = _get("META_PAGE_ID")
VERSION = _get("META_API_VERSION") or "v23.0"
