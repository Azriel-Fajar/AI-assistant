/**
 * Verify fix: checkout button should navigate to /rielcode/checkout/
 * without throwing InvalidStateError.
 */
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost/rielcode/order-form/');

  // Dismiss stale-session dialog if present
  const yesBtn = page.locator('button[name="no"]');
  if (await yesBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await yesBtn.click();
    await page.waitForLoadState('networkidle');
  }

  // Fill customer info
  await page.fill('input[name="nama"]',  'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="phone"]', '081234567890');

  // Select Starter Plan
  await page.evaluate(() => {
    const radio = document.getElementById('starter');
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // domain = Yes, hosting = Yes (defaults, already checked)

  // Click Checkout and wait for navigation
  await Promise.all([
    page.waitForURL('**/checkout/**', { timeout: 10000 }),
    page.locator('button[name="submit"]').click(),
  ]);

  const invalidStateErrors = errors.filter(e => e.includes('InvalidStateError') || e.includes('invalid state'));

  if (invalidStateErrors.length > 0) {
    console.log('FAIL — InvalidStateError still present:');
    invalidStateErrors.forEach(e => console.log(' ', e));
  } else {
    console.log('PASS — Navigated to:', page.url());
    console.log('PASS — No InvalidStateError in console');
  }

  if (errors.length > 0) {
    console.log('\nAll console errors:');
    errors.forEach(e => console.log(' ', e));
  }

  await browser.close();
})();
