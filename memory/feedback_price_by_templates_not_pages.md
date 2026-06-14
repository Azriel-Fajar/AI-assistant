---
name: Price By Templates Not Pages
description: Quote by distinct templates + features, not article/page URL count; Laravel reuses one template for infinite articles
metadata:
  type: feedback
---

When quoting a content-heavy or "clone a big site" project, price by number of DISTINCT templates + backend features, not by URL/article count.

**Why:** Laravel renders infinite article URLs from one Blade template + dynamic route. Article volume is free. The cost lives in: distinct layout types (home, listing, detail, author, search results), CMS (Filament, cheap), search (small addon), and accounts/submission/review workflow (the expensive fork).

**How to apply:** Tier "pages" = distinct designs, not URLs. CMS-driven content site = Premium-shaped (~5jt). User-submitted + peer review + accounts = Custom 13jt+. Ask "does the client POST content himself or do outside users SUBMIT it" to set the price. See [[project_cust3_frontiersin_clone]] and [[reference_rielcode_pricing]].
