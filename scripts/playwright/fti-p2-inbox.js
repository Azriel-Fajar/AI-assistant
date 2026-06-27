const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 880 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://127.0.0.1:5599', { waitUntil: 'load' });
  await page.waitForTimeout(6000);

  // Bottom nav has 5 tabs across 420px width. "Pesan" = 4th tab (~index 3).
  // Centers: each tab ~84px wide; tab4 center x ~ 84*3 + 42 = 294. y near bottom ~840.
  await page.mouse.click(294, 842);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/fti-p2-inbox.png' });

  console.log('CONSOLE_ERRORS=' + errors.length);
  errors.filter(e => !e.includes('pravatar')).slice(0, 10).forEach((e) => console.log('  NON-AVATAR: ' + e));
  await browser.close();
})();
