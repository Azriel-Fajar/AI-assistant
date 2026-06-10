# Decisions Log

Append-only record of meaningful decisions and why they were made. `/level-up` Phase 2 (Method interview) writes scoped automation specs here. You can also append manually whenever you decide something worth remembering.

**Format per entry:**

```
## YYYY-MM-DD — Short title

**Decision:** what was decided.

**Why:** the reasoning, constraints, and what would change your mind.

**Alternatives considered:** what else was on the table.

**Owner:** who's accountable.
```

Keep it terse. Future-you will thank present-you for capturing the *why*, not just the *what*.

---
[2026-05-16] DECISION: Launch Rielcode YouTube Shorts channel (English, hybrid builds+SMB tips, no-face screen-rec stack) and add /site-review skill | REASONING: Current promo = passive (affiliates+inactive IG). YT Shorts = scalable organic reach to international SMBs. /site-review automates quoting + upsells using rielcode-pricing.md, removes manual estimation friction | CONTEXT: 4 new skills built (/yt-strategy, /yt-script, /yt-batch, /site-review). Pricing reference seeded at references/rielcode-pricing.md.

[2026-05-16] DECISION: YouTube channel strategy locked for Rielcode | REASONING: Hybrid build-showcase+SMB-tips pillars, English, no-face screen-rec, 3/week baseline. Targets international SMBs as primary, Indonesian secondary. Lead-gen funnel into rielcode.com /packages | CONTEXT: Strategy doc at projects/youtube-rielcode/strategy.md. First batch (May 18-22) due tomorrow via /yt-batch.

[2026-05-16] DECISION: Build /repurpose-project + /audit-short skills, queue rest of wild-idea skills per growth-plan calendar | REASONING: Repurpose pipeline + Salatiga audit are LOW-effort/HIGH-ROI Week 1-2 plays. Building now while context fresh. Audit Tool + email course skills deferred to weeks 3-7 per calendar | CONTEXT: YT launch shifted to Tue May 19 (user not on main machine). ElevenLabs account confirmed (picked Content Business + Voice overs/TTS).

[2026-05-30] DECISION: Apply Claude Code Insights report fixes to JARVIS + Rielcode | REASONING: Report flagged dual-machine env quirks, buggy-first-attempt rework, and rebase-conflict churn. Fixed hardcoded afw14 path in Stop hook (now $env:CLAUDE_PROJECT_DIR), made /git-command fall back rebase->merge instead of stopping, added Environment/Verify-Before-Done/Scope-Tracing rules to CLAUDE.md, added Build&Verify/DB-Safety/Pricing/Theming rules to rielcode-laravel CLAUDE.md | CONTEXT: Skipped meta-ad-factory skill (deferred). Plan at C:\Users\pc\.claude\plans\okay-what-i-want-eager-matsumoto.md.

[2026-06-10] DECISION: Stop adding lead-gen channels. Fix the close gap instead. Keep Meta Ads passive (no budget raise till close rate > 0), retry light outreach when college time allows. | REASONING: 4 channels live, Rp 404k spent, 0 new clients. Grill exposed the leak is post-demo: lead asks niche example, gets live demo link, then ghosts. No follow-up, no close script. Lead-gen is not the bottleneck, follow-up + close is. | CONTEXT: grill-me session on getting more leads/clients for Rielcode

[2026-06-11] DECISION: Keep Meta Ads v3 (WhatsApp Conversations) running despite Rp39k/convo; fix the close-gap with ready demos instead of cutting spend or reverting to Messenger. Launch new 10-lead cold IG batch across Central Java (cafe/salon/dental/gym/real-estate) with niche demo links built into first message. | REASONING: v3 = ~7-9 real convos lifetime at ~Rp39k each, 7x worse than old Rp5,702 Messenger baseline BUT Messenger convos were spam/no buyers (vanity metric). WA friction filters real intent. Leads died because they asked for examples and Azriel had nothing to show; now 8 niche demos live at rielcode.com/demos/. Channel was never the problem, the missing example asset + close was. Confirms [2026-06-10] close-gap decision. | CONTEXT: User fetched live Meta report (7d spend Rp413k across 3 campaigns, v1/v2 paused = Messenger). Demos now live. 10 cold leads saved to leads.md (009-018) + memory project_coldoutreach_centraljava_2026-06.md with locked casual ID tone.
