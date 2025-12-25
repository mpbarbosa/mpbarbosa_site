# Test Execution Guide

**Comprehensive guide to running and debugging tests**

---

## Test Execution Commands

### Standard Execution

```bash
# Run all tests (filters localStorage warnings)
npm test

# Run with full output (no filtering)
node --experimental-vm-modules node_modules/jest/bin/jest.js

# Run specific test suite
npm test -- main.test.js

# Run tests matching pattern
npm test -- --testNamePattern="smooth scrolling"
```

### Watch Mode

```bash
# Start watch mode
npm run test:watch

# In watch mode, press:
# - a: Run all tests
# - f: Run only failed tests
# - p: Filter by filename pattern
# - t: Filter by test name pattern
# - q: Quit watch mode
```

### Coverage Analysis

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open src/coverage/lcov-report/index.html

# View in terminal
cat src/coverage/clover.xml
```

---

## Test Suite Overview

### 1. main.test.js (~40 tests)

**Purpose:** Main page functionality

**Coverage:**

- Smooth scrolling setup
- Navigation link handling
- Background parallax effects
- Responsive design utilities
- Article overlay system

**Run individually:**

```bash
npm test -- main.test.js
```

### 2. project_navigation.test.js (~30 tests)

**Purpose:** Project link navigation

**Coverage:**

- Music in Numbers redirect
- Guia Turístico redirect
- Monitora Vagas redirect
- External link handling
- 404 error handling

**Run individually:**

```bash
npm test -- project_navigation.test.js
```

### 3. InitializationUtilities.test.js (~35 tests)

**Purpose:** Bootstrap and initialization logic

**Coverage:**

- DOM content loaded events
- Script loading order
- Utility functions
- Error handling
- Configuration loading

**Run individually:**

```bash
npm test -- InitializationUtilities.test.js
```

### 4. shell_scripts.test.js (~85 tests, 13 failing)

**Purpose:** Shell script validation

**Coverage:**

- `sync_to_public.sh` structure
- Deployment script validation
- Configuration management
- Error handling
- Documentation completeness

**Known Issues:**

- 13 tests failing due to v2.0.0 refactoring
- Tests expect old structure
- Fix priority: Medium

**Run individually:**

```bash
npm test -- shell_scripts.test.js
```

### 5. sync_to_public.test.js (~40 tests)

**Purpose:** Deployment script functionality

**Coverage:**

- Two-step deployment architecture
- File synchronization
- Backup creation
- Permission management
- Production validation

**Run individually:**

```bash
npm test -- sync_to_public.test.js
```

### 6. documentation.test.js (~17 tests)

**Purpose:** Documentation consistency

**Coverage:**

- Cross-reference validation
- Version consistency
- Link integrity
- Markdown formatting
- File structure

**Run individually:**

```bash
npm test -- documentation.test.js
```

---

## Debugging Test Failures

### Level 1: Identify Failing Test

```bash
# Run with verbose output
npm test -- --verbose

# Look for ✕ markers and error messages
```

### Level 2: Isolate Test

```bash
# Run only the failing test file
npm test -- shell_scripts.test.js

# Run specific test by name
npm test -- --testNamePattern="should contain expected content"
```

### Level 3: Inspect Test Code

```bash
# View test implementation
cat src/__tests__/shell_scripts.test.js | grep -A 20 "should contain"
```

### Level 4: Check Actual vs Expected

Test output shows:

```
Expected: "Main JavaScript modules:"
Received: "Different content"
```

**Action:** Compare test expectations with actual implementation

### Level 5: Fix Test or Code

**Option A:** Update test to match new implementation

```javascript
// Old test
expect(content).toContain('Main JavaScript modules:');

// Updated test
expect(content).toContain('# JavaScript Modules');
```

**Option B:** Fix code to match test expectations

---

## Test Environment Configuration

### Custom jsdom Environment

**File:** `src/jest-environment-jsdom-no-warnings.cjs`

**Purpose:** Suppress localStorage warnings

**Configuration:**

```javascript
// Automatically filters console warnings
// Maintains full jsdom functionality
// No additional setup required
```

### Test Setup (jest.setup.js)

**Polyfills provided:**

- `Response` class for fetch simulation
- `Headers` API
- `AbortController` for timeout testing
- `localStorage` mock

**Global flags:**

- `global.IS_TEST_ENV = true`
- `global.IS_JSDOM = true`

---

## Performance Considerations

### Test Execution Time

- **Target:** < 2 seconds for full suite
- **Current:** ~1.8 seconds ✅
- **Monitor:** Time increases indicate issues

### Optimization Strategies

1. **Parallel Execution:** Jest runs tests in parallel by default
2. **Watch Mode:** Only re-runs affected tests
3. **Coverage Caching:** Incremental coverage updates
4. **Mock Optimization:** Reuse mocks across tests

---

## CI/CD Integration (Future)

### Recommended Workflow

```yaml
# .github/workflows/test.yml (not yet implemented)
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '25.2.1'
      - run: cd src && npm install
      - run: cd src && npm test
      - run: cd src && npm run test:coverage
```

---

## Troubleshooting Common Errors

### Error: Cannot find module

**Cause:** Import path incorrect or module not installed

**Fix:**

```bash
# Check import paths in test
# Verify module exists in node_modules
npm install
```

### Error: Test timeout

**Cause:** Async operation not completing

**Fix:**

```javascript
// Increase timeout
test('async test', async () => {
  // Test code
}, 10000); // 10 second timeout
```

### Error: Worker process failed

**Cause:** Open handles (timers, listeners)

**Fix:**

```bash
# Detect open handles
npm test -- --detectOpenHandles

# Add cleanup in afterEach
afterEach(() => {
  jest.clearAllTimers();
});
```

---

## Next Steps

- Fix shell_scripts.test.js failures (13 tests)
- Update test expectations for v2.0.0 changes
- Add coverage for Monitora Vagas modules
- Expand Music in Numbers test suite

---

**Last Updated:** December 25, 2025  
**Status:** Active
