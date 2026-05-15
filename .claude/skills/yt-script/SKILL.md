---
name: yt-script
description: Use when Azriel needs a single YouTube Short script for Rielcode. Generates hook, body, CTA, voiceover-ready script (45-60s), shot list (no-face screen recording), and on-screen text overlays for one topic.
---

## What This Skill Does

Writes one production-ready YouTube Short script. Optimized for:
- No-face delivery (screen recording + AI voiceover)
- 45-60 second target length
- High-retention hook (first 2 seconds)
- Rielcode lead-gen CTA at end

Reads `projects/youtube-rielcode/strategy.md` if it exists for channel context. If missing, tell Azriel to run `/yt-strategy` first.

## Steps

### 1. Get topic input

Ask in one message:
- Topic or rough idea? (e.g. "why most cafe websites suck", "Parallaxnet build reveal")
- Which pillar? (1 = build showcase, 2 = SMB tips, 3 = process, 4 = hot take)
- Any specific data/example to use? (client name, stat, screenshot to reference)

If Azriel just says "give me one", auto-pick a pillar and topic from strategy doc.

### 2. Write the script

Format strictly:

```
TITLE: [under 60 chars, includes hook keyword]

DURATION TARGET: 45-60s

HOOK (0-2s):
[One line. 8 words max. Pattern interrupt, contrarian, or curiosity gap.]

BODY (2-45s):
[3-5 short beats. Voiceover lines only. Conversational English. No jargon.]

CTA (45-60s):
[One of: DM @rielcode on IG | Link in bio for free quote | Comment site URL for free audit]
```

### 3. Shot list (no-face)

Below script, write shot list mapping each beat to visual:
- B-roll: screen recording, code, browser, design tool, before/after split
- Text overlay: 3-7 words per overlay, big bold
- Transitions: zoom, swipe, cut

Format:
```
SHOT 1 (0-2s): [Visual] | OVERLAY: "..."
SHOT 2 (2-8s): [Visual] | OVERLAY: "..."
...
```

### 4. Voiceover settings

Specify:
- TTS tool: ElevenLabs (preferred) or OpenAI TTS
- Voice preset: e.g. "professional male, mid-tone, US English"
- Pace: 150-170 wpm (slightly fast for retention)
- Pause markers: insert `[0.3s pause]` between beats

### 5. Hashtags + description

3 short hashtags for Shorts (#webdesign #smallbusiness #rielcode style).
1-line description with link to rielcode.com.

### 6. Production checklist

End output with checklist:
- [ ] Record screen B-roll
- [ ] Generate voiceover (paste script into ElevenLabs)
- [ ] Edit in CapCut/DaVinci with overlays
- [ ] Export 1080x1920, under 60s
- [ ] Upload + schedule

## Rules

- Hook MUST be under 8 words. If it's longer, rewrite.
- No emojis in script. No em dashes.
- Voiceover lines = exactly what gets spoken. No stage directions in voiceover block.
- Every script ends with one CTA. Never two.
- If topic is a build showcase, name the client (real names if permission, else "a Salatiga cafe", "a Canada client").
- Hook patterns that work: "Most [audience] do X wrong.", "I just built X for Y.", "If your site does X, you're losing money.", "Why [common belief] is dead."
