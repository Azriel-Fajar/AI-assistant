# FTI Campus Marketplace — HCI Final Project Plan

## Context

College HCI final project (Satya Wacana Christian University, Faculty of Information Technology, CompSci). Standalone, separate from Rielcode.

**Real-world listing conventions (the FTI WhatsApp group uses these tags — the app should map them to a `listing_type`):**
- **#WTS** — Want to Sell (nawarin jualan) — a normal sell listing. *Default, fully modeled.*
- **#WTB** — Want to Buy (mau beli, biar ditawarin) — a buyer-posted *request*; other users offer to sell to them (matches source note "potential buyers can request").
- **#WTT** — Tukar Tambah (trade-in) — sell but open to trade-in toward another item.
- **#WTBT** — Want to Barter — swap goods, no cash.

These are the conventions the marketplace replaces. At minimum, surface them as a **`listing_type` enum + a filter chip** so a post carries its intent (WTS/WTB/WTT/WTBT) — even if the deeper request/barter *matching* flow is scoped to polish/future (see Data model note).

Turn the existing FTI faculty WhatsApp-group marketplace into a real working application. The assignment splits the system in two (slides 2, 12-15): **Mobile Application = public user (the marketplace itself)**, **Desktop Application = admin**. Both share one backend + one database. Two deliverables:

1. **Fixed survey** (max 10 questions, Google Forms) — gather student pain points before building.
2. **Full build plan** — real working **Flutter mobile app + Laravel API + Filament web admin**.

**Two platforms, one product:**
- **Mobile app (Flutter)** = the main marketplace. Primary way users buy/sell, FB-Marketplace-style.
- **Web** = alternative marketplace + admin entry. Same data, **same interface** (the same Flutter codebase compiled to web via `flutter build web`), so buyers get an identical storefront in a browser. The web host **also** serves the Filament admin panel at `/admin`, where the admin logs in to monitor transactions and manage the whole cross-platform system. Both platforms read/write the one Laravel API + MySQL DB.

**Architecture (locked):**
- **Flutter** mobile app = public marketplace (buyer/seller). Calls the Laravel API over HTTPS.
- **Laravel 12** (PHP 8.2) = REST/JSON API **+** Filament 3.3 web admin. **One MySQL DB, one source of truth** — admin and mobile read/write the same data (no Firebase, no second DB, no sync hell).
- **Auth:** Laravel **Sanctum** API tokens. Flutter stores the token in secure storage → user stays logged in across app restarts (solves the logout-on-close problem natively on mobile). Google login via Socialite (server-side) issuing a Sanctum token. Roles: `user` / `admin` via `role` enum.
- **Real-time chat:** Laravel **Reverb** websockets (hosting has Node, scales to campus). Flutter subscribes via a Pusher/Echo-compatible Dart package. Plus "make an offer".
- **Admin:** Filament web dashboard opened in a desktop browser = the assignment's "Desktop Application".
- **Web marketplace alt:** the same Flutter app compiled to web (`flutter build web`) = identical buyer/seller storefront in a browser, same code, same brand, same API. No second frontend codebase. Served as a static build (own subdomain/path) alongside the Laravel host; Filament admin lives at `/admin` on the same host. The one difference web has over mobile: the admin can reach `/admin` from a desktop browser.
- Public browsing in the app = NO login. Login required only to sell/chat/offer/wishlist/profile.
- Scope: all 4 tiers in order — Core MVP → Chat+Offers → Ratings+Reviews → Polish.
- Design: secondhand-marketplace mobile layout (soft rounded cards, pill buttons, bottom tab nav Home/Wishlist/Sell/Inbox/Profile, category chips, spec chips, make-offer/checkout) **recolored** to palette: white `#FFFFFF`, royal blue `#003CCB`, navy `#00296B`, yellow `#FCC131`.

**Two codebases (both under `C:\xampp\htdocs\`, siblings):**
- `C:\xampp\htdocs\fti-marketplace` — Laravel API + Filament admin.
- `C:\xampp\htdocs\fti_marketplace_app` — Flutter project, compiles to **both** Android/iOS app **and** web. No third frontend — web is just `flutter build web` output of the same Flutter project.

Sibling, **not** nested — never put the Flutter project inside the Laravel tree (breaks both). Each gets its own git repo.

---

## PART 1 — Survey (Google Forms, 10 Q)

Changes from original draft: **dropped old Q8** (platform app-vs-web — contradicts the design decision), **replaced with seller-trust Q8** (feeds verified-badge + rating features; stronger research backing — rubric rewards research that justifies design), **trimmed Q6** (removed loker/dropbox + ojol — unrealistic infra), fixed mojibake dashes.

### Form header + description (paste into Google Forms top)

**Nama:** Azriel Fajar Wicaksono
**NIM:** 672025121

**SURVEI MARKETPLACE DIGITAL FTI**

> Halo teman-teman civitas akademika FTI! 👋
>
> Selama ini jual-beli barang antar mahasiswa masih berserakan di grup WhatsApp, susah dicari, dan kadang bikin ragu soal kepercayaan. Lewat Tugas Rancang ini, kami ingin merapikan semua itu menjadi satu aplikasi cross-platform marketplace khusus untuk lingkungan FTI.
>
> Sebelum membangun, kami butuh suara kalian. Survei singkat ini membantu kami memahami apa yang benar-benar kalian butuhkan, kendala yang sering dialami, dan fitur yang paling kalian harapkan.
>
> Pengisian hanya butuh 2-3 menit dan jawaban kalian sangat menentukan arah aplikasi ini. Terima kasih sudah ikut membentuk marketplace kita sendiri. 🙏

### Questions + answers

**1. Apakah sudah mengerti kalau FTI memiliki group khusus marketplace?**
Ya, sudah tahu / Baru tahu sekarang / Tidak tahu sama sekali

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

**7. Apa yang paling membuat kamu percaya pada seorang penjual di marketplace kampus?** (pilih semua yang sesuai)
Akun terverifikasi pakai email kampus / Rating & ulasan dari pembeli lain / Badge level penjual / Jumlah transaksi sukses / Foto profil & identitas jelas

**8. Kalau marketplace ini dijadikan sebuah aplikasi, menurut kamu lebih cocok di platform mana?**
Aplikasi mobile (Android/iOS) / Website (bisa dibuka di browser) / Keduanya sama-sama perlu / Tidak ada preferensi

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
- **listings**: `user_id`(poster), `category_id`, `title`, `slug`, `description`, `price`, `listing_type` enum('wts','wtb','wtt','wtbt') default 'wts', `condition` enum, `status` enum('available','reserved','sold'), spec chips `size`/`material`/`color`/`brand`, `location`, `views_count`, `sold_at`, softDeletes. *`listing_type` carries the FTI tag intent (Sell/Buy-request/Trade-in/Barter); `price` is nullable/loose for WTB & WTBT.*
- **listing_images**: `listing_id`, `path`, `is_primary`, `sort_order`.
- **wishlists** (pivot): `user_id`+`listing_id` unique.
- **conversations**: `listing_id`, `buyer_id`, `seller_id`, `last_message_at`; unique(`listing_id`,`buyer_id`).
- **messages**: `conversation_id`, `user_id`(sender), `body`, `type` enum('text','offer','system'), `offer_id` nullable, `read_at`.
- **offers**: `listing_id`, `conversation_id`, `buyer_id`, `seller_id`, `amount`, `status` enum('pending','accepted','rejected','withdrawn'), `responded_at`.
- **transactions**: `listing_id`, `seller_id`, `buyer_id`, `final_price`, `offer_id` nullable, `status`, `completed_at`.
- **reviews**: `transaction_id` unique, `reviewer_id`, `seller_id`, `rating` 1-5, `body`.
- **feedback**: `user_id` nullable, `type` enum('account','app'), `subject_user_id` nullable, `rating`, `message`, `status`.
- **reports**: `reporter_id`, `reportable_type`/`reportable_id` (polymorphic — report a listing or a user), `reason` enum, `note`, `status` enum('open','reviewed','actioned','dismissed'). Powers the "takut ditipu" safety flow + Filament moderation queue.
- **notifications**: built-in `php artisan notifications:table` (polymorphic).

**Badge accessor on User**: completed sales count → 0-2 Pemula, 3-9 Terpercaya, 10+ Top Seller (thresholds in config). Exposed in API responses + Filament.

Flutter never touches the DB directly — only calls the Laravel API. Filament reads/writes the same tables. No second database, no Firebase, no sync.

**`listing_type` scope (WTS / WTB / WTT / WTBT):** in scope = the enum field + a **filter chip** + a **type selector on the Sell/post form** + a colored tag badge on cards, so every post carries its intent and users browse by it. The existing sell→offer→transaction→review loop covers **WTS** end-to-end. **WTB** (buyer request → sellers respond) reuses the same offer/chat plumbing (offer flows the other direction). **WTT/WTBT** (trade-in / barter) are surfaced as labeled listings that route to chat to arrange the swap — the deeper structured matching is **future scope**, not week-1. Keeps the tags real without exploding the build.

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
- **Accept guard (race):** two buyers can have pending offers on one listing. Accept must run in a DB transaction, check `listing.status === 'available'` first, flip to reserved/sold, and auto-reject other pending offers. Without the status check, two accepts = two transactions on one item.
- **`start/{listing}` must `firstOrCreate`** the conversation on `unique(listing_id,buyer_id)` or it 500s on a repeat tap. Handle soft-deleted listing → null in `ConversationResource`.

---

### B. Frontend — Flutter app + web (`C:\xampp\htdocs\fti_marketplace_app`)

One Flutter codebase, two build targets: **mobile** (`flutter run` / APK) and **web** (`flutter build web`). Same screens, same brand, same API client. The web build = the "alternative marketplace" (identical interface in a browser).

**Responsive web (all screen sizes — phone / tablet / desktop):** the web build must adapt, not just stretch the phone layout.
- **Breakpoints** (`LayoutBuilder` at the page root): mobile `<600`, tablet `600-1024`, desktop `>1024`. Pick layout per band.
- **Card grid:** `GridView` with `maxCrossAxisExtent` (~200-240px/card) so columns scale automatically — 2 on phone, 3-4 tablet, 5-6 desktop. No fixed `crossAxisCount`.
- **Max content width:** wrap the body in a centered `ConstrainedBox` (~1200px) on desktop so listings don't span an ultrawide monitor edge-to-edge.
- **Navigation swap:** bottom tab bar on mobile (`<600`) → side `NavigationRail` or top nav bar on desktop (`>1024`). Same destinations (Home/Wishlist/Sell/Inbox/Profile), screen-appropriate chrome.
- **Detail + chat:** single column on phone; two-pane on desktop (e.g. listing-list + detail, or conversation-list + thread) if time permits — otherwise keep single column centered.
- **Touch vs mouse:** keep tap targets ≥44px; ensure hover/click both work (Flutter handles, just don't rely on long-press-only on web).
- Verify at 360px, 768px, 1280px, 1920px before demo.

**Stack:** Flutter (Dart), `dio` (HTTP), token storage (see web note), `google_sign_in` (Google login), `provider`/`riverpod` (state), `cached_network_image`, a Pusher-channels Dart client (`pusher_channels_flutter` or `dart_pusher_channels`) pointed at Reverb for chat.

**Web-target deltas (same code, a few conditionals):**
- **Token storage:** `flutter_secure_storage` works on web but maps to less-secure browser storage. Acceptable for project scope; or branch on `kIsWeb` to use `shared_preferences` on web, secure storage on mobile.
- **API baseUrl:** mobile dev = `http://10.0.2.2:8000` (emulator) / LAN IP (real device); web dev = `http://localhost:8000`. Pick by `kIsWeb`.
- **CORS:** Flutter Web is a real browser origin, so `config/cors.php` **must** allow the web origin (covered in gotchas) — mobile didn't need it, web does.
- **Reverb from web:** browser websocket to Reverb; same channel-auth via Bearer token. Use `wss://` in prod.
- **Google login on web** uses the Google Identity JS flow (`google_sign_in_web`), not the Android ID-token flow — register a **Web OAuth client** with the web origin as an authorized JS origin. (The server already verifies with the Web client ID, so this lines up.)
- **No camera/file-picker quirks:** image upload on web uses the browser file picker (`image_picker` supports web) — returns bytes, send as multipart same as mobile.

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

**Timeline: <3 weeks, solo, all features kept, no Figma prototype.** Strategy = **spike the risky parts first, lock a submittable floor early, stack features on top.** Because there's no Figma safety net, the *working build is the deliverable* — so get P0-P1 to "submittable" by end of week 1; everything after is upside that can't sink the grade.

#### P-SPIKE (Day 1-2, BEFORE committing to full build) — kill the unknowns
Throwaway proof-of-concepts. If one fails, adapt the plan now, not mid-build.
1. **Reverb + Flutter chat hello-world:** one Dart pusher client connects to Reverb, authenticates a private channel with a Sanctum Bearer token, receives one broadcast event. *Proves the scariest piece.* **If it fights back → switch chat to API short-polling immediately** (plan's documented fallback) and stop burning time.
2. **`flutter build web` + CORS:** compile to web, make one authenticated API call from the browser, confirm CORS passes. *2 hours, de-risks the whole web target.*
3. **Google sign-in end-to-end on one device:** Android ID-token → server verify → Sanctum token back. **If OAuth config eats more than half a day → ship email/pass only, add Google later.**
*Ship: a one-line note on each spike — works / use fallback. Now the rest of the build has no surprises.*

- **P0 Scaffold:** Laravel setup (Sanctum/Filament/Reverb), migrations + models + relationships, seeders (categories + demo data), brand Filament. Flutter init + theme + dio client + secure-storage token interceptor. *Ship: API boots, admin login works, Flutter shows empty themed shell hitting `/categories`.*
- **P1 CORE MVP:** Auth endpoints (register/login/google/logout) + Flutter login/register/Google. Listings CRUD + images API + Flutter Home/Browse/Detail/Sell. Search/filter, mark-sold, profile. Filament User/Category/Listing/Transaction + dashboard. **First `flutter build web` here** — confirm the same UI loads in a browser hitting the API (CORS green). *Ship: guest browses on app AND web; user logs in (stays logged in on restart), sells, edits, marks sold; admin CRUD everything. **Satisfies all minimum rubric requirements.***
- **P2 Chat+Offers:** conversations/messages/offers API + Reverb events + Sanctum channel auth. Flutter Inbox + live chat thread + make-offer/accept/reject. Notifications. Filament Conversation/Offer. Confirm chat works on web build too (websocket from browser). *Ship: real-time chat + offers on app + web.*
- **P3 Ratings+Reviews:** review API gated on completed transaction. Flutter review flow + seller stars/badge. Verified badge on cards. Filament Review. *Ship: reputation live.*
- **P4 Polish + moderation:** onboarding carousel, notifications center, light/dark theme toggle, wishlist tab, account+app feedback + Filament Feedback, optional checkout/order-summary screen. **Report-listing/report-user flow** (`reports` table + endpoint + Filament moderation queue) — closes the survey-Q4 "takut ditipu" pain point. Responsive web pass — breakpoints + nav swap (bottom-tab→rail) + max-width + grid scaling, checked at 360/768/1280/1920px. *Ship: full product, app + responsive web.*
- **P5 Deliverables (build the graded artifacts):** required regardless of how far the code gets (slides 11, 17, 18-21).
  - **User persona** (min 1): name/age/occupation/goals/frustrations/tech usage — derived from survey results.
  - **Design Report (PDF):** problem statement, user research (survey results + pain points + needs + persona), mobile design, desktop/web design, design rationale (why these colors/nav/layout/flows), cross-platform consistency.
  - **Prototype requirement — satisfied by the working build, not Figma.** Slide 20 asks for a Figma/XD/Penpot interactive prototype; a **running app is a stronger deliverable than a clickable mock**. Capture annotated screenshots + a screen-recording of each key flow from the live Flutter app/web as the "prototype" evidence in the report. *(No Figma build — the working product replaces it. If the build catastrophically slips, a fast Penpot mock of the 3 required screens is the emergency fallback, but the floor-first schedule makes that unlikely.)*
  - **Presentation slides** (10 min): Problem → User Research → Mobile Design → Desktop/Web Design → Prototype/Build Demo → Testing Results.
  - *Ship: report PDF + screen-recordings/screenshots + slides ready to submit.*
- **P6 Usability testing (separate post-build step — needs the finished product first):**
  1. **Recruit min 3 participants** (FTI students, ideally survey respondents).
  2. **Give them real tasks** on the working app/web: register account, search a listing, make an offer / chat a seller, create a listing, update profile. Sit back, **observe, don't help.**
  3. **Record per participant:** what they did, where they hesitated/failed, time + clicks, quotes.
  4. **Write the testing report (slide 19):** Successes (what worked), Problems (where users struggled), Improvements (what to change).
  5. **Fix the problems found** — loop the fixes back into the app/web/admin (this is the point of the step: test → find issues → fix). Re-verify the fixed flows.
  6. Fold the testing results + fixes into the Design Report and the presentation's "Testing Results" section.
  - *Ship: tested product, issues fixed, testing report written.*

---

### 3-week schedule (floor-first)

Survey runs Day 0 in parallel (it gathers data while you build; results feed P5 persona/report).

| Week | Focus | Floor status |
|---|---|---|
| **Wk 1** | Day 1-2 **P-SPIKE** (chat/web/Google de-risk). Day 3-7 **P0 + P1**: scaffold, auth, listings CRUD+images, search/filter, Home/Browse/Detail/Sell/Profile, Filament CRUD + dashboard, first `flutter build web`. | **End of Wk1 = SUBMITTABLE.** P0-P1 satisfies all minimum rubric reqs. Grade floor locked. |
| **Wk 2** | **P2 Chat+Offers** (or polling fallback from spike) + **P3 Ratings/Reviews**. **P4 Polish+moderation** (onboarding, theme, wishlist, reports, feedback). **Responsive web pass** (breakpoints/nav-swap, check 360/768/1280/1920). | Features stack on a working floor — none load-bearing. |
| **Wk 3** | **P6 Usability test** (3+ users) → fix what they break → re-verify. **P5 Deliverables**: persona, Design Report PDF, screen-recordings, 10-min slides. Buffer for OAuth/Reverb cleanup. | Test + document + submit. |

**Cut order if time dies (sacrifice top-down, floor never touched):** drop P4 polish extras → drop Google login (email/pass only) → drop real-time chat (API polling) → drop P3 reviews. P0-P1 + report + test always ships. This ordering is *why* the floor-first plan holds confidence at a tight deadline.

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

0. **Serve the API one way, not two** — `C:\xampp\htdocs\fti-marketplace` implies XAMPP Apache (`http://localhost/fti-marketplace/public`), but the plan runs `php artisan serve` (`:8000`). Pick one and use it everywhere (baseUrl, APP_URL, OAuth origins). Mixing them = "works on :8000, 404 on Apache" confusion. Recommend `artisan serve` for dev (path then irrelevant); switch to Apache vhost only if needed.
0b. **Real-device demo uses LAN IP, not 10.0.2.2** — `10.0.2.2` only works in the Android emulator. On a physical phone (and the web build on another machine), set baseUrl + `APP_URL` to the host's LAN IP (`192.168.x.x`) so image URLs resolve too. Android 9+ blocks cleartext: add `usesCleartextTraffic="true"` (or a network-security-config) for `http://` API + `ws://` Reverb during dev, or the app silently fails to connect.
0c. **Emulator needs Google Play Services** — `google_sign_in` fails on a bare AOSP emulator image. Use a "Google APIs / Play Store" system image. Common P1 blocker.
0d. **install:broadcasting adds Vite/Echo JS** — Reverb's installer scaffolds `resources/js/echo.js` + npm bits, which rubs against "no Vite on backend." Either accept the small footprint or wire Reverb's PHP side manually and skip the JS. Watch for a Filament-vs-Vite clash on `npm run build`.
1. **Emulator localhost** — `localhost` inside Android emulator = the emulator itself. Use `http://10.0.2.2:8000` for the host. iOS simulator uses `localhost`. #1 "API not reachable" cause.
2. **Reverb separate process** — chat silently fails if `reverb:start` (or queue) not running. Use `ShouldBroadcastNow` for demo; move port off 8080 if XAMPP Tomcat clash (`REVERB_SERVER_PORT=9000`).
3. **Sanctum channel auth from Flutter** — Dart pusher client must send Bearer token to `/broadcasting/auth`. Set `Broadcast::routes(['middleware'=>['auth:sanctum']])` or it 403s. Fallback: API polling if the Dart websocket client fights you.
4. **Google sign-in token verify** — Flutter sends the **ID token**; server verifies with Socialite stateless using the **Web client ID** (mismatched IDs = invalid token). SHA-1 must be registered for the Android client.
5. **CORS (now required — web is in scope)** — Flutter Web is a real browser origin, so `config/cors.php` must allow the web origin on `api/*` + `broadcasting/auth`. Mobile bypassed CORS; web won't. Set `supports_credentials` correctly. #1 "works on app, blank on web" cause.
12. **Web Google login is a different flow** — web uses `google_sign_in_web` (Google Identity JS), not the Android ID-token path. Register a **Web OAuth client** and add the web origin as an authorized JavaScript origin. Server still verifies with the Web client ID, so it lines up — just don't forget the JS-origin entry.
13. **Flutter Web build is static** — `flutter build web` outputs `build/web/`. Serve it from its own subdomain/path (or copy into a public dir), pointed at the API baseUrl. Don't try to serve it through `artisan serve`. Set `--base-href` if hosted under a subpath.
14. **Web token storage is weaker** — `flutter_secure_storage` on web isn't OS-keychain-backed. Fine for a campus project; branch on `kIsWeb` if you want `shared_preferences` on web. Don't claim "secure storage" for the web build in the report.
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
- Design report + slides are **required deliverables** (slides 17, 21), built in **P5**. The slide-20 "interactive prototype" is satisfied by the **working build** (screen-recordings/screenshots) instead of a Figma mock — a running product is stronger evidence. No Figma build at <3-week scope.
- **Floor-first is the confidence strategy:** P0-P1 must reach "submittable" by end of week 1, so all later features are upside that can't sink the grade. Cut top-down if time dies (see schedule).
- Spike the risky bits (Reverb chat, Flutter web/CORS, Google OAuth) on Day 1-2 **before** committing — turns unknowns into knowns early.
- Usability testing (**P6**) runs **after** the product is finished — test with 3+ users, then fix what they break.
- Web = same Flutter codebase compiled to web; admin panel (Filament) reachable from a desktop browser at `/admin`. App is the main product, web is the alt.
- Group project, but Azriel does almost all the build.
