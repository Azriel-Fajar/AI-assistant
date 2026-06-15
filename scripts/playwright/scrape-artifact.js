const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2];
  // Headed + persistent profile + real UA to pass Cloudflare bot challenge.
  const ctx = await chromium.launchPersistentContext(
    process.env.LOCALAPPDATA + '\\ms-playwright-profile',
    {
      headless: false,
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      args: ['--disable-blink-features=AutomationControlled'],
    }
  );
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Wait for Cloudflare to clear: poll title until not "Just a moment".
  for (let i = 0; i < 30; i++) {
    const t = await page.title();
    if (!/just a moment/i.test(t) && t.length) break;
    await page.waitForTimeout(2000);
  }
  // Wait for the inner artifact frame (claudeusercontent.com) to finish loading.
  for (let i = 0; i < 30; i++) {
    const inner = page.frames().find(f => /claudeusercontent\.com/.test(f.url()));
    if (inner) {
      try {
        const len = await inner.evaluate(() => document.body ? document.body.innerText.length : 0);
        if (len > 100) break;
      } catch (e) {}
    }
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(3000);

  const out = { title: await page.title(), frames: [] };
  for (const frame of page.frames()) {
    try {
      const data = await frame.evaluate(() => {
        const t = document.body ? document.body.innerText : '';
        const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
          .map(h => h.tagName + ': ' + h.innerText.trim()).filter(Boolean);
        const forms = document.querySelectorAll('form').length;
        const inputs = document.querySelectorAll('input,textarea,select').length;
        const buttons = Array.from(document.querySelectorAll('button,a.btn,[role=button]'))
          .map(b => b.innerText.trim()).filter(Boolean).slice(0, 40);
        const imgs = document.querySelectorAll('img').length;
        const navLinks = Array.from(document.querySelectorAll('nav a, header a'))
          .map(a => a.innerText.trim()).filter(Boolean);
        return { textLen: t.length, text: t.slice(0, 8000), headings, forms, inputs, buttons, imgs, navLinks };
      });
      if (data.textLen > 0) out.frames.push({ url: frame.url().slice(0, 80), ...data });
    } catch (e) {}
  }
  console.log(JSON.stringify(out, null, 2));
  await ctx.close();
})();
