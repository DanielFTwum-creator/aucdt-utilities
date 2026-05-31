const cypress = require('cypress');
const fs = require('fs');
const path = require('path');

const projectPath = path.resolve(__dirname, '../dictation-app');
const outputPath = path.resolve(__dirname, '../test-dashboard/data');

console.log('Starting Cypress E2E run programmatically...');
console.log(`Project path: ${projectPath}`);
console.log(`Output path: ${outputPath}`);

// Ensure output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

cypress.run({
  project: projectPath,
}).then((results) => {
  if (results.failures) {
    console.error('Cypress run failed to start:', results.message);
    process.exit(1);
  }

  console.log('Cypress run completed successfully! Processing results...');

  // Format suite metadata
  const suiteMetadata = {
    id: `TUC-DICTATION-E2E-${new Date().toISOString().slice(0, 10)}`,
    version: '1.0.0-LIVE',
    updated: new Date().toISOString().slice(0, 10),
    target: results.config.baseUrl || 'http://localhost:5174/dictation/',
    framework: 'React 19 + Vite'
  };

  // Format test results
  const testResults = [];
  let testCounter = 1;

  results.runs.forEach((run) => {
    const specName = path.basename(run.spec.relative);
    
    run.tests.forEach((test) => {
      // Map Cypress test states to dashboard statuses
      let status = 'pending';
      if (test.state === 'passed') status = 'pass';
      else if (test.state === 'failed') status = 'fail';
      else if (test.state === 'skipped') status = 'skip';

      // Top level describe suite name, or fallback to spec file name
      const suiteName = test.title.length > 1 ? test.title[0] : specName;
      const testName = test.title[test.title.length - 1];

      const formattedTest = {
        id: `${specName.replace('.cy.ts', '')}-${testCounter++}`,
        name: testName,
        suite: suiteName,
        status: status,
        duration: test.duration || 0,
        timestamp: run.stats.startedAt || new Date().toISOString()
      };

      if (test.displayError) {
        formattedTest.error = test.displayError;
      }

      testResults.push(formattedTest);
    });
  });

  // Write files
  fs.writeFileSync(
    path.join(outputPath, 'suite-metadata.json'),
    JSON.stringify(suiteMetadata, null, 2)
  );
  fs.writeFileSync(
    path.join(outputPath, 'test-results.json'),
    JSON.stringify(testResults, null, 2)
  );

  console.log(`Saved suite-metadata.json (${JSON.stringify(suiteMetadata)})`);
  console.log(`Saved test-results.json containing ${testResults.length} test cases.`);
}).catch((err) => {
  console.error('An error occurred during programmatic Cypress execution:', err);
  process.exit(1);
});
