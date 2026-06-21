# ============================================================
# TUC-WMS Frontend — Deploy Script
# Remote : root@66.226.72.199 (techbridge.edu.gh)
# Path   : /var/www/vhosts/techbridge.edu.gh/wms.techbridge.edu.gh
# URL    : https://wms.techbridge.edu.gh/
# Backend: Spring Boot on :8081 (separate systemd service — untouched here)
# Usage  : .\deploy.ps1 -Build
#
# Builds the SPA server-side (git clone + pnpm build, like the fleet), rsyncs
# dist/ to the wms vhost root, then applies the two things this Plesk vhost needs
# (learned the hard way):
#   1. Permissions: owner techbridge.edu.gh_md:psacln, 755 dirs / 644 files
#      (scp leaves dirs unreadable by the web user -> 403 blank page).
#   2. SPA .htaccess (RewriteBase /): Plesk proxies location / to Apache, which
#      serves the static root, so client-side routes (/login, /auth/callback,
#      /mfa) need an Apache rewrite to index.html — nginx error_page does NOT work.
# nginx /api proxy + SSE config are managed separately (docs/DEPLOYMENT.md) and
# are NOT touched by this script.
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'

$REMOTE      = 'root@66.226.72.199'
$DEPLOY_PATH = '/var/www/vhosts/techbridge.edu.gh/wms.techbridge.edu.gh'
$GITHUB_REPO = 'git@github.com:DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'tuc-wms/frontend'
$OWNER       = 'techbridge.edu.gh_md:psacln'
$SSH_OPTS    = @('-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3')
$START       = Get-Date

function Log($lvl, $msg, $color = 'White') {
    Write-Host ("[{0}][{1}] {2}" -f (Get-Date).ToString('HH:mm:ss'), $lvl, $msg) -ForegroundColor $color
}

Log 'INFO' '========================================' Cyan
Log 'INFO' 'TUC-WMS FRONTEND DEPLOYMENT' Cyan
Log 'INFO' "Path : $DEPLOY_PATH" Cyan

# Push current commit so the server clone is up to date.
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log 'INFO' "Commit: $commit on $branch"

if (-not $Build) { Log 'ERROR' 'Run with -Build (server-side build).' Red; exit 1 }

# ---- Server-side: clone (sparse) -> pnpm build -> rsync -> perms -> .htaccess ----
$serverScript = @"
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
log() { echo "[`$(date '+%H:%M:%S')][SERVER] `$1"; }
TMP=/tmp/tuc-wms-fe_`$`$
DEPLOY=$DEPLOY_PATH
# Always remove the temp build tree (incl. node_modules) on ANY exit — success,
# failure, or interrupt — so failed deploys never leave node_modules on the server.
trap 'rm -rf "`$TMP"' EXIT

command -v pnpm >/dev/null 2>&1 || { corepack enable >/dev/null 2>&1 || npm i -g pnpm --silent; }
log "pnpm `$(pnpm --version)"

log '[1/6] Clone (sparse, depth 1)...'
rm -rf "`$TMP"
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' "`$TMP"
cd "`$TMP" && git sparse-checkout set '$SUBFOLDER' && cd '$SUBFOLDER'

log '[2/6] Install...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || pnpm install --no-frozen-lockfile

log '[3/6] Build...'
pnpm build

if [ ! -f dist/index.html ]; then log 'ERROR: dist/index.html missing — aborting'; exit 2; fi

log '[4/6] Sync dist to web root...'
mkdir -p "`$DEPLOY"
# Keep .htaccess / .php-* dotfiles; replace app files.
rsync -a --delete --exclude='.htaccess' --exclude='.php-*' dist/. "`$DEPLOY/"

log '[5/6] Docs files (loader pages that live outside the SPA dist)...'
mkdir -p "`$DEPLOY/docs"
cd "`$TMP" && git sparse-checkout add 'tuc-wms/docs' && cd 'tuc-wms/docs'
cp sso-handbook-loader.html "`$DEPLOY/docs/sso-handbook.html"
cd "`$TMP/$SUBFOLDER"

log '[6/7] Permissions (fix 403)...'
chown -R $OWNER "`$DEPLOY"
find "`$DEPLOY" -type d -exec chmod 755 {} \;
find "`$DEPLOY" -type f -exec chmod 644 {} \;

log '[7/7] SPA .htaccess...'
cat > "`$DEPLOY/.htaccess" <<'HT'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /index.html [QSA,L]
</IfModule>
HT
chown $OWNER "`$DEPLOY/.htaccess"; chmod 644 "`$DEPLOY/.htaccess"
rm -rf "`$TMP"
log 'Build and deploy complete.'
"@

$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
Log 'INFO' 'Server-side build + deploy...' Yellow
ssh @SSH_OPTS $REMOTE "echo $b64 | base64 -d | bash"
if ($LASTEXITCODE -ne 0) { Log 'ERROR' "Server build failed ($LASTEXITCODE)" Red; exit 1 }

# ---- Health checks ----
Log 'INFO' 'Health checks...' Yellow
$checks = @('/', '/login', '/auth/callback', '/api/auth/google')
foreach ($p in $checks) {
    $code = ssh @SSH_OPTS $REMOTE "curl -s -o /dev/null -w '%{http_code}' https://wms.techbridge.edu.gh$p"
    $ok = ($p -eq '/api/auth/google' -and $code -eq '302') -or ($p -ne '/api/auth/google' -and $code -eq '200')
    Log ($(if ($ok) { 'OK' } else { 'WARN' })) ("{0} -> {1}" -f $p, $code) ($(if ($ok) { 'Green' } else { 'Yellow' }))
}

$elapsed = [math]::Round(((Get-Date) - $START).TotalSeconds, 1)
Log 'SUCCESS' '========================================' Green
Log 'SUCCESS' "DEPLOYMENT COMPLETE in ${elapsed}s" Green
Log 'SUCCESS' 'URL: https://wms.techbridge.edu.gh/' Green
Log 'SUCCESS' '========================================' Green
Log 'INFO' 'Reminder: Google console must have redirect URI https://wms.techbridge.edu.gh/api/auth/google/callback' DarkGray
