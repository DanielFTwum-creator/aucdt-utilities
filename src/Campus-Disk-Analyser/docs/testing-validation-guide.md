# Testing and Validation Guide

## Overview

This document provides comprehensive testing procedures and validation criteria for the Enhanced Disk Analyzer solution, ensuring reliability and compatibility across different environments.

## Testing Framework

### Test Categories

1. **Unit Tests**: Individual function validation
2. **Integration Tests**: Script-to-web interface compatibility
3. **Platform Tests**: Windows, Linux, macOS compatibility
4. **Performance Tests**: Large directory handling
5. **Data Validation**: JSON format and structure
6. **User Experience Tests**: End-to-end workflow validation

## Test Environment Setup

### Prerequisites

#### For Windows Testing (Primary Target)
```bash
# Git Bash for Windows
# Required commands: du, sort, head, awk, sed, find, stat, date
# Administrator privileges recommended

# Verify environment
du --version
sort --version
awk --version
```

#### For Cross-Platform Testing
```bash
# Linux/macOS
# Standard GNU coreutils required
# Bash 4.0+ recommended

# Test command availability
which du sort awk sed find stat date
```

### Test Data Creation

#### Create Test Directory Structure
```bash
#!/bin/bash
# test-data-generator.sh

create_test_structure() {
    local base_dir="$1"
    mkdir -p "$base_dir"/{small,medium,large,deep/{level2/{level3,level3b},level2b}}
    
    # Create files of different sizes
    dd if=/dev/zero of="$base_dir/small/file1.txt" bs=1K count=1 2>/dev/null
    dd if=/dev/zero of="$base_dir/medium/file2.txt" bs=1M count=10 2>/dev/null
    dd if=/dev/zero of="$base_dir/large/file3.txt" bs=1M count=100 2>/dev/null
    
    # Create multiple small files
    for i in {1..50}; do
        touch "$base_dir/small/small_file_$i.txt"
    done
    
    # Create deep structure files
    for level in level2 level2b; do
        touch "$base_dir/deep/$level/file_$level.txt"
        for sublevel in level3 level3b; do
            if [[ -d "$base_dir/deep/$level/$sublevel" ]]; then
                touch "$base_dir/deep/$level/$sublevel/deep_file.txt"
            fi
        done
    done
    
    echo "Test structure created in $base_dir"
}

# Usage
create_test_structure "/tmp/disk_analyzer_test"
```

## Unit Tests

### Test 1: Size Formatting Function

#### Test Script
```bash
#!/bin/bash
# test-size-formatting.sh

test_format_size() {
    local test_cases=(
        "0:0B"
        "512:512B"
        "1024:1.0KB"
        "1536:1.5KB"
        "1048576:1.0MB"
        "1073741824:1.0GB"
        "1099511627776:1.0TB"
    )
    
    for case in "${test_cases[@]}"; do
        local input="${case%:*}"
        local expected="${case#*:}"
        local result=$(format_size "$input")
        
        if [[ "$result" == "$expected" ]]; then
            echo "✅ PASS: format_size($input) = $result"
        else
            echo "❌ FAIL: format_size($input) = $result, expected $expected"
        fi
    done
}
```

#### Expected Results
```
✅ PASS: format_size(0) = 0B
✅ PASS: format_size(512) = 512B
✅ PASS: format_size(1024) = 1.0KB
✅ PASS: format_size(1536) = 1.5KB
✅ PASS: format_size(1048576) = 1.0MB
✅ PASS: format_size(1073741824) = 1.0GB
✅ PASS: format_size(1099511627776) = 1.0TB
```

### Test 2: Percentage Calculation

#### Test Script
```bash
test_percentage_calculation() {
    local test_cases=(
        "1000:10000:10.0"
        "2500:10000:25.0"
        "10000:10000:100.0"
        "0:10000:0.0"
        "1:3:33.3"
    )
    
    for case in "${test_cases[@]}"; do
        IFS=':' read -r size total expected <<< "$case"
        local result=$(calculate_percentage "$size" "$total")
        
        if [[ "$result" == "$expected" ]]; then
            echo "✅ PASS: calculate_percentage($size, $total) = $result%"
        else
            echo "❌ FAIL: calculate_percentage($size, $total) = $result%, expected $expected%"
        fi
    done
}
```

### Test 3: File Count Function

#### Test Script
```bash
test_file_count() {
    local test_dir="/tmp/file_count_test"
    mkdir -p "$test_dir"
    
    # Test empty directory
    local count=$(get_file_count "$test_dir")
    if [[ "$count" == "0" ]]; then
        echo "✅ PASS: Empty directory file count = 0"
    else
        echo "❌ FAIL: Empty directory file count = $count, expected 0"
    fi
    
    # Test directory with files
    touch "$test_dir/file1.txt" "$test_dir/file2.txt" "$test_dir/file3.txt"
    local count=$(get_file_count "$test_dir")
    if [[ "$count" == "3" ]]; then
        echo "✅ PASS: Directory with 3 files count = 3"
    else
        echo "❌ FAIL: Directory with 3 files count = $count, expected 3"
    fi
    
    # Cleanup
    rm -rf "$test_dir"
}
```

## Integration Tests

### Test 4: Script Output Validation

#### Test Script
```bash
#!/bin/bash
# test-script-output.sh

test_script_execution() {
    local test_dir="/tmp/integration_test"
    create_test_structure "$test_dir"
    
    echo "Testing script execution..."
    
    # Run the enhanced script
    local output=$(bash enhanced-disk-analyser.sh 10 "$test_dir" 2>&1)
    local exit_code=$?
    
    # Check exit code
    if [[ $exit_code -eq 0 ]]; then
        echo "✅ PASS: Script executed successfully (exit code 0)"
    else
        echo "❌ FAIL: Script failed with exit code $exit_code"
        return 1
    fi
    
    # Check for expected output patterns
    local patterns=(
        "Enhanced.*Disk.*Analyzer"
        "Top.*largest.*directories"
        "Rank.*Size.*Files.*%.*Modified.*Directory"
        "Scan Summary:"
        "Enhanced analysis complete!"
    )
    
    for pattern in "${patterns[@]}"; do
        if echo "$output" | grep -q "$pattern"; then
            echo "✅ PASS: Found expected pattern: $pattern"
        else
            echo "❌ FAIL: Missing expected pattern: $pattern"
        fi
    done
    
    # Check for JSON file generation
    if [[ -f "disk-analysis-data.json" ]]; then
        echo "✅ PASS: JSON file generated"
    else
        echo "❌ FAIL: JSON file not generated"
    fi
    
    # Cleanup
    rm -rf "$test_dir"
    rm -f disk-analysis-data.json disk-analyser.log
}
```

### Test 5: JSON Format Validation

#### Test Script
```bash
test_json_format() {
    echo "Testing JSON format validation..."
    
    # Check if JSON file exists
    if [[ ! -f "disk-analysis-data.json" ]]; then
        echo "❌ FAIL: JSON file not found"
        return 1
    fi
    
    # Validate JSON syntax
    if command -v python3 >/dev/null 2>&1; then
        if python3 -m json.tool disk-analysis-data.json > /dev/null 2>&1; then
            echo "✅ PASS: JSON syntax is valid"
        else
            echo "❌ FAIL: JSON syntax is invalid"
            return 1
        fi
    elif command -v jq >/dev/null 2>&1; then
        if jq . disk-analysis-data.json > /dev/null 2>&1; then
            echo "✅ PASS: JSON syntax is valid"
        else
            echo "❌ FAIL: JSON syntax is invalid"
            return 1
        fi
    else
        echo "⚠️  WARNING: No JSON validator available"
    fi
    
    # Validate required fields
    local required_fields=(
        "analysis_metadata"
        "analysis_metadata.timestamp"
        "analysis_metadata.script_version"
        "analysis_metadata.max_depth"
        "analysis_metadata.target_directories"
        "directory_analysis"
    )
    
    for field in "${required_fields[@]}"; do
        if python3 -c "
import json, sys
with open('disk-analysis-data.json') as f:
    data = json.load(f)
try:
    eval('data[\"$field\"]')
    print('PASS')
except:
    print('FAIL')
" | grep -q "PASS"; then
            echo "✅ PASS: Required field exists: $field"
        else
            echo "❌ FAIL: Missing required field: $field"
        fi
    done
}
```

## Platform Compatibility Tests

### Test 6: Windows Git Bash Compatibility

#### Test Environment
```bash
# Windows 10/11 with Git Bash
# Test script: test-windows-compatibility.sh

test_windows_compatibility() {
    echo "Testing Windows Git Bash compatibility..."
    
    # Check Windows-specific paths
    local windows_paths=(
        "/c"
        "/c/Users"
        "/c/Program Files"
    )
    
    for path in "${windows_paths[@]}"; do
        if [[ -d "$path" ]]; then
            echo "✅ PASS: Windows path accessible: $path"
        else
            echo "❌ FAIL: Windows path not accessible: $path"
        fi
    done
    
    # Test Windows path handling
    local test_path="C:\\Users\\TestUser"
    local normalized=$(echo "$test_path" | sed 's|\\|/|g' | sed 's|^[A-Z]:|/c|')
    local expected="/c/Users/TestUser"
    
    if [[ "$normalized" == "$expected" ]]; then
        echo "✅ PASS: Windows path normalization works"
    else
        echo "❌ FAIL: Windows path normalization failed: $normalized != $expected"
    fi
    
    # Test admin privilege check
    if command -v net.exe >/dev/null 2>&1; then
        echo "✅ PASS: net.exe command available for admin check"
    else
        echo "❌ FAIL: net.exe command not available"
    fi
}
```

### Test 7: Linux/macOS Compatibility

#### Test Script
```bash
test_unix_compatibility() {
    echo "Testing Linux/macOS compatibility..."
    
    # Test stat command variants
    local test_file="/tmp/stat_test"
    touch "$test_file"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS stat
        if stat -f %m "$test_file" >/dev/null 2>&1; then
            echo "✅ PASS: macOS stat command works"
        else
            echo "❌ FAIL: macOS stat command failed"
        fi
    else
        # Linux stat
        if stat -c %Y "$test_file" >/dev/null 2>&1; then
            echo "✅ PASS: Linux stat command works"
        else
            echo "❌ FAIL: Linux stat command failed"
        fi
    fi
    
    rm -f "$test_file"
    
    # Test du command
    if du -k /tmp >/dev/null 2>&1; then
        echo "✅ PASS: du command works"
    else
        echo "❌ FAIL: du command failed"
    fi
}
```

## Performance Tests

### Test 8: Large Directory Performance

#### Test Script
```bash
test_large_directory_performance() {
    echo "Testing large directory performance..."
    
    local large_test_dir="/tmp/large_performance_test"
    mkdir -p "$large_test_dir"
    
    # Create many directories and files
    echo "Creating large test structure..."
    for i in {1..100}; do
        mkdir -p "$large_test_dir/dir_$i"
        for j in {1..10}; do
            touch "$large_test_dir/dir_$i/file_$j.txt"
        done
    done
    
    # Measure execution time
    local start_time=$(date +%s)
    bash enhanced-disk-analyser.sh 20 "$large_test_dir" > /dev/null 2>&1
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo "Performance test completed in ${duration}s"
    
    if [[ $duration -lt 30 ]]; then
        echo "✅ PASS: Performance acceptable (${duration}s < 30s)"
    else
        echo "⚠️  WARNING: Performance slow (${duration}s >= 30s)"
    fi
    
    # Cleanup
    rm -rf "$large_test_dir"
}
```

### Test 9: Memory Usage Test

#### Test Script
```bash
test_memory_usage() {
    echo "Testing memory usage..."
    
    # Monitor memory during execution
    local test_dir="/tmp/memory_test"
    create_test_structure "$test_dir"
    
    # Run script and monitor memory
    if command -v ps >/dev/null 2>&1; then
        bash enhanced-disk-analyser.sh 10 "$test_dir" &
        local pid=$!
        
        local max_memory=0
        while kill -0 $pid 2>/dev/null; do
            local memory=$(ps -o rss= -p $pid 2>/dev/null | tr -d ' ')
            if [[ -n "$memory" && $memory -gt $max_memory ]]; then
                max_memory=$memory
            fi
            sleep 0.1
        done
        
        wait $pid
        
        echo "Maximum memory usage: ${max_memory}KB"
        
        if [[ $max_memory -lt 51200 ]]; then  # 50MB
            echo "✅ PASS: Memory usage acceptable (${max_memory}KB < 50MB)"
        else
            echo "⚠️  WARNING: High memory usage (${max_memory}KB >= 50MB)"
        fi
    else
        echo "⚠️  WARNING: Cannot monitor memory usage (ps not available)"
    fi
    
    # Cleanup
    rm -rf "$test_dir"
}
```

## Web Interface Compatibility Tests

### Test 10: JSON-Web Interface Compatibility

#### Test Script
```bash
test_web_interface_compatibility() {
    echo "Testing web interface compatibility..."
    
    # Generate test JSON
    bash enhanced-disk-analyser.sh 5 /tmp > /dev/null 2>&1
    
    if [[ ! -f "disk-analysis-data.json" ]]; then
        echo "❌ FAIL: No JSON file to test"
        return 1
    fi
    
    # Check required fields for web interface
    local web_required_fields=(
        "name"
        "path"
        "size_kb"
        "size_formatted"
        "file_count"
        "modification_date"
        "percentage"
        "depth"
        "parent_path"
    )
    
    local json_content=$(cat disk-analysis-data.json)
    
    for field in "${web_required_fields[@]}"; do
        if echo "$json_content" | grep -q "\"$field\""; then
            echo "✅ PASS: Web-required field present: $field"
        else
            echo "❌ FAIL: Web-required field missing: $field"
        fi
    done
    
    # Test data types
    if python3 -c "
import json
with open('disk-analysis-data.json') as f:
    data = json.load(f)
for item in data.get('directory_analysis', []):
    assert isinstance(item.get('size_kb', 0), int), 'size_kb must be integer'
    assert isinstance(item.get('file_count', 0), int), 'file_count must be integer'
    assert isinstance(item.get('percentage', 0.0), (int, float)), 'percentage must be numeric'
    assert isinstance(item.get('depth', 0), int), 'depth must be integer'
print('All data types correct')
" 2>/dev/null; then
        echo "✅ PASS: All data types are correct"
    else
        echo "❌ FAIL: Data type validation failed"
    fi
}
```

## User Experience Tests

### Test 11: End-to-End Workflow

#### Test Scenario
```bash
test_end_to_end_workflow() {
    echo "Testing complete end-to-end workflow..."
    
    local test_steps=(
        "Create test environment"
        "Run disk analyzer script"
        "Validate terminal output"
        "Check JSON generation"
        "Validate JSON format"
        "Simulate web interface load"
        "Cleanup test data"
    )
    
    local passed_steps=0
    local total_steps=${#test_steps[@]}
    
    # Step 1: Create test environment
    echo "Step 1: Creating test environment..."
    create_test_structure "/tmp/e2e_test"
    if [[ $? -eq 0 ]]; then
        ((passed_steps++))
        echo "✅ PASS: Test environment created"
    else
        echo "❌ FAIL: Test environment creation failed"
    fi
    
    # Step 2: Run disk analyzer script
    echo "Step 2: Running disk analyzer script..."
    bash enhanced-disk-analyser.sh 5 "/tmp/e2e_test" > /tmp/script_output.log 2>&1
    if [[ $? -eq 0 ]]; then
        ((passed_steps++))
        echo "✅ PASS: Script executed successfully"
    else
        echo "❌ FAIL: Script execution failed"
    fi
    
    # Step 3: Validate terminal output
    echo "Step 3: Validating terminal output..."
    if grep -q "Enhanced analysis complete" /tmp/script_output.log; then
        ((passed_steps++))
        echo "✅ PASS: Terminal output contains completion message"
    else
        echo "❌ FAIL: Terminal output incomplete"
    fi
    
    # Step 4: Check JSON generation
    echo "Step 4: Checking JSON generation..."
    if [[ -f "disk-analysis-data.json" ]]; then
        ((passed_steps++))
        echo "✅ PASS: JSON file generated"
    else
        echo "❌ FAIL: JSON file not generated"
    fi
    
    # Step 5: Validate JSON format
    echo "Step 5: Validating JSON format..."
    if command -v python3 >/dev/null 2>&1 && python3 -m json.tool disk-analysis-data.json > /dev/null 2>&1; then
        ((passed_steps++))
        echo "✅ PASS: JSON format is valid"
    else
        echo "❌ FAIL: JSON format is invalid"
    fi
    
    # Step 6: Simulate web interface compatibility
    echo "Step 6: Simulating web interface load..."
    if python3 -c "
import json
with open('disk-analysis-data.json') as f:
    data = json.load(f)
assert 'analysis_metadata' in data
assert 'directory_analysis' in data
assert len(data['directory_analysis']) > 0
print('Web interface compatibility confirmed')
" 2>/dev/null; then
        ((passed_steps++))
        echo "✅ PASS: Web interface compatibility confirmed"
    else
        echo "❌ FAIL: Web interface compatibility failed"
    fi
    
    # Step 7: Cleanup
    echo "Step 7: Cleaning up test data..."
    rm -rf /tmp/e2e_test /tmp/script_output.log disk-analysis-data.json disk-analyser.log
    if [[ $? -eq 0 ]]; then
        ((passed_steps++))
        echo "✅ PASS: Cleanup completed"
    else
        echo "❌ FAIL: Cleanup failed"
    fi
    
    # Summary
    echo ""
    echo "End-to-End Test Summary:"
    echo "Passed: $passed_steps/$total_steps steps"
    
    local success_rate=$((passed_steps * 100 / total_steps))
    if [[ $success_rate -ge 85 ]]; then
        echo "✅ OVERALL PASS: ${success_rate}% success rate"
    else
        echo "❌ OVERALL FAIL: ${success_rate}% success rate"
    fi
}
```

## Automated Test Runner

### Master Test Script

```bash
#!/bin/bash
# run-all-tests.sh - Comprehensive test suite runner

run_all_tests() {
    echo "=================================================="
    echo "Enhanced Disk Analyzer - Comprehensive Test Suite"
    echo "=================================================="
    echo ""
    
    local test_functions=(
        "test_format_size"
        "test_percentage_calculation"
        "test_file_count"
        "test_script_execution"
        "test_json_format"
        "test_windows_compatibility"
        "test_unix_compatibility"
        "test_large_directory_performance"
        "test_memory_usage"
        "test_web_interface_compatibility"
        "test_end_to_end_workflow"
    )
    
    local total_tests=${#test_functions[@]}
    local passed_tests=0
    local failed_tests=0
    
    echo "Running $total_tests test suites..."
    echo ""
    
    for test_func in "${test_functions[@]}"; do
        echo "Running $test_func..."
        echo "----------------------------------------"
        
        if $test_func; then
            ((passed_tests++))
            echo "✅ $test_func: PASSED"
        else
            ((failed_tests++))
            echo "❌ $test_func: FAILED"
        fi
        
        echo ""
    done
    
    echo "=================================================="
    echo "Test Suite Summary"
    echo "=================================================="
    echo "Total tests: $total_tests"
    echo "Passed: $passed_tests"
    echo "Failed: $failed_tests"
    echo "Success rate: $((passed_tests * 100 / total_tests))%"
    echo ""
    
    if [[ $failed_tests -eq 0 ]]; then
        echo "🎉 ALL TESTS PASSED!"
        return 0
    else
        echo "⚠️  SOME TESTS FAILED - Review output above"
        return 1
    fi
}

# Source the enhanced script functions for testing
source enhanced-disk-analyser.sh 2>/dev/null || echo "Note: Script functions not sourced"

# Run all tests
run_all_tests
```

## Validation Criteria

### Acceptance Criteria

#### Script Functionality
- ✅ Script executes without errors on target platforms
- ✅ Generates valid JSON output with all required fields
- ✅ Terminal output matches expected format
- ✅ Log file contains comprehensive execution details
- ✅ Performance acceptable for typical use cases

#### Data Quality
- ✅ Size calculations are accurate
- ✅ File count calculations are correct
- ✅ Percentage calculations sum appropriately
- ✅ Date formatting is consistent
- ✅ Directory paths are properly handled

#### Integration
- ✅ JSON format compatible with web interface
- ✅ All required fields present in output
- ✅ Data types match interface expectations
- ✅ No breaking changes in data structure

#### Platform Support
- ✅ Windows Git Bash compatibility
- ✅ Linux compatibility for testing
- ✅ macOS compatibility for development
- ✅ Cross-platform path handling

### Performance Benchmarks

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| **Execution Time** (1000 dirs) | < 10s | < 30s | > 60s |
| **Memory Usage** | < 25MB | < 50MB | > 100MB |
| **JSON Generation** | < 2s | < 5s | > 10s |
| **Error Rate** | 0% | < 5% | > 10% |

### Quality Gates

Before deployment, ensure:
1. **All unit tests pass** (100% success rate)
2. **Integration tests pass** (100% success rate)
3. **Platform tests pass** (≥ 80% success rate)
4. **Performance tests acceptable** (within benchmarks)
5. **End-to-end workflow successful** (≥ 85% success rate)

---

*This testing and validation guide ensures the Enhanced Disk Analyzer solution meets quality standards and provides reliable functionality across all supported platforms.*
