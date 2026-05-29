const { chromium } = require('playwright');

(async () => {
  const videoId = process.argv[2];
  const browser = await chromium.launch({ headless: true, args: ['--lang=en-US'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await context.newPage();
  await page.goto(`https://www.youtube.com/watch?v=${videoId}`, { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const html = document.documentElement.innerHTML;
    return {
      hasCaptionTracks: html.includes('captionTracks'),
      hasInitialData: html.includes('ytInitialPlayerResponse'),
      hasConsent: html.includes('consent'),
      hasSignIn: html.includes('Sign in'),
      length: html.length,
      title: document.title,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
