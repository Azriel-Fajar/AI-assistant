---
name: daily-priorities
description: Use when Azriel wants to know what to focus on today. Reads current priorities, active projects, and deadlines, then outputs a ranked action list for the day.
---

## What This Skill Does

Surfaces a clear, ranked list of things to do today. Reads your context files and active projects, checks for deadlines, and outputs a short action list -- so you don't have to think about what's next.

## Steps

### 1. Read context

Read the following files silently (do not show the raw content to the user):

- `context/current-priorities.md`
- `context/goals.md`
- All `README.md` files inside `projects/` subfolders

Also check Google Calendar for today's events using `mcp__claude_ai_Google_Calendar__list_events` with:
- `time_min`: start of today (UTC+7)
- `time_max`: end of today (UTC+7)

If the calendar check fails or returns no events, continue without it.

---

### 2. Build the action list

Based on what you read, generate a prioritized action list for today. Apply this ranking logic:

1. **Urgent + Important** -- deadlines today or tomorrow, blocked client work, anything time-sensitive
2. **Important, not urgent** -- active project progress, college work with upcoming deadlines
3. **Growth tasks** -- portfolio, marketing, Instagram content, client outreach
4. **Low priority** -- admin, nice-to-haves, exploratory tasks

Keep the list to 5-7 items max. Be specific -- not "work on client project" but "finish the homepage layout for the Canada client."

If you don't have enough detail to be specific, note it and suggest the user update the relevant project README.

---

### 3. Output format

Present the list in this format:

```
Today -- <date>

Top priorities:
1. [URGENT] <specific task> -- <reason>
2. <specific task> -- <reason>
3. <specific task> -- <reason>

Also worth doing today:
4. <task>
5. <task>

On your radar (not today):
- <upcoming deadline or thing to keep in mind>
```

Keep reasons short -- one clause, not a sentence.

---

### 4. Ask if the user wants to act on anything

After the list, ask:
"Want to start on any of these now, or add any of them to your calendar?"

If the user says yes to calendar, use the `/gcal-schedule` flow to add it.

---

## Rules

- Keep the list to 7 items max. Quality over quantity.
- Be specific about tasks -- generic items like "study" or "work on project" are not allowed.
- If context files are sparse, note what's missing and ask the user to update them.
- Use today's date from the `currentDate` context.
- Do not suggest tasks that are not grounded in the user's actual priorities and projects.
