# ============================================================
# Drumming for SEL Success (dfs-website) — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs
# URL    : https://ai-tools.techbridge.edu.gh/dfs
# Port   : 3012  |  PM2 app: dfs-website
# Usage  : .\deploy.ps1
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'

$REMOTE      = 'root@techbridge.edu.gh'
$DEPLOY_PATH = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs'
$PORT        = 3012
$PM2_APP     = 'dfs-website'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/dfs'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'dfs-website'
$SSH_OPTS    = @('-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes', '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3')
$SSH         = 'ssh'
$SCP         = 'scp'
$START_TIME  = Get-Date

function Log {
    param([string]$Level = 'INFO', [string]$Msg, [ConsoleColor]$Color = 'White')
    $ts = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

function Write-LfFile($path, $content) {
    $content = $content -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
}

Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg 'DFS-WEBSITE DEPLOYMENT'                    -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $REMOTE"
Log -Level 'INFO' -Msg "Path   : $DEPLOY_PATH/"
Log -Level 'INFO' -Msg ''

# Step 0: Approval gate — blocks the deploy if the app fails best-practice checks
Log -Level 'INFO' -Msg 'Step 0: Approval gate...' -Color Yellow
$gate = Join-Path $PSScriptRoot '..\Approve-App.ps1'
if (Test-Path $gate) {
    & $gate -Path $PSScriptRoot -Port $PORT -PreBuild
    if ($LASTEXITCODE -ne 0) {
        Log -Level 'ERROR' -Msg 'Approval gate REJECTED this app — fix the issues above before deploying.' -Color Red
        exit 1
    }
} else {
    Log -Level 'WARN' -Msg 'Approve-App.ps1 not found — skipping gate' -Color Yellow
}

# Step 1: Pre-flight
Log -Level 'INFO' -Msg 'Step 1: Pre-flight checks...' -Color Yellow
if (-not (Test-Path '.env')) {
    Log -Level 'ERROR' -Msg '.env not found — aborting' -Color Red
    exit 1
}
Log -Level 'SUCCESS' -Msg 'Pre-flight OK (.env validated)' -Color Green

# Step 2: Git state
Log -Level 'INFO' -Msg 'Step 2: Verifying git state...' -Color Yellow
$COMMIT = (git rev-parse --short HEAD 2>$null).Trim()
$BRANCH = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log -Level 'INFO' -Msg "Commit : $COMMIT on $BRANCH"


# Step 3: Server-side build
Log -Level 'INFO' -Msg 'Step 3: Server-side build (git clone + pnpm build)' -Color Yellow

Log -Level 'INFO' -Msg 'Uploading .env to server for build...' -Color DarkGray
& $SCP @SSH_OPTS .env "${REMOTE}:/tmp/.env.dfs-website" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Log -Level 'SUCCESS' -Msg '.env uploaded' -Color Green
} else {
    Log -Level 'ERROR' -Msg 'Failed to upload .env' -Color Red
    exit 1
}

$remoteBuildScript = @"
#!/usr/bin/env bash
set -e
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use --lts >/dev/null 2>&1 || true
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
TMPDIR=/tmp/${SUBFOLDER}_deploy_${COMMIT}
DEPLOY_PATH=${DEPLOY_PATH}
REPO=${GITHUB_REPO}

log() {
  NOW=`$(date '+%Y-%m-%d %H:%M:%S')
  echo "[`$NOW][SERVER] `$1"
}

pnpm_ver=`$(pnpm --version 2>/dev/null || echo 'not found')
log "pnpm `$pnpm_ver"

log '[1/7] Cleaning previous temp build...'
rm -rf "`$TMPDIR"
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true

log '[2/7] Cloning ${SUBFOLDER} (sparse, depth 1)...'
git clone --filter=blob:none --sparse --depth 1 "`$REPO" "`$TMPDIR"
cd "`$TMPDIR"
git sparse-checkout set ${SUBFOLDER}
cd ${SUBFOLDER}

log '[3/7] Injecting .env for Vite build...'
cp /tmp/.env.dfs-website .env.local

log '[4/7] Installing dependencies...'
pnpm install --silent

log '[5/7] Building...'
pnpm build

log '[6/7] Deploying dist/ to web root (top level, like sibling apps)...'
mkdir -p "`$DEPLOY_PATH"
# Apache docroot is the vhost root, so /SUBFOLDER/ maps to DEPLOY_PATH itself,
# NOT DEPLOY_PATH/dist/. The built SPA must live at the top level (matches biochemai).
# rsync the build to the top level; --delete with excludes keeps backend files and
# node_modules/.env intact while pruning stale hash-named assets.
rsync -a --delete \
  --exclude 'server.ts' --exclude 'package.json' --exclude 'pnpm-lock.yaml' \
  --exclude 'pnpm-workspace.yaml' --exclude 'node_modules' --exclude '.env' \
  dist/ "`$DEPLOY_PATH/"

log '[7/7] Installing backend deps...'
cp server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "`$DEPLOY_PATH/" 2>/dev/null || true
cd "`$DEPLOY_PATH"
pnpm install --prod --silent

log 'Build and deploy complete.'
"@

$localBuildScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "dfs-website_build_$([Guid]::NewGuid().ToString('N')).sh")
Write-LfFile -path $localBuildScript -content $remoteBuildScript
& $SCP @SSH_OPTS $localBuildScript "${REMOTE}:/tmp/dfs-website_build.sh"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload remote build script' -Color Red
    Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
    exit 1
}
& $SSH @SSH_OPTS $REMOTE 'bash /tmp/dfs-website_build.sh'
$buildExit = $LASTEXITCODE
Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
& $SSH @SSH_OPTS $REMOTE 'rm -f /tmp/dfs-website_build.sh' 2>$null

if ($buildExit -ne 0) {
    Log -Level 'ERROR' -Msg "Remote build failed with exit code $buildExit" -Color Red
    exit 1
}
Log -Level 'SUCCESS' -Msg 'Server-side build and file sync complete' -Color Green

# Step 4: .htaccess
Log -Level 'INFO' -Msg 'Step 4: Writing .htaccess...' -Color Yellow
$htaccessContent = @'
Options -MultiViews
RewriteEngine On
RewriteBase /dfs/

# Proxy API requests to the PM2 backend (port 3012) before the SPA fallback.
RewriteCond %{REQUEST_URI} ^/dfs/api/ [OR]
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(api/.*)$ http://localhost:3012/$1 [P,L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
<FilesMatch "index\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
'@
$localHtaccess = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "dfs-website_htaccess_$([Guid]::NewGuid().ToString('N')).txt")
Write-LfFile -path $localHtaccess -content $htaccessContent
& $SSH @SSH_OPTS $REMOTE "mkdir -p ${DEPLOY_PATH}"
& $SCP @SSH_OPTS $localHtaccess "${REMOTE}:${DEPLOY_PATH}/.htaccess"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload .htaccess' -Color Red
    Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue
    exit 1
}
Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue

# Step 5: Server environment
Log -Level 'INFO' -Msg 'Step 5: Configuring server environment...' -Color Yellow
& $SSH @SSH_OPTS $REMOTE "cp /tmp/.env.dfs-website ${DEPLOY_PATH}/.env; chown -R techbridge.edu.gh_md:psaserv ${DEPLOY_PATH} 2>/dev/null || true; find ${DEPLOY_PATH} -type d -exec chmod 755 {} \; 2>/dev/null || true; find ${DEPLOY_PATH} -type f -exec chmod 644 {} \; 2>/dev/null || true"

# Step 6: Restart backend
Log -Level 'INFO' -Msg 'Step 6: Restarting backend...' -Color Yellow
$pm2Result = & $SSH @SSH_OPTS $REMOTE "if pm2 describe ${PM2_APP} > /dev/null 2>&1; then pm2 reload ${PM2_APP} --update-env; echo 'pm2: reloaded ${PM2_APP}'; else cd ${DEPLOY_PATH}; NODE_ENV=production PORT=${PORT} pm2 start server.ts --name ${PM2_APP} --interpreter npx --interpreter-args tsx --cwd ${DEPLOY_PATH}; echo 'pm2: started ${PM2_APP}'; fi; pm2 save > /dev/null 2>&1"
Write-Host $pm2Result -ForegroundColor DarkGray

# Health checks
Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow
Start-Sleep -Seconds 8

$indexCheck = & $SSH @SSH_OPTS $REMOTE "test -f ${DEPLOY_PATH}/index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $indexCheck -ForegroundColor $(if ($indexCheck -match '^OK') { 'Green' } else { 'Red' })

$portCheck = & $SSH @SSH_OPTS $REMOTE "ss -tlnp | grep -q :${PORT} && echo 'OK port ${PORT} listening' || echo 'WARN port ${PORT} not found'"
Write-Host $portCheck -ForegroundColor $(if ($portCheck -match '^OK') { 'Green' } else { 'Yellow' })

try {
    $r = Invoke-WebRequest -Uri "${HEALTH_URL}/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "HTTP $($r.StatusCode) (backend OK)" -ForegroundColor Green
} catch {
    Write-Host 'WARN health check unreachable' -ForegroundColor Yellow
}

$DURATION = [math]::Round(((Get-Date) - $START_TIME).TotalSeconds, 1)
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
Log -Level 'SUCCESS' -Msg "DEPLOYMENT COMPLETE in ${DURATION}s"    -Color Green
Log -Level 'SUCCESS' -Msg "URL:  $HEALTH_URL"                       -Color Green
Log -Level 'SUCCESS' -Msg "Port: $PORT"                             -Color Green
Log -Level 'SUCCESS' -Msg '========================================' -Color Green

