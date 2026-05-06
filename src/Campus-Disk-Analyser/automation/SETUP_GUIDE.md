# Lab Automation Setup Guide
## Automated Disk Analysis for Windows & macOS Mixed Environment

### 🎯 Overview
This automation system provides scheduled disk analysis across your Windows and macOS lab systems with centralized reporting and PowerDesk-style visualization.

### 📋 Prerequisites

#### Windows Systems
- **Git Bash** or **WSL** installed
- **PowerShell 5.1+** with execution policy allowing scripts
- **Network access** to central share
- **Administrator privileges** for Task Scheduler

#### macOS Systems
- **Terminal** with bash/zsh
- **SSH access** enabled (System Preferences → Sharing → Remote Login)
- **Administrative privileges** for LaunchDaemon installation
- **Network access** to central share

#### Central Server
- **Python 3.7+** with required packages
- **Network share** accessible by all lab systems
- **Database storage** (SQLite or PostgreSQL)
- **Email server** access (optional)

## 🚀 Quick Start (5 Minutes)

### Step 1: Download Automation Package
```bash
# Download the complete automation package
curl -L -o lab-automation.zip "YOUR_DOWNLOAD_URL"
unzip lab-automation.zip
cd lab-automation
```

### Step 2: Configure Settings
```bash
# Copy and edit configuration
cp config-template.json config.json
# Edit config.json with your lab-specific settings
```

### Step 3: Deploy to Lab Systems

#### Windows Deployment
```powershell
# Run from PowerShell as Administrator
.\deploy-windows.ps1 -ComputerNames "WIN-LAB-01,WIN-LAB-02" -Force
```

#### macOS Deployment
```bash
# Run from Terminal
./deploy-macos.sh --computers "mac-lab-01.local,mac-lab-02.local" --user admin --force
```

### Step 4: Start Central Collection
```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Run central data collector
python3 central/lab-data-collector.py --collect
```

### Step 5: View Results
🌐 **Web Dashboard**: https://64vrc4xoo7.space.minimax.io

## 📊 Detailed Setup Instructions

### Windows Systems Setup

#### 1. Prerequisites Check
```powershell
# Check Git Bash installation
Test-Path "C:\Program Files\Git\bin\bash.exe"

# Check PowerShell version
$PSVersionTable.PSVersion

# Test network share access
Test-Path "\\labserver\disk-analysis"
```

#### 2. Manual Installation (Single System)
```powershell
# Create directory
New-Item -ItemType Directory -Path "C:\LabAutomation" -Force

# Copy scripts
Copy-Item "enhanced-disk-analyser.sh" -Destination "C:\LabAutomation\"
Copy-Item "automated-disk-monitor.ps1" -Destination "C:\LabAutomation\"

# Install automation
cd C:\LabAutomation
.\automated-disk-monitor.ps1 -Install

# Test run
.\automated-disk-monitor.ps1 -TestRun
```

#### 3. Verify Installation
```powershell
# Check scheduled task
Get-ScheduledTask -TaskName "LabDiskAnalysis"

# Check output directory
Get-ChildItem "C:\LabData\DiskAnalysis" -Recurse

# View logs
Get-Content "C:\LabData\DiskAnalysis\logs\automation.log" -Tail 20
```

### macOS Systems Setup

#### 1. Prerequisites Check
```bash
# Check SSH access
ssh admin@mac-lab-01.local "echo 'SSH working'"

# Check sudo privileges
ssh admin@mac-lab-01.local "sudo -l"

# Test network share
ls /Volumes/lab-analysis
```

#### 2. Manual Installation (Single System)
```bash
# Create directory
sudo mkdir -p /usr/local/bin/lab-automation
sudo chown $(whoami) /usr/local/bin/lab-automation

# Copy scripts
cp test-enhanced-disk-analyser.sh /usr/local/bin/lab-automation/
cp automated-disk-monitor.sh /usr/local/bin/lab-automation/
chmod +x /usr/local/bin/lab-automation/*.sh

# Install automation
cd /usr/local/bin/lab-automation
sudo ./automated-disk-monitor.sh --install

# Test run
./automated-disk-monitor.sh --test
```

#### 3. Verify Installation
```bash
# Check LaunchDaemon
sudo launchctl list | grep com.lab.diskanalysis

# Check output directory
ls -la /Users/Shared/LabData/DiskAnalysis/

# View logs
tail -20 /Users/Shared/LabData/DiskAnalysis/logs/automation.log
```

### Central Collection Setup

#### 1. Server Requirements
```bash
# Install Python dependencies
pip3 install sqlite3 smtplib email pathlib

# Create directories
mkdir -p /shared/{disk-analysis,reports,web-data,logs}

# Set permissions
chmod 755 /shared/*
```

#### 2. Database Setup
```bash
# Initialize database
python3 central/lab-data-collector.py --init-db

# Test collection
python3 central/lab-data-collector.py --test
```

#### 3. Schedule Central Collection
```bash
# Add to crontab for hourly collection
crontab -e
# Add line: 0 * * * * /usr/bin/python3 /path/to/central/lab-data-collector.py --collect
```

## ⚙️ Configuration Options

### Windows Configuration
```json
{
  "windows": {
    "analysis_targets": [
      "/c/Users",           // User data
      "/c/Program Files",   // Applications
      "/c/Windows/Temp"     // Temporary files
    ],
    "schedule": {
      "frequency": "Daily",     // Daily, Weekly
      "time": "02:00",         // 24-hour format
      "days": ["Monday", "Wednesday", "Friday"]
    }
  }
}
```

### macOS Configuration
```json
{
  "macos": {
    "analysis_targets": [
      "/Users",                    // User data
      "/Applications",             // Applications
      "/System/Volumes/Data",      // System data
      "/Library"                   // System libraries
    ],
    "schedule": {
      "hour": "02",               // 24-hour format
      "minute": "00",
      "days": "1,3,5"             // 0=Sunday, 1=Monday, etc.
    }
  }
}
```

### Notification Setup
```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "smtp_server": "mail.yourdomain.com",
      "smtp_port": 587,
      "username": "lab-monitoring@yourdomain.com",
      "recipients": ["admin@yourdomain.com"]
    },
    "slack": {
      "enabled": true,
      "webhook_url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
    }
  }
}
```

## 🔧 Troubleshooting

### Common Windows Issues

#### PowerShell Execution Policy
```powershell
# Check current policy
Get-ExecutionPolicy

# Set to allow scripts
Set-ExecutionPolicy RemoteSigned -Scope LocalMachine -Force
```

#### Git Bash Not Found
```powershell
# Find Git installation
Get-ChildItem "C:\Program Files" -Filter "Git" -Directory -Recurse

# Update config with correct path
# Edit config.json: "git_bash_path": "C:\\Program Files\\Git\\bin\\bash.exe"
```

#### Network Share Access
```powershell
# Test share connectivity
Test-NetConnection -ComputerName "labserver" -Port 445

# Map drive temporarily
net use Z: \\labserver\disk-analysis /persistent:no
```

### Common macOS Issues

#### SSH Permission Denied
```bash
# Check SSH service
sudo systemsetup -getremotelogin

# Enable SSH
sudo systemsetup -setremotelogin on

# Check SSH keys
ssh-copy-id admin@mac-lab-01.local
```

#### LaunchDaemon Permission Error
```bash
# Check file ownership
ls -la /Library/LaunchDaemons/com.lab.diskanalysis.plist

# Fix permissions
sudo chown root:wheel /Library/LaunchDaemons/com.lab.diskanalysis.plist
sudo chmod 644 /Library/LaunchDaemons/com.lab.diskanalysis.plist
```

#### Network Share Not Mounting
```bash
# Test SMB connection
smbutil status labserver

# Mount manually
mkdir -p /Volumes/lab-analysis
mount -t smbfs //labserver/disk-analysis /Volumes/lab-analysis
```

### Central Collection Issues

#### Database Errors
```bash
# Check database file
ls -la /shared/lab-analysis.db

# Reset database
rm /shared/lab-analysis.db
python3 central/lab-data-collector.py --init-db
```

#### Email Notification Issues
```bash
# Test SMTP connection
telnet mail.yourdomain.com 587

# Check email logs
grep "email" /shared/logs/lab-collector.log
```

## 📈 Monitoring & Maintenance

### Daily Checks
```bash
# Check analysis status
python3 central/lab-data-collector.py --status

# View recent logs
tail -50 /shared/logs/lab-collector.log

# Check web dashboard
curl -I https://64vrc4xoo7.space.minimax.io
```

### Weekly Maintenance
```bash
# Clean old logs
find /shared/logs -name "*.log" -mtime +30 -delete

# Update analysis data
python3 central/lab-data-collector.py --collect --cleanup

# Generate weekly report
python3 central/lab-data-collector.py --report --email
```

### Monthly Tasks
```bash
# Review disk usage trends
python3 central/lab-data-collector.py --trend-analysis

# Update automation scripts
./deploy-windows.ps1 -Update
./deploy-macos.sh --update

# Backup configuration and data
tar -czf lab-automation-backup-$(date +%Y%m%d).tar.gz /shared/
```

## 🎯 Success Metrics

### Expected Results
- **Automated Analysis**: All systems analyzed 3x/week
- **Data Collection**: 100% analysis files collected centrally
- **Web Dashboard**: Updated within 1 hour of analysis
- **Notifications**: Alerts sent for issues within 15 minutes
- **Uptime**: 99%+ automation reliability

### Performance Benchmarks
- **Windows Analysis**: <5 minutes per system
- **macOS Analysis**: <3 minutes per system
- **Central Collection**: <2 minutes for all systems
- **Web Dashboard Load**: <3 seconds
- **Email Reports**: <1 minute delivery

## 📞 Support & Resources

### Quick Commands Reference
```bash
# Windows: Test analysis
C:\LabAutomation\automated-disk-monitor.ps1 -TestRun

# macOS: Test analysis
/usr/local/bin/lab-automation/automated-disk-monitor.sh --test

# Central: Generate report
python3 central/lab-data-collector.py --report

# View web dashboard
open https://64vrc4xoo7.space.minimax.io
```

### Log Locations
- **Windows**: `C:\LabData\DiskAnalysis\logs\automation.log`
- **macOS**: `/Users/Shared/LabData/DiskAnalysis/logs/automation.log`
- **Central**: `/shared/logs/lab-collector.log`
- **Web**: Browser Network tab

### Configuration Files
- **Main Config**: `config.json`
- **Windows**: `windows/config.json`
- **macOS**: `macos/config.json`
- **Central**: `central/config.json`

This automation system transforms your lab disk monitoring from manual tasks to a comprehensive, automated solution with professional visualization and reporting.
