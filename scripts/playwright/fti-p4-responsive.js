const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const w of [768, 1280, 1920]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:5601', { waitUntil: 'load' });
    await page.waitForTimeout(6000);
    await page.mouse.click(w - 33, 16); // skip onboarding (Lewati top-right)
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `screenshots/fti-p4-w${w}.png` });
    await ctx.close();
  }
  console.log('responsive shots done');
  await browser.close();
})();
