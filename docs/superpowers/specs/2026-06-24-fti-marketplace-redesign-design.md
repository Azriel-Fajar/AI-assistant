# FTI Marketplace — UI Redesign Design Spec

**Date:** 2026-06-24
**Author:** Azriel Fajar Wicaksono (672025121)
**Scope:** Visual + layout redesign of the FTI Campus Marketplace Flutter app (mobile + web). No flow, data, or API changes.

---

## Goal

Replace the current generic Material-default look ("bland") with a modern, simple, quiet, aesthetic **premium-fintech soft-depth** system. Reference: a "Dripzy" marketplace concept — floating bottom nav, soft rounded cards, category tiles, gallery-led detail. Adapt all of it to the FTI brand and to a marketplace (not commerce/cart) model.

## Constraints (locked with user)

- **Aesthetic:** premium fintech, soft depth. Modern, simple, not loud.
- **Color:** neutral base + **royal blue accent only**. Yellow reduced to rating-star/badge. Navy → text.
- **Type:** **all Outfit** single sans (via `google_fonts` package — no asset files, works mobile + web).
- **Scope:** full restructure of visuals + per-screen layout. Flows + navigation destinations + data + API **unchanged** (preserves survey-justified design + the working/submittable build).
- **Cross-platform:** desktop/web must match the mobile look (responsive, same tokens).
- **Verification:** user runs locally, guided step-by-step; user captures screenshots; docs updated from those shots.

## Out of scope (reference elements we drop)

Cart / "Add to Bag", promo code, discount %, shipping charges, size guide, brand-as-cart-filter, multicolor pastel gradients. Our model is offer → chat → COD; money never flows through the app.

---

## 1. Visual System (tokens)

### Color
| Token | Value | Use |
|---|---|---|
| `bg` | `#F7F8FB` | app background (soft gray) |
| `surface` | `#FFFFFF` | cards, sheets, nav |
| `surfaceTint` | `#EFF3FF` | spec chips, soft panels |
| `accent` | `#003CCB` | primary CTA, active, links |
| `accentSoft` | `#003CCB` @ 10% | active pill bg, selection |
| `ink` | `#10162C` | headings, primary text |
| `muted` | `#6B7280` | secondary text |
| `line` | `#ECEEF4` | hairline borders |
| `star` | `#FCC131` | rating star + seller badge ONLY |
| category gradient | `#5B7CFF → #003CCB` family tints | category tiles |

Dark mode: keep the same token roles, dark surfaces (`#0E1117` bg / `#181C24` surface / `#2A2F3A` line), blue lifted to `#5B7CFF` for contrast. Both themes designed together; contrast verified ≥4.5:1 body.

### Type — Outfit (all roles)
| Role | Size / Weight |
|---|---|
| Display (price, screen title) | 26–30 / 700 |
| Title | 18–20 / 600 |
| Body | 15 / 400 |
| Label / caption | 12–13 / 500 |
Prices/numbers use tabular figures.

### Depth + motion
- Card: white, radius 20, border `line` + shadow `0 8 24 rgba(16,22,44,.06)`. One elevation scale: card < sheet < floating-nav.
- Motion: 200ms ease-out; press scale 0.97 on tappable cards/buttons.
- Touch targets ≥44px; safe-area respected for floating nav + sticky bars.

---

## 2. Components (shared widgets)

| Component | Spec |
|---|---|
| **Floating bottom nav** | Detached pill bar, ~20px above safe-area, white + card shadow. Active = filled blue pill (icon + label); inactive = muted icon only. 5 dests: Home / Wishlist / Sell / Inbox / Profile. |
| **Listing card** | White, radius 20, image top (4:3), heart top-right (frosted circle), body = title (1 line) + price (Outfit 700 tabular) + seller row (avatar + name + FTI tag). Shadow + press-scale. |
| **Category tile** | 2-col grid, blue-family gradient per category, centered icon + label, radius 20. |
| **Hero banner** | Rounded image banner + "Lihat Semua" pill + arrow. |
| **Filter chips** | Active = filled pill, inactive = outline. listing_type + category + "Hanya FTI". |
| **Spec chip** | `surfaceTint` pill — condition / size / material / color / brand. |
| **Sticky action bar** | Detail bottom: price left + primary CTA "Tawar" (Make Offer) right + Chat icon secondary. No total/cart. |
| **Segmented tabs** | Detail About / Reviews, underline active. |

---

## 3. Per-screen restructure (13 screens)

Every screen inherits tokens + components. Targeted layout changes:

- **Home** — search + bell top, hero banner, category tile grid (blue gradient), filter chip row, 2-col listing grid.
- **Browse / Search** — sticky search + filter sheet, "Hanya FTI" chip, infinite 2-col grid.
- **Detail** — big image + thumbnail strip, white sheet; seller row leads avatar + real name (Q7 trust), then badge + "Civitas FTI" + star rating; spec chips; About/Reviews tabs; sticky Tawar/Chat bar.
- **Sell (create/edit)** — sectioned card form; image picker first; chips for category/condition/listing_type; minimal typing.
- **Profile/Settings** — header card (avatar + badge + sales count), my-listings grid, settings list, theme toggle, logout (visually separated).
- **Wishlist, Inbox, Chat thread, Leaderboard, Onboarding, Notifications, Auth/Register, Checkout summary** — reskinned to tokens + components + floating nav. Chat bubbles + offer accept/reject restyled. Auth keeps self-declare-FTI checkbox.

No screen's logic, routing, or API calls change — visual/layout only.

---

## 4. Desktop / Web (responsive, same system)

Existing breakpoints kept (mobile <600, tablet 600–1024, desktop >1024):
- Floating bottom nav → **left NavigationRail** on desktop, styled to match (blue active pill). Same 5 destinations.
- Card grid via `maxCrossAxisExtent` (~240px) → 2 / 4 / 6 columns.
- Body wrapped in centered `ConstrainedBox` (~1200px) on desktop.
- Detail → two-pane (gallery left, info right) on desktop; single column on phone.
- Identical colors, type, cards, shadows — one brand across app / web / (and the separate Filament admin keeps its `#003CCB` brand).
- Verify at 360 / 768 / 1280 / 1920px.

---

## 5. Build approach + risk mitigation

User chose full restructure; mitigations:
- **Branch** `redesign` off `main` in the Flutter repo. Current build stays as fallback.
- **Order (each step independently runnable):**
  1. Add `google_fonts`; rebuild `theme.dart` with tokens (light + dark).
  2. Rebuild shared widgets (`listing_card.dart`, `common.dart`) + new floating-nav + category-tile + sticky-bar widgets.
  3. Screens batch A: Home, Browse, Detail, Sell.
  4. Screens batch B: Profile, Wishlist, Inbox, Chat, Leaderboard, Onboarding, Notifications, Auth, Checkout.
  5. Desktop responsive pass (NavigationRail swap, grid extent, ConstrainedBox, two-pane detail).
  6. User runs + captures all screens (guided step-by-step).
  7. Docs update.
- **No flow/data/API edits** — research justification + working build preserved.

## 6. Docs update (after new screenshots)

- **Design Report** (`deliverables/design-report.html`): replace all `shots/`, rewrite Mobile Design + Desktop/Web + Design Rationale to the new visual language, re-render `FTI-Marketplace-Design-Report.pdf`.
- **Slides** (`deliverables/presentation.html`): swap shots, update design slides, re-render `FTI-Marketplace-Slides.pdf`.
- **PLAN.md**: update the design line (§Architecture "Design:") + add a redesign note.

---

## Success criteria

1. App builds and runs (mobile + web) with new theme — no regressions in flows.
2. Every screen reflects the new token system + floating nav + soft-depth cards.
3. Desktop/web adapts (NavigationRail, scaling grid, max-width, two-pane detail) — matches mobile look.
4. Contrast ≥4.5:1 body in both light + dark.
5. Design Report + Slides updated with new screenshots and re-rendered.
6. Current `main` build remains intact as fallback throughout.
