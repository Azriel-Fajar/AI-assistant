---
name: claude-coach
description: Use when Azriel wants help using Claude Code more efficiently -- grade or rewrite a prompt, decide which skill to use and in what order, recommend an effort level, or learn an Opus 4.8 prompting technique. Triggers on "/claude-coach", "make this prompt better", "which skill should I use", "how do I prompt this", "what effort level".
---

## What This Skill Does

Coaches Azriel on getting the most out of Claude Code. Knowledge source: `references/claude-code-mastery.md` (always read it first). Four modes, routed by the args.

## Steps

### 1. Read the knowledge source

Silently read `references/claude-code-mastery.md`. It holds the effort table, core rules, and all snippets. Do not invent guidance not in that file; if something is missing, say so and offer to add it.

### 2. Route by args

- `prompt "<draft>"` -> Mode A (grade + rewrite)
- `route "<what I want to build>"` -> Mode B (skill routing)
- `learn [topic]` -> Mode C (teach)
- no args / anything else -> Mode D (cheat sheet + ask)

### Mode A -- Grade and rewrite a prompt

1. Score the draft against the reference on: clarity/directness, scope made explicit, action vs suggest, examples/role/XML where useful, length control.
2. Output:

```
Score: X/5

Weak spots
- [issue] -> [rule from reference]

Rewrite
[tightened prompt, ready to paste]

Recommend: effort=[low/medium/high/xhigh/max], plan mode=[yes/no], subagents=[yes/no]
```

3. Pick effort from section 1 of the reference (xhigh for coding/agentic, high for intelligence-sensitive, etc.). Add any snippet from the library (section 10) that the task needs.

### Mode B -- Route to the right skill

1. Match the goal to existing skills in `CLAUDE.md` (e.g. demo site -> `/demo-website`, client proposal -> `/client-proposal`, new build -> `superpowers:brainstorming` then `/frontend-design`, lead work -> `/lead-tracker`).
2. Output:

```
Use: /skill-a  then  /skill-b
Why: [one line each]

Kickoff prompt (paste this)
[fully-specified first message: task + intent + constraints upfront, so Opus 4.8 runs autonomously]

Set: effort=[...], model=Opus 4.8
```

3. Prefer one well-specified upfront prompt over many vague turns (reference section 11).

### Mode C -- Teach a technique

1. Find the topic in the reference (effort, frontend defaults, anti-overengineering, long context, etc.).
2. Output: the rule in 2-3 lines, the relevant snippet, and one concrete example tied to Azriel's work (Rielcode site, college task).

### Mode D -- Cheat sheet

Print the effort table (reference section 1) plus the top 5 levers:

```
1. /effort xhigh + /model Opus 4.8 before heavy coding
2. State scope explicitly -- Opus 4.8 is literal
3. "make the changes" not "suggest changes"
4. Client sites: propose-4-directions, never default cream/serif
5. Specify task+intent+constraints in the FIRST message
```

Then ask: "Grade a prompt, route a build, or learn a technique?"

## Rules

- Follow `.claude/rules/communication-style.md`: bullets/tables, no emojis, no em dashes, no filler.
- Knowledge comes from `references/claude-code-mastery.md` only. Keep this skill thin.
- Rewrites must be paste-ready, not described.
- If asked something the reference does not cover, say so and offer to add it to the reference.
