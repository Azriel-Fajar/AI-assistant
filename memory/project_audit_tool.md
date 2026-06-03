---
name: Rielcode Audit Tool
description: Free website audit lead-gen tool at rielcode.com/audit, all 3 phases built 2026-06-03, deploys to Rumahweb
metadata:
  type: project
---

Public lead-gen tool: prospect enters URL + email at rielcode.com/audit, gets instant on-page score + branded PDF report emailed, with Rielcode WhatsApp CTA inside. Built 2026-06-03 via `/audit-tool-launch`. Lives in `Rielcode/audit/` (PHP).

**Architecture (all PHP, no Node):**
- `audit/index.php` form, `submit.php` (validate + honeypot + insert), `result.php` (score band + top issues).
- `audit/inc/audit-engine.php` -- `rc_run_audit($url)`: pure PHP cURL + DOMDocument, 9 weighted checks (mobile/title/metadesc/h1/alt/speed/ssl/contact/cta), 0-100. No Playwright -- Rumahweb has no Node ([[reference_rumahweb_hosting]]).
- `audit/inc/pdf-report.php` -- dompdf branded PDF. `audit/inc/send-report.php` -- PHPMailer via smtp_config.php, attaches PDF, BCC to info@rielcode.com.
- Table `audit_leads` (sql/audit_leads.sql): audit_id, url, email, score, checks_json, load_time_ms, status.
- Admin view: `admin.php?table=audit_leads` (sidebar "Audit Leads"), read-only list.
- Site nav: "Free Audit" link in navbar.php.
- Hardening: per-IP rate limit via `rc_rate_check` (30/hr, 200/day, reuses inc/rate_limiter.php + inc/ip.php); 404 not-found page for bad audit_id; `error=toolong`/`ratelimit` form messages; maxlength=500 on URL. Honeypot field = name="website" (hidden, must stay empty), NOT a real input.

**Why:** Compounding lead engine that runs while Azriel sleeps; refills top of funnel. Chosen over warming cold leads as the higher long-term ROI idle-time project.

**How to apply:**
- Known limitation: pure-PHP scoring sees pre-render HTML, so JS SPAs (e.g. google.com) score low. Fine for target market (static small-business sites).
- NOT YET DONE: admin "mark contacted" + per-lead WhatsApp deep-link (the medium-effort follow-up view). Phase 3 PDF preview never image-verified (no pdftoppm; PDF bytes valid).
- Timezone skew: PHP date()=UTC, MySQL NOW()=local (~5hr gap). Rate limiter self-consistent (PHP both sides) so unaffected, but audit_leads.created_at (DB time) vs rate windows (PHP time) differ. Align later via php date.timezone=Asia/Jakarta.
- STATUS as of 2026-06-03: feature-complete + verified locally (real Apache). NOT deployed to Rumahweb. NOT committed to git.
- Deploy to Rumahweb: upload `audit/` + edited admin.php + navbar.php + inc/admin_sidebar.php, run `sql/audit_leads.sql` on prod DB, confirm smtp_config.php present, needs PHP curl+dom exts, smoke test own URL.
- Post-launch (from skill): add /audit to YT+IG bios, 3 YT Shorts demo, manual 1-line follow-up on first 50.
- Related: [[project_meta_ads_wa_lead_gen]] (other lead source), [[project_testimonials_system]] (same admin.php table pattern).
