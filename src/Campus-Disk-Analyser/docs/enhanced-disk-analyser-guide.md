# Enhanced Disk Analyzer - User Guide

## Overview

The Enhanced Disk Analyzer is a comprehensive upgrade to the original disk analysis script, providing PowerDesk-style data visualization capabilities with structured JSON export functionality.

## Key Enhancements

### 1. Enhanced Data Collection
- **File Count Analysis**: Counts files in each directory for comprehensive analysis
- **Modification Date Tracking**: Captures and displays last modification dates
- **Deeper Hierarchy Scanning**: Scans up to 4 levels deep (configurable) instead of 2
- **Structured JSON Output**: Generates machine-readable data for web visualization

### 2. Improved Analysis Features
- **Intelligent Size Formatting**: Automatic unit selection (B, KB, MB, GB, TB)
- **Percentage Calculations**: Shows each directory's percentage of total disk usage
- **Tree Structure Visualization**: ASCII tree display of directory hierarchies
- **Enhanced Progress Reporting**: Real-time progress indicators during scanning
- **Better Error Handling**: Comprehensive error logging and graceful degradation

### 3. New Output Capabilities
- **Backward Compatible Terminal Output**: Maintains existing display format
- **JSON Export Functionality**: Structured data export for web applications
- **PowerDesk-Style Data Fields**: Matches PowerDesk visualization format
- **Multiple Output Formats**: Both human-readable and machine-readable outputs

## Usage Examples

### Basic Usage (Backward Compatible)
```bash
# Auto-detect and analyze with default settings
./enhanced-disk-analyser.sh

# Specify number of results
./enhanced-disk-analyser.sh 15

# Analyze specific directories
./enhanced-disk-analyser.sh /c/Users /c/Program\ Files
```

### Advanced Usage
```bash
# Disable JSON export for performance
EXPORT_JSON=false ./enhanced-disk-analyser.sh

# Enable debug mode for troubleshooting
DEBUG=true ./enhanced-disk-analyser.sh

# Combine options
DEBUG=true EXPORT_JSON=false ./enhanced-disk-analyser.sh 25 /c/Users
```

## Output Files

### 1. Terminal Output
Enhanced table format with columns:
- **Rank**: Directory ranking by size
- **Size**: Formatted size with appropriate units
- **Files**: Number of files in directory
- **%**: Percentage of total disk usage
- **Modified**: Last modification date (DD/MM/YYYY)
- **Directory**: Full directory path

### 2. Log File (`disk-analyser.log`)
Comprehensive execution log including:
- System information and environment validation
- Progress tracking and timing information
- Error messages and warnings
- Debug information (when enabled)

### 3. JSON Data File (`disk-analysis-data.json`)
Structured data export containing:
```json
{
  "analysis_metadata": {
    "timestamp": "2024-12-30T20:01:48Z",
    "script_version": "enhanced-v2.0",
    "max_depth": 4,
    "target_directories": ["/c/Users"]
  },
  "directory_analysis": [
    {
      "name": "AppData",
      "path": "/c/Users/username/AppData",
      "size_kb": 1234567,
      "size_formatted": "1.2GB",
      "file_count": 145,
      "modification_timestamp": 1640995200,
      "modification_date": "31/12/2021",
      "depth": 3,
      "parent_path": "/c/Users/username",
      "percentage": 15.3
    }
  ]
}
```

## PowerDesk-Style Data Fields

The enhanced script captures all data fields visible in PowerDesk:

| Field | Description | JSON Key |
|-------|-------------|----------|
| Folders | Directory name and path | `name`, `path` |
| Total | Directory size with visual indication | `size_formatted`, `size_kb` |
| Files in Folder | Number of files in directory | `file_count` |
| Modified | Last modification date | `modification_date` |

## Tree Structure Visualization

The script generates ASCII tree structures showing directory hierarchies:

```
└── Users 1.2GB [0 files] [15/03/2024]
    ├── username 850MB [25 files] [20/03/2024]
    │   ├── AppData 500MB [0 files] [18/03/2024]
    │   │   ├── Local 300MB [15 files] [18/03/2024]
    │   │   └── Roaming 200MB [45 files] [17/03/2024]
    │   └── Documents 350MB [128 files] [20/03/2024]
    └── Public 350MB [5 files] [10/03/2024]
```

## Configuration Options

### Environment Variables
- `DEBUG=true`: Enable detailed debug logging
- `EXPORT_JSON=false`: Disable JSON export for performance
- `NUM_DIRS=20`: Default number of directories to display

### Script Variables (editable in script)
- `MAX_DEPTH=4`: Maximum scanning depth
- `JSON_OUTPUT_FILE`: JSON output file path
- `LOG_FILE`: Log file path

## Performance Considerations

### Large Directory Analysis
- The enhanced script uses deeper scanning (4 levels vs 2)
- JSON export adds minimal overhead
- Progress indicators provide feedback during long operations
- Error handling prevents script crashes on inaccessible directories

### Memory Usage
- Streaming approach for large datasets
- Temporary files cleaned up automatically
- JSON data structured efficiently

## Integration with Web Applications

The JSON output is designed for easy integration with web-based visualization tools:

### Data Structure
- **Consistent field naming**: Snake_case for programming languages
- **Multiple size formats**: Both raw KB values and formatted strings
- **Hierarchical information**: Parent paths and depth levels
- **Metadata included**: Timestamps, script version, configuration

### Visualization Possibilities
- **Tree view components**: Using depth and parent_path fields
- **Size charts**: Using size_kb and percentage fields
- **File count analysis**: Using file_count field
- **Timeline views**: Using modification_timestamp field

## Troubleshooting

### Common Issues
1. **Permission Denied**: Run with administrator privileges for full access
2. **Large Scan Times**: Reduce MAX_DEPTH or target fewer directories
3. **JSON Format Errors**: Check Python availability for formatting

### Debug Mode
Enable debug mode for detailed troubleshooting:
```bash
DEBUG=true ./enhanced-disk-analyser.sh
```

## Backward Compatibility

The enhanced script maintains full backward compatibility:
- **Same command-line interface**: All original arguments work unchanged
- **Same terminal output format**: Enhanced but compatible display
- **Same log file structure**: Extended but compatible logging

## Future Enhancements

Potential improvements for future versions:
- **Database export**: SQLite or CSV output options
- **Real-time monitoring**: Watch mode for continuous analysis
- **Network drive support**: Enhanced handling of remote directories
- **Custom filtering**: Include/exclude patterns for specific file types
- **Visualization tools**: Built-in HTML report generation
