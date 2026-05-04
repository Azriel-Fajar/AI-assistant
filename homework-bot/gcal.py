from datetime import date, datetime, timedelta
from dataclasses import dataclass
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from config import get_service_account_info

SCOPES = ["https://www.googleapis.com/auth/calendar"]


@dataclass
class CalendarResult:
    deadline_event_id: str
    study_block1_event_id: str
    study_block2_event_id: str
    study_block1_date: date
    study_block2_date: date


def build_service():
    info = get_service_account_info()
    creds = Credentials.from_service_account_info(info, scopes=SCOPES)
    return build("calendar", "v3", credentials=creds)


def create_homework_events(
    subject: str,
    due_date: date,
    calendar_id: str,
    timezone: str,
) -> CalendarResult:
    service = build_service()

    study1 = due_date - timedelta(days=2)
    study2 = due_date - timedelta(days=1)

    deadline_id = _insert_event(service, calendar_id, _deadline_body(subject, due_date))
    block1_id = _insert_event(service, calendar_id, _study_block_body(subject, study1, timezone, reminder=True))
    block2_id = _insert_event(service, calendar_id, _study_block_body(subject, study2, timezone, reminder=False))

    return CalendarResult(
        deadline_event_id=deadline_id,
        study_block1_event_id=block1_id,
        study_block2_event_id=block2_id,
        study_block1_date=study1,
        study_block2_date=study2,
    )


def _insert_event(service, calendar_id: str, body: dict) -> str:
    from googleapiclient.errors import HttpError
    try:
        result = service.events().insert(calendarId=calendar_id, body=body).execute()
    except HttpError as e:
        raise RuntimeError(f"Google Calendar API error: {e.status_code} {e.reason}") from e
    event_id = result.get("id")
    if not event_id:
        raise RuntimeError(f"Google Calendar returned no event ID for: {body.get('summary')}")
    return event_id


def _deadline_body(subject: str, due_date: date) -> dict:
    return {
        "summary": f"{subject} HW Due",
        "start": {"date": due_date.isoformat()},
        "end": {"date": (due_date + timedelta(days=1)).isoformat()},
        "reminders": {"useDefault": False, "overrides": []},
    }


def _study_block_body(subject: str, block_date: date, timezone: str, reminder: bool) -> dict:
    start_dt = datetime(block_date.year, block_date.month, block_date.day, 20, 0, 0)
    end_dt = datetime(block_date.year, block_date.month, block_date.day, 22, 0, 0)
    return {
        "summary": f"Study: {subject} HW",
        "start": {"dateTime": start_dt.isoformat(), "timeZone": timezone},
        "end": {"dateTime": end_dt.isoformat(), "timeZone": timezone},
        "reminders": {
            "useDefault": False,
            "overrides": [{"method": "popup", "minutes": 0}] if reminder else [],
        },
    }
