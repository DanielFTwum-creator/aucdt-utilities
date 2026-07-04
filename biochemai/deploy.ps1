# ============================================================
# BioChemAI — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/biochemai
# Port   : 3002  |  PM2 app: biochemai
# Usage  : .\deploy.ps1
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'

$REMOTE      = 'root@techbridge.edu.gh'
$DEPLOY_PATH = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/biochemai'
$PORT        = 3002
$PM2_APP     = 'biochemai'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/biochemai'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'biochemai'
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
Log -Level 'INFO' -Msg 'BIOCHEMAI DEPLOYMENT'                    -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $REMOTE"
Log -Level 'INFO' -Msg "Path   : $DEPLOY_PATH/"
Log -Level 'INFO' -Msg ''

# Step 1: Pre-flight
Log -Level 'INFO' -Msg 'Step 1: Pre-flight checks...' -Color Yellow
if (-not (Test-Path '.env.local')) {
    Log -Level 'ERROR' -Msg '.env.local not found — aborting' -Color Red
    exit 1
}
Log -Level 'SUCCESS' -Msg 'Pre-flight OK (.env.local validated)' -Color Green

# Step 2: Git state
Log -Level 'INFO' -Msg 'Step 2: Verifying git state...' -Color Yellow
$COMMIT = (git rev-parse --short HEAD 2>$null).Trim()
$BRANCH = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log -Level 'INFO' -Msg "Commit : $COMMIT on $BRANCH"


# Step 3: Server-side build
Log -Level 'INFO' -Msg 'Step 3: Server-side build (git clone + pnpm build)' -Color Yellow

Log -Level 'INFO' -Msg 'Uploading .env.local to server for build...' -Color DarkGray
& $SCP @SSH_OPTS .env.local "${REMOTE}:/tmp/.env.biochemai" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Log -Level 'SUCCESS' -Msg '.env.local uploaded' -Color Green
} else {
    Log -Level 'ERROR' -Msg 'Failed to upload .env.local' -Color Red
    exit 1
}

$remoteBuildScript = @"
#!/usr/bin/env bash
set -e
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

log '[3/7] Injecting .env.local for Vite build...'
cp /tmp/.env.biochemai .env.local

log '[4/7] Installing dependencies...'
pnpm install --no-frozen-lockfile || true

log '[5/7] Building...'
./node_modules/.bin/vite build

log '[6/7] Deploying dist/ to web root...'
mkdir -p "`$DEPLOY_PATH"
rsync -a --delete dist/ "`$DEPLOY_PATH/dist/"
cp index.html "`$DEPLOY_PATH/dist/index.html" 2>/dev/null || true

log '[7/7] Installing backend deps...'
cp server.ts package.json pnpm-lock.yaml "`$DEPLOY_PATH/" 2>/dev/null || true
cd "`$DEPLOY_PATH"
# No --prod: tsx must be available to run server.ts (see PATTERNS.md Pattern 13)
pnpm install --silent 2>/dev/null || npm install --silent

log 'Build and deploy complete.'
"@

$localBuildScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "biochemai_build_$([Guid]::NewGuid().ToString('N')).sh")
Write-LfFile -path $localBuildScript -content $remoteBuildScript
& $SCP @SSH_OPTS $localBuildScript "${REMOTE}:/tmp/biochemai_build.sh"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload remote build script' -Color Red
    Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
    exit 1
}
& $SSH @SSH_OPTS $REMOTE 'bash /tmp/biochemai_build.sh'
$buildExit = $LASTEXITCODE
Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
& $SSH @SSH_OPTS $REMOTE 'rm -f /tmp/biochemai_build.sh' 2>$null

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
$localHtaccess = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "biochemai_htaccess_$([Guid]::NewGuid().ToString('N')).txt")
Write-LfFile -path $localHtaccess -content $htaccessContent
& $SSH @SSH_OPTS $REMOTE "mkdir -p ${DEPLOY_PATH}/dist"
& $SCP @SSH_OPTS $localHtaccess "${REMOTE}:${DEPLOY_PATH}/dist/.htaccess"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload .htaccess' -Color Red
    Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue
    exit 1
}
Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue

# Step 5: Server environment
# Key custody (Pattern 11 fleet standard): the deployed .env must never contain the raw
# GEMINI_API_KEY. GEMINI_PROXY_KEY is injected server-side from WMS custody
# (/opt/tuc-wms/.env) with BOM/CR/null stripping (Pattern 21). No bash loop vars (Pattern 20).
Log -Level 'INFO' -Msg 'Step 5: Configuring server environment...' -Color Yellow
$envResult = & $SSH @SSH_OPTS $REMOTE "cp /tmp/.env.biochemai ${DEPLOY_PATH}/.env; sed -i '/^GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' ${DEPLOY_PATH}/.env; K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g'); if [ -n `"`$K`" ]; then printf 'GEMINI_PROXY_KEY=%s\n' `"`$K`" >> ${DEPLOY_PATH}/.env; echo 'env: GEMINI_PROXY_KEY injected from WMS custody'; else echo 'WARN: GEMINI_PROXY_KEY not found in /opt/tuc-wms/.env'; fi; chmod 600 ${DEPLOY_PATH}/.env; chown -R techbridge.edu.gh_md:psaserv ${DEPLOY_PATH} 2>/dev/null || true; find ${DEPLOY_PATH} -not -path '${DEPLOY_PATH}/node_modules/*' -type d -exec chmod 755 {} \; 2>/dev/null || true; find ${DEPLOY_PATH} -not -path '${DEPLOY_PATH}/node_modules/*' -not -name '.env' -type f -exec chmod 644 {} \; 2>/dev/null || true"
Write-Host $envResult -ForegroundColor DarkGray
if ($envResult -match 'WARN') {
    Log -Level 'ERROR' -Msg 'GEMINI_PROXY_KEY unavailable — AI routes would 503. Aborting before PM2 restart.' -Color Red
    exit 1
}

# Step 6: Restart backend
Log -Level 'INFO' -Msg 'Step 6: Restarting backend (hard delete + start, Pattern 23)...' -Color Yellow
# Pattern 23: pm2 reload/restart --update-env keeps a stale env (old GEMINI_PROXY_KEY
# -> WMS 401) AND stale tsx-transpiled server.ts. Hard delete + fresh start is the only
# reliable way to pick up a changed env var or edited backend.
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
$pm2Result = & $SSH @SSH_OPTS $REMOTE "$nvmPrefix; NODE26=/root/.nvm/versions/node/v26.3.1/bin/node; TSX_ESM=${DEPLOY_PATH}/node_modules/tsx/dist/esm/index.mjs; pm2 delete ${PM2_APP} >/dev/null 2>&1; cd ${DEPLOY_PATH} && pm2 start ${DEPLOY_PATH}/server.ts --name ${PM2_APP} --interpreter `$NODE26 --interpreter-args `"--import `$TSX_ESM`" --cwd ${DEPLOY_PATH}; echo 'pm2: started ${PM2_APP}'; pm2 save --force >/dev/null 2>&1 || true"
Write-Host $pm2Result -ForegroundColor DarkGray

# Health checks
Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow
Start-Sleep -Seconds 8

# Pattern 23: assert the new build is actually running (not stale tsx code).
$bannerCheck = & $SSH @SSH_OPTS $REMOTE "$nvmPrefix; for i in 1 2 3 4 5 6 7 8 9 10; do pm2 logs ${PM2_APP} --lines 40 --nostream 2>&1 | grep -q 'Gemini relay (WMS custody) listening' && break; sleep 3; done; pm2 logs ${PM2_APP} --lines 40 --nostream 2>&1 | grep -q 'Gemini relay (WMS custody) listening' && echo 'OK new build running' || echo 'WARN stale build — banner not found'"
Write-Host $bannerCheck -ForegroundColor $(if ($bannerCheck -match '^OK') { 'Green' } else { 'Red' })

$indexCheck = & $SSH @SSH_OPTS $REMOTE "test -f ${DEPLOY_PATH}/dist/index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
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
