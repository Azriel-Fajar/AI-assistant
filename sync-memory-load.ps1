# One-click: pull latest from git, then load memory into Claude on THIS machine.
# Run this on the laptop (or any machine) when you sit down to work.
#   .\sync-memory-load.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host "==> git pull" -ForegroundColor Cyan
git pull

Write-Host "==> loading memory into ~/.claude" -ForegroundColor Cyan
& "$PSScriptRoot\sync-memory.ps1" push

Write-Host "Done. Memory loaded for this machine." -ForegroundColor Green
