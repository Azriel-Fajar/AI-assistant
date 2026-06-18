# Lumière — Modern Fine Dining Website (HCI Final Project)

_Date: 2026-06-18_

## Purpose

Team-based HCI final project. A fully responsive restaurant website built with HTML, CSS, and vanilla JS. Demonstrates essential UI/UX principles (consistency, feedback, affordance, accessibility, responsive design, navigation clarity).

Team of 3: Azriel + 2 teammates. Most work done by Azriel (with Claude). Each teammate owns one simple page.

## Stack

- Static HTML + CSS + vanilla JS. No build step.
- Output to XAMPP `htdocs/lumiere/` AND copied into `JARVIS/projects/lumiere-hci/`.

## Visual Direction

- **Concept:** Modern fine dining ("Lumière").
- **Palette:** charcoal `#1a1a1a`, warm gold `#c9a14a`, cream `#f5f1e8`.
- **Type:** Playfair Display (serif display) + Inter (sans body), via Google Fonts.
- **Responsive:** mobile-first; breakpoints 768px (tablet), 1024px (desktop).
- **UX baseline:** sticky nav w/ active-link state, mobile hamburger, focus states, smooth scroll, form validation w/ inline feedback, ARIA labels, AA contrast.

## File Structure

```
lumiere/
├── index.html          Home          — Azriel
├── menu.html           Menu          — Azriel
├── reservation.html    Reservation   — Azriel
├── contact.html        Contact       — Azriel
├── about.html          About         — Mate 1 (stub)
├── gallery.html        Gallery       — Mate 2 (stub)
├── css/style.css       shared tokens + components — Azriel
├── js/main.js          nav toggle, active link, form validation, lightbox — Azriel
├── assets/             images / icons
└── MATE-TASKS.md       per-mate briefs
```

## Shared System (built first)

- `css/style.css`: design tokens (colors, type scale, spacing), reset, sticky nav, footer, buttons, card grid, form styles, responsive utilities. Single source of truth.
- `js/main.js`:
  - Hamburger toggle (mobile nav).
  - Active-link highlighting based on current page.
  - Reservation + Contact form validation (date/time/guests/email), inline error messages, success state.
  - Gallery lightbox (pre-wired so Mate 2 only swaps images).

All pages link the same CSS/JS → consistent look. Mate pages touch content only.

## Page Breakdown

| Page | Owner | Key elements |
|------|-------|--------------|
| Home | Azriel | Hero w/ CTA, featured dishes (3 cards), story teaser, reserve CTA band |
| Menu | Azriel | Tabbed categories (Starters / Mains / Desserts / Drinks), dish cards w/ name + desc + price |
| Reservation | Azriel | Validated form: name, email, date, time, guests, notes. JS inline feedback + success message |
| Contact | Azriel | Contact form + embedded map (iframe) + hours/address block |
| About | Mate 1 | Stub: hero + 3 sections (Our Story / The Chef / Our Values). Nav/footer/CSS pre-wired, `<!-- TODO -->` markers |
| Gallery | Mate 2 | Stub: responsive image grid + lightbox (JS pre-wired). Mate swaps in images + captions |

## Teammate Stubs (full template + stub approach)

Each mate page ships with: linked CSS/JS, working nav, working footer, section skeletons, and `<!-- TODO: Mate fill X -->` comments. Mates write text and swap images only — no layout/CSS work required. Lowest risk to the grade.

`MATE-TASKS.md` contains a short brief per mate: what page, what sections, what to fill, the style rules (don't edit CSS, keep nav/footer, image sizes), and how to preview locally.

## HCI Principles Coverage

- **Consistency:** shared CSS, identical nav/footer across all pages.
- **Feedback:** form validation states, success messages, hover/focus styles.
- **Affordance:** clear button styling, obvious CTAs.
- **Accessibility:** ARIA labels, visible focus, AA contrast, semantic HTML.
- **Responsive:** mobile-first, tested at 3 breakpoints.
- **Navigation clarity:** active-link state, logical structure.

## Success Criteria

- All 6 pages render and are navigable on desktop + mobile.
- Reservation + Contact forms validate and show feedback (no backend needed; JS only).
- No layout overflow at 360px / 768px / 1280px.
- Mate stubs require content-only edits to complete.
- Copy delivered to both `htdocs/lumiere/` and `projects/lumiere-hci/`.

## Out of Scope (YAGNI)

- No backend / database / real reservation persistence.
- No CMS, no framework, no build tooling.
- No payment, no auth, no admin.
