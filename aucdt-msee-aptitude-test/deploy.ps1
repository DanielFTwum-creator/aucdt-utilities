# aucdt-msee-aptitude-test — Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/aucdt-msee-aptitude-test/
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/aucdt-msee-aptitude-test/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "aucdt-msee-aptitude-test"
$PORT          = 3011
$PM2_APP       = "aucdt-msee-aptitude-test"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "aucdt-msee-aptitude-test DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

Log "INFO" "Step 1: Pre-flight checks..." Yellow
if (-not (Test-Path ".env.local")) { Log "ERROR" ".env.local not found" Red; exit 1 }
$envContent = Get-Content ".env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") { Log "ERROR" "VITE_GOOGLE_CLIENT_ID missing in .env.local" Red; exit 1 }
if ($envContent -notmatch "GOOGLE_CLIENT_SECRET") { Log "ERROR" "GOOGLE_CLIENT_SECRET missing in .env.local" Red; exit 1 }
Log "SUCCESS" "Pre-flight OK (OAuth credentials verified)" Green

Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

if ($Build) {
    Log "INFO" "Step 3: Server-side build (git clone + pnpm build)..." Yellow
    $buildDir = "/tmp/aucdt-msee-aptitude-test_deploy_$commit"
    $serverScript = @"
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
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
log "pnpm `$(pnpm --version)"
log '[1/5] Cleaning previous temp build...'
rm -rf $buildDir
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true
log '[2/5] Cloning aucdt-msee-aptitude-test (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set aucdt-msee-aptitude-test
cd aucdt-msee-aptitude-test
log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent
log '[3.5/5] Embedding VITE_GOOGLE_CLIENT_ID (public client id) from WMS custody...'
CID=`$(grep '^GOOGLE_CLIENT_ID=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000')
if [ -n "`$CID" ]; then printf 'VITE_GOOGLE_CLIENT_ID=%s\n' "`$CID" > .env.local; echo '  VITE_GOOGLE_CLIENT_ID embedded'; else echo '  WARN: GOOGLE_CLIENT_ID not found in /opt/tuc-wms/.env'; fi
log '[4/5] Building...'
pnpm build
if ! grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' dist/index.html; then echo '[FATAL] dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy.'; exit 1; fi
log '[5/5] Deploying dist/ to web root...'
mkdir -p $RemotePath
rsync -a --delete --exclude='.env' --exclude='node_modules/' --exclude='server.ts' --exclude='server.cjs' --exclude='server.js' --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='pnpm-workspace.yaml' --exclude='ecosystem.config.js' --exclude='.htaccess' dist/. $RemotePath
# Backend from the SAME fresh main clone as the frontend, so server.js can never
# lag behind main (the "frontend-from-main, backend-from-stale-local" split that
# left the sub-path static mount missing). Step 6 no longer scps server.js from
# the local checkout when -Build is used.
log 'Deploying backend (server.js + manifests) from the fresh clone...'
cp server.js package.json pnpm-lock.yaml pnpm-workspace.yaml $RemotePath 2>/dev/null || true
log 'Build and deploy complete.'
"@
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64 | base64 -d | bash"
    if ($LASTEXITCODE -eq 0) { Log "SUCCESS" "Server-side build and file sync complete" Green }
    else { Log "ERROR" "Server build returned $LASTEXITCODE — aborting (Pattern 25: a failed build must not ship)" Red; exit 3 }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null
} else {
    Log "INFO" "Step 3: Copying local dist/ to server..." Yellow
    if (-not (Test-Path "dist")) { Log "ERROR" "dist/ not found. Run with -Build flag." Red; exit 1 }
    if (-not (Select-String -Path "dist/index.html" -Pattern '<script[^>]+(src="[^"]*\.js"|type="module")' -Quiet)) { Log "ERROR" "dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy." Red; exit 1 }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p $RemotePath && rm -rf ${RemotePath}assets"
    scp -r -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 dist/* "${RemoteHost}:${RemotePath}"
    Log "SUCCESS" "dist/* copied to server" Green
}

Log "INFO" "Step 4: Writing .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /aucdt-msee-aptitude-test/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /aucdt-msee-aptitude-test/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "cat > ${RemotePath}.htaccess" 2>$null

Log "INFO" "Step 5: Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 644 ${RemotePath}.htaccess 2>/dev/null; true" | Out-Null

Log "INFO" "Step 6: Deploying backend files..." Yellow
# In -Build mode the backend already came from the fresh main clone (Step 3), so do
# NOT overwrite it with the local checkout, which may lag main. Only the non-Build
# path (which ships local dist/) needs to push the local server.js here.
if (-not $Build) {
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.js package.json pnpm-lock.yaml pnpm-workspace.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
}
if (Test-Path ".env.local") { scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 ".env.local" "${RemoteHost}:${RemotePath}.env" 2>$null | Out-Null }
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "$nvmPrefix; cd $RemotePath && CI=true pnpm install --prod --silent"

# Pattern 25 stage 7: the server .env may still carry a raw GEMINI_API_KEY.
# Strip it and inject GEMINI_PROXY_KEY from WMS custody (/opt/tuc-wms/.env),
# BOM/CR/null-stripped (Pattern 21). The key never exists on the dev machine.
$envInject = ssh -o StrictHostKeyChecking=no $RemoteHost "touch ${RemotePath}.env; sed -i '/^GEMINI_API_KEY=/d;/^VITE_GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' ${RemotePath}.env; K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g'); if [ -n `"`$K`" ]; then printf 'GEMINI_PROXY_KEY=%s\n' `"`$K`" >> ${RemotePath}.env; echo 'env: GEMINI_PROXY_KEY injected'; else echo 'WARN: GEMINI_PROXY_KEY not found in WMS'; fi; chmod 600 ${RemotePath}.env"
Write-Host $envInject -ForegroundColor DarkGray
if ($envInject -match 'WARN') { Log "ERROR" "GEMINI_PROXY_KEY unavailable — AI routes would 503. Aborting." Red; exit 1 }

Log "INFO" "Step 7: Restarting backend (PM2)..." Yellow
$restartCmd = @"
if command -v pm2 &>/dev/null; then
  if pm2 describe aucdt-msee-aptitude-test &>/dev/null; then
    pm2 delete aucdt-msee-aptitude-test >/dev/null 2>&1
  fi
  cd $RemotePath && NODE_ENV=production PORT=3011 pm2 start server.js --name aucdt-msee-aptitude-test --interpreter npx --interpreter-args tsx --cwd $RemotePath >/dev/null
  echo 'pm2: started aucdt-msee-aptitude-test'
  pm2 save --force &>/dev/null
fi
"@
$b64r = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartCmd.Replace("`r", "")))
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64r | base64 -d | bash"

Log "INFO" "Health check..." Yellow
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'FAIL index.html missing'"
$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "DEPLOYMENT COMPLETE in ${elapsed}s — $RemotePath" Green
