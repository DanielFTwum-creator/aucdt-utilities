# ============================================================
# LEMS Frontend — Deploy Script
# Remote : root@66.226.72.199 (techbridge.edu.gh)
# Path   : /var/www/vhosts/techbridge.edu.gh/lems-redirect
# URL    : https://lems.techbridge.edu.gh/
# Usage  : .\deploy.ps1 -Build
# ============================================================

param([switch]$Build)

$ErrorActionPreference = 'Stop'

$REMOTE      = 'root@66.226.72.199'
$DEPLOY_PATH = '/var/www/vhosts/techbridge.edu.gh/lems-redirect'
$GITHUB_REPO = 'https://github.com/DanielFTwum-creator/aucdt-utilities.git'
$SUBFOLDER   = 'lems'
$OWNER       = 'techbridge.edu.gh_md:psaserv'
$SSH_OPTS    = @('-o', 'StrictHostKeyChecking=no')
$START       = Get-Date

function Log($lvl, $msg, $color = 'White') {
    Write-Host ("[{0}][{1}] {2}" -f (Get-Date).ToString('HH:mm:ss'), $lvl, $msg) -ForegroundColor $color
}

Log 'INFO' '========================================' Cyan
Log 'INFO' 'LEMS FRONTEND DEPLOYMENT' Cyan
Log 'INFO' "Path : $DEPLOY_PATH" Cyan

# Push current commit so the server clone is up to date.
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log 'INFO' "Commit: $commit on $branch"
try { git push origin $branch 2>&1 | Out-Null } catch { Log 'WARN' 'git push failed (non-fatal)' Yellow }

if (-not $Build) { Log 'ERROR' 'Run with -Build (server-side build).' Red; exit 1 }

# ---- Server-side: clone (sparse) -> pnpm build -> rsync -> perms -> .htaccess ----
$serverScript = @"
set -e
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }
TMP=/tmp/lems-fe_`$`$
DEPLOY=$DEPLOY_PATH

# Always remove the temp build tree on ANY exit
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
VITE_API_URL=https://wms.techbridge.edu.gh/api/lems pnpm build

if [ ! -f dist/index.html ]; then log 'ERROR: dist/index.html missing — aborting'; exit 2; fi

log '[4/6] Sync dist to web root...'
mkdir -p "`$DEPLOY"
# Keep .htaccess / .php-* dotfiles; replace app files.
rsync -a --delete --exclude='.htaccess' --exclude='.php-*' dist/. "`$DEPLOY/"

log '[5/6] Permissions (fix 403)...'
chown -R $OWNER "`$DEPLOY"
find "`$DEPLOY" -type d -exec chmod 755 {} \;
find "`$DEPLOY" -type f -exec chmod 644 {} \;

log '[6/6] SPA .htaccess...'
cat > "`$DEPLOY/.htaccess" <<'HT'
<IfModule mod_rewrite.c>
  RewriteEngine On
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
$checks = @('/', '/admin')
foreach ($p in $checks) {
    $code = ssh @SSH_OPTS $REMOTE "curl -s -o /dev/null -w '%{http_code}' https://lems.techbridge.edu.gh$p"
    $ok = ($code -eq '200' -or $code -eq '301' -or $code -eq '302')
    Log ($(if ($ok) { 'OK' } else { 'WARN' })) ("{0} -> {1}" -f $p, $code) ($(if ($ok) { 'Green' } else { 'Yellow' }))
}

$elapsed = [math]::Round(((Get-Date) - $START).TotalSeconds, 1)
Log 'SUCCESS' '========================================' Green
Log 'SUCCESS' "DEPLOYMENT COMPLETE in ${elapsed}s" Green
Log 'SUCCESS' 'URL: https://lems.techbridge.edu.gh/' Green
Log 'SUCCESS' '========================================' Green
