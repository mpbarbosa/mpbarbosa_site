# Test Quick Start Guide v2.0
## Get Testing in 5 Minutes

**For:** Developers new to the project  
**Goal:** Write your first test in < 5 minutes  
**Prerequisites:** Node.js v25.2.1 installed

---

## ⚡ Quick Start

### 1. Setup (30 seconds)
```bash
cd src
npm install
npm test
```

### 2. Run Tests (10 seconds)
```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### 3. Write Your First Test (2 minutes)
```javascript
// __tests__/my-feature.test.js
import { describe, test, expect } from '@jest/globals';

describe('My Feature', () => {
    test('should do something', () => {
        // Arrange
        const input = 5;
        
        // Act
        const result = input * 2;
        
        // Assert
        expect(result).toBe(10);
    });
});
```

### 4. Run Your Test (5 seconds)
```bash
npm test -- my-feature.test.js
```

---

## 🎯 Common Test Patterns

### DOM Testing
```javascript
/**
 * @jest-environment jsdom
 */
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('Button Click', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="myButton">Click Me</button>
        `;
    });

    test('should respond to click', () => {
        const button = document.getElementById('myButton');
        let clicked = false;
        
        button.addEventListener('click', () => {
            clicked = true;
        });
        
        button.click();
        
        expect(clicked).toBe(true);
    });
});
```

### Mocking
```javascript
import { jest } from '@jest/globals';

test('should call function once', () => {
    const mockFn = jest.fn();
    
    mockFn('hello');
    
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('hello');
});
```

### Async Testing
```javascript
test('should fetch data', async () => {
    const data = await fetchData();
    
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
});
```

---

## 📚 Essential Jest Matchers

### Basic Assertions
```javascript
expect(value).toBe(expected);              // Strict equality (===)
expect(value).toEqual(expected);           // Deep equality
expect(value).toBeDefined();               // Not undefined
expect(value).toBeTruthy();                // Truthy value
expect(value).toBeFalsy();                 // Falsy value
```

### Numbers
```javascript
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);            // Floating point
```

### Strings
```javascript
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');
```

### Arrays & Objects
```javascript
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', 'value');
```

### Functions
```javascript
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(() => { throw new Error('test'); }).toThrow();
```

---

## 🔧 Debugging Tests

### Run Single Test File
```bash
npm test -- my-feature.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="button"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Debug in VS Code
```json
// .vscode/launch.json
{
    "type": "node",
    "request": "launch",
    "name": "Jest Debug",
    "program": "${workspaceFolder}/node_modules/.bin/jest",
    "args": ["--runInBand", "--no-cache"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen"
}
```

---

## 📂 Test File Organization

### Main Site Tests
```
src/__tests__/
├── main.test.js                    # Site initialization
├── InitializationUtilities.test.js # Utility functions
├── project_navigation.test.js      # Navigation
├── shell_scripts.test.js           # Shell script validation
└── sync_to_public.test.js         # Deployment scripts
```

### Template Tests (TODO)
```
src/__tests__/
├── template-main.test.js           # Navigation logic
├── template-util.test.js           # jQuery utilities
└── template-integration.test.js    # Full page tests
```

---

## ✅ Test Checklist

Before submitting a PR, ensure:

- [ ] All tests pass: `npm test`
- [ ] Coverage doesn't decrease: `npm run test:coverage`
- [ ] New features have tests
- [ ] Tests follow AAA pattern
- [ ] Mock cleanup in afterEach
- [ ] Descriptive test names
- [ ] No console errors/warnings

---

## 🚫 Common Mistakes

### 1. Missing jsdom environment
```javascript
// ❌ Forgot environment directive
import { describe, test } from '@jest/globals';

// ✅ Correct
/**
 * @jest-environment jsdom
 */
import { describe, test } from '@jest/globals';
```

### 2. Async without await
```javascript
// ❌ Missing await
test('should fetch', () => {
    const data = fetchData(); // Returns Promise!
    expect(data).toBeDefined();
});

// ✅ Correct
test('should fetch', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
});
```

### 3. Mock not cleaned up
```javascript
// ❌ Mock persists to next test
test('test 1', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
});

// ✅ Correct
test('test 1', () => {
    const spy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // ... test code
    spy.mockRestore();
});

// ✅ Or use afterEach
afterEach(() => {
    jest.restoreAllMocks();
});
```

---

## 🎓 Learn More

### Full Documentation
- **Comprehensive Report:** `TEST_STRATEGY_COMPREHENSIVE_REPORT_v3.md` (40KB, 7 sections)
- **Executive Summary:** `TEST_RECOMMENDATIONS_EXECUTIVE_SUMMARY_v2.md` (9KB, quick overview)

### External Resources
- **Jest Docs:** https://jestjs.io/docs/getting-started
- **ES Modules:** https://jestjs.io/docs/ecmascript-modules
- **jsdom:** https://github.com/jsdom/jsdom

### Project Resources
- **Test Examples:** Browse `__tests__/` directory
- **Main Site Test:** `__tests__/main.test.js` (496 lines, 60 tests)
- **Utility Test:** `__tests__/InitializationUtilities.test.js` (870 lines, 91 tests)

---

## 💬 Getting Help

### In VS Code
```javascript
// Type 'expect.' and see autocomplete suggestions
expect(value).
//           ^ Press Ctrl+Space for suggestions
```

### Run Specific Test
```bash
# By file name
npm test -- main.test.js

# By test name
npm test -- --testNamePattern="smooth scrolling"

# Watch mode for file
npm run test:watch -- main.test.js
```

### Check Coverage for File
```bash
npm run test:coverage -- --collectCoverageFrom="scripts/main.mjs"
```

---

## 🏆 Best Practices Summary

1. **One Assertion Per Test** (when possible)
2. **Descriptive Test Names** ("should do X when Y")
3. **AAA Pattern** (Arrange-Act-Assert)
4. **Independent Tests** (no shared state)
5. **Clean Up Mocks** (afterEach)
6. **Test Behavior, Not Implementation**
7. **Use beforeEach for Setup**
8. **Avoid Test Interdependencies**

---

## 📊 Example: Full Test Suite

```javascript
/**
 * @jest-environment jsdom
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { myFunction } from '../scripts/my-module.js';

describe('My Module', () => {
    // Setup runs before each test
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        jest.clearAllMocks();
    });

    // Cleanup runs after each test
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Feature A', () => {
        test('should do X when Y', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = myFunction(input);
            
            // Assert
            expect(result).toBe('expected');
        });

        test('should handle error case', () => {
            expect(() => {
                myFunction(null);
            }).toThrow('Invalid input');
        });
    });

    describe('Feature B', () => {
        test('should update DOM', () => {
            const container = document.getElementById('container');
            
            myFunction('update');
            
            expect(container.textContent).toBe('updated');
        });

        test('should call callback', () => {
            const callback = jest.fn();
            
            myFunction('test', callback);
            
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty input', () => {
            const result = myFunction('');
            expect(result).toBe('');
        });

        test('should handle large input', () => {
            const largeInput = 'x'.repeat(10000);
            expect(() => myFunction(largeInput)).not.toThrow();
        });
    });
});
```

---

## 🚀 Next Steps

1. **Read comprehensive report** for detailed coverage analysis
2. **Browse existing tests** in `__tests__/` for examples
3. **Write tests for new features** before implementing
4. **Run coverage report** to see gaps
5. **Contribute to test coverage** following the 4-week plan

---

**Questions?** Check the comprehensive report or open an issue.  
**Ready to contribute?** Start with the template tests (high priority)!

---

**Version:** 2.0  
**Last Updated:** December 15, 2025  
**Maintainer:** QA Team
