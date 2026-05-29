# Stage 4: Performance Optimization

**Goal:** Site loads fast on mobile 4G in Indonesia. Database queries don't choke under realistic load.

## Why this matters
Indonesian mobile networks are inconsistent. A site that loads in 3 seconds on your wifi may take 12 seconds on a client's 4G in Salatiga, and they'll judge the work by that experience.

## Steps

### 1. Lighthouse / PageSpeed audit
- Run https://pagespeed.web.dev/ against staging URL
- Target scores (mobile): Performance 85+, Accessibility 95+, Best Practices 95+, SEO 95+
- If Performance < 85, attack the largest opportunities first (LCP, TBT, CLS)

### 2. Image optimization
- Convert hero images to WebP or AVIF (50-70% smaller than JPG)
- Compress all images: https://squoosh.app/ or `cwebp` CLI
- Lazy-load below-the-fold images: `<img loading="lazy">`
- Use `srcset` for responsive images (mobile vs desktop sources)

### 3. Minify & compress
- Minify CSS and JS in production build
- Enable gzip or brotli at server level:
  - Apache: `mod_deflate` (gzip) — usually default on
  - Nginx: `gzip on; gzip_types ...;`
- Confirm compression active via DevTools → Network → Response Headers (look for `content-encoding: gzip`)

### 4. Database profiling
- Enable slow query log briefly on staging (queries >100ms)
- For PHP: install Clockwork or use Xdebug profiler
- Add indexes on columns used in WHERE, JOIN, ORDER BY
- N+1 query check: list page loading 50 rows should NOT fire 51 queries

### 5. Server resource baseline
- Note baseline CPU %, RAM %, disk I/O on staging under typical load
- If shared hosting (Niagahoster, etc): check the plan's PHP memory limit and max_execution_time
- Stress test with `ab` or `siege` (50 concurrent requests for 30s) — should not error out

## Done when
All 5 substeps checked, Lighthouse mobile Performance ≥85. Run `/deploy complete [slug] 4`.
