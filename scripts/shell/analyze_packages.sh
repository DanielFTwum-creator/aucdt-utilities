#!/bin/bash

cd "C:\Users\DELL\OneDrive\Documents\Downloads\Development\aucdt-utilities"

# Find all package.json files
while IFS= read -r file; do
  dir=$(dirname "$file")
  project=$(basename "$dir")
  
  # Extract relevant fields
  has_react_scripts=$(grep -o '"react-scripts"[^}]*' "$file" | head -1)
  has_vite=$(grep -o '"vite"[^}]*' "$file" | head -1)
  has_serve=$(grep -o '"serve"[^}]*' "$file" | head -1)
  has_webpack=$(grep -o '"webpack"[^}]*' "$file" | head -1)
  has_next=$(grep -o '"next"[^}]*' "$file" | head -1)
  has_gatsby=$(grep -o '"gatsby"[^}]*' "$file" | head -1)
  
  # Output in a parseable format
  echo "PROJECT:$project|FILE:$file|REACT_SCRIPTS:$has_react_scripts|VITE:$has_vite|SERVE:$has_serve|WEBPACK:$has_webpack|NEXT:$has_next|GATSBY:$has_gatsby"
done < <(find . -maxdepth 2 -name "package.json" -type f)
