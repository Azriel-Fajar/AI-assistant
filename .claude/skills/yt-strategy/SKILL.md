---
name: yt-strategy
description: Use when Azriel wants to plan YouTube channel strategy for Rielcode. Generates channel direction, content pillars, posting cadence, niche positioning, and 30-day launch roadmap. Run once at channel kickoff, then quarterly.
---

## What This Skill Does

Locks in YouTube Shorts strategy for Rielcode's channel. Output is a saved strategy doc the other skills (`/yt-script`, `/yt-batch`) read for context.

**Channel context (locked from kickoff):**
- Angle: Hybrid -- builds + SMB tips
- Language: English
- Format: Shorts only (60s max)
- Cadence: 2-5 shorts/week
- Production: No face. Screen recording + AI voiceover.
- Goal: Lead gen for Rielcode (custom sites, landing pages, simple e-commerce)
- Target: International SMBs (preferred) + Indonesian SMBs

## Steps

### 1. Confirm or refresh inputs

Ask Azriel:
- Channel handle decided? (suggest `@rielcode` if not)
- Any niches to exclude? (e.g. crypto, no-code platforms)
- Competitor channels he likes? (3-5 URLs or names, optional)

One message. Skip if doc already exists -- offer to refresh instead.

### 2. Define content pillars

Generate 4 pillars (60/40 builds-to-tips split):
- **Pillar 1 -- Build showcases (30%):** Before/after, client wins, transformation reveals
- **Pillar 2 -- SMB website tips (30%):** Why X feature matters, mistakes to avoid, ROI of websites
- **Pillar 3 -- Process/behind-scenes (20%):** How a site gets built, tools, day-in-life
- **Pillar 4 -- Hot takes / controversy (20%):** Industry opinions, myth-busting, trends

Each pillar: 3 example topics + 1 hook template.

### 3. Posting cadence + batch plan

Output weekly schedule:
- Mon, Wed, Fri = baseline (3 shorts/week)
- Optional Tue, Sat = stretch (5/week)
- Batch day: Sunday (record + edit week's worth)

### 4. Channel positioning

- Channel name: Rielcode
- One-line bio (under 100 chars): direct, niche-clear, CTA
- Banner concept: 1 sentence brief for designer/AI
- Pinned video idea: best intro short
- Link-in-bio target: rielcode.com or WhatsApp link

### 5. 30-day launch roadmap

Week 1: Set up channel, branding, first 3 shorts (1 per pillar)
Week 2: Post 3/week, study analytics, refine hooks
Week 3: Test 5/week cadence, launch first build showcase series
Week 4: Review retention data, double down on best pillar

### 6. Save strategy doc

Write output to `projects/youtube-rielcode/strategy.md` -- create folder if missing. Append timestamp. This file is read by `/yt-script` and `/yt-batch`.

Also add line to `decisions/log.md`:
`[YYYY-MM-DD] DECISION: YouTube channel strategy locked | REASONING: ... | CONTEXT: ...`

### 7. Next steps

Tell Azriel:
- Run `/yt-batch` to generate first week of scripts
- Run `/yt-script` for one-off topic ideas
- Re-run `/yt-strategy` quarterly or when pivoting

## Rules

- No emojis. No em dashes.
- All output English (channel is English).
- Bias toward shorts that convert viewers → rielcode.com leads, not pure entertainment.
- Hooks must work in first 2 seconds (retention is everything on Shorts).
- Every short ends with one of 3 CTAs: "DM me on Instagram @rielcode", "Link in bio for a free quote", "Comment your site URL for a free audit".
