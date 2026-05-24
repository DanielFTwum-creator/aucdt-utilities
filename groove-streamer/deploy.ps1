# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Write-Host "=== GROOVE STREAMER DEPLOYMENT ===" -ForegroundColor Cyan
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Write-Host "Copying frontend files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Write-Host "Copying backend files..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Write-Host "Starting backend server..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Write-Host "Health checks..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Write-Host "Backend running on port 3004 (internal)`n"
