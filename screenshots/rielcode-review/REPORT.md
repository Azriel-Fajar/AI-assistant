# Rielcode Page Review

Base: http://localhost/Rielcode
Date: 2026-05-20T05:14:16.866Z

## desktop

| Path | Status | Console errs | Failed assets |
|---|---|---|---|
| /index.php | NAVERR | 0 | 0 |
| /about.php | 200 | 0 | 0 |
| /projects.php | 200 | 0 | 0 |
| /testimonials.php | 200 | 0 | 0 |
| /requirement.php | 200 | 0 | 0 |
| /package.php | 200 | 0 | 0 |
| /admin_login.php | 200 | 2 | 0 |
| /checkout/index.php | 302 | 0 | 0 |
| /client-brief/index.php | 302 | 0 | 0 |
| /client-brief/thanks.php | 200 | 0 | 0 |
| /custom-plan/index.php | 200 | 0 | 0 |
| /order-form/index.php | 200 | 0 | 0 |
| /portfolio/index.php | 200 | 0 | 0 |
| /progress/index.php | 302 | 0 | 0 |
| /referrer/index.php | 404 | 1 | 1 |
| /terms&conditions/index.php | 200 | 0 | 0 |
| /testimonials-app/index.php | 302 | 0 | 0 |
| /testimonials-app/submit.php | 302 | 0 | 0 |
| /testimonials-app/thank-you.php | 200 | 0 | 0 |
| /packages/index.php | 200 | 0 | 0 |

## mobile

| Path | Status | Console errs | Failed assets |
|---|---|---|---|
| /index.php | 200 | 0 | 0 |
| /about.php | 200 | 0 | 0 |
| /projects.php | 200 | 0 | 0 |
| /testimonials.php | 200 | 0 | 0 |
| /requirement.php | 200 | 0 | 0 |
| /package.php | 200 | 0 | 0 |
| /admin_login.php | 200 | 0 | 0 |
| /checkout/index.php | 302 | 0 | 0 |
| /client-brief/index.php | 302 | 0 | 0 |
| /client-brief/thanks.php | 200 | 0 | 0 |
| /custom-plan/index.php | 200 | 0 | 0 |
| /order-form/index.php | 200 | 0 | 0 |
| /portfolio/index.php | 200 | 0 | 0 |
| /progress/index.php | 302 | 0 | 0 |
| /referrer/index.php | 404 | 1 | 1 |
| /terms&conditions/index.php | 200 | 0 | 0 |
| /testimonials-app/index.php | 302 | 0 | 0 |
| /testimonials-app/submit.php | 302 | 0 | 0 |
| /testimonials-app/thank-you.php | 200 | 0 | 0 |
| /packages/index.php | 200 | 0 | 0 |

## Details (issues only)

### [desktop] /index.php
- navError: page.goto: Timeout 20000ms exceeded.
Call log:
[2m  - navigating to "http://localhost/Rielcode/index.php", waiting until "networkidle"[22m

- status: 200

### [desktop] /admin_login.php
- status: 200
- console:
  - Failed to load resource: net::ERR_CONNECTION_TIMED_OUT
  - Failed to load resource: net::ERR_CONNECTION_TIMED_OUT

### [desktop] /referrer/index.php
- status: 404
- console:
  - Failed to load resource: the server responded with a status of 404 (Not Found)
- failed assets:
  - 404 http://localhost/Rielcode/referrer/index.php

### [mobile] /referrer/index.php
- status: 404
- console:
  - Failed to load resource: the server responded with a status of 404 (Not Found)
- failed assets:
  - 404 http://localhost/Rielcode/referrer/index.php
