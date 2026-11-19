# Empties %LOCALAPPDATA%\Temp after a production day (Remotion/Chromium/ffmpeg leftovers reach ~20 GB).
# Skips Temp\claude (live Claude Code sessions keep their scratchpad there) and anything locked.
# Run only when no film session and no render is still running.
param([switch]$WhatIf)

$temp = Join-Path $env:LOCALAPPDATA 'Temp'
$before = (Get-ChildItem $temp -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
$skipped = 0
Get-ChildItem $temp -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -ne 'claude' } |
  ForEach-Object {
    try { Remove-Item $_.FullName -Recurse -Force -ErrorAction Stop -WhatIf:$WhatIf }
    catch { $script:skipped++ }   # in use by a running process: leave it
  }
$after = (Get-ChildItem $temp -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
"Temp: {0:N2} GB -> {1:N2} GB, {2} top-level item(s) skipped (locked){3}" -f ($before/1GB), ($after/1GB), $skipped, $(if ($WhatIf) {' [WhatIf, nothing deleted]'} else {''})
