# Lumière — Teammate Tasks

The website is fully built. Two pages are left for you to fill in. You only write
**text and swap images**. Do not touch CSS, JS, the nav, or the footer.

## Ground rules (both mates)

- Edit only the lines marked `<!-- TODO -->` in your page.
- Do not change classes, the `<header class="nav">` block, the `<footer>` block, or anything in `css/` or `js/`.
- To use a real photo: drop it into the `assets/` folder, then change the `src` (and `data-full` for gallery) to `assets/your-file.jpg`.
- Every image needs a real `alt` description (what is in the photo). This is graded for accessibility.
- Keep text concise. Match the calm, fine-dining tone of the other pages.

## How to preview

1. Make sure XAMPP Apache is running.
2. Open `http://localhost/lumiere/` in your browser.
3. Click your page in the nav. Refresh after each save.
4. Test mobile: open DevTools (F12), toggle device toolbar, check at 360px width — no sideways scrolling.

---

## Mate 1 — About page (`about.html`)

Fill these `<!-- TODO -->` spots:

1. **Header**: page title + one-line intro.
2. **Our Story**: heading + 2–3 sentences on how Lumière began. Swap the photo + write its alt.
3. **The Chef**: chef name as heading + 2–3 sentences about them. Swap the photo + write its alt.
4. **Our Values**: 3 cards. Give each a short title + one or two sentences.

That is it. Layout, nav, footer, and styling are already done.

---

## Mate 2 — Gallery page (`gallery.html`)

The image grid and the click-to-enlarge lightbox already work. You only:

1. For each `<button>` block: replace `src`, `data-full`, and `alt` with your real image.
   - `src` = thumbnail shown in the grid.
   - `data-full` = larger version shown in the lightbox (can be the same file).
   - `alt` = describe the image.
2. To add an image, copy one `<button>...</button>` line and edit it.
   To remove one, delete its `<button>...</button>` line.

Aim for 6–9 images. Do not edit the lightbox markup at the bottom of the page.

---

## Done check (before you hand back)

- [ ] No `<!-- TODO -->` text left visible on the page.
- [ ] Every image has a real `alt` description.
- [ ] Page works on mobile (no horizontal scroll at 360px).
- [ ] Nav highlights your page when you are on it (it does this automatically).
