# Test Quick Start Guide - Developer Reference Card

**Last Updated:** December 2, 2025  
**Project:** MP Barbosa Personal Website

---

## 🚀 Quick Commands

```bash
# Run Tests
npm test                      # All tests
npm run test:coverage         # With coverage
npm run test:watch            # Watch mode
npm test -- __tests__/main.test.js  # Single file

# Coverage
npm run test:coverage         # Generate report
open coverage/lcov-report/index.html  # View in browser

# Debugging
npm run test:debug            # Debug mode
npm test -- --verbose         # Verbose output
npm test -- --no-coverage     # Skip coverage
```

---

## 📋 Test Checklist (Before Commit)

- [ ] All tests passing: `npm test`
- [ ] Coverage maintained: `npm run test:coverage`
- [ ] New features have tests
- [ ] Edge cases covered
- [ ] Mocks properly restored

---

## 🏗️ Test File Template

```javascript
/**
 * @jest-environment jsdom
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { myFunction } from '../module';

describe('Feature Name', () => {
    beforeEach(() => {
        // Setup
        document.body.innerHTML = `<div id="test">Content</div>`;
    });

    describe('Specific Behavior', () => {
        test('should do something', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = myFunction(input);
            
            // Assert
            expect(result).toBe('expected');
        });
    });
});
```

---

## 🎯 Common Test Patterns

### 1. DOM Testing
```javascript
test('should update DOM element', () => {
    document.body.innerHTML = '<div id="app"></div>';
    const element = document.getElementById('app');
    
    element.textContent = 'Hello World';
    
    expect(element.textContent).toBe('Hello World');
});
```

### 2. Event Testing
```javascript
test('should handle click event', () => {
    const button = document.createElement('button');
    const onClick = jest.fn();
    button.addEventListener('click', onClick);
    
    button.click();
    
    expect(onClick).toHaveBeenCalledTimes(1);
});
```

### 3. Mock Functions
```javascript
test('should use mocked function', () => {
    const mockFn = jest.fn(() => 'mocked');
    
    const result = mockFn('test');
    
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(result).toBe('mocked');
});
```

### 4. Spy on Methods
```javascript
test('should spy on window.alert', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    window.alert('test');
    
    expect(alertSpy).toHaveBeenCalledWith('test');
    alertSpy.mockRestore(); // Important!
});
```

### 5. Async Testing
```javascript
test('should handle async operation', async () => {
    const promise = Promise.resolve('success');
    
    const result = await promise;
    
    expect(result).toBe('success');
});

// Or with resolves/rejects
test('should resolve promise', async () => {
    await expect(Promise.resolve('success')).resolves.toBe('success');
});
```

### 6. Error Testing
```javascript
test('should throw error', () => {
    const fn = () => { throw new Error('Failed'); };
    
    expect(fn).toThrow('Failed');
    expect(fn).toThrow(Error);
});
```

---

## 📊 Jest Matchers Cheatsheet

### Equality
```javascript
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Strict deep equality
expect(value).not.toBe(unexpected);     // Negation
```

### Truthiness
```javascript
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();
```

### Numbers
```javascript
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThanOrEqual(4.5);
expect(value).toBeCloseTo(0.3); // Floating point
```

### Strings
```javascript
expect(string).toMatch(/pattern/);
expect(string).toMatch('substring');
expect(string).toContain('text');
```

### Arrays & Iterables
```javascript
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toEqual(expect.arrayContaining([1, 2]));
```

### Objects
```javascript
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', value);
expect(obj).toMatchObject(partial);
```

### Functions
```javascript
expect(fn).toThrow();
expect(fn).toThrow(Error);
expect(fn).toThrow('error message');
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(3);
expect(mockFn).toHaveBeenLastCalledWith(args);
```

### Promises
```javascript
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module"
```javascript
// ❌ Wrong
import { func } from './module';

// ✅ Correct (ES Modules need extension)
import { func } from './module.js';
import { func } from './module.mjs';
```

### Issue 2: "Element is null"
```javascript
// ❌ Wrong
const element = document.getElementById('nonexistent');
element.click(); // Error!

// ✅ Correct
const element = document.getElementById('test-id');
if (element) {
    element.click();
}
```

### Issue 3: "Mock not restored"
```javascript
// ❌ Wrong
test('test 1', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    // Forgot to restore!
});

// ✅ Correct
test('test 1', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // ... test logic ...
    alertSpy.mockRestore(); // Always restore!
});
```

### Issue 4: "Tests depend on execution order"
```javascript
// ❌ Wrong - Tests depend on each other
let sharedState;
test('test 1', () => { sharedState = 'value'; });
test('test 2', () => { expect(sharedState).toBe('value'); });

// ✅ Correct - Independent tests
beforeEach(() => {
    sharedState = 'value';
});
test('test 1', () => { expect(sharedState).toBe('value'); });
test('test 2', () => { expect(sharedState).toBe('value'); });
```

---

## 📈 Coverage Guidelines

### Coverage Targets
```
Main Project:      80%+ required
Template Assets:   70%+ recommended
Submodules:        75%+ recommended
Overall:           75%+ required
```

### What to Test
✅ **DO Test:**
- Business logic
- User interactions
- Edge cases
- Error handling
- Integration points

❌ **DON'T Test:**
- Third-party libraries
- Simple getters/setters
- Configuration files
- Auto-generated code

---

## 🔍 Debugging Tests

### 1. Use `console.log`
```javascript
test('debug test', () => {
    const value = someFunction();
    console.log('Value:', value); // Will show in test output
    expect(value).toBe('expected');
});
```

### 2. Run Single Test
```bash
npm test -- -t "specific test name"
npm test -- __tests__/main.test.js
```

### 3. Use Debugger
```javascript
test('debug with breakpoint', () => {
    debugger; // Will stop execution in debug mode
    const result = someFunction();
    expect(result).toBe('expected');
});
```

Run with:
```bash
npm run test:debug
# Then open chrome://inspect in Chrome
```

### 4. Verbose Output
```bash
npm test -- --verbose
```

---

## 🎨 Test Organization

### Directory Structure
```
__tests__/
├── helpers/                    # Shared test utilities
│   ├── testHelpers.js
│   └── mockData.js
├── main.test.js               # Main functionality
├── template_assets.test.js    # Template tests
├── user_flows.test.js         # Integration tests
└── accessibility.test.js      # A11y tests
```

### Naming Conventions
```
Feature:        setupSmoothScrolling()
Test File:      setupSmoothScrolling.test.js
Describe:       describe('setupSmoothScrolling', ...)
Test:           test('should scroll to target element', ...)
```

---

## 🚨 Critical Rules

1. **Always clean up mocks** - Use `mockRestore()`
2. **Tests must be independent** - No shared state
3. **Use descriptive names** - Describe behavior, not implementation
4. **Keep tests simple** - One concept per test
5. **Test edge cases** - null, undefined, empty, large values
6. **Don't test implementation details** - Test behavior
7. **Use beforeEach/afterEach** - Clean state for each test

---

## 📚 Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Testing Library](https://testing-library.com/)

### Project Docs
- Full Analysis: `TEST_STRATEGY_QA_COMPREHENSIVE_ANALYSIS.md`
- Executive Summary: `TEST_STRATEGY_QA_EXECUTIVE_SUMMARY.md`
- Coverage Report: `coverage/lcov-report/index.html`

### Internal Tests
- Main Tests: `__tests__/main.test.js`
- Utilities: `__tests__/InitializationUtilities.test.js`
- Navigation: `__tests__/project_navigation.test.js`

---

## ✅ Pre-Commit Checklist

Before committing code:

```bash
# 1. Run all tests
npm test

# 2. Check coverage
npm run test:coverage

# 3. Lint markdown (if applicable)
npm run lint:md

# 4. Verify no skipped tests
npm test -- --listTests

# 5. Check for only/skip
grep -r "test.only\|describe.only\|test.skip" __tests__/
```

---

## 🎯 Test Metrics

### Acceptable Test
- ✅ Passes consistently
- ✅ Runs in < 100ms
- ✅ Tests one concept
- ✅ Has clear name
- ✅ Cleans up after itself

### Great Test
- ✅ All of the above, plus:
- ✅ Tests edge cases
- ✅ Uses proper matchers
- ✅ Has meaningful assertions
- ✅ Well-organized (AAA pattern)
- ✅ Easy to understand

---

**Quick Help:**
- Stuck? Check `TEST_STRATEGY_QA_COMPREHENSIVE_ANALYSIS.md`
- Coverage questions? See Section 2 of full report
- Best practices? See Section 4 of full report
- CI/CD setup? See Section 5 of full report

**Last Updated:** December 2, 2025
