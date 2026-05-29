const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  const result = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script')];
    for (const s of scripts) {
      if (s.textContent.includes('captionTracks')) {
        return s.textContent.substring(0, 500);
      }
    }
    return 'captionTracks not found in any script';
  });

  console.log(result);
  await browser.close();
})();
