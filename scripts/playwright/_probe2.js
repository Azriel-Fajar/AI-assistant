const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext({ viewport:{width:420,height:880} }).then(c=>c.newPage());
  await page.goto('http://localhost:64022/',{waitUntil:'load'});
  await page.waitForTimeout(10000);
  const dump = await page.evaluate(()=>{
    const all=[...document.querySelectorAll('*')].map(e=>e.tagName.toLowerCase());
    const counts={}; all.forEach(t=>counts[t]=(counts[t]||0)+1);
    return {flt: Object.keys(counts).filter(t=>t.startsWith('flt')), counts: counts, canvas: document.querySelectorAll('canvas').length};
  });
  console.log(JSON.stringify(dump,null,2));
  await page.screenshot({path:'screenshots/_probe2.png'});
  await browser.close();
})();
