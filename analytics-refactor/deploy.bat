@echo off
REM Advanced Analytics Dashboard - Automated Deployment Script (Windows)
REM Version: 2.5.1
REM Author: TECHBRIDGE University College ICT Department

setlocal enabledelayedexpansion

echo ========================================
echo   Advanced Analytics Dashboard
echo   Automated Deployment Script v2.5.1
echo ========================================
echo.

REM Step 1: Clean previous builds
echo [1/6] Cleaning previous builds...
if exist "build" (
    rmdir /s /q build
    echo [OK] Build directory cleaned
) else (
    echo [INFO] No previous build found
)

REM Step 2: Clean caches
echo [2/6] Cleaning caches...
if exist "node_modules\.cache" (
    rmdir /s /q node_modules\.cache
    echo [OK] Node modules cache cleaned
)
if exist ".cache" (
    rmdir /s /q .cache
    echo [OK] Project cache cleaned
)

REM Step 3: Verify configuration
echo [3/6] Verifying configuration...
findstr /C:"\"homepage\": \".\"" package.json >nul
if !errorlevel! equ 0 (
    echo [OK] Homepage setting correct (relative paths)
) else (
    echo [WARNING] homepage field not found in package.json
    echo [INFO] Add: "homepage": "." to package.json
    set /p continue="Continue anyway? (y/n): "
    if /i not "!continue!"=="y" exit /b 1
)

REM Step 4: Build application
echo [4/6] Building application...
where pnpm >nul 2>nul
if !errorlevel! equ 0 (
    echo [INFO] Using pnpm...
    call pnpm build
) else (
    where npm >nul 2>nul
    if !errorlevel! equ 0 (
        echo [INFO] Using npm...
        call npm run build
    ) else (
        echo [ERROR] Neither pnpm nor npm found!
        exit /b 1
    )
)
if !errorlevel! neq 0 (
    echo [ERROR] Build failed!
    exit /b 1
)
echo [OK] Build completed successfully

REM Step 5: Verify build output
echo [5/6] Verifying build output...
if not exist "build" (
    echo [ERROR] Build directory not found!
    exit /b 1
)
if not exist "build\index.html" (
    echo [ERROR] index.html not found in build!
    exit /b 1
)

REM Check for relative paths
findstr /C:"src=\"./" build\index.html >nul
if !errorlevel! equ 0 (
    findstr /C:"href=\"./" build\index.html >nul
    if !errorlevel! equ 0 (
        echo [OK] Relative paths verified in index.html
    )
) else (
    echo [WARNING] Absolute paths detected in index.html
    echo [INFO] This may cause issues when deploying to subdirectories
)

REM Step 6: Create deployment archive
echo [6/6] Creating deployment archive...
set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set ARCHIVE_NAME=analytics-dashboard-%TIMESTAMP%.zip

REM Check if PowerShell is available for compression
where powershell >nul 2>nul
if !errorlevel! equ 0 (
    powershell -command "Compress-Archive -Path build\* -DestinationPath %ARCHIVE_NAME% -Force"
    echo [OK] Archive created: %ARCHIVE_NAME%
) else (
    echo [WARNING] PowerShell not found. Archive creation skipped.
    echo [INFO] Manually zip the 'build' folder contents
)

REM Summary
echo.
echo ========================================
echo        DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Archive: %ARCHIVE_NAME%
echo Build Dir: build\
echo.
echo Next Steps:
echo   1. Upload %ARCHIVE_NAME% to your server
echo   2. Extract to your web directory
echo   3. Access via browser
echo.
echo Example Commands:
echo   # Local testing:
echo   npx serve -s build
echo.
echo   # Or use Python:
echo   cd build
echo   python -m http.server 3000
echo.
echo Ready for deployment!
echo.

pause
