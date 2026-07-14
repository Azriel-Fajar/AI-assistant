const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
  const before = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Tukar Tambah'))?.closest('[x-data]');
    return el ? el.scrollLeft : null;
  });
  const box = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Tukar Tambah'))?.closest('[x-data]');
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  await page.mouse.move(box.x + box.w - 5, box.y + box.h / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - 40, box.y + box.h / 2, { steps: 10 });
  await page.mouse.up();
  const afterDrag = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Tukar Tambah'))?.closest('[x-data]');
    return el.scrollLeft;
  });
  console.log(JSON.stringify({ before, afterDrag }));
  await browser.close();
})();
