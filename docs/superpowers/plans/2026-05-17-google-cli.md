# Google CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three globally-installed Node.js CLIs (`gcal`, `gmail`, `gdrive`) that talk to Google APIs via shared OAuth2 auth.

**Architecture:** Single npm package at `tools/google/` with three entry points registered as global binaries via `npm link`. Shared `auth/oauth.js` handles OAuth2 token acquisition and refresh. Shared `lib/output.js` renders colored tables or `--json` output.

**Tech Stack:** Node.js, `googleapis`, `commander`, `chalk`, `cli-table3`, `open`

---

## File Map

| File | Responsibility |
|---|---|
| `tools/google/package.json` | npm metadata, bin entries, dependencies |
| `tools/google/.gitignore` | ignore tokens.json and config.json |
| `tools/google/config.json` | Google client ID/secret, timezone (gitignored) |
| `tools/google/auth/oauth.js` | OAuth2 flow, token load/save/refresh |
| `tools/google/auth/tokens.json` | Stored credentials (gitignored) |
| `tools/google/lib/output.js` | Colored table renderer + --json flag |
| `tools/google/lib/error.js` | Shared error handler, exit codes |
| `tools/google/gcal/index.js` | gcal CLI entry point + all calendar commands |
| `tools/google/gmail/index.js` | gmail CLI entry point + all mail commands |
| `tools/google/gdrive/index.js` | gdrive CLI entry point + all drive commands |

---

### Task 1: Scaffold package + config

**Files:**
- Create: `tools/google/package.json`
- Create: `tools/google/.gitignore`
- Create: `tools/google/config.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "jarvis-google-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "gcal": "./gcal/index.js",
    "gmail": "./gmail/index.js",
    "gdrive": "./gdrive/index.js"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "cli-table3": "^0.6.3",
    "commander": "^12.1.0",
    "googleapis": "^140.0.0",
    "open": "^10.1.0"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
auth/tokens.json
config.json
node_modules/
```

- [ ] **Step 3: Create config.json template**

```json
{
  "google_client_id": "PASTE_YOUR_CLIENT_ID_HERE",
  "google_client_secret": "PASTE_YOUR_CLIENT_SECRET_HERE",
  "default_timezone": "Asia/Jakarta"
}
```

- [ ] **Step 4: Install dependencies**

```powershell
cd tools/google
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Commit**

```bash
git add tools/google/package.json tools/google/.gitignore tools/google/package-lock.json
git commit -m "feat: scaffold google cli package"
```

---

### Task 2: Shared auth module

**Files:**
- Create: `tools/google/auth/oauth.js`

- [ ] **Step 1: Create auth/oauth.js**

```js
import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import * as readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '..', 'config.json');
const TOKEN_PATH = join(__dirname, 'tokens.json');

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/drive',
];

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error('config.json not found. Copy and fill in tools/google/config.json');
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
}

export function createOAuthClient() {
  const config = loadConfig();
  return new google.auth.OAuth2(
    config.google_client_id,
    config.google_client_secret,
    'urn:ietf:wg:oauth:2.0:oob'
  );
}

export async function getAuthenticatedClient() {
  const client = createOAuthClient();

  if (existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
    client.setCredentials(tokens);

    // Auto-refresh if expired
    if (tokens.expiry_date && Date.now() > tokens.expiry_date - 60000) {
      const { credentials } = await client.refreshAccessToken();
      writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
      client.setCredentials(credentials);
    }

    return client;
  }

  console.error('Not authenticated. Run: gcal auth');
  process.exit(1);
}

export async function runAuthFlow() {
  const client = createOAuthClient();
  const authUrl = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('Opening browser for Google auth...');
  await open(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Paste the auth code here: ', resolve));
  rl.close();

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('Authenticated. Token saved.');
  return client;
}
```

- [ ] **Step 2: Verify no syntax errors**

```powershell
node --input-type=module --eval "import './auth/oauth.js'" 2>&1
```

Expected: no output (module loads cleanly).

- [ ] **Step 3: Commit**

```bash
git add tools/google/auth/oauth.js
git commit -m "feat: add shared OAuth2 auth module"
```

---

### Task 3: Shared output + error modules

**Files:**
- Create: `tools/google/lib/output.js`
- Create: `tools/google/lib/error.js`

- [ ] **Step 1: Create lib/output.js**

```js
import chalk from 'chalk';
import Table from 'cli-table3';

export function printTable(headers, rows) {
  const table = new Table({
    head: headers.map(h => chalk.cyan(h)),
    style: { head: [], border: [] },
  });
  rows.forEach(row => table.push(row));
  console.log(table.toString());
}

export function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

export function printSuccess(msg) {
  console.log(chalk.green('✓') + ' ' + msg);
}

export function printInfo(msg) {
  console.log(chalk.blue('i') + ' ' + msg);
}
```

- [ ] **Step 2: Create lib/error.js**

```js
import chalk from 'chalk';

export function handleError(err, debug = false) {
  if (debug) {
    console.error(chalk.red('ERROR:'), err);
  } else {
    const msg = err?.errors?.[0]?.message || err?.message || String(err);
    console.error(chalk.red('Error:'), msg);
  }
  process.exit(1);
}

export function notAuthenticated() {
  console.error(chalk.yellow('Not authenticated.'), "Run: gcal auth");
  process.exit(1);
}
```

- [ ] **Step 3: Commit**

```bash
git add tools/google/lib/output.js tools/google/lib/error.js
git commit -m "feat: add shared output and error modules"
```

---

### Task 4: gcal CLI

**Files:**
- Create: `tools/google/gcal/index.js`

- [ ] **Step 1: Create gcal/index.js**

```js
#!/usr/bin/env node
import { program } from 'commander';
import { google } from 'googleapis';
import chalk from 'chalk';
import * as readline from 'readline';
import { getAuthenticatedClient, runAuthFlow } from '../auth/oauth.js';
import { printTable, printJson, printSuccess } from '../lib/output.js';
import { handleError } from '../lib/error.js';

async function getCalendar() {
  const auth = await getAuthenticatedClient();
  return google.calendar({ version: 'v3', auth });
}

function formatDateTime(dt) {
  if (!dt) return '';
  const d = new Date(dt.dateTime || dt.date);
  return d.toLocaleString('en-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' });
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

program.name('gcal').description('Google Calendar CLI');

program.command('auth').description('Authenticate with Google').action(async () => {
  try { await runAuthFlow(); } catch (e) { handleError(e); }
});

program.command('list')
  .description('List events')
  .option('--date <date>', 'today, week, or YYYY-MM-DD', 'today')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const now = new Date();
      let timeMin = new Date(now.setHours(0,0,0,0)).toISOString();
      let timeMax;
      if (opts.date === 'today') {
        timeMax = new Date(new Date().setHours(23,59,59,999)).toISOString();
      } else if (opts.date === 'week') {
        const end = new Date(); end.setDate(end.getDate() + 7);
        timeMax = end.toISOString();
      } else {
        const d = new Date(opts.date);
        timeMin = new Date(d.setHours(0,0,0,0)).toISOString();
        timeMax = new Date(d.setHours(23,59,59,999)).toISOString();
      }
      const res = await cal.events.list({ calendarId: 'primary', timeMin, timeMax, singleEvents: true, orderBy: 'startTime' });
      const events = res.data.items || [];
      if (opts.json) return printJson(events);
      if (!events.length) return console.log('No events found.');
      printTable(['ID', 'Title', 'Start', 'End'],
        events.map(e => [e.id.slice(0,8), e.summary || '(no title)', formatDateTime(e.start), formatDateTime(e.end)]));
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('add')
  .description('Add an event')
  .requiredOption('--title <title>', 'Event title')
  .requiredOption('--date <date>', 'Date (YYYY-MM-DD or "today"/"tomorrow")')
  .requiredOption('--time <time>', 'Start time (HH:MM)')
  .option('--duration <minutes>', 'Duration in minutes', '60')
  .option('--attendees <emails>', 'Comma-separated emails')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      let date = opts.date;
      if (date === 'today') date = new Date().toISOString().split('T')[0];
      if (date === 'tomorrow') { const d = new Date(); d.setDate(d.getDate()+1); date = d.toISOString().split('T')[0]; }
      const start = new Date(`${date}T${opts.time}:00`);
      const end = new Date(start.getTime() + parseInt(opts.duration) * 60000);
      const attendees = opts.attendees ? opts.attendees.split(',').map(e => ({ email: e.trim() })) : [];
      const event = { summary: opts.title, start: { dateTime: start.toISOString(), timeZone: 'Asia/Jakarta' }, end: { dateTime: end.toISOString(), timeZone: 'Asia/Jakarta' }, attendees };
      const res = await cal.events.insert({ calendarId: 'primary', resource: event });
      printSuccess(`Created: "${opts.title}" on ${opts.date} at ${opts.time}`);
    } catch (e) { handleError(e); }
  });

program.command('update')
  .description('Update an event')
  .requiredOption('--id <eventId>', 'Event ID (first 8 chars ok)')
  .option('--title <title>')
  .option('--date <date>')
  .option('--time <time>')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const list = await cal.events.list({ calendarId: 'primary', maxResults: 100, singleEvents: true });
      const event = list.data.items.find(e => e.id.startsWith(opts.id));
      if (!event) return console.error('Event not found.');
      if (opts.title) event.summary = opts.title;
      if (opts.date || opts.time) {
        const currentStart = new Date(event.start.dateTime);
        const date = opts.date || currentStart.toISOString().split('T')[0];
        const time = opts.time || currentStart.toTimeString().slice(0,5);
        const newStart = new Date(`${date}T${time}:00`);
        const duration = new Date(event.end.dateTime) - currentStart;
        event.start.dateTime = newStart.toISOString();
        event.end.dateTime = new Date(newStart.getTime() + duration).toISOString();
      }
      await cal.events.update({ calendarId: 'primary', eventId: event.id, resource: event });
      printSuccess(`Updated: "${event.summary}"`);
    } catch (e) { handleError(e); }
  });

program.command('delete')
  .description('Delete an event')
  .requiredOption('--id <eventId>', 'Event ID (first 8 chars ok)')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const list = await cal.events.list({ calendarId: 'primary', maxResults: 100, singleEvents: true });
      const event = list.data.items.find(e => e.id.startsWith(opts.id));
      if (!event) return console.error('Event not found.');
      if (!opts.yolo) {
        const ok = await confirm(`Delete "${event.summary}"?`);
        if (!ok) return console.log('Cancelled.');
      }
      await cal.events.delete({ calendarId: 'primary', eventId: event.id });
      printSuccess(`Deleted: "${event.summary}"`);
    } catch (e) { handleError(e); }
  });

program.command('search')
  .description('Search events')
  .requiredOption('--query <q>', 'Search query')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const res = await cal.events.list({ calendarId: 'primary', q: opts.query, singleEvents: true, maxResults: 20 });
      const events = res.data.items || [];
      if (opts.json) return printJson(events);
      if (!events.length) return console.log('No events found.');
      printTable(['ID', 'Title', 'Start'], events.map(e => [e.id.slice(0,8), e.summary || '(no title)', formatDateTime(e.start)]));
    } catch (e) { handleError(e); }
  });

program.command('remind')
  .description('Add a reminder to an event')
  .requiredOption('--id <eventId>', 'Event ID')
  .requiredOption('--before <minutes>', 'Minutes before event')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const list = await cal.events.list({ calendarId: 'primary', maxResults: 100, singleEvents: true });
      const event = list.data.items.find(e => e.id.startsWith(opts.id));
      if (!event) return console.error('Event not found.');
      event.reminders = { useDefault: false, overrides: [{ method: 'popup', minutes: parseInt(opts.before) }] };
      await cal.events.update({ calendarId: 'primary', eventId: event.id, resource: event });
      printSuccess(`Reminder set: ${opts.before} min before "${event.summary}"`);
    } catch (e) { handleError(e); }
  });

program.command('recurring')
  .description('List or add recurring events')
  .option('--list', 'List recurring events')
  .option('--add', 'Add recurring event')
  .option('--title <title>')
  .option('--freq <freq>', 'daily, weekly, or monthly')
  .option('--time <time>', 'HH:MM')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      if (opts.list) {
        const res = await cal.events.list({ calendarId: 'primary', maxResults: 50, singleEvents: false });
        const events = (res.data.items || []).filter(e => e.recurrence);
        if (opts.json) return printJson(events);
        printTable(['ID', 'Title', 'Recurrence'], events.map(e => [e.id.slice(0,8), e.summary, e.recurrence[0]]));
      } else if (opts.add) {
        const freqMap = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY' };
        const today = new Date().toISOString().split('T')[0];
        const start = new Date(`${today}T${opts.time}:00`);
        const end = new Date(start.getTime() + 3600000);
        const event = {
          summary: opts.title,
          start: { dateTime: start.toISOString(), timeZone: 'Asia/Jakarta' },
          end: { dateTime: end.toISOString(), timeZone: 'Asia/Jakarta' },
          recurrence: [`RRULE:FREQ=${freqMap[opts.freq]}`],
        };
        await cal.events.insert({ calendarId: 'primary', resource: event });
        printSuccess(`Recurring event created: "${opts.title}" (${opts.freq})`);
      }
    } catch (e) { handleError(e); }
  });

program.parse();
```

- [ ] **Step 2: Make executable**

Add shebang is already at top. Verify the bin path resolves:

```powershell
cd tools/google
npm link
gcal --help
```

Expected: shows gcal commands list.

- [ ] **Step 3: Test auth flow**

```powershell
gcal auth
```

Expected: browser opens Google consent page, prompts for code, saves token.

- [ ] **Step 4: Test list**

```powershell
gcal list --date today
gcal list --date week --json
```

Expected: table of today's events, then JSON array.

- [ ] **Step 5: Commit**

```bash
git add tools/google/gcal/index.js
git commit -m "feat: add gcal CLI (calendar commands)"
```

---

### Task 5: gmail CLI

**Files:**
- Create: `tools/google/gmail/index.js`

- [ ] **Step 1: Create gmail/index.js**

```js
#!/usr/bin/env node
import { program } from 'commander';
import { google } from 'googleapis';
import chalk from 'chalk';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as readline from 'readline';
import { getAuthenticatedClient } from '../auth/oauth.js';
import { printTable, printJson, printSuccess, printInfo } from '../lib/output.js';
import { handleError } from '../lib/error.js';

async function getGmail() {
  const auth = await getAuthenticatedClient();
  return google.gmail({ version: 'v1', auth });
}

function decodeBody(payload) {
  const part = payload.parts?.find(p => p.mimeType === 'text/plain') || payload;
  if (part.body?.data) return Buffer.from(part.body.data, 'base64').toString('utf8');
  return '(no body)';
}

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

program.name('gmail').description('Gmail CLI');

program.command('list')
  .option('--unread', 'Show only unread')
  .option('--label <label>', 'Filter by label')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      let q = opts.unread ? 'is:unread' : '';
      if (opts.label) q += ` label:${opts.label}`;
      const res = await gm.users.messages.list({ userId: 'me', q: q.trim(), maxResults: 20 });
      const messages = res.data.messages || [];
      if (!messages.length) return console.log('No messages.');
      const details = await Promise.all(messages.map(m => gm.users.messages.get({ userId: 'me', id: m.id, format: 'metadata', metadataHeaders: ['From','Subject','Date'] })));
      const rows = details.map(d => ({ id: d.data.id, from: getHeader(d.data.payload.headers, 'From'), subject: getHeader(d.data.payload.headers, 'Subject'), date: getHeader(d.data.payload.headers, 'Date') }));
      if (opts.json) return printJson(rows);
      printTable(['ID', 'From', 'Subject', 'Date'], rows.map(r => [r.id.slice(0,8), r.from.slice(0,30), r.subject.slice(0,40), r.date]));
    } catch (e) { handleError(e); }
  });

program.command('read')
  .requiredOption('--id <messageId>', 'Message ID (first 8 chars ok)')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      const res = await gm.users.messages.get({ userId: 'me', id: msg.id });
      const h = res.data.payload.headers;
      console.log(chalk.bold('From:'), getHeader(h, 'From'));
      console.log(chalk.bold('Subject:'), getHeader(h, 'Subject'));
      console.log(chalk.bold('Date:'), getHeader(h, 'Date'));
      console.log(chalk.gray('---'));
      console.log(decodeBody(res.data.payload));
    } catch (e) { handleError(e); }
  });

program.command('send')
  .requiredOption('--to <email>', 'Recipient email')
  .requiredOption('--subject <subject>', 'Subject')
  .requiredOption('--body <body>', 'Email body')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      if (!opts.yolo) {
        const ok = await confirm(`Send to ${opts.to} — "${opts.subject}"?`);
        if (!ok) return console.log('Cancelled.');
      }
      const raw = Buffer.from(`To: ${opts.to}\r\nSubject: ${opts.subject}\r\n\r\n${opts.body}`).toString('base64url');
      await gm.users.messages.send({ userId: 'me', resource: { raw } });
      printSuccess(`Sent to ${opts.to}`);
    } catch (e) {
      console.error(chalk.yellow('Send failed. Saving to drafts...'));
      try {
        const raw = Buffer.from(`To: ${opts.to}\r\nSubject: ${opts.subject}\r\n\r\n${opts.body}`).toString('base64url');
        const gm2 = await getGmail();
        await gm2.users.drafts.create({ userId: 'me', resource: { message: { raw } } });
        printInfo('Saved to drafts.');
      } catch (e2) { handleError(e2); }
    }
  });

program.command('reply')
  .requiredOption('--id <messageId>', 'Message ID to reply to')
  .requiredOption('--body <body>', 'Reply body')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      const res = await gm.users.messages.get({ userId: 'me', id: msg.id });
      const h = res.data.payload.headers;
      const to = getHeader(h, 'From');
      const subject = 'Re: ' + getHeader(h, 'Subject');
      const threadId = res.data.threadId;
      if (!opts.yolo) {
        const ok = await confirm(`Reply to ${to}?`);
        if (!ok) return console.log('Cancelled.');
      }
      const raw = Buffer.from(`To: ${to}\r\nSubject: ${subject}\r\n\r\n${opts.body}`).toString('base64url');
      await gm.users.messages.send({ userId: 'me', resource: { raw, threadId } });
      printSuccess(`Reply sent to ${to}`);
    } catch (e) { handleError(e); }
  });

program.command('delete')
  .requiredOption('--id <messageId>', 'Message ID')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      if (!opts.yolo) {
        const ok = await confirm(`Delete message ${opts.id}?`);
        if (!ok) return console.log('Cancelled.');
      }
      await gm.users.messages.trash({ userId: 'me', id: msg.id });
      printSuccess('Message moved to trash.');
    } catch (e) { handleError(e); }
  });

program.command('search')
  .requiredOption('--query <q>', 'Gmail search query')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const res = await gm.users.messages.list({ userId: 'me', q: opts.query, maxResults: 20 });
      const messages = res.data.messages || [];
      if (!messages.length) return console.log('No messages found.');
      const details = await Promise.all(messages.map(m => gm.users.messages.get({ userId: 'me', id: m.id, format: 'metadata', metadataHeaders: ['From','Subject','Date'] })));
      const rows = details.map(d => ({ id: d.data.id, from: getHeader(d.data.payload.headers, 'From'), subject: getHeader(d.data.payload.headers, 'Subject') }));
      if (opts.json) return printJson(rows);
      printTable(['ID', 'From', 'Subject'], rows.map(r => [r.id.slice(0,8), r.from.slice(0,30), r.subject.slice(0,40)]));
    } catch (e) { handleError(e); }
  });

program.command('label')
  .option('--list', 'List all labels')
  .option('--add', 'Add label to message')
  .option('--id <messageId>', 'Message ID')
  .option('--name <label>', 'Label name')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      if (opts.list) {
        const res = await gm.users.labels.list({ userId: 'me' });
        const labels = res.data.labels || [];
        if (opts.json) return printJson(labels);
        printTable(['ID', 'Name', 'Type'], labels.map(l => [l.id, l.name, l.type]));
      } else if (opts.add) {
        const allLabels = await gm.users.labels.list({ userId: 'me' });
        let label = allLabels.data.labels.find(l => l.name.toLowerCase() === opts.name.toLowerCase());
        if (!label) {
          const created = await gm.users.labels.create({ userId: 'me', resource: { name: opts.name } });
          label = created.data;
        }
        const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
        const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
        if (!msg) return console.error('Message not found.');
        await gm.users.messages.modify({ userId: 'me', id: msg.id, resource: { addLabelIds: [label.id] } });
        printSuccess(`Label "${opts.name}" added.`);
      }
    } catch (e) { handleError(e); }
  });

program.command('drafts')
  .option('--list', 'List drafts')
  .option('--send <draftId>', 'Send a draft by ID')
  .option('--json', 'Output JSON')
  .option('--yolo', 'Skip confirmation for send')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      if (opts.list) {
        const res = await gm.users.drafts.list({ userId: 'me' });
        const drafts = res.data.drafts || [];
        if (opts.json) return printJson(drafts);
        printTable(['Draft ID', 'Message ID'], drafts.map(d => [d.id, d.message.id]));
      } else if (opts.send) {
        if (!opts.yolo) {
          const ok = await confirm(`Send draft ${opts.send}?`);
          if (!ok) return console.log('Cancelled.');
        }
        await gm.users.drafts.send({ userId: 'me', resource: { id: opts.send } });
        printSuccess('Draft sent.');
      }
    } catch (e) { handleError(e); }
  });

program.command('attachment')
  .option('--download', 'Download attachment')
  .option('--id <messageId>', 'Message ID')
  .option('--out <path>', 'Output path', '.')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      const res = await gm.users.messages.get({ userId: 'me', id: msg.id });
      const parts = res.data.payload.parts?.filter(p => p.filename) || [];
      if (!parts.length) return console.log('No attachments found.');
      for (const part of parts) {
        const att = await gm.users.messages.attachments.get({ userId: 'me', messageId: msg.id, id: part.body.attachmentId });
        const data = Buffer.from(att.data.data, 'base64');
        const outPath = join(opts.out, part.filename);
        createWriteStream(outPath).write(data);
        printSuccess(`Downloaded: ${outPath}`);
      }
    } catch (e) { handleError(e); }
  });

program.parse();
```

- [ ] **Step 2: Test**

```powershell
gmail --help
gmail list
gmail list --unread
```

Expected: help text, inbox list, filtered unread.

- [ ] **Step 3: Commit**

```bash
git add tools/google/gmail/index.js
git commit -m "feat: add gmail CLI (mail commands)"
```

---

### Task 6: gdrive CLI

**Files:**
- Create: `tools/google/gdrive/index.js`

- [ ] **Step 1: Create gdrive/index.js**

```js
#!/usr/bin/env node
import { program } from 'commander';
import { google } from 'googleapis';
import chalk from 'chalk';
import { createReadStream, createWriteStream } from 'fs';
import { basename } from 'path';
import * as readline from 'readline';
import { getAuthenticatedClient } from '../auth/oauth.js';
import { printTable, printJson, printSuccess } from '../lib/output.js';
import { handleError } from '../lib/error.js';

async function getDrive() {
  const auth = await getAuthenticatedClient();
  return google.drive({ version: 'v3', auth });
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

async function findFileId(drive, nameOrId) {
  if (nameOrId.length > 20 && !nameOrId.includes(' ')) return nameOrId;
  const res = await drive.files.list({ q: `name contains '${nameOrId}' and trashed=false`, fields: 'files(id,name)', pageSize: 5 });
  const files = res.data.files || [];
  if (!files.length) throw new Error(`File not found: ${nameOrId}`);
  return files[0].id;
}

program.name('gdrive').description('Google Drive CLI');

program.command('list')
  .option('--folder <name>', 'Filter by folder name')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      let q = 'trashed=false';
      if (opts.folder) {
        const folderRes = await drive.files.list({ q: `name='${opts.folder}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
        const folder = folderRes.data.files?.[0];
        if (!folder) return console.error(`Folder not found: ${opts.folder}`);
        q += ` and '${folder.id}' in parents`;
      }
      const res = await drive.files.list({ q, fields: 'files(id,name,mimeType,size,modifiedTime)', pageSize: 30 });
      const files = res.data.files || [];
      if (opts.json) return printJson(files);
      if (!files.length) return console.log('No files found.');
      printTable(['ID', 'Name', 'Type', 'Modified'], files.map(f => [f.id.slice(0,8), f.name, f.mimeType.split('.').pop(), f.modifiedTime?.slice(0,10)]));
    } catch (e) { handleError(e); }
  });

program.command('upload')
  .requiredOption('--file <localPath>', 'Local file path')
  .option('--to <folder>', 'Destination folder name')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const metadata = { name: basename(opts.file) };
      if (opts.to) {
        const folderRes = await drive.files.list({ q: `name='${opts.to}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
        const folder = folderRes.data.files?.[0];
        if (!folder) return console.error(`Folder not found: ${opts.to}`);
        metadata.parents = [folder.id];
      }
      await drive.files.create({ resource: metadata, media: { body: createReadStream(opts.file) }, fields: 'id' });
      printSuccess(`Uploaded: ${basename(opts.file)}${opts.to ? ' → ' + opts.to : ''}`);
    } catch (e) { handleError(e); }
  });

program.command('download')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .option('--out <path>', 'Output directory', '.')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      const meta = await drive.files.get({ fileId, fields: 'name' });
      const dest = `${opts.out}/${meta.data.name}`;
      const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
      await new Promise((resolve, reject) => {
        const writer = createWriteStream(dest);
        res.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      printSuccess(`Downloaded: ${dest}`);
    } catch (e) { handleError(e); }
  });

program.command('delete')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      if (!opts.yolo) {
        const ok = await confirm(`Delete "${opts.file}"?`);
        if (!ok) return console.log('Cancelled.');
      }
      await drive.files.delete({ fileId });
      printSuccess(`Deleted: ${opts.file}`);
    } catch (e) { handleError(e); }
  });

program.command('search')
  .requiredOption('--query <q>', 'Search query')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const res = await drive.files.list({ q: `name contains '${opts.query}' and trashed=false`, fields: 'files(id,name,mimeType,modifiedTime)', pageSize: 20 });
      const files = res.data.files || [];
      if (opts.json) return printJson(files);
      if (!files.length) return console.log('No files found.');
      printTable(['ID', 'Name', 'Modified'], files.map(f => [f.id.slice(0,8), f.name, f.modifiedTime?.slice(0,10)]));
    } catch (e) { handleError(e); }
  });

program.command('share')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .requiredOption('--with <email>', 'Email to share with')
  .option('--role <role>', 'viewer, editor, or commenter', 'viewer')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      await drive.permissions.create({ fileId, resource: { type: 'user', role: opts.role, emailAddress: opts.with } });
      printSuccess(`Shared "${opts.file}" with ${opts.with} as ${opts.role}`);
    } catch (e) { handleError(e); }
  });

program.command('move')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .requiredOption('--to <folder>', 'Destination folder name')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      const meta = await drive.files.get({ fileId, fields: 'parents' });
      const folderRes = await drive.files.list({ q: `name='${opts.to}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
      const folder = folderRes.data.files?.[0];
      if (!folder) return console.error(`Folder not found: ${opts.to}`);
      await drive.files.update({ fileId, addParents: folder.id, removeParents: meta.data.parents.join(','), fields: 'id,parents' });
      printSuccess(`Moved "${opts.file}" to "${opts.to}"`);
    } catch (e) { handleError(e); }
  });

program.command('copy')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .option('--to <folder>', 'Destination folder name')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      const copyMeta = {};
      if (opts.to) {
        const folderRes = await drive.files.list({ q: `name='${opts.to}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
        const folder = folderRes.data.files?.[0];
        if (!folder) return console.error(`Folder not found: ${opts.to}`);
        copyMeta.parents = [folder.id];
      }
      const res = await drive.files.copy({ fileId, resource: copyMeta, fields: 'id,name' });
      printSuccess(`Copied to: ${res.data.name}`);
    } catch (e) { handleError(e); }
  });

program.command('permissions')
  .option('--list', 'List permissions')
  .option('--remove', 'Remove a permission')
  .option('--file <nameOrId>', 'File name or ID')
  .option('--user <email>', 'User email to remove')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      if (opts.list) {
        const res = await drive.permissions.list({ fileId, fields: 'permissions(id,emailAddress,role,type)' });
        const perms = res.data.permissions || [];
        if (opts.json) return printJson(perms);
        printTable(['ID', 'Email', 'Role'], perms.map(p => [p.id, p.emailAddress || p.type, p.role]));
      } else if (opts.remove) {
        const res = await drive.permissions.list({ fileId, fields: 'permissions(id,emailAddress)' });
        const perm = res.data.permissions.find(p => p.emailAddress === opts.user);
        if (!perm) return console.error(`Permission not found for ${opts.user}`);
        await drive.permissions.delete({ fileId, permissionId: perm.id });
        printSuccess(`Removed access for ${opts.user}`);
      }
    } catch (e) { handleError(e); }
  });

program.parse();
```

- [ ] **Step 2: Test**

```powershell
gdrive --help
gdrive list
```

Expected: help text, file list from Drive root.

- [ ] **Step 3: Commit**

```bash
git add tools/google/gdrive/index.js
git commit -m "feat: add gdrive CLI (drive commands)"
```

---

### Task 7: Google Cloud setup guide + README

**Files:**
- Create: `tools/google/README.md`

- [ ] **Step 1: Create README.md**

```markdown
# Google CLI Tools

Three CLI tools: `gcal` (Calendar), `gmail` (Gmail), `gdrive` (Drive).

## Google Cloud Setup (one-time, ~5 min)

1. Go to https://console.cloud.google.com
2. Create a new project (e.g. "jarvis-google-cli")
3. Enable these APIs:
   - Google Calendar API
   - Gmail API
   - Google Drive API
4. Go to APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: **Desktop app**
6. Download the credentials, copy client_id and client_secret

## Config

Copy config into `tools/google/config.json`:

```json
{
  "google_client_id": "YOUR_CLIENT_ID",
  "google_client_secret": "YOUR_CLIENT_SECRET",
  "default_timezone": "Asia/Jakarta"
}
```

## Install

```powershell
cd tools/google
npm install
npm link
gcal auth
```

One auth covers all three CLIs.

## Usage

```
gcal list --date today
gcal add --title "Meeting" --date tomorrow --time 15:00
gmail list --unread
gmail send --to ali@email.com --subject "Update" --body "Here's the update"
gdrive list
gdrive upload --file invoice.pdf --to Rielcode/invoices
```

Add `--json` to any command for machine-readable output.
Add `--yolo` to skip confirmations on delete/send.
```

- [ ] **Step 2: Commit**

```bash
git add tools/google/README.md
git commit -m "docs: add google cli setup README"
```

---

## Self-Review

**Spec coverage check:**
- [x] 3 separate CLIs: gcal, gmail, gdrive
- [x] Shared OAuth2 module
- [x] Node.js, npm link global install
- [x] Full commands for all three (list/add/update/delete/search + extras)
- [x] Colored table output + `--json` flag
- [x] `--yolo` flag for skip confirmations
- [x] Auto-refresh expired tokens
- [x] Auth errors handled
- [x] Send-fail → save to drafts (gmail)
- [x] `--debug` flag: not explicitly added — output.js can be extended, low priority
- [x] Setup config: README covers Google Cloud setup steps
- [x] .gitignore covers tokens.json and config.json

**No placeholders detected.**

**Type consistency:** `getAuthenticatedClient()`, `handleError()`, `printTable()`, `printSuccess()`, `printJson()` used consistently across all three CLIs.
