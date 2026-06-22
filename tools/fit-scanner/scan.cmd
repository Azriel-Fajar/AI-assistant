@echo off
setlocal EnableDelayedExpansion
REM ================================================================
REM  FIT Competition 2026 - Quarantine Device Scanner (Windows / cmd)
REM  Pure batch. No PowerShell, no ExecutionPolicy, no dependencies.
REM  Detects banned agentic-AI footprints. Writes evidence log only.
REM  Run: double-click scan.cmd  (or run it from a cmd window)
REM ================================================================

REM ---- log dir = folder this script lives in (the flash disk) ----
set "SCRIPTDIR=%~dp0"
if "%SCRIPTDIR:~-1%"=="\" set "SCRIPTDIR=%SCRIPTDIR:~0,-1%"

REM ---- prompt for team name ----
set "TEAM="
set /p "TEAM=Enter team name/number: "
if not defined TEAM set "TEAM=UNKNOWN"
REM sanitize for filename: replace path-breaking chars with underscore
set "TEAMSAFE=%TEAM%"
set "TEAMSAFE=%TEAMSAFE: =_%"
set "TEAMSAFE=%TEAMSAFE:/=_%"
set "TEAMSAFE=%TEAMSAFE:\=_%"
set "TEAMSAFE=%TEAMSAFE:.=_%"
set "TEAMSAFE=%TEAMSAFE:,=_%"
set "TEAMSAFE=%TEAMSAFE:;=_%"

REM ---- metadata ----
set "HOSTN=%COMPUTERNAME%"
set "USERN=%USERNAME%"
set "OSNAME=%OS%"
for /f "tokens=2 delims==" %%v in ('ver') do set "VERLINE=%%v"
set "OSVER=%VERLINE%"

REM ---- timestamp YYYYMMDD-HHMMSS (locale-independent via wmic) ----
set "STAMP="
set "LDT="
for /f "tokens=2 delims==" %%a in ('wmic os get LocalDateTime /value 2^>nul ^| find "="') do set "LDT=%%a"
if defined LDT set "STAMP=!LDT:~0,8!-!LDT:~8,6!"
if not defined STAMP (
  REM fallback: sanitized %DATE%/%TIME% (locale dependent but always works)
  set "RAWD=%DATE%"
  set "RAWT=%TIME%"
  set "RAWD=!RAWD:/=!"
  set "RAWD=!RAWD:-=!"
  set "RAWD=!RAWD: =!"
  set "RAWT=!RAWT::=!"
  set "RAWT=!RAWT:.=!"
  set "RAWT=!RAWT: =0!"
  set "STAMP=!RAWD!-!RAWT:~0,6!"
)

set "LOG=%SCRIPTDIR%\FITscan_%TEAMSAFE%_%HOSTN%_%STAMP%.txt"
set "HUMANTIME=%DATE% %TIME%"

echo Scanning... (team: %TEAM%, host: %HOSTN%)

REM ---- hit counters and temp evidence files ----
set "TMP_A=%TEMP%\fitA_%RANDOM%.tmp"
set "TMP_B=%TEMP%\fitB_%RANDOM%.tmp"
set "TMP_C=%TEMP%\fitC_%RANDOM%.tmp"
set "TMP_D=%TEMP%\fitD_%RANDOM%.tmp"
break>"%TMP_A%"
break>"%TMP_B%"
break>"%TMP_C%"
break>"%TMP_D%"
set /a CNT_A=0, CNT_B=0, CNT_C=0, CNT_D=0

set "UHOME=%USERPROFILE%"

REM ================================================================
REM  A. Home config/state folders
REM ================================================================
call :checkpath "%UHOME%\.claude"                 A
call :checkpath "%UHOME%\.claude.json"            A
call :checkpath "%UHOME%\.codex"                  A
call :checkpath "%UHOME%\.gemini"                 A
call :checkpath "%UHOME%\.aider"                  A
call :checkpath "%UHOME%\.aider.conf.yml"         A
call :checkpath "%UHOME%\.cursor"                 A
call :checkpath "%UHOME%\.cursor-cli"             A
call :checkpath "%UHOME%\.windsurf"               A
call :checkpath "%UHOME%\.codeium"                A
call :checkpath "%UHOME%\.copilot"                A
call :checkpath "%UHOME%\.config\gh-copilot"      A
call :checkpath "%UHOME%\.aws\amazonq"            A
call :checkpath "%UHOME%\.aws\q"                  A
call :checkpath "%UHOME%\.kiro"                   A
call :checkpath "%UHOME%\.openhands"              A
call :checkpath "%UHOME%\.config\goose"           A
call :checkpath "%UHOME%\.plandex-home-v2"        A
call :checkpath "%UHOME%\.plandex"                A
call :checkpath "%UHOME%\.cody"                   A
call :checkpath "%UHOME%\.config\cody"            A
call :checkpath "%UHOME%\.config\zed"             A
call :checkpath "%UHOME%\.local\pipx\venvs\aider"     A
call :checkpath "%UHOME%\.local\pipx\venvs\openhands" A
REM any .aider* file in home (guard against literal no-match pattern)
for %%f in ("%UHOME%\.aider*") do if exist "%%~ff" call :addhit A config "%%~ff"

REM ================================================================
REM  B. CLI binaries (PATH via where + known install dirs)
REM ================================================================
REM collision guard: q / goose only HARD if matching config dir exists
set "QCONF=0"
if exist "%UHOME%\.aws\q\" set "QCONF=1"
if exist "%UHOME%\.aws\amazonq\" set "QCONF=1"
set "GOOSECONF=0"
if exist "%UHOME%\.config\goose\" set "GOOSECONF=1"

for %%n in (claude codex gemini aider cursor-agent windsurf copilot q qchat kiro openhands goose plandex pdx cody) do (
  call :checkbin %%n
)

REM ================================================================
REM  C. IDE agent extensions + agentic IDE installs
REM ================================================================
call :checkext "%UHOME%\.vscode\extensions"
call :checkext "%UHOME%\.cursor\extensions"
call :checkext "%UHOME%\.windsurf\extensions"
REM agentic IDE installs themselves
call :checkpath "%LOCALAPPDATA%\Programs\cursor"   C app-install
call :checkpath "%LOCALAPPDATA%\Programs\Windsurf" C app-install

REM ================================================================
REM  D. Agent-residue files in project dirs (bounded recursion)
REM ================================================================
for %%r in (Desktop Documents projects code dev repos src source) do (
  if exist "%UHOME%\%%r\" call :walkresidue "%UHOME%\%%r"
)

REM ================================================================
REM  Verdict + write log
REM ================================================================
set /a TOTAL=CNT_A+CNT_B+CNT_C+CNT_D
if %TOTAL% EQU 0 (
  set "VERDICT=CLEAN"
) else (
  set "VERDICT=FLAGGED - %TOTAL% item[s], committee review required"
)

REM Build log with plain >> appends (no redirected parens block: that broke
REM type/dumpcat output for some sections). One line group per section.
> "%LOG%" echo ================================================================
>>"%LOG%" echo  FIT COMPETITION 2026 - QUARANTINE DEVICE SCAN
>>"%LOG%" echo ================================================================
>>"%LOG%" echo  Team        : %TEAM%
>>"%LOG%" echo  Hostname    : %HOSTN%
>>"%LOG%" echo  User        : %USERN%
>>"%LOG%" echo  OS          : %OSNAME% %OSVER%
>>"%LOG%" echo  Scan time   : %HUMANTIME%
>>"%LOG%" echo  Scanner     : scan.cmd (pure batch)
>>"%LOG%" echo  VERDICT     : %VERDICT%
>>"%LOG%" echo ================================================================
>>"%LOG%" echo.
call :dumpsec A "A. AGENTIC AI CONFIG/STATE FOLDERS (home dir)" "%TMP_A%" %CNT_A%
call :dumpsec B "B. AGENTIC CLI BINARIES (PATH + install dirs)" "%TMP_B%" %CNT_B%
call :dumpsec C "C. IDE AGENT EXTENSIONS / AGENTIC IDE INSTALLS" "%TMP_C%" %CNT_C%
call :dumpsec D "D. AGENT-RESIDUE FILES (prepared-work evidence in project dirs)" "%TMP_D%" %CNT_D%
>>"%LOG%" echo ================================================================
>>"%LOG%" echo  END OF REPORT - VERDICT: %VERDICT%
>>"%LOG%" echo ================================================================

del "%TMP_A%" "%TMP_B%" "%TMP_C%" "%TMP_D%" >nul 2>&1

echo.
echo VERDICT: %VERDICT%
echo Log written: %LOG%
echo.
pause
endlocal
goto :eof


REM ================================================================
REM  SUBROUTINES
REM ================================================================

REM checkpath "path" CAT [type]   -> hit if file OR dir exists
:checkpath
set "CP_PATH=%~1"
set "CP_CAT=%~2"
set "CP_TYPE=%~3"
if "%CP_TYPE%"=="" set "CP_TYPE=config"
if exist "%CP_PATH%\" (
  call :addhit %CP_CAT% dir "%CP_PATH%"
) else if exist "%CP_PATH%" (
  call :addhit %CP_CAT% file "%CP_PATH%"
)
goto :eof

REM checkbin name  -> uses where + manual dirs; category B
:checkbin
set "BN=%~1"
set "BN_HITSHOWN="
REM PATH lookup
for /f "delims=" %%p in ('where %BN% 2^>nul') do (
  call :binhit "%BN%" "%%p"
)
REM manual install dirs
call :binscan "%BN%" "%APPDATA%\npm"
call :binscan "%BN%" "%UHOME%\.local\bin"
call :binscan "%BN%" "%LOCALAPPDATA%\Programs"
goto :eof

REM binscan name dir  -> check name.{exe,cmd,bat,ps1,<none>} in dir
:binscan
set "BS_N=%~1"
set "BS_D=%~2"
if not exist "%BS_D%\" goto :eof
for %%e in (.exe .cmd .bat .ps1 .) do (
  set "BS_EXT=%%e"
  if "!BS_EXT!"=="." set "BS_EXT="
  if exist "%BS_D%\%BS_N%!BS_EXT!" call :binhit "%BS_N%" "%BS_D%\%BS_N%!BS_EXT!"
)
goto :eof

REM binhit name path -> add with collision tag for q/goose
:binhit
set "BH_N=%~1"
set "BH_P=%~2"
REM dedup: skip if this exact path already recorded this run
set "BH_KEY=%BH_P%"
set "BH_KEY=%BH_KEY:\=_%"
set "BH_KEY=%BH_KEY::=_%"
set "BH_KEY=%BH_KEY:.=_%"
set "BH_KEY=%BH_KEY:-=_%"
set "BH_KEY=%BH_KEY: =_%"
if defined SEEN_%BH_KEY% goto :eof
set "SEEN_%BH_KEY%=1"
set "BH_TAG=binary"
if /i "%BH_N%"=="q" if "%QCONF%"=="0" set "BH_TAG=binary (LOW-CONFIDENCE, name collision)"
if /i "%BH_N%"=="goose" if "%GOOSECONF%"=="0" set "BH_TAG=binary (LOW-CONFIDENCE, name collision)"
call :addhit B "%BH_TAG%" "%BH_P%" "binary '%BH_N%' present"
goto :eof

REM checkext extdir -> scan immediate child folders for banned ext ids
:checkext
set "EX_DIR=%~1"
if not exist "%EX_DIR%\" goto :eof
for /d %%d in ("%EX_DIR%\*") do (
  set "FOLD=%%~nxd"
  call :matchext "%%~fd" "!FOLD!"
)
goto :eof

REM matchext fullpath foldername
:matchext
set "ME_FULL=%~1"
set "ME_NAME=%~2"
for %%i in (anthropic.claude-code github.copilot github.copilot-chat saoudrizwan.claude-dev rooveterinaryinc.roo-cline continue.continue sourcegraph.cody-ai codeium.codeium codeium.windsurf amazonwebservices.amazon-q-vscode google.geminicodeassist googlecloudtools.cloudcode augment.vscode-augment) do (
  echo !ME_NAME! | findstr /b /i /c:"%%i-" /c:"%%i" >nul && (
    call :addhit C extension "%ME_FULL%" "matches banned ext '%%i'"
  )
)
goto :eof

REM walkresidue root  -> dir /s find residue names within depth approx 3
:walkresidue
set "WR_ROOT=%~1"
REM use dir /s /b for the residue filenames; prune handled by name filter.
REM depth bound: count backslashes beyond root and skip if too deep.
for %%t in (".aider.chat.history.md" ".aider.input.history" "CLAUDE.md" "AGENTS.md" ".cursorrules") do (
  for /f "delims=" %%f in ('dir /s /b "%WR_ROOT%\%%~t" 2^>nul') do (
    call :depthok "%WR_ROOT%" "%%f" && call :addhit D residue "%%f"
  )
)
REM residue dirs that require a marker inside
for /f "delims=" %%f in ('dir /s /b /ad "%WR_ROOT%\.cursor" 2^>nul') do (
  if exist "%%f\rules\" call :depthok "%WR_ROOT%" "%%f" && call :addhit D residue "%%f"
)
for /f "delims=" %%f in ('dir /s /b "%WR_ROOT%\.github\copilot-instructions.md" 2^>nul') do (
  call :depthok "%WR_ROOT%" "%%f" && call :addhit D residue "%%f"
)
for %%t in (".continue" ".roo" ".cline" ".codex" ".gemini") do (
  for /f "delims=" %%f in ('dir /s /b /ad "%WR_ROOT%\%%~t" 2^>nul') do (
    call :depthok "%WR_ROOT%" "%%f" && call :addhit D residue "%%f"
  )
)
goto :eof

REM depthok root path -> errorlevel 0 if path is within ~3 levels below root
:depthok
set "DK_ROOT=%~1"
set "DK_PATH=%~f2"
REM strip root prefix
set "DK_REL=!DK_PATH:%DK_ROOT%\=!"
REM count backslashes in relative part
set "DK_COUNT=0"
set "DK_TMP=!DK_REL!"
:depthloop
if "!DK_TMP!"=="!DK_TMP:\=!" goto depthdone
set "DK_TMP=!DK_TMP:*\=!"
set /a DK_COUNT+=1
goto depthloop
:depthdone
if !DK_COUNT! LEQ 3 ( exit /b 0 ) else ( exit /b 1 )

REM addhit CAT TYPE "path" "detail"  -> append evidence line, bump counter
:addhit
set "AH_CAT=%~1"
set "AH_TYPE=%~2"
set "AH_PATH=%~3"
set "AH_DETAIL=%~4"
REM evidence string (use ' - ' separator, never '|', to avoid echo piping)
set "AH_INFO="
if exist "%AH_PATH%\" (
  for %%z in ("%AH_PATH%") do set "AH_INFO=dir - modified %%~tz"
) else (
  if exist "%AH_PATH%" for %%z in ("%AH_PATH%") do set "AH_INFO=file - modified %%~tz - %%~zz bytes"
)
if "%AH_CAT%"=="A" set "AH_FILE=%TMP_A%"
if "%AH_CAT%"=="B" set "AH_FILE=%TMP_B%"
if "%AH_CAT%"=="C" set "AH_FILE=%TMP_C%"
if "%AH_CAT%"=="D" set "AH_FILE=%TMP_D%"
>>"%AH_FILE%" echo   [%AH_TYPE%] %AH_PATH%
if defined AH_DETAIL (
  >>"%AH_FILE%" echo       -- %AH_DETAIL% - !AH_INFO!
) else (
  >>"%AH_FILE%" echo       -- !AH_INFO!
)
if "%AH_CAT%"=="A" set /a CNT_A+=1
if "%AH_CAT%"=="B" set /a CNT_B+=1
if "%AH_CAT%"=="C" set /a CNT_C+=1
if "%AH_CAT%"=="D" set /a CNT_D+=1
goto :eof

REM dumpsec catLetter "title" tmpfile count -> append section to LOG
:dumpsec
set "DS_TITLE=%~2"
set "DS_FILE=%~3"
set "DS_CNT=%~4"
>>"%LOG%" echo ----------------------------------------------------------------
>>"%LOG%" echo %DS_TITLE%
>>"%LOG%" echo ----------------------------------------------------------------
if "%DS_CNT%"=="0" (
  >>"%LOG%" echo   ^(no hits^)
) else (
  type "%DS_FILE%" >>"%LOG%"
)
>>"%LOG%" echo.
goto :eof
