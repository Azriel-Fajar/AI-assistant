#!/usr/bin/env node
// Sync Facebook Page Messenger conversations into per-client markdown files.
// One file per client (meta/clients/<slug>.md) with full message history,
// plus an index.md roster. Re-run any time to refresh; new clients get new files.
// Needs META_PAGE_ACCESS_TOKEN (or META_ACCESS_TOKEN) + META_PAGE_ID in .env.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'meta', 'clients');

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
  } catch { /* handled below */ }
  return out;
}

function fail(msg) {
  console.error('\n  DM sync failed.\n  ' + msg + '\n');
  process.exit(1);
}

const env = loadEnv();
const TOKEN = env.META_PAGE_ACCESS_TOKEN || env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
const PAGE_ID = env.META_PAGE_ID || process.env.META_PAGE_ID;
const VERSION = env.META_API_VERSION || 'v23.0';

if (!TOKEN) fail('Missing META_PAGE_ACCESS_TOKEN in .env.');
if (!PAGE_ID) fail('Missing META_PAGE_ID in .env.');

async function apiFetch(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) {
    const e = data.error;
    let hint = '';
    if (e.code === 190) hint = ' -> Token invalid or expired. Regenerate Page access token.';
    if (e.code === 10 || e.code === 200) hint = ' -> Missing permission. Token needs pages_messaging + pages_manage_metadata.';
    fail(`Meta API error (code ${e.code}): ${e.message}${hint}`);
  }
  return data;
}

// kebab-case slug, ascii-safe, collision-proof enough for filenames.
function slugify(name) {
  const s = (name || 'unknown')
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'unknown';
}

function fmt(iso, withYear = true) {
  const d = new Date(iso);
  if (isNaN(d)) return iso || '';
  return d.toLocaleString('en-US', withYear
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Page through all messages of a thread (Graph caps each page at 50).
async function fetchAllMessages(threadId) {
  let url =
    `https://graph.facebook.com/${VERSION}/${threadId}/messages` +
    `?fields=message,from,created_time,attachments&limit=50` +
    `&access_token=${encodeURIComponent(TOKEN)}`;
  const all = [];
  while (url) {
    const page = await apiFetch(url);
    all.push(...(page.data || []));
    url = page.paging?.next || null;
  }
  return all.reverse(); // oldest first
}

const convoUrl =
  `https://graph.facebook.com/${VERSION}/${PAGE_ID}/conversations` +
  `?fields=id,updated_time,participants,message_count&limit=50` +
  `&access_token=${encodeURIComponent(TOKEN)}`;

let convos;
try {
  convos = await apiFetch(convoUrl);
} catch (e) {
  fail('Network error: ' + e.message);
}

const threads = convos.data || [];
if (threads.length === 0) {
  console.log('\n  No conversations found. Nothing to sync.\n');
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

const usedSlugs = new Map(); // slug -> count, to disambiguate name collisions
const roster = [];

for (const thread of threads) {
  const participants = thread.participants?.data || [];
  const sender = participants.find(p => p.id !== PAGE_ID)?.name || '(unknown)';

  let slug = slugify(sender);
  if (usedSlugs.has(slug)) {
    const n = usedSlugs.get(slug) + 1;
    usedSlugs.set(slug, n);
    slug = `${slug}-${n}`;
  } else {
    usedSlugs.set(slug, 1);
  }

  const messages = await fetchAllMessages(thread.id);
  const updated = fmt(thread.updated_time);
  const firstContact = messages.length ? fmt(messages[0].created_time) : updated;
  const count = thread.message_count ?? messages.length;

  // Build markdown body.
  const lines = [];
  lines.push(`# ${sender}`);
  lines.push('');
  lines.push(`- **Page:** ${PAGE_ID}`);
  lines.push(`- **First contact:** ${firstContact}`);
  lines.push(`- **Last active:** ${updated}`);
  lines.push(`- **Messages:** ${count}`);
  lines.push(`- **Thread ID:** ${thread.id}`);
  lines.push(`- **Synced:** ${fmt(new Date().toISOString())}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  for (const m of messages) {
    const who = (m.from?.name === sender) ? sender : 'Rielcode';
    const text = m.message || (m.attachments ? '(attachment)' : '(empty)');
    lines.push(`**${who}** · _${fmt(m.created_time, false)}_`);
    lines.push('');
    lines.push(text.split('\n').map(l => '> ' + l).join('\n'));
    lines.push('');
  }

  const file = join(OUT_DIR, `${slug}.md`);
  writeFileSync(file, lines.join('\n'), 'utf8');
  roster.push({ sender, slug, updated, count });
  console.log(`  wrote meta/clients/${slug}.md  (${count} msgs)`);
}

// Roster index.
const idx = [];
idx.push('# Messenger clients');
idx.push('');
idx.push(`_Synced ${fmt(new Date().toISOString())} · Page ${PAGE_ID} · ${roster.length} conversations_`);
idx.push('');
idx.push('| Client | Last active | Msgs | File |');
idx.push('|--------|-------------|------|------|');
for (const r of roster) {
  idx.push(`| ${r.sender} | ${r.updated} | ${r.count} | [${r.slug}.md](${r.slug}.md) |`);
}
idx.push('');
writeFileSync(join(OUT_DIR, 'index.md'), idx.join('\n'), 'utf8');

console.log(`\n  Synced ${roster.length} clients -> meta/clients/  (index.md updated)\n`);
