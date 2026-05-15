---
name: repurpose-project
description: Use when Azriel finishes delivering a client project and wants to squeeze 3 marketing assets out of it. Auto-generates a YouTube Short script (before/after reveal), Instagram carousel copy (5 slides), and a written case study for rielcode.com/portfolio. Pipeline runs once per completed project.
---

## What This Skill Does

Turns every delivered Rielcode project into a content engine. Produces 3 assets in one run:

1. **YouTube Short script** (60s, before/after reveal)
2. **Instagram carousel** (5 slides of copy)
3. **Written case study** (500-800 words for rielcode.com/portfolio/[slug])

Reads `projects/youtube-rielcode/strategy.md` for YT tone + CTA rotation. Reads `references/rielcode-pricing.md` to pull the package the client paid for.

## When to Run

- Run within 7 days of project delivery (memory still fresh).
- Auto-run as final step of `/project-completion-doc` if Azriel agrees.
- Required input: project folder path (e.g. `projects/parallaxnet-canada/`).

## Steps

### 1. Pull project context

Read these from the project folder:
- `README.md` (status, dates, client name)
- `brief.md` or any scope doc (what client wanted)
- Final delivered URL
- Package used (from order, or ask)

Ask Azriel in one message if any of these are missing:
- Final live URL?
- What package did client pay for? (Student/Starter/Pro/Premium/Custom)
- Before-state URL (their old site) or "no prior site"?
- One sentence: what was the main problem this site solved?
- Permission to use client name publicly? (Y/N, default Y if intl)

### 2. Generate YouTube Short script

Use `/yt-script` style format. Pillar = 1 (Build Showcase). Hook = before/after reveal.

```
TITLE: [client industry] gets a website. Watch it transform.
DURATION: 45-60s

HOOK (0-2s): "[Client name] had [X problem]. I fixed it in [Y days]."

BODY (2-45s):
- 0-5s: Show old site (or "no site, just IG")
- 5-15s: Top 2 issues
- 15-35s: New site walkthrough (3 key sections)
- 35-45s: Result framing (faster, clearer, converts)

CTA (45-60s): [Rotate from strategy doc]
```

Shot list, voiceover settings, hashtags — same format as `/yt-script`.

Save to `projects/[client]/repurpose-yt-short.md`.

**Auto-generate via MCPs:**
- ElevenLabs MCP → voiceover mp3 → `projects/[client]/audio/repurpose-vo.mp3`
- Canva MCP → thumbnail + cover → `projects/[client]/thumbs/repurpose-yt-*.png`

### 3. Generate Instagram carousel (5 slides)

```
SLIDE 1 (Hook): "[Client name] needed a website. Here's what I built."
   Visual: client logo + industry tag
   Caption text: under 12 words

SLIDE 2 (The brief): "What they wanted"
   Visual: quote-style card
   2-3 bullet points from client's actual ask

SLIDE 3 (The process): "How I built it"
   Visual: 2-3 process screenshots (design → dev → launch)
   1 sentence per phase

SLIDE 4 (The result): "What they got"
   Visual: final hero shot of site
   Stats if available (pages, features, delivery time)

SLIDE 5 (CTA): "Want one like this?"
   Visual: Rielcode logo + WhatsApp/IG handle
   Caption: package + price (e.g. "Pro Plan from IDR 2.499jt — DM @rielcode")
```

Plus IG post caption (max 150 words, no emojis, no em dashes, ends with CTA).
Plus hashtag set (use `/instagram-content` style: 10-15 tags).

Save to `projects/[client]/repurpose-ig-carousel.md`.

**Auto-generate via Canva MCP:** 5 carousel slides (1080x1080 each) with branded layout. Save to `projects/[client]/carousel/slide-[1-5].png`.

### 4. Generate written case study

Format for rielcode.com/portfolio:

```
# [Client Name] — [Industry] Website Build

**Package:** [Package name]
**Delivery:** [X days]
**Live site:** [URL]

## The Problem
[2-3 sentences: what was broken, why they came to Rielcode]

## The Approach
[4-5 sentences: design choices, tech stack notes, key features added]

## Key Features
- [Feature 1 from package, e.g. "Custom UI/UX"]
- [Feature 2]
- [Feature 3]
- [Feature 4]

## The Outcome
[3-4 sentences: site is live, what client can now do, hooks for future SEO]

## Want similar?
[Rielcode CTA — package mention + DM/quote link]
```

SEO targets (suggested in output):
- Primary: "[industry] website build [country/city]"
- Secondary: "Rielcode portfolio", "[package name] example"

Save to `projects/[client]/repurpose-case-study.md`.

### 5. Output checklist + next actions

End with:

```
REPURPOSE PIPELINE COMPLETE — [Client Name]

ASSETS:
- [ ] YT Short script ready (file: ...) — record this week
- [ ] IG carousel copy ready (file: ...) — design slides in Canva
- [ ] Case study ready (file: ...) — publish to rielcode.com/portfolio/[slug]

PUBLISH ORDER (recommended):
1. Case study live first (SEO base + link target)
2. IG carousel 2 days later (drives traffic to case study)
3. YT Short 3-4 days later (longest content cycle)
```

Offer to:
- Add tasks to Google Calendar via `/gcal-schedule`
- Auto-update YT batch backlog with the Short

## Rules

- Always pull package + price from the live pricing file. Never invent.
- Client name only if permission granted. Default to industry+location ("a Salatiga cafe").
- No emojis. No em dashes.
- CTA in each asset must rotate (not all 3 ending the same way).
- If client paid less than Pro Plan, soften "transformation" language to avoid over-promise.
- Skip slides/sections if data missing — don't fabricate stats.
