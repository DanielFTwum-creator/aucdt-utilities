# LuxThumb Agent Deployment Script
# Deploys built artifacts to techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb

param(
    [string]$Environment = "production",
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb",
    [switch]$Build = $false,
    [switch]$Test = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=== LUXTHUMB DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote Host: $RemoteHost"
Write-Host "Remote Path: $RemotePath"
Write-Host "Environment: $Environment"
Write-Host ""

# Build if requested
if ($Build) {
    Write-Host "Building production bundle..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Build complete" -ForegroundColor Green
    Write-Host ""
}

# Test build locally if requested
if ($Test) {
    Write-Host "Testing build locally..." -ForegroundColor Yellow
    pnpm preview
    exit 0
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag first." -ForegroundColor Red
    exit 1
}

# Create temporary SSH key file for deployment (if needed)
$sshKey = "$env:USERPROFILE\.ssh\id_rsa"
if (-not (Test-Path $sshKey)) {
    Write-Host "Warning: SSH key not found at $sshKey" -ForegroundColor Yellow
    Write-Host "Ensure you have SSH access configured for: $RemoteHost" -ForegroundColor Yellow
}

# Prepare deployment tarball
Write-Host "Preparing deployment package..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$tarball = "luxthumb-deploy-$timestamp.tar.gz"

# Create temporary staging directory
$staging = ".\dist-deploy"
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging -Force | Out-Null

# Copy dist files
Copy-Item -Path "dist\*" -Destination $staging -Recurse -Force

# Copy supporting files
Copy-Item -Path "nginx.conf" -Destination "$staging\nginx.conf.example" -Force
Copy-Item -Path ".env.example" -Destination "$staging\.env.example" -Force

# Create .htaccess for SPA routing
$htaccess = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /luxthumb/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /luxthumb/index.html [QSA,L]
</IfModule>
"@
$htaccess | Set-Content "$staging\.htaccess"

# Create deployment manifest
$manifest = @{
  "Deployed" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "Version" = (Get-Content "package.json" | ConvertFrom-Json).version
  "Branch" = (git branch --show-current 2>$null) -or "unknown"
  "Commit" = (git rev-parse --short HEAD 2>$null) -or "unknown"
  "Environment" = $Environment
} | ConvertTo-Json
$manifest | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"

Write-Host "✓ Package ready`n"

# Deploy via SSH
Write-Host "Deploying to remote server..." -ForegroundColor Yellow
Write-Host "Host: $RemoteHost"
Write-Host "Path: $RemotePath"
Write-Host ""

$remoteCmd = @"
set -e
echo "Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath"
echo "Deploying files via SCP..."
scp -r -o StrictHostKeyChecking=no $staging/* $RemoteHost`:$RemotePath/
echo "Setting permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess"
echo "✓ Deployment complete"
"@

# Use bash to run SSH commands (more compatible)
bash -c $remoteCmd

# Cleanup
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item $staging -Recurse -Force
Write-Host "✓ Cleanup complete`n"

# Summary
Write-Host "=== DEPLOYMENT COMPLETE ===" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/luxthumb"
Write-Host "Files deployed: $(Get-ChildItem -Path "dist" -File -Recurse).Count"
Write-Host "Size: $([math]::Round((Get-ChildItem -Path "dist" -File -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)) MB"
Write-Host ""

Write-Host "Verification:" -ForegroundColor Cyan
Write-Host "  curl -I https://ai-tools.techbridge.edu.gh/luxthumb"
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify at https://ai-tools.techbridge.edu.gh/luxthumb"
Write-Host "  2. Check server logs: ssh $RemoteHost 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log'"
Write-Host "  3. Configure .env if needed: scp .env.production $RemoteHost`:$RemotePath/.env"
Write-Host ""
