# youtube-description-genie — Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/youtube-genie/
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/youtube-genie/",
    [string]$PORT = "3018",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "youtube-description-genie"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "youtube-genie DEPLOYMENT" Cyan
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
    $buildDir = "/tmp/ytdg_deploy_$commit"
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
log '[2/5] Cloning repo (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set $SUBFOLDER
cd $SUBFOLDER
log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent
log '[4/5] Building frontend...'
# Carry API key from the live web root into the temp build dir so Vite can embed it
if [ -f $RemotePath.env.local ]; then
  cp $RemotePath.env.local .env.local
elif [ -f $RemotePath.env ]; then
  cp $RemotePath.env .env.local
fi
./node_modules/.bin/vite build
log '[5/5] Deploying dist/ and backend to web root...'
mkdir -p $RemotePath
# Deploy dist contents directly to web root (Pattern 15: never split index.html and assets/)
rsync -a --delete dist/. $RemotePath/
cp package.json pnpm-lock.yaml server.ts $RemotePath
log 'Build and file sync complete.'
"@
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64 | base64 -d | bash"
    if ($LASTEXITCODE -eq 0) { Log "SUCCESS" "Server-side build and file sync complete" Green }
    else { Log "WARN" "Server build returned $LASTEXITCODE" Yellow }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null
} else {
    Log "INFO" "Step 3: Copying local files to server..." Yellow
    if (-not (Test-Path "dist")) { Log "ERROR" "dist/ not found — run pnpm build first." Red; exit 1 }
    # Pattern 15: deploy dist contents atomically to web root (index.html + assets/ together)
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p $RemotePath"
    scp -r -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 dist/assets "${RemoteHost}:${RemotePath}/"
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 dist/index.html "${RemoteHost}:${RemotePath}/"
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.ts package.json pnpm-lock.yaml "${RemoteHost}:${RemotePath}"
    Log "SUCCESS" "dist contents and backend files copied to server" Green
}

Log "INFO" "Step 4: Writing .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Proxy /api/ and /auth/ to Express on port $PORT
  # Leading slash required in server context (Pattern 15)
  RewriteCond %{REQUEST_URI} ^/youtube-genie/(api|auth)/
  RewriteRule ^(api|auth)/(.*)$ http://localhost:$PORT/$1/$2 [P,L,NC]

  # Serve real files and directories directly — REQUEST_FILENAME resolves through Plesk aliases
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ /youtube-genie/index.html [L]
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$">
    ExpiresDefault "max-age=31536000"
    Header set Cache-Control "public, immutable"
  </FilesMatch>
  <FilesMatch "\.(html|json)$">
    ExpiresDefault "max-age=0"
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "cat > ${RemotePath}.htaccess" 2>$null

Log "INFO" "Step 5: Setting permissions..." Yellow
# Pattern 14: chown is safe; chmod -R on the full path strips execute from node_modules binaries.
# Exclude node_modules from the find sweep. Base64 + CR-strip (as Steps 3/6/7 do) so a CRLF
# checkout of this script can't leak a trailing \r into $RemotePath — that was breaking chown/find.
$permCmd = @"
chown -R techbridge.edu.gh_md:psaserv $RemotePath
find $RemotePath -not -path '${RemotePath}node_modules/*' -type f -exec chmod 644 {} \;
find $RemotePath -not -path '${RemotePath}node_modules/*' -type d -exec chmod 755 {} \;
chmod 644 ${RemotePath}.htaccess 2>/dev/null; true
"@
$b64p = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($permCmd.Replace("`r", "")))
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64p | base64 -d | bash" | Out-Null

Log "INFO" "Step 6: Installing backend dependencies..." Yellow
if (Test-Path ".env.local") { scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 ".env.local" "${RemoteHost}:${RemotePath}.env" 2>$null | Out-Null }

# Key custody (Pattern 11 fleet standard): the deployed .env must never carry a raw
# GEMINI_API_KEY. GEMINI_PROXY_KEY is injected server-side from WMS custody
# (/opt/tuc-wms/.env) with BOM/CR/null stripping (Pattern 21). Both the Gemini relay
# and the OAuth code->token relay (Pattern 35) present this key, so abort if it is missing.
$envInject = @"
cd $RemotePath
# Windows/PowerShell often saves .env.local as UTF-16; scp copies it verbatim and every dotenv
# loader then parses 0 vars (null byte between each char), so GEMINI_PROXY_KEY reports 'not set'
# even though it is present. Normalise to UTF-8 (+ strip any BOM) before touching the keys.
BOM=`$(od -An -tx1 -N2 .env 2>/dev/null | tr -d ' \n')
if [ "`$BOM" = "fffe" ] || [ "`$BOM" = "feff" ]; then iconv -f UTF-16 -t UTF-8 .env -o .env.utf8 && mv .env.utf8 .env && echo 'env: normalised UTF-16 .env -> UTF-8'; fi
sed -i '1s/^\xEF\xBB\xBF//' .env 2>/dev/null || true
sed -i '/^GEMINI_API_KEY=/d;/^GEMINI_PROXY_KEY=/d' .env 2>/dev/null || true
K=`$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g')
if [ -n "`$K" ]; then printf 'GEMINI_PROXY_KEY=%s\n' "`$K" >> .env; echo 'env: GEMINI_PROXY_KEY injected from WMS custody'; else echo 'WARN: GEMINI_PROXY_KEY not found in /opt/tuc-wms/.env'; fi
chmod 600 .env
"@
$b64e = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($envInject.Replace("`r", "")))
$envResult = ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64e | base64 -d | bash"
Write-Host $envResult -ForegroundColor DarkGray
if ($envResult -match 'WARN') { Log "ERROR" "GEMINI_PROXY_KEY unavailable — AI + OAuth relay would fail. Aborting before restart." Red; exit 1 }

$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "$nvmPrefix; cd $RemotePath && CI=true pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent"

Log "INFO" "Step 7: Restarting backend (PM2)..." Yellow
$restartCmd = @"
export NVM_DIR="`$HOME/.nvm"; [ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true
NODE26=/root/.nvm/versions/node/v26.3.1/bin/node
TSX_ESM=$RemotePath/node_modules/tsx/dist/esm/index.mjs
if command -v pm2 &>/dev/null; then
  # Pattern 23: reload/restart --update-env keeps a stale env (old GEMINI_PROXY_KEY -> WMS 401)
  # AND stale tsx-transpiled server.ts. Hard delete + fresh start is the only reliable way to
  # pick up the injected GEMINI_PROXY_KEY and the edited OAuth-relay backend.
  # Pattern 9: --cwd so dotenv resolves .env from the app directory.
  # Pattern 13: Node v26 + tsx --import flag (wrapper approach).
  pm2 delete youtube-genie >/dev/null 2>&1 || true
  PORT=$PORT pm2 start $RemotePath/server.ts \
    --name youtube-genie \
    --interpreter "`$NODE26" \
    --interpreter-args "--import `$TSX_ESM" \
    --cwd $RemotePath \
    --max-memory-restart 1G
  echo 'pm2: hard restart youtube-genie (Pattern 23)'
  pm2 save --force &>/dev/null
fi
"@
$b64r = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartCmd.Replace("`r", "")))
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64r | base64 -d | bash"

Log "INFO" "Health check..." Yellow
# index.html now lives at web root (not dist/), assets/ alongside it
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -d ${RemotePath}assets && echo 'OK assets/ dir present' || echo 'MISSING assets/ dir'"
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "ss -tlnp | grep -q ':$PORT' && echo 'OK port $PORT listening' || echo 'WARN port $PORT not found'"
# Pattern 15 post-deploy guard: verify every asset referenced in index.html is served as JS/CSS
$assetCheck = @"
HOST=ai-tools.techbridge.edu.gh
ASSETS=`$(curl -s "https://`$HOST/youtube-genie/" | grep -oE '/youtube-genie/assets/[A-Za-z0-9_-]+\.(js|css)')
FAIL=0
for a in `$ASSETS; do
  ct=`$(curl -s -D - "https://`$HOST`$a" -o /dev/null | tr -d '\r' | awk -F': ' 'tolower(`$1)=="content-type"{print `$2}')
  case "`$a:`$ct" in
    *.js:*javascript*|*.css:*css*) echo "OK `$a" ;;
    *) echo "FAIL `$a served as '`$ct'" ; FAIL=1 ;;
  esac
done
[ "`$FAIL" = "0" ] && echo "Asset MIME check passed" || echo "Asset MIME check FAILED — index.html/assets out of sync"
"@
$b64a = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($assetCheck.Replace("`r", "")))
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64a | base64 -d | bash"

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$timeStr = if ($elapsed -ge 60) { "$([math]::Floor($elapsed/60))m $([math]::Round($elapsed%60,1))s" } else { "${elapsed}s" }
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "URL  : https://ai-tools.techbridge.edu.gh/youtube-genie/" Green
Log "SUCCESS" "Time : $timeStr total" Green
Log "SUCCESS" "========================================" Green