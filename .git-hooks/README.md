# Git Hooks

This directory contains Git hooks for automated testing and validation.

## Available Hooks

### `pre-commit`
Runs Jest test suite before allowing commits.

**Installation**:
```bash
cp .git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Bypass** (not recommended):
```bash
git commit --no-verify -m "Message"
```

### `pre-push`
Runs full test suite with coverage before allowing push.

**Installation**:
```bash
cp .git-hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

**Bypass** (not recommended):
```bash
git push --no-verify
```

## Quick Setup

Install all hooks:
```bash
# From project root
./shell_scripts/install_hooks.sh
```

Or manually:
```bash
cd .git/hooks
ln -sf ../../.git-hooks/pre-commit pre-commit
ln -sf ../../.git-hooks/pre-push pre-push
chmod +x pre-commit pre-push
```

## Hook Behavior

### Pre-commit
- ✅ Runs: `cd src && npm test`
- ⏱️  Duration: ~2-5 seconds
- 🎯 Purpose: Catch broken tests early
- 🔧 Fix: Fix failing tests before committing

### Pre-push
- ✅ Runs: `cd src && npm test`
- ⏱️  Duration: ~2-5 seconds
- 🎯 Purpose: Ensure clean codebase before pushing
- 🔧 Fix: Review test output and fix failures

## Troubleshooting

### Hook not executing
```bash
# Check permissions
ls -l .git/hooks/pre-commit
# Should show: -rwxr-xr-x

# Fix permissions
chmod +x .git/hooks/pre-commit
```

### Hook location wrong
Hooks must be in `.git/hooks/`, not `.git-hooks/`

### Tests fail in hook but pass manually
Check that:
1. You're in project root when committing
2. `src/node_modules` is installed
3. Environment variables are set correctly

## Disabling Hooks

Temporary disable (single commit):
```bash
git commit --no-verify
```

Permanent disable (not recommended):
```bash
rm .git/hooks/pre-commit
rm .git/hooks/pre-push
```

## CI/CD Integration

These hooks mirror the GitHub Actions workflows:
- `.github/workflows/test.yml` - Main test suite
- `.github/workflows/shell-scripts.yml` - Shell validation

Local hooks provide fast feedback before pushing to CI.
