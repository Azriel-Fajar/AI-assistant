---
name: deploy
description: Use when Azriel wants to track, advance, or report on a project's 7-stage deployment pipeline (QA, Security, CI/CD, Performance, DNS, Rollout, Monitoring). Manages per-project deployment.md state, central deployments/index.md dashboard, sends ntfy.sh push on stage complete. Triggers include "/deploy", "deployment pipeline", "next deploy stage", "mark stage complete".
argument-hint: "[init|status|next|guide|complete|list] [slug] [stage]"
---

## What This Skill Does

Every Rielcode project must pass 7 deployment stages before going live. This skill tracks each project's pipeline state in `projects/[slug]/deployment.md`, maintains a central `deployments/index.md` dashboard, and guides Azriel through one stage at a time. Phone push fires on every stage win.

---

## Config

- **Per-project state:** `projects/[slug]/deployment.md`
- **Central index:** `deployments/index.md`
- **Template:** `.claude/skills/deploy/templates/deployment.md`
- **Stage guides:** `.claude/skills/deploy/stages/[1-7]-[name].md` (lazy-loaded)
- **Ntfy.sh channel:** `rielcode-deploy`
- **Stuck threshold:** 3 days since `last_updated`

### Stage index

| # | Name | Guide file |
|---|------|------------|
| 1 | QA | `stages/1-qa.md` |
| 2 | Security & Compliance | `stages/2-security.md` |
| 3 | CI/CD Automation | `stages/3-cicd.md` |
| 4 | Performance Optimization | `stages/4-performance.md` |
| 5 | Domain & DNS | `stages/5-dns.md` |
| 6 | Deployment & Rollout | `stages/6-rollout.md` |
| 7 | Post-Launch Monitoring | `stages/7-monitoring.md` |

---

## Commands

Invoked as `/deploy [subcommand] [args]`. If no subcommand given, run `list`.

---

### `init [slug]`

Register a project in the pipeline.

**Steps:**
1. Resolve slug. If missing, ask: "Which project? (slug or path under `projects/`)"
2. Confirm `projects/[slug]/` exists. If not, abort and suggest `/project-kickoff`.
3. Read `.claude/skills/deploy/templates/deployment.md`.
4. Substitute tokens: `{{PROJECT}}` = slug, `{{STARTED}}` = today (`currentDate`), `{{LAST_UPDATED}}` = today, `{{TARGET_LAUNCH}}` = ask user or "TBD".
5. Write to `projects/[slug]/deployment.md`. If file already exists, abort with: "Pipeline already exists. Use `/deploy status [slug]`."
6. Append row to `deployments/index.md`:
   ```
   | [slug] | 1: QA | 0/7 | [today] | 0 | active |
   ```
   If `deployments/index.md` doesn't exist, create it with the table header (see schema below).
7. Confirm: "Pipeline initialized for [slug]. Run `/deploy next [slug]` to start Stage 1."

---

### `status [slug]`

Show one project's pipeline state.

**Steps:**
1. Read `projects/[slug]/deployment.md`.
2. Parse frontmatter (`current_stage`, `started`, `last_updated`, `target_launch`, `status`).
3. Count completed `- [x]` vs total `- [ ]` checkboxes.
4. Days stuck = `today - last_updated` (only if status=active).
5. Output:
   ```
   PIPELINE -- [slug]
   Current stage: [N]/7 ([name])
   Progress: [completed]/[total] substeps
   Started: [started]   Last updated: [last_updated]   Target: [target_launch]
   Status: [status]   Days stuck: [N]
   ```

---

### `next [slug]`

Walk Azriel through the next uncompleted stage.

**Steps:**
1. Read `projects/[slug]/deployment.md` → get `current_stage`.
2. **Read ONLY the stage file** matching `current_stage`: `.claude/skills/deploy/stages/[N]-[name].md`. Never load other stages.
3. Print the stage guide content.
4. Show the project's remaining unchecked items for that stage from `deployment.md`.
5. End with: "When this stage is done, run `/deploy complete [slug] [N]`."

---

### `guide [stage-num]`

Show the guide for a specific stage without project context.

**Steps:**
1. Resolve stage number (1-7). If invalid, list available stages from the index above.
2. Read ONLY `.claude/skills/deploy/stages/[N]-[name].md`.
3. Print contents.

---

### `complete [slug] [stage]`

Mark a stage finished, advance the pipeline, push phone notification.

**Steps:**
1. Read `projects/[slug]/deployment.md`.
2. Confirm `[stage]` matches `current_stage`. If not, ask: "Stage [N] is not current ([current_stage] is). Skip ahead anyway?"
3. In the stage section of `deployment.md`:
   - Replace every `- [ ]` with `- [x]`
   - Set `Completed: [today]` for that stage section
4. Update frontmatter:
   - If stage < 7: `current_stage` += 1, `last_updated` = today
   - If stage == 7: `current_stage` = 7, `status` = complete, `last_updated` = today
5. Update `deployments/index.md` row for this slug: new stage label, new progress count, today's date, reset days-stuck to 0, status (active or complete).
6. Send push:
   ```bash
   curl -s -X POST https://ntfy.sh/rielcode-deploy \
     -H "Title: Deploy Stage Done" \
     -d "[slug] passed Stage [N]: [name] -- next: Stage [N+1] [next-name]"
   ```
   If stage 7: title = "Deploy Pipeline Complete", body = "[slug] is live. All 7 stages passed."
7. Confirm in chat: "Stage [N] ([name]) marked complete for [slug]. Next: Stage [N+1] [next-name]. Run `/deploy next [slug]` when ready."

---

### `list`

Show the central dashboard.

**Steps:**
1. Read `deployments/index.md`. If missing, say "No pipelines yet. Run `/deploy init [slug]` to start one."
2. Sort rows by days-stuck desc (parse the table).
3. Print the table.
4. One-line summary: "[N] active | [N] stuck (>3 days) | [N] complete".

---

### `detect [slug]`

Auto-scan project for evidence that each stage's work is done. Suggests stages ready to mark complete. **Never auto-ticks** — Azriel confirms each suggestion.

**Steps:**

1. Resolve slug. Find project root: check `projects/[slug]/` AND `C:\xampp\htdocs\[slug]\` (typical Rielcode build location). If both exist, prefer the htdocs version for code scans.
2. Read `projects/[slug]/deployment.md` to know `current_stage` and which stages still need checking.
3. Run each stage's detector below. Each returns one of: **PASS** (strong evidence stage done), **PARTIAL** (some evidence, missing pieces listed), **NONE** (no signal).
4. Skip detectors for stages already marked complete.
5. Print a table:
   ```
   DETECT -- [slug]
   | Stage | Verdict | Evidence | Missing |
   |-------|---------|----------|---------|
   | 1 QA  | PARTIAL | tests/ folder exists | no Playwright config |
   | 2 Security | PASS | .env present, .gitignore covers it, no hardcoded keys grepped | - |
   | 3 CI/CD | NONE | no .github/workflows/ | full setup |
   ```
6. For each PASS row, ask via `AskUserQuestion`: "Stage [N] looks done. Mark complete now?"
7. For each confirmed Yes: run the `complete [slug] [N]` flow (tick boxes, advance, push notification).
8. PARTIAL and NONE rows: surface as guidance only, do not offer to tick.

---

#### Per-stage detectors

**Stage 1 — QA:**
- PASS if: test folder exists (`tests/`, `__tests__/`, `*.test.*`, `*.spec.*`) AND screenshot/artifact folder shows recent run (e.g. `screenshots/` modified within 7 days) AND README mentions QA or testing
- PARTIAL if any one signal present
- NONE if none

**Stage 2 — Security & Compliance:**
- PASS if: `.env` or `.env.example` exists AND `.gitignore` contains `.env` AND grep finds NO hardcoded API keys/passwords in `*.php`, `*.js`, `*.html` (regex: `api[_-]?key\s*=\s*['"][A-Za-z0-9]{16,}`, `password\s*=\s*['"][^'"]{6,}`, `sk-[A-Za-z0-9]{20,}`) AND a `privacy` page exists if forms detected
- PARTIAL if one or two signals
- NONE if none

**Stage 3 — CI/CD Automation:**
- PASS if: `.github/workflows/*.yml` exists with at least one job AND README documents deploy or rollback command
- PARTIAL if workflow exists but no rollback doc
- NONE if no workflow

**Stage 4 — Performance Optimization:**
- PASS if: project has minified assets (look for `*.min.css`, `*.min.js`) AND images include WebP/AVIF variants OR an `images/optimized/` folder AND a Lighthouse report file exists (`lighthouse-*.html`, `lighthouse-*.json`, or note in README with score ≥85)
- PARTIAL if some signals
- NONE if none

**Stage 5 — Domain & DNS:**
- PASS if: live URL in `projects/[slug]/README.md` AND `curl -sI https://[domain]` returns HTTP 200/301/302 AND cert valid (curl exit 0, no `--insecure`)
- PARTIAL if domain set but no HTTPS
- NONE if no live URL listed
- Bash command:
  ```bash
  curl -sI --max-time 10 https://[domain] | head -n 1
  ```

**Stage 6 — Deployment & Rollout:**
- PASS if: live URL returns HTTP 200 AND `projects/[slug]/README.md` Status field == "Delivered" or "Live" AND deployment.md Stage 5 already complete
- PARTIAL if site live but README still says "In Progress"
- NONE if site not reachable
- Bash:
  ```bash
  curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://[domain]
  ```

**Stage 7 — Post-Launch Monitoring:**
- PASS if: grep finds Sentry / Rollbar / Bugsnag init in source (`Sentry.init`, `Rollbar(`, `Bugsnag.start`) AND analytics snippet detected (`gtag(`, `plausible`, `umami`) AND README documents an uptime monitor URL (UptimeRobot, Better Stack)
- PARTIAL if 1-2 signals
- NONE if none

---

#### Rules for detect

- Never tick a box without explicit confirmation. Detection = suggestion, not authority.
- If `curl` fails or times out, mark that detector NONE and note "could not reach" in Missing column. Do not error out.
- If project root cannot be found, abort with: "Project source not found in `projects/[slug]/` or `C:\xampp\htdocs\[slug]\`. Pass full path as second arg: `/deploy detect [slug] [path]`."
- Skip detectors for stages already complete in deployment.md.
- Output is read-only unless user confirms a tick.

---

## `deployment.md` Template Schema

The template at `templates/deployment.md` follows this structure (the full content lives in that file):

```markdown
---
project: {{PROJECT}}
current_stage: 1
started: {{STARTED}}
last_updated: {{LAST_UPDATED}}
target_launch: {{TARGET_LAUNCH}}
status: active
---

# Deployment Pipeline -- {{PROJECT}}

## Stage 1: QA
Started:
Completed:
- [ ] Test all features in staging environment that mirrors production
- [ ] Run usability check across key user flows
- [ ] Test edge cases (empty states, errors, slow network)
- [ ] Cross-browser check (Chrome, Firefox, Safari, mobile)
Notes:

## Stage 2: Security & Compliance
...
```

(Full template lives in `templates/deployment.md`.)

---

## `deployments/index.md` Schema

```markdown
# Deployments Index

Last updated: [auto]

| Project | Stage | Progress | Last Updated | Days Stuck | Status |
|---------|-------|----------|--------------|------------|--------|
| pt-maju | 3: CI/CD | 12/28 | 2026-05-27 | 0 | active |
```

---

## Rules

- **Lazy load stages.** Never read more than one `stages/*.md` file per invocation. The orchestrator only knows stage names from the index above.
- **State of truth is the project's `deployment.md`** — `index.md` is a derived dashboard, regenerate-safe.
- Use today's date from `currentDate` context for all timestamps.
- Never invent project slugs — confirm `projects/[slug]/` exists first.
- Never echo passwords or credentials found in deployment notes (same rule as `project-completion-doc`).
- Ntfy.sh push runs silently — only report on curl failure.
- If a stage is marked complete but its checkboxes have unchecked items, ask: "Some substeps still unchecked. Mark all done anyway?"
- A project must have `current_stage: 7` AND `status: complete` before `/project-completion-doc` will generate a handoff PDF.
