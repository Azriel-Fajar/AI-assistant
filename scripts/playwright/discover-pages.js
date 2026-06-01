const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });

  // collect all internal links
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    const base = window.location.origin;
    const urls = new Set();
    urls.add(window.location.href);
    anchors.forEach(a => {
      try {
        const url = new URL(a.href, base);
        if (url.origin === base && !url.hash && !url.pathname.match(/\.(jpg|jpeg|png|gif|svg|pdf|zip|css|js)$/i)) {
          urls.add(url.origin + url.pathname + url.search);
        }
      } catch {}
    });
    return Array.from(urls);
  });

  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
