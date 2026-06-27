const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext({ viewport:{width:420,height:880} }).then(c=>c.newPage());
  await page.goto('http://localhost:64022/',{waitUntil:'load'});
  await page.waitForTimeout(12000);
  const c = await page.evaluate(()=>({canvas:document.querySelectorAll('canvas').length, flt:[...document.querySelectorAll('*')].filter(e=>e.tagName.toLowerCase().startsWith('flt')).length}));
  console.log(JSON.stringify(c));
  await page.screenshot({path:'screenshots/_probe4.png'});
  await browser.close();
})();
