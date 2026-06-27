<#
.SYNOPSIS
  Detect installed CLI AI tools (npm or native .sh/.ps1 installers) and uninstall
  only the ones found. Global config folders (.claude, .codex, .gemini) are KEPT.

.NOTES
  GUI apps (e.g. Codex desktop) are NOT touched. CLI tools only.

.EXAMPLE
  ./uninstall-ai-clis.ps1            # detect, confirm, uninstall
  ./uninstall-ai-clis.ps1 -DryRun    # show what would be removed, change nothing
  ./uninstall-ai-clis.ps1 -Yes       # skip confirmation
#>
[CmdletBinding()]
param(
  [switch]$Yes,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$userHome = $env:USERPROFILE
$localBin = Join-Path $userHome '.local\bin'

# Known CLI AI tools. ConfigKeep folders are never deleted.
# NativePaths = binaries / install dirs dropped by curl|sh or irm|iex installers.
$Tools = @(
  [pscustomobject]@{
    Name        = 'Claude Code'
    Cmd         = 'claude'
    Npm         = '@anthropic-ai/claude-code'
    ConfigKeep  = (Join-Path $userHome '.claude')
    NativePaths = @(
      (Join-Path $userHome '.claude\local'),
      (Join-Path $localBin 'claude'),
      (Join-Path $localBin 'claude.exe')
    )
  },
  [pscustomobject]@{
    Name        = 'Codex CLI'
    Cmd         = 'codex'
    Npm         = '@openai/codex'
    ConfigKeep  = (Join-Path $userHome '.codex')
    NativePaths = @(
      (Join-Path $localBin 'codex'),
      (Join-Path $localBin 'codex.exe')
    )
  },
  [pscustomobject]@{
    Name        = 'Gemini CLI'
    Cmd         = 'gemini'
    Npm         = '@google/gemini-cli'
    ConfigKeep  = (Join-Path $userHome '.gemini')
    NativePaths = @(
      (Join-Path $localBin 'gemini'),
      (Join-Path $localBin 'gemini.exe')
    )
  }
)

# Snapshot npm global packages once.
$npmList = ''
try { $npmList = (npm ls -g --depth=0 2>$null | Out-String) } catch { $npmList = '' }

function Test-Tool {
  param($Tool)
  $npmHit = $false
  if ($npmList -and ($npmList -match [regex]::Escape($Tool.Npm))) { $npmHit = $true }
  $cmdHit = [bool](Get-Command $Tool.Cmd -ErrorAction SilentlyContinue)
  $nativeHit = @($Tool.NativePaths | Where-Object { Test-Path $_ })
  [pscustomobject]@{
    NpmHit    = $npmHit
    CmdHit    = $cmdHit
    NativeHit = $nativeHit
    Detected  = ($npmHit -or $cmdHit -or ($nativeHit.Count -gt 0))
  }
}

# Detect.
$detected = @()
foreach ($t in $Tools) {
  $r = Test-Tool $t
  if ($r.Detected) { $detected += [pscustomobject]@{ Tool = $t; Result = $r } }
}

if ($detected.Count -eq 0) {
  Write-Host 'No CLI AI tools detected. Nothing to uninstall.' -ForegroundColor Green
  return
}

Write-Host ''
Write-Host 'Detected CLI AI tools:' -ForegroundColor Cyan
foreach ($d in $detected) {
  $via = @()
  if ($d.Result.NpmHit) { $via += 'npm' }
  if ($d.Result.NativeHit.Count -gt 0) { $via += 'native' }
  if ($via.Count -eq 0 -and $d.Result.CmdHit) { $via += 'PATH' }
  Write-Host ("  - {0}  [{1}]" -f $d.Tool.Name, ($via -join ', '))
  Write-Host ("      keep config: {0}" -f $d.Tool.ConfigKeep) -ForegroundColor DarkGray
}
Write-Host ''

if ($DryRun) {
  Write-Host 'DryRun: no changes made.' -ForegroundColor Yellow
  return
}

if (-not $Yes) {
  $ans = Read-Host 'Uninstall the tools listed above? Config folders are kept. (y/N)'
  if ($ans -notmatch '^(y|yes)$') { Write-Host 'Aborted.'; return }
}

foreach ($d in $detected) {
  $t = $d.Tool
  Write-Host ("`n>> {0}" -f $t.Name) -ForegroundColor Cyan

  if ($d.Result.NpmHit) {
    Write-Host ("   npm uninstall -g {0}" -f $t.Npm)
    try { npm uninstall -g $t.Npm | Out-Null; Write-Host '   npm: removed' -ForegroundColor Green }
    catch { Write-Host ("   npm: failed - {0}" -f $_.Exception.Message) -ForegroundColor Red }
  }

  foreach ($p in $t.NativePaths) {
    if (Test-Path $p) {
      # Safety: never delete the config folder itself.
      if ($p -eq $t.ConfigKeep) { continue }
      try { Remove-Item -LiteralPath $p -Recurse -Force; Write-Host ("   removed: {0}" -f $p) -ForegroundColor Green }
      catch { Write-Host ("   skip: {0} - {1}" -f $p, $_.Exception.Message) -ForegroundColor Red }
    }
  }

  Write-Host ("   kept config: {0}" -f $t.ConfigKeep) -ForegroundColor DarkGray
}

Write-Host "`nDone. Config folders preserved. Open a new shell to refresh PATH." -ForegroundColor Green
