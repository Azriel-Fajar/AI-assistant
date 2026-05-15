# Rielcode Growth Plan — Wild Ideas Bundle

Status: Active (rollout planning)
Created: 2026-05-16
Goal: Build a compounding lead-gen system across YouTube, free tools, repurposing, outreach, and lead magnets.

## Why this exists
Single-channel promo (affiliates + inactive IG) caps growth. This plan stacks 4 reinforcing systems so each piece feeds the others. Output multiplies, ideation effort stays flat.

---

## The 4 Wild Ideas (sorted by ROI ÷ effort)

| # | Idea | Effort | Expected payoff | Priority |
|---|---|---|---|---|
| 1 | Repurpose-per-build pipeline (3x content per project) | LOW (1 day setup) | High — every project = 3 assets | NOW |
| 2 | Salatiga "case study generator" (audit + Short + DM) | LOW-MED (recurring) | Med-High — warm leads, free content | NOW (parallel) |
| 3 | Free Website Audit tool on rielcode.com | HIGH (1 week build) | High (compounding) | Week 3 |
| 4 | "$0 to first website in 7 days" lead-magnet course | MED (3-5 days) | Med (slow burn, 6mo payoff) | Month 2 |
| 5 | Build-with-me live streams (1-2hr monthly) | MED (recurring) | Med-High — long+Short algo boost | Month 2-3 |

---

## Idea 1: Repurpose-Per-Build Pipeline

**What:** Every delivered project triggers 3 assets, run as a checklist.

**Pipeline (per project):**
1. **YT Short (30s) — Before/After reveal**
   - Screen rec: old site → swipe → new site
   - Voiceover: 3 sentences (what was broken / what we changed / result expectation)
   - CTA rotates
2. **Instagram carousel (5 slides)**
   - Slide 1: project name + industry
   - Slide 2: the brief (in client's words)
   - Slide 3: 2-3 process screenshots
   - Slide 4: final result hero
   - Slide 5: CTA — DM for quote
3. **Written case study on rielcode.com/portfolio/[slug]**
   - SEO-targeted: "[industry] website build" + "[city] web developer"
   - 500-800 words: problem → process → outcome
   - Include screenshots, package used, delivery time

**Setup tasks:**
- [ ] Add `repurpose-checklist.md` template under `templates/`
- [ ] Add step to `/project-completion-doc` skill: after PDF, run repurpose pipeline
- [ ] First test run: Parallaxnet Canada (just delivered 2026-05-05)

**Rollout:**
- Week 1: Build template + test on Parallaxnet (3 assets done by 2026-05-23)
- Week 2+: Standard process after every delivery

**Skill to build:** `/repurpose-project [project-name]` — auto-generates all 3 drafts.

---

## Idea 2: Salatiga Case Study Generator

**What:** Pick 5-10 weakest cafe/SMB sites in Salatiga monthly. Audit publicly. Tag them. DM follow-up.

**Workflow (per target):**
1. Use `/site-review [url]` (intent 3 = competitor benchmark) on prospect
2. Generate "Here's how I'd fix [Cafe Name]'s site" Short (60s):
   - Show their current site (5s)
   - Top 3 issues (15s)
   - Mockup of fix (30s — sketch on screen)
   - CTA: "@[Cafe] — DM if you want this for real"
3. Post Short, tag them on IG, post IG carousel of fixes
4. Day 3: DM on IG with quote: "I made a video about your site. Real rebuild = IDR 999k. Interested?"

**Why it works:**
- Free content engine (you produce 5+ Shorts/mo from this alone)
- Warm leads (they already saw their name)
- Portfolio expansion (mockups become demos)
- Local SEO play (Salatiga-tagged content)

**Rollout:**
- Week 2: Target list of 10 Salatiga cafes (use existing lead-tracker list)
- Week 3: First 3 audit-Shorts live
- Ongoing: 2-3 audit-Shorts per week (fits YT batch flow)

**Skill to build:** `/audit-short [url] [business-name]` — full pipeline (audit → script → DM draft).

**Risk:** Tagging negatively can backfire. Rule: always lead with positive ("I love what they've built. Here's how to make it convert better").

---

## Idea 3: Free Website Audit Tool

**What:** Public version of `/site-review` on rielcode.com. URL input → feature checklist + score + 3 upgrade suggestions. Email-gated full report.

**Tech stack:**
- PHP form on rielcode.com/audit (matches existing site stack)
- Playwright Node script on backend (already installed root-level)
- Email capture → Mailchimp/Brevo
- DB: write each audit to MySQL (lead source)

**MVP scope (v1):**
- Input: URL
- Output (public): Score 0-100, top 3 missing features (no prices)
- Output (emailed): Full report — feature list, score breakdown, 5+ upgrade suggestions, sample package match
- After-audit CTA: "Get a real quote in 24 hours — DM us your audit ID"

**Why it works:**
- Compounding SEO content (audit pages = programmatic SEO)
- Email list = nurture-able
- Doubles as YT content ("I audited 5 random brands this week")
- Lead-gen with zero ad spend

**Build plan:**
- Phase 1 (Day 1-2): UI mockup + form + email capture (works manually, audit run by you)
- Phase 2 (Day 3-5): Backend Playwright scraper + score logic
- Phase 3 (Day 6-7): PDF email delivery + tracking

**Rollout:**
- Soft launch: 2026-06-01 (after YT week 2 stable)
- Promo: Tag in YT bio + 3 dedicated Shorts demoing it

---

## Idea 4: "$0 to First Website in 7 Days" Mini-Course

**What:** Free 7-email course teaching SMB owners DIY basics. Day 7 = "or hire someone in 1 day — quote inside".

**Curriculum:**
- Day 1: Why your business needs a website (mindset)
- Day 2: Pick your domain in 10 minutes
- Day 3: Free hosting options (Hostinger, Niagahoster)
- Day 4: Pick a builder (DIY: Carrd, Squarespace)
- Day 5: Write copy that converts (1 hero + 3 sections)
- Day 6: Get found on Google (basic SEO checklist)
- Day 7: When DIY breaks down — Rielcode quote inside

**Lead magnet positioning:** Captures budget-constrained prospects. Even if 5% convert in 6 months, list grows passively.

**Build plan:**
- Week 5-6: Write all 7 emails
- Week 7: Set up Mailchimp/Brevo automation
- Promo: Tag in YT bio, mention in Audit tool email sequence

**Rollout:** 2026-07 (Month 2)

---

## Idea 5: Build-with-me Live Streams

**What:** Monthly 1-2hr YouTube live: build a real landing page (free template, no client work). Chop into 5-8 Shorts after.

**Why later:**
- Need 200+ subs before live = effective social proof
- Solo + college load = monthly cap

**Setup tasks (when ready, Month 2-3):**
- OBS scene setup for live
- Promo: announce 1 week in advance via YT community tab
- Chop long → Shorts via CapCut (10 Shorts per live)

---

## Master Rollout Calendar

| Week | Date Range | Focus |
|---|---|---|
| 1 | May 18-24 | Channel live (@rielcodeofficial). First 3 shorts posted (Wed/Fri/Sat-or-Mon). Test repurpose pipeline on Parallaxnet. |
| 2 | May 25-31 | Mon/Wed/Fri cadence locked. Build Salatiga target list (5-10 cafes). |
| 3 | Jun 1-7 | First /audit-short Short live. Stretch to 4/week. Start Audit Tool build (Phase 1). |
| 4 | Jun 8-14 | YT 30-day review. Audit Tool Phase 2-3 build. First lead attribution check. |
| 5 | Jun 15-21 | Audit Tool soft launch + 3 promo Shorts. |
| 6-7 | Jun 22 - Jul 5 | Lead magnet course writing (7 emails). |
| 8 | Jul 6-12 | Lead magnet live. First Salatiga DM-from-audit conversions evaluated. |
| 9-12 | Jul 13 - Aug 9 | Optimize winners. Plan first Build-with-me stream. |

## Success Metrics (90 days)

- 36+ YT Shorts uploaded
- 200+ YT subscribers
- 30+ YT-attributed visits to rielcode.com
- 50+ audit tool runs
- 10+ leads from Salatiga audit pipeline
- 3-5 lead-magnet course signups/week
- 1-2 new clients attributed to this whole plan

## Skills to Build (in order)

1. `/repurpose-project` — auto-generate 3 assets from a delivered project
2. `/audit-short` — Salatiga pipeline (audit → 60s script → DM draft)
3. `/audit-tool-launch` — guided build of the public Audit tool
4. `/email-course-builder` — turn course outline into 7 ready-to-send emails

Each gets built when its rollout week arrives — not before.

---

## Risks / Things to Kill Fast

- **YT no traction by Day 60:** kill no-face stack, force one face-cam Short/week (buy webcam IDR ~500k).
- **Salatiga DMs flagged as spam:** switch to email outreach instead.
- **Audit Tool brings 0 leads after 30 days:** strip gated email, make it 100% public + add WhatsApp CTA at top of report.
- **Repurpose pipeline feels like a chore:** automate it inside `/project-completion-doc` so it's auto-triggered.

---

Ship one piece at a time. Don't try to launch all 5 in week 1.
