const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8000';

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [name, vp] of [['desktop', { width: 1280, height: 800 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });

    await page.click('#rc-cookie-accept').catch(() => {});
    await page.waitForTimeout(300);
    await page.click('#chatbot-icon');
    // wait for the container to actually open (hidden class removed)
    await page.waitForFunction(() => {
      const c = document.getElementById('chatbot-container');
      return c && !c.classList.contains('hidden');
    }, { timeout: 5000 }).catch(() => console.log('  (container did not open)'));
    await page.waitForTimeout(300);

    await page.evaluate(() => {
      const messages = document.getElementById('chat-messages');
      const div = document.createElement('div');
      div.className = 'message bot';
      div.innerHTML = 'Pro is our most popular pick, 5 pages with CMS and analytics. Ready to roll?';
      const a = document.createElement('a');
      a.className = 'chat-pill';
      a.href = '/en/order?aksi=pro';
      a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = 'Order the Pro plan &rarr;';
      div.appendChild(a);
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    });
    await page.waitForTimeout(300);

    const out = `c:/xampp/htdocs/Rielcode-laravel/screenshots/chat-pill-${name}.png`;
    const container = await page.$('#chatbot-container');
    await container.screenshot({ path: out });
    console.log('saved', out);
    await page.close();
  }
  await browser.close();
})();
