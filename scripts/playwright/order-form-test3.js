const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('response', r => {
    if (r.url().includes('localhost/rielcode')) {
      console.log('[HTTP]', r.status(), r.url().replace('http://localhost/rielcode', ''));
    }
  });

  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });
  console.log('Loaded');

  // All interactions via JS to avoid CSS intercept issues
  await page.evaluate(() => {
    document.getElementById('nama').value = 'Test User';
    document.getElementById('email').value = 'test@test.com';
    document.getElementById('phone').value = '081234567890';

    // Select Starter Plan
    const starter = document.getElementById('starter');
    starter.checked = true;
    starter.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);

  // Claim promo via label click (label covers input)
  await page.locator('label[for="free_promo"]').click();
  await page.waitForTimeout(300);
  console.log('Claimed promo');

  const state1 = await page.evaluate(() => ({
    domainHostingDisplay: window.getComputedStyle(document.getElementById('domainHostingWrap')).display,
    promoChecked: document.getElementById('free_promo').checked,
    domainValue: document.querySelector('input[name="domain"]:checked')?.value,
    hostingValue: document.querySelector('input[name="hosting"]:checked')?.value,
  }));
  console.log('State after promo:', JSON.stringify(state1));

  await page.screenshot({ path: 'screenshots/t3-01-promo-claimed.png', fullPage: true });

  // Click addon (use label/parent div)
  await page.locator('.addon-item').first().locator('label').click();
  await page.waitForTimeout(300);
  console.log('Clicked addon');

  const state2 = await page.evaluate(() => ({
    domainHostingDisplay: window.getComputedStyle(document.getElementById('domainHostingWrap')).display,
    addonTotal: document.getElementById('addonsTotalDisplay').textContent,
  }));
  console.log('State after addon:', JSON.stringify(state2));

  await page.screenshot({ path: 'screenshots/t3-02-after-addon.png', fullPage: true });

  // Full form validity check
  const validity = await page.evaluate(() => {
    const form = document.getElementById('orderForm');
    const invalid = [];
    for (const el of form.elements) {
      if (!el.checkValidity()) {
        invalid.push({ name: el.name, id: el.id, reason: el.validationMessage });
      }
    }
    return {
      formValid: form.checkValidity(),
      invalid,
      allValues: {
        nama: document.getElementById('nama').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        package: document.querySelector('input[name="package"]:checked')?.value,
        domain: document.querySelector('input[name="domain"]:checked')?.value,
        hosting: document.querySelector('input[name="hosting"]:checked')?.value,
      }
    };
  });
  console.log('Form validity:', JSON.stringify(validity, null, 2));

  // Submit
  console.log('Submitting...');
  try {
    await Promise.all([
      page.waitForNavigation({ timeout: 8000 }),
      page.evaluate(() => document.getElementById('orderForm').submit()),
    ]);
    console.log('Navigated to:', page.url());
  } catch(e) {
    console.log('Nav error:', e.message);
    console.log('Current URL:', page.url());
  }

  await page.screenshot({ path: 'screenshots/t3-03-after-submit.png', fullPage: true });
  await browser.close();
})();
