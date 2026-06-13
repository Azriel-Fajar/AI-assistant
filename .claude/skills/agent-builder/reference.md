# Subagent Reference

Condensed from Claude Code "Create custom subagents" docs. Load when building.

## File location & scope

| Location | Scope | Priority |
|---|---|---|
| `.claude/agents/` | current project (in git) | 3 |
| `~/.claude/agents/` | all your projects (this machine) | 4 |

agent-builder defaults to `~/.claude/agents/`. Identity comes from the `name:` field, not filename. Keep names unique across the tree.

Subagents load at session start. A file created on disk needs a **session restart** to become invocable. Created via `/agents` interface = immediate.

## Frontmatter fields

Only `name` and `description` are required.

| Field | Use |
|---|---|
| `name` | lowercase + hyphens, max 64 chars. Hooks see it as `agent_type`. |
| `description` | When Claude should delegate. Add "use proactively" for auto-delegation. |
| `tools` | Allowlist. Omit = inherit all. e.g. `Read, Grep, Glob, Bash`. To preload skills use `skills:`, not `Skill` here. |
| `disallowedTools` | Denylist. Applied before `tools`. A tool in both is removed. |
| `model` | `sonnet`, `opus`, `haiku`, `fable`, full ID, or `inherit` (default). |
| `permissionMode` | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`. Parent `bypassPermissions`/`acceptEdits` override. |
| `maxTurns` | Max agentic turns before stop. |
| `skills` | Preload full skill content at startup. |
| `mcpServers` | MCP servers scoped to this agent (inline or by name). |
| `hooks` | Lifecycle hooks (PreToolUse, PostToolUse, Stop). |
| `memory` | `user` (`~/.claude/agent-memory/<name>/`), `project`, or `local`. Cross-session learning. Auto-enables Read/Write/Edit. |
| `background` | `true` = always run as background task. |
| `effort` | `low`/`medium`/`high`/`xhigh`/`max`. Overrides session effort. |
| `isolation` | `worktree` = isolated git copy, auto-cleaned if no changes. |
| `color` | red, blue, green, yellow, purple, orange, pink, cyan. |

## Tools NOT available to subagents (even if listed)

`Agent`, `AskUserQuestion`, `EnterPlanMode`, `ScheduleWakeup`, `WaitForMcpServers`, `ExitPlanMode` (unless `permissionMode: plan`).

Subagents cannot spawn subagents.

## Built-in subagents (don't rebuild)

- **Explore** — Haiku, read-only, codebase search.
- **Plan** — read-only research in plan mode.
- **general-purpose** — all tools, multi-step.

## Model cost guidance

- `haiku` — search, triage, scraping, log filtering. Fast, cheap.
- `sonnet` — balanced analysis, code review.
- `opus` — hard reasoning, planning.
- `inherit` — match the session.

## Tool restriction logic

If both `tools` and `disallowedTools` set: `disallowedTools` applied first, then `tools` resolves against the remainder.

Read-only research agent:
```yaml
tools: Read, Grep, Glob, Bash
```
Inherit all except writes:
```yaml
disallowedTools: Write, Edit
```

## Persistent memory tips

Include memory instructions in the body so the agent maintains its own knowledge:
> Update your agent memory as you discover patterns and key decisions.

## Good example skeletons

**Read-only reviewer:**
```markdown
---
name: code-reviewer
description: Expert code review. Use proactively after code changes.
tools: Read, Grep, Glob, Bash
model: inherit
---
You are a senior code reviewer. Run git diff, focus on modified files, review immediately.
Return: Critical / Warnings / Suggestions, each with a fix.
```

**Fix-capable debugger:**
```markdown
---
name: debugger
description: Debugging specialist for errors and test failures. Use proactively on any issue.
tools: Read, Edit, Bash, Grep, Glob
---
Capture error, isolate failure, minimal fix, verify. Return root cause + fix + test.
```

## Invocation

- Natural language: "use the <name> subagent to ..."
- @-mention (forces it): `@agent-<name> <task>`
- Whole session: `claude --agent <name>`
