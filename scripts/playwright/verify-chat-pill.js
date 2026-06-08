const { chromium } = require('playwright');

// Verifies the chat-pill extraction + locale resolution + rendered anchor
// against the real built page (reads document.documentElement.lang live).
const BASE = 'http://127.0.0.1:8000';

const cases = [
  { in: 'Pro is our most popular pick. Ready to roll?\n[[pill:order?aksi=pro|Order the Pro plan]]',
    wantLabel: 'Order the Pro plan', wantRel: '/order?aksi=pro', absolute: false },
  { in: 'Want to see examples?\n[[pill:https://demo.rielcode.com|See live demos]]',
    wantLabel: 'See live demos', wantAbs: 'https://demo.rielcode.com', absolute: true },
  { in: 'Talk to a human anytime.\n[[pill:https://wa.me/6285669522225|Chat on WhatsApp]]',
    wantLabel: 'Chat on WhatsApp', wantAbs: 'https://wa.me/6285669522225', absolute: true },
  { in: 'Delivery takes 7 to 10 days for Pro. No rush.',
    noPill: true },
];

// Mirror of the shipped extractPill + renderBotMessage pill href logic.
function makeRender() {
  return function render(text) {
    const m = text.match(/\[\[pill:([^|\]]+)\|([^\]]+)\]\]/);
    const out = { body: text, pill: null };
    if (m) {
      out.body = text.replace(m[0], '').replace(/\s+$/, '');
      let url = m[1].trim();
      if (!/^https?:\/\//i.test(url)) {
        const locale = document.documentElement.lang || 'en';
        url = '/' + locale + '/' + url.replace(/^\/+/, '');
      }
      out.pill = { url, label: m[2].trim() };
    }
    return out;
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let failures = 0;

  for (const locale of ['en', 'id']) {
    const page = await browser.newPage();
    await page.goto(`${BASE}/${locale}/`, { waitUntil: 'domcontentloaded' });
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    console.log(`\n=== locale page /${locale}/  (html lang="${htmlLang}") ===`);

    for (const c of cases) {
      const res = await page.evaluate((args) => {
        const [text] = args;
        const fn = (eval('(' + args[1] + ')'))();
        return fn(text);
      }, [c.in, makeRender.toString()]);

      if (c.noPill) {
        const ok = res.pill === null && res.body === c.in;
        console.log(`${ok ? 'PASS' : 'FAIL'}  no-pill: body kept, pill null`);
        if (!ok) { failures++; console.log('   got:', JSON.stringify(res)); }
        continue;
      }

      const sentinelGone = !/\[\[pill:/.test(res.body);
      const labelOk = res.pill && res.pill.label === c.wantLabel;
      let urlOk;
      if (c.absolute) urlOk = res.pill && res.pill.url === c.wantAbs;
      else urlOk = res.pill && res.pill.url === `/${locale}${c.wantRel}`;

      const ok = sentinelGone && labelOk && urlOk;
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.wantLabel} -> ${res.pill ? res.pill.url : 'NO PILL'}`);
      if (!ok) {
        failures++;
        console.log('   sentinelGone:', sentinelGone, 'labelOk:', labelOk, 'urlOk:', urlOk);
        console.log('   got:', JSON.stringify(res));
      }
    }
    await page.close();
  }

  await browser.close();
  console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
  process.exit(failures === 0 ? 0 : 1);
})();
