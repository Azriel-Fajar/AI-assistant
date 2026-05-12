---
name: playwright
description: Browser automation via Playwright. Run E2E tests, record actions with codegen, take element/viewport screenshots, scrape data. Uses root-installed @playwright/test. Trigger when user asks to test a web app, automate browser actions, record interactions, scrape a site, or take targeted screenshots (full-page screenshots only — use /url-screenshot instead).
---

# /playwright

Browser automation wrapper around root-installed `@playwright/test`.

## Subcommands

Route on first arg.

### `/playwright test [path]`
Run Playwright tests. Optional path filter.
```
cd c:/Users/afw14/OneDrive/Documents/JARVIS && npx playwright test [path]
```
Show pass/fail summary. Report at `playwright-report/index.html`. Open with `npx playwright show-report`.

### `/playwright codegen <url>`
Opens Chromium with recorder. Records clicks/typing into a generated spec file.
```
npx playwright codegen <url> --output tests/playwright/recorded-<slug>-<timestamp>.spec.js
```
Ask user for save path if they want non-default.

### `/playwright screenshot <url> [--selector <css>] [--mobile] [--viewport WxH]`
Targeted screenshot. NOT full-page (that's `/url-screenshot`).
- `--selector` → element-only screenshot
- `--mobile` → iPhone 13 device emulation
- `--viewport WxH` → custom viewport, e.g. `1280x800`
- default → above-the-fold viewport capture

Runs: `node .claude/skills/playwright/screenshot.js <url> [flags]`
Output: `screenshots/`.

### `/playwright scrape <url> <task>`
Natural-language scrape task. Generate Playwright Node script, run, return data.

Workflow:
1. Slugify task → `scripts/playwright/<slug>.js`
2. Write script using `playwright` (require from root `node_modules`)
3. Run via `node <script>`
4. Stdout = result. Save script for reuse.

Generated script template:
```js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('<url>', { waitUntil: 'networkidle' });
  // task-specific extraction
  const data = await page.evaluate(() => { /* ... */ });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
```

## Pre-flight

Verify install before any subcommand:
```bash
ls c:/Users/afw14/OneDrive/Documents/JARVIS/node_modules/@playwright/test
```
If missing → run `npm install --save-dev @playwright/test` + `npx playwright install chromium` at JARVIS root.

## Notes

- All paths relative to `c:/Users/afw14/OneDrive/Documents/JARVIS`
- npm execution requires `"/c/Program Files/nodejs/npm.cmd"` or `cmd /c "npm ..."` due to PowerShell exec policy
- Browser cache at `%LOCALAPPDATA%\ms-playwright\` — do not redownload
- Headless default. Codegen runs headed.
- Decoupled from `/url-screenshot` skill's isolated node_modules
