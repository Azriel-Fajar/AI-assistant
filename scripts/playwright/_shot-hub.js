const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://127.0.0.1:8000/demos/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  const cards = await p.$$eval('.hub-card', els => els.map(e => e.querySelector('.hub-card__name')?.textContent));
  console.log('CARDS:', JSON.stringify(cards));
  await p.screenshot({ path: 'screenshots/demos-hub.png', fullPage: true });
  await b.close();
})();
