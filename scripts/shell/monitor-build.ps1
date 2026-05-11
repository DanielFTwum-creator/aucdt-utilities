#!/usr/bin/env powershell
# Build Status Monitor - Real-time progress tracking

param(
    [int]$RefreshInterval = 5  # seconds
)

$ErrorActionPreference = 'SilentlyContinue'

# ANSI Colors
$colors = @{
    cyan    = "`e[36m"
    green   = "`e[32m"
    yellow  = "`e[33m"
    red     = "`e[31m"
    blue    = "`e[34m"
    magenta = "`e[35m"
    reset   = "`e[0m"
    bold    = "`e[1m"
}

function Show-Status {
    param(
        [string]$Stage,
        [string]$Message,
        [ValidateSet('info', 'success', 'warning', 'error')]
        [string]$Type = 'info'
    )
    
    $icon = @{
        'info'    = "ℹ️ "
        'success' = "✅"
        'warning' = "⚠️ "
        'error'   = "❌"
    }
    
    $color = @{
        'info'    = $colors.cyan
        'success' = $colors.green
        'warning' = $colors.yellow
        'error'   = $colors.red
    }
    
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "$($color[$Type])$($icon[$Type]) [$time] $Stage$($colors.reset)" -NoNewline
    Write-Host " $Message"
}

function Format-Duration {
    param([timespan]$Duration)
    if ($Duration.TotalSeconds -lt 60) {
        return "$([math]::Round($Duration.TotalSeconds))s"
    } else {
        return "$([math]::Floor($Duration.TotalMinutes))m $($Duration.Seconds)s"
    }
}

function Get-BuildProgress {
    $logFile = '.\build-output.log'
    
    if (-not (Test-Path $logFile)) {
        return $null
    }
    
    $content = Get-Content $logFile -Raw
    
    $progress = @{
        BuildsCompleted = ($content | Select-String '\] DONE' | Measure-Object).Count
        BuildsInProgress = ($content | Select-String 'Building|RUN|COPY' | Measure-Object).Count
        HasNpmInstall = $content -match 'npm install'
        HasBuildStep = $content -match 'npm run build'
        HasErrors = $content -match 'ERROR|error|failed'
    }
    
    return $progress
}

function Get-ContainerStatus {
    try {
        $containers = docker ps -a --format "{{.Names}}\t{{.Status}}" 2>$null
        $running = ($containers | Where-Object { $_ -match 'Up' } | Measure-Object).Count
        $exited = ($containers | Where-Object { $_ -match 'Exited' } | Measure-Object).Count
        $unhealthy = ($containers | Where-Object { $_ -match 'unhealthy' } | Measure-Object).Count
        
        return @{
            running     = $running
            exited      = $exited
            unhealthy   = $unhealthy
        }
    } catch {
        return $null
    }
}

# Main monitor loop
Clear-Host
Write-Host ""
Write-Host "$($colors.bold)$($colors.cyan)╔══════════════════════════════════════════════════════════╗$($colors.reset)"
Write-Host "$($colors.bold)$($colors.cyan)║           AUCDT Docker Build Status Monitor              ║$($colors.reset)"
Write-Host "$($colors.bold)$($colors.cyan)╚══════════════════════════════════════════════════════════╝$($colors.reset)"
Write-Host ""

$startTime = Get-Date
$lastRefresh = Get-Date

Show-Status "INIT" "Starting build monitor..." "info"
Show-Status "CONFIG" "Services: 89 (6 core + 70 standard + 12 experimental + gateway)" "info"
Show-Status "CONFIG" "Refresh interval: ${RefreshInterval}s" "info"
Write-Host ""

$previousProgress = $null
$stage = "initializing"

while ($true) {
    # Get elapsed time
    $elapsed = (Get-Date) - $startTime
    $duration = Format-Duration $elapsed
    
    # Get build progress
    $progress = Get-BuildProgress
    $containers = Get-ContainerStatus
    
    # Detect stage
    if ($progress) {
        if ($progress.HasErrors) {
            $stage = "error"
        } elseif ($progress.HasBuildStep) {
            $stage = "building"
        } elseif ($progress.HasNpmInstall) {
            $stage = "installing"
        } elseif ($progress.BuildsCompleted -gt 0) {
            $stage = "downloading"
        }
    }
    
    if ($containers) {
        if ($containers.running -ge 6) {
            $stage = "running"
        }
    }
    
    # Clear last 10 lines and redraw
    Write-Host "`e[s"  # Save cursor
    
    # Display header
    Write-Host "$($colors.bold)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$($colors.reset)"
    Write-Host "$($colors.magenta)$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')$($colors.reset) | Elapsed: $($colors.bold)$($colors.cyan)$duration$($colors.reset)"
    Write-Host "$($colors.bold)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$($colors.reset)"
    
    # Stage indicator
    $stageColor = @{
        'initializing' = $colors.yellow
        'downloading'  = $colors.yellow
        'installing'   = $colors.yellow
        'building'     = $colors.blue
        'running'      = $colors.green
        'error'        = $colors.red
    }
    
    $stageIcon = @{
        'initializing' = "⏳"
        'downloading'  = "⬇️ "
        'installing'   = "📦"
        'building'     = "🔨"
        'running'      = "✅"
        'error'        = "❌"
    }
    
    Write-Host "$($stageColor[$stage])$($stageIcon[$stage]) Stage: $($stage.ToUpper())$($colors.reset)"
    
    # Progress details
    if ($progress) {
        Write-Host ""
        Write-Host "$($colors.cyan)Build Progress:$($colors.reset)"
        Write-Host "  • Builds completed: $($progress.BuildsCompleted)"
        Write-Host "  • Builds in progress: $($progress.BuildsInProgress)"
        Write-Host "  • npm install: $(if ($progress.HasNpmInstall) { '✓' } else { '⏳' })"
        Write-Host "  • Build step: $(if ($progress.HasBuildStep) { '✓' } else { '⏳' })"
    }
    
    # Container status
    if ($containers) {
        Write-Host ""
        Write-Host "$($colors.cyan)Container Status:$($colors.reset)"
        Write-Host "  • Running: $($colors.green)$($containers.running)$($colors.reset)"
        Write-Host "  • Exited: $($containers.exited)"
        Write-Host "  • Unhealthy: $(if ($containers.unhealthy -gt 0) { "$($colors.red)$($containers.unhealthy)$($colors.reset)" } else { '0' })"
    }
    
    # Timeline
    Write-Host ""
    Write-Host "$($colors.cyan)Timeline:$($colors.reset)"
    Write-Host "  • Started: $(Get-Date $startTime -Format 'HH:mm:ss')"
    Write-Host "  • Elapsed: $($colors.bold)$duration$($colors.reset)"
    
    if ($stage -eq "running") {
        Write-Host ""
        Write-Host "$($colors.bold)$($colors.green)✅ BUILD COMPLETE!$($colors.reset)"
        Write-Host "$($colors.green)🌐 Access apps at: http://localhost:8080$($colors.reset)"
        Write-Host ""
        break
    } elseif ($stage -eq "error") {
        Write-Host ""
        Write-Host "$($colors.bold)$($colors.red)❌ BUILD FAILED!$($colors.reset)"
        Write-Host "$($colors.red)Check build-output.log for details$($colors.reset)"
        Write-Host ""
        break
    }
    
    Write-Host ""
    Write-Host "$($colors.yellow)Monitoring... (Press Ctrl+C to exit)$($colors.reset)"
    
    # Wait before refresh
    Start-Sleep -Seconds $RefreshInterval
}

Write-Host ""
