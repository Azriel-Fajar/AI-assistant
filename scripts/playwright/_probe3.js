const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const page = await browser.newContext({ viewport:{width:420,height:880} }).then(c=>c.newPage());
  const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.goto('http://localhost:64022/',{waitUntil:'load'});
  await page.waitForTimeout(12000);
  const c = await page.evaluate(()=>({canvas:document.querySelectorAll('canvas').length, flt:[...document.querySelectorAll('*')].filter(e=>e.tagName.toLowerCase().startsWith('flt')).length, host: !!document.querySelector('flutter-view, flt-glass-pane, flt-scene-host')}));
  console.log(JSON.stringify(c));
  errs.slice(0,8).forEach(e=>console.log('ERR '+e));
  await page.screenshot({path:'screenshots/_probe3.png'});
  await browser.close();
})();
