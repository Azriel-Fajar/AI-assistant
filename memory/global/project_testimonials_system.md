---
name: Rielcode Testimonials System
description: Testimonial form subdomain + admin panel integration. Location, schema, and what was rebuilt.
type: project
originSessionId: 462fd58e-0096-4d12-b108-99342b45e632
---
Testimonial system lives at `C:\xampp\htdocs\rielcode-testimonials\`. Production subdomain: `testimonials.rielcode.com`.

Admin panel integration is in `C:\xampp\htdocs\Rielcode\admin.php` under `?table=testimonials`.

**Why:** Client submits via one-time token link (sent via WhatsApp post-delivery). Admin reviews pending submissions, approves/rejects, generates new invite tokens.

**How to apply:** Admin panel code was rebuilt after being lost during a GitHub push. The testimonials section includes: pending-first sorted table, approve/reject/delete actions, expandable full detail rows, invite token generator with copy-link buttons, and token history list.

Schema: `C:\xampp\htdocs\rielcode-testimonials\sql\testimonials.sql` -- two tables: `testimonials` and `testimonial_invites`.

DB shared with main rielcode.com site (same connection config).
