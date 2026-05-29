// Playwright review of Rielcode pages: HTTP status, console errors, broken assets, mobile check.
const { chromium, devices } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost/Rielcode';
const PAGES = [
  '/index.php',
  '/about.php',
  '/projects.php',
  '/testimonials.php',
  '/requirement.php',
  '/package.php',
  '/admin_login.php',
  '/checkout/index.php',
  '/client-brief/index.php',
  '/client-brief/thanks.php',
  '/custom-plan/index.php',
  '/order-form/index.php',
  '/portfolio/index.php',
  '/progress/index.php',
  '/referrer/index.php',
  '/terms&conditions/index.php',
  '/testimonials-app/index.php',
  '/testimonials-app/submit.php',
  '/testimonials-app/thank-you.php',
  '/packages/index.php',
];

const OUT = path.join(__dirname, '..', 'screenshots', 'rielcode-review');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const report = [];

  for (const viewport of [
    { name: 'desktop', opts: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', opts: devices['iPhone 13'] },
  ]) {
    const ctx = await browser.newContext(viewport.opts);
    for (const p of PAGES) {
      const url = BASE + p;
      const page = await ctx.newPage();
      const consoleErrors = [];
      const failedAssets = [];
      let mainStatus = null;

      page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
      page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));
      page.on('response', r => {
        if (r.url() === url) mainStatus = r.status();
        if (r.status() >= 400) failedAssets.push(`${r.status()} ${r.url()}`);
      });

      let navErr = null;
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        if (mainStatus === null && resp) mainStatus = resp.status();
      } catch (e) { navErr = e.message; }

      report.push({
        viewport: viewport.name,
        path: p,
        status: mainStatus,
        navError: navErr,
        consoleErrors,
        failedAssets,
      });
      await page.close();
    }
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

  // Markdown summary
  const md = ['# Rielcode Page Review', '', `Base: ${BASE}`, `Date: ${new Date().toISOString()}`, ''];
  for (const vp of ['desktop', 'mobile']) {
    md.push(`## ${vp}`, '', '| Path | Status | Console errs | Failed assets |', '|---|---|---|---|');
    for (const r of report.filter(x => x.viewport === vp)) {
      md.push(`| ${r.path} | ${r.navError ? 'NAVERR' : r.status} | ${r.consoleErrors.length} | ${r.failedAssets.length} |`);
    }
    md.push('');
  }
  md.push('## Details (issues only)', '');
  for (const r of report) {
    if (r.navError || (r.status && r.status >= 400) || r.consoleErrors.length || r.failedAssets.length) {
      md.push(`### [${r.viewport}] ${r.path}`);
      if (r.navError) md.push(`- navError: ${r.navError}`);
      md.push(`- status: ${r.status}`);
      if (r.consoleErrors.length) { md.push('- console:'); r.consoleErrors.forEach(e => md.push(`  - ${e}`)); }
      if (r.failedAssets.length) { md.push('- failed assets:'); r.failedAssets.forEach(e => md.push(`  - ${e}`)); }
      md.push('');
    }
  }
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), md.join('\n'));
  console.log('Done. Report:', path.join(OUT, 'REPORT.md'));
})();
