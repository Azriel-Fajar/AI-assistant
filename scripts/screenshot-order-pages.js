const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8000/en';
const TOKEN = '0854be953308b544f6e3278c5df96f2d3c35bc30b327ff3389e4298fa1616f6b';
const ORDER_ID = 2;
const INVOICE = 'INV-TEST-001';
const OUT = 'D:\\Main Storage\\Documents\\JARVIS\\screenshots\\mobile';

const pages = [
  { name: 'checkout', url: `${BASE}/checkout?t=${TOKEN}` },
  { name: 'checkout-success', url: `${BASE}/checkout/success?t=${TOKEN}` },
  { name: 'brief', url: `${BASE}/brief?t=${TOKEN}` },
  { name: 'progress', url: `${BASE}/progress?t=${TOKEN}` },
  { name: 'invoice', url: `${BASE}/i/${INVOICE}` },
];

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const device = devices['iPhone 13'];
  const context = await browser.newContext({ ...device });

  for (const p of pages) {
    const page = await context.newPage();
    console.log(`Screenshotting: ${p.name} → ${p.url}`);
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    const file = path.join(OUT, `${p.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  Saved: ${file}`);
    await page.close();
  }

  await browser.close();
  console.log('Done.');
})();
