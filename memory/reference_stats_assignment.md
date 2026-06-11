---
name: Stats Assignment Build
description: stats-presentation.html is source for stats-presentation.pdf; render via Playwright chromium
metadata:
  type: reference
---

The Frequency Distribution / Statistics assignment lives at project root: `stats-presentation.html` (source) renders to `stats-presentation.pdf` (submission). 7 pages: Ch2 (raw data, range, Sturges, width, freq table, histogram, polygon, ogive) + Ch3 (mean/median/mode, Q1, decile D5, percentile P10, variance, stddev) on the 40-adult weight dataset.

**Build:** Chart.js charts in HTML, render to PDF with a Playwright chromium script: `page.goto(file://..., waitUntil:'networkidle')`, `waitForTimeout(1500)` for charts, then `page.pdf({width:'210mm',height:'297mm',printBackground:true})`. Compact pages use `.compact` class to avoid A4 overflow (footer pushed to extra page = too tall). x̄ rendered with `.ovl` overline span, not combining macron (offsets in monospace).

Related: [[reference_stats_course]].
