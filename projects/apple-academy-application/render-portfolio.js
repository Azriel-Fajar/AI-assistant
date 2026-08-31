const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'file:///' + path.resolve('portfolio.html').split(path.sep).join('/');
  await page.goto(url);
  await page.pdf({
    path: 'AzrielFajarWicaksono_Portfolio_Academy.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  await browser.close();
  console.log('rendered portfolio');
})();
