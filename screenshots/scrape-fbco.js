const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  try {
    await p.goto('https://flooringdeckingbali.wordpress.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(3000);
    const title = await p.title();
    const content = await p.content();
    const hasForm = content.includes('<form');
    const hasWA = content.includes('wa.me') || content.includes('whatsapp');
    const hasMeta = content.includes('name="description"');
    const hasGA = content.includes('gtag') || content.includes('google-analytics');
    const hasPixel = content.includes('fbq(') || content.includes('facebook.net/signals');
    const text = await p.$$eval('h1,h2,h3,p', els => els.slice(0,20).map(e=>e.innerText.trim()).filter(Boolean));
    const links = await p.$$eval('a[href]', els => [...new Set(els.map(e=>e.href).filter(h=>h.includes('flooringdeckingbali')))].slice(0,15));
    await p.screenshot({ path: 'c:/Users/afw14/OneDrive/Documents/JARVIS/screenshots/flooringdeckingbali.png', fullPage: true });
    console.log(JSON.stringify({ title, hasForm, hasWA, hasMeta, hasGA, hasPixel, text, links }));
  } catch(e) { console.error(e.message); }
  await b.close();
})();
