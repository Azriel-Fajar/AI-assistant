const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER]', msg.text()));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err.message));

  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });
  console.log('Loaded order form');

  // Take screenshot of initial state
  await page.screenshot({ path: 'screenshots/order-form-01-initial.png', fullPage: true });
  console.log('Screenshot: initial state');

  // Check checkout button visibility
  const checkoutBtn = await page.$('#checkout-btn, .checkout-btn, [data-checkout], button[type="submit"]');
  if (checkoutBtn) {
    const isVisible = await checkoutBtn.isVisible();
    const display = await checkoutBtn.evaluate(el => window.getComputedStyle(el).display);
    console.log('Checkout button found. Visible:', isVisible, '| display:', display);
  } else {
    // Search for any button-like elements
    const allBtns = await page.$$eval('button, input[type="submit"], .btn', els =>
      els.map(el => ({
        text: el.textContent?.trim(),
        id: el.id,
        class: el.className,
        display: window.getComputedStyle(el).display,
        visible: el.offsetParent !== null
      }))
    );
    console.log('All buttons:', JSON.stringify(allBtns, null, 2));
  }

  // Pick first available package
  const packages = await page.$$('.package-card, .package-option, [data-package], input[name="package"]');
  console.log('Package elements found:', packages.length);

  if (packages.length > 0) {
    await packages[0].click();
    console.log('Clicked first package');
    await page.screenshot({ path: 'screenshots/order-form-02-package-selected.png', fullPage: true });
  }

  // Check for free hosting/domain checkboxes
  const freeHosting = await page.$('input[name*="hosting"], input[value*="hosting"], .free-hosting, #free-hosting');
  const freeDomain = await page.$('input[name*="domain"], input[value*="domain"], .free-domain, #free-domain');
  console.log('Free hosting element:', freeHosting ? 'found' : 'not found');
  console.log('Free domain element:', freeDomain ? 'found' : 'not found');

  if (freeHosting) {
    await freeHosting.click();
    console.log('Clicked free hosting');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/order-form-03-free-hosting.png', fullPage: true });
  }

  if (freeDomain) {
    await freeDomain.click();
    console.log('Clicked free domain');
    await page.waitForTimeout(500);
  }

  // Check checkout button after selections
  const checkoutBtnAfter = await page.$('#checkout-btn, .checkout-btn, [data-checkout], button[type="submit"]');
  if (checkoutBtnAfter) {
    const display = await checkoutBtnAfter.evaluate(el => window.getComputedStyle(el).display);
    const visibility = await checkoutBtnAfter.evaluate(el => window.getComputedStyle(el).visibility);
    console.log('Checkout button after selections -- display:', display, '| visibility:', visibility);
  }

  // Try clicking an addon to see button reappear
  const addons = await page.$$('.addon-option, .addon-card, input[name*="addon"], .add-on');
  console.log('Addon elements found:', addons.length);
  if (addons.length > 0) {
    await addons[0].click();
    console.log('Clicked first addon');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/order-form-04-addon-clicked.png', fullPage: true });

    const checkoutBtnFinal = await page.$('#checkout-btn, .checkout-btn, [data-checkout], button[type="submit"]');
    if (checkoutBtnFinal) {
      const display = await checkoutBtnFinal.evaluate(el => window.getComputedStyle(el).display);
      console.log('Checkout button after addon -- display:', display);
    }
  }

  // Dump full page HTML for inspection
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('scripts/playwright/order-form-dump.html', html);
  console.log('HTML dumped to scripts/playwright/order-form-dump.html');

  await page.screenshot({ path: 'screenshots/order-form-final.png', fullPage: true });
  console.log('Done. Check screenshots/ folder.');

  await browser.close();
})();
