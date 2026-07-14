const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  // Inject a toast directly via the Alpine store to test the transition, bypassing auth/UI flow.
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const store = window.Alpine.store('ui');
      let maxTranslate = 0;
      let sawTransitionStyle = false;
      const check = setInterval(() => {
        const el = document.querySelector('[x-transition\\:enter]') || document.querySelector('.pointer-events-auto');
        if (el) {
          const cs = getComputedStyle(el);
          if (cs.transitionDuration !== '0s') sawTransitionStyle = true;
          const t = cs.transform;
          if (t && t !== 'none') maxTranslate = t;
        }
      }, 20);
      store.toast('test message', 'info');
      setTimeout(() => {
        clearInterval(check);
        resolve({ sawTransitionStyle, maxTranslate });
      }, 400);
    });
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
