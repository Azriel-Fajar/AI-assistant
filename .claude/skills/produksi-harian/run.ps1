# Started daily by Task Scheduler ("Sekitar Produksi Harian"). Runs /produksi-harian headless and keeps a log.
# Lives in <JARVIS>\.claude\skills\produksi-harian, so JARVIS is three folders up: no username or drive hardcoded.
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$logDir = Join-Path $root 'shorts\log'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$log = Join-Path $logDir "produksi-$stamp.log"
$err = Join-Path $logDir "produksi-$stamp.err.log"

$env:GEMINI_API_KEY = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')
$env:PYTHONIOENCODING = 'utf-8'

$claude = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
if (-not (Test-Path $claude)) { $claude = (Get-Command claude -ErrorAction SilentlyContinue).Source }

$p = Start-Process -FilePath $claude -WorkingDirectory $root -NoNewWindow -Wait -PassThru `
  -ArgumentList '-p', '"/produksi-harian"', '--dangerously-skip-permissions' `
  -RedirectStandardOutput $log -RedirectStandardError $err

if ($p.ExitCode -ne 0) {
  Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Produksi gagal' } `
    -Body "Claude keluar dengan kode $($p.ExitCode). Log: shorts\log\produksi-$stamp.log" | Out-Null
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
exit $p.ExitCode
