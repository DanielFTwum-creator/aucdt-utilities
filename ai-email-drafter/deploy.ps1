# ============================================================
# ai-email-drafter — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-email-drafter/
# Port   : 3007  |  PM2 app: ai-email-drafter
# Usage  : .\deploy.ps1 [-Build]
# ============================================================

param(
    [string]$RemoteHost = 'root@techbridge.edu.gh',
    [string]$RemotePath = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-email-drafter/',
    [switch]$Build = $false
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$PORT        = 3007
$PM2_APP     = 'ai-email-drafter'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/ai-email-drafter/'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'ai-email-drafter'
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
Log -Level 'INFO' -Msg 'AI-EMAIL-DRAFTER DEPLOYMENT'            -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $RemoteHost"
Log -Level 'INFO' -Msg "Path   : $RemotePath"
Log -Level 'INFO' -Msg ''

# Step 0: Approval gate
Log -Level 'INFO' -Msg 'Step 0: Approval gate...' -Color Yellow
$gate = Join-Path $PSScriptRoot '..\Approve-App.ps1'
if (Test-Path $gate) {
    & $gate -Path $PSScriptRoot -PreBuild
    if ($LASTEXITCODE -ne 0) { Log -Level 'ERROR' -Msg 'Approval gate REJECTED — fix issues above before deploying.' -Color Red; exit 1 }
} else { Log -Level 'WARN' -Msg 'Approve-App.ps1 not found — skipping gate' -Color Yellow }

# Step 1: Pre-flight
Log -Level 'INFO' -Msg 'Step 1: Pre-flight checks...' -Color Yellow
if ((-not (Test-Path '.env.local')) -and (-not $Build)) {
    Log -Level 'WARN' -Msg 'No .env.local found - continuing (static deploy)' -Color Yellow
} elseif (Test-Path '.env.local') {
    Log -Level 'SUCCESS' -Msg 'Pre-flight OK (.env.local found)' -Color Green
} else {
    Log -Level 'SUCCESS' -Msg 'Pre-flight OK' -Color Green
}

# Step 2: Git state
Log -Level 'INFO' -Msg 'Step 2: Verifying git state...' -Color Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log -Level 'INFO' -Msg "Commit : $commit on $branch"

# Step 3: Build or copy
if ($Build) {
    Log -Level 'INFO' -Msg 'Step 3: Server-side build (git clone + pnpm build)...' -Color Yellow

    # Upload .env.local for the BUILD
    if (Test-Path '.env.local') {
        & $SCP @SSH_OPTS '.env.local' "${RemoteHost}:/tmp/.env.${PM2_APP}.build" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { Log -Level 'SUCCESS' -Msg 'build .env.local uploaded' -Color Green }
        else { Log -Level 'ERROR' -Msg 'Failed to upload build .env.local' -Color Red; exit 1 }
    } else {
        Log -Level 'WARN' -Msg 'No .env.local - build will lack VITE_ vars (login may break)' -Color Yellow
    }

    $buildDir = "/tmp/${SUBFOLDER}_deploy_${commit}"
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
TMPDIR=${buildDir}
DEPLOY_PATH=${RemotePath}
REPO=${GITHUB_REPO}

log() {
  NOW=`$(date '+%Y-%m-%d %H:%M:%S')
  echo "[`$NOW][SERVER] `$1"
}

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
log "pnpm `$(pnpm --version)"

log '[1/5] Cleaning previous temp build...'
rm -rf "`$TMPDIR"
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true

log '[2/5] Cloning ${SUBFOLDER} (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse "`$REPO" "`$TMPDIR"
cd "`$TMPDIR"
git sparse-checkout set ${SUBFOLDER}
cd ${SUBFOLDER}

log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile 2>&1 | tail -5 || true

# Inject build-time env
if [ -f /tmp/.env.${PM2_APP}.build ]; then
  cp /tmp/.env.${PM2_APP}.build .env.local
  log 'injected build .env.local (VITE_ vars available to Vite)'
else
  log 'WARN: no build .env.local - VITE_ vars will be empty in bundle'
fi

log '[4/5] Building...'
./node_modules/.bin/vite build

log '[5/5] Deploying dist/ to web root...'
mkdir -p "`$DEPLOY_PATH"
rsync -a --delete --exclude='.env' --exclude='node_modules/' --exclude='server.ts' --exclude='server.cjs' --exclude='server.js' --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='pnpm-workspace.yaml' --exclude='ecosystem.config.js' --exclude='.htaccess' dist/. "`$DEPLOY_PATH"

log 'Build and deploy complete.'
"@


    $localBuildScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "email-drafter_build_$([Guid]::NewGuid().ToString('N')).sh")
    Write-LfFile -path $localBuildScript -content $remoteBuildScript
    & $SCP @SSH_OPTS $localBuildScript "${RemoteHost}:/tmp/email-drafter_build.sh"
    if ($LASTEXITCODE -ne 0) {
        Log -Level 'ERROR' -Msg 'Failed to upload remote build script' -Color Red
        Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
        exit 1
    }
    $BuildTimeoutSec = 600
    & $SSH @SSH_OPTS $RemoteHost "timeout $BuildTimeoutSec bash /tmp/email-drafter_build.sh"
    $buildExit = $LASTEXITCODE
    if ($buildExit -eq 124) { Log -Level 'ERROR' -Msg "Server build exceeded ${BuildTimeoutSec}s and was aborted" -Color Red }
    Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
    & $SSH @SSH_OPTS $RemoteHost 'rm -f /tmp/email-drafter_build.sh' 2>$null

    if ($buildExit -ne 0) {
        Log -Level 'ERROR' -Msg "Remote build failed with exit code $buildExit" -Color Red
        exit 1
    }
    Log -Level 'SUCCESS' -Msg 'Server-side build and file sync complete' -Color Green
} else {
    Log -Level 'INFO' -Msg 'Step 3: Copying local dist/ to server...' -Color Yellow
    if (-not (Test-Path 'dist')) {
        Log -Level 'ERROR' -Msg 'dist/ not found - run with -Build flag.' -Color Red
        exit 1
    }
    & $SSH @SSH_OPTS $RemoteHost "mkdir -p $RemotePath && rm -rf ${RemotePath}assets"
    & $SCP @SSH_OPTS -r dist/* "${RemoteHost}:${RemotePath}"
    Log -Level 'SUCCESS' -Msg 'dist/* copied to server' -Color Green
}

# Step 4: .htaccess
Log -Level 'INFO' -Msg 'Step 4: Writing .htaccess...' -Color Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-email-drafter/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /ai-email-drafter/index.html [QSA,L]
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'no-cache, no-store, must-revalidate'
    Header set Pragma 'no-cache'
    Header set Expires '0'
  </FilesMatch>
</IfModule>
'@
$localHtaccess = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "email-drafter_htaccess_$([Guid]::NewGuid().ToString('N')).txt")
Write-LfFile -path $localHtaccess -content $htaccessContent
& $SCP @SSH_OPTS $localHtaccess "${RemoteHost}:${RemotePath}.htaccess"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload .htaccess' -Color Red
    Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue
    exit 1
}
Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue

# Step 5: Setting permissions
Log -Level 'INFO' -Msg 'Step 5: Setting permissions...' -Color Yellow
& $SSH @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 644 ${RemotePath}.htaccess 2>/dev/null; true" | Out-Null

# Step 6: Deploying backend files
Log -Level 'INFO' -Msg 'Step 6: Deploying backend files...' -Color Yellow
& $SCP @SSH_OPTS server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
if (Test-Path '.env.local') {
    & $SCP @SSH_OPTS '.env.local' "${RemoteHost}:${RemotePath}.env" 2>$null | Out-Null
}
$step6Script = "export NVM_DIR=`"`$HOME/.nvm`"; [ -s `"`$NVM_DIR/nvm.sh`" ] && . `"`$NVM_DIR/nvm.sh`"; nvm use --lts >/dev/null 2>&1 || true; cd $RemotePath && timeout 120 pnpm install --prod 2>&1 | tail -10 || timeout 120 npm install --omit=dev 2>&1 | tail -10"
& $SSH @SSH_OPTS $RemoteHost $step6Script

# Step 7: Restarting backend
Log -Level 'INFO' -Msg 'Step 7: Restarting backend (PM2)...' -Color Yellow
$pm2Result = & $SSH @SSH_OPTS $RemoteHost "if pm2 describe ${PM2_APP} > /dev/null 2>&1; then pm2 reload ${PM2_APP} --update-env; echo 'pm2: reloaded ${PM2_APP}'; else cd ${RemotePath} && NODE_ENV=production PORT=${PORT} pm2 start server.ts --name ${PM2_APP} --interpreter npx --interpreter-args tsx --cwd ${RemotePath}; echo 'pm2: started ${PM2_APP}'; fi; pm2 save --force > /dev/null 2>&1 || true"
Write-Host $pm2Result -ForegroundColor DarkGray

# Health check
Log -Level 'INFO' -Msg 'Health check...' -Color Yellow
Start-Sleep -Seconds 5
$indexCheck = & $SSH @SSH_OPTS $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $indexCheck -ForegroundColor $(if ($indexCheck -match '^OK') { 'Green' } else { 'Red' })
$portCheck = & $SSH @SSH_OPTS $RemoteHost "ss -tlnp | grep -q ':${PORT}' && echo 'OK port ${PORT} listening' || echo 'WARN port ${PORT} not found'"
Write-Host $portCheck -ForegroundColor $(if ($portCheck -match '^OK') { 'Green' } else { 'Yellow' })

$DURATION = [math]::Round(((Get-Date) - $START_TIME).TotalSeconds, 1)
$timeStr  = if ($DURATION -ge 60) { "$([math]::Floor($DURATION/60))m $([math]::Round($DURATION%60,1))s" } else { "${DURATION}s" }
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
Log -Level 'SUCCESS' -Msg 'DEPLOYMENT COMPLETE'                     -Color Green
Log -Level 'SUCCESS' -Msg "URL  : $HEALTH_URL"                      -Color Green
Log -Level 'SUCCESS' -Msg "Time : $timeStr total"                   -Color Green
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
