const { chromium } = require(require('path').join(process.cwd(),'node_modules','playwright'));
(async()=>{
  const b=await chromium.launch({headless:true});
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(process.argv[2],{waitUntil:'networkidle',timeout:30000});
  await p.waitForTimeout(1500);
  await p.screenshot({path:process.argv[3]});
  await b.close(); console.log('OK');
})();
