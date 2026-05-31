# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Groove Streamer Deployment Script
# Safe deployment using SSH heredoc (no UTF-8 BOM)

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/",
    [switch]$Build = $false
)

Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GROOVE STREAMER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
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

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\groove-streamer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /groove-streamer/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3004/api/$1 [P,L]
  RewriteRule ^ /groove-streamer/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && nohup tsx server.ts > server.log 2>&1 &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/groove-streamer"
Log "INFO" "Backend running on port 3004 (internal)`n"