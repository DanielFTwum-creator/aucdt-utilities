# ============================================================
# Glucose — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/
# Port   : 3006  |  PM2 app: glucose
# Usage  : .\deploy.ps1 [-Build]
# ============================================================

param(
    [string]$RemoteHost = 'root@techbridge.edu.gh',
    [string]$RemotePath = '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/',
    [switch]$Build = $false
)

$ErrorActionPreference = 'Stop'

$PORT        = 3006
$PM2_APP     = 'glucose'
$HEALTH_URL  = 'https://ai-tools.techbridge.edu.gh/glucose'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'glucose'
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
Log -Level 'INFO' -Msg 'GLUCOSE DEPLOYMENT'                      -Color Cyan
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
    Log -Level 'WARN' -Msg 'No .env.local found — continuing (static deploy)' -Color Yellow
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

    # Upload .env.local so the server-side build can bake VITE_* vars
    # (e.g. VITE_GOOGLE_CLIENT_ID) into the bundle. Without this the build
    # runs with no env and OAuth gets client_id=undefined.
    if (Test-Path '.env.local') {
        & $SCP @SSH_OPTS '.env.local' "${RemoteHost}:/tmp/.env.${SUBFOLDER}" 2>$null | Out-Null
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
pnpm install --no-frozen-lockfile || true

log '[3.5/5] Injecting .env.local for Vite build (VITE_* vars)...'
cp /tmp/.env.${SUBFOLDER} .env.local 2>/dev/null || true

log '[4/5] Building...'
./node_modules/.bin/vite build

log '[5/5] Deploying dist/ to web root...'
mkdir -p "`$DEPLOY_PATH"
rsync -a --delete --exclude='.env' --exclude='.env.local' --exclude='data/' --exclude='node_modules/' --exclude='server.ts' --exclude='server.cjs' --exclude='server.js' --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='pnpm-workspace.yaml' --exclude='ecosystem.config.js' --exclude='.htaccess' dist/. "`$DEPLOY_PATH"

log 'Build and deploy complete.'
"@

    $localBuildScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "glucose_build_$([Guid]::NewGuid().ToString('N')).sh")
    Write-LfFile -path $localBuildScript -content $remoteBuildScript
    & $SCP @SSH_OPTS $localBuildScript "${RemoteHost}:/tmp/glucose_build.sh"
    if ($LASTEXITCODE -ne 0) {
        Log -Level 'ERROR' -Msg 'Failed to upload remote build script' -Color Red
        Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
        exit 1
    }
    & $SSH @SSH_OPTS $RemoteHost 'bash /tmp/glucose_build.sh'
    $buildExit = $LASTEXITCODE
    Remove-Item -Path $localBuildScript -Force -ErrorAction SilentlyContinue
    & $SSH @SSH_OPTS $RemoteHost 'rm -f /tmp/glucose_build.sh' 2>$null

    if ($buildExit -ne 0) {
        Log -Level 'ERROR' -Msg "Remote build failed with exit code $buildExit" -Color Red
        exit 1
    }
    Log -Level 'SUCCESS' -Msg 'Server-side build and file sync complete' -Color Green
} else {
    Log -Level 'INFO' -Msg 'Step 3: Copying local dist/ to server...' -Color Yellow
    if (-not (Test-Path 'dist')) {
        Log -Level 'ERROR' -Msg 'dist/ not found — run with -Build flag.' -Color Red
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
  RewriteBase /glucose/

  # Proxy API requests to PM2 running on port 3006
  RewriteCond %{REQUEST_URI} ^/glucose/api/ [NC,OR]
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L,NC]

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
$localHtaccess = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "glucose_htaccess_$([Guid]::NewGuid().ToString('N')).txt")
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
& $SCP @SSH_OPTS server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
if (Test-Path '.env.local') {
    & $SCP @SSH_OPTS '.env.local' "${RemoteHost}:${RemotePath}.env.local" 2>$null | Out-Null
}
# Key custody (Pattern 11 fleet standard): the app relays via WMS and must never hold a
# raw GEMINI_API_KEY. Strip it and inject GEMINI_PROXY_KEY from WMS custody
# (/opt/tuc-wms/.env), BOM/CR/null-stripped (Pattern 21); no bash loop vars (Pattern 20).
$envInject = & $SSH @SSH_OPTS $RemoteHost "touch ${RemotePath}.env.local; sed -i '/^GEMINI_API_KEY=/d;/^VITE_GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' ${RemotePath}.env.local; K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g'); if [ -n `"`$K`" ]; then printf 'GEMINI_PROXY_KEY=%s\n' `"`$K`" >> ${RemotePath}.env.local; echo 'env: GEMINI_PROXY_KEY injected'; else echo 'WARN: GEMINI_PROXY_KEY not found in WMS'; fi; chmod 600 ${RemotePath}.env.local"
Write-Host $envInject -ForegroundColor DarkGray
if ($envInject -match 'WARN') { Log -Level 'ERROR' -Msg 'GEMINI_PROXY_KEY unavailable — scan route would 503. Aborting.' -Color Red; exit 1 }
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
& $SSH @SSH_OPTS $RemoteHost "$nvmPrefix; cd ${RemotePath} && pnpm install --prod --silent"

# Step 7: Restart backend (hard delete + start, Pattern 23)
# pm2 reload/restart --update-env keeps a stale env (old GEMINI_PROXY_KEY -> WMS 401)
# AND stale tsx-transpiled server.ts. Hard delete + fresh start is the only reliable way
# to pick up a changed env var or edited backend; then assert the new banner.
Log -Level 'INFO' -Msg 'Step 7: Restarting backend (hard delete + start, Pattern 23)...' -Color Yellow
$pm2StartScript = @"
export NVM_DIR="`$HOME/.nvm"; [ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true
NPXPATH=`$(which npx)
pm2 delete ${PM2_APP} > /dev/null 2>&1 || true
cd ${RemotePath} && NODE_ENV=production PORT=${PORT} pm2 start ${RemotePath}server.ts \
  --name ${PM2_APP} \
  --interpreter "`$NPXPATH" \
  --interpreter-args tsx \
  --cwd ${RemotePath} \
  --max-memory-restart 1G
echo 'pm2: started ${PM2_APP}'
pm2 save --force > /dev/null 2>&1 || true
sleep 3
pm2 logs ${PM2_APP} --lines 20 --nostream 2>&1 | grep -q 'WMS relay listening' && echo 'OK new build running' || echo 'WARN stale build — banner not found'
"@
$b64pm2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pm2StartScript.Replace("`r", "")))
$pm2Result = & $SSH @SSH_OPTS $RemoteHost "echo $b64pm2 | base64 -d | bash"
Write-Host $pm2Result -ForegroundColor DarkGray
if ($pm2Result -match 'WARN stale build') { Log -Level 'ERROR' -Msg 'PM2 running stale code — investigate.' -Color Red; exit 5 }

# Health checks
Log -Level 'INFO' -Msg 'Health checks...' -Color Yellow
Start-Sleep -Seconds 5

$indexCheck = & $SSH @SSH_OPTS $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $indexCheck -ForegroundColor $(if ($indexCheck -match '^OK') { 'Green' } else { 'Red' })

$portCheck = & $SSH @SSH_OPTS $RemoteHost "ss -tlnp | grep -q ':${PORT}' && echo 'OK port ${PORT} listening' || echo 'WARN port ${PORT} not found'"
Write-Host $portCheck -ForegroundColor $(if ($portCheck -match '^OK') { 'Green' } else { 'Yellow' })

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$timeStr = if ($elapsed -ge 60) { "$([math]::Floor($elapsed / 60))m $([math]::Round($elapsed % 60, 1))s" } else { "${elapsed}s" }
Log -Level 'SUCCESS' -Msg '========================================' -Color Green
Log -Level 'SUCCESS' -Msg "DEPLOYMENT COMPLETE in $timeStr" -Color Green
Log -Level 'SUCCESS' -Msg "URL:  https://ai-tools.techbridge.edu.gh/glucose/" -Color Green