# Meta Ads Playbook — Rielcode

Decision tree. Read this every time you review ads (`ads-monitor.md`). Pick the row that matches, do the action, log it. Never guess.

Account: `act_4261716744142144` | Campaign: `Rielcode - WA Lead Gen` | Budget: IDR 18,000/day

---

## Phase gate — learning phase (until ~2026-06-05)

- Campaign is in / just exiting Meta's learning phase.
- **Report numbers only. Do NOT** pause, change budget, or change creative.
- Editing resets learning and wastes spend already invested.

---

## After learning phase (Jun 5+) — branch on CPL + volume

CPL = spend ÷ messaging conversations started. (Reported `link_click` count is inflated by the objective mismatch — count real WhatsApp convos from `meta/clients/`.)

| Signal | Threshold | Action |
|---|---|---|
| CPL good, leads converting | CPL < IDR 8k AND ≥1 warm lead/wk | **Scale.** Raise budget +20-30% every 3-5 days. Don't touch creative while it works. |
| CPL good, leads all cold | CPL < IDR 8k AND 0 warm | **Fix funnel, not budget.** Better auto-reply + reply within 1 hour. More spend just buys more cold leads. ← current state |
| CPL high | CPL > IDR 15k | **New creative angle first.** If no lift in 7 days, tighten audience. Budget last. |
| No messages | <3 convos/wk | Raise budget OR launch the corrected-objective campaign (below). |
| Objective mismatch persists | always true now | **Launch NEW campaign**, objective = WhatsApp/messaging conversations, not engagement/clicks. This is the real fix — do not keep editing the old one. |

---

## Campaign expansion ladder (months)

Add one stage at a time. Don't fragment budget early.

1. **Now** — Fix + stabilize the one WA Lead Gen campaign (correct objective).
2. **+Traffic** — Drive to the new rielcode.com once it ships. Builds a retargeting pool + video viewers.
3. **+Retargeting** — Site visitors + video viewers → warm messaging campaign.
4. **+Sales/Leads form** — Only once volume + tracking justify it (50+ conversions of history).

---

## Funnel fixes (from the 5 cold-lead post-mortem)

All 5 first leads went cold. Root causes + fixes:

- **Auto-reply was an info dump with no question.** → Open-ended question, English-first (all 5 wrote English), no price upfront.
- **Price (IDR 500k / $30) sent before value.** → Establish fit + value first, then quote.
- **7+ hour reply gap (Faiz).** → Reply within 1 hour while the lead is warm.

---

## Budget rules

- Never raise during learning phase.
- Raise max +20-30% per change, wait 3-5 days between raises.
- Only raise when messages stop coming and you need more volume — not to fix cold leads.

---

## When the video ad is ready

- Run it as a NEW ad inside the corrected-objective campaign (or a fresh Traffic/Engagement test).
- Test against current static creative. Keep the winner by CPL + warm-lead rate, not CTR alone.
- Refresh creative when frequency climbs / CTR drops (ad fatigue).
