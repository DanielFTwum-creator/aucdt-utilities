@echo off
REM ============================================================================
REM Techbridge University College - Docker Gateway Screenshot Capture
REM ============================================================================
REM This script captures screenshots from Docker gateway and validates all containers
REM ============================================================================

echo.
echo ============================================================
echo   TUC Docker Gateway Screenshot Capture and Validation
echo ============================================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo.
    echo Please start Docker first:
    echo   docker-compose -f docker-compose-all-apps.yml up -d
    echo.
    pause
    exit /b 1
)

echo Docker is running...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 20.x LTS
    pause
    exit /b 1
)

echo Node.js is available...
echo.

REM Check if Playwright is installed
if not exist "node_modules\playwright" (
    echo Installing Playwright...
    npm install playwright
    echo.
)

echo Starting screenshot capture...
echo.

REM Run the Node.js script
node capture-docker-gateway.js

echo.
echo ============================================================
echo   Capture Complete!
echo ============================================================
echo.
echo Check these files for results:
echo   - docker-validation-success.log (successful captures)
echo   - docker-validation-failed.log (failed captures)
echo   - backend-apis.log (backend APIs - no UI)
echo.
echo Screenshots saved to: catalogue\^<app-name^>\screenshot.png
echo.
pause
