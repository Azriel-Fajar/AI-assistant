// Quick phone-width check of the alerts page. Credentials and target come from
// env so this runs on any machine: PNX_USER, PNX_PASS, PNX_BASE, PNX_OUT.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.PNX_BASE || 'http://127.0.0.1:8971';
const USER = process.env.PNX_USER || 'admin';
const PASS = process.env.PNX_PASS;
const OUT = process.env.PNX_OUT || path.join(process.cwd(), 'pnx-shots');

if (!PASS) {
  console.error('Set PNX_PASS (and PNX_USER if not "admin") before running.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

(async()=>{
 const b=await chromium.launch({headless:true});const c=await b.newContext();const p=await c.newPage();
 await p.goto(BASE+'/login');await p.fill('input[name=username]',USER);await p.fill('input[name=password]',PASS);await p.click('button[type=submit]');await p.waitForLoadState('networkidle');
 await p.setViewportSize({width:390,height:844});
 await p.goto(BASE+'/alerts',{waitUntil:'networkidle'});
 await p.waitForTimeout(400);
 await p.screenshot({path:path.join(OUT,'alerts-top-phone.png')}); // viewport only
 // does alerts have a pager?
 const info=await p.evaluate(()=>({pager:!!document.querySelector('[data-table-pager]'),rows:document.querySelectorAll('table tbody tr').length,toolbar:!!document.querySelector('.pnx-toolbar')}));
 console.log(JSON.stringify(info));
 await b.close();
})();
