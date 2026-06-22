# FTI Campus Marketplace — HCI Final Project Plan

## Context

College HCI final project (Satya Wacana Christian University, Faculty of Information Technology, CompSci). Standalone, separate from Rielcode.

Turn the existing FTI faculty WhatsApp-group marketplace into a real working application. The assignment splits the system in two (slides 2, 12-15): **Mobile Application = public user (the marketplace itself)**, **Desktop Application = admin**. Both share one backend + one database. Two deliverables:

1. **Fixed survey** (max 10 questions, Google Forms) — gather student pain points before building.
2. **Full build plan** — real working **Flutter mobile app + Laravel API + Filament web admin**.

**Architecture (locked):**
- **Flutter** mobile app = public marketplace (buyer/seller). Calls the Laravel API over HTTPS.
- **Laravel 12** (PHP 8.2) = REST/JSON API **+** Filament 3.3 web admin. **One MySQL DB, one source of truth** — admin and mobile read/write the same data (no Firebase, no second DB, no sync hell).
- **Auth:** Laravel **Sanctum** API tokens. Flutter stores the token in secure storage → user stays logged in across app restarts (solves the logout-on-close problem natively on mobile). Google login via Socialite (server-side) issuing a Sanctum token. Roles: `user` / `admin` via `role` enum.
- **Real-time chat:** Laravel **Reverb** websockets (hosting has Node, scales to campus). Flutter subscribes via a Pusher/Echo-compatible Dart package. Plus "make an offer".
- **Admin:** Filament web dashboard opened in a desktop browser = the assignment's "Desktop Application".
- Public browsing in the app = NO login. Login required only to sell/chat/offer/wishlist/profile.
- Scope: all 4 tiers in order — Core MVP → Chat+Offers → Ratings+Reviews → Polish.
- Design: secondhand-marketplace mobile layout (soft rounded cards, pill buttons, bottom tab nav Home/Wishlist/Sell/Inbox/Profile, category chips, spec chips, make-offer/checkout) **recolored** to palette: white `#FFFFFF`, royal blue `#003CCB`, navy `#00296B`, yellow `#FCC131`.

**Two codebases:** `C:\xampp\htdocs\fti-marketplace` (Laravel API + admin) and a separate Flutter project `fti_marketplace_app`.

---

## PART 1 — Survey (Google Forms, 10 Q)

Changes from original draft: **dropped old Q8** (platform app-vs-web — contradicts the design decision), **replaced with seller-trust Q8** (feeds verified-badge + rating features; stronger research backing — rubric rewards research that justifies design), **trimmed Q6** (removed loker/dropbox + ojol — unrealistic infra), fixed mojibake dashes.

### Form header + description (paste into Google Forms top)

**Nama:** Azriel Fajar Wicaksono
**NIM:** 672025121

**SURVEI MARKETPLACE DIGITAL FTI**

> Halo teman-teman civitas akademika FTI! 👋
>
> Selama ini jual-beli barang antar mahasiswa masih berserakan di grup WhatsApp, susah dicari, dan kadang bikin ragu soal kepercayaan. Lewat Tugas Rancang ini, kami ingin merapikan semua itu menjadi satu aplikasi marketplace khusus untuk lingkungan FTI.
>
> Sebelum membangun, kami butuh suara kalian. Survei singkat ini membantu kami memahami apa yang benar-benar kalian butuhkan, kendala yang sering dialami, dan fitur yang paling kalian harapkan.
>
> Pengisian hanya butuh 2-3 menit dan jawaban kalian sangat menentukan arah aplikasi ini. Terima kasih sudah ikut membentuk marketplace kita sendiri. 🙏

### Questions + answers

**1. Apa status kamu saat ini di kampus?**
Mahasiswa aktif / Mahasiswa semester akhir / Alumni / Dosen / staf

**2. Pernahkah kamu menjual atau membeli barang sesama civitas akademika (teman, kakak tingkat, dll)?**
Ya, sering / Ya, pernah sekali dua kali / Belum pernah tapi tertarik / Tidak tertarik

**3. Kategori apa yang paling ingin kamu jual atau beli di marketplace ini?** (pilih semua yang sesuai)
Laptop & elektronik / Alat tulis & perlengkapan / Pakaian & aksesoris / Makanan & minuman / Jasa (titip, les, desain, dll)

**4. Apa kendala terbesar yang pernah kamu alami saat jual-beli sesama mahasiswa secara informal?** (pilih semua yang sesuai)
Sulit menemukan pembeli/penjual / Takut ditipu atau barang tidak sesuai / Tidak ada tempat/platform khusus / Proses tawar-menawar yang awkward / Tidak tahu harga yang wajar / Tidak pernah mencoba sama sekali

**5. Informasi apa yang wajib ada di setiap listing produk menurut kamu?** (pilih semua yang sesuai)
Foto produk yang jelas / Kondisi barang (baru/bekas/persentase) / Harga & bisa/tidak ditawar / Lokasi penjual (gedung/kampus) / Identitas penjual terverifikasi / Estimasi waktu pengambilan

**6. Model transaksi seperti apa yang paling cocok untuk marketplace kampus ini?**
COD langsung di kampus / Titip ke teman / Transfer dulu, ambil barang menyusul / Lainnya

**7. Sistem rating/reputasi penjual seperti apa yang menurutmu paling efektif dan adil?**
Bintang 1-5 dari pembeli / Ulasan teks + bintang / Badge level (Pemula, Terpercaya, Top Seller) / Jumlah transaksi sukses saja

**8. Apa yang paling membuat kamu percaya pada seorang penjual di marketplace kampus?** (pilih semua yang sesuai)
Akun terverifikasi pakai email kampus / Rating & ulasan dari pembeli lain / Badge level penjual / Jumlah transaksi sukses / Foto profil & identitas jelas

**9. Seberapa sering kamu kemungkinan menggunakan marketplace ini jika sudah tersedia?**
Hampir setiap minggu / 1-2 kali per bulan / Hanya saat butuh saja / Mungkin tidak akan pakai

**10. Ada masukan, fitur impian, atau kekhawatiran yang ingin kamu sampaikan untuk marketplace ini?**
(Jawaban terbuka)

> Min 5 respondents (rubric). Aim higher for stronger data.

---

## PART 2 — Build Plan

### Data model (tables + key columns) — shared MySQL DB

- **users** (extend default): `role` enum('user','admin'), `google_id` nullable unique, `avatar`, `phone`, `bio`, `campus_program`, `is_verified_seller` bool, `onboarded_at`, `theme_preference` enum, `password` **nullable** (Google-only users).
- **categories**: `name`, `slug`, `icon`, `sort_order`.
- **listings**: `user_id`(seller), `category_id`, `title`, `slug`, `description`, `price`, `condition` enum, `status` enum('available','reserved','sold'), spec chips `size`/`material`/`color`/`brand`, `location`, `views_count`, `sold_at`, softDeletes.
- **listing_images**: `listing_id`, `path`, `is_primary`, `sort_order`.
- **wishlists** (pivot): `user_id`+`listing_id` unique.
- **conversations**: `listing_id`, `buyer_id`, `seller_id`, `last_message_at`; unique(`listing_id`,`buyer_id`).
- **messages**: `conversation_id`, `user_id`(sender), `body`, `type` enum('text','offer','system'), `offer_id` nullable, `read_at`.
- **offers**: `listing_id`, `conversation_id`, `buyer_id`, `seller_id`, `amount`, `status` enum('pending','accepted','rejected','withdrawn'), `responded_at`.
- **transactions**: `listing_id`, `seller_id`, `buyer_id`, `final_price`, `offer_id` nullable, `status`, `completed_at`.
- **reviews**: `transaction_id` unique, `reviewer_id`, `seller_id`, `rating` 1-5, `body`.
- **feedback**: `user_id` nullable, `type` enum('account','app'), `subject_user_id` nullable, `rating`, `message`, `status`.
- **notifications**: built-in `php artisan notifications:table` (polymorphic).

**Badge accessor on User**: completed sales count → 0-2 Pemula, 3-9 Terpercaya, 10+ Top Seller (thresholds in config). Exposed in API responses + Filament.

Flutter never touches the DB directly — only calls the Laravel API. Filament reads/writes the same tables. No second database, no Firebase, no sync.

---

### A. Backend — Laravel API + Filament admin (`C:\xampp\htdocs\fti-marketplace`)

#### Setup sequence (Apache+MySQL running, DB `fti_marketplace` created)

```bash
composer create-project laravel/laravel fti-marketplace
cd fti-marketplace
# .env: DB_DATABASE=fti_marketplace, DB_USERNAME=root, DB_PASSWORD= , QUEUE_CONNECTION=database
composer require laravel/sanctum          # API token auth (mobile)
php artisan install:api                   # publishes Sanctum + routes/api.php (L11/12)
composer require laravel/socialite        # Google login (server-side)
composer require filament/filament:"^3.3" && php artisan filament:install --panels
php artisan make:filament-user            # then set role='admin' via tinker
php artisan install:broadcasting          # installs Reverb (websocket server)
php artisan queue:table && php artisan notifications:table
php artisan storage:link
php artisan migrate
```

No Breeze, no Blade public views, no Vite/Echo on the backend — the public UI lives entirely in Flutter. Filament brings its own assets.

#### API endpoints (`routes/api.php`, prefix `/api/v1`, JSON)

**Public (no token):**
- `GET /listings` — browse + `?search=&category=&sort=` filters (paginated)
- `GET /listings/{slug}` — detail (increments `views_count`)
- `GET /categories` — category chips/grid
- `GET /sellers/{user}` — public seller profile + reviews + badge
- `POST /auth/register`, `POST /auth/login` — returns Sanctum token
- `POST /auth/google` — Flutter sends Google ID token → server verifies via Socialite stateless → `firstOrCreate` user → returns Sanctum token
- `POST /feedback/app` — app feedback (guest allowed)

**Protected (`auth:sanctum`):**
- `GET /me`, `PUT /me` (profile), `POST /auth/logout` (revoke token)
- `POST /listings`, `PUT /listings/{id}`, `DELETE /listings/{id}`, `POST /listings/{id}/sold`, `POST /listings/{id}/images`
- `GET/POST/DELETE /wishlist`
- `GET /conversations`, `GET /conversations/{id}`, `POST /conversations/start/{listing}`, `POST /conversations/{id}/messages`
- `POST /listings/{id}/offers`, `POST /offers/{id}/accept`, `POST /offers/{id}/reject`
- `POST /transactions/{id}/review`
- `GET /notifications`, `POST /notifications/{id}/read`
- `POST /feedback/account`

**API Resources** (`app/Http/Resources/*`): `ListingResource`, `ListingDetailResource`, `UserResource`, `SellerResource`, `ConversationResource`, `MessageResource`, `OfferResource`, `ReviewResource` — clean JSON, hide internal columns, embed `primary_image_url`, `seller.badge`, `is_wishlisted`.

**Controllers** (`app/Http/Controllers/Api/*`): `AuthController`, `ListingController`, `CategoryController`, `SellerController`, `WishlistController`, `ConversationController`, `MessageController`, `OfferController`, `ReviewController`, `FeedbackController`, `NotificationController`. API resource controllers (`--api`), Form Requests for validation, Policies for ownership.

#### Auth specifics (Sanctum, mobile-first)

- **Email/pass:** `POST /auth/login` → validate → `$user->createToken('mobile')->plainTextToken` → Flutter stores in `flutter_secure_storage`. **Token persists across app restarts = stays logged in** (logout problem solved natively; no session/remember-me cookie needed for mobile).
- **Google:** Flutter `google_sign_in` gets a Google ID token → `POST /auth/google` → server `Socialite::driver('google')->stateless()->userFromToken($idToken)` → `firstOrCreate` on `google_id`/`email` (password null, `email_verified_at=now()`) → returns Sanctum token.
- **Logout:** `POST /auth/logout` → `$request->user()->currentAccessToken()->delete()`.
- Filament admin uses normal **session** auth (web guard) — `canAccessPanel()` gates `role==='admin'`. Two guards coexist (Sanctum for API, web for Filament).
- Public-browse vs gated split = middleware: gated routes under `Route::middleware('auth:sanctum')`. Policies: ListingPolicy, ConversationPolicy, OfferPolicy (seller-owns, thread-participant, buyer-of-completed-txn).

#### Filament resources (admin = the "Desktop Application")

`make:filament-resource` for: **User, Category, Listing, Offer, Transaction, Review, Feedback, Conversation** (`--generate`). Relation managers: Listing→Images/Offers, User→Listings/Reviews, Category→Listings. Dashboard widgets: stats overview (users, active listings, completed transactions, revenue) + sold-vs-available chart. Brand `#003CCB` primary, name "FTI Marketplace" — **same palette + terminology as the Flutter app** (cross-platform consistency, graded). Satisfies **desktop admin ≥3 pages + full CRUD** (8 resources × 4 ops).

#### Real-time chat (Reverb ← Flutter)

- Events (`ShouldBroadcastNow` for demo; `ShouldBroadcast`+queue for scale): `MessageSent`, `OfferMade`, `OfferResponded` on `PrivateChannel('conversation.{id}')`.
- `routes/channels.php` authorizes only buyer/seller. **Sanctum-token channel auth:** Flutter's websocket client authenticates the private channel via `POST /broadcasting/auth` with the Bearer token (`Broadcast::routes(['middleware' => ['auth:sanctum']])`).
- `OfferMade` → offer row + `type='offer'` message + notify seller. `OfferResponded` accept → `transaction` row, listing → reserved/sold, system message → unlocks review.

---

### B. Frontend — Flutter app (`fti_marketplace_app`)

**Stack:** Flutter (Dart), `dio` (HTTP), `flutter_secure_storage` (token), `google_sign_in` (Google login), `provider`/`riverpod` (state), `cached_network_image`, a Pusher-channels Dart client (`pusher_channels_flutter` or `dart_pusher_channels`) pointed at Reverb for chat.

**Screens (mapped to design ref + rubric):**

| Screen | Design element | Rubric |
|---|---|---|
| Home | category chips, Explore-by-Category grid, New-This-Week cards + wishlist heart, search bar | **Required: Home** |
| Browse/Search | search, filter sheet, category chips, card grid (infinite scroll) | **Required: Main Feature** |
| Listing detail | image carousel, seller row + verified badge, condition/size/material/color spec chips, price, Make-an-Offer + Chat | detail |
| Sell (create/edit) | form — dropdown category/condition chips, image picker (**minimal typing**) | "minimal typing" |
| Profile/Settings | avatar, badge, my listings, theme toggle, logout, feedback | **Required: Profile/Settings** |
| Wishlist tab, Inbox tab, Chat thread (live bubbles + offer accept/reject), Seller profile, Onboarding carousel, Notifications, Checkout/order-summary (simulated Pay Now / campus pickup) | bottom-nav tabs + extras | extra + polish |

**Bottom tab nav:** Home / Wishlist / Sell / Inbox / Profile. 3 required screens (Home, Browse, Profile) + ~9 more. Theme = brand palette (blue/navy/yellow on white). Finger-friendly tap targets, readable text, high-visibility CTAs — Mobile UI rubric (25%).

---

### Build phases (shippable milestones)

Build **backend API first, then Flutter consumes it** per phase. Test each API endpoint with a REST client before wiring Flutter.

- **P0 Scaffold:** Laravel setup (Sanctum/Filament/Reverb), migrations + models + relationships, seeders (categories + demo data), brand Filament. Flutter init + theme + dio client + secure-storage token interceptor. *Ship: API boots, admin login works, Flutter shows empty themed shell hitting `/categories`.*
- **P1 CORE MVP:** Auth endpoints (register/login/google/logout) + Flutter login/register/Google. Listings CRUD + images API + Flutter Home/Browse/Detail/Sell. Search/filter, mark-sold, profile. Filament User/Category/Listing/Transaction + dashboard. *Ship: guest browses; user logs in (stays logged in on restart), sells, edits, marks sold; admin CRUD everything. **Satisfies all minimum rubric requirements.***
- **P2 Chat+Offers:** conversations/messages/offers API + Reverb events + Sanctum channel auth. Flutter Inbox + live chat thread + make-offer/accept/reject. Notifications. Filament Conversation/Offer. *Ship: real-time chat + offers.*
- **P3 Ratings+Reviews:** review API gated on completed transaction. Flutter review flow + seller stars/badge. Verified badge on cards. Filament Review. *Ship: reputation live.*
- **P4 Polish:** onboarding carousel, notifications center, light/dark theme toggle, wishlist tab, account+app feedback + Filament Feedback, optional checkout/order-summary screen. *Ship: full product.*

---

## Verification

**Run backend (terminals):** `php artisan serve` (:8000), `php artisan reverb:start --debug` (:8080), `php artisan queue:listen` (if queued). Seeders: `php artisan migrate:fresh --seed` (1 admin + ~8 users, ~6 categories, ~30 listings w/ images, sample conversations/offers/transactions/reviews).

**Test API standalone first** (Postman / `.http` / curl) before Flutter — confirms each endpoint returns correct JSON + auth works.

**Run Flutter:** `flutter run`. **Emulator → host API:** Android emulator reaches host via `http://10.0.2.2:8000` (not `localhost`). Set as dev `baseUrl`.

Per-phase E2E:
- **P1:** register/login via app → token stored → **kill app, reopen → still logged in** (token persist). Create listing w/ images from app → appears in browse + `/admin`. Search/filter correct. Mark sold → status flips. Admin CRUD all resources. Guest browses w/o token; gated calls 401.
- **P2:** two devices/accounts, same conversation → send in A, appears in B **without refresh** (proves Reverb + Sanctum channel auth). Make offer → seller notified → accept → transaction in `/admin`. Watch reverb `--debug` log.
- **P3:** complete transaction → buyer reviews → seller stars + badge update. Can't review twice / others' sales (403).
- **P4:** theme persists; wishlist toggles; onboarding shows once; feedback lands in Filament.

**Google OAuth:** Google Cloud Console — **Android OAuth client** (package name + SHA-1 from `flutter run`) for `google_sign_in`, plus a Web client whose ID the server uses to verify the ID token. No redirect-URI dance (mobile uses ID-token flow).

---

## Risks / gotchas

1. **Emulator localhost** — `localhost` inside Android emulator = the emulator itself. Use `http://10.0.2.2:8000` for the host. iOS simulator uses `localhost`. #1 "API not reachable" cause.
2. **Reverb separate process** — chat silently fails if `reverb:start` (or queue) not running. Use `ShouldBroadcastNow` for demo; move port off 8080 if XAMPP Tomcat clash (`REVERB_SERVER_PORT=9000`).
3. **Sanctum channel auth from Flutter** — Dart pusher client must send Bearer token to `/broadcasting/auth`. Set `Broadcast::routes(['middleware'=>['auth:sanctum']])` or it 403s. Fallback: API polling if the Dart websocket client fights you.
4. **Google sign-in token verify** — Flutter sends the **ID token**; server verifies with Socialite stateless using the **Web client ID** (mismatched IDs = invalid token). SHA-1 must be registered for the Android client.
5. **CORS** — configure `config/cors.php` to allow the API paths (esp. if Flutter Web used).
6. **Image upload from mobile** — multipart from Flutter; raise php.ini `upload_max_filesize`/`post_max_size`; `storage:link` needs Admin/Dev-Mode on Windows; validate `image|max:4096`; return full image URLs in API resources.
7. **Google-null password** — nullable `password` from first migration.
8. **Filament access leak** — `canAccessPanel()` (`role==='admin'`) from day one.
9. **Cross-platform consistency (graded)** — single source of truth for the 4 brand hex + shared terminology (Listing/Seller/Offer/Transaction) across Flutter + Filament.
10. **N+1** — eager-load `with('primaryImage','seller','category')`; `preventLazyLoading()` in dev.

---

## Notes
- Standalone project, separate from Rielcode.
- Architecture matches the assignment's mobile-user / desktop-admin split exactly. Mobile = Flutter, Desktop admin = Filament web, shared Laravel API + MySQL.
- P0-P1 alone is a complete gradeable submission; P2-P4 push toward "real working product" + higher rubric marks (Mobile UI 25%, Desktop 20%, Principles 15%).
- Survey ships first (data feeds persona + pain points = User Research 10% of rubric).
- **Optional safety net:** the assignment's required deliverable is a Figma/XD prototype + design report. Build the Figma prototype in parallel from the same screens — guarantees the rubric is met even if the Flutter build runs late.
- Group project, but Azriel does almost all the build.
