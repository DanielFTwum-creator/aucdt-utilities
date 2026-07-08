# ============================================================
# Brand Guideline Checker — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/fail2ban-ai
# Port   : 3040  |  PM2 app: fail2ban-ai
# Usage  : .\deploy.ps1
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'

$REMOTE      = 'root@techbridge.edu.gh'
$DEPLOY_PATH = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/fail2ban-ai'
$PORT        = 3040
$PM2_APP     = 'fail2ban-ai'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/fail2ban-ai'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'fail2ban-ai'
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
Log -Level 'INFO' -Msg 'FAIL2BAN-AI DEPLOYMENT'      -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $REMOTE"
Log -Level 'INFO' -Msg "Path   : $DEPLOY_PATH/"
Log -Level 'INFO' -Msg ''

Log -Level 'INFO' -Msg 'Step 1: Pre-flight checks...' -Color Yellow
if (-not (Test-Path '.env.local')) { Log -Level 'ERROR' -Msg '.env.local not found — aborting' -Color Red; exit 1 }
$envContent = Get-Content '.env.local' -Raw
foreach ($key in @('VITE_GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET')) {
    if ($envContent -notmatch $key) { Log -Level 'ERROR' -Msg "$key missing in .env.local" -Color Red; exit 1 }
}
Log -Level 'SUCCESS' -Msg 'Pre-flight OK (.env.local validated)' -Color Green

Log -Level 'INFO' -Msg 'Step 2: Verifying git state...' -Color Yellow
$COMMIT = (git rev-parse --short HEAD 2>$null).Trim()
$BRANCH = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log -Level 'INFO' -Msg "Commit : $COMMIT on $BRANCH"

Log -Level 'INFO' -Msg 'Step 3: Server-side build (git clone + pnpm build)' -Color Yellow
Log -Level 'INFO' -Msg 'Uploading .env.local to server...' -Color DarkGray
& $SCP @SSH_OPTS .env.local "${REMOTE}:/tmp/.env.${PM2_APP}" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Log -Level 'ERROR' -Msg 'Failed to upload .env.local' -Color Red; exit 1 }
Log -Level 'SUCCESS' -Msg '.env.local uploaded' -Color Green

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

log() { NOW=`$(date '+%Y-%m-%d %H:%M:%S'); echo "[`$NOW][SERVER] `$1"; }

pnpm_ver=`$(pnpm --version 2>/dev/null || echo 'not found')
log "pnpm `$pnpm_ver"
log '[1/7] Cleaning previous temp build...'
rm -rf "`$TMPDIR"
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true
log '[2/7] Cloning ${SUBFOLDER} (sparse, depth 1)...'
git clone --filter=blob:none --sparse --depth 1 "`$REPO" "`$TMPDIR"
cd "`$TMPDIR" && git sparse-checkout set ${SUBFOLDER} && cd ${SUBFOLDER}
log '[3/7] Injecting .env.local...'
cp /tmp/.env.${PM2_APP} .env.local
log '[4/7] Installing dependencies...'
pnpm install --frozen-lockfile --silent 2>/dev/null || pnpm install --no-frozen-lockfile --silent
log '[5/7] Building...'
pnpm build
if ! grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' dist/index.html; then echo '[FATAL] dist/index.html references no JS bundle (Pattern 24) — aborting'; exit 1; fi
log '[6/7] Deploying dist/ to web root...'
mkdir -p "`$DEPLOY_PATH" && rsync -a --delete dist/ "`$DEPLOY_PATH/dist/"
log '[7/7] Installing backend deps...'
cp server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "`$DEPLOY_PATH/"
cd "`$DEPLOY_PATH" && CI=true pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent
log 'Build and deploy complete.'
"@

$localScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "${PM2_APP}_build_$([Guid]::NewGuid().ToString('N')).sh")
Write-LfFile -path $localScript -content $remoteBuildScript
& $SCP @SSH_OPTS $localScript "${REMOTE}:/tmp/${PM2_APP}_build.sh"
if ($LASTEXITCODE -ne 0) { Log -Level 'ERROR' -Msg 'Failed to upload build script' -Color Red; Remove-Item $localScript -Force -EA SilentlyContinue; exit 1 }
& $SSH @SSH_OPTS $REMOTE "bash /tmp/${PM2_APP}_build.sh"
$buildExit = $LASTEXITCODE
Remove-Item $localScript -Force -EA SilentlyContinue
& $SSH @SSH_OPTS $REMOTE "rm -f /tmp/${PM2_APP}_build.sh" 2>$null
if ($buildExit -ne 0) { Log -Level 'ERROR' -Msg "Remote build failed (exit $buildExit)" -Color Red; exit 1 }
Log -Level 'SUCCESS' -Msg 'Server-side build and file sync complete' -Color Green

Log -Level 'INFO' -Msg 'Step 4: Configuring server environment...' -Color Yellow
& $SSH @SSH_OPTS $REMOTE "chown -R techbridge.edu.gh_md:psaserv ${DEPLOY_PATH} 2>/dev/null || true; find ${DEPLOY_PATH} -type d -exec chmod 755 {} \; 2>/dev/null || true; find ${DEPLOY_PATH} -type f -exec chmod 644 {} \; 2>/dev/null || true"

# Pattern 25 stage 7: strip any raw Gemini key and inject GEMINI_PROXY_KEY from
# WMS custody (/opt/tuc-wms/.env), BOM/CR/null-stripped (Pattern 21). The key
# never exists on the dev machine and never appears on a command line.
$envInject = & $SSH @SSH_OPTS $REMOTE "touch ${DEPLOY_PATH}/.env; sed -i '/^GEMINI_API_KEY=/d;/^VITE_GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' ${DEPLOY_PATH}/.env; K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g'); if [ -n `"`$K`" ]; then printf 'GEMINI_PROXY_KEY=%s\n' `"`$K`" >> ${DEPLOY_PATH}/.env; echo 'env: GEMINI_PROXY_KEY injected'; else echo 'WARN: GEMINI_PROXY_KEY not found in WMS'; fi; chmod 600 ${DEPLOY_PATH}/.env"
Write-Host $envInject -ForegroundColor DarkGray
if ($envInject -match 'WARN') { Log -Level 'ERROR' -Msg 'GEMINI_PROXY_KEY unavailable — AI analysis would run unconfigured. Aborting.' -Color Red; exit 1 }

Log -Level 'INFO' -Msg 'Step 5: Restarting backend (Pattern 23 hard restart)...' -Color Yellow
$pm2Result = & $SSH @SSH_OPTS $REMOTE "pm2 delete ${PM2_APP} >/dev/null 2>&1 || true; cd ${DEPLOY_PATH}; NODE_ENV=production PORT=${PORT} pm2 start server.ts --name ${PM2_APP} --interpreter npx --interpreter-args tsx --cwd ${DEPLOY_PATH}; pm2 save --force >/dev/null 2>&1 || true; echo 'pm2: hard restart (Pattern 23)'"
Write-Host $pm2Result -ForegroundColor DarkGray

Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow
Start-Sleep -Seconds 8
$indexCheck = & $SSH @SSH_OPTS $REMOTE "test -f ${DEPLOY_PATH}/dist/index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $indexCheck -ForegroundColor $(if ($indexCheck -match '^OK') { 'Green' } else { 'Red' })
$portCheck = & $SSH @SSH_OPTS $REMOTE "ss -tlnp | grep -q :${PORT} && echo 'OK port ${PORT} listening' || echo 'WARN port ${PORT} not found'"
Write-Host $portCheck -ForegroundColor $(if ($portCheck -match '^OK') { 'Green' } else { 'Yellow' })
$healthCheck = & $SSH @SSH_OPTS $REMOTE "curl -s -o /dev/null -w '%{http_code}' -m 5 http://127.0.0.1:${PORT}/api/health"
Write-Host "health: HTTP $healthCheck" -ForegroundColor $(if ($healthCheck -eq '200') { 'Green' } else { 'Red' })
if ($healthCheck -ne '200') { Log -Level 'ERROR' -Msg "/api/health returned $healthCheck — backend not serving" -Color Red; exit 1 }

$DURATION = [math]::Round(((Get-Date) - $START_TIME).TotalSeconds, 1)
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
Log -Level 'SUCCESS' -Msg "DEPLOYMENT COMPLETE in ${DURATION}s"    -Color Green
Log -Level 'SUCCESS' -Msg "URL:  $HEALTH_URL"                       -Color Green
Log -Level 'SUCCESS' -Msg "Port: $PORT"                             -Color Gree