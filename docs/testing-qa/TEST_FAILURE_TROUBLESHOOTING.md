# Test Failure Troubleshooting

**Quick reference for fixing common test failures**

---

## Current Known Failures

### Shell Scripts Test Suite (13 failures)

**File:** `src/__tests__/shell_scripts.test.js`  
**Status:** 234/247 tests passing (94.7% pass rate)  
**Last Updated:** December 25, 2025

#### Failure Pattern

```
Expected: "Main JavaScript modules:"
Received: Different or missing content

Expected: "API Class Architectures:"
Received: Different or missing content
```

#### Root Cause Analysis

**Primary Issue:** Brittle test patterns using exact string matching instead of flexible regex patterns

**Contributing Factors:**
1. `sync_to_public.sh` v2.0.0 refactoring changed internal comment structure
2. Tests use `toContain()` with exact strings instead of `toMatch()` with regex
3. Script documentation evolved but test expectations didn't update
4. 12 of 13 failures are in sync_to_public.sh validation tests

**See:** TEST_PRACTICE_VIOLATIONS_ANALYSIS.md for comprehensive analysis

#### Fix Strategy

**Option 1: Update Tests with Flexible Patterns (Recommended)**

```javascript
// ❌ BEFORE: Brittle exact string match
expect(content).toContain('Main JavaScript modules:');
expect(content).toContain('API Class Architectures:');

// ✅ AFTER: Flexible regex pattern
expect(content).toMatch(/javascript\s+modules?/i);
expect(content).toMatch(/API|api/);
expect(content).toMatch(/architecture/i);
```

**Benefit:** Tests become resilient to minor wording changes while still validating core functionality.

**Option 2: Run Tests Excluding Shell Scripts (Temporary Workaround)**

```bash
# Skip failing shell script tests temporarily
npm test -- --testPathIgnorePatterns=shell_scripts.test.js

# Or run specific passing tests
npm test -- main.test.js
npm test -- project_navigation.test.js
```

**Option 3: Update sync_to_public.sh Documentation (Not Recommended)**

Reverting script comments is not recommended as v2.0.0 improvements should be preserved.

#### Priority

**High** - Tests need updates to match new implementation (4-6 hours estimated, see TEST_IMPROVEMENT_ROADMAP.md Phase 1.1)

**Impact:** 5.3% test failure rate affects test suite credibility

**ROI:** Fixing brittle assertions provides 300-400% return on investment (see WEAK_ASSERTION_PATTERNS_ANALYSIS.md)

---

## Common Test Error Patterns

### 1. Module Import Errors

#### Symptom

```
Cannot find module '../scripts/feature.js'
```

#### Causes

- Incorrect relative path
- File not exported
- Missing `.js` extension

#### Fixes

```javascript
// ✅ Correct
import { feature } from '../scripts/feature.js';

// ❌ Incorrect (missing .js)
import { feature } from '../scripts/feature';

// ✅ Ensure export
export function feature() { }
```

---

### 2. DOM Not Available

#### Symptom

```
TypeError: document.getElementById is not a function
```

#### Cause

jsdom environment not loaded

#### Fix

```javascript
// Ensure test uses jsdom
// Already configured in package.json
// Check jest.setup.js is loaded

describe('DOM tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test"></div>';
  });
});
```

---

### 3. Async Test Failures

#### Symptom

```
Timeout - Async callback was not invoked
```

#### Causes

- Missing `await` keyword
- Promise not returned
- Callback not called

#### Fixes

```javascript
// ✅ Correct - async/await
test('async test', async () => {
  await someAsyncFunction();
  expect(result).toBe(true);
});

// ✅ Correct - return promise
test('promise test', () => {
  return somePromise().then(result => {
    expect(result).toBe(true);
  });
});

// ❌ Incorrect - no await or return
test('broken test', () => {
  someAsyncFunction(); // Not awaited!
  expect(result).toBe(true); // Runs before async completes
});
```

---

### 4. Mock Not Working

#### Symptom

```
Expected mock function to be called, but it was not
```

#### Causes

- Mock created after code execution
- Mock not imported correctly
- Mock cleared prematurely

#### Fixes

```javascript
// ✅ Mock before import
jest.mock('../services/api.js');
import { fetchData } from '../services/api.js';

// ✅ Verify mock is used
test('uses mock', () => {
  fetchData();
  expect(fetchData).toHaveBeenCalled();
});

// ✅ Clean up after test
afterEach(() => {
  jest.clearAllMocks();
});
```

---

### 5. File System Errors (Shell Script Tests)

#### Symptom

```
ENOENT: no such file or directory
```

#### Causes

- File path incorrect in test
- File not created yet
- Working directory wrong

#### Fixes

```javascript
// ✅ Use absolute paths
const scriptPath = '/home/mpb/Documents/GitHub/mpbarbosa_site/shell_scripts/sync_to_public.sh';

// ✅ Check file exists
const fs = require('fs');
expect(fs.existsSync(scriptPath)).toBe(true);

// ✅ Mock fs for unit tests
jest.mock('fs');
```

---

### 6. Coverage Gaps

#### Symptom

```
Coverage threshold not met: 80% required, 75% actual
```

#### Causes

- Untested branches
- Error handling not tested
- Edge cases not covered

#### Fixes

```javascript
// Test both branches
test('handles success', () => {
  expect(func(true)).toBe('success');
});

test('handles failure', () => {
  expect(func(false)).toBe('error');
});

// Test error handling
test('handles exceptions', () => {
  expect(() => func(null)).toThrow();
});
```

---

### 7. Flaky Tests

#### Symptom

Tests pass sometimes, fail other times

#### Causes

- Timing issues
- Shared state between tests
- Random data

#### Fixes

```javascript
// ✅ Isolate test state
beforeEach(() => {
  // Fresh setup for each test
});

afterEach(() => {
  // Clean up completely
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// ✅ Use fake timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
```

---

### 8. Worker Process Warnings

#### Symptom

```
A worker process has failed to exit gracefully
```

#### Causes

- Open event listeners
- Active timers
- Unclosed connections

#### Fixes

```bash
# Detect open handles
npm test -- --detectOpenHandles

# Fix in test
afterEach(() => {
  jest.clearAllTimers();
  // Remove event listeners
  // Close connections
});
```

---

## Debugging Workflow

### Step 1: Identify Failing Test

```bash
npm test -- --verbose
```

Look for test name and error message.

### Step 2: Run Single Test

```bash
npm test -- --testNamePattern="specific test name"
```

### Step 3: Add Debug Output

```javascript
test('debug test', () => {
  console.log('Debug:', variable);
  expect(variable).toBe(expected);
});
```

### Step 4: Use Jest Debugger

```bash
node --inspect-brk node_modules/jest/bin/jest.js --runInBand
```

Open Chrome: `chrome://inspect`

### Step 5: Check Test Environment

```javascript
test('environment check', () => {
  console.log('IS_TEST_ENV:', global.IS_TEST_ENV);
  console.log('IS_JSDOM:', global.IS_JSDOM);
  console.log('Document:', typeof document);
});
```

---

## Test Quality Checklist

Before committing tests:

- [ ] All tests pass locally
- [ ] Tests are isolated (no shared state)
- [ ] Async operations use `await` or `return`
- [ ] Mocks are cleaned up
- [ ] Test names are descriptive
- [ ] Error cases are tested
- [ ] Coverage meets threshold

---

## Getting Help

### Check Documentation

1. [README.md](README.md) - Overview and status
2. [TEST_EXECUTION_GUIDE.md](TEST_EXECUTION_GUIDE.md) - Detailed execution
3. [TEST_ARCHITECTURE.md](TEST_ARCHITECTURE.md) - Test patterns

### Review Test Code

```bash
# View test implementation
cat src/__tests__/failing-test.test.js

# Check Jest configuration
cat src/package.json | grep -A 20 "jest"
```

### Run with Verbose Logging

```bash
npm test -- --verbose --no-coverage
```

---

## Future Improvements

1. **Fix shell_scripts.test.js** - Update test expectations for v2.0.0
2. **Add CI/CD** - Automate test execution on commits
3. **Expand Coverage** - Test Monitora Vagas and Music in Numbers modules
4. **Performance Tests** - Add load time and rendering benchmarks

---

**Last Updated:** December 25, 2025  
**Status:** Active
