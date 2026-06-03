---
name: Rielcode Laravel App
description: Rielcode business app is a Laravel + Filament admin project at C:\xampp\htdocs\Rielcode-laravel
metadata:
  type: project
---

The Rielcode business app MVP (Q2 2026 priority) is a Laravel app with a Filament admin panel, at `C:\xampp\htdocs\Rielcode-laravel`. The `app/` dir graphed to 481 nodes / 72 communities (AST, code-only).

Core subsystems: storefront controllers (Checkout, Order, CustomPlan, ClientBrief), invoicing & payments (OrderPayment, InvoicePdfService, InvoiceNumberService, QrService, PublicInvoice), chat API (ChatController + OpenAIChat + RateLimiter), referral commissions, testimonials, and a large set of Filament resources (Package, Order, Referrer, FAQ, Project, SiteSetting, etc).

Cross-cutting god nodes: `Package` (16 edges), `AuditLogger` (14, bridges admin listeners to storefront/chat/widgets), `OrderPayment` (11). Brand assets live under `public/brand/` -- see [[reference_rielcode_rebrand_assets]].

**Why:** This is the build for the #1 Q2 priority (app MVP + payment gateway by end June 2026). Knowing the stack avoids re-discovering it each session.

**How to apply:** Treat it as Laravel/Filament when editing. Run `/graphify C:\xampp\htdocs\Rielcode-laravel\app` for an updated map; graph.json lives in JARVIS/graphify-out/.
