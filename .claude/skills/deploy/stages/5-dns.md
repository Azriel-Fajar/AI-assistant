# Stage 5: Domain & DNS Setup

**Goal:** Domain resolves to the right server, HTTPS works everywhere, email DNS doesn't get the domain blacklisted.

## Why this matters
DNS misconfiguration is the most common launch-day disaster. Set it up at least 48 hours before go-live so propagation has time to finish.

## Steps

### 1. Point domain to server / hosting
- Get the IP address (A record) or CNAME target from hosting provider
- At the registrar (Niagahoster, Namecheap, GoDaddy, etc.):
  - A record: `@` → IP
  - A record: `www` → IP  (or CNAME `www` → `@`)
- TTL: drop to 300 seconds (5 min) during launch week, raise to 3600 after stable

### 2. SSL certificate
- Let's Encrypt (free) via Certbot or hosting panel — most hosts auto-install
- Confirm certificate covers both apex AND `www` subdomain
- Validate via https://www.ssllabs.com/ssltest/ → target grade A or A+
- Set auto-renewal (cron job or hosting panel toggle)

### 3. www <-> non-www redirect
- Pick one canonical version (apex `rielcode.com` OR `www.rielcode.com`)
- 301 redirect the other → canonical
- Update `<link rel="canonical">` tags in HTML to match

### 4. Email DNS (only if domain sends email)
- If using Google Workspace, Brevo, Niagahoster mail:
  - **MX** records → provider's mail servers
  - **SPF**: `v=spf1 include:[provider] ~all`
  - **DKIM**: provider gives a TXT record to add
  - **DMARC**: start with `v=DMARC1; p=none; rua=mailto:postmaster@yourdomain`
- Verify via https://mxtoolbox.com/

### 5. Verify propagation
- https://www.whatsmydns.net/ — check A record from multiple global locations
- All locations should show the new IP within 24-48 hours
- If still split after 48h, lower TTL and wait another cycle

## Done when
All 5 substeps checked, https://[domain] loads with valid cert from multiple locations. Run `/deploy complete [slug] 5`.
