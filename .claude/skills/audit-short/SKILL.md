---
name: audit-short
description: Use when Azriel wants to audit a prospect's website (especially Salatiga cafes/SMBs) and turn it into a 60s YouTube Short plus a tag-on-IG + DM follow-up sequence. Combines /site-review + /yt-script + /follow-up into one pipeline. Generates content + warm lead in one move.
---

## What This Skill Does

Auto-pipeline for the "Salatiga case study generator" play:

1. Audits a target's live site (using `/site-review` logic)
2. Writes a 60s YouTube Short script: "Here's how I'd fix [Business Name]'s site"
3. Drafts IG tag-post caption (positive framing, tags business)
4. Drafts DM follow-up message (sent 3 days after post)
5. Logs target into `lead-tracker` with "audit-short" source tag

## Inputs (one message)

Ask:
- Target URL?
- Business name (as it appears publicly)?
- Their IG handle (if known, for tagging)?
- Industry/category? (cafe, salon, retail, services, etc.)
- City/area? (default: Salatiga)

## Steps

### 1. Run site audit

Use Playwright + scrape logic from `/site-review`:
- Page count, forms, e-commerce, chatbot, analytics, SEO basics, speed proxy, WhatsApp/contact CTAs, schema
- Take 1 full-page screenshot via `/url-screenshot`

Extract TOP 3 issues (most impactful first). Examples:
- "No contact form — losing leads"
- "Site loads in 6s — Google penalizes"
- "No WhatsApp button — local SMB must-have"
- "Old design — feels untrustworthy"

### 2. Write 60s Short script

```
TITLE: I'd fix [Business Name]'s website. Here's how.
DURATION: 50-60s
PILLAR: Build Showcase / Hot Take blend
TONE: Positive-lead, constructive. NEVER mean.

HOOK (0-2s): "I love what [Business Name] is doing. But their site is leaving money on the table."

BODY (2-50s):
- 2-10s: Show current site full-page scroll. Overlay: "[Business Name] - [City]"
- 10-20s: Issue 1 with overlay arrow/circle
- 20-30s: Issue 2
- 30-40s: Issue 3
- 40-50s: Sketch/mock of fix (Canva mockup or quick wireframe overlay)

CTA (50-60s): "@[Business IG handle] — DM me if you want this for real. Pro Plan from IDR 2.499jt."
```

Shot list, voiceover settings, hashtags — pull from `/yt-script` format.

Hashtags must include: `#[CityName]` `#[Industry]Indonesia` `#[CityName][Industry]` (e.g. `#Salatiga` `#CafeIndonesia` `#SalatigaCafe`).

Save to `projects/youtube-rielcode/audit-shorts/YYYY-MM-DD-[business-slug].md`.

**Auto-generate via MCPs:**
- ElevenLabs MCP → voiceover mp3 → `projects/youtube-rielcode/audit-shorts/audio/[slug]-vo.mp3`
- Canva MCP → thumbnail + Shorts cover → `projects/youtube-rielcode/audit-shorts/thumbs/[slug]-*.png` (overlay business name + "AUDIT" tag)

### 3. Draft IG tag-post caption

```
[Hook line: positive about the business]

I made a quick video about [Business Name]'s site. 3 things I'd change to bring in more customers:
1. [Issue 1]
2. [Issue 2]
3. [Issue 3]

Full breakdown on my YouTube @rielcode.

@[Business IG handle] — want the real rebuild? DM me. Pro Plan starts at IDR 2.499jt.
```

Plus 10-15 hashtags via `/instagram-content` style. Mix: local (#Salatiga #SalatigaCafe), niche (#WebDesign #JasaWebsite), brand (#Rielcode).

Save to `projects/youtube-rielcode/audit-shorts/[slug]-ig-caption.md`.

### 4. Draft DM follow-up (send Day 3 after post)

```
Hi [Owner first name if known, else "team"],

I made a short video about [Business Name]'s site this week — meant as a friendly audit, not a sales pitch. Genuinely think you could win more customers with a small upgrade.

If interested, I'd build the full rebuild for IDR 2.499jt (Pro Plan, ~10 days). Includes everything from the video plus hosting and domain.

Either way, big fan of what you're building. Reply only if useful.

— Azriel, Rielcode
```

Save to `projects/youtube-rielcode/audit-shorts/[slug]-dm.md`.

### 5. Log in lead-tracker

Add to lead-tracker:
- Name: [Business Name]
- Source: audit-short
- Status: cold
- Next action date: [post date + 3 days]
- Next action: "Send audit-short DM"
- WhatsApp link if number available

### 6. Output schedule

```
AUDIT-SHORT PIPELINE COMPLETE — [Business Name]

ASSETS:
- [ ] YT Short script: projects/youtube-rielcode/audit-shorts/[slug].md
- [ ] IG caption + hashtags: ...[slug]-ig-caption.md
- [ ] DM draft: ...[slug]-dm.md
- [ ] Lead logged in tracker

POSTING ORDER:
1. Day 0: Record + post YT Short
2. Day 0: Post IG carousel/Short with tag
3. Day 3: Send DM via `/follow-up`
4. Day 7: If no reply, send 1 nudge then close lead
```

## Rules

- ALWAYS positive-lead framing. "Love what they're doing, but..." NEVER mean.
- 3 issues max. More overwhelms + feels like piling on.
- Mockup/fix idea must be SHOWN (overlay or sketch). Telling without showing kills retention.
- Hashtags must include city + industry for local discoverability.
- DM must be under 80 words. Anything longer = ignored.
- Never share business owner's personal info. Only public IG/website data.
- If business is a Rielcode competitor (other Salatiga web devs), SKIP — don't audit competitors publicly.
- Max 3 audit-shorts per week. Saturating one city = looks aggressive.
