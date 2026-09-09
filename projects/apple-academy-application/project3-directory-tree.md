# Project 3 Image Asset - JARVIS Directory Tree

For "Images needed: Directory tree of the 45 skills". Verified against live repo 2026-09-01.

## Full tree (45 skills, grouped by purpose)

```
JARVIS/
├── CLAUDE.md                    # assistant constitution: rules, priorities, data map
├── .claude/
│   ├── settings.json
│   ├── rules/                   # communication style, tone constraints
│   └── skills/                  # 45 modular skills
│       │
│       ├── ── Business / Client Pipeline ──
│       ├── lead-tracker/        # cold to closed pipeline
│       ├── client-proposal/     # proposal from pricing source of truth
│       ├── follow-up/           # WhatsApp follow-up drafting
│       ├── demo-website/        # per-niche demo site generator
│       ├── site-review/         # feature detection to price estimate
│       ├── site-cloner/
│       ├── project-kickoff/
│       ├── project-completion-doc/
│       ├── new-project/
│       ├── audit/  audit-short/  audit-tool-launch/
│       │
│       ├── ── Marketing / Content ──
│       ├── caption/  instagram-content/  banner-design/
│       ├── yt-strategy/  yt-batch/  yt-script/
│       ├── repurpose-project/  email-course-builder/
│       ├── brand/  design/  design-system/
│       │
│       ├── ── Engineering / Delivery ──
│       ├── frontend-design/  emil-design-eng/
│       ├── ui-styling/  ui-ux-pro-max/
│       ├── deploy/                  # 7-stage deployment pipeline
│       ├── git-command/  playwright/  url-screenshot/
│       ├── chatbot-integration/  video-to-website/
│       ├── slides/  graphify-out/
│       │
│       ├── ── College / Teaching ──
│       ├── quiz-auto/               # module PDF to Google Form
│       ├── level-up/  grill-me/
│       │
│       └── ── Meta (skills that build skills) ──
│           ├── skill-builder/  agent-builder/
│           ├── claude-coach/  session-memory/
│           ├── daily-priorities/    # ranked action list for the day
│           ├── gcal-schedule/  onboard/
│
├── context/                     # who I am, business, priorities, goals
├── memory/                      # 57 persistent memory files + MEMORY.md index
├── decisions/log.md             # append-only decision log
├── references/
│   ├── sops/                    # customer-handling, hosting provisioning
│   └── rielcode-pricing.md      # single source of truth for quotes
├── leads/                       # leads, active-customers, archive
├── projects/                    # one folder per active workstream
├── templates/
├── meta/                        # Meta Ads data + Flask dashboard
├── my-video/                    # Remotion render pipeline (Project 4)
├── manim-ads/
├── teaching/
└── tools/google/                # gcal, gmail, gdrive CLIs
```

## Compact version (if slide space is tight)

```
JARVIS/
├── CLAUDE.md              constitution
├── .claude/skills/        45 skills
│   ├── business/          lead-tracker · client-proposal · follow-up
│   │                      demo-website · site-review · audit
│   ├── marketing/         caption · instagram-content · yt-script
│   │                      brand · banner-design · design-system
│   ├── engineering/       deploy · git-command · playwright
│   │                      frontend-design · site-cloner
│   ├── college/           quiz-auto · grill-me · level-up
│   └── meta/              skill-builder · claude-coach
│                          session-memory · daily-priorities
├── memory/                57 files, persists across sessions
├── context/               identity, business, priorities
├── decisions/log.md       append-only
└── references/            SOPs + pricing source of truth
```

## Caption for the slide

> 45 skills grouped by the friction they remove. The memory layer is why it holds a standard across sessions instead of restarting cold each time.

## Rendering note
Monospace (JetBrains Mono / SF Mono), left-aligned, dark text on light. Bold the four group labels so the structure reads at a glance. Do not shrink below 10pt on A4 landscape.
