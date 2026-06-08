const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8000';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  page.on('console', m => console.log('  [console]', m.type(), m.text()));
  page.on('requestfailed', r => console.log('  [reqfail]', r.url(), r.failure()?.errorText));
  page.on('response', async r => {
    if (r.url().includes('/rc/msg')) console.log('  [resp]', r.status(), r.url());
  });

  await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
  await page.click('#rc-cookie-accept').catch(() => {});
  await page.waitForTimeout(300);
  await page.click('#chatbot-icon');
  await page.waitForTimeout(500);

  const inputCount = await page.locator('#user-input').count();
  console.log('  #user-input count:', inputCount);

  await page.fill('#user-input', 'I want the Pro plan');
  await page.locator('#user-input').press('Enter');
  console.log('  sent. waiting 25s for stream...');
  await page.waitForTimeout(25000);

  const dump = await page.evaluate(() => {
    const bots = [...document.querySelectorAll('#chat-messages .message.bot')];
    return bots.map(b => ({
      cls: b.className,
      text: (b.textContent || '').slice(0, 200),
      pill: b.querySelector('a.chat-pill')?.getAttribute('href') || null,
    }));
  });
  console.log('  bot bubbles:', JSON.stringify(dump, null, 2));

  await browser.close();
})();
