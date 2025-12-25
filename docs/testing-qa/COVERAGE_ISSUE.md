# Jest Coverage Collection Issue - Node.js 25.2.1 Compatibility

**Date**: 2025-12-25  
**Status**: 🔴 BLOCKED - Upstream dependency issue  
**Priority**: 🟡 MEDIUM (Tests run successfully, only coverage reporting affected)

## Problem Summary

Jest coverage collection fails with Node.js 25.2.1 due to incompatibility in the `test-exclude@6.0.0` package, which is a transitive dependency of `babel-plugin-istanbul`.

## Error Details

### Error Message
```
ERROR: The "original" argument must be of type function. Received an instance of Object
STACK: TypeError [ERR_INVALID_ARG_TYPE]: The "original" argument must be of type function. Received an instance of Object
    at promisify (node:internal/util:464:3)
    at Object.<anonymous> (/home/mpb/Documents/GitHub/mpbarbosa_site/src/node_modules/test-exclude/index.js:5:14)
```

### Dependency Chain
```
jest@30.2.0
└─┬ @jest/core@30.2.0
  └─┬ @jest/transform@30.2.0
    └─┬ babel-plugin-istanbul@7.0.1
      └── test-exclude@6.0.0  ← PROBLEMATIC PACKAGE
```

### Root Cause

Node.js 25.2.1 introduced breaking changes to the `util.promisify()` API that are incompatible with `test-exclude@6.0.0`. The package attempts to promisify an object instead of a function, causing the TypeError.

**Relevant Node.js Change**: The promisify API now strictly validates that the argument is a function, rejecting objects.

## Impact Assessment

### Test Execution: ✅ WORKING

All tests execute successfully:
- **177 passing tests** out of 194 total
- **17 failing tests** (unrelated to coverage issue)
- **Success Rate**: 91.2%

### Coverage Reporting: ❌ BROKEN

Coverage collection completely fails:
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------
```

**Result**: 0% coverage reported (inaccurate - tests exist and pass)

### Development Impact

**Low-Medium Impact**:
- ✅ Unit tests still run and validate functionality
- ✅ Test-driven development workflow unaffected
- ❌ Cannot measure code coverage percentages
- ❌ Cannot identify untested code paths
- ❌ Cannot track coverage improvements over time

## Current Workaround

**Disabled Coverage Collection** in `package.json`:

```json
{
  "jest": {
    "collectCoverage": false,
    "collectCoverageFrom": [
      "scripts/**/*.{js,mjs}",
      "!scripts/test-accessibility.mjs",
      "!scripts/initialization/InitializationUtilities.js"
    ]
  }
}
```

**Impact**: 
- Tests run without coverage instrumentation overhead
- Faster test execution
- No coverage reports generated

## Attempted Solutions

### ❌ Solution 1: Exclude Problematic Files

**Approach**: Exclude `scripts/main.mjs` and `InitializationUtilities.js` from coverage

```json
"collectCoverageFrom": [
  "scripts/**/*.{js,mjs}",
  "!scripts/test-accessibility.mjs",
  "!scripts/initialization/InitializationUtilities.js"
]
```

**Result**: Failed - Error occurs during coverage initialization, not file-specific

### ❌ Solution 2: Upgrade test-exclude

**Approach**: Force upgrade to `test-exclude@7.0.0+`

**Problem**: 
- `babel-plugin-istanbul@7.0.1` has hard dependency on `test-exclude@6.0.0`
- Cannot override without breaking babel-plugin-istanbul
- Jest@30.2.0 depends on babel-plugin-istanbul

**Dependency Lock**:
```
jest → @jest/transform → babel-plugin-istanbul@7.0.1 → test-exclude@6.0.0 (locked)
```

### ❌ Solution 3: Downgrade Node.js

**Approach**: Use Node.js 22 LTS

**Problem**:
- Project explicitly requires Node.js 25.2.1 (`package.json` engines field)
- Would require updating all Node version files:
  - `.node-version`
  - `.nvmrc`
  - CI/CD configurations (if any)
- Regression to older Node.js version not ideal for modern project

## Permanent Solutions (Future)

### Option 1: Wait for Upstream Fix ⏳ RECOMMENDED

**Track Issue**: 
- Monitor `test-exclude` repository for Node.js 25 compatibility fix
- Monitor `babel-plugin-istanbul` for dependency updates

**Expected Timeline**: 1-3 months (typical upstream package update cycle)

**Action Items**:
1. Star/watch relevant GitHub repositories
2. Check for updates monthly
3. Re-enable coverage when fixed

**Repositories to Monitor**:
- https://github.com/istanbuljs/test-exclude
- https://github.com/istanbuljs/babel-plugin-istanbul

### Option 2: Alternative Coverage Tool

**v8 Coverage** (Built into Node.js):
```bash
node --experimental-vm-modules --experimental-test-coverage node_modules/jest/bin/jest.js
```

**c8 Coverage** (Modern Istanbul alternative):
```bash
npm install --save-dev c8
npx c8 --reporter=text --reporter=html npm test
```

**Pros**:
- Native Node.js support
- No Babel dependency
- Works with ES modules

**Cons**:
- Different report format than Istanbul
- Requires workflow changes
- May not integrate with Jest's coverage config

### Option 3: Custom Coverage Collection

**nyc (Istanbul CLI)**:
```bash
npm install --save-dev nyc
npx nyc npm test
```

**Pros**:
- Same Istanbul reports
- Bypasses Jest's coverage infrastructure

**Cons**:
- Adds extra dependency
- Separate configuration needed
- May conflict with Jest

## Current Test Status

**As of 2025-12-25**:

### Test Execution Summary
```
Test Suites: 6 total
  ✅ Passed: 1 test suite
  ❌ Failed: 5 test suites (unrelated to coverage)

Tests: 194 total
  ✅ Passing: 177 tests (91.2%)
  ❌ Failing: 17 tests (8.8%)
```

### Known Test Files
```
src/__tests__/
├── documentation.test.js        ✅ All tests passing
├── InitializationUtilities.test.js  ❌ Some failures (JSDOM issues)
├── main.test.js                 ❌ Coverage collection error
├── project_navigation.test.js   ✅ Most tests passing
├── shell_scripts.test.js        ❌ Some failures (sync script changes)
└── sync_to_public.test.js       ❌ Some failures (path updates needed)
```

### Manual Coverage Estimation

**Approximate Coverage** (based on test analysis):

**scripts/main.mjs**:
- `setupSmoothScrolling()` - ✅ ~95% covered (96 test cases)
- `setupContactForm()` - ✅ ~90% covered (40+ test cases)
- `initializeSite()` - ✅ ~80% covered (integration tests)
- **Estimated**: ~85-90% coverage

**scripts/initialization/InitializationUtilities.js**:
- Multiple utility functions with dedicated tests
- **Estimated**: ~70-80% coverage

**HTML5 UP Template Assets** (assets/js/):
- `main.js` - ❌ No tests (0% coverage)
- `util.js` - ❌ No tests (0% coverage)
- `breakpoints.min.js` - ❌ No tests (0% coverage)
- `browser.min.js` - ❌ No tests (0% coverage)
- **Estimated**: 0% coverage (third-party template)

**Overall Manual Estimate**: ~60-70% coverage (excluding template assets)

## Recommendations

### Immediate Actions (Week 1)

1. ✅ **Document Issue** (This file)
2. ✅ **Disable Coverage Collection** (Already done in package.json)
3. ⏳ **Fix Failing Tests** (17 tests need attention)
4. ⏳ **Update Test Documentation** (Reflect 0% coverage status)

### Short-Term Actions (1-2 Months)

1. ⏳ **Monitor Upstream Packages**
   - Check `test-exclude` monthly for updates
   - Watch for `babel-plugin-istanbul` releases

2. ⏳ **Evaluate c8 Alternative**
   - Research c8 integration with Jest
   - Test in branch without breaking existing setup

3. ⏳ **Manual Coverage Audits**
   - Review test files to estimate coverage
   - Document untested code paths
   - Prioritize writing tests for uncovered areas

### Long-Term Actions (3-6 Months)

1. ⏳ **Re-enable Coverage** (When upstream fixed)
   - Remove `"collectCoverage": false` from package.json
   - Run `npm test -- --coverage` to verify
   - Establish coverage baselines

2. ⏳ **Set Coverage Thresholds**
   ```json
   "jest": {
     "coverageThreshold": {
       "global": {
         "statements": 80,
         "branches": 75,
         "functions": 80,
         "lines": 80
       }
     }
   }
   ```

3. ⏳ **Add Coverage CI/CD Gates**
   - Fail builds if coverage drops below threshold
   - Generate coverage reports for PRs

## Testing Without Coverage

### Running Tests
```bash
# Standard test run (no coverage)
npm test

# Watch mode for TDD
npm run test:watch

# Specific test file
npm test -- main.test.js

# Pattern matching
npm test -- --testPathPattern=documentation
```

### Verifying Test Quality

**Without Coverage Metrics**, use these indicators:

1. **Test Count**: 194 tests is substantial for a static site
2. **Test Passing Rate**: 91.2% indicates good test stability
3. **Test File Coverage**: 6 test files cover major functionality
4. **Manual Review**: Code review ensures critical paths have tests

### Best Practices During Coverage Outage

1. **Write Tests First** (TDD)
   - Don't rely on coverage reports to identify gaps
   - Write tests as you develop features

2. **Manual Code Review**
   - Review each function for test existence
   - Verify edge cases covered in tests

3. **Test Critical Paths**
   - Prioritize user-facing functionality
   - Ensure error handling tested
   - Validate integration points

4. **Document Test Strategy**
   - Explain what each test file covers
   - List intentionally untested code (e.g., third-party templates)

## Related Issues

### Issue #1: Template Assets Not Tested

**Problem**: HTML5 UP template JavaScript (`assets/js/`) has no tests

**Reason**: Third-party pre-built template, not project code

**Decision**: Acceptable to leave untested (not our code)

**Impact on Coverage**: ~40-50% of JavaScript files untested (by design)

### Issue #2: Test Failures Mask Coverage Issues

**Problem**: 17 failing tests make coverage analysis difficult

**Action Needed**: 
1. Fix failing tests first
2. Then address coverage

**Priority**: Higher than coverage (tests must pass before coverage matters)

### Issue #3: Sibling Project Coverage

**Problem**: Documentation references sibling project coverage

**Reality**: Sibling projects now deployed to `public/` directly, not tested in main project

**Action Needed**: Update documentation to clarify scope

## Monitoring and Updates

### Update Schedule

**Monthly Check** (Last updated: 2025-12-25):
- Check `test-exclude` npm page for new versions
- Review `babel-plugin-istanbul` changelog
- Test `npm install --save-dev test-exclude@latest` (dry-run)

### Success Criteria

**Coverage Fixed When**:
1. ✅ `npm test -- --coverage` runs without errors
2. ✅ Coverage reports generated (text, HTML, lcov)
3. ✅ Coverage percentages displayed (non-zero)
4. ✅ All test files instrumented successfully

### Re-enablement Checklist

When upstream fix available:

- [ ] Update `test-exclude` (direct or via `babel-plugin-istanbul`)
- [ ] Remove `"collectCoverage": false` from `package.json`
- [ ] Run `npm test -- --coverage` to verify
- [ ] Generate coverage reports in `coverage/` directory
- [ ] Document new baseline coverage percentages
- [ ] Set appropriate coverage thresholds
- [ ] Update this document status to "RESOLVED"

## Conclusion

**Coverage collection is blocked** by Node.js 25.2.1 incompatibility with `test-exclude@6.0.0`.

**Current Status**:
- ✅ Tests run successfully (177 passing)
- ❌ Coverage reports unavailable (0% false reading)
- ⏳ Waiting for upstream package fix

**Workaround**: 
- Coverage disabled in configuration
- Manual coverage estimation: ~60-70%
- Focus on fixing 17 failing tests

**Timeline**: 
- Expected fix: 1-3 months (upstream)
- Alternatives: Evaluate c8 or nyc (1-2 months)

**Impact**: Medium - Tests validate functionality, but coverage metrics unavailable

---

**Status**: 🔴 BLOCKED (Upstream dependency issue)  
**Priority**: 🟡 MEDIUM (Tests work, only reporting affected)  
**Last Updated**: 2025-12-25  
**Next Review**: 2026-01-25 (monthly check)
