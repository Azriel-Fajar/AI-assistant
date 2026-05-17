# YouTube CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `yt` CLI command to the existing tools/google package, covering upload, list, analytics, comments, and search.

**Architecture:** Extends tools/google/ by adding a youtube/index.js entry point and adding the YouTube API scope to the shared OAuth module. No new dependencies needed -- googleapis package already included.

**Tech Stack:** Node.js, googleapis@140, commander@12, cli-table3, chalk, jest (tests)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `tools/google/package.json` | Add `yt` bin entry, add jest devDependency and test script |
| Modify | `tools/google/auth/oauth.js` | Add YouTube scope to SCOPES array |
| Create | `tools/google/youtube/index.js` | All `yt` subcommands via commander |
| Create | `tools/google/tests/youtube.test.js` | Jest unit tests with mocked googleapis |

---

## Task 1: Scaffold -- package.json + oauth.js scope

**Files:**
- Modify: `tools/google/package.json`
- Modify: `tools/google/auth/oauth.js`

- [ ] **Step 1.1: Add jest devDependency and test script to package.json**

Replace the entire contents of `tools/google/package.json` with:

```json
{
  "name": "jarvis-google-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "gcal": "./gcal/index.js",
    "gmail": "./gmail/index.js",
    "gdrive": "./gdrive/index.js",
    "yt": "./youtube/index.js"
  },
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/.bin/jest --testPathPattern=tests/"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "cli-table3": "^0.6.3",
    "commander": "^12.1.0",
    "googleapis": "^140.0.0",
    "open": "^10.1.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

- [ ] **Step 1.2: Add YouTube scope to `tools/google/auth/oauth.js`**

Find this block in `tools/google/auth/oauth.js`:

```js
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/drive',
];
```

Replace it with:

```js
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/youtube',
];
```

- [ ] **Step 1.3: Fix `notAuthenticated` message in `tools/google/lib/error.js`**

The existing `notAuthenticated()` function says "Run: gcal auth". Update it to be generic:

```js
export function notAuthenticated() {
  console.error(chalk.yellow('Not authenticated.'), 'Run: yt auth (or gcal auth)');
  process.exit(1);
}
```

- [ ] **Step 1.4: Install jest**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm install --save-dev jest
```

Expected output: `added N packages`

- [ ] **Step 1.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/package.json tools/google/auth/oauth.js tools/google/lib/error.js
git commit -m "feat(yt): add YouTube scope and yt bin entry, install jest"
```

---

## Task 2: Test scaffold -- mocked googleapis setup

**Files:**
- Create: `tools/google/tests/youtube.test.js`

This task establishes the mock infrastructure all future tests will use. Read this carefully before moving on -- later tasks add tests to this file.

- [ ] **Step 2.1: Create `tools/google/tests/youtube.test.js` with mock setup**

```js
// tools/google/tests/youtube.test.js
import { jest } from '@jest/globals';

// --- Mocks must be declared before any import of the module under test ---

const mockVideosList = jest.fn();
const mockVideosInsert = jest.fn();
const mockSearchList = jest.fn();
const mockReportsDimAndMetrics = jest.fn();
const mockCommentThreadsList = jest.fn();
const mockCommentsList = jest.fn();
const mockCommentsInsert = jest.fn();
const mockCommentsDelete = jest.fn();

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => ({
      videos: {
        list: mockVideosList,
        insert: mockVideosInsert,
      },
      search: {
        list: mockSearchList,
      },
      commentThreads: {
        list: mockCommentThreadsList,
      },
      comments: {
        list: mockCommentsList,
        insert: mockCommentsInsert,
        delete: mockCommentsDelete,
      },
    })),
    youtubeAnalytics: jest.fn(() => ({
      reports: {
        query: mockReportsDimAndMetrics,
      },
    })),
  },
}));

// Mock the shared auth module
jest.mock('../auth/oauth.js', () => ({
  getAuthenticatedClient: jest.fn().mockResolvedValue({ mock: 'authClient' }),
  runAuthFlow: jest.fn().mockResolvedValue(undefined),
}));

// Mock output helpers so tests don't print to stdout
jest.mock('../lib/output.js', () => ({
  printTable: jest.fn(),
  printJson: jest.fn(),
  printSuccess: jest.fn(),
  printInfo: jest.fn(),
}));

// Mock error helpers -- capture exit calls
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit'); });

import { printTable, printJson, printSuccess } from '../lib/output.js';

// Expose mocks for use in describe blocks
export {
  mockVideosList,
  mockVideosInsert,
  mockSearchList,
  mockReportsDimAndMetrics,
  mockCommentThreadsList,
  mockCommentsList,
  mockCommentsInsert,
  mockCommentsDelete,
  mockExit,
};

// Placeholder test so jest can parse this file without zero-test error
describe('YouTube CLI mock scaffold', () => {
  test('mock setup loads without error', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2.2: Run tests to confirm scaffold passes**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm test
```

Expected output:
```
PASS tests/youtube.test.js
  YouTube CLI mock scaffold
    ✓ mock setup loads without error
Test Suites: 1 passed
```

- [ ] **Step 2.3: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/tests/youtube.test.js
git commit -m "test(yt): add jest scaffold with mocked googleapis"
```

---

## Task 3: `yt list` -- list channel videos

**Files:**
- Modify: `tools/google/tests/youtube.test.js` (add tests)
- Create: `tools/google/youtube/index.js` (start file, implement list)

**What the YouTube API call looks like:**

```js
// videos.list with forMine:true returns the authenticated user's uploads
youtube.videos.list({
  part: ['snippet', 'status', 'statistics'],
  myRating: 'like',      // NOT used -- see below
})
```

Actually the correct call for "my channel's videos" is:

```js
// Step 1: get the uploads playlist id from channel
youtube.channels.list({ part: ['contentDetails'], mine: true })
// Step 2: list that playlist
youtube.playlistItems.list({ part: ['snippet'], playlistId: <uploadsPlaylistId>, maxResults: limit })
```

To keep the implementation simple and testable without a two-step chain, we use `videos.list` with `myRating` NOT set -- instead we use the channel's uploads playlist. Because the mock is per-function, the plan will mock `channels.list` and `playlistItems.list`. Update the mock scaffold accordingly.

**Updated mock scaffold addition** (do this before writing tests):

- [ ] **Step 3.1: Add `channels` and `playlistItems` mocks to `tools/google/tests/youtube.test.js`**

Add these at the top of the mock declarations (after existing `const mock...` lines):

```js
const mockChannelsList = jest.fn();
const mockPlaylistItemsList = jest.fn();
```

Update the `google.youtube` mock to include them:

```js
jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => ({
      videos: {
        list: mockVideosList,
        insert: mockVideosInsert,
      },
      search: {
        list: mockSearchList,
      },
      channels: {
        list: mockChannelsList,
      },
      playlistItems: {
        list: mockPlaylistItemsList,
      },
      commentThreads: {
        list: mockCommentThreadsList,
      },
      comments: {
        list: mockCommentsList,
        insert: mockCommentsInsert,
        delete: mockCommentsDelete,
      },
    })),
    youtubeAnalytics: jest.fn(() => ({
      reports: {
        query: mockReportsDimAndMetrics,
      },
    })),
  },
}));
```

Also add `mockChannelsList` and `mockPlaylistItemsList` to the export block.

- [ ] **Step 3.2: Write the failing test for `yt list`**

Add this describe block to `tools/google/tests/youtube.test.js`:

```js
import { listVideos } from '../youtube/index.js';

describe('yt list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChannelsList.mockResolvedValue({
      data: {
        items: [{ contentDetails: { relatedPlaylists: { uploads: 'PLxxx123' } } }],
      },
    });
    mockPlaylistItemsList.mockResolvedValue({
      data: {
        items: [
          {
            snippet: {
              title: 'My First Video',
              resourceId: { videoId: 'vid001' },
              publishedAt: '2026-05-01T10:00:00Z',
            },
          },
          {
            snippet: {
              title: 'Second Video',
              resourceId: { videoId: 'vid002' },
              publishedAt: '2026-05-10T10:00:00Z',
            },
          },
        ],
      },
    });
  });

  test('prints table with video list', async () => {
    await listVideos({ limit: 10, json: false });
    expect(mockChannelsList).toHaveBeenCalledWith({
      part: ['contentDetails'],
      mine: true,
    });
    expect(mockPlaylistItemsList).toHaveBeenCalledWith({
      part: ['snippet'],
      playlistId: 'PLxxx123',
      maxResults: 10,
    });
    expect(printTable).toHaveBeenCalledWith(
      ['Video ID', 'Title', 'Published'],
      [
        ['vid001', 'My First Video', expect.any(String)],
        ['vid002', 'Second Video', expect.any(String)],
      ]
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await listVideos({ limit: 5, json: true });
    expect(printJson).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ videoId: 'vid001', title: 'My First Video' }),
      ])
    );
  });
});
```

- [ ] **Step 3.3: Run tests -- expect FAIL**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm test
```

Expected: FAIL -- `Cannot find module '../youtube/index.js'`

- [ ] **Step 3.4: Create `tools/google/youtube/index.js` with `listVideos` implemented**

```js
#!/usr/bin/env node
// tools/google/youtube/index.js
import { program } from 'commander';
import { google } from 'googleapis';
import * as readline from 'readline';
import { getAuthenticatedClient, runAuthFlow } from '../auth/oauth.js';
import { printTable, printJson, printSuccess, printInfo } from '../lib/output.js';
import { handleError } from '../lib/error.js';

// --- Shared helpers ---

async function getYouTube() {
  const auth = await getAuthenticatedClient();
  return google.youtube({ version: 'v3', auth });
}

async function getYouTubeAnalytics() {
  const auth = await getAuthenticatedClient();
  return google.youtubeAnalytics({ version: 'v2', auth });
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

// --- Command implementations (exported for testing) ---

export async function listVideos(opts) {
  const yt = await getYouTube();

  const channelRes = await yt.channels.list({ part: ['contentDetails'], mine: true });
  const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

  const res = await yt.playlistItems.list({
    part: ['snippet'],
    playlistId: uploadsPlaylistId,
    maxResults: opts.limit,
  });

  const items = res.data.items || [];

  if (opts.json) {
    return printJson(items.map(i => ({
      videoId: i.snippet.resourceId.videoId,
      title: i.snippet.title,
      publishedAt: i.snippet.publishedAt,
    })));
  }

  if (!items.length) {
    console.log('No videos found.');
    return;
  }

  printTable(
    ['Video ID', 'Title', 'Published'],
    items.map(i => [
      i.snippet.resourceId.videoId,
      i.snippet.title,
      formatDate(i.snippet.publishedAt),
    ])
  );
}

// --- CLI wiring ---

program.name('yt').description('YouTube CLI');

program
  .command('auth')
  .description('Re-authenticate with Google (adds YouTube scope)')
  .action(async () => {
    try {
      await runAuthFlow();
    } catch (e) {
      handleError(e);
    }
  });

program
  .command('list')
  .description('List your channel videos')
  .option('--limit <n>', 'Max results', '10')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await listVideos({ limit: parseInt(opts.limit), json: !!opts.json });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

program.parse();
```

- [ ] **Step 3.5: Run tests -- expect PASS**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt list
    ✓ prints table with video list
    ✓ prints JSON when --json flag is set
```

- [ ] **Step 3.6: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt list with channel uploads playlist"
```

---

## Task 4: `yt upload` -- upload a video

**Files:**
- Modify: `tools/google/tests/youtube.test.js`
- Modify: `tools/google/youtube/index.js`

The YouTube Data API v3 `videos.insert` accepts a multipart body with metadata + media stream.

- [ ] **Step 4.1: Write the failing tests for `yt upload`**

Add these imports at the top of `tools/google/tests/youtube.test.js` (update the import line):

```js
import { listVideos, uploadVideo } from '../youtube/index.js';
```

Add this describe block:

```js
import { existsSync } from 'fs';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  createReadStream: jest.fn().mockReturnValue('MOCK_STREAM'),
  statSync: jest.fn().mockReturnValue({ size: 1024 }),
}));

describe('yt upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    existsSync.mockReturnValue(true);
    mockVideosInsert.mockResolvedValue({
      data: { id: 'newVid001', snippet: { title: 'Test Video' } },
    });
  });

  test('uploads video and prints success', async () => {
    await uploadVideo({
      file: '/fake/video.mp4',
      title: 'Test Video',
      description: 'A test upload',
      tags: ['tag1', 'tag2'],
      privacy: 'private',
      yolo: true,
    });

    expect(mockVideosInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: 'Test Video',
            description: 'A test upload',
            tags: ['tag1', 'tag2'],
          },
          status: { privacyStatus: 'private' },
        },
      })
    );
    expect(printSuccess).toHaveBeenCalledWith(expect.stringContaining('newVid001'));
  });

  test('exits with error when file does not exist', async () => {
    existsSync.mockReturnValue(false);

    await expect(
      uploadVideo({
        file: '/no/such/file.mp4',
        title: 'X',
        description: '',
        tags: [],
        privacy: 'private',
        yolo: true,
      })
    ).rejects.toThrow('process.exit');

    expect(mockVideosInsert).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4.2: Run tests -- expect FAIL**

```powershell
npm test
```

Expected: FAIL -- `uploadVideo is not exported`

- [ ] **Step 4.3: Implement `uploadVideo` in `tools/google/youtube/index.js`**

Add these imports at the top of `tools/google/youtube/index.js` (below the existing imports):

```js
import { existsSync, createReadStream, statSync } from 'fs';
import chalk from 'chalk';
```

Add the `uploadVideo` export function after `listVideos`:

```js
export async function uploadVideo(opts) {
  if (!existsSync(opts.file)) {
    console.error(chalk.red('File not found:'), opts.file);
    process.exit(1);
  }

  if (!opts.yolo) {
    const ok = await confirm(
      `Upload "${opts.title}" as ${opts.privacy}?`
    );
    if (!ok) {
      console.log('Cancelled.');
      return;
    }
  }

  const yt = await getYouTube();

  printInfo(`Uploading "${opts.title}"...`);

  const res = await yt.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: opts.title,
        description: opts.description,
        tags: opts.tags,
      },
      status: {
        privacyStatus: opts.privacy,
      },
    },
    media: {
      mimeType: 'video/*',
      body: createReadStream(opts.file),
    },
  });

  printSuccess(`Uploaded: "${res.data.snippet.title}" — ID: ${res.data.id}`);
}
```

Add the `upload` command to the CLI wiring section (before `program.parse()`):

```js
program
  .command('upload <file>')
  .description('Upload a video to YouTube')
  .requiredOption('--title <t>', 'Video title')
  .option('--description <d>', 'Video description', '')
  .option('--tags <tags>', 'Comma-separated tags', '')
  .option('--privacy <p>', 'public, private, or unlisted', 'private')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (file, opts) => {
    try {
      await uploadVideo({
        file,
        title: opts.title,
        description: opts.description,
        tags: opts.tags ? opts.tags.split(',').map(t => t.trim()) : [],
        privacy: opts.privacy,
        yolo: !!opts.yolo,
      });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });
```

- [ ] **Step 4.4: Run tests -- expect PASS**

```powershell
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt upload
    ✓ uploads video and prints success
    ✓ exits with error when file does not exist
```

- [ ] **Step 4.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt upload with file check and confirmation"
```

---

## Task 5: `yt search` -- search YouTube

**Files:**
- Modify: `tools/google/tests/youtube.test.js`
- Modify: `tools/google/youtube/index.js`

- [ ] **Step 5.1: Write the failing tests for `yt search`**

Update the import line:

```js
import { listVideos, uploadVideo, searchVideos } from '../youtube/index.js';
```

Add describe block:

```js
describe('yt search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchList.mockResolvedValue({
      data: {
        items: [
          {
            id: { videoId: 'srch001' },
            snippet: { title: 'Result One', channelTitle: 'Chan A', publishedAt: '2026-01-01T00:00:00Z' },
          },
          {
            id: { videoId: 'srch002' },
            snippet: { title: 'Result Two', channelTitle: 'Chan B', publishedAt: '2026-02-01T00:00:00Z' },
          },
        ],
      },
    });
  });

  test('calls search.list and prints table', async () => {
    await searchVideos({ query: 'react tutorial', json: false });

    expect(mockSearchList).toHaveBeenCalledWith({
      part: ['snippet'],
      q: 'react tutorial',
      type: ['video'],
      maxResults: 10,
    });

    expect(printTable).toHaveBeenCalledWith(
      ['Video ID', 'Title', 'Channel', 'Published'],
      [
        ['srch001', 'Result One', 'Chan A', expect.any(String)],
        ['srch002', 'Result Two', 'Chan B', expect.any(String)],
      ]
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await searchVideos({ query: 'react', json: true });
    expect(printJson).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ videoId: 'srch001', title: 'Result One' }),
      ])
    );
  });
});
```

- [ ] **Step 5.2: Run tests -- expect FAIL**

```powershell
npm test
```

Expected: FAIL -- `searchVideos is not exported`

- [ ] **Step 5.3: Implement `searchVideos` in `tools/google/youtube/index.js`**

Add after `uploadVideo`:

```js
export async function searchVideos(opts) {
  const yt = await getYouTube();

  const res = await yt.search.list({
    part: ['snippet'],
    q: opts.query,
    type: ['video'],
    maxResults: 10,
  });

  const items = res.data.items || [];

  if (opts.json) {
    return printJson(items.map(i => ({
      videoId: i.id.videoId,
      title: i.snippet.title,
      channel: i.snippet.channelTitle,
      publishedAt: i.snippet.publishedAt,
    })));
  }

  if (!items.length) {
    console.log('No results found.');
    return;
  }

  printTable(
    ['Video ID', 'Title', 'Channel', 'Published'],
    items.map(i => [
      i.id.videoId,
      i.snippet.title,
      i.snippet.channelTitle,
      formatDate(i.snippet.publishedAt),
    ])
  );
}
```

Add the `search` command before `program.parse()`:

```js
program
  .command('search <query>')
  .description('Search YouTube videos')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (query, opts) => {
    try {
      await searchVideos({ query, json: !!opts.json });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });
```

- [ ] **Step 5.4: Run tests -- expect PASS**

```powershell
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt search
    ✓ calls search.list and prints table
    ✓ prints JSON when --json flag is set
```

- [ ] **Step 5.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt search"
```

---

## Task 6: `yt analytics` -- channel or video analytics

**Files:**
- Modify: `tools/google/tests/youtube.test.js`
- Modify: `tools/google/youtube/index.js`

The YouTube Analytics API (`youtubeAnalytics v2`) `reports.query` endpoint takes `startDate`, `endDate`, `dimensions`, `metrics`, and optionally `filters`.

- [ ] **Step 6.1: Write the failing tests for `yt analytics`**

Update the import line:

```js
import { listVideos, uploadVideo, searchVideos, getAnalytics } from '../youtube/index.js';
```

Add describe block:

```js
describe('yt analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReportsDimAndMetrics.mockResolvedValue({
      data: {
        columnHeaders: [
          { name: 'day' },
          { name: 'views' },
          { name: 'likes' },
          { name: 'comments' },
        ],
        rows: [
          ['2026-05-01', 120, 10, 2],
          ['2026-05-02', 200, 20, 5],
        ],
      },
    });
  });

  test('queries channel analytics for 7d period', async () => {
    await getAnalytics({ videoId: null, period: '7d', json: false });

    expect(mockReportsDimAndMetrics).toHaveBeenCalledWith(
      expect.objectContaining({
        ids: 'channel==MINE',
        dimensions: 'day',
        metrics: 'views,likes,comments,estimatedMinutesWatched',
        sort: 'day',
      })
    );

    expect(printTable).toHaveBeenCalledWith(
      ['day', 'views', 'likes', 'comments'],
      [
        ['2026-05-01', 120, 10, 2],
        ['2026-05-02', 200, 20, 5],
      ]
    );
  });

  test('queries video-specific analytics when --video is set', async () => {
    await getAnalytics({ videoId: 'vid123', period: '30d', json: false });

    expect(mockReportsDimAndMetrics).toHaveBeenCalledWith(
      expect.objectContaining({
        ids: 'channel==MINE',
        filters: 'video==vid123',
      })
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await getAnalytics({ videoId: null, period: '7d', json: true });
    expect(printJson).toHaveBeenCalledWith(
      expect.objectContaining({ rows: expect.any(Array) })
    );
  });
});
```

- [ ] **Step 6.2: Run tests -- expect FAIL**

```powershell
npm test
```

Expected: FAIL -- `getAnalytics is not exported`

- [ ] **Step 6.3: Implement `getAnalytics` in `tools/google/youtube/index.js`**

Add a helper after `formatDate`:

```js
function periodToDates(period) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const fmt = d => d.toISOString().split('T')[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}
```

Add after `searchVideos`:

```js
export async function getAnalytics(opts) {
  const yta = await getYouTubeAnalytics();
  const { startDate, endDate } = periodToDates(opts.period);

  const params = {
    ids: 'channel==MINE',
    startDate,
    endDate,
    dimensions: 'day',
    metrics: 'views,likes,comments,estimatedMinutesWatched',
    sort: 'day',
  };

  if (opts.videoId) {
    params.filters = `video==${opts.videoId}`;
  }

  const res = await yta.reports.query(params);

  if (opts.json) {
    return printJson(res.data);
  }

  const headers = (res.data.columnHeaders || []).map(h => h.name);
  const rows = res.data.rows || [];

  if (!rows.length) {
    console.log('No analytics data found for this period.');
    return;
  }

  printTable(headers, rows);
}
```

Add the `analytics` command before `program.parse()`:

```js
program
  .command('analytics')
  .description('Channel or video analytics')
  .option('--video <id>', 'Video ID (omit for channel-level)')
  .option('--period <p>', '7d, 30d, or 90d', '30d')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await getAnalytics({
        videoId: opts.video || null,
        period: opts.period,
        json: !!opts.json,
      });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });
```

- [ ] **Step 6.4: Run tests -- expect PASS**

```powershell
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt analytics
    ✓ queries channel analytics for 7d period
    ✓ queries video-specific analytics when --video is set
    ✓ prints JSON when --json flag is set
```

- [ ] **Step 6.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt analytics with period and video filter"
```

---

## Task 7: `yt comments list` -- list comments on a video

**Files:**
- Modify: `tools/google/tests/youtube.test.js`
- Modify: `tools/google/youtube/index.js`

- [ ] **Step 7.1: Write the failing tests for `yt comments list`**

Update import:

```js
import { listVideos, uploadVideo, searchVideos, getAnalytics, listComments } from '../youtube/index.js';
```

Add describe block:

```js
describe('yt comments list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCommentThreadsList.mockResolvedValue({
      data: {
        items: [
          {
            id: 'ct001',
            snippet: {
              topLevelComment: {
                id: 'c001',
                snippet: {
                  textDisplay: 'Great video!',
                  authorDisplayName: 'Alice',
                  publishedAt: '2026-05-10T08:00:00Z',
                  likeCount: 5,
                },
              },
              totalReplyCount: 2,
            },
          },
          {
            id: 'ct002',
            snippet: {
              topLevelComment: {
                id: 'c002',
                snippet: {
                  textDisplay: 'Nice work!',
                  authorDisplayName: 'Bob',
                  publishedAt: '2026-05-11T09:00:00Z',
                  likeCount: 1,
                },
              },
              totalReplyCount: 0,
            },
          },
        ],
      },
    });
  });

  test('lists comments with table output', async () => {
    await listComments({ videoId: 'vid001', json: false });

    expect(mockCommentThreadsList).toHaveBeenCalledWith({
      part: ['snippet'],
      videoId: 'vid001',
      maxResults: 20,
      order: 'time',
    });

    expect(printTable).toHaveBeenCalledWith(
      ['Comment ID', 'Author', 'Text (preview)', 'Likes', 'Replies'],
      [
        ['c001', 'Alice', 'Great video!', 5, 2],
        ['c002', 'Bob', 'Nice work!', 1, 0],
      ]
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await listComments({ videoId: 'vid001', json: true });
    expect(printJson).toHaveBeenCalledWith(expect.any(Array));
  });
});
```

- [ ] **Step 7.2: Run tests -- expect FAIL**

```powershell
npm test
```

Expected: FAIL -- `listComments is not exported`

- [ ] **Step 7.3: Implement `listComments` in `tools/google/youtube/index.js`**

Add after `getAnalytics`:

```js
export async function listComments(opts) {
  const yt = await getYouTube();

  const res = await yt.commentThreads.list({
    part: ['snippet'],
    videoId: opts.videoId,
    maxResults: 20,
    order: 'time',
  });

  const items = res.data.items || [];

  if (opts.json) {
    return printJson(items.map(i => ({
      threadId: i.id,
      commentId: i.snippet.topLevelComment.id,
      author: i.snippet.topLevelComment.snippet.authorDisplayName,
      text: i.snippet.topLevelComment.snippet.textDisplay,
      likes: i.snippet.topLevelComment.snippet.likeCount,
      replies: i.snippet.totalReplyCount,
      publishedAt: i.snippet.topLevelComment.snippet.publishedAt,
    })));
  }

  if (!items.length) {
    console.log('No comments found.');
    return;
  }

  printTable(
    ['Comment ID', 'Author', 'Text (preview)', 'Likes', 'Replies'],
    items.map(i => {
      const s = i.snippet.topLevelComment.snippet;
      return [
        i.snippet.topLevelComment.id,
        s.authorDisplayName,
        s.textDisplay.slice(0, 60),
        s.likeCount,
        i.snippet.totalReplyCount,
      ];
    })
  );
}
```

Add the `comments` command group before `program.parse()`:

```js
const comments = program.command('comments').description('Manage video comments');

comments
  .command('list <video-id>')
  .description('List comments on a video')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (videoId, opts) => {
    try {
      await listComments({ videoId, json: !!opts.json });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });
```

- [ ] **Step 7.4: Run tests -- expect PASS**

```powershell
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt comments list
    ✓ lists comments with table output
    ✓ prints JSON when --json flag is set
```

- [ ] **Step 7.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt comments list"
```

---

## Task 8: `yt comments reply` -- reply to a comment

**Files:**
- Modify: `tools/google/tests/youtube.test.js`
- Modify: `tools/google/youtube/index.js`

- [ ] **Step 8.1: Write the failing tests for `yt comments reply`**

Update import:

```js
import { listVideos, uploadVideo, searchVideos, getAnalytics, listComments, replyToComment } from '../youtube/index.js';
```

Add describe block:

```js
describe('yt comments reply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCommentsInsert.mockResolvedValue({
      data: { id: 'reply001', snippet: { textDisplay: 'Thanks!' } },
    });
  });

  test('inserts a reply comment and prints success', async () => {
    await replyToComment({ commentId: 'c001', body: 'Thanks!' });

    expect(mockCommentsInsert).toHaveBeenCalledWith({
      part: ['snippet'],
      requestBody: {
        snippet: {
          parentId: 'c001',
          textOriginal: 'Thanks!',
        },
      },
    });

    expect(printSuccess).toHaveBeenCalledWith(expect.stringContaining('reply001'));
  });
});
```

- [ ] **Step 8.2: Run tests -- expect FAIL**

```powershell
npm test
```

Expected: FAIL -- `replyToComment is not exported`

- [ ] **Step 8.3: Implement `replyToComment` in `tools/google/youtube/index.js`**

Add after `listComments`:

```js
export async function replyToComment(opts) {
  const yt = await getYouTube();

  const res = await yt.comments.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        parentId: opts.commentId,
        textOriginal: opts.body,
      },
    },
  });

  printSuccess(`Reply posted — ID: ${res.data.id}`);
}
```

Add to the `comments` command group (after `comments list`):

```js
comments
  .command('reply <comment-id>')
  .description('Reply to a comment')
  .requiredOption('--body <b>', 'Reply text')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      await replyToComment({ commentId, body: opts.body });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });
```

- [ ] **Step 8.4: Run tests -- expect PASS**

```powershell
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt comments reply
    ✓ inserts a reply comment and prints success
```

- [ ] **Step 8.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt comments reply"
```

---

## Task 9: `yt comments delete` -- delete a comment with confirmation

**Files:**
- Modify: `tools/google/tests/youtube.test.js`
- Modify: `tools/google/youtube/index.js`

- [ ] **Step 9.1: Write the failing tests for `yt comments delete`**

Update import:

```js
import { listVideos, uploadVideo, searchVideos, getAnalytics, listComments, replyToComment, deleteComment } from '../youtube/index.js';
```

Add describe block:

```js
describe('yt comments delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCommentsList.mockResolvedValue({
      data: {
        items: [
          { id: 'c001', snippet: { textDisplay: 'This is the comment text to preview.' } },
        ],
      },
    });
    mockCommentsDelete.mockResolvedValue({ data: {} });
  });

  test('deletes comment with --yolo flag (no confirmation)', async () => {
    await deleteComment({ commentId: 'c001', yolo: true });

    expect(mockCommentsDelete).toHaveBeenCalledWith({ id: 'c001' });
    expect(printSuccess).toHaveBeenCalledWith(expect.stringContaining('c001'));
  });

  test('does NOT delete when confirmation is declined', async () => {
    // Mock readline to simulate 'n' input
    jest.mock('readline', () => ({
      createInterface: jest.fn(() => ({
        question: jest.fn((_, cb) => cb('n')),
        close: jest.fn(),
      })),
    }));

    await deleteComment({ commentId: 'c001', yolo: false });

    // comments.list is called to get the preview text
    expect(mockCommentsList).toHaveBeenCalledWith({
      part: ['snippet'],
      id: ['c001'],
    });

    expect(mockCommentsDelete).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 9.2: Run tests -- expect FAIL**

```powershell
npm test
```

Expected: FAIL -- `deleteComment is not exported`

- [ ] **Step 9.3: Implement `deleteComment` in `tools/google/youtube/index.js`**

Add after `replyToComment`:

```js
export async function deleteComment(opts) {
  const yt = await getYouTube();

  if (!opts.yolo) {
    // Fetch comment text for confirmation preview
    const res = await yt.comments.list({
      part: ['snippet'],
      id: [opts.commentId],
    });
    const text = res.data.items?.[0]?.snippet?.textDisplay || opts.commentId;
    const preview = text.length > 60 ? text.slice(0, 57) + '...' : text;

    const ok = await confirm(`Delete comment "${preview}"?`);
    if (!ok) {
      console.log('Cancelled.');
      return;
    }
  }

  await yt.comments.delete({ id: opts.commentId });
  printSuccess(`Deleted comment: ${opts.commentId}`);
}
```

Add to the `comments` command group:

```js
comments
  .command('delete <comment-id>')
  .description('Delete a comment')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      await deleteComment({ commentId, yolo: !!opts.yolo });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });
```

- [ ] **Step 9.4: Run tests -- expect PASS**

```powershell
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt comments delete
    ✓ deletes comment with --yolo flag (no confirmation)
    ✓ does NOT delete when confirmation is declined
```

- [ ] **Step 9.5: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "feat(yt): implement yt comments delete with confirmation"
```

---

## Task 10: `yt auth` -- re-run OAuth with YouTube scope

This is already wired in `youtube/index.js` from Task 3 (`program.command('auth')` delegates to `runAuthFlow()`). This task adds an explicit test and verifies the scope is present in `auth/oauth.js`.

**Files:**
- Modify: `tools/google/tests/youtube.test.js`

- [ ] **Step 10.1: Write test for `yt auth` delegation**

Update import:

```js
import { listVideos, uploadVideo, searchVideos, getAnalytics, listComments, replyToComment, deleteComment, runAuth } from '../youtube/index.js';
```

Add a thin `runAuth` export to `youtube/index.js` (add after `deleteComment`):

```js
export async function runAuth() {
  await runAuthFlow();
}
```

Add describe block to `tests/youtube.test.js`:

```js
import { runAuthFlow } from '../auth/oauth.js';

describe('yt auth', () => {
  beforeEach(() => jest.clearAllMocks());

  test('delegates to runAuthFlow', async () => {
    await runAuth();
    expect(runAuthFlow).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 10.2: Verify YouTube scope in `auth/oauth.js`**

Run this command -- the output must include the YouTube scope:

```powershell
Select-String "youtube" C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google\auth\oauth.js
```

Expected output contains:
```
https://www.googleapis.com/auth/youtube
```

- [ ] **Step 10.3: Run tests -- expect PASS**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm test
```

Expected:
```
PASS tests/youtube.test.js
  yt auth
    ✓ delegates to runAuthFlow
```

- [ ] **Step 10.4: Commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js
git commit -m "test(yt): add auth delegation test and verify YouTube scope"
```

---

## Task 11: Integration -- npm link + full test run

This task confirms the binary works end-to-end as a CLI, not just as a module.

- [ ] **Step 11.1: Run all tests and confirm 100% pass**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm test
```

Expected output:
```
PASS tests/youtube.test.js
Test Suites: 1 passed, 1 total
Tests:       <N> passed, <N> total
```

- [ ] **Step 11.2: Confirm `youtube/index.js` has the shebang line**

The first line of `tools/google/youtube/index.js` must be:

```js
#!/usr/bin/env node
```

Check it:

```powershell
Get-Content C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google\youtube\index.js -TotalCount 1
```

Expected: `#!/usr/bin/env node`

- [ ] **Step 11.3: npm link the package**

If not already linked (gcal, gmail, gdrive work), run:

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS\tools\google
npm link
```

Expected: `added 1 package` or `up to date` with symlinks created.

- [ ] **Step 11.4: Verify `yt` binary is available**

```powershell
yt --help
```

Expected output:
```
Usage: yt [options] [command]

YouTube CLI

Options:
  -h, --help      display help for command

Commands:
  auth            Re-authenticate with Google (adds YouTube scope)
  list            List your channel videos
  upload <file>   Upload a video to YouTube
  search <query>  Search YouTube videos
  analytics       Channel or video analytics
  comments        Manage video comments
  help [command]  display help for command
```

- [ ] **Step 11.5: Smoke test `yt auth` (live)**

```powershell
yt auth
```

Expected: browser opens, prompts for auth code. If tokens are already valid, it re-issues them with the YouTube scope added. Paste the code and confirm `Authenticated. Token saved.`

- [ ] **Step 11.6: Smoke test `yt list` (live)**

```powershell
yt list --limit 5
```

Expected: table with up to 5 of your channel's videos, or `No videos found.`

- [ ] **Step 11.7: Final commit**

```powershell
cd C:\Users\afw14\OneDrive\Documents\JARVIS
git add tools/google/youtube/index.js tools/google/tests/youtube.test.js tools/google/package.json tools/google/auth/oauth.js tools/google/lib/error.js
git commit -m "feat(yt): YouTube CLI complete -- all commands, tests passing, npm linked"
```

---

## Error Handling Reference

All commands call `handleError(e, debug)` in their catch block. The following cases are handled by the API or by the implementation directly:

| Error condition | Behavior |
|---|---|
| No token (`tokens.json` missing) | `getAuthenticatedClient` exits with "Not authenticated. Run: yt auth" |
| Token expired | `getAuthenticatedClient` auto-refreshes silently before returning |
| Upload fail (API error) | `handleError` prints `e.errors[0].message`, exits non-zero |
| Rate limit (429) | `handleError` prints `e.errors[0].message` which includes retry info |
| No internet | `handleError` prints `err.message` (ECONNREFUSED or similar), exits non-zero |
| Invalid file path | `uploadVideo` checks `existsSync`, prints `"File not found: <path>"`, exits non-zero |
| Delete without confirm | Prints `"Cancelled."`, exits 0 (not an error) |

For rate limit and no-internet, the googleapis SDK throws errors with `.errors[0].message` set to descriptive text. The existing `handleError` in `lib/error.js` already handles this pattern -- no additional code needed.
