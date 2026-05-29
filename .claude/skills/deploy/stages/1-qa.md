# Stage 1: Quality Assurance (QA)

**Goal:** Catch bugs, usability issues, and edge cases before they reach real users.

## Why this matters
Once a site is live and clients are showing it to customers, every bug becomes a credibility hit. QA in staging is cheap; QA in production is expensive.

## Steps

### 1. Set up staging that mirrors production
- Same PHP version, same database engine, same web server config
- Use a separate subdomain or local XAMPP setup
- Use a copy of production data when possible (sanitized of real customer info)

### 2. Test all features end-to-end
- Walk through every user flow: home → key action → conversion
- Login, signup, password reset (if applicable)
- Forms: submit valid data, invalid data, empty fields
- Payment: test mode with at least one real card pattern
- File uploads: try large file, wrong format, empty file
- Admin panel: CRUD operations on every entity

### 3. Edge cases
- Empty states (no products, no leads, no posts)
- Network errors (kill wifi mid-action)
- Slow network (Chrome DevTools throttling: Slow 3G)
- Long content (10,000-char product description, 200-character title)
- Wrong inputs (SQL fragments, HTML in name fields, emojis)
- Mobile keyboard quirks (autocorrect, autocapitalize on email fields)

### 4. Cross-browser
- Chrome (desktop + Android)
- Firefox (desktop)
- Safari (iOS — borrow a phone if no Mac)
- Edge (still 5% of Indonesian traffic)
- Use `/cross-browser-check` skill if heavy frontend

### 5. Fix priorities
- **Blocker:** site crashes, payment broken, login fails — fix before stage 2
- **Major:** wrong data shown, broken feature — fix before stage 2
- **Minor:** styling glitch on rare browser — log in Notes, fix post-launch

## Done when
All 5 substeps in `deployment.md` are checked AND no blocker/major bugs remain. Then run `/deploy complete [slug] 1`.

## Related skills
- `/cross-browser-check` — multi-browser Playwright run
- `/ux-audit` — UX issue scan
- `/build-verify` — smoke test build artifacts
