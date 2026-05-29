# Rielcode Phase 2 — Tracks 2A → 2C Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Phase 1 dark-navy/blue visual language with editorial cream + ink + forest identity. Ship Track 2A (tokens + fonts + theme toggle), Track 2B (Nav, Footer, CTABand, ThemeToggle), and Track 2C (redesigned `/` home).

**Architecture:** Astro 6 static site at `C:\xampp\htdocs\rielcode-astro`. Phase 2 swaps `src/styles/tokens.css` semantic values, self-hosts Fraunces + Inter variable WOFF2 in `public/fonts/`, strips legacy PHP CSS imports from `BaseLayout.astro`, and rebuilds global components from scratch. Theme toggle uses `[data-theme="dark"]` on `<html>`, persisted via `localStorage` and hydrated pre-paint via inline script in `<head>`. Home page rebuilt section-by-section using new components.

**Tech Stack:** Astro 6.3, Tailwind 4 (Vite plugin) — but Phase 2 components use plain CSS + design tokens, not Tailwind utilities. Fraunces (variable, italic + roman, opsz). Inter (variable). No GSAP in this plan slice (motion is Track 2H).

**Spec reference:** `docs/superpowers/specs/2026-05-21-rielcode-phase-2-redesign-design.md`

**Repo root for all file paths below:** `C:\xampp\htdocs\rielcode-astro` (paths shown relative to that root).

---

## File Structure

**Track 2A:**
- Modify: `src/styles/tokens.css` — swap semantic values per spec §Tokens
- Modify: `src/styles/global.css` — base resets, font-face, body defaults using new tokens
- Modify: `src/layouts/BaseLayout.astro` — drop legacy `/CSS/*.css` imports; add font preloads; add pre-paint theme script
- Create: `public/fonts/Fraunces-VariableFont.woff2` — download from Google Fonts (italic + roman variable axis)
- Create: `public/fonts/Fraunces-Italic-VariableFont.woff2`
- Create: `public/fonts/Inter-VariableFont.woff2`
- Create: `src/components/ThemeToggle.astro` — light/dark button, localStorage persistence

**Track 2B:**
- Rewrite: `src/components/Nav.astro` — editorial nav, blur-on-scroll, hide-on-scroll-down, mobile drawer
- Rewrite: `src/components/Footer.astro` — studio number, theme toggle, currency toggle stub, link columns
- Create: `src/components/CTABand.astro` — full-bleed forest band with single CTA
- Modify: `src/components/Button.astro` — adopt new tokens, add forest fill + underline variants
- Modify: `src/components/Section.astro` — adopt new spacing tokens
- Modify: `src/components/Card.astro` — adopt new tokens

**Track 2C:**
- Create: `src/components/EditorialHero.astro` — h1 split italic/roman, label, CTAs, chips slot
- Create: `src/components/WorkCard.astro` — image + meta + hover, lg/sm variants
- Create: `src/components/ServiceCard.astro` — package tile with IDR/USD price slot
- Rewrite: `src/pages/index.astro` — replace snapshot import with editorial sections (hero, featured work, studio brief, services preview, testimonials, CTA band)

**No tests directory exists.** Project ships static HTML; verification is visual via `npm run dev` + Playwright screenshot at each track end (manual, not automated in this plan). Each task lists explicit `npm run build` and dev-server visual-check gates instead of unit tests.

---

# Track 2A — Tokens, Fonts, Theme Toggle

### Task 1: Download Fraunces + Inter variable WOFF2 files

**Files:**
- Create: `public/fonts/Fraunces-VariableFont.woff2`
- Create: `public/fonts/Fraunces-Italic-VariableFont.woff2`
- Create: `public/fonts/Inter-VariableFont.woff2`

- [ ] **Step 1: Create fonts directory**

```bash
mkdir -p C:/xampp/htdocs/rielcode-astro/public/fonts
```

- [ ] **Step 2: Download Fraunces variable (roman) WOFF2 from Google Fonts**

Use `curl` to fetch the variable WOFF2 from the Google Fonts CSS API. Source URL is in the CSS at `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap` — fetch that CSS first, copy the `src: url(...)` value, then download.

```bash
curl -sL -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap" -o /tmp/fraunces.css
grep -oE 'https://[^)]+\.woff2' /tmp/fraunces.css | head -1 | xargs curl -sL -o C:/xampp/htdocs/rielcode-astro/public/fonts/Fraunces-VariableFont.woff2
```

- [ ] **Step 3: Download Fraunces italic variable**

```bash
curl -sL -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300..900&display=swap" -o /tmp/fraunces-italic.css
grep -oE 'https://[^)]+\.woff2' /tmp/fraunces-italic.css | head -1 | xargs curl -sL -o C:/xampp/htdocs/rielcode-astro/public/fonts/Fraunces-Italic-VariableFont.woff2
```

- [ ] **Step 4: Download Inter variable**

```bash
curl -sL -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" -o /tmp/inter.css
grep -oE 'https://[^)]+\.woff2' /tmp/inter.css | head -1 | xargs curl -sL -o C:/xampp/htdocs/rielcode-astro/public/fonts/Inter-VariableFont.woff2
```

- [ ] **Step 5: Verify all three files exist and are >20KB**

```bash
ls -la C:/xampp/htdocs/rielcode-astro/public/fonts/
```
Expected: three .woff2 files, each >20KB (Inter ~340KB, Fraunces ~150KB each).

- [ ] **Step 6: Commit**

```bash
cd C:/xampp/htdocs/rielcode-astro
git add public/fonts/
git commit -m "feat(phase-2/2A): self-host Fraunces + Inter variable WOFF2 fonts"
```

---

### Task 2: Rewrite `tokens.css` with Phase 2 semantic values

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Replace `:root` block with Phase 2 palette + typography**

Replace lines 14–147 of `src/styles/tokens.css` with the following. Keep the `@media (prefers-reduced-motion)` block at the bottom untouched.

```css
:root {
  /* ── Color: brand ── */
  --rc-cream:               #f4f1ea;
  --rc-cream-elev:          #ebe7dc;
  --rc-cream-50:            #faf8f3;
  --rc-ink:                 #1a1a1a;
  --rc-ink-900:             #0a0a0a;
  --rc-forest:              #2d4a3a;
  --rc-forest-mid:          #4a6b58;
  --rc-forest-pale:         #8ba88f;

  /* ── Color: semantic (light theme default) ── */
  --rc-bg:                  var(--rc-cream);
  --rc-bg-elev:             var(--rc-cream-elev);
  --rc-text:                var(--rc-ink);
  --rc-text-muted:          rgba(26, 26, 26, 0.65);
  --rc-text-faint:          rgba(26, 26, 26, 0.40);
  --rc-accent:              var(--rc-forest);
  --rc-accent-hover:        var(--rc-forest-mid);
  --rc-accent-pale:         var(--rc-forest-pale);
  --rc-on-accent:           var(--rc-cream);
  --rc-border:              rgba(26, 26, 26, 0.12);
  --rc-border-strong:       rgba(26, 26, 26, 0.24);

  /* ── Typography: families ── */
  --rc-font-display:        'Fraunces', Georgia, 'Times New Roman', serif;
  --rc-font-body:           'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --rc-font-mono:           'JetBrains Mono', ui-monospace, Menlo, monospace;

  /* ── Typography: scale (kept from Phase 1) ── */
  --fs-display-xl:          72px;
  --fs-display-lg:          56px;
  --fs-h1:                  40px;
  --fs-h2:                  32px;
  --fs-h3:                  24px;
  --fs-h4:                  20px;
  --fs-body-lg:             18px;
  --fs-body-md:             16px;
  --fs-body-sm:             14px;
  --fs-label:               12px;
  --fs-code:                14px;

  /* ── Typography: line heights ── */
  --lh-display-xl:          1.05;
  --lh-display-lg:          1.10;
  --lh-h1:                  1.15;
  --lh-h2:                  1.20;
  --lh-h3:                  1.30;
  --lh-h4:                  1.40;
  --lh-body-lg:             1.65;
  --lh-body-md:             1.60;
  --lh-body-sm:             1.55;
  --lh-label:               1.40;
  --lh-code:                1.50;

  --ls-label:               0.12em;

  /* ── Spacing (base-8) ── */
  --space-1:                4px;
  --space-2:                8px;
  --space-3:                12px;
  --space-4:                16px;
  --space-6:                24px;
  --space-8:                32px;
  --space-12:               48px;
  --space-16:               64px;
  --space-24:               96px;
  --space-32:               128px;

  /* ── Radii ── */
  --radius-sm:              4px;
  --radius-md:              8px;
  --radius-lg:              16px;
  --radius-pill:            999px;

  /* ── Shadows ── */
  --shadow-card:            0 8px 24px rgba(26, 26, 26, 0.08);
  --shadow-card-hover:      0 12px 32px rgba(26, 26, 26, 0.12);

  /* ── Motion ── */
  --ease-out:               cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out:            cubic-bezier(0.77, 0, 0.175, 1);
  --dur-fast:               160ms;
  --dur-base:               240ms;
  --dur-slow:               420ms;
  --transition-fast:        var(--dur-fast) var(--ease-out);
  --transition-base:        var(--dur-base) var(--ease-out);

  /* ── Layout ── */
  --z-nav:                  1050;
  --z-overlay:              10000;
  --container-max:          1240px;
  --container-pad:          24px;
  --section-py-desktop:     120px;
  --section-py-mobile:      72px;
}

[data-theme="dark"] {
  --rc-bg:                  var(--rc-ink);
  --rc-bg-elev:             #242424;
  --rc-text:                var(--rc-cream);
  --rc-text-muted:          rgba(244, 241, 234, 0.70);
  --rc-text-faint:          rgba(244, 241, 234, 0.45);
  --rc-border:              rgba(244, 241, 234, 0.14);
  --rc-border-strong:       rgba(244, 241, 234, 0.28);
  --shadow-card:            0 8px 24px rgba(0, 0, 0, 0.40);
  --shadow-card-hover:      0 12px 32px rgba(0, 0, 0, 0.55);
  /* forest accent unchanged for brand continuity */
}
```

- [ ] **Step 2: Run dev server, verify no parse errors**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Expected: server starts on http://localhost:4321 with no CSS errors in terminal. Page will look broken (legacy CSS still loaded + new tokens conflict) — that's fine, fixed in next tasks. Stop dev server (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(phase-2/2A): swap tokens.css to cream + ink + forest palette"
```

---

### Task 3: Rewrite `global.css` with font-face + new resets

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Read current global.css to know what's there**

```bash
cat C:/xampp/htdocs/rielcode-astro/src/styles/global.css
```
Note current contents so commit message reflects what was removed.

- [ ] **Step 2: Replace entire file with Phase 2 base styles**

```css
/* ============================================================
 * Rielcode Phase 2 — global base styles
 * Consumes tokens from tokens.css. Sets up font-face,
 * reset, and body defaults. Component styles live in
 * each .astro component.
 * ============================================================ */

@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-VariableFont.woff2') format('woff2-variations');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-Italic-VariableFont.woff2') format('woff2-variations');
  font-weight: 300 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-VariableFont.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

*, *::before, *::after { box-sizing: border-box; }

html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--rc-bg);
  color: var(--rc-text);
}

body {
  margin: 0;
  font-family: var(--rc-font-body);
  font-size: var(--fs-body-md);
  line-height: var(--lh-body-md);
  background: var(--rc-bg);
  color: var(--rc-text);
  transition: background-color var(--transition-base), color var(--transition-base);
}

h1, h2, h3, h4 {
  font-family: var(--rc-font-display);
  font-weight: 400;
  margin: 0;
  color: var(--rc-text);
}

h1 { font-size: var(--fs-display-lg); line-height: var(--lh-display-lg); letter-spacing: -0.02em; }
h2 { font-size: var(--fs-h1); line-height: var(--lh-h1); letter-spacing: -0.015em; }
h3 { font-size: var(--fs-h2); line-height: var(--lh-h2); }
h4 { font-size: var(--fs-h3); line-height: var(--lh-h3); }

p { margin: 0 0 var(--space-4) 0; }

a {
  color: var(--rc-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}
a:hover { color: var(--rc-accent-hover); }

img, svg { display: block; max-width: 100%; height: auto; }

.rc-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding-inline: var(--container-pad);
}

.rc-label {
  font-family: var(--rc-font-body);
  font-size: var(--fs-label);
  line-height: var(--lh-label);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--rc-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Restart dev server, verify fonts load**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Open http://localhost:4321/ in browser. Check DevTools → Network → Font: `Fraunces-VariableFont.woff2`, `Inter-VariableFont.woff2` should load with status 200. Page still looks broken (legacy CSS still imported in BaseLayout) — fixed next task.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(phase-2/2A): add font-face + Phase 2 base styles to global.css"
```

---

### Task 4: Strip legacy CSS + add font preload + theme script in `BaseLayout.astro`

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace `<head>` block**

Replace the contents of `<head>` (lines 26–60) with this. Keep the front-matter import block and `<body>` block as-is for now.

```astro
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="canonical" href={canonical} />

    <title>{title}</title>
    <meta name="description" content={description} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />

    <link rel="preload" href="/fonts/Inter-VariableFont.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/Fraunces-VariableFont.woff2" as="font" type="font/woff2" crossorigin />

    <script is:inline>
      // Pre-paint theme hydration: read localStorage or prefers-color-scheme,
      // set [data-theme] on <html> before first paint to avoid FOUC.
      (function () {
        try {
          var stored = localStorage.getItem('rc-theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var theme = stored || (prefersDark ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      })();
    </script>

    <meta name="generator" content={Astro.generator} />
  </head>
```

- [ ] **Step 2: Verify legacy `<link rel="stylesheet" href="/CSS/...">` lines and bootstrap-icons CDN are gone**

```bash
grep -n "CSS/" C:/xampp/htdocs/rielcode-astro/src/layouts/BaseLayout.astro
grep -n "bootstrap-icons" C:/xampp/htdocs/rielcode-astro/src/layouts/BaseLayout.astro
```
Expected: both commands return no matches.

- [ ] **Step 3: Restart dev server, verify legacy CSS gone**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Open http://localhost:4321/. DevTools → Network: should NOT see requests to `/CSS/root-variables.css`, `/CSS/redesign.css`, `/CSS/style.css`, `/CSS/navbar.css`, `/CSS/testimonials.css`. Home page will look raw/unstyled because index.astro still injects snapshot HTML that depends on those styles — expected, fixed in Track 2C.

- [ ] **Step 4: Toggle theme manually in DevTools**

In DevTools console:
```js
document.documentElement.setAttribute('data-theme', 'dark');
```
Expected: page background flips from cream to ink, text flips to cream. Then:
```js
document.documentElement.setAttribute('data-theme', 'light');
```
Expected: flips back.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(phase-2/2A): strip legacy PHP CSS, add font preload + pre-paint theme script"
```

---

### Task 5: Create `ThemeToggle.astro`

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Write the component**

```astro
---
// Phase 2 / Track 2A — light/dark theme toggle.
// Persists choice to localStorage('rc-theme'). Pre-paint hydration
// lives in BaseLayout.astro <head>; this only handles the click.
---

<button
  class="rc-theme-toggle"
  type="button"
  aria-label="Toggle color theme"
  data-rc-theme-toggle
>
  <span class="rc-theme-toggle__icon rc-theme-toggle__icon--sun" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  </span>
  <span class="rc-theme-toggle__icon rc-theme-toggle__icon--moon" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  </span>
</button>

<style>
  .rc-theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    background: transparent;
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-pill);
    color: var(--rc-text);
    cursor: pointer;
    transition: background var(--transition-fast), border-color var(--transition-fast);
  }
  .rc-theme-toggle:hover {
    background: var(--rc-bg-elev);
    border-color: var(--rc-border-strong);
  }
  .rc-theme-toggle__icon { display: none; line-height: 0; }
  :global([data-theme="light"]) .rc-theme-toggle__icon--moon { display: inline-flex; }
  :global([data-theme="dark"]) .rc-theme-toggle__icon--sun { display: inline-flex; }
</style>

<script>
  document.querySelectorAll('[data-rc-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('rc-theme', next); } catch {}
    });
  });
</script>
```

- [ ] **Step 2: Temporarily mount ThemeToggle in BaseLayout to test**

Edit `src/layouts/BaseLayout.astro`. Add import after existing imports:
```astro
import ThemeToggle from '../components/ThemeToggle.astro';
```
Then inside `<body>`, before `<Nav />`, add:
```astro
<div style="position:fixed; top:12px; right:12px; z-index:9999;"><ThemeToggle /></div>
```

- [ ] **Step 3: Visual test**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Open http://localhost:4321/. Click the toggle button in top-right. Expected: theme flips, icon swaps (sun ↔ moon), reload page and theme persists.

- [ ] **Step 4: Remove temporary mount from BaseLayout**

Revert the two additions from Step 2. `ThemeToggle` will be permanently mounted by `Footer.astro` in Track 2B.

- [ ] **Step 5: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat(phase-2/2A): add ThemeToggle component with localStorage persistence"
```

---

### Task 6: Track 2A build verification

- [ ] **Step 1: Run production build**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build
```
Expected: exits 0. No CSS/font errors. `dist/` populated.

- [ ] **Step 2: Verify fonts ship into dist**

```bash
ls C:/xampp/htdocs/rielcode-astro/dist/fonts/
```
Expected: three .woff2 files present.

- [ ] **Step 3: Tag Track 2A complete**

```bash
cd C:/xampp/htdocs/rielcode-astro
git tag phase-2-2A-complete
```

---

# Track 2B — Global Components (Nav, Footer, CTABand, Button, Section, Card)

### Task 7: Rewrite `Button.astro` with forest fill + underline variants

**Files:**
- Modify: `src/components/Button.astro`

- [ ] **Step 1: Read current Button**

```bash
cat C:/xampp/htdocs/rielcode-astro/src/components/Button.astro
```

- [ ] **Step 2: Replace with Phase 2 version**

```astro
---
export interface Props {
  href?: string;
  variant?: 'fill' | 'outline' | 'underline';
  size?: 'md' | 'sm' | 'lg';
  type?: 'button' | 'submit';
  ariaLabel?: string;
  class?: string;
}

const {
  href,
  variant = 'fill',
  size = 'md',
  type = 'button',
  ariaLabel,
  class: className = '',
} = Astro.props;

const cls = ['rc-btn', `rc-btn--${variant}`, `rc-btn--${size}`, className].filter(Boolean).join(' ');
const Tag = href ? 'a' : 'button';
---

<Tag
  class={cls}
  href={href}
  type={!href ? type : undefined}
  aria-label={ariaLabel}
>
  <slot />
</Tag>

<style>
  .rc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-family: var(--rc-font-body);
    font-weight: 500;
    line-height: 1;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
  }
  .rc-btn--sm { padding: 10px 16px; font-size: var(--fs-body-sm); }
  .rc-btn--md { padding: 14px 22px; font-size: var(--fs-body-md); }
  .rc-btn--lg { padding: 18px 28px; font-size: var(--fs-body-lg); }

  .rc-btn--fill {
    background: var(--rc-accent);
    color: var(--rc-on-accent);
  }
  .rc-btn--fill:hover {
    background: var(--rc-accent-hover);
    transform: translateY(-1px);
  }

  .rc-btn--outline {
    background: transparent;
    color: var(--rc-text);
    border-color: var(--rc-border-strong);
  }
  .rc-btn--outline:hover {
    background: var(--rc-bg-elev);
    border-color: var(--rc-text);
  }

  .rc-btn--underline {
    background: transparent;
    color: var(--rc-text);
    border: none;
    padding-inline: 0;
    border-radius: 0;
    border-bottom: 1px solid var(--rc-text);
  }
  .rc-btn--underline:hover {
    color: var(--rc-accent);
    border-bottom-color: var(--rc-accent);
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Button.astro
git commit -m "feat(phase-2/2B): rewrite Button with fill/outline/underline variants on new tokens"
```

---

### Task 8: Update `Section.astro` to use new spacing tokens

**Files:**
- Modify: `src/components/Section.astro`

- [ ] **Step 1: Read current**

```bash
cat C:/xampp/htdocs/rielcode-astro/src/components/Section.astro
```

- [ ] **Step 2: Replace with**

```astro
---
export interface Props {
  id?: string;
  bg?: 'default' | 'elev' | 'accent';
  pad?: 'default' | 'tight' | 'none';
  class?: string;
}
const { id, bg = 'default', pad = 'default', class: className = '' } = Astro.props;
const cls = ['rc-section', `rc-section--bg-${bg}`, `rc-section--pad-${pad}`, className].filter(Boolean).join(' ');
---

<section class={cls} id={id}>
  <div class="rc-container">
    <slot />
  </div>
</section>

<style>
  .rc-section--bg-default { background: var(--rc-bg); color: var(--rc-text); }
  .rc-section--bg-elev    { background: var(--rc-bg-elev); color: var(--rc-text); }
  .rc-section--bg-accent  { background: var(--rc-accent); color: var(--rc-on-accent); }

  .rc-section--pad-default { padding-block: var(--section-py-mobile); }
  .rc-section--pad-tight   { padding-block: var(--space-12); }
  .rc-section--pad-none    { padding-block: 0; }

  @media (min-width: 900px) {
    .rc-section--pad-default { padding-block: var(--section-py-desktop); }
    .rc-section--pad-tight   { padding-block: var(--space-16); }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Section.astro
git commit -m "feat(phase-2/2B): update Section with new bg/pad variants on Phase 2 tokens"
```

---

### Task 9: Update `Card.astro` to use new tokens

**Files:**
- Modify: `src/components/Card.astro`

- [ ] **Step 1: Read current**

```bash
cat C:/xampp/htdocs/rielcode-astro/src/components/Card.astro
```

- [ ] **Step 2: Replace with**

```astro
---
export interface Props {
  as?: 'article' | 'div' | 'a';
  href?: string;
  hover?: boolean;
  class?: string;
}
const { as = 'article', href, hover = false, class: className = '' } = Astro.props;
const Tag = href ? 'a' : as;
const cls = ['rc-card', hover ? 'rc-card--hover' : '', className].filter(Boolean).join(' ');
---

<Tag class={cls} href={href}>
  <slot />
</Tag>

<style>
  .rc-card {
    display: block;
    background: var(--rc-bg-elev);
    color: var(--rc-text);
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-md);
    padding: var(--space-6);
    text-decoration: none;
    transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  }
  .rc-card--hover:hover {
    transform: translateY(-2px);
    border-color: var(--rc-border-strong);
    box-shadow: var(--shadow-card-hover);
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Card.astro
git commit -m "feat(phase-2/2B): update Card with Phase 2 tokens"
```

---

### Task 10: Rewrite `Nav.astro` — editorial nav with blur-on-scroll + mobile drawer

**Files:**
- Rewrite: `src/components/Nav.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
// Phase 2 / Track 2B — editorial Nav.
// Behavior: blur background once scrolled >24px. Hide on scroll-down,
// show on scroll-up. Mobile (<900px) collapses links into a drawer.
export interface Props {
  base?: string;
}
const { base = '/' } = Astro.props;
---

<nav class="rc-nav" aria-label="Primary" data-rc-nav>
  <div class="rc-nav__inner rc-container">
    <a class="rc-nav__logo" href={base}>
      <span class="rc-label rc-nav__num">N°01</span>
      <span class="rc-nav__name">Rielcode</span>
    </a>

    <ul class="rc-nav__links" data-rc-nav-links>
      <li><a href={`${base}work`}>Work</a></li>
      <li><a href={`${base}studio`}>Studio</a></li>
      <li><a href={`${base}services`}>Services</a></li>
      <li><a href={`${base}contact`}>Contact</a></li>
    </ul>

    <div class="rc-nav__cta">
      <a class="rc-btn rc-btn--fill rc-btn--sm" href={`${base}contact`}>Start a project</a>
    </div>

    <button class="rc-nav__burger" aria-label="Open menu" aria-expanded="false" data-rc-burger>
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<style>
  .rc-nav {
    position: sticky;
    top: 0;
    z-index: var(--z-nav);
    background: color-mix(in oklab, var(--rc-bg) 92%, transparent);
    border-bottom: 1px solid transparent;
    transition: background var(--transition-base), border-color var(--transition-base), transform var(--transition-base), backdrop-filter var(--transition-base);
  }
  .rc-nav[data-scrolled="true"] {
    backdrop-filter: saturate(160%) blur(12px);
    background: color-mix(in oklab, var(--rc-bg) 80%, transparent);
    border-bottom-color: var(--rc-border);
  }
  .rc-nav[data-hidden="true"] {
    transform: translateY(-100%);
  }

  .rc-nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-6);
    min-height: 72px;
  }

  .rc-nav__logo {
    display: inline-flex;
    align-items: baseline;
    gap: var(--space-2);
    color: var(--rc-text);
    text-decoration: none;
  }
  .rc-nav__num { color: var(--rc-text-muted); }
  .rc-nav__name {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h4);
    font-style: italic;
  }

  .rc-nav__links {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    list-style: none;
    margin: 0; padding: 0;
  }
  .rc-nav__links a {
    color: var(--rc-text);
    font-size: var(--fs-body-md);
    text-decoration: none;
  }
  .rc-nav__links a:hover { color: var(--rc-accent); }

  .rc-nav__cta { display: inline-flex; }

  .rc-nav__burger {
    display: none;
    width: 36px; height: 36px;
    background: transparent;
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-pill);
    cursor: pointer;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
    padding: 0;
  }
  .rc-nav__burger span {
    display: block;
    width: 14px; height: 1.5px;
    background: var(--rc-text);
  }

  @media (max-width: 899px) {
    .rc-nav__links {
      display: none;
      position: absolute;
      top: 100%; left: 0; right: 0;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6) var(--container-pad);
      background: var(--rc-bg);
      border-bottom: 1px solid var(--rc-border);
    }
    .rc-nav__links[data-open="true"] { display: flex; }
    .rc-nav__cta { display: none; }
    .rc-nav__burger { display: inline-flex; }
  }
</style>

<script>
  const nav = document.querySelector('[data-rc-nav]');
  const links = document.querySelector('[data-rc-nav-links]');
  const burger = document.querySelector('[data-rc-burger]');
  let lastY = 0;

  if (nav) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.setAttribute('data-scrolled', y > 24 ? 'true' : 'false');
      if (y > 120) {
        nav.setAttribute('data-hidden', y > lastY ? 'true' : 'false');
      } else {
        nav.setAttribute('data-hidden', 'false');
      }
      lastY = y;
    }, { passive: true });
  }

  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.getAttribute('data-open') === 'true';
      links.setAttribute('data-open', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }
</script>
```

- [ ] **Step 2: Visual test**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Open http://localhost:4321/. Scroll: nav background should pick up blur after ~24px. Scroll down: nav hides. Scroll up: nav reappears. Resize to <900px: links collapse to burger.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(phase-2/2B): editorial Nav with blur-on-scroll, hide-on-scroll-down, mobile drawer"
```

---

### Task 11: Rewrite `Footer.astro` with theme toggle + studio number

**Files:**
- Rewrite: `src/components/Footer.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
const year = new Date().getFullYear();
---

<footer class="rc-footer">
  <div class="rc-container rc-footer__inner">
    <div class="rc-footer__brand">
      <span class="rc-label">N°01 — Rielcode Studio</span>
      <p class="rc-footer__tag">
        Websites with uncommon polish, made from Salatiga for the world.
      </p>
    </div>

    <nav class="rc-footer__nav" aria-label="Footer">
      <div>
        <h4>Studio</h4>
        <a href="/work">Work</a>
        <a href="/studio">About</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </nav>

    <div class="rc-footer__controls">
      <ThemeToggle />
    </div>
  </div>

  <div class="rc-container rc-footer__bottom">
    <small>© {year} Rielcode. All rights reserved.</small>
  </div>
</footer>

<style>
  .rc-footer {
    background: var(--rc-bg-elev);
    color: var(--rc-text);
    border-top: 1px solid var(--rc-border);
    margin-top: var(--space-24);
  }
  .rc-footer__inner {
    display: grid;
    grid-template-columns: 1.4fr 1.6fr auto;
    gap: var(--space-12);
    padding-block: var(--space-16);
    align-items: start;
  }
  .rc-footer__brand h4, .rc-footer__nav h4 {
    font-family: var(--rc-font-body);
    font-size: var(--fs-label);
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--rc-text-muted);
    margin: 0 0 var(--space-3) 0;
    font-weight: 500;
  }
  .rc-footer__tag {
    font-family: var(--rc-font-display);
    font-style: italic;
    font-size: var(--fs-h4);
    line-height: 1.4;
    margin-top: var(--space-3);
    max-width: 32ch;
  }
  .rc-footer__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
  .rc-footer__nav a {
    display: block;
    color: var(--rc-text);
    text-decoration: none;
    padding-block: 4px;
  }
  .rc-footer__nav a:hover { color: var(--rc-accent); }
  .rc-footer__controls {
    display: inline-flex;
    align-items: center;
  }
  .rc-footer__bottom {
    padding-block: var(--space-6);
    border-top: 1px solid var(--rc-border);
    color: var(--rc-text-muted);
  }
  @media (max-width: 899px) {
    .rc-footer__inner {
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }
  }
</style>
```

- [ ] **Step 2: Visual test**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Open http://localhost:4321/. Scroll to footer. Click theme toggle button — page should flip light↔dark, footer styles should update with it.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(phase-2/2B): editorial Footer with studio number, theme toggle, link columns"
```

---

### Task 12: Create `CTABand.astro`

**Files:**
- Create: `src/components/CTABand.astro`

- [ ] **Step 1: Write the component**

```astro
---
export interface Props {
  heading: string;
  ctaText: string;
  ctaHref: string;
  eyebrow?: string;
}
const { heading, ctaText, ctaHref, eyebrow } = Astro.props;
---

<section class="rc-ctaband">
  <div class="rc-container rc-ctaband__inner">
    {eyebrow && <span class="rc-label rc-ctaband__eyebrow">{eyebrow}</span>}
    <h2 class="rc-ctaband__heading">{heading}</h2>
    <a class="rc-ctaband__cta" href={ctaHref}>
      {ctaText}
      <span aria-hidden="true">→</span>
    </a>
  </div>
</section>

<style>
  .rc-ctaband {
    background: var(--rc-accent);
    color: var(--rc-on-accent);
    padding-block: var(--space-24);
  }
  .rc-ctaband__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
  }
  .rc-ctaband__eyebrow { color: color-mix(in oklab, var(--rc-on-accent) 70%, transparent); }
  .rc-ctaband__heading {
    font-family: var(--rc-font-display);
    font-size: clamp(40px, 6vw, 88px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    max-width: 18ch;
    color: var(--rc-on-accent);
    margin: 0;
  }
  .rc-ctaband__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--rc-on-accent);
    font-size: var(--fs-body-lg);
    text-decoration: none;
    border-bottom: 1px solid var(--rc-on-accent);
    padding-bottom: 4px;
    transition: gap var(--transition-base);
  }
  .rc-ctaband__cta:hover { gap: var(--space-4); color: var(--rc-on-accent); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CTABand.astro
git commit -m "feat(phase-2/2B): add CTABand full-bleed forest band component"
```

---

### Task 13: Track 2B build verification

- [ ] **Step 1: Build + dev visual check**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run build && npm run dev
```
Expected: build exits 0. Open http://localhost:4321/contact (or any other page that uses BaseLayout). Nav + Footer render in new style. Theme toggle works. No console errors.

- [ ] **Step 2: Tag Track 2B complete**

```bash
git tag phase-2-2B-complete
```

---

# Track 2C — `/` Home Redesign

### Task 14: Create `EditorialHero.astro`

**Files:**
- Create: `src/components/EditorialHero.astro`

- [ ] **Step 1: Write component**

```astro
---
export interface Props {
  eyebrow?: string;
  italicLine: string;
  romanLine: string;
  body?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}
const {
  eyebrow = 'N°01 — Rielcode Studio',
  italicLine,
  romanLine,
  body,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
} = Astro.props;
---

<section class="rc-hero">
  <div class="rc-container rc-hero__inner">
    <span class="rc-label rc-hero__eyebrow">{eyebrow}</span>
    <h1 class="rc-hero__title">
      <span class="rc-hero__italic">{italicLine}</span>
      <span class="rc-hero__roman">{romanLine}</span>
    </h1>
    {body && <p class="rc-hero__body">{body}</p>}
    <div class="rc-hero__ctas">
      {primaryCtaText && primaryCtaHref && (
        <a class="rc-btn rc-btn--fill rc-btn--lg" href={primaryCtaHref}>{primaryCtaText}</a>
      )}
      {secondaryCtaText && secondaryCtaHref && (
        <a class="rc-btn rc-btn--underline rc-btn--md" href={secondaryCtaHref}>{secondaryCtaText}</a>
      )}
    </div>
    <div class="rc-hero__chips"><slot name="chips" /></div>
  </div>
</section>

<style>
  .rc-hero {
    padding-block: var(--space-24) var(--space-16);
    background: var(--rc-bg);
  }
  .rc-hero__inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 18ch;
  }
  .rc-hero__inner > * { max-width: none; }
  .rc-hero__eyebrow { color: var(--rc-text-muted); }
  .rc-hero__title {
    font-family: var(--rc-font-display);
    font-weight: 400;
    font-size: clamp(48px, 9vw, 128px);
    line-height: 1.02;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--rc-text);
    max-width: 14ch;
  }
  .rc-hero__italic { display: block; font-style: italic; }
  .rc-hero__roman { display: block; }
  .rc-hero__body {
    font-size: var(--fs-body-lg);
    line-height: var(--lh-body-lg);
    color: var(--rc-text-muted);
    max-width: 50ch;
    margin: 0;
  }
  .rc-hero__ctas {
    display: flex;
    gap: var(--space-6);
    align-items: center;
    flex-wrap: wrap;
    margin-top: var(--space-4);
  }
  .rc-hero__chips {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    margin-top: var(--space-6);
    color: var(--rc-text-muted);
    font-size: var(--fs-body-sm);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EditorialHero.astro
git commit -m "feat(phase-2/2C): add EditorialHero with italic + roman split title"
```

---

### Task 15: Create `WorkCard.astro`

**Files:**
- Create: `src/components/WorkCard.astro`

- [ ] **Step 1: Write component**

```astro
---
export interface Props {
  href: string;
  title: string;
  year: string;
  kind: string;
  image: string;
  imageAlt?: string;
  size?: 'lg' | 'sm';
}
const { href, title, year, kind, image, imageAlt = '', size = 'lg' } = Astro.props;
---

<a class={`rc-workcard rc-workcard--${size}`} href={href}>
  <div class="rc-workcard__media">
    <img src={image} alt={imageAlt} loading="lazy" />
  </div>
  <div class="rc-workcard__meta">
    <span class="rc-label">{year} · {kind}</span>
    <h3 class="rc-workcard__title">{title}</h3>
  </div>
</a>

<style>
  .rc-workcard {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    color: var(--rc-text);
    text-decoration: none;
  }
  .rc-workcard__media {
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--rc-bg-elev);
    aspect-ratio: 4 / 3;
  }
  .rc-workcard--lg .rc-workcard__media { aspect-ratio: 16 / 11; }
  .rc-workcard__media img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform var(--transition-base);
  }
  .rc-workcard:hover .rc-workcard__media img { transform: scale(1.03); }
  .rc-workcard__title {
    font-family: var(--rc-font-display);
    font-style: italic;
    font-size: var(--fs-h2);
    line-height: 1.15;
    color: var(--rc-text);
    margin: 0;
  }
  .rc-workcard__meta .rc-label { color: var(--rc-text-muted); display: block; margin-bottom: var(--space-2); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WorkCard.astro
git commit -m "feat(phase-2/2C): add WorkCard with lg/sm variants + image zoom hover"
```

---

### Task 16: Create `ServiceCard.astro`

**Files:**
- Create: `src/components/ServiceCard.astro`

- [ ] **Step 1: Write component**

```astro
---
export interface Props {
  title: string;
  priceIdr: string;
  priceUsd: string;
  description: string;
  href: string;
}
const { title, priceIdr, priceUsd, description, href } = Astro.props;
---

<a class="rc-svccard" href={href}>
  <h3 class="rc-svccard__title">{title}</h3>
  <p class="rc-svccard__desc">{description}</p>
  <div class="rc-svccard__price">
    <span class="rc-label">From</span>
    <strong>{priceIdr}</strong>
    <span class="rc-svccard__alt">/ {priceUsd}</span>
  </div>
  <span class="rc-svccard__arrow" aria-hidden="true">→</span>
</a>

<style>
  .rc-svccard {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: var(--space-4);
    padding: var(--space-8);
    background: var(--rc-bg-elev);
    border: 1px solid var(--rc-border);
    border-radius: var(--radius-md);
    color: var(--rc-text);
    text-decoration: none;
    position: relative;
    transition: border-color var(--transition-base), transform var(--transition-base);
    min-height: 280px;
  }
  .rc-svccard:hover {
    border-color: var(--rc-border-strong);
    transform: translateY(-2px);
  }
  .rc-svccard__title {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h2);
    font-style: italic;
    margin: 0;
  }
  .rc-svccard__desc {
    color: var(--rc-text-muted);
    margin: 0;
    font-size: var(--fs-body-md);
  }
  .rc-svccard__price {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    font-family: var(--rc-font-body);
    font-size: var(--fs-h4);
    color: var(--rc-text);
  }
  .rc-svccard__price .rc-label { color: var(--rc-text-muted); }
  .rc-svccard__alt { color: var(--rc-text-muted); font-size: var(--fs-body-sm); }
  .rc-svccard__arrow {
    position: absolute;
    top: var(--space-6);
    right: var(--space-6);
    color: var(--rc-accent);
    font-size: var(--fs-h3);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ServiceCard.astro
git commit -m "feat(phase-2/2C): add ServiceCard with IDR + USD pricing display"
```

---

### Task 17: Rewrite `src/pages/index.astro` — editorial home

**Files:**
- Rewrite: `src/pages/index.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import EditorialHero from '../components/EditorialHero.astro';
import Section from '../components/Section.astro';
import WorkCard from '../components/WorkCard.astro';
import ServiceCard from '../components/ServiceCard.astro';
import CTABand from '../components/CTABand.astro';
---

<BaseLayout
  title="Rielcode — Websites with uncommon polish"
  description="A solo studio in Salatiga building editorial-grade websites, landing pages, and simple e-commerce for international and Indonesian SMB clients."
>
  <EditorialHero
    eyebrow="N°01 — Rielcode Studio"
    italicLine="Websites with"
    romanLine="uncommon polish."
    body="A solo studio building editorial-grade sites, landing pages, and simple e-commerce — designed and developed end-to-end from Salatiga, Indonesia."
    primaryCtaText="Start a project"
    primaryCtaHref="/contact"
    secondaryCtaText="See the work"
    secondaryCtaHref="/work"
  >
    <Fragment slot="chips">
      <span>Booking · Q3 2026</span>
      <span>·</span>
      <span>IDR / USD</span>
    </Fragment>
  </EditorialHero>

  <Section id="work" pad="default">
    <div class="rc-home-feat__head">
      <span class="rc-label">Selected work</span>
      <h2>Made for clients who notice the details.</h2>
    </div>
    <div class="rc-home-feat__grid">
      <WorkCard
        href="/work/parallaxnet-canada"
        title="Parallaxnet Canada"
        year="2026"
        kind="Custom website"
        image="/IMG/og-default.png"
        imageAlt="Parallaxnet Canada case study cover"
        size="lg"
      />
      <WorkCard
        href="/work"
        title="More case studies coming."
        year="2026"
        kind="In production"
        image="/IMG/og-default.png"
        imageAlt=""
        size="sm"
      />
    </div>
  </Section>

  <Section id="studio" bg="elev" pad="default">
    <div class="rc-home-studio">
      <div class="rc-home-studio__media">
        <div class="rc-home-studio__portrait" aria-hidden="true"></div>
      </div>
      <div class="rc-home-studio__copy">
        <span class="rc-label">The studio</span>
        <h2><em>A solo studio</em> in Salatiga, building for the world.</h2>
        <p>Rielcode is run by Azriel — a developer and informatics engineering student who treats each website as an editorial product, not a template fill.</p>
        <ul class="rc-home-studio__stats">
          <li><strong>4+</strong><span>years writing for the web</span></li>
          <li><strong>20+</strong><span>projects shipped</span></li>
          <li><strong>3</strong><span>countries served</span></li>
        </ul>
      </div>
    </div>
  </Section>

  <Section id="services" pad="default">
    <div class="rc-home-feat__head">
      <span class="rc-label">Services</span>
      <h2>Three ways to work together.</h2>
    </div>
    <div class="rc-home-services">
      <ServiceCard
        title="Landing"
        priceIdr="IDR 4M"
        priceUsd="$260"
        description="A single high-conversion page. Copy, design, build, ship — in two weeks."
        href="/services#landing"
      />
      <ServiceCard
        title="Custom"
        priceIdr="IDR 8–12M"
        priceUsd="$520–780"
        description="A bespoke multi-page site, designed and developed end-to-end."
        href="/services#custom"
      />
      <ServiceCard
        title="E-commerce"
        priceIdr="IDR 15M+"
        priceUsd="$980+"
        description="Simple storefronts for small catalogues. Payment + inventory included."
        href="/services#ecom"
      />
    </div>
  </Section>

  <Section id="testimonials" pad="default">
    <figure class="rc-home-quote">
      <blockquote>
        <p><em>“Worked with intention from brief to launch. The site feels considered, not generated.”</em></p>
      </blockquote>
      <figcaption>
        <span class="rc-label">Ali · Parallaxnet Canada</span>
      </figcaption>
    </figure>
  </Section>

  <CTABand
    eyebrow="Booking Q3 2026"
    heading="Have a project in mind? Let's make it well."
    ctaText="Start a project"
    ctaHref="/contact"
  />
</BaseLayout>

<style>
  .rc-home-feat__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-8);
    margin-bottom: var(--space-12);
    flex-wrap: wrap;
  }
  .rc-home-feat__head h2 {
    font-family: var(--rc-font-display);
    font-size: clamp(32px, 4vw, 56px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    max-width: 18ch;
    margin: 0;
  }
  .rc-home-feat__grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-12);
    align-items: start;
  }
  .rc-home-feat__grid > :nth-child(2) { margin-top: var(--space-16); }

  .rc-home-studio {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: var(--space-16);
    align-items: center;
  }
  .rc-home-studio__portrait {
    aspect-ratio: 4 / 5;
    background: linear-gradient(135deg, var(--rc-forest), var(--rc-forest-mid));
    border-radius: var(--radius-md);
    width: 100%;
  }
  .rc-home-studio__copy h2 {
    font-family: var(--rc-font-display);
    font-size: clamp(32px, 4vw, 56px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: var(--space-3) 0 var(--space-6) 0;
  }
  .rc-home-studio__copy h2 em { font-style: italic; }
  .rc-home-studio__stats {
    list-style: none; padding: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-top: var(--space-8);
  }
  .rc-home-studio__stats li { display: flex; flex-direction: column; gap: 4px; }
  .rc-home-studio__stats strong {
    font-family: var(--rc-font-display);
    font-size: var(--fs-h1);
    font-style: italic;
  }
  .rc-home-studio__stats span { color: var(--rc-text-muted); font-size: var(--fs-body-sm); }

  .rc-home-services {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }

  .rc-home-quote {
    margin: 0 auto;
    max-width: 60ch;
    text-align: center;
  }
  .rc-home-quote blockquote {
    margin: 0;
    font-family: var(--rc-font-display);
    font-size: clamp(28px, 3.4vw, 44px);
    line-height: 1.2;
    color: var(--rc-text);
  }
  .rc-home-quote figcaption {
    margin-top: var(--space-6);
    color: var(--rc-text-muted);
  }

  @media (max-width: 899px) {
    .rc-home-feat__grid,
    .rc-home-studio,
    .rc-home-services { grid-template-columns: 1fr; }
    .rc-home-feat__grid > :nth-child(2) { margin-top: 0; }
  }
</style>
```

- [ ] **Step 2: Visual test on desktop**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev
```
Open http://localhost:4321/. Verify, top-down:
  1. Hero shows "Websites with" italic, "uncommon polish." roman, two CTAs, chips
  2. "Selected work" grid: large Parallaxnet card + small offset card
  3. Studio section on cream-elev background with forest portrait block + stats
  4. Three service cards with IDR + USD pricing
  5. Centered Fraunces quote
  6. Forest CTA band with cream text + arrow CTA
  7. Footer renders with theme toggle

No console errors. Theme toggle still works site-wide.

- [ ] **Step 3: Visual test on mobile (DevTools 375px)**

Resize to 375px. Verify: hero text scales, grids collapse to one column, nav burger appears, drawer opens on tap.

- [ ] **Step 4: Production build verification**

```bash
npm run build
```
Expected: exits 0. `dist/index.html` is produced. No font 404s in the build output.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(phase-2/2C): rebuild / home with editorial sections + new components"
```

---

### Task 18: Take baseline screenshot for spec record

**Files:**
- Create: `screenshots/phase-2/home-2C-baseline.png` (in JARVIS repo, not Astro repo)

- [ ] **Step 1: Start dev server in background**

```bash
cd C:/xampp/htdocs/rielcode-astro
npm run dev &
```
Wait for "Local: http://localhost:4321/" line.

- [ ] **Step 2: Screenshot via /url-screenshot skill**

From JARVIS working dir, run:
```
/url-screenshot http://localhost:4321/
```
Skill saves to JARVIS `screenshots/`. Rename to `screenshots/phase-2/home-2C-baseline.png`.

- [ ] **Step 3: Stop dev server**

Kill the background `npm run dev` process.

- [ ] **Step 4: Commit screenshot to JARVIS repo**

```bash
cd c:/Users/afw14/OneDrive/Documents/JARVIS
git add screenshots/phase-2/home-2C-baseline.png
git commit -m "docs(rielcode/phase-2): baseline screenshot for tracks 2A-2C handoff"
```

---

### Task 19: Update Phase 2 spec — mark tracks 2A-2C done, note handoff state

**Files:**
- Modify: `docs/superpowers/specs/2026-05-21-rielcode-phase-2-redesign-design.md`

- [ ] **Step 1: Edit the spec's Execution Plan section**

Replace the existing `## Execution Plan (preview, full plan via writing-plans next)` block with this updated version that records progress:

```markdown
## Execution Plan

**Status (2026-05-21):** Tracks 2A → 2C shipped on `rielcode-astro` repo, branch `main`. Tags: `phase-2-2A-complete`, `phase-2-2B-complete`. Home (`/`) live on new design language. Remaining pages still render Phase 1 snapshots — visible drift between `/` and the rest is expected until 2D-2G land.

Track 2A — tokens + fonts + theme toggle ✅
Track 2B — global components (Nav, Footer, CTABand, ThemeToggle, Button, Section, Card) ✅
Track 2C — `/` home redesign ✅
Track 2D — `/work` index + `/work/[slug]` template + Parallaxnet case study (stub content)
Track 2E — `/studio`
Track 2F — `/services`
Track 2G — `/contact` + utility pages (`/404`, `/privacy`, `/terms`) restyle
Track 2H — motion layer (GSAP, ScrollTrigger, view transitions, reduced-motion)
Track 2I — content collections migration + snapshot deletion + 301 redirects
Track 2J — visual QA + Playwright screenshot diff + Lighthouse + accessibility pass

Next session: pick up at Track 2D. Plan path for 2A-2C: `docs/superpowers/plans/2026-05-21-rielcode-phase-2-tracks-2A-2C.md`.
```

- [ ] **Step 2: Commit spec update in JARVIS repo**

```bash
cd c:/Users/afw14/OneDrive/Documents/JARVIS
git add docs/superpowers/specs/2026-05-21-rielcode-phase-2-redesign-design.md
git commit -m "docs(rielcode/phase-2): mark tracks 2A-2C complete in spec"
```

---

### Task 20: Final tag + handoff

- [ ] **Step 1: Tag Astro repo**

```bash
cd C:/xampp/htdocs/rielcode-astro
git tag phase-2-2C-complete
```

- [ ] **Step 2: Report status to user**

Confirm in chat: tracks 2A-2C shipped, home page redesigned, foundation ready for 2D onward in next session.

---

## Self-Review Notes

- Spec §Visual Direction (palette, typography, motion) — covered in Task 2 (palette) + Task 3 (font-face) + Task 4 (preload). Motion deferred to 2H per scope decision.
- Spec §IA (9 routes) — only `/` rewritten this slice. Other routes still render Phase 1 snapshots; nav already points to new URLs (`/work`, `/studio`, `/services`, `/contact`) so future tracks just need to add the page files.
- Spec §Page-Level Design `/` — all 6 sections in Task 17 (hero, featured work, studio brief, services preview, testimonials, CTA band).
- Spec §Component System — EditorialHero, WorkCard, ServiceCard, CTABand, ThemeToggle, Nav, Footer all built. FAQAccordion + CaseStudySection deferred to their respective track. Button/Card/Section refactored.
- Spec §Tokens — Task 2 implements full block including dark theme overrides.
- Spec §Data Migration — explicitly deferred to Track 2I per spec.
- Spec §Out of Scope — respected.
- Tag names consistent (`phase-2-2A-complete`, `2B`, `2C`). Component names consistent across tasks. Token names (`--rc-bg`, `--rc-text`, `--rc-accent`, etc.) consistent between tokens.css, components, and pages.
