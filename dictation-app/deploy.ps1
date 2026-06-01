# Dictation App Deployment Script
# Strategy: SSH to server -> git sparse-clone -> build on server -> serve
# Pattern 10 compliant (PATTERNS.md)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dictation/",
    [switch]$Build = $false
)

$__deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "DICTATION APP DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

$commit  = git rev-parse --short HEAD
$branch  = git branch --show-current
Log "INFO" "Commit : $commit on $branch"

$repoUrl  = "https://github.com/DanielFTwum-creator/aucdt-utilities.git"
$buildDir = "/tmp/dictation_deploy_$commit"

# Upload .env.local BEFORE build — Vite bakes VITE_* vars at build time
Log "INFO" "Step 1: Uploading .env.local to server..." Yellow
if (Test-Path ".env.local") {
    Get-Content ".env.local" -Raw | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > /tmp/dictation_env_$commit"
    if ($LASTEXITCODE -eq 0) { Log "SUCCESS" ".env.local uploaded" Green }
    else { Log "WARN" ".env.local upload failed — Google OAuth may not work" Yellow }
} else {
    Log "WARN" ".env.local not found locally" Yellow
}

# Server-side build script
$serverScript = @"
set -e

log() { echo "[ `$(date '+%Y-%m-%d %H:%M:%S') ][SERVER] `$1"; }

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
log "pnpm `$(pnpm --version 2>/dev/null || echo unavailable)"

log '[1/6] Cleaning...'
rm -rf $buildDir

log '[2/6] Cloning dictation-app (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$repoUrl' $buildDir
cd $buildDir
rm -f pnpm-workspace.yaml package.json
git sparse-checkout set dictation-app
cd dictation-app

log '[3/6] Injecting .env.local...'
cp /tmp/dictation_env_$commit .env.local 2>/dev/null || log 'Warning: .env.local not found'

log '[4/6] Installing dependencies...'
pnpm install --no-frozen-lockfile --ignore-workspace --silent 2>/dev/null \
  || npm install --legacy-peer-deps --silent

log '[5/6] Building...'
pnpm exec vite build 2>/dev/null || npx vite build

log '[6/6] Deploying dist/ to web root...'
mkdir -p $RemotePath
cp -r dist/. $RemotePath
log 'Done.'
"@

Log "INFO" "Step 2: Server-side build (git clone + pnpm)..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "$serverScript"

if ($LASTEXITCODE -ne 0) {
    Log "WARN" "Server build returned $LASTEXITCODE — check output above" Yellow
} else {
    Log "SUCCESS" "Server-side build and sync complete" Green
}
ssh -o StrictHostKeyChecking=no $RemoteHost "rm -f /tmp/dictation_env_$commit" 2>$null | Out-Null

# .htaccess
Log "INFO" "Step 3: Writing .htaccess..." Yellow
$htaccess = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dictation/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /dictation/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccess | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>$null | Out-Null

Log "INFO" "Step 4: Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "INFO" "Step 5: Health check..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK index.html present' || echo 'X index.html MISSING'"

ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null

$__elapsed    = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$__elapsedMin = [math]::Floor($__elapsed / 60)
$__elapsedSec = [math]::Round($__elapsed % 60, 1)
$__timeStr    = if ($__elapsedMin -gt 0) { "$($__elapsedMin)m $($__elapsedSec)s" } else { "$($__elapsed)s" }

Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "URL  : https://ai-tools.techbridge.edu.gh/dictation" Green
Log "SUCCESS" "Time : $__timeStr total" Green
Log "SUCCESS" "========================================" Green
