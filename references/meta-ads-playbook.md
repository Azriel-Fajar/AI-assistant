# Meta Ads Playbook (Rielcode)

Last updated: 2026-05-29
Purpose: JARVIS uses this to guide Azriel through Meta (Facebook/Instagram) ads for Rielcode.
Sources: `transcripts/vaBxYgZ7MAU.md` ("How To Succeed With A NEW Meta Ad Account in 2026", Ben Heath) + 2026 web research (see Sources).

Azriel's setup:
- Objective: **Sales**. Conversions arrive 3 ways: website inquiry, WhatsApp, Instagram/Facebook DM.
- Markets: both Salatiga/local SMBs AND international businesses (separate avatars per market).
- Account: NEW. No ad created yet. Dedicated Facebook + Instagram + WhatsApp Business accounts ready.
- **Budget: 18,000 IDR/day for now** (Meta accepts it in his account — IDR floors are lower than the USD estimate). Will increase if growth is noticeable.
- **Ad destination (current phase): existing/previous Rielcode website + WhatsApp link.** NOT the Laravel redesign yet — redesign (`C:\xampp\htdocs\rielcode-laravel`) launches faster + gets proper hosting only IF ads perform.
- Pricing for offers: `references/rielcode-pricing.md` (flagship = Pro Plan). Redesign rounds prices: Student 500k/$29, Starter 1jt/$57.99, Pro 2.5jt/$145, Premium 5jt/$290 (50% off originals).

---

## 1. How Meta ads work (system)

3-level hierarchy:
- **Campaign** = objective + (with CBO) budget.
- **Ad set** = audience, placement, schedule, budget (with ABO), optimization event.
- **Ad** = creative + copy. Multiple ads allowed per ad set.

Core truth: **Meta optimization is literal.** It delivers exactly the event you optimize for. Ask for link clicks → get link clicks, even from bots. So optimize for the action you actually want (a sale/conversation), never a vanity proxy.

**Learning phase:** after launching a new ad set or making a significant edit, Meta enters learning (~24-48h, varies). Needs ~50 optimization events per ad set per week to exit. Results volatile during learning. Meta keeps learning after, but heavy foundational testing happens early.

---

## 2. Campaign objective (Sales) + messaging destinations

6 objectives (ODAX): Awareness, Traffic, Engagement, Leads, App Promotion, Sales.

**Azriel = Sales.** Do NOT use Traffic/Engagement "to warm the pixel" — transcript explicitly debunks that. New accounts CAN run conversion campaigns from day one; they're just less data-rich than aged accounts.

Advantage+ Sales (ASC) now covers sales/leads/messaging with AI targeting; CBO is default in 2026.

### Two destination types under Sales
- **(a) Website conversion** — click goes to rielcode.com / a landing page; conversion tracked by Pixel+CAPI.
- **(b) Messaging — Click-to-WhatsApp (CTWA) / Click-to-Messenger / Instagram DM** — click opens a chat. This is Azriel's primary sales channel (WhatsApp-first).

### Messaging ads — important nuance
- CTWA conversions tracked via CAPI `ctwa_clid` parameter, NOT the website pixel.
- On a NEW account, Sales objective optimizing for a messaging *purchase* has thin data (no conversion history yet).
- **Recommended path:** START with CTWA optimizing for **Conversations** (Engagement-style perf goal) to build volume + data fast → GRADUATE to Sales objective optimizing for the conversion event once CAPI attribution matures and you have message→sale history. This is a deliberate deviation from "always Sales" justified by new-account data scarcity.
- CTWA upside (2026 Meta data): ~94% higher conversion rate, ~92% lower cost/lead vs traditional formats; WhatsApp conversation fees waived 72h after ad click. Strong fit for Azriel.

---

## 3. Conversion tracking (the #1 mistake)

### Website path
- Meta **Pixel + Conversions API (CAPI)** together. 2026: one-click "Activate Conversions API" in Events Manager → ~17.8% lower cost/result. Run both, dedupe via matching `event_id`.
- Standard events placement:
  - `PageView` → landing page.
  - `Lead` → thank-you page (after form submit).
  - `Purchase` → order-confirmation page. Send `value` + `currency`.

### Messaging path (WhatsApp/DM)
- Website pixel does NOT see WhatsApp/DM sales. Tracking flows through Meta's messaging integration + CAPI `ctwa_clid`.
- On a new account, "Conversations" is the reliable optimization signal until message→sale data accumulates.
- Don't expect the pixel dashboard to show WhatsApp revenue — that's normal.

### Critical bug to avoid (transcript)
`Lead`/`Purchase` firing on **landing-page load** instead of post-conversion. This tells Meta everyone converts → Meta floods the page with any traffic (bots/spam) → optimization dies. A pixel that "thinks it's working" is worse than one that doesn't.
- **Verify with Meta Pixel Helper (Chrome extension):** on the landing page, ONLY `PageView` should fire. `Lead`/`Purchase` should fire only on thank-you / confirmation pages.

---

## 4. Budget & spend (2026 benchmarks)

- Platform floor: $1/day (impression objectives), $5/day (conversion objectives).
- Practical small-business minimum: ~$25-50/day for enough optimization data.
- **Learning-phase budget formula:** `(Target CPA × 50) ÷ 7 = min daily budget per ad set`.
- CPL benchmarks: local service avg ~$45/lead; range ~$15-150+ by industry/offer.
- **Azriel's actual budget: 18,000 IDR/day** (~$1.10, ~540k IDR/mo). Far below the $25-50/day ideal. Implications:
  - Run ONE campaign, ONE ad set, ONE offer, ONE destination. Never fragment this budget.
  - Will NOT reliably exit learning phase (~50 events/wk). Expect low impressions, slow/no learning. Treat early runs as workflow practice + creative-reach test, not a true performance verdict.
  - Respect much longer assessment windows (weeks, see §8). Don't conclude "ads don't work" at this spend.
  - Cheapest high-intent funnel = CTWA (Conversations) or WhatsApp-link destination. Prioritize that over website-conversion optimization at this budget.
  - Plan: raise budget toward ~$5/day (~80k IDR) as soon as any signal appears, so an ad set can actually learn.

---

## 5. Campaign structure for a NEW account (transcript core)

- Start with **ONE campaign, ONE ad set, multiple ads** inside. Don't split a small budget across many campaigns/ad sets — kills learning and your ability to read results.
- Lead with **one offer**: best-seller / most profitable. For Rielcode = **Pro Plan** (most popular) per `references/rielcode-pricing.md`. At 18k IDR/day to a local audience, **Starter Plan** (1jt / $57.99) may be the better low-friction entry offer to generate first conversations, upsell to Pro later.
- **Destination this phase:** existing website + WhatsApp link (not the Laravel redesign). Make sure the WhatsApp link / number is the dedicated WhatsApp Business account.
- **NEVER boost posts from the Facebook/Instagram app.** Worse functionality + 30% Apple tax on iOS. Always Ads Manager on desktop.

---

## 6. Differentiation with specificity (transcript)

Don't write one ad for the whole market. Break market into avatars; write ads that make each say "that's me." Big competitors go mass-market — specificity is how a solo player wins.

### Rielcode avatars (both markets)
Local (Salatiga/Indonesia):
- Cafe / F&B owner with no website (or only Instagram).
- Local SMB needing first professional site.
- Local shop wanting simple e-commerce (catalog + WhatsApp order).

International:
- Early startup / founder needing a fast landing page.
- Small e-commerce brand needing a clean store.
- Freelancer/coach needing a portfolio/personal site.

Same service, tailored hook + proof + offer per avatar. Messaging tone per `.claude/rules/communication-style.md` (no emojis, no em dashes, direct).

---

## 7. Creative

- **3-5 ads per ad set** (algorithm needs variation; consolidation beats over-segmentation).
- Budget-constrained → produce many cheap variations (different hooks, angles, formats, first-frame). Iteration > production spend; Meta rewards testing volume.
- Higher-cost option: influencer/UGC via Meta Creator Marketplace — scroll-stopping + trusted recommendation. Not required for Azriel's budget now.
- Strong first 3 seconds (hook) drives hook rate; the rest holds attention and drives the click.

---

## 8. Respect the learning phase / fixed schedule (transcript)

- Do NOT tinker constantly — constant edits = perpetual learning phase = wrecked results.
- Set a **fixed assessment cadence** (e.g. 5 / 7 / 10 days), batch all changes, then let it re-learn, then assess again.
- Cadence scales with conversion volume: few conversions/week → wait weeks before judging; 200/day → judge same day. At Azriel's budget, lean toward longer windows.

---

## 9. Results diagnostic framework (transcript — most-used section)

Read the metrics, then act by symptom:

| Symptom | Root cause | Action |
|---|---|---|
| No conversions at all | **Offer problem** (rarely targeting — Meta is good at targeting now) | Differentiate, reduce risk (guarantees), improve price/value, make value clearer. Ref: Hormozi $100M Offers |
| Some conversions, low hook rate + low CTR | **Ad creative problem** | New hooks/creative; ads aren't grabbing/holding attention |
| Some conversions, high CTR/hook rate | **Landing page / post-click problem** | Add proof, supporting info; remove friction/objections |
| Lots of conversions, not profitable | **Model problem** | Adjust pricing, add upsells (e.g. hosting/maintenance/CMS upgrade) |
| Lots of conversions + profitable | **Scale** | Increase budget; keep improving |

Most common real-world case = **ad creative problem**. Don't conclude "Meta ads don't work" — businesses spend more on Meta than any channel; if results are bad it's offer/creative/landing/model, not the platform.

---

## 10. Glossary

- **Hook rate** — % who watch past first ~3s of a video ad. Measures the hook.
- **CTR** — click-through rate; clicks ÷ impressions.
- **CPA / CPL** — cost per acquisition / cost per lead.
- **CBO** — Campaign Budget Optimization (budget at campaign level, Meta distributes). 2026 default.
- **ABO** — Ad Set Budget Optimization (budget per ad set).
- **Advantage+ / ASC** — Meta's AI-automated campaign type (now covers sales/leads/messaging).
- **ODAX** — Outcome-Driven Ad Experience; the 6-objective system.
- **Learning phase** — early period where Meta tests delivery; needs ~50 events/ad set/week to exit.
- **Ad set** — middle level: audience + placement + schedule + budget + optimization event.
- **Optimization event** — the action Meta optimizes delivery toward.
- **CTWA** — Click-to-WhatsApp ad; click opens a WhatsApp chat. `ctwa_clid` = its tracking param.
- **Instant Form** — Meta's native lead form (fills inside the app, no website needed).

---

## 11. How JARVIS guides Azriel

- **Default (no Playwright):** Azriel describes or screenshots the Ads Manager screen; JARVIS gives the next step from this playbook. JARVIS does NOT use Playwright unless Azriel explicitly grants it.
- **When granted Playwright:** JARVIS drives/observes Ads Manager for precise screen-by-screen guidance.

---

## Sources

- Transcript: `transcripts/vaBxYgZ7MAU.md` (Ben Heath, 2026).
- Campaign structure / objectives / Advantage+: adstellar.ai, get-ryze.ai, bir.ch (2026 guides).
- Pixel + CAPI: funnelfox.com, segwise.ai, developers.facebook.com (2026).
- Budgets / learning phase / CPL: stackmatix.com, get-ryze.ai, adovateagency.com (2026).
- CTWA / Click-to-Messenger: aichat.com, egrow.com, omnichat.ai, facebook.com/business (2026).
