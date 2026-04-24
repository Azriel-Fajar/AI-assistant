---
name: project-kickoff
description: Use when starting a new client project. Gathers project details, creates a project folder with README, generates a kickoff checklist, and logs the project.
---

## What This Skill Does

Kicks off a new client project by gathering key details, creating the project folder structure, generating a checklist of things to do before work begins, and optionally drafting a kickoff message to send the client via WhatsApp.

## Steps

### 1. Gather project details

Ask the user for the following. Ask all at once in a single message:

- Client name or identifier
- Project type (custom website, landing page, e-commerce, other)
- Project budget (IDR amount)
- Deadline (or "TBD")
- Brief description of what the client wants (2-3 sentences is fine)
- Has a deposit been collected? (yes / no / not yet)

If the user invoked the skill with args (e.g. `/project-kickoff Canada landing page`), use those as context and only ask for what's still missing.

---

### 2. Create the project folder

Create a folder under `projects/` using a slugified version of the client name:
- Lowercase, spaces replaced with hyphens
- Example: "PT Maju Jaya" → `projects/pt-maju-jaya/`

Create `projects/<slug>/README.md` with this structure:

```markdown
# <Client Name> -- <Project Type>

<One-line description of what the client wants.>

**Status:** Planning
**Budget:** IDR <amount>
**Deadline:** <date or TBD>
**Communication:** WhatsApp

## Timeline
- Kickoff: <today's date>
- Deadline: <date or TBD>

## Requirements
<Paste the brief description here.>

## Notes
-
```

---

### 3. Generate the kickoff checklist

Output this checklist in the conversation (do not write it to a file):

```
Kickoff Checklist -- <Client Name>

Before starting:
[ ] Send project brief summary to client for confirmation
[ ] Collect deposit (if not yet received)
[ ] Agree on final deadline in writing (WhatsApp is fine)
[ ] Confirm deliverables: what is included, what is not

During the project:
[ ] Share progress update at ~50% completion
[ ] Get client feedback before final delivery
[ ] Collect final payment before handing over files/access

After delivery:
[ ] Send login credentials or site access
[ ] Offer 1-2 weeks of minor revision support
[ ] Ask for a testimonial or referral
[ ] Archive project folder when complete
```

---

### 4. Log the new project

Append to `decisions/log.md`:

```
[<today's date>] DECISION: Started project for <Client Name> | REASONING: New client project -- <project type> | CONTEXT: Budget IDR <amount>, deadline <date>
```

---

### 5. Offer a WhatsApp kickoff message

Ask: "Want me to draft a WhatsApp message to send the client to confirm the project details?"

If yes, generate a short, professional message (3-5 sentences) that:
- Confirms the project scope
- States the agreed deadline
- Mentions the deposit (if not yet collected)
- Keeps a professional but friendly tone

Do not include emojis.

---

## Rules

- Always create the project folder and README -- do not skip this.
- Always append to `decisions/log.md` -- do not skip this.
- The checklist is shown in the conversation only, not saved to a file.
- Use today's date from the `currentDate` context for the kickoff date.
- If the user says "TBD" for deadline or budget, use "TBD" in the README.
