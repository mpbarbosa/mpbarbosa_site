/**
 * Test Fixtures - Environment Configuration
 *
 * Centralized test data for environment detection and configuration tests.
 *
 * @module test-fixtures/environment
 */

/**
 * Browser environment configurations for testing
 */
export const browserEnvironments = {
  localhost: { hostname: 'localhost', search: '' },
  localhostWithDebug: { hostname: 'localhost', search: '?debug=true' },
  localhostWithDev: { hostname: 'localhost', search: '?dev=1' },
  localhostWithDevelopment: { hostname: 'localhost', search: '?development=true' },
  ipv4Loopback: { hostname: '127.0.0.1', search: '' },
  ipv6Loopback: { hostname: '[::1]', search: '' },
  privateNetwork192: { hostname: '192.168.1.100', search: '' },
  privateNetwork10: { hostname: '10.0.0.1', search: '' },
  privateNetwork172: { hostname: '172.16.0.1', search: '' },
  testHostname: { hostname: 'test.example.com', search: '' },
  devHostname: { hostname: 'dev.example.com', search: '' },
  production: { hostname: 'example.com', search: '' },
};

/**
 * Navigator configurations
 */
export const navigatorConfigs = {
  test: { userAgent: 'Mozilla/5.0 (Test)', platform: 'Linux' },
};

/**
 * Private network IP test cases
 */
export const ipAddressTestCases = {
  valid: ['192.168.1.1', '10.0.0.1', '172.16.0.1'],
  invalid: ['8.8.8.8', '1.1.8.1'],
};
