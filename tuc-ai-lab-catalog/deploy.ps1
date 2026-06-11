# ============================================================
# TUC AI Lab Catalog - Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/
# Port   : 3003  |  PM2 app: tuc-ai-lab
# Usage  : .\deploy.ps1 [-Build]
# ============================================================

param(
    [string]$RemoteHost = 'root@techbridge.edu.gh',
    [string]$RemotePath = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/',
    [switch]$Build = $false
)

$ErrorActionPreference = 'Stop'

$PORT        = 3003
$PM2_APP     = 'tuc-ai-lab'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/ai-lab'
$GITHUB_REPO = 'https://github.com/DanielFTwum-creator/aucdt-utilities'
$SUBFOLDER   = 'tuc-ai-lab-catalog'
$SSH_OPTS    = @('-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes')
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
Log -Level 'INFO' -Msg 'TUC AI LAB CATALOG DEPLOYMENT'           -Color Cyan
Log -Level 'INFO' -Msg '========================================' -Color Cyan
Log -Level 'INFO' -Msg "Remote : $RemoteHost"
Log -Level 'INFO' -Msg "Path   : $RemotePath"
Log -Level 'INFO' -Msg ''

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
try {
    git push origin $branch 2>&1 | Out-Null
    Log -Level 'INFO' -Msg "Pushed $branch to GitHub" -Color DarkGray
} catch {
    Log -Level 'WARN' -Msg 'git push failed (non-fatal) - server will clone existing HEAD' -Color Yellow
}

# Step 3: Build or copy
if ($Build) {
    Log -Level 'INFO' -Msg 'Step 3: Server-side build (git clone + pnpm build)...' -Color Yellow

    # Upload .env.local for the BUILD (Vite loadEnv needs VITE_GOOGLE_CLIENT_ID at
    # build time to inline it; without this the bundle ships an empty client id and
    # Google login silently fails).
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

# Inject build-time env so Vite loadEnv can inline VITE_GOOGLE_CLIENT_ID etc.
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
# --delete prunes stale frontend assets, but the webroot is SHARED with the
# live backend (.env / server.ts / node_modules / package files / .htaccess).
# The excludes protect those from both overwrite and deletion - without them an
# interrupted run leaves the backend gutted (2026-06-10 fleet-wide 502 incident).
rsync -a --delete \
  --exclude='.env' --exclude='node_modules/' --exclude='server.ts' \
  --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='.htaccess' \
  dist/. "`$DEPLOY_PATH"

log 'Build and deploy complete.'
"@

    $localBuildScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tuc-ai-lab_build_$([Guid]::NewGuid().ToString('N')).sh")
    Write-LfFile -path $localBuildScript -content $remoteBuildScript
    & $SCP @SSH_OPTS $localBuildScript "${RemoteHost}:/tmp/tuc-ai-lab_build.sh"
    if ($LASTEXITCODE -ne 0) {
        Log -Level 'ERROR' -Msg 'Failed to upload remote build script' -Color Red
        Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
        exit 1
    }
    # Cap the server-side build so a stalled pnpm install/build can't hang forever (GNU timeout -> exit 124).
    $BuildTimeoutSec = 600
    & $SSH @SSH_OPTS $RemoteHost "timeout $BuildTimeoutSec bash /tmp/tuc-ai-lab_build.sh"
    $buildExit = $LASTEXITCODE
    if ($buildExit -eq 124) { Log -Level 'ERROR' -Msg "Server build exceeded ${BuildTimeoutSec}s and was aborted - slow box / retry" -Color Red }
    Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
    & $SSH @SSH_OPTS $RemoteHost 'rm -f /tmp/tuc-ai-lab_build.sh' 2>$null

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
    # Never `rm -rf ${RemotePath}*` - the webroot is shared with the live backend
    # (.env / server.ts / node_modules / package files). Stage dist/ in /tmp and
    # server-side rsync with the same protective excludes as the -Build path.
    $stageDir = "/tmp/${PM2_APP}_dist_${commit}"
    & $SSH @SSH_OPTS $RemoteHost "rm -rf $stageDir && mkdir -p $RemotePath"
    & $SCP @SSH_OPTS -r dist "${RemoteHost}:${stageDir}"
    if ($LASTEXITCODE -ne 0) { Log -Level 'ERROR' -Msg 'Failed to stage dist/ on server' -Color Red; exit 1 }
    & $SSH @SSH_OPTS $RemoteHost "rsync -a --delete --exclude='.env' --exclude='node_modules/' --exclude='server.ts' --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='.htaccess' $stageDir/ $RemotePath && rm -rf $stageDir"
    if ($LASTEXITCODE -ne 0) { Log -Level 'ERROR' -Msg 'Server-side rsync failed' -Color Red; exit 1 }
    Log -Level 'SUCCESS' -Msg 'dist/* synced to server (backend files protected)' -Color Green
}

# Step 4: .htaccess
Log -Level 'INFO' -Msg 'Step 4: Writing .htaccess...' -Color Yellow
$htaccessContent = @(
  "<IfModule mod_rewrite.c>",
  "  RewriteEngine On",
  "  RewriteBase /ai-lab/",
  "  RewriteCond %{REQUEST_FILENAME} -f [OR]",
  "  RewriteCond %{REQUEST_FILENAME} -d",
  "  RewriteRule ^ - [L]",
  "  RewriteRule ^ /ai-lab/index.html [QSA,L]",
  "</IfModule>",
  "<IfModule mod_expires.c>",
  "  ExpiresActive On",
  "  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)`$'>",
  "    ExpiresDefault 'max-age=31536000'",
  "    Header set Cache-Control 'public, immutable'",
  "  </FilesMatch>",
  "  <FilesMatch '\.(html|json)`$'>",
  "    ExpiresDefault 'max-age=0'",
  "    Header set Cache-Control 'no-cache, no-store, must-revalidate'",
  "    Header set Pragma 'no-cache'",
  "    Header set Expires '0'",
  "  </FilesMatch>",
  "</IfModule>"
) -join "`n"
$localHtaccess = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "tuc-ai-lab_htaccess_$([Guid]::NewGuid().ToString('N')).txt")
Write-LfFile -path $localHtaccess -content $htaccessContent
& $SCP @SSH_OPTS $localHtaccess "${RemoteHost}:${RemotePath}.htaccess"
if ($LASTEXITCODE -ne 0) {
    Log -Level 'ERROR' -Msg 'Failed to upload .htaccess' -Color Red
    Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue
    exit 1
}
Remove-Item -Path $localHtaccess -Force -ErrorAction SilentlyContinue

# Step 5: Permissions
Log -Level 'INFO' -Msg 'Step 5: Setting permissions...' -Color Yellow
& $SSH @SSH_OPTS $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 644 ${RemotePath}.htaccess 2>/dev/null; true" | Out-Null

# Step 6: Backend files
Log -Level 'INFO' -Msg 'Step 6: Deploying backend files...' -Color Yellow
& $SCP @SSH_OPTS server.ts package.json pnpm-lock.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
if (Test-Path '.env.local') {
    & $SCP @SSH_OPTS '.env.local' "${RemoteHost}:${RemotePath}.env" 2>$null | Out-Null
}
& $SSH @SSH_OPTS $RemoteHost "cd $RemotePath && pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent"

# Step 7: Restart backend
Log -Level 'INFO' -Msg 'Step 7: Restarting backend (PM2)...' -Color Yellow
$pm2Result = & $SSH @SSH_OPTS $RemoteHost "if pm2 describe ${PM2_APP} > /dev/null 2>&1; then pm2 reload ${PM2_APP} --update-env; echo 'pm2: reloaded ${PM2_APP}'; else cd ${RemotePath} && NODE_ENV=production PORT=${PORT} pm2 start server.ts --name ${PM2_APP} --interpreter npx --interpreter-args tsx; echo 'pm2: started ${PM2_APP}'; fi; pm2 save --force > /dev/null 2>&1 || true"
Write-Host $pm2Result -ForegroundColor DarkGray

# Health checks
Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow
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
