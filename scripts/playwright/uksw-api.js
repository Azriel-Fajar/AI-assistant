const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const NIM = '676767676', PW = '12345678';
const N = (m) => console.log(m);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.fill('#f-user', NIM);
  await page.fill('#f-pass', PW);
  await page.click('button[type=submit]');
  await page.waitForTimeout(2000);

  // helper: call API via page fetch (carries cookie)
  const api = async (method, path, body) => {
    return await page.evaluate(async ([m,p,b]) => {
      try {
        const res = await fetch(p, { method: m, headers: b?{'content-type':'application/json'}:{}, body: b?JSON.stringify(b):undefined });
        const t = await res.text();
        return { status: res.status, body: t.slice(0, 500) };
      } catch(e) { return { status:'ERR', body:String(e) }; }
    }, [method, path, body]);
  };

  // who am i
  N('me=' + JSON.stringify(await api('GET','/api/me')));

  // probe common endpoints
  const eps = [
    '/api/bookings','/api/booking','/api/visits','/api/visit',
    '/api/appointments','/api/messages','/api/message','/api/doctors',
    '/api/services','/api/users','/api/user','/api/profile',
    '/api/admin','/api/admin/bookings','/api/admin/users','/api/admin/appointments',
    '/api/consultations','/api/consultation','/api/reports'
  ];
  for (const e of eps) {
    const r = await api('GET', e);
    N('GET ' + e + ' -> ' + r.status + ' | ' + r.body.replace(/\s+/g,' ').slice(0,180));
  }
  await browser.close();
})();
