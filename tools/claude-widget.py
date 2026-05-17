#!/usr/bin/env python3
"""
Rielcode Claude Status Widget
Persistent terminal overlay showing Claude Code session stats + git info.
Reads from Claude Code's temp bridge file written by the statusLine hook.

Requirements:
    pip install rich
    (optional) pip install windows-curses  -- only if rich fails on older Windows

Run:
    python C:\Users\afw14\OneDrive\Documents\JARVIS\tools\claude-widget.py

Auto-refresh: every 30 seconds
"""

import json
import os
import sys
import time
import glob
import subprocess
from pathlib import Path
from datetime import datetime, timezone

try:
    from rich.console import Console
    from rich.table import Table
    from rich.live import Live
    from rich.panel import Panel
    from rich.columns import Columns
    from rich.text import Text
    from rich.progress import BarColumn, Progress, TaskID
    from rich import box
except ImportError:
    print("Missing dependency. Run: pip install rich")
    sys.exit(1)

CLAUDE_DIR  = Path(os.environ.get("CLAUDE_CONFIG_DIR", Path.home() / ".claude"))
TMP_DIR     = Path(os.environ.get("TEMP", "C:/Windows/Temp"))
REFRESH_SEC = 30
REPO_DIR    = Path("C:/Users/afw14/OneDrive/Documents/JARVIS")

console = Console()


# ── helpers ──────────────────────────────────────────────────────────────────

def pct_color(pct: float) -> str:
    if pct >= 75:
        return "red"
    if pct >= 40:
        return "yellow"
    return "green"


def pct_bar(pct: float, width: int = 12) -> Text:
    filled = round(pct / (100 / width))
    empty  = width - filled
    col    = pct_color(pct)
    t = Text()
    t.append("[", style="dim")
    t.append("#" * filled, style=f"bold {col}")
    t.append("-" * empty,  style="dim")
    t.append("]", style="dim")
    return t


def git_info(repo: Path) -> dict:
    """Return branch, repo name, dirty flag for given path."""
    result = {"repo": repo.name, "branch": "?", "dirty": False}
    try:
        opts = dict(cwd=str(repo), capture_output=True, text=True, timeout=3)
        branch = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"], **opts
        ).stdout.strip()
        result["branch"] = branch or "?"

        dirty_out = subprocess.run(
            ["git", "status", "--porcelain"], **opts
        ).stdout.strip()
        result["dirty"] = bool(dirty_out)
    except Exception:
        pass
    return result


def find_latest_session() -> dict | None:
    """
    Scan $TEMP for claude-ctx-*.json files and return the most recently
    modified one. These are written by the gsd-context-monitor hook.
    """
    pattern = str(TMP_DIR / "claude-ctx-*.json")
    files   = glob.glob(pattern)
    if not files:
        return None
    latest = max(files, key=os.path.getmtime)
    try:
        with open(latest, encoding="utf-8") as f:
            data = json.load(f)
        # Attach file name so we can show session id
        data["_file"] = latest
        return data
    except Exception:
        return None


def read_caveman_flag() -> str | None:
    flag = CLAUDE_DIR / ".caveman-active"
    try:
        if flag.exists() and not flag.is_symlink() and flag.stat().st_size <= 64:
            mode = flag.read_text().strip().lower()
            mode = "".join(c for c in mode if c.isalnum() or c == "-")
            valid = {"off","lite","full","ultra","wenyan-lite","wenyan",
                     "wenyan-full","wenyan-ultra","commit","review","compress"}
            return mode if mode in valid else None
    except Exception:
        pass
    return None


# ── render ───────────────────────────────────────────────────────────────────

def build_panel(session: dict | None, git: dict) -> Panel:
    rows = []

    # ── Claude session data ──
    if session:
        model_id  = session.get("model_id", "?")
        effort    = session.get("effort_level", "?")
        ctx_used  = session.get("used_pct")
        remaining = session.get("remaining_percentage")

        # Model row
        model_text = Text()
        model_text.append("Model  ", style="dim")
        model_text.append(str(model_id), style="bold cyan")
        rows.append(model_text)

        # Effort row
        effort_text = Text()
        effort_text.append("Effort ", style="dim")
        effort_text.append(str(effort).upper(), style="bold magenta")
        rows.append(effort_text)

        # Context window
        if ctx_used is not None:
            pct  = round(ctx_used)
            col  = pct_color(pct)
            t    = Text()
            t.append("Ctx    ", style="dim")
            t.append_text(pct_bar(pct))
            t.append(f" {pct}%", style=f"bold {col}")
            rows.append(t)
    else:
        rows.append(Text("No active Claude session found", style="dim italic"))
        rows.append(Text("(stats appear after first tool use in a session)", style="dim"))

    # ── Rate limits -- read from settings.json if no session data ──
    # (rate limits only come via statusLine stdin JSON, not bridge file)
    rows.append(Text(""))  # spacer

    # ── Git info ──
    dirty_mark = Text(" *", style="bold yellow") if git["dirty"] else Text("")
    git_text = Text()
    git_text.append("Git    ", style="dim")
    git_text.append(git["repo"], style="bold blue")
    git_text.append("/", style="dim")
    git_text.append(git["branch"], style="bold blue")
    git_text.append_text(dirty_mark)
    rows.append(git_text)

    # ── Caveman ──
    caveman = read_caveman_flag()
    if caveman:
        cm_text = Text()
        cm_text.append("Mode   ", style="dim")
        cm_text.append(f"CAVEMAN:{caveman.upper()}" if caveman != "full" else "CAVEMAN",
                       style="bold color(172)")
        rows.append(cm_text)

    # ── Timestamp ──
    rows.append(Text(""))
    ts_text = Text()
    ts_text.append("Updated ", style="dim")
    ts_text.append(datetime.now().strftime("%H:%M:%S"), style="dim cyan")
    rows.append(ts_text)

    body = Text("\n").join(rows)

    return Panel(
        body,
        title="[bold cyan]Rielcode / Claude Status[/bold cyan]",
        subtitle="[dim]refreshes every 30s | Ctrl+C to exit[/dim]",
        border_style="cyan",
        box=box.ROUNDED,
        padding=(0, 1),
    )


# ── main loop ─────────────────────────────────────────────────────────────────

def main():
    console.clear()
    console.print("\n[bold cyan]Rielcode Claude Widget[/bold cyan] [dim]starting...[/dim]\n")

    with Live(console=console, refresh_per_second=1, screen=False) as live:
        while True:
            session = find_latest_session()
            git_data = git_info(REPO_DIR)
            panel = build_panel(session, git_data)
            live.update(panel)
            time.sleep(REFRESH_SEC)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]Widget stopped.[/dim]")
