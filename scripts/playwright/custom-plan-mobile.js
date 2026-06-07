const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 13'],
  });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:8000/en/custom-plan', { waitUntil: 'networkidle' });

  // Accept cookies if banner present
  try {
    const cookieBtn = await page.locator('button:has-text("Accept"), button:has-text("accept"), [data-cookie-accept], .cookie-accept, #cookie-accept').first();
    if (await cookieBtn.isVisible({ timeout: 3000 })) {
      await cookieBtn.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {}

  const outDir = 'C:/Users/afw14/OneDrive/Documents/JARVIS/screenshots';
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'mobile-custom-plan.png');

  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved: ' + outPath);

  await browser.close();
})();
