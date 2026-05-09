# JSDoc Style Guide

**Version**: 1.1.6  
**Date**: 2025-12-25  
**Status**: Canonical Reference for MP Barbosa Projects

> **📋 Document Scope**
> This is the **canonical style guide** for JSDoc documentation across all MP Barbosa projects.
> Consistent documentation improves code maintainability, IDE support, and developer experience.

## Table of Contents

1. [Overview](#overview)
2. [Required Tags](#required-tags)
3. [Recommended Tags](#recommended-tags)
4. [Code Examples](#code-examples)
5. [Best Practices](#best-practices)
6. [ESLint Integration](#eslint-integration)
7. [IDE Integration](#ide-integration)
8. [Validation Tools](#validation-tools)

---

## Overview

JSDoc is a markup language used to annotate JavaScript source code files. This guide establishes standards for documenting functions, classes, modules, and other code constructs across all MP Barbosa projects.

### Benefits

- **IDE Support**: IntelliSense, autocomplete, and inline documentation
- **Type Safety**: Better type checking even without TypeScript
- **Documentation Generation**: Automatic API documentation
- **Code Maintainability**: Clear contracts for functions and modules
- **Developer Experience**: Faster onboarding and understanding

### When to Use JSDoc

✅ **Always Document**:
- Public functions and methods
- Exported modules and classes
- Complex algorithms or business logic
- API endpoints and data transformations

⚠️ **Optional Documentation**:
- Self-explanatory private helper functions
- Simple getters/setters
- Test utility functions (unless complex)

❌ **Don't Over-Document**:
- Obvious implementations (e.g., `getName()` returning name)
- Auto-generated code
- Deprecated/legacy code scheduled for removal

---

## Required Tags

### @param

Documents function parameters.

**Syntax**:
```javascript
@param {Type} parameterName - Description
@param {Type} [optionalParam] - Optional parameter
@param {Type} [paramWithDefault=defaultValue] - Parameter with default
```

**Examples**:
```javascript
/**
 * Validates user input and returns sanitized data
 * @param {string} input - Raw user input to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.strict=false] - Use strict validation rules
 * @param {number} [options.maxLength=255] - Maximum input length
 * @returns {string} Sanitized input string
 */
function validateInput(input, options = {}) {
  const { strict = false, maxLength = 255 } = options;
  // Implementation
}
```

### @returns (or @return)

Documents return values.

**Syntax**:
```javascript
@returns {Type} Description of return value
@returns {Type|null} Description (can return multiple types)
```

**Examples**:
```javascript
/**
 * Fetches user data from API
 * @param {number} userId - User identifier
 * @returns {Promise<Object>} User data object
 * @throws {Error} If user not found or API error
 */
async function fetchUser(userId) {
  // Implementation
}

/**
 * Finds element by ID
 * @param {string} id - Element identifier
 * @returns {HTMLElement|null} Element if found, null otherwise
 */
function findElement(id) {
  return document.getElementById(id);
}
```

### @throws (or @exception)

Documents exceptions that may be thrown.

**Syntax**:
```javascript
@throws {ErrorType} Description of when error is thrown
```

**Examples**:
```javascript
/**
 * Parses JSON string to object
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed JavaScript object
 * @throws {SyntaxError} If JSON string is malformed
 */
function parseJSON(jsonString) {
  return JSON.parse(jsonString);
}

/**
 * Validates required configuration
 * @param {Object} config - Configuration object
 * @throws {TypeError} If config is not an object
 * @throws {Error} If required fields are missing
 */
function validateConfig(config) {
  if (typeof config !== 'object') {
    throw new TypeError('Config must be an object');
  }
  // More validation
}
```

---

## Recommended Tags

### @description

Detailed description (usually first paragraph serves this purpose).

```javascript
/**
 * @description
 * Complex function that processes user data through multiple stages:
 * 1. Validation
 * 2. Transformation
 * 3. Persistence
 * 
 * @param {Object} userData - Raw user data
 * @returns {Promise<boolean>} True if successful
 */
async function processUserData(userData) {
  // Implementation
}
```

### @example

Provides usage examples.

```javascript
/**
 * Formats currency value for display
 * @param {number} amount - Amount in cents
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} Formatted currency string
 * @example
 * formatCurrency(1234) // Returns "$12.34"
 * @example
 * formatCurrency(5678, 'EUR') // Returns "€56.78"
 */
function formatCurrency(amount, currency = 'USD') {
  // Implementation
}
```

### @see

Links to related functions or documentation.

```javascript
/**
 * Validates email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 * @see {@link validatePhone} for phone validation
 * @see https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 */
function validateEmail(email) {
  // Implementation
}
```

### @deprecated

Marks deprecated code.

```javascript
/**
 * @deprecated Since v2.0.0 - Use {@link fetchUserData} instead
 * Legacy function for backward compatibility only
 * @param {number} id - User ID
 * @returns {Object|null} User data
 */
function getUserById(id) {
  console.warn('getUserById is deprecated, use fetchUserData');
  return fetchUserData(id);
}
```

### @since

Indicates when functionality was added.

```javascript
/**
 * Batch processes multiple users
 * @since 2.1.0
 * @param {Array<Object>} users - Array of user objects
 * @returns {Promise<Array<Object>>} Processed users
 */
async function batchProcessUsers(users) {
  // Implementation
}
```

### @type

Documents variable types.

```javascript
/** @type {string} */
const API_ENDPOINT = 'https://api.example.com';

/** @type {Array<number>} */
const userIds = [1, 2, 3, 4, 5];

/** @type {{name: string, age: number}} */
const user = { name: 'John', age: 30 };
```

---

## Code Examples

### Functions

```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price before tax
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.round=true] - Round to 2 decimal places
 * @returns {number} Total price with tax applied
 * @throws {TypeError} If price or taxRate is not a number
 * @example
 * calculateTotal(100, 0.08) // Returns 108.00
 */
function calculateTotal(price, taxRate, options = {}) {
  if (typeof price !== 'number' || typeof taxRate !== 'number') {
    throw new TypeError('Price and tax rate must be numbers');
  }
  
  const { round = true } = options;
  const total = price * (1 + taxRate);
  
  return round ? Math.round(total * 100) / 100 : total;
}
```

### Classes

```javascript
/**
 * User data model with validation
 * @class
 * @example
 * const user = new User('john@example.com');
 * user.setName('John Doe');
 */
class User {
  /**
   * Creates a new User instance
   * @param {string} email - User email address
   * @throws {Error} If email is invalid
   */
  constructor(email) {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email address');
    }
    
    /** @private @type {string} */
    this._email = email;
    
    /** @private @type {string|null} */
    this._name = null;
  }
  
  /**
   * Gets user email
   * @returns {string} User email address
   */
  getEmail() {
    return this._email;
  }
  
  /**
   * Sets user name
   * @param {string} name - User full name
   * @throws {TypeError} If name is not a string
   */
  setName(name) {
    if (typeof name !== 'string') {
      throw new TypeError('Name must be a string');
    }
    this._name = name;
  }
  
  /**
   * Validates email format
   * @private
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### Modules

```javascript
/**
 * @module utils/validation
 * @description
 * Validation utilities for form inputs, API data, and user input.
 * Provides comprehensive validation functions with detailed error messages.
 * 
 * @example
 * import { validateEmail, validatePhone } from './utils/validation.js';
 * 
 * if (validateEmail(input)) {
 *   console.log('Valid email');
 * }
 */

/**
 * Validates email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email) {
  // Implementation
}

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @param {string} [country='US'] - Country code for format
 * @returns {boolean} True if valid phone format
 */
export function validatePhone(phone, country = 'US') {
  // Implementation
}
```

### Async Functions

```javascript
/**
 * Fetches and processes hotel vacancy data
 * @async
 * @param {string} hotelId - Hotel identifier
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @returns {Promise<Object>} Vacancy data with availability
 * @returns {Promise<Object>} result - Result object
 * @returns {boolean} result.available - Room availability status
 * @returns {number} result.roomsAvailable - Number of available rooms
 * @returns {number} result.price - Price per night in cents
 * @throws {Error} If hotel not found
 * @throws {ValidationError} If dates are invalid
 * @example
 * const vacancy = await checkVacancy('hotel-123', checkIn, checkOut);
 * console.log(vacancy.available); // true/false
 */
async function checkVacancy(hotelId, checkIn, checkOut) {
  // Implementation
}
```

### Callbacks

```javascript
/**
 * Processes items with callback
 * @param {Array<*>} items - Items to process
 * @param {Function} callback - Callback for each item
 * @param {*} callback.item - Current item
 * @param {number} callback.index - Item index
 * @param {Array} callback.array - Original array
 * @returns {Array<*>} Processed items
 * @example
 * processItems([1, 2, 3], (item) => item * 2) // Returns [2, 4, 6]
 */
function processItems(items, callback) {
  return items.map(callback);
}
```

---

## Best Practices

### 1. Be Concise but Clear

✅ **Good**:
```javascript
/**
 * Validates user age
 * @param {number} age - Age in years
 * @returns {boolean} True if age is valid (18-120)
 */
```

❌ **Bad** (too verbose):
```javascript
/**
 * This function is used to validate whether the provided age
 * is within acceptable bounds for the system, specifically checking
 * if the age is greater than or equal to 18 and less than or equal to 120
 * @param {number} age - The age of the user in years
 * @returns {boolean} Returns true if valid, false otherwise
 */
```

### 2. Document the Contract, Not the Implementation

✅ **Good**:
```javascript
/**
 * Fetches user data from cache or API
 * @param {number} userId - User identifier
 * @returns {Promise<Object>} User data
 */
```

❌ **Bad**:
```javascript
/**
 * First checks Redis cache for user, if not found makes HTTP GET
 * request to /api/users/:id endpoint, parses JSON response
 * @param {number} userId - User identifier
 * @returns {Promise<Object>} User data
 */
```

### 3. Use Specific Types

✅ **Good**:
```javascript
/**
 * @param {Array<string>} tags - Array of tag strings
 * @param {{maxLength: number, allowDuplicates: boolean}} options
 * @returns {HTMLElement} Rendered tag list element
 */
```

❌ **Bad**:
```javascript
/**
 * @param {*} tags - Tags
 * @param {Object} options - Options
 * @returns {*} Element
 */
```

### 4. Document Edge Cases

```javascript
/**
 * Divides two numbers
 * @param {number} dividend - Number to divide
 * @param {number} divisor - Number to divide by
 * @returns {number} Result of division
 * @throws {Error} If divisor is zero
 * @example
 * divide(10, 2) // Returns 5
 * divide(10, 0) // Throws Error: Division by zero
 */
function divide(dividend, divisor) {
  if (divisor === 0) {
    throw new Error('Division by zero');
  }
  return dividend / divisor;
}
```

### 5. Keep Documentation Updated

When code changes, **update the JSDoc immediately**. Outdated documentation is worse than no documentation.

---

## ESLint Integration

### Install JSDoc Plugin

```bash
npm install --save-dev eslint-plugin-jsdoc
```

### Configure ESLint (.eslintrc.js or eslint.config.js)

```javascript
// eslint.config.js (ESLint 9+)
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    plugins: {
      jsdoc
    },
    rules: {
      // Require JSDoc for exported functions
      'jsdoc/require-jsdoc': ['warn', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        }
      }],
      
      // Require param descriptions
      'jsdoc/require-param-description': 'warn',
      
      // Require return documentation
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-returns-description': 'warn',
      
      // Check param names match
      'jsdoc/check-param-names': 'error',
      
      // Check types are valid
      'jsdoc/check-types': 'warn',
      
      // Require @throws for functions that throw
      'jsdoc/require-throws': 'warn'
    }
  }
];
```

### Run Linting

```bash
# Check JSDoc compliance
npm run lint

# Auto-fix where possible
npm run lint:fix
```

---

## IDE Integration

### Visual Studio Code

JSDoc support is built-in. Hover over functions to see documentation.

**Settings** (.vscode/settings.json):
```json
{
  "javascript.suggest.jsdoc.generateReturns": true,
  "typescript.suggest.jsdoc.generateReturns": true
}
```

**Extensions**:
- Document This (auto-generates JSDoc)
- JSDoc Generator
- Better Comments

### JetBrains IDEs (WebStorm, IntelliJ)

Built-in JSDoc support with autocomplete.

**Generate JSDoc**: Place cursor above function, type `/**` and press Enter

---

## Validation Tools

### 1. JSDoc CLI (Documentation Generation)

```bash
# Install
npm install --save-dev jsdoc

# Generate documentation
npx jsdoc src/**/*.js -d docs/api

# With configuration
npx jsdoc -c jsdoc.json
```

**jsdoc.json**:
```json
{
  "source": {
    "include": ["src"],
    "includePattern": ".+\\.js(doc|x)?$",
    "excludePattern": "(node_modules|docs|coverage)"
  },
  "opts": {
    "destination": "./docs/api",
    "recurse": true
  }
}
```

### 2. Documentation.js

Alternative to JSDoc with better output:

```bash
npm install --save-dev documentation

# Generate HTML docs
npx documentation build src/** -f html -o docs/api

# Generate Markdown
npx documentation build src/** -f md > docs/API.md
```

### 3. TypeScript Check (Type Safety)

Use TypeScript to check JSDoc types without converting to TypeScript:

```bash
# In package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit --allowJs --checkJs src/**/*.js"
  }
}
```

---

## Quick Reference

### Common Patterns

```javascript
// Simple function
/** @param {string} name @returns {string} */
function greet(name) { return `Hello, ${name}`; }

// With options object
/** @param {{max: number, min: number}} [range] */
function clamp(value, range = {}) { }

// Multiple return types
/** @returns {string|null} */
function findName() { }

// Array types
/** @param {Array<number>} ids */
function processIds(ids) { }

// Promise
/** @returns {Promise<User>} */
async function getUser() { }

// Union types
/** @param {string|number} id */
function formatId(id) { }

// Destructured params
/**
 * @param {Object} options
 * @param {string} options.name
 * @param {number} options.age
 */
function createUser({ name, age }) { }
```

---

## Resources

### Official Documentation
- [JSDoc Official](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html#jsdoc)

### Tools
- [ESLint JSDoc Plugin](https://github.com/gajus/eslint-plugin-jsdoc)
- [Documentation.js](https://documentation.js.org/)
- [JSDoc CLI](https://jsdoc.app/about-commandline.html)

### Related MP Barbosa Guides
- [JavaScript Best Practices](./JAVASCRIPT_BEST_PRACTICES.md) (if exists)
- [Git Best Practices](./GIT_BEST_PRACTICES_GUIDE.md)
- [Testing Guide](../testing-qa/README.md)

---

**Last Updated**: 2025-12-25  
**Version**: 1.1.6  
**Maintained By**: MP Barbosa Projects Team
