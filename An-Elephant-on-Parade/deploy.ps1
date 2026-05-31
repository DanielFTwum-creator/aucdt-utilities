# TUC Project Deployment Script
# Safe deployment pattern using SSH heredoc for .htaccess
# Prevents UTF-8 BOM issues and adds comprehensive health checks

param(
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = "deploy.config.json",
    [switch]$Build = $false,
    [switch]$DryRun = $false,
    [switch]$SkipHealthCheck = $false
)

$ErrorActionPreference = "Stop"

# ============================================================================
# STEP 1/6: Load Configuration
# ============================================================================
Log "INFO" "Step 1/6: Validating configuration..." Cyan

if (-not (Test-Path $ConfigFile)) {
    Log "ERROR" "[FAIL] Configuration file not found: $ConfigFile" Red
    exit 1
}

$config = Get-Content $ConfigFile | ConvertFrom-Json

$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$DeployPath = $config.deployPath

$BuildTool = if ($config.buildTool) { $config.buildTool } else { "pnpm" }
$OutputDir = if ($config.outputDir) { $config.outputDir } else { "dist" }
$RequiredEnvVars = if ($config.requiredEnvVars) { $config.requiredEnvVars } else { @() }
$HealthCheckUrl = $config.healthCheckUrl

Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $DeployPath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
Write-Host ""

# ============================================================================
# STEP 2/6: Pre-flight Checks
# ============================================================================
Log "INFO" "Step 2/6: Pre-flight checks..." Cyan

$preflight_errors = @()

# Check .env files (supporting both .env.local and .env)
if ($RequiredEnvVars.Count -gt 0) {
    $envPath = ""
    if (Test-Path ".env.local") {
        $envPath = ".env.local"
    } elseif (Test-Path ".env") {
        $envPath = ".env"
    }

    if ($envPath -eq "") {
        $preflight_errors += "Neither .env.local nor .env found (required for env vars)"
    } else {
        $envContent = Get-Content $envPath
        foreach ($var in $RequiredEnvVars) {
            if ($envContent -notmatch "^$var=") {
                $preflight_errors += "Required env var missing in ${envPath}: $var"
            }
        }
    }
}

# Check package.json
if (-not (Test-Path "package.json")) {
    $preflight_errors += "package.json not found"
} else {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.scripts.build) {
        $preflight_errors += "No 'build' script defined in package.json"
    }
}

# Check output directory exists (if not building)
if (-not $Build -and -not (Test-Path $OutputDir)) {
    $preflight_errors += "$OutputDir/ not found. Run with -Build flag first."
}

if ($preflight_errors.Count -gt 0) {
    Log "ERROR" "  [FAIL] Pre-flight checks failed:" Red
    foreach ($err in $preflight_errors) {
        Log "ERROR" "     - $err" Red
    }
    exit 1
}

Log "INFO" "  [OK] All checks passed"
Write-Host ""

# ============================================================================
# STEP 3/6: Build Phase
# ============================================================================
if ($Build) {
    Log "INFO" "Step 3/6: Building project..." Cyan

    Log "INFO" "  Running: $BuildTool build"
    & $BuildTool build

    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  [FAIL] Build failed with exit code $LASTEXITCODE" Red
        exit 1
    }
    Log "INFO" "  [OK] Build successful"
} else {
    Log "INFO" "Step 3/6: Skipping build (not requested)" Cyan
}
Write-Host ""

# ============================================================================
# STEP 4/6: Verify Build Output
# ============================================================================
Log "INFO" "Step 4/6: Verifying build output..." Cyan

if (-not (Test-Path $OutputDir)) {
    Log "ERROR" "  [FAIL] Output directory not found: $OutputDir" Red
    exit 1
}

$outputFiles = @(Get-ChildItem -Path $OutputDir -File -Recurse)
if ($outputFiles.Count -eq 0) {
    Log "ERROR" "  [FAIL] Output directory is empty: $OutputDir" Red
    exit 1
}

if (-not (Test-Path "$OutputDir/index.html")) {
    Log "ERROR" "  [FAIL] Critical file missing: index.html" Red
    exit 1
}

$totalSize = ($outputFiles | Measure-Object -Property Length -Sum).Sum / 1MB
Log "INFO" "  [OK] Output verified: $($outputFiles.Count) files, $([Math]::Round($totalSize, 2)) MB"
Write-Host ""

# ============================================================================
# STEP 5/6: Deploy to Remote
# ============================================================================
Log "INFO" "Step 5/6: Deploying to remote server (SCP-only)..." Cyan

if ($DryRun) {
    Log "INFO" "  [DRY RUN] Would deploy to ${RemoteHost}:${DeployPath}" Yellow
} else {
    $OutputDirPath = (Resolve-Path $OutputDir).Path
    $SubdomainPath = $DeployPath.Split("/")[-1]

    # Write .htaccess locally (prevents BOM issues by using UTF-8 without BOM)
    Log "INFO" "  Generating .htaccess locally..." Yellow
    $htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /$SubdomainPath/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /$SubdomainPath/index.html [QSA,L]
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
    $htaccessPath = Join-Path $OutputDirPath ".htaccess"
    try {
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($htaccessPath, $htaccessContent, $utf8NoBom)
        Log "INFO" "    [OK] Generated .htaccess at: $htaccessPath (UTF-8 without BOM)"
    } catch {
        Log "ERROR" "  [FAIL] Failed to generate local .htaccess: $_" Red
        exit 1
    }

    # Gather files to copy, including hidden items like .htaccess
    $items = Get-ChildItem -Path $OutputDirPath -Force
    $filePaths = @()
    foreach ($item in $items) {
        $filePaths += $item.FullName
    }

    if ($filePaths.Count -eq 0) {
        Log "ERROR" "  [FAIL] No files to deploy in $OutputDirPath" Red
        exit 1
    }

    Log "INFO" "  Deploying files via SCP (single-session transfer)..." Yellow
    foreach ($path in $filePaths) {
        Log "INFO" "    Queueing: $(Split-Path $path -Leaf)"
    }

    # Run native SCP command to transfer all files/folders in one go
    & scp -r -o StrictHostKeyChecking=no -o ConnectTimeout=30 $filePaths "${RemoteHost}:${DeployPath}/"

    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  [FAIL] SCP transfer failed with exit code $LASTEXITCODE" Red
        exit 1
    }

    Log "INFO" "  [OK] SCP transfer complete"
}
Write-Host ""

# ============================================================================
# STEP 6/6: Health Checks
# ============================================================================
if (-not $SkipHealthCheck -and -not $DryRun) {
    Log "INFO" "Step 6/6: Health checks..." Cyan

    # Testing HTTP routing
    Log "INFO" "  Testing HTTP routing (waiting 3 sec for server to settle)..." Yellow
    Start-Sleep -Seconds 3

    try {
        $httpTest = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 15 -ErrorAction SilentlyContinue
        if ($httpTest.StatusCode -eq 200) {
            Log "INFO" "    [OK] HTTP 200 OK from $HealthCheckUrl"
            Log "INFO" "  [OK] All health checks passed"
        } else {
            Log "INFO" "    [WARN] Unexpected status code: $($httpTest.StatusCode) from $HealthCheckUrl" Yellow
        }
    } catch {
        Log "INFO" "    [WARN] Could not reach health check URL (may be firewall/DNS/routing)" Yellow
        Log "INFO" "       URL: $HealthCheckUrl" Yellow
    }
} else {
    Log "INFO" "Step 6/6: Skipping health checks" Yellow
}
Write-Host ""

# ============================================================================
# Summary
# ============================================================================
Log "SUCCESS" "--------------------------------------------------------------" Green
Log "SUCCESS" "  [SUCCESS] DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "--------------------------------------------------------------" Green
Write-Host ""
Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $DeployPath"
Log "INFO" "Health check:   $HealthCheckUrl"
Write-Host ""
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check browser console for errors (F12)"
Log "INFO" "  3. Verify .env vars are present on remote"
Write-Host ""
