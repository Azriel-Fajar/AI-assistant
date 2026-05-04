from datetime import date, datetime
from homework_parser import parse_homework


def test_parse_day_name():
    # Monday 2026-05-04; next Friday is 2026-05-08
    now = datetime(2026, 5, 4, 12, 0, 0)
    result = parse_homework("Stats homework due Friday", now=now)
    assert result["subject"] == "Stats"
    assert result["due_date"] == date(2026, 5, 8)


def test_parse_next_monday():
    # Monday 2026-05-04; next Monday is 2026-05-11
    now = datetime(2026, 5, 4, 12, 0, 0)
    result = parse_homework("Probability assignment due in 7 days", now=now)
    assert result["subject"] == "Probability"
    assert result["due_date"] == date(2026, 5, 11)


def test_parse_explicit_date():
    now = datetime(2026, 5, 4, 12, 0, 0)
    result = parse_homework("Web dev project due May 15", now=now)
    assert result["subject"] == "Web Dev"
    assert result["due_date"] == date(2026, 5, 15)


def test_parse_tomorrow():
    now = datetime(2026, 5, 4, 12, 0, 0)
    result = parse_homework("homework due tomorrow", now=now)
    assert result["subject"] == "Homework"
    assert result["due_date"] == date(2026, 5, 5)


def test_parse_no_date_returns_none():
    result = parse_homework("Stats homework")
    assert result is None


def test_parse_bad_date_returns_none():
    result = parse_homework("Stats homework due gibberish")
    assert result is None


def test_parse_all_noise_subject():
    now = datetime(2026, 5, 4, 12, 0, 0)
    result = parse_homework("homework task due tomorrow", now=now)
    assert result is not None
    assert result["due_date"] == date(2026, 5, 5)
