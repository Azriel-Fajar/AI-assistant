---
name: client-proposal
description: Use when Azriel needs to generate a client proposal. Takes project scope, budget, and timeline, then outputs a professional proposal document ready to send or adapt.
---

## What This Skill Does

Generates a scoped, professional project proposal for a prospective client. Output is a ready-to-send document (or WhatsApp-friendly summary) based on the project type and requirements.

## Steps

### 1. Gather project details

Ask the user for the following in one message:

- Client name or identifier
- Project type (custom website, landing page, e-commerce, other)
- Key requirements (what does the client want? 2-4 bullet points is fine)
- Budget range (or "I'll set it" if Azriel is proposing the price)
- Desired deadline (or "TBD")
- Any specific technologies or preferences (e.g. WordPress, custom HTML/CSS, specific design style)
- How will this be sent? (WhatsApp message, formal PDF-style document, or both)

If the user already provided context when invoking the skill (e.g. `/client-proposal Canada landing page`), use it and only ask for what's missing.

---

### 2. Generate the proposal

Based on the delivery format:

#### Format A: WhatsApp-ready summary (short)

Write a 5-8 sentence professional message the user can paste directly into WhatsApp. Structure:
1. Introduction / context (1 sentence)
2. What is included in the project (2-3 bullet points)
3. Timeline (1 sentence)
4. Price (1 sentence)
5. Call to action -- confirm or reply to proceed (1 sentence)

No emojis. No em dashes. Direct and professional.

#### Format B: Full proposal document

Output a formatted proposal using this structure:

```
PROPOSAL -- <Project Type> for <Client Name>
Date: <today's date>
Prepared by: Rielcode

---

PROJECT OVERVIEW
<2-3 sentence summary of what the client wants and what Rielcode will deliver.>

SCOPE OF WORK
- <Deliverable 1>
- <Deliverable 2>
- <Deliverable 3>
(Add or remove as needed based on project type)

NOT INCLUDED
- Content writing (client provides all text and images unless otherwise agreed)
- Domain and hosting costs (client's responsibility unless specified)
- Revisions beyond 2 rounds after final delivery

TIMELINE
- Estimated duration: <X weeks>
- Target delivery: <date or TBD>
- Kickoff upon receipt of 50% deposit

INVESTMENT
- Total: IDR <amount>
- Deposit (50%): IDR <amount> -- due before work begins
- Final (50%): IDR <amount> -- due before file/access handover

TERMS
- Revisions: 2 rounds included. Additional revisions billed separately.
- Ownership: Full ownership transferred to client upon final payment.
- Communication: WhatsApp. Response within 24 hours on business days.

TO PROCEED
Reply to confirm scope and transfer the deposit to:
<payment details -- Azriel fills this in>

Questions? Reply via WhatsApp.

-- Rielcode
```

If the user chose "both", generate WhatsApp summary first, then the full document below it.

---

### 3. Suggest a price (if needed)

If the user said "I'll set it" or seems unsure about pricing, suggest a price based on project type:

| Project type | Suggested range (IDR) |
|---|---|
| Simple landing page | 2,500,000 -- 4,000,000 |
| Custom website (5-8 pages) | 4,000,000 -- 7,000,000 |
| E-commerce (simple) | 5,000,000 -- 9,000,000 |

Explain the suggestion briefly (1-2 sentences) so the user can adjust with confidence.

---

### 4. Offer a follow-up action

After outputting the proposal, ask:
"Want me to log this as a new project in your system, or draft a WhatsApp follow-up to send if they go quiet?"

---

## Rules

- No emojis anywhere.
- No em dashes.
- Use IDR for all currency.
- Keep language professional but not overly formal -- conversational business tone.
- Never invent project requirements -- use only what the user provides.
- If deadline or budget is TBD, write "TBD" in the proposal. Do not guess.
- Payment details (bank account, GoPay, etc.) are left blank -- prompt the user to fill them in.
