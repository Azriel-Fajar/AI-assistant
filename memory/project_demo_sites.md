---
name: Rielcode Demo Sites
description: 11 demo websites for prospects (8 static niche + 3 interactive commerce) at public/demos/ in rielcode-laravel, served at rielcode.com/demos/{slug}/
metadata:
  type: project
---

Built 2026-06-06 to send prospects an example site for their industry. Library of demo websites under `C:\xampp\htdocs\rielcode-laravel\public\demos\`. Drop one link in WhatsApp to show a prospect what their site could look like.

**Count = 11 demos.** Hub at `public/demos/index.html` shows ALL 11. Main-site homepage (`#demos` in `home.blade.php`) shows a curated 8 (3 commerce first, then restaurant, dental, real-estate, company, gym; beauty-salon/tour-travel/logistics dropped from homepage but stay on hub + live by URL).

**Original 8 static niche demos** (built 2026-06-06): restaurant-cafe (Ember & Oak, menu filter), dental-clinic (Brightsmile, appointment booking), gym-fitness (Ironclad, dark theme, class schedule tabs), real-estate (Crestview, property search filter), beauty-salon (Lumiere, booking picker), tour-travel (Wander Co, package filter), logistics (SwiftLine, shipment tracking timeline), company (Northpeak, stat counters + tabs). Each = 5 files (index/services/contact .html + style.css + app.js), cream/forest theme.

**3 interactive commerce demos** (built 2026-06-21, fully verified): different from the static 8 — real no-backend interactivity via localStorage.
- `ecommerce-fashion` (Lumea) — fashion store: shop filter+search, cart drawer, product variants, checkout + fake order (LUM-xxxxxx). 6 files. Covers po Cust 8,13,20.
- `catalog-fnb` (Saji) — F&B catalog: browse+filter, product detail, "Order via WhatsApp" prefilled wa.me link (rebuilds on portion/qty), company-profile home. 5 files, NO cart. Covers po Cust 16,14,19.
- `ecommerce-reseller` (Volt) — e-bike store + reseller portal: storefront (cart+checkout) PLUS login/register (fake auth, demo creds reseller@volt.demo/volt1234), auth-gated dashboard (KPIs, order-at-reseller-price, order history, downline list). 8 files. Covers po Cust 21.

**Tech:** pure static HTML/CSS/JS, NO Laravel routes, NO Blade, NO Vite build (do not run npm build). English copy. Mobile-responsive + hamburger. Forms fake-submit. Images = Unsplash hotlinks (verify content-type=image before using; dead IDs serve 404 text/html → ERR_BLOCKED_BY_ORB) + Google Fonts CDN.

**Homepage cards** need 5 things per slug: `$demos` array entry (home.blade.php), EN + ID lang keys (`lang/{en,id}/home.php`), thumbnail jpg (`public/demos/assets/thumbs/{slug}.jpg`, 800x600), LQIP entry (`resources/lqip-manifest.json`). `lqip_for()` returns null gracefully if missing. Hub cards need only a NICHES entry in `assets/hub.js` (data-only).

**Serving:** local dev `http://127.0.0.1:8000/demos/` (artisan serve) or XAMPP. Prod = `rielcode.com/demos/{slug}/` (trailing slash). NEVER `demo.rielcode.com`. See [[feedback_demo_url_base]] and [[feedback_static_trailing_slash]].

Lives inside live app [[project_rielcode_laravel_app]]; demos themselves are static (public/demos/), but the homepage-curation edit DID touch app files (blade + lang + lqip-manifest).
