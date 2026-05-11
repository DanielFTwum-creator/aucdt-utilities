@echo off
setlocal EnableDelayedExpansion

echo ============================================================
echo  Techbridge University College - aucdt-utilities Cleanup
echo  Removes: node_modules, dist, build, .vite, pnpm-lock.yaml
echo ============================================================
echo.

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

:: Count before
set /a total=0
set /a cleaned=0

echo [1/5] Scanning for node_modules folders...
for /d /r "%ROOT%" %%d in (node_modules) do (
    if exist "%%d" (
        set /a total+=1
    )
)
echo       Found !total! node_modules directories.
echo.

echo [2/5] Removing node_modules...
for /d /r "%ROOT%" %%d in (node_modules) do (
    if exist "%%d" (
        echo   Removing: %%d
        rd /s /q "%%d" 2>nul
        set /a cleaned+=1
    )
)
echo       Done. Removed !cleaned! node_modules directories.
echo.

echo [3/5] Removing dist folders...
set /a distCount=0
for /d /r "%ROOT%" %%d in (dist) do (
    if exist "%%d" (
        echo   Removing: %%d
        rd /s /q "%%d" 2>nul
        set /a distCount+=1
    )
)
echo       Done. Removed !distCount! dist directories.
echo.

echo [4/5] Removing build folders...
set /a buildCount=0
for /d /r "%ROOT%" %%d in (build) do (
    if exist "%%d" (
        echo   Removing: %%d
        rd /s /q "%%d" 2>nul
        set /a buildCount+=1
    )
)
echo       Done. Removed !buildCount! build directories.
echo.

echo [5/5] Removing .vite cache folders...
set /a viteCount=0
for /d /r "%ROOT%" %%d in (.vite) do (
    if exist "%%d" (
        echo   Removing: %%d
        rd /s /q "%%d" 2>nul
        set /a viteCount+=1
    )
)
echo       Done. Removed !viteCount! .vite directories.
echo.

echo ============================================================
echo  Cleanup complete!
echo  - node_modules removed: !cleaned!
echo  - dist removed:         !distCount!
echo  - build removed:        !buildCount!
echo  - .vite cache removed:  !viteCount!
echo.
echo  To reinstall a project:
echo    cd ^<project-name^>
echo    pnpm install
echo ============================================================
echo.
pause
