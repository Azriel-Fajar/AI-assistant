---
name: site-cloner
description: Use when someone asks to clone a website, replicate a site design, copy a website layout, or build a Bootstrap starter project based on a reference URL.
argument-hint: "[reference URL]"
---

## What This Skill Does

Takes a reference website URL, crawls all its pages, analyzes the design system and layout, and generates a complete multi-page Bootstrap 5 project at `C:\xampp\htdocs\[project-name]\`.

## Steps

1. **Get the URL.** Use `$ARGUMENTS` as the reference URL. If no argument was provided, ask the user for it.

2. **Get the project name.** Ask the user: "What should the project folder be named?" The project will be created at `C:\xampp\htdocs\[project-name]\`.

3. **Crawl the site.**
   - Fetch the homepage using WebFetch.
   - Extract all internal links (same domain only — ignore external URLs, anchors, and assets).
   - Fetch each internal page. Cap at 20 pages maximum.
   - If a page redirects to a login form, fetch and analyze the login page itself — do not attempt to authenticate.

4. **Analyze the design system** across all fetched pages:
   - **Colors:** Primary, secondary, background, text, accent (extract from CSS or inline styles)
   - **Typography:** Font families, sizes, weights for headings and body
   - **Spacing:** Padding/margin patterns, container widths
   - **Layout:** Grid structure, breakpoints, column patterns
   - **Bootstrap usage:** Note version and components used if present

5. **Identify components** across all pages. For each unique section found, record:
   - Section name (e.g. navbar, hero, features, testimonials, pricing, footer)
   - Which pages it appears on
   - Its structure (columns, cards, lists, etc.)

6. **Generate the project folder** at `C:\xampp\htdocs\[project-name]\` with this structure:

```
[project-name]/
├── design-breakdown.md
├── index.html
├── [page].html          (one per additional page discovered)
├── css/
│   └── custom.css
└── components/
    └── [component].html (one per unique section)
```

7. **Write `design-breakdown.md`** using the template in the Output Templates section below.

8. **Write `css/custom.css`** with CSS custom properties for all extracted design tokens.

9. **Ask for assets before writing HTML.** After crawling, identify every image and logo needed across all pages (site logo, favicon, hero images, background images, card images, etc.). Present the full list to the user and ask them to provide the files or paths. Wait for the user to supply assets before proceeding. For each asset provided, place it in `images/` and reference it with a relative path (e.g. `images/logo.png`). For any asset the user skips or doesn't have yet, use `https://placehold.co/` as a temporary stand-in.

10. **Write each `[page].html`** using Bootstrap 5 CDN, matching the page's layout and section order. Use semantic HTML. Link to `css/custom.css`. Reference provided assets with relative paths. Use `https://placehold.co/` only for images the user chose to skip.

11. **Write each `components/[component].html`** as a standalone Bootstrap snippet for that section.

12. **Report to the user:** List all files created. Note any pages that couldn't be fully accessed, any JS-heavy sections where content wasn't visible, and any images still using placeholders.

---

## Output Templates

### design-breakdown.md

```markdown
# Design Breakdown: [Site Name]
**Source URL:** [URL]
**Crawled pages:** [list]

## Colors
| Role       | Value    |
|------------|----------|
| Primary    | #xxxxxx  |
| Secondary  | #xxxxxx  |
| Background | #xxxxxx  |
| Text       | #xxxxxx  |
| Accent     | #xxxxxx  |

## Typography
- **Heading font:** [family, weights]
- **Body font:** [family, size, line-height]

## Layout
- **Max container width:** [px or Bootstrap container class]
- **Grid:** [Bootstrap 12-col / custom]
- **Breakpoints used:** [sm, md, lg, xl, xxl]

## Components Found
| Component    | Pages       | Notes                  |
|--------------|-------------|------------------------|
| Navbar       | all         | sticky, dark           |
| Hero         | index       | full-width, centered   |

## Uncrawled Pages (if any)
- [list URLs that were found but not fetched due to the 20-page cap]
```

### css/custom.css

```css
:root {
  --color-primary:   #xxxxxx;
  --color-secondary: #xxxxxx;
  --color-bg:        #xxxxxx;
  --color-text:      #xxxxxx;
  --color-accent:    #xxxxxx;
  --font-heading:    'Font Name', sans-serif;
  --font-body:       'Font Name', sans-serif;
  --container-max:   1200px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg);
}
```

### [page].html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title]</title>
  <!-- Include Google Fonts link here if the reference site uses them -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="css/custom.css" rel="stylesheet">
</head>
<body>

  <!-- [Section name] -->
  [Bootstrap HTML for this section]

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## Notes

- **Structure and styles only** — do not copy proprietary text or images. Use Lorem Ipsum for body text.
- **Images and logos** — always ask the user for assets first (step 9). Only fall back to `https://placehold.co/` for items the user explicitly skips. Save all provided assets to `images/` and reference them with relative paths.
- **Page cap:** If more than 20 internal pages are found, list the extras under "Uncrawled Pages" in `design-breakdown.md` and ask the user if they want to continue.
- **JS-heavy SPAs:** If a page body is mostly empty (content rendered by JS), flag it in the final report rather than generating an empty file.
- **Login-required pages:** Clone the login page form itself. Do not attempt authentication.
- **Bootstrap version:** Default output is Bootstrap 5. If the reference site uses Bootstrap 4 or another framework, note it in `design-breakdown.md` but still generate Bootstrap 5 output unless the user asks otherwise.
- **Google Fonts:** If the reference site loads fonts from Google Fonts, include the same `<link>` tag in each generated HTML `<head>`.
- **Icons:** If the site uses Font Awesome or Bootstrap Icons, include the relevant CDN link in each HTML file.
