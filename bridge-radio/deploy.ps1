# bridge-radio — Deploy Script
# URL: https://radio.techbridge.edu.gh/   (root vhost, NOT an ai-tools sub-path)
# Usage: .\deploy.ps1 -Build
#
# Deployment model (standardised — see fleet PATTERNS.md):
#   - Frontend: built dist/ rsynced to the radio docroot.
#   - Backend:  server.ts run by PM2 via tsx on PORT 3021 (SERVER_PORTS.md),
#               binds 0.0.0.0 so the Apache proxy reaches it on 127.0.0.1.
#   - Routing:  on a Plesk ROOT vhost, .htaccess is overridden by vhost_ssl.conf,
#               so SPA fallback + /api proxy live there (PATTERNS.md #15). This
#               script writes the canonical conf and reconfigures the domain.
#   - Secrets:  Gemini key is NEVER in the bundle; /api/lyrics resolves it
#               server-side via the WMS proxy (PATTERNS.md #11).

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/radio/",
    [string]$Domain     = "radio.techbridge.edu.gh",
    [string]$PublicUrl  = "https://radio.techbridge.edu.gh",
    [int]   $Port       = 3032,
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "bridge-radio"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "bridge-radio DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" "Port   : $Port"
Log "INFO" ""

Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

if ($Build) {
    Log "INFO" "Step 3: Server-side build (git clone + pnpm build)..." Yellow
    $buildDir = "/tmp/bridge-radio_deploy_$commit"
    $serverScript = @"
set -e
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }
if ! command -v pnpm >/dev/null 2>&1; then corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent; export PATH="`$HOME/.local/share/pnpm:`$PATH"; fi
log "pnpm `$(pnpm --version)"
log '[1/5] Cleaning previous temp build...'
rm -rf $buildDir
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true
log '[2/5] Cloning bridge-radio (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set bridge-radio
cd bridge-radio
log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent
log '[4/5] Building...'
pnpm build
if ! grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' dist/index.html; then echo '[FATAL] dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy.'; exit 1; fi
if [ ! -f dist/index.html ]; then echo '[ERROR] build produced no dist/index.html — aborting'; exit 2; fi
log '[5/5] Deploying dist/ to web root (preserving backend files)...'
mkdir -p $RemotePath
rsync -a --delete --exclude='.env' --exclude='node_modules/' --exclude='server.ts' --exclude='package.json' --exclude='pnpm-lock.yaml' --exclude='pnpm-workspace.yaml' --exclude='.htaccess' dist/. $RemotePath
log 'Frontend sync complete.'
"@
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64 | base64 -d | bash"
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Server build failed ($LASTEXITCODE)" Red; exit $LASTEXITCODE }
    ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null
} else {
    Log "INFO" "Step 3: Copying local dist/ to server..." Yellow
    if (-not (Test-Path "dist")) { Log "ERROR" "dist/ not found. Run with -Build flag." Red; exit 1 }
    if (-not (Select-String -Path "dist/index.html" -Pattern '<script[^>]+(src="[^"]*\.js"|type="module")' -Quiet)) { Log "ERROR" "dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy." Red; exit 1 }
    ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p ${RemotePath}assets && rm -rf ${RemotePath}assets/*"
    scp -r dist/* "${RemoteHost}:${RemotePath}"
}

Log "INFO" "Step 4: Deploying backend files + installing prod deps..." Yellow
scp -o StrictHostKeyChecking=no server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
if (Test-Path ".env.local") { scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}.env" 2>$null | Out-Null }
# Key custody (Pattern 11 fleet standard): ensure the deployed .env carries the WMS
# relay credential and NO raw GEMINI_API_KEY. Injected from WMS custody
# (/opt/tuc-wms/.env) with BOM/CR/null stripping (Pattern 21); no bash loop vars (Pattern 20).
$envInject = & ssh -o StrictHostKeyChecking=no $RemoteHost "touch ${RemotePath}.env; sed -i '/^GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' ${RemotePath}.env; K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g'); if [ -n `"`$K`" ]; then printf 'GEMINI_PROXY_KEY=%s\n' `"`$K`" >> ${RemotePath}.env; echo 'env: GEMINI_PROXY_KEY injected'; else echo 'WARN: GEMINI_PROXY_KEY not found in WMS'; fi; chmod 600 ${RemotePath}.env"
Write-Host $envInject -ForegroundColor DarkGray
if ($envInject -match 'WARN') { Log "ERROR" "GEMINI_PROXY_KEY unavailable — /api/lyrics would 503. Aborting." Red; exit 1 }
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
ssh -o StrictHostKeyChecking=no $RemoteHost "$nvmPrefix; cd $RemotePath && CI=true pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent"

Log "INFO" "Step 5: Writing radio vhost_ssl.conf (root-vhost SPA + /api proxy)..." Yellow
# Root vhost: .htaccess is overridden by Plesk's vhost_ssl.conf. Canonical copy
# is version-controlled at docs/vhost_ssl.conf. MUST use DOCUMENT_ROOT+REQUEST_URI.
$vhostConf = @"
ProxyRequests Off
ProxyPreserveHost On

<Location /api>
    ProxyPass http://127.0.0.1:$Port/api
    ProxyPassReverse http://127.0.0.1:$Port/api
</Location>

RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-f
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-d
RewriteRule ^ /index.html [L]
"@
$vb64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($vhostConf.Replace("`r", "")))
ssh -o StrictHostKeyChecking=no $RemoteHost "echo $vb64 | base64 -d > /var/www/vhosts/system/$Domain/conf/vhost_ssl.conf && plesk sbin httpdmng --reconfigure-domain $Domain"

Log "INFO" "Step 6: Permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath" | Out-Null

Log "INFO" "Step 7: Restarting backend (hard delete + start, Pattern 23)..." Yellow
# Pattern 23: pm2 reload/restart --update-env keeps a stale env (old GEMINI_PROXY_KEY
# -> WMS 401) AND stale tsx-transpiled server.ts. Hard delete + fresh start is the only
# reliable way to pick up a changed env var or edited backend.
$restartCmd = @"
$nvmPrefix
if command -v pm2 &>/dev/null; then
  pm2 delete bridge-radio &>/dev/null || true
  cd $RemotePath && NODE_ENV=production PORT=$Port pm2 start server.ts --name bridge-radio --interpreter npx --interpreter-args tsx --cwd $RemotePath
  echo 'pm2: started bridge-radio'
  pm2 save --force &>/dev/null
  sleep 3
  for i in 1 2 3 4 5 6 7 8 9 10; do pm2 logs bridge-radio --lines 40 --nostream 2>&1 | grep -q 'WMS relay listening' && break; sleep 3; done; pm2 logs bridge-radio --lines 40 --nostream 2>&1 | grep -q 'WMS relay listening' && echo 'OK new build running' || echo 'WARN stale build — banner not found'
fi
"@
$b64r = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartCmd.Replace("`r", "")))
$restartOut = ssh -o StrictHostKeyChecking=no $RemoteHost "echo $b64r | base64 -d | bash"
Write-Host $restartOut -ForegroundColor DarkGray
if ($restartOut -match 'WARN stale build') { Log "ERROR" "PM2 running stale code — investigate." Red; exit 5 }

Log "INFO" "Step 8: End-to-end health check (PATTERNS.md #15)..." Yellow
if ($PublicUrl) {
    try {
        $idx = Invoke-WebRequest -Uri "$PublicUrl/index.html" -UseBasicParsing -TimeoutSec 20
        $assets = [regex]::Matches($idx.Content, 'assets/[A-Za-z0-9_.-]+\.(?:js|css)') | ForEach-Object { $_.Value } | Sort-Object -Unique
        $bad = 0
        foreach ($a in $assets) {
            $r = Invoke-WebRequest -Uri "$PublicUrl/$a" -UseBasicParsing -TimeoutSec 20
            $ct = "$($r.Headers['Content-Type'])"
            $ok = if ($a -like '*.js') { $ct -match 'javascript' } else { $ct -match 'css' }
            if ($ok) { Log "INFO" "  OK  $a -> $ct" Green } else { Log "ERROR" "  BAD $a -> $ct" Red; $bad++ }
        }
        if ($bad -ne 0) { Log "ERROR" "End-to-end MIME check FAILED — check vhost_ssl.conf." Red; exit 4 }
        Log "SUCCESS" "Assets serve as JS/CSS over HTTPS" Green
    } catch { Log "WARN" "E2E check could not reach ${PublicUrl}: $($_.Exception.Message)" Yellow }
}

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE — $PublicUrl  (${elapsed}s)" Green
Log "SUCCESS" "========================================" Green
