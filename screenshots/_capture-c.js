#!/usr/bin/env node
const { chromium } = require(require('path').join(process.cwd(), 'node_modules', 'playwright'));
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(process.cwd(), 'screenshots');
const VIEWPORT = { width: 1920, height: 1080 };
const NAV_TIMEOUT = 30000;
const POST_LOAD_DELAY = 2000;

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
function slugify(url) {
  try {
    const u = new URL(url);
    let s = (u.hostname + u.pathname).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s.slice(0, 60) || 'screenshot';
  } catch { return 'screenshot'; }
}
function normalizeUrl(raw) {
  const t = raw.trim().replace(/,$/, '');
  if (!t) return null;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}
async function captureOne(browser, url) {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: NAV_TIMEOUT });
    await page.waitForTimeout(POST_LOAD_DELAY);
    const fp = path.join(OUTPUT_DIR, `${slugify(url)}-${timestamp()}.png`);
    await page.screenshot({ path: fp, fullPage: true });
    return { ok: true, url, filepath: fp };
  } catch (err) {
    return { ok: false, url, error: err.message };
  } finally { await ctx.close(); }
}
(async () => {
  const args = process.argv.slice(2).flatMap((a) => a.split(/[\s,]+/)).map(normalizeUrl).filter(Boolean);
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const url of args) {
    process.stderr.write(`Capturing ${url} ... `);
    const r = await captureOne(browser, url);
    process.stderr.write(r.ok ? 'OK\n' : `FAIL (${r.error})\n`);
    results.push(r);
  }
  await browser.close();
  const oks = results.filter((r) => r.ok), fails = results.filter((r) => !r.ok);
  if (oks.length) { console.log('\nSaved:'); oks.forEach((r) => console.log(`  ${r.url} -> ${r.filepath}`)); }
  if (fails.length) { console.log('\nFailed:'); fails.forEach((r) => console.log(`  ${r.url}: ${r.error}`)); }
  process.exit(fails.length && !oks.length ? 1 : 0);
})();
