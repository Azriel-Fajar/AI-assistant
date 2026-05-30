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
