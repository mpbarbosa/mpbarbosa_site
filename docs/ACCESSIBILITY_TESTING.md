# Accessibility Testing Guide

## Overview

This project implements comprehensive accessibility testing to ensure WCAG 2.1 Level AA compliance. Accessibility is tested using automated tools and manual validation.

## Testing Tools

### 1. axe-core (via Jest)
- **Purpose**: Automated accessibility testing during unit tests
- **Standard**: WCAG 2.1 Level AA
- **Run**: `npm run test:a11y`

### 2. pa11y
- **Purpose**: Command-line accessibility testing
- **Standard**: WCAG 2.1 Level AA
- **Run**: `npm run test:pa11y`

### 3. Manual Testing
- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS)
- **Keyboard Navigation**: Tab, Shift+Tab, Enter, Escape, Arrow keys
- **Browser DevTools**: Lighthouse accessibility audit

## Running Tests

### Local Development

```bash
# Start development server
cd src
npm start

# Run accessibility tests (Jest)
npm run test:a11y

# Run pa11y tests
npm run test:pa11y

# Run all tests with coverage
npm run test:coverage
```

### CI/CD Pipeline

Accessibility tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

See `.github/workflows/accessibility.yml` for configuration.

## Accessibility Features Implemented

### ✅ Semantic HTML
- `<main>` element with `role="main"`
- `<nav>` element with `role="navigation"` and `aria-label="Main navigation"`
- `<footer>` element with `role="contentinfo"`
- `<header>` element (HTML5 UP template)

### ✅ Image Accessibility
All images have descriptive alt text:
- `pic01.jpg`: "Technology and software development illustration"
- `pic02.jpg`: "AI-assisted projects showcase"
- `pic03.jpg`: "MP Barbosa profile and background"

### ✅ Form Accessibility
- All form inputs have associated `<label>` elements
- Labels use `for` attribute matching input `id`
- Proper input types: text, email, textarea, radio, checkbox, select

### ✅ ARIA Labels
- Social media icon links have descriptive `aria-label` attributes
- 8 icon links total (Twitter, Facebook, Instagram, GitHub in 2 sections)

### ✅ Language Declaration
- `<html lang="pt-BR">` for Portuguese (Brazil) content

### ✅ Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators visible
- Tab order follows logical reading flow

## WCAG 2.1 Level AA Compliance

### Perceivable
- ✅ Text alternatives for non-text content (alt text)
- ✅ Semantic structure for assistive technologies
- ⏳ Color contrast ratios (pending CSS review)

### Operable
- ✅ Keyboard accessible
- ✅ Sufficient time for interactions
- ✅ Navigable structure with landmarks

### Understandable
- ✅ Language of page identified
- ✅ Predictable navigation
- ✅ Input assistance with labels

### Robust
- ✅ Valid HTML5 structure
- ✅ Compatible with assistive technologies
- ✅ ARIA attributes where needed

## Known Limitations

1. **Color Contrast**: Pending manual review with Lighthouse
2. **Focus Indicators**: Using template defaults, may need enhancement
3. **Skip Links**: Not implemented yet (template doesn't include)
4. **ARIA Live Regions**: Not needed for static content

## Manual Testing Checklist

- [ ] Test with NVDA screen reader (Windows)
- [ ] Test with JAWS screen reader (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Verify keyboard navigation (Tab, Shift+Tab, Enter, Esc)
- [ ] Check color contrast with Lighthouse
- [ ] Test with browser zoom (200%, 400%)
- [ ] Verify responsive design on mobile devices
- [ ] Test form submission and validation

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://www.deque.com/axe/)
- [pa11y Documentation](https://pa11y.org/)
- [WebAIM Resources](https://webaim.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Support

For accessibility issues or questions, please:
1. Check existing GitHub issues
2. Review WCAG 2.1 guidelines
3. Run automated tests locally
4. Create a new issue with details and screenshots
