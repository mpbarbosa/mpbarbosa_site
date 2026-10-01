# Test Coverage Analysis & Gaps Report

**Date**: 2025-12-25  
**Project**: MP Barbosa Personal Website  
**Test Status**: 235 passing / 12 failing / 247 total (95.1% pass rate)  
**Coverage Status**: ⚠️ **BROKEN** - Cannot collect coverage metrics

---

## 🔴 Critical Issue: Coverage Collection Failure

### Problem Description

Jest coverage instrumentation fails with `TypeError [ERR_INVALID_ARG_TYPE]` when attempting to collect code coverage:

```
Failed to collect coverage from scripts/main.js, main.mjs, InitializationUtilities.js
ERROR: The "original" argument must be of type function. Received an instance of Object
```

### Error Details

**Error Stack**:
```
TypeError [ERR_INVALID_ARG_TYPE]: The "original" argument must be of type function. 
Received an instance of Object
    at promisify (node:internal/util:464:3)
    at Object.<anonymous> (/home/mpb/Documents/GitHub/mpbarbosa_site/src/node_modules/test-exclude/index.js:5:14)
```

**Affected Files**:
- `scripts/main.js`
- `scripts/main.mjs`
- `scripts/initialization/InitializationUtilities.js`

### Root Cause

**Node.js Compatibility Issue**: Node.js v25.2.1 introduces breaking changes in `util.promisify()` that are incompatible with the `test-exclude` package used by Jest coverage instrumentation.

**Package Versions**:
- Node.js: v25.2.1
- Jest: 30.2.0
- test-exclude: Transitively required by Jest

### Impact

**Severity**: 🔴 **HIGH**

**Consequences**:
- ❌ Cannot measure actual code coverage
- ❌ Coverage reports show 0% for all files
- ❌ Cannot identify untested code paths
- ❌ Cannot track coverage improvements over time
- ⚠️ Tests still run and pass/fail correctly

### Workaround Status

**Current Workaround**: None available

**Potential Solutions**:
1. **Downgrade Node.js** to v24.x LTS (not recommended - loses latest features)
2. **Wait for Jest Update** to fix compatibility (timeline unknown)
3. **Fork test-exclude** and patch compatibility (maintenance burden)
4. **Use Alternative Coverage Tool** (Istanbul/NYC directly, requires configuration)

### Recommended Action

**Priority**: 🔴 **HIGH** - Address before next sprint

**Options**:
1. **Monitor Jest Repository**: Watch for v25.2.1 compatibility fix
2. **File Issue**: Report to Jest team if not already reported
3. **Alternative Coverage**: Consider using Istanbul/NYC directly as temporary solution

---

## 📊 Test Coverage Scope

### Current Test Suite Coverage

**Main Project Tests** (src/__tests__/):

| Test File | Target Files | Coverage Status |
|-----------|-------------|-----------------|
| `main.test.js` | scripts/main.js, main.mjs | ✅ Tested |
| `InitializationUtilities.test.js` | scripts/initialization/InitializationUtilities.js | ✅ Tested |
| `documentation.test.js` | Documentation files | ✅ Tested |
| `project_navigation.test.js` | Navigation system | ✅ Tested |
| `shell_scripts.test.js` | Shell scripts | ⚠️ 12 failing tests |
| `sync_to_public.test.js` | Deployment scripts | ✅ Tested |

### Known Coverage Gaps

#### 1. Sibling Projects (Out of Scope)

**Music in Numbers** (`../music_in_numbers/`):
- **JavaScript Files**: 12+ major files (~300KB code)
- **Test Status**: ❌ **NO TESTS IN MAIN PROJECT**
- **Recommendation**: Sibling project should maintain own test suite
- **Reason**: Independent repository, separate responsibility

**Monitora Vagas** (`../monitora_vagas/`):
- **JavaScript Files**: public/js/ modules (guestCounter.js, guestNumberFilter.js, etc.)
- **Test Status**: ❌ **NO TESTS IN MAIN PROJECT**
- **Recommendation**: Sibling project should maintain own test suite
- **Reason**: Independent repository, separate responsibility

**Guia Turístico** (`../guia_js/`):
- **JavaScript Files**: src/libs/guia_js/ library
- **Test Status**: ❌ **NO TESTS IN MAIN PROJECT**
- **Recommendation**: Sibling project should maintain own test suite
- **Reason**: Independent repository, separate responsibility

**Busca Vagas** (`../busca_vagas/`):
- **JavaScript Files**: Backend API service
- **Test Status**: ❌ **NO TESTS IN MAIN PROJECT**
- **Recommendation**: Sibling project should maintain own test suite
- **Reason**: Independent repository, separate responsibility

#### 2. Shell Scripts (Partial Coverage)

**Covered Scripts**:
- ✅ `sync_to_public.sh` - Comprehensive test suite (53 tests)
- ✅ `deploy_to_webserver.sh` - Integration tests
- ✅ Core deployment workflow

**Coverage Gaps**:
- ⚠️ Deprecated scripts (pull_all_submodules.sh, push_all_submodules.sh)
- ⚠️ Utility scripts (cleanup_old_folders.sh, fix_documentation_consistency.sh)
- ⚠️ Workflow automation modules (shell_scripts/workflow/lib/*)

#### 3. HTML5 UP Dimension Template

**Template Files** (src/assets/js/):
- `jquery.min.js` - Third-party library (not tested)
- `browser.min.js` - Template utilities (not tested)
- `breakpoints.min.js` - Template utilities (not tested)
- `util.js` - Template utilities (not tested)

**Status**: ⚠️ **INTENTIONALLY EXCLUDED**
**Reason**: Third-party template code, covered by template's own QA

---

## 📈 Coverage Goals & Recommendations

### Coverage Targets

**Main Project Code**:
- **Target**: 80% statement coverage
- **Current**: Unknown (coverage collection broken)
- **Estimated**: ~70-75% based on test file analysis

**Critical Path Coverage**:
- ✅ Main site initialization
- ✅ Navigation system
- ✅ Deployment scripts (core functionality)
- ⚠️ Documentation validation (partial)

### Recommendations

#### Immediate (Week 1)
1. **Fix Coverage Collection**
   - Monitor Jest updates for Node.js v25.2.1 compatibility
   - Consider alternative coverage tools (Istanbul/NYC)
   - File issue with Jest team if not already reported

2. **Document Out-of-Scope**
   - Formally document sibling project test responsibility
   - Add note in copilot-instructions.md about coverage scope
   - Update testing documentation to clarify boundaries

#### Short-term (Month 1)
3. **Fix Failing Tests**
   - Resolve 12 failing tests in shell_scripts.test.js
   - Update test assertions to match current script content
   - Achieve 100% test pass rate

4. **Expand Shell Script Coverage**
   - Add tests for utility scripts
   - Test deprecated scripts (for regression safety)
   - Increase workflow module coverage

#### Long-term (Quarter 1)
5. **Establish Sibling Project Testing**
   - Each sibling project should have own test suite
   - Document testing requirements in project READMEs
   - Add CI/CD for each sibling project

6. **Coverage Monitoring**
   - Set up automated coverage tracking
   - Add coverage badges to README
   - Establish coverage regression prevention

---

## 🎯 Test Strategy Clarification

### In-Scope for Main Project Tests

**What We Test**:
- ✅ Main site JavaScript (scripts/*)
- ✅ Deployment automation (shell_scripts/)
- ✅ Project navigation and structure
- ✅ Documentation consistency

**Testing Approach**:
- Unit tests for individual functions
- Integration tests for multi-component features
- Shell script tests for deployment workflows

### Out-of-Scope for Main Project Tests

**What We Don't Test**:
- ❌ Sibling project code (independent repositories)
- ❌ Third-party libraries (jQuery, HTML5 UP template)
- ❌ Production server configuration
- ❌ Network/external API behavior

**Rationale**:
- Sibling projects maintain their own test suites
- Third-party code is pre-tested by vendors
- Production configuration is environment-specific
- External dependencies are mocked in tests

---

## 📋 Action Items

### Priority 1: Fix Coverage Collection (HIGH)
- [ ] Monitor Jest repository for Node.js v25.2.1 fix
- [ ] Evaluate alternative coverage tools
- [ ] Consider temporary downgrade to Node.js v24.x LTS
- [ ] Update package.json engines once fixed

### Priority 2: Fix Failing Tests (HIGH)
- [ ] Fix 12 failing tests in shell_scripts.test.js
- [ ] Update test assertions for current script content
- [ ] Achieve 100% test pass rate (247/247)

### Priority 3: Document Scope (MEDIUM)
- [ ] Add coverage scope section to copilot-instructions.md
- [ ] Update testing-qa/README.md with out-of-scope clarification
- [ ] Document sibling project test responsibility

### Priority 4: Expand Coverage (MEDIUM)
- [ ] Add tests for utility scripts
- [ ] Increase workflow module test coverage
- [ ] Test deprecated scripts for regression safety

### Priority 5: Sibling Project Testing (LOW)
- [ ] Document testing requirements for each sibling project
- [ ] Establish CI/CD for sibling projects
- [ ] Create test suite templates for sibling projects

---

## 🔗 Related Documentation

- **[Testing Documentation Index](../docs/testing-qa/README.md)** - Test suite overview
- **[Test Quick Start](../docs/testing-qa/TEST_QUICK_START.md)** - Running tests
- **[Test Failure Troubleshooting](../docs/testing-qa/TEST_FAILURE_TROUBLESHOOTING.md)** - Debugging guide
- **[Code Quality Remediation Plan](../docs/development-guides/CODE_QUALITY_REMEDIATION_PLAN.md)** - Quality improvement roadmap

---

## 📊 Coverage Status Summary

**Current Status**: ⚠️ **COVERAGE COLLECTION BROKEN**

**Known Issues**:
- Node.js v25.2.1 compatibility with test-exclude package
- Cannot measure actual coverage metrics
- 12 failing tests in shell_scripts.test.js

**Test Pass Rate**: 95.1% (235/247 tests passing)

**Estimated Coverage** (based on test file analysis):
- Main site JavaScript: ~70-75% (estimated)
- Deployment scripts: ~85-90% (estimated)
- Documentation validation: ~60-65% (estimated)

**Target Coverage**: 80% for main project code

---

**Last Updated**: 2025-12-25  
**Status**: Active Issue - Requires Resolution  
**Priority**: HIGH - Fix coverage collection before next sprint
