---
name: frontend-design
description: Use when someone asks to build a web page, frontend interface, UI component, website, or HTML/CSS layout. Guides design decisions, screenshot comparison, brand asset usage, and anti-generic guardrails.
---

## What This Skill Does

Guides the creation of production-grade frontend interfaces with high craft and anti-generic aesthetics. Applies every time frontend code is written — no exceptions.

## Steps

1. **Check brand assets.** Before any design work, look inside `brand_assets/`. Use any logos, color guides, or style guides found there. Never use placeholders where real assets exist.

2. **Evaluate the input.**
   - If a reference image is provided: match layout, spacing, typography, and color exactly. Use placeholder content (`https://placehold.co/`, generic copy). Do not improve or add to the design.
   - If no reference image: design from scratch following the Anti-Generic Guardrails below.

3. **Write the output.**
   - Single `index.html` with all styles inline, unless the user specifies otherwise.
   - Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
   - Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
   - Mobile-first responsive.

4. **Start the local server.**
   - Run `node serve.mjs` in the background (serves project root at `http://localhost:3000`).
   - Do not start a second instance if it is already running.

5. **Screenshot and compare.**
   - Screenshot: `node screenshot.mjs http://localhost:3000`
   - Screenshots auto-save to `./temporary screenshots/screenshot-N.png`.
   - Optional label: `node screenshot.mjs http://localhost:3000 label`
   - Read the PNG with the Read tool and compare visually.
   - When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px".
   - Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.
   - Do **at least 2 comparison rounds**. Stop only when no visible differences remain or the user says so.
   - Never screenshot a `file:///` URL.

---

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces need a layering system (base → elevated → floating).

---

## Hard Rules

- Do not add sections, features, or content not in the reference.
- Do not "improve" a reference design — match it.
- Do not stop after one screenshot pass.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as a primary color.

---

## Environment Notes

- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache at `C:/Users/nateh/.cache/puppeteer/`.
- `serve.mjs` and `screenshot.mjs` both live in the project root. Use them as-is.
