const { chromium } = require('C:\\nvm4w\\nodejs\\node_modules\\playwright');
const path = require('path');

const ANSWERS = [
  { keyword: 'example of a LAN type',         answer: 'SOHO' },
  { keyword: 'peer-to-peer',                   answer: 'A network where each device can act as both client and server' },
  { keyword: 'client-server network model',    answer: 'The central server' },
  { keyword: 'Local Area Network (LAN)',        answer: 'A network confined to a single geographical location' },
  { keyword: 'SOHO stand for',                 answer: 'Small Office Home Office' },
];

(async () => {
  const profile = path.resolve('d:/Main Storage/Documents/JARVIS/.pw-profile');
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfvLmaOZgizpznp2VtVaf4BP-7dkE_XodVbp0X_zCfGNXc_WQ/viewform?hr_submission=ChkImI64lKQXEhAIkobcqe8YEgcI38bxtJkXEAE&pli=1';

  let ctx;
  try {
    ctx = await chromium.launchPersistentContext(profile, { headless: false, viewport: { width: 1280, height: 900 } });
    const page = ctx.pages()[0] || await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('div[role="listitem"]', { timeout: 15000 });

    const items = await page.$$('div[role="listitem"]');
    let answered = 0;

    for (const item of items) {
      const heading = await item.$('[role="heading"]');
      const qText = heading ? await heading.innerText() : '';

      const match = ANSWERS.find(a => qText.includes(a.keyword));
      if (!match) continue;

      const radio = await item.$(`div[role="radio"][aria-label="${match.answer}"]`);
      if (radio) {
        await radio.click();
        console.log(`Answered: "${match.answer}" for "${qText.trim().slice(0, 60)}"`);
        answered++;
      } else {
        const available = await item.$$eval('div[role="radio"]', els => els.map(e => e.getAttribute('aria-label')));
        console.log(`MISS — Q: "${qText.trim().slice(0, 60)}" | Available:`, available);
      }
    }

    console.log(`\nDone. ${answered}/5 answered. Browser left open — do NOT submit.`);
  } catch (err) {
    console.error('Error:', err.message);
    if (ctx) await ctx.close().catch(() => {});
    process.exit(1);
  }
})();
