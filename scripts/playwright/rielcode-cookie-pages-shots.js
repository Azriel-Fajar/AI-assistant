const { chromium, devices } = require('playwright');

const BASE = 'http://127.0.0.1:8000';
const DIR = 'D:/Main Storage/Documents/JARVIS/screenshots/mobile';

async function acceptCookies(page) {
  const accept = page.locator('#rc-cookie-accept');
  try {
    if (await accept.count() && await accept.isVisible()) {
      await accept.click();
      await page.waitForTimeout(300);
    }
  } catch (e) {}
}

async function shot(page, url, name) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await acceptCookies(page);
  await page.waitForTimeout(600);
  const path = `${DIR}/${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`SHOT ${name} <- ${page.url()}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();

  // ---- Drive order flow to mint a token + reach checkout/success ----
  await page.goto(`${BASE}/en/order`, { waitUntil: 'networkidle' });
  const noBtn = page.locator('button.rc-btn--outline', { hasText: /no/i });
  if (await noBtn.count()) { await noBtn.first().click(); await page.waitForLoadState('networkidle'); }
  await acceptCookies(page);

  await page.fill('#nama', 'Test Client');
  await page.fill('#email', 'testclient@example.com');
  await page.fill('#phone', '08123456789');
  await page.locator('label[for="pkg_starter"]').click();
  await page.click('#orderBtn');
  await page.waitForLoadState('networkidle');

  // checkout page
  await page.waitForSelector('#terms');
  await acceptCookies(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${DIR}/checkout.png`, fullPage: true });
  console.log('SHOT checkout <- ' + page.url());

  // confirm -> success
  await page.check('#terms');
  await page.click('#checkoutBtn');
  await page.waitForLoadState('networkidle');
  await acceptCookies(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${DIR}/checkout-success.png`, fullPage: true });
  console.log('SHOT checkout-success <- ' + page.url());

  // grab token from success page link
  const href = await page.evaluate(() =>
    (([...document.querySelectorAll('a')].find(a => /\/progress\?t=/.test(a.href)) || {}).href) || null
  );
  if (!href) { console.log('NO_TOKEN url=' + page.url()); await browser.close(); process.exit(1); }
  const t = new URL(href).searchParams.get('t');
  console.log('TOKEN=' + t);

  // ---- Token-gated pages on local host ----
  await shot(page, `${BASE}/en/progress?t=${t}`, 'progress');
  await shot(page, `${BASE}/en/brief?t=${t}`, 'brief');

  // ---- Work case study ----
  await shot(page, `${BASE}/en/work/parallaxnet-canada`, 'work-parallaxnet-canada');

  await browser.close();
  console.log('DONE');
})();
