# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
if ($Build) {
    Log "INFO" "Installing dependencies..." Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Log "INFO" "⚠️  Install completed with warnings (continuing anyway)" Yellow
    }

    Log "INFO" "Building..." Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red; exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Log "INFO" "Copying files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Creating .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
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
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"