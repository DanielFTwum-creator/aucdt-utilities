#!/usr/bin/env powershell
# Master Build Script - All 88 Apps in 5 Phases

param(
    [ValidateSet('phase1', 'phase2', 'phase3', 'all', 'status')]
    [string]$Phase = 'status'
)

$ErrorActionPreference = 'Continue'

# Colors
$colors = @{
    cyan    = "Cyan"
    green   = "Green"
    yellow  = "Yellow"
    red     = "Red"
    magenta = "Magenta"
}

function Show-Banner {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║   🐳 Docker Build Master - All 88 Apps                 ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Build-Phase1 {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "PHASE 1: Building 6 Core Apps (Parallel)" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Apps:" -ForegroundColor Yellow
    Write-Host "  1. analytics-refactor"
    Write-Host "  2. tuc-analytics-dashboard"
    Write-Host "  3. tuc-website-react"
    Write-Host "  4. fees-comparison-dashboard"
    Write-Host "  5. kanban-app"
    Write-Host "  6. techbridge-product-design-6r-design-portal"
    Write-Host ""
    
    $start = Get-Date
    Write-Host "⏱️  Starting Phase 1 build..." -ForegroundColor Yellow
    
    & docker compose -f docker-compose-all-apps.yml build --parallel 2>&1 | Tee-Object -FilePath phase1-build.log
    
    $end = Get-Date
    $duration = ($end - $start).TotalSeconds
    
    Write-Host ""
    Write-Host "✅ Phase 1 Complete in $([math]::Round($duration / 60, 1)) minutes" -ForegroundColor Green
    
    return @{
        duration = $duration
        logfile = "phase1-build.log"
    }
}

function Build-Phase2 {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "PHASE 2: Building 70 Standard Apps (Parallel)" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Profile: standard" -ForegroundColor Yellow
    Write-Host "Apps: All standard/utility apps (70 total)" -ForegroundColor Yellow
    Write-Host ""
    
    $start = Get-Date
    Write-Host "⏱️  Starting Phase 2 build..." -ForegroundColor Yellow
    
    & docker compose -f docker-compose-all-apps.yml --profile standard build --parallel 2>&1 | Tee-Object -FilePath phase2-build.log
    
    $end = Get-Date
    $duration = ($end - $start).TotalSeconds
    
    Write-Host ""
    Write-Host "✅ Phase 2 Complete in $([math]::Round($duration / 60, 1)) minutes" -ForegroundColor Green
    
    return @{
        duration = $duration
        logfile = "phase2-build.log"
    }
}

function Build-Phase3 {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "PHASE 3: Building 12 Experimental/AI Apps (Parallel)" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Profile: experimental" -ForegroundColor Yellow
    Write-Host "Apps: All AI and experimental apps (12 total)" -ForegroundColor Yellow
    Write-Host ""
    
    $start = Get-Date
    Write-Host "⏱️  Starting Phase 3 build..." -ForegroundColor Yellow
    
    & docker compose -f docker-compose-all-apps.yml --profile experimental build --parallel 2>&1 | Tee-Object -FilePath phase3-build.log
    
    $end = Get-Date
    $duration = ($end - $start).TotalSeconds
    
    Write-Host ""
    Write-Host "✅ Phase 3 Complete in $([math]::Round($duration / 60, 1)) minutes" -ForegroundColor Green
    
    return @{
        duration = $duration
        logfile = "phase3-build.log"
    }
}

function Get-BuildStatus {
    Write-Host ""
    Write-Host "📊 BUILD STATUS" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    
    # Check Phase 1
    if (Test-Path "phase1-build.log") {
        $phase1Content = Get-Content "phase1-build.log" -Raw
        $phase1Errors = ($phase1Content | Select-String "ERROR|error|failed" | Measure-Object).Count
        Write-Host "Phase 1 (Core 6):       $(if ($phase1Errors -eq 0) { '✅ COMPLETE' } else { "❌ $phase1Errors ERRORS" })" -ForegroundColor $(if ($phase1Errors -eq 0) { "Green" } else { "Red" })
    } else {
        Write-Host "Phase 1 (Core 6):       ⏳ NOT STARTED" -ForegroundColor Yellow
    }
    
    # Check Phase 2
    if (Test-Path "phase2-build.log") {
        $phase2Content = Get-Content "phase2-build.log" -Raw
        $phase2Errors = ($phase2Content | Select-String "ERROR|error|failed" | Measure-Object).Count
        Write-Host "Phase 2 (Standard 70):  $(if ($phase2Errors -eq 0) { '✅ COMPLETE' } else { "❌ $phase2Errors ERRORS" })" -ForegroundColor $(if ($phase2Errors -eq 0) { "Green" } else { "Red" })
    } else {
        Write-Host "Phase 2 (Standard 70):  ⏳ NOT STARTED" -ForegroundColor Yellow
    }
    
    # Check Phase 3
    if (Test-Path "phase3-build.log") {
        $phase3Content = Get-Content "phase3-build.log" -Raw
        $phase3Errors = ($phase3Content | Select-String "ERROR|error|failed" | Measure-Object).Count
        Write-Host "Phase 3 (Experimental 12): $(if ($phase3Errors -eq 0) { '✅ COMPLETE' } else { "❌ $phase3Errors ERRORS" })" -ForegroundColor $(if ($phase3Errors -eq 0) { "Green" } else { "Red" })
    } else {
        Write-Host "Phase 3 (Experimental 12): ⏳ NOT STARTED" -ForegroundColor Yellow
    }
    
    # Check Docker images
    Write-Host ""
    $imageCount = (docker images | Select-String "tuc-utilities" | Measure-Object).Count
    Write-Host "Docker Images Built:    $imageCount / 88" -ForegroundColor Cyan
}

# Main
Show-Banner

switch ($Phase) {
    'phase1' {
        Build-Phase1
    }
    'phase2' {
        Build-Phase2
    }
    'phase3' {
        Build-Phase3
    }
    'all' {
        $results = @{}
        $results.phase1 = Build-Phase1
        $results.phase2 = Build-Phase2
        $results.phase3 = Build-Phase3
        
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║ ✅ ALL BUILDS COMPLETE                                 ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 FINAL SUMMARY:" -ForegroundColor Cyan
        Write-Host "  Phase 1: $([math]::Round($results.phase1.duration / 60, 1)) min"
        Write-Host "  Phase 2: $([math]::Round($results.phase2.duration / 60, 1)) min"
        Write-Host "  Phase 3: $([math]::Round($results.phase3.duration / 60, 1)) min"
        $totalTime = ($results.phase1.duration + $results.phase2.duration + $results.phase3.duration) / 60
        Write-Host "  Total:   $([math]::Round($totalTime, 1)) minutes"
    }
    'status' {
        Get-BuildStatus
    }
}

Write-Host ""
