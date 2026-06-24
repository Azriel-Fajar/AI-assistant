const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // fresh context = empty storage = onboarding should show
  const ctx = await browser.newContext({ viewport: { width: 420, height: 880 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('pravatar')) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://127.0.0.1:5601', { waitUntil: 'load' });
  await page.waitForTimeout(6500);
  await page.screenshot({ path: 'screenshots/fti-p4-onboarding.png' });

  console.log('NONAVATAR_ERRORS=' + errors.filter(e => !e.includes('Failed to load resource')).length);
  errors.filter(e => !e.includes('Failed to load resource')).slice(0, 10).forEach(e => console.log('  ' + e));
  await browser.close();
})();
