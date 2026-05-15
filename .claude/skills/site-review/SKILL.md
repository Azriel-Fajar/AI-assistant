---
name: site-review
description: Use when Azriel wants to review a website (client site, prospect site, or his own) and get auto-calculated cost estimate + upgrade suggestions based on Rielcode pricing. Detects features (forms, e-commerce, chatbot, schema, speed, SEO, analytics), maps to price tags, outputs quote-ready breakdown.
---

## What This Skill Does

Reviews any live website and outputs:
1. Feature inventory (what the site has and lacks)
2. Cost estimate to build it from scratch at Rielcode rates
3. Upgrade suggestions to make Azriel's workflow more automatic and the site more valuable
4. Optional: WhatsApp-ready upsell message for an existing client

**Use cases:**
- Reviewing a prospect's current site before quoting a rebuild
- Reviewing a delivered client site to suggest upgrades (upsell)
- Reviewing competitors to benchmark Rielcode pricing
- Reviewing Azriel's own portfolio/projects

## Pricing Reference

Pricing rates live in `references/rielcode-pricing.md`. If file is missing or empty on first run, the skill prompts Azriel to fill it in and saves. Default starter structure:

```
BASE PACKAGES (IDR):
- Landing page (1 page, static): 2,000,000
- Custom website (3-5 pages): 4,000,000
- Simple e-commerce (up to 20 products): 7,000,000

ADD-ONS (IDR):
- Contact form: 300,000
- Multi-step / advanced form: 700,000
- Booking/scheduling form: 1,000,000
- Live chat / chatbot: 1,500,000
- Blog / CMS: 1,500,000
- Multi-language: 1,200,000
- Payment gateway (Midtrans/Xendit): 1,500,000
- SEO setup (meta, schema, sitemap): 800,000
- Google Analytics + Tag Manager: 400,000
- WhatsApp integration: 200,000
- Custom animations: 600,000
- Speed optimization: 700,000
- Hosting setup + domain: 500,000

MAINTENANCE (IDR/mo):
- Basic (uptime, small edits): 300,000
- Pro (content updates, security): 600,000
```

## Steps

### 1. Get URL + intent

Ask in one message:
- URL to review?
- Intent? (1 = prospect quote, 2 = upsell existing client, 3 = competitor benchmark, 4 = my own site audit)
- Client name? (only if intent = 1 or 2)

### 2. Check pricing file

Read `references/rielcode-pricing.md`. If missing, create with default structure above. Tell Azriel: "Pricing file initialized at references/rielcode-pricing.md. Review and edit anytime."

### 3. Run site audit

Use `/url-screenshot` for full-page snapshot. Use Playwright (already installed) to scrape:
- Page count (crawl internal links, max depth 2)
- Forms detected
- E-commerce indicators (cart, product grid, checkout)
- Chat widget detection
- Analytics scripts (GA, GTM, Meta Pixel)
- SEO basics (meta description, OG tags, schema.org JSON-LD, sitemap.xml, robots.txt)
- WhatsApp/contact CTAs
- Page speed proxy (DOM ready time, image weight)
- Language toggles
- Blog/CMS indicators

Output feature matrix:

```
DETECTED:
- [x] Landing page (1 page)
- [x] Contact form
- [ ] Multi-language
- [ ] Schema markup
...
```

### 4. Calculate cost

Sum matched line items from pricing file:

```
COST TO BUILD AT RIELCODE RATES:
- Custom website (3 pages):        4,000,000
- Contact form:                      300,000
- Google Analytics setup:            400,000
- WhatsApp integration:              200,000
                                  ----------
TOTAL:                             4,900,000 IDR
```

### 5. Upgrade suggestions

For each MISSING high-impact feature, suggest with reason + price:

```
RECOMMENDED UPGRADES:
1. SEO setup (meta, schema, sitemap) -- 800,000 IDR
   Why: site has no schema, will hurt Google ranking.
2. Speed optimization -- 700,000 IDR
   Why: images uncompressed, hero loads slow.
3. Chatbot -- 1,500,000 IDR
   Why: no live capture for off-hours leads.
```

Rank by impact (lead-gen value to client).

### 6. Output by intent

- **Intent 1 (prospect quote):** Format as draft proposal-ready breakdown. Offer to run `/client-proposal`.
- **Intent 2 (upsell existing):** Generate WhatsApp message draft offering top 1-2 upgrades. Offer to run `/follow-up`.
- **Intent 3 (competitor):** Show cost gap vs Rielcode rate. Note positioning insight.
- **Intent 4 (own site):** Show what to fix on portfolio.rielcode.com or wherever.

### 7. Save review

Save full report to `projects/[client-or-domain]/site-review-YYYY-MM-DD.md`. If client folder doesn't exist, create it.

### 8. Workflow upgrade scan (bonus)

End every review with one suggestion to make Azriel's own workflow more automatic. Examples:
- "You reviewed 3 sites this week -- consider a `/weekly-prospects` skill that batches site reviews."
- "This client has had 2 upsells -- add to `lead-tracker` with upsell tag."

## Rules

- Always use IDR (Indonesian Rupiah). Don't mix currencies.
- Never quote without checking `references/rielcode-pricing.md` first.
- Don't invent prices -- if a detected feature isn't in pricing file, flag it: `[NEEDS PRICING: feature-name]`
- Maintenance fees are NOT included in build cost unless asked.
- For upsell intent, never push more than 3 upgrades in one message (overwhelms client).
- Screenshots saved to `screenshots/` are reference only -- don't include them in proposal output unless asked.
