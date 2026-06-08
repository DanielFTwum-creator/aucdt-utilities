# TUC-WMS — local dev runner (PowerShell).
# Loads backend\.env into this process and starts the Spring Boot backend on 8081
# with H2 (zero external deps). Run the frontend separately (see below).
#
#   Backend : .\run-dev.ps1
#   Frontend: cd frontend; pnpm install; pnpm dev   (serves http://localhost:5174)
#
# Prereq (one-time, only you can do it): add this redirect URI to the shared
# BiochemAI Google OAuth client in Google Cloud Console:
#   http://localhost:5174/api/auth/google/callback

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$envFile = Join-Path $root 'backend\.env'

if (-not (Test-Path $envFile)) {
    Write-Host "No backend\.env found." -ForegroundColor Yellow
    Write-Host "Copy backend\.env.local.example to backend\.env and paste the shared client id/secret." -ForegroundColor Yellow
    exit 1
}

# Load KEY=VALUE lines into the current process environment.
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
        $i = $line.IndexOf('=')
        $k = $line.Substring(0, $i).Trim()
        $v = $line.Substring($i + 1).Trim()
        Set-Item -Path "Env:$k" -Value $v
    }
}

Write-Host "Backend starting on http://localhost:$($env:PORT) (H2, no external deps)" -ForegroundColor Green
Write-Host "Redirect URI in use: $($env:GOOGLE_REDIRECT_URI)" -ForegroundColor Cyan

mvn -f (Join-Path $root 'backend\pom.xml') spring-boot:run
