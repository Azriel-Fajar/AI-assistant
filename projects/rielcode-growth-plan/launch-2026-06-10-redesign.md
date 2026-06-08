# Rielcode Redesign Launch Plan

_Launch date: 2026-06-10 (Wed). Created: 2026-06-08._

## Goal

Announce the redesigned rielcode.com across IG (feed + story), Reels, and WhatsApp Status. Drive checkout traffic using two 10%-off codes. Codes valid through end of June 2026.

---

## What's launching

- New rielcode.com: visual + functional overhaul. Sell the look and the experience, not the stack (users do not care it is Laravel).
- Two discount codes (both give client 10% off package price, add-ons excluded; matches the discount plan at `docs/superpowers/plans/2026-06-08-referee-discount-and-promo-codes.md`):
  - **Standalone promo code** (`discount_codes` table): anyone. Client gets 10%. Nobody earns commission.
  - **Referral code** (per-referrer, `referrers.referee_discount_rate`): client gets 10% AND the referrer earns 10% commission. Total 20% margin cost to Azriel, but every referral code is an acquisition channel.

> Code blocker: the discount feature plan is written but NOT yet executed (all tasks unchecked). Codes will not work at checkout until that plan is implemented. **This must ship before the 10th** or the posts advertise dead codes. See "Pre-launch gate" below.

---

## Code strings to print on assets

| Type | Code | Who uses | Effect |
|------|------|----------|--------|
| Standalone promo | `LAUNCH10` | Anyone, public | Client 10% off |
| Referral | a friend's personal code (e.g. `RIEL-ANDI`) | New client referred by an existing one | Client 10% off + referrer earns 10% |

Validity to advertise: **valid through 30 June 2026**.

> Referral codes are personal/per-referrer, so the public posts advertise `LAUNCH10` as the headline code. The referral angle is a secondary line: "Got a code from a friend? Use it, you both win." Generate real referrer codes in the admin panel before posting if you want to push referral hard.

---

## Voiceover recommendation

**Recommended: your own voice (Azriel), English, on the Reel.**

Reasoning:
- Founder face/voice on a solo brand builds trust faster than a synthetic AI voice. Rielcode is you.
- A real founder talking about his redesigned site reads as authentic, not mass-produced. Meta's algorithm penalizes generic AI-feel creative (per your ads notes: creative is the targeting; do not ruin user experience).
- AI voiceover is the fallback if you cannot record clean audio in time. It is fine, just lower trust.

Plan supports both: the Remotion Reel is built with on-screen captions baked in, so it works muted (most IG viewing) regardless of voice track. Record a 15-20s English VO over the visuals, or drop the AI track if you run out of time.

---

## Assets to produce (video / Remotion skill)

All built via the `video` skill (Remotion). Captions baked on-screen so everything works muted.

1. **IG feed post** — 1080x1350 (4:5 portrait). Static or 3-5s loop. "New site is live" reveal + `LAUNCH10`.
2. **IG/FB Story** — 1080x1920 vertical. Same message, "Link in bio" / swipe-up CTA, code sticker.
3. **Launch Reel** — 1080x1920 vertical, 15-20s. Animated reveal of the new site (scroll-through screen recording or animated mockups), hook in first 1s, code + CTA at end. English VO (yours preferred).
4. **WhatsApp Status** — 1080x1920 vertical. Single-frame or short loop for broadcasting to leads/clients. Code + short line.

Source visual: capture the new rielcode.com via `/url-screenshot` or Playwright scroll-record once it is live (or staging) for real footage in the Reel.

---

## Captions

Generate via `/caption` for each platform, ID primary + EN secondary. Brand voice. No em dashes, no emojis (per communication-style rule).

- IG feed: hook + what changed + `LAUNCH10` + valid through June + CTA.
- Story: short, code sticker does the work.
- WhatsApp Status: warm, direct to existing contacts.
- Each platform gets its own caption (IG, TikTok optional, WA Status, FB).

---

## Pre-launch gate (must pass before posting)

1. **Implement the discount plan** — execute `docs/superpowers/plans/2026-06-08-referee-discount-and-promo-codes.md` (10 tasks). Without this, `LAUNCH10` does nothing at checkout.
2. **Create `LAUNCH10`** in the Discount Codes admin panel (10%, active, no expiry field exists in schema, so deactivate manually on Jul 1).
3. **Create referrer codes** for any referrers you want to push (set `referee_discount_rate` = 10).
4. **End-to-end test** — order > checkout > apply `LAUNCH10` > confirm > verify 10% applied and `uses` increments.
5. **Deploy** — new site live on rielcode.com, codes working in production.

---

## Timeline

| Date | Action |
|------|--------|
| Jun 8 (today) | Plan written. Decide voice (record vs AI). |
| Jun 8-9 | Execute discount plan. Create `LAUNCH10` + referrer codes. E2E test. |
| Jun 9 | Build Remotion assets (feed, story, reel, WA status). Record VO. |
| Jun 9 | Generate captions via /caption. |
| Jun 10 AM | Deploy site. Final code test in prod. |
| Jun 10 | Post: IG feed + Reel, IG/FB Story, WhatsApp Status broadcast. |
| Jun 11-17 | Re-share Story daily, repost Reel to TikTok, follow up WA leads. |
| Jun 30 | Codes expire. Deactivate `LAUNCH10` in admin. |

---

## Deployment sync

`deployments/index.md` shows rielcode-laravel at Stage 3 (CI/CD, 10/35). The redesign + discount feature go live as part of this pipeline. Update the deployment stage when the site ships on the 10th (use `/deploy`).

---

## Success criteria

- All 4 asset types rendered and posted on Jun 10.
- `LAUNCH10` works at checkout in production.
- At least 1 referral code live for the referral angle.
- Captions posted in ID + EN per platform.
