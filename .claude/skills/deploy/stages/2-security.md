# Stage 2: Security & Compliance

**Goal:** Lock down the app against common attacks and meet basic data privacy obligations.

## Why this matters
A breach on a client site is a brand-killer for Rielcode. One leaked API key or one SQL injection can end the relationship and damage your reputation in the Salatiga business community.

## Steps

### 1. Automated vulnerability scan
- Free options:
  - **OWASP ZAP** (desktop, free) — point at staging URL, run baseline scan
  - **Snyk** — for code-level dependency scan (free tier OK)
  - **Mozilla Observatory** (https://observatory.mozilla.org/) — header config grade
- Triage findings: fix all High and Critical before launch

### 2. Secrets out of source
- Grep the codebase for API keys, DB passwords, OpenAI keys, ntfy tokens
- Move every secret into `.env` (PHP: use `vlucas/phpdotenv`)
- Confirm `.env` is in `.gitignore` AND not deployed to webroot
- Rotate any secret that was ever committed (assume compromised)

### 3. HTTPS-only
- Force HTTPS at server level (Apache `.htaccess` redirect or nginx config)
- Set HSTS header: `Strict-Transport-Security: max-age=31536000`
- Confirm SSL chain valid via https://www.ssllabs.com/ssltest/ (target A or A+)

### 4. Indonesian data privacy + GDPR/CCPA
- If site collects emails or any personal data:
  - Add a Privacy Policy page (template: rielcode.com/privacy-policy if available, else generate one)
  - Add cookie consent banner if using GA / Meta Pixel
  - Mention UU PDP (Indonesian Personal Data Protection Law, in force since 2024)
- If client serves EU customers: GDPR clauses (right to delete, data export)

### 5. Input sanitization
- XSS: every user input echoed in HTML must use `htmlspecialchars($input, ENT_QUOTES, 'UTF-8')`
- SQL injection: use PDO prepared statements only, no string concat in queries
- File uploads: whitelist extensions, check MIME server-side, store outside webroot
- CSRF: tokens on all state-changing forms

## Done when
All 5 substeps checked, no High/Critical scan findings. Run `/deploy complete [slug] 2`.

## Related skills
- `/php-chatbot-hardening` — PHP-specific hardening patterns
- `/security-review` — code-level security review
