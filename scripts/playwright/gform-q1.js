const { chromium } = require('C:\\nvm4w\\nodejs\\node_modules\\playwright');

(async () => {
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfvLmaOZgizpznp2VtVaf4BP-7dkE_XodVbp0X_zCfGNXc_WQ/viewform?hr_submission=ChkImI64lKQXEhAIkobcqe8YEgcI38bxtJkXEAE&pli=1';
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  const title = await page.title();

  const headings = await page.$$eval('[role="heading"]', els => els.map(e => e.innerText.trim()).filter(Boolean));

  const questions = await page.$$eval('div[role="listitem"]', els =>
    els.map(e => {
      const heading = e.querySelector('[role="heading"]');
      return heading ? heading.innerText.trim() : e.innerText.trim().split('\n')[0];
    })
  );

  console.log(JSON.stringify({ title, headings: headings.slice(0, 5), firstQuestion: questions[0] || null, allQuestionsCount: questions.length, firstThree: questions.slice(0,3) }, null, 2));

  await page.screenshot({ path: 'screenshots/gform-q1.png', fullPage: false });
  await browser.close();
})();
