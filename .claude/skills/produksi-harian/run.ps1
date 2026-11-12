# Started daily by Task Scheduler ("Sekitar Produksi Harian"). Runs produksi-harian headless for 5 films a day (one film per
# session, fresh context each) and one research session a day, and keeps a log per session.
# Lives in <JARVIS>\.claude\skills\produksi-harian, so JARVIS is three folders up: no username or drive hardcoded.
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$shorts = Join-Path $root 'shorts'
$logDir = Join-Path $shorts 'log'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$day = Get-Date -Format 'yyyy-MM-dd'
# A session leaves this file when Gemini's daily voice quota is gone. The quota resets at 15:00 WIB,
# so the file only goes once a 15:00 has passed since it was written.
$stop = Join-Path $shorts '.stop-run'
$geminiReset = (Get-Date).Date.AddHours(15)
if ((Get-Date) -lt $geminiReset) { $geminiReset = $geminiReset.AddDays(-1) }
if ((Test-Path $stop) -and (Get-Item $stop).LastWriteTime -lt $geminiReset) { Remove-Item $stop }
$lock = Join-Path $shorts '.produksi.lock'

$env:GEMINI_API_KEY = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')
$env:PYTHONIOENCODING = 'utf-8'
# Lean context (5 Nov 2026): no CLAUDE.md files and no bundled skills; headless-settings.json turns off auto-memory
# and caps the skill listing. headless-context.md is the only standing context.
$env:CLAUDE_CODE_DISABLE_CLAUDE_MDS = '1'
$env:CLAUDE_CODE_DISABLE_BUNDLED_SKILLS = '1'

$claude = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
if (-not (Test-Path $claude)) { $claude = (Get-Command claude -ErrorAction SilentlyContinue).Source }

# Lean headless mode to save Claude usage: runs in shorts\ with project settings only (no user plugins, hooks or
# MCP servers), with the model and effort pinned in headless-settings.json.
$lean = '--setting-sources', 'project,local', '--settings', "`"$PSScriptRoot\headless-settings.json`"",
  '--strict-mcp-config', '--mcp-config', "`"$PSScriptRoot\headless-mcp.json`"",
  '--append-system-prompt-file', "`"$PSScriptRoot\headless-context.md`""

# Runs one session; returns $true when it exited 0 and wrote its .done marker.
function Invoke-Session($tag, $arg) {
  $log = Join-Path $logDir "produksi-$stamp-$tag.log"
  $err = Join-Path $logDir "produksi-$stamp-$tag.err.log"
  $prompt = "Read ../.claude/skills/produksi-harian/SKILL.md and follow it. Argument: $arg"
  # gambar and tinjau run at effort medium (11 Nov 2026): the picture session's thinking was ~2/3 of its output and
  # stayed in the context every later step re-read. naskah (fact gate), laporan and riset keep high from headless-settings.json.
  $effort = if ($arg -match 'gambar|tinjau') { @('--effort', 'medium') } else { @() }
  $p = Start-Process -FilePath $claude -WorkingDirectory $shorts -NoNewWindow -Wait -PassThru `
    -ArgumentList (@('-p', "`"$prompt`"", '--dangerously-skip-permissions') + $lean + $effort) `
    -RedirectStandardOutput $log -RedirectStandardError $err
  $script:code = $p.ExitCode
  if ($p.ExitCode -eq 0) { New-Item -ItemType File -Force -Path (Join-Path $logDir "produksi-$day-$tag.done") | Out-Null; return $true }
  # The session died mid-way, so its lock is stale; left in place it would block the resume for 3 hours.
  if (Test-Path $lock) { Remove-Item $lock }
  if ((Get-Content $log, $err -Raw -ErrorAction SilentlyContinue) -match 'hit your .*limit') {
    Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi tertunda' } `
      -Body "Sesi $arg kena limit Claude. Lanjut otomatis di jadwal berikutnya (02.30 / 15.30)." | Out-Null
  } else {
    Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi gagal' } `
      -Body "Sesi ${arg}: Claude keluar dengan kode $($p.ExitCode). Log: shorts\log\produksi-$stamp-$tag.log" | Out-Null
  }
  return $false
}

# 5 films a day again since 10 Nov 2026 (Azriel; 3 from 9 Nov). The task fires at 02:30 and at 15:30 (after the
# 15:00 Gemini reset), one per 5-hour Claude usage window, both outside Claude's weekday peak hours (about
# 20:00-02:00 WIB), when a window holds only ~0.6x as much (11 Nov 2026: one film took 58% of a 21:50 window).
# The 02:30 run makes films 1-2 of the day plus the research session, the 15:30 run films 3-5.
# A run starts at the first film of today without a .done marker, so one that hit the limit is resumed by the next
# run of the same date (02:30 -> 15:30); a 15:30 film left unfinished is redone from its naskah by the next 02:30 run.
$code = 0
$films = 0
$ok = $true
$night = (Get-Date).Hour -lt 12
$cap = if ($night) { 2 } else { 3 }
$risetDone = Join-Path $logDir "produksi-$day-riset.done"
# When one of the next 5 films has no idea block (a day the PC was off, 9 Nov 2026), the research session runs first,
# so no film session researches its own topic in the big Opus context.
Push-Location $shorts
$gaps = & python3.13 (Join-Path $PSScriptRoot 'target.py') gaps 5
Pop-Location
if ("$gaps" -match '^\d+$' -and [int]$gaps -gt 0 -and -not (Test-Path $risetDone)) { Invoke-Session 'riset' 'riset' | Out-Null }
# Each film is four fresh sessions: 'naskah' (topic, script, gate fakta, voice) and 'gambar' since 9 Nov 2026, so
# the picture work doesn't carry the research context; 'laporan' (upload text, report, notify) since 10 Nov 2026, so
# those light steps don't each re-read the 200k picture context; and 'tinjau' (storyboard, gate look, render, cover)
# split from 'gambar' (now just writing the piece) on 11 Nov 2026, so ~28 look and fix steps don't each re-read the
# 140-190k writing context.
# naskah writes produksi-<day>-<n>-a.done; if it ends the slot itself (no target, film stopped) it writes <n>.done too.
# gambar writes <n>-b.done, tinjau <n>-c.done, laporan <n>.done.
foreach ($n in 1..5) {
  if (Test-Path (Join-Path $logDir "produksi-$day-$n.done")) { continue }
  if ($films -ge $cap) { break }
  $partA = Test-Path (Join-Path $logDir "produksi-$day-$n-a.done")
  $partB = Test-Path (Join-Path $logDir "produksi-$day-$n-b.done")
  $partC = Test-Path (Join-Path $logDir "produksi-$day-$n-c.done")
  if (-not $partA -and (Test-Path $stop)) { break }
  $films++
  if (-not $partA) {
    if (-not (Invoke-Session "$n-a" "$n/5 naskah")) { $ok = $false; break }
    if (Test-Path (Join-Path $logDir "produksi-$day-$n.done")) { continue }
  }
  if (-not $partB) {
    if (-not (Invoke-Session "$n-b" "$n/5 gambar")) { $ok = $false; break }
  }
  if (-not $partC) {
    if (-not (Invoke-Session "$n-c" "$n/5 tinjau")) { $ok = $false; break }
  }
  if (-not (Invoke-Session "$n" "$n/5 laporan")) { $ok = $false; break }
}
# One research session a day (5 Nov 2026), after the 02:30 run's films (so the 15:30 films find their blocks
# ready), or after all five films if the 02:30 run didn't do it. It needs no Gemini, so .stop-run doesn't stop it.
$allFilms = @(1..5 | Where-Object { Test-Path (Join-Path $logDir "produksi-$day-$_.done") }).Count -eq 5
if ($ok -and -not (Test-Path $risetDone) -and ($night -or $allFilms)) {
  Invoke-Session 'riset' 'riset' | Out-Null
}
# Back to sleep, but only when nobody is using the PC (a wake from sleep), never under someone's hands.
# The 5-minute wait gives OneDrive time to upload the new video so the phone can reach it.
Add-Type @'
using System; using System.Runtime.InteropServices;
public static class Idle {
  [StructLayout(LayoutKind.Sequential)] struct LII { public uint cbSize; public uint dwTime; }
  [DllImport("user32.dll")] static extern bool GetLastInputInfo(ref LII p);
  public static uint Seconds() { var l = new LII(); l.cbSize = (uint)Marshal.SizeOf(l); GetLastInputInfo(ref l); return ((uint)Environment.TickCount - l.dwTime) / 1000; }
}
'@
Start-Sleep -Seconds 300
if ([Idle]::Seconds() -ge 900) {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.Application]::SetSuspendState('Suspend', $false, $false) | Out-Null
}
exit $code
