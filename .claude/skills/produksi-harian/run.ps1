# Started daily by Task Scheduler ("Sekitar Produksi Harian"). Runs produksi-harian headless for 4 films a day (2 per run, one
# film per session, fresh context each) and a research session only when idea blocks run low (every 2-3 days), and keeps a log per session.
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
# Did this run's own scheduled wake pull the PC out of sleep? Windows logs it (Power-Troubleshooter 1, wake source names the
# task). Only then does the PC go back to sleep at the end; a PC that was already on stays on (Azriel, 16 Nov 2026).
$wokenByTask = $false
try {
  $wk = Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Microsoft-Windows-Power-Troubleshooter'; Id = 1; StartTime = (Get-Date).AddMinutes(-15) } -MaxEvents 1 -ErrorAction Stop
  if ($wk.Message -match 'Sekitar Produksi Harian') { $wokenByTask = $true }
} catch {}

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
  # laporan (upload text, report) runs on Sonnet since 17 Nov 2026: light text step, Opus cost ~0.5M per film for no gain.
  if ($arg -match 'laporan') { $effort = @('--model', 'sonnet', '--effort', 'medium') }
  # Claude limit ("You've hit your session limit"): often an earlier session's 5-hour window that ends a few minutes after
  # this run started, so wait 15 minutes and retry, up to 4 times (1 hour), before giving up as TERTUNDA.
  $attempt = 0
  while ($true) {
    $p = Start-Process -FilePath $claude -WorkingDirectory $shorts -NoNewWindow -Wait -PassThru `
      -ArgumentList (@('-p', "`"$prompt`"", '--dangerously-skip-permissions') + $lean + $effort) `
      -RedirectStandardOutput $log -RedirectStandardError $err
    $hitLimit = $p.ExitCode -ne 0 -and ((Get-Content $log, $err -Raw -ErrorAction SilentlyContinue) -match 'hit your .*limit')
    if (-not $hitLimit -or $attempt -ge 4) { break }
    $attempt++
    if (Test-Path $lock) { Remove-Item $lock }
    Start-Sleep -Seconds 900
  }
  $script:code = $p.ExitCode
  if ($p.ExitCode -eq 0) { New-Item -ItemType File -Force -Path (Join-Path $logDir "produksi-$day-$tag.done") | Out-Null; return $true }
  # The session died mid-way, so its lock is stale; left in place it would block the resume for 3 hours.
  if (Test-Path $lock) { Remove-Item $lock }
  # No ntfy (unreachable from this PC, 16 Nov 2026): a HARIAN.md row, which the Claude app task ringkasan-pagi reads at 06:30.
  $row = if ((Get-Content $log, $err -Raw -ErrorAction SilentlyContinue) -match 'hit your .*limit') {
    "| $day | $tag | TERTUNDA | - | sesi $arg kena limit Claude, lanjut otomatis di jadwal berikutnya (15.30 / 20.30) |"
  } else {
    "| $day | $tag | GAGAL | - | sesi ${arg}: Claude keluar dengan kode $($p.ExitCode), log shorts\log\produksi-$stamp-$tag.log |"
  }
  [IO.File]::AppendAllText((Join-Path $shorts 'out\HARIAN.md'), "$row`n", (New-Object Text.UTF8Encoding $false))
  return $false
}

# 4 films a day on 16 Nov 2026, back to 5 on 17 Nov (Azriel): the 02:00-03:37 run of 16 Nov hit the 5-hour limit
# after about 2.5 films plus research (~7% of the weekly limit). The task fires at 15:30 (after the 15:00 Gemini reset) and at 20:30 (since 17 Nov 2026,
# Azriel: 2 films use under 30% of a 5-hour window, so two runs fit two windows), both for tomorrow's slots.
# 5 films a day again: at most 3 films at 15:30 (films 1-3), 2 at 20:30 (films 4-5).
# A run starts at the first film of today without a .done marker, so one that hit the limit is resumed by the next
# run of the same date (15:30 -> 20:30); a 20:30 film left unfinished is redone from its naskah by the next day's 15:30 run.
$code = 0
$films = 0
$ok = $true
$cap = if ((Get-Date).Hour -lt 19) { 3 } else { 2 }
$risetDone = Join-Path $logDir "produksi-$day-riset.done"
# Research runs only when one of the next 5 films has no idea block (every 2-3 days, since 16 Nov 2026, as each
# research session writes about 10 blocks), before the films, so no film session researches its own topic in the big Opus context.
Push-Location $shorts
$stock = & python3.13 (Join-Path $PSScriptRoot 'target.py') stock
Pop-Location
# Research only in the evening run, and only when fewer than 5 unmade plan rows hold an idea block (17 Nov 2026, Azriel):
# at 15:30 it took ~half of the 5-hour window, and a friend's setup skips research while the stock is enough.
if ((Get-Date).Hour -ge 19 -and "$stock" -match '^\d+$' -and [int]$stock -lt 5 -and -not (Test-Path $risetDone)) { Invoke-Session 'riset' 'riset' | Out-Null }
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
# Back to sleep only when this run's own wake started it and nobody is using the PC now; a PC that was already on is left on.
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
if ($wokenByTask -and [Idle]::Seconds() -ge 900) {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.Application]::SetSuspendState('Suspend', $false, $false) | Out-Null
}
exit $code
