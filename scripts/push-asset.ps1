<#
  push-asset.ps1 - Upload a large binary asset (full-length video, hi-res gallery)
  to a project's OWN media directory on the server, instead of committing it to
  git. Each project owns its own media path; never borrow another project's host,
  and never use Google Drive (interstitials, quotas, no range requests, breaks
  OG/VideoObject fetching).

  Default target is The Bench Trilogy's media path, served at
  https://thebench.techbridge.edu.gh/media/ from the persistent dir
  /opt/thebench-media (outside /opt/thebench, so `rsync --delete` deploys don't
  wipe it). Override -RemoteDir/-BaseUrl for a different project.

  Usage (full path per repo command rule):
    C:\Development\github\aucdt-utilities\scripts\push-asset.ps1 -File C:\path\to\film.mp4

  Options:
    -File       (required) local file to upload
    -Server     SSH target (default root@techbridge.edu.gh)
    -RemoteDir  server media directory (default /opt/thebench-media)
    -BaseUrl    public URL base for that directory (default thebench /media)
#>
param(
  [Parameter(Mandatory = $true)][string]$File,
  [string]$Server = 'root@techbridge.edu.gh',
  [string]$RemoteDir = '/opt/thebench-media',
  [string]$BaseUrl = 'https://thebench.techbridge.edu.gh/media'
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $File)) { Write-Error "File not found: $File"; exit 1 }
$name = Split-Path -Leaf $File

Write-Host "[1/3] Ensuring $RemoteDir exists and is web-readable ..." -ForegroundColor Cyan
ssh $Server "mkdir -p $RemoteDir && chmod 755 $RemoteDir"

Write-Host "[2/3] Uploading $name ..." -ForegroundColor Cyan
scp $File "${Server}:$RemoteDir/$name"
ssh $Server "chmod 644 $RemoteDir/$name"

$url = "$BaseUrl/$name"
Write-Host "[3/3] Verifying it serves (range request) ..." -ForegroundColor Cyan
$code = (ssh $Server "curl -s -o /dev/null -w '%{http_code}' -r 0-1 '$url'").Trim()
if ($code -eq '206' -or $code -eq '200') {
  Write-Host "OK ($code). Public URL:" -ForegroundColor Green
  Write-Host "  $url"
}
else {
  Write-Warning "Uploaded to $RemoteDir, but $url returned HTTP $code."
  Write-Host "  The nginx 'location /media/' directive is probably not in place yet - see PATTERN 42."
}
