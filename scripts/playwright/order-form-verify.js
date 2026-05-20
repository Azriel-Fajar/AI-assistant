const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const starter = document.getElementById('starter');
    starter.checked = true;
    starter.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);

  // Claim promo
  await page.locator('label[for="free_promo"]').click();
  await page.waitForTimeout(300);

  const after_promo = await page.evaluate(() =>
    window.getComputedStyle(document.getElementById('domainHostingWrap')).display
  );
  console.log('After promo (expect none):', after_promo);

  // Click addon
  await page.evaluate(() => {
    const cb = document.getElementById('addon_1');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);

  const after_addon = await page.evaluate(() =>
    window.getComputedStyle(document.getElementById('domainHostingWrap')).display
  );
  console.log('After addon (expect none, was bug: block):', after_addon);

  await page.screenshot({ path: 'screenshots/verify-fix.png', fullPage: true });

  const pass = after_promo === 'none' && after_addon === 'none';
  console.log(pass ? 'PASS: Bug fixed' : 'FAIL: Still broken');

  await browser.close();
})();
