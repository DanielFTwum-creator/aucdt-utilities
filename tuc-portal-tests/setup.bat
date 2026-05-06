@echo off
REM AUCDT Portal Testing Suite - Setup Script for Windows

echo ================================================
echo AUCDT Portal Testing Suite - Setup
echo ================================================
echo.

REM Check Node.js installation
echo Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected
node -v

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [OK] npm detected
npm -v

REM Install dependencies
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully

REM Install Playwright browsers
echo.
echo Installing Playwright browsers...
echo This may take a few minutes...
call npx playwright install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Playwright browsers
    pause
    exit /b 1
)
echo [OK] Playwright browsers installed successfully

REM Create .env file if it doesn't exist
echo.
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo [OK] .env file created
    echo [WARNING] Please edit .env file with your test credentials
) else (
    echo [WARNING] .env file already exists
)

REM Create necessary directories
echo.
echo Creating directories...
if not exist "test-results\screenshots" mkdir "test-results\screenshots"
if not exist "test-results\html-report" mkdir "test-results\html-report"
if not exist "playwright-report" mkdir "playwright-report"
echo [OK] Directories created

REM Display next steps
echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Next Steps:
echo.
echo 1. Configure test credentials:
echo    notepad .env
echo.
echo 2. Run your first test:
echo    npm test
echo.
echo 3. Or run in UI mode:
echo    npm run test:ui
echo.
echo 4. View results:
echo    npm run test:report
echo.
echo For more information, see README.md or QUICKSTART.md
echo.
pause
