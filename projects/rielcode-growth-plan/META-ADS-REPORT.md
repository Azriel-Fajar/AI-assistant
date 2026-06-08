# Meta Ads Health Report — Rielcode Ads

_Generated: 2026-06-08 | Window: last 30d (2026-05-09 to 2026-06-07) | Currency: IDR_

> **CORRECTION (2026-06-08, post-audit):** Original Quick Win #1 said "Website Ad 1 is 5x cheaper, shift budget to it." **Wrong.** Website Ad 1 (Local SMB ad set) routed to **Messenger** (`destination_type=MESSAGING_MESSENGER_WHATSAPP`), not WhatsApp. Convos v3 is the **same creative** but WhatsApp-only. The Rp 1,045 vs Rp 5,425 CPC gap was **Messenger-vs-WhatsApp channel cost, not creative quality.** WhatsApp convos genuinely cost ~2-5x Messenger.
>
> **Action taken:** Paused the "Rielcode - WA Lead Gen" campaign (v1/Messenger). Only **Convos v3** runs now — WhatsApp-only, Rp 50k/day ad-set budget. Clean 7-day WhatsApp test in progress. Measure true cost-per-WA-convo before scaling.

## Account Snapshot

| Field | Value |
|---|---|
| Account | Rielcode Ads (act_4261716744142144) |
| Status | Active |
| Spent (lifetime) | Rp 404,112 |
| Balance | Rp 57,673 |
| Objective (all) | OUTCOME_ENGAGEMENT → CONVERSATIONS (WhatsApp) |
| Campaigns | 3 (2 active, 1 paused) |

---

## Meta Ads Health Score: 58/100 (Grade: D+)

```
Messaging/Tracking:  40/100  ████░░░░░░  (30%) — no CAPI on WA convos, thin conversion depth
Creative:            55/100  █████░░░░░  (30%) — 2 ads share copy, low format diversity
Account Structure:   65/100  ██████░░░░  (20%) — clean but fragmented, learning-limited risk
Audience:            75/100  ███████░░░  (20%) — healthy frequency, broad targeting OK
```

> Note: standard Pixel/CAPI block re-scoped. This is a WhatsApp **CONVERSATIONS** account, not Sales/Leads with Pixel. Web-conversion checks N/A. Scored on messaging funnel health instead.

---

## Performance (30d)

| Metric | Value | Benchmark | Verdict |
|---|---|---|---|
| Impressions | 7,894 | — | low volume (small budget) |
| Reach | 6,323 | — | — |
| Frequency | 1.25 | <3.0 prospecting | ✅ PASS (healthy, no fatigue) |
| CTR | 2.43% | ≥1.0% | ✅ PASS (strong) |
| CPC | Rp 1,805 | — | ✅ good |
| CPM | Rp 43,905 | — | mid |
| Spend | Rp 346,587 | — | — |
| **WA convos started (7d)** | **27** | — | core metric |
| **WA convos replied (7d)** | **8** | — | ⚠️ only 30% reply-through |
| Cost / convo started | Rp 12,837 | beat Rp 5,702 baseline | ❌ FAIL — 2.25x worse than v2 baseline |

---

## Findings by Category

### Messaging / Conversion Funnel (30%) — 40/100

- ❌ **Cost per WA convo Rp 12,837 — 2.25x the Rp 5,702 baseline.** Worst signal in account.
- ❌ **Funnel leak: 27 started → 8 replied (depth-2) → 3 reached depth-5.** Drop-off after first message. Welcome/auto-reply or speed-to-reply weak.
- ⚠️ No CAPI for messaging events. WhatsApp business signal not fed back to Meta for optimization. Limits Lattice learning.
- ⚠️ 2 messaging blocks (users blocked the chat). Small but watch — implies mismatch or over-messaging.

### Creative (30%) — 55/100

- ❌ **Format diversity = 1.5.** 1 VIDEO (Convos v3) + 2 SHARE (post boosts). Rubric wants ≥3 formats (image, video, carousel, collection). No carousel, no static image variant.
- ❌ **Entity-ID clustering risk MEDIUM.** "Website Ad 1" + "WA Convos v3" both push same offer ("Website mulai 500rb", WA CTA). Same concept, same hook → Andromeda likely clusters → suppression.
- ✅ Copy is solid: clear offer, price anchor (500rb), free consult, single CTA. Headline "Website Mulai 500 Ribu" = 20 chars (✅ <40). Body 117 chars (✅ <125).
- ⚠️ Only 1 distinct concept across whole account. Rubric concept-diversity score ~3/10.

**Creative-as-targeting score: 4/10 (MEDIUM clustering risk)**
| Axis | Score |
|---|---|
| Concept diversity | 1 — single "cheap website" message |
| Format diversity | 1 — video + share only |
| Visual diversity | 1 — same brand look |
| Hook diversity | 0 — same offer hook |
| Headline diversity | 1 — price-led only |

### Account Structure (20%) — 65/100

- ⚠️ **3 campaigns, all same objective.** Rubric wants 1-3 total — OK count, but they overlap (all WA convos). Consolidate to 1-2.
- ⚠️ **"Local SMB - WA" ad set has NO daily_budget set** — likely CBO or misconfigured. Verify it's funded.
- ⚠️ Budget per ad set Rp 18-50k/day. Cost-per-convo Rp 12.8k = budget covers only ~1-4 convos/day. **Below 5x-CPA learning-exit threshold** → ad sets likely stuck Learning Limited.
- ✅ Naming clean and versioned (v2, v3).
- ✅ Paused old v2 — good hygiene.

### Audience (20%) — 75/100

- ✅ Frequency 1.25 (prospecting) — well under 3.0. No saturation.
- ✅ Broad WA messaging targeting fits Andromeda "go broad" logic.
- ⚠️ Can't confirm exclusions (existing convos excluded from prospecting). Low volume = minor for now.

---

## Quick Wins (ranked by impact)

1. **Fix cost-per-convo (Rp 12.8k → target <6k).** Biggest lever. The video ad (Convos v3) costs Rp 5,425/click vs Website Ad 1 at Rp 1,045/click. **Website Ad 1 is 5x cheaper and drove 21 of 27 convos.** → Shift budget to Website Ad 1, pause/rework Convos v3 video.
2. **Kill creative clustering.** Convos v3 + Website Ad 1 compete in same Entity-ID cluster. Run ONE as primary. Build a genuinely different 2nd concept (e.g. social-proof / portfolio angle, not price angle).
3. **Plug the reply leak.** 27 started but only 8 replied. Set WA Business instant auto-reply + reply within 5 min. Use your existing 6 quick-reply presets.
4. **Consolidate campaigns.** Merge 2 active WA campaigns into 1 with 1-2 ad sets. Pools budget → exits Learning Limited faster.
5. **Add CAPI for messaging** (optional, advanced). Feed WA conversation events back via Conversions API → better Lattice optimization.

---

## Verdict

CTR and frequency are healthy — **the ads get clicks**. The problem is **downstream**: cost-per-conversation is 2.25x baseline, the funnel leaks after first message, and all creative is one concept (clustering risk). Single highest-ROI move: **put budget behind "Website Ad 1" (5x cheaper convos), pause the expensive video, and fix WA reply speed.**
