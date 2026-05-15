# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Write-Host "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red; exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"


