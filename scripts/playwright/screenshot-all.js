const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const pages = [
  { url: 'http://127.0.0.1:8000/', name: '01-home' },
  { url: 'http://127.0.0.1:8000/work', name: '02-work' },
  { url: 'http://127.0.0.1:8000/studio', name: '03-studio' },
  { url: 'http://127.0.0.1:8000/services', name: '04-services' },
  { url: 'http://127.0.0.1:8000/contact', name: '05-contact' },
  { url: 'http://127.0.0.1:8000/order', name: '06-order' },
  { url: 'http://127.0.0.1:8000/work/parallaxnet-siber-indonesia', name: '07-work-parallaxnet-siber' },
  { url: 'http://127.0.0.1:8000/work/parallaxnet-canada', name: '08-work-parallaxnet-canada' },
  { url: 'http://127.0.0.1:8000/order?aksi=starter', name: '09-order-starter' },
  { url: 'http://127.0.0.1:8000/order?aksi=pro', name: '10-order-pro' },
  { url: 'http://127.0.0.1:8000/order?aksi=business', name: '11-order-business' },
  { url: 'http://127.0.0.1:8000/privacy', name: '12-privacy' },
  { url: 'http://127.0.0.1:8000/terms', name: '13-terms' },
];

const outDir = path.join('screenshots', 'rielcode-site');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const p of pages) {
    const pg = await context.newPage();
    await pg.goto(p.url, { waitUntil: 'networkidle' });
    const outPath = path.join(outDir, `${p.name}.png`);
    await pg.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved: ${outPath}`);
    await pg.close();
  }

  await browser.close();
})();
