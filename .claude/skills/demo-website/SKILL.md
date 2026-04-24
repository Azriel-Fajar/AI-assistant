---
name: demo-website
description: Use when Azriel needs to build a demo landing page for a potential client (outreach or inbound). Asks for business name and industry, then generates a tailored modern minimalistic one-page landing page saved to htdocs.
argument-hint: "[business name] [industry]"
---

## What This Skill Does

Builds a polished, modern minimalistic one-page demo landing page tailored to a potential client's business. Used to show leads what their site could look like before they commit. Output saved to `C:\xampp\htdocs\`. Uses frontend-design principles -- Tailwind CSS, anti-generic guardrails, and screenshot review.

## Steps

### 1. Gather client details

Ask for the following in one message (if not already provided via `$ARGUMENTS`):

- Business name
- Industry or niche (e.g. cafe, barbershop, dental clinic, clothing store, gym)
- Any known brand colors? (optional -- say "skip" if unknown)
- Any specific sections to include? (optional -- e.g. menu, gallery, pricing, testimonials)

Only ask for what is missing. If the user already passed arguments like `/demo-website Kopi Langit cafe`, parse those and skip asking.

---

### 2. Plan the design

**Aesthetic:** Modern minimalistic -- high whitespace, max 3 colors, clear hierarchy, minimal decoration.

**Color scheme** (pick one custom palette per niche -- never use default Tailwind blue/indigo):

| Industry | Primary | Accent | Background |
|---|---|---|---|
| Cafe / coffee shop | `#3B2A1A` (espresso) | `#C8A97E` (latte) | `#FAF7F2` |
| Restaurant / food | `#1E1007` (dark roast) | `#D4622A` (ember) | `#FDFAF6` |
| Barbershop / salon | `#111111` (jet) | `#C9A84C` (gold) | `#F9F9F9` |
| Dental / clinic | `#1A3A4A` (slate) | `#4AADCA` (sky) | `#F7FAFB` |
| Gym / fitness | `#0D0D0D` (black) | `#E63C2F` (red) | `#F5F5F5` |
| Clothing / fashion | `#1C1C1C` (charcoal) | `#B89F85` (sand) | `#FAFAFA` |
| Generic / unknown | `#1A1F2E` (navy) | `#6C8EBF` (steel) | `#F8F9FB` |

If the user provided brand colors, use those instead. Derive tints/shades from the provided hex values.

**Sections** (standard set, adjust by niche):
1. Navbar -- business name, nav links, single CTA button
2. Hero -- bold headline, one-line subheadline, CTA button, full-viewport height
3. About -- 2-column layout: short copy left, image placeholder right
4. Services / Menu / Products -- 3-column card grid
5. Testimonials -- 2-3 cards with initials avatar and quote
6. Contact -- left: address + phone placeholders; right: simple form (no backend)
7. Footer -- business name, copyright, minimal links

---

### 3. Generate the project

Create folder: `C:\xampp\htdocs\[business-name-demo]\` (lowercase, hyphens, append `-demo`).

File structure:
```
[business-name-demo]/
└── index.html
```

**`index.html`** -- single file, all styles inline or via `<style>` block. Rules:

**Stack:**
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Google Fonts: pair a display/serif with a clean sans (e.g. `Playfair Display` + `Inter`, `DM Serif Display` + `DM Sans`, `Cormorant` + `Outfit`)
- No Bootstrap. No jQuery. No build tools.

**Anti-generic guardrails (apply every time):**
- Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the custom hex colors from step 2 via inline `style=""` attributes or a `tailwind.config` script block.
- Shadows: layered, color-tinted with low opacity -- e.g. `box-shadow: 0 4px 6px -1px rgba(60,40,20,0.08), 0 10px 30px -5px rgba(60,40,20,0.12)`. Never flat `shadow-md`.
- Typography: `letter-spacing: -0.03em` on large headings. `line-height: 1.7` on body text.
- Every clickable element must have hover, focus-visible, and active states.
- Navbar: sticky, transitions to frosted glass (`backdrop-blur`, subtle border-bottom) on scroll via minimal JS.
- Hero section: full viewport height (`min-h-screen`), vertically centered, no image backgrounds -- use a strong typographic statement instead.
- Cards: clean border `1px solid rgba(0,0,0,0.06)`, gentle shadow, `border-radius: 12px`, generous padding.
- Spacing: consistent scale -- use `gap-6`, `gap-12`, `py-24`, `px-6` as base tokens. Generous whitespace is the aesthetic.
- Images: all use `https://placehold.co/WIDTHxHEIGHT/BG/FG` with industry-appropriate color tones.

**Copy rules:**
- No Lorem Ipsum. Write realistic placeholder copy for the niche.
- Fake but plausible: business taglines, service names, testimonials, addresses.
- CTA buttons match the niche: "Book a Table", "Get a Haircut", "Schedule a Consultation", "Shop Now", etc.

**JS rules:**
- Smooth scroll: `scroll-behavior: smooth` on `<html>`.
- Navbar scroll behavior: minimal vanilla JS, no jQuery.
- No other JS needed.

---

### 4. Screenshot and review

After generating the file:

1. Open via XAMPP: `http://localhost/[business-name-demo]/`
2. Screenshot: `node screenshot.mjs http://localhost/[business-name-demo]/`
3. Read the screenshot with the Read tool and review visually.
4. Check: spacing, font pairing, color contrast, card styling, hero impact, mobile feel.
5. Fix any issues and screenshot again. Do at least 2 rounds. Stop when it looks production-ready.

---

### 5. Report to the user

- List the file created and the output path
- State the color scheme and font pairing used
- Mention the sections included

Then ask:
"Want me to draft a WhatsApp message to send this demo to the client (/follow-up), or generate a proposal for this project (/client-proposal)?"

---

## Rules

- No emojis in generated content.
- No Lorem Ipsum -- write realistic placeholder copy.
- All images use `https://placehold.co/` -- no external images.
- No Bootstrap. Use Tailwind CSS CDN only.
- Never use default Tailwind blue/indigo as a primary color.
- No "Demo" watermark or label anywhere on the page.
- The demo must look like a real client site, not a template.
- Do at least 2 screenshot comparison rounds before reporting done.
