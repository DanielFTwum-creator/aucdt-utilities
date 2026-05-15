# Rophe Sugar Logger Deployment Script
# SCP-based deployment using bash (follows TUC standard pattern)

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $false
)

Write-Host "=== ROPHE SUGAR LOGGER DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

# Build if requested
if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/. $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
$HtaccessLines = @(
  "<IfModule mod_rewrite.c>",
  "  RewriteEngine On",
  "  RewriteBase /glucose/",
  "  RewriteCond %{REQUEST_FILENAME} -f [OR]",
  "  RewriteCond %{REQUEST_FILENAME} -d",
  "  RewriteRule ^ - [L]",
  "  RewriteRule ^ /glucose/index.html [QSA,L]",
  "</IfModule>"
)
$HtaccessCommand = "printf '%s\n' " + (($HtaccessLines | ForEach-Object { "'$_'" }) -join " ") + " > $RemotePath/.htaccess"
ssh -o StrictHostKeyChecking=no $RemoteHost $HtaccessCommand 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/glucose`n"


