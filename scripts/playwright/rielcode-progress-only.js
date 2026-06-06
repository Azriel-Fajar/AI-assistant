const { chromium, devices } = require('playwright');
const T = process.argv[2];
const OUT = 'D:/Main Storage/Documents/JARVIS/screenshots/mobile/progress.png';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:8000/en/progress?t=${T}`, { waitUntil: 'networkidle' });
  const a = page.locator('#rc-cookie-accept');
  if (await a.count() && await a.isVisible().catch(() => false)) { await a.click(); await page.waitForTimeout(300); }
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUT, fullPage: true });
  console.log('OK ' + page.url());
  await browser.close();
})();
