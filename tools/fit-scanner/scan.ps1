<#
  FIT Competition 2026 - Quarantine Device Scanner (Windows)
  Detects banned agentic-AI footprints on a finalist laptop.
  Output: evidence log written next to this script (flash disk). Log-only.
  Run:  powershell -ExecutionPolicy Bypass -File scan.ps1
#>

$ErrorActionPreference = 'Continue'

# Resolve own directory robustly: $PSScriptRoot is empty under some launch
# methods (e.g. right-click Run), which broke Join-Path and crashed the script.
$ScriptDir = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($ScriptDir)) {
    if ($MyInvocation.MyCommand.Path) {
        $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    }
}
if ([string]::IsNullOrWhiteSpace($ScriptDir)) { $ScriptDir = (Get-Location).Path }

# ---------- helpers ----------
$script:Hits = @{ A = @(); B = @(); C = @(); D = @() }
$script:Notes = @()

function Add-Hit {
    param([string]$Cat, [string]$Type, [string]$Path, [string]$Detail)
    $script:Hits[$Cat] += [pscustomobject]@{ Type = $Type; Path = $Path; Detail = $Detail }
}

function Get-ItemEvidence {
    param([string]$Path)
    try {
        $it = Get-Item -LiteralPath $Path -Force -ErrorAction Stop
        $mtime = $it.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')
        if ($it.PSIsContainer) {
            $count = (Get-ChildItem -LiteralPath $Path -Force -ErrorAction SilentlyContinue | Measure-Object).Count
            return "dir  | modified $mtime | $count item(s)"
        } else {
            return "file | modified $mtime | $($it.Length) bytes"
        }
    } catch {
        return "exists | (could not read attributes: $($_.Exception.Message))"
    }
}

try {

# ---------- prompt ----------
$team = Read-Host 'Enter team name/number'
if ([string]::IsNullOrWhiteSpace($team)) { $team = 'UNKNOWN' }
$teamSafe = ($team -replace '[^A-Za-z0-9_\-]', '_')

$start = Get-Date
$hostName = $env:COMPUTERNAME
$userName = $env:USERNAME
$osCaption = (Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue).Caption
if (-not $osCaption) { $osCaption = "Windows ($([System.Environment]::OSVersion.VersionString))" }

$home_ = $env:USERPROFILE
$appdata = $env:APPDATA
$localappdata = $env:LOCALAPPDATA

Write-Host "Scanning... (team: $team, host: $hostName)" -ForegroundColor Cyan

# ---------- A. home config/state folders ----------
$cfgPaths = @(
    "$home_\.claude", "$home_\.claude.json", "$home_\.codex", "$home_\.gemini",
    "$home_\.aider", "$home_\.aider.conf.yml", "$home_\.cursor", "$home_\.cursor-cli",
    "$home_\.windsurf", "$home_\.codeium", "$home_\.copilot", "$home_\.config\gh-copilot",
    "$home_\.aws\amazonq", "$home_\.aws\q", "$home_\.kiro", "$home_\.openhands",
    "$home_\.config\goose", "$home_\.plandex-home-v2", "$home_\.plandex",
    "$home_\.cody", "$home_\.config\cody", "$home_\.config\zed",
    "$home_\.local\pipx\venvs\aider", "$home_\.local\pipx\venvs\openhands"
)
# wildcard for any .aider* file
Get-ChildItem -LiteralPath $home_ -Filter '.aider*' -Force -ErrorAction SilentlyContinue |
    ForEach-Object { $cfgPaths += $_.FullName }

foreach ($p in ($cfgPaths | Select-Object -Unique)) {
    if (Test-Path -LiteralPath $p) {
        Add-Hit 'A' 'config' $p (Get-ItemEvidence $p)
    }
}

# ---------- B. CLI binaries ----------
# dictionary-word collisions: only HARD-confirm if matching config dir exists
$collisionTools = @{
    'q'     = (Test-Path "$home_\.aws\q") -or (Test-Path "$home_\.aws\amazonq")
    'goose' = (Test-Path "$home_\.config\goose")
}
$binNames = @('claude','codex','gemini','aider','cursor-agent','windsurf','copilot',
              'q','qchat','kiro','openhands','goose','plandex','pdx','cody')

$searchDirs = @($localappdata + '\Programs', $appdata + '\npm', "$home_\.local\bin")
# npm global bin (only if npm exists; avoids native-command error on clean boxes)
try {
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        $npmPrefix = (& npm prefix -g 2>$null)
        if ($npmPrefix) { $searchDirs += ($npmPrefix | Out-String).Trim() }
    }
} catch {}

foreach ($name in $binNames) {
    $found = @()
    # PATH lookup
    try {
        Get-Command $name -ErrorAction SilentlyContinue -CommandType Application |
            ForEach-Object { $found += $_.Source }
    } catch {}
    # manual dir glob (top-level of each install dir)
    foreach ($d in ($searchDirs | Select-Object -Unique)) {
        if ($d -and (Test-Path -LiteralPath $d)) {
            foreach ($ext in @('.exe','.cmd','.bat','.ps1','')) {
                $cand = Join-Path $d ($name + $ext)
                if (Test-Path -LiteralPath $cand -PathType Leaf) { $found += $cand }
            }
        }
    }
    $found = $found | Select-Object -Unique
    foreach ($f in $found) {
        $conf = $true
        if ($collisionTools.ContainsKey($name)) { $conf = $collisionTools[$name] }
        $tag = if ($conf) { 'binary' } else { 'binary (LOW-CONFIDENCE, name collision)' }
        Add-Hit 'B' $tag $f "binary '$name' present"
    }
}

# ---------- C. IDE agent extensions ----------
$extRoots = @("$home_\.vscode\extensions", "$home_\.cursor\extensions", "$home_\.windsurf\extensions")
$bannedExt = @('anthropic.claude-code','github.copilot','github.copilot-chat',
    'saoudrizwan.claude-dev','rooveterinaryinc.roo-cline','continue.continue',
    'sourcegraph.cody-ai','codeium.codeium','codeium.windsurf',
    'amazonwebservices.amazon-q-vscode','google.geminicodeassist',
    'googlecloudtools.cloudcode','augment.vscode-augment')

foreach ($root in $extRoots) {
    if (-not (Test-Path -LiteralPath $root)) { continue }
    Get-ChildItem -LiteralPath $root -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $folder = $_.Name
        foreach ($id in $bannedExt) {
            if ($folder -like "$id-*" -or $folder -eq $id) {
                Add-Hit 'C' 'extension' $_.FullName "matches banned ext '$id' | $(Get-ItemEvidence $_.FullName)"
                break
            }
        }
    }
}
# Cursor / Windsurf install itself (built-in agent)
foreach ($appDir in @("$localappdata\Programs\cursor", "$localappdata\Programs\Windsurf", "$home_\.cursor", "$home_\.windsurf")) {
    if (Test-Path -LiteralPath $appDir) {
        Add-Hit 'C' 'app-install' $appDir "agentic IDE install present | $(Get-ItemEvidence $appDir)"
    }
}

# ---------- D. agent-residue files in project dirs ----------
$walkRoots = @("$home_\Desktop", "$home_\Documents", "$home_\projects", "$home_\code",
               "$home_\dev", "$home_\repos", "$home_\src", "$home_\source")
$residueNames = @('.aider.chat.history.md','.aider.input.history','CLAUDE.md','AGENTS.md',
    '.cursorrules','.cursor','.github','.continue','.roo','.cline','.codex','.gemini')
$maxDepth = 3

function Walk-Residue {
    param([string]$Base, [int]$Depth)
    if ($Depth -gt $maxDepth) { return }
    $children = $null
    try { $children = Get-ChildItem -LiteralPath $Base -Force -ErrorAction Stop } catch {
        $script:Notes += "permission/skip: $Base ($($_.Exception.Message))"; return
    }
    foreach ($c in $children) {
        $nm = $c.Name
        if ($residueNames -contains $nm) {
            # refine: .cursor only counts if it has rules/, .github only if copilot-instructions
            $report = $true
            if ($nm -eq '.cursor' -and -not (Test-Path -LiteralPath "$($c.FullName)\rules")) { $report = $false }
            if ($nm -eq '.github' -and -not (Test-Path -LiteralPath "$($c.FullName)\copilot-instructions.md")) { $report = $false }
            if ($report) {
                Add-Hit 'D' 'residue' $c.FullName (Get-ItemEvidence $c.FullName)
            }
        }
        if ($c.PSIsContainer -and $nm -notmatch '^(node_modules|\.git|vendor|venv|\.venv|__pycache__)$') {
            # Skip reparse points (symlinks/junctions, e.g. OneDrive) to avoid
            # recursion loops that overflow the stack and crash the scanner.
            $isReparse = ($c.Attributes -band [System.IO.FileAttributes]::ReparsePoint)
            if (-not $isReparse) {
                Walk-Residue $c.FullName ($Depth + 1)
            }
        }
    }
}

foreach ($r in ($walkRoots | Select-Object -Unique)) {
    if (Test-Path -LiteralPath $r) { Walk-Residue $r 1 }
}

# ---------- build log ----------
$end = Get-Date
$dur = [math]::Round(($end - $start).TotalSeconds, 1)
$total = ($script:Hits.A.Count + $script:Hits.B.Count + $script:Hits.C.Count + $script:Hits.D.Count)
$verdict = if ($total -eq 0) { 'CLEAN' } else { "FLAGGED - $total item(s), committee review required" }

$sb = New-Object System.Text.StringBuilder
function W([string]$s) { [void]$script:sb.AppendLine($s) }

W '================================================================'
W ' FIT COMPETITION 2026 - QUARANTINE DEVICE SCAN'
W '================================================================'
W " Team        : $team"
W " Hostname    : $hostName"
W " User        : $userName"
W " OS          : $osCaption"
W " Scan start  : $($start.ToString('yyyy-MM-dd HH:mm:ss'))"
W " Duration    : $dur s"
W " VERDICT     : $verdict"
W '================================================================'
W ''

$catTitles = [ordered]@{
    A = 'A. AGENTIC AI CONFIG/STATE FOLDERS (home dir)'
    B = 'B. AGENTIC CLI BINARIES (PATH + install dirs)'
    C = 'C. IDE AGENT EXTENSIONS / AGENTIC IDE INSTALLS'
    D = 'D. AGENT-RESIDUE FILES (prepared-work evidence in project dirs)'
}
foreach ($cat in $catTitles.Keys) {
    W '----------------------------------------------------------------'
    W $catTitles[$cat]
    W '----------------------------------------------------------------'
    if ($script:Hits[$cat].Count -eq 0) {
        W '  (no hits)'
    } else {
        foreach ($h in $script:Hits[$cat]) {
            W "  [$($h.Type)] $($h.Path)"
            W "      -> $($h.Detail)"
        }
    }
    W ''
}

if ($script:Notes.Count -gt 0) {
    W '----------------------------------------------------------------'
    W 'SCAN NOTES (skipped paths / permission errors)'
    W '----------------------------------------------------------------'
    foreach ($n in $script:Notes) { W "  - $n" }
    W ''
}

W '================================================================'
W " END OF REPORT - VERDICT: $verdict"
W '================================================================'

# ---------- write log (UTF-8 no BOM) next to script ----------
$stamp = $start.ToString('yyyyMMdd-HHmmss')
$logName = "FITscan_${teamSafe}_${hostName}_${stamp}.txt"
$logPath = Join-Path $ScriptDir $logName
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($logPath, $sb.ToString(), $utf8NoBom)

Write-Host ''
Write-Host "VERDICT: $verdict" -ForegroundColor $(if ($total -eq 0) { 'Green' } else { 'Red' })
Write-Host "Log written: $logPath" -ForegroundColor Cyan

}
catch {
    # Capture any unhandled error so the committee can see why a device failed,
    # instead of the window silently force-closing.
    $errText = @"
================================================================
 FIT SCANNER - CRASH REPORT
================================================================
 Time    : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
 Host     : $env:COMPUTERNAME
 PSVersion: $($PSVersionTable.PSVersion)
----------------------------------------------------------------
 ERROR  : $($_.Exception.Message)
 AT      : $($_.InvocationInfo.PositionMessage)
 TYPE    : $($_.Exception.GetType().FullName)
----------------------------------------------------------------
$($_.ScriptStackTrace)
================================================================
"@
    Write-Host ''
    Write-Host 'SCANNER CRASHED - see details below and CRASH log on the flash disk:' -ForegroundColor Red
    Write-Host $errText -ForegroundColor Yellow
    try {
        $crashPath = Join-Path $ScriptDir ("FITscan_CRASH_{0}_{1}.txt" -f $env:COMPUTERNAME, (Get-Date -Format 'yyyyMMdd-HHmmss'))
        [System.IO.File]::WriteAllText($crashPath, $errText, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Crash log written: $crashPath" -ForegroundColor Cyan
    } catch {
        Write-Host "Could not write crash log: $($_.Exception.Message)" -ForegroundColor Red
    }
}
finally {
    # Keep window open so the committee can read the result even on
    # right-click 'Run with PowerShell' (which auto-closes on exit).
    Write-Host ''
    try { Read-Host 'Press Enter to close' | Out-Null } catch {}
}
