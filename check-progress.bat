@echo off
echo ====================================
echo Full Verification Progress Check
echo ====================================
echo.

REM Check if process is running
tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if %errorlevel% equ 0 (
    echo Status: RUNNING
) else (
    echo Status: COMPLETED or NOT STARTED
)

echo.
echo Latest Report:
echo --------------
type FULL-VERIFICATION-REPORT.md 2>nul | find /V "**" | more

echo.
echo Last 20 lines of log:
echo ---------------------
powershell -Command "Get-Content full-verification.log -Tail 20 2>$null"

echo.
echo ====================================
echo Run this script again to check progress
echo ====================================
