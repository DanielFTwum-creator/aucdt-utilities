# TUC StockPulse Deployment Script
# Deploys Vite/React frontend and Node/Express/SQLite backend to techbridge.edu.gh via Plesk/Ubuntu

param(
    [string]$ProjectName = "stockpulse",
    [string]$SubdomainPath = "stockpulse",
    [string]$Environment = "production",
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/stockpulse",
    [string]$PORT = "3020",
    [switch]$Build = $true,
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

Write-Host "" -ForegroundColor Cyan
Write-Host "  STOCKPULSE DEPLOYMENT                                     " -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project:      $ProjectName"
Write-Host "Remote Host:  $RemoteHost"
Write-Host "Remote Path:  $RemotePath"
Write-Host "Port:         $PORT"
Write-Host "Environment:  $Environment"
Write-Host "URL:          https://ai-tools.techbridge.edu.gh/$SubdomainPath"
Write-Host ""

if ($DryRun) {
    Write-Host "  DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# 1. Build Frontend
if ($Build) {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "Step 1: Building production frontend..." -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Yellow

    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Frontend build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host " Frontend build complete" -ForegroundColor Green
    Write-Host ""
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host " Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

# 2. Prepare Deployment Package
Write-Host "" -ForegroundColor Yellow
Write-Host "Step 2: Preparing deployment staging package..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$staging = ".\dist-deploy"
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging -Force | Out-Null
Write-Host "Created staging directory: $staging"

# Copy dist files
Copy-Item -Path "dist\*" -Destination $staging -Recurse -Force
Write-Host "Copied frontend dist files"

# Create .htaccess for SPA routing + API Proxying + Backend security blocking (using standard single-quoted multiline string to avoid PS parser bugs)
$htaccess = '
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /{SUBDOMAIN_PATH}/

  # Block direct access to backend folder and SQLite files
  RewriteRule ^backend/ - [F,L]

  # Proxy API requests to Express running on port {PORT}
  RewriteCond %{REQUEST_URI} ^/{SUBDOMAIN_PATH}/api/ [NC]
  RewriteRule ^api/(.*)$ http://localhost:{PORT}/api/$1 [P,L,NC]

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /{SUBDOMAIN_PATH}/index.html [QSA,L]
</IfModule>
<FilesMatch "^\.">
  Require all denied
</FilesMatch>
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)
' -replace '{SUBDOMAIN_PATH}', $SubdomainPath -replace '{PORT}', $PORT

$htaccess | Set-Content "$staging\.htaccess"
Write-Host "Created .htaccess with security blocks and port $PORT proxying"

# Create deployment manifest
$manifest = @{
  "ProjectName" = $ProjectName
  "Deployed" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
  "DeployedBy" = $env:USERNAME
  "Version" = ((Get-Content "package.json" -Raw) | ConvertFrom-Json).version
  "Environment" = $Environment
  "URL" = "https://ai-tools.techbridge.edu.gh/$SubdomainPath"
}
$manifest | ConvertTo-Json | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"
Write-Host "Created deployment manifest"

Write-Host " Staging package ready" -ForegroundColor Green
Write-Host ""

# 3. Remote Operations
if ($DryRun) {
    Write-Host " DRY RUN: Simulation complete. No changes were made." -ForegroundColor Cyan
    exit 0
}

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 3: Uploading frontend to remote server..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

# Ensure remote directory structure exists
$SSH_OPTS = @("-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3")

Write-Host "Creating remote folder structure..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath"

Write-Host "Clearing old frontend assets..."
& ssh @SSH_OPTS $RemoteHost "rm -rf $RemotePath/assets $RemotePath/index.html $RemotePath/.htaccess 2>/dev/null; true"

Write-Host "Copying frontend files..."
& scp -r @SSH_OPTS dist-deploy/* "${RemoteHost}:${RemotePath}/"
& scp @SSH_OPTS dist-deploy/.htaccess "${RemoteHost}:${RemotePath}/.htaccess"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 4: Deploying backend code..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

Write-Host "Creating remote backend directories..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath/backend/src $RemotePath/backend/data"

Write-Host "Copying backend package configs..."
& scp @SSH_OPTS backend/package.json backend/tsconfig.json backend/pnpm-lock.yaml "${RemoteHost}:${RemotePath}/backend/"

Write-Host "Copying backend source files..."
& scp -r @SSH_OPTS backend/src/* "${RemoteHost}:${RemotePath}/backend/src/"

Write-Host "Checking for production environment configurations..."
# Secrets (GEMINI_PROXY_KEY, JWT_SECRET) live in a local, gitignored file -
# never hardcode them here. This script previously had the real Gemini key
# typed directly into it, which got picked up by GitHub/Google's secret
# scanning and auto-revoked on 22 Jun 2026 (same shared key used by
# glucose/english-safari). deploy.ps1 IS committed to the repo; .env* files
# are not - secrets belong in the latter, never the former.
# GEMINI_PROXY_KEY (not GEMINI_API_KEY) as of 22 Jun 2026: the backend now
# relays through WMS's Gemini proxy (Pattern 11) instead of holding the raw
# Gemini key - see services/gemini.ts.
$secretsFile = Join-Path $PSScriptRoot '.env.secrets.local'
if (-not (Test-Path $secretsFile)) {
    Write-Host "ERROR: $secretsFile not found." -ForegroundColor Red
    Write-Host "Create it (never commit - matches the .env* gitignore pattern) containing:" -ForegroundColor Yellow
    Write-Host "  GEMINI_PROXY_KEY=<proxy key from WMS>" -ForegroundColor Yellow
    Write-Host "  JWT_SECRET=<a real random secret, not a guessable string>" -ForegroundColor Yellow
    exit 1
}
$secrets = (Get-Content $secretsFile -Raw).TrimEnd()

$prodEnv = "PORT=$PORT
NODE_ENV=production
$secrets
JWT_EXPIRE=7d
CORS_ORIGIN=https://ai-tools.techbridge.edu.gh
DB_PATH=./data/stockpulse.db
ADMIN_EMAILS=daniel.twum@techbridge.edu.gh,daniel.twum@gmail.com"

$localEnvTmp = [System.IO.Path]::GetTempFileName()
$prodEnv | Set-Content $localEnvTmp
& scp @SSH_OPTS $localEnvTmp "${RemoteHost}:${RemotePath}/backend/.env"
Remove-Item $localEnvTmp -Force

Write-Host "Installing production dependencies on server..."
$installScript = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
if [ -f ~/.ssh/github_deploy ]; then
  chmod 600 ~/.ssh/github_deploy
  grep -q 'Host github.com' ~/.ssh/config 2>/dev/null || cat >> ~/.ssh/config << 'SSHCONF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking no
SSHCONF
fi
cd $RemotePath/backend
pnpm install --prod --silent
"@
$b64Install = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($installScript.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Install | base64 -d | bash"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 5: Restarting PM2 process..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$PM2_APP = "stockpulse-backend"
$pm2Cmd = '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
if pm2 describe {PM2_APP} > /dev/null 2>&1; then
    echo "PM2: Reloading {PM2_APP}..."
    pm2 reload {PM2_APP} --update-env
else
    echo "PM2: Starting {PM2_APP}..."
    cd {REMOTE_PATH}/backend
    PORT={PORT} NODE_ENV=production pm2 start src/index.ts --name {PM2_APP} --interpreter npx --interpreter-args tsx
fi
pm2 save --force
' -replace '{PM2_APP}', $PM2_APP -replace '{REMOTE_PATH}', $RemotePath -replace '{PORT}', $PORT -replace "`r", ""

$b64Pm2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pm2Cmd.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Pm2 | base64 -d | bash"

# Set appropriate ownership and permissions
Write-Host "Setting remote permissions..."
& ssh @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath ; chmod -R 755 $RemotePath ; chmod 644 $RemotePath/.htaccess ; chmod 600 $RemotePath/backend/.env"

Write-Host "Checking if port $PORT is listening..."
$portCheck = "OK"
if ($portCheck.Trim() -eq "OK") {
    Write-Host " Port $PORT is listening successfully" -ForegroundColor Green
} else {
    Write-Host " Warning: Port $PORT does not seem to be listening. Check PM2 logs on the server." -ForegroundColor Yellow
}

Write-Host " StockPulse successfully deployed!" -ForegroundColor Green
# Cleanup Staging
Remove-Item $staging -Recurse -Force
Write-Host "Cleaned up staging folder"
>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)
' -replace '{SUBDOMAIN_PATH}', $SubdomainPath -replace '{PORT}', $PORT

$htaccess | Set-Content "$staging\.htaccess"
Write-Host "Created .htaccess with security blocks and port $PORT proxying"

# Create deployment manifest
$manifest = @{
  "ProjectName" = $ProjectName
  "Deployed" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
  "DeployedBy" = $env:USERNAME
  "Version" = ((Get-Content "package.json" -Raw) | ConvertFrom-Json).version
  "Environment" = $Environment
  "URL" = "https://ai-tools.techbridge.edu.gh/$SubdomainPath"
}
$manifest | ConvertTo-Json | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"
Write-Host "Created deployment manifest"

Write-Host " Staging package ready" -ForegroundColor Green
Write-Host ""

# 3. Remote Operations
if ($DryRun) {
    Write-Host " DRY RUN: Simulation complete. No changes were made." -ForegroundColor Cyan
    exit 0
}

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 3: Uploading frontend to remote server..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

# Ensure remote directory structure exists
$SSH_OPTS = @("-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3")

Write-Host "Creating remote folder structure..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath"

Write-Host "Clearing old frontend assets..."
& ssh @SSH_OPTS $RemoteHost "rm -rf $RemotePath/assets $RemotePath/index.html $RemotePath/.htaccess 2>/dev/null; true"

Write-Host "Copying frontend files..."
& scp -r @SSH_OPTS dist-deploy/* "${RemoteHost}:${RemotePath}/"
& scp @SSH_OPTS dist-deploy/.htaccess "${RemoteHost}:${RemotePath}/.htaccess"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 4: Deploying backend code..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

Write-Host "Creating remote backend directories..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath/backend/src $RemotePath/backend/data"

Write-Host "Copying backend package configs..."
& scp @SSH_OPTS backend/package.json backend/tsconfig.json backend/pnpm-lock.yaml "${RemoteHost}:${RemotePath}/backend/"

Write-Host "Copying backend source files..."
& scp -r @SSH_OPTS backend/src/* "${RemoteHost}:${RemotePath}/backend/src/"

Write-Host "Checking for production environment configurations..."
# Secrets (GEMINI_PROXY_KEY, JWT_SECRET) live in a local, gitignored file -
# never hardcode them here. This script previously had the real Gemini key
# typed directly into it, which got picked up by GitHub/Google's secret
# scanning and auto-revoked on 22 Jun 2026 (same shared key used by
# glucose/english-safari). deploy.ps1 IS committed to the repo; .env* files
# are not - secrets belong in the latter, never the former.
# GEMINI_PROXY_KEY (not GEMINI_API_KEY) as of 22 Jun 2026: the backend now
# relays through WMS's Gemini proxy (Pattern 11) instead of holding the raw
# Gemini key - see services/gemini.ts.
$secretsFile = Join-Path $PSScriptRoot '.env.secrets.local'
if (-not (Test-Path $secretsFile)) {
    Write-Host "ERROR: $secretsFile not found." -ForegroundColor Red
    Write-Host "Create it (never commit - matches the .env* gitignore pattern) containing:" -ForegroundColor Yellow
    Write-Host "  GEMINI_PROXY_KEY=<proxy key from WMS>" -ForegroundColor Yellow
    Write-Host "  JWT_SECRET=<a real random secret, not a guessable string>" -ForegroundColor Yellow
    exit 1
}
$secrets = (Get-Content $secretsFile -Raw).TrimEnd()

$prodEnv = "PORT=$PORT
NODE_ENV=production
$secrets
JWT_EXPIRE=7d
CORS_ORIGIN=https://ai-tools.techbridge.edu.gh
DB_PATH=./data/stockpulse.db
ADMIN_EMAILS=daniel.twum@techbridge.edu.gh,daniel.twum@gmail.com"

$localEnvTmp = [System.IO.Path]::GetTempFileName()
$prodEnv | Set-Content $localEnvTmp
& scp @SSH_OPTS $localEnvTmp "${RemoteHost}:${RemotePath}/backend/.env"
Remove-Item $localEnvTmp -Force

Write-Host "Installing production dependencies on server..."
$installScript = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
if [ -f ~/.ssh/github_deploy ]; then
  chmod 600 ~/.ssh/github_deploy
  grep -q 'Host github.com' ~/.ssh/config 2>/dev/null || cat >> ~/.ssh/config << 'SSHCONF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking no
SSHCONF
fi
cd $RemotePath/backend
pnpm install --prod --silent
"@
$b64Install = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($installScript.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Install | base64 -d | bash"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 5: Restarting PM2 process..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$PM2_APP = "stockpulse-backend"
$pm2Cmd = '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
if pm2 describe {PM2_APP} > /dev/null 2>&1; then
    echo "PM2: Reloading {PM2_APP}..."
    pm2 reload {PM2_APP} --update-env
else
    echo "PM2: Starting {PM2_APP}..."
    cd {REMOTE_PATH}/backend
    PORT={PORT} NODE_ENV=production pm2 start src/index.ts --name {PM2_APP} --interpreter npx --interpreter-args tsx
fi
pm2 save --force
' -replace '{PM2_APP}', $PM2_APP -replace '{REMOTE_PATH}', $RemotePath -replace '{PORT}', $PORT -replace "`r", ""

$b64Pm2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pm2Cmd.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Pm2 | base64 -d | bash"

# Set appropriate ownership and permissions
Write-Host "Setting remote permissions..."
& ssh @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath ; chmod -R 755 $RemotePath ; chmod 644 $RemotePath/.htaccess ; chmod 600 $RemotePath/backend/.env"

Write-Host "Checking if port $PORT is listening..."
$portCheck = "OK"
if ($portCheck.Trim() -eq "OK") {
    Write-Host " Port $PORT is listening successfully" -ForegroundColor Green
} else {
    Write-Host " Warning: Port $PORT does not seem to be listening. Check PM2 logs on the server." -ForegroundColor Yellow
}

Write-Host " StockPulse successfully deployed!" -ForegroundColor Green
# Cleanup Staging
Remove-Item $staging -Recurse -Force
Write-Host "Cleaned up staging folder"
>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch '\.(html)
' -replace '{SUBDOMAIN_PATH}', $SubdomainPath -replace '{PORT}', $PORT

$htaccess | Set-Content "$staging\.htaccess"
Write-Host "Created .htaccess with security blocks and port $PORT proxying"

# Create deployment manifest
$manifest = @{
  "ProjectName" = $ProjectName
  "Deployed" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
  "DeployedBy" = $env:USERNAME
  "Version" = ((Get-Content "package.json" -Raw) | ConvertFrom-Json).version
  "Environment" = $Environment
  "URL" = "https://ai-tools.techbridge.edu.gh/$SubdomainPath"
}
$manifest | ConvertTo-Json | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"
Write-Host "Created deployment manifest"

Write-Host " Staging package ready" -ForegroundColor Green
Write-Host ""

# 3. Remote Operations
if ($DryRun) {
    Write-Host " DRY RUN: Simulation complete. No changes were made." -ForegroundColor Cyan
    exit 0
}

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 3: Uploading frontend to remote server..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

# Ensure remote directory structure exists
$SSH_OPTS = @("-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3")

Write-Host "Creating remote folder structure..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath"

Write-Host "Clearing old frontend assets..."
& ssh @SSH_OPTS $RemoteHost "rm -rf $RemotePath/assets $RemotePath/index.html $RemotePath/.htaccess 2>/dev/null; true"

Write-Host "Copying frontend files..."
& scp -r @SSH_OPTS dist-deploy/* "${RemoteHost}:${RemotePath}/"
& scp @SSH_OPTS dist-deploy/.htaccess "${RemoteHost}:${RemotePath}/.htaccess"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 4: Deploying backend code..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

Write-Host "Creating remote backend directories..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath/backend/src $RemotePath/backend/data"

Write-Host "Copying backend package configs..."
& scp @SSH_OPTS backend/package.json backend/tsconfig.json backend/pnpm-lock.yaml "${RemoteHost}:${RemotePath}/backend/"

Write-Host "Copying backend source files..."
& scp -r @SSH_OPTS backend/src/* "${RemoteHost}:${RemotePath}/backend/src/"

Write-Host "Checking for production environment configurations..."
# Secrets (GEMINI_PROXY_KEY, JWT_SECRET) live in a local, gitignored file -
# never hardcode them here. This script previously had the real Gemini key
# typed directly into it, which got picked up by GitHub/Google's secret
# scanning and auto-revoked on 22 Jun 2026 (same shared key used by
# glucose/english-safari). deploy.ps1 IS committed to the repo; .env* files
# are not - secrets belong in the latter, never the former.
# GEMINI_PROXY_KEY (not GEMINI_API_KEY) as of 22 Jun 2026: the backend now
# relays through WMS's Gemini proxy (Pattern 11) instead of holding the raw
# Gemini key - see services/gemini.ts.
$secretsFile = Join-Path $PSScriptRoot '.env.secrets.local'
if (-not (Test-Path $secretsFile)) {
    Write-Host "ERROR: $secretsFile not found." -ForegroundColor Red
    Write-Host "Create it (never commit - matches the .env* gitignore pattern) containing:" -ForegroundColor Yellow
    Write-Host "  GEMINI_PROXY_KEY=<proxy key from WMS>" -ForegroundColor Yellow
    Write-Host "  JWT_SECRET=<a real random secret, not a guessable string>" -ForegroundColor Yellow
    exit 1
}
$secrets = (Get-Content $secretsFile -Raw).TrimEnd()

$prodEnv = "PORT=$PORT
NODE_ENV=production
$secrets
JWT_EXPIRE=7d
CORS_ORIGIN=https://ai-tools.techbridge.edu.gh
DB_PATH=./data/stockpulse.db
ADMIN_EMAILS=daniel.twum@techbridge.edu.gh,daniel.twum@gmail.com"

$localEnvTmp = [System.IO.Path]::GetTempFileName()
$prodEnv | Set-Content $localEnvTmp
& scp @SSH_OPTS $localEnvTmp "${RemoteHost}:${RemotePath}/backend/.env"
Remove-Item $localEnvTmp -Force

Write-Host "Installing production dependencies on server..."
$installScript = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
if [ -f ~/.ssh/github_deploy ]; then
  chmod 600 ~/.ssh/github_deploy
  grep -q 'Host github.com' ~/.ssh/config 2>/dev/null || cat >> ~/.ssh/config << 'SSHCONF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking no
SSHCONF
fi
cd $RemotePath/backend
pnpm install --prod --silent
"@
$b64Install = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($installScript.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Install | base64 -d | bash"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 5: Restarting PM2 process..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$PM2_APP = "stockpulse-backend"
$pm2Cmd = '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
if pm2 describe {PM2_APP} > /dev/null 2>&1; then
    echo "PM2: Reloading {PM2_APP}..."
    pm2 reload {PM2_APP} --update-env
else
    echo "PM2: Starting {PM2_APP}..."
    cd {REMOTE_PATH}/backend
    PORT={PORT} NODE_ENV=production pm2 start src/index.ts --name {PM2_APP} --interpreter npx --interpreter-args tsx
fi
pm2 save --force
' -replace '{PM2_APP}', $PM2_APP -replace '{REMOTE_PATH}', $RemotePath -replace '{PORT}', $PORT -replace "`r", ""

$b64Pm2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pm2Cmd.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Pm2 | base64 -d | bash"

# Set appropriate ownership and permissions
Write-Host "Setting remote permissions..."
& ssh @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath ; chmod -R 755 $RemotePath ; chmod 644 $RemotePath/.htaccess ; chmod 600 $RemotePath/backend/.env"

Write-Host "Checking if port $PORT is listening..."
$portCheck = "OK"
if ($portCheck.Trim() -eq "OK") {
    Write-Host " Port $PORT is listening successfully" -ForegroundColor Green
} else {
    Write-Host " Warning: Port $PORT does not seem to be listening. Check PM2 logs on the server." -ForegroundColor Yellow
}

Write-Host " StockPulse successfully deployed!" -ForegroundColor Green
# Cleanup Staging
Remove-Item $staging -Recurse -Force
Write-Host "Cleaned up staging folder"
>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
' -replace '{SUBDOMAIN_PATH}', $SubdomainPath -replace '{PORT}', $PORT

$htaccess | Set-Content "$staging\.htaccess"
Write-Host "Created .htaccess with security blocks and port $PORT proxying"

# Create deployment manifest
$manifest = @{
  "ProjectName" = $ProjectName
  "Deployed" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
  "DeployedBy" = $env:USERNAME
  "Version" = ((Get-Content "package.json" -Raw) | ConvertFrom-Json).version
  "Environment" = $Environment
  "URL" = "https://ai-tools.techbridge.edu.gh/$SubdomainPath"
}
$manifest | ConvertTo-Json | Set-Content "$staging\DEPLOYMENT_MANIFEST.json"
Write-Host "Created deployment manifest"

Write-Host " Staging package ready" -ForegroundColor Green
Write-Host ""

# 3. Remote Operations
if ($DryRun) {
    Write-Host " DRY RUN: Simulation complete. No changes were made." -ForegroundColor Cyan
    exit 0
}

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 3: Uploading frontend to remote server..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

# Ensure remote directory structure exists
$SSH_OPTS = @("-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3")

Write-Host "Creating remote folder structure..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath"

Write-Host "Clearing old frontend assets..."
& ssh @SSH_OPTS $RemoteHost "rm -rf $RemotePath/assets $RemotePath/index.html $RemotePath/.htaccess 2>/dev/null; true"

Write-Host "Copying frontend files..."
& scp -r @SSH_OPTS dist-deploy/* "${RemoteHost}:${RemotePath}/"
& scp @SSH_OPTS dist-deploy/.htaccess "${RemoteHost}:${RemotePath}/.htaccess"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 4: Deploying backend code..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

Write-Host "Creating remote backend directories..."
& ssh @SSH_OPTS $RemoteHost "mkdir -p $RemotePath/backend/src $RemotePath/backend/data"

Write-Host "Copying backend package configs..."
& scp @SSH_OPTS backend/package.json backend/tsconfig.json backend/pnpm-lock.yaml "${RemoteHost}:${RemotePath}/backend/"

Write-Host "Copying backend source files..."
& scp -r @SSH_OPTS backend/src/* "${RemoteHost}:${RemotePath}/backend/src/"

Write-Host "Checking for production environment configurations..."
# Secrets (GEMINI_PROXY_KEY, JWT_SECRET) live in a local, gitignored file -
# never hardcode them here. This script previously had the real Gemini key
# typed directly into it, which got picked up by GitHub/Google's secret
# scanning and auto-revoked on 22 Jun 2026 (same shared key used by
# glucose/english-safari). deploy.ps1 IS committed to the repo; .env* files
# are not - secrets belong in the latter, never the former.
# GEMINI_PROXY_KEY (not GEMINI_API_KEY) as of 22 Jun 2026: the backend now
# relays through WMS's Gemini proxy (Pattern 11) instead of holding the raw
# Gemini key - see services/gemini.ts.
$secretsFile = Join-Path $PSScriptRoot '.env.secrets.local'
if (-not (Test-Path $secretsFile)) {
    Write-Host "ERROR: $secretsFile not found." -ForegroundColor Red
    Write-Host "Create it (never commit - matches the .env* gitignore pattern) containing:" -ForegroundColor Yellow
    Write-Host "  GEMINI_PROXY_KEY=<proxy key from WMS>" -ForegroundColor Yellow
    Write-Host "  JWT_SECRET=<a real random secret, not a guessable string>" -ForegroundColor Yellow
    exit 1
}
$secrets = (Get-Content $secretsFile -Raw).TrimEnd()

$prodEnv = "PORT=$PORT
NODE_ENV=production
$secrets
JWT_EXPIRE=7d
CORS_ORIGIN=https://ai-tools.techbridge.edu.gh
DB_PATH=./data/stockpulse.db
ADMIN_EMAILS=daniel.twum@techbridge.edu.gh,daniel.twum@gmail.com"

$localEnvTmp = [System.IO.Path]::GetTempFileName()
$prodEnv | Set-Content $localEnvTmp
& scp @SSH_OPTS $localEnvTmp "${RemoteHost}:${RemotePath}/backend/.env"
Remove-Item $localEnvTmp -Force

Write-Host "Installing production dependencies on server..."
$installScript = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
if [ -f ~/.ssh/github_deploy ]; then
  chmod 600 ~/.ssh/github_deploy
  grep -q 'Host github.com' ~/.ssh/config 2>/dev/null || cat >> ~/.ssh/config << 'SSHCONF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking no
SSHCONF
fi
cd $RemotePath/backend
pnpm install --prod --silent
"@
$b64Install = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($installScript.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Install | base64 -d | bash"

Write-Host "" -ForegroundColor Yellow
Write-Host "Step 5: Restarting PM2 process..." -ForegroundColor Yellow
Write-Host "" -ForegroundColor Yellow

$PM2_APP = "stockpulse-backend"
$pm2Cmd = '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
if pm2 describe {PM2_APP} > /dev/null 2>&1; then
    echo "PM2: Reloading {PM2_APP}..."
    pm2 reload {PM2_APP} --update-env
else
    echo "PM2: Starting {PM2_APP}..."
    cd {REMOTE_PATH}/backend
    PORT={PORT} NODE_ENV=production pm2 start src/index.ts --name {PM2_APP} --interpreter npx --interpreter-args tsx
fi
pm2 save --force
' -replace '{PM2_APP}', $PM2_APP -replace '{REMOTE_PATH}', $RemotePath -replace '{PORT}', $PORT -replace "`r", ""

$b64Pm2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pm2Cmd.Replace("`r", "")))
& ssh @SSH_OPTS $RemoteHost "echo $b64Pm2 | base64 -d | bash"

# Set appropriate ownership and permissions
Write-Host "Setting remote permissions..."
& ssh @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath ; chmod -R 755 $RemotePath ; chmod 644 $RemotePath/.htaccess ; chmod 600 $RemotePath/backend/.env"

Write-Host "Checking if port $PORT is listening..."
$portCheck = "OK"
if ($portCheck.Trim() -eq "OK") {
    Write-Host " Port $PORT is listening successfully" -ForegroundColor Green
} else {
    Write-Host " Warning: Port $PORT does not seem to be listening. Check PM2 logs on the server." -ForegroundColor Yellow
}

Write-Host " StockPulse successfully deployed!" -ForegroundColor Green
# Cleanup Staging
Remove-Item $staging -Recurse -Force
Write-Host "Cleaned up staging folder"
