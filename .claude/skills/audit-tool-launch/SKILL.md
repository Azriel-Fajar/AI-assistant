# /audit-tool-launch

**Purpose:** Guided build of the public rielcode.com/audit tool — PHP form, Playwright scraper, email capture, score logic, PDF delivery.

**Usage:** `/audit-tool-launch [phase]`
- No arg: start from Phase 1 or resume from last checkpoint
- `phase1` — UI + form + email capture (manual audit)
- `phase2` — Playwright scraper + score logic
- `phase3` — PDF email delivery + tracking

---

## What this skill does

Builds the Free Website Audit Tool in 3 phases, one at a time. Each phase ends with a working deliverable you can test before moving to the next.

**Target URL:** rielcode.com/audit
**Stack:** PHP (existing site), Node.js + Playwright (existing install), MySQL, Mailchimp or Brevo, FPDF or similar for PDF

---

## Phase 1: UI + Form + Email Capture

**Goal:** Working page at `/audit` — URL input, email field, submit stores lead, shows basic result.

### Steps

1. Confirm PHP site path (C:\xampp\htdocs\rielcode\ or similar) — ask if not known
2. Create `audit/index.php`:
   - Branded header (match rielcode.com)
   - Form: URL input + email input + submit button
   - After submit: show "Generating your audit..." message
   - Store submission to MySQL table `audit_leads` (url, email, timestamp, audit_id UUID)
3. Create MySQL table:
   ```sql
   CREATE TABLE audit_leads (
     id INT AUTO_INCREMENT PRIMARY KEY,
     audit_id VARCHAR(36) NOT NULL,
     url VARCHAR(500) NOT NULL,
     email VARCHAR(255) NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     status ENUM('pending','complete') DEFAULT 'pending'
   );
   ```
4. On submit, show public result page (`audit/result.php?id=[audit_id]`):
   - Placeholder score: "Your audit is being prepared"
   - 3 generic tips (hard-coded for Phase 1)
   - CTA: "Full report sent to [email] within 24 hours — DM us your audit ID: [id]"
5. Test: submit a URL, confirm DB row created, confirm result page loads

**Phase 1 deliverable:** Live form that captures leads. Audit is manual (you run `/site-review` separately and email manually).

---

## Phase 2: Playwright Scraper + Score Logic

**Goal:** Automated audit runs on submit. Score calculated. Result page shows real data.

### Score dimensions (0-100 total)

| Check | Points |
|---|---|
| Mobile responsive (viewport meta) | 15 |
| Page title present + >10 chars | 10 |
| Meta description present | 10 |
| H1 present | 10 |
| Images have alt text (>50%) | 10 |
| Load time <3s | 15 |
| SSL (https) | 10 |
| Contact method visible (phone/email/form) | 10 |
| CTA button present | 10 |

### Steps

1. Create `audit/scripts/run-audit.js` (Node.js + Playwright):
   - Accept URL as arg
   - Run all 9 checks
   - Output JSON: `{ score: 72, checks: { mobile: true, title: true, ... }, load_time_ms: 1200 }`
2. Create PHP trigger (`audit/process.php`):
   - Called after form submit
   - Runs `node audit/scripts/run-audit.js [url]` via `shell_exec`
   - Parses JSON output
   - Stores score + check results in DB (add columns to `audit_leads`)
   - Redirects to result page with real data
3. Update `result.php`:
   - Show real score (0-100) with color band (0-49 red, 50-74 yellow, 75+ green)
   - Show 3 failing checks as "Top Issues Found"
   - Full check table in collapsed section
   - CTA: "Get a real fix — DM us your audit ID or email us"
4. Test on 3 different URLs: one bad site, one decent, one good

**Phase 2 deliverable:** Real automated audit. Score + top 3 issues visible on page instantly.

---

## Phase 3: PDF Email Delivery + Tracking

**Goal:** Full report emailed as PDF within seconds of submission.

### Steps

1. Install FPDF (PHP PDF library) or use mPDF — check what's easiest for existing stack
2. Create `audit/generate-pdf.php`:
   - Pulls audit data from DB by audit_id
   - Generates branded PDF:
     - Page 1: Score + summary + Rielcode logo
     - Page 2: Full check breakdown (9 items, pass/fail + what it means)
     - Page 3: 5 upgrade suggestions (tailored to failing checks) + package match
     - Page 4: CTA — "Book a free 15-min call" or "DM on WhatsApp: [link]"
3. Set up email delivery:
   - Option A (Mailchimp): Create campaign template, trigger via API after audit
   - Option B (Brevo): Transactional email API — simpler, recommended
   - Send PDF as attachment, subject: "Your Website Audit is Ready — [score]/100"
4. Add UTM tracking to all links in email (`?utm_source=audit-tool&utm_medium=email`)
5. Add audit count to homepage (`/audit` link: "X sites audited so far")
6. Test full flow: submit → audit runs → PDF generates → email arrives

**Phase 3 deliverable:** Fully automated lead gen machine. Submit URL → get PDF report in inbox → Rielcode CTA inside.

---

## After launch

- Post 3 YT Shorts: "I audited your website for free" demoing the tool
- Add link in YT bio + IG bio
- Tag in YT description of every future video
- First 50 audits: manually follow up via email with personalized 1-line note
- Track: audit_leads table. Monthly: check how many became WhatsApp contacts or inquiries

---

## Rollout timing (from growth plan)

- Phase 1: Week 3 (Jun 1-7)
- Phase 2-3: Week 4 (Jun 8-14)
- Soft launch: Jun 15 (Week 5)
