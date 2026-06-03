const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const iPhone = devices['iPhone 13'];

const pages = [
  { url: 'http://127.0.0.1:8000/', name: 'home' },
  { url: 'http://127.0.0.1:8000/work', name: 'work' },
  { url: 'http://127.0.0.1:8000/studio', name: 'studio' },
  { url: 'http://127.0.0.1:8000/services', name: 'services' },
  { url: 'http://127.0.0.1:8000/contact', name: 'contact' },
  { url: 'http://127.0.0.1:8000/order', name: 'order' },
  { url: 'http://127.0.0.1:8000/privacy', name: 'privacy' },
  { url: 'http://127.0.0.1:8000/terms', name: 'terms' },
  { url: 'http://127.0.0.1:8000/work/parallaxnet-canada', name: 'work-parallaxnet-canada' },
  { url: 'http://127.0.0.1:8000/work/parallaxnet-siber-indonesia', name: 'work-parallaxnet-siber-indonesia' },
];

const outDir = path.join(__dirname, '../../../screenshots/mobile');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const p of pages) {
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
    const outPath = path.join(outDir, `${p.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`✓ ${p.name} → ${outPath}`);
    await context.close();
  }

  await browser.close();
})();
