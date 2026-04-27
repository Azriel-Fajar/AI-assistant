---
name: new-project
description: Use when Azriel wants to start a new personal project (not a client project), such as a portfolio site, personal app, tool, or side project.
disable-model-invocation: true
argument-hint: [project name or description]
---

## What This Skill Does

Kicks off a new personal project by gathering key details, creating the project folder under `personal/`, generating a setup checklist, and logging the project in `decisions/log.md`.

## Steps

### 1. Gather project details

Ask the user for the following in a single message:

- Project name
- Project type (portfolio site, web app, tool, practice project, other)
- Goal -- what is this project for? What problem does it solve or what do you want to learn?
- Tech stack (e.g. HTML/CSS/JS, React, Laravel, Python -- or "TBD")
- Deadline or timeline (or "open-ended")

If the user invoked the skill with args (e.g. `/new-project portfolio site`), use those as context and only ask for what's still missing.

---

### 2. Create the project folder

Create a folder under `personal/` using a slugified version of the project name:
- Lowercase, spaces replaced with hyphens
- Example: "My Portfolio" → `personal/my-portfolio/`

Create `personal/<slug>/README.md` with this structure:

```markdown
# <Project Name>

<One-line description of what this project is.>

**Status:** In Progress
**Type:** <type>
**Stack:** <stack>
**Started:** <today's date>
**Deadline:** <date or Open-ended>

## Goal
<What this project is for -- what it does or what you want to learn from it.>

## Notes
-
```

---

### 3. Output the setup checklist

Show this checklist in the conversation (do not write it to a file):

```
Personal Project Checklist -- <Project Name>

Setup:
[ ] Create a GitHub repo (or local repo with git init)
[ ] Set up local dev environment
[ ] Define MVP scope -- what is in, what is out

Building:
[ ] Build the core feature or page first
[ ] Commit progress regularly (don't wait until it's done)
[ ] Note blockers as they come up

Finishing:
[ ] Deploy or publish (Vercel, Netlify, GitHub Pages, etc.)
[ ] Add to your portfolio or resume
[ ] Write a short project summary (what you built, what you learned)
```

---

### 4. Log the new project

Append to `decisions/log.md`:

```
[<today's date>] DECISION: Started personal project -- <Project Name> | REASONING: <goal in one sentence> | CONTEXT: Type: <type>, Stack: <stack>, Deadline: <deadline>
```

If `decisions/log.md` does not exist or is empty, create it with just this entry.

---

## Rules

- Always create the project folder and README -- do not skip this.
- Always append to `decisions/log.md` -- do not skip this.
- The checklist is shown in the conversation only, not saved to a file.
- Use today's date from the `currentDate` context for the started date.
- If the user says "TBD" or "open-ended" for deadline or stack, use those values in the README.
- This skill is for personal projects only -- for client work, use `/project-kickoff` instead.
