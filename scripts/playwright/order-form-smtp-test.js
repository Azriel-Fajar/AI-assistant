const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // ── Step 1: Order Form ──────────────────────────────────────────────────────
  console.log('Step 1: Order form...');
  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });

  // Dismiss stale-session dialog if present
  const staleNo = page.locator('button[name="no"]');
  if (await staleNo.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('  Stale session -- dismissing...');
    await staleNo.click();
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
  }

  await page.fill('#nama', 'SMTP Test User');
  await page.fill('#email', 'afw1407@gmail.com');
  await page.fill('#phone', '081234567890');
  await page.click('label[for="landing"]');
  await page.waitForTimeout(500);

  const [nav1] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }),
    page.click('button[name="submit"]'),
  ]);

  const url1 = page.url();
  console.log('After order form:', url1);

  if (!url1.includes('checkout')) {
    console.log('ERROR: did not reach checkout');
    const bodyText = await page.textContent('body');
    console.log('Body:', bodyText.slice(0, 400));
    await browser.close();
    return;
  }

  // ── Step 2: Checkout Confirm ────────────────────────────────────────────────
  console.log('Step 2: Checkout confirm...');
  await page.waitForTimeout(500);

  const [nav2] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => {}),
    page.click('button#checkoutBtn, button[type="submit"]'),
  ]);

  const url2 = page.url();
  console.log('After checkout:', url2);

  const bodyText = await page.textContent('body');
  if (bodyText.toLowerCase().includes('thank') || url2.includes('thank') || url2.includes('success')) {
    console.log('RESULT: SUCCESS - check afw1407@gmail.com for thank-you email');
  } else {
    console.log('RESULT: Checkout done -- check error log for SMTP result');
    console.log('Body preview:', bodyText.slice(0, 400));
  }

  await browser.close();
})();
