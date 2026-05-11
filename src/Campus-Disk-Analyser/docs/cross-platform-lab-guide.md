# Cross-Platform Lab Guide - Windows & macOS

## Overview
This guide provides specific instructions for using the Enhanced Disk Analyzer in mixed Windows/macOS lab environments.

## Platform-Specific Setup

### Windows Systems

#### Prerequisites
- **Git Bash** (recommended) - Download from https://git-scm.com/
- Or **WSL** (Windows Subsystem for Linux)
- PowerShell (for automation scenarios)

#### Installation
```bash
# In Git Bash or WSL
cd /c/Users/YourUsername/Desktop
curl -O https://raw.githubusercontent.com/your-repo/enhanced-disk-analyser.sh
chmod +x enhanced-disk-analyser.sh
```

#### Usage Examples
```bash
# Analyze user directories
./enhanced-disk-analyser.sh /c/Users

# Analyze with JSON export for web visualization
./enhanced-disk-analyser.sh --json-export /c/Users

# Analyze program files (may require admin)
./enhanced-disk-analyser.sh /c/Program\ Files
```

#### Common Windows Paths
- User data: `/c/Users`
- Program files: `/c/Program\ Files`
- Application data: `/c/Users/USERNAME/AppData`
- System: `/c/Windows`

### macOS Systems

#### Prerequisites
- **Terminal** (built-in)
- **Homebrew** (optional, for additional tools)
- **Xcode Command Line Tools**: `xcode-select --install`

#### Installation
```bash
# In Terminal
cd ~/Desktop
curl -O https://raw.githubusercontent.com/your-repo/test-enhanced-disk-analyser.sh
chmod +x test-enhanced-disk-analyser.sh
```

#### Usage Examples
```bash
# Analyze user directories
./test-enhanced-disk-analyser.sh /Users

# Analyze with JSON export
./test-enhanced-disk-analyser.sh --json-export /Users

# Analyze applications
./test-enhanced-disk-analyser.sh /Applications
```

#### Common macOS Paths
- User data: `/Users`
- Applications: `/Applications`
- System: `/System`
- Library: `/Library`
- Home directory: `/Users/USERNAME`

## Lab Workflow Scenarios

### Scenario 1: Regular Maintenance Across All Systems
```bash
# Windows Git Bash
./enhanced-disk-analyser.sh --json-export /c/Users > windows-analysis.json

# macOS Terminal  
./test-enhanced-disk-analyser.sh --json-export /Users > mac-analysis.json

# Upload both JSON files to web interface for comparison
```

### Scenario 2: Pre-Software Installation Analysis
```bash
# Before installation (save baseline)
./enhanced-disk-analyser.sh --json-export /c/Program\ Files > before-install.json

# After installation (compare impact)
./enhanced-disk-analyser.sh --json-export /c/Program\ Files > after-install.json

# Use web interface to compare both analyses
```

### Scenario 3: Cross-Platform Data Migration Planning
```bash
# Analyze source system (Windows)
./enhanced-disk-analyser.sh --json-export /c/Users/USERNAME > migration-source.json

# Analyze target system (macOS)
./test-enhanced-disk-analyser.sh --json-export /Users/USERNAME > migration-target.json

# Use web visualization to plan migration strategy
```

## Feature Comparison Matrix

| Feature | Windows Version | macOS Version | Notes |
|---------|----------------|---------------|-------|
| **File Count Analysis** | ✅ Full support | ✅ Full support | Identical functionality |
| **Modification Dates** | ✅ Full support | ✅ Full support | Platform-appropriate formatting |
| **JSON Export** | ✅ Full support | ✅ Full support | Same data structure |
| **Tree Visualization** | ✅ Full support | ✅ Full support | Terminal ASCII art |
| **Web Integration** | ✅ Full support | ✅ Full support | Upload JSON to web interface |
| **Admin Privileges** | ✅ Windows-specific detection | ✅ sudo detection | Platform-appropriate |
| **Path Handling** | ✅ Windows paths (/c/) | ✅ Unix paths (/) | Auto-detected |
| **Performance** | ✅ Optimized for NTFS | ✅ Optimized for APFS/HFS+ | File system aware |

## Network/Lab Management

### Centralized Analysis Collection
```bash
# Create shared analysis directory
mkdir /shared/disk-analyses

# Windows systems
./enhanced-disk-analyser.sh --json-export /c/Users > "/shared/disk-analyses/$(hostname)-windows-$(date +%Y%m%d).json"

# macOS systems
./test-enhanced-disk-analyser.sh --json-export /Users > "/shared/disk-analyses/$(hostname)-mac-$(date +%Y%m%d).json"
```

### Automated Lab Monitoring
```bash
# Weekly analysis script (works on both platforms)
#!/bin/bash
HOSTNAME=$(hostname)
DATE=$(date +%Y%m%d)
PLATFORM=$(uname)

if [[ "$PLATFORM" == "Darwin" ]]; then
    # macOS
    ./test-enhanced-disk-analyser.sh --json-export /Users > "lab-analysis-${HOSTNAME}-mac-${DATE}.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows Git Bash
    ./enhanced-disk-analyser.sh --json-export /c/Users > "lab-analysis-${HOSTNAME}-win-${DATE}.json"
fi
```

## Troubleshooting by Platform

### Windows Issues
- **Permission Denied**: Run Git Bash as Administrator
- **Path Not Found**: Use Windows-style paths (`/c/` instead of `C:\`)
- **Slow Performance**: Exclude antivirus scanning for script directory

### macOS Issues
- **Permission Denied**: Use `sudo` for system directories
- **Command Not Found**: Install Xcode Command Line Tools
- **Gatekeeper Warnings**: `xattr -d com.apple.quarantine script-name.sh`

## Best Practices for Mixed Labs

1. **Standardized Naming**: Use consistent JSON output names
2. **Centralized Storage**: Store all analyses in shared network location
3. **Regular Scheduling**: Set up weekly automated analyses
4. **Web Dashboard**: Use single web interface for all platform data
5. **Documentation**: Keep platform-specific notes for each system

## Integration with Lab Management Tools

### Active Directory (Windows)
```powershell
# PowerShell wrapper for Windows systems
$bashPath = "C:\Program Files\Git\bin\bash.exe"
& $bashPath -c "./enhanced-disk-analyser.sh --json-export /c/Users"
```

### Jamf Pro (macOS)
```bash
# Script for Jamf deployment
#!/bin/bash
cd /usr/local/scripts
./test-enhanced-disk-analyser.sh --json-export /Users
```

This cross-platform approach ensures you can maintain consistent disk analysis across your entire lab environment while leveraging the strengths of each platform.
