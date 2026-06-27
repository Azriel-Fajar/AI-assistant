#!/usr/bin/env bash
# Detect installed CLI AI tools (npm or native curl|sh installers) and uninstall
# only the ones found. Global config folders (.claude, .codex, .gemini) are KEPT.
# GUI apps (e.g. Codex desktop) are NOT touched. CLI tools only.
#
#   ./uninstall-ai-clis.sh           detect, confirm, uninstall
#   ./uninstall-ai-clis.sh --dry-run show what would be removed, change nothing
#   ./uninstall-ai-clis.sh --yes     skip confirmation
set -euo pipefail

DRY_RUN=0
ASSUME_YES=0
for a in "$@"; do
  case "$a" in
    --dry-run) DRY_RUN=1 ;;
    --yes|-y)  ASSUME_YES=1 ;;
    *) echo "unknown arg: $a" >&2; exit 2 ;;
  esac
done

HOME_DIR="${HOME}"
LOCAL_BIN="${HOME_DIR}/.local/bin"

# Tool table: name | command | npm-package | config-keep-dir | native-paths(comma-sep)
TOOLS=(
  "Claude Code|claude|@anthropic-ai/claude-code|${HOME_DIR}/.claude|${HOME_DIR}/.claude/local,${LOCAL_BIN}/claude"
  "Codex CLI|codex|@openai/codex|${HOME_DIR}/.codex|${LOCAL_BIN}/codex"
  "Gemini CLI|gemini|@google/gemini-cli|${HOME_DIR}/.gemini|${LOCAL_BIN}/gemini"
)

# Snapshot npm global packages once (empty if npm absent).
NPM_LIST="$(npm ls -g --depth=0 2>/dev/null || true)"

declare -a DETECTED=()

for row in "${TOOLS[@]}"; do
  IFS='|' read -r name cmd npm keep natives <<<"$row"

  npm_hit=0
  [ -n "$NPM_LIST" ] && grep -q -- "$npm" <<<"$NPM_LIST" && npm_hit=1

  cmd_hit=0
  command -v "$cmd" >/dev/null 2>&1 && cmd_hit=1

  native_hit=0
  IFS=',' read -ra np <<<"$natives"
  for p in "${np[@]}"; do [ -e "$p" ] && native_hit=1; done

  if [ "$npm_hit" = 1 ] || [ "$cmd_hit" = 1 ] || [ "$native_hit" = 1 ]; then
    DETECTED+=("$row|$npm_hit|$native_hit|$cmd_hit")
  fi
done

if [ "${#DETECTED[@]}" -eq 0 ]; then
  echo "No CLI AI tools detected. Nothing to uninstall."
  exit 0
fi

echo
echo "Detected CLI AI tools:"
for d in "${DETECTED[@]}"; do
  IFS='|' read -r name cmd npm keep natives npm_hit native_hit cmd_hit <<<"$d"
  via=""
  [ "$npm_hit" = 1 ] && via="npm"
  [ "$native_hit" = 1 ] && via="${via:+$via, }native"
  [ -z "$via" ] && [ "$cmd_hit" = 1 ] && via="PATH"
  echo "  - ${name}  [${via}]"
  echo "      keep config: ${keep}"
done
echo

if [ "$DRY_RUN" = 1 ]; then
  echo "Dry run: no changes made."
  exit 0
fi

if [ "$ASSUME_YES" != 1 ]; then
  read -r -p "Uninstall the tools listed above? Config folders are kept. (y/N) " ans
  case "$ans" in
    y|Y|yes|YES) ;;
    *) echo "Aborted."; exit 0 ;;
  esac
fi

for d in "${DETECTED[@]}"; do
  IFS='|' read -r name cmd npm keep natives npm_hit native_hit cmd_hit <<<"$d"
  echo
  echo ">> ${name}"

  if [ "$npm_hit" = 1 ]; then
    echo "   npm uninstall -g ${npm}"
    if npm uninstall -g "$npm" >/dev/null 2>&1; then
      echo "   npm: removed"
    else
      echo "   npm: failed"
    fi
  fi

  IFS=',' read -ra np <<<"$natives"
  for p in "${np[@]}"; do
    [ -e "$p" ] || continue
    [ "$p" = "$keep" ] && continue   # never delete the config folder itself
    if rm -rf "$p"; then
      echo "   removed: ${p}"
    else
      echo "   skip: ${p}"
    fi
  done

  echo "   kept config: ${keep}"
done

echo
echo "Done. Config folders preserved. Open a new shell to refresh PATH."
