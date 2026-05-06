#!/bin/bash

# Script to recursively remove dist and node_modules directories
# Usage: ./cleanup-dirs.sh [directory]
# If no directory is provided, uses current directory

# Set the target directory (default to current directory)
TARGET_DIR="${1:-.}"

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory '$TARGET_DIR' does not exist."
    exit 1
fi

echo "Searching for dist and node_modules directories in: $TARGET_DIR"
echo

# Function to calculate directory size
get_dir_size() {
    if command -v du >/dev/null 2>&1; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "unknown"
    fi
}

# Find and process directories
total_removed=0
total_size="0"

# Process node_modules directories
echo "Finding node_modules directories..."
while IFS= read -r -d '' dir; do
    if [ -d "$dir" ]; then
        size=$(get_dir_size "$dir")
        echo "Removing: $dir ($size)"
        rm -rf "$dir"
        ((total_removed++))
    fi
done < <(find "$TARGET_DIR" -type d -name "node_modules" -print0 2>/dev/null)

# Process dist directories
echo
echo "Finding dist directories..."
while IFS= read -r -d '' dir; do
    if [ -d "$dir" ]; then
        size=$(get_dir_size "$dir")
        echo "Removing: $dir ($size)"
        rm -rf "$dir"
        ((total_removed++))
    fi
done < <(find "$TARGET_DIR" -type d -name "dist" -print0 2>/dev/null)

echo
echo "Cleanup complete!"
echo "Total directories removed: $total_removed"

# Optional: Show remaining disk space
if command -v df >/dev/null 2>&1; then
    echo
    echo "Current disk usage for $TARGET_DIR:"
    df -h "$TARGET_DIR"
fi