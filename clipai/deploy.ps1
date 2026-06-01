param(
    [string]$Environment = "production",
    [switch]$Force = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
param(
    [string]$Environment = "production",
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

# Configuration
$RemoteHost = "root@techbridge.edu.gh"
$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/clipai/"
$FileOwnership = "aucdtadmin:psacln"
$HtaccessRewriteBase = "/clipai/"
$LocalBuildPath = "dist"

# Colors for output
$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $SuccessColor
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $ErrorColor
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $WarningColor
}

Write-Info "ClipAI Deployment Script"
Write-Info "Environment: $Environment"
Write-Info "================================"

# Step 1: Build the project
Write-Info ""
Write-Info "Step 1: Building project..."
if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found. Run from project root."
    exit 1
}

pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm install failed"
    exit 1
}

pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm build failed"
    exit 1
}

Write-Success "Build completed"

# Step 2: Verify dist directory
Write-Info ""
Write-Info "Step 2: Verifying build output..."
if (-not (Test-Path $LocalBuildPath)) {
    Write-Error-Custom "Build output directory '$LocalBuildPath' not found"
    exit 1
}

$FileCount = (Get-ChildItem -Path $LocalBuildPath -Recurse).Count
Write-Success "Build output verified ($FileCount files)"

# Step 3: Deploy to remote server
Write-Info ""
Write-Info "Step 3: Deploying to remote server..."
Write-Info "Remote: $RemoteHost"
Write-Info "Path: $RemotePath"

# Create remote directory if it doesn't exist
ssh $RemoteHost "mkdir -p $RemotePath" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to create remote directory"
    exit 1
}

# Upload files via scp
Write-Info "Uploading files..."
$SourcePath = (Get-Item $LocalBuildPath).FullName
scp -r "$SourcePath/*" "$RemoteHost`:$RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload files"
    exit 1
}

Write-Success "Files uploaded"

# Step 4: Set file permissions
Write-Info ""
Write-Info "Step 4: Setting file permissions..."
ssh $RemoteHost "chown -R $FileOwnership $RemotePath && chmod -R 755 $RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to set permissions"
    exit 1
}

Write-Success "Permissions set"

# Step 5: Create/update .htaccess
Write-Info ""
Write-Info "Step 5: Configuring .htaccess..."
$HtaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase $HtaccessRewriteBase
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
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

$TempHtaccess = New-TemporaryFile
Set-Content -Path $TempHtaccess -Value $HtaccessContent -Encoding UTF8

scp $TempHtaccess "$RemoteHost`:$RemotePath/.htaccess"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload .htaccess"
    Remove-Item $TempHtaccess
    exit 1
}

ssh $RemoteHost "chown $FileOwnership $RemotePath/.htaccess && chmod 644 $RemotePath/.htaccess"
Remove-Item $TempHtaccess

Write-Success ".htaccess configured"

# Step 6: Verify deployment
Write-Info ""
Write-Info "Step 6: Verifying deployment..."
ssh $RemoteHost "test -f $RemotePath/index.html && echo 'index.html found'" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Deployment verified"
} else {
    Write-Error-Custom "Deployment verification failed"
    exit 1
}

Write-Info ""
Write-Success "ClipAI deployed successfully!"
Write-Info "Access: https://ai-tools.techbridge.edu.gh/clipai/"
param(
    [string]$Environment = "production",
    [switch]$Force = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
param(
    [string]$Environment = "production",
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

# Configuration
$RemoteHost = "root@techbridge.edu.gh"
$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/clipai/"
$FileOwnership = "aucdtadmin:psacln"
$HtaccessRewriteBase = "/clipai/"
$LocalBuildPath = "dist"

# Colors for output
$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $SuccessColor
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $ErrorColor
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $WarningColor
}

Write-Info "ClipAI Deployment Script"
Write-Info "Environment: $Environment"
Write-Info "================================"

# Step 1: Build the project
Write-Info ""
Write-Info "Step 1: Building project..."
if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found. Run from project root."
    exit 1
}

pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm install failed"
    exit 1
}

pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm build failed"
    exit 1
}

Write-Success "Build completed"

# Step 2: Verify dist directory
Write-Info ""
Write-Info "Step 2: Verifying build output..."
if (-not (Test-Path $LocalBuildPath)) {
    Write-Error-Custom "Build output directory '$LocalBuildPath' not found"
    exit 1
}

$FileCount = (Get-ChildItem -Path $LocalBuildPath -Recurse).Count
Write-Success "Build output verified ($FileCount files)"

# Step 3: Deploy to remote server
Write-Info ""
Write-Info "Step 3: Deploying to remote server..."
Write-Info "Remote: $RemoteHost"
Write-Info "Path: $RemotePath"

# Create remote directory if it doesn't exist
ssh $RemoteHost "mkdir -p $RemotePath" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to create remote directory"
    exit 1
}

# Upload files via scp
Write-Info "Uploading files..."
$SourcePath = (Get-Item $LocalBuildPath).FullName
scp -r "$SourcePath/*" "$RemoteHost`:$RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload files"
    exit 1
}

Write-Success "Files uploaded"

# Step 4: Set file permissions
Write-Info ""
Write-Info "Step 4: Setting file permissions..."
ssh $RemoteHost "chown -R $FileOwnership $RemotePath && chmod -R 755 $RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to set permissions"
    exit 1
}

Write-Success "Permissions set"

# Step 5: Create/update .htaccess
Write-Info ""
Write-Info "Step 5: Configuring .htaccess..."
$HtaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase $HtaccessRewriteBase
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
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

$TempHtaccess = New-TemporaryFile
Set-Content -Path $TempHtaccess -Value $HtaccessContent -Encoding UTF8

scp $TempHtaccess "$RemoteHost`:$RemotePath/.htaccess"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload .htaccess"
    Remove-Item $TempHtaccess
    exit 1
}

ssh $RemoteHost "chown $FileOwnership $RemotePath/.htaccess && chmod 644 $RemotePath/.htaccess"
Remove-Item $TempHtaccess

Write-Success ".htaccess configured"

# Step 6: Verify deployment
Write-Info ""
Write-Info "Step 6: Verifying deployment..."
ssh $RemoteHost "test -f $RemotePath/index.html && echo 'index.html found'" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Deployment verified"
} else {
    Write-Error-Custom "Deployment verification failed"
    exit 1
}

Write-Info ""
Write-Success "ClipAI deployed successfully!"
Write-Info "Access: https://ai-tools.techbridge.edu.gh/clipai/"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
$ErrorActionPreference = "Stop"

# Configuration
$RemoteHost = "root@techbridge.edu.gh"
$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/clipai/"
$FileOwnership = "aucdtadmin:psacln"
$HtaccessRewriteBase = "/clipai/"
$LocalBuildPath = "dist"

# Colors for output
$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $SuccessColor
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $ErrorColor
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $WarningColor
}

Write-Info "ClipAI Deployment Script"
Write-Info "Environment: $Environment"
Write-Info "================================"

# Step 1: Build the project
Write-Info ""
Write-Info "Step 1: Building project..."
if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found. Run from project root."
    exit 1
}

pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm install failed"
    exit 1
}

pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm build failed"
    exit 1
}

Write-Success "Build completed"

# Step 2: Verify dist directory
Write-Info ""
Write-Info "Step 2: Verifying build output..."
if (-not (Test-Path $LocalBuildPath)) {
    Write-Error-Custom "Build output directory '$LocalBuildPath' not found"
    exit 1
}

$FileCount = (Get-ChildItem -Path $LocalBuildPath -Recurse).Count
Write-Success "Build output verified ($FileCount files)"

# Step 3: Deploy to remote server
Write-Info ""
Write-Info "Step 3: Deploying to remote server..."
Write-Info "Remote: $RemoteHost"
Write-Info "Path: $RemotePath"

# Create remote directory if it doesn't exist
ssh $RemoteHost "mkdir -p $RemotePath" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to create remote directory"
    exit 1
}

# Upload files via scp
Write-Info "Uploading files..."
$SourcePath = (Get-Item $LocalBuildPath).FullName
scp -r "$SourcePath/*" "$RemoteHost`:$RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload files"
    exit 1
}

Write-Success "Files uploaded"

# Step 4: Set file permissions
Write-Info ""
Write-Info "Step 4: Setting file permissions..."
ssh $RemoteHost "chown -R $FileOwnership $RemotePath && chmod -R 755 $RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to set permissions"
    exit 1
}

Write-Success "Permissions set"

# Step 5: Create/update .htaccess
Write-Info ""
Write-Info "Step 5: Configuring .htaccess..."
$HtaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase $HtaccessRewriteBase
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
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

$TempHtaccess = New-TemporaryFile
Set-Content -Path $TempHtaccess -Value $HtaccessContent -Encoding UTF8

scp $TempHtaccess "$RemoteHost`:$RemotePath/.htaccess"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload .htaccess"
    Remove-Item $TempHtaccess
    exit 1
}

ssh $RemoteHost "chown $FileOwnership $RemotePath/.htaccess && chmod 644 $RemotePath/.htaccess"
Remove-Item $TempHtaccess

Write-Success ".htaccess configured"

# Step 6: Verify deployment
Write-Info ""
Write-Info "Step 6: Verifying deployment..."
ssh $RemoteHost "test -f $RemotePath/index.html && echo 'index.html found'" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Deployment verified"
} else {
    Write-Error-Custom "Deployment verification failed"
    exit 1
}

Write-Info ""
Write-Success "ClipAI deployed successfully!"
Write-Info "Access: https://ai-tools.techbridge.edu.gh/clipai/"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
$ErrorActionPreference = "Stop"

# Configuration
$RemoteHost = "root@techbridge.edu.gh"
$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/clipai/"
$FileOwnership = "aucdtadmin:psacln"
$HtaccessRewriteBase = "/clipai/"
$LocalBuildPath = "dist"

# Colors for output
$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $SuccessColor
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $ErrorColor
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $WarningColor
}

Write-Info "ClipAI Deployment Script"
Write-Info "Environment: $Environment"
Write-Info "================================"

# Step 1: Build the project
Write-Info ""
Write-Info "Step 1: Building project..."
if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found. Run from project root."
    exit 1
}

pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm install failed"
    exit 1
}

pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "pnpm build failed"
    exit 1
}

Write-Success "Build completed"

# Step 2: Verify dist directory
Write-Info ""
Write-Info "Step 2: Verifying build output..."
if (-not (Test-Path $LocalBuildPath)) {
    Write-Error-Custom "Build output directory '$LocalBuildPath' not found"
    exit 1
}

$FileCount = (Get-ChildItem -Path $LocalBuildPath -Recurse).Count
Write-Success "Build output verified ($FileCount files)"

# Step 3: Deploy to remote server
Write-Info ""
Write-Info "Step 3: Deploying to remote server..."
Write-Info "Remote: $RemoteHost"
Write-Info "Path: $RemotePath"

# Create remote directory if it doesn't exist
ssh $RemoteHost "mkdir -p $RemotePath" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to create remote directory"
    exit 1
}

# Upload files via scp
Write-Info "Uploading files..."
$SourcePath = (Get-Item $LocalBuildPath).FullName
scp -r "$SourcePath/*" "$RemoteHost`:$RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload files"
    exit 1
}

Write-Success "Files uploaded"

# Step 4: Set file permissions
Write-Info ""
Write-Info "Step 4: Setting file permissions..."
ssh $RemoteHost "chown -R $FileOwnership $RemotePath && chmod -R 755 $RemotePath"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to set permissions"
    exit 1
}

Write-Success "Permissions set"

# Step 5: Create/update .htaccess
Write-Info ""
Write-Info "Step 5: Configuring .htaccess..."
$HtaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase $HtaccessRewriteBase
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
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

$TempHtaccess = New-TemporaryFile
Set-Content -Path $TempHtaccess -Value $HtaccessContent -Encoding UTF8

scp $TempHtaccess "$RemoteHost`:$RemotePath/.htaccess"
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to upload .htaccess"
    Remove-Item $TempHtaccess
    exit 1
}

ssh $RemoteHost "chown $FileOwnership $RemotePath/.htaccess && chmod 644 $RemotePath/.htaccess"
Remove-Item $TempHtaccess

Write-Success ".htaccess configured"

# Step 6: Verify deployment
Write-Info ""
Write-Info "Step 6: Verifying deployment..."
ssh $RemoteHost "test -f $RemotePath/index.html && echo 'index.html found'" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Deployment verified"
} else {
    Write-Error-Custom "Deployment verification failed"
    exit 1
}

Write-Info ""
Write-Success "ClipAI deployed successfully!"
Write-Info "Access: https://ai-tools.techbridge.edu.gh/clipai/"
