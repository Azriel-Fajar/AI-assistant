const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 1.6 });
  const url = 'file:///' + path.resolve('portfolio.html').split(path.sep).join('/');
  await p.goto(url);
  await p.emulateMedia({ media: 'print' });
  const pages = await p.$$('.page');
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: `pf-${i}.png` });
  }
  console.log('shots:', pages.length);
  await b.close();
})();
