---
name: PowerShell Python UTF-8 Pitfalls
description: PowerShell > redirect writes UTF-16 BOM and breaks JSON; write python scripts to a file and force utf-8 stdout
metadata:
  type: feedback
---

When running Python from PowerShell (e.g. the graphify skill steps), three recurring failures and their fixes:

1. `python ... > file.json` writes UTF-16-LE with BOM -> later `json.loads(Path(...).read_text())` fails with "Expecting value: line 1 column 1". Fix: write inside Python with `Path(f).write_text(json.dumps(x), encoding='utf-8')`, not the shell `>`.
2. Inline `python -c "..."` with escaped double quotes (e.g. `result["nodes"]`) hits PowerShell quote-parsing and throws `SyntaxError: unterminated string literal`. Fix: write the snippet to a `.py` file and run `python file.py`.
3. Unicode in stdout (box-drawing chars) raises `UnicodeEncodeError: 'charmap' codec` under cp1252. Fix: prefix with `$env:PYTHONIOENCODING='utf-8'`.

**Why:** Cost several failed attempts during a graphify run. PowerShell default encodings (UTF-16 redirect, cp1252 stdout) silently break Python I/O.

**How to apply:** Prefer writing temp `.py` scripts over `python -c` with quotes; always write JSON from Python with `encoding='utf-8'`; set `PYTHONIOENCODING=utf-8` before any script that prints non-ASCII. Relates to [[feedback_flask_run_command]].
