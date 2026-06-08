# Install claude-ads + competitive-ads-extractor skills into ~/.claude (Windows)
# Run on any Windows machine: powershell -ExecutionPolicy Bypass -File install-ad-skills.ps1
$ErrorActionPreference = "Stop"
$tmp = Join-Path $env:TEMP "ad-skills-install"
$dest = Join-Path $env:USERPROFILE ".claude"

Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
New-Item -ItemType Directory -Force -Path "$dest\skills" | Out-Null
New-Item -ItemType Directory -Force -Path "$dest\agents" | Out-Null

Write-Host "Cloning repos..."
git clone --depth 1 https://github.com/AgriciDaniel/claude-ads.git "$tmp\claude-ads"
git clone --depth 1 https://github.com/ComposioHQ/awesome-claude-skills.git "$tmp\awesome"

$src = "$tmp\claude-ads"
Write-Host "Installing skills..."
Copy-Item -Recurse -Force "$src\ads" "$dest\skills\ads"
Copy-Item -Recurse -Force "$src\scripts" "$dest\skills\ads\scripts"
Copy-Item -Recurse -Force "$src\skills\*" "$dest\skills\"
Copy-Item -Recurse -Force "$src\agents\*" "$dest\agents\"
Copy-Item -Recurse -Force "$tmp\awesome\competitive-ads-extractor" "$dest\skills\competitive-ads-extractor"

Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
$n = (Get-ChildItem "$dest\skills" -Directory | Where-Object { $_.Name -match "^ads|^competitive" }).Count
Write-Host "Done. $n ad skills installed to $dest\skills"
Write-Host "Set token:  setx META_ACCESS_TOKEN your_token_here"
