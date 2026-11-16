# Started every Sunday 09:00 by Task Scheduler ("Sekitar Analisis Mingguan"). Runs analisis-mingguan headless in one session.
# Lives in <JARVIS>\.claude\skills\analisis-mingguan, so JARVIS is three folders up: no username or drive hardcoded.
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$shorts = Join-Path $root 'shorts'
$logDir = Join-Path $shorts 'log'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'

# Wait (up to 2 hours) while a production session holds its lock, so the two never edit the skill files at once.
$lock = Join-Path $shorts '.produksi.lock'
$until = (Get-Date).AddHours(2)
while ((Test-Path $lock) -and (Get-Item $lock).LastWriteTime -gt (Get-Date).AddHours(-3) -and (Get-Date) -lt $until) { Start-Sleep -Seconds 300 }

$env:PYTHONIOENCODING = 'utf-8'
$env:CLAUDE_CODE_DISABLE_CLAUDE_MDS = '1'
$env:CLAUDE_CODE_DISABLE_BUNDLED_SKILLS = '1'

$claude = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
if (-not (Test-Path $claude)) { $claude = (Get-Command claude -ErrorAction SilentlyContinue).Source }

# Same lean headless mode as produksi-harian: project settings only, no plugins, hooks or MCP servers.
$ph = Join-Path $PSScriptRoot '..\produksi-harian'
$lean = '--setting-sources', 'project,local', '--settings', "`"$ph\headless-settings.json`"",
  '--strict-mcp-config', '--mcp-config', "`"$ph\headless-mcp.json`"",
  '--append-system-prompt-file', "`"$PSScriptRoot\headless-context.md`""

$log = Join-Path $logDir "analisis-$stamp.log"
$err = Join-Path $logDir "analisis-$stamp.err.log"
$prompt = 'Read ../.claude/skills/analisis-mingguan/SKILL.md and follow it.'
$p = Start-Process -FilePath $claude -WorkingDirectory $shorts -NoNewWindow -Wait -PassThru `
  -ArgumentList (@('-p', "`"$prompt`"", '--dangerously-skip-permissions') + $lean) `
  -RedirectStandardOutput $log -RedirectStandardError $err
if ($p.ExitCode -ne 0) {
  $why = if ((Get-Content $log, $err -Raw -ErrorAction SilentlyContinue) -match 'hit your .*limit') { 'kena limit Claude' } else { "Claude keluar dengan kode $($p.ExitCode)" }
  Invoke-RestMethod -Uri 'https://ntfy.sh/JARVIS' -Method Post -Headers @{ Title = 'Analisis gagal' } `
    -Body "Analisis mingguan: $why. Log: shorts\log\analisis-$stamp.log" | Out-Null
}
exit $p.ExitCode
