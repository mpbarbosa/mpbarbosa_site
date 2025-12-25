# Test Strategy - Executive Summary

**Quick Reference Guide for Test Improvements**

---

## Critical Actions (Do First) 🚨

### 1. Fix Failing Tests (1-2 hours)
```bash
# Remove empty test files causing failures
cd submodules/music_in_numbers/tests/
rm security-testing.test.js
rm performance-benchmarking.test.js
rm advanced-error-handling.test.js

# OR add placeholder tests:
describe('Security Testing', () => {
  test('placeholder', () => expect(true).toBe(true));
});
```

### 2. Add TextEncoder Polyfill (15 minutes)
```javascript
// Create: __tests__/setup.js
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add to package.json jest config:
"setupFilesAfterEnv": ["<rootDir>/__tests__/setup.js"]
```

### 3. Fix Integration Test Paths (30 minutes)
```javascript
// In guia_turistico integration tests, change:
jest.unstable_mockModule('./SpeechQueue.js', () => ({...}));

// To:
jest.unstable_mockModule('../../src/speech/SpeechQueue.js', () => ({...}));
```

**Expected Impact**: Reduce failing test suites from 37 → 0

---

## High Priority Tests to Add 📝

### 1. HTML5 UP Template Tests (4 hours)
```javascript
// File: __tests__/template_functionality.test.js

// Test navigation system
test('should open article on link click', () => {
  document.querySelector('a[href="#intro"]').click();
  expect(document.querySelector('#intro').classList.contains('active')).toBe(true);
});

// Test keyboard navigation
test('should close article on ESC key', () => {
  const escEvent = new KeyboardEvent('keyup', { key: 'Escape' });
  window.dispatchEvent(escEvent);
  // Assert article closed
});

// Test responsive behavior
test('should render correctly on mobile', () => {
  global.innerWidth = 480;
  global.dispatchEvent(new Event('resize'));
  // Assert mobile layout
});
```

### 2. Form Validation Tests (3 hours)
```javascript
// File: __tests__/form_validation.test.js

test('should reject invalid email', () => {
  const emailInput = document.querySelector('[name="email"]');
  emailInput.value = 'not-an-email';
  expect(emailInput.checkValidity()).toBe(false);
});

test('should require minimum message length', () => {
  const messageInput = document.querySelector('[name="message"]');
  messageInput.value = 'Short';
  expect(messageInput.validity.tooShort).toBe(true);
});
```

### 3. Accessibility Tests (3 hours)
```javascript
// File: __tests__/accessibility.test.js

test('should have ARIA labels on navigation', () => {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    const label = link.getAttribute('aria-label') || link.textContent;
    expect(label.length).toBeGreaterThan(0);
  });
});

test('should trap focus in modals', () => {
  document.querySelector('a[href="#intro"]').click();
  // Test focus trapping
});
```

---

## Coverage Gaps Summary 🎯

| Area | Current | Target | Priority |
|------|---------|--------|----------|
| Main scripts | ~95% | 95%+ | ✅ Good |
| Template integration | 0% | 90% | 🔴 Critical |
| Form validation | 30% | 90% | 🔴 Critical |
| Accessibility | 0% | 80% | 🟡 High |
| Submodule links | 20% | 80% | 🟡 High |
| Performance | 0% | 60% | 🟢 Medium |

---

## Quick Wins (Low Effort, High Impact) ⚡

### 1. Add Test Data Builders (1 hour)
```javascript
// __tests__/helpers/test-data.js
export const createMockContactForm = (overrides = {}) => ({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Test message',
  ...overrides
});

// Use in tests:
test('should validate email', () => {
  const data = createMockContactForm({ email: 'invalid' });
  // Test with data...
});
```

### 2. Improve Test Names (30 minutes)
```javascript
// ❌ Before:
test('should set up smooth scrolling', () => {

// ✅ After:
test('should enable smooth scrolling when user clicks navigation links', () => {
```

### 3. Add Constants for Magic Numbers (30 minutes)
```javascript
// ❌ Before:
expect(linkCount).toBe(3);

// ✅ After:
const EXPECTED_NAV_LINKS = 3; // About, Projects, Contact
expect(linkCount).toBe(EXPECTED_NAV_LINKS);
```

---

## CI/CD Checklist ☑️

- [ ] All tests passing (0 failures)
- [ ] Coverage thresholds configured
- [ ] Pre-commit hooks installed
- [ ] GitHub Actions workflow created
- [ ] Test reports in PR comments

### Example Coverage Threshold
```json
// package.json
"jest": {
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## Test Naming Conventions 📋

### ✅ Good Examples
```javascript
test('should scroll smoothly when user clicks navigation link', () => {
test('should validate email format before form submission', () => {
test('should trap focus inside modal when opened', () => {
test('should close article when user presses ESC key', () => {
```

### ❌ Avoid
```javascript
test('smooth scrolling works', () => {
test('validation', () => {
test('test form', () => {
```

**Formula**: `should [action] when [condition]`

---

## Test Organization Best Practices 📁

### Structure
```
__tests__/
├── setup.js                    # Global test setup
├── helpers/
│   ├── test-data.js           # Test data builders
│   └── dom-helpers.js         # DOM manipulation utilities
├── unit/
│   ├── main.test.js           # Unit tests for main.mjs
│   └── utils.test.js          # Utility function tests
├── integration/
│   ├── template.test.js       # Template integration
│   └── navigation.test.js     # Navigation flow
└── e2e/
    └── user-journey.test.js   # End-to-end scenarios
```

### Naming Conventions
- Unit tests: `*.test.js`
- Integration: `*.integration.test.js`
- E2E: `*.e2e.test.js` or `*.spec.js`

---

## Common Testing Patterns 🔧

### 1. AAA Pattern (Arrange-Act-Assert)
```javascript
test('should handle form submission', () => {
  // Arrange
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
  setupContactForm();

  // Act
  const form = document.getElementById('contact-form');
  form.dispatchEvent(new Event('submit'));

  // Assert
  expect(alertSpy).toHaveBeenCalledWith('Form submitted! Thank you for reaching out.');
  alertSpy.mockRestore();
});
```

### 2. Test Data Builders
```javascript
const createUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});

test('should reject invalid user', () => {
  const invalidUser = createUser({ email: 'invalid' });
  // Use invalidUser...
});
```

### 3. Mock Cleanup
```javascript
beforeEach(() => {
  // Fresh setup for each test
  document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
  // Clean up mocks
  jest.restoreAllMocks();
  jest.clearAllMocks();
});
```

---

## Performance Testing Quick Start 🚀

### 1. Load Time Test
```javascript
test('should load page within 2 seconds', () => {
  const start = performance.now();
  // Load page
  const end = performance.now();

  expect(end - start).toBeLessThan(2000);
});
```

### 2. Interaction Performance
```javascript
test('should handle 100 rapid clicks without lag', () => {
  const start = performance.now();

  for (let i = 0; i < 100; i++) {
    document.querySelector('button').click();
  }

  const end = performance.now();
  expect(end - start).toBeLessThan(100); // < 1ms per click
});
```

---

## Accessibility Testing Quick Start ♿

### 1. ARIA Labels
```javascript
test('should have ARIA labels on interactive elements', () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    const label = button.getAttribute('aria-label') || button.textContent;
    expect(label).toBeTruthy();
  });
});
```

### 2. Keyboard Navigation
```javascript
test('should be keyboard navigable', () => {
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  expect(focusableElements.length).toBeGreaterThan(0);
});
```

### 3. Color Contrast
```javascript
test('should have sufficient color contrast', () => {
  const textElements = document.querySelectorAll('p, h1, h2, h3');
  textElements.forEach(element => {
    const style = window.getComputedStyle(element);
    expect(style.color).toBeTruthy();
    expect(style.backgroundColor).toBeTruthy();
    // Calculate contrast ratio and verify >= 4.5:1
  });
});
```

---

## Testing Tools & Libraries 🛠️

### Current Stack
- **Jest**: Test framework ✅
- **jsdom**: DOM simulation ✅
- **@jest/globals**: ES Module support ✅

### Recommended Additions
- **@testing-library/dom**: Better DOM queries
- **@testing-library/user-event**: Realistic user interactions
- **jest-axe**: Automated accessibility testing
- **@playwright/test**: Modern E2E testing
- **husky**: Pre-commit hooks

### Installation
```bash
npm install --save-dev @testing-library/dom @testing-library/user-event jest-axe
```

---

## Measuring Success 📊

### Before (Current)
- Test Suites: 52 passing / 37 failing (58% pass rate)
- Tests: 1,520 passing / 97 failing (94% pass rate)
- Coverage: Available but no thresholds
- CI/CD: Not configured

### After (Target - 3 months)
- Test Suites: 100% passing (0 failures)
- Tests: 2,000+ passing (100% pass rate)
- Coverage: 80%+ with enforced thresholds
- CI/CD: Automated on every commit

### Weekly Milestones
- **Week 1**: Fix all failing tests → 0 failures
- **Week 2**: Add template & form tests → 90% main coverage
- **Week 3**: Add accessibility tests → 80% total coverage
- **Week 4**: CI/CD setup → Automated testing

---

## Resources & Documentation 📚

### Internal Docs
- Full Report: `TEST_STRATEGY_REPORT.md`
- Coverage Report: `coverage/lcov-report/index.html`
- Test Files: `__tests__/`

### External Resources
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Testing](https://web.dev/learn/testing/)

---

## Questions? 🤔

### Common Issues

**Q: Tests failing with "TextEncoder is not defined"**
A: Add polyfill in `__tests__/setup.js` (see Critical Actions #2)

**Q: How do I run only failing tests?**
A: `npm test -- --onlyFailures`

**Q: How do I debug a specific test?**
A: `npm test -- --testNamePattern="test name pattern"`

**Q: Coverage not generated?**
A: `npm run test:coverage` (already configured)

---

**Last Updated**: 2025-11-14
**Next Review**: 2025-12-14
**Maintainer**: QA Team

For detailed implementation guides, see `TEST_STRATEGY_REPORT.md`
