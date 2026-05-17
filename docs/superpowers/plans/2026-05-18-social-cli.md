# Social CLI (Instagram + TikTok) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build tools/social/ package with `ig` and `tt` CLI commands covering post/upload, analytics, comments, and DMs for Instagram and TikTok.

**Architecture:** Standalone Node.js package (`"type": "module"`) with two entry points (`instagram/index.js`, `tiktok/index.js`), platform-specific auth modules (`auth/instagram.js`, `auth/tiktok.js`), and a shared output/error lib (`lib/`). All API calls use axios since neither Meta nor TikTok have official Node SDKs. Pattern mirrors `tools/google/` exactly: same chalk/cli-table3 output helpers, same `--json`/`--debug`/`--yolo` flags, same non-zero exit codes.

**Tech Stack:** Node.js ESM, axios@1.6, commander@12, cli-table3@0.6, chalk@5, open@10, jest@29 (with `--experimental-vm-modules` for ESM), node:readline (built-in)

---

## File Map

| File | Responsibility |
|---|---|
| `tools/social/package.json` | bin entries, deps, jest config |
| `tools/social/.gitignore` | ignore config.json, auth/tokens.json, node_modules |
| `tools/social/config.json.example` | committed template showing required keys |
| `tools/social/auth/instagram.js` | Meta OAuth2 flow, token read/write/refresh |
| `tools/social/auth/tiktok.js` | TikTok OAuth2 flow, token read/write/refresh |
| `tools/social/auth/tokens.json` | gitignored runtime token store |
| `tools/social/lib/output.js` | printTable, printJSON, printSuccess, printInfo |
| `tools/social/lib/error.js` | handleError, notAuthenticated (ig/tt variants) |
| `tools/social/instagram/index.js` | ig command: auth, post, reels, stories, list, analytics, comments, dms |
| `tools/social/tiktok/index.js` | tt command: auth, upload, list, analytics, comments, dms |
| `tools/social/__tests__/output.test.js` | unit tests for lib/output.js |
| `tools/social/__tests__/error.test.js` | unit tests for lib/error.js |
| `tools/social/__tests__/auth.instagram.test.js` | unit tests for auth/instagram.js |
| `tools/social/__tests__/auth.tiktok.test.js` | unit tests for auth/tiktok.js |
| `tools/social/__tests__/ig.list.test.js` | integration-style test for ig list |
| `tools/social/__tests__/ig.post.test.js` | test for ig post confirmation + publish |
| `tools/social/__tests__/ig.reels.test.js` | test for ig reels |
| `tools/social/__tests__/ig.stories.test.js` | test for ig stories |
| `tools/social/__tests__/ig.analytics.test.js` | test for ig analytics |
| `tools/social/__tests__/ig.comments.test.js` | test for ig comments list/reply/delete |
| `tools/social/__tests__/ig.dms.test.js` | test for ig dms list/read/send |
| `tools/social/__tests__/tt.list.test.js` | test for tt list |
| `tools/social/__tests__/tt.upload.test.js` | test for tt upload confirmation + publish |
| `tools/social/__tests__/tt.analytics.test.js` | test for tt analytics |
| `tools/social/__tests__/tt.comments.test.js` | test for tt comments list/reply |
| `tools/social/__tests__/tt.dms.test.js` | test for tt dms list/read/send |

---

## Reference: tools/google/ Patterns to Follow

- `"type": "module"` in package.json — all files use ESM `import`/`export`
- `chalk@5` is ESM-only — no `require()`
- `printTable(headers, rows)` — headers are `chalk.cyan` wrapped, rows are plain arrays
- `handleError(err, debug)` — debug flag shows full err object, otherwise `err.message`
- `process.exit(1)` on every error path
- `--yolo` flag skips confirmation prompts
- Auth tokens stored at `auth/tokens.json`, config at `config.json` (gitignored)

---

## Task 1: Package Scaffold

**Files:**
- Create: `tools/social/package.json`
- Create: `tools/social/.gitignore`
- Create: `tools/social/config.json.example`
- Create: `tools/social/__tests__/` (directory placeholder via .gitkeep)

- [ ] **Step 1: Create tools/social/ directory**

```powershell
New-Item -ItemType Directory -Force -Path "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social\__tests__"
New-Item -ItemType Directory -Force -Path "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social\auth"
New-Item -ItemType Directory -Force -Path "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social\lib"
New-Item -ItemType Directory -Force -Path "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social\instagram"
New-Item -ItemType Directory -Force -Path "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social\tiktok"
```

- [ ] **Step 2: Write package.json**

File: `tools/social/package.json`

```json
{
  "name": "jarvis-social-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "ig": "./instagram/index.js",
    "tt": "./tiktok/index.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "chalk": "^5.3.0",
    "cli-table3": "^0.6.3",
    "commander": "^12.1.0",
    "open": "^10.1.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/.bin/jest",
    "test:watch": "node --experimental-vm-modules node_modules/.bin/jest --watch"
  },
  "jest": {
    "transform": {},
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.js"]
  }
}
```

- [ ] **Step 3: Write .gitignore**

File: `tools/social/.gitignore`

```
node_modules/
config.json
auth/tokens.json
```

- [ ] **Step 4: Write config.json.example**

File: `tools/social/config.json.example`

```json
{
  "instagram_app_id": "YOUR_META_APP_ID",
  "instagram_app_secret": "YOUR_META_APP_SECRET",
  "instagram_redirect_uri": "http://localhost:9876/callback",
  "tiktok_client_key": "YOUR_TIKTOK_CLIENT_KEY",
  "tiktok_client_secret": "YOUR_TIKTOK_CLIENT_SECRET",
  "tiktok_redirect_uri": "http://localhost:9877/callback"
}
```

- [ ] **Step 5: Install dependencies**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/package.json tools/social/.gitignore tools/social/config.json.example
git commit -m "feat: scaffold tools/social package"
```

---

## Task 2: lib/output.js

**Files:**
- Create: `tools/social/lib/output.js`
- Create: `tools/social/__tests__/output.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/output.test.js`

```js
import { jest } from '@jest/globals';

// Suppress actual console.log output during tests
let logSpy;
beforeEach(() => { logSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); });
afterEach(() => { logSpy.mockRestore(); });

describe('printTable', () => {
  it('calls console.log once with table string', async () => {
    const { printTable } = await import('../lib/output.js');
    printTable(['Name', 'Age'], [['Alice', '30'], ['Bob', '25']]);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(typeof output).toBe('string');
    expect(output).toContain('Alice');
    expect(output).toContain('Bob');
  });
});

describe('printJSON', () => {
  it('pretty-prints JSON to console.log', async () => {
    const { printJSON } = await import('../lib/output.js');
    printJSON({ id: '123', name: 'test' });
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('"id": "123"');
    expect(output).toContain('"name": "test"');
  });
});

describe('printSuccess', () => {
  it('logs a message containing the text', async () => {
    const { printSuccess } = await import('../lib/output.js');
    printSuccess('Post created');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain('Post created');
  });
});

describe('printInfo', () => {
  it('logs a message containing the text', async () => {
    const { printInfo } = await import('../lib/output.js');
    printInfo('Uploading...');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain('Uploading...');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="output.test"
```

Expected: FAIL — `Cannot find module '../lib/output.js'`

- [ ] **Step 3: Write implementation**

File: `tools/social/lib/output.js`

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

export function printJSON(data) {
  console.log(JSON.stringify(data, null, 2));
}

export function printSuccess(msg) {
  console.log(chalk.green('✓') + ' ' + msg);
}

export function printInfo(msg) {
  console.log(chalk.blue('i') + ' ' + msg);
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
npm test -- --testPathPattern="output.test"
```

Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/lib/output.js tools/social/__tests__/output.test.js
git commit -m "feat: add lib/output.js with printTable, printJSON, printSuccess, printInfo"
```

---

## Task 3: lib/error.js

**Files:**
- Create: `tools/social/lib/error.js`
- Create: `tools/social/__tests__/error.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/error.test.js`

```js
import { jest } from '@jest/globals';

let errorSpy;
let exitSpy;
beforeEach(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });
});
afterEach(() => {
  errorSpy.mockRestore();
  exitSpy.mockRestore();
});

describe('handleError', () => {
  it('prints err.message and exits 1', async () => {
    const { handleError } = await import('../lib/error.js');
    expect(() => handleError(new Error('something broke'))).toThrow('process.exit called');
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0].join(' ')).toContain('something broke');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('prints full err object when debug=true', async () => {
    const { handleError } = await import('../lib/error.js');
    const err = new Error('debug me');
    expect(() => handleError(err, true)).toThrow('process.exit called');
    expect(errorSpy.mock.calls[0].join(' ')).toContain('debug me');
  });

  it('handles non-Error objects gracefully', async () => {
    const { handleError } = await import('../lib/error.js');
    expect(() => handleError('plain string error')).toThrow('process.exit called');
    expect(errorSpy.mock.calls[0].join(' ')).toContain('plain string error');
  });
});

describe('notAuthenticated', () => {
  it('prints platform-specific auth hint and exits 1 for ig', async () => {
    const { notAuthenticated } = await import('../lib/error.js');
    expect(() => notAuthenticated('ig')).toThrow('process.exit called');
    expect(errorSpy.mock.calls[0].join(' ')).toContain("ig auth");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('prints platform-specific auth hint and exits 1 for tt', async () => {
    const { notAuthenticated } = await import('../lib/error.js');
    jest.resetModules();
    expect(() => notAuthenticated('tt')).toThrow('process.exit called');
    expect(errorSpy.mock.calls[0].join(' ')).toContain("tt auth");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="error.test"
```

Expected: FAIL — `Cannot find module '../lib/error.js'`

- [ ] **Step 3: Write implementation**

File: `tools/social/lib/error.js`

```js
import chalk from 'chalk';

export function handleError(err, debug = false) {
  if (debug) {
    console.error(chalk.red('ERROR:'), err);
  } else {
    const msg = err?.message || String(err);
    console.error(chalk.red('Error:'), msg);
  }
  process.exit(1);
}

export function notAuthenticated(platform) {
  console.error(chalk.yellow('Not authenticated.'), `Run: ${platform} auth`);
  process.exit(1);
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
npm test -- --testPathPattern="error.test"
```

Expected: PASS — 5 tests pass.

- [ ] **Step 5: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/lib/error.js tools/social/__tests__/error.test.js
git commit -m "feat: add lib/error.js with handleError and notAuthenticated"
```

---

## Task 4: auth/instagram.js

**Files:**
- Create: `tools/social/auth/instagram.js`
- Create: `tools/social/__tests__/auth.instagram.test.js`

**Meta OAuth2 endpoints:**
- Authorize: `https://www.facebook.com/v19.0/dialog/oauth`
- Token exchange: `POST https://graph.facebook.com/v19.0/oauth/access_token`
- Token refresh: `POST https://graph.facebook.com/v19.0/oauth/access_token` (same endpoint, use `fb_exchange_token` grant)
- Token info (to get expiry): `GET https://graph.facebook.com/debug_token`

**Scopes:** `instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_messages`

**Token storage format** (`auth/tokens.json`):
```json
{
  "instagram": {
    "access_token": "...",
    "expires_at": 1234567890000
  },
  "tiktok": { ... }
}
```

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/auth.instagram.test.js`

```js
import { jest } from '@jest/globals';
import { createRequire } from 'module';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync } from 'fs';

// We'll override TOKEN_PATH and CONFIG_PATH by mocking the module with test paths
const TMP_TOKENS = join(tmpdir(), 'social_test_tokens.json');
const TMP_CONFIG = join(tmpdir(), 'social_test_config.json');

afterEach(() => {
  if (existsSync(TMP_TOKENS)) unlinkSync(TMP_TOKENS);
  jest.resetModules();
});

async function importAuth() {
  // Dynamically set env vars the module reads for path overrides
  process.env.SOCIAL_TOKEN_PATH = TMP_TOKENS;
  process.env.SOCIAL_CONFIG_PATH = TMP_CONFIG;
  const mod = await import('../auth/instagram.js');
  return mod;
}

describe('getInstagramToken', () => {
  it('returns access_token when token file exists and not expired', async () => {
    const future = Date.now() + 3_600_000;
    writeFileSync(TMP_CONFIG, JSON.stringify({ instagram_app_id: 'id', instagram_app_secret: 'secret', instagram_redirect_uri: 'http://localhost:9876/callback' }));
    writeFileSync(TMP_TOKENS, JSON.stringify({ instagram: { access_token: 'tok123', expires_at: future } }));
    const { getInstagramToken } = await importAuth();
    const token = await getInstagramToken();
    expect(token).toBe('tok123');
  });

  it('calls process.exit(1) when no token file exists', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    writeFileSync(TMP_CONFIG, JSON.stringify({ instagram_app_id: 'id', instagram_app_secret: 'secret', instagram_redirect_uri: 'http://localhost:9876/callback' }));
    // TMP_TOKENS does not exist
    const { getInstagramToken } = await importAuth();
    await expect(getInstagramToken()).rejects.toThrow('exit');
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('saveInstagramToken', () => {
  it('writes instagram token to tokens.json preserving tiktok key', async () => {
    writeFileSync(TMP_CONFIG, JSON.stringify({ instagram_app_id: 'id', instagram_app_secret: 'secret', instagram_redirect_uri: 'http://localhost:9876/callback' }));
    writeFileSync(TMP_TOKENS, JSON.stringify({ tiktok: { access_token: 'tt_tok', expires_at: 9999 } }));
    const { saveInstagramToken } = await importAuth();
    saveInstagramToken('new_ig_tok', Date.now() + 3_600_000);
    const saved = JSON.parse(await import('fs').then(fs => fs.readFileSync(TMP_TOKENS, 'utf8')));
    expect(saved.instagram.access_token).toBe('new_ig_tok');
    expect(saved.tiktok.access_token).toBe('tt_tok');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="auth.instagram"
```

Expected: FAIL — `Cannot find module '../auth/instagram.js'`

- [ ] **Step 3: Write implementation**

File: `tools/social/auth/instagram.js`

```js
import axios from 'axios';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import * as readline from 'readline';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = process.env.SOCIAL_TOKEN_PATH || join(__dirname, 'tokens.json');
const CONFIG_PATH = process.env.SOCIAL_CONFIG_PATH || join(__dirname, '..', 'config.json');

const SCOPES = 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_messages';
const AUTH_URL = 'https://www.facebook.com/v19.0/dialog/oauth';
const TOKEN_URL = 'https://graph.facebook.com/v19.0/oauth/access_token';
const LONG_TOKEN_URL = 'https://graph.facebook.com/v19.0/oauth/access_token';

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(chalk.red('config.json not found. Copy config.json.example to config.json and fill in your Meta app credentials.'));
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
}

function loadTokens() {
  if (!existsSync(TOKEN_PATH)) return {};
  return JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
}

export function saveInstagramToken(access_token, expires_at) {
  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  const tokens = loadTokens();
  tokens.instagram = { access_token, expires_at };
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

export async function getInstagramToken() {
  const tokens = loadTokens();
  const ig = tokens.instagram;

  if (!ig || !ig.access_token) {
    console.error(chalk.yellow('Not authenticated.'), 'Run: ig auth');
    process.exit(1);
  }

  // Auto-refresh if within 1 hour of expiry
  if (ig.expires_at && Date.now() > ig.expires_at - 3_600_000) {
    const config = loadConfig();
    try {
      const res = await axios.get(LONG_TOKEN_URL, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: config.instagram_app_id,
          client_secret: config.instagram_app_secret,
          fb_exchange_token: ig.access_token,
        },
      });
      const { access_token, expires_in } = res.data;
      const expires_at = Date.now() + expires_in * 1000;
      saveInstagramToken(access_token, expires_at);
      return access_token;
    } catch (err) {
      // If refresh fails, still return existing token and let the API call fail naturally
      console.error(chalk.yellow('Warning: token refresh failed.'), err?.response?.data?.error?.message || err.message);
    }
  }

  return ig.access_token;
}

export async function runInstagramAuthFlow() {
  const config = loadConfig();
  const params = new URLSearchParams({
    client_id: config.instagram_app_id,
    redirect_uri: config.instagram_redirect_uri,
    scope: SCOPES,
    response_type: 'code',
  });
  const authUrl = `${AUTH_URL}?${params.toString()}`;

  console.log('Opening browser for Meta/Instagram auth...');
  await open(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Paste the auth code from the redirect URL here: ', resolve));
  rl.close();

  // Exchange code for short-lived token
  const tokenRes = await axios.get(TOKEN_URL, {
    params: {
      client_id: config.instagram_app_id,
      client_secret: config.instagram_app_secret,
      redirect_uri: config.instagram_redirect_uri,
      code: code.trim(),
    },
  });
  const shortToken = tokenRes.data.access_token;

  // Exchange for long-lived token (~60 days)
  const longRes = await axios.get(LONG_TOKEN_URL, {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: config.instagram_app_id,
      client_secret: config.instagram_app_secret,
      fb_exchange_token: shortToken,
    },
  });
  const { access_token, expires_in } = longRes.data;
  const expires_at = Date.now() + expires_in * 1000;
  saveInstagramToken(access_token, expires_at);

  console.log(chalk.green('✓') + ' Instagram authenticated. Token saved (valid ~60 days).');
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="auth.instagram"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/auth/instagram.js tools/social/__tests__/auth.instagram.test.js
git commit -m "feat: add auth/instagram.js with OAuth2 flow and token management"
```

---

## Task 5: auth/tiktok.js

**Files:**
- Create: `tools/social/auth/tiktok.js`
- Create: `tools/social/__tests__/auth.tiktok.test.js`

**TikTok OAuth2 endpoints:**
- Authorize: `https://www.tiktok.com/v2/auth/authorize/`
- Token exchange: `POST https://open.tiktokapis.com/v2/oauth/token/`
- Token refresh: `POST https://open.tiktokapis.com/v2/oauth/token/` (grant_type: `refresh_token`)

**Scopes:** `user.info.basic,video.upload,video.list,comment.list,comment.create,message.send`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/auth.tiktok.test.js`

```js
import { jest } from '@jest/globals';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync } from 'fs';

const TMP_TOKENS = join(tmpdir(), 'social_tt_test_tokens.json');
const TMP_CONFIG = join(tmpdir(), 'social_tt_test_config.json');

afterEach(() => {
  if (existsSync(TMP_TOKENS)) unlinkSync(TMP_TOKENS);
  jest.resetModules();
});

async function importAuth() {
  process.env.SOCIAL_TOKEN_PATH = TMP_TOKENS;
  process.env.SOCIAL_CONFIG_PATH = TMP_CONFIG;
  const mod = await import('../auth/tiktok.js');
  return mod;
}

describe('getTikTokToken', () => {
  it('returns access_token when token exists and not expired', async () => {
    const future = Date.now() + 3_600_000;
    writeFileSync(TMP_CONFIG, JSON.stringify({ tiktok_client_key: 'key', tiktok_client_secret: 'secret', tiktok_redirect_uri: 'http://localhost:9877/callback' }));
    writeFileSync(TMP_TOKENS, JSON.stringify({ tiktok: { access_token: 'tt_tok', refresh_token: 'rt', expires_at: future } }));
    const { getTikTokToken } = await importAuth();
    const token = await getTikTokToken();
    expect(token).toBe('tt_tok');
  });

  it('exits 1 when no tiktok token exists', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    writeFileSync(TMP_CONFIG, JSON.stringify({ tiktok_client_key: 'key', tiktok_client_secret: 'secret', tiktok_redirect_uri: 'http://localhost:9877/callback' }));
    writeFileSync(TMP_TOKENS, JSON.stringify({ instagram: { access_token: 'ig', expires_at: 9999 } }));
    const { getTikTokToken } = await importAuth();
    await expect(getTikTokToken()).rejects.toThrow('exit');
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('saveTikTokToken', () => {
  it('writes tiktok token preserving instagram key', async () => {
    writeFileSync(TMP_CONFIG, JSON.stringify({ tiktok_client_key: 'key', tiktok_client_secret: 'secret', tiktok_redirect_uri: 'http://localhost:9877/callback' }));
    writeFileSync(TMP_TOKENS, JSON.stringify({ instagram: { access_token: 'ig_tok', expires_at: 9999 } }));
    const { saveTikTokToken } = await importAuth();
    saveTikTokToken('new_tt', 'new_rt', Date.now() + 86_400_000);
    const { readFileSync } = await import('fs');
    const saved = JSON.parse(readFileSync(TMP_TOKENS, 'utf8'));
    expect(saved.tiktok.access_token).toBe('new_tt');
    expect(saved.instagram.access_token).toBe('ig_tok');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="auth.tiktok"
```

Expected: FAIL — `Cannot find module '../auth/tiktok.js'`

- [ ] **Step 3: Write implementation**

File: `tools/social/auth/tiktok.js`

```js
import axios from 'axios';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import * as readline from 'readline';
import chalk from 'chalk';
import { createHash, randomBytes } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = process.env.SOCIAL_TOKEN_PATH || join(__dirname, 'tokens.json');
const CONFIG_PATH = process.env.SOCIAL_CONFIG_PATH || join(__dirname, '..', 'config.json');

const SCOPES = 'user.info.basic,video.upload,video.list,comment.list,comment.create,message.send';
const AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(chalk.red('config.json not found. Copy config.json.example to config.json and fill in your TikTok app credentials.'));
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
}

function loadTokens() {
  if (!existsSync(TOKEN_PATH)) return {};
  return JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
}

export function saveTikTokToken(access_token, refresh_token, expires_at) {
  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  const tokens = loadTokens();
  tokens.tiktok = { access_token, refresh_token, expires_at };
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

export async function getTikTokToken() {
  const tokens = loadTokens();
  const tt = tokens.tiktok;

  if (!tt || !tt.access_token) {
    console.error(chalk.yellow('Not authenticated.'), 'Run: tt auth');
    process.exit(1);
  }

  // Auto-refresh if within 1 hour of expiry
  if (tt.expires_at && Date.now() > tt.expires_at - 3_600_000) {
    const config = loadConfig();
    try {
      const res = await axios.post(TOKEN_URL, new URLSearchParams({
        client_key: config.tiktok_client_key,
        client_secret: config.tiktok_client_secret,
        grant_type: 'refresh_token',
        refresh_token: tt.refresh_token,
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      const { access_token, refresh_token, expires_in } = res.data;
      const expires_at = Date.now() + expires_in * 1000;
      saveTikTokToken(access_token, refresh_token, expires_at);
      return access_token;
    } catch (err) {
      console.error(chalk.yellow('Warning: token refresh failed.'), err?.response?.data?.message || err.message);
    }
  }

  return tt.access_token;
}

export async function runTikTokAuthFlow() {
  const config = loadConfig();
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

  const params = new URLSearchParams({
    client_key: config.tiktok_client_key,
    redirect_uri: config.tiktok_redirect_uri,
    response_type: 'code',
    scope: SCOPES,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  const authUrl = `${AUTH_URL}?${params.toString()}`;

  console.log('Opening browser for TikTok auth...');
  await open(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Paste the auth code from the redirect URL here: ', resolve));
  rl.close();

  const res = await axios.post(TOKEN_URL, new URLSearchParams({
    client_key: config.tiktok_client_key,
    client_secret: config.tiktok_client_secret,
    code: code.trim(),
    grant_type: 'authorization_code',
    redirect_uri: config.tiktok_redirect_uri,
    code_verifier: codeVerifier,
  }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const { access_token, refresh_token, expires_in } = res.data;
  const expires_at = Date.now() + expires_in * 1000;
  saveTikTokToken(access_token, refresh_token, expires_at);

  console.log(chalk.green('✓') + ' TikTok authenticated. Token saved.');
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="auth.tiktok"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/auth/tiktok.js tools/social/__tests__/auth.tiktok.test.js
git commit -m "feat: add auth/tiktok.js with OAuth2 PKCE flow and token management"
```

---

## Task 6: ig list

**Files:**
- Create: `tools/social/instagram/index.js` (initial shell + list command)
- Create: `tools/social/__tests__/ig.list.test.js`

**Meta Graph API endpoint:** `GET https://graph.facebook.com/v19.0/me/media`
**Fields:** `id,caption,media_type,timestamp,permalink,like_count,comments_count`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.list.test.js`

```js
import { jest } from '@jest/globals';

// Mock auth module so no real token file is needed
jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));

// Mock axios
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('ig list', () => {
  let axiosMock;

  beforeEach(async () => {
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    jest.resetAllMocks();
    axiosMock.get = jest.fn();
  });

  it('fetches media and returns array of posts', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: '111', caption: 'Hello world', media_type: 'IMAGE', timestamp: '2026-05-01T10:00:00Z', like_count: 5, comments_count: 2 },
          { id: '222', caption: 'Second post', media_type: 'VIDEO', timestamp: '2026-05-02T10:00:00Z', like_count: 10, comments_count: 0 },
        ],
      },
    });

    const { listPosts } = await import('../instagram/index.js');
    const posts = await listPosts('mock_token', 10);
    expect(posts).toHaveLength(2);
    expect(posts[0].id).toBe('111');
    expect(posts[1].media_type).toBe('VIDEO');
    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/me/media',
      expect.objectContaining({ params: expect.objectContaining({ access_token: 'mock_token', limit: 10 }) })
    );
  });

  it('returns empty array when no media', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { data: [] } });
    const { listPosts } = await import('../instagram/index.js');
    const posts = await listPosts('mock_token', 10);
    expect(posts).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.list"
```

Expected: FAIL — `Cannot find module '../instagram/index.js'`

- [ ] **Step 3: Write implementation (instagram/index.js initial shell + listPosts)**

File: `tools/social/instagram/index.js`

```js
#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import * as readline from 'readline';
import { getInstagramToken, runInstagramAuthFlow } from '../auth/instagram.js';
import { printTable, printJSON, printSuccess, printInfo } from '../lib/output.js';
import { handleError, notAuthenticated } from '../lib/error.js';

const GRAPH = 'https://graph.facebook.com/v19.0';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' });
}

// ── Exported functions (used by tests) ───────────────────────────────────────

export async function listPosts(token, limit = 10) {
  const res = await axios.get(`${GRAPH}/me/media`, {
    params: {
      access_token: token,
      fields: 'id,caption,media_type,timestamp,permalink,like_count,comments_count',
      limit,
    },
  });
  return res.data.data || [];
}

export async function getIgUserId(token) {
  const res = await axios.get(`${GRAPH}/me`, { params: { access_token: token, fields: 'id' } });
  return res.data.id;
}

export async function createImageContainer(token, userId, imageUrl, caption) {
  const res = await axios.post(`${GRAPH}/${userId}/media`, null, {
    params: { access_token: token, image_url: imageUrl, caption, media_type: 'IMAGE' },
  });
  return res.data.id;
}

export async function publishContainer(token, userId, containerId) {
  const res = await axios.post(`${GRAPH}/${userId}/media_publish`, null, {
    params: { access_token: token, creation_id: containerId },
  });
  return res.data.id;
}

export async function createReelContainer(token, userId, videoUrl, caption, coverUrl) {
  const params = { access_token: token, video_url: videoUrl, caption, media_type: 'REELS' };
  if (coverUrl) params.cover_url = coverUrl;
  const res = await axios.post(`${GRAPH}/${userId}/media`, null, { params });
  return res.data.id;
}

export async function createStoryContainer(token, userId, imageUrl, caption) {
  const params = { access_token: token, image_url: imageUrl, media_type: 'STORIES' };
  if (caption) params.caption = caption;
  const res = await axios.post(`${GRAPH}/${userId}/media`, null, { params });
  return res.data.id;
}

export async function getAccountInsights(token, userId, period) {
  const days = period === '7d' ? 7 : 30;
  const since = Math.floor((Date.now() - days * 86_400_000) / 1000);
  const res = await axios.get(`${GRAPH}/${userId}/insights`, {
    params: {
      access_token: token,
      metric: 'impressions,reach,profile_views,follower_count',
      period: 'day',
      since,
    },
  });
  return res.data.data || [];
}

export async function getPostInsights(token, postId) {
  const res = await axios.get(`${GRAPH}/${postId}/insights`, {
    params: {
      access_token: token,
      metric: 'impressions,reach,likes,comments,shares,saved',
    },
  });
  return res.data.data || [];
}

export async function listComments(token, postId) {
  const res = await axios.get(`${GRAPH}/${postId}/comments`, {
    params: { access_token: token, fields: 'id,text,timestamp,username' },
  });
  return res.data.data || [];
}

export async function replyToComment(token, commentId, message) {
  const res = await axios.post(`${GRAPH}/${commentId}/replies`, null, {
    params: { access_token: token, message },
  });
  return res.data.id;
}

export async function deleteComment(token, commentId) {
  const res = await axios.delete(`${GRAPH}/${commentId}`, {
    params: { access_token: token },
  });
  return res.data.success;
}

export async function listDMThreads(token) {
  const res = await axios.get(`${GRAPH}/me/conversations`, {
    params: { access_token: token, fields: 'id,participants,updated_time,message_count' },
  });
  return res.data.data || [];
}

export async function readDMThread(token, threadId) {
  const res = await axios.get(`${GRAPH}/${threadId}/messages`, {
    params: { access_token: token, fields: 'id,message,from,created_time' },
  });
  return res.data.data || [];
}

export async function sendDM(token, threadId, message) {
  const res = await axios.post(`${GRAPH}/me/messages`, null, {
    params: { access_token: token, recipient: JSON.stringify({ thread_key: threadId }), message: JSON.stringify({ text: message }) },
  });
  return res.data.message_id;
}

// ── CLI ───────────────────────────────────────────────────────────────────────

program.name('ig').description('Instagram CLI (Meta Graph API)');

program.command('auth').description('Authenticate with Meta/Instagram').action(async () => {
  try { await runInstagramAuthFlow(); } catch (e) { handleError(e); }
});

program.command('list')
  .description('List recent posts')
  .option('--limit <n>', 'Number of posts', '10')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const token = await getInstagramToken();
      const posts = await listPosts(token, parseInt(opts.limit));
      if (opts.json) return printJSON(posts);
      if (!posts.length) return console.log('No posts found.');
      printTable(
        ['ID', 'Type', 'Caption', 'Likes', 'Comments', 'Date'],
        posts.map(p => [p.id, p.media_type, (p.caption || '').slice(0, 40), String(p.like_count || 0), String(p.comments_count || 0), formatDate(p.timestamp)])
      );
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('post')
  .description('Create a feed post')
  .requiredOption('--image <url>', 'Public image URL')
  .requiredOption('--caption <text>', 'Post caption')
  .option('--tags <tags>', 'Hashtags to append')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const token = await getInstagramToken();
      const userId = await getIgUserId(token);
      const caption = opts.tags ? `${opts.caption} ${opts.tags}` : opts.caption;
      if (!opts.yolo) {
        console.log(chalk.bold('Post details:'));
        console.log(`  Image URL : ${opts.image}`);
        console.log(`  Caption   : ${caption}`);
        const ok = await confirm('Publish this post?');
        if (!ok) { console.log('Cancelled.'); return; }
      }
      printInfo('Creating media container...');
      const containerId = await createImageContainer(token, userId, opts.image, caption);
      printInfo('Publishing...');
      const postId = await publishContainer(token, userId, containerId);
      if (opts.json) return printJSON({ id: postId });
      printSuccess(`Post published. ID: ${postId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('reels')
  .description('Post a Reel')
  .requiredOption('--video <url>', 'Public video URL')
  .requiredOption('--caption <text>', 'Reel caption')
  .option('--tags <tags>', 'Hashtags to append')
  .option('--cover <url>', 'Cover image URL')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const token = await getInstagramToken();
      const userId = await getIgUserId(token);
      const caption = opts.tags ? `${opts.caption} ${opts.tags}` : opts.caption;
      if (!opts.yolo) {
        console.log(chalk.bold('Reel details:'));
        console.log(`  Video URL : ${opts.video}`);
        console.log(`  Caption   : ${caption}`);
        if (opts.cover) console.log(`  Cover URL : ${opts.cover}`);
        const ok = await confirm('Publish this Reel?');
        if (!ok) { console.log('Cancelled.'); return; }
      }
      printInfo('Creating Reel container...');
      const containerId = await createReelContainer(token, userId, opts.video, caption, opts.cover);
      printInfo('Publishing Reel...');
      const postId = await publishContainer(token, userId, containerId);
      if (opts.json) return printJSON({ id: postId });
      printSuccess(`Reel published. ID: ${postId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('stories')
  .description('Create a Story')
  .requiredOption('--image <url>', 'Public image URL')
  .option('--caption <text>', 'Story caption')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const token = await getInstagramToken();
      const userId = await getIgUserId(token);
      if (!opts.yolo) {
        console.log(chalk.bold('Story details:'));
        console.log(`  Image URL : ${opts.image}`);
        if (opts.caption) console.log(`  Caption   : ${opts.caption}`);
        const ok = await confirm('Publish this Story?');
        if (!ok) { console.log('Cancelled.'); return; }
      }
      printInfo('Creating Story container...');
      const containerId = await createStoryContainer(token, userId, opts.image, opts.caption);
      printInfo('Publishing Story...');
      const storyId = await publishContainer(token, userId, containerId);
      if (opts.json) return printJSON({ id: storyId });
      printSuccess(`Story published. ID: ${storyId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('analytics')
  .description('Account or post insights')
  .option('--post <id>', 'Post ID for post-level insights')
  .option('--period <p>', '7d or 30d', '7d')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const token = await getInstagramToken();
      if (opts.post) {
        const metrics = await getPostInsights(token, opts.post);
        if (opts.json) return printJSON(metrics);
        printTable(['Metric', 'Value'], metrics.map(m => [m.name, String(m.values?.[0]?.value ?? m.value ?? 0)]));
      } else {
        const userId = await getIgUserId(token);
        const metrics = await getAccountInsights(token, userId, opts.period);
        if (opts.json) return printJSON(metrics);
        printTable(['Metric', 'Values'], metrics.map(m => [m.name, m.values.map(v => v.value).join(', ')]));
      }
    } catch (e) { handleError(e, opts.debug); }
  });

const commentsCmd = program.command('comments').description('Manage comments');

commentsCmd.command('list <post-id>')
  .description('List comments on a post')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (postId, opts) => {
    try {
      const token = await getInstagramToken();
      const comments = await listComments(token, postId);
      if (opts.json) return printJSON(comments);
      if (!comments.length) return console.log('No comments found.');
      printTable(['ID', 'User', 'Comment', 'Date'], comments.map(c => [c.id, c.username || '', (c.text || '').slice(0, 50), formatDate(c.timestamp)]));
    } catch (e) { handleError(e, opts.debug); }
  });

commentsCmd.command('reply <comment-id>')
  .description('Reply to a comment')
  .requiredOption('--body <text>', 'Reply text')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      const token = await getInstagramToken();
      const replyId = await replyToComment(token, commentId, opts.body);
      printSuccess(`Reply posted. ID: ${replyId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

commentsCmd.command('delete <comment-id>')
  .description('Delete a comment')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      const token = await getInstagramToken();
      if (!opts.yolo) {
        // Fetch comment text for preview
        let preview = commentId;
        try {
          const res = await axios.get(`${GRAPH}/${commentId}`, { params: { access_token: token, fields: 'text' } });
          preview = `"${(res.data.text || '').slice(0, 60)}"`;
        } catch (_) { /* use id as fallback */ }
        const ok = await confirm(`Delete comment ${preview}?`);
        if (!ok) { console.log('Cancelled.'); return; }
      }
      await deleteComment(token, commentId);
      printSuccess(`Comment ${commentId} deleted.`);
    } catch (e) { handleError(e, opts.debug); }
  });

const dmsCmd = program.command('dms').description('Manage DMs');

dmsCmd.command('list')
  .description('List DM threads')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const token = await getInstagramToken();
      const threads = await listDMThreads(token);
      if (opts.json) return printJSON(threads);
      if (!threads.length) return console.log('No DM threads found.');
      printTable(['Thread ID', 'Participants', 'Messages', 'Updated'], threads.map(t => [
        t.id,
        (t.participants?.data || []).map(p => p.name || p.id).join(', '),
        String(t.message_count || 0),
        formatDate(t.updated_time),
      ]));
    } catch (e) { handleError(e, opts.debug); }
  });

dmsCmd.command('read <thread-id>')
  .description('Read messages in a DM thread')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (threadId, opts) => {
    try {
      const token = await getInstagramToken();
      const messages = await readDMThread(token, threadId);
      if (opts.json) return printJSON(messages);
      if (!messages.length) return console.log('No messages found.');
      printTable(['ID', 'From', 'Message', 'Date'], messages.map(m => [m.id, m.from?.name || m.from?.id || '', (m.message || '').slice(0, 60), formatDate(m.created_time)]));
    } catch (e) { handleError(e, opts.debug); }
  });

dmsCmd.command('send <thread-id>')
  .description('Send a DM reply')
  .requiredOption('--body <text>', 'Message text')
  .option('--debug', 'Show raw API response')
  .action(async (threadId, opts) => {
    try {
      const token = await getInstagramToken();
      const msgId = await sendDM(token, threadId, opts.body);
      printSuccess(`DM sent. Message ID: ${msgId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

program.parse();
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.list"
```

Expected: PASS — 2 tests pass.

- [ ] **Step 5: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/instagram/index.js tools/social/__tests__/ig.list.test.js
git commit -m "feat: add instagram/index.js CLI shell with ig list command"
```

---

## Task 7: ig post (confirmation + publish)

**Files:**
- Modify: `tools/social/instagram/index.js` (already written in Task 6 — no changes needed, functions already exported)
- Create: `tools/social/__tests__/ig.post.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.post.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('ig post functions', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
    axiosMock.post = jest.fn();
  });

  it('getIgUserId returns user id', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { id: 'user123' } });
    const { getIgUserId } = await import('../instagram/index.js');
    const id = await getIgUserId('tok');
    expect(id).toBe('user123');
  });

  it('createImageContainer returns container id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'container456' } });
    const { createImageContainer } = await import('../instagram/index.js');
    const id = await createImageContainer('tok', 'user123', 'https://example.com/img.jpg', 'Hello!');
    expect(id).toBe('container456');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/user123/media',
      null,
      expect.objectContaining({ params: expect.objectContaining({ image_url: 'https://example.com/img.jpg', caption: 'Hello!' }) })
    );
  });

  it('publishContainer returns post id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'post789' } });
    const { publishContainer } = await import('../instagram/index.js');
    const id = await publishContainer('tok', 'user123', 'container456');
    expect(id).toBe('post789');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/user123/media_publish',
      null,
      expect.objectContaining({ params: expect.objectContaining({ creation_id: 'container456' }) })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it passes (functions already implemented in Task 6)**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.post"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/ig.post.test.js
git commit -m "test: add ig post unit tests for createImageContainer and publishContainer"
```

---

## Task 8: ig reels

**Files:**
- Create: `tools/social/__tests__/ig.reels.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.reels.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('createReelContainer', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.post = jest.fn();
  });

  it('creates reel container with required params', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'reel_container_1' } });
    const { createReelContainer } = await import('../instagram/index.js');
    const id = await createReelContainer('tok', 'user1', 'https://example.com/reel.mp4', 'Reel caption');
    expect(id).toBe('reel_container_1');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/user1/media',
      null,
      expect.objectContaining({ params: expect.objectContaining({ media_type: 'REELS', video_url: 'https://example.com/reel.mp4' }) })
    );
  });

  it('includes cover_url when provided', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'reel_container_2' } });
    const { createReelContainer } = await import('../instagram/index.js');
    await createReelContainer('tok', 'user1', 'https://example.com/reel.mp4', 'Caption', 'https://example.com/cover.jpg');
    expect(axiosMock.post.mock.calls[0][2].params.cover_url).toBe('https://example.com/cover.jpg');
  });

  it('does not include cover_url when not provided', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'reel_container_3' } });
    const { createReelContainer } = await import('../instagram/index.js');
    await createReelContainer('tok', 'user1', 'https://example.com/reel.mp4', 'Caption');
    expect(axiosMock.post.mock.calls[0][2].params.cover_url).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it passes (function already implemented in Task 6)**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.reels"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/ig.reels.test.js
git commit -m "test: add ig reels unit tests"
```

---

## Task 9: ig stories

**Files:**
- Create: `tools/social/__tests__/ig.stories.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.stories.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('createStoryContainer', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.post = jest.fn();
  });

  it('creates story container with STORIES media_type', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'story_c_1' } });
    const { createStoryContainer } = await import('../instagram/index.js');
    const id = await createStoryContainer('tok', 'user1', 'https://example.com/story.jpg');
    expect(id).toBe('story_c_1');
    expect(axiosMock.post.mock.calls[0][2].params.media_type).toBe('STORIES');
  });

  it('includes caption when provided', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'story_c_2' } });
    const { createStoryContainer } = await import('../instagram/index.js');
    await createStoryContainer('tok', 'user1', 'https://example.com/story.jpg', 'My Story');
    expect(axiosMock.post.mock.calls[0][2].params.caption).toBe('My Story');
  });

  it('does not include caption when not provided', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'story_c_3' } });
    const { createStoryContainer } = await import('../instagram/index.js');
    await createStoryContainer('tok', 'user1', 'https://example.com/story.jpg');
    expect(axiosMock.post.mock.calls[0][2].params.caption).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.stories"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/ig.stories.test.js
git commit -m "test: add ig stories unit tests"
```

---

## Task 10: ig analytics

**Files:**
- Create: `tools/social/__tests__/ig.analytics.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.analytics.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('ig analytics', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
  });

  it('getPostInsights returns array of metrics', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: [{ name: 'impressions', value: 100 }, { name: 'reach', value: 80 }] },
    });
    const { getPostInsights } = await import('../instagram/index.js');
    const metrics = await getPostInsights('tok', 'post123');
    expect(metrics).toHaveLength(2);
    expect(metrics[0].name).toBe('impressions');
    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/post123/insights',
      expect.any(Object)
    );
  });

  it('getAccountInsights returns array of metrics', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: [{ name: 'impressions', values: [{ value: 50 }, { value: 60 }] }] },
    });
    const { getAccountInsights } = await import('../instagram/index.js');
    const metrics = await getAccountInsights('tok', 'user123', '7d');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('impressions');
    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/user123/insights',
      expect.any(Object)
    );
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.analytics"
```

Expected: PASS — 2 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/ig.analytics.test.js
git commit -m "test: add ig analytics unit tests"
```

---

## Task 11: ig comments list/reply/delete

**Files:**
- Create: `tools/social/__tests__/ig.comments.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.comments.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('ig comments', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
    axiosMock.post = jest.fn();
    axiosMock.delete = jest.fn();
  });

  it('listComments returns array of comments', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: [{ id: 'c1', text: 'Nice!', username: 'alice', timestamp: '2026-05-01T10:00:00Z' }] },
    });
    const { listComments } = await import('../instagram/index.js');
    const comments = await listComments('tok', 'post123');
    expect(comments).toHaveLength(1);
    expect(comments[0].text).toBe('Nice!');
  });

  it('replyToComment returns reply id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { id: 'reply_1' } });
    const { replyToComment } = await import('../instagram/index.js');
    const id = await replyToComment('tok', 'c1', 'Thanks!');
    expect(id).toBe('reply_1');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/c1/replies',
      null,
      expect.objectContaining({ params: expect.objectContaining({ message: 'Thanks!' }) })
    );
  });

  it('deleteComment returns success', async () => {
    axiosMock.delete.mockResolvedValueOnce({ data: { success: true } });
    const { deleteComment } = await import('../instagram/index.js');
    const result = await deleteComment('tok', 'c1');
    expect(result).toBe(true);
    expect(axiosMock.delete).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/c1',
      expect.any(Object)
    );
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.comments"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/ig.comments.test.js
git commit -m "test: add ig comments list/reply/delete unit tests"
```

---

## Task 12: ig dms list/read/send

**Files:**
- Create: `tools/social/__tests__/ig.dms.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/ig.dms.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/instagram.js', () => ({
  getInstagramToken: jest.fn().mockResolvedValue('mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('ig dms', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
    axiosMock.post = jest.fn();
  });

  it('listDMThreads returns array of threads', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: [{ id: 't1', participants: { data: [{ name: 'Bob' }] }, updated_time: '2026-05-01T10:00:00Z', message_count: 3 }] },
    });
    const { listDMThreads } = await import('../instagram/index.js');
    const threads = await listDMThreads('tok');
    expect(threads).toHaveLength(1);
    expect(threads[0].id).toBe('t1');
  });

  it('readDMThread returns array of messages', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: [{ id: 'm1', message: 'Hello', from: { name: 'Bob' }, created_time: '2026-05-01T10:00:00Z' }] },
    });
    const { readDMThread } = await import('../instagram/index.js');
    const messages = await readDMThread('tok', 't1');
    expect(messages).toHaveLength(1);
    expect(messages[0].message).toBe('Hello');
  });

  it('sendDM returns message_id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { message_id: 'msg_99' } });
    const { sendDM } = await import('../instagram/index.js');
    const id = await sendDM('tok', 't1', 'Hi there!');
    expect(id).toBe('msg_99');
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig.dms"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/ig.dms.test.js
git commit -m "test: add ig dms list/read/send unit tests"
```

---

## Task 13: ig auth command wiring + shebang check

**Files:**
- Verify: `tools/social/instagram/index.js` (shebang line 1, `program.parse()` at bottom)

- [ ] **Step 1: Verify shebang and executable bit**

```powershell
Get-Content "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social\instagram\index.js" -TotalCount 1
```

Expected: `#!/usr/bin/env node`

- [ ] **Step 2: Run full ig test suite**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="ig\."
```

Expected: All ig tests pass (list, post, reels, stories, analytics, comments, dms).

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/instagram/index.js
git commit -m "feat: wire ig auth command and complete instagram CLI"
```

---

## Task 14: tt list

**Files:**
- Create: `tools/social/tiktok/index.js` (initial shell + list command)
- Create: `tools/social/__tests__/tt.list.test.js`

**TikTok API endpoints used in this file:**
- List videos: `POST https://open.tiktokapis.com/v2/video/list/` (body: `{ max_count: n }`, header: `Authorization: Bearer <token>`, query: `fields=id,title,description,create_time,statistics,share_url`)
- Upload: `POST https://open.tiktokapis.com/v2/post/publish/video/init/` and `POST https://open.tiktokapis.com/v2/post/publish/video/complete/`
- Analytics (account): `GET https://open.tiktokapis.com/v2/research/user/info/`
- Video analytics: `POST https://open.tiktokapis.com/v2/video/query/`
- Comments list: `GET https://open.tiktokapis.com/v2/comment/list/?fields=id,text,create_time,like_count,username`
- Comments reply: `POST https://open.tiktokapis.com/v2/comment/reply/`
- DMs list: `GET https://open.tiktokapis.com/v2/dm/conversation/list/`
- DMs read: `GET https://open.tiktokapis.com/v2/dm/conversation/{conversationId}/messages/`
- DMs send: `POST https://open.tiktokapis.com/v2/dm/conversation/{conversationId}/messages/`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/tt.list.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/tiktok.js', () => ({
  getTikTokToken: jest.fn().mockResolvedValue('tt_mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}));

describe('tt list', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.post = jest.fn();
  });

  it('listVideos returns array of videos', async () => {
    axiosMock.post.mockResolvedValueOnce({
      data: {
        data: {
          videos: [
            { id: 'v1', title: 'First Video', description: 'Desc 1', create_time: 1746000000, statistics: { view_count: 100, like_count: 10 } },
            { id: 'v2', title: 'Second Video', description: 'Desc 2', create_time: 1746086400, statistics: { view_count: 200, like_count: 20 } },
          ],
        },
      },
    });
    const { listVideos } = await import('../tiktok/index.js');
    const videos = await listVideos('tt_mock_token', 10);
    expect(videos).toHaveLength(2);
    expect(videos[0].id).toBe('v1');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://open.tiktokapis.com/v2/video/list/',
      expect.objectContaining({ max_count: 10 }),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tt_mock_token' }) })
    );
  });

  it('returns empty array when no videos', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { data: { videos: [] } } });
    const { listVideos } = await import('../tiktok/index.js');
    const videos = await listVideos('tt_mock_token', 10);
    expect(videos).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="tt.list"
```

Expected: FAIL — `Cannot find module '../tiktok/index.js'`

- [ ] **Step 3: Write implementation**

File: `tools/social/tiktok/index.js`

```js
#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import * as readline from 'readline';
import { getTikTokToken, runTikTokAuthFlow } from '../auth/tiktok.js';
import { printTable, printJSON, printSuccess, printInfo } from '../lib/output.js';
import { handleError } from '../lib/error.js';

const TT_API = 'https://open.tiktokapis.com/v2';
const VIDEO_FIELDS = 'id,title,description,create_time,statistics,share_url,privacy_level';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

function formatDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleString('en-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' });
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

// ── Exported functions ────────────────────────────────────────────────────────

export async function listVideos(token, limit = 10) {
  const res = await axios.post(
    `${TT_API}/video/list/`,
    { max_count: limit },
    { headers: authHeader(token), params: { fields: VIDEO_FIELDS } }
  );
  return res.data?.data?.videos || [];
}

export async function uploadVideo(token, videoUrl, title, description, privacy = 'SELF_ONLY') {
  // Step 1: Initialize upload
  const initRes = await axios.post(
    `${TT_API}/post/publish/video/init/`,
    {
      post_info: { title, description, privacy_level: privacy.toUpperCase(), disable_duet: false, disable_comment: false, disable_stitch: false },
      source_info: { source: 'PULL_FROM_URL', video_url: videoUrl },
    },
    { headers: authHeader(token) }
  );
  return initRes.data?.data?.publish_id;
}

export async function getVideoStatus(token, publishId) {
  const res = await axios.post(
    `${TT_API}/post/publish/status/fetch/`,
    { publish_id: publishId },
    { headers: authHeader(token) }
  );
  return res.data?.data;
}

export async function getVideoAnalytics(token, videoId) {
  const res = await axios.post(
    `${TT_API}/video/query/`,
    { filters: { video_ids: [videoId] } },
    { headers: authHeader(token), params: { fields: 'id,title,statistics' } }
  );
  return res.data?.data?.videos?.[0] || null;
}

export async function getAccountAnalytics(token) {
  const res = await axios.get(`${TT_API}/research/user/info/`, {
    headers: authHeader(token),
    params: { fields: 'display_name,follower_count,following_count,likes_count,video_count' },
  });
  return res.data?.data || {};
}

export async function listComments(token, videoId) {
  const res = await axios.get(`${TT_API}/comment/list/`, {
    headers: authHeader(token),
    params: { video_id: videoId, fields: 'id,text,create_time,like_count,username' },
  });
  return res.data?.data?.comments || [];
}

export async function replyToComment(token, videoId, commentId, text) {
  const res = await axios.post(
    `${TT_API}/comment/reply/`,
    { video_id: videoId, parent_comment_id: commentId, text },
    { headers: authHeader(token) }
  );
  return res.data?.data?.comment_id;
}

export async function listDMs(token) {
  const res = await axios.get(`${TT_API}/dm/conversation/list/`, { headers: authHeader(token) });
  return res.data?.data?.conversations || [];
}

export async function readDM(token, conversationId) {
  const res = await axios.get(`${TT_API}/dm/conversation/${conversationId}/messages/`, { headers: authHeader(token) });
  return res.data?.data?.messages || [];
}

export async function sendDM(token, conversationId, text) {
  const res = await axios.post(
    `${TT_API}/dm/conversation/${conversationId}/messages/`,
    { message_type: 'text', content: { text } },
    { headers: authHeader(token) }
  );
  return res.data?.data?.message_id;
}

// ── CLI ───────────────────────────────────────────────────────────────────────

program.name('tt').description('TikTok CLI');

program.command('auth').description('Authenticate with TikTok').action(async () => {
  try { await runTikTokAuthFlow(); } catch (e) { handleError(e); }
});

program.command('list')
  .description('List posted videos')
  .option('--limit <n>', 'Number of videos', '10')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const token = await getTikTokToken();
      const videos = await listVideos(token, parseInt(opts.limit));
      if (opts.json) return printJSON(videos);
      if (!videos.length) return console.log('No videos found.');
      printTable(
        ['ID', 'Title', 'Views', 'Likes', 'Date'],
        videos.map(v => [v.id, (v.title || '').slice(0, 40), String(v.statistics?.view_count || 0), String(v.statistics?.like_count || 0), formatDate(v.create_time)])
      );
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('upload')
  .description('Upload a video')
  .requiredOption('--video <url>', 'Public video URL')
  .requiredOption('--title <t>', 'Video title')
  .requiredOption('--description <d>', 'Video description')
  .option('--privacy <level>', 'public, private, or friends', 'private')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const token = await getTikTokToken();
      if (!opts.yolo) {
        console.log(chalk.bold('Upload details:'));
        console.log(`  Video URL   : ${opts.video}`);
        console.log(`  Title       : ${opts.title}`);
        console.log(`  Description : ${opts.description}`);
        console.log(`  Privacy     : ${opts.privacy}`);
        const ok = await confirm('Upload this video?');
        if (!ok) { console.log('Cancelled.'); return; }
      }
      printInfo('Initializing upload...');
      const publishId = await uploadVideo(token, opts.video, opts.title, opts.description, opts.privacy);
      if (opts.json) return printJSON({ publish_id: publishId });
      printSuccess(`Upload initiated. Publish ID: ${publishId}`);
      printInfo('TikTok is processing the video. Check status with: tt list');
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('analytics')
  .description('Account or video analytics')
  .option('--video <id>', 'Video ID for video-level analytics')
  .option('--period <p>', '7d or 30d (account only)', '7d')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const token = await getTikTokToken();
      if (opts.video) {
        const data = await getVideoAnalytics(token, opts.video);
        if (!data) { console.log('No data found for this video.'); return; }
        if (opts.json) return printJSON(data);
        const stats = data.statistics || {};
        printTable(['Metric', 'Value'], Object.entries(stats).map(([k, v]) => [k, String(v)]));
      } else {
        const data = await getAccountAnalytics(token);
        if (opts.json) return printJSON(data);
        printTable(['Metric', 'Value'], Object.entries(data).map(([k, v]) => [k, String(v)]));
      }
    } catch (e) { handleError(e, opts.debug); }
  });

const commentsCmd = program.command('comments').description('Manage comments');

commentsCmd.command('list <video-id>')
  .description('List comments on a video')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (videoId, opts) => {
    try {
      const token = await getTikTokToken();
      const comments = await listComments(token, videoId);
      if (opts.json) return printJSON(comments);
      if (!comments.length) return console.log('No comments found.');
      printTable(['ID', 'User', 'Comment', 'Likes', 'Date'], comments.map(c => [c.id, c.username || '', (c.text || '').slice(0, 50), String(c.like_count || 0), formatDate(c.create_time)]));
    } catch (e) { handleError(e, opts.debug); }
  });

commentsCmd.command('reply <comment-id>')
  .description('Reply to a comment')
  .requiredOption('--video <id>', 'Video ID that the comment belongs to')
  .requiredOption('--body <text>', 'Reply text')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      const token = await getTikTokToken();
      const replyId = await replyToComment(token, opts.video, commentId, opts.body);
      printSuccess(`Reply posted. Comment ID: ${replyId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

const dmsCmd = program.command('dms').description('Manage DMs');

dmsCmd.command('list')
  .description('List DM conversations')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const token = await getTikTokToken();
      const convos = await listDMs(token);
      if (opts.json) return printJSON(convos);
      if (!convos.length) return console.log('No DM conversations found.');
      printTable(['ID', 'Participant', 'Last Message'], convos.map(c => [c.conversation_id || c.id, c.participant?.display_name || '', (c.last_message?.content?.text || '').slice(0, 60)]));
    } catch (e) { handleError(e, opts.debug); }
  });

dmsCmd.command('read <conversation-id>')
  .description('Read messages in a DM conversation')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (conversationId, opts) => {
    try {
      const token = await getTikTokToken();
      const messages = await readDM(token, conversationId);
      if (opts.json) return printJSON(messages);
      if (!messages.length) return console.log('No messages found.');
      printTable(['ID', 'From', 'Message', 'Date'], messages.map(m => [m.message_id || m.id, m.sender?.display_name || '', (m.content?.text || '').slice(0, 60), formatDate(m.create_time)]));
    } catch (e) { handleError(e, opts.debug); }
  });

dmsCmd.command('send <conversation-id>')
  .description('Send a DM')
  .requiredOption('--body <text>', 'Message text')
  .option('--debug', 'Show raw API response')
  .action(async (conversationId, opts) => {
    try {
      const token = await getTikTokToken();
      const msgId = await sendDM(token, conversationId, opts.body);
      printSuccess(`DM sent. Message ID: ${msgId}`);
    } catch (e) { handleError(e, opts.debug); }
  });

program.parse();
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="tt.list"
```

Expected: PASS — 2 tests pass.

- [ ] **Step 5: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/tiktok/index.js tools/social/__tests__/tt.list.test.js
git commit -m "feat: add tiktok/index.js CLI shell with tt list command"
```

---

## Task 15: tt upload with confirmation

**Files:**
- Create: `tools/social/__tests__/tt.upload.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/tt.upload.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/tiktok.js', () => ({
  getTikTokToken: jest.fn().mockResolvedValue('tt_mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}));

describe('tt upload', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.post = jest.fn();
  });

  it('uploadVideo returns publish_id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { data: { publish_id: 'pub_abc' } } });
    const { uploadVideo } = await import('../tiktok/index.js');
    const publishId = await uploadVideo('tt_mock_token', 'https://example.com/video.mp4', 'My Title', 'My Description', 'PUBLIC_TO_EVERYONE');
    expect(publishId).toBe('pub_abc');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://open.tiktokapis.com/v2/post/publish/video/init/',
      expect.objectContaining({
        post_info: expect.objectContaining({ title: 'My Title', privacy_level: 'PUBLIC_TO_EVERYONE' }),
        source_info: expect.objectContaining({ video_url: 'https://example.com/video.mp4' }),
      }),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tt_mock_token' }) })
    );
  });

  it('normalizes privacy level to uppercase', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { data: { publish_id: 'pub_xyz' } } });
    const { uploadVideo } = await import('../tiktok/index.js');
    await uploadVideo('tt_mock_token', 'https://example.com/v.mp4', 'T', 'D', 'public');
    expect(axiosMock.post.mock.calls[0][1].post_info.privacy_level).toBe('PUBLIC');
  });
});
```

- [ ] **Step 2: Run test to verify it passes (uploadVideo already implemented in Task 14)**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="tt.upload"
```

Expected: PASS — 2 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/tt.upload.test.js
git commit -m "test: add tt upload unit tests"
```

---

## Task 16: tt analytics

**Files:**
- Create: `tools/social/__tests__/tt.analytics.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/tt.analytics.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/tiktok.js', () => ({
  getTikTokToken: jest.fn().mockResolvedValue('tt_mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}));

describe('tt analytics', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
    axiosMock.post = jest.fn();
  });

  it('getVideoAnalytics returns video data', async () => {
    axiosMock.post.mockResolvedValueOnce({
      data: { data: { videos: [{ id: 'v1', title: 'Test', statistics: { view_count: 500, like_count: 30 } }] } },
    });
    const { getVideoAnalytics } = await import('../tiktok/index.js');
    const data = await getVideoAnalytics('tok', 'v1');
    expect(data.id).toBe('v1');
    expect(data.statistics.view_count).toBe(500);
  });

  it('getVideoAnalytics returns null when video not found', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { data: { videos: [] } } });
    const { getVideoAnalytics } = await import('../tiktok/index.js');
    const data = await getVideoAnalytics('tok', 'nonexistent');
    expect(data).toBeNull();
  });

  it('getAccountAnalytics returns account data object', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { display_name: 'rielcode', follower_count: 1000, video_count: 25 } },
    });
    const { getAccountAnalytics } = await import('../tiktok/index.js');
    const data = await getAccountAnalytics('tok');
    expect(data.follower_count).toBe(1000);
    expect(data.display_name).toBe('rielcode');
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="tt.analytics"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/tt.analytics.test.js
git commit -m "test: add tt analytics unit tests"
```

---

## Task 17: tt comments list/reply

**Files:**
- Create: `tools/social/__tests__/tt.comments.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/tt.comments.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/tiktok.js', () => ({
  getTikTokToken: jest.fn().mockResolvedValue('tt_mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}));

describe('tt comments', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
    axiosMock.post = jest.fn();
  });

  it('listComments returns array of comments', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { comments: [{ id: 'c1', text: 'Awesome!', username: 'bob', create_time: 1746000000, like_count: 5 }] } },
    });
    const { listComments } = await import('../tiktok/index.js');
    const comments = await listComments('tok', 'v1');
    expect(comments).toHaveLength(1);
    expect(comments[0].text).toBe('Awesome!');
    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://open.tiktokapis.com/v2/comment/list/',
      expect.objectContaining({ params: expect.objectContaining({ video_id: 'v1' }) })
    );
  });

  it('replyToComment returns reply comment_id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { data: { comment_id: 'reply_c2' } } });
    const { replyToComment } = await import('../tiktok/index.js');
    const id = await replyToComment('tok', 'v1', 'c1', 'Thanks!');
    expect(id).toBe('reply_c2');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://open.tiktokapis.com/v2/comment/reply/',
      expect.objectContaining({ video_id: 'v1', parent_comment_id: 'c1', text: 'Thanks!' }),
      expect.any(Object)
    );
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="tt.comments"
```

Expected: PASS — 2 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/tt.comments.test.js
git commit -m "test: add tt comments list/reply unit tests"
```

---

## Task 18: tt dms list/read/send

**Files:**
- Create: `tools/social/__tests__/tt.dms.test.js`

- [ ] **Step 1: Write the failing test**

File: `tools/social/__tests__/tt.dms.test.js`

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../auth/tiktok.js', () => ({
  getTikTokToken: jest.fn().mockResolvedValue('tt_mock_token'),
}));
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}));

describe('tt dms', () => {
  let axiosMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    const axiosMod = await import('axios');
    axiosMock = axiosMod.default;
    axiosMock.get = jest.fn();
    axiosMock.post = jest.fn();
  });

  it('listDMs returns array of conversations', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { conversations: [{ conversation_id: 'conv1', participant: { display_name: 'Alice' }, last_message: { content: { text: 'Hey!' } } }] } },
    });
    const { listDMs } = await import('../tiktok/index.js');
    const convos = await listDMs('tok');
    expect(convos).toHaveLength(1);
    expect(convos[0].conversation_id).toBe('conv1');
  });

  it('readDM returns array of messages', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { messages: [{ message_id: 'm1', sender: { display_name: 'Alice' }, content: { text: 'Hello' }, create_time: 1746000000 }] } },
    });
    const { readDM } = await import('../tiktok/index.js');
    const messages = await readDM('tok', 'conv1');
    expect(messages).toHaveLength(1);
    expect(messages[0].content.text).toBe('Hello');
    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://open.tiktokapis.com/v2/dm/conversation/conv1/messages/',
      expect.any(Object)
    );
  });

  it('sendDM returns message_id', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { data: { message_id: 'msg_77' } } });
    const { sendDM } = await import('../tiktok/index.js');
    const id = await sendDM('tok', 'conv1', 'Hi there!');
    expect(id).toBe('msg_77');
    expect(axiosMock.post).toHaveBeenCalledWith(
      'https://open.tiktokapis.com/v2/dm/conversation/conv1/messages/',
      expect.objectContaining({ content: expect.objectContaining({ text: 'Hi there!' }) }),
      expect.any(Object)
    );
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test -- --testPathPattern="tt.dms"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 3: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/__tests__/tt.dms.test.js
git commit -m "test: add tt dms list/read/send unit tests"
```

---

## Task 19: tt auth command wiring + full suite

**Files:**
- Verify: `tools/social/tiktok/index.js` (shebang line 1, `program.parse()` at bottom)

- [ ] **Step 1: Run full test suite**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm test
```

Expected: ALL tests pass. Summary example:
```
Test Suites: 13 passed, 13 total
Tests:       30+ passed, 30+ total
```

- [ ] **Step 2: Commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/tiktok/index.js
git commit -m "feat: wire tt auth command and complete TikTok CLI"
```

---

## Task 20: npm link verification

**Files:** None — verification step only.

- [ ] **Step 1: npm link the package**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS\tools\social"
npm link
```

Expected: No errors. `ig` and `tt` are now globally linked.

- [ ] **Step 2: Verify ig --help**

```powershell
ig --help
```

Expected output (exact command list):
```
Usage: ig [options] [command]

Instagram CLI (Meta Graph API)

Commands:
  auth
  list [options]
  post [options]
  reels [options]
  stories [options]
  analytics [options]
  comments
  dms
  help [command]
```

- [ ] **Step 3: Verify tt --help**

```powershell
tt --help
```

Expected output:
```
Usage: tt [options] [command]

TikTok CLI

Commands:
  auth
  list [options]
  upload [options]
  analytics [options]
  comments
  dms
  help [command]
```

- [ ] **Step 4: Verify ig list error when not authenticated**

```powershell
ig list
```

Expected: `Not authenticated. Run: ig auth` printed to stderr, exit code 1.

- [ ] **Step 5: Verify tt list error when not authenticated**

```powershell
tt list
```

Expected: `Not authenticated. Run: tt auth` printed to stderr, exit code 1.

- [ ] **Step 6: Final commit**

```powershell
cd "c:\Users\afw14\OneDrive\Documents\JARVIS"
git add tools/social/
git commit -m "feat: complete tools/social package — ig and tt CLI ready for npm link"
```

---

## Error Handling Reference

| Error | Message shown | Exit code |
|---|---|---|
| No token file | `Not authenticated. Run: ig auth` / `Not authenticated. Run: tt auth` | 1 |
| Token expired | Silent auto-refresh attempt, falls back to existing token | — |
| Axios HTTP error | `Error: <err.message>` (or full object with `--debug`) | 1 |
| Rate limit (429) | `Error: Rate limit reached. Retry after <Retry-After>.` | 1 |
| File not found | `Error: File not found: <path>` | 1 |
| No internet | `Error: <axios network error message>` | 1 |

> Note on rate limits: axios does not auto-parse `Retry-After`. Add this to `lib/error.js` if you want to surface it cleanly:
> ```js
> if (err?.response?.status === 429) {
>   const retryAfter = err.response.headers['retry-after'] || 'unknown';
>   console.error(chalk.red('Rate limit reached. Retry after'), retryAfter + 's.');
>   process.exit(1);
> }
> ```

---

## OAuth Notes

### Instagram (Meta Graph API)
- Requires a Meta Developer App with Instagram Graph API product added.
- `instagram_manage_messages` scope requires **Meta Business Verification** and app review. DM features will not work until approved.
- Tokens are long-lived (~60 days). The auth flow exchanges a short-lived code for a long-lived token automatically.
- Redirect URI must exactly match what is registered in the Meta App dashboard.
- For local dev, use `http://localhost:9876/callback` and add it as a valid OAuth redirect URI in Meta App settings.

### TikTok
- Requires a TikTok Developer App registered at developers.tiktok.com.
- Uses PKCE (`code_challenge`/`code_verifier`) — already implemented in `auth/tiktok.js`.
- `message.send` scope requires TikTok business verification. DM features will not work until approved.
- Access tokens are short-lived (~24h). Refresh tokens last ~365 days. Auto-refresh is handled in `getTikTokToken()`.
