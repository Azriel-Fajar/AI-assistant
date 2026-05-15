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

### 3. Full scripts (after approval)

For each approved topic, output full script using the same format as `/yt-script`:

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

VOICEOVER: ElevenLabs, [voice preset], [pace]
HASHTAGS: ...
DESCRIPTION: ...
```

### 4. Production schedule

End output with batch production plan:

```
SUNDAY BATCH PLAN:
- 09:00-10:00 -- Record all screen B-roll (open browser, navigate sites, code snippets)
- 10:00-11:00 -- Generate all voiceovers (paste scripts to ElevenLabs, export)
- 11:00-14:00 -- Edit in CapCut/DaVinci (assemble, overlays, transitions)
- 14:00-15:00 -- Export, write descriptions, schedule uploads in YouTube Studio
```

### 5. Save batch + calendar

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
