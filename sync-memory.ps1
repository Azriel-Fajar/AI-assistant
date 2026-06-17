# Sync global Claude auto-memory <-> repo (memory/global)
# Usage: .\sync-memory.ps1 push   # repo state -> ~/.claude  (after a git pull on a machine)
#        .\sync-memory.ps1 pull   # ~/.claude -> repo        (before committing)
# Path differs per machine; derived from current repo dir, so works on all 3 machines.

param([Parameter(Mandatory=$true)][ValidateSet('push','pull')][string]$Direction)

$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$repoMem  = Join-Path $repoRoot 'memory\global'

# Claude names project dirs by replacing ':', '\', '/' with '-' (case preserved).
# Match the existing dir by glob first; fall back to constructing the name.
$projects = Join-Path $env:USERPROFILE ".claude\projects"
$encoded  = ($repoRoot -replace '[:\\/]','-')
$found = Get-ChildItem -Path $projects -Directory -ErrorAction SilentlyContinue |
         Where-Object { $_.Name -ieq $encoded } | Select-Object -First 1
$globalMem = if ($found) { Join-Path $found.FullName 'memory' }
             else        { Join-Path $projects "$encoded\memory" }

if (-not (Test-Path $repoMem))   { New-Item -ItemType Directory -Force -Path $repoMem   | Out-Null }
if (-not (Test-Path $globalMem)) { New-Item -ItemType Directory -Force -Path $globalMem | Out-Null }

if ($Direction -eq 'pull') {
    Copy-Item "$globalMem\*.md" $repoMem -Force
    Write-Host "Pulled global memory -> $repoMem"
} else {
    Copy-Item "$repoMem\*.md" $globalMem -Force
    Write-Host "Pushed repo memory -> $globalMem"
}
