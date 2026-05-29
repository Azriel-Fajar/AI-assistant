const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // Extract captions baseUrl from ytInitialPlayerResponse
  const transcriptUrl = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script')];
    for (const s of scripts) {
      const m = s.textContent.match(/"captionTracks":\[.*?"baseUrl":"([^"]+)"/);
      if (m) return m[1].replace(/\\u0026/g, '&');
    }
    return null;
  });

  if (!transcriptUrl) {
    console.error('No caption track found');
    await browser.close();
    return;
  }

  const xml = await page.evaluate(async (u) => {
    const res = await fetch(u);
    return res.text();
  }, transcriptUrl);

  await browser.close();

  const matches = [...xml.matchAll(/<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)];
  const lines = matches.map(([, start, text]) => {
    const secs = Math.floor(parseFloat(start));
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    const clean = text
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/<[^>]+>/g, '')
      .trim();
    return `${m}:${s}  ${clean}`;
  });

  console.log(lines.join('\n'));
})();
