const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch();
  const url = 'http://localhost/Rielcode-laravel/public/demos/preschool/';
  // desktop full page
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'screenshots/preschool-full.png', fullPage: true });
  // mobile
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(url, { waitUntil: 'networkidle' });
  await m.waitForTimeout(800);
  await m.screenshot({ path: 'screenshots/preschool-mobile.png', fullPage: true });
  // console errors
  const errs = [];
  const ep = await b.newPage();
  ep.on('console', msg => { if (msg.type() === 'error') errs.push(msg.text()); });
  ep.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
  await ep.goto(url, { waitUntil: 'networkidle' });
  await ep.waitForTimeout(500);
  console.log('CONSOLE ERRORS:', errs.length ? JSON.stringify(errs) : 'none');
  await b.close();
})();
