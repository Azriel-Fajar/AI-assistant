const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext({ viewport:{width:420,height:880} }).then(c=>c.newPage());
  const logs=[]; page.on('console',m=>logs.push(m.type()+': '+m.text())); page.on('pageerror',e=>logs.push('PAGEERR: '+e.message));
  page.on('requestfailed',r=>logs.push('REQFAIL: '+r.url()+' '+(r.failure()&&r.failure().errorText)));
  await page.goto('http://localhost:64022/',{waitUntil:'load'});
  await page.waitForTimeout(20000);
  const c = await page.evaluate(()=>({canvas:document.querySelectorAll('canvas').length, flt:[...document.querySelectorAll('*')].filter(e=>e.tagName.toLowerCase().startsWith('flt')).length, scripts:document.querySelectorAll('script').length}));
  console.log('STATE '+JSON.stringify(c));
  logs.slice(-30).forEach(l=>console.log(l));
  await browser.close();
})();
