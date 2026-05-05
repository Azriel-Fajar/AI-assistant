# Rielcode Main Site Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add new package plans, testimonials section, and fix order form to send notifications instead of generating invoices.

**Architecture:** Extend existing PHP procedural codebase at `C:\xampp\htdocs\Rielcode\`. All changes follow existing patterns: standalone PHP files, mysqli, Bootstrap 5, PHPMailer for email. No new dependencies.

**Tech Stack:** PHP 8+, MySQL/mysqli, Bootstrap 5.3, PHPMailer, vanilla JS

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `C:\xampp\htdocs\Rielcode\package.php` | Modify | Add 3 new package cards |
| `C:\xampp\htdocs\Rielcode\index.php` | Modify | Add testimonials section |
| `C:\xampp\htdocs\Rielcode\CSS\testimonials.css` | Create | Testimonials styles |
| `C:\xampp\htdocs\Rielcode\order-form\index.php` | Modify | Remove checkout redirect, add email notification |
| `C:\xampp\htdocs\Rielcode\order-form\success.php` | Create | "We'll be in touch" confirmation page |
| `C:\xampp\htdocs\Rielcode\admin.php` | Modify | Add testimonials management tab |

---

## Task 1: Create `testimonials` DB table

**Files:**
- Run SQL directly in phpMyAdmin or MySQL CLI

- [ ] **Step 1: Open phpMyAdmin at `http://localhost/phpmyadmin`**, select your Rielcode DB, open SQL tab

- [ ] **Step 2: Run this SQL**

```sql
CREATE TABLE IF NOT EXISTS testimonials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_name VARCHAR(100) NOT NULL,
  company VARCHAR(100) DEFAULT NULL,
  message TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  avatar_url VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO testimonials (client_name, company, message, rating) VALUES
('Client Name', 'Company Inc.', 'Placeholder testimonial. Real content coming soon.', 5),
('Client Name', 'Startup Co.', 'Placeholder testimonial. Real content coming soon.', 5),
('Client Name', 'Agency Ltd.', 'Placeholder testimonial. Real content coming soon.', 5);
```

- [ ] **Step 3: Verify table exists**

Open `http://localhost/phpmyadmin`, confirm `testimonials` table appears with 3 rows.

- [ ] **Step 4: Commit**

```bash
cd C:\xampp\htdocs\Rielcode
git add -A
git commit -m "feat: add testimonials table with placeholder data"
```

---

## Task 2: Add testimonials CSS

**Files:**
- Create: `C:\xampp\htdocs\Rielcode\CSS\testimonials.css`

- [ ] **Step 1: Create `CSS/testimonials.css`**

```css
.testimonials-section {
    padding: 80px 0;
    background: #111315;
}

.testimonials-section .section-label {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #3a7bff;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 12px;
}

.testimonials-section h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
}

.testimonials-section .section-sub {
    color: rgba(255,255,255,0.5);
    margin-bottom: 48px;
    font-size: 1rem;
}

.testimonial-card {
    background: #1a1d20;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 28px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: border-color 0.2s;
}

.testimonial-card:hover {
    border-color: rgba(58,123,255,0.3);
}

.testimonial-stars {
    color: #f5c518;
    font-size: 14px;
    letter-spacing: 2px;
}

.testimonial-message {
    color: rgba(255,255,255,0.75);
    font-size: 0.95rem;
    line-height: 1.7;
    flex: 1;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
}

.testimonial-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3a7bff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #fff;
    font-size: 14px;
    flex-shrink: 0;
    overflow: hidden;
}

.testimonial-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.testimonial-name {
    font-weight: 600;
    color: #fff;
    font-size: 0.9rem;
}

.testimonial-company {
    color: rgba(255,255,255,0.4);
    font-size: 0.8rem;
}
```

- [ ] **Step 2: Commit**

```bash
git add CSS/testimonials.css
git commit -m "feat: add testimonials CSS"
```

---

## Task 3: Add testimonials section to index.php

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\index.php`

- [ ] **Step 1: Open `index.php`, find the `<head>` section where CSS files are linked. Add the testimonials stylesheet after existing CSS links**

```html
<link rel="stylesheet" href="CSS/testimonials.css">
```

- [ ] **Step 2: Find where Projects section ends and Requirements section begins. Add this testimonials section between them**

```php
<!-- TESTIMONIALS -->
<?php
$testimonialsResult = $conn->query("SELECT * FROM testimonials ORDER BY created_at DESC");
$testimonials = [];
while ($row = $testimonialsResult->fetch_assoc()) {
    $testimonials[] = $row;
}
?>
<section class="testimonials-section" id="testimonials">
    <div class="container">
        <div class="text-center mb-5">
            <p class="section-label">// what clients say</p>
            <h2>Client Testimonials</h2>
            <p class="section-sub">Real feedback from real projects.</p>
        </div>
        <div class="row g-4">
            <?php foreach ($testimonials as $t): ?>
            <div class="col-md-4">
                <div class="testimonial-card">
                    <div class="testimonial-stars">
                        <?php echo str_repeat('★', (int)$t['rating']) . str_repeat('☆', 5 - (int)$t['rating']); ?>
                    </div>
                    <p class="testimonial-message">"<?php echo htmlspecialchars($t['message']); ?>"</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">
                            <?php if ($t['avatar_url']): ?>
                                <img src="<?php echo htmlspecialchars($t['avatar_url']); ?>" alt="">
                            <?php else: ?>
                                <?php echo strtoupper(substr($t['client_name'], 0, 1)); ?>
                            <?php endif; ?>
                        </div>
                        <div>
                            <div class="testimonial-name"><?php echo htmlspecialchars($t['client_name']); ?></div>
                            <?php if ($t['company']): ?>
                            <div class="testimonial-company"><?php echo htmlspecialchars($t['company']); ?></div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
```

- [ ] **Step 3: Open `http://localhost/Rielcode/` in browser. Verify testimonials section renders with 3 placeholder cards.**

- [ ] **Step 4: Commit**

```bash
git add index.php
git commit -m "feat: add testimonials section to homepage"
```

---

## Task 4: Add new packages to DB

**Files:**
- Run SQL in phpMyAdmin

- [ ] **Step 1: Check existing packages table structure**

Run in phpMyAdmin SQL tab:
```sql
DESCRIBE packages;
SELECT * FROM packages;
```

Note the columns and existing rows.

- [ ] **Step 2: Insert new packages**

Adjust `idr_price` and `usd_price` columns to match your existing schema. Run:

```sql
INSERT INTO packages (package_name, description, idr_price, orders) VALUES
('Landing Page', 'Single conversion-focused page. Fast, clean, built to convert visitors.', 999000, 0),
('Copy Website', 'Clone your existing website design with new content and branding.', 1499000, 0),
('E-commerce', 'Full online store with product catalog, cart, and checkout.', 3999000, 0);
```

- [ ] **Step 3: Verify in phpMyAdmin** -- confirm 3 new rows appear in `packages` table.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Landing Page, Copy Website, E-commerce packages to DB"
```

---

## Task 5: Add new package cards to package.php

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\package.php`

- [ ] **Step 1: Open `package.php`. Find the closing `</div>` of the last existing package card (Premium Plan) before the Custom Plan card. Insert these three new cards after Premium and before Custom:**

```html
<!-- Landing Page Plan -->
<div>
    <div class="pricing-card h-full flex flex-col landing-page">
        <div class="flex-1">
            <h3>Landing Page</h3>
            <div class="pricing-price">
                <span class="new-price">IDR 999k</span>
            </div>
            <ul class="pricing-list">
                <li>Single conversion-focused page</li>
                <li>Responsive design</li>
                <li>Hero, features, CTA sections</li>
                <li>Contact form integration</li>
                <li><b>Basic</b>&nbsp;SEO setup</li>
                <li><b>2x</b>&nbsp;revisions</li>
            </ul>
            <div class="package-note">
                Built to convert visitors. No domain or hosting included.
            </div>
        </div>
        <p><strong>Delivery:</strong> 3–5 days</p>
        <a href="order-form?aksi=landingpage" class="btn btn-glow mt-4">Choose Plan</a>
    </div>
</div>

<!-- Copy Website Plan -->
<div>
    <div class="pricing-card h-full flex flex-col copy-website">
        <div class="flex-1">
            <h3>Copy Website</h3>
            <div class="pricing-price">
                <span class="new-price">IDR 1.5jt</span>
            </div>
            <ul class="pricing-list">
                <li>Clone existing website design</li>
                <li>New content & branding applied</li>
                <li>Responsive layout</li>
                <li>Up to 5 pages</li>
                <li><b>Basic</b>&nbsp;SEO setup</li>
                <li><b>2x</b>&nbsp;revisions</li>
            </ul>
            <div class="package-note">
                Have a design you love? We rebuild it as yours.
            </div>
        </div>
        <p><strong>Delivery:</strong> 5–7 days</p>
        <a href="order-form?aksi=copywebsite" class="btn btn-glow mt-4">Choose Plan</a>
    </div>
</div>

<!-- E-commerce Plan -->
<div>
    <div class="pricing-card h-full flex flex-col ecommerce">
        <div class="flex-1">
            <h3>E-commerce</h3>
            <div class="pricing-price">
                <span class="new-price">IDR 3.9jt</span>
            </div>
            <ul class="pricing-list">
                <li>Full online store</li>
                <li>Product catalog & search</li>
                <li>Cart & checkout flow</li>
                <li>Payment gateway integration</li>
                <li><b>Advanced</b>&nbsp;SEO setup</li>
                <li>Admin product management</li>
                <li><b>3x</b>&nbsp;revisions</li>
            </ul>
            <div class="package-note">
                Complete e-commerce solution. Domain & hosting recommended.
            </div>
        </div>
        <p><strong>Delivery:</strong> 14–21 days</p>
        <a href="order-form?aksi=ecommerce" class="btn btn-glow mt-4">Choose Plan</a>
    </div>
</div>
```

- [ ] **Step 2: Open `http://localhost/Rielcode/package` in browser. Verify 3 new cards appear.**

- [ ] **Step 3: Commit**

```bash
git add package.php
git commit -m "feat: add Landing Page, Copy Website, E-commerce package cards"
```

---

## Task 6: Register new package URL params in order-form

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\order-form\index.php`

- [ ] **Step 1: Find the `$aksiMap` array at the top of `order-form/index.php` (around line 6). Update it:**

```php
$aksiMap = [
    'landing'      => 'Student Plan',
    'starter'      => 'Starter Plan',
    'pro'          => 'Pro Plan',
    'business'     => 'Premium Plan',
    'custom'       => 'Custom Plan',
    'landingpage'  => 'Landing Page',
    'copywebsite'  => 'Copy Website',
    'ecommerce'    => 'E-commerce',
];
```

- [ ] **Step 2: Open `http://localhost/Rielcode/order-form?aksi=landingpage` in browser. Verify "Landing Page" is pre-selected in the plan dropdown.**

- [ ] **Step 3: Repeat for `?aksi=copywebsite` and `?aksi=ecommerce`.**

- [ ] **Step 4: Commit**

```bash
git add order-form/index.php
git commit -m "feat: register new package URL params in order form"
```

---

## Task 7: Create order confirmation success page

**Files:**
- Create: `C:\xampp\htdocs\Rielcode\order-form\success.php`

- [ ] **Step 1: Create `order-form/success.php`**

```php
<?php
session_start();
// If no recent order in session, redirect to order form
if (!isset($_SESSION['order_success'])) {
    header('Location: ../order-form/');
    exit;
}
$orderName = htmlspecialchars($_SESSION['order_success_name'] ?? 'there');
unset($_SESSION['order_success'], $_SESSION['order_success_name']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Received | Rielcode</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/png" sizes="32x32" href="../IMG/Rielcode Logo Square Transparent Icon.png">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #111315;
            color: #fff;
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 24px;
        }
        .success-box {
            max-width: 520px;
        }
        .success-icon {
            width: 72px;
            height: 72px;
            background: rgba(58,123,255,0.15);
            border: 2px solid #3a7bff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 28px;
        }
        .label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #3a7bff;
            margin-bottom: 12px;
        }
        h1 {
            font-family: 'Syne', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 16px;
        }
        p {
            color: rgba(255,255,255,0.6);
            line-height: 1.7;
            margin-bottom: 12px;
        }
        .btn-home {
            display: inline-block;
            margin-top: 28px;
            padding: 12px 28px;
            background: #3a7bff;
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: background 0.2s;
        }
        .btn-home:hover { background: #2563eb; color: #fff; }
    </style>
</head>
<body>
    <div class="success-box">
        <div class="success-icon">&#10003;</div>
        <p class="label">// order received</p>
        <h1>We'll be in touch, <?php echo $orderName; ?>.</h1>
        <p>Your project details have been sent to us. We'll review your requirements and reach out within 1 business day.</p>
        <p>Check your email for a confirmation copy.</p>
        <a href="../" class="btn-home">Back to Home</a>
    </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add order-form/success.php
git commit -m "feat: add order success/confirmation page"
```

---

## Task 8: Rewrite order form submit logic

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\order-form\index.php`

- [ ] **Step 1: Open `order-form/index.php`. Add PHPMailer includes at the top, after `include '../connection.php';`:**

```php
require_once '../PHPMailer/src/PHPMailer.php';
require_once '../PHPMailer/src/SMTP.php';
require_once '../PHPMailer/src/Exception.php';
require_once '../smtp_config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;
```

- [ ] **Step 2: Find the block after `$stmt->execute();` and `$_SESSION['transaction'] = $conn->insert_id;` (around line 93). Replace everything from the Custom Plan session block through `header("Location: ../checkout/");` with:**

```php
$orderId = $conn->insert_id;
$stmt->close();

// Store custom plan total in session (still needed for admin display)
if ($package === 'Custom Plan') {
    $_SESSION['custom_total'] = max(1000000, (int)($_POST['custom_total'] ?? 1000000));
} else {
    unset($_SESSION['custom_total']);
}

// Save add-ons to session
$selectedAddonIds = [];
$addonQty = [];
foreach ($availableAddons as $addon) {
    $key = 'addon_' . $addon['id'];
    if (isset($_POST[$key])) {
        $selectedAddonIds[] = (int)$addon['id'];
        if ($addon['type'] === 'per_page' || $addon['type'] === 'monthly') {
            $addonQty[$addon['id']] = max(1, (int)($_POST['addon_qty_' . $addon['id']] ?? 1));
        }
    }
}
$_SESSION['selected_addons'] = $selectedAddonIds;
$_SESSION['addon_qty'] = $addonQty;

// --- Send confirmation email to client ---
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = $SMTP_USER;
    $mail->Password   = $SMTP_PASS;
    $mail->SMTPSecure = $SMTP_SECURE;
    $mail->Port       = $SMTP_PORT;
    $mail->setFrom($SMTP_USER, 'Rielcode');
    $mail->addAddress($email, $order_name);
    $mail->isHTML(true);
    $mail->Subject = 'Order Received - Rielcode';
    $mail->Body = '
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#111315;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#3a7bff;margin-bottom:8px;">Order Received</h2>
            <p style="color:rgba(255,255,255,0.7);">Hi ' . htmlspecialchars($order_name) . ',</p>
            <p style="color:rgba(255,255,255,0.7);">We received your project request for <strong style="color:#fff;">' . htmlspecialchars($package) . '</strong>. We\'ll review your requirements and reach out within 1 business day.</p>
            <hr style="border-color:rgba(255,255,255,0.1);margin:24px 0;">
            <p style="color:rgba(255,255,255,0.5);font-size:13px;">If you have questions, reply to this email or message us on WhatsApp.</p>
            <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:8px;">— Rielcode</p>
        </div>
    ';
    $mail->send();
} catch (MailException $e) {
    // Log but don't block the user
    error_log('Client confirmation email failed: ' . $mail->ErrorInfo);
}

// --- Send notification email to Azriel ---
$mail2 = new PHPMailer(true);
try {
    $mail2->isSMTP();
    $mail2->Host       = $SMTP_HOST;
    $mail2->SMTPAuth   = true;
    $mail2->Username   = $SMTP_USER;
    $mail2->Password   = $SMTP_PASS;
    $mail2->SMTPSecure = $SMTP_SECURE;
    $mail2->Port       = $SMTP_PORT;
    $mail2->setFrom($SMTP_USER, 'Rielcode Orders');
    $mail2->addAddress('afw1407@gmail.com', 'Azriel');
    $mail2->isHTML(true);
    $mail2->Subject = '[New Order] ' . htmlspecialchars($package) . ' - ' . htmlspecialchars($order_name);
    $mail2->Body = '
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
            <h2 style="color:#3a7bff;">New Order Received</h2>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;"><strong>' . htmlspecialchars($order_name) . '</strong></td></tr>
                <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">' . htmlspecialchars($email) . '</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">' . htmlspecialchars($phone_number) . '</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Package</td><td style="padding:8px 0;"><strong>' . htmlspecialchars($package) . '</strong></td></tr>
                <tr><td style="padding:8px 0;color:#666;">Domain</td><td style="padding:8px 0;">' . htmlspecialchars($domain) . '</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Hosting</td><td style="padding:8px 0;">' . htmlspecialchars($hosting) . '</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Description</td><td style="padding:8px 0;">' . nl2br(htmlspecialchars($description)) . '</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Order ID</td><td style="padding:8px 0;">#' . $orderId . '</td></tr>
            </table>
            <p style="margin-top:16px;"><a href="https://rielcode.com/admin" style="color:#3a7bff;">View in Admin Panel</a></p>
        </div>
    ';
    $mail2->send();
} catch (MailException $e) {
    error_log('Azriel notification email failed: ' . $mail2->ErrorInfo);
}

// --- Redirect to success page ---
$_SESSION['order_success'] = true;
$_SESSION['order_success_name'] = $order_name;
unset($_SESSION['transaction']);
header('Location: ../order-form/success.php');
exit;
```

- [ ] **Step 3: Test -- open `http://localhost/Rielcode/order-form/`, fill in the form, submit. Verify:**
  - Redirects to `success.php` with name displayed
  - No invoice generated
  - Check Gmail for notification email
  - Order appears in admin panel

- [ ] **Step 4: Commit**

```bash
git add order-form/index.php
git commit -m "feat: replace checkout redirect with email notification + success page"
```

---

## Task 9: Add testimonials management to admin panel

**Files:**
- Modify: `C:\xampp\htdocs\Rielcode\admin.php`

- [ ] **Step 1: Open `admin.php`. Find where DB queries are made at the top. Add testimonials query after existing queries:**

```php
// Testimonials
$testimonialsAll = $conn->query("SELECT * FROM testimonials ORDER BY created_at DESC");
$allTestimonials = [];
while ($row = $testimonialsAll->fetch_assoc()) {
    $allTestimonials[] = $row;
}

// Handle testimonial actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['testimonial_action'])) {
    $action = $_POST['testimonial_action'];

    if ($action === 'add') {
        $tn = trim($_POST['t_name'] ?? '');
        $tc = trim($_POST['t_company'] ?? '');
        $tm = trim($_POST['t_message'] ?? '');
        $tr = max(1, min(5, (int)($_POST['t_rating'] ?? 5)));
        $ta = trim($_POST['t_avatar'] ?? '');
        if ($tn && $tm) {
            $s = $conn->prepare("INSERT INTO testimonials (client_name, company, message, rating, avatar_url) VALUES (?,?,?,?,?)");
            $s->bind_param("sssds", $tn, $tc, $tm, $tr, $ta);
            $s->execute();
            $s->close();
        }
    } elseif ($action === 'delete') {
        $tid = (int)($_POST['t_id'] ?? 0);
        if ($tid > 0) {
            $s = $conn->prepare("DELETE FROM testimonials WHERE id = ?");
            $s->bind_param("i", $tid);
            $s->execute();
            $s->close();
        }
    }
    header('Location: admin.php#testimonials');
    exit;
}
```

- [ ] **Step 2: Find the tab navigation in `admin.php` (look for `<ul class="nav nav-tabs"` or similar). Add a Testimonials tab:**

```html
<li class="nav-item">
    <a class="nav-link" href="#testimonials" data-bs-toggle="tab">Testimonials</a>
</li>
```

- [ ] **Step 3: Find the tab content area. Add testimonials tab panel:**

```html
<div class="tab-pane fade" id="testimonials">
    <h5 class="mb-3">Add Testimonial</h5>
    <form method="POST">
        <input type="hidden" name="testimonial_action" value="add">
        <div class="row g-2 mb-3">
            <div class="col-md-4">
                <input type="text" name="t_name" class="form-control" placeholder="Client Name" required>
            </div>
            <div class="col-md-4">
                <input type="text" name="t_company" class="form-control" placeholder="Company (optional)">
            </div>
            <div class="col-md-2">
                <select name="t_rating" class="form-control">
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                </select>
            </div>
            <div class="col-md-2">
                <input type="text" name="t_avatar" class="form-control" placeholder="Avatar URL (optional)">
            </div>
        </div>
        <div class="mb-3">
            <textarea name="t_message" class="form-control" rows="3" placeholder="Testimonial message" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Add Testimonial</button>
    </form>

    <hr class="my-4">

    <h5 class="mb-3">Existing Testimonials</h5>
    <table class="table table-dark table-bordered">
        <thead>
            <tr><th>Name</th><th>Company</th><th>Rating</th><th>Message</th><th>Action</th></tr>
        </thead>
        <tbody>
            <?php foreach ($allTestimonials as $t): ?>
            <tr>
                <td><?php echo htmlspecialchars($t['client_name']); ?></td>
                <td><?php echo htmlspecialchars($t['company'] ?? '-'); ?></td>
                <td><?php echo $t['rating']; ?>/5</td>
                <td><?php echo htmlspecialchars(substr($t['message'], 0, 80)) . '...'; ?></td>
                <td>
                    <form method="POST" onsubmit="return confirm('Delete this testimonial?')">
                        <input type="hidden" name="testimonial_action" value="delete">
                        <input type="hidden" name="t_id" value="<?php echo $t['id']; ?>">
                        <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
```

- [ ] **Step 4: Open `http://localhost/Rielcode/admin.php`, click Testimonials tab. Verify:**
  - Add form works (submit, reload, new row appears)
  - Delete works
  - Homepage shows updated testimonials

- [ ] **Step 5: Commit**

```bash
git add admin.php
git commit -m "feat: add testimonials management to admin panel"
```

---

## Task 10: Push to production

- [ ] **Step 1: Run git push**

```bash
git push origin main
```

- [ ] **Step 2: SSH/cPanel into production server. Pull latest:**

```bash
git pull origin main
```

- [ ] **Step 3: Run the DB migration SQL on production DB via phpMyAdmin on cPanel**

(Same SQL from Task 1 and Task 4)

- [ ] **Step 4: Verify `https://rielcode.com/` shows testimonials section and new package cards.**

- [ ] **Step 5: Submit a test order on production. Verify email notification arrives at `afw1407@gmail.com`.**
