const { chromium } = require('playwright');

(async () => {
  const videoId = process.argv[2];
  const browser = await chromium.launch({ headless: true, args: ['--lang=en-US'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
  });
  const page = await context.newPage();

  await page.goto(`https://www.youtube.com/watch?v=${videoId}`, { waitUntil: 'networkidle' });

  const captionUrl = await page.evaluate(() => {
    const html = document.documentElement.innerHTML;
    const idx = html.indexOf('captionTracks');
    if (idx === -1) return null;
    const snippet = html.substring(idx, idx + 600);
    const m = snippet.match(/"baseUrl":"([^"]+)"/);
    return m ? m[1] : null;
  });

  if (!captionUrl) {
    console.error('No captions found');
    await browser.close();
    return;
  }

  const decoded = captionUrl.replace(/\\u0026/g, '&');
  const xml = await page.evaluate(async (u) => {
    const r = await fetch(u);
    return r.text();
  }, decoded);

  await browser.close();

  const lines = [...xml.matchAll(/<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)].map(([, start, text]) => {
    const secs = Math.floor(parseFloat(start));
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    const clean = text
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/<[^>]+>/g, '').trim();
    return `${m}:${s}  ${clean}`;
  });

  console.log(lines.join('\n'));
})();
