#!/usr/bin/env node
/**
 * Test script - runs deep verification on a small sample
 */

const { execSync } = require('child_process');

const TEST_APPS = [
  'academic-integrity-detector',  // Known blank page
  '6r-product-design-workshop-portal',  // Might be wrong content
  'ai-techbridge',  // Might be duplicate
  'kanban-app',  // Should be good
  'fees-comparison-dashboard'  // Should be good
];

console.log('Testing deep verification on sample apps...\n');
console.log('Test apps:', TEST_APPS.join(', '));

// For testing, we'll just check if builds exist and are unique
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const hashes = new Map();

TEST_APPS.forEach(app => {
  console.log(`\n--- ${app} ---`);

  const buildDirs = ['dist', 'build'];
  let found = false;

  for (const dir of buildDirs) {
    const indexPath = path.join(app, dir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      const hash = crypto.createHash('md5').update(content).digest('hex');
      const size = fs.statSync(indexPath).size;

      console.log(`  ✓ Found ${dir}/index.html (${size} bytes)`);
      console.log(`  Hash: ${hash.substring(0, 16)}...`);

      if (hashes.has(hash)) {
        console.log(`  ⚠️  DUPLICATE of ${hashes.get(hash)}`);
      } else {
        hashes.set(hash, app);
        console.log(`  ✓ Unique content`);
      }

      found = true;
      break;
    }
  }

  if (!found) {
    console.log(`  ❌ No build found`);
  }
});

console.log('\n\nSummary:');
console.log(`Unique builds: ${hashes.size}`);
console.log(`Duplicate builds: ${TEST_APPS.length - hashes.size}`);
