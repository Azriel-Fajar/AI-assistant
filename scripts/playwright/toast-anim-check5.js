const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const wrap = document.createElement('div');
      wrap.setAttribute('x-data', '{show:false}');
      wrap.innerHTML = `<div x-show="show" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 -translate-y-4" x-transition:enter-end="opacity-100 translate-y-0" class="probe">hi</div>`;
      document.body.appendChild(wrap);
      window.Alpine.initTree(wrap);
      const el = wrap.querySelector('.probe');
      const samples = [];
      let n = 0;
      const iv = setInterval(() => {
        samples.push({ t: n * 20, opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform });
        n++;
        if (n > 15) { clearInterval(iv); resolve(samples); }
      }, 20);
      wrap.__x.$data.show = true;
    });
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
