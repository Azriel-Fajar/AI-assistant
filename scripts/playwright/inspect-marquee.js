const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/afw14/AppData/Local/Temp/claude/c--xampp-htdocs-fti-marketplace/82d82198-b0d1-416f-94d0-d3b35e1f7643/scratchpad/marquee-t0.png' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'C:/Users/afw14/AppData/Local/Temp/claude/c--xampp-htdocs-fti-marketplace/82d82198-b0d1-416f-94d0-d3b35e1f7643/scratchpad/marquee-t1.png' });
  await browser.close();
})();
