# Plan: Rielcode Evergreen Meta Ad Set

Status: DRAFT, awaiting approval. No ad copy written yet.
Written 2026-08-21. Replaces the Merdeka promo ads when they expire 31 Aug 2026.

---

## 0. The premise this plan is built on

Every ad in the account was optimized to make messages cheap. It succeeded. It produced 147 conversations lifetime and zero confirmed paying customers.

| Ad | Spend | Convos | Reached msg 3 | Rp/convo | Depth rate |
|---|---|---|---|---|---|
| v3 \| Free Risk | 349,360 | 85 | 51 | 4,110 | 60% |
| v3 \| Contoh Gratis | 392,702 | 40 | 18 | 9,818 | 45% |
| v3 \| M1 Lapak Sendiri | 387,458 | 14 | 3 | 27,676 | 21% |
| v3 \| Free Demo | 70,400 | 7 | 4 | 10,057 | 57% |
| v3 \| M2 Biaya vs Investasi | 31,927 | 1 | 0 | 31,927 | 0% |

Free Risk is the proof. Cheapest messages in the account, best depth rate in the account, no revenue. Its copy carried two free signals ("konsultasi gratis", "dari nol") and one low anchor ("Mulai 500 ribu") with no qualifier attached to either.

**The conclusion:** cost-per-conversation measured how good an ad was at attracting people who like free things. It is a vanity metric and it is now retired as a decision input.

**What the evergreen set is designed to do instead:** produce fewer conversations, at a higher price each, from people who have already accepted that this costs money before they type the first message.

---

## 1. The qualifying angle

### The angle: **specific outcome at a stated price, aimed at a business that already sells something**

The evergreen ad names a real business situation, names what the site does about it, and names a price the reader must accept before clicking. It does not offer anything free.

Three sub-angles to test, all built on the same spine:

| Sub-angle | Situation it names | Qualifier it carries |
|---|---|---|
| A. Sudah jualan, belum punya website | Business already running on WA and IG only. Customers ask "websitenya mana?" | Assumes an existing business with revenue. Filters out idea-stage. |
| B. Website bisa diedit sendiri | Owner tired of paying someone to change a price or photo. | Names CMS / Admin Panel. A feature only someone planning to run a real site cares about. |
| C. Domain sendiri, bukan link marketplace | Credibility when a customer checks them out. | Names domain + hosting year one. Concrete deliverable, not a vibe. |

All three are already true and already in the pricing file. None of them require a discount, an expiry date, or a free offer to work.

### Why this filters better than the free-demo angle

The free-demo angle asked "do you want something for nothing?" That question has a near-universal yes. It has no correlation with ability or intent to pay, so the responses it selected for were uncorrelated with revenue. 85 conversations proved it.

The qualifying angle asks "is this your situation, and is this price acceptable?" That question has a much smaller yes, and the people inside it have self-selected on the exact two axes that predict payment: they have a business, and they have seen the number.

The filter now sits **before** the click, in the ad copy, where it costs nothing. Previously the filter sat after the click, in Azriel's WhatsApp inbox, where it cost his time on 147 conversations.

**Deliberate trade:** volume drops hard. Expect single-digit conversations per week where Free Risk did dozens. That is the intended outcome, not a failure signal. This is stated up front so a low-volume week is not misread as a broken ad.

### Free-demo offer status

Stays dead as an **advertised** offer, consistent with SOP 1.3, which already reclassified the custom mockup as a rare fallback behind a three-condition gate. The demo library at `rielcode.com/demos/{niche}/` remains the standard reply once a lead is in the inbox. It just stops being the hook that pulls them in.

---

## 2. Price floor: lead with **Rp1 juta**

### The decision

Every evergreen ad leads with "Mulai 1 juta". The Rp500rb floor is removed from all paid advertising.

### Justification from the pricing file

Rp500rb is the Student Plan. Reading its actual contents:

- 1 page
- **No free hosting**
- **No free domain**
- **No CMS / Admin Panel**
- 1 minor revision
- Positioned in the file as "Personal/academic projects"

A business that clicks a business ad and lands on Student gets a single page with no domain, no hosting, and no ability to edit it. That is a mismatch with what the ad implicitly promised, and every conversation from it is either a downsell fight or a ghost.

Rp1jt is the Starter Plan, and per the pricing file it is the cheapest tier that includes domain, hosting for year one, SSL, and Basic CMS / Admin Panel. It is the cheapest thing Rielcode sells that is actually a business website.

### The supporting evidence

The Rp500rb floor appears in every ad that produced non-payers. Free Risk carried it explicitly. That is correlation, not proof, but it points the same direction as the tier analysis, and the tier analysis alone is sufficient.

### Second effect

Rp1jt is a real filter on its own. A reader who cannot or will not spend Rp1jt does not message. That work happens in the ad, for free, instead of in the inbox. Raising the floor from 500rb to 1jt is the single highest-leverage change in this plan.

### Where Student still lives

Student Plan is not deleted. It stays on the services page and stays available for the lead who arrives, gets quoted Starter, and genuinely needs a one-pager. It is a downsell inside a conversation, per SOP 1.2b ("second tier only on pushback"). It is never an acquisition hook.

### Consistency cleanup required

The Rp500rb floor currently appears in paused evergreen ads. Those must not be reactivated with that copy. Any paused ad carrying "Mulai Rp500rb" is retired permanently, not reused.

---

## 3. Ad set structure

### Two layers, permanently separated

```
EVERGREEN LAYER  (always on, never expires)
  Campaign: Rielcode Evergreen
  Ad set:   Evergreen | WA | Business Owners
  Ads:      A. Sudah jualan belum punya website
            B. Website bisa diedit sendiri
            C. Domain sendiri
  Copy rule: no promo code, no expiry date, no percentage off,
             no seasonal reference of any kind.

PROMO LAYER      (only during a real event, then fully off)
  Campaign: Rielcode Promo <event>
  Ad set:   separate ad set, separate budget
  Ads:      seasonal, carries the code and the deadline
  Lifecycle: created at event start, hard-stopped at event end,
             archived not paused.
```

### Why they are separated and not merged

**Copy hygiene.** An evergreen ad that ever carried a promo code becomes a liability the moment the promo ends. Merdeka is the live example: those ads die on 31 Aug and cannot be reused. Keeping the layers separate means the evergreen ads never need editing, which is the entire point of evergreen.

**Learning stability.** Meta's delivery system re-enters learning when an ad set is materially edited. An always-on ad set that never gets edited accumulates delivery history. Swapping copy in and out of one ad set every holiday resets that repeatedly.

**Attribution.** With separated campaigns, the question "did the promo actually add anything, or did it just cannibalize evergreen?" is answerable by comparing the two campaigns over the promo window. Merged, it is unanswerable.

### Promo rules going forward

- A promo runs only for a **real event** with a genuine reason to exist. Independence day, a launch, a milestone. Not a manufactured deadline.
- Promo never lowers the advertised floor below Rp1jt. It discounts a stated price, it does not create a new cheaper entry point.
- Merdeka ads: let them run out 31 Aug 2026, then archive. Do not extend, do not rename, do not reuse.

### Optimization goal: **stays CONVERSATIONS**

Confirmed decision. Reasoning:

- At the budget this account can support, a deeper conversion event does not get enough weekly volume to exit learning. It would starve and deliver erratically.
- The qualifying work is being done by the copy and the price floor, which is where the filter is cheapest anyway.
- Changing the goal *and* the angle *and* the price floor at once makes the result uninterpretable. Change the copy and the floor first, hold the goal constant, so the next reading is attributable.

**Revisit trigger:** if evergreen sustains 20+ conversations per week for 3 consecutive weeks, re-evaluate a deeper event. Below that, leave it alone.

---

## 4. Budget

### Balance status: **not topped up**

Confirmed 2026-08-21: Rp17,066 available against a Rp1,936,935 spend cap. Nothing in this section is actionable until money is added. Every number below is a ratio plus a gated absolute.

**Minimum to launch meaningfully:** Rp750,000, which funds 30 days at the recommended daily rate. Below roughly Rp450,000 (18 days) the set will not have produced enough signal to judge, and stopping mid-read wastes the whole spend. Do not launch on a partial top-up.

### The M1 / M2 problem

M2 Biaya vs Investasi got Rp16k over a 7-day window while M1 Lapak Sendiri got Rp168k in the same window. M2 ended its life on Rp31,927 total and exactly 1 conversation.

M2 was never tested. It was starved. Meta's ad set level budget optimization pushes spend toward whichever ad wins earliest on cost-per-result, and because the win condition was cheap messages, the algorithm concentrated spend on whichever ad was best at attracting free-seekers. M2's angle, cost versus investment, is the closest thing in the account to a qualifying angle, and it was defunded before it produced a readable result.

That is the exact failure mode this plan must not repeat.

### The split

**During the initial read window (first 21 days): equal, enforced spend per ad.**

- Three ads, Rp25,000/day total, roughly Rp8,300/day each.
- Enforce it structurally, not by hoping. Either one ad per ad set with its own budget, or ad set budget optimization with a per-ad minimum spend floor if the account supports it. Separate ad sets is the reliable version.
- Nothing gets paused inside this window regardless of how it looks on day 4.

**Rp25,000/day is the correct rate**, not more. Reasons: it is the actual current v3 rate, it is enough to give three ads a readable share, and at a genuinely qualifying angle the conversation volume will be low by design, so extra spend buys impressions rather than information.

**After 21 days:** shift budget toward the ad with the best *qualified* outcome per the section 5 metrics, not the cheapest message. Even then, no ad goes below 20% of the set budget while it remains active. The floor exists specifically so the M2 starvation cannot recur.

### Runway table (gated on top-up)

| Top-up | Days at Rp25k/day | Verdict |
|---|---|---|
| Rp450,000 | 18 | Too short. Read is incomplete. |
| Rp750,000 | 30 | Minimum viable. Covers the 21-day read plus a week of acting on it. |
| Rp1,500,000 | 60 | Recommended. Two full read cycles. |

Confirm live balance before launch. Never quote a remembered balance, it is stale within a day.

---

## 5. How success gets measured

Cost-per-conversation is demoted to a diagnostic. It is no longer a success metric and no decision is made on it.

### The metric ladder

| Level | Metric | Source | Role |
|---|---|---|---|
| 0 | Cost per conversation | Meta API | Diagnostic only. Watch for a sudden collapse, which signals the qualifier fell out of the copy. A **rising** cost is expected and fine. |
| 1 | Depth rate (reached msg 3 / convos) | Meta API | Weak signal. Free Risk hit 60% depth with zero revenue, so depth alone proves nothing. Useful only alongside level 2. |
| 2 | **Quote rate** (quotes sent / convos) | Manual, `leads/` | **Primary Meta-side metric.** A conversation that reaches a quote passed the human filter. |
| 3 | **DP rate** (DPs received / quotes sent) | Manual, `leads/active-customers.md` | The close metric. Answers whether the ad is the problem or the close is. |
| 4 | **Cost per DP** (ad spend / DPs) | Derived | The only number that actually matters. |

### The judgment rule

**A conversation only counts if it reached a quote.** That is the new unit. Ten conversations producing three quotes beats eighty producing zero, at any cost per conversation.

### Concrete targets for the 21-day read

Deliberately modest, because the entire history is zero:

- Quote rate above 25% of conversations
- At least 1 DP received
- Cost per conversation somewhere in Rp15,000 to Rp40,000. If it comes in near Rp4,000 like Free Risk, the ad is not qualifying and the copy needs re-reading before the money continues.

### Required tracking, and it does not exist yet

None of levels 2 through 4 can be read from the Meta API. **This measurement scheme requires Azriel to manually tag each inbound WhatsApp lead with its source ad and log its furthest stage.** Without that, this plan is unmeasurable and reduces to guessing, exactly as the last five ads did.

Minimum viable version, one line per lead in `leads/leads.md`:

```
date | ad name | niche | furthest stage (contact / need known / quoted / agreed / DP)
```

That is it. No tooling, no new system. Roughly 15 seconds per lead. If this logging does not happen, do not launch, because the result will be unreadable and the spend wasted.

---

## 6. The message-1 to message-2 drop

### Correction to the brief

The brief states 14 first replies produced 7 second messages. That pairing is not in the account data supplied. The M1 row is 14 conversations with 3 reaching message 3. Meta reports conversations reaching message N, not "first replies". Treating item 6 as the general depth-decay problem, evidenced by what the table does show:

- Free Risk: 85 → 51 reached msg 3, 60% survive
- Contoh Gratis: 40 → 18, 45%
- M1: 14 → 3, 21%
- M2: 1 → 0, 0%

If the 14/7 figure came from a different pull, it changes the sizing of this section but not its diagnosis.

### The diagnosis

The pattern inverts what an ad-quality problem looks like. The **cheapest, least-qualified** ad has the **best** depth retention, and the most qualifying ad has the worst. Free-seekers happily continue a free conversation. Serious buyers hit the price and stop.

So the drop between message 1 and message 2 is not a chat-flow defect. It is the price landing on people who were never told the price in the ad. The evergreen angle addresses this directly at the source: put Rp1jt in the ad, and the people who stop at the price stop before costing money.

### What still gets fixed on the inbox side

**a. The auto-greeting already matches the SOP.** SOP 1.2b's numbered-option greeting is correct and stays as-is. It asks the need first with three tappable options, each mapping to a tier band. One tap, no homework. No change needed.

**b. The real leak is between the greeting reply and the quote.** SOP is unambiguous: once industry is known, quote in the very next message. The recorded failure was a 0/39 close rate driven by qualifying endlessly and quoting late. Enforce the existing rule, do not invent a new step.

**c. Split the quote per SOP 1.2b.** Message 1 is one tier, four bullets max, one demo link, one question ending on "modelnya cocok sama yang kakak bayangin?". Message 2 is timeline plus DP, and only after they reply. This already exists in the SOP and both engaged leads in the 2026-08 batch went quiet on a 17-line unsplit quote.

**d. Alignment change required by this plan.** With the floor moving to Rp1jt, message 1 defaults to **Starter or Pro**, never Student. Student appears only as a downsell after explicit budget pushback, alone, in its own message.

**e. Promo line.** Evergreen ads carry no promo. Post 31 Aug, MERDEKA10 is dead and must be removed from the SOP's "Current promo" line and from every script. Without a promo the quote message needs its close lever replaced by a concrete next step: start date or a short call. Never end on "mau dijelasin?".

**f. Every demo link states the design is a rough draft and fully customizable.** Every time, no exceptions.

---

## 7. The open question, and it is the highest-value thing here

**Nobody knows which ad produced a paying customer, or whether any ad ever did.**

Meta's API stops at "sent a message". It reports conversations and depth. It cannot report revenue. The entire "zero paying customers" conclusion driving this plan is inferred from Azriel's read of his own inbox, not from a systematic reconciliation.

### What this plan assumes, stated plainly

1. That no paying customer to date originated from a Meta ad. **Unverified.** If false, and one of the killed ads actually produced a payer, this plan retires a working ad.
2. That Free Risk's 85 conversations contained no serious buyers. **Unverified**, based on Azriel's recollection.
3. That the free-seeker mechanism is the cause. **Reasoned, not measured.** It fits the evidence and the tier analysis supports it independently, but it is a hypothesis.

The WhatsApp thread pull was declined for now, so the plan is built to work without it. The section 5 forward-logging scheme means the *next* 21 days are measurable even though the last 147 conversations are not. That is the workaround, and it is sufficient to proceed.

**But it only fixes the future.** The past stays unreadable, and with it the answer to whether any of the five killed ads deserved to die.

### The recommendation

A one-time backward pass over existing WhatsApp threads, tagging each against the ad live at the time, is the single highest-value unblocking action available. It would either confirm the premise of this entire plan or overturn it. Estimated effort is one sitting.

Not blocking. Flagged as the top item the moment Azriel is willing.

---

## 8. Sequence

| # | Step | Gate |
|---|---|---|
| 1 | Approve this plan | Azriel |
| 2 | Top up account, minimum Rp750,000 | Blocks everything below |
| 3 | Start the lead logging line in `leads/leads.md` | Blocks launch. Without it the read is worthless. |
| 4 | Write the three evergreen ads | Separate session, after approval |
| 5 | Build ad set structure, equal enforced split | Rp25,000/day across 3 ads |
| 6 | Let Merdeka ads expire 31 Aug, archive | Do not extend or reuse |
| 7 | Remove MERDEKA10 from SOP and scripts | 1 Sep |
| 8 | 21-day read against section 5 targets | No pausing before day 21 |
| 9 | Shift budget on quote rate, 20% floor per ad | After day 21 |

---

## Changes made to memory alongside this plan

`memory/project_meta_ads_v3_finding.md` rewritten. Two corrections:

1. The claim that WhatsApp friction filters out tire-kickers and that v3 conversations are genuine buyers is **overturned** by 147 lifetime conversations and no confirmed payers.
2. Budget corrected from Rp50,000/day to **Rp25,000/day**.
