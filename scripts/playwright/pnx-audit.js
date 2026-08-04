const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Responsive audit of the Parallaxnet dashboard. Credentials and target come
// from env so this runs on any machine: PNX_USER, PNX_PASS, PNX_BASE, PNX_OUT.
const BASE = process.env.PNX_BASE || 'http://127.0.0.1:8971';
const USER = process.env.PNX_USER || 'admin';
const PASS = process.env.PNX_PASS;
const OUT = process.env.PNX_OUT || path.join(process.cwd(), 'pnx-shots');

if (!PASS) {
  console.error('Set PNX_PASS (and PNX_USER if not "admin") before running.');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1440, height: 900 },
];

// discover first kampus/student ids at runtime via links; fallback to 1
const PAGES = [
  { slug: 'dashboard', url: '/' },
  { slug: 'kampus-index', url: '/kampus' },
  { slug: 'alerts', url: '/alerts' },
  { slug: 'pembayaran-index', url: '/pembayaran' },
  { slug: 'data', url: '/data' },
  { slug: 'import', url: '/import' },
];

async function overflowReport(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    // page-level horizontal scroll?
    const docOverflow = document.documentElement.scrollWidth - vw;
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      // element extends past right viewport edge by >2px
      if (r.right > vw + 2) {
        const cls = (el.className && el.className.toString().slice(0, 40)) || '';
        bad.push({ tag: el.tagName.toLowerCase(), cls, right: Math.round(r.right), vw, txt: (el.textContent || '').trim().slice(0, 30) });
      }
    });
    // dedupe by tag+cls, keep worst
    const seen = {};
    bad.forEach(b => { const k = b.tag + '.' + b.cls; if (!seen[k] || b.right > seen[k].right) seen[k] = b; });
    return { docOverflow, offenders: Object.values(seen).slice(0, 25) };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // login
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', PASS);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // discover a kampus id + student id from kampus index
  await page.goto(BASE + '/kampus', { waitUntil: 'networkidle' });
  const kampusId = await page.evaluate(() => {
    const a = document.querySelector('a[href*="/kampus/"]');
    if (!a) return 1;
    const m = a.getAttribute('href').match(/\/kampus\/(\d+)/);
    return m ? m[1] : 1;
  });
  const pages = [...PAGES,
    { slug: 'kampus-show', url: `/kampus/${kampusId}` },
    { slug: 'kampus-edit', url: `/kampus/${kampusId}/edit` },
    { slug: 'pembayaran-show', url: `/kampus/${kampusId}/pembayaran` },
  ];

  const report = {};
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const p of pages) {
      await page.goto(BASE + p.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const file = path.join(OUT, `${p.slug}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const ov = await overflowReport(page);
      report[`${p.slug}-${vp.name}`] = ov;
    }
  }
  // also login page
  await ctx.clearCookies();
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, `login-${vp.name}.png`), fullPage: true });
  }

  fs.writeFileSync(path.join(OUT, 'overflow-report.json'), JSON.stringify(report, null, 2));
  console.log('SHOTS_DIR=' + OUT);
  console.log('=== OVERFLOW SUMMARY (offenders past viewport right edge) ===');
  for (const [k, v] of Object.entries(report)) {
    if (v.docOverflow > 1 || v.offenders.length) {
      console.log(`\n[${k}] docOverflow=${v.docOverflow}px`);
      v.offenders.forEach(o => console.log(`   ${o.tag}.${o.cls}  right=${o.right} vw=${o.vw}  "${o.txt}"`));
    }
  }
  console.log('\nDONE');
  await browser.close();
})();
