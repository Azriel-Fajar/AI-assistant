const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  // Use fresh context (no session)
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
  page.on('response', r => {
    if (r.url().includes('localhost/rielcode')) {
      console.log('[HTTP]', r.status(), r.url());
    }
  });

  await page.goto('http://localhost/rielcode/order-form/', { waitUntil: 'networkidle' });
  console.log('Loaded at:', page.url());

  // Fill customer info
  await page.locator('#nama').fill('Test User');
  await page.locator('#email').fill('test@test.com');
  await page.locator('#phone').fill('081234567890');
  console.log('Filled customer info');

  // Select Starter Plan via label click (avoids intercept)
  await page.locator('label[for="starter"]').click();
  await page.waitForTimeout(500);
  console.log('Selected Starter Plan');

  // Claim free promo
  const promoWrap = page.locator('#promoCheckWrap');
  const promoDisplay = await promoWrap.evaluate(el => window.getComputedStyle(el).display);
  console.log('Promo wrap display:', promoDisplay);

  if (promoDisplay !== 'none') {
    await page.locator('#free_promo').click();
    await page.waitForTimeout(500);
    console.log('Claimed promo');
  }

  const dhAfterPromo = await page.locator('#domainHostingWrap').evaluate(el => window.getComputedStyle(el).display);
  console.log('domainHostingWrap after promo:', dhAfterPromo);

  await page.screenshot({ path: 'screenshots/t2-01-after-promo.png', fullPage: true });

  // Click an addon
  await page.locator('.addon-item').first().click();
  await page.waitForTimeout(500);
  console.log('Clicked first addon');

  const dhAfterAddon = await page.locator('#domainHostingWrap').evaluate(el => window.getComputedStyle(el).display);
  console.log('domainHostingWrap after addon:', dhAfterAddon);

  await page.screenshot({ path: 'screenshots/t2-02-after-addon.png', fullPage: true });

  // Verify form state before submit
  const formState = await page.evaluate(() => {
    const pkg = document.querySelector('input[name="package"]:checked');
    const domain = document.querySelector('input[name="domain"]:checked');
    const hosting = document.querySelector('input[name="hosting"]:checked');
    return {
      nama: document.getElementById('nama').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      package: pkg ? pkg.value : 'NONE',
      domain: domain ? domain.value : 'NONE',
      hosting: hosting ? hosting.value : 'NONE',
    };
  });
  console.log('Form state:', JSON.stringify(formState));

  // Check validity
  const validity = await page.evaluate(() => {
    const form = document.getElementById('orderForm');
    const invalid = [];
    for (const el of form.elements) {
      if (!el.checkValidity()) invalid.push({ name: el.name, id: el.id, reason: el.validationMessage });
    }
    return invalid;
  });
  console.log('Invalid fields:', JSON.stringify(validity));

  // Submit
  console.log('Submitting form...');
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }).catch(e => console.log('Nav timeout:', e.message)),
    page.locator('button[type="submit"][name="submit"]').click(),
  ]);
  console.log('URL after submit:', page.url());

  await page.screenshot({ path: 'screenshots/t2-03-after-submit.png', fullPage: true });
  await browser.close();
})();
