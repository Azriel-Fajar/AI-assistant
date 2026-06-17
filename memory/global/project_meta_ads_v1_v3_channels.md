---
name: project-meta-ads-v1-v3-channels
description: "Meta Ads v1 (Local SMB) = Messenger, v3 = WhatsApp, same creative; cost gap is channel not quality"
metadata: 
  node_type: memory
  type: project
  originSessionId: 39b3b280-97e8-4d6b-b809-dabda9a76c0b
---

Rielcode Ads account (act_4261716744142144, IDR) WhatsApp lead-gen campaigns. Three ad variants share the SAME creative concept ("Website mulai 500rb", WA CTA). The only real difference is messaging destination:

- **v1 "Local SMB - WA" / "Rielcode - Website Ad 1"** → `destination_type=MESSAGING_MESSENGER_WHATSAPP` → Meta auto-routes to **Messenger** (cheaper channel). Showed ~Rp 1,045 CPC, looked "5x cheaper."
- **v3 "WA Convos v3"** → `destination_type=WHATSAPP` only → **WhatsApp** (Azriel's real client channel, 6285669522225). ~Rp 5,425 CPC.

**The cost gap (Rp 1,045 vs Rp 5,425, or Rp 12.8k vs cheaper per convo) is Messenger-vs-WhatsApp CHANNEL cost, NOT creative quality.** Same ad. WhatsApp convos legitimately cost 2-5x Messenger.

**Why:** A `/ads meta` audit on 2026-06-08 wrongly recommended shifting budget to v1 as "cheaper." That was comparing channels, not ads. Corrected after Azriel pointed out v1 leads to Messenger.

**How to apply:** Never call v1/Local SMB "cheaper" or "better" — it's just Messenger. WhatsApp is the goal channel; accept its higher cost. Message destination is LOCKED on live ad sets (can't edit; must duplicate). 2026-06-08 state: v1 + v2 PAUSED, only v3 ACTIVE (WhatsApp-only, Rp 50k/day ad-set budget) for a clean 7-day WA cost test. Baseline to beat: Rp 5,702/convo. See [[project_meta_ads_v3_whatsapp]] and [[feedback_meta_ads_objective_rule]].

**API note:** META_ACCESS_TOKEN (System User "rielcode-reporting") has ads_read but writes are BLOCKED (subcode 4841013) — can audit via API, cannot edit. Edits must be done in Ads Manager UI or by granting the System User "Manage campaigns" task.
