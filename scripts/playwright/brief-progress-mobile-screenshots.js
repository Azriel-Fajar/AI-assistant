const { chromium, devices } = require('playwright');
const path = require('path');

const TOKEN = '6ce6823c74b1f25202103dec055048c9d99d43e86683431874e37163964b110e';
const BASE = 'http://127.0.0.1:8000';
const OUT = 'D:\\Main Storage\\Documents\\JARVIS\\screenshots\\mobile';

const pages = [
  { name: 'brief', url: `${BASE}/en/brief?t=${TOKEN}` },
  { name: 'progress', url: `${BASE}/en/progress?t=${TOKEN}` },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const device = devices['iPhone 13'];
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();

  for (const { name, url } of pages) {
    await page.goto(url, { waitUntil: 'networkidle' });

    // Accept cookie banner if present
    const cookie = page.locator('#rc-cookie-accept');
    if (await cookie.isVisible()) {
      await cookie.click();
      await page.waitForTimeout(400);
    }

    const outPath = path.join(OUT, `${name}-mobile.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved: ${outPath}`);
  }

  await browser.close();
})();
