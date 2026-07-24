<#
  push-asset.ps1 - Upload a binary asset (video, large image) to the fleet's
  own-server media host, media.techbridge.edu.gh/media/, instead of committing
  it to git. This is the fleet's "CDN": same-origin, correct Content-Type, HTTP
  range for video, no third party, no egress fees.

  It locates the real media directory by finding a known-served file on the
  server (no hard-coded path to drift), copies the asset in, fixes permissions,
  and prints the public URL.

  Usage (full path per repo command rule):
    C:\Development\github\aucdt-utilities\scripts\push-asset.ps1 -File C:\path\to\clip.mp4

  Options:
    -File    (required) local file to upload
    -Server  SSH target (default root@techbridge.edu.gh)
    -Probe   a file already served from /media used to locate the directory
             (default banner1.mp4)
#>
param(
  [Parameter(Mandatory = $true)][string]$File,
  [string]$Server = 'root@techbridge.edu.gh',
  [string]$Probe = 'banner1.mp4'
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $File)) { Write-Error "File not found: $File"; exit 1 }

Write-Host "[1/3] Locating the media directory on $Server ..." -ForegroundColor Cyan
$dir = (ssh $Server "find /var/www/vhosts -name '$Probe' -printf '%h\n' 2>/dev/null | head -1").Trim()
if (-not $dir) {
  Write-Error "Could not locate the media directory via probe '$Probe'. Pass a different -Probe that exists under /media."
  exit 1
}
Write-Host "      media dir: $dir" -ForegroundColor DarkGray

$name = Split-Path -Leaf $File
Write-Host "[2/3] Uploading $name ..." -ForegroundColor Cyan
scp $File "${Server}:$dir/$name"
ssh $Server "chmod 644 '$dir/$name'"

$url = "https://media.techbridge.edu.gh/media/$name"
Write-Host "[3/3] Verifying it serves ..." -ForegroundColor Cyan
$code = (ssh $Server "curl -s -o /dev/null -w '%{http_code}' -r 0-1 '$url'").Trim()
if ($code -eq '206' -or $code -eq '200') {
  Write-Host "OK ($code). Public URL:" -ForegroundColor Green
  Write-Host "  $url"
}
else {
  Write-Warning "Uploaded, but the URL returned HTTP $code. Check the media vhost / DNS."
  Write-Host "  $url"
}
