# PowerShell CI/CD Pipeline for Building All 83 AUCDT Apps

param(
    [ValidateSet('core', 'standard', 'experimental', 'all')]
    [string]$Profile = 'core',
    [switch]$Parallel = $false,
    [int]$MaxConcurrent = 3
)

$ErrorActionPreference = 'Continue'

# Configuration
$ProjectRoot = Get-Location
$LogDir = Join-Path $ProjectRoot 'build-logs'
$BuildStart = Get-Date
$SuccessfulApps = @()
$FailedApps = @()
$BuildTimeout = 600  # seconds

# Create log directory
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

function Write-Info {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✗ $Message" -ForegroundColor Red
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⚠ $Message" -ForegroundColor Yellow
}

function Get-AllApps {
    Write-Info "Scanning for apps..."
    
    $skipDirs = @('docker', 'node_modules', '.github', '.claude', 'Document', '.git')
    $apps = Get-ChildItem -Directory -ErrorAction SilentlyContinue | 
            Where-Object { $skipDirs -notcontains $_.Name } |
            Where-Object { Test-Path (Join-Path $_.FullName 'package.json') } |
            Select-Object -ExpandProperty Name |
            Sort-Object
    
    return $apps
}

function Categorize-Apps {
    param([array]$Apps)
    
            $coreApps = @(
                'analytics-refactor',
                'fees-comparison-dashboard',
                'tuc-analytics-dashboard',
                'kanban-app',
                'tuc-website-react',
                'techbridge-product-design-6r-design-portal'
            )    
    $experimentalKeywords = @('ai-', 'gemini', 'genie', 'bot')
    
    $core = @()
    $standard = @()
    $experimental = @()
    
    foreach ($app in $Apps) {
        if ($coreApps -contains $app) {
            $core += $app
        } elseif ($app -match ($experimentalKeywords -join '|')) {
            $experimental += $app
        } else {
            $standard += $app
        }
    }
    
    return @{
        core = $core
        standard = $standard
        experimental = $experimental
        all = $Apps
    }
}

function Build-App {
    param(
        [string]$AppName,
        [string]$LogFile
    )
    
    Write-Info "Building $AppName..."
    
    if ($AppName -eq 'nginx-gateway') {
        Write-Success "Skipped $AppName (pre-built image)"
        return $true
    }
    
    if (!(Test-Path "./$AppName")) {
        Write-Warn "Skipped $AppName (directory not found)"
        return $true
    }
    
    $buildOutput = @()
    $buildError = $false
    
    try {
        $process = Start-Process docker -ArgumentList "compose", "-f", "docker-compose-all-apps.yml", "build", $AppName `
                   -NoNewWindow -RedirectStandardOutput $LogFile -PassThru -Wait -Timeout $BuildTimeout
        
        if ($process.ExitCode -eq 0) {
            Write-Success "Built $AppName"
            $global:SuccessfulApps += $AppName
            return $true
        } else {
            Write-Error-Custom "Failed to build $AppName (exit code: $($process.ExitCode))"
            Write-Warn "See $LogFile for details"
            $global:FailedApps += $AppName
            return $false
        }
    } catch {
        Write-Error-Custom "Build timeout or error for $AppName"
        $global:FailedApps += $AppName
        return $false
    }
}

function Validate-Apps {
    param([array]$Apps)
    
    Write-Info "Validating apps..."
    
    $validApps = @()
    foreach ($app in $Apps) {
        if (!(Test-Path "./$app/package.json")) {
            Write-Warn "$app: no package.json found"
            continue
        }
        
        if (!(Test-Path "./Dockerfile.vite")) {
            Write-Warn "Dockerfile.vite not found"
            continue
        }
        
        $validApps += $app
    }
    
    Write-Success "Validated $($validApps.Count) apps"
    return $validApps
}

function Main {
    Write-Info "========================================="
    Write-Info "TUC Apps Build Pipeline"
    Write-Info "Profile: $Profile"
    Write-Info "========================================="
    Write-Host ""
    
    # Get and categorize apps
    $allApps = Get-AllApps
    Write-Success "Found $($allApps.Count) total apps"
    
    $categories = Categorize-Apps -Apps $allApps
    Write-Info "Core: $($categories.core.Count) | Standard: $($categories.standard.Count) | Experimental: $($categories.experimental.Count)"
    Write-Host ""
    
    # Select apps to build based on profile
    $appsToBuild = switch ($Profile) {
        'core' { $categories.core }
        'standard' { $categories.core + $categories.standard }
        'experimental' { $categories.core + $categories.experimental }
        'all' { $categories.all }
    }
    
    Write-Info "Building $($appsToBuild.Count) apps..."
    Write-Host ""
    
    # Validate
    $validApps = Validate-Apps -Apps $appsToBuild
    Write-Host ""
    
    # Build
    Write-Info "Phase 1: Building..."
    foreach ($app in $validApps) {
        $logFile = Join-Path $LogDir "$app.log"
        Build-App -AppName $app -LogFile $logFile
    }
    
    Write-Host ""
    Write-Info "========================================="
    Write-Info "Build Summary"
    Write-Info "========================================="
    Write-Host ""
    
    $buildEnd = Get-Date
    $duration = ($buildEnd - $BuildStart).TotalSeconds
    
    Write-Success "Successful: $($SuccessfulApps.Count) / $($appsToBuild.Count)"
    if ($SuccessfulApps.Count -gt 0 -and $SuccessfulApps.Count -le 10) {
        $SuccessfulApps | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Green }
    } elseif ($SuccessfulApps.Count -gt 10) {
        $SuccessfulApps | Select-Object -First 10 | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Green }
        Write-Host "  ... and $($SuccessfulApps.Count - 10) more" -ForegroundColor Green
    }
    
    Write-Host ""
    
    if ($FailedApps.Count -gt 0) {
        Write-Error-Custom "Failed: $($FailedApps.Count) / $($appsToBuild.Count)"
        $FailedApps | Select-Object -First 10 | ForEach-Object { Write-Host "  ✗ $_" -ForegroundColor Red }
        if ($FailedApps.Count -gt 10) {
            Write-Host "  ... and $($FailedApps.Count - 10) more" -ForegroundColor Red
        }
    } else {
        Write-Success "All apps built successfully!"
    }
    
    Write-Host ""
    Write-Info "Duration: $([math]::Round($duration, 2))s"
    Write-Info "Logs: $LogDir"
    
    Write-Host ""
    if ($FailedApps.Count -eq 0) {
        Write-Success "Build pipeline completed successfully!"
        return 0
    } else {
        Write-Error-Custom "Build pipeline completed with $($FailedApps.Count) failures"
        return 1
    }
}

Main
