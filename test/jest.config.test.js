import jestConfig from './jest.config.js';

describe('jest.config.js', () => {
  it('should export an object', () => {
    expect(typeof jestConfig).toBe('object');
    expect(jestConfig).not.toBeNull();
  });

  describe('Test Environment Configuration', () => {
    it('should set the correct testEnvironment', () => {
      expect(jestConfig.testEnvironment).toBe('<rootDir>/jest-environment-jsdom-no-warnings.cjs');
    });

    it('should set testEnvironmentOptions with expected properties', () => {
      expect(jestConfig.testEnvironmentOptions).toMatchObject({
        url: 'http://localhost',
        storageQuota: 10000000,
        resources: 'usable',
      });
    });

    it('should include setupFilesAfterEnv', () => {
      expect(Array.isArray(jestConfig.setupFilesAfterEnv)).toBe(true);
      expect(jestConfig.setupFilesAfterEnv).toContain('<rootDir>/jest.setup.js');
    });
  });

  describe('Performance Optimization', () => {
    it('should set maxWorkers to 50%', () => {
      expect(jestConfig.maxWorkers).toBe('50%');
    });

    it('should enable cache and set cacheDirectory', () => {
      expect(jestConfig.cache).toBe(true);
      expect(jestConfig.cacheDirectory).toBe('<rootDir>/.jest-cache');
    });

    it('should set bail based on CI environment', () => {
      const originalCI = process.env.CI;
      process.env.CI = 'true';
      // Re-import to re-evaluate bail
      jest.resetModules();
      const configWithCI = (await import('./jest.config.js')).default;
      expect(configWithCI.bail).toBe(1);
      process.env.CI = '';
      const configWithoutCI = (await import('./jest.config.js')).default;
      expect(configWithoutCI.bail).toBe(0);
      process.env.CI = originalCI;
    });
  });

  describe('Test Discovery and Execution', () => {
    it('should have an empty transform object', () => {
      expect(jestConfig.transform).toEqual({});
    });

    it('should define testMatch patterns', () => {
      expect(Array.isArray(jestConfig.testMatch)).toBe(true);
      expect(jestConfig.testMatch.length).toBeGreaterThan(0);
    });

    it('should define testPathIgnorePatterns', () => {
      expect(Array.isArray(jestConfig.testPathIgnorePatterns)).toBe(true);
      expect(jestConfig.testPathIgnorePatterns.length).toBeGreaterThan(0);
    });
  });

  describe('Projects Configuration', () => {
    it('should define multiple projects with displayName and testMatch', () => {
      expect(Array.isArray(jestConfig.projects)).toBe(true);
      expect(jestConfig.projects.length).toBeGreaterThan(0);
      jestConfig.projects.forEach(project => {
        expect(typeof project.displayName).toBe('string');
        expect(Array.isArray(project.testMatch)).toBe(true);
        expect(typeof project.testEnvironment).toBe('string');
      });
    });
  });

  describe('Coverage Configuration', () => {
    it('should have collectCoverage set to false', () => {
      expect(jestConfig.collectCoverage).toBe(false);
    });

    it('should define collectCoverageFrom as an array', () => {
      expect(Array.isArray(jestConfig.collectCoverageFrom)).toBe(true);
    });

    it('should define coveragePathIgnorePatterns as an array', () => {
      expect(Array.isArray(jestConfig.coveragePathIgnorePatterns)).toBe(true);
    });

    it('should define coverageReporters as an array', () => {
      expect(Array.isArray(jestConfig.coverageReporters)).toBe(true);
    });

    it('should define global coverageThresholds with numeric values', () => {
      expect(jestConfig.coverageThreshold).toHaveProperty('global');
      const { global } = jestConfig.coverageThreshold;
      ['branches', 'functions', 'lines', 'statements'].forEach(key => {
        expect(typeof global[key]).toBe('number');
      });
    });
  });

  describe('Additional Options', () => {
    it('should clear and restore mocks between tests', () => {
      expect(jestConfig.clearMocks).toBe(true);
      expect(jestConfig.restoreMocks).toBe(true);
    });

    it('should set verbose based on CI environment', () => {
      const originalCI = process.env.CI;
      process.env.CI = 'true';
      jest.resetModules();
      const configWithCI = (await import('./jest.config.js')).default;
      expect(configWithCI.verbose).toBe(true);
      process.env.CI = '';
      const configWithoutCI = (await import('./jest.config.js')).default;
      expect(configWithoutCI.verbose).toBe(false);
      process.env.CI = originalCI;
    });

    it('should set testTimeout to 10000', () => {
      expect(jestConfig.testTimeout).toBe(10000);
    });

    it('should set errorOnDeprecated to true', () => {
      expect(jestConfig.errorOnDeprecated).toBe(true);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should not throw if optional properties are commented out', () => {
      expect(() => {
        // Access commented properties (should be undefined)
        expect(jestConfig.globalSetup).toBeUndefined();
        expect(jestConfig.globalTeardown).toBeUndefined();
        expect(jestConfig.reporters).toBeUndefined();
        expect(jestConfig.watchPlugins).toBeUndefined();
      }).not.toThrow();
    });

    it('should not include unexpected properties', () => {
      const allowedKeys = [
        'testEnvironment', 'testEnvironmentOptions', 'setupFilesAfterEnv', 'maxWorkers', 'cache',
        'cacheDirectory', 'bail', 'transform', 'testMatch', 'testPathIgnorePatterns', 'projects',
        'collectCoverage', 'collectCoverageFrom', 'coveragePathIgnorePatterns', 'coverageReporters',
        'coverageThreshold', 'clearMocks', 'restoreMocks', 'verbose', 'testTimeout', 'errorOnDeprecated'
      ];
      Object.keys(jestConfig).forEach(key => {
        expect(allowedKeys).toContain(key);
      });
    });
  });
});
