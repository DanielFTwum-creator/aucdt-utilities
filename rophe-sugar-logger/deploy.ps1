# TUC Project Deployment Script - Rophe Sugar Logger
# Deploys built artifacts to techbridge.edu.gh via Plesk/Ubuntu

param(
    [string]$ProjectName = "rophe-sugar-logger",
    [string]$SubdomainPath = "rophe",
    [string]$Environment = "production",
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/rophe",
    [switch]$Build = $false,
    [switch]$Test = $false,
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# Normalize project name for display
$displayName = "Rophe Sugar Logger"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TUC PROJECT DEPLOYMENT                                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project:      $displayName ($ProjectName)"
Write-Host "Subdomain:    $SubdomainPath"
Write-Host "Remote Host:  $RemoteHost"
Write-Host "Remote Path:  $RemotePath"
Write-Host "Environment:  $Environment"
Write-Host "URL:          https://ai-tools.techbridge.edu.gh/$SubdomainPath"
Write-Host ""

if ($DryRun) {
    Write-Host "⚠️  DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Build if requested
if ($Build) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "Building production bundle..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build complete" -ForegroundColor Green
    Write-Host ""
}

# Test build locally if requested
if ($Test) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "Testing build locally..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "Starting preview server at http://localhost:4173" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Cyan
    Write-Host ""
    pnpm preview
    exit 0
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist/ not found. Run with -Build flag first." -ForegroundColor Red
    exit 1
}

# Check SSH key
$sshKey = "$env:USERPROFILE\.ssh\id_rsa"
if (-not (Test-Path $sshKey)) {
    Write-Host "⚠️  Warning: SSH key not found at $sshKey" -ForegroundColor Yellow
    Write-Host "Ensure you have SSH access configured for: $RemoteHost" -ForegroundColor Yellow
    Write-Host ""
}

# Prepare deployment package
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "Preparing deployment package..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$staging = ".\dist-deploy"

# Create temporary staging directory
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging -Force | Out-Null
Write-Host "Created staging directory: $staging"

# Copy dist files
Copy-Item -Path "dist\*" -Destination $staging -Recurse -Force
Write-Host "Copied dist files"

# Copy .env.example if it exists
if (Test-Path ".env.example") {
    Copy-Item -Path ".env.example" -Destination "$staging\.env.example" -Force
    Write-Host "Copied .env.example"
}

# Create .htaccess for SPA routing
$htaccess = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /$SubdomainPath/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /$SubdomainPath/index.html [QSA,L]
</IfModule>
"@
$htaccess | Set-Content "$staging\.htaccess"
Write-Host "Created .htaccess for SPA routing"

# Create deployment manifest
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$gitBranch = & git branch --show-current 2>$null
if ($LASTEXITCODE -ne 0) { $gitBranch = "unknown" }
$gitCommit = & git rev-parse --short HEAD 2>$null
if ($LASTEXITCODE -ne 0) { $gitCommit = "unknown" }

$manifest = @{
  "ProjectName" = $ProjectName
  "Deployed" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "DeployedBy" = $env:USERNAME
  "Version" = $packageJson.version
  "Branch" = $gitBranch
  "Commit" = $gitCommit
  "Environment" = $Environment
  "URL" = "https://ai-tools.techbridge.edu.gh/$SubdomainPath"
} | ConvertTo-Json

$manifest | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"
Write-Host "Created deployment manifest"

Write-Host "✅ Package ready" -ForegroundColor Green
Write-Host ""

# Deploy via SSH
if (-not $DryRun) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "Deploying to remote server..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

    # Create remote directory
    Write-Host "Creating directory structure..."
    & ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Where-Object { $_ -notmatch "already exists" }

    # Clear old deployment
    Write-Host "Clearing old deployment..."
    & ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true"

    # Deploy files via SCP
    Write-Host "Deploying files via SCP..."
    & scp -r -o StrictHostKeyChecking=no "$staging\*" "$RemoteHost`:$RemotePath/" 2>&1 | Select-Object -First 20

    # Set permissions
    Write-Host "Setting permissions..."
    & ssh -o StrictHostKeyChecking=no $RemoteHost "chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess"

    Write-Host "✅ Deployment complete" -ForegroundColor Green
} else {
    Write-Host "🔍 DRY RUN: Would deploy to:" -ForegroundColor Cyan
    Write-Host "  Host: $RemoteHost"
    Write-Host "  Path: $RemotePath"
    Write-Host "  Files: $(Get-ChildItem -Path $staging -File -Recurse | Measure-Object).Count files"
    Write-Host ""
}

# Cleanup
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item $staging -Recurse -Force
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Summary
$fileCount = (Get-ChildItem -Path "dist" -File -Recurse | Measure-Object).Count
$sizeBytes = (Get-ChildItem -Path "dist" -File -Recurse | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($sizeBytes / 1MB, 2)

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT COMPLETE                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Project:        $displayName"
Write-Host "URL:            https://ai-tools.techbridge.edu.gh/$SubdomainPath"
Write-Host "Files deployed: $fileCount"
Write-Host "Size:           $sizeMB MB"
Write-Host "Deployed at:    $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Verification:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Browser:"
Write-Host "     https://ai-tools.techbridge.edu.gh/$SubdomainPath"
Write-Host ""
Write-Host "  2. Curl:"
Write-Host "     curl -I https://ai-tools.techbridge.edu.gh/$SubdomainPath"
Write-Host ""
Write-Host "  3. Server logs:"
Write-Host "     ssh $RemoteHost 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log'"
Write-Host ""
Write-Host "  4. Clear cache (if needed):"
Write-Host "     Ctrl+Shift+Delete in browser → Clear cached images and files"
Write-Host ""
