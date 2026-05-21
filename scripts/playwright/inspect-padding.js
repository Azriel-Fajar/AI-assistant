const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    const getBox = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return { error: 'not found' };
      const s = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        selector: sel,
        paddingLeft: s.paddingLeft,
        paddingRight: s.paddingRight,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        rectLeft: Math.round(rect.left),
        rectRight: Math.round(window.innerWidth - rect.right),
      };
    };

    return [
      getBox('#landing .container'),
      getBox('.category-section .container'),
      getBox('.testimoni .container'),
    ];
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
