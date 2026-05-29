const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const responses = [];
  page.on('response', r => {
    if (r.url().includes('localhost/rielcode')) {
      const short = r.url().replace('http://localhost/rielcode', '');
      responses.push({ status: r.status(), url: short });
      console.log('[HTTP]', r.status(), short);
    }
  });

  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });
  console.log('Loaded');

  await page.evaluate(() => {
    document.getElementById('nama').value = 'Test User';
    document.getElementById('email').value = 'test@test.com';
    document.getElementById('phone').value = '081234567890';
    const starter = document.getElementById('starter');
    starter.checked = true;
    starter.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);

  // Claim promo via label
  await page.locator('label[for="free_promo"]').click();
  await page.waitForTimeout(300);
  console.log('Promo claimed');

  // Click addon via JS
  await page.evaluate(() => {
    const cb = document.getElementById('addon_1');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);

  const state = await page.evaluate(() => ({
    domainHostingDisplay: window.getComputedStyle(document.getElementById('domainHostingWrap')).display,
    promoChecked: document.getElementById('free_promo').checked,
    domain: document.querySelector('input[name="domain"]:checked')?.value,
    hosting: document.querySelector('input[name="hosting"]:checked')?.value,
    package: document.querySelector('input[name="package"]:checked')?.value,
  }));
  console.log('Pre-submit state:', JSON.stringify(state));

  // NOTE: domainHostingDisplay is 'block' here (Bug 1 confirmed).
  // The domain/hosting required fields are now visible again.
  // Let's check if the domain/hosting has valid selections:
  const validity = await page.evaluate(() => {
    const invalid = [];
    for (const el of document.getElementById('orderForm').elements) {
      if (!el.checkValidity()) invalid.push({ name: el.name, id: el.id, msg: el.validationMessage });
    }
    return invalid;
  });
  console.log('Invalid before submit:', JSON.stringify(validity));

  await page.screenshot({ path: 'screenshots/t5-01-pre-submit.png', fullPage: true });

  // Click the actual checkout button
  console.log('Clicking checkout button...');
  const navPromise = page.waitForNavigation({ timeout: 10000 }).catch(e => ({ timeout: true, msg: e.message }));
  await page.locator('button[type="submit"][name="submit"]').click();
  const navResult = await navPromise;
  console.log('Nav result:', navResult);
  console.log('URL after checkout:', page.url());

  await page.screenshot({ path: 'screenshots/t5-02-after-submit.png', fullPage: true });
  const errBanner = await page.locator('.err-banner, .error-banner, [class*="err"]').count();
  console.log('Error banners:', errBanner);
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Page preview:', bodyText);

  await browser.close();
})();
