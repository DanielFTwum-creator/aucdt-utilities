#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const PROJECTS = [
  {
    name: 'tuc-ai-lab-catalog',
    url: 'https://ai-tools.techbridge.edu.gh/ai-lab/'
  },
  {
    name: 'techbridge-ai-application-portal',
    url: 'https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/'
  },
  {
    name: 'techbridge-ai-blueprint',
    url: 'https://ai-tools.techbridge.edu.gh/techbridge-ai-blueprint/'
  },
  {
    name: 'techbridge-ai-workshop-flyer',
    url: 'https://ai-tools.techbridge.edu.gh/techbridge-ai-workshop-flyer/'
  },
  {
    name: 'rophe-specialist-care-rpms',
    url: 'https://ai-tools.techbridge.edu.gh/rophe-specialist-care-rpms/'
  },
  {
    name: 'rophe-sugar-logger',
    url: 'https://ai-tools.techbridge.edu.gh/rophe-sugar-logger/'
  }
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    https.get(url, { timeout: 10000 }, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const hasLoginView = data.includes('Welcome Back') || data.includes('Continue with Google');
        const hasAppWithAuth = data.includes('AppWithAuth') || data.includes('LoginView');

        resolve({
          status: res.statusCode,
          responseTime,
          hasLoginView,
          success: res.statusCode < 400 && hasLoginView
        });
      });
    }).on('error', (err) => {
      resolve({
        status: 0,
        responseTime: 0,
        hasLoginView: false,
        success: false,
        error: err.message
      });
    });
  });
}

async function verifyDeployments() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 DEPLOYMENT VERIFICATION REPORT');
  console.log('='.repeat(70) + '\n');

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const project of PROJECTS) {
    process.stdout.write(`⏳ Checking ${project.name}... `);
    const result = await checkUrl(project.url);

    results.push({
      name: project.name,
      url: project.url,
      ...result
    });

    if (result.success) {
      console.log(`✅ PASS (${result.responseTime}ms)`);
      passed++;
    } else {
      console.log(`❌ FAIL`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY\n');

  results.forEach((r) => {
    const status = r.success ? '✅' : '❌';
    const details = r.error
      ? `Error: ${r.error}`
      : `Status: ${r.status}, Response: ${r.responseTime}ms, LoginView: ${r.hasLoginView ? 'Yes' : 'No'}`;

    console.log(`${status} ${r.name}`);
    console.log(`   ${r.url}`);
    console.log(`   ${details}\n`);
  });

  console.log('='.repeat(70));
  console.log(`📈 Results: ${passed} passed, ${failed} failed out of ${PROJECTS.length}`);
  console.log('='.repeat(70) + '\n');

  if (failed === 0) {
    console.log('🎉 All deployments verified successfully!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some deployments need attention.\n');
    process.exit(1);
  }
}

verifyDeployments();
