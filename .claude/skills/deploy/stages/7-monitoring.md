# Stage 7: Post-Launch Monitoring

**Goal:** Catch problems before the client does. Build trust by being the first to know when something breaks.

## Why this matters
Clients judge Rielcode in the 30 days after launch. If you spot and fix issues before they notice, you become indispensable. If they have to tell you about downtime, you look careless.

## Steps

### 1. APM / error tracking
- **Sentry** (free tier: 5k events/month) — for JS errors and PHP exceptions
  - Add Sentry JS snippet to `<head>`
  - Add Sentry PHP SDK to error handler
- Alternative: LogRocket, Bugsnag, Rollbar
- Set alert: notify Azriel on any new error in the first 7 days

### 2. Uptime monitoring
- **UptimeRobot** (free, 50 monitors, 5-min interval) — easiest setup
- **Better Stack** (free tier 10 monitors, 30-second checks) — better alerts
- Monitor at minimum:
  - Homepage HTTP 200 every 5 min
  - 1 critical endpoint (e.g. login page, contact form action)
- Alert via email + ntfy.sh push

### 3. Analytics
- **Plausible** or **Umami** (privacy-first, no cookie banner needed) — preferred
- **GA4** if client specifically asks for Google Analytics
- Track at minimum:
  - Pageviews
  - Conversion event (form submit, signup, purchase)
- Confirm events firing via DevTools or analytics dashboard before declaring done

### 4. Alert thresholds
- Define what triggers a wake-up alert:
  - Site down >2 min
  - Error rate >1% of requests
  - Response time >5 seconds for 3 consecutive checks
- Push channel: `ntfy.sh/rielcode-deploy` or a dedicated alerts channel
- Confirm at least one alert fires correctly (kill the server briefly on staging to test)

### 5. 7-day post-launch review
- Add a Google Calendar event 7 days from go-live:
  - Run `/gcal-schedule` — "Post-launch review: [client]"
- Agenda:
  - Review uptime % and error rate
  - Review traffic and conversions
  - Ask client: anything broken, anything missing
  - Decide: end free support window or extend

## Done when
All 5 substeps checked, at least one real alert tested successfully. Run `/deploy complete [slug] 7`.

After Stage 7 completes, the project's `status` becomes `complete` and `/project-completion-doc` will generate the handoff PDF.

## Related skills
- `/gcal-schedule` — schedule the 7-day review
- `/project-completion-doc` — generate handoff PDF (unlocked after this stage)
