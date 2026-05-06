#!/bin/bash

# Diagnostic version to identify the issue
set -e  # Exit on any error
set -x  # Show each command being executed

echo "=== DIAGNOSTIC DISK ANALYZER ==="
echo "Starting diagnostic at: $(date)"

# Check basic environment
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"
echo "Shell: $SHELL"

# Check if we can write to current directory
echo "Testing log file creation..."
LOG_FILE="./diagnostic.log"
if echo "Test log entry" > "$LOG_FILE"; then
    echo "✓ Can write log file: $LOG_FILE"
else
    echo "✗ Cannot write log file"
    exit 1
fi

# Check the target directory
TARGET_DIR="/c/users/DELL/AppData"
echo "Checking target directory: $TARGET_DIR"

if [[ -d "$TARGET_DIR" ]]; then
    echo "✓ Target directory exists"
    
    # Test if we can list it
    if ls "$TARGET_DIR" >/dev/null 2>&1; then
        echo "✓ Can list target directory"
        echo "Items in directory: $(ls -1 "$TARGET_DIR" 2>/dev/null | wc -l)"
    else
        echo "✗ Cannot list target directory (permission issue)"
        echo "Trying parent directory..."
        ls -la "$(dirname "$TARGET_DIR")" 2>/dev/null || echo "Cannot access parent either"
    fi
else
    echo "✗ Target directory does not exist: $TARGET_DIR"
    echo "Let's check what's available:"
    echo "Checking /c/users/"
    ls -la /c/users/ 2>/dev/null || echo "Cannot access /c/users/"
    echo "Checking /c/"
    ls -la /c/ 2>/dev/null || echo "Cannot access /c/"
    
    # Suggest alternatives
    echo "Suggesting alternative target directories:"
    if [[ -d "/c/Users" ]]; then
        echo "Found: /c/Users (capital U)"
        ls -la /c/Users/ 2>/dev/null | head -5
    fi
    
    if [[ -d "$HOME" ]]; then
        echo "Found: HOME directory: $HOME"
    fi
fi

# Test du command
echo "Testing du command..."
if command -v du >/dev/null 2>&1; then
    echo "✓ du command available"
    # Test du on current directory
    echo "Testing du on current directory:"
    du -h -d 1 . 2>/dev/null | head -5 || echo "du test failed"
else
    echo "✗ du command not available"
fi

# Test sort command
echo "Testing sort command..."
if command -v sort >/dev/null 2>&1; then
    echo "✓ sort command available"
else
    echo "✗ sort command not available"
fi

echo "=== DIAGNOSTIC COMPLETE ==="
echo "Check diagnostic.log for any additional information"

# Simple working example on current directory
echo ""
echo "=== SIMPLE TEST ON CURRENT DIRECTORY ==="
echo "Top directories in current location:"
du -h -d 1 . 2>/dev/null | sort -rh | head -10 || echo "Simple test failed"