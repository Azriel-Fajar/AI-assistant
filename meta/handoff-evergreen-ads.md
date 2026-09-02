# Handoff: Write the Rielcode evergreen ad plan

Paste this as the opening prompt of a fresh session.

---

## Task

Write a plan for a new **evergreen** Meta ad set for Rielcode: always-on, no discount codes, no expiry dates in the copy. It replaces the Merdeka promo ads when they die on 31 Aug 2026. Do not write the ads yet. Plan first.

## Context you need

Read before drafting:
- `references/rielcode-pricing.md` (source of truth, never quote tiers from memory)
- `references/sops/customer-handling.md`
- `memory/project_meta_ads_v3_finding.md` (**contains a conclusion that is now wrong, see below**)
- `memory/feedback_close_gap_not_leadgen.md`
- `memory/project_free_demo_ads.md`

## What the account data says (pulled live 2026-08-21, lifetime, act_4261716744142144)

| Ad | Spend | Convos | reached msg 3 | Rp/convo |
|---|---|---|---|---|
| v3 \| Free Risk | 349,360 | 85 | 51 | 4,110 |
| v3 \| Contoh Gratis | 392,702 | 40 | 18 | 9,818 |
| v3 \| M1 Lapak Sendiri | 387,458 | 14 | 3 | 27,676 |
| v3 \| Free Demo | 70,400 | 7 | 4 | 10,057 |
| v3 \| M2 Biaya vs Investasi | 31,927 | 1 | 0 | 31,927 |

Azriel's own read, and the thing that drives this whole plan: **the ads pulling the most WhatsApp messages are mostly non-paying customers.** The ads are misleading, they encourage people who were never going to pay.

Free Risk is the clearest case. 85 conversations, 51 of them reached message 3, Rp4,110 each, and no paying customers. Its copy was "Kita bantu dari nol sampai online. Mulai 500 ribu, konsultasi gratis." Two free signals and no qualifier.

So: **cheap cost-per-conversation is not the win condition. It was measuring how good an ad is at attracting people who like free things.** A good evergreen ad should produce fewer, more expensive, more qualified conversations.

## Correct a stale memory as part of this work

`memory/project_meta_ads_v3_finding.md` currently claims WhatsApp friction filters out tire-kickers and that v3 conversations are genuine buyers. The lifetime data above contradicts it. Update that file.

Also `memory/project_meta_ads_v3_finding.md` says the v3 ad set is Rp50,000/day. It is actually **Rp25,000/day**. Fix that too.

## Known constraints

- **Price floor is inconsistent in live market right now.** Paused evergreen ads say "Mulai Rp500rb", live promo ads say "Mulai 1 juta". Pick one and justify it from the pricing file. The Rp500rb floor appears in every ad that produced non-payers.
- **Do not restart Free Risk or Contoh Gratis.** Verdict is in on both.
- Account was at Rp17,066 balance against a Rp1,936,935 spend cap on 2026-08-21. Assume Azriel has topped up; confirm before recommending any budget number.
- Ad set optimization goal is CONVERSATIONS. Consider whether that is still the right goal given the above.
- Tone rules: Indonesian, casual-professional, no em dashes, no hype openers, no "colek saya" / "santai aja". Demo links must always note the design is a rough draft and customizable.

## Open question the plan must address

Meta's API stops at "sent a message." It cannot tell you who paid. Nobody currently knows which ad produced the customers who **did** pay, or whether any ad ever did.

Azriel declined a WhatsApp thread pull for now, so the plan should either work without that data or state plainly what it is assuming. Flag this as the highest-value thing to close.

## Deliverable

A plan covering:
1. The qualifying angle for evergreen, and why it filters better than the free-demo angle
2. Which price floor to lead with
3. Ad set structure: evergreen always-on vs promo layered on top only during real events
4. Budget split, given M2 was starved at Rp16k while M1 ate Rp168k in the same 7 days
5. How success gets measured, now that cheap cost-per-conversation is known to be a vanity metric
6. What to do about the message-1 to message-2 drop (14 first replies produced 7 second messages)

Do not write final ad copy in this session. Plan, get it approved, then write.
