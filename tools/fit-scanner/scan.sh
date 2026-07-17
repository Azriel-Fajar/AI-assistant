#!/usr/bin/env bash
# FIT Competition 2026 - Quarantine Device Scanner (macOS / Linux)
# Detects banned agentic-AI footprints on a finalist laptop.
# Output: evidence log written next to this script (flash disk). Log-only.
# Run:  chmod +x scan.sh && ./scan.sh

# Do NOT use set -e: a single failed test must not abort the whole scan.
set -u

# ---------- locate script dir (for log output) ----------
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"

# ---------- crash safety + pause-on-exit ----------
# Mirrors the Windows scanner: if anything aborts the script (e.g. set -u
# unbound var, unexpected error), write a CRASH log to the flash disk and keep
# the window open so the committee sees why a device failed.
SCAN_DONE=false
on_err() {
  local ec="${1:-?}"
  local ln="${2:-?}"
  local cmd="${3:-?}"
  local cdir="$SCRIPT_DIR"
  ( : > "$SCRIPT_DIR/.fitscan_wtest" ) 2>/dev/null && rm -f "$SCRIPT_DIR/.fitscan_wtest" 2>/dev/null || cdir="${HOME:-/tmp}"
  local crash="$cdir/FITscan_CRASH_$(hostname 2>/dev/null || echo host)_$(date '+%Y%m%d-%H%M%S').txt"
  {
    echo "================================================================"
    echo " FIT SCANNER - CRASH REPORT"
    echo "================================================================"
    echo " Time   : $(date '+%Y-%m-%d %H:%M:%S')"
    echo " Host   : $(hostname 2>/dev/null)"
    echo " OS     : $(uname -a 2>/dev/null)"
    echo " Bash   : ${BASH_VERSION:-?}"
    echo " Exit   : $ec  at line $ln"
    echo " Cmd    : $cmd"
    echo "================================================================"
  } | tee "$crash" 2>/dev/null
  echo ""
  echo "SCANNER CRASHED - crash log: $crash"
}
on_exit() {
  # Snapshot exit status and failing command at the very first opportunity,
  # before any command here overwrites $? / $BASH_COMMAND.
  local ec=$?
  local cmd="$BASH_COMMAND"
  if [ "$SCAN_DONE" != true ]; then on_err "$ec" "${BASH_LINENO[0]:-?}" "$cmd"; fi
  echo ""
  # keep terminal open if double-clicked / launched in a transient window
  read -r -p 'Press Enter to close ' _ 2>/dev/null || true
}
# Only an EXIT trap: a single failed test (grep/find non-zero) must NOT trigger
# a crash report. on_exit fires once and only reports if SCAN_DONE never set.
trap on_exit EXIT

# ---------- collectors ----------
HITS_A=(); HITS_B=(); HITS_C=(); HITS_D=(); NOTES=()
add_hit() { # cat type path detail
  local line="[$2] $3"$'\n'"      -> $4"
  case "$1" in
    A) HITS_A+=("$line");; B) HITS_B+=("$line");;
    C) HITS_C+=("$line");; D) HITS_D+=("$line");;
  esac
}

evidence() { # path -> "type | modified ... | size/count"
  local p="$1"
  if [ ! -e "$p" ]; then echo "missing"; return; fi
  local mtime size
  if [ "$(uname)" = "Darwin" ]; then
    mtime="$(stat -f '%Sm' -t '%Y-%m-%d %H:%M:%S' "$p" 2>/dev/null)"
  else
    mtime="$(stat -c '%y' "$p" 2>/dev/null | cut -d'.' -f1)"
  fi
  if [ -d "$p" ]; then
    local c; c="$(ls -A1 "$p" 2>/dev/null | wc -l | tr -d ' ')"
    echo "dir  | modified ${mtime:-?} | ${c} item(s)"
  else
    if [ "$(uname)" = "Darwin" ]; then size="$(stat -f '%z' "$p" 2>/dev/null)"; else size="$(stat -c '%s' "$p" 2>/dev/null)"; fi
    echo "file | modified ${mtime:-?} | ${size:-?} bytes"
  fi
}

# ---------- prompt ----------
printf 'Enter team name/number: '
read -r TEAM
[ -z "$TEAM" ] && TEAM="UNKNOWN"
TEAM_SAFE="$(echo "$TEAM" | tr -c 'A-Za-z0-9_-' '_' | tr -s '_' | sed 's/_$//')"

START_EPOCH="$(date +%s)"
START_HUMAN="$(date '+%Y-%m-%d %H:%M:%S')"
STAMP="$(date '+%Y%m%d-%H%M%S')"
HOSTN="$(hostname 2>/dev/null || echo unknown-host)"
USERN="${USER:-$(whoami 2>/dev/null)}"
OS_NAME="$(uname -s) $(uname -r)"
HOME_="${HOME:-$(cd ~ && pwd)}"

echo "Scanning... (team: $TEAM, host: $HOSTN)"

# mac app-support root
if [ "$(uname)" = "Darwin" ]; then APPSUP="$HOME_/Library/Application Support"; else APPSUP="$HOME_/.config"; fi

# ---------- A. home config/state folders ----------
A_PATHS=(
  "$HOME_/.claude" "$HOME_/.claude.json" "$HOME_/.codex" "$HOME_/.gemini"
  "$HOME_/.aider.conf.yml" "$HOME_/.cursor" "$HOME_/.cursor-cli"
  "$HOME_/.windsurf" "$HOME_/.codeium" "$HOME_/.copilot" "$HOME_/.config/gh-copilot"
  "$HOME_/.aws/amazonq" "$HOME_/.aws/q" "$HOME_/.kiro" "$HOME_/.openhands"
  "$HOME_/.config/goose" "$HOME_/.plandex-home-v2" "$HOME_/.plandex"
  "$HOME_/.cody" "$HOME_/.config/cody" "$HOME_/.config/zed"
  "$HOME_/.local/pipx/venvs/aider" "$HOME_/.local/pipx/venvs/openhands"
)
# any .aider* in home
for f in "$HOME_"/.aider*; do [ -e "$f" ] && A_PATHS+=("$f"); done

for p in "${A_PATHS[@]}"; do
  [ -e "$p" ] && add_hit A config "$p" "$(evidence "$p")"
done

# ---------- B. CLI binaries ----------
Q_CONF=false;  { [ -e "$HOME_/.aws/q" ] || [ -e "$HOME_/.aws/amazonq" ]; } && Q_CONF=true
GOOSE_CONF=false; [ -e "$HOME_/.config/goose" ] && GOOSE_CONF=true

BIN_NAMES=(claude codex gemini aider cursor-agent windsurf copilot q qchat kiro openhands goose plandex pdx cody)
SEARCH_DIRS=("$HOME_/.local/bin" "/usr/local/bin" "/opt/homebrew/bin" "/home/linuxbrew/.linuxbrew/bin")
NPMP="$(npm prefix -g 2>/dev/null)"; [ -n "$NPMP" ] && SEARCH_DIRS+=("$NPMP/bin")

for name in "${BIN_NAMES[@]}"; do
  declare -a found=()
  cv="$(command -v "$name" 2>/dev/null)"; [ -n "$cv" ] && found+=("$cv")
  for d in "${SEARCH_DIRS[@]}"; do
    [ -x "$d/$name" ] && found+=("$d/$name")
  done
  # unique
  declare -a uniq=()
  for f in "${found[@]:-}"; do
    [ -z "$f" ] && continue
    skip=false; for u in "${uniq[@]:-}"; do [ "$u" = "$f" ] && skip=true; done
    $skip || uniq+=("$f")
  done
  for f in "${uniq[@]:-}"; do
    [ -z "$f" ] && continue
    conf=true
    [ "$name" = "q" ] && conf=$Q_CONF
    [ "$name" = "goose" ] && conf=$GOOSE_CONF
    if $conf; then tag="binary"; else tag="binary (LOW-CONFIDENCE, name collision)"; fi
    add_hit B "$tag" "$f" "binary '$name' present"
  done
  unset found uniq
done

# ---------- C. IDE agent extensions ----------
EXT_ROOTS=("$HOME_/.vscode/extensions" "$HOME_/.cursor/extensions" "$HOME_/.windsurf/extensions")
BANNED_EXT=(anthropic.claude-code github.copilot github.copilot-chat saoudrizwan.claude-dev
  rooveterinaryinc.roo-cline continue.continue sourcegraph.cody-ai codeium.codeium
  codeium.windsurf amazonwebservices.amazon-q-vscode google.geminicodeassist
  googlecloudtools.cloudcode augment.vscode-augment)

for root in "${EXT_ROOTS[@]}"; do
  [ -d "$root" ] || continue
  for d in "$root"/*/; do
    [ -d "$d" ] || continue
    bn="$(basename "$d")"
    for id in "${BANNED_EXT[@]}"; do
      case "$bn" in
        "$id"-*|"$id") add_hit C extension "${d%/}" "matches banned ext '$id' | $(evidence "${d%/}")"; break;;
      esac
    done
  done
done
# agentic IDE installs themselves
for app in "$HOME_/.cursor" "$HOME_/.windsurf" "/Applications/Cursor.app" "/Applications/Windsurf.app"; do
  [ -e "$app" ] && add_hit C app-install "$app" "agentic IDE install present | $(evidence "$app")"
done

# ---------- D. agent-residue files ----------
WALK_ROOTS=("$HOME_/Desktop" "$HOME_/Documents" "$HOME_/projects" "$HOME_/code"
            "$HOME_/dev" "$HOME_/repos" "$HOME_/src" "$HOME_/source")

for r in "${WALK_ROOTS[@]}"; do
  [ -d "$r" ] || continue
  # bounded depth 3, prune heavy dirs
  while IFS= read -r path; do
    add_hit D residue "$path" "$(evidence "$path")"
  done < <(find "$r" -maxdepth 3 \
      \( -name node_modules -o -name .git -o -name vendor -o -name venv -o -name .venv -o -name __pycache__ \) -prune -o \
      \( -name '.aider.chat.history.md' -o -name '.aider.input.history' -o -name 'CLAUDE.md' \
         -o -name 'AGENTS.md' -o -name '.cursorrules' -o -name '.codex' -o -name '.gemini' \
         -o -name '.continue' -o -name '.roo' -o -name '.cline' \) -print 2>/dev/null)
  # .cursor with rules/ and .github with copilot-instructions.md (conditional)
  while IFS= read -r path; do
    [ -d "$path/rules" ] && add_hit D residue "$path" "$(evidence "$path") (contains rules/)"
  done < <(find "$r" -maxdepth 3 -name '.cursor' -type d -print 2>/dev/null)
  while IFS= read -r path; do
    [ -f "$path/copilot-instructions.md" ] && add_hit D residue "$path/copilot-instructions.md" "$(evidence "$path/copilot-instructions.md")"
  done < <(find "$r" -maxdepth 3 -name '.github' -type d -print 2>/dev/null)
done

# ---------- build + write log ----------
END_EPOCH="$(date +%s)"
DUR=$((END_EPOCH - START_EPOCH))
TOTAL=$(( ${#HITS_A[@]} + ${#HITS_B[@]} + ${#HITS_C[@]} + ${#HITS_D[@]} ))
if [ "$TOTAL" -eq 0 ]; then VERDICT="CLEAN"; else VERDICT="FLAGGED - $TOTAL item(s), committee review required"; fi

# Prefer the script's own dir (flash disk), but fall back to $HOME if that
# volume is read-only (e.g. NTFS drive mounted read-only on macOS).
LOG_DIR="$SCRIPT_DIR"
if ! ( : > "$SCRIPT_DIR/.fitscan_wtest" ) 2>/dev/null; then
  LOG_DIR="$HOME_"
  NOTES+=("script dir not writable ($SCRIPT_DIR); log written to \$HOME instead")
else
  rm -f "$SCRIPT_DIR/.fitscan_wtest" 2>/dev/null
fi
LOG="$LOG_DIR/FITscan_${TEAM_SAFE}_${HOSTN}_${STAMP}.txt"

print_cat() { # title  array...
  local title="$1"; shift
  echo "----------------------------------------------------------------"
  echo "$title"
  echo "----------------------------------------------------------------"
  local any=false
  for h in "$@"; do
    [ -z "$h" ] && continue
    echo "  $h"; any=true
  done
  $any || echo "  (no hits)"
  echo ""
}

{
  echo "================================================================"
  echo " FIT COMPETITION 2026 - QUARANTINE DEVICE SCAN"
  echo "================================================================"
  echo " Team        : $TEAM"
  echo " Hostname    : $HOSTN"
  echo " User        : $USERN"
  echo " OS          : $OS_NAME"
  echo " Scan start  : $START_HUMAN"
  echo " Duration    : ${DUR}s"
  echo " VERDICT     : $VERDICT"
  echo "================================================================"
  echo ""
  print_cat "A. AGENTIC AI CONFIG/STATE FOLDERS (home dir)" "${HITS_A[@]:-}"
  print_cat "B. AGENTIC CLI BINARIES (PATH + install dirs)" "${HITS_B[@]:-}"
  print_cat "C. IDE AGENT EXTENSIONS / AGENTIC IDE INSTALLS" "${HITS_C[@]:-}"
  print_cat "D. AGENT-RESIDUE FILES (prepared-work evidence in project dirs)" "${HITS_D[@]:-}"
  if [ "${#NOTES[@]}" -gt 0 ]; then
    echo "----------------------------------------------------------------"
    echo "SCAN NOTES"
    echo "----------------------------------------------------------------"
    for n in "${NOTES[@]}"; do echo "  - $n"; done
    echo ""
  fi
  echo "================================================================"
  echo " END OF REPORT - VERDICT: $VERDICT"
  echo "================================================================"
} > "$LOG"

SCAN_DONE=true
echo ""
echo "VERDICT: $VERDICT"
echo "Log written: $LOG"
