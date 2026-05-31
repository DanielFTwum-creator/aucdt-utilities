# Dictation App - Cypress Test Runner
# This script runs all Cypress tests and saves output to a file

param(
    [string]$Mode = "headless"  # "headless" or "open"
)

Write-Host "=== Dictation App Cypress Tests ===" -ForegroundColor Cyan
Write-Host "Mode: $Mode`n"

# Check if pnpm is available
try {
    $pnpmVersion = pnpm --version
    Write-Host "pnpm version: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: pnpm not found. Install with: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# Check if Cypress is installed
if (!(Test-Path "node_modules/.bin/cypress")) {
    Write-Host "Installing Cypress..." -ForegroundColor Yellow
    pnpm add -D cypress
}

# Start dev server in background
Write-Host "Starting dev server on http://localhost:5173..." -ForegroundColor Yellow
$devProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c pnpm dev" -WindowStyle Hidden -PassThru

# Wait for dev server to start
Start-Sleep -Seconds 5

# Run tests
Write-Host "Running Cypress tests..." -ForegroundColor Yellow
if ($Mode -eq "open") {
    # Interactive GUI mode
    pnpm exec cypress open
} else {
    # Headless mode
    pnpm exec cypress run --reporter spec 2>&1 | Tee-Object -FilePath "test-results.txt"
}

$testExitCode = $LASTEXITCODE

# Kill dev server
Write-Host "Cleaning up dev server..." -ForegroundColor Yellow
Stop-Process -InputObject $devProcess -Force -ErrorAction SilentlyContinue

# Report results
Write-Host "`n=== Test Run Complete ===" -ForegroundColor Cyan
if ($testExitCode -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed (exit code: $testExitCode)" -ForegroundColor Red
    Write-Host "Check test-results.txt for details"
}

exit $testExitCode
