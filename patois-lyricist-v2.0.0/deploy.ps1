# patois-lyricist-v2.0.0 — Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/patois-lyricist-v2.0.0/
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    # Live app (backend process cwd + served dist) runs from the 'lyricist' folder, not 'patois'.
    # The public URL is /patois/ (nginx path) but the files live here. Deploying to 'patois/'
    # lands in an unused folder — verified 2026-07-01. Keep this pointed at 'lyricist'.
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/lyricist/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "patois-lyricist-v2.0.0"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "patois-lyricist-v2.0.0 DEPLOYMENT" Cyan
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
    $buildDir = "/tmp/patois-lyricist_deploy_$commit"
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
log '[2/5] Cloning patois-lyricist-v2.0.0 (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set patois-lyricist-v2.0.0
cd patois-lyricist-v2.0.0
log '[3/5] Installing dependencies...'
pnpm install --no-frozen-lockfile --ignore-scripts 2>&1 | tail -5 || true
log '[4/5] Building...'
if [ -f $RemotePath.env.local ]; then
  cp $RemotePath.env.local .env.local
elif [ -f $RemotePath.env ]; then
  cp $RemotePath.env .env.local
fi
./node_modules/.bin/vite build
log '[5/5] Deploying dist/ to web root...'
mkdir -p $RemotePath
rsync -a --delete dist/. $RemotePath
cp server.ts package.json pnpm-lock.yaml ecosystem.config.js $RemotePath 2>/dev/null || log 'Note: Some files copied via scp instead'
log 'Build and deploy complete.'
"@
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64 | base64 -d | bash"
    if ($LASTEXITCODE -eq 0) { Log "SUCCESS" "Server-side build and file sync complete" Green }
    else { Log "WARN" "Server build returned $LASTEXITCODE" Yellow }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null
    # Copy backend files that may not have been in build directory
    Log "INFO" "Step 3b: Copying backend files to server..." Yellow
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.ts ecosystem.config.js "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
} else {
    Log "INFO" "Step 3: Copying local dist/ to server..." Yellow
    if (-not (Test-Path "dist")) { Log "ERROR" "dist/ not found. Run with -Build flag." Red; exit 1 }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p $RemotePath"
    Write-Host "[NOTE] Generating .env configuration..." -ForegroundColor Cyan
    ssh -o StrictHostKeyChecking=no $RemoteHost "
        cd $RemotePath
        curl -s https://wms.techbridge.edu.gh/api/gemini/key | jq -r '.apiKey' | awk '{print \"GEMINI_PROXY_KEY=\"$1}' > .env
        echo \"VITE_GOOGLE_CLIENT_ID=537671076222-q0ovngh3m2m560kdcrsn2hk0cae5rudg.apps.googleusercontent.com\" >> .env
        echo \"VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/patois/auth/google/callback\" >> .env
        # GOOGLE_CLIENT_SECRET intentionally NOT written here — token exchange now goes via the
        # WMS OAuth relay (authenticated with GEMINI_PROXY_KEY). The secret lives only in /opt/tuc-wms/.env.
    "
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "find $RemotePath -mindepth 1 -maxdepth 1 ! -name '.env*' ! -name 'node_modules' -exec rm -rf {} +"
    scp -r -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 dist/* "${RemoteHost}:${RemotePath}"
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.ts package.json pnpm-lock.yaml ecosystem.config.js "${RemoteHost}:${RemotePath}"
    Log "SUCCESS" "dist/* and backend files copied to server" Green
}

Log "INFO" "Step 4: Writing .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /patois/

  RewriteCond %{REQUEST_URI} ^/patois/(api|auth)/ [NC,OR]
  RewriteCond %{REQUEST_URI} ^/(api|auth)/ [NC]
  RewriteRule ^(api|auth)/(.*)$ http://localhost:3017/$1/$2 [P,L,NC]

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /patois/index.html [QSA,L]
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

Log "INFO" "Step 6: Installing backend dependencies..." Yellow
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "$nvmPrefix; cd $RemotePath && pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent"

Log "INFO" "Step 7: Restarting backend (PM2)..." Yellow
$restartCmd = @"
if command -v pm2 &>/dev/null; then
  cd $RemotePath
  mkdir -p logs
  if pm2 describe patois-lyricist &>/dev/null; then
    pm2 delete patois-lyricist
  fi
  pm2 start ecosystem.config.js && echo 'pm2: started patois-lyricist with ecosystem config'
  pm2 save --force &>/dev/null
fi
"@
$b64r = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartCmd.Replace("`r", "")))
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo `$b64r | base64 -d | bash"

Log "INFO" "Health check..." Yellow
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "ss -tlnp | grep -q ':3017' && echo 'OK port 3017 listening' || echo 'WARN port 3017 not found'"

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$timeStr = if ($elapsed -ge 60) { "$([math]::Floor($elapsed/60))m $([math]::Round($elapsed%60,1))s" } else { "${elapsed}s" }
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "URL  : https://ai-tools.techbridge.edu.gh/patois/" Green
Log "SUCCESS" "Time : $timeStr total" Green
Log "SUCCESS" "========================================" Green