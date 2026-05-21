const { chromium } = require('playwright');
const path = require('path');

const OUT = 'C:/Users/afw14/OneDrive/Documents/JARVIS/screenshots/redesign';
const pages = [
  { url: 'http://localhost:4321/404', file: 'phase1-track1c-404.png' },
  { url: 'http://localhost:4321/privacy', file: 'phase1-track1c-privacy.png' },
  { url: 'http://localhost:4321/faq', file: 'phase1-track1c-faq.png' },
  { url: 'http://localhost:4321/contact', file: 'phase1-track1c-contact.png' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let hadErr = false;
  for (const p of pages) {
    const page = await context.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    const resp = await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, p.file), fullPage: true });
    console.log(`${p.url} -> ${resp.status()} | errors: ${errs.length}`);
    if (errs.length) { hadErr = true; errs.forEach((e) => console.log('  ERR:', e)); }
    await page.close();
  }
  await browser.close();
  process.exit(hadErr ? 1 : 0);
})();
