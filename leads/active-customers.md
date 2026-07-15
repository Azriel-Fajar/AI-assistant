# Active Potential Customers — Context Hub

_Last updated: 2026-06-18_
_All are POTENTIAL clients. None closed yet. This file = single source of truth for cust context._
_Source of truth for who's active = `leads/leads.md` "Active Potential Customers" table._

Pricing source: `references/rielcode-pricing.md`. Always quote real prices, never guess.
Message tone: ID, casual warm "kak", no em dashes, ask/confirm not hype, customer POV.

---

# Projects (Won Customers)

_Closed/paying customers. First sale = JOIN School (Cust 1), DP paid 2026-06-24._

## CUST 1 — JOIN School (Surabaya) — CLOSED / WON 🎉
- **Status:** CLOSED. Rielcode's FIRST paying customer. DP paid 2026-06-24.
- **Customer name:** Anna Maria (per invoice). WA contact label "Joyce JOIN", HP 0898-3331-997 (only one number).
- **Industry:** Preschool / Kindergarten / Playgroup (KB/TK) + Enrichment. Akreditasi A. IG @joinschool.
- **JOIN acronym:** "Joyce Occupation In Natural Education" (final, corrected twice by customer).
- **Pain:** Sekolah pindah lokasi, ex murid cari di Google dikira tutup. Needs online appearance so parents find new address/contact.
- **3 addresses for site:** (1) Jl. Tengger Kandangan 1/2 Surabaya, (2) Puri Asta Kencana A/33 Boteng Menganti, (3) De Naila Park PD 29/63 Menganti.
- **Package:** Starter, LAUNCH10 → **Rp 900.000**. Payment 20/80 (DP Rp 180rb, sisa Rp 720rb on completion).
- **Silent bonus:** Advanced SEO included free (do NOT tell customer).
- **Invoice:** INV-2026-003-D (Deposit 20%, Rp 180.000). DP PAID 2026-06-24 via BCA (proof received, to RIELCODE WEB DEVELOPER / BIMASAKTI Solo).
- **Domain chosen:** joinschool.id
- **Hosting:** Azriel's account (customer has no Rumahweb account). Will set up under Azriel's, create new email, hand over login after build so customer changes password.
- **Demo/template:** built from https://rielcode.com/demos/preschool/ (penguin yellow/navy, playful, child-challenges section + consultation booking form).
- **Order:** confirmed via rielcode.com/en/order?aksi=starter with LAUNCH10 code. Brief form sent: brief.rielcode.com (token link).
- **Customer wants:** colorful, menarik design. Sending testimoni via PDF (besok, ~2026-06-25). Real testimoni + foto kegiatan swapped in at build.
- **Build:** DONE 2026-06-24. Full PHP+MySQL site at `C:\xampp\htdocs\join-school` (Tailwind CDN, DB `join_school`). Admin panel (Testimoni CRUD, Foto Kegiatan upload, Pesan Masuk inbox, Pengaturan to change login). Login `admin` / `joinschool2026` (change at handover). Consult = WA button + form saving to DB. Advanced SEO live (JSON-LD 3 locations, OG, sitemap, robots). Branded placeholders pending real photos. Staging snapshot exported to `Rielcode-laravel/resources/staging/join-school`.
- **Next:** Set order `staging_slug=join-school` in Filament for token preview. Get testimoni PDF + foto kegiatan (~2026-06-25), upload via admin. Customer rechecks wording. Then deploy to Rumahweb under joinschool.id (update config.php DB creds), collect remaining Rp 720rb on completion.
- **Progress note draft** (for Rielcode progress page `OrderProgressNote.note`, ID, customer-facing timeline entry):
  > Tampilan halaman utama website sudah selesai kami kerjakan, mencakup bagian hero, profil sekolah, program, galeri kegiatan, testimoni, dan ketiga lokasi.
  > Form konsultasi WhatsApp sudah aktif. Setiap pesan yang masuk langsung diteruskan ke panel admin Anda.
  > Panel admin juga sudah siap dipakai. Anda bisa mengganti foto kegiatan, testimoni, dan gambar utama sendiri, serta mengubah username dan password kapan saja.
  > Langkah berikutnya, kami menunggu file testimoni dan foto kegiatan dari Anda untuk dimasukkan ke website sebelum proses online ke domain.

## CUST 2 — Terapi Barqun (Palembang) — WON / DP PAID 🎉
- **Status:** WON, DP PAID 2026-07-02. Rielcode's 2nd paying customer. Build starting.
- **Customer name:** ABDUL HALIM (per transfer). Lead WA +62 895-8005-22929. Calls Azriel "Dik" (so Azriel addresses HIM as "kak"/"Bang", never "Dik").
- **DP received:** Rp200.000 via Bank Mandiri 2026-07-02 12:46 (from ABDUL HALIM → AZRIEL FAJAR WICAKSO / Mandiri 1360038400674). Bukti transfer received. Sisa Rp800.000 on completion.
- **Source:** Facebook/Meta Ads WA lead "Free Demo / bayar setelah lihat hasil" (2026-07-02).
- **Type:** Terapi Islami (Barqun) — pengobatan ala Al-Quran QS Al-Baqarah 73, keluhan medis & non medis. Parent brand PT Radja Barqun International (RBI), pusat Bang Abdul 0895-3746-44456, www.barqun.id. Lead = agen/terapis Palembang.
- **Package:** Starter **Rp1.000.000** (full price, no LAUNCH10 — July). Includes domain + hosting 1thn + Basic CMS/panel. Payment 20/80 → **DP Rp200.000**, sisa Rp800.000 on completion. Delivery 3-5 hari.
- **Invoice:** INV-2026-005-D (Deposit 20%, Rp200.000). Pay link pay.rielcode.com/i/INV-2026-005-D (token t=f586f9...67dcb). Sent 2026-07-02. Awaiting DP + bukti transfer.
- **Order:** placed via rielcode.com/en/order?aksi=starter (Starter, no add-on — Starter already includes Basic CMS). Brief form FILLED (brief.rielcode.com token t=f04385...640428).
- **Site details:** Nama website = "terapi barqun". Bahasa Indonesia. Terapi WA di site = **0895-3746-44456** (bukan nomor lead). Wants foto/video promo embedded (video penjelasan bisnis). Honest SEO (no #1 promise, findable + visitor→WA).
- **Scope:** Satu website gabungan — sisi pasien (info terapi + manfaat + konsultasi WA) + sisi mitra (peluang bisnis + daftar) + **Pelatihan Gratis** (calon terapis, daftar via site). Start simpel (form konsultasi manual WA), upgrade booking/login mitra nanti kalau rame.
- **Demo built:** rielcode.com/demos/terapi-holistik/ (green/gold Islamic theme, ayat QS 73, manfaat lahir/batin, 3 metode, paket mahar Rp2.05jt, jadi mitra, form WA). In demo hub. Verified clean.
- **Brief assets received:** 4 brosur images (paket Rp2.05jt, manfaat lahir/batin, diagram, deskripsi Barqun Palembang). Content sourced from these.
- **Network (repeat lane):** Same owner coordinates 2 more, both skincare product+recruit — SR12 Lakukeras + Wikinara, both contact 0812-7126-274. "Fokus Barqun dulu." Offered 10% off each if continues. See memory [[project_lead_barqun_network]].
- **Hosting/domain option (chosen 2026-07-02):** **Option 2** — customer's own account under their name (full ownership). Lead wants guidance ("mohon bimbingannya"). Azriel to bimbing pelan-pelan through Rumahweb signup + purchase.
- **DELIVERED 2026-07-04:** Site LIVE at https://terapibarqun.com. Delivery + admin panel creds sent via WA. Admin: https://terapibarqun.com/admin/ (user adminbarqun / pw barqunadmin, told to change). Awaiting customer confirmation → then collect sisa Rp800rb pelunasan.
- **REVISIONS 2026-07-07 (requested via WA):** (1) WhatsApp button now a **4-choice menu** (Terapi Barqun / Konsultasi / Pelatihan / Beli Alat), each opens WA with its own prefill text. (2) **Anti-spam** added to all 3 lead forms (honeypot + 3s time-trap + URL-block) after foreign SEO spam flooded dashboard — spam silently dropped, verified only legit rows saved. (3) **Video section now auto-slide marquee** like testimoni (>3 videos), pause on hover, 9:16 preserved. Files changed: index.php, submit-lead.php, assets/style.css — **need FTP upload to production**. Not yet deployed. Auto-reply form (Nama/Usia/Alamat/Keluhan/jadwal) clarified = his WA Business greeting, NOT website. Update + pelunasan-nudge message drafted (address him "kak"). Gate still = sisa Rp800rb pelunasan (invoice INV-2026-005-D already sent).
- **Next:** DP PAID → BUILD NOW. Collect real assets (logo, foto tempat/alat, testimoni). Confirm terapi nomor 0895-3746-44456. Include Pelatihan Gratis section + foto/video promo slot. Guide customer through hosting/domain purchase (own account, Option 2) when build done. Deliver 3-5 hari, then collect sisa Rp800rb. After Barqun lands, pitch SR12 + Wikinara (10% each).
- **2026-07-02 msgs sent:** notified new Google acct being made for hosting (Option 2); requested logo/foto tempat-alat/testimoni/video promo. Awaiting assets back.
- **Video assets received 2026-07-02:** 6 WA videos at `C:\Users\afw14\Videos\barqun\`, transcribed via faster-whisper → `.\transcripts\`. Structured content below.

### Cust 2 — Structured site content (from videos + brosur + WA)

**⚠️ Wobble (2026-07-09):** Client messaged "Sepertinya di stop aja Dik gak menarik" → "Sudahlah Dik" → "Di stop aja Dik." Wants to stop, reason "gak menarik" (unclear = design/content vs lost interest). Sent save-attempt WA: ask which part feels lacking (tampilan/isi/arah bisnis), reframe as fixable early-stage, offer free revisions until cocok, steer away from cancel without hard-sell. Awaiting reply. NOT cancelled.


**Entity / brand**
- PT Radja Barqun International (RBI). Tagline: "Ikhtiar Sehat, Terinspirasi dari Al-Qur'an". Method QS Al-Baqarah 73.
- Products: Barqun (alat kerok/terapi tanduk) · Barqun Feel (tetes/minyak) · Barqun minum.
- Barqun Academy (Squadron Barqun) — training/mitra arm, official partner RBI.
- barqun.id listed as parent-brand site in brosur; OWNERSHIP UNCONFIRMED (Azriel still asking lead) — do NOT wire as their domain until confirmed.

**Credibility (About/Trust)**
- Endorsement: Dr. Rizwah Yuni Widawati, M.Sc ("Dr. Riz") — praktisi kesehatan/herbal/kecantikan, anggota Konsil Tenaga Kesehatan Indonesia (Kemenkes RI). Frames Barqun as pengobatan alternatif komplementer.

**Services / manfaat**
- Melancarkan aliran darah, kenyamanan, seluruh badan (kepala → badan).
- Keluhan: tekanan darah tinggi, asam lambung, kolesterol, maag akut, batuk, demam, masuk angin, pegal/capai.
- Kejantanan pria. Terapi Aura/kecantikan: keriput, ratakan warna kulit, cegah penuaan dini, cegah kusam.
- ⚠️ Videos claim "sembuh 20-25 menit". DO NOT publish as guaranteed cure (health-ad/BPOM risk + honesty rule). Frame as ikhtiar/membantu + testimonial-based.

**Testimonials (social proof)**
- Bu Hj. Earlywati Rahayu (Jawa Barat) — kaki diseret → sehat + income.
- Golfer — 3 hari golf Jepang non-stop, no fatigue (Barqun Feel).
- Pak Darmas, Dusun Sekip. · Anandya (Owner Glo), Kalimantan. · Mbak Ana (suami, stamina).

**Locations / contact**
- Terapi Barqun Palembang, CP **0895-3746-44456**.
- Alamat 1: Jl. Inspektur Marzuki, Lr. Tenang RT07 RW09 No.2999, Siring Agung, Ilir Barat 1, Palembang 30138.
- Alamat 2: Jl. Swadaya Lr. Perikanan 2 No.333 RT04 RW01, Talang Aman, Kec. Kemuning, Palembang.

**Business model**
- Jual alat + terapi walk-in + peluang mitra/income (Academy). Site = pasien + mitra + Pelatihan Gratis (per scope line above).

---

## CUST 3 — CV. Karya Jun Teknik (Fabrikasi Stainless/Besi, Padang) — PAID / CLOSED ✅
- **Status:** PAID IN FULL + CLOSED 2026-07-15. Final payment Rp800k (sisa 80%, INV-2026-006-F) received. Site live at karyajunteknik.com, client approved. Total Rp1jt collected (Rp200k DP + Rp800k final). Rielcode's 3rd paying customer, project complete.
- **Testimonial request sent (2026-07-15):** WA testimoni link sent post-payment — https://testimonial.rielcode.com/?t=M971y2UsJ3rSCt8mQ8lKbMlsIqSkz7BB8jEOrdWOEkYXiO6N596XiMJymHeNwWXF . Awaiting client submission.
- **Prev status:** DELIVERED 2026-07-10. Site live, client reviewed + approved ("Sudah" / "Ya sesuai"). Final invoice INV-2026-006-F sent (Rp800k). On payment: activate full + finish domain verification.
- **Prev status:** WON, DP PAID 2026-07-04. Rielcode's 3rd paying customer.
- **Correction (2026-07-04):** Real business name confirmed from physical nama kartu = **CV. KARYA JUN TEKNIK** (KJT logo). Previous "Nur Padang Kitchen Stainless" name was WRONG — lead had said that name in chat but actual usaha/kartu nama says CV. Karya Jun Teknik. Use CV. Karya Jun Teknik as site brand.
- **Source:** Facebook/Meta Ads WA lead "Nggak usah bayar dulu sampai kamu lihat hasilnya" / "Tanpa DP, tanpa risiko. Mulai Rp500rb" (2026-07-03). WA +62 813-7477-0791 (also +62 821-7095-8212).
- **Alamat:** Jl. Alai Timur No. 44A, Kota Padang.
- **Type:** Commercial. Bengkel fabrikasi — full scope wider than kitchen set alone: Stainless Steel, Besi Hitam, Folding Gate, Canopy, Teralis, Pagar, Riling Tangga, Konstruksi Baja Ringan, Konsen Aluminium, Qubah Masjid, Composite, dll. Also does zink kitchen set + jasa bending/tekuk plat. No existing site. Portfolio-driven buyer.
- **Client brief (submitted, order "Zulbadri" Starter):**
  - Business: "Kami dari bengkel CV. Karya Jun Teknik mengerjakan zink kitchen set stainless steel, dikerjakan dengan mesin bending plat presisi tinggi. Pagar stainless, kanopi, balkon, lemari stainless. Juga menerima jasa bending plat/tekuk plat."
  - Goals: Meningkatkan pasar dan penjualan.
  - Audience: CV. Karya Jun Teknik (general customer base).
  - Success metric: Penjualan meningkat.
  - Brand style: Zink kitchen set (steel/industrial look, per demo already built).
- **Demo built (2026-07-03):** rielcode.com/demos/kitchen-set-stainless/ — charcoal + brass steel theme. Hero, produk/layanan, galeri hasil kerja (filter kategori kitchen/meja/rak), estimator harga per meter (model x panjang), langkah pesan, why, testimoni, form konsultasi WA. Mobile: slide-in drawer nav + trust bar hidden. Placeholder foto/harga. Listed in demos hub.
- **Requested tweak:** Add copy "dikerjakan dengan mesin bending/tekuk plat presisi tinggi" (not yet added to demo). Consider broadening galeri/kategori beyond kitchen set to match full scope (pagar/canopy/teralis/qubah/dll) since brief confirms wider service range.
- **Quote sent (2026-07-03):** Starter Plan IDR 1jt — 1-2 halaman (galeri/produk/profil/kontak), free domain + hosting 1 thn, Basic CMS/Admin Panel (self-manage foto project), WA integration, SSL, revisi desain.
- **DP received:** Rp200.000 via Bank Mandiri 2026-07-04. Bukti transfer received. Sisa Rp800.000 on completion.
- **Logo received:** CV. Karya Jun Teknik business card photo only (KJT gear logo, yellow/red). No separate logo file exists (confirmed by lead: "Gak ada"). Recreate logo digitally from kartu nama photo, or design simple text/gear logo matching KJT style.
- **Video assets received (2026-07-04):** 27 WA videos — proses kerja bengkel (bak truk custom, tekuk/bending plat, fabrikasi stainless/besi, dll). Real work footage, use for galeri/hero b-roll or extract stills.
- **Assets requested (2026-07-04):** logo (no file, recreate), foto hasil kerja per kategori (have videos, need stills), daftar harga/estimasi, testimoni. Awaiting harga + testimoni.
- **Next:** Rebrand demo from "JUN TEKNIK Stainless" to "CV. Karya Jun Teknik", swap in real KJT logo. Add bending/tekuk plat presisi copy line. Consider expanding galeri categories to match full brief scope (pagar/canopy/teralis/qubah/baja ringan/aluminium), not just kitchen set. Send invoice for remaining 80% (Rp800k) after finish.
- **BUILD (2026-07-04):** Full PHP+MySQL starter app built at `C:\xampp\htdocs\karya-jun-teknik\` (mirrors terapi-barqun architecture: config/db/index/admin/schema). DB `karya_jun_teknik`, 7 tables. Admin panel (login admin/karyajun2026, changeable) with **Katalog Produk CRUD** (12 seeded products, prices = supplier list +10% per client instruction), Galeri Foto, Gambar Utama, Testimoni, Pesan Masuk, Pengaturan. Public site redesigned industrial-premium (brushed steel + blue), category-filter catalog, portfolio, kitchen set, testimonials, lead form, floating WA. KJT logo recreated as clean SVG (gear cog + KJT badge + wordmark), 3 variants (color/mark/white-footer). Verified end-to-end (login, product CRUD, lead submit, no overflow, 0 console errors via Apache).
- **Staging live (2026-07-04):** exported to `Rielcode-laravel/resources/staging/karya-jun-teknik/`, committed + pushed (commit 5986ce4). Progress preview link SENT to client: https://progress.rielcode.com/?t=074761afe5f2bc5a435d6719f9cd046968ad2b1397b0b61af7e7b1e85668164d
- **Hero media upgrade (2026-07-07):** Hero slot now accepts FOTO or VIDEO (MP4/WEBM, maks 25 MB). Video autoplays muted+loop on homepage. Admin Media Hero tab shows current media, video preview + drop-validation. Store via `store_hero_media()` in admin/dashboard.php; index.php + style.css render `<video>` when path ends .mp4/.webm. `php -l` clean. Live-upload test still pending. Note: prod host upload_max unknown, 25MB assumes host allows.
- **Still pending:** real photos (have 27 process videos, extract stills → upload via admin per product + galeri + hero/kitchen-set slots — hero can now take a video clip directly), real harga confirmation, testimoni. Then invoice remaining Rp800k.

---

## po Cust 36 — Mandiri Konstruksi (Kontraktor Sipil & Finishing)
- **Source:** Facebook/Meta Ads WA lead "Nggak usah bayar dulu sampai kamu lihat hasilnya" / "Free Demo" (2026-07-02). +62 822-5753-9209.
- **Type:** Kontraktor / pemborong. "Pemborong teknik sipil & finishing", proyek sipil. Nama usaha **Mandiri Konstruksi**. No existing site.
- **Layanan:** Bangun rumah, renovasi, kolam renang, finishing.
- **Area kerja:** Jember (Jatim) & Bali.
- **Assets received:** 6+ foto proyek (gedung bertingkat + scaffolding + kolam renang biru). Real work, proyek skala besar.
- **Scope (locked):** Portofolio online 1 halaman — hero, layanan (bangun rumah/renovasi/kolam renang/finishing), galeri proyek, area kerja, tentang, kontak/form WA. Static, isi di awal. Cust said "ini baru pertama, cukup di awal dulu" (no CMS need), tapi Starter tetap include Basic CMS/admin panel = bonus, framed sebagai fitur update sendiri.
- **Quote:** Starter Plan **Rp1.000.000** (full, LAUNCH10 EXPIRED — sudah Juli). Include: domain gratis + hosting 1thn + panel admin dasar + form WA + SSL + 1x revisi. DP 20/80 = Rp200rb start / Rp800rb on completion. Delivery 3-5 hari.
- **Demo:** Built free rough demo 2026-07-02 — rielcode.com/demos/kontraktor/ (brand = Mandiri Konstruksi, industrial theme, hero + layanan 4 + galeri proyek + area kerja Jember/Bali + tentang + form WA). WA di demo = 0822-5753-9209. Placeholders untuk foto proyek. Listed in demo hub. Verified render clean.
- **Stage:** quoted (2026-07-02). Demo sent, lead reply "cocok banget". Scope locked (static, isi awal). Starter Rp1jt quote about to be sent.
- **Next:** Send Starter quote. If yes, collect assets (logo, foto proyek HD, daftar layanan detail, nama lengkap CV/usaha, nomor final) + send order link + brief form + start DP Rp200rb. Warm buyer, close-ready. Don't over-push.

---

## po Cust 2 — Furniture company
- **Industry:** Furniture
- **Quote:** Verbal yes to Starter (Rp1jt, furniture galeri). Offered LAUNCH10 (10% off).
- **Stage:** verbal yes, not ready (2026-06-17). Gathering funds. Reassured scope fits.
- **Next:** Wait for kakak to confirm ready. Do not chase. Follow-up sent 2026-07-01.

## po Cust 4 — CNProject Waterproofing
- **Brief:** `projects/CNProject Waterproofing/client-brief.md`
- **Entity:** Chemkon Nusantara Perkasa | **Area:** Jakarta/PIK2
- **Industry:** Waterproofing / epoxy / PU concrete contractor (specialist positioning)
- **Goal:** Website like the Claude artifact mockup he sent (8-page waterproofing site).
- **Reference scraped 2026-06-15:** 8 pages (Home + 6 services + Konsultasi), portfolio grid, testimonials, form→WhatsApp. No e-comm/DB.
- **Quote:** Option A 8-page = **IDR 2.255jt** (Pro + 3 extra pages). Option B 1-page landing = **IDR 1jt**.
- **Stage:** waiting on owner (2026-06-20). Contact is intermediary; owner not replying, said will inform later. Customer leaning 1-page.
- **Next:** Wait for owner decision on A vs B.

## po Cust 5 — Pelatihan Craft (craft training)
- **Industry:** Craft training / workshop
- **Stage:** on hold (2026-06-15). Out of town this week.
- **Next:** Contact again next week when back in town. Follow-up sent 2026-07-01.

## po Cust 7 — Jasa Branding + Homestay
- **Industry:** Branding services + hospitality
- **Request:** 2 SEPARATE sites — (1) jasa branding (company profile, logo, deck, pitching, video edit), (2) homestay landing. Confirmed separate 2026-06-16.
- **Stage:** qualifying (2026-06-16). Follow-up sent asking pages + reference. No reply yet.
- **Next:** Scope 2 separate sites; quote each.

## po Cust 8 — Jersey Custom
- **Industry:** Apparel / custom jersey
- **Request:** Landing page + catalog. Asked for reference/design.
- **Stage:** follow-up sent (2026-06-16). No reply yet.
- **Next:** Wait for reply; send demo tomorrow if no response.

## po Cust 11 — Tour & Travel
- **Source:** Meta Ads WA lead (2026-06-18)
- **Industry:** Tour and travel
- **Demo sent:** rielcode.com/demos/tour-travel/
- **Quote:** mulai 2jt.
- **Stage:** quoted, parked (2026-06-20). Saw demo, replied "nanti ya, kalau jadi saya hubungi". Soft defer, not dead.
- **Next:** Don't push. Light check-in done early — follow-up sent 2026-07-01.

## po Cust 12 — General Contractor
- **Source:** Meta Ads WA lead (2026-06-18)
- **Industry:** General Contractor / Supplier / Trans / Rent
- **Request:** Landing page.
- **Demo sent:** rielcode.com/demos/ (hub)
- **Quote:** mulai 500rb.
- **Stage:** qualifying (2026-06-18).
- **Next:** Wait for landing-page reference/scope reply. Follow-up sent 2026-07-01.

## po Cust 13 — Hijab Brand
- **Source:** Meta Ads WA lead (2026-06-18)
- **Industry:** Apparel / hijab products
- **Reference:** their own brand "The Veiluxe" (sent packaging photo). Premium/elegant: gold + floral pink gift boxes, VL monogram logo.
- **Stage:** team discussion, confused on integration scope (2026-06-22). Sent 2-model explainer (katalog vs toko online).
- **Next:** Don't push. Wait team decision. Follow-up sent 2026-07-01.

## po Cust 14 — Marketplace Seller (Ronald)
- **Source:** Meta Ads WA lead (2026-06-18)
- **Industry:** Retail / e-commerce. Sells on marketplaces (Shopee, etc).
- **Request:** Asked for website suggestions. Open-ended.
- **Asked:** product catalog site vs marketplace-style ordering/checkout.
- **Stage:** discovery (2026-06-18). Awaiting reply on need.
- **Next:** Confirm catalog vs order/checkout, then scope + quote. Follow-up sent 2026-07-01.

## po Cust 15 — Klinik Terapi
- **Source:** Meta Ads WA lead (2026-06-19)
- **Industry:** Healthcare / therapy clinic
- **Request:** Self-picked Premium. Asked ownership/garansi/maintenance/CMS/hidden-cost/renewal questions.
- **Told:** Hosting+domain 1yr included, maintenance 2 months, no hidden cost, no extra konsul fee.
- **Quote:** Premium (self-selected, not yet finalized).
- **Stage:** meeting-pending, soft-defer (2026-06-21). Warm buyer. Replied he + partner busy ~1 week, will reach out again. Acknowledged.
- **Next:** Don't push. They will re-initiate. Follow-up sent 2026-07-01.

## po Cust 16 — F&B Katalog
- **Source:** Meta Ads WA lead (2026-06-19)
- **Industry:** F&B
- **Request:** Catalog site (products + supporting info + company profile). No web transactions, orders forwarded to CS chat.
- **Scope:** Still loose, will refine as it goes. Good fit Starter/Pro catalog build.
- **Stage:** scoping (2026-06-19). Offered online meet.
- **Next:** Propose online meet to scope catalog site. Follow-up sent 2026-07-01.

## po Cust 17 — Web Rekber
- **Source:** Inbound WA (+62 851-7427-7002), 2026-06-19
- **Industry:** Escrow / rekber (akun game)
- **Request:** Escrow site penjual-pembeli. MC holds funds manual, no payment gateway. Volume sering tak tentu.
- **Scope:** Status-tracker build: 3-role auth (buyer/seller/MC), transaction flow + status, dispute flag, MC dashboard.
- **Quote:** **Rp5,500,000**, 2-3 weeks (Premium 5jt + Login/Member 500k).
- **Demo sent:** rielcode.com/demos/rekber/ (clickable 3-role tracker built 2026-06-21, matches quoted scope).
- **Stage:** demo sent, waiting (2026-06-21).
- **Next:** Wait for reply on demo. Nudge toward DP if positive. Follow-up sent 2026-07-01.

## po Cust 18 — izin.co.id-style Permit/Service Site
- **Source:** Meta Ads WA lead (2026-06-19)
- **Industry:** Legal/permit or product-service business (reference izin.co.id)
- **Request:** Konsep + tampilan mirip izin.co.id, multi halaman. Bisa kelola produk + management artikel sendiri lewat admin.
- **Scope:** LOOK + product CMS + blog CMS. No user accounts/payment/dashboard pengajuan.
- **Demo sent:** rielcode.com/demos/company/
- **Quote:** Pro **IDR 2jt** + Blog/Artikel add-on **IDR 400rb** = total **IDR 2.4jt**.
- **Stage:** quoted (2026-06-19).
- **Next:** Wait for reply. Follow up if no response by 2026-06-22.

## po Cust 19 — Toko Herbal
- **Source:** Meta Ads WA lead (2026-06-21)
- **Industry:** Herbal products / retail
- **Request:** Online store. Confirming scope: full e-commerce (cart + payment) vs catalog + WA.
- **Demo sent:** rielcode.com/demos/ (no herbal-specific demo; e-commerce structure same)
- **Stage:** parked, prepping product (2026-06-24). Cust replied "sedang kita siapin produknya". Azriel said disiapkan dulu santai, kabari kalau sudah ada gambaran. Scope (online vs katalog) still unanswered.
- **Next:** Don't push. Wait cust to return with products ready + scope pick. Follow-up sent 2026-07-01.

## po Cust 20 — Toko Baju
- **Source:** Meta Ads WA lead (2026-06-21)
- **Industry:** Apparel / fashion retail
- **Request:** Clothing store website. Asked if fashion demo exists (none; e-commerce structure same).
- **Quote:** Online lengkap 5jt → 4,5jt (LAUNCH10) | Katalog + WA 2jt → 1,8jt (LAUNCH10).
- **Stage:** quoted, scoping (2026-06-21). Sent 2-tier quote + LAUNCH10.
- **Next:** Wait for tier pick. Offered to start from front-page mockup.

## po Cust 21 — Sepeda Listrik (oTobot)
- **Source:** Meta Ads WA lead (2026-06-21)
- **Industry:** E-bikes / electric vehicles, reseller
- **Request:** "Jadi 1" - one site that both sells to customers AND manages reseller network.
- **Scope:** E-commerce + reseller/member system (login, register, manage reseller accounts).
- **Quote:** Rp5,5jt → 4,95jt (LAUNCH10). Premium 5jt + Login/Member 500k.
- **Demo sent:** rielcode.com/demos/ecommerce-reseller/ (matches quoted scope: jualan + reseller/member).
- **Stage:** quoted + demo sent (2026-06-21).
- **Next:** Wait for feedback on demo. Nudge toward DP if positive. Follow-up sent 2026-07-01.

## po Cust 22 — Massage Home Service
- **Source:** Meta Ads WA lead (2026-06-21) | WA +62 857-1624-5929
- **Industry:** Massage home service
- **Request:** Landing site. Key needs: service list + prices, booking button straight to WhatsApp, coverage area.
- **Channel:** WhatsApp only (no Instagram yet).
- **Quote:** Starter Rp1jt → 900rb (LAUNCH10). Includes domain + hosting 1yr + basic admin panel. Delivery 3-5 days.
- **Stage:** thinking (2026-06-21). Sent demo restaurant-cafe, answered edit/admin/Google Ads questions. Said "ntar fikir2 dulu".
- **Next:** Wait 1-2 days, then follow up if no reply. Follow-up sent 2026-07-01.

## po Cust 23 — ABU Robocon 2027 Event (EO)
- **Source:** Instagram Ads WA lead (2026-06-22) | WA +62 851-7309-0066
- **Industry:** Event Organizer, international robot competition
- **Request:** Event website like ABU Robocon HK (app7.rthk.hk/special/aburobocon2026). Info + jadwal only, no registration form.
- **Scope:** Info site (Beranda, Tema/Aturan, Jadwal, Berita, Kontak). ID + EN manual + Google auto-translate widget for other langs.
- **Assets:** Logo ready. PDF content + video on progress (build parallel, fill content later).
- **Quote:** Not yet. Waiting on page count to pick tier (likely Starter/Pro info site).
- **Stage:** scoping (2026-06-22). Confirmed scope, asked page count before quoting.
- **Next:** Wait page count reply, then quote. Follow-up sent 2026-07-01.

## po Cust 24 — Tanur Muthmainnah Travel (Umroh mitra/agen)
- **Source:** Instagram Ads WA lead "Demo gratis" (2026-06-22)
- **Industry:** Umroh & Haji travel, lead is a mitra/agen (not pusat).
- **Request:** Landing page as mitra. Goal both: dapat calon jamaah + rekrut mitra baru.
- **Refs sent by cust:** tanurmuthmainnah.com, tanurtravel.com, tanurmuthmainnahtour.com (closest pick), almiratravel.id/contoh-landing-page-1.
- **Scope (locked):** 1 halaman landing, not full corporate site. Tombol Daftar Umroh (atas) + Gabung Mitra (bawah). 4 pilihan pembayaran sebagai daya tarik utama di atas: Cash, Pay In Haram Land, Pembiayaan Syariah, Kemitraan.
- **Why landing not site:** website utama dipegang pusat; mitra fokus promosi/closing, bukan situs resmi. 1 link gampang share ke WA/IG/status.
- **Assets:** Materi lengkap ada (logo, paket+harga, foto, izin/legalitas).
- **Demo:** Sent free rough demo 2026-06-22 17:26 — https://rielcode.com/demos/umroh-travel/index.html
- **Stage:** demo sent (2026-06-22). Cust approved building free demo first.
- **Next:** Wait cust feedback on demo, then quote tier. Follow-up sent 2026-07-01.

## po Cust 25 — Sanya Lala (Bengkel Las & Interior)
- **Source:** Facebook Ads WA lead "Tanpa DP tanpa risiko, mulai Rp500rb" (2026-06-23), no +62 858-1185-4371.
- **Industry:** Bengkel las + interior. Custom metalwork (pagar, kanopi, railing, furniture besi) + interior fit-out.
- **Request:** Portfolio website to show hasil kerja before clients order.
- **Scope (proposed):** Galeri foto hasil (filter per kategori), bagian sebelum & sesudah, daftar layanan + estimasi harga, tombol WhatsApp. 3 halaman (beranda, layanan, kontak).
- **Demo:** Built free rough demo 2026-06-23 — https://rielcode.com/demos/bengkel-interior/ (slug generic, brand shown = Sanya Lala). Niche registered in demo hub.
- **Demo sent:** 2026-06-23 13:29 via WA. Cust liked it, asked how to link on FB/IG.
- **Budget:** Zero. Said usaha "gulung tikar", "jangankan seribu, buat makan saja susah". Wanted pay-after-business-succeeds (materai). Declined revenue-contingent + deferred-pay (memory rule: no credit/contingent for low-budget first-timers).
- **Stage:** DECLINED 2026-06-23. Too much work (subdomain setup + materai + content swap + chasing) for uncertain 500rb. Demo left as goodwill. Door open if funded later.
- **Next:** None. Reopen only if cust returns with real budget.

## po Cust 26 — I'AM TEKNIK Air Conditioner (Servis AC)
- **Source:** Facebook Ads WA lead "Tanpa DP tanpa risiko, mulai Rp500rb" (2026-06-23), no +62 859-3026-5195.
- **Industry:** Jasa servis AC. Servis, cuci, isi freon, perbaikan, bongkar pasang.
- **Request:** Asked info after demo ad. Lead replied biz = "jasa servis ac".
- **Scope (proposed):** Landing page servis AC: layanan + harga, cek estimasi biaya, testimoni, tombol WhatsApp.
- **Demo:** Built free rough demo 2026-06-23 — https://rielcode.com/demos/iam-teknik-ac/ (brand = I'AM TEKNIK Air Conditioner). Niche "Servis AC" registered in demo hub.
- **Demo sent:** 2026-06-23 via WA. Noted design is rough draft + customizable.
- **Prices (from cust):** Cuci AC (1/2-1pk) Rp 100rb; Isi Freon Rp 350-450rb; Perbaikan kebocoran Rp 250rb; Bongkar Rp 200-250rb; Pasang 1/2-1pk Rp 350rb, 1.5-2pk Rp 450-500rb; Instalasi listrik Rp 80rb/titik; Cuci toren Rp 250-450rb (per ukuran).
- **Demo updated:** 2026-06-23, 6 cards w/ real prices + added Instalasi Listrik + Cuci Toren. Commit 4aa2289.
- **Quote sent:** 2026-06-23. Starter Plan (landing page, domain+hosting 1thn, form+WA, basic CMS, SSL). Normal Rp 1jt, LAUNCH10 promo Rp 900rb (until 30 Jun).
- **Stage:** quote sent (2026-06-23). Awaiting decision.
- **Next:** Wait cust reply on Rp 900rb Starter. If budget objection, scope-down (not credit). Follow-up sent 2026-07-01.

## po Cust 27 — Jasa Servis AC (Purwokerto)
- **Source:** Facebook Ads WA lead "Tanpa DP tanpa risiko, mulai Rp500rb" (2026-06-23).
- **Industry:** Jasa servis AC, Purwokerto. Separate cust from Cust 26 (same niche).
- **Request:** Asked info after demo ad. Biz = "jasa perbaikan instalasi ac ruang".
- **Demo sent:** 2026-06-23 — reused https://rielcode.com/demos/iam-teknik-ac/ (noted rough draft + customizable).
- **Feedback:** Liked demo. Wants name changed + service prices adjusted to Purwokerto market rates. Confirmed customizable.
- **Quote sent:** 2026-06-23. Starter Plan (landing, domain+hosting 1thn, basic CMS, WA, editable). Normal Rp 1jt, LAUNCH10 Rp 900rb (until 30 Jun).
- **Stage:** warm, asked "langkah selanjutnya" (2026-06-23). Strong buying signal. Sent next-step flow + quote.
- **Next:** Wait reply. If yes, collect nama usaha + WA + harga pasaran Purwokerto + logo/foto, then build. If budget objection, scope-down (not credit). Follow-up sent 2026-07-01.

## po Cust 29 — Salmon Hasugian (Tugas Akhir, Mail Management)
- **Source:** Facebook Ads WA lead "Demo gratis, tanpa DP tanpa risiko, mulai Rp500rb" (2026-06-24). WA +62 851-1941-3419 (~Salmon Hasugian).
- **Type:** STUDENT / tugas akhir. Not commercial client. Real custom CRUD web app build (not landing page).
- **Request:** Sistem manajemen surat berbasis web, PHP + MySQL: surat masuk, surat keluar, disposisi, arsip.
- **Scope (locked 2026-06-24):**
  - Login multi-role (admin + pimpinan)
  - Disposisi flow: admin kirim surat → pimpinan disposisi
  - Arsip dengan upload file surat (PDF/scan)
  - Notifikasi IN-APP (model 1, lonceng/alert saat surat masuk baru) — not email/WA push
  - Online: perlu hosting + domain (cust confirmed "perlu kk")
- **Deadline:** akhir bulan Juni 2026 ("bulan 6 akhir") = ~6 hari dari quote. TIGHT. Rush risk, flag in quote (Priority Delivery applies).
- **Quote journey:** First quoted online version Pro+Login+LAUNCH10 = Rp 2.25jt. Cust price-objected ("mahal"), then anchored hard on ad's "mulai 500rb" (expected whole system for 500-600rb). Explained 500rb = Student floor (1-page site), his = real CRUD app. Refused fake-cheap promise (Sanya Lala/Cust 25 trap). Pivoted to **localhost-only** version (no hosting/domain) to fit student budget.
- **Quote sent (localhost):** Rp 1.200.000. Full mail-mgmt system (surat masuk/keluar/disposisi/arsip, 2-role login, file upload, in-app notif) + source code + DB (.sql) + XAMPP setup help. NO hosting/domain (runs localhost for sidang). Payment 20/80 (DP Rp 240rb, sisa Rp 960rb on completion). Floor price, won't go below for this scope+rush.
- **Online upsell door:** If funded later, add hosting+domain ~600-800rb add-on.
- **Stage:** STALLED on funds (2026-06-25). Pushed 1.0jt sidang/deadline rush price + DP-today CTA. Cust replied "kasih waktu dulu buat ngumpulin uangnya" (needs time to gather money). Azriel acknowledged "baik". Ball in cust court.
- **Note:** Already dropped from 1.2jt to **1.0jt** (sidang rush concession). Floor now 1.0jt for full CRUD + setup help. Do not go lower.
- **Next:** Wait for cust to confirm funds. Follow-up sent 2026-07-01 (deadline end-June already passing; sidang may slip). Do NOT chase aggressively, no money = no start.

---

## po Cust 30 — Tony (Laundry Service)
- **Source:** Facebook Ads WA lead (2026-06-25). Replied "Service / Laundry" to auto-greeting. ~Tony.
- **Type:** Commercial. Laundry service business, no existing website (mulai dari nol).
- **Request:** Tampilkan semua — layanan, harga, tombol kontak WA, plus fitur pesan/jemput cucian online dari pelanggan ("tampilkan semuanya").
- **Demo sent:** rielcode.com/demos/laundry/ (beranda, layanan+harga, pesan jemput online, kontak). Cust reply: "Modelnya udah sesuai sih, hanya mungkin perlu ada sedikit tambahan dan penyesuaian." Positive, minor tweaks expected.
- **Stage:** WARM / order-form sent (2026-06-25). Cust asked "bagaimana untuk memulainya?" (buying-intent signal). Azriel sent order form https://rielcode.com/en/order?aksi=starter + LAUNCH10 10% checkout promo. Ball in cust court (fill form).
- **Quote:** Not formally quoted yet. Demo = laundry niche, has online pesan-jemput feature = likely Pro tier (booking/order form + admin). Confirm exact scope after form. Apply LAUNCH10.
- **Next:** Wait for form submission. Follow-up sent 2026-07-01 (nudged form, offered walk-through). Hot lead, asked how to start, do not lose to friction.

---

## po Cust 31 — SULTAN PROPERTY / PT Sultan Kaya Perkasa
- **Source:** Facebook/Meta Ads WA lead (2026-06-25). +62 813-1888-5693. Replied to "Free Demo" ad.
- **Type:** Commercial. Integrated property company: agen properti + arsitek + kontraktor + developer. Wants all 4 functions in one website. No existing site.
- **Request:** Company profile (kredibel sebagai developer/kontraktor) + etalase listing properti + form kontak ke WA. Quality bar set: "Boleh. Dan harus bagus."
- **Demo sent:** rielcode.com/demos/property/ — dark-luxury aesthetic, filterable listings (rumah/kavling/komersial), company profile sections, project mosaic, WA lead form, count-up stats. Built with placeholders (cust said use placeholders, swap real assets later). Committed to prod 981d6cb.
- **Cust reaction:** "Sudah lumayan simple dan mudah. Tapi tetep komplit." Positive, approved model. Then "Iya. Boleh..kirim aja" to pricing.
- **Quote:** Pro Plan Rp 2.000.000 → LAUNCH10 10% off = **Rp 1.800.000**. Includes up to 5 pages, filterable listings, CMS/Admin Panel (cust can self-update listings — core value), WA contact form, Advanced SEO, Google Analytics, free domain+hosting 1yr, 2 revisions, 1mo support. Add-on upsell door: detailed property search, per-project pages, AI chatbot.
- **Structure confirmed (2026-06-25):** Cust chose multi-page ("boleh liat yg ke 2") + self-update listings ("agar memudahkan dan sllu update"). = Pro tier locked (multi-page + CMS). Did NOT build 2nd demo — Pro delivers exactly what they described; avoid free preview loop.
- **Stage:** WARM / quote sent (2026-06-25). Pro Rp 1.8jt framed as "the v2 you asked for". Soft close w/ DP ask + offer to plan page structure together after start. Ball in cust court.
- **Next:** Wait for DP confirm. If yes → swap placeholders for real logo/photos/listings, build multi-page. Follow-up sent 2026-07-01. Strong signal (approved demo + confirmed scope + asked price), do not lose to friction.

---

## po Cust 32 — PT Sinar Mas Benua (Pupuk & Herbisida)
- **Source:** Meta Ads WA lead "Free Demo" (2026-06-30). +62 851-2667-5059.
- **Type:** Commercial. Distributor pupuk, herbisida, racun rumput. Own-brand "Amy" line: Amy Peak (herbisida sistemik 525 SL), Amy Quat (herbisida kontak 325 SL), Genta Xone. No existing site.
- **Request:** Best-fit website (cust said "bebas, yang terbaik"). Scoped to katalog produk + company profile, order forwarded to WhatsApp.
- **Demo sent:** rielcode.com/demos/katalog-pertanian/ — green agro theme, beranda (company profile) + katalog (filter per kategori herbisida/pupuk/pestisida + search) + product detail (kemasan 1L/5L/20L, qty, WA order). Brand shown = "Sinar Tani" (generic). Mobile nav fixed. Listed in demos hub.
- **Key requirement (2026-06-30):** "Harganya wajib saya berikan per produk." CLARIFIED: means each product DISPLAYS its own price, and CUST supplies the prices for US to input ("Kk aj yg kasih kk"). NOT self-manage CMS. So no forced CMS upsell from this.
- **Prices sample given:** Amy Quat 328 SL — 1L Rp60.000, 5L Rp300.000, 20L Rp1.050.000. Amy Peak "harga sama". Prices are PER-KEMASAN (1L/5L/20L differ). Demo currently shows one price + kemasan selector that doesn't change price — gap to handle at build (per-kemasan pricing) IF deal closes.
- **Quote sent (2026-06-30):** Pro Plan Rp2jt → LAUNCH10 = **Rp1.800.000**. Catalog + company profile + WA order, domain+hosting 1yr, basic admin panel, SEO. Prices input by Rielcode (cust supplies).
- **Gating:** Full product list collection GATED behind commit. Do NOT gather catalog/prices until cust confirms order (avoid free catalog labor on uncommitted lead).
- **Stage:** WARM / price-clarify (2026-07-01). Saw demo (positive), got Pro 1,8jt quote. Re-contacted asking "website yg 490k yg mana" — anchoring on ad "mulai 500rb". No 490k tier exists; nearest = Student 500rb (1-page, no domain/hosting), does NOT fit his katalog+profile+per-produk-price+WA scope. Replied: explained Student vs his need, held Pro Rp1.8jt (LAUNCH10 honored past 30 Jun), offered scope-down talk.
- **Next:** Wait reply. If budget objection, scope-down to Starter katalog-lite (not credit). If yes → collect full product list + per-kemasan prices, build per-kemasan pricing into demo. Don't push.

---

## po Cust 33 — XL SATU AXIATA (WiFi Sales Agent)
- **Source:** Meta Ads WA lead (2026-07-01). +62 813-9700-6865.
- **Type:** Commercial. WiFi sales agent (jual/pasang wifi), Medan. Wants website to get more subscribers. No existing site.
- **Area layanan:** All Medan + All Deli Serdang.
- **Request:** Website to promote wifi subscription + pendaftaran online. Scoped: paket wifi info, area layanan, cara pasang/langganan, form pendaftaran calon pelanggan, WA contact.
- **Key requirement:** Form pendaftaran = customer fills when agreeing to subscribe. Fields: upload KTP + Email + pilih paket + alamat pemasangan + no HP. Syarat berlangganan = KTP + Email.
- **Demo sent:** rielcode.com/demos/iam-teknik-ac/ — closest install-service model (jasa pasang). Told it's rough draft, will redesign for wifi brand. Positive ("Ok mantap").
- **Quote sent (2026-07-01):** Pro Plan Rp2jt → LAUNCH10 = **Rp1.800.000**. Up to 5 pages, form pendaftaran (KTP+Email+paket+alamat), CMS/Admin Panel (Basic), Advanced SEO, domain+hosting 1yr, SSL, Google Analytics, 2 revisi, 1 bulan support. DP 20% Rp360.000 to start, 80% Rp1.440.000 on finish. Delivery 7-10 hari.
- **Stage:** WARM / quoted (2026-07-01). Sent full rincian. Awaiting reply.
- **Next:** Wait reply. If yes → collect brand assets (logo, paket list + prices, coverage map) + start on DP. Don't push.

---

## po Cust 34 — Perumahan Sabaat Permai (Rumah Subsidi Kupang)
- **Source:** Facebook/Meta Ads WA lead "Nggak usah bayar dulu sampai kamu lihat hasilnya" / "Free Demo" (2026-07-01). +62 813-5388-6771 (~Amor / Yust).
- **Type:** Commercial. Developer perumahan subsidi. Entity **PT Sabaat Jaya Persada**, proyek **Perumahan Sabaat Permai**. Lead intro: "Yust dari Kupang NTT, bisnis Property subsidi". No existing site.
- **Location:** Desa Penfui Timur, Kec. Kupang Tengah, Kab. Kupang, Nusa Tenggara Timur.
- **Request:** Website tampilkan listing rumah + fitur cari/filter + admin panel biar bisa update listing sendiri. Confirmed "tentunya ada fitur cari saat update".
- **Scope (locked):** Listing tipe unit + cari/filter status (tersedia/booking/terjual) + CMS/admin update sendiri + form ajukan KPR ke WhatsApp. = Pro tier fit.
- **Quote (verbal):** Pro Plan Rp2jt. Add-on Catalog door if unit banyak/kompleks. LAUNCH10 available.
- **Demo:** Built free rough demo 2026-07-01 — rielcode.com/demos/perumahan-subsidi/ (brand shown = Perumahan Sabaat Permai, warm green theme, hero + listing tipe rumah w/ cari+filter status + keunggulan subsidi + simulasi cicilan + syarat KPR + lokasi Penfui Timur + form WA). Placeholders for photos. Listed in demo hub.
- **Stage:** demo sent + engaged (2026-07-02). Cust reviewing, sending real data via brosur: tipe rumah, harga mulai Rp185jt (lokasi Kaniti Kupang), syarat KPR per brosur. Said "yang lain bisa diperbaiki" — warm, wants penyesuaian tampilan + isi data. Not yet ordered / no DP agreed.
- **Next:** Close on Pro Rp2jt (LAUNCH10 available). Once cust confirms demo model fits, lock order → collect full assets (logo, tipe unit + harga + status, foto rumah, peta Kaniti, syarat KPR full) → DP 20%. Don't push invoice before verbal yes.

---

## po Cust 37 — Toko Plafon Anugrah (Plafon PVC Cibinong)
- **Source:** Facebook/Meta Ads WA lead "Nggak usah bayar dulu sampai kamu lihat hasilnya" / "Free Demo" (2026-07-02).
- **Type:** Commercial. Toko jual plafon PVC. Lokasi Cibinong, Kab. Bogor. No existing site.
- **Business type given:** "Penjualan plafon PVC." Nama usaha: "Toko Plafon Anugrah Cibinong."
- **Scope (initial):** Katalog produk plafon (motif/polos/glossy + lis/aksesoris) + halaman harga per model + kontak/pemesanan via WhatsApp. Likely add borongan + pasang option.
- **Demo built (2026-07-02):** rielcode.com/demos/plafon-pvc/ — blue-grey interior theme, brand "Plafon Anugrah". Beranda (company profile) + katalog (filter kategori Motif/Polos/Glossy/Lis + search) + product detail (opsi Per Lembar / Per Dus / Borongan+Pasang, qty, WA order). Placeholder photos + prices. Listed in demos hub.
- **Stage:** demo about to send (2026-07-02). Not yet ordered, no quote sent, no DP.
- **Next:** Send demo link w/ rough-draft note. Wait for fit confirm. If positive → scope (self-manage CMS vs we-input), quote Pro or Starter per need, LAUNCH10. Don't push price on first demo.

---

## po Cust 39 — GIG Homestay (Homestay / Penginapan, Sorong Selatan)
- **Source:** Facebook/Meta Ads WA lead (2026-07-03). WA +62 822-3946-9877. Bisnis jasa nginap / homestay.
- **Type:** Commercial. Homestay "GIG" (brand: gold crown logo "GIG Teminabuan"). Rooms "Deluxe Twin" IDR 500.000/malam. Benefit: Free Laundry 2pcs, WiFi, complimentary water. No existing site.
- **Alamat:** Kompleks Pasar Kajase, Teminabuan, Kab. Sorong Selatan.
- **Website type wanted:** Company Profile saja (confirmed by lead, not booking+payment).
- **Demo built (2026-07-04):** rielcode.com/demos/homestay/ — brand "Aruna Homestay". Iterated 3x: (1) initial dark terracotta = too construction-like, (2) redesigned warm cream + terracotta + sage boutique (light theme, hero polaroid stack, price badge, marquee ribbon, Fraunces + Nunito Sans), (3) emojis swapped for line SVG icons. Sections: hero, rooms w/ filter (Standard/Deluxe/Family), facilities, gallery, location, booking form-to-WA. Mobile: right slide-in drawer + overlay, verified 390-1440px no overflow/errors. Listed in demos hub.
- **Lead instructions (2026-07-04):** Sent 9 real photos of GIG Homestay (rooms, corridor, entrance). Gave address. Said "pakai saja warna yang ada jgn di ganti" = use their existing brand colors (dark + gold), don't change. NOTE: demo is currently light/warm; their brand is dark+gold — retheme to their brand at build (after DP).
- **Quote sent (2026-07-04):** Starter Plan IDR 1jt — 1 halaman lengkap (hero, kamar, fasilitas, galeri, lokasi, form booking WA), custom design pakai foto+warna brand, free domain + hosting 1 thn, SSL, Basic CMS/Admin Panel, SEO dasar, 1x revisi. DP 20% (Rp200k) / 80% on finish.
- **Objection (2026-07-04):** "kemahalan" + soft exit "Makasih yah dah kinfirm". Price stall, not hard no. High intent (sent photos, address, color spec). Counter drafted: LAUNCH10 → Rp900k, DP recalc Rp180k, value reframe (hosting+domain 1yr absorbs most cost). Did NOT offer Student/500k (strips hosting+domain they need).
- **Stage:** Price objection, counter-offer (LAUNCH10 Rp900k) drafted, not yet accepted. No DP, no build.
- **Next:** Send LAUNCH10 counter. If still balks, ask target budget (don't keep cutting). On agree → DP Rp180k, then build with their real photos + dark+gold brand + real address. Retheme demo to their brand only after DP.

---

## po Cust 40 — AP Rent Car (Rental Mobil)
- **Source:** WhatsApp lead (2026-07-04). WA +62 821-5105-2789. Business account "~A'P RENT'CAR", joined Jan 2024.
- **Type:** Commercial. Rental mobil. No existing site.
- **Website type wanted:** Booking online (lead picked "No 2" = booking system, not just catalog or profile). Also asked booking terhubung langsung ke WhatsApp.
- **Plan mentioned:** Lead plans to run ads ("mau di kasih iklan juga pakai ads") → site is ad landing page. Potential future ads upsell.
- **Demo built (2026-07-05):** rielcode.com/demos/rental-mobil/ — brand "AP Rent Car", green boutique theme (Fraunces + Inter). Hero + armada (6 cars: Avanza/Innova/Brio/Hiace/Xpander/Fortuner, price/day + specs), Cara Sewa 3-step, Kenapa Kami, booking form (pilih mobil + tanggal ambil/kembali + live cost estimate + tipe sewa lepas kunci/sopir → success). Mobile: right slide-in drawer + overlay, verified 390-1440px no overflow/errors. Committed to production, listed in demos hub.
- **Quote sent (2026-07-05):** Pro Plan IDR 2jt — website daftar mobil + form booking, booking terhubung ke WhatsApp (notif masuk WA), Panel Admin (self-manage armada + harga), free domain + hosting 1 thn, SSL, Advanced SEO. NO discount (LAUNCH10 expired July). DP 20% (Rp400k) / 80% on finish explained.
- **Stage:** Quote + payment terms sent, lead soft-deferred "tanya istri dulu" (2026-07-05). No DP, no build. Warm, not a no.
- **Next:** Follow up in a few days if no reply. On agree → DP Rp400k, then build with real fleet photos + prices + brand. Booking-to-WA is the hook (matches their ask). Do NOT offer LAUNCH10 (expired). If they later commit to ads, revisit ads-service upsell.

---

## po Cust 41 — Servis + Cuci AC (WA lead)
- **Source:** WhatsApp lead from Meta ad (2026-07-06). WA +62 822-5195-5441. Sent 2 videos of AC service work ("Ibu Ilham service"), no text answer to discovery.
- **Type:** Commercial. Jasa servis + cuci AC. No existing site. Same niche as Cust 26 (I'AM TEKNIK AC) but separate lead.
- **Website type wanted:** Landing page servis AC. Asked "bisa muncul di laman pertama Google" — answered honestly no ranking guarantee, offered Advanced SEO add-on as real lever.
- **Demo sent (2026-07-06):** rielcode.com/demos/iam-teknik-ac/ (existing AC service demo). Lead responded "ok" (passive).
- **Quote sent (2026-07-06):** Starter Plan IDR 1jt — landing page (1-2 halaman), custom design, free domain + hosting 1 thn, SSL, admin panel (Basic), 1 revisi. DP 20% (Rp200k) / 80% on finish explained. NO LAUNCH10 (expired July).
- **Stage:** Lead said "boleh" to proceed. Sent self-serve order form link (rielcode.com/en/order?aksi=starter, Starter preselected) for lead to fill own data → invoice generated → pay DP via TF or QRIS. Waiting on form submission.
- **Next:** On form submit → send invoice, collect DP Rp200k (TF/QRIS). After DP → build with real brand name, logo, service list + prices, WA number, area, work photos for gallery. Advanced SEO (Rp200rb) upsell still open if they push ranking.

---

## Deleted from potential customers

## ~~po Cust 1 — Jatra Scale Indonesia~~ (DELETED)
- **Industry:** Industrial weighing & calibration. Goal: Google ranking (SEO).
- **Last quote:** Pro + Blog = IDR 2.4jt. Removed from active pipeline.

## ~~po Cust 3~~ (DELETED)
- Placeholder, was awaiting call. Removed from active pipeline.

---

## Cross-cust patterns
- Many leads use AI (ChatGPT/Claude) to draft an oversized spec, then anchor to budget price. Reframe to real tiers.
- Most lack real photos/testimonials at proposal stage. Launch on placeholders, swap real content later.
- Common fork: simple 1-page landing (~1jt) vs multi-page Pro with SEO (~2.3-2.4jt).
