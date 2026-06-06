const { chromium, devices } = require('playwright');

const BASE = 'http://127.0.0.1:8000';
const SHOT = process.argv[2] || 'D:/Main Storage/Documents/JARVIS/screenshots/mobile/progress-mobile.png';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();

  // 1. Order form
  await page.goto(`${BASE}/en/order`, { waitUntil: 'networkidle' });

  // If a resume prompt is shown (existing session order), start fresh.
  const noBtn = page.locator('button.rc-btn--outline', { hasText: /no/i });
  if (await noBtn.count()) { await noBtn.first().click(); await page.waitForLoadState('networkidle'); }

  // Accept cookies
  const accept = page.locator('#rc-cookie-accept');
  if (await accept.count() && await accept.isVisible().catch(() => false)) {
    await accept.click();
  }

  // Fill fields
  await page.fill('#nama', 'Test Client');
  await page.fill('#email', 'testclient@example.com');
  await page.fill('#phone', '08123456789');
  await page.check('input[name="package"][value="Starter"]');

  await page.click('#orderBtn');
  await page.waitForLoadState('networkidle');

  // 2. Checkout -> confirm
  await page.waitForSelector('#terms');
  await page.check('#terms');
  await page.click('#checkoutBtn');
  await page.waitForLoadState('networkidle');

  // 3. checkout-success page has the progress link
  const progressHref = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(a => /\/progress\?t=/.test(a.href));
    return a ? a.href : null;
  });
  if (!progressHref) {
    console.log('NO_PROGRESS_LINK url=' + page.url());
    await browser.close();
    process.exit(1);
  }

  // Rewrite host to local server (config uses portal_urls.progress prod domain)
  const t = new URL(progressHref).searchParams.get('t');
  await page.goto(`${BASE}/en/progress?t=${t}`, { waitUntil: 'networkidle' });

  await page.waitForTimeout(800);
  await page.screenshot({ path: SHOT, fullPage: true });
  console.log('OK progress=' + page.url());
  console.log('SHOT=' + SHOT);
  await browser.close();
})();
