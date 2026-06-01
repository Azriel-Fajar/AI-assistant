#!/usr/bin/env node
// Read-only Facebook Page Messenger DM reader.
// Shows recent conversations + latest message per thread.
// Needs META_ACCESS_TOKEN (Page token), META_PAGE_ID in .env.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

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
  console.error('\n  DM report failed.\n  ' + msg + '\n');
  process.exit(1);
}

const env = loadEnv();
const TOKEN  = env.META_PAGE_ACCESS_TOKEN || env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
const PAGE_ID = env.META_PAGE_ID || process.env.META_PAGE_ID;
const VERSION = env.META_API_VERSION || 'v23.0';
const LIMIT   = 20;

// --thread "Name" flag
const threadArg = (() => {
  const i = process.argv.indexOf('--thread');
  return i !== -1 ? process.argv[i + 1]?.toLowerCase() : null;
})();

if (!TOKEN)   fail('Missing META_PAGE_ACCESS_TOKEN in .env.');
if (!PAGE_ID) fail('Missing META_PAGE_ID in .env.');

async function apiFetch(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) {
    const e = data.error;
    let hint = '';
    if (e.code === 190)  hint = ' -> Token invalid or expired. Regenerate Page access token.';
    if (e.code === 10 || e.code === 200) hint = ' -> Missing permission. Token needs pages_messaging + pages_manage_metadata.';
    fail(`Meta API error (code ${e.code}): ${e.message}${hint}`);
  }
  return data;
}

// Fetch conversations list
const convoUrl =
  `https://graph.facebook.com/${VERSION}/${PAGE_ID}/conversations` +
  `?fields=id,updated_time,participants,message_count` +
  `&limit=${LIMIT}` +
  `&access_token=${encodeURIComponent(TOKEN)}`;

let convos;
try {
  convos = await apiFetch(convoUrl);
} catch (e) {
  fail('Network error: ' + e.message);
}

const threads = convos.data || [];
if (threads.length === 0) {
  console.log('\n  No conversations found.\n');
  process.exit(0);
}

console.log(`\n  Facebook Page DMs - last ${threads.length} conversations (Page ${PAGE_ID})\n`);

for (const thread of threads) {
  const participants = thread.participants?.data || [];
  const sender = participants.find(p => p.id !== PAGE_ID)?.name || '(unknown)';
  const updated = new Date(thread.updated_time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const msgCount = thread.message_count ? `${thread.message_count} msgs` : '';

  // --thread mode: show full history for matched thread
  if (threadArg) {
    if (!sender.toLowerCase().includes(threadArg)) continue;
    console.log(`  Thread: ${sender}  |  ${updated}  |  ${msgCount}\n`);
    const allMsgsUrl =
      `https://graph.facebook.com/${VERSION}/${thread.id}/messages` +
      `?fields=message,from,created_time,attachments&limit=50` +
      `&access_token=${encodeURIComponent(TOKEN)}`;
    const allMsgs = await apiFetch(allMsgsUrl);
    const msgs = (allMsgs.data || []).reverse(); // oldest first
    for (const msg of msgs) {
      const time = new Date(msg.created_time).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
      const who = msg.from?.name === sender ? '[Them]' : '[You] ';
      const text = msg.message || (msg.attachments ? '(attachment)' : '(empty)');
      console.log(`  ${time}  ${who}  ${text}`);
    }
    console.log('');
    process.exit(0);
  }

  // Default: summary view - fetch last message only
  const msgUrl =
    `https://graph.facebook.com/${VERSION}/${thread.id}/messages` +
    `?fields=message,from,created_time&limit=1` +
    `&access_token=${encodeURIComponent(TOKEN)}`;

  let latest = '(could not load)';
  let fromName = '';
  try {
    const msgs = await apiFetch(msgUrl);
    const msg = msgs.data?.[0];
    if (msg) {
      latest = (msg.message || '(no text - attachment?)').slice(0, 120);
      fromName = msg.from?.name || '';
    }
  } catch { /* skip */ }

  const direction = fromName && fromName !== sender ? '[You]' : '[Them]';

  console.log(`  From : ${sender}`);
  console.log(`  When : ${updated}  ${msgCount}`);
  console.log(`  Last : ${direction} ${latest}`);
  console.log('  ' + '-'.repeat(72));
}

if (threadArg) {
  console.log(`  No thread found matching "${threadArg}"\n`);
} else {
  console.log('');
}
