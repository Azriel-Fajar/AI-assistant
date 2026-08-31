const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  const url = 'file:///' + path.resolve(process.argv[2]).split(path.sep).join('/');
  await p.goto(url);
  await p.emulateMedia({ media: 'print' });
  await p.screenshot({ path: process.argv[3], fullPage: true });
  await b.close();
  console.log('ok');
})();
