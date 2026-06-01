#!/usr/bin/env bash
# Start the Meta dashboard. First run creates a venv and installs Flask.
# Open http://localhost:5000 after it starts.
set -e
cd "$(dirname "$0")/../.."          # -> JARVIS root (so .env and the meta package resolve)

VENV="meta/dashboard/.venv"
if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q -r meta/dashboard/requirements.txt
fi

exec "$VENV/bin/flask" --app meta.dashboard.app run --port "${PORT:-5000}"
