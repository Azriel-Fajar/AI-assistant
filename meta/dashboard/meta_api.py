"""Read-only Meta Graph API client. Ports the logic of ../ads-report.mjs and ../dms-report.mjs."""
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime

from . import config

BASE = "https://graph.facebook.com"

# In-memory TTL cache. Graph data changes slowly; serving cached results makes
# back-navigation and repeat chat clicks instant instead of a fresh API round-trip.
CACHE_TTL = 60  # seconds
_cache = {}  # key -> (expires_at, value)


def _cached(key, ttl, produce):
    now = time.time()
    hit = _cache.get(key)
    if hit and hit[0] > now:
        return hit[1]
    value = produce()
    _cache[key] = (now + ttl, value)
    return value


class MetaError(Exception):
    """Friendly, user-facing API/config error (token missing, expired, no permission)."""


def _missing(name, hint):
    raise MetaError(f"Missing {name} in .env. {hint}")


def _get(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        # Graph API returns the error JSON in the body even on 4xx.
        try:
            payload = json.loads(e.read().decode("utf-8"))
        except Exception:
            raise MetaError(f"Meta API HTTP {e.code}: {e.reason}")
    except urllib.error.URLError as e:
        raise MetaError(f"Network error reaching the Meta API: {e.reason}")

    if isinstance(payload, dict) and payload.get("error"):
        err = payload["error"]
        code = err.get("code")
        hint = ""
        if code == 190:
            hint = " -> Token invalid or expired. Regenerate it (see meta/SETUP.md)."
        elif code in (200, 10):
            hint = " -> Missing permission. Ads token needs ads_read; Page token needs pages_messaging + pages_manage_metadata."
        elif code == 100:
            hint = " -> Bad account ID or field. Check META_AD_ACCOUNT_ID is act_<digits>."
        raise MetaError(f"Meta API error (code {code}): {err.get('message')}{hint}")
    return payload


def _url(path, params):
    return f"{BASE}/{config.VERSION}/{path}?" + urllib.parse.urlencode(params)


def _fmt(iso, with_year=True):
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone()
    except (ValueError, AttributeError):
        return iso or ""
    fmt = "%b {d}, %Y, {t}:%M %p" if with_year else "%b {d}, {t}:%M %p"
    d = dt.day
    h = dt.hour % 12 or 12
    return dt.strftime(fmt).format(d=d, t=h)


# --- Ads ---

_RESULT_PRIORITY = ["lead", "purchase", "offsite_conversion.fb_pixel_lead", "link_click"]


def _results(actions):
    if not isinstance(actions, list):
        return "-"
    for t in _RESULT_PRIORITY:
        hit = next((a for a in actions if a.get("action_type") == t), None)
        if hit:
            label = t.replace("offsite_conversion.fb_pixel_", "")
            return f"{hit.get('value')} ({label})"
    if actions:
        return f"{actions[0].get('value')} ({actions[0].get('action_type')})"
    return "-"


def get_ads():
    return _cached("ads", CACHE_TTL, _get_ads)


def _get_ads():
    if not config.TOKEN:
        _missing("META_ACCESS_TOKEN", "Follow meta/SETUP.md to create a System User token.")
    if not config.ACCOUNT_ID or config.ACCOUNT_ID == "act_":
        _missing("META_AD_ACCOUNT_ID", "Should be act_<digits> from Ads Manager.")

    url = _url(
        f"{config.ACCOUNT_ID}/insights",
        {
            "level": "campaign",
            "date_preset": "last_7d",
            "limit": 100,
            "fields": "campaign_name,spend,impressions,clicks,ctr,actions",
            "access_token": config.TOKEN,
        },
    )
    rows = _get(url).get("data", [])

    campaigns, flags, total = [], [], 0.0
    for r in rows:
        spend = float(r.get("spend") or 0)
        impr = int(float(r.get("impressions") or 0))
        clicks = int(float(r.get("clicks") or 0))
        total += spend
        name = r.get("campaign_name") or "(unnamed)"
        campaigns.append(
            {
                "campaign": name,
                "spend": round(spend, 2),
                "impressions": impr,
                "clicks": clicks,
                "ctr": round(float(r.get("ctr") or 0), 2),
                "results": _results(r.get("actions")),
            }
        )
        if spend > 0 and impr == 0:
            flags.append(f"spending but not delivering: {name}")
        if spend > 0 and clicks == 0:
            flags.append(f"spend with zero clicks: {name}")

    return {"campaigns": campaigns, "total_spend": round(total, 2), "flags": flags, "account": config.ACCOUNT_ID}


# --- DMs ---


def _require_page():
    if not config.PAGE_TOKEN:
        _missing("META_PAGE_ACCESS_TOKEN", "Need a Page access token with pages_messaging.")
    if not config.PAGE_ID:
        _missing("META_PAGE_ID", "Your numeric Facebook Page ID.")


def get_dms(limit=20):
    return _cached("dms", CACHE_TTL, lambda: _get_dms(limit))


def _get_dms(limit):
    _require_page()
    convo = _get(
        _url(
            f"{config.PAGE_ID}/conversations",
            {
                "fields": "id,updated_time,participants,message_count",
                "limit": limit,
                "access_token": config.PAGE_TOKEN,
            },
        )
    )
    threads = []
    for t in convo.get("data", []):
        parts = (t.get("participants") or {}).get("data", [])
        sender = next((p.get("name") for p in parts if p.get("id") != config.PAGE_ID), None) or "(unknown)"

        last_text, direction = "(could not load)", "[Them]"
        msgs = _get(
            _url(
                f"{t['id']}/messages",
                {"fields": "message,from,created_time", "limit": 1, "access_token": config.PAGE_TOKEN},
            )
        ).get("data", [])
        if msgs:
            m = msgs[0]
            last_text = (m.get("message") or "(no text - attachment?)")[:120]
            from_name = (m.get("from") or {}).get("name") or ""
            direction = "[You]" if from_name and from_name != sender else "[Them]"

        threads.append(
            {
                "id": t["id"],
                "name": sender,
                "updated": _fmt(t.get("updated_time")),
                "msg_count": t.get("message_count") or 0,
                "last_direction": direction,
                "last_text": last_text,
            }
        )
    return {"threads": threads, "page": config.PAGE_ID}


def _fetch_messages(tid, sender):
    """Ordered (oldest-first) message history for a known conversation id."""
    raw = _get(
        _url(
            f"{tid}/messages",
            {"fields": "message,from,created_time,attachments", "limit": 50, "access_token": config.PAGE_TOKEN},
        )
    ).get("data", [])
    messages = []
    for m in reversed(raw):  # oldest first
        from_name = (m.get("from") or {}).get("name") or ""
        messages.append(
            {
                "time": _fmt(m.get("created_time"), with_year=False),
                "direction": "[Them]" if from_name == sender else "[You]",
                "text": m.get("message") or ("(attachment)" if m.get("attachments") else "(empty)"),
            }
        )
    return messages


def get_thread_by_id(tid, name):
    """Fast path: messages for a conversation id already known from the inbox list.
    Skips the re-fetch-all-conversations scan that get_thread(name) needs."""
    return _cached(
        f"thread:{tid}",
        CACHE_TTL,
        lambda: (_require_page(), {"name": name, "messages": _fetch_messages(tid, name)})[1],
    )


def get_thread(name):
    """Full ordered (oldest-first) message history for the first thread matching `name`.
    Fallback for direct/shared links that carry no conversation id."""
    _require_page()
    needle = (name or "").lower()
    convo = _get(
        _url(
            f"{config.PAGE_ID}/conversations",
            {"fields": "id,updated_time,participants,message_count", "limit": 20, "access_token": config.PAGE_TOKEN},
        )
    )
    for t in convo.get("data", []):
        parts = (t.get("participants") or {}).get("data", [])
        sender = next((p.get("name") for p in parts if p.get("id") != config.PAGE_ID), None) or "(unknown)"
        if needle not in sender.lower():
            continue
        return {"name": sender, "updated": _fmt(t.get("updated_time")), "messages": _fetch_messages(t["id"], sender)}
    raise MetaError(f'No conversation found matching "{name}".')
