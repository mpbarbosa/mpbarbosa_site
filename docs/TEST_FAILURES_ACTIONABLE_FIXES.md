# TEST FAILURES - ACTIONABLE FIX GUIDE

**Status:** 99 tests failing (6.1% failure rate)  
**Target:** 0 failures (100% pass rate)  
**Priority:** CRITICAL - Fix this week

---

## Summary of Failures

```
Test Suites: 38 failed, 51 passed, 89 total
Tests:       99 failed, 1,518 passed, 1,617 total
Pass Rate:   93.9%
Time:        7.682 seconds
```

---

## Category 1: Selenium E2E Tests (54 failures)

### Root Cause
```
Error: spawn /bin/sh ENOENT
Location: submodules/music_in_numbers/tests/selenium/e2e/
Tests Affected: 54
```

### Why It's Failing
Selenium WebDriver tests are trying to spawn shell commands but the environment is not configured for Selenium execution. This is likely because:
1. Selenium WebDriver is not installed
2. Chrome/Firefox drivers are missing
3. Tests are running in a headless environment without proper setup

### Fix Option 1: Skip Selenium Tests in Non-E2E Environments

**Create: `submodules/music_in_numbers/tests/selenium/setup.js`**

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

if (!isSeleniumAvailable()) {
    console.warn('⚠️  Selenium WebDriver not available - Skipping E2E tests');
    console.warn('   To run E2E tests: npm install selenium-webdriver chromedriver');
    
    // Skip all tests in this suite
    beforeAll(() => {
        pending('Selenium WebDriver not installed');
    });
}
```

**Update: Each Selenium test file**

```javascript
// At the top of each file in tests/selenium/e2e/
import '../setup.js'; // Add this import

describe('Music in Numbers - E2E Tests', () => {
    // Skip if Selenium not available
    const seleniumAvailable = (() => {
        try {
            require.resolve('selenium-webdriver');
            return true;
        } catch (e) {
            return false;
        }
    })();

    (seleniumAvailable ? describe : describe.skip)('Selenium Tests', () => {
        // Your tests here
    });
});
```

### Fix Option 2: Configure Jest to Skip Selenium

**Update: `package.json`**

```json
{
    "scripts": {
        "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
        "test:unit": "node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathIgnorePatterns='selenium|e2e'",
        "test:e2e": "node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathPattern='selenium|e2e'"
    },
    "jest": {
        "testPathIgnorePatterns": [
            "/node_modules/",
            "/selenium/"
        ]
    }
}
```

### Fix Option 3: Install Selenium Dependencies (For E2E Testing)

```bash
cd submodules/music_in_numbers
npm install --save-dev selenium-webdriver chromedriver

# For headless CI environments
npm install --save-dev chrome-headless-shell
```

**Recommendation:** Use **Fix Option 1 + Option 2** combination:
- Add environment detection to skip tests when Selenium is not available
- Update `package.json` to separate unit and E2E test commands
- Document E2E setup requirements in README

---

## Category 2: DisplayerFactory Constructor (1 failure)

### Root Cause
```
Error: Expected constructor to throw
Location: submodules/guia_turistico/src/libs/guia_js/__tests__/unit/DisplayerFactory.test.js:33
Test: should be a static factory class (no instantiation)
```

### Why It's Failing
The `DisplayerFactory` class can be instantiated, but the test expects it to throw an error since it's designed as a static factory.

### Fix

**File: `submodules/guia_turistico/src/libs/guia_js/src/ui/DisplayerFactory.js`**

**Current Implementation (WRONG):**
```javascript
class DisplayerFactory {
    // No constructor protection
    
    static create(type, dependencies) {
        // Factory logic
    }
}

export default DisplayerFactory;
```

**Fixed Implementation:**
```javascript
class DisplayerFactory {
    constructor() {
        throw new Error('DisplayerFactory is a static factory class and cannot be instantiated. Use static methods instead.');
    }
    
    static create(type, dependencies) {
        // Factory logic remains the same
        switch(type) {
            case 'address':
                return new HTMLAddressDisplayer(dependencies);
            case 'position':
                return new HTMLPositionDisplayer(dependencies);
            case 'referencePlace':
                return new HTMLReferencePlaceDisplayer(dependencies);
            case 'speech':
                return new HtmlSpeechSynthesisDisplayer(dependencies);
            default:
                throw new Error(`Unknown displayer type: ${type}`);
        }
    }
    
    static createAll(dependencies) {
        return {
            address: DisplayerFactory.create('address', dependencies),
            position: DisplayerFactory.create('position', dependencies),
            referencePlace: DisplayerFactory.create('referencePlace', dependencies),
            speech: DisplayerFactory.create('speech', dependencies)
        };
    }
}

export default DisplayerFactory;
```

**Test This Fix:**
```bash
cd submodules/guia_turistico/src/libs/guia_js
npm test -- __tests__/unit/DisplayerFactory.test.js
```

---

## Category 3: SpeechQueue Validation (3 failures)

### Root Cause
```
Location: submodules/guia_turistico/src/libs/guia_js/__tests__/unit/SpeechQueue.test.js

Failure 1 (line 105): undefined parameter should throw RangeError
Failure 2 (line 134): Instance should be frozen (immutability)
Failure 3 (line 447): Logging format mismatch
```

### Fix for Failure 1: Parameter Validation

**File: `submodules/guia_turistico/src/libs/guia_js/src/speech/SpeechQueue.js`**

**Current Implementation (WRONG):**
```javascript
constructor(maxSize = 100, expirationMs = 60000, enableLogging = false) {
    // Missing validation for undefined
    if (typeof maxSize !== 'number' || maxSize < 1 || maxSize > 1000) {
        throw new RangeError('maxSize must be a number between 1 and 1000');
    }
    
    this.maxSize = maxSize;
    // ...
}
```

**Fixed Implementation:**
```javascript
constructor(maxSize = 100, expirationMs = 60000, enableLogging = false) {
    // Validate maxSize is explicitly provided or use default
    if (maxSize === undefined) {
        throw new RangeError('maxSize parameter is required');
    }
    
    if (typeof maxSize !== 'number') {
        throw new RangeError('maxSize must be a number');
    }
    
    if (maxSize < 1 || maxSize > 1000) {
        throw new RangeError('maxSize must be between 1 and 1000');
    }
    
    // Validate expirationMs
    if (expirationMs !== undefined && typeof expirationMs !== 'number') {
        throw new RangeError('expirationMs must be a number');
    }
    
    this.maxSize = maxSize;
    this.expirationMs = expirationMs;
    this.enableLogging = enableLogging;
    this.items = [];
    this.observerSubject = new ObserverSubject();
}
```

### Fix for Failure 2: Immutability

**Add at END of constructor:**
```javascript
constructor(maxSize = 100, expirationMs = 60000, enableLogging = false) {
    // ... all validation and initialization ...
    
    // Freeze the instance to make it immutable
    Object.freeze(this);
}
```

### Fix for Failure 3: Logging Format

**Current Implementation (WRONG):**
```javascript
if (this.enableLogging) {
    console.log(`[${new Date().toISOString()}]`, 
                `+++ (${this.maxSize})`, 
                '(ObserverSubject) Notifying observers with args:', args);
}
```

**Fixed Implementation:**
```javascript
if (this.enableLogging && expiredCount > 0) {
    console.log(`[${new Date().toISOString()}]`,
                `(SpeechQueue) Removed ${expiredCount} expired items`);
}
```

**Complete Fixed Constructor:**
```javascript
constructor(maxSize = 100, expirationMs = 60000, enableLogging = false) {
    // Parameter validation
    if (maxSize === undefined) {
        throw new RangeError('maxSize parameter is required');
    }
    
    if (typeof maxSize !== 'number') {
        throw new RangeError('maxSize must be a number');
    }
    
    if (maxSize < 1 || maxSize > 1000) {
        throw new RangeError('maxSize must be between 1 and 1000');
    }
    
    if (expirationMs !== undefined && (typeof expirationMs !== 'number' || expirationMs < 0)) {
        throw new RangeError('expirationMs must be a positive number');
    }
    
    // Initialize properties
    this.maxSize = maxSize;
    this.expirationMs = expirationMs;
    this.enableLogging = enableLogging;
    this.items = [];
    this.observerSubject = new ObserverSubject();
    
    // Freeze for immutability
    Object.freeze(this);
}
```

**Test This Fix:**
```bash
cd submodules/guia_turistico/src/libs/guia_js
npm test -- __tests__/unit/SpeechQueue.test.js
```

---

## Category 4: SpeechItem Timestamp (1 failure)

### Root Cause
```
Error: expect(received).toBeInstanceOf(expected)
Location: submodules/guia_turistico/src/libs/guia_js/__tests__/unit/SpeechQueue.test.js:620
Issue: item.timestamp is a number (1764653702922) instead of Date object
```

### Fix

**File: `submodules/guia_turistico/src/libs/guia_js/src/speech/SpeechItem.js`**

**Current Implementation (WRONG):**
```javascript
class SpeechItem {
    constructor(text, priority = 5) {
        this.text = text;
        this.priority = priority;
        this.timestamp = Date.now(); // ❌ Returns number
    }
}
```

**Fixed Implementation:**
```javascript
class SpeechItem {
    constructor(text, priority = 5) {
        this.text = text;
        this.priority = priority;
        this.timestamp = new Date(); // ✅ Returns Date object
    }
    
    // Add helper method for milliseconds if needed
    get timestampMs() {
        return this.timestamp.getTime();
    }
}
```

**If you need to keep compatibility with existing code:**
```javascript
class SpeechItem {
    constructor(text, priority = 5) {
        this.text = text;
        this.priority = priority;
        this._timestamp = new Date(); // Private Date object
    }
    
    // Getter returns Date object for instanceof checks
    get timestamp() {
        return this._timestamp;
    }
    
    // Helper for milliseconds
    get timestampMs() {
        return this._timestamp.getTime();
    }
}
```

---

## Category 5: Analytics Core Patterns (3 failures)

### Root Cause
```
Location: submodules/music_in_numbers/tests/analytics-core-patterns.jest.test.js

Failure 1 (line 237): Cannot read properties of undefined (reading 'success')
Failure 2 (line 252): Cannot read properties of undefined (reading 'success')
Failure 3 (line 297): expect(jest.fn()).toHaveBeenCalled() - Received: 0
```

### Fix for Failures 1 & 2: API Error Handling

**Issue:** `loadMusicAnalyticsCore()` and `displayAdvancedMusicAnalyticsCore()` are not returning error objects correctly.

**File: `submodules/music_in_numbers/src/scripts/analytics/AnalyticsCore.js`**

**Current Implementation (WRONG):**
```javascript
export async function loadMusicAnalyticsCore(dependencies) {
    try {
        // API call logic
        const data = await dependencies.fetchData();
        return { success: true, data };
    } catch (error) {
        dependencies.logError(error);
        // ❌ Not returning anything
    }
}
```

**Fixed Implementation:**
```javascript
export async function loadMusicAnalyticsCore(dependencies) {
    try {
        // API call logic
        const data = await dependencies.fetchData();
        return { success: true, data };
    } catch (error) {
        dependencies.logError(error);
        return { success: false, error: error.message || 'API Failure' }; // ✅ Return error object
    }
}

export function displayAdvancedMusicAnalyticsCore(data, dependencies) {
    try {
        const html = dependencies.buildUI(data);
        dependencies.showResult(html);
        return { success: true };
    } catch (error) {
        dependencies.logError(error);
        return { success: false, error: error.message || 'UI Generation Failed' }; // ✅ Return error object
    }
}
```

### Fix for Failure 3: Dependency Injection

**Issue:** Functions are not calling injected logging functions.

**Test expects:**
```javascript
expect(mockDependencies.logInfo).toHaveBeenCalled();
expect(mockDependencies.showResult).toHaveBeenCalled();
```

**Fixed Implementation:**
```javascript
export function displayAdvancedMusicAnalyticsCore(data, dependencies) {
    // Add logging call
    if (dependencies.logInfo) {
        dependencies.logInfo('Displaying advanced analytics');
    }
    
    try {
        const html = dependencies.buildUI(data);
        
        // Add result display call
        if (dependencies.showResult) {
            dependencies.showResult(html);
        }
        
        return { success: true };
    } catch (error) {
        if (dependencies.logError) {
            dependencies.logError(error);
        }
        return { success: false, error: error.message || 'UI Generation Failed' };
    }
}
```

---

## Remaining Failures (37 failures)

### Analysis Needed
The remaining ~37 failures appear to be in:
1. Additional Guia Turístico tests
2. Music in Numbers integration tests

**Action Required:**
1. Run detailed failure analysis:
   ```bash
   npm test -- --verbose 2>&1 | grep -A 10 "FAIL"
   ```

2. Focus on error patterns:
   - Check for similar issues (null/undefined checks)
   - Look for mock/spy issues
   - Verify async/await handling

---

## Implementation Checklist

### Phase 1: Quick Wins (1-2 hours)
- [ ] Fix DisplayerFactory constructor (5 min)
- [ ] Fix SpeechQueue validation (15 min)
- [ ] Fix SpeechItem timestamp (5 min)
- [ ] Fix Analytics Core error handling (30 min)
- [ ] Skip Selenium tests in default run (15 min)
- [ ] Run tests and verify fixes (30 min)

### Phase 2: Selenium Configuration (2-4 hours)
- [ ] Create Selenium setup file
- [ ] Add environment detection
- [ ] Update package.json scripts
- [ ] Document E2E setup in README
- [ ] Test in CI environment

### Phase 3: Remaining Failures (4-8 hours)
- [ ] Analyze verbose test output
- [ ] Group similar failures
- [ ] Fix by category
- [ ] Verify all tests pass

---

## Verification Commands

```bash
# After each fix, run:
cd /home/mpb/Documents/GitHub/mpbarbosa_site/src

# Test specific file
npm test -- __tests__/specific.test.js

# Test all unit tests (skip E2E)
npm run test:unit

# Full test suite
npm test

# Expected result after all fixes:
# Test Suites: 0 failed, 89 passed, 89 total
# Tests:       0 failed, 1617 passed, 1617 total
```

---

## Success Criteria

✅ **Phase 1 Complete:**
- DisplayerFactory: 0 failures
- SpeechQueue: 0 failures
- SpeechItem: 0 failures
- Analytics Core: 0 failures
- Selenium: Tests skipped (not failed)

✅ **Phase 2 Complete:**
- E2E tests properly configured
- Unit vs E2E separation clear
- CI/CD compatible

✅ **Phase 3 Complete:**
- All 1,617 tests passing
- 100% pass rate
- 0 failures

---

## Timeline

**Immediate (Today):**
- Fix Categories 2-4 (DisplayerFactory, SpeechQueue, SpeechItem, Analytics Core)
- Expected: Reduce failures to ~50

**This Week:**
- Configure Selenium skipping
- Analyze and fix remaining failures
- Expected: 100% pass rate

**Next Week:**
- Add new tests from recommendations
- Implement coverage thresholds
- Set up CI/CD

---

**Priority:** CRITICAL  
**Assignee:** Development Team  
**Due Date:** This Week  
**Expected Effort:** 8-16 hours total
