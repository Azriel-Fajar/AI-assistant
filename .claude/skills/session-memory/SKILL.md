---
name: session-memory
description: Use when Azriel says "session memory", "remember this session", "save what we talked about", "commit to memory", or "/session-memory" -- saves durable facts from the current conversation into the persistent memory system.
disable-model-invocation: true
---

## What This Skill Does

Scans the current conversation and writes durable facts into the project memory
system (`memory/` + `memory/MEMORY.md` index), so nothing important said in the
session is lost across conversations.

Fully automatic: extract and write files, no confirmation step. Durable facts only.

Distinct from `/session-handoff`, which only produces a chat-only summary and writes
nothing.

## Memory System (reuse exactly)

- One file per fact: `memory/<type>_<slug>.md`
  (e.g. `feedback_google_cli.md`, `project_rielcode_outreach.md`).
- Slug convention: `<type>_<short_kebab>` (matches existing files in `memory/`).
- Frontmatter:

  ```markdown
  ---
  name: <Short Title>
  description: <one-line summary used for recall relevance>
  metadata:
    type: user | feedback | project | reference
  ---
  ```

- Body: the fact. For `feedback` and `project`, follow with `**Why:**` and
  `**How to apply:**` lines. Link related memories with `[[slug]]`.
- Write UTF-8 with NO BOM.
- Convert relative dates to absolute using the injected currentDate.

## Steps

**Step 1 -- Scan the session.** Review the full conversation. Identify durable facts
worth persisting, classified into the 4 memory types:

- `user` -- who Azriel is (role, expertise, preference about himself)
- `feedback` -- guidance or corrections on how Claude should work (include the why)
- `project` -- ongoing work, goals, constraints not derivable from code or git
- `reference` -- pointers to external resources (URLs, dashboards, tickets)

Explicitly skip: transient task steps, chit-chat, and anything already recorded in
code, git history, CLAUDE.md, or an existing memory file.

**Step 2 -- Dedupe.** Read `memory/MEMORY.md`. For each candidate fact, check if a
file already covers it.
- If yes, UPDATE that file instead of creating a duplicate.
- If a fact contradicts an existing memory, correct the existing file.
- Read any file before overwriting it.

**Step 3 -- Write files.** For each new fact, write `memory/<type>_<slug>.md` using
the frontmatter + body format above. One fact per file -- no mega-files. Convert
relative dates to absolute. Link related memories with `[[slug]]`.

**Step 4 -- Update index.** Append (or update) one pointer line per fact in
`memory/MEMORY.md`:

```
- [Title](file.md) -- one-line hook
```

The project `memory/` dir (git-tracked) is the target. An auto-memory index copy
also exists at
`C:\Users\afw14\.claude\projects\c--Users-afw14-OneDrive-Documents-JARVIS\memory\MEMORY.md`
-- default to the project dir; only touch the auto-memory copy if explicitly asked.

**Step 5 -- Report.** Output a compact table of what was saved:

| Type | Slug | Hook | Status |
|------|------|------|--------|
| project | project_x | ... | NEW |
| feedback | feedback_y | ... | UPDATED |

If nothing durable was found, say so and write nothing.

## Notes / Guardrails

- Never overwrite an existing memory without first reading it.
- Don't save what the repo already records (code structure, past fixes, git history).
- One fact per file.
- Match the existing slug convention seen in `memory/`.
