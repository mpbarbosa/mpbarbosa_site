# Test Failure Analysis - Consolidated Report

**Project**: MP Barbosa Personal Website
**Test Framework**: Jest 30.2.0 with ES Modules (experimental-vm-modules)
**Node.js Version**: v25.2.1
**Latest Analysis**: 2025-12-18
**Consolidation Date**: 2025-12-18

> **Note**: This document consolidates five historical test failure analysis reports:

> - TEST_FAILURES_ACTIONABLE_FIXES.md (592 lines)
> - TEST_FAILURE_ANALYSIS_COMPREHENSIVE.md (919 lines)
> - TEST_FAILURE_ANALYSIS_REPORT.md (915 lines)
> - TEST_FAILURE_COMPREHENSIVE_ANALYSIS.md (1,652 lines)
> - TEST_FAILURE_ROOT_CAUSE_ANALYSIS.md (1,531 lines)

---

## Executive Summary

### Historical Test Health Overview

Multiple test execution analyses from November 2025 revealed systematic issues:

| Analysis Date | Total Tests | Pass Rate | Critical Finding |
|---------------|-------------|-----------|------------------|
| Nov 16 (Early) | 7 | 0% | 100% failure - infrastructure issues |
| Nov 16 (Late) | 1,617 | 94% | 37 failed suites, config issues |
| Nov 18 | 7+ | ~12% | Zero coverage, environment problems |
| Nov 25 | 7 | 0% | 136 files detected, only 7 executed |

**Key Insight**: The test suite suffered from **systematic configuration and environment issues** rather than widespread code defects. Despite high failure rates in some runs, actual test logic had ~94% pass rate when environment was properly configured.

### Critical Issues Identified

1. **Jest Configuration Incompatibility** - 45-50% of failures
   - Missing polyfills (TextEncoder, TextDecoder, Response)
   - ES Module vs CommonJS conflicts
   - jsdom environment limitations

2. **Empty/Incomplete Test Files** - 30% of failures
   - Test files with no actual tests
   - Placeholder implementations
   - Missing test logic

3. **Module Path Resolution** - 15% of failures
   - Incorrect relative import paths
   - Missing source files
   - Directory structure mismatches

4. **Selenium E2E Infrastructure** - Variable impact (2-54 failures)
   - Missing WebDriver dependencies
   - Spawn command errors
   - Headless environment configuration

5. **Zero Code Coverage** - Across all analyses
   - No source instrumentation
   - Coverage collection failures
   - Configuration gaps

---

## Root Cause Analysis by Category

### Category A: Environment & Configuration Issues (CRITICAL)

**Priority**: 🔴 **CRITICAL** - Blocks all test execution
**Impact**: 45-50% of all failures
**Estimated Fix Time**: 2-4 hours

#### A.1 TextEncoder/TextDecoder Missing in jsdom

**Affected Files** (5-8 test suites):

- `submodules/music_in_numbers/tests/performance-benchmarking.jest.test.js`
- `submodules/music_in_numbers/tests/index-functions.jest.test.js`
- `submodules/music_in_numbers/tests/advanced-error-handling.jest.test.js`
- `submodules/guia_turistico/src/libs/guia_js/__tests__/integration/HtmlSpeechSynthesisDisplayer.integration.test.js`

**Error Pattern**:

```javascript
ReferenceError: TextEncoder is not defined
ReferenceError: TextDecoder is not defined
ReferenceError: Response is not defined
```

**Root Cause**: Jest's jsdom environment doesn't include Web APIs like `TextEncoder`, `TextDecoder`, and `Response` by default. These are required for:

- OAuth code challenge generation (PKCE flow)
- Modern web APIs simulation
- Browser compatibility testing

**Solution 1: Add Polyfills to Jest Setup**

Create/update `src/jest.setup.js`:

```javascript
// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Response for fetch API testing
if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.ok = this.status >= 200 && this.status < 300;
    }

    async text() {
      return String(this.body);
    }

    async json() {
      return JSON.parse(this.body);
    }
  };
}

// Polyfill Headers
if (typeof Headers === 'undefined') {
  global.Headers = class Headers extends Map {
    get(name) {
      return super.get(name.toLowerCase());
    }
    set(name, value) {
      return super.set(name.toLowerCase(), value);
    }
  };
}
```

Update `package.json` jest configuration:

```json
{
  "jest": {
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "testEnvironment": "jsdom"
  }
}
```

**Solution 2: Use Node.js Environment**

For tests that don't need browser APIs:

```javascript
/**
 * @jest-environment node
 */
```

#### A.2 ES Module vs CommonJS Conflicts

**Affected Files**: 8+ test files

**Error Pattern**:

```text
Cannot use import statement outside a module
require() of ES Module not supported
```

**Root Cause**: Mixed module systems in test and source files

**Solution**:

Ensure consistent configuration in `package.json`:

```json
{
  "type": "module",
  "jest": {
    "transform": {},
    "extensionsToTreatAsEsm": [".js"],
    "testMatch": [
      "**/__tests__/**/*.test.js",
      "**/?(*.)+(spec|test).js"
    ]
  }
}
```

Run tests with:

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

---

### Category B: Selenium E2E Test Infrastructure (MEDIUM-HIGH)

**Priority**: 🟡 **MEDIUM** (54 failures when Selenium expected, 2-3 when not)
**Impact**: Variable - depends on CI/CD environment
**Estimated Fix Time**: 1-2 hours

#### B.1 Spawn Command Errors

**Affected Files**: 54 test files in `submodules/music_in_numbers/tests/selenium/e2e/`

**Error Pattern**:

```text
Error: spawn /bin/sh ENOENT
```

**Root Cause**: 

- Selenium WebDriver not installed
- Chrome/Firefox drivers missing
- Tests running in headless environment without proper setup

**Solution 1: Skip Selenium Tests in Non-E2E Environments**

Create `submodules/music_in_numbers/tests/selenium/setup.js`:

```javascript
const isSeleniumAvailable = () => {
    try {
        require.resolve('selenium-webdriver');
        require.resolve('chromedriver');
        return true;
    } catch (e) {
        return false;
    }
};

const isCIEnvironment = () => {
    return process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
};

// Skip Selenium tests if not available
if (!isSeleniumAvailable() && isCIEnvironment()) {
    beforeAll(() => {
        console.log('⚠️  Selenium not available - skipping E2E tests');
    });

    describe.skip('Selenium E2E Tests', () => {
        test('placeholder', () => {});
    });
}
```

**Solution 2: Configure Jest to Skip Selenium**

Update `jest.config.js`:

```javascript
export default {
  testPathIgnorePatterns: [
    '/node_modules/',
    process.env.SKIP_E2E === 'true' ? '/tests/selenium/' : ''
  ].filter(Boolean)
};
```

Run tests without Selenium:

```bash
SKIP_E2E=true npm test
```

**Solution 3: Install Selenium Dependencies (For E2E Testing)**

```bash
# Install Selenium WebDriver
npm install --save-dev selenium-webdriver chromedriver

# For headless CI environments
npm install --save-dev @types/selenium-webdriver xvfb
```

---

### Category C: Empty Test Suites (MEDIUM)

**Priority**: 🟡 **MEDIUM** - Inflates failure count
**Impact**: 7-8 test files
**Estimated Fix Time**: 30 minutes

#### C.1 Test Files with No Tests

**Affected Files**:
- `submodules/music_in_numbers/tests/responsive-testing.jest.test.js`
- `submodules/music_in_numbers/tests/ci-cd-integration.jest.test.js`
- `submodules/music_in_numbers/tests/performance-optimization.jest.test.js`
- `submodules/guia_turistico/src/libs/guia_js/__tests__/unit/QueueProcessor.test.js`
- `submodules/guia_turistico/src/libs/guia_js/__tests__/unit/ErrorHandler.test.js`
- (2-3 additional files)

**Error Pattern**:

```text
Your test suite must contain at least one test.
```

**Root Cause**: Test files created as placeholders but never implemented

**Solution 1: Remove Empty Files**

```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site/src

# Remove empty test files
rm submodules/music_in_numbers/tests/responsive-testing.jest.test.js
rm submodules/music_in_numbers/tests/ci-cd-integration.jest.test.js
rm submodules/music_in_numbers/tests/performance-optimization.jest.test.js
```

**Solution 2: Add Placeholder Tests**

For files to be implemented later:

```javascript
describe('QueueProcessor', () => {
  test.todo('should process queue items in order');
  test.todo('should handle empty queue');
  test.todo('should handle queue errors');
});
```

---

### Category D: Module Path Resolution (MEDIUM)

**Priority**: 🟡 **MEDIUM** - Prevents test execution
**Impact**: 12-15% of failures
**Estimated Fix Time**: 1-2 hours

#### D.1 Cannot Find Module Errors

**Affected Files**:
- `HtmlSpeechSynthesisDisplayer.test.js` - Cannot find `../guia.js`
- `SpeechSynthesisManager.test.js` - Cannot find `./SpeechQueue.js`
- `core-modules.test.js` - Cannot find `../src/core/GeoPosition.js`
- `AddressDataExtractor-module.test.js` - Module path issue

**Root Cause**:
- Incorrect relative import paths
- Missing source files or moved locations
- Directory structure mismatch

**Solution**:

1. **Verify actual file locations**:
```bash
# Find actual source file
find src -name "guia.js"
find src -name "SpeechQueue.js"
```

2. **Update import paths**:

Example for `HtmlSpeechSynthesisDisplayer.test.js`:

```javascript
// If test is at: __tests__/unit/HtmlSpeechSynthesisDisplayer.test.js
// And source is at: src/guia.js
// Correct path should be:
import { HtmlSpeechSynthesisDisplayer } from '../../src/guia.js';
// NOT: import { HtmlSpeechSynthesisDisplayer } from '../guia.js';
```

3. **Use Jest moduleNameMapper** (alternative):

In `jest.config.js`:

```javascript
export default {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@guia/(.*)$': '<rootDir>/src/libs/guia_js/src/$1'
  }
};
```

Then use in tests:

```javascript
import { HtmlSpeechSynthesisDisplayer } from '@guia/guia.js';
```

---

### Category E: Implementation vs Test Mismatch (HIGH)

**Priority**: 🟠 **HIGH** - Logic errors
**Impact**: 14-23 test cases
**Estimated Fix Time**: 3-5 hours

#### E.1 DisplayerFactory Constructor

**Affected File**: `submodules/guia_turistico/src/libs/guia_js/__tests__/unit/DisplayerFactory.test.js`

**Error**:
```javascript
Expected: Not to throw
Received: TypeError: Cannot read properties of undefined (reading 'get')
```

**Root Cause**: `DisplayerFactory` constructor expects a config object but test passes `undefined`

**Test Code**:
```javascript
test('should throw error if no configuration is provided', () => {
    expect(() => new DisplayerFactory()).toThrow();
});
```

**Actual Implementation**:
```javascript
constructor(config) {
    this.displayerTypes = config.displayerTypes; // Fails if config is undefined
}
```

**Fix**:

```javascript
// Update implementation to validate config
constructor(config) {
    if (!config || typeof config !== 'object') {
        throw new Error('DisplayerFactory requires a valid configuration object');
    }
    this.displayerTypes = config.displayerTypes;
}
```

#### E.2 SpeechQueue Validation

**Affected File**: `SpeechSynthesisManager.test.js`

**Error**: Multiple validation failures (3 tests)

**Root Cause**: Test expectations don't match actual implementation behavior

**Fix**: Align test expectations with implementation or update implementation to match requirements

---

### Category F: Shell Script Test Failures (LOW)

**Priority**: 🟢 **LOW** - Single failure
**Impact**: 1 test
**Estimated Fix Time**: 15-30 minutes

#### F.1 Symlink Creation Test

**Affected File**: `shell_scripts/__tests__/sync_to_public.test.sh`

**Error**:
```
ls: cannot access 'public/api': No such file or directory
```

**Root Cause**: Test expects `public/api` symlink but it wasn't created

**Fix**: Update test to verify symlink creation or fix script to create symlink

---

## Coverage Gap Analysis

### Current State

**All Analyses**: 0% coverage across all metrics
- Statements: 0%
- Branches: 0%
- Functions: 0%
- Lines: 0%

### Root Causes

1. **Test failures prevent coverage collection** - Jest aborts coverage on failures
2. **No source code instrumentation** - `collectCoverageFrom` may be misconfigured
3. **Coverage path issues** - Source files not included in coverage globs

### Expected Coverage After Fixes

**Target**: 80% minimum across all metrics

**Current Configuration** (`package.json`):
```json
{
  "jest": {
    "collectCoverageFrom": [
      "scripts/**/*.{js,mjs}",
      "submodules/guia_turistico/src/libs/guia_js/src/**/*.js",
      "submodules/music_in_numbers/src/**/*.js"
    ]
  }
}
```

**Recommendations**:

1. **Verify paths match actual structure**
2. **Exclude test files**:
```json
"collectCoverageFrom": [
  "scripts/**/*.{js,mjs}",
  "submodules/**/*.js",
  "!**/__tests__/**",
  "!**/tests/**",
  "!**/node_modules/**"
]
```

3. **Add coverage thresholds**:
```json
"coverageThreshold": {
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}
```

---

## Performance Analysis

### Test Execution Metrics

| Analysis | Execution Time | Tests Run | Speed |
|----------|----------------|-----------|-------|
| Nov 16 (Early) | 7.682s | 7 | 1.1 tests/sec |
| Nov 16 (Late) | 52.4s | 1,617 | 30.8 tests/sec |
| Nov 18 | N/A | 7+ | N/A |
| Nov 25 | N/A | 7 | N/A |

**Observations**:
- When tests run successfully, execution speed is good (30+ tests/sec)
- Configuration issues dramatically reduce test discovery (136 files → 7 tests)
- Total test suite potential: 1,600+ tests across 89-136 files

### Performance Bottlenecks

1. **Selenium Tests** - Spawn overhead in non-configured environments
2. **Module Resolution** - Import path resolution failures
3. **Coverage Collection** - Instrumentation overhead when working

---

## Actionable Fix Priority Matrix

### Phase 1: Critical Infrastructure (Week 1)

**Priority**: 🔴 **CRITICAL** - Must fix to unblock testing

1. ✅ **Add TextEncoder/TextDecoder polyfills** (2 hours)
   - Update `jest.setup.js`
   - Add Response/Headers polyfills
   - Validate with affected test files

2. ✅ **Fix ES Module configuration** (1 hour)
   - Verify `package.json` type: "module"
   - Update jest transform settings
   - Test with experimental-vm-modules

3. ✅ **Configure Selenium skip logic** (1 hour)
   - Add environment detection
   - Create setup.js for Selenium tests
   - Update CI/CD to skip E2E when needed

**Expected Outcome**: Test execution possible, 80-90% failure rate resolved

### Phase 2: High Priority Fixes (Week 1-2)

**Priority**: 🟠 **HIGH** - Significant impact on test count

1. ✅ **Fix module path resolution** (2 hours)
   - Audit all import paths
   - Create moduleNameMapper if needed
   - Validate with find commands

2. ✅ **Remove empty test files** (30 minutes)
   - Identify all empty suites
   - Delete or add test.todo placeholders
   - Update test count documentation

3. ✅ **Fix implementation mismatches** (3-5 hours)
   - DisplayerFactory constructor validation
   - SpeechQueue test alignment
   - Update 14-23 failing test cases

**Expected Outcome**: 95%+ pass rate, coverage collection starts

### Phase 3: Medium Priority Optimization (Week 2-3)

**Priority**: 🟡 **MEDIUM** - Quality improvements

1. ✅ **Enable code coverage** (2 hours)
   - Fix collectCoverageFrom paths
   - Add coverage thresholds
   - Generate coverage reports

2. ✅ **Install Selenium for E2E** (1 hour, optional)
   - Install selenium-webdriver
   - Install chromedriver
   - Configure headless mode

3. ✅ **Fix shell script test** (30 minutes)
   - Debug symlink creation
   - Update test expectations
   - Validate deployment script

**Expected Outcome**: 100% pass rate, 80%+ coverage, full CI/CD integration

### Phase 4: Documentation & CI/CD (Week 3-4)

**Priority**: 🟢 **LOW** - Long-term maintenance

1. ✅ **Document test environment setup** (1 hour)
2. ✅ **Add CI/CD test workflows** (2 hours)
3. ✅ **Create test writing guidelines** (1 hour)

---

## Test Execution Commands

### Current Commands

```bash
# Standard test run
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Specific file
npm test -- path/to/test.test.js

# Skip E2E tests
SKIP_E2E=true npm test

# Debug mode
node --inspect-brk --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand
```

### Recommended CI/CD Commands

```bash
# Fast feedback (skip Selenium)
SKIP_E2E=true npm test

# Full test suite (with Selenium installed)
npm run test:coverage

# PR validation (fast)
SKIP_E2E=true npm test -- --changedSince=main
```

---

## Summary Statistics

### Total Issues Identified

| Category | Count | Priority | Status |
|----------|-------|----------|--------|
| Environment/Config | 5-8 | 🔴 CRITICAL | Fixable |
| Selenium Infrastructure | 2-54 | 🟡 MEDIUM | Optional |
| Empty Test Suites | 7-8 | 🟡 MEDIUM | Fixable |
| Module Resolution | 12-15 | 🟡 MEDIUM | Fixable |
| Implementation Mismatch | 14-23 | 🟠 HIGH | Fixable |
| Shell Script | 1 | 🟢 LOW | Fixable |

**Total Failures**: 41-115 (depending on Selenium expectations)
**Fixable in Phase 1-2**: 35-60 failures (85-90% reduction)
**Estimated Total Fix Time**: 12-18 hours over 2-3 weeks

### Success Metrics

| Metric | Current | Phase 1 Target | Phase 2 Target | Final Target |
|--------|---------|----------------|----------------|--------------|
| Pass Rate | 0-94% | 80% | 95% | 100% |
| Coverage | 0% | 0% | 60% | 80%+ |
| Test Discovery | 7-1617 | 1500+ | 1600+ | All |
| Execution Time | Variable | <60s | <60s | <60s |

---

## Related Documentation

- **Test Environment Setup**: `docs/development-guides/TEST_ENVIRONMENT_FINAL_REPORT.md`
- **Selenium Setup**: `docs/development-guides/SELENIUM_E2E_SETUP_GUIDE.md`
- **Testing Guide**: `docs/testing-qa/COMPREHENSIVE_TESTING_GUIDE.md`
- **Test Execution Reports**: `docs/testing-qa/TEST_EXECUTION_*.md`
- **Test Strategy**: `docs/testing-qa/TEST_STRATEGY_*.md`

---

## Appendix: Common Error Patterns

### Error Pattern Reference

```javascript
// Pattern 1: TextEncoder Missing
ReferenceError: TextEncoder is not defined
→ Fix: Add polyfill in jest.setup.js

// Pattern 2: ES Module Import
Cannot use import statement outside a module
→ Fix: Add "type": "module" to package.json

// Pattern 3: Spawn Error
Error: spawn /bin/sh ENOENT
→ Fix: Skip Selenium or install dependencies

// Pattern 4: Empty Test Suite
Your test suite must contain at least one test
→ Fix: Remove file or add test.todo()

// Pattern 5: Module Not Found
Cannot find module '../guia.js'
→ Fix: Correct relative path or use moduleNameMapper

// Pattern 6: Constructor Error
Cannot read properties of undefined (reading 'get')
→ Fix: Add parameter validation in constructor
```

---

## Current Test Status (December 18, 2025)

### Latest Test Execution Results

**Test Run Metrics**:
- **Total Test Suites**: 18
  - ✅ Passing: 9 suites (50.0%)
  - ❌ Failing: 9 suites (50.0%)
- **Total Tests**: 483
  - ✅ Passing: 467 tests (96.7%)
  - ❌ Failing: 16 tests (3.3%)
- **Execution Time**: ~3.6 seconds
- **Node.js Version**: v25.2.1
- **Worker Status**: ⚠️ Force exited (teardown issues)

### Active Failures Breakdown

#### 1. jsdom Navigation Error (6 test suites, ~12 tests)
**Affected Files**:
- `__tests__/ArtistPageInitialization.test.js`
- `__tests__/InitializationUtilities.test.js`
- `submodules/music_in_numbers/tests/artist-initialization.jest.test.js`
- `submodules/music_in_numbers/tests/initialization.jest.test.js`
- `submodules/music_in_numbers/tests/real-time.jest.test.js`
- `submodules/music_in_numbers/src/scripts/spotify-api/__tests__/SpotifyApiUtilities.test.js`

**Error**: `Error: Not implemented: navigation (except hash changes)`

**Root Cause**: Direct assignment to `window.location` triggers navigation in jsdom

**Fix**:
```javascript
// Replace this:
global.window.location = { hostname: 'localhost', search: '' };

// With this:
delete global.window.location;
Object.defineProperty(global.window, 'location', {
    value: {
        hostname: 'localhost',
        search: '',
        href: 'http://localhost/',
        protocol: 'http:',
        host: 'localhost',
        pathname: '/'
    },
    writable: true,
    configurable: true
});
```

#### 2. Web Crypto API Missing (1 test suite, 2 tests)
**Affected File**: `submodules/music_in_numbers/tests/advanced-error-handling.jest.test.js`

**Failing Tests**:
- "should test PKCE generation reliability" (Line 647)
- "should detect Web Crypto API availability" (Line 667)

**Error**: `crypto.subtle` is undefined in jsdom

**Fix** (add to `jest.setup.js`):
```javascript
import crypto from 'crypto';

if (!global.crypto) {
    global.crypto = {};
}

if (!global.crypto.subtle) {
    global.crypto.subtle = {
        digest: async (algorithm, data) => {
            const hashAlgo = algorithm === 'SHA-256' ? 'sha256' : 'sha1';
            const hash = crypto.createHash(hashAlgo);
            hash.update(Buffer.from(data));
            return hash.digest().buffer;
        }
    };
}

if (!global.crypto.getRandomValues) {
    global.crypto.getRandomValues = (array) => {
        return crypto.randomFillSync(array);
    };
}
```

#### 3. Shell Script Test Logic Error (1 test suite, 1 test)
**Affected File**: `__tests__/shell_scripts.test.js`

**Failing Test**: "should call all copy functions in logical order" (Line 385)

**Error**: `expect(-1).toBeLessThan(-1)` - Function `validate_environment` not found

**Investigation Needed**: Check actual function names in `shell_scripts/sync_to_public.sh`

#### 4. Coverage Collection Failures (Non-blocking)
**Issue**: Node.js v25.x incompatibility with `test-exclude` package

**Error**: `TypeError [ERR_INVALID_ARG_TYPE]: The "original" argument must be of type function.`

**Affected Files** (7+ files):
- `submodules/music_in_numbers/src/scripts/artist-ui.js`
- `scripts/main.mjs`
- `submodules/music_in_numbers/src/scripts/artist-api.js`
- `scripts/main.js`
- `submodules/music_in_numbers/src/scripts/real-time.js`
- `submodules/music_in_numbers/src/scripts/data-export.js`
- Additional files affected

**Solutions**:
1. **Downgrade to Node.js v20 LTS** (recommended for stability)
2. Wait for Jest/test-exclude updates for v25 support
3. Add npm override for test-exclude if newer version available

#### 5. Worker Process Issues
**Warning**: `A worker process has failed to exit gracefully and has been force exited`

**Possible Causes**:
- Unclosed timers or intervals
- Pending promises
- Event listeners not removed

**Debug Command**: `npm test -- --detectOpenHandles`

### Immediate Action Items

**Week 1 Priorities** (December 18-22, 2025):
1. ✅ Fix 6 jsdom navigation test files → +33% suite pass rate
2. ✅ Add Web Crypto API polyfill → +2 passing tests  
3. ✅ Fix shell script test logic → +1 passing test

**Expected Result**: 94% suite pass rate (17/18 suites)

**Week 2-3 Focus**:
4. Resolve Node.js v25 coverage issues (consider downgrade to v20 LTS)
5. Fix worker process graceful exit issues
6. Target: 100% suite pass rate + coverage reporting restored

### Success Metrics

**Current State**:
- Test Pass Rate: 96.7% ✅
- Suite Pass Rate: 50.0% ⚠️
- Execution Time: 3.6s ✅
- Coverage Data: ❌ Unavailable

**Target Goals**:
- Test Pass Rate: 100%
- Suite Pass Rate: 100%
- Execution Time: < 5s ✅ Already achieved
- Coverage: > 80% (statements, branches, functions, lines)

---

**End of Consolidated Report**

*This document consolidates historical test failure analyses from November 2025 with current status as of December 18, 2025. The test suite has evolved significantly with improved ES module support and better infrastructure, but still faces jsdom limitations and Node.js v25 compatibility issues.*
