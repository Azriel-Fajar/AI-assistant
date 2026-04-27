---
name: lead-tracker
description: Use when Azriel wants to add, view, update, or act on leads. Manages the full outreach pipeline from cold to closed, with phone notifications and WhatsApp deep links.
---

## What This Skill Does

Manages a local CRM stored in `leads/leads.md`. Tracks leads through the full sales pipeline, sends push notifications to Azriel's phone for overdue leads, and generates pre-filled WhatsApp links to message customers.

---

## Config

- **Leads file:** `leads/leads.md`
- **Archive file:** `leads/archive.md`
- **Ntfy.sh channel:** `rielcode-leads`
- **Overdue threshold:** 3 days since last contact
- **Stages (in order):** `cold` → `messaged` → `replied` → `meeting` → `proposal-sent` → `closed-won` / `closed-lost`

---

## Commands

Invoked as `/lead-tracker [command]`. If no command is given, show the pipeline view.

---

### `add`

Add a new lead.

**Steps:**
1. Ask in one message:
   - Business name
   - Contact name
   - Phone number (with country code, e.g. `+62 812 xxx xxxx`)
   - Source (e.g. `cold-outreach`, `referral`, `instagram`, `walk-in`)
   - Any notes (optional)

   If the user already provided details when invoking, use them and only ask for what's missing.

2. Assign the next available ID (read the current table, increment the last ID by 1; start at `001` if empty).

3. Set stage to `cold`, Last Contact to today's date (`currentDate`), Next Action to `Send cold message`.

4. Append a new row to `leads/leads.md`.

5. Confirm: "Lead added: [Business] ([Contact])."

---

### `pipeline` (default)

Show all active leads grouped by stage.

**Steps:**
1. Read `leads/leads.md`.
2. Group rows by Stage.
3. Output in this format:

```
PIPELINE -- [date]

COLD ([n])
  001  Kopi Nusantara       Ali          Last: 2026-04-25   Next: Send cold message

MESSAGED ([n])
  002  Kafe Selasar         Budi         Last: 2026-04-24   Next: Follow up if no reply by 2026-04-27

REPLIED ([n])
  ...

PROPOSAL SENT ([n])
  ...

(omit stages with 0 leads)
```

4. After the table, show a one-line count: `[n] active leads | [n] closed this month`

---

### `update`

Update a lead's stage, last contact date, or next action.

**Steps:**
1. Show the current pipeline briefly (ID + business name + stage).
2. Ask: "Which lead? (ID or name)" and "What do you want to update? (stage / last contact / next action / notes)"
3. Apply the change to `leads/leads.md`.
4. Confirm the update.

---

### `next`

Show leads that are overdue for follow-up and send push notifications.

**Overdue = Last Contact is 3 or more days ago AND stage is not `closed-won` or `closed-lost`.**

**Steps:**
1. Read `leads/leads.md`.
2. Calculate days since Last Contact for each lead using today's date (`currentDate`).
3. List overdue leads in a table:

```
OVERDUE LEADS -- action needed

ID   Business            Stage        Days Overdue   Next Action
001  Kopi Nusantara      messaged     4              Follow up if no reply
```

4. For each overdue lead, send a push notification via ntfy.sh using Bash:

```bash
curl -s -X POST https://ntfy.sh/rielcode-leads \
  -H "Title: Lead Overdue" \
  -d "[BUSINESS] ([STAGE]) -- [DAYS] days since last contact. Next: [NEXT ACTION]"
```

   Run one curl command per overdue lead.

5. After the table, offer: "Want me to generate a WhatsApp message for any of these? Just give me the ID."

---

### `message`

Generate a pre-filled WhatsApp link to message a lead.

**Steps:**
1. If not already provided, ask: "Which lead? (ID or name)"
2. Read the lead's details from `leads/leads.md`.
3. Draft a short, natural WhatsApp message based on the lead's stage:
   - `cold`: Use this exact template (replace [BUSINESS] with the business name):
     ```
     Halo, nama saya Azriel, web developer dari Salatiga. Saya membuat website untuk bisnis-bisnis lokal di sini.

     Saya perhatikan [BUSINESS] belum memiliki website, apakah benar begitu? Apakah ada kemungkinan [BUSINESS] butuh website? Kalau benar, saya dengan senang hati membantu.

     Boleh saya tunjukkan contoh demo website untuk bisnis F&B?
     ```
   - `messaged`: Gentle follow-up nudge
   - `replied` / `meeting`: Context-specific check-in
   - `proposal-sent`: Follow up on the proposal
4. URL-encode the message.
5. Open the link directly in Opera browser using Bash:

```bash
start opera "https://wa.me/[phone_digits_only]?text=[url-encoded-message]"
```

   Also output the link in text:

```
WhatsApp link for [Business] ([Contact]):

https://wa.me/[phone_digits_only]?text=[url-encoded-message]
```

   Strip all non-digit characters from the phone number for the URL.

6. After sending, ask: "Want me to update this lead's last contact date to today and stage if it changed?"

---

### `close`

Mark a lead as won or lost.

**Steps:**
1. Ask: "Which lead? (ID or name)" and "Won or lost? Any notes?"
2. Update the lead's Stage to `closed-won` or `closed-lost` and add the note.
3. Move the row from `leads/leads.md` to `leads/archive.md`.
4. Confirm: "Lead [Business] marked as [closed-won/closed-lost] and archived."

If won, also say: "Want to kick off a project for this client with `/project-kickoff`?"

---

## Rules

- Never invent lead details -- only use what the user provides.
- Always use `currentDate` for today's date.
- Never delete rows -- archive instead.
- When sending ntfy.sh notifications, run the curl command silently and only report failure if the command errors.
- WhatsApp messages must follow the same rules as `/follow-up`: no emojis, no em dashes, max 5 sentences, sounds like a real person.
- If `leads/leads.md` does not exist or is empty, tell the user and offer to add the first lead.
