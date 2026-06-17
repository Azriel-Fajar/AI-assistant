---
name: feedback_google_cli
description: "Use Google CLI (tools/google/) via Bash for all Google Workspace tasks, not MCP"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3f61afd5-5fa9-4bb7-b32e-7f75ac5b45b4
---

Use `tools/google/` CLI via Bash for Google Calendar, Gmail, and Drive — NOT the MCP Google Calendar tools.

**Why:** User is disabling the MCP and switching to the custom CLI.

**How to apply:** When scheduling, reading calendar, sending email, or accessing Drive, run `node gcal/index.js`, `node gmail/index.js`, or `node gdrive/index.js` from `tools/google/`. Never call `mcp__claude_ai_Google_Calendar__*` tools.
