---
name: Meta Ads v3 WhatsApp Finding Jun 2026
description: v3 WA Conversations costs ~Rp39k/convo (7x worse than Messenger baseline) but those convos are real buyers; keep running, fix the close not the channel
metadata:
  type: project
---

Reviewed live Meta report 2026-06-11. 7-day spend Rp413k across 3 campaigns. v1 (WA Lead Gen) + v2 paused because they route to Messenger. Only v3 (Rielcode WA Convos v3, WhatsApp Conversations objective) live: Rp272,597 spend, ~7-9 real conversations lifetime = ~Rp39,000 per conversation. That is 7x the old Rp5,702/convo Messenger baseline.

**Why the cost gap does NOT mean revert to Messenger:** The cheap Rp5,702 Messenger convos were spam / no real buyers (vanity metric). WhatsApp's extra friction filters tire-kickers, so v3 convos are genuine prospects (some asked to see example sites). The real leak was Azriel had no examples ready, so leads ghosted at "got examples?". Now fixed: 8 niche demos live at rielcode.com/demos/ [[project_demo_sites]].

**How to apply:**
- Keep v3 running. Don't cut spend or revert to Messenger over CPL alone. Channel was never the problem.
- Optimize for cost-per-qualified-lead / cost-per-close, NOT cost-per-convo.
- When a lead asks for examples, send the niche-matched demo link instantly, framed as a rough idea + fully custom.
- Confirms the close-gap thesis [[feedback_close_gap_not_leadgen]]. Ignore Meta campaign-score suggestions [[feedback_meta_ads_objective_rule]].

**Current budget/balance (live 2026-06-19):** v3 ad set daily budget is **Rp50,000/day** (raised from old 18k). The Rp18k/day figure is the PAUSED v1 campaign, do NOT quote it as current. For any top-up question, fetch live balance via `node meta/balance-check` style query (acct fields: balance, amount_spent, spend_cap) or run `node meta/ads-report.mjs`; never quote a remembered balance, it is stale within a day. Runway = available_balance / 50000.

Related: [[project_coldoutreach_centraljava_2026-06]] [[project_meta_ads_wa_quick_replies]]
