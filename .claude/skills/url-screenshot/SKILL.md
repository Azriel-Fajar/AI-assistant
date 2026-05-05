---
name: url-screenshot
description: Use when someone asks to take a screenshot of a URL, capture a website, screenshot this url, or screenshot a webpage. Accepts one or multiple URLs.
argument-hint: <url> [url2] [url3] ...
disable-model-invocation: false
allowed-tools: Bash, Read, Write
---

## What This Skill Does

Takes full-page PNG screenshots of one or more URLs using Playwright (headless Chromium). Saves output to `screenshots/` in the project root.

## Context

- Skill directory: `d:\Main Storage\Documents\JARVIS\.claude\skills\url-screenshot\`
- Capture script: `d:\Main Storage\Documents\JARVIS\.claude\skills\url-screenshot\capture.js`
- Output directory: `d:\Main Storage\Documents\JARVIS\screenshots\`
- Runtime: Node.js + Playwright (Chromium only)

## Steps

1. **Parse URLs from arguments**
   - Input: `$ARGUMENTS` (space or comma separated)
   - If empty, ask user for URL(s)
   - Validate each starts with `http://` or `https://`. If missing scheme, prepend `https://`
   - Reject invalid URLs and report which ones

2. **Ensure Playwright installed (one-time setup)**
   - Check `d:\Main Storage\Documents\JARVIS\.claude\skills\url-screenshot\node_modules\playwright` exists
   - If missing, run in skill dir:
     ```
     npm init -y
     npm install playwright
     npx playwright install chromium
     ```

3. **Run capture script**
   - Pass all URLs as args to `capture.js`:
     ```
     node "d:\Main Storage\Documents\JARVIS\.claude\skills\url-screenshot\capture.js" <url1> <url2> ...
     ```
   - Script handles: launch browser, viewport 1920x1080, goto each URL, wait `networkidle`, 2s buffer, full-page screenshot
   - Filename pattern: `<slug>-<YYYYMMDD-HHmmss>.png`
     - slug = hostname + path, sanitized to `[a-z0-9-]`, max 60 chars

4. **Report results**
   - For each URL: `OK <url> → <filepath>` or `FAIL <url>: <error>`
   - Show absolute paths so user can click

## Output Format

```
Screenshots saved:
- https://example.com → d:\Main Storage\Documents\JARVIS\screenshots\example-com-20260505-143022.png
- https://foo.bar/baz → d:\Main Storage\Documents\JARVIS\screenshots\foo-bar-baz-20260505-143025.png

Failed:
- https://broken.site: Timeout 30000ms exceeded
```

## Notes

- Per-page timeout: 30s. Skip and report on failure, do not abort whole batch.
- Headless mode only.
- Do NOT take screenshots of localhost/127.0.0.1 unless user explicitly asks (Playwright handles fine, just confirm intent).
- Do NOT commit `node_modules/` — already gitignored at project root, but verify if skill dir lacks `.gitignore`.
- First run is slow (~200MB Chromium download). Subsequent runs fast.
- If `networkidle` never fires (some sites with persistent connections), Playwright timeout kicks in at 30s — that's expected.
