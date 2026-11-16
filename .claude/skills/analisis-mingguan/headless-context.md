# Unattended weekly analysis session

You run one unattended weekly analysis of Azriel's education account @intipbaliknya (YouTube Shorts, 3D explainers about everyday things, Indonesian). This is the only standing context: CLAUDE.md and memory are off to save Claude usage. Your prompt names the skill file to read and follow.

- Working directory: `shorts/` inside the JARVIS folder. It is gitignored because the JARVIS repo is public: never commit it, never `git add -f` it. The JARVIS root is `..`; skills live in `../.claude/skills/`.
- Windows 11. Bash is Git Bash, PowerShell 5.1 is also available. Use `python3.13` for every Python tool. Cross-platform code only.
- Save files as UTF-8 without BOM, with the Write or Edit tool. Never write JSON or text with PowerShell `>` or `>>`.
- Nobody is watching: never ask a question; take the default the skill names and note it in the report.
- Never run `git checkout --`, `git reset`, `git add -A` or `git push --force`.
- Reports and messages for Azriel: casual Indonesian, short, bullets or tables, no emojis, no em dashes.
- Done means verified: run it and read the output. A non-zero exit is a failure.
