# ============================================================
# THE BENCH TRILOGY — Deploy Script (Next.js standalone)
# Remote : root@techbridge.edu.gh
# Path   : /opt/thebench   (Next standalone, run under PM2)
# Port   : 3047  |  PM2 app: thebench
# URL    : https://thebench.techbridge.edu.gh  (nginx proxy -> 127.0.0.1:3047)
# Usage  : .\deploy.ps1
# Model  : fleet server-side build (Pattern 17/25), adapted for Next standalone.
#          Static content site: no build-time secrets, no server .env.
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'

$REMOTE      = 'root@techbridge.edu.gh'
$DEPLOY_PATH = '/opt/thebench'
$PORT        = 3047
$PM2_APP     = 'thebench'
$HEALTH_URL  = 'https://thebench.techbridge.edu.gh'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
# Repo folder name (git sparse-checkout target) — stays as-is; only the
# deployed subdomain/PM2 name is 'thebench'.
$SUBFOLDER   = 'bench-trilogy'
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
Log -Level 'INFO' -Msg 'THE BENCH TRILOGY DEPLOYMENT'             -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $REMOTE"
Log -Level 'INFO' -Msg "Path   : $DEPLOY_PATH/"
Log -Level 'INFO' -Msg "Port   : $PORT  (PM2: $PM2_APP)"

$COMMIT = (git rev-parse --short HEAD 2>$null).Trim()
$BRANCH = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log -Level 'INFO' -Msg "Commit : $COMMIT on $BRANCH"

Log -Level 'INFO' -Msg 'Server-side build (git clone + pnpm build + assemble standalone)' -Color Yellow

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
BRANCH=${BRANCH}

log() { NOW=`$(date '+%Y-%m-%d %H:%M:%S'); echo "[`$NOW][SERVER] `$1"; }

log "pnpm `$(pnpm --version 2>/dev/null || echo 'not found'), node `$(node --version 2>/dev/null)"
log '[1/6] Cleaning previous temp build...'
rm -rf "`$TMPDIR"
find /tmp -maxdepth 1 -name '${SUBFOLDER}_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true
log "[2/6] Cloning ${SUBFOLDER} from branch `$BRANCH (sparse, depth 1)..."
git clone --filter=blob:none --sparse --depth 1 --branch "`$BRANCH" "`$REPO" "`$TMPDIR"
cd "`$TMPDIR" && git sparse-checkout set ${SUBFOLDER} && cd ${SUBFOLDER}
log '[3/6] Installing dependencies (isolated, resilient lockfile)...'
pnpm install --frozen-lockfile --silent 2>/dev/null || { echo '[install] frozen lockfile rejected (Pattern 27) — re-resolving under server policy'; rm -f pnpm-lock.yaml && pnpm install; }
log '[4/6] Building (Next.js standalone)...'
pnpm build
if [ ! -f .next/standalone/server.js ]; then echo '[FATAL] .next/standalone/server.js missing — is output:standalone set? Aborting'; exit 1; fi
log '[5/6] Assembling standalone (static + public alongside server.js)...'
cp -r .next/static .next/standalone/.next/static
[ -d public ] && cp -r public .next/standalone/public || true
log '[6/6] Deploying to `$DEPLOY_PATH ...'
mkdir -p "`$DEPLOY_PATH"
rsync -a --delete .next/standalone/ "`$DEPLOY_PATH/"
rm -rf "`$TMPDIR"
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
Log -Level 'SUCCESS' -Msg 'Server-side build and deploy complete' -Color Green

Log -Level 'INFO' -Msg 'Restarting PM2 (Pattern 23 hard restart)...' -Color Yellow
# Next standalone runs node server.js; it reads PORT and HOSTNAME from the env.
# stdout to /dev/null so the fleet process table does not mangle over SSH.
$pm2Result = & $SSH @SSH_OPTS $REMOTE "pm2 delete ${PM2_APP} >/dev/null 2>&1 || true; cd ${DEPLOY_PATH}; NODE_ENV=production PORT=${PORT} HOSTNAME=127.0.0.1 pm2 start server.js --name ${PM2_APP} --cwd ${DEPLOY_PATH} >/dev/null 2>&1; pm2 save --force >/dev/null 2>&1 || true; echo 'pm2: hard restart (Pattern 23)'"
Write-Host $pm2Result -ForegroundColor DarkGray

Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow
Start-Sleep -Seconds 6
$portCheck = & $SSH @SSH_OPTS $REMOTE "ss -tlnp | grep -q :${PORT} && echo 'OK port ${PORT} listening' || echo 'WARN port ${PORT} not found'"
Write-Host $portCheck -ForegroundColor $(if ($portCheck -match '^OK') { 'Green' } else { 'Yellow' })
$healthCheck = & $SSH @SSH_OPTS $REMOTE "curl -s -o /dev/null -w '%{http_code}' -m 5 http://127.0.0.1:${PORT}/"
Write-Host "health: HTTP $healthCheck" -ForegroundColor $(if ($healthCheck -eq '200') { 'Green' } else { 'Red' })
if ($healthCheck -ne '200') { Log -Level 'ERROR' -Msg "http://127.0.0.1:${PORT}/ returned $healthCheck — app not serving" -Color Red; exit 1 }

$DURATION = [math]::Round(((Get-Date) - $START_TIME).TotalSeconds, 1)
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
Log -Level 'SUCCESS' -Msg "DEPLOYMENT COMPLETE in ${DURATION}s"    -Color Green
Log -Level 'SUCCESS' -Msg "URL:  $HEALTH_URL/  (once the nginx subdomain vhost is in place)" -Color Green
Log -Level 'SUCCESS' -Msg "Port: $PORT  (PM2: $PM2_APP)"            -Color Green
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
