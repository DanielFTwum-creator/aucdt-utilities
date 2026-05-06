# UMaT Tracker Deployment Script (PowerShell)
# Usage: .\deploy.ps1 -ServerHost "root@66.226.72.199" -RemotePath "/var/www/vhosts/ai-tools.techbridge.edu.gh/umat"

param(
    [string]$ServerHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/ai-tools.techbridge.edu.gh/umat",
    [switch]$SkipBuild = $false
)

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "UMaT Tracker Deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Server: $ServerHost"
Write-Host "Remote path: $RemotePath"
Write-Host ""

# Check if dist directory exists
$LocalBuildDir = ".\dist"
if (-not (Test-Path $LocalBuildDir) -or -not $SkipBuild) {
    Write-Host "📦 Building the application..." -ForegroundColor Yellow
    & pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📤 Uploading to server..." -ForegroundColor Yellow
Write-Host ""

# Upload using WinSCP or scp
try {
    # Try using scp first (requires OpenSSH or Git Bash)
    $files = Get-ChildItem $LocalBuildDir -Recurse
    $totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1MB

    Write-Host "Files to upload: $($files.Count)"
    Write-Host "Total size: $([Math]::Round($totalSize, 2)) MB"
    Write-Host ""

    # Execute SCP
    & scp -r "$LocalBuildDir\*" "$ServerHost:$RemotePath/"

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "======================================" -ForegroundColor Green
        Write-Host "✅ Deployment Complete!" -ForegroundColor Green
        Write-Host "======================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access the app at:" -ForegroundColor Cyan
        Write-Host "  https://ai-tools.techbridge.edu.gh/umat/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To verify deployment, run:" -ForegroundColor Cyan
        Write-Host "  ssh $ServerHost 'ls -lh $RemotePath/'" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Note: This script requires scp to be available in your PATH." -ForegroundColor Yellow
    Write-Host "Install OpenSSH for Windows or use Git Bash." -ForegroundColor Yellow
    exit 1
}
