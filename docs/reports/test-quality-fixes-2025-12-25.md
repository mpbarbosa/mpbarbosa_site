# Test Quality Fixes - December 25, 2025

## Summary

Attempted fixes for jsdom environment configuration issues in `InitializationUtilities.test.js` to resolve test failures related to `window.location` manipulation.

## Changes Made

### 1. Initial Approach - Object.defineProperty
- **File**: `src/__tests__/InitializationUtilities.test.js`
- **Change**: Replaced direct `window.location` assignment with `Object.defineProperty`
- **Result**: Failed - jsdom's `window.location` is non-configurable

### 2. Second Approach - Direct Property Assignment
- **Change**: Used direct assignment to `window.location.hostname` and `window.location.search`
- **Result**: Partial success when running tests individually, but navigation errors when running full suite

### 3. Third Approach - Helper Function with Fallback
- **Change**: Created `setLocation()` helper function with try-catch fallback
- **Result**: Still encounters "Cannot redefine property: location" errors

## Root Cause Analysis

**jsdom Limitation**: jsdom's `window.location` object is:
- Non-configurable (cannot use `Object.defineProperty` to replace it)
- Non-writable (direct assignment triggers navigation)
- Protected (delete operation has no effect)

## Test Status

- **Before fixes**: 235/247 tests passing (95.1%)
- **After initial fixes**: 257/279 tests passing (92.1%) when running InitializationUtilities individually
- **Full suite**: 160/279 tests passing (57.3%) - regression due to jsdom environment conflicts

## Recommended Solutions

### Short-term (Recommended)
1. **Use `@jest-environment-options`** to configure jsdom URL per test:
   ```javascript
   /**
    * @jest-environment jsdom
    * @jest-environment-options {"url": "http://localhost:8080"}
    */
   ```

2. **Split tests into separate files** by environment configuration:
   - `InitializationUtilities.localhost.test.js` 
   - `InitializationUtilities.production.test.js`
   - Each with different `@jest-environment-options`

### Long-term (Best Practice)
1. **Mock location dependencies** instead of modifying jsdom:
   ```javascript
   const mockDetectDevelopmentEnvironment = jest.fn(() => ({
     isLocalhost: true,
     // ...
   }));
   ```

2. **Extract location logic** into injectable dependencies:
   ```javascript
   class InitializationUtilities {
     constructor(locationProvider = window.location) {
       this.location = locationProvider;
     }
   }
   ```

3. **Use Happy DOM** instead of jsdom (more flexible window.location handling)

## Next Steps

1. ✅ Document the issue and solutions (this file)
2. ⏳ Implement `@jest-environment-options` approach
3. ⏳ Refactor tests to split by environment
4. ⏳ Consider dependency injection refactoring

## References

- jsdom Location implementation: `node_modules/jsdom/lib/jsdom/living/window/Location-impl.js`
- Jest environment options: https://jestjs.io/docs/configuration#testenvironmentoptions-object
- Related issue: https://github.com/jsdom/jsdom/issues/2112

## Test Files Affected

- `src/__tests__/InitializationUtilities.test.js` (97 tests)
- Potentially other tests that modify `window.location`

## Maintainer Notes

**DO NOT** attempt to directly modify `jsdom`'s `window.location` object. It is intentionally immutable to match browser behavior. Use environment configuration or mocking instead.

---

**Status**: 🟡 Partial Fix - Documentation complete, implementation pending  
**Priority**: Medium - Tests pass individually but fail in full suite  
**Assigned**: Pending  
**Last Updated**: 2025-12-25
