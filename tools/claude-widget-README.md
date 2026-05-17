# Rielcode Claude Status Widget

Two components:

1. **statusLine** -- shows in the Claude Code prompt bar (built-in, zero setup needed)
2. **Terminal widget** -- a separate persistent window with richer detail

---

## Part 1: Claude Code statusLine (already active)

The statusLine is wired into `~/.claude/settings.json`. It displays in every Claude Code session automatically.

**What it shows:**
```
Claude 3.5 Sonnet | LOW | ctx:[######----] 62% | 5h:[##--------] 18% | 7d:5% | JARVIS/main*
```

- Model name (cyan)
- Effort level (magenta)
- Context window bar: color coded green/yellow/red
- 5-hour usage bar: color coded
- 7-day weekly usage percentage
- Git repo, branch, dirty marker (*) if uncommitted changes
- Caveman mode indicator (if active)

**Script location:** `C:\Users\afw14\.claude\statusline-rielcode.js`

No setup required -- it runs on every Claude Code session via the registered statusLine command.

---

## Part 2: Terminal Widget (standalone)

A persistent terminal panel that auto-refreshes every 30 seconds.

### Requirements

Node.js is already installed. For the terminal widget only:

```powershell
pip install rich
```

### Run

```powershell
python "C:\Users\afw14\OneDrive\Documents\JARVIS\tools\claude-widget.py"
```

Or use the launch script:

```powershell
& "C:\Users\afw14\OneDrive\Documents\JARVIS\tools\launch-widget.ps1"
```

### Recommended: Run in a split terminal

In Windows Terminal:
1. Open a new pane (Alt+Shift+D)
2. Run the widget in that pane
3. Keep Claude Code running in the main pane

### Auto-start with Windows Terminal

Add this to your Windows Terminal `settings.json` as a startup command in a split pane profile, or add this to your PowerShell profile (`$PROFILE`):

```powershell
# Optional: auto-launch widget in background on terminal start
# Start-Process powershell -ArgumentList '-NoExit -Command "python C:\Users\afw14\OneDrive\Documents\JARVIS\tools\claude-widget.py"'
```

---

## Data Sources

| Item | Source |
|---|---|
| Model name | Claude Code statusLine stdin JSON |
| Effort level | Claude Code statusLine stdin JSON |
| Context window % | Claude Code statusLine stdin JSON + `$TEMP\claude-ctx-*.json` bridge file |
| 5h / 7d rate limits | Claude Code statusLine stdin JSON (claude.ai subscribers only) |
| Git info | `git` CLI (live, per-call) |
| Caveman mode | `~/.claude/.caveman-active` flag file |

---

## Troubleshooting

**statusLine shows nothing:**
- Restart Claude Code after saving `settings.json`
- Check Node.js is at `C:/Program Files/nodejs/node.exe`
- Run the script manually: `echo '{}' | node C:\Users\afw14\.claude\statusline-rielcode.js`

**Rate limit bars missing:**
- These only appear for claude.ai subscribers after the first API response in a session
- Check your subscription status at claude.ai

**Git info missing:**
- Ensure `git` is in your PATH: `git --version`
- The widget reads the JARVIS repo by default; update `REPO_DIR` in `claude-widget.py` to change it

**Widget not refreshing:**
- Default refresh is 30 seconds -- this is intentional to avoid hammering the disk
- Change `REFRESH_SEC = 30` in `claude-widget.py` to a lower value if desired
