# Impact Ventures Dashboard Deployment Script

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/impact-ventures/",
    [switch]$Build = $false
)

Write-Host "=== IMPACT VENTURES DASHBOARD DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
scp -r -o StrictHostKeyChecking=no dist/. "${RemoteHost}:${RemotePath}"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /impact-ventures/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /impact-ventures/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "[SUCCESS] Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/impact-ventures`n"
