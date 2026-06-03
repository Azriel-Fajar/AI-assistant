---
name: Flask Module Run Command
description: Flask apps with relative imports must run as a module, not as a script
metadata:
  type: feedback
---

Run Flask apps that use relative imports as a module from the project root, not directly.

**Why:** `python app.py` triggers `ImportError: attempted relative import with no known parent package`. The module flag sets the package context correctly.

**How to apply:** Whenever starting `meta/dashboard/app.py` or any Flask app in a subdirectory that uses `from . import ...`, always use:
```
python -m flask --app meta.dashboard.app run
```
from the JARVIS root, never `cd meta/dashboard && python app.py`.
