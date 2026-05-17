# /email-course-builder

**Purpose:** Turn a course outline into 7 production-ready emails for the "$0 to First Website in 7 Days" lead magnet sequence. Outputs copy-ready emails + Brevo/Mailchimp automation setup instructions.

**Usage:** `/email-course-builder`
- No args needed — curriculum is pre-defined below
- Pass a custom outline to override: `/email-course-builder [outline-file]`

---

## What this skill does

Writes all 7 emails of the lead magnet course, then gives step-by-step setup instructions for the email automation in Brevo (recommended) or Mailchimp.

Each email: subject line + preview text + body (300-500 words) + CTA.

---

## Curriculum (pre-defined)

| Day | Topic | CTA |
|---|---|---|
| 1 | Why your business needs a website | Reply with your business type |
| 2 | Pick your domain in 10 minutes | Share what domain you're eyeing |
| 3 | Free hosting options (Hostinger, Niagahoster) | None — pure value |
| 4 | Pick a builder (Carrd, Squarespace for DIY) | Which builder sounds right? |
| 5 | Write copy that converts (hero + 3 sections) | Send your draft hero line |
| 6 | Get found on Google (basic SEO checklist) | None — pure value |
| 7 | When DIY breaks down — Rielcode quote inside | Book a free call or DM |

---

## Email structure (per email)

```
Subject: [Day X] [Curiosity hook — max 50 chars]
Preview: [Continuation of hook or benefit — max 90 chars]

Hi [first_name],

[Opening line — reference yesterday's email or a relatable pain point. 1-2 sentences.]

[Core lesson — 3-5 short paragraphs or a quick-numbered list. Actionable. No fluff.]

[Transition to CTA — 1 sentence bridging lesson to action.]

[CTA — one action only. Bold or button if supported.]

Talk tomorrow,
Azriel
Rielcode — rielcode.com
```

---

## Day 7 email — special structure

Day 7 is the conversion email. Extended structure:

```
Subject: Day 7: When DIY breaks down (and what to do)
Preview: This is the email I wish someone sent me.

Hi [first_name],

[Acknowledge they made it through 7 days — brief, not gushing.]

[Honest framing: DIY is great for some, but not everyone has time or runs into problems.]

[Transition: "If you're in that second group, this is for you."]

[Rielcode pitch — 3 bullets max:
- What you get
- How fast
- What it costs (range or "starting from")]

[Soft CTA: "No pressure — DM me on WhatsApp or reply to this email. I'll give you a straight quote within 24 hours."]

[WhatsApp link + email]

[P.S. — reminder of their audit ID if they used the audit tool, or a teaser for what's on rielcode.com]
```

---

## Steps when invoked

1. **Read context** — check `projects/rielcode-growth-plan/README.md` for any curriculum updates since this skill was written
2. **Generate emails** — write all 7 in sequence, one after another, formatted as shown above
3. **Output to file** — save to `projects/rielcode-growth-plan/email-course/emails.md` (one H2 per email)
4. **Setup instructions** — after all 7 emails, output Brevo setup steps:

### Brevo automation setup

1. Create Brevo account (free tier: 300 emails/day)
2. Create a contact list: "Mini Course Subscribers"
3. Create automation: trigger = "Contact added to list"
4. Add 7 "Send Email" steps, each with delay:
   - Email 1: immediately
   - Email 2: +1 day
   - Email 3: +2 days
   - Email 4: +3 days
   - Email 5: +4 days
   - Email 6: +5 days
   - Email 7: +6 days
5. Connect signup form: embed Brevo form on rielcode.com/free-course (or link from audit tool thank-you page)
6. Test: subscribe with your own email, confirm all 7 arrive on schedule

### UTM tracking (add to all links)

`?utm_source=email-course&utm_medium=email&utm_campaign=mini-course-day[X]`

---

## After setup

- Link the signup form in: YT bio, IG bio, audit tool thank-you page, rielcode.com footer
- Monthly: check Brevo dashboard — open rate, click rate, Day 7 conversions
- If Day 7 CTR <2% after 50 signups: revise the pitch, test new subject line

---

## Rollout timing (from growth plan)

- Write emails: Week 5-6 (Jun 15 - Jul 5)
- Set up automation: Week 7 (Jul 6-12)
- Launch: July 2026
