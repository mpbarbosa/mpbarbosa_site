# Test Quick Start Guide

**Get testing in 5 minutes**

---

## Prerequisites

```bash
# Verify Node.js version
node --version  # Should be v25.2.1 or compatible

# Navigate to source directory
cd /home/mpb/Documents/GitHub/mpbarbosa_site/src

# Install dependencies (if not already done)
npm install
```

---

## Run Tests

### Basic Commands

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- main.test.js
```

### Expected Output

```
Test Suites: 6 total, 4 failed, 2 passed
Tests:       247 total, 234 passed, 13 failed
Time:        1.795 s
```

---

## Understanding Test Results

### ✅ Passing Test

```
✓ should setup smooth scrolling (5 ms)
```

### ❌ Failing Test

```
✕ should contain expected content (10 ms)
  
  Expected: "Main JavaScript modules:"
  Received: different content
```

---

## Debug Failing Tests

### Step 1: Run with Verbose Output

```bash
npm test -- --verbose
```

### Step 2: Run Single Test File

```bash
npm test -- shell_scripts.test.js
```

### Step 3: Check Test File

```bash
# View the test
cat src/__tests__/shell_scripts.test.js
```

### Step 4: Fix and Re-run

```bash
# Make changes, then
npm test -- shell_scripts.test.js
```

---

## Test Structure

```javascript
// src/__tests__/example.test.js
describe('Feature Name', () => {
  test('should do something', () => {
    // Test code here
    expect(result).toBe(expected);
  });
});
```

---

## Common Issues

### Issue: Tests Not Found

**Fix:** Ensure you're in `/src` directory

```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site/src
npm test
```

### Issue: Module Import Errors

**Fix:** Already configured via `package.json` with `--experimental-vm-modules`

### Issue: Worker Process Warning

**Fix:** Normal for this project, tests still run correctly

---

## Next Steps

- Read [TEST_EXECUTION_GUIDE.md](TEST_EXECUTION_GUIDE.md) for detailed instructions
- Check [TEST_FAILURE_TROUBLESHOOTING.md](TEST_FAILURE_TROUBLESHOOTING.md) for specific issues
- Review [TEST_ARCHITECTURE.md](TEST_ARCHITECTURE.md) for test patterns

---

**Last Updated:** December 25, 2025  
**Status:** Active
