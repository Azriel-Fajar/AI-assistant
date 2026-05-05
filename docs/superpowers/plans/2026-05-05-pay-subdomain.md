# pay.rielcode.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an invoice control panel at `pay.rielcode.com` where Azriel creates invoices, generates shareable URLs and QR codes, and clients view/download invoices with bank transfer details and personal QRIS. No payment gateway -- manual confirmation flow.

**Architecture:** Standalone PHP app in `C:\xampp\htdocs\pay\` locally, deployed to `pay.rielcode.com` subdomain on cPanel. Shares the same MySQL DB as `rielcode.com`. Session-based admin auth. Client invoice pages are public (no login).

**Tech Stack:** PHP 8+ (procedural), MySQL/mysqli, Bootstrap 5.3, PHPMailer, `chillerlan/php-qrcode` (Composer), `dompdf/dompdf` (Composer)

---

## File Map

```
C:\xampp\htdocs\pay\
├── config.php                  # DB + SMTP + bank details
├── connection.php              # mysqli connection wrapper
├── composer.json               # QR code + dompdf dependencies
├── index.php                   # Redirect: logged in → dashboard, else → login
├── login.php                   # Admin login page + handler
├── logout.php                  # Session destroy + redirect
├── dashboard.php               # Invoice list, statuses, totals
├── invoice/
│   ├── create.php              # Create new invoice form + handler
│   ├── edit.php                # Edit existing invoice + mark paid
│   └── view.php                # Public client invoice page (?id=INV-2026-001)
├── invoice-pdf.php             # Server-side PDF generation via dompdf
├── IMG/
│   └── qris.png                # Personal QRIS static image (upload manually, not in git)
├── inc/
│   ├── auth.php                # Session auth check (include on admin pages)
│   ├── header.php              # Admin HTML head + navbar
│   └── footer.php              # Admin closing HTML
└── CSS/
    └── pay.css                 # Styles for entire pay subdomain
```

---

## Task 1: Bootstrap project + install dependencies

**Files:**
- Create: `C:\xampp\htdocs\pay\composer.json`

- [ ] **Step 1: Create folder and `composer.json`**

```bash
mkdir C:\xampp\htdocs\pay
mkdir C:\xampp\htdocs\pay\invoice
mkdir C:\xampp\htdocs\pay\inc
mkdir C:\xampp\htdocs\pay\CSS
```

Create `C:\xampp\htdocs\pay\composer.json`:

```json
{
    "require": {
        "chillerlan/php-qrcode": "^4.3",
        "dompdf/dompdf": "^2.0"
    }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd C:\xampp\htdocs\pay
composer install
```

Expected: `vendor/` folder created with both packages.

- [ ] **Step 3: Create `.gitignore`**

```
vendor/
config.php
IMG/qris.png
*.log
```

- [ ] **Step 4: Init git repo**

```bash
cd C:\xampp\htdocs\pay
git init
git add composer.json composer.lock .gitignore
git commit -m "chore: init pay subdomain project"
```

---

## Task 2: DB tables

- [ ] **Step 1: Open phpMyAdmin, select Rielcode DB, run:**

```sql
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(150) NOT NULL,
  project_name VARCHAR(150) NOT NULL,
  package VARCHAR(100) DEFAULT NULL,
  currency ENUM('IDR','USD') NOT NULL DEFAULT 'IDR',
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  total DECIMAL(15,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status ENUM('draft','sent','paid','overdue') NOT NULL DEFAULT 'draft',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoice_counter (
  year YEAR PRIMARY KEY,
  last_number INT NOT NULL DEFAULT 0
);
```

- [ ] **Step 2: Verify all 3 tables exist in phpMyAdmin.**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add invoices, invoice_items, invoice_counter tables"
```

---

## Task 3: Config and connection files

- [ ] **Step 1: Create `config.php`**

```php
<?php
// DB -- same DB as rielcode.com
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');     // replace with actual
define('DB_PASS', 'your_db_pass');     // replace with actual
define('DB_NAME', 'your_db_name');     // replace with actual

// SMTP
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'afw1407@gmail.com');
define('SMTP_PASS', 'lxmx kqex encm kwes');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls');

// Admin credentials (hashed -- change this)
define('ADMIN_PASSWORD_HASH', password_hash('changeme', PASSWORD_DEFAULT));

// App URL
define('APP_URL', 'http://localhost/pay');  // change to https://pay.rielcode.com in production

// Bank transfer details (shown on client invoice page)
define('BANK_NAME', 'BCA');                          // replace with actual
define('BANK_ACCOUNT_NUMBER', '1234567890');          // replace with actual
define('BANK_ACCOUNT_NAME', 'Azriel Fajar Wibowo');  // replace with actual
```

> **Note:** Never commit `config.php` (it's in `.gitignore`). Create manually on production server.

- [ ] **Step 2: Create `connection.php`**

```php
<?php
require_once __DIR__ . '/config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    http_response_code(500);
    die('Database connection failed.');
}
$conn->set_charset('utf8mb4');
```

- [ ] **Step 3: Commit (config.php excluded by .gitignore)**

```bash
git add connection.php
git commit -m "feat: add DB connection wrapper"
```

---

## Task 4: Auth helpers and shared layout

- [ ] **Step 1: Create `inc/auth.php`**

```php
<?php
if (session_status() === PHP_SESSION_NONE) session_start();
if (empty($_SESSION['admin_logged_in'])) {
    header('Location: ' . APP_URL . '/login.php');
    exit;
}
```

- [ ] **Step 2: Create `inc/header.php`**

```php
<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle ?? 'Rielcode Pay'); ?></title>
    <meta name="robots" content="noindex, nofollow">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link href="<?php echo APP_URL; ?>/CSS/pay.css" rel="stylesheet">
</head>
<body>
<?php if (!empty($_SESSION['admin_logged_in'])): ?>
<nav class="navbar navbar-dark navbar-expand-lg">
    <div class="container-fluid">
        <a class="navbar-brand" href="<?php echo APP_URL; ?>/dashboard.php">
            <span class="brand-rc">RC</span> Pay
        </a>
        <div class="ms-auto d-flex align-items-center gap-3">
            <a href="<?php echo APP_URL; ?>/invoice/create.php" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-lg"></i> New Invoice
            </a>
            <a href="<?php echo APP_URL; ?>/logout.php" class="btn btn-outline-secondary btn-sm">Logout</a>
        </div>
    </div>
</nav>
<?php endif; ?>
<div class="main-content">
```

- [ ] **Step 3: Create `inc/footer.php`**

```php
</div><!-- /.main-content -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create `CSS/pay.css`**

```css
:root {
    --bg: #111315;
    --surface: #1a1d20;
    --surface-2: #22262b;
    --border: rgba(255,255,255,0.08);
    --primary: #3a7bff;
    --text: #fff;
    --muted: rgba(255,255,255,0.5);
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
}

* { box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; margin: 0; min-height: 100vh; }

.navbar { background: #0d0f11; border-bottom: 1px solid var(--border); padding: 12px 24px; }
.navbar-brand { font-weight: 700; font-size: 1.1rem; color: var(--text) !important; }
.brand-rc { color: var(--primary); }

.main-content { padding: 32px 24px; max-width: 1100px; margin: 0 auto; }

.pay-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
.pay-card + .pay-card { margin-top: 16px; }

.badge-draft    { background: var(--surface-2); color: var(--muted); }
.badge-sent     { background: rgba(58,123,255,0.15); color: var(--primary); }
.badge-paid     { background: rgba(34,197,94,0.15); color: var(--success); }
.badge-overdue  { background: rgba(239,68,68,0.15); color: var(--danger); }

.table-pay { width: 100%; border-collapse: collapse; }
.table-pay th { color: var(--muted); font-size: 12px; letter-spacing: 1px; text-transform: uppercase; padding: 10px 12px; border-bottom: 1px solid var(--border); font-weight: 500; }
.table-pay td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
.table-pay tr:last-child td { border-bottom: none; }
.table-pay tr:hover td { background: var(--surface-2); }

.form-control, .form-select { background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 10px 14px; }
.form-control:focus, .form-select:focus { background: var(--surface-2); border-color: var(--primary); color: var(--text); box-shadow: 0 0 0 3px rgba(58,123,255,0.15); }
.form-label { color: var(--muted); font-size: 13px; margin-bottom: 6px; }

.btn-primary { background: var(--primary); border-color: var(--primary); }
.btn-primary:hover { background: #2563eb; border-color: #2563eb; }
.btn-outline-secondary { border-color: var(--border); color: var(--muted); }
.btn-outline-secondary:hover { background: var(--surface-2); color: var(--text); }

.stat-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
.stat-label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.stat-value { font-size: 1.8rem; font-weight: 700; margin-top: 4px; }

.line-items-table th, .line-items-table td { padding: 8px 10px; }
.line-items-table th { font-size: 12px; color: var(--muted); }

.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.login-box { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 100%; max-width: 400px; }
.login-logo { font-size: 1.4rem; font-weight: 700; color: var(--primary); text-align: center; margin-bottom: 28px; }

/* Public invoice page */
.invoice-public { max-width: 680px; margin: 40px auto; padding: 0 16px 40px; }
.invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.invoice-logo { font-size: 1.3rem; font-weight: 700; color: var(--primary); }
.invoice-total-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-top: 24px; text-align: center; }
.invoice-total-amount { font-size: 2rem; font-weight: 700; color: var(--text); }

.bank-details-box { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-top: 16px; text-align: left; }
.bank-details-box .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.bank-details-box .value { font-weight: 600; font-size: 1rem; }
.qris-box { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-top: 16px; text-align: center; }
.qris-box .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
.qris-box img { max-width: 160px; border-radius: 8px; background: #fff; padding: 6px; }
.payment-divider { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin: 12px 0; }

.qr-wrap { text-align: center; }
.qr-wrap img { max-width: 180px; border-radius: 8px; }

@media print {
    .no-print { display: none !important; }
    body { background: #fff; color: #000; }
    .pay-card, .invoice-public { border: none; }
}
```

- [ ] **Step 5: Commit**

```bash
git add inc/ CSS/
git commit -m "feat: add auth helper, shared layout, and base CSS"
```

---

## Task 5: Login, logout, and index redirect

- [ ] **Step 1: Create `index.php`**

```php
<?php
require_once __DIR__ . '/config.php';
session_start();
if (!empty($_SESSION['admin_logged_in'])) {
    header('Location: ' . APP_URL . '/dashboard.php');
} else {
    header('Location: ' . APP_URL . '/login.php');
}
exit;
```

- [ ] **Step 2: Create `login.php`**

```php
<?php
require_once __DIR__ . '/config.php';
session_start();

if (!empty($_SESSION['admin_logged_in'])) {
    header('Location: ' . APP_URL . '/dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if (password_verify($password, ADMIN_PASSWORD_HASH)) {
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        header('Location: ' . APP_URL . '/dashboard.php');
        exit;
    } else {
        $error = 'Incorrect password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Rielcode Pay</title>
    <meta name="robots" content="noindex, nofollow">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="<?php echo APP_URL; ?>/CSS/pay.css" rel="stylesheet">
</head>
<body>
<div class="login-wrap">
    <div class="login-box">
        <div class="login-logo">RC Pay</div>
        <?php if ($error): ?>
            <div class="alert alert-danger py-2 mb-3"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <form method="POST">
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" autofocus required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
    </div>
</div>
</body>
</html>
```

- [ ] **Step 3: Create `logout.php`**

```php
<?php
session_start();
session_destroy();
require_once __DIR__ . '/config.php';
header('Location: ' . APP_URL . '/login.php');
exit;
```

- [ ] **Step 4: Test -- open `http://localhost/pay/`. Verify redirect to login. Enter wrong password, verify error. Enter correct password (`changeme`), verify redirect to dashboard.**

- [ ] **Step 5: Commit**

```bash
git add index.php login.php logout.php
git commit -m "feat: add login, logout, and index redirect"
```

---

## Task 6: Invoice number generator helper

- [ ] **Step 1: Create `inc/invoice_number.php`**

```php
<?php
function generate_invoice_number(mysqli $conn): string {
    $year = (int)date('Y');
    $stmt = $conn->prepare("
        INSERT INTO invoice_counter (year, last_number)
        VALUES (?, 1)
        ON DUPLICATE KEY UPDATE last_number = last_number + 1
    ");
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("SELECT last_number FROM invoice_counter WHERE year = ?");
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return sprintf('INV-%d-%03d', $year, (int)$row['last_number']);
}
```

- [ ] **Step 2: Commit**

```bash
git add inc/invoice_number.php
git commit -m "feat: add invoice number generator (INV-YYYY-NNN)"
```

---

## Task 7: Dashboard

- [ ] **Step 1: Create `dashboard.php`**

```php
<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/connection.php';
require_once __DIR__ . '/inc/auth.php';

$conn->query("UPDATE invoices SET status = 'overdue' WHERE status = 'sent' AND due_date < CURDATE()");

$stats = $conn->query("
    SELECT
        COUNT(*) AS total,
        SUM(status = 'paid') AS paid_count,
        SUM(status = 'sent') AS sent_count,
        SUM(status = 'overdue') AS overdue_count,
        SUM(CASE WHEN status = 'paid' AND currency = 'IDR' THEN total ELSE 0 END) AS revenue_idr,
        SUM(CASE WHEN status = 'paid' AND currency = 'USD' THEN total ELSE 0 END) AS revenue_usd
    FROM invoices
")->fetch_assoc();

$invoices = $conn->query("SELECT * FROM invoices ORDER BY created_at DESC");

$pageTitle = 'Dashboard | Rielcode Pay';
require_once __DIR__ . '/inc/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h4 class="mb-0">Invoices</h4>
    <a href="<?php echo APP_URL; ?>/invoice/create.php" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> New Invoice
    </a>
</div>

<div class="row g-3 mb-4">
    <div class="col-6 col-md-3"><div class="stat-box"><div class="stat-label">Total</div><div class="stat-value"><?php echo (int)$stats['total']; ?></div></div></div>
    <div class="col-6 col-md-3"><div class="stat-box"><div class="stat-label">Paid</div><div class="stat-value" style="color:var(--success)"><?php echo (int)$stats['paid_count']; ?></div></div></div>
    <div class="col-6 col-md-3"><div class="stat-box"><div class="stat-label">Pending</div><div class="stat-value" style="color:var(--primary)"><?php echo (int)$stats['sent_count']; ?></div></div></div>
    <div class="col-6 col-md-3"><div class="stat-box"><div class="stat-label">Overdue</div><div class="stat-value" style="color:var(--danger)"><?php echo (int)$stats['overdue_count']; ?></div></div></div>
</div>

<div class="row g-3 mb-4">
    <div class="col-md-6"><div class="stat-box"><div class="stat-label">Revenue (IDR)</div><div class="stat-value">Rp <?php echo number_format((float)$stats['revenue_idr'], 0, ',', '.'); ?></div></div></div>
    <div class="col-md-6"><div class="stat-box"><div class="stat-label">Revenue (USD)</div><div class="stat-value">$<?php echo number_format((float)$stats['revenue_usd'], 2); ?></div></div></div>
</div>

<div class="pay-card p-0 overflow-hidden">
    <table class="table-pay w-100">
        <thead>
            <tr>
                <th>Invoice</th><th>Client</th><th>Project</th><th>Amount</th><th>Due</th><th>Status</th><th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php while ($inv = $invoices->fetch_assoc()): ?>
            <?php
            $amount = $inv['currency'] === 'IDR'
                ? 'Rp ' . number_format($inv['total'], 0, ',', '.')
                : '$' . number_format($inv['total'], 2);
            ?>
            <tr>
                <td><code><?php echo htmlspecialchars($inv['invoice_number']); ?></code></td>
                <td><?php echo htmlspecialchars($inv['client_name']); ?></td>
                <td><?php echo htmlspecialchars($inv['project_name']); ?></td>
                <td><?php echo $amount; ?></td>
                <td><?php echo date('d M Y', strtotime($inv['due_date'])); ?></td>
                <td><span class="badge badge-<?php echo $inv['status']; ?> px-2 py-1 rounded"><?php echo ucfirst($inv['status']); ?></span></td>
                <td>
                    <a href="<?php echo APP_URL; ?>/invoice/edit.php?id=<?php echo $inv['id']; ?>" class="btn btn-sm btn-outline-secondary me-1">Edit</a>
                    <a href="<?php echo APP_URL; ?>/invoice/view.php?id=<?php echo urlencode($inv['invoice_number']); ?>" target="_blank" class="btn btn-sm btn-outline-secondary">View</a>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
</div>

<?php require_once __DIR__ . '/inc/footer.php'; ?>
```

- [ ] **Step 2: Open `http://localhost/pay/dashboard.php`. Verify stats and empty table render.**

- [ ] **Step 3: Commit**

```bash
git add dashboard.php
git commit -m "feat: add dashboard with stats and invoice table"
```

---

## Task 8: Create invoice page

- [ ] **Step 1: Create `invoice/create.php`**

```php
<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../inc/auth.php';
require_once __DIR__ . '/../inc/invoice_number.php';

$packages = $conn->query("SELECT package_name FROM packages ORDER BY id ASC");
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $client_name  = trim($_POST['client_name'] ?? '');
    $client_email = trim($_POST['client_email'] ?? '');
    $project_name = trim($_POST['project_name'] ?? '');
    $package      = trim($_POST['package'] ?? '');
    $currency     = in_array($_POST['currency'] ?? '', ['IDR','USD']) ? $_POST['currency'] : 'IDR';
    $due_date     = $_POST['due_date'] ?? '';
    $notes        = trim($_POST['notes'] ?? '');

    $descriptions = $_POST['item_desc'] ?? [];
    $quantities   = $_POST['item_qty'] ?? [];
    $prices       = $_POST['item_price'] ?? [];

    if (!$client_name || !$client_email || !$project_name || !$due_date || empty($descriptions)) {
        $error = 'Please fill all required fields and add at least one line item.';
    } else {
        $invoice_number = generate_invoice_number($conn);
        $subtotal = 0;
        $items = [];
        foreach ($descriptions as $i => $desc) {
            if (!trim($desc)) continue;
            $qty   = max(1, (int)($quantities[$i] ?? 1));
            $price = max(0, (float)str_replace(',', '', $prices[$i] ?? 0));
            $line_total = $qty * $price;
            $subtotal += $line_total;
            $items[] = ['desc' => trim($desc), 'qty' => $qty, 'price' => $price, 'total' => $line_total];
        }

        $stmt = $conn->prepare("
            INSERT INTO invoices
                (invoice_number, client_name, client_email, project_name, package, currency, subtotal, total, due_date, status, notes)
            VALUES (?,?,?,?,?,?,?,?,?,'draft',?)
        ");
        $stmt->bind_param("ssssssddss", $invoice_number, $client_name, $client_email, $project_name, $package, $currency, $subtotal, $subtotal, $due_date, $notes);
        $stmt->execute();
        $invoice_id = $conn->insert_id;
        $stmt->close();

        foreach ($items as $item) {
            $s = $conn->prepare("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES (?,?,?,?,?)");
            $s->bind_param("isidd", $invoice_id, $item['desc'], $item['qty'], $item['price'], $item['total']);
            $s->execute();
            $s->close();
        }

        header('Location: ' . APP_URL . '/invoice/edit.php?id=' . $invoice_id . '&created=1');
        exit;
    }
}

$pageTitle = 'New Invoice | Rielcode Pay';
require_once __DIR__ . '/../inc/header.php';
?>

<div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?php echo APP_URL; ?>/dashboard.php" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i></a>
    <h4 class="mb-0">New Invoice</h4>
</div>

<?php if ($error): ?>
    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
<?php endif; ?>

<form method="POST">
    <div class="row g-4">
        <div class="col-md-8">
            <div class="pay-card mb-4">
                <h6 class="mb-3" style="color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:1px;">Client</h6>
                <div class="row g-3">
                    <div class="col-md-6"><label class="form-label">Client Name *</label><input type="text" name="client_name" class="form-control" required></div>
                    <div class="col-md-6"><label class="form-label">Client Email *</label><input type="email" name="client_email" class="form-control" required></div>
                    <div class="col-md-6"><label class="form-label">Project Name *</label><input type="text" name="project_name" class="form-control" required></div>
                    <div class="col-md-6">
                        <label class="form-label">Package</label>
                        <select name="package" class="form-select">
                            <option value="">-- None --</option>
                            <?php while ($p = $packages->fetch_assoc()): ?>
                            <option value="<?php echo htmlspecialchars($p['package_name']); ?>"><?php echo htmlspecialchars($p['package_name']); ?></option>
                            <?php endwhile; ?>
                        </select>
                    </div>
                </div>
            </div>

            <div class="pay-card mb-4">
                <h6 class="mb-3" style="color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:1px;">Line Items</h6>
                <table class="line-items-table w-100 mb-3">
                    <thead><tr><th style="width:50%">Description</th><th style="width:10%">Qty</th><th style="width:25%">Unit Price</th><th style="width:15%">Total</th></tr></thead>
                    <tbody id="items-body">
                        <tr>
                            <td><input type="text" name="item_desc[]" class="form-control form-control-sm" required></td>
                            <td><input type="number" name="item_qty[]" class="form-control form-control-sm item-qty" value="1" min="1"></td>
                            <td><input type="number" name="item_price[]" class="form-control form-control-sm item-price" value="0" min="0" step="1000"></td>
                            <td><span class="item-total">0</span></td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="addRow()">+ Add Row</button>
            </div>

            <div class="pay-card">
                <label class="form-label">Notes (optional)</label>
                <textarea name="notes" class="form-control" rows="3"></textarea>
            </div>
        </div>

        <div class="col-md-4">
            <div class="pay-card mb-3">
                <h6 class="mb-3" style="color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:1px;">Settings</h6>
                <div class="mb-3">
                    <label class="form-label">Currency *</label>
                    <select name="currency" class="form-select">
                        <option value="IDR">IDR (Indonesian Rupiah)</option>
                        <option value="USD">USD (US Dollar)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Due Date *</label>
                    <input type="date" name="due_date" class="form-control" required min="<?php echo date('Y-m-d'); ?>">
                </div>
            </div>
            <div class="pay-card mb-3 text-end">
                <div style="color:var(--muted);font-size:13px;">Total</div>
                <div id="grand-total" style="font-size:1.8rem;font-weight:700;">0</div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Save as Draft</button>
        </div>
    </div>
</form>

<script>
function addRow() {
    const tbody = document.getElementById('items-body');
    const row = tbody.querySelector('tr').cloneNode(true);
    row.querySelectorAll('input').forEach(i => { i.value = i.name.includes('qty') ? 1 : (i.name.includes('price') ? 0 : ''); });
    row.querySelector('.item-total').textContent = '0';
    tbody.appendChild(row);
    bindRow(row);
}
function bindRow(row) {
    const qty = row.querySelector('.item-qty');
    const price = row.querySelector('.item-price');
    const total = row.querySelector('.item-total');
    const update = () => { const t = (parseInt(qty.value)||1)*(parseFloat(price.value)||0); total.textContent = t.toLocaleString('id-ID'); updateGrandTotal(); };
    qty.addEventListener('input', update);
    price.addEventListener('input', update);
}
function updateGrandTotal() {
    let sum = 0;
    document.querySelectorAll('.item-qty').forEach((q,i) => { const prices = document.querySelectorAll('.item-price'); sum += (parseInt(q.value)||1)*(parseFloat(prices[i]?.value)||0); });
    document.getElementById('grand-total').textContent = sum.toLocaleString('id-ID');
}
document.querySelectorAll('#items-body tr').forEach(bindRow);
</script>

<?php require_once __DIR__ . '/../inc/footer.php'; ?>
```

- [ ] **Step 2: Test -- create a test invoice, verify redirect to edit page.**

- [ ] **Step 3: Commit**

```bash
git add invoice/create.php
git commit -m "feat: add invoice creation page"
```

---

## Task 9: Edit invoice + generate shareable URL + QR code

- [ ] **Step 1: Create `invoice/edit.php`**

```php
<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../inc/auth.php';
require_once __DIR__ . '/../vendor/autoload.php';

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: ' . APP_URL . '/dashboard.php'); exit; }

$stmt = $conn->prepare("SELECT * FROM invoices WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$inv = $stmt->get_result()->fetch_assoc();
$stmt->close();
if (!$inv) { header('Location: ' . APP_URL . '/dashboard.php'); exit; }

$items = $conn->query("SELECT * FROM invoice_items WHERE invoice_id = $id ORDER BY id ASC");
$allItems = [];
while ($row = $items->fetch_assoc()) $allItems[] = $row;

$publicUrl = APP_URL . '/invoice/view.php?id=' . urlencode($inv['invoice_number']);
$pdfUrl    = APP_URL . '/invoice-pdf.php?id=' . urlencode($inv['invoice_number']);

$options = new QROptions(['outputType' => 'png', 'scale' => 5, 'imageBase64' => true]);
$qrCode = (new QRCode($options))->render($publicUrl);

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'send' && $inv['status'] === 'draft') {
        $s = $conn->prepare("UPDATE invoices SET status='sent' WHERE id=?");
        $s->bind_param("i", $id);
        $s->execute();
        $s->close();
        $inv['status'] = 'sent';
        $message = 'Invoice marked as sent. Share the link or QR below with your client.';
    }
    if ($_POST['action'] === 'mark_paid') {
        $s = $conn->prepare("UPDATE invoices SET status='paid' WHERE id=?");
        $s->bind_param("i", $id);
        $s->execute();
        $s->close();
        $inv['status'] = 'paid';
        $message = 'Invoice marked as paid.';
    }
}

$pageTitle = 'Invoice ' . $inv['invoice_number'] . ' | Rielcode Pay';
require_once __DIR__ . '/../inc/header.php';

$amount = $inv['currency'] === 'IDR'
    ? 'Rp ' . number_format($inv['total'], 0, ',', '.')
    : '$' . number_format($inv['total'], 2);
?>

<div class="d-flex align-items-center gap-3 mb-4">
    <a href="<?php echo APP_URL; ?>/dashboard.php" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i></a>
    <h4 class="mb-0"><?php echo htmlspecialchars($inv['invoice_number']); ?></h4>
    <span class="badge badge-<?php echo $inv['status']; ?> px-2 py-1 rounded ms-1"><?php echo ucfirst($inv['status']); ?></span>
</div>

<?php if ($message): ?>
    <div class="alert alert-info"><?php echo htmlspecialchars($message); ?></div>
<?php endif; ?>

<div class="row g-4">
    <div class="col-md-8">
        <div class="pay-card mb-3">
            <div class="row">
                <div class="col-6"><div style="color:var(--muted);font-size:12px;">Client</div><strong><?php echo htmlspecialchars($inv['client_name']); ?></strong><div style="color:var(--muted);font-size:13px;"><?php echo htmlspecialchars($inv['client_email']); ?></div></div>
                <div class="col-6"><div style="color:var(--muted);font-size:12px;">Project</div><strong><?php echo htmlspecialchars($inv['project_name']); ?></strong></div>
                <div class="col-6 mt-3"><div style="color:var(--muted);font-size:12px;">Due Date</div><?php echo date('d M Y', strtotime($inv['due_date'])); ?></div>
                <div class="col-6 mt-3"><div style="color:var(--muted);font-size:12px;">Currency</div><?php echo $inv['currency']; ?></div>
            </div>
        </div>
        <div class="pay-card">
            <h6 class="mb-3" style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Line Items</h6>
            <table class="line-items-table w-100">
                <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
                <tbody>
                <?php foreach ($allItems as $item): ?>
                <tr>
                    <td><?php echo htmlspecialchars($item['description']); ?></td>
                    <td><?php echo $item['quantity']; ?></td>
                    <td><?php echo number_format($item['unit_price'], 0, ',', '.'); ?></td>
                    <td><?php echo number_format($item['total'], 0, ',', '.'); ?></td>
                </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <div class="text-end mt-3 pt-3" style="border-top:1px solid var(--border);">
                <strong style="font-size:1.2rem;"><?php echo $amount; ?></strong>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <?php if ($inv['status'] === 'draft'): ?>
        <div class="pay-card mb-3">
            <form method="POST">
                <input type="hidden" name="action" value="send">
                <p style="color:var(--muted);font-size:13px;">Generate shareable link and mark invoice as sent.</p>
                <button type="submit" class="btn btn-primary w-100">Mark as Sent + Get Link</button>
            </form>
        </div>
        <?php endif; ?>

        <?php if (in_array($inv['status'], ['sent', 'overdue'])): ?>
        <div class="pay-card mb-3">
            <form method="POST">
                <input type="hidden" name="action" value="mark_paid">
                <p style="color:var(--muted);font-size:13px;">Client confirmed payment via WhatsApp?</p>
                <button type="submit" class="btn btn-success w-100">Mark as Paid</button>
            </form>
        </div>
        <?php endif; ?>

        <?php if ($inv['status'] !== 'draft'): ?>
        <div class="pay-card mb-3">
            <h6 class="mb-3" style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Client Invoice Link</h6>
            <div class="input-group mb-2">
                <input type="text" class="form-control form-control-sm" value="<?php echo htmlspecialchars($publicUrl); ?>" id="pay-link" readonly>
                <button class="btn btn-outline-secondary btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('pay-link').value)">Copy</button>
            </div>
            <a href="<?php echo htmlspecialchars($publicUrl); ?>" target="_blank" class="btn btn-outline-secondary btn-sm w-100">Preview</a>
        </div>
        <div class="pay-card text-center">
            <h6 class="mb-3" style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:1px;">QR Code</h6>
            <img src="<?php echo $qrCode; ?>" alt="QR Code" style="max-width:180px;border-radius:8px;">
            <div class="mt-2">
                <a href="<?php echo $qrCode; ?>" download="<?php echo $inv['invoice_number']; ?>-qr.png" class="btn btn-outline-secondary btn-sm">Download QR</a>
            </div>
        </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../inc/footer.php'; ?>
```

- [ ] **Step 2: Test -- open edit page for a draft invoice. Click "Mark as Sent + Get Link". Verify status changes, link appears, QR displays.**

- [ ] **Step 3: Test -- click "Mark as Paid". Verify status updates to paid.**

- [ ] **Step 4: Commit**

```bash
git add invoice/edit.php
git commit -m "feat: add invoice edit page with shareable link, QR, and manual paid toggle"
```

---

## Task 10: Public client invoice page

- [ ] **Step 1: Create `invoice/view.php`**

```php
<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../connection.php';

$invoice_number = trim($_GET['id'] ?? '');
if (!$invoice_number) { http_response_code(404); die('Invoice not found.'); }

$stmt = $conn->prepare("SELECT * FROM invoices WHERE invoice_number = ?");
$stmt->bind_param("s", $invoice_number);
$stmt->execute();
$inv = $stmt->get_result()->fetch_assoc();
$stmt->close();
if (!$inv) { http_response_code(404); die('Invoice not found.'); }

if ($inv['status'] === 'sent' && $inv['due_date'] < date('Y-m-d')) {
    $conn->query("UPDATE invoices SET status='overdue' WHERE id=" . (int)$inv['id']);
    $inv['status'] = 'overdue';
}

$items = $conn->query("SELECT * FROM invoice_items WHERE invoice_id = " . (int)$inv['id']);
$allItems = [];
while ($row = $items->fetch_assoc()) $allItems[] = $row;

$amount = $inv['currency'] === 'IDR'
    ? 'Rp ' . number_format($inv['total'], 0, ',', '.')
    : '$' . number_format($inv['total'], 2);

$isPaid    = $inv['status'] === 'paid';
$isOverdue = $inv['status'] === 'overdue';

$pdfUrl = APP_URL . '/invoice-pdf.php?id=' . urlencode($invoice_number);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice <?php echo htmlspecialchars($inv['invoice_number']); ?> | Rielcode</title>
    <meta name="robots" content="noindex, nofollow">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link href="<?php echo APP_URL; ?>/CSS/pay.css" rel="stylesheet">
</head>
<body style="background:#0d0f11;">
<div class="invoice-public">
    <div class="invoice-header">
        <div>
            <div class="invoice-logo">Rielcode</div>
            <div style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:4px;">rielcode.com</div>
        </div>
        <div style="text-align:right;">
            <code style="color:rgba(255,255,255,0.5);font-size:13px;"><?php echo htmlspecialchars($inv['invoice_number']); ?></code>
            <div>
                <?php if ($isPaid): ?>
                    <span class="badge badge-paid px-2 py-1 rounded mt-1">Paid</span>
                <?php elseif ($isOverdue): ?>
                    <span class="badge badge-overdue px-2 py-1 rounded mt-1">Overdue</span>
                <?php else: ?>
                    <span class="badge badge-sent px-2 py-1 rounded mt-1">Unpaid</span>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div class="pay-card mb-3">
        <div class="row">
            <div class="col-6"><div style="color:rgba(255,255,255,0.4);font-size:12px;">Bill To</div><strong><?php echo htmlspecialchars($inv['client_name']); ?></strong><div style="color:rgba(255,255,255,0.4);font-size:13px;"><?php echo htmlspecialchars($inv['client_email']); ?></div></div>
            <div class="col-6" style="text-align:right;"><div style="color:rgba(255,255,255,0.4);font-size:12px;">Due Date</div><?php echo date('d M Y', strtotime($inv['due_date'])); ?></div>
        </div>
    </div>

    <div class="pay-card mb-3">
        <h6 class="mb-3" style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Project</h6>
        <strong><?php echo htmlspecialchars($inv['project_name']); ?></strong>
        <?php if ($inv['package']): ?><div style="color:rgba(255,255,255,0.4);font-size:13px;"><?php echo htmlspecialchars($inv['package']); ?></div><?php endif; ?>
    </div>

    <div class="pay-card mb-3">
        <table class="line-items-table w-100">
            <thead><tr><th>Description</th><th style="text-align:right;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Total</th></tr></thead>
            <tbody>
            <?php foreach ($allItems as $item): ?>
            <tr>
                <td><?php echo htmlspecialchars($item['description']); ?></td>
                <td style="text-align:right;"><?php echo $item['quantity']; ?></td>
                <td style="text-align:right;"><?php echo number_format($item['unit_price'], 0, ',', '.'); ?></td>
                <td style="text-align:right;"><?php echo number_format($item['total'], 0, ',', '.'); ?></td>
            </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <?php if ($inv['notes']): ?>
    <div class="pay-card mb-3" style="color:rgba(255,255,255,0.5);font-size:13px;"><?php echo nl2br(htmlspecialchars($inv['notes'])); ?></div>
    <?php endif; ?>

    <div class="invoice-total-box">
        <div style="color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Total Amount Due</div>
        <div class="invoice-total-amount"><?php echo $amount; ?></div>

        <?php if ($isPaid): ?>
            <div style="color:#22c55e;margin-top:16px;font-weight:600;">Payment received. Thank you!</div>
        <?php else: ?>
            <?php if ($inv['currency'] === 'IDR'): ?>
            <div class="qris-box mt-3">
                <div class="label">Scan QRIS</div>
                <img src="<?php echo APP_URL; ?>/IMG/qris.png" alt="QRIS">
                <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:8px;">GoPay, OVO, DANA, BCA, and all banking apps</div>
            </div>
            <div class="payment-divider">or pay via bank transfer</div>
            <?php endif; ?>
            <div class="bank-details-box">
                <div class="label">Bank Transfer</div>
                <div class="value mt-2"><?php echo htmlspecialchars(BANK_NAME); ?></div>
                <div style="font-size:1.3rem;font-weight:700;letter-spacing:2px;margin:6px 0;"><?php echo htmlspecialchars(BANK_ACCOUNT_NUMBER); ?></div>
                <div style="color:rgba(255,255,255,0.6);font-size:14px;"><?php echo htmlspecialchars(BANK_ACCOUNT_NAME); ?></div>
            </div>
            <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:12px;">After payment, send proof via WhatsApp to confirm.</div>
        <?php endif; ?>

        <div class="mt-4 no-print">
            <a href="<?php echo htmlspecialchars($pdfUrl); ?>" class="btn btn-outline-secondary btn-sm">Download PDF</a>
        </div>
    </div>
</div>
</body>
</html>
```

- [ ] **Step 2: Open `http://localhost/pay/invoice/view.php?id=INV-2026-001`. Verify invoice renders with bank details and Download PDF button.**

- [ ] **Step 3: Commit**

```bash
git add invoice/view.php
git commit -m "feat: add public client invoice page with bank transfer details and PDF download"
```

---

## Task 11: PDF generation

- [ ] **Step 1: Create `invoice-pdf.php`**

```php
<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/connection.php';
require_once __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$invoice_number = trim($_GET['id'] ?? '');
if (!$invoice_number) { http_response_code(404); die('Not found.'); }

$stmt = $conn->prepare("SELECT * FROM invoices WHERE invoice_number = ?");
$stmt->bind_param("s", $invoice_number);
$stmt->execute();
$inv = $stmt->get_result()->fetch_assoc();
$stmt->close();
if (!$inv) { http_response_code(404); die('Not found.'); }

$items_result = $conn->query("SELECT * FROM invoice_items WHERE invoice_id = " . (int)$inv['id']);
$allItems = [];
while ($row = $items_result->fetch_assoc()) $allItems[] = $row;

$amount = $inv['currency'] === 'IDR'
    ? 'Rp ' . number_format($inv['total'], 0, ',', '.')
    : '$' . number_format($inv['total'], 2);

$rows = '';
foreach ($allItems as $item) {
    $rows .= '<tr>
        <td>' . htmlspecialchars($item['description']) . '</td>
        <td style="text-align:center;">' . (int)$item['quantity'] . '</td>
        <td style="text-align:right;">' . number_format($item['unit_price'], 0, ',', '.') . '</td>
        <td style="text-align:right;">' . number_format($item['total'], 0, ',', '.') . '</td>
    </tr>';
}

$html = '
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111; margin: 40px; }
  .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
  .logo { font-size: 20px; font-weight: bold; color: #3a7bff; }
  .invoice-meta { text-align: right; color: #555; font-size: 11px; }
  .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #f4f4f4; padding: 8px; text-align: left; font-size: 10px; text-transform: uppercase; color: #555; }
  td { padding: 8px; border-bottom: 1px solid #eee; }
  .total-row { font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px; }
  .bank-box { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 14px; margin-top: 20px; }
  .bank-label { font-size: 10px; text-transform: uppercase; color: #888; }
  .bank-value { font-size: 13px; font-weight: bold; }
  .footer { margin-top: 40px; font-size: 10px; color: #aaa; text-align: center; }
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;margin-bottom:30px;">
  <div><div class="logo">Rielcode</div><div style="color:#888;font-size:11px;">rielcode.com</div></div>
  <div style="text-align:right;">
    <div style="font-size:11px;color:#888;">Invoice</div>
    <div style="font-weight:bold;">' . htmlspecialchars($inv['invoice_number']) . '</div>
    <div style="color:#888;font-size:11px;">Due: ' . date('d M Y', strtotime($inv['due_date'])) . '</div>
  </div>
</div>

<div style="margin-bottom:20px;">
  <div class="section-title">Bill To</div>
  <strong>' . htmlspecialchars($inv['client_name']) . '</strong><br>
  <span style="color:#555;">' . htmlspecialchars($inv['client_email']) . '</span>
</div>

<div style="margin-bottom:10px;"><strong>' . htmlspecialchars($inv['project_name']) . '</strong></div>

<table>
  <thead><tr><th>Description</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Total</th></tr></thead>
  <tbody>' . $rows . '</tbody>
</table>

<div class="total-row">Total: ' . $amount . '</div>

<div class="bank-box">
  <div class="bank-label">Payment' . ($inv['currency'] === 'IDR' ? ' via QRIS or Bank Transfer' : ' via Bank Transfer') . '</div>
  ' . ($inv['currency'] === 'IDR' ? '<div style="color:#555;font-size:10px;margin-bottom:8px;">Scan QRIS with GoPay, OVO, DANA, or any banking app. Or transfer to:</div>' : '') . '
  <div class="bank-value" style="margin-top:6px;">' . htmlspecialchars(BANK_NAME) . '</div>
  <div style="font-size:15px;font-weight:bold;letter-spacing:2px;margin:4px 0;">' . htmlspecialchars(BANK_ACCOUNT_NUMBER) . '</div>
  <div style="color:#555;">' . htmlspecialchars(BANK_ACCOUNT_NAME) . '</div>
  <div style="color:#888;font-size:10px;margin-top:8px;">After payment, send proof via WhatsApp to confirm.</div>
</div>

<div class="footer">Generated by Rielcode &mdash; rielcode.com</div>
</body>
</html>';

$options = new Options();
$options->set('isRemoteEnabled', false);
$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream($inv['invoice_number'] . '.pdf', ['Attachment' => true]);
```

- [ ] **Step 2: Open `http://localhost/pay/invoice-pdf.php?id=INV-2026-001`. Verify PDF downloads with correct invoice data and bank details.**

- [ ] **Step 3: Commit**

```bash
git add invoice-pdf.php
git commit -m "feat: add server-side PDF invoice generation via dompdf"
```

---

## Task 12: Deploy to cPanel subdomain

- [ ] **Step 1: Log into cPanel. Go to Subdomains. Create `pay.rielcode.com` pointing to `/home/rier5192/pay/`.**

- [ ] **Step 2: Push to GitHub and clone on server:**

```bash
cd C:\xampp\htdocs\pay
git remote add origin git@github.com:Azriel-Fajar/rielcode-pay.git
git push -u origin main
```

On server:
```bash
git clone git@github.com:Azriel-Fajar/rielcode-pay.git ~/pay
cd ~/pay
composer install --no-dev
```

- [ ] **Step 3: Create `config.php` on server via cPanel file manager:**

```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_cpanel_db_user');
define('DB_PASS', 'your_cpanel_db_pass');
define('DB_NAME', 'your_cpanel_db_name');
define('SMTP_HOST', 'mail.rielcode.com');
define('SMTP_USER', 'info@rielcode.com');
define('SMTP_PASS', 'rielinfo1407');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls');
define('ADMIN_PASSWORD_HASH', password_hash('your-strong-password', PASSWORD_DEFAULT));
define('APP_URL', 'https://pay.rielcode.com');
define('BANK_NAME', 'BCA');
define('BANK_ACCOUNT_NUMBER', '1234567890');
define('BANK_ACCOUNT_NAME', 'Azriel Fajar Wibowo');
```

- [ ] **Step 4: Upload `IMG/qris.png` to server via cPanel file manager. Get your personal QRIS image from your bank app or GoPay/OVO/DANA merchant QR.**

- [ ] **Step 5: Run DB migration SQL on production DB via phpMyAdmin (same SQL from Task 2).**

- [ ] **Step 6: Open `https://pay.rielcode.com/`. Login, create test IDR invoice, mark sent, open client URL. Verify QRIS image and bank details show. Verify PDF downloads. Test USD invoice -- verify QRIS section hidden.**
