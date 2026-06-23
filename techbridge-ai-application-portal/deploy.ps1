# ============================================================
# techbridge-ai-application-portal — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/
# Usage  : .\deploy.ps1 [-Build]
# ============================================================

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$START_TIME = Get-Date

$PM2_APP     = 'tb-ai-portal'
$GITHUB_REPO = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER   = "techbridge-ai-application-portal"
$SSH_OPTS    = @('-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes', '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3')
$SSH         = 'ssh'
$SCP         = 'scp'

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

function Write-LfFile($path, $content) {
    $content = $content -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
}

Log "INFO" "========================================" Cyan
Log "INFO" "techbridge-ai-application-portal DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

# Step 0: Approval gate
Log -Level 'INFO' -Msg 'Step 0: Approval gate...' -Color Yellow
$gate = Join-Path $PSScriptRoot '..\Approve-App.ps1'
if (Test-Path $gate) {
    & $gate -Path $PSScriptRoot -PreBuild
    if ($LASTEXITCODE -ne 0) { Log -Level 'ERROR' -Msg 'Approval gate REJECTED — fix issues above before deploying.' -Color Red; exit 1 }
} else { Log -Level 'WARN' -Msg 'Approve-App.ps1 not found — skipping gate' -Color Yellow }

# Step 1: Pre-flight checks
Log "INFO" "Step 1: Pre-flight checks..." Yellow
if ((-not (Test-Path '.env.local')) -and (-not $Build)) {
    Log "WARN" "No .env.local found - continuing (static deploy)" Yellow
} elseif (Test-Path '.env.local') {
    Log "SUCCESS" "Pre-flight OK (.env.local found)" Green
} else {
    Log "SUCCESS" "Pre-flight OK" Green
}

# Step 2: Verifying git state
Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

# Step 3: Build or copy
if ($Build) {
    Log "INFO" "Step 3: Server-side build (git clone + pnpm build)..." Yellow

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
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent

# Inject build-time env
if [ -f /tmp/.env.${PM2_APP}.build ]; then
  cp /tmp/.env.${PM2_APP}.build .env.local
  log 'injected build .env.local (VITE_ vars available to Vite)'
else
  log 'WARN: no build .env.local - VITE_ vars will be empty in bundle'
fi

log '[4/5] Building...'
pnpm build

log '[5/5] Deploying dist/ to web root...'
mkdir -p "`$DEPLOY_PATH"
rsync -a --delete dist/. "`$DEPLOY_PATH"

log 'Build and deploy complete.'
"@

    $localBuildScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tb-portal_build_$([Guid]::NewGuid().ToString('N')).sh")
    Write-LfFile -path $localBuildScript -content $remoteBuildScript
    & $SCP @SSH_OPTS $localBuildScript "${RemoteHost}:/tmp/tb-portal_build.sh"
    if ($LASTEXITCODE -ne 0) {
        Log -Level 'ERROR' -Msg 'Failed to upload remote build script' -Color Red
        Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
        exit 1
    }
    $BuildTimeoutSec = 600
    & $SSH @SSH_OPTS $RemoteHost "timeout $BuildTimeoutSec bash /tmp/tb-portal_build.sh"
    $buildExit = $LASTEXITCODE
    if ($buildExit -eq 124) { Log -Level 'ERROR' -Msg "Server build exceeded ${BuildTimeoutSec}s and was aborted" -Color Red }
    Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
    & $SSH @SSH_OPTS $RemoteHost 'rm -f /tmp/tb-portal_build.sh' 2>$null

    if ($buildExit -ne 0) {
        Log -Level 'ERROR' -Msg "Remote build failed with exit code $buildExit" -Color Red
        exit 1
    }
    Log -Level 'SUCCESS' -Msg 'Server-side build and file sync complete' -Color Green
} else {
    Log "INFO" "Step 3: Copying local dist/ to server..." Yellow
    if (-not (Test-Path "dist")) { Log "ERROR" "dist/ not found. Run with -Build flag." Red; exit 1 }
    & $SSH @SSH_OPTS $RemoteHost "mkdir -p $RemotePath && rm -rf ${RemotePath}*"
    & $SCP @SSH_OPTS -r dist/* "${RemoteHost}:${RemotePath}"
    Log "SUCCESS" "dist/* copied to server" Green
}

# Step 4: Writing .htaccess
Log "INFO" "Step 4: Writing .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$">
    ExpiresDefault "max-age=31536000"
    Header set Cache-Control "public, immutable"
  </FilesMatch>
  <FilesMatch "\.(html|json)$">
    ExpiresDefault "max-age=0"
    Header set Cache-Control "public, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(html)$">
    Header set Cache-Control "public, must-revalidate, max-age=0"
  </FilesMatch>
</IfModule>
'@
$localHtaccess = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tb-portal_htaccess_$([Guid]::NewGuid().ToString('N')).txt")
Write-LfFile -path $localHtaccess -content $htaccessContent
& $SCP @SSH_OPTS $localHtaccess "${RemoteHost}:${RemotePath}.htaccess"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload .htaccess' -Color Red
    Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue
    exit 1
}
Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue

# Step 5: Setting permissions
Log "INFO" "Step 5: Setting permissions..." Yellow
& $SSH @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 644 ${RemotePath}.htaccess 2>/dev/null; true" | Out-Null

# Health check
Log "INFO" "Health check..." Yellow
$indexCheck = & $SSH @SSH_OPTS $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $indexCheck -ForegroundColor $(if ($indexCheck -match '^OK') { 'Green' } else { 'Red' })

$elapsed = [math]::Round(((Get-Date) - $START_TIME).TotalSeconds, 1)
$timeStr = if ($elapsed -ge 60) { "$([math]::Floor($elapsed/60))m $([math]::Round($elapsed%60,1))s" } else { "${elapsed}s" }
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "URL  : https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/" Green
Log "SUCCESS" "Time : $timeStr total" Green
Log "SUCCESS" "========================================" Green
