---
name: feedback_meta_ads_objective_rule
description: "Meta WA campaigns must optimize \"conversations\" not link clicks; ignore Meta's campaign-score suggestions — they are traps"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 537a6b52-a521-41f5-a4cc-163bf76c40c0
---

For any Rielcode Meta ad meant to drive WhatsApp leads: the ad-set Performance goal MUST read "Maximise number of conversations" — never "link clicks."

**Why:** v1 and v2 both optimized link_click. Reported "results" were taps, not real leads. Cost looked fine but no conversations. Burned budget on the wrong action. Found 2026-06-04.

**How to apply:**
- New WA campaign: use Engagement objective -> "Tailored messages" preset (bakes in message optimization + Advantage+ broad).
- Before publish, open ad set -> Optimisation & delivery -> confirm goal = conversations.
- After publish, run `node meta/ads-report.mjs`; Results must show messaging conversations, not link_click.

**Meta suggestions are traps — ignore all:**
- "Campaign score" is vanity, not profit. Leaving it at 77 is fine.
- "Lower cost 9% / add destinations" = adds Messenger+IG, splits leads off WhatsApp. Actively harmful. NEVER.
- "Mix video + images / duplicate ad" = dilutes the winning creative. Skip.
- "+Advantage+ enhancement" = auto-alters the video. Skip, keep creative clean.
- Per ads-algorithm-context.md: Meta wants your money, suggestions serve Meta first. Test, don't obey.

See [[project_meta_ads_v3_whatsapp]].
