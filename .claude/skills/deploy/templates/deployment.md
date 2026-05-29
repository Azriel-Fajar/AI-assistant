---
project: {{PROJECT}}
current_stage: 1
started: {{STARTED}}
last_updated: {{LAST_UPDATED}}
target_launch: {{TARGET_LAUNCH}}
status: active
---

# Deployment Pipeline -- {{PROJECT}}

For full step-by-step guidance on each stage, run `/deploy next {{PROJECT}}` or `/deploy guide [stage-num]`.

---

## Stage 1: QA
Started:
Completed:
- [ ] Set up staging environment that mirrors production
- [ ] Test all features and user flows end-to-end
- [ ] Check edge cases (empty states, errors, slow network)
- [ ] Cross-browser check (Chrome, Firefox, Safari, mobile)
- [ ] Fix all blocker and major bugs
Notes:

---

## Stage 2: Security & Compliance
Started:
Completed:
- [ ] Run automated vulnerability scan (e.g. OWASP ZAP, Snyk)
- [ ] Move all API keys and secrets out of source code into env vars
- [ ] Confirm HTTPS-only, HSTS where applicable
- [ ] Check GDPR / CCPA / Indonesian data privacy compliance if relevant
- [ ] Sanitize all user inputs against XSS and SQL injection
Notes:

---

## Stage 3: CI/CD Automation
Started:
Completed:
- [ ] Set up continuous integration (auto-run tests on push)
- [ ] Configure continuous deployment to staging
- [ ] Add deployment script or pipeline to production
- [ ] Document rollback procedure
Notes:

---

## Stage 4: Performance Optimization
Started:
Completed:
- [ ] Run Lighthouse / PageSpeed audit (target 90+ on mobile)
- [ ] Optimize images (compress, lazy-load, modern formats)
- [ ] Minify CSS / JS, enable gzip / brotli
- [ ] Profile slow database queries and add indexes
- [ ] Check server resource baseline (CPU, RAM, disk)
Notes:

---

## Stage 5: Domain & DNS Setup
Started:
Completed:
- [ ] Point production domain to server / hosting
- [ ] Install valid SSL certificate (Let's Encrypt or paid)
- [ ] Configure www and non-www redirect
- [ ] Set up email DNS (MX, SPF, DKIM, DMARC) if domain sends mail
- [ ] Verify DNS propagation globally
Notes:

---

## Stage 6: Deployment & Rollout
Started:
Completed:
- [ ] Deploy to production server
- [ ] Run smoke test against live site (login, key flows, payment if any)
- [ ] If high-traffic: phased / canary rollout to subset of users first
- [ ] Have a rollback plan ready and tested
- [ ] Announce go-live to client
Notes:

---

## Stage 7: Post-Launch Monitoring
Started:
Completed:
- [ ] Set up APM / error tracking (e.g. Sentry, LogRocket)
- [ ] Configure uptime monitor (e.g. UptimeRobot, Better Stack)
- [ ] Add basic analytics (e.g. GA4, Plausible)
- [ ] Define alert thresholds (downtime, error rate spike)
- [ ] Schedule a 7-day post-launch review with client
Notes:
