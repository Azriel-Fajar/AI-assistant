# Rielcode Phase 2 — Tracks 2D–2G Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all remaining pages (`/work`, `/work/[slug]`, `/studio`, `/services`, `/contact`, `/404`, `/privacy`, `/terms`) from Phase 1 snapshots/legacy styles to the Phase 2 editorial design language (cream + ink + forest, Fraunces + Inter, new component system).

**Architecture:** Astro 6 static site at `C:\xampp\htdocs\rielcode-astro`. Tracks 2A-2C already shipped: tokens.css, global.css, BaseLayout, Nav, Footer, CTABand, ThemeToggle, Button, Section, Card, EditorialHero, WorkCard, ServiceCard, and the `/` home are all on the new design language. Remaining pages either still render raw PHP HTML snapshots (`/portfolio`, `/packages`, `/terms`) or were written in Phase 1 styles (`/contact`, `/faq`, `/404`, `/privacy`). This plan rewrites each page using the existing component set + new page-specific components where needed. No new npm packages. No CMS — content is hardcoded in .astro files for now (Track 2I migrates to Content Collections later).

**Tech Stack:** Astro 6.3, plain CSS + design tokens (no Tailwind utilities in page CSS), Fraunces variable (display), Inter variable (body). Repo root for all file paths: `C:\xampp\htdocs\rielcode-astro`.

**Spec reference:** `docs/superpowers/specs/2026-05-21-rielcode-phase-2-redesign-design.md`

**New components this plan introduces:**
- `src/components/FAQAccordion.astro` — accessible `<details>` accordion with token-driven motion
- `src/components/CaseStudySection.astro` — flexible section variant: prose | image-full | image-grid | stats

**Existing components reused (no changes needed):**
`EditorialHero`, `Section`, `Card`, `CTABand`, `Button`, `WorkCard`, `ServiceCard`, `Nav`, `Footer`, `ThemeToggle`

---

## File Structure

**Track 2D — `/work` + `/work/[slug]`:**
- Create: `src/pages/work/index.astro` — case study index with filter chips
- Create: `src/pages/work/parallaxnet-canada.astro` — first case study, stub content
- Create: `src/components/CaseStudySection.astro` — reusable case-study section block
- Delete: `src/pages/portfolio.astro` (replaced by `/work/index.astro`)

**Track 2E — `/studio`:**
- Create: `src/pages/studio.astro` — about page: hero, process, values, FAQ
- Create: `src/components/FAQAccordion.astro` — accessible accordion
- Delete: `src/pages/faq.astro` (content folded into studio)

**Track 2F — `/services`:**
- Rewrite: `src/pages/packages.astro` → rename to `src/pages/services.astro` — pricing, packages, add-ons, FAQ snippet
- Delete: `src/pages/packages.astro`

**Track 2G — `/contact` + utility pages:**
- Rewrite: `src/pages/contact.astro` — 2-col form + aside on Phase 2 tokens
- Rewrite: `src/pages/404.astro` — editorial not-found
- Rewrite: `src/pages/privacy.astro` — prose content page on new tokens
- Rewrite: `src/pages/terms.astro` — prose content page, migrate from snapshot

---

# Track 2D — `/work` index + `/work/[slug]` case study template

### Task 1: Create `CaseStudySection.astro`

**Files:**
- Create: `src/components/CaseStudySection.astro`

- [ ] **Step 1: Write the component**

```astro
---
export interface Props {
  variant?: 'prose' | 'image-full' | 'image-grid' | 'stats';
  bg?: 'default' | 'elev';
}
const { variant = 'prose', bg = 'default' } = Astro.props;
const cls = ['rc-cs-section', `rc-cs-section--${variant}`, `rc-cs-section--bg-${bg}`].join(' ');
---

<div class={cls}>
  <slot />
</div>

<style>
  .rc-cs-section { padding-block: var(--space-16); }
  .rc-cs-section--bg-elev { background: var(--rc-bg-elev); }

  /* prose variant */
  .rc-cs-section--prose { max-width: 72ch; margin-inline: auto; }
  .rc-cs-section--prose :global(h2) {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h1);
    font-style: italic;
    margin: 0 0 var(--space-6) 0;
  }
  .rc-cs-section--prose :global(p) {
    color: var(--rc-text-muted);
    font-size: var(--fs-body-lg);
    line-height: var(--lh-body-lg);
    margin: 0 0 var(--space-4) 0;
  }

  /* image-full variant */
  .rc-cs-section--image-full :global(img) {
    width: 100%;
    border-radius: var(--radius-lg);
    display: block;
  }

  /* image-grid variant */
  .rc-cs-section--image-grid :global(.cs-grid) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
  .rc-cs-section--image-grid :global(img) {
    width: 100%; border-radius: var(--radius-md); display: block;
  }

  /* stats variant */
  .rc-cs-section--stats :global(.cs-stats) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
  .rc-cs-section--stats :global(.cs-stat-value) {
    font-family: var(--rc-font-display);
    font-size: var(--fs-display-lg);
    font-style: italic;
    line-height: 1;
    color: var(--rc-accent);
  }
  .rc-cs-section--stats :global(.cs-stat-label) {
    font-size: var(--fs-body-sm);
    color: var(--rc-text-muted);
    margin-top: var(--space-2);
  }

  @media (max-width: 899px) {
    .rc-cs-section--image-grid :global(.cs-grid),
    .rc-cs-section--stats :global(.cs-stats) { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd C:/xampp/htdocs/rielcode-astro
git add src/components/CaseStudySection.astro
git commit -m "feat(phase-2/2D): add CaseStudySection component with prose/image/stats variants"
```

---

### Task 2: Create `/work/index.astro` — case study index

**Files:**
- Create: `src/pages/work/index.astro`

- [ ] **Step 1: Create `src/pages/work/` directory and `index.astro`**

```bash
mkdir C:/xampp/htdocs/rielcode-astro/src/pages/work
```

- [ ] **Step 2: Write the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import WorkCard from '../../components/WorkCard.astro';
import CTABand from '../../components/CTABand.astro';
---

<BaseLayout
  title="Work · Rielcode"
  description="Case studies from Rielcode — editorial websites, landing pages, and e-commerce built end-to-end."
>
  <section class="rc-work-hero">
    <div class="rc-container rc-work-hero__inner">
      <span class="rc-label">Selected work</span>
      <h1 class="rc-work-hero__title">
        <em>Built</em> with intention.
      </h1>
    </div>
  </section>

  <section class="rc-work-grid-section">
    <div class="rc-container">
      <div class="rc-work-grid">
        <WorkCard
          href="/work/parallaxnet-canada"
          title="Parallaxnet Canada"
          year="2026"
          kind="Custom website"
          image="/IMG/og-default.png"
          imageAlt="Parallaxnet Canada — education network website"
          size="lg"
        />
        <div class="rc-work-placeholder">
          <span class="rc-label">More case studies</span>
          <p>Currently in production. Check back soon.</p>
        </div>
      </div>
    </div>
  </section>

  <CTABand
    eyebrow="Booking Q3 2026"
    heading="Have a project in mind? Let's make it well."
    ctaText="Start a project"
    ctaHref="/contact"
  />
</BaseLayout>

<style>
  .rc-work-hero {
    padding-block: var(--space-24) var(--space-16);
    background: var(--rc-bg);
  }
  .rc-work-hero__inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  .rc-work-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(48px, 9vw, 112px);
    line-height: 1.02;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-work-hero__title em { font-style: italic; }

  .rc-work-grid-section {
    padding-block: var(--space-16) var(--section-py-desktop);
  }
  .rc-work-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-12);
    align-items: start;
  }
  .rc-work-placeholder {
    margin-top: var(--space-16);
    padding: var(--space-12) var(--space-8);
    background: var(--rc-bg-elev);
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  .rc-work-placeholder p {
    margin: 0;
    color: var(--rc-text-muted);
    font-size: var(--fs-body-md);
  }

  @media (max-width: 899px) {
    .rc-work-grid { grid-template-columns: 1fr; }
    .rc-work-placeholder { margin-top: 0; }
  }
</style>
```

- [ ] **Step 3: Build verify**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build
```
Expected: exits 0. `/work/index.html` present in `dist/work/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat(phase-2/2D): add /work case study index page"
```

---

### Task 3: Create `/work/parallaxnet-canada.astro` — first case study

**Files:**
- Create: `src/pages/work/parallaxnet-canada.astro`

- [ ] **Step 1: Write the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import CaseStudySection from '../../components/CaseStudySection.astro';
import CTABand from '../../components/CTABand.astro';
---

<BaseLayout
  title="Parallaxnet Canada · Rielcode"
  description="Case study: editorial website for Parallaxnet Canada, the independent Canadian entity of the Parallaxnet education network."
>
  <!-- Cover -->
  <header class="rc-cs-cover">
    <div class="rc-container rc-cs-cover__inner">
      <div class="rc-cs-cover__meta rc-label">
        <span>2026</span>
        <span>·</span>
        <span>Custom website</span>
        <span>·</span>
        <span>Parallaxnet Canada</span>
        <span>·</span>
        <span>4 weeks</span>
      </div>
      <h1 class="rc-cs-cover__title">
        <em>Parallaxnet</em><br />Canada
      </h1>
    </div>
    <div class="rc-cs-cover__image-wrap">
      <img
        src="/IMG/og-default.png"
        alt="Parallaxnet Canada website — desktop view"
        class="rc-cs-cover__image"
      />
    </div>
  </header>

  <div class="rc-container">

    <!-- Overview -->
    <CaseStudySection variant="prose">
      <h2>Overview</h2>
      <p>Parallaxnet Canada is the independent Canadian entity of the Parallaxnet education network (HQ: USA). The brief called for an editorial website that positions the brand as a credible, internationally-connected education provider serving the Canadian market.</p>
      <p>Designed and developed end-to-end by Rielcode. Delivered May 2026.</p>
    </CaseStudySection>

    <!-- Full image -->
    <CaseStudySection variant="image-full">
      <img src="/IMG/og-default.png" alt="Parallaxnet Canada — homepage design" />
    </CaseStudySection>

    <!-- Solution -->
    <CaseStudySection variant="prose">
      <h2>Approach</h2>
      <p>The site was built as a static Astro project — no CMS overhead, instant page loads. Typography-first layout: Fraunces as display, Inter as body. Emphasis on hierarchy and whitespace over decoration.</p>
      <p>Key decisions: minimal navigation, strong hero with a single CTA, structured programme listing, and a clear inquiry path. Content strategy was scoped and iterated with the client over WhatsApp before a line of code was written.</p>
    </CaseStudySection>

    <!-- Image grid -->
    <CaseStudySection variant="image-grid">
      <div class="cs-grid">
        <img src="/IMG/og-default.png" alt="Parallaxnet Canada — programmes section" />
        <img src="/IMG/og-default.png" alt="Parallaxnet Canada — contact section" />
      </div>
    </CaseStudySection>

    <!-- Outcomes -->
    <CaseStudySection variant="stats" bg="elev">
      <div class="cs-stats">
        <div>
          <div class="cs-stat-value">4</div>
          <div class="cs-stat-label">weeks brief to launch</div>
        </div>
        <div>
          <div class="cs-stat-value">100</div>
          <div class="cs-stat-label">Lighthouse performance (mobile)</div>
        </div>
        <div>
          <div class="cs-stat-value">1</div>
          <div class="cs-stat-label">revision round total</div>
        </div>
      </div>
    </CaseStudySection>

    <!-- Next project -->
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
  .rc-cs-cover {
    padding-block: var(--space-24) 0;
    background: var(--rc-bg);
  }
  .rc-cs-cover__inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding-bottom: var(--space-12);
  }
  .rc-cs-cover__meta {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    color: var(--rc-text-muted);
  }
  .rc-cs-cover__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(56px, 10vw, 140px);
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-cs-cover__title em { font-style: italic; }
  .rc-cs-cover__image-wrap {
    width: 100%;
    max-height: 600px;
    overflow: hidden;
  }
  .rc-cs-cover__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rc-cs-next {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding-block: var(--space-24);
    border-top: 1px solid var(--rc-border);
    margin-top: var(--space-16);
  }
  .rc-cs-next__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-4);
    font-family: var(--rc-font-display);
    font-size: clamp(32px, 5vw, 64px);
    font-style: italic;
    color: var(--rc-text);
    text-decoration: none;
    transition: gap var(--transition-base), color var(--transition-fast);
  }
  .rc-cs-next__link:hover { gap: var(--space-6); color: var(--rc-accent); }
</style>
```

- [ ] **Step 2: Build verify**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build
```
Expected: exits 0. `dist/work/parallaxnet-canada/index.html` present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work/parallaxnet-canada.astro
git commit -m "feat(phase-2/2D): add Parallaxnet Canada case study page (stub content)"
```

---

### Task 4: Delete legacy `portfolio.astro` + build verify + tag

**Files:**
- Delete: `src/pages/portfolio.astro`

- [ ] **Step 1: Delete the file**

```bash
cd C:/xampp/htdocs/rielcode-astro
rm src/pages/portfolio.astro
```

Note: The spec calls for a 301 redirect from `/portfolio` → `/work`. That redirect lives in Track 2I (Content Collections + redirects). For now the route simply disappears; it's an internal static site, not indexed yet.

- [ ] **Step 2: Build verify**

```bash
npm run build
```
Expected: exits 0. No reference to `portfolio.astro` in build output errors.

- [ ] **Step 3: Tag Track 2D complete**

```bash
git add -A
git commit -m "feat(phase-2/2D): remove legacy portfolio.astro (replaced by /work)"
git tag phase-2-2D-complete
```

---

# Track 2E — `/studio`

### Task 5: Create `FAQAccordion.astro`

**Files:**
- Create: `src/components/FAQAccordion.astro`

- [ ] **Step 1: Write the component**

```astro
---
export interface FAQItem {
  q: string;
  a: string;
}
export interface Props {
  items: FAQItem[];
}
const { items } = Astro.props;
---

<div class="rc-faq">
  {items.map(({ q, a }) => (
    <details class="rc-faq__item">
      <summary class="rc-faq__q">
        <span>{q}</span>
        <span class="rc-faq__icon" aria-hidden="true">+</span>
      </summary>
      <div class="rc-faq__a">
        <p>{a}</p>
      </div>
    </details>
  ))}
</div>

<style>
  .rc-faq {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--rc-border);
  }
  .rc-faq__item {
    border-bottom: 1px solid var(--rc-border);
  }
  .rc-faq__item[open] .rc-faq__icon { transform: rotate(45deg); }
  .rc-faq__q {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-6);
    padding-block: var(--space-6);
    cursor: pointer;
    list-style: none;
    font-family: var(--rc-font-body);
    font-size: var(--fs-body-lg);
    font-weight: 500;
    color: var(--rc-text);
    user-select: none;
  }
  .rc-faq__q::-webkit-details-marker { display: none; }
  .rc-faq__icon {
    flex-shrink: 0;
    width: 28px; height: 28px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-pill);
    font-size: var(--fs-h3);
    font-weight: 300;
    transition: transform var(--transition-base), border-color var(--transition-base);
    color: var(--rc-text-muted);
  }
  .rc-faq__a {
    padding-bottom: var(--space-6);
  }
  .rc-faq__a p {
    margin: 0;
    color: var(--rc-text-muted);
    font-size: var(--fs-body-md);
    line-height: var(--lh-body-lg);
    max-width: 72ch;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd C:/xampp/htdocs/rielcode-astro
git add src/components/FAQAccordion.astro
git commit -m "feat(phase-2/2E): add FAQAccordion accessible details component"
```

---

### Task 6: Create `src/pages/studio.astro`

**Files:**
- Create: `src/pages/studio.astro`

- [ ] **Step 1: Write the file**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';
import CTABand from '../components/CTABand.astro';
import FAQAccordion from '../components/FAQAccordion.astro';

const process = [
  { num: '01', title: 'Brief', body: 'We start with a focused brief: goals, audience, references, constraints. No guesswork. A clear brief makes everything downstream faster and better.' },
  { num: '02', title: 'Design', body: 'Typography-first layout in Figma or direct-to-code depending on complexity. You review every key screen before development starts.' },
  { num: '03', title: 'Build', body: 'Static Astro builds for marketing sites. Custom stacks for more complex projects. Pixel-precise implementation — no template drift.' },
  { num: '04', title: 'Ship', body: 'Deployed to your preferred host. Includes a handoff doc with admin access, DNS notes, and 14 days of bug-fix coverage.' },
];

const values = [
  { title: 'Composition over decoration', body: 'Premium feels earned, not loud. Whitespace, type hierarchy, and rhythm do more than gradients and glow.' },
  { title: 'Clarity of intent', body: 'Every page has one job. We scope it, design for it, and don\'t bury it under options.' },
  { title: 'Speed of trust', body: 'Short feedback loops, WhatsApp-first communication, honest timelines. No surprise delays.' },
];

const faqs = [
  { q: 'How much does a Rielcode website cost?', a: 'Landing pages start at IDR 4,000,000 / $260. Custom multi-page sites run IDR 8–12M / $520–780. E-commerce from IDR 15M+ / $980+. All quotes are fixed-price — no hourly billing surprises.' },
  { q: 'How long does a project take?', a: 'Landing pages: 1–2 weeks. Custom sites: 3–4 weeks. E-commerce: 4–6 weeks. Timeline depends on how quickly you provide content, feedback, and approvals.' },
  { q: 'How many revisions are included?', a: 'Two rounds of design revisions per page. Additional rounds are billed at a flat rate agreed up front.' },
  { q: 'Can I pay in IDR or USD?', a: 'Yes. Local clients pay in IDR via bank transfer. International clients pay in USD via international bank transfer or supported online payment methods.' },
  { q: 'Do you provide hosting and domain?', a: 'Rielcode can set up hosting and domain on your behalf, billed at cost plus a small setup fee. You can also bring your own hosting.' },
  { q: 'What happens after the site launches?', a: 'Every project includes 14 days of post-launch bug fixes. Ongoing support is available as a monthly retainer or pay-per-task.' },
  { q: 'Do you work with international clients?', a: 'Yes — most of the pipeline is international. Communication is async via WhatsApp and email, project docs in English.' },
  { q: 'What is your availability?', a: 'Currently taking limited projects. Use the contact form to check Q3 availability. First-come, first-served for project slots.' },
];
---

<BaseLayout
  title="Studio · Rielcode"
  description="A solo studio in Salatiga building editorial websites for the world. About Rielcode, process, values, and FAQ."
>
  <!-- Hero -->
  <section class="rc-studio-hero">
    <div class="rc-container rc-studio-hero__inner">
      <span class="rc-label">N°01 — The studio</span>
      <h1 class="rc-studio-hero__title">
        <em>A solo studio</em> in Salatiga,<br />building for the world.
      </h1>
      <p class="rc-studio-hero__body">
        Rielcode is run by Azriel — a developer and informatics engineering student who treats each website as an editorial product, not a template fill.
      </p>
    </div>
  </section>

  <!-- Process -->
  <Section id="process" bg="elev" pad="default">
    <div class="rc-studio-sec-head">
      <span class="rc-label">How it works</span>
      <h2>Four steps, every project.</h2>
    </div>
    <ol class="rc-process">
      {process.map(({ num, title, body }) => (
        <li class="rc-process__item">
          <span class="rc-process__num rc-label">{num}</span>
          <h3 class="rc-process__title">{title}</h3>
          <p class="rc-process__body">{body}</p>
        </li>
      ))}
    </ol>
  </Section>

  <!-- Values -->
  <Section id="values" pad="default">
    <div class="rc-studio-sec-head">
      <span class="rc-label">What we believe</span>
      <h2>Three things that guide every build.</h2>
    </div>
    <ul class="rc-values">
      {values.map(({ title, body }) => (
        <li class="rc-values__item">
          <h3 class="rc-values__title">{title}</h3>
          <p class="rc-values__body">{body}</p>
        </li>
      ))}
    </ul>
  </Section>

  <!-- FAQ -->
  <Section id="faq" bg="elev" pad="default">
    <div class="rc-studio-sec-head">
      <span class="rc-label">Questions</span>
      <h2>Answers upfront.</h2>
    </div>
    <FAQAccordion items={faqs} />
  </Section>

  <CTABand
    eyebrow="Booking Q3 2026"
    heading="Ready to start a project?"
    ctaText="Get in touch"
    ctaHref="/contact"
  />
</BaseLayout>

<style>
  .rc-studio-hero {
    padding-block: var(--space-24) var(--space-16);
    background: var(--rc-bg);
  }
  .rc-studio-hero__inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  .rc-studio-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(40px, 7vw, 100px);
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-studio-hero__title em { font-style: italic; }
  .rc-studio-hero__body {
    font-size: var(--fs-body-lg);
    line-height: var(--lh-body-lg);
    color: var(--rc-text-muted);
    max-width: 56ch;
    margin: 0;
  }

  .rc-studio-sec-head {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-12);
  }
  .rc-studio-sec-head h2 {
    font-family: var(--rc-font-display);
    font-size: clamp(32px, 4vw, 56px);
    font-style: italic;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .rc-process {
    list-style: none;
    padding: 0; margin: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-8);
  }
  .rc-process__item { display: flex; flex-direction: column; gap: var(--space-3); }
  .rc-process__num { color: var(--rc-text-muted); }
  .rc-process__title {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h2);
    font-style: italic;
    margin: 0;
  }
  .rc-process__body { margin: 0; color: var(--rc-text-muted); font-size: var(--fs-body-md); line-height: var(--lh-body-md); }

  .rc-values {
    list-style: none;
    padding: 0; margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
  .rc-values__item { display: flex; flex-direction: column; gap: var(--space-3); }
  .rc-values__title {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h3);
    font-style: italic;
    margin: 0;
  }
  .rc-values__body { margin: 0; color: var(--rc-text-muted); font-size: var(--fs-body-md); line-height: var(--lh-body-md); }

  @media (max-width: 899px) {
    .rc-process { grid-template-columns: 1fr 1fr; }
    .rc-values { grid-template-columns: 1fr; }
  }
  @media (max-width: 599px) {
    .rc-process { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Build verify**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build
```
Expected: exits 0. `dist/studio/index.html` present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/studio.astro
git commit -m "feat(phase-2/2E): add /studio page with process, values, FAQ accordion"
```

---

### Task 7: Delete legacy `faq.astro` + tag 2E

**Files:**
- Delete: `src/pages/faq.astro`

- [ ] **Step 1: Delete the file**

```bash
cd C:/xampp/htdocs/rielcode-astro
rm src/pages/faq.astro
```

Note: 301 redirect `/faq` → `/studio#faq` is in Track 2I.

- [ ] **Step 2: Build verify**

```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 3: Tag Track 2E complete**

```bash
git add -A
git commit -m "feat(phase-2/2E): remove legacy faq.astro (content folded into /studio)"
git tag phase-2-2E-complete
```

---

# Track 2F — `/services`

### Task 8: Create `src/pages/services.astro`

**Files:**
- Create: `src/pages/services.astro`
- Delete: `src/pages/packages.astro`

- [ ] **Step 1: Write `src/pages/services.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';
import CTABand from '../components/CTABand.astro';
import FAQAccordion from '../components/FAQAccordion.astro';

const packages = [
  {
    id: 'landing',
    title: 'Landing',
    priceIdr: 'IDR 4,000,000',
    priceUsd: '$260',
    timeline: '1–2 weeks',
    deliverables: [
      'Single high-conversion page',
      'Mobile-first design',
      'Copy consultation',
      'Contact form or CTA integration',
      '2 rounds of revisions',
      '14-day post-launch support',
    ],
  },
  {
    id: 'custom',
    title: 'Custom',
    priceIdr: 'IDR 8–12M',
    priceUsd: '$520–780',
    timeline: '3–4 weeks',
    deliverables: [
      'Up to 6 pages',
      'Bespoke design end-to-end',
      'Static site (Astro) or custom CMS',
      'SEO foundations',
      '2 rounds of revisions per page',
      '14-day post-launch support',
    ],
  },
  {
    id: 'ecom',
    title: 'E-commerce',
    priceIdr: 'IDR 15M+',
    priceUsd: '$980+',
    timeline: '4–6 weeks',
    deliverables: [
      'Product catalogue (up to 30 SKUs)',
      'Payment gateway integration',
      'Inventory management basics',
      'Order confirmation emails',
      '2 rounds of revisions',
      '14-day post-launch support',
    ],
  },
];

const addons = [
  { item: 'Extra revision round', price: 'IDR 300K / $20 per page' },
  { item: 'Blog / journal setup', price: 'IDR 1.5M / $100' },
  { item: 'Multilingual (id/en)', price: 'IDR 2M / $130 per language' },
  { item: 'Speed & Lighthouse audit', price: 'IDR 500K / $35' },
  { item: 'Domain + hosting setup', price: 'At cost + IDR 200K setup fee' },
  { item: 'Ongoing monthly retainer', price: 'From IDR 1M / $65 per month' },
];

const faqs = [
  { q: 'Are these prices fixed?', a: 'Yes. All packages are fixed-price. Scope is agreed before work begins. No hourly billing or surprise invoices.' },
  { q: 'Can I pay in USD?', a: 'Yes. International clients are billed in USD at equivalent rates. Payment via international bank transfer.' },
  { q: 'What if I need something not listed?', a: 'Contact me with your brief and I\'ll scope a custom quote within one business day.' },
];
---

<BaseLayout
  title="Services · Rielcode"
  description="Rielcode service packages: landing pages, custom multi-page sites, and simple e-commerce. Fixed prices in IDR and USD."
>
  <!-- Hero -->
  <section class="rc-svc-hero">
    <div class="rc-container rc-svc-hero__inner">
      <span class="rc-label">Services &amp; pricing</span>
      <h1 class="rc-svc-hero__title">
        Three ways to<br /><em>work together.</em>
      </h1>
      <p class="rc-svc-hero__body">
        Fixed scope, fixed price. Every package delivers a production-ready website with full design and development, end-to-end.
      </p>
    </div>
  </section>

  <!-- Packages -->
  <Section id="packages" pad="default">
    <div class="rc-svc-grid">
      {packages.map(({ id, title, priceIdr, priceUsd, timeline, deliverables }) => (
        <div class="rc-pkg-card" id={id}>
          <div class="rc-pkg-card__head">
            <h2 class="rc-pkg-card__title">{title}</h2>
            <div class="rc-pkg-card__price">
              <strong class="rc-pkg-card__price-main">{priceIdr}</strong>
              <span class="rc-pkg-card__price-alt">/ {priceUsd}</span>
            </div>
            <span class="rc-label">{timeline}</span>
          </div>
          <ul class="rc-pkg-card__list">
            {deliverables.map(d => (
              <li class="rc-pkg-card__item">
                <span aria-hidden="true" class="rc-pkg-card__check">✓</span>
                {d}
              </li>
            ))}
          </ul>
          <a class="rc-btn rc-btn--fill rc-btn--md" href="/contact">Start a project</a>
        </div>
      ))}
    </div>
  </Section>

  <!-- Add-ons -->
  <Section id="addons" bg="elev" pad="default">
    <div class="rc-svc-sec-head">
      <span class="rc-label">Add-ons</span>
      <h2>Extend any package.</h2>
    </div>
    <table class="rc-addons-table">
      <thead>
        <tr>
          <th>Add-on</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {addons.map(({ item, price }) => (
          <tr>
            <td>{item}</td>
            <td class="rc-addons-table__price">{price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Section>

  <!-- FAQ snippet -->
  <Section id="faq" pad="default">
    <div class="rc-svc-sec-head">
      <span class="rc-label">Common questions</span>
      <h2>Quick answers.</h2>
    </div>
    <FAQAccordion items={faqs} />
    <a href="/studio#faq" class="rc-btn rc-btn--underline rc-btn--md" style="margin-top:var(--space-8);display:inline-flex">All FAQs on the Studio page →</a>
  </Section>

  <CTABand
    eyebrow="Booking Q3 2026"
    heading="Have a project in mind?"
    ctaText="Start a project"
    ctaHref="/contact"
  />
</BaseLayout>

<style>
  .rc-svc-hero {
    padding-block: var(--space-24) var(--space-16);
    background: var(--rc-bg);
  }
  .rc-svc-hero__inner { display: flex; flex-direction: column; gap: var(--space-6); }
  .rc-svc-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(40px, 7vw, 100px);
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-svc-hero__title em { font-style: italic; }
  .rc-svc-hero__body {
    font-size: var(--fs-body-lg);
    color: var(--rc-text-muted);
    max-width: 52ch;
    margin: 0;
    line-height: var(--lh-body-lg);
  }

  .rc-svc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    align-items: start;
  }

  .rc-pkg-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-8);
    background: var(--rc-bg-elev);
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-md);
  }
  .rc-pkg-card__head { display: flex; flex-direction: column; gap: var(--space-3); }
  .rc-pkg-card__title {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h2);
    font-style: italic;
    margin: 0;
  }
  .rc-pkg-card__price { display: flex; align-items: baseline; gap: var(--space-2); }
  .rc-pkg-card__price-main { font-size: var(--fs-h3); font-weight: 600; }
  .rc-pkg-card__price-alt { color: var(--rc-text-muted); font-size: var(--fs-body-sm); }
  .rc-pkg-card__list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: var(--space-3);
    flex: 1;
  }
  .rc-pkg-card__item {
    display: flex; gap: var(--space-3);
    font-size: var(--fs-body-md);
    color: var(--rc-text-muted);
    align-items: flex-start;
  }
  .rc-pkg-card__check { color: var(--rc-accent); flex-shrink: 0; margin-top: 2px; }

  .rc-svc-sec-head {
    display: flex; flex-direction: column; gap: var(--space-3);
    margin-bottom: var(--space-12);
  }
  .rc-svc-sec-head h2 {
    font-family: var(--rc-font-display);
    font-size: clamp(32px, 4vw, 56px);
    font-style: italic;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .rc-addons-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fs-body-md);
  }
  .rc-addons-table thead th {
    text-align: left;
    font-size: var(--fs-label);
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--rc-text-muted);
    font-weight: 500;
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--rc-border);
  }
  .rc-addons-table tbody td {
    padding-block: var(--space-4);
    border-bottom: 1px solid var(--rc-border);
    color: var(--rc-text);
  }
  .rc-addons-table__price { color: var(--rc-text-muted); }

  @media (max-width: 899px) {
    .rc-svc-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Delete `packages.astro`**

```bash
cd C:/xampp/htdocs/rielcode-astro
rm src/pages/packages.astro
```

Note: 301 redirect `/packages` → `/services` is in Track 2I.

- [ ] **Step 3: Build verify**

```bash
npm run build
```
Expected: exits 0. `dist/services/index.html` present.

- [ ] **Step 4: Tag Track 2F complete**

```bash
git add -A
git commit -m "feat(phase-2/2F): add /services page, remove legacy packages.astro"
git tag phase-2-2F-complete
```

---

# Track 2G — `/contact` + utility pages

### Task 9: Rewrite `src/pages/contact.astro`

**Files:**
- Rewrite: `src/pages/contact.astro`

- [ ] **Step 1: Read current contact.astro to note any data worth keeping**

The existing contact.astro already uses BaseLayout + Section. It has a form that posts to `/contact-submit.php` and a WhatsApp link placeholder. We keep both, reskinning entirely to Phase 2 tokens.

- [ ] **Step 2: Replace the file**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';
---

<BaseLayout
  title="Contact · Rielcode"
  description="Get in touch with Rielcode to start a website project or ask a question."
>
  <section class="rc-contact-hero">
    <div class="rc-container rc-contact-hero__inner">
      <span class="rc-label">Let's talk</span>
      <h1 class="rc-contact-hero__title">
        Start a project.<br /><em>We'll make it well.</em>
      </h1>
    </div>
  </section>

  <Section pad="tight">
    <div class="rc-contact-grid">
      <!-- Form -->
      <form
        class="rc-form"
        method="post"
        action="/contact-submit.php"
      >
        <!-- Honeypot -->
        <input
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
          style="position:absolute;left:-10000px;width:1px;height:1px;opacity:0"
          aria-hidden="true"
        />

        <div class="rc-field">
          <label for="name" class="rc-label">Your name</label>
          <input id="name" name="name" type="text" required autocomplete="name" class="rc-input" />
        </div>

        <div class="rc-field">
          <label for="email" class="rc-label">Email address</label>
          <input id="email" name="email" type="email" required autocomplete="email" class="rc-input" />
        </div>

        <div class="rc-field">
          <label for="project_type" class="rc-label">Project type</label>
          <select id="project_type" name="project_type" class="rc-input rc-select">
            <option value="">Select one</option>
            <option value="landing">Landing page</option>
            <option value="custom">Custom website</option>
            <option value="ecom">E-commerce</option>
            <option value="other">Other / not sure yet</option>
          </select>
        </div>

        <div class="rc-field">
          <label for="message" class="rc-label">Message</label>
          <textarea id="message" name="message" rows="6" required class="rc-input"></textarea>
        </div>

        <button type="submit" class="rc-btn rc-btn--fill rc-btn--lg">
          Send message
        </button>

        <p class="rc-form__legal">
          By submitting you agree to our <a href="/privacy">privacy policy</a>.
        </p>
      </form>

      <!-- Aside -->
      <aside class="rc-contact-aside">
        <div class="rc-contact-aside__block">
          <span class="rc-label">Email</span>
          <a href="mailto:hello@rielcode.com" class="rc-contact-aside__link">hello@rielcode.com</a>
        </div>
        <div class="rc-contact-aside__block">
          <span class="rc-label">WhatsApp</span>
          <a href="https://wa.me/6285156965519" target="_blank" rel="noopener" class="rc-contact-aside__link">Message on WhatsApp →</a>
        </div>
        <div class="rc-contact-aside__block">
          <span class="rc-label">Response time</span>
          <p class="rc-contact-aside__detail">Within 24 hours (UTC+7). Usually faster.</p>
        </div>
        <div class="rc-contact-aside__block">
          <span class="rc-label">Availability</span>
          <p class="rc-contact-aside__detail">Taking projects for Q3 2026. Slots are limited.</p>
        </div>
      </aside>
    </div>
  </Section>
</BaseLayout>

<style>
  .rc-contact-hero {
    padding-block: var(--space-24) var(--space-16);
    background: var(--rc-bg);
  }
  .rc-contact-hero__inner { display: flex; flex-direction: column; gap: var(--space-4); }
  .rc-contact-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(40px, 7vw, 96px);
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-contact-hero__title em { font-style: italic; }

  .rc-contact-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-16);
    align-items: start;
    padding-bottom: var(--space-24);
  }

  .rc-form { display: flex; flex-direction: column; gap: var(--space-6); }
  .rc-field { display: flex; flex-direction: column; gap: var(--space-2); }

  .rc-input {
    width: 100%;
    padding: 14px 16px;
    background: var(--rc-bg-elev);
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-sm);
    color: var(--rc-text);
    font-family: var(--rc-font-body);
    font-size: var(--fs-body-md);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  .rc-input:focus {
    outline: none;
    border-color: var(--rc-accent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--rc-accent) 20%, transparent);
  }
  .rc-select { appearance: none; cursor: pointer; }
  textarea.rc-input { resize: vertical; min-height: 160px; }

  .rc-form__legal {
    font-size: var(--fs-body-sm);
    color: var(--rc-text-faint);
    margin: 0;
  }
  .rc-form__legal a { color: var(--rc-text-muted); }

  .rc-contact-aside {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    padding: var(--space-8);
    background: var(--rc-bg-elev);
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-md);
    position: sticky;
    top: calc(72px + var(--space-6));
  }
  .rc-contact-aside__block { display: flex; flex-direction: column; gap: var(--space-2); }
  .rc-contact-aside__link {
    font-size: var(--fs-body-md);
    font-weight: 500;
    color: var(--rc-text);
  }
  .rc-contact-aside__detail {
    font-size: var(--fs-body-md);
    color: var(--rc-text-muted);
    margin: 0;
  }

  @media (max-width: 899px) {
    .rc-contact-grid { grid-template-columns: 1fr; gap: var(--space-12); }
    .rc-contact-aside { position: static; }
  }
</style>
```

- [ ] **Step 3: Build verify**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build
```
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat(phase-2/2G): rewrite /contact with Phase 2 editorial design"
```

---

### Task 10: Rewrite `src/pages/404.astro`

**Files:**
- Rewrite: `src/pages/404.astro`

- [ ] **Step 1: Replace the file**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="404 — Not found · Rielcode"
  description="The page you're looking for doesn't exist."
>
  <section class="rc-404">
    <div class="rc-container rc-404__inner">
      <span class="rc-label">Error 404</span>
      <h1 class="rc-404__title">
        <em>This page</em><br />drifted off.
      </h1>
      <p class="rc-404__body">
        The URL doesn't exist or has moved. Head somewhere useful.
      </p>
      <div class="rc-404__links">
        <a href="/" class="rc-btn rc-btn--fill rc-btn--lg">Back to home</a>
        <a href="/work" class="rc-btn rc-btn--outline rc-btn--lg">See the work</a>
        <a href="/contact" class="rc-btn rc-btn--underline rc-btn--md">Contact</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .rc-404 {
    min-height: calc(100vh - 72px - 200px);
    display: flex;
    align-items: center;
    background: var(--rc-bg);
  }
  .rc-404__inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding-block: var(--space-24);
  }
  .rc-404__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(56px, 10vw, 140px);
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-404__title em { font-style: italic; }
  .rc-404__body {
    font-size: var(--fs-body-lg);
    color: var(--rc-text-muted);
    max-width: 48ch;
    margin: 0;
    line-height: var(--lh-body-lg);
  }
  .rc-404__links {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    align-items: center;
    margin-top: var(--space-4);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd C:/xampp/htdocs/rielcode-astro
git add src/pages/404.astro
git commit -m "feat(phase-2/2G): rewrite /404 with Phase 2 editorial design"
```

---

### Task 11: Rewrite `src/pages/privacy.astro`

**Files:**
- Rewrite: `src/pages/privacy.astro`

- [ ] **Step 1: Read current privacy.astro for content to preserve**

```bash
cat C:/xampp/htdocs/rielcode-astro/src/pages/privacy.astro
```
Note: keep all legal paragraph content verbatim, only change the HTML structure and styling to Phase 2 tokens.

- [ ] **Step 2: Replace the file**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const lastUpdated = '2026-05-21';
---

<BaseLayout
  title="Privacy Policy · Rielcode"
  description="How Rielcode collects, uses, and protects information from visitors and clients."
>
  <section class="rc-prose-hero">
    <div class="rc-container rc-prose-hero__inner">
      <span class="rc-label">Legal</span>
      <h1 class="rc-prose-hero__title"><em>Privacy Policy</em></h1>
      <p class="rc-prose-hero__meta rc-label">Last updated: {lastUpdated}</p>
    </div>
  </section>

  <section class="rc-prose-body">
    <div class="rc-container">
      <div class="rc-prose">
        <h2>1. Who we are</h2>
        <p>Rielcode is a solo web development practice operated by Azriel, based in Salatiga, Indonesia. We build websites for clients in Indonesia and internationally. Contact: <a href="mailto:hello@rielcode.com">hello@rielcode.com</a>.</p>

        <h2>2. What we collect</h2>
        <p>When you submit the contact form, we collect your name, email address, and message. We do not collect payment information — payments are handled externally via bank transfer. We do not use analytics cookies or tracking scripts on this site.</p>

        <h2>3. How we use your data</h2>
        <p>Contact form submissions are used solely to respond to your inquiry. We do not sell, rent, or share your personal data with third parties except where required by law.</p>

        <h2>4. Data retention</h2>
        <p>Inquiry messages are retained for as long as the client relationship is active, then deleted within 90 days of project close. You may request deletion at any time by emailing <a href="mailto:hello@rielcode.com">hello@rielcode.com</a>.</p>

        <h2>5. Your rights</h2>
        <p>You have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, contact us at <a href="mailto:hello@rielcode.com">hello@rielcode.com</a>. We will respond within 5 business days.</p>

        <h2>6. Changes to this policy</h2>
        <p>We may update this policy as our practices change. The date at the top of this page reflects the most recent revision. Continued use of the site after an update constitutes acceptance.</p>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .rc-prose-hero {
    padding-block: var(--space-24) var(--space-12);
    background: var(--rc-bg);
  }
  .rc-prose-hero__inner { display: flex; flex-direction: column; gap: var(--space-4); }
  .rc-prose-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(40px, 6vw, 88px);
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-prose-hero__title em { font-style: italic; }
  .rc-prose-hero__meta { color: var(--rc-text-muted); }

  .rc-prose-body { padding-block: var(--space-12) var(--space-24); }

  .rc-prose {
    max-width: 72ch;
  }
  .rc-prose h2 {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h3);
    font-style: italic;
    font-weight: 400;
    margin: var(--space-12) 0 var(--space-4) 0;
    color: var(--rc-text);
  }
  .rc-prose h2:first-child { margin-top: 0; }
  .rc-prose p {
    color: var(--rc-text-muted);
    font-size: var(--fs-body-md);
    line-height: var(--lh-body-lg);
    margin: 0 0 var(--space-4) 0;
  }
  .rc-prose a { color: var(--rc-accent); }
  .rc-prose a:hover { color: var(--rc-accent-hover); }
</style>
```

- [ ] **Step 3: Commit**

```bash
cd C:/xampp/htdocs/rielcode-astro
git add src/pages/privacy.astro
git commit -m "feat(phase-2/2G): rewrite /privacy with Phase 2 editorial prose layout"
```

---

### Task 12: Rewrite `src/pages/terms.astro` (migrate from snapshot)

**Files:**
- Rewrite: `src/pages/terms.astro`

- [ ] **Step 1: Read the current snapshot to extract content**

```bash
cat C:/xampp/htdocs/rielcode-astro/src/snapshots/terms.html
```
Copy the meaningful text from the snapshot. The goal is to migrate that content into proper Astro + Phase 2 styling, not to preserve the old HTML structure.

- [ ] **Step 2: Replace `src/pages/terms.astro` with Phase 2 version**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const lastUpdated = '2026-05-21';
---

<BaseLayout
  title="Terms &amp; Conditions · Rielcode"
  description="Terms and conditions governing Rielcode web development services."
>
  <section class="rc-prose-hero">
    <div class="rc-container rc-prose-hero__inner">
      <span class="rc-label">Legal</span>
      <h1 class="rc-prose-hero__title"><em>Terms &amp; Conditions</em></h1>
      <p class="rc-prose-hero__meta rc-label">Last updated: {lastUpdated}</p>
    </div>
  </section>

  <section class="rc-prose-body">
    <div class="rc-container">
      <div class="rc-prose">
        <h2>1. Services</h2>
        <p>Rielcode provides custom web design and development services including landing pages, multi-page websites, and simple e-commerce, as described in the project brief agreed before work begins. Deliverables and timelines are fixed per project agreement.</p>

        <h2>2. Payment</h2>
        <p>A deposit of 50% of the total project fee is due before work begins. The remaining 50% is due upon delivery of the final files. All fees are non-refundable once the corresponding work phase has been completed.</p>

        <h2>3. Revisions</h2>
        <p>Each package includes two rounds of design revisions per page. A revision round is defined as a consolidated set of changes submitted in one feedback document. Additional revision rounds are billed at the rate agreed in the project brief.</p>

        <h2>4. Intellectual property</h2>
        <p>Upon receipt of final payment, the client owns full rights to the delivered website design and code, except for any third-party assets (fonts, stock images, open-source libraries) which remain subject to their respective licenses. Rielcode retains the right to display the work in its portfolio.</p>

        <h2>5. Post-launch support</h2>
        <p>Every project includes 14 calendar days of bug-fix support following the launch date. Bugs are defined as unintended breakages of agreed functionality. Feature additions and design changes are billed separately.</p>

        <h2>6. Limitation of liability</h2>
        <p>Rielcode's total liability for any claim arising from these terms shall not exceed the total fees paid for the project in question. Rielcode is not liable for indirect, consequential, or incidental damages.</p>

        <h2>7. Governing law</h2>
        <p>These terms are governed by the laws of the Republic of Indonesia. Disputes will first be attempted to be resolved amicably within 30 days before referral to the appropriate legal venue in Salatiga, Indonesia.</p>

        <h2>8. Contact</h2>
        <p>Questions about these terms: <a href="mailto:hello@rielcode.com">hello@rielcode.com</a>.</p>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .rc-prose-hero {
    padding-block: var(--space-24) var(--space-12);
    background: var(--rc-bg);
  }
  .rc-prose-hero__inner { display: flex; flex-direction: column; gap: var(--space-4); }
  .rc-prose-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(40px, 6vw, 88px);
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
  }
  .rc-prose-hero__title em { font-style: italic; }
  .rc-prose-hero__meta { color: var(--rc-text-muted); }

  .rc-prose-body { padding-block: var(--space-12) var(--space-24); }

  .rc-prose { max-width: 72ch; }
  .rc-prose h2 {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h3);
    font-style: italic;
    font-weight: 400;
    margin: var(--space-12) 0 var(--space-4) 0;
    color: var(--rc-text);
  }
  .rc-prose h2:first-child { margin-top: 0; }
  .rc-prose p {
    color: var(--rc-text-muted);
    font-size: var(--fs-body-md);
    line-height: var(--lh-body-lg);
    margin: 0 0 var(--space-4) 0;
  }
  .rc-prose a { color: var(--rc-accent); }
  .rc-prose a:hover { color: var(--rc-accent-hover); }
</style>
```

- [ ] **Step 3: Build verify**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build
```
Expected: exits 0. `dist/terms/index.html` present.

- [ ] **Step 4: Final commit + tag**

```bash
git add src/pages/terms.astro src/pages/privacy.astro src/pages/404.astro
git commit -m "feat(phase-2/2G): rewrite /terms from snapshot, restyle all utility pages"
git tag phase-2-2G-complete
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| `/work` case study index (grid, filter chips noted as stretch) | Task 2 |
| `/work/[slug]` template (cover, meta strip, prose/image/stats sections) | Task 1 + Task 3 |
| Parallaxnet Canada first case study | Task 3 |
| `/studio` hero, process 4 steps, values 3-col, FAQ 8 accordions, CTA band | Task 5 + Task 6 |
| `/services` packages (Landing/Custom/E-com), add-ons, FAQ snippet | Task 8 |
| `/contact` 2-col form + aside (email, WhatsApp, response time, availability) | Task 9 |
| `/404` restyle | Task 10 |
| `/privacy` restyle | Task 11 |
| `/terms` migrate from snapshot | Task 12 |
| `FAQAccordion` component | Task 5 |
| `CaseStudySection` component | Task 1 |
| Delete legacy portfolio.astro | Task 4 |
| Delete legacy faq.astro | Task 7 |
| Delete legacy packages.astro | Task 8 |

**Filter chips on `/work`:** Spec mentions filter chips (All/Custom/Landing/E-com). With only 1 real case study, client-side filtering would be empty UX. Intentionally omitted — will be meaningful in Track 2I when Content Collections populate real entries.

**301 redirects:** `/portfolio`→`/work`, `/packages`→`/services`, `/faq`→`/studio#faq` are explicitly in Track 2I scope, not this plan. No redirect.json or Astro redirect config added here.

**GSAP / motion:** Track 2H scope. No GSAP in this plan.

**Content Collections migration:** Track 2I scope.

**Placeholder scan:** No TBD/TODO in any step. All code blocks complete. Type names consistent: `FAQItem.q`/`FAQItem.a` used consistently in Task 5 and consumed correctly in Task 6 + Task 8. `CaseStudySection` variant names `prose`/`image-full`/`image-grid`/`stats` consistent between component definition (Task 1) and usage (Task 3).
