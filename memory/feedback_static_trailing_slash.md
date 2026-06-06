---
name: Static Demo Trailing Slash
description: static folder index served at /demos must use trailing slash or relative CSS/JS fails to load
metadata:
  type: feedback
---

When opening a static `index.html` served from a subfolder (e.g. `public/demos/`), always use a trailing slash in the URL: `http://127.0.0.1:8000/demos/` not `/demos`.

**Why:** without the slash, the browser resolves relative asset paths (`assets/hub.css`, `app.js`) against the parent path, not the folder, so CSS/JS 404 and the page renders as raw unstyled HTML. Symptom Azriel hit 2026-06-06: demos hub showed plain text, no cards, no theme.

**How to apply:** give Azriel demo/static links with trailing slash on both hub and niche pages (`/demos/restaurant-cafe/`). If no-slash must work, add `<base href="/demos/">` or use absolute asset paths. Also: these static demos need no `npm run build` (no Vite). Related: [[project_demo_sites]].
