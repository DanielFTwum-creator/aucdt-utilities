# ============================================================
# deploy-fleet.ps1
# Deploy all (or a filtered subset) of apps in the fleet.
#
# Each project's deploy.ps1 is invoked with the correct flags
# based on its architectural type (auto-detected).
#
# Usage:
#   .\deploy-fleet.ps1                              # deploy all apps
#   .\deploy-fleet.ps1 -Apps biochemai,glucose      # specific apps only
#   .\deploy-fleet.ps1 -Filter "techbridge-*"       # glob pattern
#   .\deploy-fleet.ps1 -Exclude stockpulse,tuc-rms  # skip specific apps
#   .\deploy-fleet.ps1 -Parallel 4                  # 4 concurrent deploys
#   .\deploy-fleet.ps1 -DryRun                      # preview only
#   .\deploy-fleet.ps1 -SkipTest                    # skip compliance check
#
# Architecture types (auto-detected):
#   standard   — server-side git clone + pnpm build; invoked with -Build
#   local-scp  — local build + SCP to server (e.g. stockpulse); no -Build flag
#   java-maven — local Maven build + SCP jar (tuc-wms/backend); SKIPPED by default
#
# Exit code: 0 = all passed, 1 = one or more failed
# ============================================================

param(
    [string[]]$Apps     = @(),      # whitelist: deploy only these app names
    [string[]]$Exclude  = @(),      # blacklist: skip these app names
    [string]$Filter     = "*",      # glob on app folder name, e.g. "techbridge-*"
    [int]$Parallel      = 1,        # max concurrent deployments (1 = sequential)
    [switch]$DryRun     = $false,   # show plan without deploying
    [switch]$SkipTest   = $false,   # skip compliance check before deploying
    [switch]$IncludeJava = $false   # include tuc-wms/backend (requires local Maven + Java 21)
)

$BASE  = Split-Path $MyInvocation.MyCommand.Path -Parent
$START = Get-Date

# ---- Helpers ---------------------------------------------------------------

function Write-Banner {
    param([string]$Text, [ConsoleColor]$Color = "Cyan")
    Write-Host ""
    Write-Host "  $Text" -ForegroundColor $Color
    Write-Host "  $("─" * ($Text.Length))" -ForegroundColor DarkGray
}

function Get-ArchType {
    param([string]$Content)
    # Java/Maven backend — no Node on server
    if ($Content -match '\[switch\]\$NoBuild') { return "java-maven" }
    # Build flag defaults to $true — local build + SCP
    if ($Content -match '\[switch\]\$Build\s*=\s*\$true') { return "local-scp" }
    # Standard: server-side git clone + pnpm build
    if ($Content -match '\[switch\]\$Build') { return "standard" }
    # Fallback: no build flag
    return "local-scp"
}

function Get-DeployArgs {
    param([string]$ArchType)
    switch ($ArchType) {
        "standard"   { return @("-Build") }
        "local-scp"  { return @() }
        "java-maven" { return @() }
    }
}

# ---- Compliance check ------------------------------------------------------

if (-not $SkipTest -and -not $DryRun) {
    Write-Banner "Running compliance check..."
    $testResult = & "$BASE\test-fleet-deploy.ps1" 2>&1
    $testExit   = $LASTEXITCODE
    if ($testExit -ne 0) {
        Write-Host $testResult -ForegroundColor Red
        Write-Host ""
        Write-Host "  Compliance check FAILED. Fix issues above before deploying." -ForegroundColor Red
        Write-Host "  Run with -SkipTest to bypass (not recommended)." -ForegroundColor DarkGray
        exit 1
    }
    Write-Host "  Compliance check passed." -ForegroundColor Green
}

# ---- Discover apps ---------------------------------------------------------

$allScripts = Get-ChildItem -Path $BASE -Recurse -Filter "deploy.ps1" | Sort-Object FullName
$plan = [System.Collections.Generic.List[PSObject]]::new()

foreach ($f in $allScripts) {
    $rel     = $f.FullName.Replace("$BASE\", "")
    $parts   = $rel -split '\\'
    # For nested scripts (e.g. tuc-wms\frontend\deploy.ps1) include the subfolder
    $appName = if ($parts.Count -gt 2) { "$($parts[0])/$($parts[1])" } else { $parts[0] }
    $subPath = $rel -replace '^[^\\]+\\','' # remainder (e.g. "frontend\deploy.ps1")
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $arch    = Get-ArchType $content

    # ── Filters ─────────────────────────────────────────────────────────────
    if ($arch -eq "java-maven" -and -not $IncludeJava) {
        $plan.Add([PSCustomObject]@{
            AppName = $appName; Rel = $rel; Dir = $f.DirectoryName
            Arch = $arch; Args = @(); Skip = $true; SkipReason = "java-maven (use -IncludeJava to enable)"
        })
        continue
    }
    if ($Apps.Count -gt 0 -and $Apps -notcontains $appName) {
        continue   # whitelist active — exclude anything not listed
    }
    if ($Exclude -contains $appName) {
        $plan.Add([PSCustomObject]@{
            AppName = $appName; Rel = $rel; Dir = $f.DirectoryName
            Arch = $arch; Args = @(); Skip = $true; SkipReason = "excluded by -Exclude"
        })
        continue
    }
    if ($appName -notlike $Filter) {
        continue   # glob filter
    }

    $plan.Add([PSCustomObject]@{
        AppName = $appName; Rel = $rel; Dir = $f.DirectoryName
        Arch = (Get-ArchType $content); Args = (Get-DeployArgs (Get-ArchType $content))
        Skip = $false; SkipReason = ""
    })
}

$active  = $plan | Where-Object { -not $_.Skip }
$skipped = $plan | Where-Object {  $_.Skip }

# ---- Plan preview ----------------------------------------------------------

Write-Banner "FLEET DEPLOYMENT$(if ($DryRun) { ' — DRY RUN' })"

Write-Host ("  {0,-40} {1,-12} {2}" -f "App", "Type", "Args") -ForegroundColor DarkGray
Write-Host ("  {0,-40} {1,-12} {2}" -f ("─" * 38), ("─" * 10), ("─" * 10)) -ForegroundColor DarkGray

foreach ($item in $active) {
    $argStr = if ($item.Args.Count -gt 0) { $item.Args -join " " } else { "(default)" }
    Write-Host ("  {0,-40} {1,-12} {2}" -f $item.AppName, $item.Arch, $argStr)
}

if ($skipped.Count -gt 0) {
    Write-Host ""
    Write-Host "  Skipping $($skipped.Count) app(s):" -ForegroundColor DarkGray
    foreach ($s in $skipped) {
        Write-Host ("  — {0,-38} {1}" -f $s.AppName, $s.SkipReason) -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host ("  {0} app(s) scheduled  |  Parallelism: {1}  |  Mode: {2}" -f `
    $active.Count, $Parallel, $(if ($DryRun) { "DRY RUN" } else { "LIVE" })) -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "  DRY RUN complete — no changes made." -ForegroundColor Yellow
    exit 0
}

if ($active.Count -eq 0) {
    Write-Host "  Nothing to deploy." -ForegroundColor Yellow
    exit 0
}

$confirm = Read-Host "  Proceed? [Y/n]"
if ($confirm -and $confirm.ToLower() -ne "y") {
    Write-Host "  Aborted." -ForegroundColor Yellow
    exit 0
}

# ---- Deploy ----------------------------------------------------------------

Write-Host ""
$results = [System.Collections.Concurrent.ConcurrentBag[PSObject]]::new()
$total   = $active.Count
$index   = 0

function Invoke-Deploy {
    param($Item, $Index, $Total)

    $label   = "[{0,3}/{1}] {2}" -f $Index, $Total, $Item.AppName
    $t0      = Get-Date
    Write-Host "  $label — STARTING..." -ForegroundColor DarkYellow

    Push-Location $Item.Dir
    try {
        $output = & .\deploy.ps1 @($Item.Args) 2>&1
        $code   = $LASTEXITCODE
    } catch {
        $output = $_.Exception.Message
        $code   = 1
    } finally {
        Pop-Location
    }

    $elapsed = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1)
    $timeStr = if ($elapsed -ge 60) {
        "$([math]::Floor($elapsed/60))m $([math]::Round($elapsed % 60, 0))s"
    } else { "${elapsed}s" }

    return [PSCustomObject]@{
        AppName = $Item.AppName
        Arch    = $Item.Arch
        Success = ($code -eq 0)
        ExitCode = $code
        Elapsed = $timeStr
        ElapsedSec = $elapsed
        Output  = $output
    }
}

if ($Parallel -le 1) {
    # ── Sequential ──────────────────────────────────────────────────────────
    foreach ($item in $active) {
        $index++
        $r = Invoke-Deploy $item $index $total
        $results.Add($r)

        $color = if ($r.Success) { "Green" } else { "Red" }
        $icon  = if ($r.Success) { "✓" }     else { "✗" }
        $label = "[{0,3}/{1}] {2}" -f $index, $total, $item.AppName
        Write-Host ("  $icon $label — {0}" -f $r.Elapsed) -ForegroundColor $color

        if (-not $r.Success) {
            Write-Host "    ── Last 10 lines of output ──" -ForegroundColor DarkGray
            ($r.Output | Select-Object -Last 10) | ForEach-Object {
                Write-Host "    $_" -ForegroundColor DarkGray
            }
        }
    }
} else {
    # ── Parallel (job-based) ─────────────────────────────────────────────────
    Write-Host "  Running up to $Parallel deploys concurrently..." -ForegroundColor DarkGray
    Write-Host ""

    $queue   = [System.Collections.Queue]::new($active)
    $running = @{}   # jobId -> @{Item, Index}

    while ($queue.Count -gt 0 -or $running.Count -gt 0) {
        # Fill slots up to $Parallel
        while ($running.Count -lt $Parallel -and $queue.Count -gt 0) {
            $index++
            $item = $queue.Dequeue()
            $i    = $index   # capture for closure
            $job  = Start-Job -ScriptBlock {
                param($Dir, $Args, $AppName)
                Push-Location $Dir
                $out  = & .\deploy.ps1 @Args 2>&1
                $code = $LASTEXITCODE
                Pop-Location
                return @{ AppName=$AppName; Output=$out; ExitCode=$code }
            } -ArgumentList $item.Dir, $item.Args, $item.AppName

            $running[$job.Id] = @{ Item=$item; Index=$i; StartTime=(Get-Date) }
            Write-Host ("  [{0,3}/{1}] {2} — STARTED (job {3})" -f $i, $total, $item.AppName, $job.Id) -ForegroundColor DarkYellow
        }

        # Check for completed jobs
        foreach ($jobId in @($running.Keys)) {
            $job = Get-Job -Id $jobId -ErrorAction SilentlyContinue
            if (-not $job -or $job.State -notin @("Completed","Failed","Stopped")) { continue }

            $meta    = $running[$jobId]
            $elapsed = [math]::Round(((Get-Date) - $meta.StartTime).TotalSeconds, 1)
            $timeStr = if ($elapsed -ge 60) {
                "$([math]::Floor($elapsed/60))m $([math]::Round($elapsed % 60, 0))s"
            } else { "${elapsed}s" }

            $data    = Receive-Job -Job $job -ErrorAction SilentlyContinue
            $code    = if ($data) { $data.ExitCode } else { 1 }
            $output  = if ($data) { $data.Output  } else { @("Job failed to return data") }

            Remove-Job -Job $job -Force
            $running.Remove($jobId)

            $r = [PSCustomObject]@{
                AppName    = $meta.Item.AppName
                Arch       = $meta.Item.Arch
                Success    = ($code -eq 0)
                ExitCode   = $code
                Elapsed    = $timeStr
                ElapsedSec = $elapsed
                Output     = $output
            }
            $results.Add($r)

            $color = if ($r.Success) { "Green" } else { "Red" }
            $icon  = if ($r.Success) { "✓" }     else { "✗" }
            Write-Host ("  $icon [{0,3}/{1}] {2} — {3}" -f $meta.Index, $total, $r.AppName, $r.Elapsed) -ForegroundColor $color

            if (-not $r.Success) {
                ($output | Select-Object -Last 5) | ForEach-Object {
                    Write-Host "    $_" -ForegroundColor DarkGray
                }
            }
        }

        if ($running.Count -ge $Parallel -or ($queue.Count -eq 0 -and $running.Count -gt 0)) {
            Start-Sleep -Milliseconds 500
        }
    }
}

# ---- Summary ---------------------------------------------------------------

$totalElapsed = [math]::Round(((Get-Date) - $START).TotalSeconds, 0)
$totalTime    = if ($totalElapsed -ge 60) {
    "$([math]::Floor($totalElapsed/60))m $($totalElapsed % 60)s"
} else { "${totalElapsed}s" }

$passed  = ($results | Where-Object {  $_.Success }).Count
$failed  = ($results | Where-Object { -not $_.Success }).Count

Write-Host ""
Write-Host "  ─────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  RESULTS" -ForegroundColor Cyan
Write-Host ""

$resultsSorted = $results | Sort-Object AppName
foreach ($r in $resultsSorted) {
    $icon  = if ($r.Success) { "✓" } else { "✗" }
    $color = if ($r.Success) { "Green" } else { "Red" }
    Write-Host ("  $icon  {0,-40} {1,6}" -f $r.AppName, $r.Elapsed) -ForegroundColor $color
}

Write-Host ""
Write-Host ("  PASS: {0}   FAIL: {1}   SKIPPED: {2}   TOTAL TIME: {3}" -f `
    $passed, $failed, $skipped.Count, $totalTime) `
    -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "  Failed apps:" -ForegroundColor Red
    $results | Where-Object { -not $_.Success } | ForEach-Object {
        Write-Host "    · $($_.AppName)  (exit $($_.ExitCode))" -ForegroundColor Red
    }
}

Write-Host ""
exit $(if ($failed -gt 0) { 1 } else { 0 })
