# Referral System Design

**Date:** 2026-05-12
**Status:** Approved

## Context

Azriel wants to leverage his college network to acquire clients for Rielcode. Friends who refer a paying client get 10% commission of the final order amount. The system needs to track referrers, automatically calculate commissions when a referral code is used at checkout, let Azriel manage payouts from the admin panel, and give referrers a read-only view of their own stats.

---

## Architecture

### Where it lives
Built into the existing Rielcode PHP app at `C:\xampp\htdocs\Rielcode\`. No separate app or subdomain.

### Components
1. **DB** -- two new tables + one column on `orders`
2. **Checkout** -- referral code field with live validation
3. **Admin panel** -- two new tabs: Referrers and Commissions
4. **Referrer dashboard** -- public read-only page at `/referrer/`

---

## Database

### New tables

```sql
CREATE TABLE referrers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE referral_commissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  referrer_id INT NOT NULL,
  order_id INT NOT NULL,
  order_amount DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  status ENUM('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  paid_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES referrers(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### Migration to existing table

```sql
ALTER TABLE orders ADD COLUMN referral_code VARCHAR(20) DEFAULT NULL;
```

---

## Checkout Flow

**File:** `C:\xampp\htdocs\Rielcode\checkout\index.php`

- Add optional "Referral Code" text field below the existing form fields
- On GET: render empty field
- On POST:
  - If code field is non-empty: query `referrers` table for matching active code
  - If found: store `referral_code` on the order row, insert `referral_commissions` row with `status = pending` and `commission_amount = final_price * (commission_rate / 100)`
  - If not found: show inline error "This code is invalid or inactive." but do NOT block checkout -- order submits without a referral
  - If code field is empty: order proceeds normally, no commission row created

---

## Admin Panel

**File:** `C:\xampp\htdocs\Rielcode\admin.php`

Two new tabs added to the existing tab navigation.

### Tab: Referrers

- Table: name, phone (WhatsApp link), code, commission rate, status, total commissions earned (sum of paid commissions), actions
- Add Referrer form (inline or modal): name, phone, code, commission rate (default 10%)
- Per-row actions: Toggle active/inactive, Delete (only if no commissions linked)

### Tab: Commissions

- Table: referrer name, order invoice number, order amount, commission amount, status badge, created date, paid date
- Filter bar: by referrer (dropdown) and by status (all / pending / paid / cancelled)
- Per-row actions:
  - "Mark Paid" -- sets status to paid, records `paid_at = NOW()`
  - "Cancel" -- sets status to cancelled (for disputed/returned orders)

---

## Referrer Dashboard

**File:** `C:\xampp\htdocs\Rielcode\referrer\index.php`

- Public URL: `rielcode.com/referrer/?code=BUDI10`
- Auth: code in query string. Validates against `referrers` table -- if not found or inactive, show 404-style message.
- Read-only. No write operations.

**Displays:**
- Referrer name and code
- Commission rate
- Summary stats: total referrals, total commission earned (paid), pending commission amount
- Table: order date, project (package name), order amount, commission amount, status badge

**Share flow:** Azriel creates the referrer in admin, then sends the dashboard URL to the friend via WhatsApp once.

---

## File Map

```
C:\xampp\htdocs\Rielcode\
├── checkout/index.php              -- MODIFY: add referral code field + commission logic
├── admin.php                       -- MODIFY: add Referrers and Commissions tabs
├── referrer/
│   └── index.php                   -- NEW: public referrer dashboard
```

---

## Verification

1. Run DB migration SQL -- confirm `referrers`, `referral_commissions` tables exist and `orders.referral_code` column added
2. Go to `/order-form/`, complete an order, reach `/checkout/` -- referral code field visible
3. Enter invalid code -- inline error shows, order still completes, no commission row created
4. Add a referrer via admin Referrers tab, then complete a checkout with their code -- commission row appears in Commissions tab with status "pending"
5. Mark commission as paid -- status updates to "paid", paid_at timestamp recorded
6. Open `/referrer/?code=BUDI10` -- dashboard shows correct stats and commission list
7. Open `/referrer/?code=INVALID` -- 404-style message shown
