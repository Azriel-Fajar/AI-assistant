---
name: project_meta_ads_v3_whatsapp
description: "Meta WA Lead Gen v3 campaign — published 2026-06-04, optimizes conversations not link clicks; reused v1 dark creative angle"
metadata: 
  node_type: memory
  type: project
  originSessionId: 537a6b52-a521-41f5-a4cc-163bf76c40c0
---

Meta ads campaign "Rielcode - WA Convos v3" published 2026-06-04.

**Why it exists:** v1 and v2 both optimized for `link_click`, so reported "results" were taps not real WhatsApp leads — the core leak. v3 fixes it.

**v3 setup (verified before publish):**
- Performance goal = "Maximise number of conversations" (NOT link clicks). This is the whole fix.
- Message destination = WhatsApp only (manual), number +62 856-6952-2225 (`6285669522225`).
- CTA = WHATSAPP_MESSAGE (v1 used MESSAGE_PAGE = Messenger, wrong).
- Budget 50k/day IDR, 7-day learning. Account spend limit set 400k.
- Targeting = broad Indonesia, Advantage+ placements on, 1 exclusion max.
- Reused v1 winning angle (3.37% CTR): bilingual ID+EN "your business deserves a website, affordable, 7 days, mulai 500rb."
- Form = 1 required single-choice field "Sudah punya website?" (one tap, no typing).

**Baseline to beat:** Local SMB - WA ad set = Rp5,702 per messaging conversation.

**Top-up:** 400k = one clean 7-day v3 cycle (350k) + buffer. Paid 2026-06-04, posting lag normal.

**Verify delivering:** `node meta/ads-report.mjs` from project root — v3 should show Results = messaging conversations, not link_click.

Hands off till ~2026-06-11. See [[feedback_meta_ads_objective_rule]].
