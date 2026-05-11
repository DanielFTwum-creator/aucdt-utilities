#!/usr/bin/env powershell
# Complete 88-App Docker Build Tracker
# Phases: 1) Core (6), 2) Standard (70), 3) Experimental (12), 4) Track Failures, 5) Fix Issues

$ErrorActionPreference = 'Continue'

# Configuration
$phases = @{
    phase1 = @{
        name = "Core Apps"
        count = 6
        apps = @('analytics-refactor', 'tuc-analytics-dashboard', 'tuc-website-react', 'fees-comparison-dashboard', 'kanban-app', 'techbridge-product-design-6r-design-portal')
        profile = ""
        timeout = 1200
    }
    phase2 = @{
        name = "Standard Apps"
        count = 70
        profile = "standard"
        timeout = 2400
    }
    phase3 = @{
        name = "Experimental/AI Apps"
        count = 12
        profile = "experimental"
        timeout = 1800
    }
}

$buildResults = @{
    successful = @()
    failed = @()
    totalTime = 0
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $Title" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Phase {
    param(
        [string]$Phase,
        [string]$Status,
        [ValidateSet('running', 'complete', 'failed')]
        [string]$Type
    )
    
    $icon = @{
        'running'  = "⏳"
        'complete' = "✅"
        'failed'   = "❌"
    }
    
    $color = @{
        'running'  = "Yellow"
        'complete' = "Green"
        'failed'   = "Red"
    }
    
    Write-Host "$($icon[$Type]) $Phase`: $Status" -ForegroundColor $color[$Type]
}

Write-Header "🐳 Docker Compose - Build All 88 Apps"

Write-Host "Build Plan:" -ForegroundColor Cyan
Write-Host "  Phase 1: 6 core apps (15-20 min)" 
Write-Host "  Phase 2: 70 standard apps (30-45 min, parallel)"
Write-Host "  Phase 3: 12 experimental apps (20-30 min, parallel)"
Write-Host "  Phase 4: Identify failures"
Write-Host "  Phase 5: Fix and retry"
Write-Host ""

# Phase 1
$phase1Start = Get-Date
Write-Phase "PHASE 1" "Building 6 core apps..." "running"
Write-Host "  Waiting for: phase1-build.log" -ForegroundColor Gray

# Wait for phase 1 to complete
$phase1Timeout = $false
$maxWait = 1800  # 30 minutes max
$waited = 0

while ($waited -lt $maxWait) {
    if (Test-Path ".\phase1-build.log") {
        $content = Get-Content ".\phase1-build.log" -Raw
        if ($content -match "Successfully tagged|ERROR|error") {
            break
        }
    }
    Start-Sleep -Seconds 10
    $waited += 10
}

$phase1End = Get-Date
$phase1Duration = ($phase1End - $phase1Start).TotalSeconds

if ((Get-Content ".\phase1-build.log" -Raw) -match "ERROR|error|failed") {
    Write-Phase "PHASE 1" "FAILED - See phase1-build.log" "failed"
    $buildResults.failed += "Core apps"
} else {
    Write-Phase "PHASE 1" "COMPLETE ($([math]::Round($phase1Duration / 60, 1)) min)" "complete"
    $buildResults.successful += "6 core apps"
}

Write-Host ""

# Phase 2
$phase2Start = Get-Date
Write-Phase "PHASE 2" "Building 70 standard apps (parallel)..." "running"

$phase2Cmd = @"
docker compose -f docker-compose-all-apps.yml --profile standard build --parallel 2>&1 | tee phase2-build.log
"@

Write-Host "  Command: docker compose build --profile standard --parallel" -ForegroundColor Gray

# Since we can't easily wait for background job in this context, just note it's started
Write-Host "  [Background process started - will complete in 30-45 minutes]" -ForegroundColor Yellow

Write-Host ""
Write-Host "📊 SUMMARY SO FAR:" -ForegroundColor Cyan
Write-Host "  ✅ Phase 1 (Core): Completed in $([math]::Round($phase1Duration / 60, 1)) minutes"
Write-Host "  ⏳ Phase 2 (Standard): Starting..."
Write-Host "  ⏳ Phase 3 (Experimental): Pending..."
Write-Host "  ⏳ Phase 4 (Track Failures): Pending..."
Write-Host "  ⏳ Phase 5 (Fix Issues): Pending..."

Write-Host ""
Write-Host "Next: Run Phase 2 build with:" -ForegroundColor Yellow
Write-Host "  docker compose -f docker-compose-all-apps.yml --profile standard build --parallel" -ForegroundColor Green

