const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  const frames = await page.evaluate(() => {
    return new Promise((resolve) => {
      const samples = [];
      const store = window.Alpine.store('ui');
      let count = 0;
      const iv = setInterval(() => {
        const el = document.querySelector('.pointer-events-auto.rounded-xl');
        if (el) {
          samples.push({ t: count * 20, cls: el.className, opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform });
        }
        count++;
        if (count > 20) {
          clearInterval(iv);
          resolve(samples);
        }
      }, 20);
      store.toast('test message', 'info');
    });
  });
  console.log(JSON.stringify(frames, null, 2));
  await browser.close();
})();
