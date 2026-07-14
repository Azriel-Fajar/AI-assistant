const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 900 } });
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.ap-card'));
    for (const card of cards) {
      const tags = card.querySelectorAll('span');
      const texts = Array.from(tags).map(s => s.textContent.trim());
      if (texts.some(t => t.includes('Tukar Tambah') || t.includes('Barter'))) {
        const row = Array.from(tags).find(s => s.textContent.includes('Tukar Tambah') || s.textContent.includes('Barter'))?.parentElement;
        const badgeSpans = row ? Array.from(row.children) : [];
        const info = (el) => {
          if (!el) return null;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            text: el.textContent.trim(),
            class: el.className,
            display: cs.display, flexShrink: cs.flexShrink, minWidth: cs.minWidth,
            overflow: cs.overflow, textOverflow: cs.textOverflow, whiteSpace: cs.whiteSpace,
            width: r.width, x: r.x, right: r.x + r.width,
          };
        };
        return {
          cardRect: card.getBoundingClientRect(),
          row: row ? { class: row.className, ...info(row) } : null,
          badges: badgeSpans.map(info),
        };
      }
    }
    return { error: 'no matching card found', count: cards.length };
  });

  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'C:/Users/afw14/AppData/Local/Temp/claude/c--xampp-htdocs-fti-marketplace/82d82198-b0d1-416f-94d0-d3b35e1f7643/scratchpad/badge-check.png' });
  await browser.close();
})();
