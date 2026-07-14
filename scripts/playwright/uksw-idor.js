const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const N = (m) => console.log(m);
const api = (page, m, p, b) => page.evaluate(async ([m,p,b]) => {
  try { const r = await fetch(p,{method:m,headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined}); return {s:r.status,b:(await r.text()).slice(0,3000)}; }
  catch(e){return {s:'ERR',b:String(e)};}
}, [m,p,b]);

(async () => {
  const browser = await chromium.launch({ headless: true });

  // --- STUDENT session ---
  const sCtx = await browser.newContext(); const s = await sCtx.newPage();
  await s.goto(BASE); await s.fill('#f-user','676767676'); await s.fill('#f-pass','12345678');
  await s.click('button[type=submit]'); await s.waitForTimeout(3000);
  N('STUDENT /api/me -> ' + JSON.stringify(await api(s,'GET','/api/me')));

  N('STUDENT /api/appointments -> ' + JSON.stringify(await api(s,'GET','/api/appointments')));
  // try client-side filter bypass params
  N('STUDENT ?all=1 -> ' + JSON.stringify(await api(s,'GET','/api/appointments?all=1')));
  N('STUDENT ?nim=672022045 -> ' + JSON.stringify(await api(s,'GET','/api/appointments?nim=672022045')));
  // try admin stats as student
  N('STUDENT /api/admin/stats -> ' + JSON.stringify(await api(s,'GET','/api/admin/stats')));

  // book appointment to get an ID
  const doctors = JSON.parse((await api(s,'GET','/api/doctors')).b);
  const book = await api(s,'POST','/api/appointments',{serviceId:'general',doctorId:doctors[0].id,date:'2026-08-15',time:'09:00',mode:'in-person',reason:'test'});
  N('STUDENT book -> ' + JSON.stringify(book));

  await browser.close();
})();
