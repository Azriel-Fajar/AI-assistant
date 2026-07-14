const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  const frames = await page.evaluate(() => {
    return new Promise((resolve) => {
      const samples = [];
      const start = Date.now();
      window.Alpine.store('ui').toast('test message', 'info');
      const iv = setInterval(() => {
        const el = document.querySelector('.pointer-events-auto.rounded-xl');
        samples.push({ t: Date.now() - start, opacity: el ? getComputedStyle(el).opacity : 'GONE' });
        if (Date.now() - start > 1400) { clearInterval(iv); resolve(samples); }
      }, 30);
    });
  });
  console.log(JSON.stringify(frames.filter((f, i) => i % 2 === 0), null, 2));
  await browser.close();
})();
