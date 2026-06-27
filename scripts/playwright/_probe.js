const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext({ viewport:{width:420,height:880} }).then(c=>c.newPage());
  const errs=[];
  page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  page.on('pageerror',e=>errs.push('PAGEERR: '+e.message));
  await page.goto('http://localhost:64022/',{waitUntil:'load'});
  await page.waitForTimeout(8000);
  const info = await page.evaluate(()=>({
    title: document.title,
    glass: !!document.querySelector('flt-glass-pane'),
    scene: !!document.querySelector('flt-scene-host'),
    semHost: !!document.querySelector('flt-semantics-host'),
    semNodes: document.querySelectorAll('flt-semantics').length,
    enableBtn: !!document.querySelector('[aria-label*="accessibility" i],[aria-label*="Enable" i]'),
    bodyHtml: document.body.innerHTML.slice(0,500)
  }));
  console.log(JSON.stringify(info,null,2));
  console.log('ERRORS('+errs.length+'):'); errs.slice(0,15).forEach(e=>console.log('  '+e));
  await page.screenshot({path:'C:/Users/afw14/AppData/Local/Temp/claude/c--Users-afw14-OneDrive-Documents-JARVIS/75a1d255-1925-4173-9556-af1cf625b3a7/scratchpad/probe.png'});
  await browser.close();
})();
