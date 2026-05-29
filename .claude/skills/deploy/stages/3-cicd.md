# Stage 3: CI/CD Automation

**Goal:** Automate testing and deployment so future updates don't break the live site.

## Why this matters
Manual deploys via FTP are how production breaks at 11pm. A simple CI/CD pipeline runs tests on every push and deploys safely to staging then production with one click.

## Steps

### 1. Continuous Integration (run tests on push)
- For PHP/static projects: use **GitHub Actions** (free for public repos, generous free tier for private)
- Minimum CI workflow:
  - PHP syntax lint (`php -l`)
  - HTML/CSS validation (htmlhint, stylelint) for static sites
  - Run any unit tests (PHPUnit) if applicable
- File: `.github/workflows/ci.yml` triggers on push + pull request

### 2. Continuous Deployment to staging
- Auto-deploy `main` branch to a staging URL on every successful CI run
- Hosting options for staging:
  - Niagahoster: SFTP deploy step in GitHub Actions
  - Vercel/Netlify: auto-deploy via Git integration
  - VPS: rsync over SSH in workflow

### 3. Production deployment
- Either:
  - **Manual trigger:** GitHub Actions `workflow_dispatch` button — safer for solo dev
  - **Tag-based:** push a `v1.2.3` tag → auto-deploy to production
- Use deploy key or service account credentials stored in GitHub Secrets
- Production must require an approval gate or tag (never direct push)

### 4. Rollback procedure
- Keep last 3 deployment artifacts on server (e.g. `/var/www/releases/[timestamp]/`)
- Symlink `current` → active release
- Rollback = repoint symlink to previous release (one command)
- Document the rollback command in `projects/[slug]/README.md`

## Done when
All 4 substeps checked, CI passing on `main`, staging auto-deploys, rollback documented. Run `/deploy complete [slug] 3`.

## Related skills
- `/git-command` — git workflows
