const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('LOG:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('ERR:', err.message));
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    window.Alpine.store('ui').toast('test message', 'info');
  });
  await page.waitForTimeout(500);
  await browser.close();
})();
