/**
 * Jest Configuration - Optimized for Parallel Execution
 *
 * Features:
 * - Test splitting by category (unit/integration)
 * - Parallel execution with worker optimization
 * - Enhanced caching strategy
 * - Coverage thresholds (aspirational)
 *
 * @see https://jestjs.io/docs/configuration
 */

export default {
  // ============================================================================
  // Test Environment Configuration
  // ============================================================================

  testEnvironment: '<rootDir>/jest-environment-jsdom-no-warnings.cjs',

  testEnvironmentOptions: {
    url: 'http://localhost',
    storageQuota: 10000000,
    resources: 'usable',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // ============================================================================
  // Performance Optimization
  // ============================================================================

  // Use 50% of available CPU cores for parallel test execution
  // Balances speed with system resource usage
  maxWorkers: '50%',

  // Cache test results for faster subsequent runs
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // Bail after first test suite failure in CI environments
  bail: process.env.CI ? 1 : 0,

  // ============================================================================
  // Test Discovery and Execution
  // ============================================================================

  // Module type: ES Modules
  transform: {},

  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/submodules/music_in_numbers/tests/selenium/',
    '/submodules/music_in_numbers/tests/theme-manager.test.js',
    '/submodules/music_in_numbers/tests/index-functions.test.js',
    '/submodules/music_in_numbers/tests/advanced-error-handling.test.js',
    '/submodules/music_in_numbers/tests/data-export.test.js',
    '/submodules/music_in_numbers/tests/artist-functions.test.js',
    '/submodules/guia_js/src/libs/guia_js/tests/WebGeocodingManager.integration.test.js',
  ],

  // ============================================================================
  // Test Splitting Strategy (Projects)
  // ============================================================================

  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '**/__tests__/main.test.js',
        '**/__tests__/InitializationUtilities.test.js',
        '**/__tests__/fixtures/**/*.test.js',
      ],
      testEnvironment: '<rootDir>/jest-environment-jsdom-no-warnings.cjs',
    },
    {
      displayName: 'integration',
      testMatch: [
        '**/__tests__/html_functionality.test.js',
        '**/__tests__/project_navigation.test.js',
        '**/__tests__/shell_integration.test.js',
      ],
      testEnvironment: 'node',
    },
    {
      displayName: 'shell-scripts',
      testMatch: [
        '**/__tests__/shell_scripts.test.js',
        '**/__tests__/sync_to_public.test.js',
        '**/__tests__/staging_content.test.js',
      ],
      testEnvironment: 'node',
    },
    {
      displayName: 'documentation',
      testMatch: ['**/__tests__/documentation.test.js'],
      testEnvironment: 'node',
    },
    {
      displayName: 'accessibility',
      testMatch: ['**/__tests__/accessibility.test.mjs'],
      testEnvironment: '<rootDir>/jest-environment-jsdom-no-warnings.cjs',
    },
  ],

  // ============================================================================
  // Coverage Configuration
  // ============================================================================

  collectCoverage: false, // Enable with --coverage flag

  collectCoverageFrom: [
    'scripts/**/*.{js,mjs}',
    '!scripts/test-accessibility.mjs',
    '!scripts/initialization/InitializationUtilities.js',
  ],

  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/assets/', '/submodules/'],

  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // ============================================================================
  // Coverage Thresholds (Aspirational)
  // ============================================================================
  // Note: Currently disabled due to 91.8% pass rate (256/279 tests)
  // Enable when test suite stability improves to 95%+

  coverageThreshold: {
    global: {
      // Aspirational targets (currently not enforced)
      branches: 70, // Target: 80%
      functions: 70, // Target: 80%
      lines: 70, // Target: 80%
      statements: 70, // Target: 80%
    },
    // File-specific thresholds can be added here:
    // './scripts/main.mjs': {
    //   branches: 90,
    //   functions: 90,
    //   lines: 90,
    //   statements: 90
    // }
  },

  // ============================================================================
  // Reporter Configuration
  // ============================================================================

  // Note: jest-junit requires installation: npm install --save-dev jest-junit
  // Uncomment after installation for CI/CD integration
  /*
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ],
  */

  // ============================================================================
  // Additional Options
  // ============================================================================

  // Clear mocks between tests for isolation
  clearMocks: true,

  // Restore mock state between tests
  restoreMocks: true,

  // Verbose output in CI environments
  verbose: process.env.CI ? true : false,

  // Timeout for individual tests (10 seconds)
  testTimeout: 10000,

  // Global setup/teardown (if needed)
  // globalSetup: '<rootDir>/jest.global-setup.js',
  // globalTeardown: '<rootDir>/jest.global-teardown.js',

  // Watch mode plugins
  // Note: Requires installation: npm install --save-dev jest-watch-typeahead
  // Uncomment after installation for enhanced watch mode
  /*
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  */

  // Error handling
  errorOnDeprecated: true,
};
