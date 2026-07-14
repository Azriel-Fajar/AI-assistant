const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  const frames = await page.evaluate(() => {
    return new Promise((resolve) => {
      const samples = [];
      window.Alpine.store('ui').toast('test message', 'info');
      let count = 0;
      const iv = setInterval(() => {
        const el = document.querySelector('.pointer-events-auto.rounded-xl');
        samples.push({ t: 900 + count * 20, opacity: el ? getComputedStyle(el).opacity : 'GONE' });
        count++;
        if (count > 20) { clearInterval(iv); resolve(samples); }
      }, 20);
    });
  }, { timeout: 0 });
  // wait til ~900ms then poll through the leave window
  await new Promise(r => setTimeout(r, 900));
  const frames2 = await page.evaluate(() => {
    return new Promise((resolve) => {
      const samples = [];
      let count = 0;
      const iv = setInterval(() => {
        const el = document.querySelector('.pointer-events-auto.rounded-xl');
        samples.push({ opacity: el ? getComputedStyle(el).opacity : 'GONE' });
        count++;
        if (count > 20) { clearInterval(iv); resolve(samples); }
      }, 20);
    });
  });
  console.log(JSON.stringify(frames2, null, 2));
  await browser.close();
})();
