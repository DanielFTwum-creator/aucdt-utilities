@echo off
REM Capture screenshots with proper build and serve
REM This ensures real application screenshots, not placeholders

setlocal enabledelayedexpansion

echo Starting proper screenshot capture with build...
echo ============================================

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker is running - using Docker gateway method
    set USE_DOCKER=1
) else (
    echo Docker not running - will build and serve individually
    set USE_DOCKER=0
)

set count=0
set success=0
set failed=0

REM Clear log files
type nul > screenshot-capture-failed.log
type nul > screenshot-capture-success.log

REM Get all directories with package.json
for /d %%D in (*) do (
    if exist "%%D\package.json" (
        set /a count+=1
        echo.
        echo [!count!] Processing: %%D

        REM Check if backend-only (has express but no react)
        findstr /C:"\"express\"" "%%D\package.json" >nul 2>&1
        if !errorlevel! equ 0 (
            findstr /C:"\"react\"" "%%D\package.json" >nul 2>&1
            if !errorlevel! neq 0 (
                echo   Skipped: Backend-only service
                echo %%D - Backend-only >> screenshot-capture-failed.log
                set /a failed+=1
                goto :next_app
            )
        )

        REM Create catalogue directory
        if not exist "catalogue\%%D" mkdir "catalogue\%%D"

        if !USE_DOCKER! equ 1 (
            echo   Capturing from Docker gateway...
            npx playwright screenshot "http://localhost:8080/%%D" "catalogue\%%D\screenshot.png" --timeout=10000 >nul 2>&1

            if exist "catalogue\%%D\screenshot.png" (
                echo   Success ^(Docker^): %%D
                echo %%D >> screenshot-capture-success.log
                set /a success+=1
                goto :next_app
            )
        )

        REM Build and serve approach
        echo   Building and serving app...

        cd %%D

        REM Check if already built
        if not exist "dist" (
            echo     Installing dependencies...
            call pnpm install --silent >nul 2>&1
            if errorlevel 1 call npm install --silent >nul 2>&1

            echo     Building...
            call pnpm run build >nul 2>&1
            if errorlevel 1 call npm run build >nul 2>&1

            if not exist "dist" (
                echo   Failed: Build failed
                echo %%D - Build failed >> ..\screenshot-capture-failed.log
                set /a failed+=1
                cd ..
                goto :next_app
            )
        )

        REM Start preview server in background
        echo     Starting preview server...
        start /B cmd /c "pnpm run preview >nul 2>&1"

        REM Wait for server to start
        timeout /t 5 /nobreak >nul

        REM Capture screenshot
        echo     Capturing screenshot...
        npx playwright screenshot "http://localhost:4173" "..\catalogue\%%D\screenshot.png" --timeout=10000 >nul 2>&1

        REM Kill the server
        taskkill /F /IM node.exe /FI "WINDOWTITLE eq Vite*" >nul 2>&1

        cd ..

        if exist "catalogue\%%D\screenshot.png" (
            echo   Success ^(build^): %%D
            echo %%D >> screenshot-capture-success.log
            set /a success+=1
        ) else (
            echo   Failed: Screenshot capture failed
            echo %%D - Capture failed >> screenshot-capture-failed.log
            set /a failed+=1
        )
    )

    :next_app
)

echo.
echo ============================================
echo Summary:
echo   Total processed: !count!
echo   Success: !success!
echo   Failed: !failed!
echo.
echo Logs:
echo   Success: screenshot-capture-success.log
echo   Failed: screenshot-capture-failed.log
echo.
echo Done!

endlocal
