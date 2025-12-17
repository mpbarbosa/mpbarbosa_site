# Test Strategy Quick Reference Card

**Last Updated:** 2025-11-25
**Project:** MP Barbosa Personal Website

---

## 🚀 Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint markdown files
npm run lint:md

# Run specific test file
npm test -- main.test.js

# Run tests with verbose output
npm test -- --verbose

# Run tests in CI mode
npm test -- --ci --coverage --maxWorkers=2
```

---

## 📊 Coverage Status

| Component | Coverage | Status |
|-----------|----------|--------|
| main.mjs | 91% | ✅ |
| Template JS | 0% | 🔴 |
| InitUtils | 0% | 🔴 |

**Target:** 80% overall coverage

---

## 🎯 Priority Test Cases to Write

### P0 - Critical (Do First)
1. ✅ **Template Navigation** - 8 hours
   - Article open/close/switch
   - Hash navigation
   - ESC key handling

2. ✅ **InitializationUtilities** - 6 hours
   - Environment detection
   - DI containers
   - Fallback mechanisms

### P1 - High (Do Next)
3. ✅ **Contact Form** - 4 hours
   - Validation logic
   - Submit handling
   - Error messages

4. ✅ **Accessibility** - 6 hours
   - Keyboard navigation
   - ARIA attributes
   - Screen reader support

### P2 - Medium (Do Later)
5. ✅ **Responsive Design** - 4 hours
   - Breakpoint handling
   - Touch events
   - Mobile optimization

---

## 🔧 Test Writing Checklist

### Before Writing Tests
- [ ] Read existing test file for patterns
- [ ] Identify critical paths in code
- [ ] Plan test scenarios (happy path + edge cases)
- [ ] Set up test data/fixtures

### While Writing Tests
- [ ] Use AAA pattern (Arrange, Act, Assert)
- [ ] Write descriptive test names
- [ ] One assertion per test (when possible)
- [ ] Mock external dependencies
- [ ] Clean up in afterEach

### After Writing Tests
- [ ] Run coverage report
- [ ] Review coverage gaps
- [ ] Refactor for DRY
- [ ] Document complex test setups

---

## 📋 Test Template

```javascript
/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('Feature Name', () => {
    beforeEach(() => {
        // Setup - Create test environment
        document.body.innerHTML = `...`;
    });

    afterEach(() => {
        // Cleanup - Reset mocks and state
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    describe('Specific Behavior', () => {
        test('should achieve expected outcome', () => {
            // ARRANGE - Set up test data
            const element = document.querySelector('...');

            // ACT - Execute the code under test
            element.click();

            // ASSERT - Verify the outcome
            expect(element.classList.contains('active')).toBe(true);
        });
    });
});
```

---

## 🐛 Common Testing Pitfalls

### ❌ Don't Do This
```javascript
// Too many assertions
test('should do everything', () => {
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(c).toBe(3);
    // ... 20 more assertions
});

// Non-descriptive name
test('test1', () => { ... });

// No cleanup
beforeEach(() => {
    global.config = { ... };
    // Never cleaned up!
});
```

### ✅ Do This Instead
```javascript
// Focused test
test('should set value to 1', () => {
    expect(a).toBe(1);
});

// Descriptive name
test('should display success message after form submission', () => { ... });

// Proper cleanup
afterEach(() => {
    delete global.config;
});
```

---

## 📚 Documentation Links

| Resource | Path |
|----------|------|
| **Full Strategy Report** | `TEST_STRATEGY_COMPREHENSIVE_QA_REPORT.md` |
| **Executive Summary** | `TEST_STRATEGY_EXECUTIVE_SUMMARY.md` |
| **Coverage Report** | `coverage/lcov-report/index.html` |
| **Jest Docs** | https://jestjs.io/docs/getting-started |
| **Testing Library** | https://testing-library.com/docs/ |

---

## 🎓 Learning Resources

### Beginner
- Jest Crash Course (30 min)
- AAA Pattern Tutorial (15 min)
- Mocking Basics (20 min)

### Intermediate
- Integration Testing Guide (45 min)
- Accessibility Testing (60 min)
- CI/CD Integration (45 min)

### Advanced
- Visual Regression Testing (90 min)
- Performance Testing (60 min)
- E2E with Playwright (120 min)

---

## 💡 Pro Tips

1. **Run tests before committing**
   ```bash
   npm test && git commit -m "..."
   ```

2. **Use test.only() for focused testing**
   ```javascript
   test.only('debug this test', () => { ... });
   ```

3. **Use test.skip() to temporarily disable tests**
   ```javascript
   test.skip('broken test - fix later', () => { ... });
   ```

4. **Check coverage for specific file**
   ```bash
   npm run test:coverage -- main.test.js
   ```

5. **Debug failing tests**
   ```bash
   npm test -- --verbose --no-coverage
   ```

---

## 🔄 Weekly Workflow

### Monday
- Review coverage report
- Identify new gaps from last week's changes
- Plan test cases for the week

### Tuesday-Thursday
- Write tests (aim for 5-10 new tests/day)
- Review and refactor existing tests
- Pair program on complex scenarios

### Friday
- Run full coverage analysis
- Update documentation
- Prepare report for next week

---

## 📞 Get Help

**Questions about:**
- Test framework → Check Jest docs
- Mocking → Review existing test files
- Coverage gaps → Run `npm run test:coverage`
- CI/CD setup → See GitHub Actions workflow

**Stuck?**
1. Check existing tests for similar patterns
2. Review full strategy report
3. Ask team for code review
4. Consult Jest documentation

---

## ✅ Current Progress

**Week of 2025-11-25:**
- [x] Coverage analysis completed
- [x] Strategy report written
- [ ] Template tests (0/15)
- [ ] InitUtils tests (0/50)
- [ ] CI/CD setup (0/1)

**Overall Progress:** 50% → 80% (Target)

---

**Print this card and keep it handy!** 📌
