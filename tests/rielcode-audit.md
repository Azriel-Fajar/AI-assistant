# Rielcode Site Audit Report
**Date:** 2026-05-11
**Auditor:** Playwright automated test (headed Chromium)
**Base URL:** http://localhost/Rielcode/

## Console Errors
- None detected

## Broken Images
- None detected

## Layout Issues
- None detected

## Form Behavior
- Name field [name="nama"]: found and filled
- Package radio: Starter Plan label clicked
- First addon checkbox: force-checked (custom-styled input)
- Order form POST intercepted — returned mock 200, no DB write
- Submit clicked — POST was intercepted/aborted

## Misc Notes
- Hero section: found and visible
- Chatbot icon #chatbot-icon: visible
- CTA link to order-form: found
- Mobile nav #rc-mnav: opened successfully
- Mobile nav close button: works
- Package cards with CTA found: 5
- Package CTA → order-form redirect: OK
- Custom plan pages after +: 2
- Custom plan pages after preset-3: 3
- Custom plan: chatbot toggle clicked
- Custom plan: priority toggle clicked
- Custom plan live price: Rp500.000
- About section: found and scrolled into view
- Projects section: rc-prj__feat / rc-prj__tile cards found
- Testimonials section: present in DOM but hidden (no approved testimonials in DB)
- Broken images on homepage: none

## Screenshots
- screenshots/rielcode-audit/01-homepage-hero.png
- screenshots/rielcode-audit/01-homepage-scrolled.png
- screenshots/rielcode-audit/02-mobile-initial.png
- screenshots/rielcode-audit/02-mobile-menu-open.png
- screenshots/rielcode-audit/02-mobile-scrolled.png
- screenshots/rielcode-audit/03-cta-clicked.png
- screenshots/rielcode-audit/03-packages-all.png
- screenshots/rielcode-audit/04-order-form-blank.png
- screenshots/rielcode-audit/04-order-form-filled.png
- screenshots/rielcode-audit/04-submit-blocked.png
- screenshots/rielcode-audit/05-custom-plan-features-toggled.png
- screenshots/rielcode-audit/05-custom-plan-initial.png
- screenshots/rielcode-audit/06-about.png
- screenshots/rielcode-audit/07-projects.png
- screenshots/rielcode-audit/08-testimonials.png
- screenshots/rielcode-audit/09-broken-image-check.png