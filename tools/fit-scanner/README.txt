================================================================
 FIT COMPETITION 2026 - QUARANTINE DEVICE SCANNER
 Committee use only. Web App / Mobile App divisions.
================================================================

PURPOSE
  Run on each finalist laptop during device quarantine (7 July 2026)
  to detect banned agentic-AI tooling and pre-prepared agentic work:
    - Agentic AI / autonomous CLI agents (Codex, Claude Code, Gemini
      CLI, Cursor agent, Aider, Goose, OpenHands, etc.)
    - IDE agent extensions (Copilot, Cline, Roo, Continue, Cody, etc.)
    - Residue files proving prepared agentic work (CLAUDE.md,
      .cursorrules, .aider history, etc.)

  ChatGPT (committee-issued account) is allowed and is NOT flagged.

  The scanner WRITES A LOG ONLY. It changes nothing on the laptop.
  It NEVER auto-judges. Every hit is evidence for committee review.

FILES
  scan.cmd  Windows scanner - RECOMMENDED (pure batch, no PowerShell)
  scan.ps1  Windows scanner - PowerShell alternative
  scan.sh   macOS / Linux scanner

----------------------------------------------------------------
HOW TO RUN
----------------------------------------------------------------
Run from THIS flash disk, logged in as the finalist's normal user.
The log file is written next to the script, ON THE FLASH DISK.

WINDOWS - RECOMMENDED  (scan.cmd)
  Pure batch. No PowerShell, no ExecutionPolicy, nothing to unblock.
  Works on locked-down machines where PowerShell is disabled or crashes.
  1. Open the flash disk in File Explorer.
  2. Double-click scan.cmd.
  3. Type the team name/number when prompted. Wait for VERDICT.
  4. Window stays open (Press any key to close). Log is on the flash disk.

WINDOWS - ALTERNATIVE  (scan.ps1)
  Use only if you specifically want the PowerShell version. If it flashes
  and closes, use scan.cmd instead.
  1. Hold Shift, right-click empty space in the flash disk -> "Open
     PowerShell window here" (or "Open in Terminal").
  2. Run:
        powershell -ExecutionPolicy Bypass -File scan.ps1
  3. Type the team name/number when prompted. Wait for VERDICT.

macOS / LINUX  (scan.sh)
  1. Open Terminal, cd into the flash disk folder.
  2. Run:
        chmod +x scan.sh
        ./scan.sh
  3. Type the team name/number when prompted. Wait for VERDICT.

----------------------------------------------------------------
OUTPUT
----------------------------------------------------------------
  File: FITscan_<team>_<hostname>_<YYYYMMDD-HHMMSS>.txt
  Written to the same folder as the script (the flash disk).

  Header: team, hostname, user, OS, time, duration, VERDICT.
  Sections A-D: every hit with full path, last-modified, size/count.
  VERDICT: CLEAN (zero hits) or FLAGGED (committee review required).

  Low-confidence hits (binaries named "q" or "goose" with no matching
  config folder) are labelled LOW-CONFIDENCE - judge in context.

----------------------------------------------------------------
SCOPE / LIMITS (state to finalist if asked)
----------------------------------------------------------------
  - Scans the logged-in user's home + project folders, plus PATH and
    common install dirs. Not a full-disk crawl.
  - Filesystem footprint only. Does not inspect running processes or
    network.
  - Flags for human review; the committee decides violations.

  Run the scanner as the finalist's own user account so it sees their
  real home directory. If multiple OS accounts exist, run once per
  account that could be used during Live Coding.
================================================================
