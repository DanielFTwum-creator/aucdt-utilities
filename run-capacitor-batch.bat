@echo off
REM Capacitor Batch Setup Script (Windows Batch)
REM Runs capacitor-setup-batch.ps1 with proper error handling
REM
REM USAGE:
REM   run-capacitor-batch.bat capacitor-projects-example.csv
REM   run-capacitor-batch.bat projects.csv --skip-build --skip-commit
REM
REM REQUIREMENTS:
REM   - PowerShell 5.1+ (built into Windows 10+)
REM   - capacitor-setup-batch.ps1 in same directory
REM   - Project CSV or JSON file

setlocal enabledelayedexpansion

if "%~1"=="" (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║     Capacitor Batch Setup for TUC React Projects              ║
    echo ║     Windows Batch Runner                                      ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo USAGE:
    echo   run-capacitor-batch.bat PROJECT-FILE [OPTIONS]
    echo.
    echo EXAMPLES:
    echo   run-capacitor-batch.bat capacitor-projects-example.csv
    echo   run-capacitor-batch.bat projects.csv --skip-build
    echo   run-capacitor-batch.bat projects.json --skip-commit
    echo.
    echo OPTIONS:
    echo   --skip-build     Skip web bundle builds
    echo   --skip-commit    Don't commit changes
    echo   --continue-error Continue if one project fails
    echo.
    echo FEATURES:
    echo   ✓ Runs PowerShell script with proper permissions
    echo   ✓ Displays progress and results
    echo   ✓ Logs errors to batch-setup.log
    echo   ✓ Shows colorized output
    echo.
    echo ESTIMATED TIME:
    echo   - 5 projects: 15-25 minutes
    echo   - 10 projects: 30-50 minutes
    echo   - 50 projects: 2.5-4 hours
    echo.
    exit /b 1
)

setlocal enabledelayedexpansion

set "PROJECTS_FILE=%~1"
set "PS_SCRIPT=%~dp0capacitor-setup-batch.ps1"
set "LOG_FILE=%~dp0batch-setup.log"
set "TIMESTAMP=%date:~-4%-%date:~-10,2%-%date:~-7,2% %time%"

if not exist "%PROJECTS_FILE%" (
    echo ❌ Error: Projects file not found: %PROJECTS_FILE%
    exit /b 1
)

if not exist "%PS_SCRIPT%" (
    echo ❌ Error: Setup script not found: %PS_SCRIPT%
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         Capacitor Batch Setup - Starting                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Projects file: %PROJECTS_FILE%
echo Setup script:  %PS_SCRIPT%
echo Log file:      %LOG_FILE%
echo Timestamp:     %TIMESTAMP%
echo.

REM Build PowerShell arguments
set "PS_ARGS=-NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -ProjectsFile "%PROJECTS_FILE%""

REM Add optional parameters if provided
shift
:parse_args
if not "%~1"=="" (
    if "%~1"=="--skip-build" (
        set "PS_ARGS=!PS_ARGS! -SkipBuild"
        echo ✓ Skip build: enabled
    )
    if "%~1"=="--skip-commit" (
        set "PS_ARGS=!PS_ARGS! -SkipCommit"
        echo ✓ Skip commit: enabled
    )
    if "%~1"=="--continue-error" (
        set "PS_ARGS=!PS_ARGS! -ContinueOnError"
        echo ✓ Continue on error: enabled
    )
    shift
    goto parse_args
)

echo.
echo Running: powershell %PS_ARGS%
echo.

REM Run PowerShell script with output to both console and log file
powershell %PS_ARGS% 2>&1 | tee %LOG_FILE%

REM Check exit code
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║              ✅ Batch Setup Complete                          ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo Log saved to: %LOG_FILE%
    echo.
    exit /b 0
) else (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║              ❌ Batch Setup Failed                            ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo Exit code: %ERRORLEVEL%
    echo Log saved to: %LOG_FILE%
    echo.
    exit /b 1
)
