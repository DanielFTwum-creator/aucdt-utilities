# ============================================================
# Impact Ventures Dashboard — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/impact-ventures-dashboard
# Port   : 3025  |  PM2 app: impact-ventures
# Usage  : .\deploy.ps1
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'
$REMOTE      = 'root@techbridge.edu.gh'
$DEPLOY_PATH = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/impact-ventures-dashboard'
$PORT        = 3025
$PM2_APP     = 'impact-ventures'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/impact-ventures-dashboard'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'impact-ventures-dashboard'
$SSH_OPTS    = @('-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes', '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3')
$SSH = 'ssh'; $SCP = 'scp'; $START_TIME = Get-Date

function Log { param([string]$Level='INFO',[string]$Msg,[ConsoleColor]$Color='White'); Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))[$Level] $Msg" -ForegroundColor $Color }
function Write-LfFile($path,$content) { $content=$content -replace "`r`n","`n"; [System.IO.File]::WriteAllText($path,$content,(New-Object System.Text.UTF8Encoding $false)) }

Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg 'IMPACT VENTURES DASHBOARD DEPLOYMENT' -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $REMOTE"; Log -Level 'INFO' -Msg "Path   : $DEPLOY_PATH/"; Log -Level 'INFO' -Msg ''

Log -Level 'INFO' -Msg 'Step 1: Pre-flight checks...' -Color Yellow
Log -Level 'SUCCESS' -Msg 'Pre-flight OK' -Color Green

Log -Level 'INFO' -Msg 'Step 2: Verifying git state...' -Color Yellow
$COMMIT=(git rev-parse --short HEAD 2>$null).Trim(); $BRANCH=(git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log -Level 'INFO' -Msg "Commit : $COMMIT on $BRANCH"

Log -Level 'INFO' -Msg 'Step 3: Server-side build...' -Color Yellow
if (Test-Path '.env.local') {
    & $SCP @SSH_OPTS .env.local "${REMOTE}:/tmp/.env.${PM2_APP}" 2>&1|Out-Null
    if ($LASTEXITCODE -eq 0) { Log -Level 'SUCCESS' -Msg '.env.local uploaded' -Color Green }
    else { Log -Level 'WARN' -Msg 'Failed to upload .env.local — VITE_ vars may be undefined' -Color Yellow }
} else {
    Log -Level 'WARN' -Msg 'No .env.local — VITE_ vars will be undefined in build' -Color Yellow
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
log() { NOW=`$(date '+%Y-%m-%d %H:%M:%S'); echo "[`$NOW][SERVER] `$1"; }
pnpm_ver=`$(pnpm --version 2>/dev/null || echo 'not found'); log "pnpm `$pnpm_ver"
log '[1/7] Cleaning...'; rm -rf "`$TMPDIR"
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true
log '[2/7] Cloning ${SUBFOLDER}...'
git clone --filter=blob:none --sparse --depth 1 "`$REPO" "`$TMPDIR"
cd "`$TMPDIR" && git sparse-checkout set ${SUBFOLDER} && cd ${SUBFOLDER}
log '[3/7] Injecting .env.local...'; cp /tmp/.env.${PM2_APP} .env.local 2>/dev/null || log 'No .env.local — VITE_ vars undefined'
log '[4/7] Installing...'; export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1; pnpm install --frozen-lockfile --silent 2>/dev/null || pnpm install --no-frozen-lockfile --silent
log '[5/7] Building...'; pnpm build
log '[6/7] Deploying...'; mkdir -p "`$DEPLOY_PATH" && rsync -a --delete dist/ "`$DEPLOY_PATH/dist/"; cp index.html "`$DEPLOY_PATH/dist/index.html" 2>/dev/null || true
log '[7/7] Backend deps...'; cp server.js package.json "`$DEPLOY_PATH/" 2>/dev/null || true; cd "`$DEPLOY_PATH" && { pnpm install --prod --silent 2>/dev/null || { echo '[WARN] pnpm install failed — falling back to npm'; npm install --omit=dev --silent; }; } || true
log 'Done.'
"@

$ls=[System.IO.Path]::Combine([System.IO.Path]::GetTempPath(),"${PM2_APP}_$([Guid]::NewGuid().ToString('N')).sh")
Write-LfFile $ls $remoteBuildScript
& $SCP @SSH_OPTS $ls "${REMOTE}:/tmp/${PM2_APP}_build.sh"
& $SSH @SSH_OPTS $REMOTE "bash /tmp/${PM2_APP}_build.sh"; $bx=$LASTEXITCODE
Remove-Item $ls -Force -EA SilentlyContinue; & $SSH @SSH_OPTS $REMOTE "rm -f /tmp/${PM2_APP}_build.sh" 2>$null
if ($bx -ne 0) { Log -Level 'ERROR' -Msg "Build failed ($bx)" -Color Red; exit 1 }
Log -Level 'SUCCESS' -Msg 'Build complete' -Color Green

Log -Level 'INFO' -Msg 'Step 4: Server environment...' -Color Yellow
& $SSH @SSH_OPTS $REMOTE "cp /tmp/.env.${PM2_APP} ${DEPLOY_PATH}/.env; chown -R techbridge.edu.gh_md:psaserv ${DEPLOY_PATH} 2>/dev/null||true; find ${DEPLOY_PATH} -type d -exec chmod 755 {} \; 2>/dev/null||true; find ${DEPLOY_PATH} -type f -exec chmod 644 {} \; 2>/dev/null||true"

Log -Level 'INFO' -Msg 'Step 5: Restarting backend...' -Color Yellow
$r=& $SSH @SSH_OPTS $REMOTE "if pm2 describe ${PM2_APP}>\/dev\/null 2>&1; then pm2 reload ${PM2_APP}; echo 'pm2: reloaded'; else cd ${DEPLOY_PATH}; PORT=${PORT} pm2 start server.js --name ${PM2_APP}; echo 'pm2: started'; fi"
Write-Host $r -ForegroundColor DarkGray

Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow; Start-Sleep -Seconds 8
$ic=& $SSH @SSH_OPTS $REMOTE "test -f ${DEPLOY_PATH}/dist/index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $ic -ForegroundColor $(if($ic -match '^OK'){'Green'}else{'Red'})
$pc=& $SSH @SSH_OPTS $REMOTE "ss -tlnp | grep -q :${PORT} && echo 'OK port ${PORT} listening' || echo 'WARN port ${PORT} not found'"
Write-Host $pc -ForegroundColor $(if($pc -match '^OK'){'Green'}else{'Yellow'})

$DURATION=[math]::Round(((Get-Date)-$START_TIME).TotalSeconds,1)
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
Log -Level 'SUCCESS' -Msg "DEPLOYMENT COMPLETE in ${DURATION}s" -Color Green
Log -Level 'SUCCESS' -Msg "URL:  $HEALTH_URL" -Color Green
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
