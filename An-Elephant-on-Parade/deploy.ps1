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
Write-Host "Step 1/6: Validating configuration..." -ForegroundColor Cyan

if (-not (Test-Path $ConfigFile)) {
    Write-Host "[FAIL] Configuration file not found: $ConfigFile" -ForegroundColor Red
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

Write-Host "  Project:        $ProjectName"
Write-Host "  Remote host:    $RemoteHost"
Write-Host "  Deploy path:    $DeployPath"
Write-Host "  Build tool:     $BuildTool"
Write-Host "  Output dir:     $OutputDir"
Write-Host "  Health check:   $HealthCheckUrl"
Write-Host ""

# ============================================================================
# STEP 2/6: Pre-flight Checks
# ============================================================================
Write-Host "Step 2/6: Pre-flight checks..." -ForegroundColor Cyan

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
    Write-Host "  [FAIL] Pre-flight checks failed:" -ForegroundColor Red
    foreach ($err in $preflight_errors) {
        Write-Host "     - $err" -ForegroundColor Red
    }
    exit 1
}

Write-Host "  [OK] All checks passed"
Write-Host ""

# ============================================================================
# STEP 3/6: Build Phase
# ============================================================================
if ($Build) {
    Write-Host "Step 3/6: Building project..." -ForegroundColor Cyan

    Write-Host "  Running: $BuildTool build"
    & $BuildTool build

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    Write-Host "  [OK] Build successful"
} else {
    Write-Host "Step 3/6: Skipping build (not requested)" -ForegroundColor Cyan
}
Write-Host ""

# ============================================================================
# STEP 4/6: Verify Build Output
# ============================================================================
Write-Host "Step 4/6: Verifying build output..." -ForegroundColor Cyan

if (-not (Test-Path $OutputDir)) {
    Write-Host "  [FAIL] Output directory not found: $OutputDir" -ForegroundColor Red
    exit 1
}

$outputFiles = @(Get-ChildItem -Path $OutputDir -File -Recurse)
if ($outputFiles.Count -eq 0) {
    Write-Host "  [FAIL] Output directory is empty: $OutputDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$OutputDir/index.html")) {
    Write-Host "  [FAIL] Critical file missing: index.html" -ForegroundColor Red
    exit 1
}

$totalSize = ($outputFiles | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "  [OK] Output verified: $($outputFiles.Count) files, $([Math]::Round($totalSize, 2)) MB"
Write-Host ""

# ============================================================================
# STEP 5/6: Deploy to Remote
# ============================================================================
Write-Host "Step 5/6: Deploying to remote server (SCP-only)..." -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [DRY RUN] Would deploy to ${RemoteHost}:${DeployPath}" -ForegroundColor Yellow
} else {
    $OutputDirPath = (Resolve-Path $OutputDir).Path
    $SubdomainPath = $DeployPath.Split("/")[-1]

    # Write .htaccess locally (prevents BOM issues by using UTF-8 without BOM)
    Write-Host "  Generating .htaccess locally..." -ForegroundColor Yellow
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
        Write-Host "    [OK] Generated .htaccess at: $htaccessPath (UTF-8 without BOM)"
    } catch {
        Write-Host "  [FAIL] Failed to generate local .htaccess: $_" -ForegroundColor Red
        exit 1
    }

    # Gather files to copy, including hidden items like .htaccess
    $items = Get-ChildItem -Path $OutputDirPath -Force
    $filePaths = @()
    foreach ($item in $items) {
        $filePaths += $item.FullName
    }

    if ($filePaths.Count -eq 0) {
        Write-Host "  [FAIL] No files to deploy in $OutputDirPath" -ForegroundColor Red
        exit 1
    }

    Write-Host "  Deploying files via SCP (single-session transfer)..." -ForegroundColor Yellow
    foreach ($path in $filePaths) {
        Write-Host "    Queueing: $(Split-Path $path -Leaf)"
    }

    # Run native SCP command to transfer all files/folders in one go
    & scp -r -o StrictHostKeyChecking=no -o ConnectTimeout=30 $filePaths "${RemoteHost}:${DeployPath}/"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] SCP transfer failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }

    Write-Host "  [OK] SCP transfer complete"
}
Write-Host ""

# ============================================================================
# STEP 6/6: Health Checks
# ============================================================================
if (-not $SkipHealthCheck -and -not $DryRun) {
    Write-Host "Step 6/6: Health checks..." -ForegroundColor Cyan

    # Testing HTTP routing
    Write-Host "  Testing HTTP routing (waiting 3 sec for server to settle)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3

    try {
        $httpTest = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 15 -ErrorAction SilentlyContinue
        if ($httpTest.StatusCode -eq 200) {
            Write-Host "    [OK] HTTP 200 OK from $HealthCheckUrl"
            Write-Host "  [OK] All health checks passed"
        } else {
            Write-Host "    [WARN] Unexpected status code: $($httpTest.StatusCode) from $HealthCheckUrl" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "    [WARN] Could not reach health check URL (may be firewall/DNS/routing)" -ForegroundColor Yellow
        Write-Host "       URL: $HealthCheckUrl" -ForegroundColor Yellow
    }
} else {
    Write-Host "Step 6/6: Skipping health checks" -ForegroundColor Yellow
}
Write-Host ""

# ============================================================================
# Summary
# ============================================================================
Write-Host "--------------------------------------------------------------" -ForegroundColor Green
Write-Host "  [SUCCESS] DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "--------------------------------------------------------------" -ForegroundColor Green
Write-Host ""
Write-Host "Project:        $ProjectName"
Write-Host "Remote:         $RemoteHost"
Write-Host "Path:           $DeployPath"
Write-Host "Health check:   $HealthCheckUrl"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Visit $HealthCheckUrl to verify deployment"
Write-Host "  2. Check browser console for errors (F12)"
Write-Host "  3. Verify .env vars are present on remote"
Write-Host ""
