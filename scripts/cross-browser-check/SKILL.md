---
name: cross-browser-check
description: Use when Azriel wants to test a project's functionality across multiple browsers (Chromium, Firefox, WebKit, Edge, Chrome stable). Spins up headed Playwright runs against a target URL, checks critical user flows, screenshots failures, and reports a compact PASS/FAIL matrix per browser. Trigger phrases — "cross-browser test", "test all browsers", "browser compatibility check", "does it work in Firefox/Safari/WebKit/Edge", "Playwright matrix", "/cross-browser".
argument-hint: "[optional: target URL or local project path]"
disable-model-invocation: false
---

## What This Skill Does

Runs a Playwright-driven cross-browser smoke test against a target site (local XAMPP project or any URL). Tests run **headed** so visual issues are observable. Produces:

- A PASS/FAIL matrix per browser × per flow
- Screenshots saved under `./screenshots/cross-browser/<browser>/<flow>.png` on failure
- Console log/JS error capture per browser
- A compact summary printed to terminal

Default browser set: **chromium, firefox, webkit, msedge, chrome** (last two if installed locally as channels).

---

## Steps

### Step 1: Locate Project + Target URL

1. If user passed an argument that looks like a URL (`http://...` or `https://...`) → use that as base URL. Skip to Step 2.
2. If argument is a local path → check for `index.php`, `index.html`, or `package.json` and infer base URL:
   - XAMPP project under `c:\xampp\htdocs\<name>` → `http://localhost/<name>/`
   - Otherwise ask for the URL.
3. If no argument → inspect `cwd`:
   - If `CLAUDE.md` exists, read it for "Local URL" or "Production" hints
   - If under `c:\xampp\htdocs\` → derive `http://localhost/<folder>/`
   - Else ask the user for the URL

### Step 2: Detect Critical Flows

Read the project to identify what to test. Default flow set if nothing else is found:

1. **Home page renders** — navigate to base URL, assert `<body>` is non-empty and has at least one visible heading
2. **Primary CTA clickable** — find first visible `<a class*="btn">`, `<button>`, or anchor in the hero, click, assert URL changed or modal opened
3. **Navigation links work** — pick top 3 nav links from `<nav>`, click each, assert HTTP 200 + no JS console error
4. **No console errors on load** — listen for `pageerror` and `console.error` during initial nav

If the project has these patterns, add corresponding flows:

| Pattern detected | Flow added |
|---|---|
| `JS/chatbot.js` or `#chatbot-icon` selector | **Chatbot opens + accepts input** — click icon, type "hi", press send, expect a bot reply within 15s |
| `/order-form/` or `/checkout/` directory | **Order form loads** — navigate, assert form fields render |
| `<form>` with `action="*login*"` | **Login form renders** — assert username + password inputs visible |
| `admin.php` or `admin_login.php` present | **Admin login page renders** — navigate, assert login form visible (do NOT attempt login unless user provides creds or memory says how) |

Ask the user before adding flows that require credentials or destructive actions (signup, payment, delete).

### Step 3: Decide Browser Set

Default: `chromium, firefox, webkit`. Add `msedge` and `chrome` only if installed (`npx playwright install --dry-run` or check `%LOCALAPPDATA%\ms-playwright`).

If the user said "all browsers" → include all 5. If they named specific ones → only those.

For testing Opera or other Chromium-derivatives, use the `chromium` channel and document that Opera-specific quirks (e.g. SSE buffering) need a separate manual repro since Playwright doesn't ship an Opera channel.

### Step 4: Locate or Install Playwright

Check, in order:
1. `node_modules/playwright` in the project root (preferred — already installed)
2. `node_modules/@playwright/test`
3. Global npm: `npm root -g` → check for `playwright`
4. JARVIS dir: `D:\Main Storage\Documents\JARVIS\node_modules\playwright`

If none present, run `npm install --no-save playwright` in the project root. Confirm browsers are installed via `npx playwright install chromium firefox webkit` (skip channels the user didn't request).

### Step 5: Generate the Test Script

Write `scripts/playwright/cross-browser-check.js` (or `cross-browser-check.js` in the project root if `scripts/` doesn't exist). Use the template in `references/cross-browser-template.js` as a base.

Key requirements:
- **Headed mode** (`headless: false`, `slowMo: 100`) so the user can watch
- Iterate over the chosen browser set
- Per browser × per flow: try/catch, record PASS/FAIL/SKIP + duration + first error line
- On failure: `page.screenshot({ path, fullPage: false })` to `screenshots/cross-browser/<browser>/<flow>.png`
- Capture `page.on('pageerror')` and `page.on('console')` (error level only) into a per-browser log
- Print a final matrix table:
  ```
  Flow                          chromium  firefox  webkit  msedge  chrome
  home-renders                  PASS      PASS     PASS    PASS    PASS
  chatbot-opens                 PASS      PASS     FAIL    PASS    PASS
  ```
- Exit code 0 if all PASS, 1 if any FAIL

### Step 6: Run + Report

1. Run `node <path-to-script>`
2. Tail the output, parse the final matrix
3. Report to the user:
   - Pass/fail counts per browser
   - Which flows failed in which browsers
   - Screenshot paths for failures
   - Any console/page errors captured
4. If any browser had a flow-specific failure that looks like a known compat issue (CSS, SSE, fetch streaming), suggest the likely cause but don't auto-fix unless asked.

### Step 7: Cleanup

- Do NOT delete the test script — leave it for re-runs
- Do NOT delete screenshots — they're the diff record
- If the script created a `test_*` admin row (per `feedback_admin_test_user.md` rule), DELETE it before finishing

---

## Notes

- **Opera limitation**: Playwright has no Opera channel. For Opera-only bugs (e.g. SSE first-chunk buffering), document the suspected cause and recommend manual DevTools repro — don't claim cross-browser coverage includes Opera.
- **Safari on Windows**: `webkit` is the closest proxy. Same rendering engine; networking differs.
- **XAMPP projects**: Apache must be running. Skill should `curl -I http://localhost/` and abort early if Apache is down.
- **Token-cost-sensitive projects (e.g. Rielcode chatbot)**: skip the chatbot flow in the matrix unless the user explicitly asks, or reset the rate limit table before running. The chatbot flow burns ~1.5k OpenAI tokens per browser × per run.
- **Don't ask for admin creds**: if a flow needs admin auth, insert a temp `admins` row with `password_hash()`, run the test, then delete the row.

---

## When NOT to Use

- Single-browser sanity check → just run an existing Playwright script
- Pure backend / API testing → use curl or a request-only Playwright script
- Visual regression (pixel diff) → use a dedicated visual testing tool, not this matrix
