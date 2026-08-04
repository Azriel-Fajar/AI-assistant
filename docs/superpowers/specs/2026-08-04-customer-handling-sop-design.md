# Design: Master Customer-Handling SOP

Date: 2026-08-04
Output file: `references/sops/customer-handling.md`

## Problem

Rielcode has scattered process assets (close scripts, hosting SOP, pricing) but no single document covering a customer end to end. Result:

- Lead questions get improvised answers, including by Claude, so answers drift between conversations.
- Close rate is 0/39 (Jun) and 0/19 (Jul-Aug ads). Diagnosis in `references/wa-close-scripts.md` says the cause is a discovery loop instead of a close loop.
- Post-DP steps (hosting option, revisions, handoff) live only in Azriel's head or in a hosting-only SOP.

## Goal

One reference document that answers "what do I do / what do I say" for any customer at any stage, pre-payment or post-payment, and a light checkpoint spine so Azriel can tell at a glance whether a customer is off track.

Both Azriel and Claude read it. Claude quotes from it instead of improvising.

## Non-goals

- Not a per-customer tracker. Status stays in `leads/active-customers.md`.
- Not a rewrite of existing assets. Links out to close scripts, hosting SOP, and pricing rather than duplicating them.
- Not a CRM or automation.

## Locked decisions

Confirmed with Azriel 2026-08-04.

### Payment

- DP is 30% of the package price, upfront, to start.
- Remaining 70% is due when the site is live AND the customer confirms they are happy.
- Hosting account handoff happens at or after the 70% payment. The handoff is the lever, not the live site.
- DP is non-refundable.
- Never buy hosting or domain before DP is received.
- Never quote 50/50.
- Clients already in progress on the old 20/80 terms keep 20/80.

Worked example: Pro 2jt, DP 600rb to start, 1.4jt when live and approved.

### Objection framing

When a lead asks what happens if they dislike the result:

- Lead the answer with the revisions they get, so "not liking it" is not the real risk.
- State non-refundable only when the lead asks about refunds directly.
- The flat honest sentence (DP funds their domain and hosting) is used inside that answer, never as the opener.

### Free demo

- The Free Demo ad is paused. Demo mockups are no longer an advertised offer.
- A free demo is still available as a rare fallback for a hesitant lead who would otherwise walk.
- Gate: the lead must show genuine interest first, meaning they have asked at least two substantive questions beyond price. Price-only askers do not qualify.
- Existing demo sites at `rielcode.com/demos/{niche}/` are the first response. A custom mockup is the exception.
- Every demo message must note the design is a rough draft and customizable.

### Revisions

- Major design revisions are capped per tier: Student 1 minor, Starter 1, Pro 2, Premium 5.
- Minor tweaks continue until the customer is happy.
- The SOP must state where the line between minor tweak and major design revision sits, since this is the most likely dispute.

### Timeline

- Per tier: Student 1-3 days, Starter 3-5, Pro 7-10, Premium 10-14.
- Timeline extends when the client is slow supplying content. This clause must be stated at quote time, not invoked later as an excuse.

### Standing rules carried in

- Never promise business results (more customers, more students). Reframe the website as a visibility tool.
- Pro and Starter always include Basic CMS / Admin Panel. Never quote package features from memory; read `references/rielcode-pricing.md` first.
- LAUNCH10 expired. Current promo is MERDEKA10, 10% off, through 31 Aug 2026.

## Structure

Single file, DP as the hinge.

```
Part 0  Non-negotiables
Part 1  PRE-DP: first contact -> DP received
        1.1  Stage gates
        1.2  Answer bank
        1.3  Free demo gate
        1.4  Dead-lead rule
Part 2  POST-DP: DP -> live -> post-delivery
        2.1  Stage gates
        2.2  Hosting option pick
        2.3  Revision rules
        2.4  Timeline and client-delay clause
        2.5  Handoff and support window
Part 3  Tier facts table
Part 4  Checkpoint card
```

One file rather than two, because splitting reintroduces the "which do I open" friction the SOP exists to remove.

### Part 1.2 Answer bank

Entries are keyed by the sentence a lead actually types, not by category, so both Azriel and Claude can scan and match fast. Roughly 15-20 entries spanning price, trust, scope, and stall.

Entry format:

```
### "kok mahal ya kak?"
What they mean: comparing to a 300rb template seller.
Answer with: what the tier actually buys, not a defense of the price.
Never say: competitor is bad, or an unprompted discount.
Script: -> wa-close-scripts.md #4
```

The bank gives the reasoning and the guardrails. Exact wording stays in `references/wa-close-scripts.md`.

### Part 4 Checkpoint card

One table. Columns: stage, done when, action if stuck 3+ days. This is the "am I off track" glance, not per-customer tracking.

## Links out, does not duplicate

| Topic | Authority |
|---|---|
| Exact WA wording | `references/wa-close-scripts.md` |
| Hosting mechanics, 3 options | `references/sops/client-hosting-provisioning.md` |
| Prices and features | `references/rielcode-pricing.md` |
| Hosting option WA script | `templates/wa-hosting-email-options.md` |
| Handoff document | `/project-completion-doc` skill |

The SOP states when and why. Those state what to type and how.

## Tone constraints for all scripted lines

From existing feedback memories: warm "kak", soft folded-hands emoji, short one-idea lines, "kami" not "saya", no em dashes, no hype openers, no fake urgency, no "santai aja", no "mantap kak", no "colek saya". WA drafts must be plain copy-paste blocks with no markdown.

## Rules set by this SOP

Two rules did not exist before. Confirmed with Azriel 2026-08-04.

1. **Minor tweak vs major revision.** A major design revision is a new layout that totally changes the look. Anything short of that (copy edits, colors, image swaps, spacing, moving a section) is a minor tweak and continues until the customer is happy.
2. **Dead-lead rule.** 3 days after the last nudge with no reply, the lead moves to `leads/archive.md`.

## Success criteria

- Any lead question can be answered by pointing at a section.
- Any post-DP step has a stated owner, trigger, and next action.
- Claude answers lead questions by quoting the SOP rather than improvising.
- Azriel can tell in one glance whether a customer is stalled.
