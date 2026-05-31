# DfS Website Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3007) with Gemini AI support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# DfS Website Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3007) with Gemini AI support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/",
    [switch]$Build = $true
)

Log "INFO" "=== DFS WEBSITE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env
Log "INFO" "Validating .env..." Yellow
if (-not (Test-Path "./.env")) {
    Log "ERROR" "Error: .env not found!" Red
    Log "INFO" "Create .env from .env.example with:" Yellow
    Log "INFO" "  GEMINI_API_KEY=<your-key>"
    Log "INFO" "  GMAIL_USER=<your-email>"
    Log "INFO" "  GMAIL_APP_PASSWORD=<your-app-password>"
    exit 1
}
$envContent = Get-Content "./.env" -Raw
foreach ($key in @("GEMINI_API_KEY","GMAIL_USER","GMAIL_APP_PASSWORD")) {
    if ($envContent -notmatch $key) {
        Log "ERROR" "Error: $key missing in .env" Red
        exit 1
    }
}
Log "INFO" "✓ .env validated"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
scp -r -o StrictHostKeyChecking=no "dist\*" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 20

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dfs/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3007/api/$1 [P,L]
  RewriteRule ^ /dfs/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (always revalidate with server)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'no-cache, no-store, must-revalidate, private'
    Header set Pragma 'no-cache'
    Header set Expires '-1'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Additional cache-busting for HTML
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'no-cache, no-store, must-revalidate, private, max-age=0'
    Header set Pragma 'no-cache'
    Header set Expires '-1'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3007/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production PORT=3007 setsid nohup tsx server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3007' && echo '✅ Port 3007 listening' || echo '❌ Port 3007 NOT listening'" 2>&1

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/dfs"
Log "INFO" "Backend port: 3007 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== DFS WEBSITE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env
Log "INFO" "Validating .env..." Yellow
if (-not (Test-Path "./.env")) {
    Log "ERROR" "Error: .env not found!" Red
    Log "INFO" "Create .env from .env.example with:" Yellow
    Log "INFO" "  GEMINI_API_KEY=<your-key>"
    Log "INFO" "  GMAIL_USER=<your-email>"
    Log "INFO" "  GMAIL_APP_PASSWORD=<your-app-password>"
    exit 1
}
$envContent = Get-Content "./.env" -Raw
foreach ($key in @("GEMINI_API_KEY","GMAIL_USER","GMAIL_APP_PASSWORD")) {
    if ($envContent -notmatch $key) {
        Log "ERROR" "Error: $key missing in .env" Red
        exit 1
    }
}
Log "INFO" "✓ .env validated"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
scp -r -o StrictHostKeyChecking=no "dist\*" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 20

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dfs/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3007/api/$1 [P,L]
  RewriteRule ^ /dfs/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (always revalidate with server)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'no-cache, no-store, must-revalidate, private'
    Header set Pragma 'no-cache'
    Header set Expires '-1'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Additional cache-busting for HTML
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'no-cache, no-store, must-revalidate, private, max-age=0'
    Header set Pragma 'no-cache'
    Header set Expires '-1'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3007/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production PORT=3007 setsid nohup tsx server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3007' && echo '✅ Port 3007 listening' || echo '❌ Port 3007 NOT listening'" 2>&1

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/dfs"
Log "INFO" "Backend port: 3007 (internal)`n"