$groupB = @(
  'glucose',
  'peace-vinyl',
  'biochemai',
  'deliberate-magic-reader',
  'tuc-ai-lab-catalog',
  'willpro',
  'techbridge-ai-blueprint',
  'ai-email-drafter',
  'groove-streamer'
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host ""
Write-Host "GROUP B: Deploying 9 full-stack apps (with backends)..." -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Start time: $timestamp" -ForegroundColor Cyan

$successB = 0
$failB = 0

foreach ($app in $groupB) {
  $startTime = Get-Date
  Write-Host "[$($successB + $failB + 1)/9] $app..." -NoNewline -ForegroundColor White
  
  try {
    cd $app
    $output = & ./deploy.ps1 -Build 2>&1
    $exitCode = $LASTEXITCODE
    cd ..
    
    if ($exitCode -eq 0) {
      $elapsed = (Get-Date) - $startTime
      Write-Host " ✓ OK ($($elapsed.TotalSeconds)s)" -ForegroundColor Green
      $successB++
    } else {
      Write-Host " ✗ FAILED (exit $exitCode)" -ForegroundColor Red
      $failB++
    }
  } catch {
    Write-Host " ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $failB++
  }
}

Write-Host ""
Write-Host "GROUP B SUMMARY: $successB deployed, $failB failed" -ForegroundColor $(if ($failB -eq 0) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "FINAL SUMMARY:" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host "Group A: 14 apps ✓"
Write-Host "Group B: $successB/9 apps"
Write-Host "Total deployed: $(14 + $successB)/23" -ForegroundColor $(if (14 + $successB -eq 23) { "Green" } else { "Yellow" })
