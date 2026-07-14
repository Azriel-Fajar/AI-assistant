const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const N = (m) => console.log(m);
const api = (page, m, p, b) => page.evaluate(async ([m,p,b]) => {
  try { const r = await fetch(p,{method:m,headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined}); return {s:r.status,b:(await r.text()).slice(0,5000)}; }
  catch(e){return {s:'ERR',b:String(e)};}
}, [m,p,b]);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(); const s = await ctx.newPage();
  await s.goto(BASE); await s.fill('#f-user','676767676'); await s.fill('#f-pass','12345678');
  await s.click('button[type=submit]'); await s.waitForTimeout(3000);

  const mine = JSON.parse((await api(s,'GET','/api/appointments')).b);
  N('OWN appts=' + mine.length);
  for (const a of mine) {
    // students can only cancel; try PATCH cancel then DELETE
    let r = await api(s,'PATCH','/api/appointments/'+a.id,{status:'Cancelled'});
    N('cancel '+a.id+' ('+a.reason+') -> '+JSON.stringify(r));
  }
  N('AFTER=' + (await api(s,'GET','/api/appointments')).b);
  await browser.close();
})();
