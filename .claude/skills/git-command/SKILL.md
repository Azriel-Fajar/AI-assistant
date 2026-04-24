---
name: git-command
description: Use when the user wants to pull, commit, or push code to/from GitHub. Handles pull (sync from remote), full commit+push workflow, repo creation if none exists, and auto-triggers after major Jarvis updates.
---

## What This Skill Does

Handles common git remote operations:
- **Pull** -- sync local branch with the remote
- **Commit + Push** -- stage changes, auto-generate a commit message, and push to GitHub. If no remote is configured, it asks for a repo name, creates the repo if it doesn't exist, and wires up the remote automatically.

## Usage

- `/git-command pull` -- pull from remote (fast sync, no commit)
- `/git-command push` or `/git-command` -- commit and push all staged changes
- `/git-command pull push` -- pull first, then commit and push

## When to Run Automatically

Run the commit+push flow automatically (without the user asking) after any **major update** to the Jarvis AI assistant. Major updates include:

- Any change to `CLAUDE.md` or `CLAUDE.local.md`
- Any change to files under `context/` (me.md, work.md, goals.md, current-priorities.md, team.md)
- Any new or modified skill under `.claude/skills/`
- Any new entry in `decisions/log.md`
- Any new or modified template under `templates/`
- Any new or modified SOP under `references/sops/`

Minor updates (small wording fixes, typos) do not require an auto-push -- use judgment.

---

## Pull Flow

### P1. Ensure a remote exists

```bash
git remote get-url origin 2>/dev/null
```

If no remote exists, tell the user: "No remote configured. Run `/git-command push` to set one up first." and stop.

---

### P2. Determine current branch

```bash
git branch --show-current
```

---

### P3. Pull from remote

```bash
git pull --rebase origin <branch>
```

If the rebase fails (exit code non-zero), stop and tell the user:
> "Pull rebase failed due to conflicts. Resolve the conflicts manually, then try again."

---

### P4. Report result

Show a one-line summary:
```
Pulled latest from github.com/<username>/<repo-name> (<branch>)
```

---

## Commit + Push Flow

### 1. Ensure git is initialized

```bash
git rev-parse --is-inside-work-tree 2>/dev/null
```

If not a git repo, run `git init` and continue.

---

### 2. Resolve the target repository

```bash
git remote get-url origin 2>/dev/null
```

**If a remote exists:** use it as-is. Skip to step 3.

**If no remote exists:**
- Ask the user: "No GitHub remote found. What should the repo be named?"
- Check if the repo already exists on their GitHub account:
  ```bash
  gh repo view <username>/<repo-name> 2>/dev/null
  ```
- If it **does not exist**, create it:
  ```bash
  gh repo create <repo-name> --public --source=. --remote=origin
  ```
- If it **already exists**, add it as the remote:
  ```bash
  git remote add origin https://github.com/<username>/<repo-name>.git
  ```
- Get the authenticated username with: `gh api user --jq .login`

---

### 3. Stage all changes

```bash
git add -A
```

Check if there is anything to commit:
```bash
git status --porcelain
```

If the output is empty, tell the user "Nothing to commit -- working tree is clean." and stop.

---

### 4. Generate the commit message

Run `git diff --cached --stat` to see what changed. Based on the filenames and nature of the changes, write a commit message that:
- Is **10 words or fewer**
- Is in the imperative mood (e.g. "Add login page and update styles")
- Does NOT start with "feat:", "fix:", or any prefix -- just plain English

Do not ask the user for a message. Generate it yourself.

---

### 5. Commit

```bash
git commit -m "<generated message>"
```

---

### 6. Determine target branch

- Default: `main`
- If the user specified a branch when invoking the skill, use that instead
- Ensure the local branch matches:
  ```bash
  git checkout -B main
  ```
  (only if not already on the correct branch)

---

### 7. Pull rebase before push

Before pushing, always run:
```bash
git pull --rebase origin <branch> 2>/dev/null
```

If the rebase fails (exit code non-zero), stop and tell the user:
> "Rebase failed due to conflicts. Resolve the conflicts manually, then run `/git-command` again."

Do not force-push. Never use `--force`.

---

### 8. Push

```bash
git push origin <branch>
```

If the push fails because the remote branch doesn't exist yet (new repo or new branch), use:
```bash
git push --set-upstream origin <branch>
```

---

### 9. Report the result

Show a one-line summary:
```
Pushed "<commit message>" to github.com/<username>/<repo-name> (<branch>)
```

---

## Rules

- **Never force-push.** If there is a conflict, rebase and retry -- never `--force`.
- **Never ask for a commit message.** Always generate it from the diff.
- **Always stage with `git add -A`.** Do not cherry-pick files unless the user asks.
- **Default branch is `main`.** Use a different branch only if the user explicitly requests it.
- **Default repo visibility is public.** Do not ask unless the user specifies otherwise.
- When the remote already exists, never re-create or overwrite it -- just use it.
