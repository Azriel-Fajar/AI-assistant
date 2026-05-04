# Connections

Registry of every system your AIOS can reach. Filled by `/onboard` from Q4-Q7 answers; expanded over time as you wire new tools. `/audit` checks this file for domain coverage and freshness.

| # | Domain | Tool | Mechanism | Auth | Last checked |
|---|---|---|---|---|---|
| 1 | Revenue / Financials | Bank transfer (manual) | not yet connected | — | — |
| 2 | Customer interactions | WhatsApp | not yet connected | — | — |
| 3 | Calendar | Google Calendar | mcp | connected | 2026-05-04 |
| 4 | Communication | Instagram DMs, Gmail | not yet connected | — | — |
| 5 | Project / task tracking | None (to be built) | not yet connected | — | — |
| 6 | Meeting intelligence | None (to be built) | not yet connected | — | — |
| 7 | Knowledge / files | JARVIS (this repo) | local | — | 2026-05-04 |

**Mechanism options:** `mcp` (MCP server), `script` (Python/Bash hitting an API, in `scripts/`), `export` (CSV/JSON dump pipeline), `key+ref` (`.env` key + `references/{tool}-api.md` guide), `not yet connected`.

When you wire a new tool, also save `references/{tool}-api.md` capturing endpoints, auth flow, and common queries — researched-once-saved-forever.