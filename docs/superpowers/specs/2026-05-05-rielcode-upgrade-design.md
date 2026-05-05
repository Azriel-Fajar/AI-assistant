# Rielcode Upgrade Design Spec
_Date: 2026-05-05_

## Overview

Two parallel workstreams:
1. **rielcode.com** -- new packages, testimonials section, order flow fix, design update
2. **pay.rielcode.com** -- invoice control panel + client payment portal

Approach: Extend existing PHP/Bootstrap 5 stack. Shared MySQL DB via cPanel.

Note: Full rielcode.com rebuild planned for Q3 2026 with a more efficient stack. Current work is intentionally non-overengineered.

---

## 1. rielcode.com Changes

### 1.1 New Package Plans

Add to `packages` DB table and `package.php`:

| Plan | Type |
|------|------|
| Student | Existing |
| Starter | Existing |
| Pro | Existing |
| Premium | Existing |
| Landing Page | New -- single page, conversion-focused |
| Copy Website | New -- clone existing design, new content |
| E-commerce | New -- product catalog + cart + checkout |
| Custom | Existing |

### 1.2 Testimonials Section

- New section on `index.php` between Projects and Requirements
- Placeholder content now; real client data added later
- Admin panel (`/admin.php`) gets testimonials management (add/edit/delete)

DB table: `testimonials`
```sql
CREATE TABLE testimonials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  message TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.3 Order Form Flow Changes

**Before:** Submit → save order → generate invoice PDF → redirect to checkout
**After:** Submit → save order → send confirmation email to client → send notification email to Azriel → show "We'll be in touch" page

- Remove invoice generation from order form
- Remove checkout redirect
- `/checkout/` kept but not linked (used later via pay subdomain flow)
- Azriel notification email includes: client name, email, phone, package, project details

### 1.4 Design Update

Apply new dark design system across all pages:
- Background: `#111315` / `#1c1f22`
- Primary: `#3a7bff`
- Text: white / light gray
- Note: `#3ecf8e` and other colors are package-tier identifiers only, not global accent colors

Full redesign applied when Azriel provides complete design spec from claude.ai/design.

---

## 2. pay.rielcode.com

Separate PHP app deployed as cPanel subdomain. Shares MySQL DB with rielcode.com.

### 2.1 Pages

| URL | Audience | Purpose |
|-----|----------|---------|
| `pay.rielcode.com/` | All | Redirect: logged in → dashboard, else → login |
| `pay.rielcode.com/login` | Azriel | Admin login (session-based) |
| `pay.rielcode.com/dashboard` | Azriel | All invoices, statuses, revenue totals |
| `pay.rielcode.com/invoice/create` | Azriel | Create new invoice |
| `pay.rielcode.com/invoice/[id]/edit` | Azriel | Edit existing invoice |
| `pay.rielcode.com/invoice/[id]` | Client | Public payment page |
| `pay.rielcode.com/invoice/[id]/success` | Client | Post-payment confirmation |
| `pay.rielcode.com/webhook/midtrans` | Midtrans | Payment status callback |

### 2.2 Invoice Creation (Azriel)

Fields:
- Client name + email
- Project name
- Package (dropdown from DB)
- Line items (description, quantity, unit price) -- dynamic rows
- Currency: IDR or USD
- Due date
- Notes (optional)

On save: generates unique invoice number (`INV-2026-001`, auto-incremented per year).

On mark as `sent`:
- Generates Midtrans payment URL
- Generates QR code pointing to `pay.rielcode.com/invoice/[id]`
- Both displayed on dashboard for Azriel to copy/download and send via WhatsApp

### 2.3 Client Payment Page

Public, no login. Accessed via unique URL.

Shows:
- Invoice number, date, due date
- Client name, project name
- Line items table
- Total (IDR or USD)
- Midtrans Snap payment button
- Status badge (unpaid / paid / overdue)

### 2.4 Invoice Statuses

`draft` → `sent` → `paid`

Auto-transition: `sent` → `overdue` if due date passed and status still `sent` (checked on page load or cron).

### 2.5 Auth

- Single admin account (Azriel only)
- Session-based login with CSRF protection
- Client payment pages: public, no auth -- secured by unguessable invoice ID in URL

---

## 3. Database Schema

### `testimonials`
```sql
CREATE TABLE testimonials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  message TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `invoices`
```sql
CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(150) NOT NULL,
  project_name VARCHAR(150) NOT NULL,
  package VARCHAR(100),
  currency ENUM('IDR','USD') NOT NULL DEFAULT 'IDR',
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  total DECIMAL(15,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status ENUM('draft','sent','paid','overdue') NOT NULL DEFAULT 'draft',
  midtrans_order_id VARCHAR(100),
  midtrans_payment_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### `invoice_items`
```sql
CREATE TABLE invoice_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
```

---

## 4. Midtrans Integration

### Payment Flow
1. Azriel sets invoice to `sent` → Midtrans Snap API called → payment URL generated
2. Client opens payment page → clicks Pay → Midtrans Snap popup opens
3. Client pays via QRIS, bank transfer (VA), credit/debit card, GoPay, OVO, or DANA
4. Midtrans sends webhook to `pay.rielcode.com/webhook/midtrans`
5. Webhook verifies signature → updates invoice status to `paid`
6. Client redirected to `/invoice/[id]/success`

### Config
- Server Key + Client Key stored in config file (not committed to git)
- Sandbox mode for development, Production for live
- Payment methods: QRIS, bank transfer, credit/debit card, GoPay, OVO, DANA

### Webhook Security
- Verify Midtrans `signature_key` using SHA-512: `hash('sha512', $order_id . $status_code . $gross_amount . $server_key)`
- Reject any webhook with invalid signature (return 403)
- Idempotent: ignore duplicate `paid` webhooks for already-paid invoices

---

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Language | PHP (procedural, matches existing) |
| Frontend | Bootstrap 5.3, vanilla JS |
| DB | MySQL via mysqli |
| Email | PHPMailer (existing) |
| PDF/QR | QR: `chillerlan/php-qrcode` via Composer |
| Payments | Midtrans Snap (PHP SDK or raw API) |
| Hosting | cPanel subdomain (same server as rielcode.com) |

---

## 6. Out of Scope (This Phase)

- Full rielcode.com redesign (awaiting complete design spec from Azriel)
- Real testimonial content (awaiting client responses)
- Maintenance plan
- Q3 stack rebuild
