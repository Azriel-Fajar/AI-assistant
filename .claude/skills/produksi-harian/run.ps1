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
  $p = Start-Process -FilePath $claude -WorkingDirectory $shorts -NoNewWindow -Wait -PassThru `
    -ArgumentList (@('-p', "`"$prompt`"", '--dangerously-skip-permissions') + $lean) `
    -RedirectStandardOutput $log -RedirectStandardError $err
  $script:code = $p.ExitCode
  if ($p.ExitCode -eq 0) { New-Item -ItemType File -Force -Path (Join-Path $logDir "produksi-$day-$tag.done") | Out-Null; return $true }
  # The session died mid-way, so its lock is stale; left in place it would block the resume for 3 hours.
  if (Test-Path $lock) { Remove-Item $lock }
  if ((Get-Content $log, $err -Raw -ErrorAction SilentlyContinue) -match 'hit your .*limit') {
    Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi tertunda' } `
      -Body "Sesi $arg kena limit Claude. Lanjut otomatis di jadwal berikutnya (08.10 / 13.20)." | Out-Null
  } else {
    Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi gagal' } `
      -Body "Sesi ${arg}: Claude keluar dengan kode $($p.ExitCode). Log: shorts\log\produksi-$stamp-$tag.log" | Out-Null
  }
  return $false
}

# 5 films a day since 5 Nov 2026 (Azriel): the task fires at 03:00, 08:10 and 13:20, one per 5-hour Claude usage
# window. The 03:00 run makes 3 films and the 08:10 run 2 (Azriel, 5 Nov 2026); the 13:20 run only catches up.
# A run starts at the first film of today without a .done marker, so one that hit the limit is resumed by the next run.
$code = 0
$films = 0
$ok = $true
$cap = if ((Get-Date).Hour -lt 8) { 3 } else { 2 }
foreach ($n in 1..5) {
  if (Test-Path (Join-Path $logDir "produksi-$day-$n.done")) { continue }
  if ($films -ge $cap -or (Test-Path $stop)) { break }
  $films++
  if (-not (Invoke-Session "$n" "$n/5")) { $ok = $false; break }
}
# One research session a day (5 Nov 2026), after the day's last film: once all five films are done (normally the
# 08:10 run), or in the 13:20 run at the latest. It needs no Gemini, so .stop-run doesn't stop it.
$allFilms = @(1..5 | Where-Object { Test-Path (Join-Path $logDir "produksi-$day-$_.done") }).Count -eq 5
if ($ok -and -not (Test-Path (Join-Path $logDir "produksi-$day-riset.done")) -and ((Get-Date).Hour -ge 13 -or $allFilms)) {
  Invoke-Session 'riset' 'riset' | Out-Null
}
# Back to sleep, but only when nobody is using the PC (the 03:00 wake), never under someone's hands.
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
