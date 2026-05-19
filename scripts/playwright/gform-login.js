const { chromium } = require('C:\\nvm4w\\nodejs\\node_modules\\playwright');
const path = require('path');

(async () => {
  const profile = path.resolve('d:/Main Storage/Documents/JARVIS/.pw-profile');
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfvLmaOZgizpznp2VtVaf4BP-7dkE_XodVbp0X_zCfGNXc_WQ/viewform?hr_submission=ChkImI64lKQXEhAIkobcqe8YEgcI38bxtJkXEAE&pli=1';
  const ctx = await chromium.launchPersistentContext(profile, { headless: false, viewport: { width: 1280, height: 900 } });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Login in browser. Close browser window when done.');
  await new Promise(r => ctx.on('close', r));
})();
