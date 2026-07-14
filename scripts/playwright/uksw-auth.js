const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const NIM = process.env.NIM || '676767676';
const PW = process.env.PW || '12345678';
const N = (m) => console.log(m);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const apiCalls = [];
  page.on('response', r => {
    const u = r.url();
    if (u.includes('/api') || u.includes(BASE)) {
      if (r.request().method() !== 'GET' || u.includes('/api'))
        apiCalls.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(BASE,''));
    }
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.fill('#f-user', NIM);
  await page.fill('#f-pass', PW);
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.click('button[type=submit]'),
  ]);
  await page.waitForTimeout(2500);
  N('AFTER-LOGIN url=' + page.url());
  N('AFTER-LOGIN body=' + (await page.evaluate(() => document.body.innerText.slice(0,600))));

  // cookies + flags
  const cookies = await ctx.cookies();
  N('COOKIES=' + JSON.stringify(cookies.map(c => ({name:c.name, httpOnly:c.httpOnly, secure:c.secure, sameSite:c.sameSite, val:String(c.value).slice(0,40)}))));

  // localStorage / token leak
  const ls = await page.evaluate(() => JSON.stringify(localStorage));
  N('LOCALSTORAGE=' + ls);

  // try to reach admin as student
  const r = await page.goto(BASE + '/admin', { waitUntil: 'networkidle' }).catch(e=>null);
  N('STUDENT->/admin status=' + (r?r.status():'ERR') + ' url=' + page.url());
  N('/admin body=' + (await page.evaluate(() => document.body.innerText.slice(0,400))));

  N('API_CALLS=' + JSON.stringify([...new Set(apiCalls)], null, 1));
  await browser.close();
})();
