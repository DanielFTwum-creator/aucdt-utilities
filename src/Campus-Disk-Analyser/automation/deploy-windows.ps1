# Windows Lab Automation Deployment Script
# Deploys disk analysis automation to Windows systems

[CmdletBinding()]
param(
    [string[]]$ComputerNames = @(),
    [string]$CentralShare = "\\labserver\disk-analysis",
    [string]$ConfigFile = ".\config.json",
    [switch]$Force,
    [switch]$TestOnly
)

# Configuration
$ScriptPath = ".\enhanced-disk-analyser.sh"
$AutomationScript = ".\automated-disk-monitor.ps1"
$RemoteScriptPath = "C:\LabAutomation"
$LogFile = ".\deployment-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# Logging function
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    $logEntry | Out-File -Append -FilePath $LogFile -Encoding UTF8
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking deployment prerequisites..."
    
    $prereqs = @{
        "Enhanced Disk Analyzer" = Test-Path $ScriptPath
        "Automation Script" = Test-Path $AutomationScript
        "PowerShell Remoting" = $true  # Will test per computer
        "Central Share" = Test-Path $CentralShare
    }
    
    $allGood = $true
    foreach ($prereq in $prereqs.GetEnumerator()) {
        if ($prereq.Value) {
            Write-Log "✓ $($prereq.Key)" "SUCCESS"
        } else {
            Write-Log "✗ $($prereq.Key)" "ERROR"
            $allGood = $false
        }
    }
    
    return $allGood
}

# Get target computers
function Get-TargetComputers {
    if ($ComputerNames.Count -eq 0) {
        Write-Log "No computer names specified, discovering lab computers..."
        
        # Try to discover computers from Active Directory
        try {
            $computers = Get-ADComputer -Filter 'OperatingSystem -like "*Windows*"' | Select-Object -ExpandProperty Name
            Write-Log "Discovered $($computers.Count) Windows computers from AD"
            return $computers
        } catch {
            Write-Log "Could not discover computers from AD: $($_.Exception.Message)" "WARNING"
            
            # Fallback: ask user to specify
            Write-Host "Please specify computer names using -ComputerNames parameter"
            return @()
        }
    } else {
        return $ComputerNames
    }
}

# Test computer connectivity
function Test-ComputerConnectivity {
    param([string]$ComputerName)
    
    try {
        # Test basic connectivity
        $ping = Test-Connection -ComputerName $ComputerName -Count 1 -Quiet
        if (-not $ping) {
            return @{ Connected = $false; Error = "Ping failed" }
        }
        
        # Test PowerShell remoting
        $session = New-PSSession -ComputerName $ComputerName -ErrorAction Stop
        Remove-PSSession $session
        
        return @{ Connected = $true; Error = $null }
        
    } catch {
        return @{ Connected = $false; Error = $_.Exception.Message }
    }
}

# Deploy to single computer
function Deploy-ToComputer {
    param([string]$ComputerName)
    
    Write-Log "Deploying automation to $ComputerName..." "INFO"
    
    try {
        # Test connectivity
        $connectivity = Test-ComputerConnectivity -ComputerName $ComputerName
        if (-not $connectivity.Connected) {
            Write-Log "Cannot connect to $ComputerName`: $($connectivity.Error)" "ERROR"
            return $false
        }
        
        # Create PowerShell session
        $session = New-PSSession -ComputerName $ComputerName
        
        # Create remote directory
        Invoke-Command -Session $session -ScriptBlock {
            param($RemotePath)
            if (!(Test-Path $RemotePath)) {
                New-Item -ItemType Directory -Path $RemotePath -Force | Out-Null
            }
        } -ArgumentList $RemoteScriptPath
        
        # Copy files to remote computer
        $files = @(
            @{ Local = $ScriptPath; Remote = "$RemoteScriptPath\enhanced-disk-analyser.sh" }
            @{ Local = $AutomationScript; Remote = "$RemoteScriptPath\automated-disk-monitor.ps1" }
        )
        
        if (Test-Path $ConfigFile) {
            $files += @{ Local = $ConfigFile; Remote = "$RemoteScriptPath\config.json" }
        }
        
        foreach ($file in $files) {
            Copy-Item -Path $file.Local -Destination $file.Remote -ToSession $session -Force
            Write-Log "  Copied $($file.Local) → $($file.Remote)"
        }
        
        # Install automation on remote computer
        if (-not $TestOnly) {
            $result = Invoke-Command -Session $session -ScriptBlock {
                param($RemotePath, $CentralShare)
                
                # Set execution policy
                Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force
                
                # Run installation
                $installScript = Join-Path $RemotePath "automated-disk-monitor.ps1"
                & $installScript -Install
                
                return $LASTEXITCODE
            } -ArgumentList $RemoteScriptPath, $CentralShare
            
            if ($result -eq 0) {
                Write-Log "  Automation installed successfully on $ComputerName" "SUCCESS"
            } else {
                Write-Log "  Automation installation failed on $ComputerName" "ERROR"
                Remove-PSSession $session
                return $false
            }
        }
        
        # Remove session
        Remove-PSSession $session
        
        Write-Log "Deployment to $ComputerName completed successfully" "SUCCESS"
        return $true
        
    } catch {
        Write-Log "Deployment to $ComputerName failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Generate deployment report
function New-DeploymentReport {
    param([hashtable]$Results)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $successful = ($Results.Values | Where-Object { $_ }).Count
    $failed = ($Results.Values | Where-Object { -not $_ }).Count
    $total = $Results.Count
    
    $report = @"
WINDOWS LAB AUTOMATION DEPLOYMENT REPORT
Generated: $timestamp
========================================

SUMMARY
-------
Total Computers: $total
Successful: $successful
Failed: $failed
Success Rate: $([math]::Round(($successful / $total) * 100, 1))%

DETAILED RESULTS
---------------
"@
    
    foreach ($computer in $Results.GetEnumerator()) {
        $status = if ($computer.Value) { "SUCCESS" } else { "FAILED" }
        $report += "`n$($computer.Key): $status"
    }
    
    $report += @"

NEXT STEPS
----------
1. Verify installations: Check Task Scheduler on deployed systems
2. Monitor logs: $CentralShare\logs\
3. Web dashboard: https://64vrc4xoo7.space.minimax.io
4. Test run: Run 'automated-disk-monitor.ps1 -TestRun' on target systems

TROUBLESHOOTING
--------------
- Check PowerShell execution policy on failed systems
- Verify network connectivity and shares
- Ensure administrative privileges
- Review logs: $LogFile
"@
    
    return $report
}

# Main deployment function
function Start-Deployment {
    Write-Log "=== Windows Lab Automation Deployment ===" "INFO"
    Write-Log "Timestamp: $(Get-Date)" "INFO"
    Write-Log "Central Share: $CentralShare" "INFO"
    Write-Log "Test Only: $TestOnly" "INFO"
    
    # Check prerequisites
    if (-not (Test-Prerequisites)) {
        Write-Log "Prerequisites check failed. Cannot proceed." "ERROR"
        return
    }
    
    # Get target computers
    $computers = Get-TargetComputers
    if ($computers.Count -eq 0) {
        Write-Log "No target computers found" "ERROR"
        return
    }
    
    Write-Log "Target computers: $($computers -join ', ')" "INFO"
    
    # Confirm deployment
    if (-not $Force -and -not $TestOnly) {
        $confirm = Read-Host "Deploy automation to $($computers.Count) computers? (y/N)"
        if ($confirm -ne 'y' -and $confirm -ne 'Y') {
            Write-Log "Deployment cancelled by user" "INFO"
            return
        }
    }
    
    # Deploy to each computer
    $results = @{}
    $progressCount = 0
    
    foreach ($computer in $computers) {
        $progressCount++
        Write-Progress -Activity "Deploying Lab Automation" -Status "Processing $computer" -PercentComplete (($progressCount / $computers.Count) * 100)
        
        $results[$computer] = Deploy-ToComputer -ComputerName $computer
    }
    
    Write-Progress -Activity "Deploying Lab Automation" -Completed
    
    # Generate and display report
    $report = New-DeploymentReport -Results $results
    Write-Host $report
    
    # Save report to file
    $reportFile = ".\deployment-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    $report | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Log "Deployment report saved: $reportFile" "INFO"
    
    # Summary
    $successful = ($results.Values | Where-Object { $_ }).Count
    Write-Log "Deployment completed: $successful/$($computers.Count) systems successful" "INFO"
}

# Execute deployment
Start-Deployment
