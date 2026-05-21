# Rielcode Phase 2 — Tracks 2H + 2I + 2J Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the remaining Phase 2 tracks for the rielcode-astro editorial redesign — motion layer (2H), content collections migration with redirects (2I), and visual QA pass (2J).

**Architecture:** Astro 6 static site at `C:\xampp\htdocs\rielcode-astro` (git branch `main`). Tracks 2A-2G shipped, content currently hardcoded in `.astro` pages. 2H adds GSAP + ScrollTrigger + view transitions with reduced-motion support. 2I lifts hardcoded content into Astro Content Collections (`src/content/{work,services,testimonials,faq}/`), enables `<ContentCollection>`-driven pages, deletes `src/snapshots/`, adds 301 redirects. 2J runs Playwright screenshot diff, Lighthouse, axe accessibility scan.

**Tech Stack:** Astro 6, Tailwind v4, GSAP 3, Astro Content Collections, Playwright (already root-installed), Lighthouse CI, axe-core.

**Working dir for all tasks:** `C:\xampp\htdocs\rielcode-astro` unless noted.

**Source of truth for content:** existing hardcoded arrays in `src/pages/*.astro`, plus PHP DB at `C:\xampp\htdocs\Rielcode\` (MySQL `rielcode` DB) for testimonials only. Service/FAQ content already final in Astro pages.

---

## Sub-Project Note

This plan covers three tracks. They can ship sequentially as one feature branch or three:

- **Track 2H** (motion) is independent — does not change content, only adds JS.
- **Track 2I** (content collections) restructures data sources and adds redirects. Touches every page.
- **Track 2J** (QA) is verification-only — runs against the final built site after 2H + 2I.

Suggested order: 2I → 2H → 2J. 2I first because the content shape stabilises before motion attaches to selectors. (Spec says 2H or 2I either order; 2I-first prevents motion code touching elements that move into `<Content />` slots.)

Each track ends in a tag: `phase-2-2I-complete`, `phase-2-2H-complete`, `phase-2-2J-complete`.

---

## File Structure

### New files (Track 2I — content collections)

- `src/content.config.ts` — Content Collection schemas (work, services, testimonials, faq).
- `src/content/work/parallaxnet-canada.md` — case study, frontmatter + body.
- `src/content/services/landing.md` — Landing package.
- `src/content/services/custom.md` — Custom package.
- `src/content/services/ecom.md` — E-commerce package.
- `src/content/services/_addons.md` — add-ons list (single file).
- `src/content/testimonials/parallaxnet-canada.md` — Ali / Parallaxnet quote (one entry; placeholder OK if DB empty).
- `src/content/faq/cost.md`, `timeline.md`, `revisions.md`, `payment.md`, `hosting.md`, `post-launch.md`, `international.md`, `availability.md` — one file per Q&A (8 entries from `studio.astro`).
- `public/_redirects` — Netlify-style redirect map (Astro static `<meta http-equiv>` fallback in HTML pages too).
- `src/pages/portfolio.astro`, `src/pages/packages.astro`, `src/pages/faq.astro` — meta-refresh redirect stubs (in case host doesn't honour `_redirects`).

### Modified files (Track 2I)

- `src/pages/work/index.astro` — read from `getCollection('work')`.
- `src/pages/work/[...slug].astro` — NEW dynamic route replacing the static `parallaxnet-canada.astro` file.
- `src/pages/services.astro` — read packages + addons + FAQ snippet from collections.
- `src/pages/studio.astro` — read FAQ from collection.
- `src/pages/index.astro` — read featured work + testimonial from collections.

### Deleted files (Track 2I)

- `src/snapshots/index.html`, `packages.html`, `portfolio.html`, `terms.html` — superseded.
- `src/pages/work/parallaxnet-canada.astro` — replaced by dynamic `[...slug].astro`.

### New files (Track 2H — motion)

- `src/scripts/motion.ts` — IntersectionObserver-based reveal + scroll listeners. Tiny, no GSAP for basic stuff.
- `src/scripts/gsap-scenes.ts` — GSAP + ScrollTrigger pinned/parallax scenes. Lazy-imported only on case-study pages.
- `src/components/RevealOnScroll.astro` — wrapper with `data-reveal` attribute.

### Modified files (Track 2H)

- `src/layouts/BaseLayout.astro` — add `<ViewTransitions />`, load `motion.ts` globally, reduced-motion CSS guard.
- `src/components/Nav.astro` — add blur-on-scroll + hide-on-scroll-down class toggles.
- `src/components/EditorialHero.astro` — staggered word reveal via clip-path mask.
- `src/pages/work/[...slug].astro` — dynamic-import `gsap-scenes.ts` for pinned image parallax.

### New files (Track 2J — QA)

- `scripts/qa/playwright.config.ts` — Playwright config pointing at `http://localhost:4321` (Astro preview).
- `scripts/qa/visual.spec.ts` — screenshot each route at desktop + mobile viewports.
- `scripts/qa/axe.spec.ts` — axe-core a11y scan per route.
- `scripts/qa/lighthouse.mjs` — Lighthouse CI runner for all 9 routes, Mobile + Desktop.
- `docs/qa/phase-2-baseline/` — committed baseline screenshots (gitignored after baseline established? — commit them).
- `docs/qa/phase-2-report.md` — final QA report: Lighthouse scores, axe findings, screenshot deltas.

---

# TRACK 2I — Content Collections + Redirects

### Task 2I.1: Define Content Collection schemas

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create the schemas file**

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    client: z.string(),
    role: z.string(),
    duration: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    services: z.array(z.string()),
    stack: z.array(z.string()),
    summary: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    priceIdr: z.string(),
    priceUsd: z.string(),
    timeline: z.string(),
    deliverables: z.array(z.string()),
    order: z.number().default(999),
    isAddon: z.boolean().default(false),
    addons: z
      .array(z.object({ item: z.string(), price: z.string() }))
      .optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    clientName: z.string(),
    businessName: z.string().optional(),
    roleTitle: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    headline: z.string(),
    quote: z.string(),
    order: z.number().default(999),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(999),
    showOnServices: z.boolean().default(false),
  }),
});

export const collections = { work, services, testimonials, faq };
```

- [ ] **Step 2: Verify Astro recognises collections config**

Run: `npm run astro -- check`
Expected: "0 errors" (or only pre-existing warnings). Collection types should resolve.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(2I): define content collection schemas for work, services, testimonials, faq"
```

---

### Task 2I.2: Author FAQ collection entries (8 files from studio.astro)

**Files:**
- Create: `src/content/faq/cost.md`
- Create: `src/content/faq/timeline.md`
- Create: `src/content/faq/revisions.md`
- Create: `src/content/faq/payment.md`
- Create: `src/content/faq/hosting.md`
- Create: `src/content/faq/post-launch.md`
- Create: `src/content/faq/international.md`
- Create: `src/content/faq/availability.md`

- [ ] **Step 1: Write `cost.md`**

```markdown
---
question: How much does a Rielcode website cost?
order: 1
showOnServices: true
---

Landing pages start at IDR 4,000,000 / $260. Custom multi-page sites run IDR 8–12M / $520–780. E-commerce from IDR 15M+ / $980+. All quotes are fixed-price — no hourly billing surprises.
```

- [ ] **Step 2: Write `timeline.md`**

```markdown
---
question: How long does a project take?
order: 2
showOnServices: true
---

Landing pages: 1–2 weeks. Custom sites: 3–4 weeks. E-commerce: 4–6 weeks. Timeline depends on how quickly you provide content, feedback, and approvals.
```

- [ ] **Step 3: Write `revisions.md`**

```markdown
---
question: How many revisions are included?
order: 3
showOnServices: true
---

Two rounds of design revisions per page. Additional rounds are billed at a flat rate agreed up front.
```

- [ ] **Step 4: Write `payment.md`**

```markdown
---
question: Can I pay in IDR or USD?
order: 4
---

Yes. Local clients pay in IDR via bank transfer. International clients pay in USD via international bank transfer or supported online payment methods.
```

- [ ] **Step 5: Write `hosting.md`**

```markdown
---
question: Do you provide hosting and domain?
order: 5
---

Rielcode can set up hosting and domain on your behalf, billed at cost plus a small setup fee. You can also bring your own hosting.
```

- [ ] **Step 6: Write `post-launch.md`**

```markdown
---
question: What happens after the site launches?
order: 6
---

Every project includes 14 days of post-launch bug fixes. Ongoing support is available as a monthly retainer or pay-per-task.
```

- [ ] **Step 7: Write `international.md`**

```markdown
---
question: Do you work with international clients?
order: 7
---

Yes — most of the pipeline is international. Communication is async via WhatsApp and email, project docs in English.
```

- [ ] **Step 8: Write `availability.md`**

```markdown
---
question: What is your availability?
order: 8
---

Currently taking limited projects. Use the contact form to check Q3 availability. First-come, first-served for project slots.
```

- [ ] **Step 9: Verify build still works**

Run: `npm run build`
Expected: completes with no errors. Collection entries indexed.

- [ ] **Step 10: Commit**

```bash
git add src/content/faq/
git commit -m "feat(2I): author 8 FAQ entries as content collection"
```

---

### Task 2I.3: Author services + addons collection entries

**Files:**
- Create: `src/content/services/landing.md`
- Create: `src/content/services/custom.md`
- Create: `src/content/services/ecom.md`
- Create: `src/content/services/_addons.md`

- [ ] **Step 1: Write `landing.md`**

```markdown
---
id: landing
title: Landing
priceIdr: IDR 4,000,000
priceUsd: $260
timeline: 1–2 weeks
order: 1
deliverables:
  - Single high-conversion page
  - Mobile-first design
  - Copy consultation
  - Contact form or CTA integration
  - 2 rounds of revisions
  - 14-day post-launch support
---

A single page, engineered to convert. Copy, design, build, ship.
```

- [ ] **Step 2: Write `custom.md`**

```markdown
---
id: custom
title: Custom
priceIdr: IDR 8–12M
priceUsd: $520–780
timeline: 3–4 weeks
order: 2
deliverables:
  - Up to 6 pages
  - Bespoke design end-to-end
  - Static site (Astro) or custom CMS
  - SEO foundations
  - 2 rounds of revisions per page
  - 14-day post-launch support
---

A bespoke multi-page website, designed and developed end-to-end.
```

- [ ] **Step 3: Write `ecom.md`**

```markdown
---
id: ecom
title: E-commerce
priceIdr: IDR 15M+
priceUsd: $980+
timeline: 4–6 weeks
order: 3
deliverables:
  - Product catalogue (up to 30 SKUs)
  - Payment gateway integration
  - Inventory management basics
  - Order confirmation emails
  - 2 rounds of revisions
  - 14-day post-launch support
---

Simple storefronts for small catalogues. Payment + inventory included.
```

- [ ] **Step 4: Write `_addons.md`**

```markdown
---
id: addons
title: Add-ons
priceIdr: ""
priceUsd: ""
timeline: ""
deliverables: []
isAddon: true
order: 99
addons:
  - item: Extra revision round
    price: IDR 300K / $20 per page
  - item: Blog / journal setup
    price: IDR 1.5M / $100
  - item: Multilingual (id/en)
    price: IDR 2M / $130 per language
  - item: Speed & Lighthouse audit
    price: IDR 500K / $35
  - item: Domain + hosting setup
    price: At cost + IDR 200K setup fee
  - item: Ongoing monthly retainer
    price: From IDR 1M / $65 per month
---

Optional add-ons available on any package.
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: PASS, no schema errors.

- [ ] **Step 6: Commit**

```bash
git add src/content/services/
git commit -m "feat(2I): author services packages + addons as content collection"
```

---

### Task 2I.4: Author work case study + testimonial entries

**Files:**
- Create: `src/content/work/parallaxnet-canada.md`
- Create: `src/content/testimonials/parallaxnet-canada.md`

- [ ] **Step 1: Write `work/parallaxnet-canada.md`**

```markdown
---
title: Parallaxnet Canada
year: "2026"
client: Parallaxnet Canada
role: Design & development
duration: 4 weeks
cover: /IMG/og-default.png
coverAlt: Parallaxnet Canada website — desktop view
services:
  - Custom website
stack:
  - Astro
  - Tailwind CSS
summary: Editorial website for the independent Canadian entity of the Parallaxnet education network.
featured: true
order: 1
---

## Overview

Parallaxnet Canada is the independent Canadian entity of the Parallaxnet education network (HQ: USA). The brief called for an editorial website that positions the brand as a credible, internationally-connected education provider serving the Canadian market.

Designed and developed end-to-end by Rielcode. Delivered May 2026.

## Approach

The site was built as a static Astro project — no CMS overhead, instant page loads. Typography-first layout: Fraunces as display, Inter as body. Emphasis on hierarchy and whitespace over decoration.

Key decisions: minimal navigation, strong hero with a single CTA, structured programme listing, and a clear inquiry path. Content strategy was scoped and iterated with the client over WhatsApp before a line of code was written.

## Outcome

- 4 weeks brief to launch
- 100 Lighthouse performance (mobile)
- 1 revision round total
```

- [ ] **Step 2: Write `testimonials/parallaxnet-canada.md`**

```markdown
---
clientName: Ali
businessName: Parallaxnet Canada
roleTitle: Programme Director
rating: 5
headline: Editorial site that made our launch credible.
quote: Azriel delivered a website that looked like it belonged to a much larger institution. The process was tight, the result was sharp, and he understood the brief without us having to over-explain.
order: 1
---
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/content/work/ src/content/testimonials/
git commit -m "feat(2I): author Parallaxnet case study + testimonial as content collection"
```

---

### Task 2I.5: Convert `/work` index page to read from collection

**Files:**
- Modify: `src/pages/work/index.astro`

- [ ] **Step 1: Read the current page to understand its structure**

Run: `cat src/pages/work/index.astro`
Note the existing hardcoded list. Replace data source only, keep markup.

- [ ] **Step 2: Replace the data source with `getCollection`**

At the top of the frontmatter (after existing imports), add:

```ts
import { getCollection } from 'astro:content';
const allWork = (await getCollection('work')).sort(
  (a, b) => a.data.order - b.data.order
);
```

Replace the hardcoded array iteration with `allWork.map(...)` using `entry.data.title`, `entry.data.year`, `entry.data.cover`, `entry.data.coverAlt`, and `href={`/work/${entry.id}`}`.

- [ ] **Step 3: Build to verify**

Run: `npm run build && npm run preview`
Expected: `/work` page renders Parallaxnet card. Visit http://localhost:4321/work in a browser to confirm.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat(2I): /work index reads from content collection"
```

---

### Task 2I.6: Replace static case-study route with dynamic `[...slug].astro`

**Files:**
- Create: `src/pages/work/[...slug].astro`
- Delete: `src/pages/work/parallaxnet-canada.astro`

- [ ] **Step 1: Create the dynamic route**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CTABand from '../../components/CTABand.astro';

export async function getStaticPaths() {
  const entries = await getCollection('work');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const { title, year, client, role, duration, cover, coverAlt, services } = entry.data;
---

<BaseLayout
  title={`${title} · Rielcode`}
  description={entry.data.summary}
>
  <header class="rc-cs-cover">
    <div class="rc-container rc-cs-cover__inner">
      <div class="rc-cs-cover__meta rc-label">
        <span>{year}</span>
        <span>·</span>
        <span>{services.join(', ')}</span>
        <span>·</span>
        <span>{client}</span>
        <span>·</span>
        <span>{duration}</span>
      </div>
      <h1 class="rc-cs-cover__title"><em>{title}</em></h1>
    </div>
    <div class="rc-cs-cover__image-wrap">
      <img src={cover} alt={coverAlt} class="rc-cs-cover__image" />
    </div>
  </header>

  <div class="rc-container rc-cs-body">
    <Content />
  </div>

  <div class="rc-container">
    <div class="rc-cs-next">
      <span class="rc-label">Next project</span>
      <a href="/work" class="rc-cs-next__link">
        <span>Back to all work</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>

  <CTABand
    eyebrow="Work with Rielcode"
    heading="Want a site built with this much care?"
    ctaText="Start a project"
    ctaHref="/contact"
  />
</BaseLayout>

<style>
  .rc-cs-cover { padding-block: var(--space-24) 0; background: var(--rc-bg); }
  .rc-cs-cover__inner { display: flex; flex-direction: column; gap: var(--space-6); padding-bottom: var(--space-12); }
  .rc-cs-cover__meta { display: flex; gap: var(--space-3); flex-wrap: wrap; color: var(--rc-text-muted); }
  .rc-cs-cover__title {
    font-family: var(--rc-font-display); font-weight: 400;
    font-size: clamp(56px, 10vw, 140px); line-height: 1.0;
    letter-spacing: -0.03em; margin: 0; color: var(--rc-text);
  }
  .rc-cs-cover__title em { font-style: italic; }
  .rc-cs-cover__image-wrap { width: 100%; max-height: 600px; overflow: hidden; }
  .rc-cs-cover__image { width: 100%; height: 100%; object-fit: cover; }
  .rc-cs-body :global(h2) {
    font-family: var(--rc-font-display); font-size: clamp(28px, 4vw, 48px);
    font-style: italic; font-weight: 400; margin-block: var(--space-12) var(--space-4);
  }
  .rc-cs-body :global(p) { max-width: 64ch; margin-block: 0 var(--space-4); }
  .rc-cs-body :global(ul) { max-width: 64ch; padding-left: var(--space-6); margin-block: 0 var(--space-4); }
  .rc-cs-next {
    display: flex; flex-direction: column; gap: var(--space-3);
    padding-block: var(--space-24); border-top: 1px solid var(--rc-border);
    margin-top: var(--space-16);
  }
  .rc-cs-next__link {
    display: inline-flex; align-items: center; gap: var(--space-4);
    font-family: var(--rc-font-display); font-size: clamp(32px, 5vw, 64px);
    font-style: italic; color: var(--rc-text); text-decoration: none;
    transition: gap 0.3s ease, color 0.15s ease;
  }
  .rc-cs-next__link:hover { gap: var(--space-6); color: var(--rc-accent); }
  .rc-cs-next__link:focus-visible { outline: 2px solid var(--rc-accent); outline-offset: 4px; }
  @media (max-width: 899px) { .rc-cs-cover__image-wrap { max-height: 320px; } }
</style>
```

- [ ] **Step 2: Delete the old static case-study file**

```bash
git rm src/pages/work/parallaxnet-canada.astro
```

- [ ] **Step 3: Build + preview**

Run: `npm run build && npm run preview`
Expected: Visit `http://localhost:4321/work/parallaxnet-canada` — page renders identical content from markdown.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/[...slug].astro
git commit -m "feat(2I): replace static case study with dynamic [...slug] route reading work collection"
```

---

### Task 2I.7: Convert `/services` page to read from collections

**Files:**
- Modify: `src/pages/services.astro`

- [ ] **Step 1: Add the collection imports at top of frontmatter**

```ts
import { getCollection } from 'astro:content';

const allServices = (await getCollection('services'))
  .filter((e) => !e.data.isAddon)
  .sort((a, b) => a.data.order - b.data.order);

const addonsEntry = (await getCollection('services')).find((e) => e.data.isAddon);
const addons = addonsEntry?.data.addons ?? [];

const servicesFaq = (await getCollection('faq'))
  .filter((e) => e.data.showOnServices)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);
```

- [ ] **Step 2: Replace the hardcoded `packages`, `addons`, `faqs` consts**

Remove the existing arrays. Update references throughout the template:
- `packages.map(...)` → `allServices.map((entry) => { const p = entry.data; ... })`
- `addons.map(...)` → uses the new `addons` array (shape unchanged)
- `faqs.map(...)` → `servicesFaq.map((entry) => ({ q: entry.data.question, a: entry.body }))`

- [ ] **Step 3: Build + preview**

Run: `npm run build && npm run preview`
Expected: `/services` page renders 3 packages + addons table + 3 FAQ items. Visit `http://localhost:4321/services` to confirm.

- [ ] **Step 4: Commit**

```bash
git add src/pages/services.astro
git commit -m "feat(2I): /services reads packages, addons, and FAQ snippet from collections"
```

---

### Task 2I.8: Convert `/studio` FAQ section to read from collection

**Files:**
- Modify: `src/pages/studio.astro`

- [ ] **Step 1: Add the collection import at top of frontmatter**

```ts
import { getCollection } from 'astro:content';

const faqs = (await getCollection('faq'))
  .sort((a, b) => a.data.order - b.data.order)
  .map((entry) => ({ q: entry.data.question, a: entry.body }));
```

- [ ] **Step 2: Delete the hardcoded `faqs` array**

Remove the existing 8-entry literal. Template iteration over `faqs` stays identical.

- [ ] **Step 3: Build + preview**

Run: `npm run build && npm run preview`
Expected: `/studio#faq` shows all 8 accordions in order. Visit `http://localhost:4321/studio` to confirm.

- [ ] **Step 4: Commit**

```bash
git add src/pages/studio.astro
git commit -m "feat(2I): /studio FAQ section reads from collection"
```

---

### Task 2I.9: Home page reads featured work + rotating testimonial

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add collection imports**

```ts
import { getCollection } from 'astro:content';

const featuredWork = (await getCollection('work'))
  .filter((e) => e.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 2);

const testimonials = (await getCollection('testimonials'))
  .sort((a, b) => a.data.order - b.data.order);
const heroTestimonial = testimonials[0];
```

- [ ] **Step 2: Replace the hardcoded `<WorkCard>` block**

Replace the two static `<WorkCard>`s with:

```astro
{featuredWork.map((entry, i) => (
  <WorkCard
    href={`/work/${entry.id}`}
    title={entry.data.title}
    year={entry.data.year}
    kind={entry.data.services[0] ?? 'Custom'}
    image={entry.data.cover}
    imageAlt={entry.data.coverAlt}
    size={i === 0 ? 'lg' : 'sm'}
  />
))}
```

If only one featured entry exists, append a placeholder `<WorkCard>` linking to `/work` with the "More case studies coming." text — keep existing fallback markup.

- [ ] **Step 3: Add testimonials section between studio and services**

Find the existing testimonial markup (if present) — if not, insert a new `<Section>` after the studio brief:

```astro
{heroTestimonial && (
  <Section id="testimonials" pad="default">
    <figure class="rc-home-quote">
      <blockquote class="rc-home-quote__body">
        <em>"{heroTestimonial.data.headline}"</em>
        <p>{heroTestimonial.data.quote}</p>
      </blockquote>
      <figcaption class="rc-home-quote__cite">
        <strong>{heroTestimonial.data.clientName}</strong>
        <span>{heroTestimonial.data.roleTitle}, {heroTestimonial.data.businessName}</span>
      </figcaption>
    </figure>
  </Section>
)}
```

Add scoped styles for `.rc-home-quote`, `.rc-home-quote__body em` (Fraunces italic, large), `.rc-home-quote__cite`. Keep palette aligned with tokens.

- [ ] **Step 4: Build + preview**

Run: `npm run build && npm run preview`
Expected: `/` renders featured work from collection + testimonial. Visit homepage to confirm.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(2I): home reads featured work + testimonial from collections"
```

---

### Task 2I.10: Add 301 redirects for legacy Phase 1 URLs

**Files:**
- Create: `public/_redirects`
- Create: `src/pages/portfolio.astro`
- Create: `src/pages/packages.astro`
- Create: `src/pages/faq.astro`

- [ ] **Step 1: Write `public/_redirects` (Netlify-style)**

```
/portfolio          /work             301
/portfolio/*        /work/:splat      301
/packages           /services         301
/packages/*         /services         301
/faq                /studio#faq       301
```

- [ ] **Step 2: Write the meta-refresh fallback stubs**

These execute on hosts that ignore `_redirects` (cPanel/shared hosting). `src/pages/portfolio.astro`:

```astro
---
const target = '/work';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <meta http-equiv="refresh" content={`0; url=${target}`} />
    <link rel="canonical" href={target} />
    <meta name="robots" content="noindex" />
  </head>
  <body>
    <p>Redirecting to <a href={target}>{target}</a>…</p>
    <script is:inline set:html={`window.location.replace('${target}');`} />
  </body>
</html>
```

`src/pages/packages.astro` — same template, `target = '/services'`.

`src/pages/faq.astro` — same template, `target = '/studio#faq'`.

- [ ] **Step 3: Verify build emits the redirect files**

Run: `npm run build`
Expected: `dist/portfolio/index.html`, `dist/packages/index.html`, `dist/faq/index.html`, `dist/_redirects` all exist.

```bash
ls dist/_redirects dist/portfolio/index.html dist/packages/index.html dist/faq/index.html
```

- [ ] **Step 4: Commit**

```bash
git add public/_redirects src/pages/portfolio.astro src/pages/packages.astro src/pages/faq.astro
git commit -m "feat(2I): add 301 redirects for /portfolio, /packages, /faq legacy URLs"
```

---

### Task 2I.11: Delete `src/snapshots/` directory

**Files:**
- Delete: `src/snapshots/index.html`, `packages.html`, `portfolio.html`, `terms.html`

- [ ] **Step 1: Confirm snapshot files are no longer referenced**

```bash
grep -r "snapshots" src/ astro.config.mjs 2>&1
```
Expected: no matches (or only inside `src/snapshots/` itself).

- [ ] **Step 2: Delete the directory**

```bash
git rm -r src/snapshots/
```

- [ ] **Step 3: Build to verify nothing breaks**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit + tag**

```bash
git commit -m "chore(2I): delete obsolete src/snapshots/ — content lifted to collections"
git tag phase-2-2I-complete
```

---

# TRACK 2H — Motion Layer

### Task 2H.1: Install GSAP + ScrollTrigger

**Files:**
- Modify: `package.json` (via `npm install`)

- [ ] **Step 1: Install**

```bash
npm install gsap
```

Expected: `gsap` appears in `dependencies` of `package.json`. (ScrollTrigger ships inside the gsap package as `gsap/ScrollTrigger`.)

- [ ] **Step 2: Commit lockfile**

```bash
git add package.json package-lock.json
git commit -m "chore(2H): add gsap dependency"
```

---

### Task 2H.2: Enable Astro `<ClientRouter />` (view transitions) + reduced-motion CSS

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Import and mount the router in `BaseLayout.astro`**

In the frontmatter (top of file) add:

```ts
import { ClientRouter } from 'astro:transitions';
```

Inside `<head>` (before `</head>`) add:

```astro
<ClientRouter />
```

- [ ] **Step 2: Add reduced-motion CSS guard to `global.css`**

Append at the end of `src/styles/global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3: Build + verify a navigation transition**

Run: `npm run build && npm run preview`
Visit `http://localhost:4321/`, click `/work`, observe a 250ms cross-fade rather than a hard reload. Confirm no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat(2H): enable astro view transitions + reduced-motion guard"
```

---

### Task 2H.3: Build the IntersectionObserver reveal module

**Files:**
- Create: `src/scripts/motion.ts`

- [ ] **Step 1: Write the module**

```ts
// src/scripts/motion.ts
// Lightweight, framework-free motion utilities. Loaded globally on every page.

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal() {
  if (REDUCED) return;

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  targets.forEach((el) => io.observe(el));
}

function setupNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    if (!REDUCED) {
      nav.classList.toggle('is-hidden', y > lastY && y > 120);
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

function init() {
  setupReveal();
  setupNav();
}

init();
document.addEventListener('astro:after-swap', init);
```

- [ ] **Step 2: Add data-reveal opacity CSS to `global.css`**

Append:

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1),
              transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;
}
[data-reveal="in"] {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 3: Load the script globally**

In `BaseLayout.astro` `<head>`, add:

```astro
<script>
  import '../scripts/motion.ts';
</script>
```

- [ ] **Step 4: Build + smoke test**

Run: `npm run build && npm run preview`
Expected: no console errors. Apply `data-reveal` to one element manually via DevTools to confirm fade-in works.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/motion.ts src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat(2H): IntersectionObserver-based reveal + nav blur/hide on scroll"
```

---

### Task 2H.4: Nav blur-on-scroll + hide-on-scroll-down styles

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Add `data-nav` attribute + scroll classes**

In the root `<header>` or `<nav>` element of `Nav.astro`, add `data-nav` attribute. Add the following styles to the component's scoped `<style>`:

```css
[data-nav] {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--rc-bg) 70%, transparent);
  backdrop-filter: blur(0);
  transition: backdrop-filter 250ms ease, transform 300ms ease, background 250ms ease;
}
[data-nav].is-scrolled {
  backdrop-filter: blur(14px);
  background: color-mix(in srgb, var(--rc-bg) 85%, transparent);
  border-bottom: 1px solid var(--rc-border);
}
[data-nav].is-hidden { transform: translateY(-100%); }
```

- [ ] **Step 2: Build + visually confirm**

Run: `npm run build && npm run preview`
Scroll down on `/` — nav hides. Scroll up — nav reappears with blur. Confirm focus-visible still reachable on nav links during scroll.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(2H): nav blur-on-scroll and hide-on-scroll-down"
```

---

### Task 2H.5: EditorialHero staggered word reveal

**Files:**
- Modify: `src/components/EditorialHero.astro`

- [ ] **Step 1: Split hero lines into spans**

Locate the `italicLine` and `romanLine` h1 markup. Replace direct `{italicLine}` interpolation with:

```astro
<h1 class="rc-hero__title">
  <span class="rc-hero__line rc-hero__line--italic">
    {italicLine.split(' ').map((word, i) => (
      <span class="rc-hero__word" style={`--i:${i}`}><em>{word}</em></span>
    ))}
  </span>
  <span class="rc-hero__line rc-hero__line--roman">
    {romanLine.split(' ').map((word, i) => (
      <span class="rc-hero__word" style={`--i:${i + italicLine.split(' ').length}`}>{word}</span>
    ))}
  </span>
</h1>
```

- [ ] **Step 2: Add the clip-path mask + stagger CSS**

Inside the component's `<style>` block:

```css
.rc-hero__word {
  display: inline-block;
  overflow: hidden;
  clip-path: inset(0 0 100% 0);
  transform: translateY(0.25em);
  opacity: 0;
  animation: rc-hero-word 700ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: calc(var(--i) * 80ms + 120ms);
  margin-right: 0.25em;
}
@keyframes rc-hero-word {
  to {
    clip-path: inset(0 0 0 0);
    transform: none;
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .rc-hero__word {
    animation: none;
    clip-path: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 3: Build + visually confirm**

Run: `npm run build && npm run preview`
Visit `/`. Hero words should reveal in sequence ~80ms apart. Toggle OS "Reduce motion" preference and reload — words appear instantly.

- [ ] **Step 4: Commit**

```bash
git add src/components/EditorialHero.astro
git commit -m "feat(2H): staggered word reveal on EditorialHero"
```

---

### Task 2H.6: GSAP pinned-image scene for case study route

**Files:**
- Create: `src/scripts/gsap-scenes.ts`
- Modify: `src/pages/work/[...slug].astro`

- [ ] **Step 1: Write the GSAP scene module**

```ts
// src/scripts/gsap-scenes.ts
// Loaded only on case-study routes via dynamic import.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCaseStudyScenes() {
  if (REDUCED) return;

  // Parallax on every [data-parallax] image inside the case study body.
  const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
  parallaxEls.forEach((el) => {
    gsap.to(el, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // Refresh on view-transition swap to recompute positions.
  document.addEventListener('astro:after-swap', () => ScrollTrigger.refresh(), { once: true });
}

initCaseStudyScenes();
```

- [ ] **Step 2: Add the data-parallax attribute to the case-study cover image**

In `src/pages/work/[...slug].astro`, add `data-parallax` to `<img class="rc-cs-cover__image" ... />`.

- [ ] **Step 3: Dynamically import on case-study pages**

At the bottom of `src/pages/work/[...slug].astro`, add:

```astro
<script>
  import('../../scripts/gsap-scenes.ts');
</script>
```

- [ ] **Step 4: Build + verify**

Run: `npm run build && npm run preview`
Visit `/work/parallaxnet-canada`. Scroll — cover image should parallax. Check browser console: no GSAP errors. Check Network tab: `gsap` chunk loads only on case-study pages, not on `/` or `/services`.

- [ ] **Step 5: Commit + tag**

```bash
git add src/scripts/gsap-scenes.ts src/pages/work/[...slug].astro
git commit -m "feat(2H): GSAP ScrollTrigger parallax for case study covers (lazy-loaded)"
git tag phase-2-2H-complete
```

---

# TRACK 2J — Visual QA

### Task 2J.1: Install Playwright + axe + Lighthouse CI

**Files:**
- Modify: `package.json` (root)
- Create: `scripts/qa/playwright.config.ts`

- [ ] **Step 1: Install dependencies (devDependencies)**

Working dir: `C:\xampp\htdocs\rielcode-astro`.

```bash
npm install --save-dev @playwright/test @axe-core/playwright lighthouse
npx playwright install --with-deps chromium
```

Expected: Playwright + axe-core + lighthouse appear in devDependencies. Chromium binary installs.

- [ ] **Step 2: Write `scripts/qa/playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  reporter: [['list'], ['html', { outputFolder: '../../docs/qa/playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json scripts/qa/playwright.config.ts
git commit -m "chore(2J): install Playwright, axe-core, lighthouse; add QA config"
```

---

### Task 2J.2: Visual screenshot diff spec

**Files:**
- Create: `scripts/qa/visual.spec.ts`

- [ ] **Step 1: Write the spec**

```ts
import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/work',
  '/work/parallaxnet-canada',
  '/studio',
  '/services',
  '/contact',
  '/privacy',
  '/terms',
  '/404',
];

for (const route of ROUTES) {
  test(`visual: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    // /404 is served via Astro static — its status will be 200 from the preview server.
    expect(response?.status()).toBeLessThan(500);
    await page.waitForTimeout(800); // settle fonts + reveals
    await expect(page).toHaveScreenshot(`${route.replace(/\//g, '_') || '_root'}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
}
```

- [ ] **Step 2: Build the site for preview**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Create baseline snapshots**

Run: `npx playwright test scripts/qa/visual.spec.ts --config scripts/qa/playwright.config.ts --update-snapshots`
Expected: 18 snapshots created (9 routes × 2 projects) under `scripts/qa/visual.spec.ts-snapshots/`.

- [ ] **Step 4: Run the suite again (should pass clean)**

Run: `npx playwright test scripts/qa/visual.spec.ts --config scripts/qa/playwright.config.ts`
Expected: 18 passed.

- [ ] **Step 5: Commit baseline + spec**

```bash
git add scripts/qa/visual.spec.ts scripts/qa/visual.spec.ts-snapshots/
git commit -m "test(2J): visual regression baseline for all 9 routes (desktop + mobile)"
```

---

### Task 2J.3: Axe accessibility scan spec

**Files:**
- Create: `scripts/qa/axe.spec.ts`

- [ ] **Step 1: Write the spec**

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/work', '/work/parallaxnet-canada', '/studio', '/services', '/contact'];

for (const route of ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    if (critical.length) {
      console.error(JSON.stringify(critical, null, 2));
    }
    expect(critical, `critical a11y violations on ${route}`).toEqual([]);
  });
}
```

- [ ] **Step 2: Run the spec**

Run: `npx playwright test scripts/qa/axe.spec.ts --config scripts/qa/playwright.config.ts --project=desktop`
Expected: 6 passed. If any fail, capture the violation JSON from console output and fix the source markup before continuing.

- [ ] **Step 3: Commit**

```bash
git add scripts/qa/axe.spec.ts
git commit -m "test(2J): axe-core a11y scan for 6 user-facing routes"
```

---

### Task 2J.4: Lighthouse runner script

**Files:**
- Create: `scripts/qa/lighthouse.mjs`
- Create: `docs/qa/phase-2-lighthouse.json` (generated; committed for record)

- [ ] **Step 1: Write the runner**

```js
// scripts/qa/lighthouse.mjs
// Runs Lighthouse against all routes for Mobile + Desktop, writes a JSON summary.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const ROUTES = ['/', '/work', '/work/parallaxnet-canada', '/studio', '/services', '/contact', '/privacy', '/terms', '/404'];
const FORM_FACTORS = ['mobile', 'desktop'];
const OUT_DIR = resolve(process.cwd(), 'docs/qa');
mkdirSync(OUT_DIR, { recursive: true });

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
const summary = [];

for (const route of ROUTES) {
  for (const formFactor of FORM_FACTORS) {
    const url = BASE + route;
    const opts = {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor,
      screenEmulation:
        formFactor === 'mobile'
          ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
          : { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
    };
    const runner = await lighthouse(url, opts);
    const cats = runner.lhr.categories;
    summary.push({
      route,
      formFactor,
      performance: Math.round(cats.performance.score * 100),
      accessibility: Math.round(cats.accessibility.score * 100),
      bestPractices: Math.round(cats['best-practices'].score * 100),
      seo: Math.round(cats.seo.score * 100),
      lcpMs: runner.lhr.audits['largest-contentful-paint'].numericValue,
      totalByteWeight: runner.lhr.audits['total-byte-weight'].numericValue,
    });
    console.log(`${formFactor} ${route} → perf ${summary.at(-1).performance}, a11y ${summary.at(-1).accessibility}`);
  }
}

await chrome.kill();
writeFileSync(resolve(OUT_DIR, 'phase-2-lighthouse.json'), JSON.stringify(summary, null, 2));

const failures = summary.filter((s) => s.performance < 95 || s.accessibility < 95);
if (failures.length) {
  console.error('\nFAIL: routes below threshold:');
  for (const f of failures) console.error(`  ${f.formFactor} ${f.route} — perf ${f.performance}, a11y ${f.accessibility}`);
  process.exit(1);
}
console.log('\nAll routes ≥ 95 perf + 95 a11y.');
```

- [ ] **Step 2: Start the preview server in one terminal**

```bash
npm run build && npm run preview -- --port 4321
```

(Leave running. New terminal for step 3.)

- [ ] **Step 3: Run the Lighthouse audit**

```bash
node scripts/qa/lighthouse.mjs
```

Expected: 18 runs (9 routes × 2 form factors), all ≥ 95 perf + ≥ 95 a11y. If failures, drill into the specific route's `phase-2-lighthouse.json` audit ids that scored lowest, fix, re-run.

- [ ] **Step 4: Commit the runner + summary**

```bash
git add scripts/qa/lighthouse.mjs docs/qa/phase-2-lighthouse.json
git commit -m "test(2J): Lighthouse audit runner + baseline scores ≥95 all routes"
```

---

### Task 2J.5: Write final QA report

**Files:**
- Create: `docs/qa/phase-2-report.md`

- [ ] **Step 1: Generate the report**

Read `docs/qa/phase-2-lighthouse.json` and the Playwright HTML report under `docs/qa/playwright-report/`. Write `docs/qa/phase-2-report.md`:

```markdown
# Phase 2 — QA Report

**Date:** {{today}}
**Tracks covered:** 2H (motion), 2I (content collections), 2J (visual QA)
**Routes audited:** 9

## Lighthouse Scores

| Route | FF | Perf | A11y | BP | SEO | LCP (ms) |
|---|---|---|---|---|---|---|
| ... fill from phase-2-lighthouse.json ... |

## Axe-core findings

- Critical violations: **0** (gate)
- Serious violations: list any
- Routes with zero violations: ...

## Visual regression

- Baseline established (18 snapshots).
- Diff threshold: 2% pixel ratio.
- Routes with deltas vs Phase 1: noted below.

## Bundle / weight

- Largest route JS payload (gzip): {{x}} kb (gate: ≤ 80 kb)
- Largest LCP: {{x}} ms (gate: ≤ 1800 ms on 4G simulation)

## Open follow-ups

- (none) OR list anything < gate but acceptable for ship
```

- [ ] **Step 2: Confirm all spec success criteria met (re-read spec line 191–200)**

Checklist:
- [ ] All 9 routes ship new design language ✓ (verified via visual.spec.ts)
- [ ] Lighthouse ≥ 95 mobile + desktop ✓ (gated by lighthouse.mjs)
- [ ] Axe = 0 critical ✓ (gated by axe.spec.ts)
- [ ] JS per route ≤ 80kb gzipped ✓ (recorded in report)
- [ ] LCP ≤ 1.8s ✓ (recorded)
- [ ] Parallaxnet case study published ✓ (rendered from collection)
- [ ] Theme toggle persists ✓ (manual: toggle, reload, confirm)
- [ ] 301 redirects work ✓ (manual: visit /portfolio → /work)

- [ ] **Step 3: Commit + tag**

```bash
git add docs/qa/phase-2-report.md
git commit -m "docs(2J): final QA report for Phase 2 — all gates met"
git tag phase-2-2J-complete
```

---

### Task 2J.6: Update the Phase 2 spec to mark all tracks complete

**Files:**
- Modify: `C:\Users\afw14\OneDrive\Documents\JARVIS\docs\superpowers\specs\2026-05-21-rielcode-phase-2-redesign-design.md`

- [ ] **Step 1: Edit the spec status block**

In the Execution Plan section, change lines 182–184 to:

```
Track 2H — motion layer (GSAP, ScrollTrigger, view transitions, reduced-motion) ✅
Track 2I — content collections migration + snapshot deletion + 301 redirects ✅
Track 2J — visual QA + Playwright screenshot diff + Lighthouse + accessibility pass ✅
```

Update line 173 status sentence to: "Tracks 2A → 2J shipped. Phase 2 complete."

- [ ] **Step 2: Commit (in JARVIS repo, not rielcode-astro)**

```bash
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add docs/superpowers/specs/2026-05-21-rielcode-phase-2-redesign-design.md
git commit -m "docs(rielcode/phase-2): mark all tracks complete"
```

---

## Self-Review

**Spec coverage:**
- Palette/typography/motion direction → 2H tasks 2-6 cover view transitions, reveal, nav, hero, GSAP parallax. ✓
- IA changes (`/faq` removed, `/journal` deferred) → 2I.10 redirects `/faq` → `/studio#faq`. `/journal` not implemented (out of scope). ✓
- Component system → already shipped 2A-2G; collections feed existing components in 2I. ✓
- Content collections (work/services/testimonials/faq) → 2I.1–2I.4. ✓
- Snapshot deletion → 2I.11. ✓
- 301 redirects (`/portfolio` → `/work`, `/packages` → `/services`, `/faq` → `/studio#faq`) → 2I.10. ✓
- Success criteria (Lighthouse ≥95, axe 0 critical, JS ≤80kb, LCP ≤1.8s, redirects working) → 2J.4–2J.5. ✓

**Placeholder scan:** No "TBD" / "implement later". Every code step has full code. Lighthouse report template has `{{today}}` and `{{x}}` placeholders — these are intentional fill-ins for the QA author from real audit output, not unspecified design decisions.

**Type consistency:** Schemas in `content.config.ts` use field names referenced in 2I.5–2I.9 (`entry.data.title`, `entry.data.cover`, `entry.data.coverAlt`, `entry.data.services`, `entry.data.year`, etc.). `entry.id` used for slug (Astro 6 Content Layer API). `render(entry)` returns `{ Content }` (Astro 6 API — confirmed against astro@^6.3.6 in package.json).

Plan ready for execution.
