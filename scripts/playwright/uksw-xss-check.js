const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const N = (m) => console.log(m);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(); const p = await ctx.newPage();

  let xssFired = false;
  p.on('dialog', async d => { xssFired = true; N('!!! XSS DIALOG FIRED: ' + d.message()); await d.dismiss(); });

  // login admin (public demo creds) to view the stored reason in admin UI
  await p.goto(BASE + '/admin', { waitUntil:'networkidle' });
  await p.fill('#a-user','admin'); await p.fill('#a-pass','admin123');
  await p.click('button[type=submit]'); await p.waitForTimeout(3500);
  N('admin url=' + p.url());

  // open Appointments tab where reason renders
  await p.getByText('Appointments', { exact:true }).first().click().catch(()=>{});
  await p.waitForTimeout(2500);
  N('after-tab url=' + p.url());
  // try opening a row detail
  await p.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>/onerror|test/i.test(e.textContent||'')); if(el&&el.click)el.click(); }).catch(()=>{});
  await p.waitForTimeout(1500);

  // find how reason is rendered in DOM: escaped text vs live img element
  const hasImg = await p.evaluate(() => !!document.querySelector('img[src="x"]'));
  const rawInHtml = await p.evaluate(() => document.body.innerHTML.includes('onerror=alert(1)'));
  const escaped = await p.evaluate(() => document.body.innerHTML.includes('&lt;img'));
  N('live-img-element=' + hasImg + ' raw-onerror-in-html=' + rawInHtml + ' escaped-entity=' + escaped);
  await p.waitForTimeout(1500);
  N('xssFired=' + xssFired);
  await browser.close();
})();
