# AIS-OS Intake

This is the source-of-truth file for your AIOS. Fill it in by typing, voice-pasting (Wispr Flow / OS dictation), or running `/onboard` for a guided conversation. Whichever mode, this file is what `/onboard` reads to scaffold your Day-1 setup.

**Hard cap: 7 questions.** Each answerable in under 60 seconds. Don't overthink — you can edit and re-run `/onboard` any time.

---

## Q1 — Who are you, what do you sell, who do you sell it to?

Identity, offer, ICP. One paragraph each is fine.

```
I'm Azriel, an informatics engineering student running Rielcode solo. I offer custom websites, landing pages, and simple e-commerce -- anything web-related within my current skill level. My ideal client is international (foreign businesses), but local Indonesian SMBs work too. Right now I'm actively targeting local businesses like cafes in Salatiga via Instagram outreach.
```

---

## Q2 — Paste 1-2 things you've written recently. Don't edit them.

An email, a LinkedIn post, a DM, a doc — anything that sounds like you when you're not trying. **Paste verbatim.** Do not type these mid-conversation with Claude — chat-shaped samples are worse than no samples (voice contamination).

```
Hey Ali, I wanted to follow up on the website I uploaded a couple of days ago. Did you and your team get a chance to review it? Let me know what you think.
```

```
selamat sore kak, hanya ingin memastikan, bagaimana dengan review portfolio yang saya beri kemarin?
Tidak apa jika masih ingin melihat-lihat, jika kakak ada pertanyaan apapun, bisa langsung tanya saja ya kak😄
```

---

## Q3 — What are your 2-3 biggest priorities for the next 90 days?

Quarterly priorities. Not yearly aspirations. Things that, if not done by July, would make you say "I wasted Q2."

```
1. Update portfolio.rielcode.com -- add more features and payment gateway integration by end of June 2026.
2. Build and ship Rielcode business app MVP by end of June 2026.
3. Pass all college coursework this semester (semester ends July 2026).
```

---

## Q4 — Where does revenue actually land, and where is it tracked?

Multiple answers OK. Stripe? Skool? GoHighLevel? QuickBooks? A spreadsheet?

```
Bank transfer (Indonesian bank). No tracking system in place -- revenue is not currently logged anywhere.
```

---

## Q5 — Where do you talk to customers, your team, and the outside world day-to-day?

Email (which one — Gmail / Outlook)? Slack? Teams? DMs (Skool / Discord / iMessage)? Phone?

```
WhatsApp (primary client communication). Instagram DMs (outreach to local businesses). Gmail (seldom used, but want to use for client confirmations). No team -- solo.
```

---

## Q6 — Where do meeting recordings, notes, and important docs live?

Granola? Otter? Fireflies? Google Drive? Notion? Dropbox? A folder on your desktop you keep meaning to organize?

```
No system currently. Wants to build one -- goals: note-taking, payment tracking, Gmail for client confirmations.
```

---

## Q7 — What's the one task that eats your week, and where do you currently track work?

The single biggest time-suck or recurring drudgery. Plus where tasks/projects live (ClickUp / Asana / Linear / Notion / a notebook).

```
Top pain: classes eat most of the week. For work, biggest drudgery is strategic paralysis -- brainstorming what to do next and figuring out the right order of actions. No automated project tracking system in place.
```

---

When this file is filled, run `/onboard` (or re-run it) and the wizard will scaffold your Day-1 file set: `context/`, `references/voice.md`, populated `connections.md`, and a filled `CLAUDE.md`.