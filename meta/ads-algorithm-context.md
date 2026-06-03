# Meta Ads Algorithm -- Context Notes
_Source: "The Entire Meta Ads Algorithm Explained in 21 Mins" by Mark_
_Video: https://youtu.be/JMw6SmRdYQY_
_Added: 2026-06-03_

---

## The 4-Step Ad Selection Process (200ms window)

Every time a user opens Instagram/Facebook and scrolls past an ad, Meta runs this in under 200ms:

1. **Retrieval** -- tens of millions of ads → millions. Filters by relevance to user.
2. **Light Ranking** -- millions → thousands. Minimal processing.
3. **Heavy Ranking** -- thousands → hundreds. The equation runs here.
4. **Auction** -- hundreds compete. Highest total value wins the impression.

---

## The Value Equation (Heavy Ranking)

`Total Value = Advertiser Value + Consumer Value`

**Advertiser Value** = `Bid × Estimated Action Rate`

For conversion campaigns:
- Estimated Action Rate = `Estimated CTR × Estimated Click-to-Conversion Rate`

**Consumer Value** = penalizes bad user experience (spam, scam-like ads, aggressive tactics)

### What this means practically:
- High CTR = Facebook rewards you with lower CPMs and cheaper traffic over time
- High conversion rate = more efficient spend
- CTR is a proxy for ALL soft metrics: hook rate, hold rate, cost per 3-second view, CPC
- Conversion rate = how well your funnel turns clicks into buyers

---

## The Andromeda Update

- Caused by AI flooding the platform with mass-produced creatives
- Meta updated the retrieval step's sorting to handle this
- **Key consequence:** Your creative IS your targeting now. Not your ad set.
- Meta reads: hook, format, demographics shown in video, copy, script, thumbnail, landing page
- Result: audiences (interest, lookalike, custom) matter less. Run broad.

### Practical targeting approach post-Andromeda:
- Broad targeting by default
- Advantage+ campaigns
- One exclusion max (purchasers), nothing else
- Let the creative signal who to target

---

## Learning Phase -- Reality vs Theory

**Theory:** Ads go through a learning phase, then stabilize.

**Reality:** Ads never stop learning. The "learning phase" concept is overrated.

- Inconsistency is normal, especially under ~$1k/day spend
- Sine-wave results are expected -- Facebook is emotional humans
- Fix: zoom out. Look at 7-day+ windows. Don't make decisions on daily swings.
- If results fluctuate: make better ads, not more adjustments

---

## Signal Quality / EMQ / Conversions API

- EMQ (Event Match Quality) -- scale 1-10 in Events Manager, purchase event
- Better data sent back to Meta = better optimization over time (theoretically)
- Use Conversions API (server-side tracking) to improve EMQ, especially post-iOS 14
- iOS 14 (early 2021) broke browser-side attribution -- users can opt out of tracking
- **Practical:** Don't trust Meta's own CPA numbers. Use third-party attribution (Triple Whale, Hyros, or custom)
- EMQ score has no direct correlation to profitability -- overrated metric

---

## Creative Diversity (Post-Andromeda)

Two types of creatives:
1. **Net new concept** -- entirely different angle/idea
2. **Variation** -- same concept, different hook/format/angle

**Key insight:** Variations still work. Test one concept with 3 different hooks.
- The variation might outperform the original
- It's not "variations are dead" -- it's "variations of a winner rarely beat the winner"
- Structure: 1 ad set = 1 concept + 3-4 variations of that concept

---

## Bidding Strategies

- **Lowest cost (auto)** -- Facebook bids for you. Works fine even at high spend ($50k+/day accounts run it profitably).
- **Cost caps** -- cap on max amount to acquire a customer
- **Bid caps** -- cap on max bid amount
- **Target ROAS / Max value** -- other options

Don't obsess over bidding strategy. Choose what solves YOUR constraint.
Think like an entrepreneur, not a media buyer.

---

## How the Game Really Works (Off the Books)

- Meta is a public company. Earnings reports drive ad policy enforcement.
- **Ban waves correlate with earnings cycles.** Strict after bad earnings, loose after good ones.
- Same ad: one account approved, another rejected -- no consistent rule enforcement
- Facebook suggestions ("lower your cost per result by 11%") are often traps
- High EMQ, perfect CAPI setup ≠ profitable. It's a suggestion to spend more.
- Meta wants your money. Their advice serves Meta's interests first.

**Rule:** Question everything Meta tells you. Test it yourself. Don't follow their suggestions blindly.

---

## 3 Core Takeaways

1. **Creative is the targeting.** Run broad. Stop fiddling with audiences.
2. **Make creatives that stop the scroll.** High CTR = half the battle.
3. **Don't ruin the user experience.** Aggressive/spammy ads get penalized at the consumer value layer.
