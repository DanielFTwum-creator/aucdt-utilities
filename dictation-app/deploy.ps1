# Dictation App Deployment Script
# Strategy: SSH to server -> git clone -> build on server -> serve
# Avoids all Windows scp/tar file-transfer failures.

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dictation/",
    [switch]$Build = $false
)

# Timestamped logging helper
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

# Git state
$commit = git rev-parse --short HEAD
Log "INFO" "Commit : $commit"

Log "INFO" "Step 1: Server-side build (git clone + npm build)..." Yellow

$repoUrl = "https://github.com/DanielFTwum-creator/aucdt-utilities.git"
$buildDir = "/tmp/dictation_deploy_$commit"

$serverScript = @"
set -e
echo '[1/5] Cleaning previous temp build...'
rm -rf $buildDir
echo '[2/5] Cloning dictation-app from GitHub (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$repoUrl' $buildDir
cd $buildDir
git sparse-checkout set dictation-app
cd dictation-app
echo '[3/5] Installing dependencies...'
npm install --legacy-peer-deps --silent
echo '[4/5] Building...'
npx vite build
echo '[5/5] Deploying dist/ to web root...'
mkdir -p $RemotePath
cp -r dist/. $RemotePath
echo 'Build and deploy complete.'
"@

ssh -o StrictHostKeyChecking=no $RemoteHost "$serverScript"

if ($LASTEXITCODE -ne 0) {
    Log "WARN" "Server deploy returned $LASTEXITCODE — check output above" Yellow
} else {
    Log "SUCCESS" "Server-side build and file sync complete" Green
}

# .htaccess
Log "INFO" "Step 2: Writing .htaccess..." Yellow
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

# Permissions
Log "INFO" "Step 3: Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

# Health check
Log "INFO" "Step 4: Health check..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK index.html present' || echo 'X index.html MISSING'"

# Cleanup
ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE in ${elapsed}s" Green
Log "SUCCESS" "URL: https://ai-tools.techbridge.edu.gh/dictation" Green
Log "SUCCESS" "========================================" Green
