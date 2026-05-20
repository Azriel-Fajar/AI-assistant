const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) console.log('[NAV]', frame.url());
  });

  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });
  console.log('Loaded');

  // Fill customer info
  await page.fill('#nama', 'Test User');
  await page.fill('#email', 'test@test.com');
  await page.fill('#phone', '081234567890');

  // Select Starter Plan via JS to avoid intercept issue
  await page.evaluate(() => {
    const el = document.getElementById('starter');
    el.checked = true;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(500);
  console.log('Selected Starter Plan');

  // Check promo wrap visibility
  const promoDisplay = await page.evaluate(() => {
    const el = document.getElementById('promoCheckWrap');
    return el ? window.getComputedStyle(el).display : 'NOT FOUND';
  });
  console.log('Promo wrap display:', promoDisplay);

  // Claim free promo via JS
  await page.evaluate(() => {
    const cb = document.getElementById('free_promo');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(500);
  console.log('Claimed promo');

  // Check domainHostingWrap display after promo
  const dhAfterPromo = await page.evaluate(() => {
    return window.getComputedStyle(document.getElementById('domainHostingWrap')).display;
  });
  console.log('domainHostingWrap after promo:', dhAfterPromo);

  // Check checkout button state
  const btnState = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"][name="submit"]');
    if (!btn) return 'NOT FOUND';
    return {
      display: window.getComputedStyle(btn).display,
      visibility: window.getComputedStyle(btn).visibility,
      disabled: btn.disabled,
    };
  });
  console.log('Checkout btn after promo:', JSON.stringify(btnState));

  await page.screenshot({ path: 'screenshots/order-01-after-promo.png', fullPage: true });

  // Click an addon
  await page.evaluate(() => {
    const cb = document.getElementById('addon_1');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(500);
  console.log('Clicked addon_1 (Extra Pages Rp85000)');

  // Check domainHostingWrap after addon click
  const dhAfterAddon = await page.evaluate(() => {
    return window.getComputedStyle(document.getElementById('domainHostingWrap')).display;
  });
  console.log('domainHostingWrap after addon:', dhAfterAddon);

  await page.screenshot({ path: 'screenshots/order-02-after-addon.png', fullPage: true });

  // Now try to submit
  await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"][name="submit"]');
    btn.click();
  });
  await page.waitForTimeout(2000);
  console.log('URL after submit click:', page.url());

  // Check validity of form fields
  const invalidFields = await page.evaluate(() => {
    const form = document.getElementById('orderForm');
    const invalid = [];
    for (const el of form.elements) {
      if (!el.checkValidity()) {
        invalid.push({ name: el.name, id: el.id, reason: el.validationMessage });
      }
    }
    return invalid;
  });
  console.log('Invalid fields:', JSON.stringify(invalidFields, null, 2));

  await page.screenshot({ path: 'screenshots/order-03-after-submit.png', fullPage: true });
  await browser.close();
})();
