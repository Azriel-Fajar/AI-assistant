const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 420, height: 880 } });
  const page = await ctx.newPage();

  await page.goto('http://127.0.0.1:5601', { waitUntil: 'load' });
  await page.waitForTimeout(6500);
  // Skip onboarding (Lewati top-right)
  await page.mouse.click(387, 16);
  await page.waitForTimeout(2000);
  // Profile tab = 5th of 5, x ~ (84*4)+42=378, y bottom ~842
  await page.mouse.click(378, 842);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/fti-p4-profile-loginGate.png' });
  await browser.close();
})();
