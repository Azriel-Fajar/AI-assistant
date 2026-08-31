const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const src = process.argv[2];
  const out = process.argv[3];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(src).replace(/\\/g, '/'));
  await page.pdf({ path: out, format: 'A4', printBackground: true });
  await browser.close();
  console.log('rendered ' + out);
})();
