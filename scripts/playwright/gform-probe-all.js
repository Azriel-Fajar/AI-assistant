const { chromium } = require('C:\\nvm4w\\nodejs\\node_modules\\playwright');
const path = require('path');

(async () => {
  const profile = path.resolve('d:/Main Storage/Documents/JARVIS/.pw-profile');
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfvLmaOZgizpznp2VtVaf4BP-7dkE_XodVbp0X_zCfGNXc_WQ/viewform?hr_submission=ChkImI64lKQXEhAIkobcqe8YEgcI38bxtJkXEAE&pli=1';
  const ctx = await chromium.launchPersistentContext(profile, { headless: false, viewport: { width: 1280, height: 900 } });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  let pageNum = 1;
  while (true) {
    console.log(`\n=== PAGE ${pageNum} ===`);
    await page.waitForSelector('div[role="listitem"]', { timeout: 10000 }).catch(() => {});

    const questions = await page.$$eval('div[role="listitem"]', els => els.map(el => {
      const heading = el.querySelector('[role="heading"]');
      const qText = heading ? heading.innerText.trim() : null;
      const radios = Array.from(el.querySelectorAll('div[role="radio"]')).map(r => r.getAttribute('aria-label'));
      const checkboxes = Array.from(el.querySelectorAll('div[role="checkbox"]')).map(r => r.getAttribute('aria-label'));
      return { question: qText, radios, checkboxes };
    }));

    questions.forEach((q, i) => {
      console.log(`Q${i + 1}: ${q.question}`);
      if (q.radios.length) console.log('  Options (radio):', q.radios);
      if (q.checkboxes.length) console.log('  Options (checkbox):', q.checkboxes);
    });

    // Check for Next button
    const nextBtn = await page.$('div[role="button"]:has-text("Next")').catch(() => null)
      || await page.$('span:has-text("Next")').catch(() => null);

    if (!nextBtn) {
      console.log('\nNo Next button — last page.');
      break;
    }

    await nextBtn.click();
    await page.waitForTimeout(2000);
    pageNum++;
    if (pageNum > 10) break; // safety
  }

  console.log('\nProbe complete. Browser left open.');
})();
