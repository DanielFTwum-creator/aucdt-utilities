<#
  issue-cert.ps1 - Issue and bind a Let's Encrypt certificate for a TUC subdomain
  via the Plesk SSL It! extension, then verify the issuer. Replaces the manual
  "log in to Plesk, tick the boxes" step so new subdomains cannot be misconfigured
  by hand.

  Usage (full path, per repo command-formatting rule):
    C:\Development\github\aucdt-utilities\scripts\issue-cert.ps1 -Domain thebench.techbridge.edu.gh

  Options:
    -Domain     (required) the fully-qualified subdomain, e.g. thebench.techbridge.edu.gh
    -Server     SSH target (default root@techbridge.edu.gh)
    -SecureWww  also add www.<domain> to the cert SANs. Only pass this if a
                www.<domain> DNS record exists, otherwise the ACME challenge for
                that name fails and aborts the whole issuance.

  Notes:
    - This build of SSL It! takes NO -registrationEmail flag; the ACME account is
      already configured on the server. Confirmed via `plesk ext sslit --help`.
    - -secure-domain both assigns the new cert to the domain and triggers Plesk to
      reconfigure the vhost and reload nginx.
#>
param(
  [Parameter(Mandatory = $true)][string]$Domain,
  [string]$Server = 'root@techbridge.edu.gh',
  [switch]$SecureWww
)

$ErrorActionPreference = 'Stop'
$wwwFlag = if ($SecureWww) { ' -secure-www' } else { '' }

$verify = "echo | openssl s_client -connect ${Domain}:443 -servername $Domain 2>/dev/null | openssl x509 -noout -issuer -dates"

Write-Host "[1/2] Issuing Let's Encrypt certificate for $Domain ..." -ForegroundColor Cyan
ssh $Server "plesk ext sslit --certificate -issue -domain $Domain -secure-domain$wwwFlag"

Write-Host "[2/2] Verifying bound certificate ..." -ForegroundColor Cyan
$result = ssh $Server $verify
Write-Host $result

if ($result -match "Let's Encrypt") {
  Write-Host "OK: a trusted Let's Encrypt certificate is now bound to $Domain." -ForegroundColor Green
}
else {
  Write-Warning "Issuer is still not Let's Encrypt. Forcing a Plesk web repair + nginx reload ..."
  ssh $Server "plesk repair web $Domain -y >/dev/null 2>&1; systemctl reload nginx"
  $result = ssh $Server $verify
  Write-Host $result
  if ($result -match "Let's Encrypt") {
    Write-Host "OK after repair: trusted certificate bound to $Domain." -ForegroundColor Green
  }
  else {
    Write-Error "Certificate still not trusted for $Domain. Check DNS resolution and that port 80 is reachable for the ACME challenge."
  }
}
