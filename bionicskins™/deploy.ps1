# BionicSkins -- Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/skins
# Usage: .\deploy.ps1

param(
    [string]$ProjectName   = "bionicskins",
    [string]$SubdomainPath = "skins",
    [string]$Environment   = "production",
    [string]$RemoteHost    = "root@66.226.72.199",
    [string]$RemotePath    = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/skins",
    [switch]$Build         = $true,
    [switch]$DryRun        = $false
)

$ErrorActionPreference = "Stop"

Write-Host "" -ForegroundColor Cyan
Write-Host "  BionicSkins DEPLOYMENT" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project:      $ProjectName"
Write-Host "Remote Host:  $RemoteHost"
Write-Host "Remote Path:  $RemotePath"
Write-Host "Environment:  $Environment"
Write-Host "URL:          https://ai-tools.techbridge.edu.gh/skins"
Write-Host ""

if ($DryRun) {
    Write-Host "  DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# -- Step 1: Build --
if ($Build) {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "Step 1: Building production frontend..." -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Yellow

    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) { Write-Host " Frontend build failed!" -ForegroundColor Red; exit 1 }
    Write-Host " Frontend build complete" -ForegroundColor Green
    Write-Host ""
}

if (-not (Test-Path "dist")) {
    Write-Host " Error: dist/ not found. Run with -Build flag." -ForegroundColor Red; exit 1
}

# -- Step 2: Staging --
Write-Host "" -ForegroundColor Yellow
Write-Host "Step 2: Preparing deployment staging package..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$staging = ".\dist-deploy"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging -Force | Out-Null
Write-Host "Created staging directory: $staging"

Copy-Item -Path "dist\*" -Destination $staging -Recurse -Force
Write-Host "Copied frontend dist files"

$htaccess = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /skins/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /skins/index.html [QSA,L]
</IfModule>
<FilesMatch "^\.">
  Require all denied
</FilesMatch>
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$">
    ExpiresDefault "access plus 30 days"
  </FilesMatch>
</IfModule>
'@
$htaccess | Set-Content "$staging\.htaccess"
Write-Host "Created .htaccess with dotfile block and SPA routing"

$manifest = @{
    "ProjectName" = $ProjectName
    "Deployed"    = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    "DeployedBy"  = $env:USERNAME
    "Version"     = ((Get-Content "package.json" -Raw) | ConvertFrom-Json).version
    "Environment" = $Environment
    "URL"         = "https://ai-tools.techbridge.edu.gh/skins"
}
$manifest | ConvertTo-Json | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"
Write-Host "Created deployment manifest"
Write-Host " Staging package ready" -ForegroundColor Green
Write-Host ""

if ($DryRun) { Write-Host " DRY RUN: Simulation complete. No changes were made." -ForegroundColor Cyan; exit 0 }

# -- Step 3: Upload --
Write-Host "" -ForegroundColor Yellow
Write-Host "Step 3: Uploading to remote server..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$SSH_OPTS = @("-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3")

Write-Host "Creating remote directory..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath"
Write-Host "Clearing old assets..."
& ssh @SSH_OPTS $RemoteHost "rm -rf $RemotePath/assets $RemotePath/index.html $RemotePath/.htaccess 2>/dev/null; true"
Write-Host "Copying files..."
& scp -r @SSH_OPTS dist-deploy/* "${RemoteHost}:${RemotePath}/"
& scp @SSH_OPTS dist-deploy/.htaccess "${RemoteHost}:${RemotePath}/.htaccess"

Write-Host "Setting permissions..."
& ssh @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath ; chmod -R 755 $RemotePath ; chmod 644 $RemotePath/.htaccess"

Write-Host ""
Write-Host " BionicSkins successfully deployed!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/skins"
Remove-Item $staging -Recurse -Force
Write-Host "Cleaned up staging folder"
