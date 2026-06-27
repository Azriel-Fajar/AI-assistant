const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 880 } });

  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://127.0.0.1:5599', { waitUntil: 'load' });
  // Flutter web boots async; wait for canvas/content paint.
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'screenshots/fti-p2-home.png' });

  // Try tapping the first listing card to reach detail (offer/chat CTAs).
  // Flutter renders to canvas; tap by coordinate in the card grid area.
  await page.mouse.click(210, 620);
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'screenshots/fti-p2-detail.png' });

  console.log('CONSOLE_ERRORS=' + errors.length);
  errors.slice(0, 15).forEach((e) => console.log('  - ' + e));
  await browser.close();
})();
