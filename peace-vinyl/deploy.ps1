# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Peace Vinyl Deployment Script
# Deploys frontend (dist/) + backend (server.js) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/",
    [switch]$Build = $true
)

Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== PEACE VINYL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in peace-vinyl!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\peace-vinyl' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /peace/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3001/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^ /peace/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && NODE_ENV=production nohup node server.js > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "`n✅ Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/peace"
Log "INFO" "Backend: Running on port 3001 (internal)`n"