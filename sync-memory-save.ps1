# One-click: capture this machine's memory into repo, commit, push to git.
# Run this before switching machines.
#   .\sync-memory-save.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host "==> pulling memory from ~/.claude into repo" -ForegroundColor Cyan
& "$PSScriptRoot\sync-memory.ps1" pull

Write-Host "==> committing" -ForegroundColor Cyan
git add memory/global
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "No memory changes to commit." -ForegroundColor Yellow
    exit 0
}
git commit -m "Sync global memory ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"
git push
Write-Host "Done. Memory saved and pushed." -ForegroundColor Green
