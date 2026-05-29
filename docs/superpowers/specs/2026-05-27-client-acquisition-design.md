# Client Acquisition System — Design Spec
_Created: 2026-05-27_

## Goal
Generate 2 paying clients/month for Rielcode using a multi-channel system that compounds over time with flat ongoing effort.

## Context
- Budget: IDR 200-500k/month
- Solo operator (college + business)
- Primary CTA: WhatsApp DM
- Trust fallback: free 15-min consult call
- Existing assets: YouTube Shorts channel (@rielcodeofficial), Instagram (@rielcode), Salatiga lead list (5 cafes ready)

---

## System Design

### Channel Stack

| Channel | Role | Budget | CTA |
|---|---|---|---|
| Meta Ads (IG/FB) | Cold reach — SMB owners who don't follow us yet | IDR 200-300k/mo | WhatsApp DM button |
| Instagram DM Blitz | Warm local outreach — Salatiga cafes + SMBs | IDR 0 | Direct DM |
| YouTube Shorts | Trust + SEO — shows competence before prospect reaches out | IDR 0 | Link in bio → WhatsApp |

All three feed the same funnel: **WhatsApp DM → free consult call → proposal → close**.

---

### Meta Ads Setup

**Campaign type:** Lead gen (Conversions → WhatsApp messages)

**Target audience:**
- Location: Indonesia (Salatiga + surrounding: Semarang, Solo)
- Age: 25-45
- Interests: small business, cafe/restaurant, online shop, entrepreneurship
- Behavior: small business owners, Facebook page admins

**Ad format:** Single image or 15s Reels (repurposed from YT Shorts)

**Budget split (IDR 200-300k/mo):**
- IDR 7-10k/day
- Run 1 ad set, 2 creatives, A/B for 2 weeks then kill loser

**CTA button:** "Send Message" → opens WhatsApp with pre-filled opener:
> "Halo Rielcode, saya tertarik lihat harga website"

**Ad copy formula:**
- Hook: pain point ("Website kamu belum ada? Atau udah ada tapi nggak convert?")
- Proof: 1 result ("Klien kami di Salatiga dapat X dalam Y hari")
- Offer: low-friction ("Chat sekarang, konsultasi gratis 15 menit")

---

### Instagram DM Blitz

**Cadence:** 5 DMs/day, Mon-Fri

**Target:** Salatiga cafes, clothing stores, service businesses with weak or no website

**Workflow:**
1. Find target via IG location tag or Google Maps
2. Run `/site-review` on their existing URL (if any)
3. Send personalised DM (max 3 sentences, mention their specific weakness)
4. Follow up once on Day 3 if no reply
5. No third message — move on, log in lead-tracker

**DM template (short version):**
> "Halo [Name], saya lihat website [Cafe] dan ada beberapa hal yang bisa dioptimasi buat ningkatin customer online. Kalau mau, bisa chat dulu — gratis."

---

### YouTube Shorts Integration

**Role in funnel:** Authority signal. Prospect sees Short → checks profile → clicks WhatsApp link.

**Content types that drive leads:**
- Audit Shorts (Salatiga business + fixes) — most direct pipeline
- Before/after reveals (from Repurpose pipeline)
- "How I built X in Y hours" — trust signal

**Frequency:** 3x/week (Mon/Wed/Fri) — already locked in growth plan

**Bio link:** Direct WhatsApp link with pre-filled message (same as Meta Ads CTA)

---

## Funnel Diagram

```
Meta Ads ──────┐
IG DM Blitz ───┼──→ WhatsApp DM ──→ Free Consult ──→ Proposal ──→ Close
YT Shorts ─────┘
```

---

## Weekly Rhythm

| Day | Action |
|---|---|
| Mon | Post Short. Send 5 DMs. Check Meta Ads dashboard (spend + click-through). |
| Tue | Respond to any DM replies. Follow up Day-3 DMs. |
| Wed | Post Short. Send 5 DMs. |
| Thu | Respond + follow up. Review 1 ad creative if running. |
| Fri | Post Short. Send 5 DMs. Weekly review: leads in, leads replied, leads converted. |

---

## Metrics to Track Weekly

| Metric | Target |
|---|---|
| DMs sent | 25/week |
| DM reply rate | >20% (5+ replies/week) |
| WhatsApp convos started | 3-5/week |
| Consult calls booked | 1-2/week |
| Proposals sent | 1/week |
| Closed | 2/month |
| Meta Ads CTR | >1.5% |
| Meta Ads cost per WhatsApp message | <IDR 15k |

---

## Dependencies on Existing Systems

- `/lead-tracker` — log every DM target, reply, and status
- `/repurpose-project` — feeds Shorts content from delivered projects
- `/audit-short` — Salatiga pipeline feeds both IG DMs and YT Shorts
- `context/current-priorities.md` — update when client count changes

---

## Open Questions

1. Does the Mon/Wed/Fri Shorts cadence fit schedule post-vacation? (Not yet confirmed by Azriel)
2. Which WhatsApp number is the business line? (Personal vs. dedicated Rielcode number)
3. Meta Ads: use personal FB account or create a separate Business Manager? (Affects ad account setup)

---

## Not In Scope (this spec)

- International client acquisition (LinkedIn, Upwork) — separate system
- Email marketing — covered in growth plan (Month 2+)
- Paid collaborations / influencer outreach
