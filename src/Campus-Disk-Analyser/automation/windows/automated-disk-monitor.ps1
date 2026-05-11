# Windows Automated Disk Analysis Monitor
# PowerShell script for Windows systems with Git Bash integration

param(
    [string]$ConfigFile = ".\config.json",
    [switch]$Install,
    [switch]$Uninstall,
    [string]$LogLevel = "INFO"
)

# Configuration
$script:Config = @{
    ScriptPath = ".\enhanced-disk-analyser.sh"
    GitBashPath = "C:\Program Files\Git\bin\bash.exe"
    OutputDirectory = "C:\LabData\DiskAnalysis"
    CentralShare = "\\labserver\disk-analysis"
    ScheduleName = "LabDiskAnalysis"
    AnalysisTargets = @("/c/Users", "/c/Program Files")
    Schedule = @{
        Frequency = "Daily"
        Time = "02:00"
        Days = @("Monday", "Wednesday", "Friday")
    }
    Notifications = @{
        Email = @{
            Enabled = $true
            SMTPServer = "mail.yourdomain.com"
            From = "lab-monitoring@yourdomain.com"
            To = @("admin@yourdomain.com")
        }
        Slack = @{
            Enabled = $false
            WebhookURL = ""
        }
    }
}

# Logging function
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Console output
    switch ($Level) {
        "ERROR" { Write-Host $logMessage -ForegroundColor Red }
        "WARNING" { Write-Host $logMessage -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        default { Write-Host $logMessage }
    }
    
    # File logging
    $logPath = Join-Path $script:Config.OutputDirectory "automation.log"
    $logMessage | Out-File -Append -FilePath $logPath -Encoding UTF8
}

# Check if Git Bash is available
function Test-GitBash {
    if (Test-Path $script:Config.GitBashPath) {
        Write-Log "Git Bash found at: $($script:Config.GitBashPath)" "SUCCESS"
        return $true
    } else {
        Write-Log "Git Bash not found at: $($script:Config.GitBashPath)" "ERROR"
        Write-Log "Please install Git for Windows or update the GitBashPath in config" "ERROR"
        return $false
    }
}

# Create output directory structure
function Initialize-Directories {
    $directories = @(
        $script:Config.OutputDirectory,
        (Join-Path $script:Config.OutputDirectory "daily"),
        (Join-Path $script:Config.OutputDirectory "weekly"),
        (Join-Path $script:Config.OutputDirectory "monthly"),
        (Join-Path $script:Config.OutputDirectory "logs")
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Log "Created directory: $dir" "SUCCESS"
        }
    }
}

# Run disk analysis
function Invoke-DiskAnalysis {
    param(
        [string]$AnalysisType = "daily"
    )
    
    Write-Log "Starting $AnalysisType disk analysis..." "INFO"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $hostname = $env:COMPUTERNAME
    $outputFile = Join-Path $script:Config.OutputDirectory "$AnalysisType\$hostname-$timestamp.json"
    
    foreach ($target in $script:Config.AnalysisTargets) {
        Write-Log "Analyzing: $target" "INFO"
        
        # Prepare bash command
        $bashCommand = "cd $(Split-Path $script:Config.ScriptPath -Parent); ./$(Split-Path $script:Config.ScriptPath -Leaf) --json-export '$target'"
        
        try {
            # Execute via Git Bash
            $result = & $script:Config.GitBashPath -c $bashCommand
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Analysis completed successfully for: $target" "SUCCESS"
            } else {
                Write-Log "Analysis failed for: $target (Exit code: $LASTEXITCODE)" "ERROR"
            }
        } catch {
            Write-Log "Error running analysis for $target`: $($_.Exception.Message)" "ERROR"
        }
    }
    
    # Copy to central share if available
    if (Test-Path $script:Config.CentralShare) {
        try {
            Copy-Item $outputFile -Destination $script:Config.CentralShare -Force
            Write-Log "Analysis copied to central share: $($script:Config.CentralShare)" "SUCCESS"
        } catch {
            Write-Log "Failed to copy to central share: $($_.Exception.Message)" "WARNING"
        }
    }
    
    return $outputFile
}

# Send notifications
function Send-Notification {
    param(
        [string]$Subject,
        [string]$Body,
        [string]$Type = "INFO"
    )
    
    # Email notification
    if ($script:Config.Notifications.Email.Enabled) {
        try {
            $mailParams = @{
                SmtpServer = $script:Config.Notifications.Email.SMTPServer
                From = $script:Config.Notifications.Email.From
                To = $script:Config.Notifications.Email.To
                Subject = "[$Type] Lab Disk Analysis - $Subject"
                Body = $Body
                BodyAsHtml = $false
            }
            Send-MailMessage @mailParams
            Write-Log "Email notification sent successfully" "SUCCESS"
        } catch {
            Write-Log "Failed to send email notification: $($_.Exception.Message)" "ERROR"
        }
    }
    
    # Slack notification (if enabled)
    if ($script:Config.Notifications.Slack.Enabled -and $script:Config.Notifications.Slack.WebhookURL) {
        try {
            $slackMessage = @{
                text = "[$Type] $Subject"
                attachments = @(@{
                    color = if ($Type -eq "ERROR") { "danger" } elseif ($Type -eq "WARNING") { "warning" } else { "good" }
                    text = $Body
                })
            }
            
            Invoke-RestMethod -Uri $script:Config.Notifications.Slack.WebhookURL -Method Post -Body ($slackMessage | ConvertTo-Json -Depth 3) -ContentType "application/json"
            Write-Log "Slack notification sent successfully" "SUCCESS"
        } catch {
            Write-Log "Failed to send Slack notification: $($_.Exception.Message)" "ERROR"
        }
    }
}

# Install scheduled task
function Install-ScheduledTask {
    Write-Log "Installing scheduled task: $($script:Config.ScheduleName)" "INFO"
    
    try {
        # Create task action
        $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
        
        # Create task trigger based on configuration
        switch ($script:Config.Schedule.Frequency) {
            "Daily" {
                $trigger = New-ScheduledTaskTrigger -Daily -At $script:Config.Schedule.Time
            }
            "Weekly" {
                $trigger = New-ScheduledTaskTrigger -Weekly -WeeksInterval 1 -DaysOfWeek $script:Config.Schedule.Days -At $script:Config.Schedule.Time
            }
            default {
                $trigger = New-ScheduledTaskTrigger -Daily -At $script:Config.Schedule.Time
            }
        }
        
        # Create task settings
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        
        # Create task principal (run as SYSTEM)
        $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        
        # Register the task
        Register-ScheduledTask -TaskName $script:Config.ScheduleName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force
        
        Write-Log "Scheduled task installed successfully" "SUCCESS"
        Send-Notification "Automation Installed" "Windows disk analysis automation has been installed and scheduled."
        
    } catch {
        Write-Log "Failed to install scheduled task: $($_.Exception.Message)" "ERROR"
        throw
    }
}

# Uninstall scheduled task
function Uninstall-ScheduledTask {
    Write-Log "Uninstalling scheduled task: $($script:Config.ScheduleName)" "INFO"
    
    try {
        Unregister-ScheduledTask -TaskName $script:Config.ScheduleName -Confirm:$false
        Write-Log "Scheduled task uninstalled successfully" "SUCCESS"
        Send-Notification "Automation Removed" "Windows disk analysis automation has been uninstalled."
    } catch {
        Write-Log "Failed to uninstall scheduled task: $($_.Exception.Message)" "ERROR"
    }
}

# Generate system health report
function Get-SystemHealth {
    $health = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Hostname = $env:COMPUTERNAME
        GitBashAvailable = Test-GitBash
        ScriptAvailable = Test-Path $script:Config.ScriptPath
        OutputDirectoryExists = Test-Path $script:Config.OutputDirectory
        CentralShareAccessible = Test-Path $script:Config.CentralShare
        LastAnalysis = $null
        DiskSpace = @{}
    }
    
    # Check last analysis
    $lastAnalysisFile = Get-ChildItem -Path (Join-Path $script:Config.OutputDirectory "daily") -Filter "*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($lastAnalysisFile) {
        $health.LastAnalysis = $lastAnalysisFile.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    }
    
    # Get disk space info
    Get-WmiObject -Class Win32_LogicalDisk | ForEach-Object {
        $health.DiskSpace[$_.DeviceID] = @{
            SizeGB = [math]::Round($_.Size / 1GB, 2)
            FreeGB = [math]::Round($_.FreeSpace / 1GB, 2)
            PercentFree = [math]::Round(($_.FreeSpace / $_.Size) * 100, 1)
        }
    }
    
    return $health
}

# Main execution logic
function Main {
    Write-Log "=== Windows Lab Disk Analysis Automation ===" "INFO"
    Write-Log "Hostname: $env:COMPUTERNAME" "INFO"
    Write-Log "Timestamp: $(Get-Date)" "INFO"
    
    # Load configuration if file exists
    if (Test-Path $ConfigFile) {
        try {
            $customConfig = Get-Content $ConfigFile | ConvertFrom-Json
            # Merge custom config with defaults (simplified)
            Write-Log "Configuration loaded from: $ConfigFile" "INFO"
        } catch {
            Write-Log "Failed to load configuration file: $($_.Exception.Message)" "WARNING"
        }
    }
    
    # Handle installation/uninstallation
    if ($Install) {
        Initialize-Directories
        if (Test-GitBash) {
            Install-ScheduledTask
        }
        return
    }
    
    if ($Uninstall) {
        Uninstall-ScheduledTask
        return
    }
    
    # Regular execution
    Initialize-Directories
    
    if (!(Test-GitBash)) {
        Send-Notification "Setup Error" "Git Bash is not available. Please install Git for Windows." "ERROR"
        return
    }
    
    # Run analysis
    try {
        $outputFile = Invoke-DiskAnalysis
        $health = Get-SystemHealth
        
        # Generate summary report
        $summary = @"
Disk Analysis Completed Successfully

System: $($health.Hostname)
Timestamp: $($health.Timestamp)
Output File: $outputFile

System Health:
- Git Bash: $(if($health.GitBashAvailable) {"✓"} else {"✗"})
- Script Available: $(if($health.ScriptAvailable) {"✓"} else {"✗"})
- Central Share: $(if($health.CentralShareAccessible) {"✓"} else {"✗"})
- Last Analysis: $($health.LastAnalysis)

Disk Space:
$($health.DiskSpace.GetEnumerator() | ForEach-Object { "- $($_.Key): $($_.Value.FreeGB)GB free ($($_.Value.PercentFree)%)" } | Out-String)

Web Dashboard: https://64vrc4xoo7.space.minimax.io
"@
        
        Write-Log "Analysis completed successfully" "SUCCESS"
        Send-Notification "Analysis Complete" $summary "SUCCESS"
        
    } catch {
        $errorMessage = "Analysis failed: $($_.Exception.Message)"
        Write-Log $errorMessage "ERROR"
        Send-Notification "Analysis Failed" $errorMessage "ERROR"
    }
}

# Execute main function
if ($MyInvocation.InvocationName -ne '.') {
    Main
}
