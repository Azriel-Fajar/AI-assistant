# Rielcode Viral Ad System

Source method: "How to Make VIRAL Ads That Make You Millions" (https://youtu.be/plB3mEMLGag). Adapted to Rielcode's Meta Ads (WhatsApp v3, local Indonesian business owners).

Core truth: 80% of ad performance is creative + research. Not the ads manager. Stop pressing buttons, fix the creative.

This is the repeatable process. Run it for every new ad concept.

---

## Folder map

- `research/` — verbatim customer-language pain quotes from Reddit, FB groups, forums. Boils to ONE bullseye.
- `swipe/` — the attention database. Every thumbnail/title that hooks you gets logged. Reuse as pattern match or interrupt.
- `hooks.md` — 10-12 hook bank per concept. Rotate on fatigue, don't die after 1 week.
- Renders live in `my-video/src/RielcodeAd/`.

---

## The 8 steps

### 1. Research before writing
Words separate pros from amateurs. Amateurs use templates and buzzwords. Pros dive into the prospect's brain.
- Pull pain quotes from Reddit, FB groups (UMKM / usaha kecil groups), forums (Chrome "Discussions" extension forces forum-only Google results).
- Copy verbatim. Do NOT rewrite. Speak the market's exact words back to them.
- Multiple sources, never one. Dump all into `research/`.
- If you have client chats: export WA/Messenger convos, ask ChatGPT/Claude for top 5 pains + benefits.

### 2. Find the bullseye
Every market has ONE core problem. All other pains are symptoms of it. Wrap the whole ad around that one thing.
- Rielcode's working bullseye: see `research/bullseye.md`.
- Don't try to say everything. Say the one thing that pulls.

### 3. Hijack attention (the hook)
You compete with the chaotic blizzard of the feed. Normal = ignored.
- Need visual interrupt AND auditory interrupt together.
- Most outrageous visual grabber that makes thumb stop: "what is this?"
- Do the opposite of every competitor.

### 4. Pattern match (resonate)
A wild visual alone isn't enough. It must trigger something the prospect already cares about.
- Show a visual cue from their daily life. For Rielcode local biz owners:
  - WhatsApp chat UI (they live in WA)
  - Instagram profile / IG DMs (their current "website")
  - Google search result for their business (empty = pain)
- Signals "this is for ME, pay attention."

### 5. Pattern interrupt — repeated
Interrupt isn't only the hook. Viewers zombie out mid-ad, tune to "I'm in an ad now," stop watching.
- Hit a fresh interrupt every few seconds to re-hook.
- Interrupt after interrupt after interrupt across the whole ad.

### 6. Multi-hook (longevity)
Shoot/render 10-12 hooks per concept. Launch with 1-2. When they fatigue (people think they've seen it after first 15s), roll out the next hook. Keeps one concept alive for months.
- This directly fixes v3's fatigue (freq climbing, same creative since Jun 4).
- Hooks live in `hooks.md`. Variations of a concept, not new concepts.

### 7. Sell against alternatives
You are NOT selling your product. You're selling against what already failed them.
- Most treat every lead like the 3% ready to buy. Wrong. They've tried things before.
- Name it, frame it, show how you're different, or they assume "more of the same."
- Rielcode alternatives to name: IG-only, cheap Rp50k template sites, "my nephew will build it", Wix/site-builder they abandoned.

### 8. Render, launch, rotate
- Render from `my-video/` (serialize renders, never two at once — concurrent collide).
- Locked render rules: fast-paced, max 3s/scene (90 frames @ fps=30, prefer 45-60), new redesign theme.ts (cream + forest green), customer-POV VO (what THEY get, not "aku buat").
- Launch 1-2 hooks at Rp50k/day. Watch frequency in dashboard. When freq climbs / CPM rises, swap next hook. Don't raise budget before CPM drops under Rp40k.

---

## Swipe habit (ongoing)

Whenever a thumbnail or title hooks you, screenshot it. Two paths, both work:
1. Drop the PNG in `swipe/thumbnails/` or `swipe/titles/`, tell me "log swipes".
2. Paste/attach it in chat, I save + log it.

I log each to `swipe/INDEX.md`: what hooked you, pattern type (match vs interrupt), where to reuse. This database feeds every future ad's hooks.
