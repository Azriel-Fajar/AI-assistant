const { chromium, devices } = require('playwright');

const URL = 'http://127.0.0.1:8000/en/brief?t=259a7a4c7a3ae90f35157542edce1d55034464df394a59c91d6925e642131c71';
const OUT = 'C:/Users/afw14/OneDrive/Documents/JARVIS/screenshots/mobile/brief-thank-you.png';

const answers = {
  business: 'We are a boutique specialty coffee roaster based in Salatiga, sourcing single-origin beans from Indonesian farms and roasting in small batches. We sell online and supply a handful of local cafes.',
  goals: 'A clean, editorial website that tells our origin story, showcases our current bean lineup, and lets customers place orders or subscribe to a monthly coffee delivery. We want it to feel premium but approachable.',
  audience: 'Home brewing enthusiasts aged 25-45 who care about quality and provenance, plus small cafe owners looking for a reliable roaster partner. Mostly urban Indonesians, comfortable buying online.',
  success: 'More online orders and recurring subscriptions, fewer DMs asking "is this available". A site we can point wholesale leads to that makes us look established and trustworthy.',
  brand_style: 'Warm, earthy, editorial. Cream and deep brown tones, generous whitespace, large serif headings paired with clean sans body text. Inspiration: Onyx Coffee Lab, Trade Coffee. Avoid loud neon or cluttered layouts.',
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });

  for (const [name, val] of Object.entries(answers)) {
    await page.fill(`textarea[name="${name}"]`, val);
  }

  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.click('#briefSubmit'),
  ]);

  console.log('After submit URL:', page.url());

  await page.screenshot({ path: OUT, fullPage: true });
  console.log('Saved:', OUT);

  await browser.close();
})();
