import re
from datetime import date, datetime
from typing import Optional
import dateparser

_DUE_PATTERN = re.compile(
    r"^(.+?)\s+due\s+(.+)$",
    re.IGNORECASE
)

_NOISE = re.compile(r"\b(homework|assignment|project|task)\b", re.IGNORECASE)

def parse_homework(text: str, now: Optional[datetime] = None) -> Optional[dict]:
    """
    Parse a natural-language homework message.
    Returns {"subject": str, "due_date": date} or None if date unparseable.
    `now` allows callers to inject the current datetime for testability.
    """
    match = _DUE_PATTERN.match(text.strip())
    if not match:
        return None

    raw_subject, raw_date = match.group(1).strip(), match.group(2).strip()

    settings = {
        "PREFER_DATES_FROM": "future",
        "RETURN_AS_TIMEZONE_AWARE": False,
        "TIMEZONE": "Asia/Jakarta",
    }
    if now is not None:
        settings["RELATIVE_BASE"] = now

    parsed_date = dateparser.parse(raw_date, settings=settings)
    if parsed_date is None:
        return None

    subject = _clean_subject(raw_subject)
    return {
        "subject": subject,
        "due_date": parsed_date.date(),
    }

def _clean_subject(raw: str) -> str:
    cleaned = _NOISE.sub("", raw).strip(" ,")
    if not cleaned:
        return raw.strip().title()
    # title() preserves multi-word casing better than capitalize()
    return cleaned.strip().title()
