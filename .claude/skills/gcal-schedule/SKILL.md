---
name: gcal-schedule
description: Use when the user wants to add, delete, view, or manage Google Calendar events from the CLI. Handles monthly schedules, one-off events, and recurring entries.
---

## What This Skill Does

Manages Google Calendar events using the connected Google Calendar MCP tools. Supports adding, updating, deleting, listing, and viewing events, responding to invitations, and finding free time slots — all from the CLI.

## Steps

### Adding an Event

1. **Gather required details** — apply defaults silently, only ask for what's still missing:
   - Event title / name
   - Date — **default: today** (from `currentDate` context) if not specified
   - Start time and end time (or duration) — **default duration: 1 hour** if not specified
   - Recurrence? (one-time, daily, weekly, monthly, etc.)
   - Which calendar? (use `list_calendars` to show options if unclear)
   - Optional: location, description, guests

2. **Confirm before creating.** Summarize the event in one block and ask the user to confirm:
   ```
   Title:      Team Sync
   Calendar:   Work
   Date:       2026-04-28 (Monday)
   Time:       10:00 AM – 11:00 AM
   Recurrence: Monthly, on the 4th Monday
   ```
   Do not call `create_event` until the user confirms.

3. **Create the event** using `mcp__claude_ai_Google_Calendar__create_event`.

4. **Report the result** — show the event name, date/time, and a link if returned.

---

### Updating an Event

1. **Identify the event** — ask for the event name and approximate date if not provided.

2. **Search for matches** using `mcp__claude_ai_Google_Calendar__list_events`, then fetch full details with `mcp__claude_ai_Google_Calendar__get_event` if needed.

3. **Ask what to change** — title, time, date, location, description, recurrence, guests, etc.

4. **Confirm before updating.** Show a before/after summary:
   ```
   Updating: Team Sync (Mon Apr 28)
   Time:  10:00–11:00 AM  →  2:00–3:00 PM
   ```
   Do not call `update_event` until the user confirms.

5. **Update** using `mcp__claude_ai_Google_Calendar__update_event`.

6. **Report** the updated details.

---

### Deleting an Event

1. **Identify the event** — ask for the event name and approximate date if not provided.

2. **Search for matches** using `mcp__claude_ai_Google_Calendar__list_events` with a relevant time range and query.

3. **Show matches** — if more than one result, list them with dates/times so the user can pick:
   ```
   1. Team Sync — Mon Apr 28 10:00 AM
   2. Team Sync — Mon May 26 10:00 AM
   ```
   Ask: "Which one(s) should I delete? Or all occurrences?"

4. **Confirm before deleting.** State exactly what will be removed. Do not call `delete_event` until the user confirms.

5. **Delete** using `mcp__claude_ai_Google_Calendar__delete_event`.

6. **Report** what was deleted.

---

### Listing / Viewing Events

1. Ask for a time range if not provided (e.g. "this week", "April", "next 30 days").
2. Use `mcp__claude_ai_Google_Calendar__list_events` with appropriate `time_min` / `time_max`.
3. Display results in a clean table, sorted chronologically:
   ```
   Date         Time           Title
   2026-04-28   10:00–11:00    Team Sync
   2026-04-30   09:00–09:30    Standup
   ```
4. If no events are found, say so clearly and offer to add one.

For full details on a single event, use `mcp__claude_ai_Google_Calendar__get_event` and display all fields including attendees and description.

---

### Responding to an Invitation

1. Use `mcp__claude_ai_Google_Calendar__list_events` to find the event if the user doesn't provide an event ID.
2. Confirm the user's intended response: **accept**, **decline**, or **tentative**.
3. Respond using `mcp__claude_ai_Google_Calendar__respond_to_event`.
4. Report the outcome.

---

### Finding a Free Time Slot

1. Ask for the desired duration and a rough date range if not provided.
2. Use `mcp__claude_ai_Google_Calendar__suggest_time` to find available slots.
3. Present the top options clearly:
   ```
   Available slots:
   1. Mon Apr 28  2:00–3:00 PM
   2. Tue Apr 29  10:00–11:00 AM
   3. Wed Apr 30  3:00–4:00 PM
   ```
4. If the user picks one, offer to create an event in that slot immediately.

---

## Rules

- **Never create, update, or delete without explicit user confirmation.**
- Always use `list_events` to verify an event exists before attempting to delete or update it.
- When the user mentions "monthly schedule", assume they mean a recurring monthly event unless clarified.
- If a calendar is not specified, default to the primary calendar (the one marked `primary: true` in `list_calendars`).
- Dates should always be interpreted relative to today's date from the `currentDate` context variable.
- **Default date: today.** If the user does not specify a day, use today's date without asking.
- **Default duration: 1 hour.** If the user does not specify an end time or duration, set the end time to 1 hour after the start time without asking.
- For recurring events, clarify the recurrence rule (RRULE) before creating — e.g. "monthly on the 3rd Friday" vs "monthly on the 15th".
