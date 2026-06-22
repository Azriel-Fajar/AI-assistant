const { chromium } = require(require('path').join(process.cwd(),'node_modules','playwright'));
(async()=>{
  const url=process.argv[2], out=process.argv[3];
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext({viewport:{width:1440,height:1000}});
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'networkidle',timeout:30000});
  await p.waitForTimeout(2500);
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(600);
  await p.screenshot({path:out,fullPage:true});
  await b.close(); console.log('OK '+out);
})();
