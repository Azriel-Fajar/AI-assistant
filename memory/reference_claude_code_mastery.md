---
name: reference-claude-code-mastery
description: Opus 4.8 prompting + agentic best practices for efficient Claude Code use; full guide at references/claude-code-mastery.md, coached via /claude-coach
metadata:
  type: reference
---

# Claude Code Mastery (Opus 4.8)

Source: references/claude-code-mastery.md (full guide). Use the `/claude-coach` skill to grade prompts, route builds, recommend effort, or teach techniques.

## Effort cheat sheet

| Effort | Use for |
|--------|---------|
| `max` | Hardest tasks; may overthink |
| `xhigh` | Default for coding/agentic |
| `high` | Min for intelligence-sensitive |
| `medium` | Cost-sensitive |
| `low` | Short/scoped, latency-sensitive |

Levers in Claude Code: `/effort` and `/model`. Set before a heavy task.

## Top reminders

- Opus 4.8 follows instructions literally -- state scope explicitly.
- "Make the changes" not "suggest changes" when you want action.
- Client sites: override the default cream/serif house style (propose-4-directions or concrete spec).
- Specify task + intent + constraints in the FIRST message for max autonomy.
- Drop old "be thorough / always use this tool" prompting; Opus 4.8 over-triggers on it.
