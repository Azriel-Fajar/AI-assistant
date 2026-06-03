const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost/rielcode/audit/';
const SCREENSHOTS_DIR = path.join(__dirname, '../../screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const results = [];

function log(label, status, detail = '') {
  const entry = { label, status, detail };
  results.push(entry);
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${label}] ${detail}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // ── 1. Initial load ──────────────────────────────────────────────
  const t0 = Date.now();
  const res = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
  const loadMs = Date.now() - t0;
  log('page-load', res.status() === 200 ? 'PASS' : 'FAIL', `HTTP ${res.status()} in ${loadMs}ms`);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-form.png') });
  log('screenshot-form', 'INFO', 'audit-form.png saved');

  // ── 2. Inspect form fields ────────────────────────────────────────
  const fields = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input, textarea, select')];
    return inputs.map(el => ({ tag: el.tagName, type: el.type || '', name: el.name || el.id || '', required: el.required }));
  });
  log('form-fields', 'INFO', JSON.stringify(fields));

  // ── 3. Submit empty form (validation check) ───────────────────────
  const submitBtn = await page.$('button[type=submit], input[type=submit], button:has-text("Audit"), button:has-text("Submit"), button:has-text("Analyze"), button:has-text("Check")');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(1000);
    const validationMsg = await page.evaluate(() => {
      const invalid = document.querySelector(':invalid');
      return invalid ? invalid.validationMessage : null;
    });
    log('empty-submit-validation', validationMsg ? 'PASS' : 'WARN', validationMsg || 'No HTML5 validation triggered');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-form-empty-submit.png') });
  } else {
    log('submit-btn-find', 'WARN', 'Could not find submit button');
  }

  // ── 4. Fill form with valid URL ───────────────────────────────────
  const urlInput = await page.$('input[type=url], input[name*=url], input[placeholder*=url], input[placeholder*=URL], input[placeholder*=website], input[placeholder*=Website]');
  if (urlInput) {
    await urlInput.fill('https://example.com');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-input-filled.png') });
    log('fill-valid-url', 'PASS', 'Filled https://example.com');

    // Submit and wait for result
    if (submitBtn) {
      const t1 = Date.now();
      await submitBtn.click();
      try {
        await page.waitForSelector('.result, .score, .report, #result, #report, .audit-result, [class*=result], [class*=score], [id*=result]', { timeout: 30000 });
        const resultMs = Date.now() - t1;
        log('audit-result-load', 'PASS', `Result appeared in ${resultMs}ms`);
      } catch {
        log('audit-result-load', 'FAIL', 'Result selector not found within 30s');
      }
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-result-100.png') });

      // Grab result text
      const resultText = await page.evaluate(() => document.body.innerText.substring(0, 500));
      log('result-content', 'INFO', resultText.replace(/\n+/g, ' ').trim());
    }
  } else {
    log('url-input-find', 'WARN', 'Could not find URL input — trying generic text input');
    const anyText = await page.$('input[type=text]');
    if (anyText) {
      await anyText.fill('https://example.com');
      log('fill-text-input', 'INFO', 'Filled generic text input');
    }
  }

  // ── 5. Probe: invalid URL ─────────────────────────────────────────
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const urlInput2 = await page.$('input[type=url], input[name*=url], input[placeholder*=url], input[placeholder*=URL], input[placeholder*=website], input[placeholder*=Website], input[type=text]');
  const submitBtn2 = await page.$('button[type=submit], input[type=submit]');
  if (urlInput2 && submitBtn2) {
    await urlInput2.fill('not-a-url');
    await submitBtn2.click();
    await page.waitForTimeout(2000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasError = /error|invalid|not valid|please enter/i.test(bodyText);
    log('probe-invalid-url', hasError ? 'PASS' : 'WARN', hasError ? 'Error message shown' : 'No error for invalid URL');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-invalid-url.png') });
  }

  // ── 6. Probe: empty string ────────────────────────────────────────
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const urlInput3 = await page.$('input[type=url], input[name*=url], input[placeholder*=url], input[placeholder*=URL], input[placeholder*=website], input[placeholder*=Website], input[type=text]');
  const submitBtn3 = await page.$('button[type=submit], input[type=submit]');
  if (urlInput3 && submitBtn3) {
    await urlInput3.fill('');
    await submitBtn3.click();
    await page.waitForTimeout(1000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasReq = /required|please|error/i.test(bodyText);
    log('probe-empty-string', hasReq ? 'PASS' : 'WARN', hasReq ? 'Required field enforced' : 'No error on empty submit');
  }

  // ── 7. Probe: very long URL ───────────────────────────────────────
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const urlInput4 = await page.$('input[type=url], input[name*=url], input[placeholder*=url], input[placeholder*=URL], input[placeholder*=website], input[placeholder*=Website], input[type=text]');
  const submitBtn4 = await page.$('button[type=submit], input[type=submit]');
  if (urlInput4 && submitBtn4) {
    const longUrl = 'https://example.com/' + 'a'.repeat(2000);
    await urlInput4.fill(longUrl);
    await submitBtn4.click();
    await page.waitForTimeout(5000);
    const status = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    log('probe-long-url', 'INFO', `Page: ${status} | Body: ${bodyText.replace(/\n/g, ' ').trim()}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-long-url.png') });
  }

  // ── 8. Mobile viewport ───────────────────────────────────────────
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'audit-mobile.png') });
  const mobileOverflow = await mobilePage.evaluate(() => document.body.scrollWidth > window.innerWidth);
  log('mobile-layout', mobileOverflow ? 'WARN' : 'PASS', mobileOverflow ? 'Horizontal overflow detected' : 'No overflow');
  await mobilePage.close();

  // ── 9. Console errors ────────────────────────────────────────────
  if (consoleErrors.length) {
    log('console-errors', 'WARN', consoleErrors.join(' | '));
  } else {
    log('console-errors', 'PASS', 'No JS errors');
  }

  // ── Summary ───────────────────────────────────────────────────────
  console.log('\n=== SUMMARY ===');
  const fails = results.filter(r => r.status === 'FAIL');
  const warns = results.filter(r => r.status === 'WARN');
  console.log(`Total checks: ${results.length} | FAIL: ${fails.length} | WARN: ${warns.length}`);
  if (fails.length) console.log('FAILs:', fails.map(f => f.label).join(', '));
  if (warns.length) console.log('WARNs:', warns.map(w => w.label).join(', '));

  await browser.close();
})();
