const { chromium } = require('C:\\nvm4w\\nodejs\\node_modules\\playwright');
const path = require('path');

(async () => {
  const profile = path.resolve('d:/Main Storage/Documents/JARVIS/.pw-profile');
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfvLmaOZgizpznp2VtVaf4BP-7dkE_XodVbp0X_zCfGNXc_WQ/viewform?hr_submission=ChkImI64lKQXEhAIkobcqe8YEgcI38bxtJkXEAE&pli=1';
  const ctx = await chromium.launchPersistentContext(profile, { headless: false, viewport: { width: 1280, height: 900 } });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // Find Q1 listitem (skip Email)
  const items = await page.$$('div[role="listitem"]');
  let q1 = null;
  for (const it of items) {
    const h = await it.$('[role="heading"]');
    const txt = h ? await h.innerText() : '';
    if (txt.toLowerCase().includes('client-server')) { q1 = it; break; }
  }
  if (!q1) { console.log('Q1 not found'); await ctx.close(); return; }

  // Click "Server" radio inside that listitem
  const serverOpt = await q1.$('div[role="radio"][aria-label="The central server"]');
  if (serverOpt) {
    await serverOpt.click();
    console.log('Clicked: Server');
  } else {
    const labels = await q1.$$eval('div[role="radio"]', els => els.map(e => e.getAttribute('aria-label')));
    console.log('Server radio not found. Options:', labels);
  }

  console.log('Done. Browser left open for review.');
})();
