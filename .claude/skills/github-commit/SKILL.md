---
name: github-commit
description: Use when the user wants to push code to GitHub. Stages all changes, auto-generates a commit message, handles repo creation if none exists, and pushes to main (or a specified branch).
---

## What This Skill Does

Stages all local changes, generates a concise commit message, and pushes to a GitHub repository. If no remote is configured, it asks for a repo name, creates the repo if it doesn't exist, and wires up the remote automatically.

## Steps

### 1. Ensure git is initialized

Run:
```bash
git rev-parse --is-inside-work-tree 2>/dev/null
```
If not a git repo, run `git init` and continue.

---

### 2. Resolve the target repository

Run:
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
If the output is empty, tell the user "Nothing to commit — working tree is clean." and stop.

---

### 4. Generate the commit message

Run `git diff --cached --stat` to see what changed. Based on the filenames and nature of the changes, write a commit message that:
- Is **10 words or fewer**
- Is in the imperative mood (e.g. "Add login page and update styles")
- Does NOT start with "feat:", "fix:", or any prefix — just plain English

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

### 7. Handle conflicts — pull rebase first

Before pushing, always run:
```bash
git pull --rebase origin <branch> 2>/dev/null
```

If the rebase fails (exit code non-zero), stop and tell the user:
> "Rebase failed due to conflicts. Please resolve the conflicts manually, then run `/github-commit` again."

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

- **Never force-push.** If there's a conflict, rebase and retry — never `--force`.
- **Never ask for a commit message.** Always generate it from the diff.
- **Always stage with `git add -A`.** Do not cherry-pick files unless the user asks.
- **Default branch is `main`.** Use a different branch only if the user explicitly requests it.
- **Default repo visibility is public.** Do not ask unless the user specifies otherwise.
- When the remote already exists, never re-create or overwrite it — just use it.
