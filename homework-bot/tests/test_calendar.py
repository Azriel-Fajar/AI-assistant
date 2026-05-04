from datetime import date
from unittest.mock import MagicMock, patch
from gcal import create_homework_events, CalendarResult


def _make_mock_service():
    mock_service = MagicMock()
    mock_events = MagicMock()
    mock_service.events.return_value = mock_events
    mock_events.insert.return_value.execute.return_value = {"id": "evt123"}
    return mock_service, mock_events


def test_creates_three_events():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        result = create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    assert mock_events.insert.call_count == 3
    assert isinstance(result, CalendarResult)


def test_deadline_event_is_allday():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    calls = mock_events.insert.call_args_list
    deadline_body = calls[0][1]["body"]
    assert "date" in deadline_body["start"]
    assert deadline_body["start"]["date"] == "2026-05-09"


def test_deadline_event_end_is_next_day():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    calls = mock_events.insert.call_args_list
    deadline_body = calls[0][1]["body"]
    assert deadline_body["end"]["date"] == "2026-05-10"


def test_study_blocks_at_8pm():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    calls = mock_events.insert.call_args_list
    block1_body = calls[1][1]["body"]
    block2_body = calls[2][1]["body"]
    assert "2026-05-07T20:00:00" in block1_body["start"]["dateTime"]
    assert "2026-05-08T20:00:00" in block2_body["start"]["dateTime"]


def test_study_block1_has_reminder():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    calls = mock_events.insert.call_args_list
    block1_body = calls[1][1]["body"]
    assert block1_body["reminders"]["useDefault"] is False
    assert any(r["method"] == "popup" for r in block1_body["reminders"]["overrides"])


def test_study_block2_no_reminder():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    calls = mock_events.insert.call_args_list
    block2_body = calls[2][1]["body"]
    assert block2_body["reminders"]["useDefault"] is False
    assert block2_body["reminders"]["overrides"] == []


def test_study_blocks_are_2hours():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    calls = mock_events.insert.call_args_list
    block1_body = calls[1][1]["body"]
    assert "2026-05-07T22:00:00" in block1_body["end"]["dateTime"]


def test_result_has_correct_dates():
    mock_service, mock_events = _make_mock_service()
    with patch("gcal.build_service", return_value=mock_service):
        result = create_homework_events(
            subject="Stats",
            due_date=date(2026, 5, 9),
            calendar_id="test@group.calendar.google.com",
            timezone="Asia/Jakarta",
        )
    assert result.study_block1_date == date(2026, 5, 7)
    assert result.study_block2_date == date(2026, 5, 8)
    assert result.deadline_event_id == "evt123"
