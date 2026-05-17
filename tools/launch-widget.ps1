# launch-widget.ps1
# Launches the Rielcode Claude Status Widget in a new Windows Terminal pane.
# Run this script from any PowerShell session.

$widgetPath = "C:\Users\afw14\OneDrive\Documents\JARVIS\tools\claude-widget.py"

# Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python not found in PATH. Install Python 3.10+ and try again." -ForegroundColor Red
    exit 1
}

# Check rich
$richCheck = python -c "import rich" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing 'rich' dependency..." -ForegroundColor Yellow
    pip install rich
}

# Try Windows Terminal split pane (wt.exe)
$wt = Get-Command wt -ErrorAction SilentlyContinue
if ($wt) {
    Write-Host "Launching widget in Windows Terminal split pane..." -ForegroundColor Cyan
    Start-Process wt -ArgumentList "sp -V python `"$widgetPath`""
} else {
    # Fallback: new PowerShell window
    Write-Host "Windows Terminal not found. Opening in new PowerShell window..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit -Command python `"$widgetPath`""
}
