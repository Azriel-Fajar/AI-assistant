const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.ap-card'));
    for (const card of cards) {
      const tags = card.querySelectorAll('span');
      const texts = Array.from(tags).map(s => s.textContent.trim());
      if (texts.some(t => t.includes('Tukar Tambah'))) {
        const row = Array.from(tags).find(s => s.textContent.includes('Tukar Tambah'))?.parentElement;
        const badgeSpans = row ? Array.from(row.children) : [];
        const info = (el) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return { text: el.textContent.trim(), width: r.width, right: r.x + r.width, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
        };
        return { cardWidth: card.getBoundingClientRect().width, badges: badgeSpans.map(info) };
      }
    }
    return null;
  });
  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'C:/Users/afw14/AppData/Local/Temp/claude/c--xampp-htdocs-fti-marketplace/82d82198-b0d1-416f-94d0-d3b35e1f7643/scratchpad/badge-check-360.png' });
  await browser.close();
})();
