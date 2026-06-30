# enhanced-youtube-genie — Deploy Script (Node/PM2, mirrors dfs-website)
# URL  : https://ai-tools.techbridge.edu.gh/youtube-genie/
# Port : 3028  |  PM2 app: youtube-genie
# Usage: .\deploy.ps1 -Build
#
# Server-side build, then runs server.ts under PM2 (Gemini relay -> WMS proxy).
# The SPA is served by the Node server; nginx must proxy /youtube-genie/api/ -> :3028.

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/youtube-genie",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "enhanced-youtube-genie"
$PORT          = 3028
$PM2_APP       = "youtube-genie"

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
Log "INFO" "enhanced-youtube-genie DEPLOYMENT (Node/PM2)" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" "Port   : $PORT  PM2: $PM2_APP"
Log "INFO" ""

Log "INFO" "Step 1: Pre-flight checks..." Yellow
if (-not (Test-Path ".env.local")) { Log "ERROR" ".env.local not found" Red; exit 1 }
$envContent = Get-Content ".env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") { Log "ERROR" "VITE_GOOGLE_CLIENT_ID missing in .env.local" Red; exit 1 }
if ($envContent -notmatch "GOOGLE_CLIENT_SECRET")  { Log "ERROR" "GOOGLE_CLIENT_SECRET missing in .env.local" Red; exit 1 }
Log "SUCCESS" "Pre-flight OK (OAuth credentials verified)" Green

Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

if (-not $Build) { Log "ERROR" "Run with -Build (server-side build + PM2 run)." Red; exit 1 }

# Upload the build .env (Vite needs the public OAuth vars at build time).
Log "INFO" "Uploading .env to server for build..." DarkGray
scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 .env.local "${RemoteHost}:/tmp/.env.youtube-genie" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Log "ERROR" "Failed to upload .env.local" Red; exit 1 }
Log "SUCCESS" ".env uploaded" Green

Log "INFO" "Step 3: Server-side build + PM2 run..." Yellow
$remoteScript = @"
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
TMPDIR=/tmp/${SUBFOLDER}_deploy_${commit}
DEPLOY=${RemotePath}
REPO=${GITHUB_REPO}
PORT=${PORT}
PM2_APP=${PM2_APP}
trap 'rm -rf "`$TMPDIR"' EXIT
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }

log "pnpm `$(pnpm --version 2>/dev/null || echo missing)"

log '[1/7] Clone (sparse, depth 1)...'
rm -rf "`$TMPDIR"
git clone --filter=blob:none --sparse --depth 1 "`$REPO" "`$TMPDIR"
cd "`$TMPDIR"
git sparse-checkout set ${SUBFOLDER}
cd ${SUBFOLDER}

log '[2/7] Inject .env.local for Vite build...'
cp /tmp/.env.youtube-genie .env.local

log '[3/7] Install (full) + build...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent
pnpm build

log '[4/7] Sync built SPA to deploy path (keep backend files + .env)...'
mkdir -p "`$DEPLOY"
rsync -a --delete \
  --exclude 'server.ts' --exclude 'package.json' --exclude 'pnpm-lock.yaml' \
  --exclude 'pnpm-workspace.yaml' --exclude 'node_modules' --exclude '.env' \
  dist/ "`$DEPLOY/dist/"

log '[5/7] Copy backend files + install prod deps...'
cp server.ts package.json pnpm-lock.yaml "`$DEPLOY/" 2>/dev/null || true
[ -f pnpm-workspace.yaml ] && cp pnpm-workspace.yaml "`$DEPLOY/" || true
cd "`$DEPLOY"
CI=true pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent

log '[6/7] Ensure GEMINI_PROXY_KEY present in deploy .env (copied from WMS if missing)...'
touch "`$DEPLOY/.env"
if ! grep -q '^GEMINI_PROXY_KEY=' "`$DEPLOY/.env"; then
  K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | cut -d= -f2-)
  [ -n "`$K" ] && printf 'GEMINI_PROXY_KEY=%s\n' "`$K" >> "`$DEPLOY/.env" && echo 'added GEMINI_PROXY_KEY' || echo 'WARN: WMS proxy key not found'
fi
grep -q '^PORT=' "`$DEPLOY/.env" || echo "PORT=`$PORT" >> "`$DEPLOY/.env"
chmod 600 "`$DEPLOY/.env"

log '[7/7] (Re)start PM2 process from server.ts...'
cd "`$DEPLOY"
pm2 describe "`$PM2_APP" >/dev/null 2>&1 \
  && pm2 reload "`$PM2_APP" --update-env \
  || pm2 start server.ts --name "`$PM2_APP" --interpreter npx --interpreter-args tsx --cwd "`$DEPLOY"
pm2 save >/dev/null 2>&1 || true
sleep 3
pm2 describe "`$PM2_APP" | grep -E 'status|restart' | head -2
log 'Build + PM2 deploy complete.'
"@

$localScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "ytg_build_$([Guid]::NewGuid().ToString('N')).sh")
Write-LfFile -path $localScript -content $remoteScript
scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $localScript "${RemoteHost}:/tmp/ytg_build.sh" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Log "ERROR" "Failed to upload remote build script" Red; Remove-Item $localScript -Force -EA SilentlyContinue; exit 1 }
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "bash /tmp/ytg_build.sh"
$buildRc = $LASTEXITCODE
Remove-Item $localScript -Force -EA SilentlyContinue
if ($buildRc -ne 0) { Log "ERROR" "Server build/PM2 returned $buildRc" Red; exit 1 }
Log "SUCCESS" "Server-side build + PM2 run complete" Green

Log "INFO" "Step 4: Health checks..." Yellow
$portUp = ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':$PORT ' && echo yes || echo no"
Log ($(if ($portUp -eq 'yes') {'SUCCESS'} else {'WARN'})) "port $PORT listening: $portUp" ($(if ($portUp -eq 'yes') {'Green'} else {'Yellow'}))
$code = ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$PORT/api/health"
Log ($(if ($code -eq '200') {'SUCCESS'} else {'WARN'})) "backend /api/health -> $code" ($(if ($code -eq '200') {'Green'} else {'Yellow'}))

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE in ${elapsed}s" Green
Log