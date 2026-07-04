# Pattern 24 — built-SPA bundle guard (PowerShell twin of verify-dist.sh).
# Usage: powershell -File C:\Development\github\aucdt-utilities\scripts\Verify-Dist.ps1 -AppPath C:\Development\github\aucdt-utilities\<app>
param([Parameter(Mandatory = $true)][string]$AppPath)
$index = Join-Path $AppPath "dist/index.html"
if (-not (Test-Path $index)) { $index = Join-Path $AppPath "index.html" }
if (-not (Test-Path $index)) { Write-Host "[FATAL] no dist/index.html under $AppPath - build first" -ForegroundColor Red; exit 1 }
if (Select-String -Path $index -Pattern '<script[^>]+(src="[^"]*\.js"|type="module")' -Quiet) {
    Write-Host "[OK] $index references a JS bundle" -ForegroundColor Green
} else {
    Write-Host "[FATAL] $index ships no JS bundle (missing module entry in the source index.html)" -ForegroundColor Red; exit 1
}
