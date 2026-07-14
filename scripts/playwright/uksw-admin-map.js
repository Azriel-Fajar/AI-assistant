const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const N = (m) => console.log(m);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const calls = [];
  page.on('response', r => {
    const u = r.url();
    if (u.includes('/api')) calls.push(r.request().method()+' '+r.status()+' '+u.replace(BASE,''));
  });

  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
  // admin login form
  const f = await page.evaluate(() => [...document.querySelectorAll('input')].map(i=>({name:i.name,id:i.id,type:i.type,ph:i.placeholder})));
  N('ADMIN-FIELDS=' + JSON.stringify(f));

  // fill admin creds (public demo)
  const u = await page.$('input[type=text], input:not([type=password]):not([type=submit])');
  const pw = await page.$('input[type=password]');
  await u.fill('admin'); await pw.fill('admin123');
  await page.click('button[type=submit]');
  await page.waitForTimeout(2500);
  N('ADMIN-AFTER url=' + page.url());
  N('ADMIN-BODY=' + (await page.evaluate(()=>document.body.innerText.slice(0,500))));

  // navigate admin UI to trigger data loads
  await page.waitForTimeout(1500);
  N('ADMIN-API-CALLS=' + JSON.stringify([...new Set(calls)], null, 1));

  // dump a data-bearing admin call
  const dump = async (p) => {
    const r = await page.evaluate(async (p)=>{ const x=await fetch(p); return {s:x.status,b:(await x.text()).slice(0,600)}; }, p);
    N('ADMINGET '+p+' -> '+r.s+' | '+r.b.replace(/\s+/g,' '));
  };
  for (const p of ['/api/admin/appointments','/api/admin/users','/api/admin/students','/api/appointments']) await dump(p);

  await browser.close();
})();
