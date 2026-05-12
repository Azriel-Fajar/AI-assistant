# Referral System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a referral program to Rielcode so college friends earn 10% commission when their code is used at checkout.

**Architecture:** Two new DB tables (`referrers`, `referral_commissions`) + one new column on `orders`. Checkout gains an optional referral code field that silently resolves to a commission row on POST. Admin panel gains two new sidebar tabs (Referrers, Commissions). A new public read-only dashboard at `/referrer/?code=XXX` lets referrers track their stats.

**Tech Stack:** PHP 8, MySQLi (checkout), PDO (admin.php), MySQL, Bootstrap Icons, Tailwind (checkout page only), plain CSS (admin)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `C:\xampp\htdocs\Rielcode\checkout\index.php` | Modify | Add referral code field + commission insert on POST |
| `C:\xampp\htdocs\Rielcode\admin.php` | Modify | Add Referrers + Commissions sidebar tabs + handler logic |
| `C:\xampp\htdocs\Rielcode\referrer\index.php` | Create | Public referrer dashboard (read-only, code-auth) |

---

## Task 1: Database Migration

**Files:**
- Run SQL directly in phpMyAdmin or MySQL CLI

- [ ] **Step 1: Run the migration SQL**

Open phpMyAdmin at `http://localhost/phpmyadmin`, select the `rielcode` database, go to SQL tab, and run:

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

ALTER TABLE orders ADD COLUMN referral_code VARCHAR(20) DEFAULT NULL;
```

- [ ] **Step 2: Verify tables exist**

In phpMyAdmin, confirm:
- `referrers` table exists with columns: id, name, phone, code, commission_rate, status, created_at
- `referral_commissions` table exists with columns: id, referrer_id, order_id, order_amount, commission_amount, status, paid_at, created_at
- `orders` table now has a `referral_code` column

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add referral DB migration SQL (referrers, referral_commissions, orders.referral_code)"
```

---

## Task 2: Checkout — Referral Code Field + Commission Logic

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\checkout\index.php`

The checkout file uses **mysqli** (`$conn` from `connection.php`). All new DB calls here must use `$conn->prepare()` / `bind_param()`. The `$final_price` variable is already calculated before the POST handler block at line 99.

- [ ] **Step 1: Add referral code lookup helper before the POST block**

Find this line in `checkout\index.php` (around line 112):
```php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $orderRow['status'] !== 'On Progress') {
```

Insert this block immediately BEFORE that line:

```php
// Referral code resolution — runs on both GET and POST so the error message can re-render
$referralError = '';
$referrer = null;
$rawCode = trim($_POST['referral_code'] ?? '');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $rawCode !== '') {
    $stmt = $conn->prepare("SELECT id, commission_rate FROM referrers WHERE code = ? AND status = 'active'");
    $stmt->bind_param("s", $rawCode);
    $stmt->execute();
    $refRow = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if ($refRow) {
        $referrer = $refRow;
    } else {
        $referralError = 'This code is invalid or inactive.';
    }
}
```

- [ ] **Step 2: Add commission insert inside the POST handler**

Find this block inside the POST handler (around line 120):
```php
    $stmt = $conn->prepare("UPDATE orders SET status='On Progress', package_price=?, addons_total=?, final_price=? WHERE id=?");
    $stmt->bind_param("iiii", $package_price, $addons_total, $final_price, $id);
    $stmt->execute();
    $stmt->close();
```

After that `$stmt->close();` line, add:

```php
    // Referral: store code on order and insert commission row if valid code was submitted
    if ($referrer !== null) {
        $stmtRef = $conn->prepare("UPDATE orders SET referral_code = ? WHERE id = ?");
        $stmtRef->bind_param("si", $rawCode, $id);
        $stmtRef->execute();
        $stmtRef->close();

        $commissionAmount = round($final_price * ($referrer['commission_rate'] / 100), 2);
        $stmtCom = $conn->prepare("INSERT INTO referral_commissions (referrer_id, order_id, order_amount, commission_amount) VALUES (?, ?, ?, ?)");
        $stmtCom->bind_param("iidd", $referrer['id'], $id, $final_price, $commissionAmount);
        $stmtCom->execute();
        $stmtCom->close();
    }
```

- [ ] **Step 3: Add referral code input field to the HTML form**

Find the form in the HTML section:
```html
            <form method="post" id="checkoutForm">
                <div class="checkbox">
```

Replace with:

```html
            <form method="post" id="checkoutForm">
                <div style="margin-bottom:16px;">
                    <label for="referral_code" style="display:block;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px;">Referral Code (optional)</label>
                    <input
                        type="text"
                        name="referral_code"
                        id="referral_code"
                        placeholder="e.g. BUDI10"
                        value="<?= htmlspecialchars($rawCode) ?>"
                        style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:14px;outline:none;"
                    >
                    <?php if ($referralError !== ''): ?>
                        <p style="color:#f87171;font-size:12px;margin-top:6px;"><?= htmlspecialchars($referralError) ?></p>
                    <?php endif; ?>
                </div>
                <div class="checkbox">
```

- [ ] **Step 4: Verify manually**

1. Open `http://localhost/Rielcode/order-form/`, fill in the form, reach checkout.
2. Confirm the referral code field is visible below total.
3. Enter a garbage code like `FAKE99`, click Confirm — verify inline error appears and order still processes (check `orders` table: `referral_code` should be NULL).
4. Add a test referrer row directly in phpMyAdmin: `INSERT INTO referrers (name, phone, code) VALUES ('Test Friend', '081234567890', 'TEST10');`
5. Place another order, enter `TEST10` at checkout — verify `referral_commissions` row created with correct amount and `orders.referral_code = 'TEST10'`.

- [ ] **Step 5: Commit**

```bash
git add checkout/index.php
git commit -m "feat: add referral code field and commission insert to checkout"
```

---

## Task 3: Admin Panel — Referrers Tab (Backend Logic)

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\admin.php`

Admin uses **PDO** (`$pdo`). All new admin DB calls use `$pdo->prepare()->execute()`. The `$allowedTables` array is on line 31 — both new tables must be added to it. Sidebar nav is on lines 285-291. Action handlers are in the top PHP block before the HTML.

- [ ] **Step 1: Add referrers and commissions to $allowedTables**

Find line 31:
```php
$allowedTables = ['chat_logs', 'orders', 'packages', 'testimonials', 'projects', 'invoices'];
```

Replace with:
```php
$allowedTables = ['chat_logs', 'orders', 'packages', 'testimonials', 'projects', 'invoices', 'referrers', 'commissions'];
```

- [ ] **Step 2: Add Referrers action handlers (add, toggle, delete)**

Find this block (around line 167):
```php
// --- Invoices: handled below (CRUD via dedicated routes in invoices admin block) ---
```

Insert before that line:

```php
// --- Referrers: add ---
if ($table === 'referrers' && $_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add') {
    $rName  = trim($_POST['name']            ?? '');
    $rPhone = trim($_POST['phone']           ?? '');
    $rCode  = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', trim($_POST['code'] ?? '')));
    $rRate  = min(100, max(0, (float)($_POST['commission_rate'] ?? 10)));
    if ($rName !== '' && $rPhone !== '' && $rCode !== '') {
        $stmt = $pdo->prepare("INSERT INTO referrers (name, phone, code, commission_rate) VALUES (?, ?, ?, ?)");
        $stmt->execute([$rName, $rPhone, $rCode, $rRate]);
        rc_flash('Referrer added.');
    } else {
        rc_flash('Name, phone, and code are required.', 'error');
    }
    header("Location: admin.php?table=referrers");
    exit;
}

// --- Referrers: toggle active/inactive ---
if ($table === 'referrers' && $action === 'toggle' && $id) {
    $stmt = $pdo->prepare("SELECT status FROM referrers WHERE id = ?");
    $stmt->execute([$id]);
    $cur = $stmt->fetchColumn();
    $next = ($cur === 'active') ? 'inactive' : 'active';
    $pdo->prepare("UPDATE referrers SET status = ? WHERE id = ?")->execute([$next, $id]);
    rc_flash('Referrer status updated.');
    header("Location: admin.php?table=referrers");
    exit;
}

// --- Referrers: delete (only if no commissions linked) ---
if ($table === 'referrers' && $action === 'delete' && $id) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM referral_commissions WHERE referrer_id = ?");
    $stmt->execute([$id]);
    if ((int)$stmt->fetchColumn() > 0) {
        rc_flash('Cannot delete — referrer has linked commissions.', 'error');
    } else {
        $pdo->prepare("DELETE FROM referrers WHERE id = ?")->execute([$id]);
        rc_flash('Referrer deleted.');
    }
    header("Location: admin.php?table=referrers");
    exit;
}
```

- [ ] **Step 3: Add Commissions action handlers (mark paid, cancel)**

Immediately after the referrers block just added, add:

```php
// --- Commissions: mark paid ---
if ($table === 'commissions' && $action === 'paid' && $id) {
    $pdo->prepare("UPDATE referral_commissions SET status='paid', paid_at=NOW() WHERE id = ?")->execute([$id]);
    rc_flash('Commission marked as paid.');
    header("Location: admin.php?table=commissions");
    exit;
}

// --- Commissions: cancel ---
if ($table === 'commissions' && $action === 'cancel' && $id) {
    $pdo->prepare("UPDATE referral_commissions SET status='cancelled' WHERE id = ?")->execute([$id]);
    rc_flash('Commission cancelled.');
    header("Location: admin.php?table=commissions");
    exit;
}
```

- [ ] **Step 4: Add referrers data fetch to the switch statement**

Find the switch block (around line 188). At the end of the switch, find:
```php
    case 'chat_logs':
    default:
        $stmt = $pdo->prepare("SELECT id, LEFT(user_message, 120) AS user_message, LEFT(bot_reply, 120) AS bot_reply, tag, created_at FROM chat_logs ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
        $columns = ['id', 'user_message', 'bot_reply', 'tag', 'created_at'];
        break;
}
```

Replace just the `chat_logs` case with:
```php
    case 'referrers':
        $stmt = $pdo->prepare(
            "SELECT r.id, r.name, r.phone, r.code, r.commission_rate, r.status,
                    COALESCE(SUM(CASE WHEN rc.status='paid' THEN rc.commission_amount ELSE 0 END), 0) AS total_earned
             FROM referrers r
             LEFT JOIN referral_commissions rc ON rc.referrer_id = r.id
             GROUP BY r.id
             ORDER BY r.created_at DESC
             LIMIT :limit OFFSET :offset"
        );
        $columns = ['id','name','phone','code','commission_rate','status','total_earned'];
        break;
    case 'commissions':
        // Filters applied below after switch
        $filterReferrerId = isset($_GET['referrer_id']) ? (int)$_GET['referrer_id'] : 0;
        $filterStatus      = in_array($_GET['status'] ?? '', ['pending','paid','cancelled'], true) ? $_GET['status'] : '';
        $where = [];
        $params = [];
        if ($filterReferrerId) { $where[] = 'rc.referrer_id = :ref_id'; $params[':ref_id'] = $filterReferrerId; }
        if ($filterStatus !== '') { $where[] = 'rc.status = :status'; $params[':status'] = $filterStatus; }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
        $stmt = $pdo->prepare(
            "SELECT rc.id, r.name AS referrer_name, o.invoice_number, rc.order_amount,
                    rc.commission_amount, rc.status, rc.created_at, rc.paid_at
             FROM referral_commissions rc
             JOIN referrers r ON r.id = rc.referrer_id
             JOIN orders o ON o.id = rc.order_id
             $whereSql
             ORDER BY rc.created_at DESC
             LIMIT :limit OFFSET :offset"
        );
        foreach ($params as $k => $v) { $stmt->bindValue($k, $v); }
        $columns = ['id','referrer_name','invoice_number','order_amount','commission_amount','status','created_at'];
        break;
    case 'chat_logs':
    default:
        $stmt = $pdo->prepare("SELECT id, LEFT(user_message, 120) AS user_message, LEFT(bot_reply, 120) AS bot_reply, tag, created_at FROM chat_logs ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
        $columns = ['id', 'user_message', 'bot_reply', 'tag', 'created_at'];
        break;
}
```

- [ ] **Step 5: Fix COUNT(*) for commissions tab**

The existing pagination code (around line 175) does:
```php
$countTable = ($table === 'invoices') ? 'orders' : $table;
$total_items = (int)$pdo->query("SELECT COUNT(*) FROM `$countTable`")->fetchColumn();
```

Replace just those two lines with:

```php
if ($table === 'invoices') {
    $countTable = 'orders';
    $total_items = (int)$pdo->query("SELECT COUNT(*) FROM `$countTable`")->fetchColumn();
} elseif ($table === 'commissions') {
    $total_items = (int)$pdo->query("SELECT COUNT(*) FROM referral_commissions")->fetchColumn();
} else {
    $total_items = (int)$pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
}
$total_pages = max(1, (int)ceil($total_items / $items_per_page));
```

- [ ] **Step 6: Fetch all referrers list for commissions filter dropdown**

After the `$invites` / testimonials block (around line 243), add:

```php
// Referrers list for commissions filter dropdown
$allReferrers = [];
if ($table === 'commissions') {
    $allReferrers = $pdo->query("SELECT id, name FROM referrers ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);
}
```

- [ ] **Step 7: Commit backend logic**

```bash
git add admin.php
git commit -m "feat: add referrers/commissions backend logic to admin.php"
```

---

## Task 4: Admin Panel — Referrers + Commissions HTML Tabs

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\admin.php` (HTML section)

- [ ] **Step 1: Add sidebar nav links**

Find (around line 290):
```php
            <a href="admin.php?table=testimonials" class="<?= $table === 'testimonials' ? 'active' : '' ?>">Testimonials</a>
            <a href="admin_logout.php">Logout</a>
```

Replace with:
```php
            <a href="admin.php?table=testimonials" class="<?= $table === 'testimonials' ? 'active' : '' ?>">Testimonials</a>
            <a href="admin.php?table=referrers" class="<?= $table === 'referrers' ? 'active' : '' ?>">Referrers</a>
            <a href="admin.php?table=commissions" class="<?= $table === 'commissions' ? 'active' : '' ?>">Commissions</a>
            <a href="admin_logout.php">Logout</a>
```

- [ ] **Step 2: Add Referrers tab HTML**

Find the first `<?php if ($table === 'packages'): ?>` line (around line 297). Insert immediately before it:

```php
            <?php if ($table === 'referrers'): ?>

                <!-- ====== ADD REFERRER FORM ====== -->
                <form method="post" action="admin.php?table=referrers&action=add" style="margin-bottom:24px;display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;">
                    <div>
                        <label style="display:block;font-size:0.72rem;color:#475569;margin-bottom:4px;">Name</label>
                        <input type="text" name="name" required placeholder="Budi Santoso" style="padding:7px 12px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.82rem;">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.72rem;color:#475569;margin-bottom:4px;">Phone (WhatsApp)</label>
                        <input type="text" name="phone" required placeholder="081234567890" style="padding:7px 12px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.82rem;">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.72rem;color:#475569;margin-bottom:4px;">Code</label>
                        <input type="text" name="code" required placeholder="BUDI10" maxlength="20" style="padding:7px 12px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.82rem;text-transform:uppercase;">
                    </div>
                    <div>
                        <label style="display:block;font-size:0.72rem;color:#475569;margin-bottom:4px;">Rate (%)</label>
                        <input type="number" name="commission_rate" value="10" min="0" max="100" step="0.01" style="padding:7px 12px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.82rem;width:80px;">
                    </div>
                    <button type="submit" class="button add" style="margin-bottom:0;">Add Referrer</button>
                </form>

                <!-- ====== REFERRERS TABLE ====== -->
                <?php if (empty($logs)): ?>
                    <p style="color:#475569;font-family:'JetBrains Mono',monospace;font-size:0.8rem;">No referrers yet.</p>
                <?php else: ?>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Code</th>
                                <th>Rate</th>
                                <th>Status</th>
                                <th>Total Earned (Paid)</th>
                                <th>Dashboard URL</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($logs as $row): ?>
                            <tr>
                                <td><?= htmlspecialchars($row['name']) ?></td>
                                <td>
                                    <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $row['phone']) ?>" target="_blank" style="color:#25d366;">
                                        <?= htmlspecialchars($row['phone']) ?>
                                    </a>
                                </td>
                                <td style="font-family:'JetBrains Mono',monospace;font-weight:600;color:#60a5fa;"><?= htmlspecialchars($row['code']) ?></td>
                                <td><?= number_format((float)$row['commission_rate'], 2) ?>%</td>
                                <td>
                                    <?php $active = $row['status'] === 'active'; ?>
                                    <span style="<?= $active ? 'background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);color:#4ade80;' : 'background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.30);color:#f87171;' ?>padding:3px 10px;border-radius:20px;font-size:0.72rem;font-family:'JetBrains Mono',monospace;font-weight:600;">
                                        <?= ucfirst($row['status']) ?>
                                    </span>
                                </td>
                                <td>Rp<?= number_format((float)$row['total_earned'], 0, ',', '.') ?></td>
                                <td style="font-size:0.72rem;">
                                    <?php
                                    $isLocalDev = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost','127.0.0.1']);
                                    $baseUrl = $isLocalDev ? 'http://localhost/Rielcode/referrer/' : 'https://rielcode.com/referrer/';
                                    $dashUrl = $baseUrl . '?code=' . urlencode($row['code']);
                                    ?>
                                    <a href="<?= htmlspecialchars($dashUrl) ?>" target="_blank" style="color:#60a5fa;"><?= htmlspecialchars($dashUrl) ?></a>
                                </td>
                                <td>
                                    <div class="table-actions">
                                        <a href="admin.php?table=referrers&action=toggle&id=<?= $row['id'] ?>"
                                           class="button edit" style="font-size:0.72rem;padding:5px 10px;">
                                            <?= $row['status'] === 'active' ? 'Deactivate' : 'Activate' ?>
                                        </a>
                                        <a href="admin.php?table=referrers&action=delete&id=<?= $row['id'] ?>"
                                           data-confirm="Delete this referrer? Only possible if they have no linked commissions."
                                           data-confirm-variant="danger"
                                           data-confirm-title="Delete referrer"
                                           data-confirm-label="Delete"
                                           class="button delete" style="font-size:0.72rem;padding:5px 10px;">Delete</a>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                <?php endif; ?>

            <?php elseif ($table === 'commissions'): ?>

                <!-- ====== COMMISSIONS FILTER ====== -->
                <form method="get" action="admin.php" style="margin-bottom:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;">
                    <input type="hidden" name="table" value="commissions">
                    <div>
                        <label style="display:block;font-size:0.72rem;color:#475569;margin-bottom:4px;">Referrer</label>
                        <select name="referrer_id" style="padding:7px 12px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.82rem;">
                            <option value="">All</option>
                            <?php foreach ($allReferrers as $ref): ?>
                                <option value="<?= $ref['id'] ?>" <?= $filterReferrerId === $ref['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($ref['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label style="display:block;font-size:0.72rem;color:#475569;margin-bottom:4px;">Status</label>
                        <select name="status" style="padding:7px 12px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.82rem;">
                            <option value="">All</option>
                            <option value="pending"   <?= $filterStatus === 'pending'   ? 'selected' : '' ?>>Pending</option>
                            <option value="paid"      <?= $filterStatus === 'paid'      ? 'selected' : '' ?>>Paid</option>
                            <option value="cancelled" <?= $filterStatus === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                        </select>
                    </div>
                    <button type="submit" class="button" style="margin-bottom:0;padding:7px 14px;">Filter</button>
                </form>

                <!-- ====== COMMISSIONS TABLE ====== -->
                <?php if (empty($logs)): ?>
                    <p style="color:#475569;font-family:'JetBrains Mono',monospace;font-size:0.8rem;">No commissions yet.</p>
                <?php else: ?>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Referrer</th>
                                <th>Invoice</th>
                                <th>Order Amount</th>
                                <th>Commission</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Paid At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($logs as $row): ?>
                            <?php
                            $comColors = [
                                'pending'   => 'background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.35);color:#fbbf24;',
                                'paid'      => 'background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);color:#4ade80;',
                                'cancelled' => 'background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.30);color:#f87171;',
                            ];
                            ?>
                            <tr>
                                <td><?= htmlspecialchars($row['referrer_name']) ?></td>
                                <td style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#60a5fa;"><?= htmlspecialchars($row['invoice_number'] ?? '—') ?></td>
                                <td>Rp<?= number_format((float)$row['order_amount'], 0, ',', '.') ?></td>
                                <td style="font-weight:600;color:#4ade80;">Rp<?= number_format((float)$row['commission_amount'], 0, ',', '.') ?></td>
                                <td>
                                    <span style="<?= $comColors[$row['status']] ?? '' ?>padding:3px 10px;border-radius:20px;font-size:0.72rem;font-family:'JetBrains Mono',monospace;font-weight:600;">
                                        <?= ucfirst($row['status']) ?>
                                    </span>
                                </td>
                                <td style="font-size:0.78rem;color:#475569;"><?= htmlspecialchars(substr($row['created_at'], 0, 16)) ?></td>
                                <td style="font-size:0.78rem;color:#475569;"><?= $row['paid_at'] ? htmlspecialchars(substr($row['paid_at'], 0, 16)) : '—' ?></td>
                                <td>
                                    <div class="table-actions">
                                        <?php if ($row['status'] === 'pending'): ?>
                                        <a href="admin.php?table=commissions&action=paid&id=<?= $row['id'] ?>"
                                           data-confirm="Mark this commission as paid?"
                                           data-confirm-title="Mark Paid"
                                           data-confirm-label="Mark Paid"
                                           class="button" style="font-size:0.72rem;padding:5px 10px;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);color:#4ade80;">Mark Paid</a>
                                        <a href="admin.php?table=commissions&action=cancel&id=<?= $row['id'] ?>"
                                           data-confirm="Cancel this commission?"
                                           data-confirm-variant="danger"
                                           data-confirm-title="Cancel commission"
                                           data-confirm-label="Cancel"
                                           class="button delete" style="font-size:0.72rem;padding:5px 10px;">Cancel</a>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                <?php endif; ?>

            <?php endif; ?>
```

- [ ] **Step 3: Verify admin tabs**

1. Open `http://localhost/Rielcode/admin.php` — confirm "Referrers" and "Commissions" appear in sidebar.
2. Click Referrers — confirm the Add Referrer form and table render without PHP errors.
3. Add a referrer (name: `Test Friend`, phone: `081234567890`, code: `TEST10`).
4. Confirm the new row appears with the dashboard URL.
5. Click Commissions — confirm the filter bar and table render (empty state is fine).
6. After placing a test order with `TEST10`, return to Commissions — confirm the row is there with status `pending`.
7. Click Mark Paid — confirm status flips to `paid` and `paid_at` timestamp appears.

- [ ] **Step 4: Commit**

```bash
git add admin.php
git commit -m "feat: add Referrers and Commissions tabs to admin panel"
```

---

## Task 5: Referrer Dashboard Page

**Files:**
- Create: `C:\xampp\htdocs\Rielcode\referrer\index.php`

This is a new folder. Uses **mysqli** (same `connection.php` as checkout since it's outside admin). Read-only — no writes.

- [ ] **Step 1: Create the referrer directory**

Verify the directory does not exist, then create it via file explorer or:
```
mkdir C:\xampp\htdocs\Rielcode\referrer
```

- [ ] **Step 2: Create referrer/index.php**

Create `C:\xampp\htdocs\Rielcode\referrer\index.php` with this full content:

```php
<?php
session_start();
require_once '../connection.php';

$code = trim($_GET['code'] ?? '');

$referrer = null;
if ($code !== '') {
    $stmt = $conn->prepare("SELECT id, name, code, commission_rate, status FROM referrers WHERE code = ? AND status = 'active'");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $referrer = $stmt->get_result()->fetch_assoc();
    $stmt->close();
}

if (!$referrer) {
    http_response_code(404);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Not Found | Rielcode</title>
        <link rel="stylesheet" href="../CSS/redesign.css">
        <meta name="robots" content="noindex, nofollow">
    </head>
    <body class="rc-redesign" style="display:flex;align-items:center;justify-content:center;min-height:100vh;">
        <div style="text-align:center;padding:40px;">
            <h1 style="color:#f87171;font-size:2rem;margin-bottom:12px;">Invalid Code</h1>
            <p style="color:rgba(255,255,255,0.5);">This referral code is not valid or has been deactivated.</p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Fetch summary stats
$stmt = $conn->prepare(
    "SELECT
        COUNT(*) AS total_referrals,
        COALESCE(SUM(CASE WHEN status='paid' THEN commission_amount ELSE 0 END), 0) AS total_earned,
        COALESCE(SUM(CASE WHEN status='pending' THEN commission_amount ELSE 0 END), 0) AS total_pending
     FROM referral_commissions
     WHERE referrer_id = ?"
);
$stmt->bind_param("i", $referrer['id']);
$stmt->execute();
$stats = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Fetch commission rows
$stmt = $conn->prepare(
    "SELECT rc.commission_amount, rc.order_amount, rc.status, rc.created_at,
            o.package AS package_name, o.invoice_number
     FROM referral_commissions rc
     JOIN orders o ON o.id = rc.order_id
     WHERE rc.referrer_id = ?
     ORDER BY rc.created_at DESC"
);
$stmt->bind_param("i", $referrer['id']);
$stmt->execute();
$commissions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referrer Dashboard | Rielcode</title>
    <link rel="stylesheet" href="../CSS/redesign.css">
    <link rel="icon" type="image/png" sizes="32x32" href="../IMG/Rielcode Logo Square Transparent Icon.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <meta name="robots" content="noindex, nofollow">
    <style>
        .ref-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; }
        .ref-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .ref-stat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px 20px; }
        .ref-stat__label { font-size: 0.72rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .ref-stat__value { font-size: 1.4rem; font-weight: 700; color: #fff; }
        .ref-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .ref-table th { text-align: left; padding: 10px 14px; color: rgba(255,255,255,0.4); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ref-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
        .badge--pending   { background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.35); color: #fbbf24; }
        .badge--paid      { background: rgba(34,197,94,0.12);  border: 1px solid rgba(34,197,94,0.35);  color: #4ade80; }
        .badge--cancelled { background: rgba(239,68,68,0.10);  border: 1px solid rgba(239,68,68,0.30);  color: #f87171; }
    </style>
</head>
<body class="rc-redesign">
    <div style="max-width:860px;margin:0 auto;padding:40px 20px;">

        <div style="margin-bottom:32px;display:flex;align-items:center;gap:16px;">
            <img src="../IMG/Rielcode Logo Transparent.png" alt="Rielcode" style="height:36px;">
        </div>

        <div class="ref-card" style="margin-bottom:28px;">
            <p style="font-size:0.72rem;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Referrer Dashboard</p>
            <h1 style="font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:4px;"><?= htmlspecialchars($referrer['name']) ?></h1>
            <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;">
                Code: <span style="font-family:monospace;font-weight:600;color:#60a5fa;"><?= htmlspecialchars($referrer['code']) ?></span>
                &nbsp;&middot;&nbsp;
                Commission rate: <span style="color:#4ade80;"><?= number_format((float)$referrer['commission_rate'], 2) ?>%</span>
            </p>
        </div>

        <div class="ref-stat-grid">
            <div class="ref-stat">
                <div class="ref-stat__label">Total Referrals</div>
                <div class="ref-stat__value"><?= (int)$stats['total_referrals'] ?></div>
            </div>
            <div class="ref-stat">
                <div class="ref-stat__label">Commission Earned</div>
                <div class="ref-stat__value" style="color:#4ade80;">Rp<?= number_format((float)$stats['total_earned'], 0, ',', '.') ?></div>
            </div>
            <div class="ref-stat">
                <div class="ref-stat__label">Pending Payout</div>
                <div class="ref-stat__value" style="color:#fbbf24;">Rp<?= number_format((float)$stats['total_pending'], 0, ',', '.') ?></div>
            </div>
        </div>

        <h2 style="font-size:1rem;font-weight:600;color:rgba(255,255,255,0.7);margin-bottom:16px;">Commission History</h2>

        <?php if (empty($commissions)): ?>
            <p style="color:rgba(255,255,255,0.3);font-size:0.85rem;">No commissions yet. Share your referral code to get started.</p>
        <?php else: ?>
        <div style="overflow-x:auto;">
            <table class="ref-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Package</th>
                        <th>Order Amount</th>
                        <th>Commission</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($commissions as $com): ?>
                    <tr>
                        <td style="color:rgba(255,255,255,0.5);font-size:0.78rem;"><?= htmlspecialchars(substr($com['created_at'], 0, 10)) ?></td>
                        <td><?= htmlspecialchars($com['package_name']) ?></td>
                        <td>Rp<?= number_format((float)$com['order_amount'], 0, ',', '.') ?></td>
                        <td style="font-weight:600;color:#4ade80;">Rp<?= number_format((float)$com['commission_amount'], 0, ',', '.') ?></td>
                        <td><span class="badge badge--<?= htmlspecialchars($com['status']) ?>"><?= ucfirst($com['status']) ?></span></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>

        <p style="margin-top:40px;font-size:0.72rem;color:rgba(255,255,255,0.2);text-align:center;">
            This dashboard is read-only. Contact Rielcode for any questions about your commissions.
        </p>
    </div>
</body>
</html>
```

- [ ] **Step 3: Verify the dashboard**

1. Open `http://localhost/Rielcode/referrer/?code=TEST10` — confirm dashboard loads with the referrer's name, stats, and commission history.
2. Open `http://localhost/Rielcode/referrer/?code=DOESNOTEXIST` — confirm 404-style error message appears.
3. Open `http://localhost/Rielcode/referrer/` (no code param) — confirm same 404-style message.

- [ ] **Step 4: Commit**

```bash
git add referrer/index.php
git commit -m "feat: add public referrer dashboard at /referrer/?code=XXX"
```

---

## Task 6: End-to-End Verification

Follow the spec's verification checklist exactly:

- [ ] `referrers`, `referral_commissions` tables exist; `orders.referral_code` column present
- [ ] `/order-form/` → checkout: referral code field is visible
- [ ] Invalid code at checkout: inline error shown, order still completes, no `referral_commissions` row, `orders.referral_code = NULL`
- [ ] Add referrer via Referrers tab, complete checkout with their code: commission row in Commissions tab with status `pending`
- [ ] Mark commission as paid: status = `paid`, `paid_at` timestamp recorded
- [ ] `/referrer/?code=BUDI10`: dashboard shows correct stats and commission list
- [ ] `/referrer/?code=INVALID`: 404-style message shown

- [ ] **Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "feat: referral system complete — DB, checkout, admin tabs, referrer dashboard"
```
