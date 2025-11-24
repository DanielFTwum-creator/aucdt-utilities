#!/usr/bin/env node
import { runE2ETests } from './tests/app.e2e';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🚀 Starting Puppeteer E2E Test Suite...\n');

  try {
    const results = await runE2ETests();

    console.log(`\n📊 Test Suite: ${results.name}`);
    console.log(`⏱️  Total Duration: ${results.totalDuration}ms`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}\n`);

    results.tests.forEach((test, index) => {
      const icon = test.status === 'passed' ? '✅' : '❌';
      console.log(`${icon} ${index + 1}. ${test.name} (${test.duration}ms)`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });

    // Save results to JSON file
    const resultsDir = path.join(process.cwd(), 'e2e', 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const resultsFile = path.join(resultsDir, `results-${Date.now()}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsFile}`);

    // Exit with error code if any tests failed
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

main();
