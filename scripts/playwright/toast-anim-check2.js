const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  const result = await page.evaluate(() => {
    const hasAlpine = !!window.Alpine;
    const store = hasAlpine ? window.Alpine.store('ui') : null;
    if (store) store.toast('test message', 'info');
    return new Promise((resolve) => {
      setTimeout(() => {
        const el = document.querySelector('.pointer-events-auto.rounded-xl');
        resolve({
          hasAlpine,
          hasStore: !!store,
          outerHTML: el ? el.outerHTML : null,
        });
      }, 100);
    });
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
