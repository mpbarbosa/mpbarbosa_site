#!/usr/bin/env node

/**
 * Pa11y Accessibility Testing Script
 * Runs comprehensive accessibility audits using pa11y
 */

import pa11y from 'pa11y';

const BASE_URL = 'http://127.0.0.1:8080';

const testConfig = {
  standard: 'WCAG2AA',
  timeout: 30000,
  wait: 1000,
  chromeLaunchConfig: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};

async function runAccessibilityTests() {
  console.warn('🔍 Running Pa11y Accessibility Tests...\n');

  try {
    console.warn(`Testing: ${BASE_URL}`);
    const results = await pa11y(BASE_URL, testConfig);

    if (results.issues.length === 0) {
      console.warn('✅ No accessibility issues found!\n');
      return true;
    }

    console.warn(`⚠️  Found ${results.issues.length} accessibility issues:\n`);

    const groupedIssues = results.issues.reduce((acc, issue) => {
      if (!acc[issue.type]) {
        acc[issue.type] = [];
      }
      acc[issue.type].push(issue);
      return acc;
    }, {});

    Object.entries(groupedIssues).forEach(([type, issues]) => {
      console.warn(`\n${type.toUpperCase()} (${issues.length}):`);
      issues.forEach((issue, index) => {
        console.warn(`  ${index + 1}. ${issue.message}`);
        console.warn(`     Code: ${issue.code}`);
        console.warn(`     Element: ${issue.selector || 'N/A'}`);
        console.warn(`     Context: ${issue.context?.substring(0, 80) || 'N/A'}...`);
      });
    });

    return false;
  } catch (error) {
    console.error('❌ Error running accessibility tests:', error.message);
    console.error('\n💡 Make sure the development server is running:');
    console.error('   cd src && npm start\n');
    return false;
  }
}

// Run tests
runAccessibilityTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
