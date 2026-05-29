# Stage 6: Deployment & Rollout

**Goal:** Push to production safely with smoke tests and a tested rollback ready.

## Why this matters
This is the moment everything you built becomes real. Treat it like a surgery — calm, checklist-driven, prepared for the worst case.

## Steps

### 1. Deploy to production
- Trigger the production deploy workflow from Stage 3 (manual or tag-based)
- Watch the deploy log live — do not walk away
- Confirm the deploy artifact is the exact commit you expected (check hash)

### 2. Smoke test on live URL
- Within 5 minutes of deploy:
  - Load homepage — renders, no console errors
  - Test 3 critical user flows (e.g. signup → confirm email → login)
  - Submit one contact form — confirm it arrives
  - If payment: run one test transaction in real production gateway (use a real card for IDR 1000)
- If anything fails: rollback now, do not "fix forward"

### 3. Phased / canary rollout (for high-traffic sites only)
- If client has 1000+ daily users, don't push to 100% at once
- Options:
  - Feature flag (LaunchDarkly free tier, or simple PHP toggle): show new version to 10% of users for 2 hours, then 50%, then 100%
  - DNS-based: weighted Cloudflare load balancer routing
- For typical Rielcode landing-page projects: skip canary, go 100%

### 4. Rollback plan ready
- Confirm Stage 3 rollback procedure still works (test it on staging today)
- Have the rollback command pasted into a terminal tab, ready to fire
- Set a "rollback decision time" — if not stable within 30 min, rollback

### 5. Announce go-live to client
- Send WhatsApp message: "Your site is live at https://[domain]"
- Include:
  - Live URL
  - Admin login URL (no password in chat — that goes in `/project-completion-doc` PDF)
  - "I'll be monitoring for 24h, message me if you spot anything"
- Use `/follow-up` skill if needed

## Done when
All 5 substeps checked, site live and stable for 60 minutes after deploy. Run `/deploy complete [slug] 6`.

## Related skills
- `/follow-up` — client go-live message
- `/project-completion-doc` — handoff PDF (will be available after Stage 7 done)
