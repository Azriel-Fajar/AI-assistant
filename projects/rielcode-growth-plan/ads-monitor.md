# Meta Ads Monitor — Rielcode

Append-only weekly log. Pull numbers with `node meta/ads-report.mjs` (or dashboard: `bash meta/dashboard/run.sh`, localhost:5000). Cross-check warm/cold leads against `meta/clients/*.md`.

Each entry ends with a **Verdict + Action** line tied to `ads-playbook.md`.

Account: `act_4261716744142144` | Campaign: `Rielcode - WA Lead Gen` | Budget: IDR 18,000/day

---

## How to log each week

1. `node meta/ads-report.mjs` → copy spend / impr / clicks / CTR / results.
2. `node meta/dms-sync.mjs` then skim `meta/clients/` → count warm vs cold leads.
3. Compute CPL = spend ÷ messaging conversations started (NOT link_clicks — see mismatch note).
4. Pick the matching row in `ads-playbook.md`, write the one-line verdict.

---

## Log

### Week of 2026-06-01 (7-day pull)

| Metric | Value |
|---|---|
| Spend (7d) | IDR 38,323 |
| Impressions | 1,791 |
| Clicks | 61 |
| CTR | 3.41% |
| Reported results | 53 (link_click) |
| Messaging convos started | ~5 (from DMs; under-reported by objective mismatch) |
| Warm leads | 0 |
| Cold leads | 5 (Ilda, Apif, Faiz, Bape, Rudy) |
| Approx CPL (spend ÷ 5 convos) | ~IDR 7,665 |

**Notes:**
- CTR 3.41% is strong (>3% is healthy). Top-of-funnel works.
- Result type still `link_click`, not WhatsApp messages started → **objective mismatch persists**.
- Still in / just exiting learning phase. Hold edits until ~Jun 5 per playbook.

**Verdict + Action:** CPL acceptable, all leads cold → playbook row "CPL good, leads all cold": fix the funnel (auto-reply + reply speed), NOT budget. Plan the NEW campaign with correct WhatsApp/messaging objective for after Jun 5.

---

### Week of YYYY-MM-DD

| Metric | Value |
|---|---|
| Spend (7d) | |
| Impressions | |
| Clicks | |
| CTR | |
| Reported results | |
| Messaging convos | |
| Warm leads | |
| Cold leads | |
| CPL | |

**Verdict + Action:**
