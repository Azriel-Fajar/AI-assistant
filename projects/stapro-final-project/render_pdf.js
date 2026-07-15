const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'report.html'));
  await page.pdf({
    path: path.resolve(__dirname, 'Frequency_Distribution_Final_Project.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  await browser.close();
  console.log('PDF done');
})();
