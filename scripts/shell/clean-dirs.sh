#!/bin/bash

# Script to recursively remove node_modules and dist directories
# Run from your project root folder

echo "Searching for node_modules and dist directories..."

# Find and display directories before deletion
echo -e "\nDirectories to be removed:"
find . -name "node_modules" -type d -prune -o -name "dist" -type d -prune | grep -E "(node_modules|dist)$"

# Count directories
node_count=$(find . -name "node_modules" -type d -prune | wc -l)
dist_count=$(find . -name "dist" -type d -prune | wc -l)

echo -e "\nFound: $node_count node_modules directories and $dist_count dist directories"

# Ask for confirmation
read -p "Do you want to delete these directories? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo -e "\nDeleting directories..."

    # Remove node_modules directories
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

    # Remove dist directories
    find . -name "dist" -type d -prune -exec rm -rf '{}' +

    echo "✓ Cleanup complete!"
else
    echo "Cancelled. No directories were deleted."
fi
