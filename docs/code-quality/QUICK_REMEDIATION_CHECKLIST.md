# Quick Remediation Checklist

**MP Barbosa Personal Website - Code Quality**

**Priority:** Immediate Actions (Week 1)  
**Time Commitment:** 3-6 hours total  
**Goal:** Establish automated code quality baseline

---

## 🚀 Quick Start (30 minutes)

```bash
# Navigate to source directory
cd /home/mpb/Documents/GitHub/mpbarbosa_site/src

# Install all quality tools at once
npm install --save-dev \
  eslint@9.x \
  eslint-config-standard \
  eslint-plugin-jest@28.x \
  @eslint/js \
  globals \
  prettier@3.x \
  eslint-config-prettier \
  husky@9.x \
  lint-staged@15.x
```

---

## ✅ Phase 1: ESLint Setup (60-90 minutes)

### Step 1: Create ESLint Config
```bash
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "prettier"
  ],
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "ignorePatterns": [
    "node_modules/",
    "assets/js/jquery.min.js",
    "assets/js/main.js",
    "assets/js/util.js",
    "assets/webfonts/",
    "submodules/"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-undef": "error"
  }
}
EOF
```

### Step 2: Add ESLint Scripts to package.json
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.mjs",
    "lint:fix": "eslint . --ext .js,.mjs --fix",
    "lint:report": "eslint . --ext .js,.mjs --format json --output-file eslint-report.json"
  }
}
```

### Step 3: Run Initial Lint
```bash
npm run lint
```

### Step 4: Auto-fix Issues
```bash
npm run lint:fix
```

**Checkpoint:** ✅ ESLint should report 0 errors (or list remaining manual fixes needed)

---

## ✅ Phase 2: Prettier Setup (30 minutes)

### Step 1: Create Prettier Config

```bash
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF
```

### Step 2: Create Prettier Ignore
```bash
cat > .prettierignore << 'EOF'
node_modules/
assets/js/jquery.min.js
assets/js/main.js
assets/js/util.js
assets/webfonts/
submodules/
package-lock.json
*.min.js
*.min.css
EOF
```

### Step 3: Add Prettier Scripts to package.json
```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{js,mjs,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,mjs,json,md}\""
  }
}
```

### Step 4: Format Codebase
```bash
npm run format
```

**Checkpoint:** ✅ All files should be formatted consistently

---

## ✅ Phase 3: Pre-commit Hooks (30 minutes)

### Step 1: Initialize Husky
```bash
npx husky init
```

### Step 2: Configure lint-staged in package.json
```json
{
  "lint-staged": {
    "*.{js,mjs}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  },
  "scripts": {
    "prepare": "husky"
  }
}
```

### Step 3: Create Pre-commit Hook
```bash
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd src
npx lint-staged
EOF

chmod +x .husky/pre-commit
```

### Step 4: Test Hook
```bash
# Make a test change
echo "// test comment" >> scripts/main.mjs
git add scripts/main.mjs
git commit -m "test: verify pre-commit hook"
# Hook should auto-format and lint
```

**Checkpoint:** ✅ Git commit should trigger linting and formatting automatically

---

## 📋 Verification Checklist

After completing all phases, verify:

- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run format:check` passes with no changes needed
- [ ] Pre-commit hook triggers on `git commit`
- [ ] Code is auto-formatted before commit
- [ ] ESLint catches errors before commit

---

## 🎯 Expected Results

**Before:**

- ❌ No code quality enforcement
- ❌ Inconsistent formatting
- ❌ Manual code review catches issues

**After:**

- ✅ Automated linting on every commit
- ✅ Consistent formatting across codebase
- ✅ Errors caught before commit
- ✅ Improved code review efficiency

---

## 🚨 Common Issues & Fixes

### Issue: ESLint reports many errors

**Fix:** Run `npm run lint:fix` to auto-fix, then manually fix remaining issues

### Issue: Prettier conflicts with ESLint

**Fix:** Ensure `eslint-config-prettier` is installed and in ESLint extends array

### Issue: Pre-commit hook doesn't run

**Fix:**

```bash
chmod +x .husky/pre-commit
git config core.hooksPath .husky
```

### Issue: Hook runs but doesn't format

**Fix:** Ensure `lint-staged` is configured correctly in package.json

---

## 📊 Success Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| ESLint Errors | 0 | `npm run lint` |
| Format Issues | 0 | `npm run format:check` |
| Pre-commit Hook | Active | Try committing a file |
| Team Adoption | 100% | All commits use hook |

---

## 🔄 Next Steps

After completing Week 1 checklist:

1. **Week 2:** Migrate require() to ES6 imports (see full strategy doc)
2. **Week 3:** Extract configuration constants
3. **Week 4:** Setup CI/CD pipeline

**Full Strategy:** See `CODE_QUALITY_MITIGATION_STRATEGY.md`

---

## 📚 References

- **ESLint Documentation:** https://eslint.org/docs/latest/
- **Prettier Documentation:** https://prettier.io/docs/en/
- **Husky Documentation:** https://typicode.github.io/husky/
- **lint-staged Documentation:** https://github.com/okonet/lint-staged

---

**Last Updated:** December 25, 2025  
**Status:** Ready for Implementation  
**Estimated Time:** 3-6 hours total
