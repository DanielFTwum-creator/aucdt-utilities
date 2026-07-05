# english-safari — Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/english-safari/  (backend server.ts on PORT 3021, pm2 name tb-ai-english-safari)
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    # Live URL is /english-safari/ (matches nginx OAuth proxy for /english-safari/callback -> :3021 and the app .env).
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/english-safari/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "english-safari"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "english-safari DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

Log "INFO" "Step 1: Pre-flight checks..." Yellow
Log "SUCCESS" "Pre-flight OK" Green

Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

if ($Build) {
    Log "INFO" "Step 3: Server-side build (git clone + pnpm build)..." Yellow
    $buildDir = "/tmp/tb-ai-english-safari_deploy_$commit"
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
log '[2/5] Cloning english-safari (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set english-safari
cd english-safari
log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent
log '[4/5] Building...'
pnpm build
if ! grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' dist/index.html; then echo '[FATAL] dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy.'; exit 1; fi
log '[5/5] Deploying dist/ to web root...'
mkdir -p $RemotePath
rsync -a --delete --exclude='.env' --exclude='node_modules/' --exclude='server.ts' --exclude='server.cjs' --exclude='server.js' --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='pnpm-workspace.yaml' --exclude='ecosystem.config.js' --exclude='.htaccess' dist/. $RemotePath
log 'Build and deploy complete.'
"@
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64 | base64 -d | bash"
    if ($LASTEXITCODE -eq 0) { Log "SUCCESS" "Server-side build and file sync complete" Green }
    else { Log "WARN" "Server build returned $LASTEXITCODE" Yellow }
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
  RewriteBase /english-safari/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /english-safari/index.html [QSA,L]
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
scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.ts package.json pnpm-lock.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
if (Test-Path ".env.local") { scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 ".env.local" "${RemoteHost}:${RemotePath}.env.local" 2>$null | Out-Null }
# Key custody (Pattern 11 fleet standard): the app relays via WMS and must never hold a
# raw GEMINI_API_KEY. Strip it and inject GEMINI_PROXY_KEY from WMS custody
# (/opt/tuc-wms/.env), BOM/CR/null-stripped (Pattern 21); no bash loop vars (Pattern 20).
$envInject = & ssh -o StrictHostKeyChecking=no $RemoteHost "touch ${RemotePath}.env.local; sed -i '/^GEMINI_API_KEY=/d;/^VITE_GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' ${RemotePath}.env.local; K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g'); if [ -n `"`$K`" ]; then printf 'GEMINI_PROXY_KEY=%s\n' `"`$K`" >> ${RemotePath}.env.local; echo 'env: GEMINI_PROXY_KEY injected'; else echo 'WARN: GEMINI_PROXY_KEY not found in WMS'; fi; chmod 600 ${RemotePath}.env.local"
Write-Host $envInject -ForegroundColor DarkGray
if ($envInject -match 'WARN') { Log "ERROR" "GEMINI_PROXY_KEY unavailable — story route would 503. Aborting." Red; exit 1 }
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "$nvmPrefix; cd $RemotePath && CI=true pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent"

Log "INFO" "Step 7: Restarting backend (hard delete + start, Pattern 23)..." Yellow
# Pattern 23: pm2 reload/restart --update-env keeps a stale env (old GEMINI_PROXY_KEY
# -> WMS 401) AND stale tsx-transpiled server.ts. Hard delete + fresh start is the only
# reliable way to pick up a changed env var or edited backend.
$restartCmd = @"
export NVM_DIR="`$HOME/.nvm"; [ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true
NPXPATH=`$(which npx)
if command -v pm2 &>/dev/null; then
  pm2 delete tb-ai-english-safari &>/dev/null || true
  cd $RemotePath && NODE_ENV=production PORT=3021 pm2 start $RemotePath/server.ts \
    --name tb-ai-english-safari \
    --interpreter "`$NPXPATH" \
    --interpreter-args tsx \
    --cwd $RemotePath \
    --max-memory-restart 1G
  echo 'pm2: started tb-ai-english-safari'
  pm2 save --force &>/dev/null
  sleep 3
  for i in 1 2 3 4 5 6 7 8 9 10; do pm2 logs tb-ai-english-safari --lines 40 --nostream 2>&1 | grep -q 'relay + SPA listening' && break; sleep 3; done; pm2 logs tb-ai-english-safari --lines 40 --nostream 2>&1 | grep -q 'relay + SPA listening' && echo 'OK new build running' || echo 'WARN stale build — banner not found'
fi
"@
$b64r = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartCmd.Replace("`r", "")))
$restartOut = ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64r | base64 -d | bash"
Write-Host $restartOut -ForegroundColor DarkGray
if ($restartOut -match 'WARN stale build') { Log "ERROR" "PM2 running stale code — investigate." Red; exit 5 }

Log "INFO" "Step 8: Health checks..." Yellow
$indexCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
Write-Host $indexCheck -ForegroundColor $(if ($indexCheck -match '^OK') { 'Green' } else { 'Red' })
$portCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "for i in `$(seq 1 12); do ss -tlnp | grep -q ':3021' && { echo 'OK port 3021 listening'; exit 0; }; sleep 5; done; echo 'WARN port 3021 not found'"
Write-Host $portCheck -ForegroundColor $(if ($portCheck -match '^OK') { 'Green' } else { 'Yellow' })
try {
    $h = Invoke-RestMethod -Uri "https://ai-tools.techbridge.edu.gh/english-safari/api/health" -TimeoutSec 15
    Write-Host "health: $($h | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch { Write-Host "WARN health unreachable: $($_.Exception.Message)" -ForegroundColor Yellow }

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "DEPLOYMENT COMPLETE in ${elapsed}s — https://ai-tools.techbridge.edu.gh/english-safari/" Green
