# Quick Lab Deployment - Windows & macOS

## 🚀 5-Minute Setup for Mixed Lab Environment

### Windows Systems (Git Bash)
```bash
# 1. Download and setup
curl -L -o enhanced-disk-analyser.sh "YOUR_SCRIPT_URL"
chmod +x enhanced-disk-analyser.sh

# 2. Test run
./enhanced-disk-analyser.sh /c/Users

# 3. Generate JSON for web visualization
./enhanced-disk-analyser.sh --json-export /c/Users
```

### macOS Systems (Terminal)
```bash
# 1. Download and setup
curl -L -o mac-disk-analyser.sh "YOUR_MAC_SCRIPT_URL"
chmod +x mac-disk-analyser.sh

# 2. Test run
./mac-disk-analyser.sh /Users

# 3. Generate JSON for web visualization
./mac-disk-analyser.sh --json-export /Users
```

### Web Visualization (All Platforms)
🌐 **Access**: https://64vrc4xoo7.space.minimax.io
- Works on any browser (Chrome, Safari, Firefox)
- Upload JSON files from any platform
- Compare analyses across Windows/Mac systems

## ⚡ Key Benefits for Your Lab

### ✅ **Unified Workflow**
- Same PowerDesk-style visualization for all systems
- Consistent data format across platforms
- Single web interface for all analyses

### ✅ **Platform Optimization**
- **Windows**: Optimized for NTFS, Git Bash, Windows paths
- **macOS**: Native Unix tools, APFS/HFS+ support, standard paths
- **Both**: Same rich data (file counts, dates, hierarchy)

### ✅ **Lab Management Features**
- Cross-platform comparison capabilities
- Centralized analysis collection
- Automated monitoring scripts
- Network deployment ready

## 📊 **Sample Lab Workflow**

1. **Weekly Analysis**:
   ```bash
   # Windows systems
   ./enhanced-disk-analyser.sh --json-export /c/Users > "lab-win-$(date +%Y%m%d).json"
   
   # Mac systems  
   ./mac-disk-analyser.sh --json-export /Users > "lab-mac-$(date +%Y%m%d).json"
   ```

2. **Upload to Web Interface**:
   - Drag and drop JSON files to https://64vrc4xoo7.space.minimax.io
   - Compare disk usage across different platforms
   - Export reports for lab management

3. **Analysis & Action**:
   - Identify cleanup opportunities
   - Plan storage upgrades
   - Monitor software installation impact

## 🎯 **Perfect for Your Mixed Environment**

The solution provides:
- **Windows**: Full Git Bash compatibility with Windows-specific optimizations
- **macOS**: Native Terminal support with Unix-optimized performance  
- **Universal**: Browser-based PowerDesk-style visualization works everywhere
- **Consistent**: Same data structure and features across all platforms
