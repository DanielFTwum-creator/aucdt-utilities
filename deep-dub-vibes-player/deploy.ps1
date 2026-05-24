# Deep Dub Vibes Player Deployment Script
# Deploys frontend (dist/) to techbridge.edu.gh

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/deep-dub-vibes-player/",
    [switch]$Build = $true
)

Write-Host "=== DEEP DUB VIBES PLAYER DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath"

# Validate .env.local with required OAuth credentials
Write-Host "Validating .env.local..." -ForegroundColor Yellow
if (-not (Test-Path "./.env.local")) {
    Write-Host "Error: .env.local not found in deep-dub-vibes-player!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Write-Host "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] .env.local validated with OAuth credentials"

# Build if requested
if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
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

Write-Host "Creating directory on remote..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p '$RemotePath' && rm -rf '$RemotePath'/* '$RemotePath/.htaccess' 2>/dev/null || true" | Out-Null

Write-Host "Copying frontend files..." -ForegroundColor Yellow
scp -r -o StrictHostKeyChecking=no dist/. "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 20

Write-Host "Copying backend files..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /deep-dub-vibes-player/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3009/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3009/api/$1 [P,L]
  RewriteRule ^ /deep-dub-vibes-player/index.html [QSA,L]
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Write-Host "Copying .env file..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Write-Host "Setting permissions and ownership..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Write-Host "Stopping any existing backend process on port 3009..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3009/tcp || true" | Out-Null

Write-Host "Starting backend server..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && NODE_ENV=production nohup node server.js > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Write-Host "Health checks..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '[OK] Frontend deployed' || echo '[ERROR] Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '[OK] Backend deployed' || echo '[ERROR] Backend missing'"

Write-Host "`n[SUCCESS] Deployment complete!" -ForegroundColor Green
Write-Host "Frontend: https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/"
Write-Host "Backend: Running on port 3009 (internal)`n"
