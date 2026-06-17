# Sync global Claude auto-memory <-> repo (memory/global)
# Usage: .\sync-memory.ps1 push   # repo state -> ~/.claude  (after a git pull on a machine)
#        .\sync-memory.ps1 pull   # ~/.claude -> repo        (before committing)
# Path differs per machine; derived from current repo dir, so works on all 3 machines.

param([Parameter(Mandatory=$true)][ValidateSet('push','pull')][string]$Direction)

$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$repoMem  = Join-Path $repoRoot 'memory\global'

# Encode cwd the way Claude names project dirs: lowercase, drop ':', '\' and '/' -> '-'
$encoded = $repoRoot.ToLower() -replace ':','' -replace '[\\/]','-'
$globalMem = Join-Path $env:USERPROFILE ".claude\projects\$encoded\memory"

if (-not (Test-Path $repoMem))   { New-Item -ItemType Directory -Force -Path $repoMem   | Out-Null }
if (-not (Test-Path $globalMem)) { New-Item -ItemType Directory -Force -Path $globalMem | Out-Null }

if ($Direction -eq 'pull') {
    Copy-Item "$globalMem\*.md" $repoMem -Force
    Write-Host "Pulled global memory -> $repoMem"
} else {
    Copy-Item "$repoMem\*.md" $globalMem -Force
    Write-Host "Pushed repo memory -> $globalMem"
}
