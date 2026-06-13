---
name: Rielcode Demo Sites
description: 8 niche demo websites for prospects, static, at public/demos/ in rielcode-laravel, served at http://127.0.0.1:8000/demos/{niche}/
metadata:
  type: project
---

Built 2026-06-06 to send prospects an example site for their industry. Library of static demo websites under `C:\xampp\htdocs\rielcode-laravel\public\demos\`. Drop one link in WhatsApp to show a prospect what their site could look like.

**Structure:**
- Hub at `public/demos/index.html` (+ `assets/hub.css`, `assets/hub.js`) — grid of 8 niche cards, styled in Rielcode main-site theme (cream #f4f1ea + forest #2d4a3a, Fraunces/Inter via Google Fonts CDN).
- 8 niche folders, each 5 files (index/services/contact .html + style.css + app.js), 3 pages = Home + Services + Contact.

**Niches + signature widget:** restaurant-cafe (Ember & Oak, menu filter), dental-clinic (Brightsmile, appointment booking), gym-fitness (Ironclad, dark theme, class schedule tabs), real-estate (Crestview, property search filter), beauty-salon (Lumiere, booking picker), tour-travel (Wander Co, package filter), logistics (SwiftLine, shipment tracking timeline), company (Northpeak, stat counters + tabs).

**Tech:** pure static HTML/CSS/JS, NO Laravel routes, NO Blade, NO Vite build (do not run npm build for these). English copy. Mobile-responsive + hamburger. Forms fake-submit (no backend). Images = Unsplash hotlinks + Google Fonts CDN (needs internet when showing client).

**Serving:** local dev via `http://127.0.0.1:8000/demos/` (artisan serve) or `http://localhost/rielcode-laravel/public/demos/` (XAMPP). Prod = point demo.rielcode.com docroot at public/demos/ (server/vhost step, no app code). See [[feedback_static_trailing_slash]].

Lives inside the live production app [[project_rielcode_laravel_app]] but touches zero app files (only public/demos/ untracked path).
