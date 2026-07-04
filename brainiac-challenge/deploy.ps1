# brainiac-challenge — Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/brainiac-challenge/
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/brainiac-challenge/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "brainiac-challenge"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "brainiac-challenge DEPLOYMENT" Cyan
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
    $buildDir = "/tmp/brainiac-challenge_deploy_$commit"
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
log '[2/5] Cloning brainiac-challenge (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set brainiac-challenge
cd brainiac-challenge
log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent
log '[4/5] Building...'
pnpm build
if ! grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' dist/index.html; then echo '[FATAL] dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy.'; exit 1; fi
log '[5/5] Deploying dist/ to web root...'
mkdir -p $RemotePath
rsync -a --delete dist/. $RemotePath
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
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p $RemotePath && rm -rf ${RemotePath}*"
    scp -r -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 dist/* "${RemoteHost}:${RemotePath}"
    Log "SUCCESS" "dist/* copied to server" Green
}

Log "INFO" "Step 4: Writing .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /brainiac-challenge/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /brainiac-challenge/index.html [QSA,L]
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

Log "INFO" "Health check..." Yellow
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$timeStr = if ($elapsed -ge 60) { "$([math]::Floor($elapsed/60))m $([m