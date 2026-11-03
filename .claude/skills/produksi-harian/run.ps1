# Started daily by Task Scheduler ("Sekitar Produksi Harian"). Runs /produksi-harian headless 3 times (one film each,
# fresh context each), each followed by a research session, and keeps a log per session.
# Lives in <JARVIS>\.claude\skills\produksi-harian, so JARVIS is three folders up: no username or drive hardcoded.
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$logDir = Join-Path $root 'shorts\log'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$day = Get-Date -Format 'yyyy-MM-dd'
# A session leaves this file when Gemini's daily voice quota is gone. The quota resets at 15:00 WIB,
# so the file only goes once a 15:00 has passed since it was written.
$stop = Join-Path $root 'shorts\.stop-run'
$geminiReset = (Get-Date).Date.AddHours(15)
if ((Get-Date) -lt $geminiReset) { $geminiReset = $geminiReset.AddDays(-1) }
if ((Test-Path $stop) -and (Get-Item $stop).LastWriteTime -lt $geminiReset) { Remove-Item $stop }
$lock = Join-Path $root 'shorts\.produksi.lock'

$env:GEMINI_API_KEY = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')
$env:PYTHONIOENCODING = 'utf-8'

$claude = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
if (-not (Test-Path $claude)) { $claude = (Get-Command claude -ErrorAction SilentlyContinue).Source }

# Lean headless mode to save Claude usage: project settings only (no user plugins, hooks or MCP servers),
# with the model and effort the user settings would have given pinned in headless-settings.json.
$lean = '--setting-sources', 'project,local', '--settings', "`"$PSScriptRoot\headless-settings.json`"",
  '--strict-mcp-config', '--mcp-config', "`"$PSScriptRoot\headless-mcp.json`""

# Each film is followed by its own small research session, so the research doesn't run on top of the
# film's large context. One film per run: the task fires at 03:00, 08:10 and 13:20, one per 5-hour
# Claude usage window (Azriel, 3 Nov 2026). A run starts at the first session of today without a .done
# marker, so one that hit the limit is resumed by the next run.
$code = 0
$filmRan = $false
:outer foreach ($n in 1..3) {
  foreach ($s in @(@{ tag = "$n"; arg = "$n/3" }, @{ tag = "$n-riset"; arg = "riset $n/3" })) {
    $done = Join-Path $logDir "produksi-$day-$($s.tag).done"
    if (Test-Path $done) { continue }
    if ($s.tag -eq "$n" -and ($filmRan -or (Test-Path $stop))) { break outer }
    if ($s.tag -eq "$n") { $filmRan = $true }
    $log = Join-Path $logDir "produksi-$stamp-$($s.tag).log"
    $err = Join-Path $logDir "produksi-$stamp-$($s.tag).err.log"
    $p = Start-Process -FilePath $claude -WorkingDirectory $root -NoNewWindow -Wait -PassThru `
      -ArgumentList (@('-p', "`"/produksi-harian $($s.arg)`"", '--dangerously-skip-permissions') + $lean) `
      -RedirectStandardOutput $log -RedirectStandardError $err
    $code = $p.ExitCode

    if ($code -eq 0) { New-Item -ItemType File -Force -Path $done | Out-Null; continue }
    # The session died mid-way, so its lock is stale; left in place it would block the resume for 3 hours.
    if (Test-Path $lock) { Remove-Item $lock }
    if ((Get-Content $log, $err -Raw -ErrorAction SilentlyContinue) -match 'hit your .*limit') {
      Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi tertunda' } `
        -Body "Sesi $($s.arg) kena limit Claude. Lanjut otomatis di jadwal berikutnya (08.10 / 13.20)." | Out-Null
    } else {
      Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi gagal' } `
        -Body "Sesi $($s.arg): Claude keluar dengan kode $code. Log: shorts\log\produksi-$stamp-$($s.tag).log" | Out-Null
    }
    break outer
  }
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
