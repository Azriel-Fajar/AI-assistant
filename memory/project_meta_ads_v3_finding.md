---
name: Meta Ads v3 WhatsApp Finding (corrected 2026-08-21)
description: v3 WA ads produced 147 lifetime convos and no confirmed paying customers; cheap cost-per-convo is a vanity metric that measured attraction to free stuff, not buying intent
metadata:
  type: project
---

**This memory was rewritten 2026-08-21. The earlier version was wrong and is corrected below.**

## What the old version claimed, and why it was wrong

The June 2026 version claimed WhatsApp's extra friction filters out tire-kickers, so v3 conversations were genuine prospects, and that the only leak was missing demo examples.

**Overturned by lifetime data (pulled 2026-08-21, act_4261716744142144):**

| Ad | Spend | Convos | Reached msg 3 | Rp/convo |
|---|---|---|---|---|
| v3 \| Free Risk | 349,360 | 85 | 51 | 4,110 |
| v3 \| Contoh Gratis | 392,702 | 40 | 18 | 9,818 |
| v3 \| M1 Lapak Sendiri | 387,458 | 14 | 3 | 27,676 |
| v3 \| Free Demo | 70,400 | 7 | 4 | 10,057 |
| v3 \| M2 Biaya vs Investasi | 31,927 | 1 | 0 | 31,927 |

147 conversations lifetime, no confirmed paying customers. WhatsApp friction filtered nothing. Demos were live the whole time and did not fix it.

Free Risk is the clearest case. Cheapest messages in the account, best depth retention in the account (60% reached msg 3), zero revenue. Copy was "Kita bantu dari nol sampai online. Mulai 500 ribu, konsultasi gratis." Two free signals, one low anchor, no qualifier.

## The corrected finding

**Cheap cost-per-conversation is a vanity metric.** It measured how good an ad was at attracting people who like free things. That attraction is uncorrelated with ability or intent to pay.

The inverted depth pattern proves the mechanism: the least-qualified ad has the BEST message-depth retention (Free Risk 60%), the most qualifying ad has the worst (M1 21%). Free-seekers happily continue a free conversation. Serious buyers hit the price and stop.

**A good ad should produce fewer, more expensive, more qualified conversations.**

## How to apply

- Never judge an ad on cost-per-conversation. It is a diagnostic only. A **rising** cost is expected and fine; a collapse toward ~Rp4,000 means the qualifier fell out of the copy.
- Judge on **quote rate** (quotes sent / convos), then **DP rate**, then **cost per DP**. A conversation only counts if it reached a quote.
- Levels above "sent a message" are NOT in the Meta API. They require manual per-lead logging in `leads/`. Without that logging, ad results are unreadable.
- Lead ad copy with **Mulai 1 juta**, never Rp500rb. Rp500rb is Student Plan: no domain, no hosting, no CMS, positioned for personal/academic use. Rp1jt Starter is the cheapest tier that is actually a business website. The Rp500rb floor appears in every ad that produced non-payers.
- Do NOT restart Free Risk or Contoh Gratis. Verdict is in.
- Free demo is dead as an advertised offer. Demo library stays as the in-inbox reply, per SOP 1.3.
- Do not let one ad starve another. M2 (the closest thing to a qualifying angle) got Rp16k while M1 ate Rp168k in the same 7 days, and died on 1 conversation. It was never tested, it was defunded. Enforce equal spend during a read window, 20% floor per ad after.

## Budget correction

v3 ad set daily budget is **Rp25,000/day**. The old Rp50,000/day figure in this file was wrong. Rp18k/day is the ancient paused v1 campaign, also not current.

Balance 2026-08-21: Rp17,066 available against Rp1,936,935 spend cap. **Not topped up.** Never quote a remembered balance, it is stale within a day. Fetch live before any budget decision.

## Unresolved, highest-value open question

Meta's API cannot report revenue. **Nobody knows which ad produced the customers who paid, or whether any ad ever did.** The "zero paying customers" conclusion is Azriel's read of his inbox, not a systematic reconciliation. A one-time backward pass over WhatsApp threads, tagging each against the ad live at the time, would confirm or overturn this. Declined for now, flagged as top unblocking action.

Successor plan: `meta/evergreen-ads-plan.md`.

Related: [[feedback_close_gap_not_leadgen]] [[project_demo_sites]] [[project_free_demo_ads]] [[project_meta_ads_wa_quick_replies]]
