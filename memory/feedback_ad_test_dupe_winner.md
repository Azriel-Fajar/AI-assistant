---
name: Ad Test Dupe Winner Not Pause Control
description: when testing new ads, dupe the winning ad to inherit its setup; never pause the control/winner; pause dead ads only AFTER new ads prove
metadata:
  type: feedback
---

When adding new ad variations to test against a proven winner (e.g. Contoh Gratis), duplicate the winning ad rather than building from scratch, then swap only video + headline + primary text. Pause dead ads only after new ads confirm performance, never before.

**Why:** Duping copies the proven setup (WA destination, CTA button, audience link, Conversations objective [[feedback_meta_ads_objective_rule]]) so you don't fat-finger a wrong objective. Pausing the winner/control mid-test leaves nothing delivering if the new ads flop. New ads upload as "Processing" with Rp0 spend until Meta approves them, so they have zero data on day one.

**How to apply:**
- Keep the control (winner) ON during the test.
- Pause only confirmed-dead ads, and only once 1-2 new ads hit decent CTR + depth-5 convos.
- If Azriel is past the ad-set learning phase, pausing dead ads won't reset learning, so it's safe then.
- Meta API writes are blocked; pause/edit in Ads Manager UI only [[project_meta_ads_v3_finding]].

Related: [[project_free_demo_ads]] [[feedback_close_gap_not_leadgen]]
