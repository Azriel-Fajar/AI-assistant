---
name: yt-batch
description: Use when Azriel wants a full week of YouTube Shorts content planned in one go. Generates 2-5 scripts following the channel strategy, balanced across pillars, with topics, hooks, full scripts, shot lists, and a production schedule. Run every Sunday for week ahead.
---

## What This Skill Does

Batches a week of Shorts scripts in one run. Designed for Sunday batch day (record + edit all at once).

Reads `projects/youtube-rielcode/strategy.md` for channel context. If missing, tell Azriel to run `/yt-strategy` first.

## Steps

### 1. Ask batch params

One message:
- How many shorts this week? (2-5, default 3)
- Week start date? (default = next Monday)
- Any specific topics to include? (recent client builds, current events, optional)
- Skip pillars this week? (optional)

### 2. Topic generation

Pull from strategy doc pillars. Distribute:
- 2 shorts: 1 build + 1 SMB tip
- 3 shorts: 1 build + 1 tip + 1 process
- 4 shorts: 1 build + 1 tip + 1 process + 1 hot take
- 5 shorts: 2 builds + 1 tip + 1 process + 1 hot take

For each topic, generate:
- Working title
- Pillar tag
- Hook (8 words max)
- Why this topic now (relevance reason)

Show topic list. Ask Azriel: "Approve, swap, or regenerate any?"

### 3. Full scripts (after approval) — MCP-batched

For each approved topic:
1. Generate full script (same format as `/yt-script`)
2. AUTO-CALL ElevenLabs MCP to render voiceover → save to `projects/youtube-rielcode/audio/[slug]-vo.mp3`
3. AUTO-CALL Canva MCP to render thumbnail + Shorts cover → save to `projects/youtube-rielcode/thumbs/[slug]-thumb.png` + `[slug]-cover.png`
4. Report each asset's path inline with the script

Use same MCP settings as `/yt-script` (voice: Adam/Daniel, model: eleven_multilingual_v2, Canva brand colors black + accent).

If running 3+ shorts, batch the MCP calls in parallel (one Claude tool-call message with all ElevenLabs + Canva invocations together) to save time.

Script format per item:

```
=== SHORT [N] of [TOTAL] ===
PUBLISH DATE: [Mon/Wed/Fri or whatever schedule fits]
PILLAR: [1/2/3/4]
TITLE: ...
HOOK (0-2s): ...
BODY (2-45s): ...
CTA (45-60s): ...

SHOT LIST:
SHOT 1 (0-2s): ... | OVERLAY: ...
...

VOICEOVER: ElevenLabs, [voice preset], 155 wpm, [tone]
HASHTAGS: ...
DESCRIPTION: ...
```

### 4. Production schedule (MCP-compressed)

End output with batch production plan. With MCPs handling voiceover + thumbs, Azriel's manual time drops from 5hrs → 2-3hrs.

```
BATCH DAY PLAN (with ElevenLabs + Canva MCPs):
- DONE before batch day: Skill auto-generated all VOs + thumbs/covers (~10 min)
- 09:00-10:00 -- Record screen B-roll (OBS, navigate sites, code snippets)
- 10:00-12:00 -- Edit in CapCut/DaVinci (drag VO mp3s + thumbs in, assemble, overlays)
- 12:00-13:00 -- Export 1080x1920, write descriptions, schedule uploads in YT Studio
```

### 5. Save batch + calendar

Save full batch markdown to `projects/youtube-rielcode/batches/YYYY-WW.md`. List all generated asset paths inline.



- Save full batch to `projects/youtube-rielcode/batches/YYYY-WW.md` (week number)
- Offer to add publish dates to Google Calendar via `/gcal-schedule`
- Ask if Azriel wants reminder for Sunday batch day

### 6. Track in priorities

Add 1 line to `context/current-priorities.md` under Active Projects if YouTube batch is in flight:
`- YouTube week [WW] -- [N] shorts scripted, batch day [DATE]`

## Rules

- Never generate more than 5 in one batch (quality drops, exhaustion).
- Every batch has at least 1 build showcase (lead-gen priority).
- Hooks across the week must be varied (no two openings with same pattern).
- All CTAs rotate -- not all 5 ending with same CTA.
- If Azriel skips a week, don't auto-fill -- just note "no batch this week" in calendar.
