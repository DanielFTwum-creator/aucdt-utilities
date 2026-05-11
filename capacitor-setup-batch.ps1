#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Batch Capacitor Setup for Multiple TUC Projects

.DESCRIPTION
    Runs capacitor-setup.ps1 across multiple React projects automatically.
    Useful for setting up an entire suite of apps at once.

.PARAMETER ProjectsFile
    Path to CSV or JSON file listing projects to setup
    Format (CSV): ProjectPath,AppName,AppId,Version
    Format (JSON): Array of objects with projectPath, appName, appId, version

.PARAMETER ProjectList
    Inline project list as JSON string
    Example: '[{"projectPath":".","appName":"App1","appId":"com.company.app1"}]'

.PARAMETER SetupScript
    Path to capacitor-setup.ps1 script (default: ./capacitor-setup.ps1)

.PARAMETER SkipCommit
    If specified, don't commit changes after setup

.PARAMETER SkipBuild
    If specified, don't build web bundles

.PARAMETER ContinueOnError
    If specified, continue setup even if one project fails

.EXAMPLE
    # Setup from CSV file
    .\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv"

.EXAMPLE
    # Setup from JSON file
    .\capacitor-setup-batch.ps1 -ProjectsFile "projects.json"

.EXAMPLE
    # Setup single project inline
    .\capacitor-setup-batch.ps1 -ProjectList '[{"projectPath":".","appName":"MyApp","appId":"com.company.myapp"}]'

.EXAMPLE
    # Setup multiple projects without commits
    .\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv" -SkipCommit

.NOTES
    Author: Daniel Frempong Twum / TUC ICT
    Updated: 10 May 2026
#>

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string]$ProjectsFile,

    [Parameter(Mandatory = $false)]
    [string]$ProjectList,

    [Parameter(Mandatory = $false)]
    [string]$SetupScript = "./capacitor-setup.ps1",

    [switch]$SkipCommit,

    [switch]$SkipBuild,

    [switch]$ContinueOnError,

    [switch]$Help
)

# Show help
if ($Help) {
    Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║     Batch Capacitor Setup for TUC Projects                    ║
║     Setup multiple apps at once                               ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  .\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv"
  .\capacitor-setup-batch.ps1 -ProjectList '[{...}]'

REQUIRED:
  Either -ProjectsFile OR -ProjectList must be specified

OPTIONS:
  -ProjectsFile    Path to CSV or JSON file with projects
  -ProjectList     Inline JSON array of projects
  -SetupScript     Path to capacitor-setup.ps1 (default: ./capacitor-setup.ps1)
  -SkipCommit      Don't commit changes after setup
  -SkipBuild       Don't build web bundles
  -ContinueOnError Keep going if one project fails

CSV FORMAT:
  ProjectPath,AppName,AppId,Version
  ./project1,App 1,com.company.app1,1.0.0
  ./project2,App 2,com.company.app2,1.0.0

JSON FORMAT:
  [
    {
      "projectPath": "./project1",
      "appName": "App 1",
      "appId": "com.company.app1",
      "version": "1.0.0"
    },
    {
      "projectPath": "./project2",
      "appName": "App 2",
      "appId": "com.company.app2",
      "version": "1.0.0"
    }
  ]

EXAMPLES:
  # Setup from CSV file
  .\capacitor-setup-batch.ps1 -ProjectsFile "tuc-projects.csv"

  # Setup from JSON file
  .\capacitor-setup-batch.ps1 -ProjectsFile "tuc-projects.json"

  # Setup inline
  .\capacitor-setup-batch.ps1 -ProjectList '[
    {"projectPath":"./luxthumb","appName":"LuxThumb","appId":"com.techbridge.luxthumb"},
    {"projectPath":"./biochemai","appName":"BioChemAI","appId":"com.techbridge.biochemai"}
  ]'

  # Dry run (no builds or commits)
  .\capacitor-setup-batch.ps1 -ProjectsFile "projects.csv" -SkipBuild -SkipCommit

WORKFLOW:
  1. Parse projects from CSV/JSON file
  2. For each project:
     a. Run capacitor-setup.ps1 with specified parameters
     b. Log success/failure
     c. Continue or abort based on -ContinueOnError flag
  3. Print summary report

SAMPLE CSV (save as tuc-projects.csv):
  ProjectPath,AppName,AppId,Version
  ./luxthumb-agent,LuxThumb Designer,com.techbridge.luxthumb,1.0.0
  ./biochemai,BioChemAI,com.techbridge.biochemai,1.0.0
  ./smartghana,SmartGhana,com.techbridge.smartghana,1.0.0

Then run:
  .\capacitor-setup-batch.ps1 -ProjectsFile "tuc-projects.csv"

TIME ESTIMATE:
  - Single project: 3-5 minutes
  - 10 projects: 30-50 minutes
  - 50 projects: 2.5-4 hours

TROUBLESHOOTING:
  • If script not found: Check -SetupScript path
  • If CSV format wrong: Verify CSV has header row
  • If pnpm not found: npm install -g pnpm
  • If build fails: Run project setup individually first

"@
    exit 0
}

# Validate setup script exists
if (-not (Test-Path $SetupScript)) {
    Write-Host "❌ Error: Setup script not found at $SetupScript" -ForegroundColor Red
    exit 1
}

# Load projects
$projects = @()

if ($ProjectList) {
    # Parse inline JSON
    try {
        $projects = $ProjectList | ConvertFrom-Json
    }
    catch {
        Write-Host "❌ Error parsing JSON: $_" -ForegroundColor Red
        exit 1
    }
}
elseif ($ProjectsFile) {
    # Load from file
    if (-not (Test-Path $ProjectsFile)) {
        Write-Host "❌ Error: Projects file not found at $ProjectsFile" -ForegroundColor Red
        exit 1
    }

    $ext = [System.IO.Path]::GetExtension($ProjectsFile).ToLower()

    if ($ext -eq ".csv") {
        # Parse CSV
        $csv = Import-Csv $ProjectsFile
        $projects = $csv | ForEach-Object {
            [PSCustomObject]@{
                projectPath = $_.ProjectPath.Trim()
                appName = $_.AppName.Trim()
                appId = $_.AppId.Trim()
                version = if ($_.Version) { $_.Version.Trim() } else { "1.0.0" }
            }
        }
    }
    elseif ($ext -eq ".json") {
        # Parse JSON
        try {
            $projects = Get-Content $ProjectsFile | ConvertFrom-Json
        }
        catch {
            Write-Host "❌ Error parsing JSON file: $_" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "❌ Error: Unsupported file format. Use .csv or .json" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "❌ Error: Either -ProjectsFile or -ProjectList must be specified" -ForegroundColor Red
    exit 1
}

if ($projects.Count -eq 0) {
    Write-Host "❌ Error: No projects found to setup" -ForegroundColor Red
    exit 1
}

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║           Batch Capacitor Setup - Starting                    ║
╚════════════════════════════════════════════════════════════════╝

Projects to setup: $($projects.Count)
Setup script: $SetupScript
Skip commits: $SkipCommit
Skip builds: $SkipBuild
Continue on error: $ContinueOnError

" -ForegroundColor Cyan

# Track results
$results = @()
$successCount = 0
$failureCount = 0

# Setup each project
for ($i = 0; $i -lt $projects.Count; $i++) {
    $project = $projects[$i]
    $projectNum = $i + 1

    Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[$projectNum/$($projects.Count)] $($project.appName)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

" -ForegroundColor Yellow

    # Build command
    $setupArgs = @(
        $SetupScript,
        "-ProjectPath", $project.projectPath,
        "-AppName", $project.appName,
        "-AppId", $project.appId,
        "-Version", $project.version
    )

    if ($SkipCommit) {
        $setupArgs += "-SkipCommit"
    }

    if ($SkipBuild) {
        $setupArgs += "-SkipBuild"
    }

    # Run setup
    try {
        & $SetupScript -ProjectPath $project.projectPath `
                       -AppName $project.appName `
                       -AppId $project.appId `
                       -Version $project.version `
                       $(if ($SkipCommit) { "-SkipCommit" }) `
                       $(if ($SkipBuild) { "-SkipBuild" })

        $successCount++
        $results += [PSCustomObject]@{
            Project = $project.appName
            Status = "✅ Success"
            Path = $project.projectPath
        }
        Write-Host "✅ Setup completed for $($project.appName)" -ForegroundColor Green
    }
    catch {
        $failureCount++
        $results += [PSCustomObject]@{
            Project = $project.appName
            Status = "❌ Failed"
            Path = $project.projectPath
            Error = $_.Exception.Message
        }
        Write-Host "❌ Setup failed for $($project.appName): $_" -ForegroundColor Red

        if (-not $ContinueOnError) {
            Write-Host "Stopping batch setup (use -ContinueOnError to continue)" -ForegroundColor Red
            exit 1
        }
    }
}

# Summary
Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                   Batch Setup Complete                        ║
╚════════════════════════════════════════════════════════════════╝

Total:    $($projects.Count)
Success:  $successCount
Failed:   $failureCount

" -ForegroundColor Cyan

if ($failureCount -eq 0) {
    Write-Host "✅ All projects setup successfully!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Some projects failed. Review output above." -ForegroundColor Yellow
}

# Print results table
$results | Format-Table -AutoSize

Write-Host @"

📁 Next steps for each project:
  1. cd <project-path>
  2. pnpm build:ios (macOS only)
  3. pnpm build:android
  4. See APP_STORE_GUIDE.md for submission steps

📚 Documentation:
  Capacitor docs: https://capacitorjs.com/docs
  TUC standards: CLAUDE.md

" -ForegroundColor Cyan

exit 0
