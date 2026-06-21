# Rekber Demo — Design Spec

_Date: 2026-06-21_
_For: po Cust 17 (Web Rekber lead) + reusable escrow niche demo_

## Purpose

Clickable demo of an escrow/rekber (penjual-pembeli-MC) status tracker. Lead po Cust 17 asked to see the dashboard and transaction flow before paying DP. Built as a reusable niche demo so future escrow leads can be shown the same link.

## Location & serving

- Path: `C:\xampp\htdocs\Rielcode-laravel\public\demos\rekber\`
- URL: `rielcode.com/demos/rekber/` (must open with trailing slash or relative CSS/JS 404s)
- Stack: static HTML + CSS + vanilla JS. No build, no PHP, no backend.
- `<meta name="robots" content="noindex">` on all pages. Brand favicon `/brand/rielcode-icon-cream.png`.
- Fonts: Inter + Space Grotesk (match existing demos).

## Files

| File | View | Contents |
|------|------|----------|
| `index.html` | Landing | What rekber is, CTA buttons into the 3 role views |
| `buyer.html` | Pembeli | Transaction card: unique code, status timeline, buyer action button |
| `seller.html` | Penjual | Same transaction, seller-side action (kirim akun) |
| `mc.html` | MC dashboard | Table of all transaksi + status + dispute flags, row → detail |
| `style.css` | — | Shared styles, trust-y blue/green escrow palette, responsive |
| `app.js` | — | Shared state machine + render logic |

Role-switcher bar (Pembeli / Penjual / MC) on all app screens so the lead clicks between perspectives.

## Transaction flow (core)

Single shared transaction, 4 stages:

1. **Menunggu transfer** — buyer transfers, clicks "Saya sudah transfer"
2. **Dana ditahan** — MC confirms funds held, seller notified
3. **Akun dikirim** — seller clicks "Kirim akun", buyer receives
4. **Selesai** — buyer clicks "Konfirmasi terima", dana released to seller

Rules:
- Each role's action button only active at its turn: buyer at stage 1 and 4, MC at stage 2, seller at stage 3.
- Status timeline: filled dots for completed stages, pulsing dot for current.
- **Dispute button** on buyer/seller view flips transaction to "Sengketa", shows flagged red in MC dashboard.

## State handling

- One JS object: `{ code, status, disputed }`.
- Shared across screens via `localStorage` so switching role views keeps the same state.
- Reset button in the switcher bar.
- MC dashboard: the 1 live demo transaction + 3-4 hardcoded fake rows for fullness.

## Look

- rekber.com vibe: clean, trust-focused, blue/green accent (escrow = safety).
- Mobile responsive (lead opens on phone via WhatsApp).

## Out of scope (YAGNI)

- No real auth/login — role switcher fakes it.
- No payment gateway — MC holds manual, matches the actual quoted scope.
- No persistence backend, no creating new transactions.

## Success criteria

- All 3 role views reachable from landing and from the switcher bar.
- Clicking the correct role's action button advances status; wrong-turn buttons disabled.
- Dispute flips state and surfaces red in MC dashboard.
- State persists across role switches, reset works.
- Opens correctly on mobile at the trailing-slash URL.
