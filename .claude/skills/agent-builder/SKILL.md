---
name: agent-builder
description: Use when Azriel wants to create a custom subagent, build a specialized AI worker, automate a repeated side-task into its own agent, or says "build me an agent", "make a subagent", "agent builder", or "I keep doing X manually". Interviews him about the workflow, then writes a ready-to-use subagent file to ~/.claude/agents/.
argument-hint: [what the agent should do, optional]
disable-model-invocation: true
---

## What This Skill Does

Builds a custom Claude Code **subagent** (not a skill) tailored to one of Azriel's repeated workflows. A subagent runs in its own context window, returns only a summary, and can have restricted tools, its own model, and persistent memory. Use this when the same kind of side-task keeps flooding the main conversation (research, test runs, log triage, lead lookups) or when a focused worker with a fixed system prompt would help.

Output: one markdown file at `~/.claude/agents/<name>.md`, available in every project on this machine.

**Subagent vs skill:** a skill is a reusable prompt that runs in the main conversation. A subagent runs isolated and returns a summary. If the user actually wants a skill, stop and route to `/skill-builder` instead.

## Reference

Read [reference.md](reference.md) for the full frontmatter field table, tool restriction syntax, permission modes, and built-in agent list before building. Do not guess field names.

---

## Step 0: Suggest from context (if no clear ask)

If the argument is empty or vague, before interviewing, read these to propose 2-3 high-value subagent ideas grounded in Azriel's actual work:

- `context/current-priorities.md`
- `context/work.md`
- `memory/MEMORY.md`
- list `.claude/skills/` directory names

Propose ideas as: name, one-line purpose, why it saves context. Examples grounded in his workflow:
- `lead-researcher` -- scrape a prospect's site + IG, return a 5-line brief (keeps scrape noise out of main context)
- `deploy-checker` -- run the 7-stage deploy pipeline checks, report pass/fail only
- `demo-builder` -- spin a one-page demo for a lead in an isolated worktree

Use AskUserQuestion to let him pick one or describe his own. Skip Step 0 entirely if he already described the agent.

---

## Step 1: Interview (full, one round at a time)

Use AskUserQuestion. One topic per round. Stop asking once 95% confident. Skip any round already answered by the argument or Step 0.

**Round 1 — Job & name**
- What single task should this agent own? (one job, done well)
- Suggest a `name` (lowercase, hyphens, max 64 chars). The name is how it's invoked (`@agent-name`) and what hooks see as `agent_type`.

**Round 2 — Trigger & description**
- When should Claude delegate to it? Get the phrasing.
- Write the `description` so Claude knows when to use it. Add "use proactively" only if he wants automatic delegation.

**Round 3 — Tools & safety**
- Does it only read, or also write/edit/run commands?
  - Read-only research → `tools: Read, Grep, Glob, Bash` (or `WebFetch, WebSearch` if it browses)
  - Writes code → add `Edit, Write`
- Restrict with `tools` (allowlist) or `disallowedTools` (denylist). Default: omit = inherits all. Recommend an allowlist for focus and safety.
- Note: `Agent`, `AskUserQuestion`, `EnterPlanMode`, `ScheduleWakeup` are NOT available to subagents even if listed.

**Round 4 — Model & effort**
- `haiku` for fast/cheap search and triage; `sonnet` for balanced analysis; `opus` for hard reasoning; `inherit` (default) to match the session.
- Match cost to the job. Most research/triage agents should be `haiku`.

**Round 5 — Memory & isolation**
- Should it remember across conversations? `memory: user` (all projects), `project`, or `local`. Default: none.
- Does it edit a repo and need an isolated copy? `isolation: worktree`. Default: none.

**Round 6 — System prompt**
- What's the exact workflow inside the agent? Numbered steps from invocation to summary.
- What must it NOT do? Hard boundaries, cost limits.
- What should it return? (Summary shape — the only thing that reaches the main conversation, so make it tight.)

---

## Step 2: Confirm

Summarize back before writing:

```
## Subagent: <name>

Job: <one sentence>
Trigger: <when Claude delegates>
Tools: <list or "inherits all">
Model: <model>
Memory: <scope or none>
Isolation: <worktree or none>
Returns: <summary shape>

System prompt (preview):
<first ~5 lines>
```

Ask: "Build it?" Only write after he confirms.

---

## Step 3: Write the file

Write to `~/.claude/agents/<name>.md`. Use this structure. Only include frontmatter fields that were actually decided — do not add fields just because they exist.

```markdown
---
name: <name>
description: <when to delegate; include "use proactively" only if wanted>
tools: <allowlist>            # omit to inherit all
model: <haiku|sonnet|opus|inherit>
memory: <user|project|local>  # omit if none
color: <red|blue|green|yellow|purple|orange|pink|cyan>
---

You are <role>. <one-line mission>.

When invoked:
1. <step>
2. <step>
...

<Key practices / constraints>

Return only:
- <tight summary shape>

Do NOT:
- <hard boundaries>
```

Encoding: write UTF-8, no BOM (the Write tool already does this). No em dashes in any user-facing message text per Azriel's style rules.

---

## Step 4: Verify & hand off

- Confirm the file exists at `~/.claude/agents/<name>.md`.
- Tell Azriel: subagents load at session start, so he must **restart the session** for a file-created subagent to be invocable (or it works immediately if created via `/agents`).
- Show how to call it: `@agent-<name> <task>` or "use the <name> subagent to ...".

---

## Notes

- Subagents cannot spawn other subagents. If the workflow needs nested delegation, tell him to chain from the main conversation instead.
- One agent, one job. If the interview reveals two jobs, build two agents.
- Keep the system prompt focused. The agent only gets its own prompt plus env details, not the full session context.
- If he wants something that runs in the main conversation (not isolated), it's a skill, not a subagent. Route to `/skill-builder`.
