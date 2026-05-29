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

  await page.evaluate(() => {
    document.getElementById('nama').value = 'Test User';
    document.getElementById('email').value = 'test@test.com';
    document.getElementById('phone').value = '081234567890';
    const starter = document.getElementById('starter');
    starter.checked = true;
    starter.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);

  // Claim promo
  await page.locator('label[for="free_promo"]').click();
  await page.waitForTimeout(300);
  console.log('Promo claimed');

  // Click addon via JS (simulates the checkbox toggle)
  await page.evaluate(() => {
    const cb = document.getElementById('addon_1');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(300);
  console.log('Addon checked');

  const state = await page.evaluate(() => ({
    domainHostingDisplay: window.getComputedStyle(document.getElementById('domainHostingWrap')).display,
    addonTotal: document.getElementById('addonsTotalDisplay').textContent,
    promoChecked: document.getElementById('free_promo').checked,
    formValid: document.getElementById('orderForm').checkValidity(),
    domainValue: document.querySelector('input[name="domain"]:checked')?.value,
    hostingValue: document.querySelector('input[name="hosting"]:checked')?.value,
  }));
  console.log('State after addon:', JSON.stringify(state));

  await page.screenshot({ path: 'screenshots/t4-01-state.png', fullPage: true });

  // Submit using form.submit() which bypasses button click handlers
  console.log('Submitting...');
  try {
    await Promise.all([
      page.waitForNavigation({ timeout: 8000 }),
      page.evaluate(() => {
        // Add hidden submit input so PHP sees $_POST['submit']
        const inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = 'submit';
        inp.value = '1';
        document.getElementById('orderForm').appendChild(inp);
        document.getElementById('orderForm').submit();
      }),
    ]);
    console.log('Navigated to:', page.url());
  } catch(e) {
    console.log('Nav error:', e.message, '| URL:', page.url());
  }

  await page.screenshot({ path: 'screenshots/t4-02-after-submit.png', fullPage: true });

  const pageText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('Page content preview:', pageText);

  await browser.close();
})();
