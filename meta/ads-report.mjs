#!/usr/bin/env node
// Read-only Meta (Facebook/Instagram) ads report.
// Pulls last-7-days campaign insights and prints a compact table.
// Setup: see meta/SETUP.md. Needs META_ACCESS_TOKEN, META_AD_ACCOUNT_ID in .env.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env reader (no dotenv dependency). Only reads the keys we need.
function loadEnv() {
  const out = {};
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      out[m[1]] = v;
    }
  } catch {
    // .env missing is handled below via the required-key check
  }
  return out;
}

function fail(msg) {
  console.error('\n  Meta ads report failed.\n  ' + msg + '\n');
  process.exit(1);
}

const env = loadEnv();
const TOKEN = env.META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const ACCOUNT = env.META_AD_ACCOUNT_ID || process.env.META_AD_ACCOUNT_ID;
const VERSION = env.META_API_VERSION || process.env.META_API_VERSION || 'v23.0';

if (!TOKEN || !ACCOUNT) {
  fail(
    'Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID in .env.\n' +
    '  Follow meta/SETUP.md to create a System User token and find your act_<id>.'
  );
}
const accountId = ACCOUNT.startsWith('act_') ? ACCOUNT : 'act_' + ACCOUNT;

const fields = 'campaign_name,spend,impressions,clicks,ctr,actions';
const url =
  `https://graph.facebook.com/${VERSION}/${accountId}/insights` +
  `?level=campaign&date_preset=last_7d&limit=100` +
  `&fields=${encodeURIComponent(fields)}` +
  `&access_token=${encodeURIComponent(TOKEN)}`;

let payload;
try {
  const res = await fetch(url);
  payload = await res.json();
} catch (e) {
  fail('Network error reaching the Meta API: ' + e.message);
}

if (payload.error) {
  const err = payload.error;
  let hint = '';
  if (err.code === 190) hint = '\n  -> Token is invalid or expired. Regenerate the System User token (SETUP.md step 2).';
  else if (err.code === 200 || err.code === 10) hint = '\n  -> Missing permission. Token needs ads_read + the System User must have access to this ad account (SETUP.md step 3).';
  else if (err.code === 100) hint = '\n  -> Bad account ID or field. Check META_AD_ACCOUNT_ID is act_<digits> (SETUP.md step 4).';
  fail(`Meta API error (code ${err.code}): ${err.message}${hint}`);
}

const rows = payload.data || [];
if (rows.length === 0) {
  console.log('\n  No campaign data in the last 7 days. (No active campaigns, or none delivered.)\n');
  process.exit(0);
}

// Pull a "results" count out of the actions array (leads, purchases, link clicks, etc.).
function results(actions) {
  if (!Array.isArray(actions)) return '-';
  const priority = ['lead', 'purchase', 'offsite_conversion.fb_pixel_lead', 'link_click'];
  for (const type of priority) {
    const hit = actions.find((a) => a.action_type === type);
    if (hit) return `${hit.value} (${type.replace('offsite_conversion.fb_pixel_', '')})`;
  }
  return actions.length ? `${actions[0].value} (${actions[0].action_type})` : '-';
}

const money = (n) => Number(n || 0).toFixed(2);
const int = (n) => Number(n || 0).toLocaleString('en-US');

console.log(`\n  Meta ads - last 7 days (${accountId}, ${VERSION})\n`);
const header = ['Campaign', 'Spend', 'Impr', 'Clicks', 'CTR%', 'Results'];
const table = rows.map((r) => [
  (r.campaign_name || '(unnamed)').slice(0, 34),
  money(r.spend),
  int(r.impressions),
  int(r.clicks),
  Number(r.ctr || 0).toFixed(2),
  results(r.actions),
]);

// Column widths.
const widths = header.map((h, i) =>
  Math.max(h.length, ...table.map((row) => String(row[i]).length))
);
const line = (cols) => '  ' + cols.map((c, i) => String(c).padEnd(widths[i])).join('  ');
console.log(line(header));
console.log('  ' + widths.map((w) => '-'.repeat(w)).join('  '));
for (const row of table) console.log(line(row));

// Flags: zero delivery, or spend with no clicks.
const flags = [];
let totalSpend = 0;
for (const r of rows) {
  totalSpend += Number(r.spend || 0);
  const name = r.campaign_name || '(unnamed)';
  if (Number(r.spend || 0) > 0 && Number(r.impressions || 0) === 0)
    flags.push(`spending but not delivering: ${name}`);
  if (Number(r.spend || 0) > 0 && Number(r.clicks || 0) === 0)
    flags.push(`spend with zero clicks: ${name}`);
}
console.log(`\n  Total spend (7d): ${money(totalSpend)}`);
if (flags.length) {
  console.log('\n  Flags:');
  for (const f of flags) console.log('  ! ' + f);
}
console.log('');
