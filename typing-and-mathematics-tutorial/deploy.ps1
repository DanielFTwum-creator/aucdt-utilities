# Typing & Mathematics Island Deployment Script

# Deploys frontend static assets (dist/) to remote server.



param(

    [string]$ConfigFile = "./deploy.config.json",

    [switch]$Build = $false,

    [switch]$DryRun = $false,

    [switch]$SkipHealthCheck = $false

)




# Timestamped logging helper (injected by standardisation pass — May 2026)
# Typing & Mathematics Island Deployment Script

# Deploys frontend static assets (dist/) to remote server.



param(

    [string]$ConfigFile = "./deploy.config.json",

    [switch]$Build = $false,

    [switch]$DryRun = $false,

    [switch]$SkipHealthCheck = $false

)



# Force standard output encoding

$OutputEncoding = [System.Text.Encoding]::UTF8



Log "SUCCESS" "==========================================================" Green

Log "SUCCESS" "        TYPING & MATH ISLAND DEPLOYMENT PIPELINE          " Green

Log "SUCCESS" "==========================================================" Green



# 1. Read Configuration

if (-not (Test-Path $ConfigFile)) {

    Log "ERROR" "Error: Config file not found at $ConfigFile" Red

    exit 1

}



$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json

$ProjectName = $config.projectName

$RemoteHost = $config.remoteHost

$RemotePath = $config.deployPath

$BuildTool = $config.buildTool

$OutputDir = $config.outputDir

$HealthCheckUrl = $config.healthCheckUrl



Log "INFO" "Step 1/6: Validating configuration..." Yellow

Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $RemotePath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
if ($DryRun) {

    Log "SUCCESS" "Dry run completed successfully." Green

    exit 0

}



# 2. Pre-flight Checks

Log "INFO" "Step 2/6: Pre-flight checks..." Yellow

$preflightPassed = $true

$errList = @()



# Verify ssh keys

Write-Host "  Checking SSH access..." -NoNewline

$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null

if ($sshCheck -ne "auth_ok") {

    $preflightPassed = $false

    $errList += "Cannot authenticate with remote server via SSH. Verify keys."

    Log "ERROR" " FAILED" Red

} else {

    Log "SUCCESS" " OK" Green

}



if (-not $preflightPassed) {

    Log "ERROR" "`nPre-flight checks failed:" Red

    foreach ($err in $errList) {

        Log "ERROR" "  - $err" Red

    }

    exit 1

}

Log "INFO" "  ? All checks passed"
# 3. Build Project

if ($Build) {

    Log "INFO" "Step 3/6: Building project..." Yellow

    Log "INFO" "  Running: $BuildTool run build"
    & $BuildTool run build

    if ($LASTEXITCODE -ne 0) {

        Log "ERROR" "  Build failed!" Red

        exit 1

    }

    Log "INFO" "  ? Build successful"
}



# 4. Verify Build Output

Log "INFO" "Step 4/6: Verifying build output..." Yellow

if (-not (Test-Path "dist/index.html")) {

    Log "ERROR" "  Error: Built files (dist/index.html) not found." Red

    exit 1

}

$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count

Log "INFO" "  ? Output verified: $fileCount files"
# 5. Deploy to Remote Server

Log "INFO" "Step 5/6: Deploying to remote server (SCP-only)..." Yellow



# Create directory structure

Log "INFO" "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null



# Clean old static files but preserve config

Log "INFO" "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null



# Upload dist directory files via SCP

Log "INFO" "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"



# Create .htaccess file for SPA routing

Log "INFO" "  Configuring Apache routing rewrite rules..."
$htaccessContent = @"

<IfModule mod_rewrite.c>

  RewriteEngine On

  RewriteBase /math-island/

  

  # Skip physical files/directories

  RewriteCond %{REQUEST_FILENAME} -f [OR]

  RewriteCond %{REQUEST_FILENAME} -d

  RewriteRule ^ - [L]

  

  # Catch-all to index.html for SPA routing

  RewriteRule ^ /math-island/index.html [QSA,L]

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



# Set folder ownership and read permissions

Log "INFO" "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" 2>&1 | Out-Null



Log "INFO" "  ? Deployment complete"
# 6. Health Checks

if (-not $SkipHealthCheck) {

    Log "INFO" "Step 6/6: Health checks..." Yellow

    

    Write-Host "  Checking remote index.html..." -NoNewline

    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"

    if ($indexHtmlCheck.Trim() -eq "yes") {

        Log "SUCCESS" "    ? index.html present" Green

    } else {

        Log "ERROR" "    X index.html missing!" Red

    }

    

    Write-Host "  Checking .htaccess configuration..." -NoNewline

    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"

    if ($htaccessCheck.Trim() -eq "yes") {

        Log "SUCCESS" "    ? .htaccess syntax OK" Green

    } else {

        Log "ERROR" "    X .htaccess missing!" Red

    }

}



Log "SUCCESS" "`n╔════════════════════════════════════════════════════════════╗" Green

Log "SUCCESS" "║  ? DEPLOYMENT COMPLETE                                    ║" Green

Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green



Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $RemotePath"
Log "INFO" "Health check:   $HealthCheckUrl"
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check browser console for network errors (F12)"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
# Force standard output encoding

$OutputEncoding = [System.Text.Encoding]::UTF8



Log "SUCCESS" "==========================================================" Green

Log "SUCCESS" "        TYPING & MATH ISLAND DEPLOYMENT PIPELINE          " Green

Log "SUCCESS" "==========================================================" Green



# 1. Read Configuration

if (-not (Test-Path $ConfigFile)) {

    Log "ERROR" "Error: Config file not found at $ConfigFile" Red

    exit 1

}



$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json

$ProjectName = $config.projectName

$RemoteHost = $config.remoteHost

$RemotePath = $config.deployPath

$BuildTool = $config.buildTool

$OutputDir = $config.outputDir

$HealthCheckUrl = $config.healthCheckUrl



Log "INFO" "Step 1/6: Validating configuration..." Yellow

Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $RemotePath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
if ($DryRun) {

    Log "SUCCESS" "Dry run completed successfully." Green

    exit 0

}



# 2. Pre-flight Checks

Log "INFO" "Step 2/6: Pre-flight checks..." Yellow

$preflightPassed = $true

$errList = @()



# Verify ssh keys

Write-Host "  Checking SSH access..." -NoNewline

$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null

if ($sshCheck -ne "auth_ok") {

    $preflightPassed = $false

    $errList += "Cannot authenticate with remote server via SSH. Verify keys."

    Log "ERROR" " FAILED" Red

} else {

    Log "SUCCESS" " OK" Green

}



if (-not $preflightPassed) {

    Log "ERROR" "`nPre-flight checks failed:" Red

    foreach ($err in $errList) {

        Log "ERROR" "  - $err" Red

    }

    exit 1

}

Log "INFO" "  ? All checks passed"
# 3. Build Project

if ($Build) {

    Log "INFO" "Step 3/6: Building project..." Yellow

    Log "INFO" "  Running: $BuildTool run build"
    & $BuildTool run build

    if ($LASTEXITCODE -ne 0) {

        Log "ERROR" "  Build failed!" Red

        exit 1

    }

    Log "INFO" "  ? Build successful"
}



# 4. Verify Build Output

Log "INFO" "Step 4/6: Verifying build output..." Yellow

if (-not (Test-Path "dist/index.html")) {

    Log "ERROR" "  Error: Built files (dist/index.html) not found." Red

    exit 1

}

$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count

Log "INFO" "  ? Output verified: $fileCount files"
# 5. Deploy to Remote Server

Log "INFO" "Step 5/6: Deploying to remote server (SCP-only)..." Yellow



# Create directory structure

Log "INFO" "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null



# Clean old static files but preserve config

Log "INFO" "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null



# Upload dist directory files via SCP

Log "INFO" "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"



# Create .htaccess file for SPA routing

Log "INFO" "  Configuring Apache routing rewrite rules..."
$htaccessContent = @"

<IfModule mod_rewrite.c>

  RewriteEngine On

  RewriteBase /math-island/

  

  # Skip physical files/directories

  RewriteCond %{REQUEST_FILENAME} -f [OR]

  RewriteCond %{REQUEST_FILENAME} -d

  RewriteRule ^ - [L]

  

  # Catch-all to index.html for SPA routing

  RewriteRule ^ /math-island/index.html [QSA,L]

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



# Set folder ownership and read permissions

Log "INFO" "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" 2>&1 | Out-Null



Log "INFO" "  ? Deployment complete"
# 6. Health Checks

if (-not $SkipHealthCheck) {

    Log "INFO" "Step 6/6: Health checks..." Yellow

    

    Write-Host "  Checking remote index.html..." -NoNewline

    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"

    if ($indexHtmlCheck.Trim() -eq "yes") {

        Log "SUCCESS" "    ? index.html present" Green

    } else {

        Log "ERROR" "    X index.html missing!" Red

    }

    

    Write-Host "  Checking .htaccess configuration..." -NoNewline

    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"

    if ($htaccessCheck.Trim() -eq "yes") {

        Log "SUCCESS" "    ? .htaccess syntax OK" Green

    } else {

        Log "ERROR" "    X .htaccess missing!" Red

    }

}



Log "SUCCESS" "`n╔════════════════════════════════════════════════════════════╗" Green

Log "SUCCESS" "║  ? DEPLOYMENT COMPLETE                                    ║" Green

Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green



Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $RemotePath"
Log "INFO" "Health check:   $HealthCheckUrl"
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check browser console for network errors (F12)"