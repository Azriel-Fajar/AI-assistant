const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const body = await page.evaluate(() => document.body.innerText.slice(0, 2000));
  console.log('BODYTEXT=' + body);

  const fields = await page.evaluate(() =>
    [...document.querySelectorAll('input,button,select,a')].map(e => ({
      tag: e.tagName, type: e.type, name: e.name, id: e.id,
      href: e.getAttribute && e.getAttribute('href'),
      ph: e.placeholder, txt: (e.innerText||'').slice(0,40) })));
  console.log('FIELDS=' + JSON.stringify(fields, null, 1));

  await page.screenshot({ path: 'screenshots/uksw-landing.png', fullPage: true });
  await browser.close();
})();
