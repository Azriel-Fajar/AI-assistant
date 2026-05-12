#!/usr/bin/env node
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUTPUT_DIR = path.join(ROOT, 'screenshots');
const NAV_TIMEOUT = 30000;
const POST_LOAD_DELAY = 1500;

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function slugify(url) {
  try {
    const u = new URL(url);
    let s = (u.hostname + u.pathname).toLowerCase();
    s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s.slice(0, 60) || 'screenshot';
  } catch {
    return 'screenshot';
  }
}

function normalizeUrl(raw) {
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseArgs(argv) {
  const out = { url: null, selector: null, mobile: false, viewport: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--selector') { out.selector = argv[++i]; }
    else if (a === '--mobile') { out.mobile = true; }
    else if (a === '--viewport') {
      const m = String(argv[++i]).match(/^(\d+)x(\d+)$/i);
      if (m) out.viewport = { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
    } else { rest.push(a); }
  }
  out.url = rest[0] ? normalizeUrl(rest[0]) : null;
  return out;
}

(async () => {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.url) {
    console.error('Usage: node screenshot.js <url> [--selector <css>] [--mobile] [--viewport WxH]');
    process.exit(1);
  }
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  let contextOpts = { viewport: opts.viewport || { width: 1920, height: 1080 } };
  if (opts.mobile) contextOpts = { ...devices['iPhone 13'] };
  else if (opts.viewport) contextOpts.viewport = opts.viewport;

  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();

  try {
    await page.goto(opts.url, { waitUntil: 'networkidle', timeout: NAV_TIMEOUT });
    await page.waitForTimeout(POST_LOAD_DELAY);

    const tag = [
      opts.selector ? 'el-' + opts.selector.replace(/[^a-z0-9]+/gi, '-').slice(0, 30) : null,
      opts.mobile ? 'mobile' : null,
      opts.viewport ? `${opts.viewport.width}x${opts.viewport.height}` : null,
    ].filter(Boolean).join('-');
    const suffix = tag ? `-${tag}` : '';
    const filename = `${slugify(opts.url)}${suffix}-${timestamp()}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (opts.selector) {
      const el = await page.locator(opts.selector).first();
      await el.screenshot({ path: filepath });
    } else {
      await page.screenshot({ path: filepath, fullPage: false });
    }
    console.log(`OK: ${filepath}`);
  } catch (err) {
    console.error(`FAIL: ${err.message}`);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
})();
