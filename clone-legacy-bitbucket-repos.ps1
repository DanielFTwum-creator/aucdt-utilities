# ============================================================
# Legacy Tomcat Fleet — Bitbucket Clone Script
# Purpose : Clone the legacy app repos (Bitbucket: AUCDT, TUC) needed
#           for the JDK 21 migration (TUC-ICT-MIG-2026-001, Gate 1.1)
# Usage   : .\clone-legacy-bitbucket-repos.ps1
#           .\clone-legacy-bitbucket-repos.ps1 -Dest "D:\legacy-apps"
#           .\clone-legacy-bitbucket-repos.ps1 -Protocol https
# Notes   : Idempotent — repos already cloned are skipped, not re-cloned.
#           SSH is the default protocol (matches the GitHub deploy-key
#           pattern already used in this monorepo's deploy.ps1 scripts).
#           If Bitbucket SSH isn't set up on this machine yet, rerun with
#           -Protocol https (Bitbucket will prompt for an app password).
# ============================================================

param(
    [string]$Dest = ".\legacy-bitbucket-repos",
    [ValidateSet('ssh', 'https')]
    [string]$Protocol = 'ssh'
)

$ErrorActionPreference = 'Stop'

function Log($lvl, $msg, $color = 'White') {
    Write-Host ("[{0}][{1}] {2}" -f (Get-Date).ToString('HH:mm:ss'), $lvl, $msg) -ForegroundColor $color
}

# Repo, Bitbucket workspace SLUG — confirmed 22 Jun 2026 via the actual "Clone
# this repository" dialog for every repo. All 15 repos live in the SAME Bitbucket
# workspace, slug 'securedataghana' (the Bitbucket UI's repo list showed "AUCDT"
# and "TUC" badges, which turned out to be internal Bitbucket *project* labels
# within this one workspace, not two separate workspaces — confirmed by cloning
# techbridgesb-prd, the one repo labeled "TUC", and getting the same
# securedataghana slug as everything else). No duplicate/fork concern.
#
# Repos named with an 'aucdt' prefix (aucdt-admissions-sdev, aucdtsb-dev,
# aucdtsb-prd) are deliberately EXCLUDED — same retiring line as the Tomcat
# aucdt-* WARs ruled out of scope at Gate 0 (see JDK21_MIGRATION_PLAN, §3).
$Repos = @(
    @{ Name = 'techbridge-website-prd';        Workspace = 'securedataghana' }
    @{ Name = 'techbridge-admin-prd';           Workspace = 'securedataghana' }
    @{ Name = 'techbridge-admin-dev';           Workspace = 'securedataghana' }
    @{ Name = 'techbridgesb-dev';               Workspace = 'securedataghana' }
    @{ Name = 'techbridgesb-qa';                Workspace = 'securedataghana' }
    @{ Name = 'techbridgesb-uat';               Workspace = 'securedataghana' }
    @{ Name = 'techbridgesb-prd';               Workspace = 'securedataghana' }
    @{ Name = 'techbridge-admissionsui-prd';    Workspace = 'securedataghana' }
    @{ Name = 'techbridge-admissions-dev';      Workspace = 'securedataghana' }
    @{ Name = 'techbridge-feepayment-prd';      Workspace = 'securedataghana' }
    @{ Name = 'toabaui-prd';                    Workspace = 'securedataghana' }
    @{ Name = 'tuabasb-prd';                    Workspace = 'securedataghana' }

    # UNCONFIRMED — this is the one app from the Tomcat webapps/ inventory whose
    # Bitbucket source was never located (JDK21_MIGRATION_PLAN, §4.6). Guessing the
    # repo name matches the deployed WAR name ('students-dev'), same convention as
    # techbridge-website-prd, but this has NOT been verified against the actual
    # Bitbucket UI the way every other repo above was. If this fails with exit 128,
    # it likely means the real repo has a different name — check the Bitbucket
    # workspace's repo list directly and correct the Name below.
    @{ Name = 'students-dev';                   Workspace = 'securedataghana' }
)

Log 'INFO' '========================================' Cyan
Log 'INFO' 'LEGACY FLEET — BITBUCKET CLONE' Cyan
Log 'INFO' "Destination : $Dest" Cyan
Log 'INFO' "Protocol    : $Protocol" Cyan
Log 'INFO' "Repo count  : $($Repos.Count)" Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Log 'ERROR' 'git is not on PATH — install Git for Windows first.' Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $Dest | Out-Null
$Dest = (Resolve-Path $Dest).Path

$results = @()

foreach ($repo in $Repos) {
    $name = $repo.Name
    $ws   = $repo.Workspace
    $target = Join-Path $Dest $name

    $url = if ($Protocol -eq 'ssh') {
        "git@bitbucket.org:$ws/$name.git"
    } else {
        "https://bitbucket.org/$ws/$name.git"
    }

    if (Test-Path (Join-Path $target '.git')) {
        Log 'SKIP' "$name already cloned at $target" DarkGray
        $results += [pscustomobject]@{ Repo = $name; Workspace = $ws; Status = 'Skipped (exists)' }
        continue
    }

    Log 'INFO' "Cloning $ws/$name ..." Yellow
    git clone --quiet $url $target 2>&1 | ForEach-Object { Log 'GIT' $_ DarkGray }

    if ($LASTEXITCODE -eq 0) {
        Log 'OK' "$name -> $target" Green
        $results += [pscustomobject]@{ Repo = $name; Workspace = $ws; Status = 'Cloned' }
    } else {
        Log 'ERROR' "$name failed (exit $LASTEXITCODE) — check Bitbucket access/repo slug" Red
        $results += [pscustomobject]@{ Repo = $name; Workspace = $ws; Status = "Failed (exit $LASTEXITCODE)" }
    }
}

Log 'INFO' '========================================' Cyan
Log 'INFO' 'SUMMARY' Cyan
$results | Format-Table -AutoSize

$failed = $results | Where-Object { $_.Status -like 'Failed*' }
if ($failed) {
    Log 'WARN' "$($failed.Count) repo(s) failed to clone — see table above. Common causes: repo slug doesn't match the Bitbucket UI exactly, SSH key not added to your Bitbucket account, or no access to that workspace." Yellow
    Log 'WARN' 'If SSH keeps failing, rerun with: .\clone-legacy-bitbucket-repos.ps1 -Protocol https' Yellow
} else {
    Log 'SUCCESS' 'All repos cloned/present.' Green
}

Log 'INFO' "Next: connect $Dest (or individual repo subfolders) so the JDK migration review can actually read the code." Cyan
