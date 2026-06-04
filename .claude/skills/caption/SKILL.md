---
name: caption
description: Use when Azriel wants a promotional caption for Rielcode on Instagram, TikTok, WhatsApp Status, or Facebook. Triggers include "write a caption", "caption for [platform]", "promo caption", "social caption", "/caption". Generates one strong caption per platform in Indonesian and English, using proven hook + HVC/AIDA/PAS frameworks.
argument-hint: "[platform] [topic/angle, e.g. tiktok referral post]"
---

## What This Skill Does

Generates Rielcode promotional captions that stop the scroll and drive WhatsApp leads. One best caption per requested platform, in both Indonesian and English. Built on 2026 caption research (HVC, AIDA, PAS, hook types, algorithm shifts).

## Context to load first

1. Read [references/caption-playbook.md](references/caption-playbook.md) — the full knowledge base. Apply it; do not paste it into output.
2. Read `.claude/rules/communication-style.md` — no emojis spam, no em dashes, no overly formal language.
3. Rielcode facts are in the playbook (services, price, delivery, WA number, IG handle).

## Steps

1. **Parse the request.** From `$ARGUMENTS` or the user's message, identify:
   - Platform(s): Instagram, TikTok, WhatsApp Status, Facebook (or "all")
   - Voice: **brand** (@rielcode official post) or **friend/referral** (a friend reposting). If unclear, ask — this is the single most important choice (see playbook §7).
   - Topic/angle: what the post is about (general promo, referral, a specific service, a result). If none given, default to general "get your business online" promo.

2. **If platform or voice is missing and not obvious, ask once** via AskUserQuestion. Don't guess voice — brand vs friend changes everything.

3. **Write one caption per platform**, each in ID + EN. For each, apply:
   - Hook in line 1, under ~125 chars, one of the hook types (playbook §3). Not generic.
   - HVC structure. AIDA or PAS where it fits the angle.
   - Platform length + format (playbook §6).
   - Correct voice (playbook §7). Friend voice = casual, lowercase ok, no hype, no hashtag spam.
   - 1-3 relevant hashtags max (none for WhatsApp Status or friend posts).
   - Weave keywords for search (jasa website, website UMKM) naturally.
   - Insert WA link slot `wa.me/6285669522225` or `[WA LINK]` where a CTA link belongs.

4. **Self-check against the quality bar** (playbook §10) before showing. Kill anything generic or cringe.

5. **Output inline** (no file). Use the format below.

## Output Format

For each platform:

```
### [Platform] — [brand voice / friend voice]

**Indonesian**
[caption with hook line 1, value, CTA, link slot, hashtags]

**English**
[caption — natively written, not translated]
```

Keep it copy-paste ready. No commentary between captions unless flagging a choice.

## Notes

- **Voice is everything.** Friend/referral posts must NOT read like ads. Lowercase, low-key, genuine vouch. If a friend wouldn't actually type it, rewrite. This is the fix for "too cringe."
- One best caption per platform, not three. Be opinionated. If the user wants variations, give 2-3 then.
- Match communication-style: no em dashes, no emoji spam, no formal stiffness.
- Don't machine-translate ID↔EN. Write each language natively.
- Fake urgency = cringe. Only use FOMO if the scarcity is real.
- Hook must be in the first ~125 chars or it gets truncated and dies.
- Don't invent Rielcode facts. Price mulai 500rb / ~$29, delivery ~7 hari, WA 856-6952-2225.
