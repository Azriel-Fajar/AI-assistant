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
| `pay.rielcode.com/invoice/[id]/edit` | Azriel | Edit existing invoice + mark paid |
| `pay.rielcode.com/invoice/[id]` | Client | Public invoice view + PDF download |

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
- Generates shareable URL: `pay.rielcode.com/invoice/[invoice_number]`
- Generates QR code pointing to that URL
- Azriel copies URL / QR and sends to client via WhatsApp

### 2.3 Client Invoice Page

Public, no login. Accessed via unique URL Azriel shares.

On page open: invoice renders immediately (no redirect, no popup).

Shows:
- Rielcode logo + branding
- Invoice number, issue date, due date
- Client name, project name
- Line items table
- Total (IDR or USD)
- Bank transfer details (bank name, account number, account name)
- Status badge (unpaid / paid / overdue)
- "Download PDF" button -- generates and downloads invoice as PDF

Payment flow:
1. Client opens URL → sees invoice + bank details
2. Client transfers to Azriel's bank account
3. Client sends proof of payment via WhatsApp
4. Azriel confirms in dashboard → marks invoice as `paid`

### 2.4 Invoice Statuses

`draft` → `sent` → `paid`

Auto-transition: `sent` → `overdue` if due date passed and status still `sent` (checked on page load).

### 2.5 Auth

- Single admin account (Azriel only)
- Session-based login with CSRF protection
- Client invoice pages: public, no auth -- secured by unguessable invoice number in URL

### 2.6 Payment Details

Displayed statically on client invoice page. Stored in `config.php`:

**Bank Transfer:**
- Bank name
- Account number
- Account name (Azriel's full name as registered)

**QRIS (personal statis):**
- Static QR image stored as `IMG/qris.png` in the pay subdomain
- Client scans with any e-wallet or banking app (GoPay, OVO, DANA, BCA, etc.)
- Manual confirmation still required -- client sends proof via WhatsApp
- IDR only (QRIS does not support USD)
- QRIS section hidden on USD invoices

**Upgrade path:** Switch to Xendit QRIS dinamis (KTP only, no NPWP) when ready for auto-confirmation.

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

## 4. Payment Flow (Manual Invoice)

No payment gateway. Manual bank transfer.

### Flow
1. Azriel creates invoice → marks as `sent` → URL generated
2. Azriel sends URL to client via WhatsApp
3. Client opens URL → sees full invoice + payment options
4. Client pays via QRIS scan (IDR) or bank transfer
5. Client downloads PDF if needed
6. Client sends proof of payment via WhatsApp
7. Azriel marks invoice as `paid` in dashboard

### Payment Options on Client Page
- **QRIS (IDR only):** static QR image (`IMG/qris.png`), client scans with any app
- **Bank transfer:** bank name, account number, account name
- Both shown side by side for IDR invoices; QRIS hidden for USD invoices

### Config (stored in config.php, never committed)
- Bank name, account number, account name
- QRIS image path: `IMG/qris.png` (uploaded manually to server)

### PDF Generation
- Client-side: browser print/save as PDF via `window.print()` with print stylesheet
- Or server-side: `dompdf` via Composer (simpler alternative)
- PDF includes: invoice header, line items, totals, bank details, Rielcode branding

### Why no payment gateway
- Midtrans requires NPWP (Indonesian tax ID) for registration
- Manual flow works now, zero compliance overhead
- Can integrate gateway later when NPWP obtained

---

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Language | PHP (procedural, matches existing) |
| Frontend | Bootstrap 5.3, vanilla JS |
| DB | MySQL via mysqli |
| Email | PHPMailer (existing) |
| QR Code | `chillerlan/php-qrcode` via Composer |
| PDF | `dompdf/dompdf` via Composer (server-side) or browser print stylesheet |
| Payments | Manual bank transfer -- no gateway |
| Hosting | cPanel subdomain (same server as rielcode.com) |

---

## 6. Out of Scope (This Phase)

- Full rielcode.com redesign (awaiting complete design spec from Azriel)
- Real testimonial content (awaiting client responses)
- Maintenance plan
- Q3 stack rebuild
