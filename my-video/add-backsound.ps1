# Adds music.mp3 as ducked backsound (18%) under existing voiceover, with 0.3s fade-out at end.
# Overwrites originals in place (launch assets + all referral videos).

$ff    = Join-Path $PSScriptRoot 'node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe'
$probe = Join-Path $PSScriptRoot 'node_modules\@remotion\compositor-win32-x64-msvc\ffprobe.exe'
$music = Join-Path $PSScriptRoot 'public\music.mp3'

if (-not (Test-Path $ff))    { throw "ffmpeg not found: $ff" }
if (-not (Test-Path $music)) { throw "music not found: $music" }
$useProbe = Test-Path $probe

$root = Split-Path $PSScriptRoot -Parent

$targets = @()
$targets += Get-ChildItem (Join-Path $root 'projects\rielcode-growth-plan\launch-assets') -Filter '*.mp4' | Select-Object -ExpandProperty FullName
$targets += Get-ChildItem (Join-Path $PSScriptRoot 'out\referrals') -Recurse -Filter '*.mp4' | Select-Object -ExpandProperty FullName
$targets = $targets | Where-Object { $_ -notmatch '_music\.mp4$' -and $_ -notmatch '\.tmp\.mp4$' }

function Get-Dur($file) {
    if ($useProbe) {
        $d = & $probe -v error -show_entries format=duration -of csv=p=0 $file
        return [double]$d
    }
    $info = & $ff -i $file -hide_banner 2>&1 | Select-String 'Duration: (\d+):(\d+):([\d.]+)'
    $m = $info.Matches[0].Groups
    return [int]$m[1].Value*3600 + [int]$m[2].Value*60 + [double]$m[3].Value
}

$ok = 0; $fail = 0
foreach ($src in $targets) {
    $dur = Get-Dur $src
    $fadeStart = [math]::Max(0, $dur - 0.3)
    # bundled ffmpeg lacks afade; emulate fade-out via volume time-expression
    $vol = "volume='if(gt(t,$fadeStart),0.18*($dur-t)/0.3,0.18)':eval=frame"
    $tmp = [IO.Path]::Combine([IO.Path]::GetDirectoryName($src), [IO.Path]::GetFileNameWithoutExtension($src) + '.tmp.mp4')
    & $ff -y -i $src -stream_loop -1 -i $music `
        -filter_complex "[1:a]$vol[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=0[a]" `
        -map "0:v" -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest $tmp 2>$null
    if ($LASTEXITCODE -eq 0 -and (Test-Path $tmp)) {
        Move-Item -Force $tmp $src
        $ok++; Write-Host "OK   $src"
    } else {
        if (Test-Path $tmp) { Remove-Item -Force $tmp }
        $fail++; Write-Host "FAIL $src" -ForegroundColor Red
    }
}
Write-Host "`nDone. ok=$ok fail=$fail total=$($targets.Count)"
