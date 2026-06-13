# Meta Ads v3 Fix — Action Plan (2026-06-12)

v3 = WhatsApp Conversations. Channel is correct, stays live. Problem is high CPM (Rp64k), tired creative (freq 1.7, same since Jun 4), and convos dying before close.

Three fixes below. Two are done for you (WA opener + creative scripts). One needs you in Meta UI (swap creative).

**Creative method now lives in `meta/creative/`** (viral ad system: research → bullseye → hook → pattern interrupt → multi-hook → rotate). This plan applies that system to v3. Bullseye = TRUST (IG-only looks small, a site makes you believable). Full hook bank in `meta/creative/hooks.md`.

---

## FIX 1 — New WhatsApp opener (short greeting, ask need first)

Greeting stays light. No price/link dump on first message. Ask what they need, then send the matched demo on their reply. Proof lands at reply 2, not reply 1.

### New auto-reply (set as WA Business greeting)

```
Halo kak, terimakasih sudah menghubungi Rielcode.
Boleh cerita dulu usaha kak di bidang apa dan butuh website seperti apa?
```

### Reply 2 — after they tell you their business (send matched demo here)

### Niche demo links (send the matched one in first manual reply)

| Lead's business | Send this link |
|---|---|
| Cafe / restoran | rielcode.com/demos/restaurant-cafe/ |
| Salon / beauty | rielcode.com/demos/beauty-salon/ |
| Klinik / dokter gigi | rielcode.com/demos/dental-clinic/ |
| Gym / fitness | rielcode.com/demos/gym-fitness/ |
| Properti | rielcode.com/demos/real-estate/ |
| Travel / tour | rielcode.com/demos/tour-travel/ |
| Logistik / ekspedisi | rielcode.com/demos/logistics/ |
| Perusahaan / company profile | rielcode.com/demos/company/ |

### Matched-demo reply template

```
Nih kak contoh untuk usaha [bidang]: rielcode.com/demos/[niche]/
Ini contoh kasar ya, punya kak nanti full custom sesuai brand dan kebutuhan.
Paket Pro (paling laku) Rp2jt, jadi 7-10 hari, sudah include hosting + domain.
Mau aku buatkan mockup gratis buat usaha kak?
```

Price anchor + free mockup offer = reason to keep talking. No em dashes.

---

## FIX 2 — Fresh creative from the hook bank (lowers CPM, kills fatigue)

Root cause of fatigue: one creative, no backups, freq climbing since Jun 4. Viral-system fix = ONE concept (TRUST), many hooks, rotate when tired. Don't launch everything at once.

Plan: render the 2 angles below as your first 2 hooks. They map to the bank in `meta/creative/hooks.md` (Angle A ≈ hook #12 proof-first, Angle B ≈ hook #8 speed). Launch these 2. When freq passes ~1.7 / CPM rises, pause the tired one and render the next hook from the bank (#1 "ada websitenya gak?" WA bubble, #2 Google-empty, #7 "bayar 50rb eh ilang"). Keep 2 hooks ahead so you never run dry.

Each hook = the first 0-3s only. Body + CTA stay constant. That is why one concept lasts months.

Render fresh creative resets the auction and drops CPM. Reuse Remotion theme in `my-video/`.

**Pattern rules (from viral method):** open on a pattern MATCH (visual the prospect knows: WA chat, Google search, IG profile), then hit a pattern INTERRUPT every few seconds so they don't zombie out mid-ad. Sell against alternatives (IG-only, cheap Rp50k template) inside the body.

**Render rules (locked):** Fast-paced. Max 3s per scene (90 frames at fps=30), prefer 45-60. Use the NEW redesign theme in `theme.ts` (cream + forest green). Old ad used the old design. Serialize renders, never two at once.

VO talks continuously start to finish (0-12s). Casual kak tone, no em dashes. Read at a brisk, natural pace.

### Angle A — "Contoh dulu, baru bayar" (proof-first hook)
- **Frame 1 (0-3.5s, hook):** text "Mau lihat website usaha kamu jadi kayak gimana?" over a demo site scrolling
- **Body (3.5-10.5s):** quick montage of 3 demo sites (cafe, salon, gym) scrolling
- **CTA (10.5-16.5s):** "Chat WA, aku kirim contoh gratis. Mulai Rp500rb." + WA button
- Why: leads with the exact thing that closes (the demo). Pre-sells before they tap.

**Full VO (0-16.5s, customer POV, what they get):**
```
(0-3.5s)    Bayangin usaha kamu punya website yang bikin pelanggan langsung percaya.
(3.5-7s)    Calon pembeli cari kamu di Google, ketemu, terus langsung chat.
(7-10.5s)   Buka cepat di HP, gampang dipakai, keliatan jauh lebih profesional.
(10.5-13.8s) Mau lihat punya kamu jadinya kayak gimana? Contohnya gratis.
(13.8-16.5s) Mulai lima ratus ribu. Chat sekarang lewat WhatsApp.
```

### Angle B — "Website jadi cepat" (speed/result hook)
- **Frame 1 (0-3.2s):** big text "Website usaha jadi 3 hari" on brand background
- **Body (3.2-9.5s):** before (no website / messy IG) vs after (clean live site)
- **CTA (9.5-15.2s):** "Starter Rp1jt, include hosting + domain. Chat sekarang." + WA button
- Why: speed + price clarity. Different hook from current creative so Meta sees it as new inventory.

**Full VO (0-15.2s, customer POV, what they get):**
```
(0-3.2s)    Cuma 3 hari, usaha kamu udah punya website sendiri.
(3.2-6.7s)  Nggak cuma andelin Instagram, kamu punya tempat yang lebih dipercaya.
(6.7-9.5s)  Pelanggan gampang nemu kamu, lihat produk, langsung tertarik.
(9.5-12.7s) Udah include hosting sama domain, jadi kamu tinggal pakai.
(12.7-15.2s) Mulai satu juta. Chat sekarang lewat WhatsApp.
```

Keep CTA = "Send WhatsApp Message". Keep destination WhatsApp. Keep audience ID 18-65.

---

## FIX 3 — You do this in Meta UI (API writes blocked)

1. Render both videos from `my-video/` (serialize, never two renders at once).
2. Meta Ads Manager > v3 adset > duplicate the ad twice.
3. Replace each duplicate's video with Angle A / Angle B. Keep same primary text + WA CTA.
4. Pause the old (Jun 4) creative once the 2 new ones have spent ~Rp50k each.
5. Hold daily budget at Rp50k. Do NOT raise yet.
6. After ~5 days: check CPM in dashboard. Target under Rp40k. Once convo cost drops under Rp15k, raise budget 20%/week.
7. ROTATE: when freq passes ~1.7 or CPM rises vs launch, render the next hook from `meta/creative/hooks.md`, swap it in, pause the tired one. Log each swap in the rotation table there. Always keep 2 hooks rendered ahead.

---

## What NOT to do
- Don't revert to v1/v2 (Messenger). v3 WhatsApp is right.
- Don't raise budget before CPM drops.
- Don't switch objective off Conversations.
