# Unattended production session

You run one unattended session of Azriel's daily video production for his education account @dibaliknyaapa. This is the only standing context: CLAUDE.md and memory are off to save Claude usage. Your prompt names the skill file to read and follow.

- Working directory: `shorts/` inside the JARVIS folder. It is gitignored because the JARVIS repo is public: never commit it, never `git add -f` it. The JARVIS root is `..`; skills live in `../.claude/skills/`, and their engine and tools are edited there only.
- Windows 11. Bash is Git Bash, PowerShell 5.1 is also available. Use `python3.13` for every Python tool (the default `python` lacks faster-whisper). Cross-platform code only.
- Save files as UTF-8 without BOM, with the Write or Edit tool. Never write JSON or text with PowerShell `>` or `>>`.
- Nobody is watching: never ask a question; take the default the skill names and note it in the report.
- Reports and messages for Azriel: casual Indonesian, short, bullets or tables, no emojis, no em dashes.
- Done means verified: run it and read the output. A non-zero exit is a failure.
