# WillPro Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3004) for OAuth token exchange.

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/willpro/",
    [switch]$Build = $true
)

Write-Host "=== WILLPRO DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

Write-Host "Validating .env.local..." -ForegroundColor Yellow
if (-not (Test-Path "./.env.local")) {
    Write-Host "Error: .env.local not found!" -ForegroundColor Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
foreach ($key in @("VITE_GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET")) {
    if ($envContent -notmatch $key) {
        Write-Host "Error: $key missing in .env.local" -ForegroundColor Red
        exit 1
    }
}
Write-Host "OK .env.local validated"

if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm exec vite build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p '$RemotePath' && rm -rf '$RemotePath'/* '$RemotePath'/.htaccess 2>/dev/null || true" | Out-Null

Write-Host "Copying frontend files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\willpro' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Write-Host "Copying backend files..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /willpro/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3004/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /willpro/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Write-Host "Copying .env..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Write-Host "Starting backend server..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3004/tcp 2>/dev/null ; sleep 1 ; cd '$RemotePath' && NODE_ENV=production setsid nohup tsx server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Write-Host "Health checks..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.ts' && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3004' && echo 'OK Port 3004 listening' || echo 'X Port 3004 NOT listening'"

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/willpro/"
Write-Host "Backend port: 3004`n"
