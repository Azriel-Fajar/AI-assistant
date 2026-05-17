// Cross-browser smoke matrix template.
// Customize: BASE_URL, BROWSERS, FLOWS.
// Run: node cross-browser-check.js
const path = require('path');
const fs = require('fs');

// ---- CONFIG (override per project) ----
const BASE_URL = process.env.BASE_URL || 'http://localhost/';
const BROWSERS = (process.env.BROWSERS || 'chromium,firefox,webkit').split(',');
const SHOT_DIR = path.join(process.cwd(), 'screenshots', 'cross-browser');
const HEADLESS = process.env.HEADLESS === '1';
const SLOW_MO  = parseInt(process.env.SLOW_MO || '100', 10);

// ---- FLOWS — each returns {name, fn(page) -> Promise<void>} ----
// fn must throw on failure. Use expect-style asserts via plain JS.
const FLOWS = [
  {
    name: 'home-renders',
    fn: async (page) => {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const headingCount = await page.locator('h1, h2').count();
      if (headingCount === 0) throw new Error('no h1/h2 on home');
      const bodyText = (await page.locator('body').innerText()).trim();
      if (bodyText.length < 50) throw new Error('body text too short: ' + bodyText.length);
    },
  },
  {
    name: 'no-console-errors',
    fn: async (page) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
      });
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1500);
      // Ignore favicon 404s and known third-party noise
      const real = errors.filter(e => !/favicon|gtag|google-analytics|analytics\.js/i.test(e));
      if (real.length > 0) throw new Error('errors: ' + real.slice(0, 3).join(' | '));
    },
  },
  // Add project-specific flows here. Example chatbot flow:
  // {
  //   name: 'chatbot-opens',
  //   fn: async (page) => {
  //     await page.goto(BASE_URL);
  //     await page.click('#chatbot-icon', { timeout: 5000 });
  //     await page.fill('#user-input', 'hi');
  //     await page.click('#send-btn');
  //     await page.waitForSelector('.message.bot', { timeout: 15000 });
  //   },
  // },
];

// ---- RUNNER ----
async function runBrowser(browserName) {
  const playwright = require('playwright');
  const launcher = playwright[browserName];
  if (!launcher) return { browser: browserName, results: [], skipped: 'no launcher' };

  const launchOpts = { headless: HEADLESS, slowMo: SLOW_MO };
  // Channel browsers (msedge, chrome) launch via chromium with a channel
  let browser;
  try {
    if (browserName === 'msedge' || browserName === 'chrome') {
      browser = await playwright.chromium.launch({ ...launchOpts, channel: browserName });
    } else {
      browser = await launcher.launch(launchOpts);
    }
  } catch (e) {
    return { browser: browserName, results: [], skipped: 'launch failed: ' + e.message };
  }

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const results = [];

  for (const flow of FLOWS) {
    const t0 = Date.now();
    try {
      await flow.fn(page);
      results.push({ flow: flow.name, status: 'PASS', ms: Date.now() - t0 });
    } catch (e) {
      const shotDir = path.join(SHOT_DIR, browserName);
      fs.mkdirSync(shotDir, { recursive: true });
      const shot = path.join(shotDir, `${flow.name}.png`);
      try { await page.screenshot({ path: shot, fullPage: false }); } catch (_) {}
      results.push({
        flow: flow.name,
        status: 'FAIL',
        ms: Date.now() - t0,
        err: (e.message || String(e)).split('\n')[0].slice(0, 200),
        shot,
      });
    }
  }

  await browser.close();
  return { browser: browserName, results };
}

(async () => {
  console.log(`[cross-browser] BASE=${BASE_URL}  BROWSERS=${BROWSERS.join(',')}  HEADLESS=${HEADLESS}`);
  const all = [];
  for (const b of BROWSERS) {
    console.log(`\n[cross-browser] === ${b} ===`);
    const r = await runBrowser(b.trim());
    all.push(r);
    if (r.skipped) {
      console.log(`  SKIPPED: ${r.skipped}`);
      continue;
    }
    for (const x of r.results) {
      const tag = x.status === 'PASS' ? 'PASS' : 'FAIL';
      console.log(`  ${tag}  ${x.flow.padEnd(28)} ${x.ms}ms${x.err ? '  — ' + x.err : ''}`);
      if (x.shot && x.status === 'FAIL') console.log(`        shot: ${x.shot}`);
    }
  }

  // Matrix print
  console.log('\n[cross-browser] ===== MATRIX =====');
  const flowNames = FLOWS.map(f => f.name);
  const header = 'Flow'.padEnd(28) + BROWSERS.map(b => b.padEnd(10)).join('');
  console.log(header);
  for (const fn of flowNames) {
    let row = fn.padEnd(28);
    for (const b of BROWSERS) {
      const r = all.find(x => x.browser === b.trim());
      if (r.skipped) { row += 'SKIP'.padEnd(10); continue; }
      const cell = r.results.find(x => x.flow === fn);
      row += (cell ? cell.status : '?').padEnd(10);
    }
    console.log(row);
  }

  const anyFail = all.some(r => r.results && r.results.some(x => x.status === 'FAIL'));
  console.log(`\n[cross-browser] OVERALL: ${anyFail ? 'FAIL' : 'PASS'}`);
  process.exit(anyFail ? 1 : 0);
})();
