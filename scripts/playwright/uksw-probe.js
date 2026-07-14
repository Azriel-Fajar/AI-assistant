const { chromium } = require('playwright');

const BASE = 'https://uksw-clinic.onrender.com';
const NIM = '676767676';
const PW = '12345678';

const log = [];
const notes = (m) => { log.push(m); console.log(m); };

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const consoleErrs = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
  page.on('pageerror', e => consoleErrs.push('PAGEERR: ' + e.message));

  // 1. landing
  await page.goto(BASE, { waitUntil: 'networkidle' });
  notes('LANDING url=' + page.url());
  notes('LANDING title=' + await page.title());

  // find links
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a')].map(a => a.getAttribute('href')).filter(Boolean));
  notes('LINKS=' + JSON.stringify([...new Set(links)]));

  // 2. try login page
  for (const p of ['/login', '/auth/login', '/masuk', '/signin']) {
    const r = await page.goto(BASE + p, { waitUntil: 'domcontentloaded' }).catch(e => null);
    if (r && r.status() < 400) { notes('LOGIN-PAGE-FOUND=' + p + ' status=' + r.status()); break; }
    notes('LOGIN-TRY ' + p + ' status=' + (r ? r.status() : 'ERR'));
  }

  // dump form fields on current page
  const fields = await page.evaluate(() =>
    [...document.querySelectorAll('input,button,select')].map(e => ({
      tag: e.tagName, type: e.type, name: e.name, id: e.id,
      ph: e.placeholder, txt: (e.innerText||'').slice(0,30) })));
  notes('FIELDS=' + JSON.stringify(fields));

  notes('CONSOLE_ERRS=' + JSON.stringify(consoleErrs));
  await browser.close();
})();
