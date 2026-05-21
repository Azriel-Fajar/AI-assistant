# Rielcode Phase 2 — Editorial Redesign Spec

**Date:** 2026-05-21
**Status:** Draft, pending user review
**Phase:** 2 of 2 (Phase 1 stack migration shipped: 8 routes on Astro 5 static, github.com/Azriel-Fajar/rielcode-astro)

## Goal

Replace the existing Rielcode marketing visual language (dark navy + Syne + blue glow, "vibe-coded" feel) with a globally-premium editorial-agency identity that converts international and Indonesian SMB clients. Restructure IA from PHP-era page set into a tight studio site that sells craft.

## Visual Direction

**Mood:** Editorial agency. Reference axis = Studio Basement, Locomotive, Active Theory (restrained). Story-driven, asymmetric, warmth + restraint. Not SaaS minimalism, not developer-craft portfolio. Premium because it is *composed*, not because it is loud.

**Palette**
- Cream `#f4f1ea` (primary surface, light theme bg)
- Ink `#1a1a1a` (primary text, dark theme bg)
- Forest accent `#2d4a3a` (CTAs, links, accent type, labels)
- Forest mid `#4a6b58` (hover, secondary accent)
- Forest pale `#8ba88f` (subtle backgrounds, success states)
- Neutral scale: 50 `#faf8f3` → 900 `#0a0a0a` (warm-tinted greys)

Theme: light primary, dark toggle (per Phase 1 plan). Dark theme inverts cream ↔ ink, keeps forest unchanged for brand continuity.

**Typography**
- **Display:** Fraunces (variable, italic + roman, opsz 144). H1–H3 + editorial pulls.
- **Body:** Inter (variable). Body, nav, UI, labels.
- **Mono (optional):** JetBrains Mono. Code, build logs, technical callouts only.
- Scale follows existing `tokens.css` 11-step size scale — re-map font families, keep numeric steps.

**Motion:** Editorial storytelling tier. GSAP + ScrollTrigger.
- Hero: staggered word reveal (clip-path mask, 600ms)
- Section enter: opacity + 24px translateY, IntersectionObserver-triggered
- Case study: pinned scroll sections, image parallax (15–25% depth)
- Nav: blur-on-scroll, hide-on-scroll-down
- Cursor: standard (no custom cursor — too far)
- Page transitions: Astro view transitions API, 250ms cross-fade
- Respect `prefers-reduced-motion` — disable transforms, keep fades

## Information Architecture

Replaces current 8 routes. New site map:

| Route | Purpose | Replaces |
|---|---|---|
| `/` | Home — studio overview, featured work, services preview, CTA | current `/` |
| `/work` | Case study index (grid of past projects) | current `/portfolio` |
| `/work/[slug]` | Individual case studies (Parallaxnet Canada first) | NEW |
| `/studio` | About Azriel, process, values, FAQ folded in | NEW (consumes `/faq`) |
| `/services` | Packages, pricing (IDR + USD), deliverables | current `/packages` |
| `/contact` | Form + WhatsApp + email + response time | current `/contact` |
| `/404` | Not-found | current `/404` |
| `/privacy` | Privacy policy | current `/privacy` |
| `/terms` | Terms & conditions | current `/terms` |

`/faq` removed as standalone — content lives in `/studio` accordion section. `/journal` deferred (deferred until publishing cadence committed).

## Page-Level Design

### `/` — Home
1. **Hero** — Fraunces 42–80px italic + roman line, "Websites with / uncommon polish." Studio number label. Two CTAs (forest fill + underline). Availability + currency chips.
2. **Featured work** — 2 case studies, asymmetric grid (large + small offset). Hover: scale-up image, slide-in caption.
3. **Studio brief** — 2-col: left = portrait/visual, right = paragraph + 3 stat lines (years, projects shipped, countries served).
4. **Services preview** — 3 service tiles (Custom, Landing, E-com) with pricing-from. Link to `/services`.
5. **Testimonials** — single rotating quote, large Fraunces, attribution.
6. **CTA band** — full-width forest, cream text. "Start a project →".

### `/work` — Case Study Index
- Grid: alternating tall/wide tiles, 6 slots. Hover reveals year + project type.
- Filter chips: All / Custom / Landing / E-com (top right).

### `/work/[slug]` — Case Study Template
- Cover: full-bleed image, title overlay, year + client + role + duration meta strip.
- Sections (alternating): Overview prose → Pinned image with parallax → Solution prose → Image grid → Outcome stats → Next case study link.
- First case study to author: Parallaxnet Canada (Ali, delivered 2026-05-05).

### `/studio` — About
- Hero: "A solo studio in Salatiga, building for the world." Portrait beside.
- Process: 4 steps (Brief → Design → Build → Ship), each with Fraunces numeral + paragraph.
- Values: 3-col list.
- FAQ: 8 accordions (folded from current `/faq`).
- CTA band repeat.

### `/services` — Packages
- Intro paragraph.
- 3 package cards: Landing (IDR 4M / $260), Custom (IDR 8–12M / $520–780), E-com (IDR 15M+ / $980+). Each lists deliverables + timeline.
- Add-ons table.
- FAQ snippet (3 most-asked, link to `/studio#faq`).
- CTA band.

### `/contact` — Inquiry
- 2-col: form (name, email, project type select, message) left, aside (email, WhatsApp deep link in Opera, response time, availability) right.
- Form posts to existing `/contact-submit.php` (Phase 1 Track 1C scope).
- Success state: Fraunces "Thanks. Reply within 24h.".

## Component System

Built on existing Phase 1 stubs + design tokens. New components:

- `<EditorialHero>` — h1 with italic + roman split, label, CTAs, chips slot.
- `<WorkCard>` — image + meta + hover state, two sizes (lg, sm).
- `<CaseStudySection>` — variants: prose, image-pinned, image-grid, stats, quote.
- `<ServiceCard>` — package tile with price toggle (IDR/USD).
- `<FAQAccordion>` — accessible `<details>` with motion.
- `<CTABand>` — full-bleed forest, cream text, single CTA.
- `<ThemeToggle>` — light/dark, persisted to localStorage.
- `<Nav>` — refactor existing stub. Blur-on-scroll, hide-on-scroll-down, mobile drawer.
- `<Footer>` — refactor existing stub. Studio number, links, contact, theme toggle, currency toggle.

Reuse: `<BaseLayout>`, `<Button>`, `<Card>`, `<Section>` (refactor token references).

## Tokens — Updates to Phase 1 `tokens.css`

Keep numeric scales. Change semantic values:

```css
/* Phase 1 had: --rc-bg: dark-navy, --rc-accent: blue */
/* Phase 2: */
--rc-bg: #f4f1ea;            /* cream */
--rc-bg-elev: #ebe7dc;       /* card surface */
--rc-text: #1a1a1a;          /* ink */
--rc-text-muted: rgba(26,26,26,0.65);
--rc-accent: #2d4a3a;        /* forest */
--rc-accent-hover: #4a6b58;
--rc-accent-pale: #8ba88f;
--rc-border: rgba(26,26,26,0.12);

/* Dark theme via [data-theme="dark"] */
--rc-bg: #1a1a1a;
--rc-text: #f4f1ea;
/* forest unchanged */

/* Typography */
--rc-font-display: 'Fraunces', Georgia, serif;
--rc-font-body: 'Inter', system-ui, sans-serif;
--rc-font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

Phase 1 TODO marker for accent gets resolved by this spec.

## Data / Content Migration

Phase 1 baked DB-driven content as HTML snapshots in `src/snapshots/`. Phase 2 lifts these into Astro Content Collections:

- `src/content/work/*.md` — case studies (frontmatter: title, year, client, role, duration, cover, services[], stack[])
- `src/content/services/*.md` — packages
- `src/content/testimonials/*.md` — quotes
- `src/content/faq/*.md` — Q&A

Author Parallaxnet Canada case study as first work entry (content TBD with user — gather screenshots, role, outcome).

Snapshot files deleted after Content Collections shipped.

## Tech / Stack Additions

- **Fonts:** Self-host Fraunces + Inter variable WOFF2 in `/public/fonts/`. Subset to Latin. Preload critical weights.
- **GSAP:** `gsap` + `ScrollTrigger`. Loaded on route segments that need it (lazy import). Avoid global GSAP bundle.
- **Astro view transitions:** Enable `<ViewTransitions />` in BaseLayout.
- **Image:** Astro `<Image>` for case-study covers + work tiles. AVIF + WebP fallback.
- **No CMS yet.** Content Collections = markdown + frontmatter. Phase 3 (post-launch) could move to Sanity/Decap if cadence demands it.

## Out of Scope (Phase 2)

- `/journal` blog (deferred — needs publishing commitment)
- CMS integration
- Multi-language (id/en) — current site is English-first; revisit if Salatiga lead campaign needs id copy
- E-commerce on `/services` (Stripe/Snap) — package booking stays as contact form route until volume justifies
- Custom WebGL hero / cursor effects (motion budget tier 3, not chosen)
- PHPMailer wiring on `/contact-submit.php` — separate ticket, doesn't block Phase 2

## Execution Plan

**Status (2026-05-21):** Tracks 2A → 2C shipped on `rielcode-astro` repo (`C:\xampp\htdocs\rielcode-astro`), branch `main`. Tags: `phase-2-2A-complete`, `phase-2-2B-complete`. Home (`/`) live on new design language. Remaining pages (`/contact`, `/portfolio`, `/packages`, `/faq`, `/privacy`, `/terms`, `/404`) still render Phase 1 snapshots — visible drift between `/` and the rest is expected until 2D-2G land.

Track 2A — tokens + fonts + theme toggle ✅
Track 2B — global components (Nav, Footer, CTABand, ThemeToggle, Button, Section, Card) ✅
Track 2C — `/` home redesign ✅
Track 2D — `/work` index + `/work/[slug]` template + Parallaxnet case study (stub content — fill when client materials ready)
Track 2E — `/studio`
Track 2F — `/services`
Track 2G — `/contact` + utility pages (`/404`, `/privacy`, `/terms`) restyle
Track 2H — motion layer (GSAP, ScrollTrigger, view transitions, reduced-motion)
Track 2I — content collections migration + snapshot deletion + 301 redirects (`/portfolio` → `/work`, `/packages` → `/services`, `/faq` → `/studio#faq`)
Track 2J — visual QA + Playwright screenshot diff + Lighthouse + accessibility pass

Tracks 2A → 2B sequential. 2C–2G parallel after 2B. 2H parallel with page tracks. 2I + 2J at end.

**Next session:** pick up at Track 2D. Plan for 2A-2C: `docs/superpowers/plans/2026-05-21-rielcode-phase-2-tracks-2A-2C.md`. Baseline screenshot: `screenshots/phase-2/home-2C-baseline.png`.

## Success Criteria

- All 9 routes ship on new design language
- Lighthouse ≥ 95 mobile + desktop on all routes
- Axe accessibility = 0 critical issues
- Total JS shipped per route ≤ 80kb gzipped
- LCP ≤ 1.8s on 4G simulation
- Parallaxnet case study published (first proof of new template)
- Theme toggle works, persists, respects `prefers-color-scheme` on first visit
- All 301 redirects from Phase 1 URLs land correctly
- User (Azriel) signs off on `/` + 1 case study before remaining pages ship
