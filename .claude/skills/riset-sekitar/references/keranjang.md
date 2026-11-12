# Keranjang kuning research

Only for when Azriel has turned the keranjang on. Choices below marked "original author" came with the skill: confirm them with Azriel the first time. Read `aturan-keranjang.md` too, before writing any film idea.

## Find the products

Categories: **listrik & elektronik, rumah & dapur, motor & kendaraan**. Health and beauty are excluded (original author's choice): the claims rules are the strictest there and supplements need a BPOM certificate. Vary the categories across suggestions unless he asked for one.

**a. Find what's popular.** No free source gives a TikTok Shop ranking for Indonesia, so triangulate and state what each signal really is:

| Source | Tested 1 Nov 2026 | Use for |
|---|---|---|
| Azriel's screenshots from his affiliate account | Not yet available | Best evidence for popularity, price and commission. Ask if he has them |
| Lazada trending pages, found by searching `lazada.co.id trending` + product. Variants: `Top-Repurchased`, `Top-AddToCart`, `Best-Rated-Products`, `Top-Deals-This-Month` | Readable: price plus repurchases, cart adds or a high-rating count. Undated | Popularity signal, on Lazada only. Repurchase is the strongest of these |
| [involve.asia top 30](https://involve.asia/blog/top-selling-tiktok-shop-affiliate-products-indonesia/) | Readable, updated Jun 2026, mostly skincare | Which categories move on TikTok Shop |
| Media "terlaris" lists, market-share reports | Readable, often sponsored or old | Weak support; check the date |
| Shopee, Tokopedia search | Shopee empty or login wall; Tokopedia timeout, also in headless Chrome and on its `/find/` pages. Search results still quote some Tokopedia listings | Don't fetch these. Treat quoted listings as `penjual` |
| TikTok itself | CAPTCHA | Don't spend time on it |

**b. Find the common problem** of that kind of product, from official warnings, repair guides, forums and media. Buyer reviews on the marketplaces couldn't be read in the 1 Nov 2026 test, so unless Azriel sends review screenshots, write "ulasan pembeli belum dibaca" and don't claim how common a complaint is: "4 dari 12 ulasan" is evidence, "banyak yang mengeluh" isn't. Then find why it happens, because that mechanism is the film.

**c. Analyse one exact model.** The model must help with that problem. Read the manufacturer's page and specification first, then independent reviews. A spec from a sibling model doesn't count, and a popular model with no findable spec stays a candidate, not a suggestion, until the gap is stated plainly. Label every claim as `resmi`, `media`, `model` (as in `sekitar`), `penjual` (seller's text) or `ulasan` (buyer reviews). An advantage resting only on `penjual` is reported as the seller's claim and stays out of the film until it has better support.

Find its weaknesses just as hard, for the report. For electrical products, check for the SNI mark where one is required.

**d. Drop it if** a real safety complaint keeps recurring, the main promise fails in reviews, or it needs a claim the rules forbid. `aturan-keranjang.md` rules out "X vs Y" with a rival, "terlaris" and "terbaik" as lines, and a product that isn't clearly shown.

## Report shape

```markdown
## Dengan keranjang kuning (hanya kalau sudah diaktifkan lagi)

### 1. <pertanyaan sebagai judul video>
- **Barang:** <merek + model persis>, sekitar Rp… (<sumber>, <tanggal>)
- **Bukti populer:** <sinyalnya, dan di platform mana>
- **Masalah umum:** <masalahnya> (<berapa keluhan yang dibaca>, [sumber](url))
- **Kenapa terjadi:** <sebab-akibat yang jadi isi video>
- **Keunggulan (masuk video):** <hanya yang punya bukti, dengan label dan sumber>
- **Kekurangan (hanya untukmu, tidak masuk video):** <kekurangan barang>
- **Cara tampilkan barang:** <klip atau foto asli, 3D yang sama persis; perlu beli atau pinjam?>
- **Cek sebelum dipakai:** barang ada di TikTok Shop affiliate? komisi berapa? <lainnya>
```

## Hand-off to sekitar

Carry `aturan-keranjang.md` and these limits into the script:

- Advantages only in the film. `sekitar`'s fairness turn ("Twist") goes on a habit or common belief, never on the product's weakness and never on another brand.
- Replace `sekitar`'s "X vs Y" angles with a question about the mechanism.
- Name and show the exact linked model. Turn on the AIGC label. Put the affiliate disclosure in the caption.
