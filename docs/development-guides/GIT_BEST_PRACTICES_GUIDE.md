# Git Best Practices Guide

> **📋 Document Scope: MP Barbosa Projects - Canonical Reference**
> This is the **canonical version** of Git best practices for all MP Barbosa projects.
> **Submodule Versions**: Each submodule may have a project-specific customization in their repository.
> **See Also**: [src/submodules/README.md](/src/submodules/README.md) for submodule-specific guidance.

## Overview

This guide establishes best practices for Git operations in MP Barbosa projects, ensuring proper version control, file history preservation, and clear change tracking across all repositories and submodules.

## Table of Contents

1. [File Operations](#file-operations)
2. [Commit Best Practices](#commit-best-practices)
3. [Branch Management](#branch-management)
4. [Submodule Management](#submodule-management)
5. [Collaboration Guidelines](#collaboration-guidelines)
6. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
7. [Quick Reference Commands](#quick-reference-commands)

## File Operations

### Moving and Renaming Files

**❌ WRONG: Using system `mv` command**
```bash
# This breaks git history tracking
mv old-file.md new-file.md
git add -A
git commit -m "Rename file"
```

**✅ CORRECT: Using `git mv` command**
```bash
# This preserves git history and tracks the move properly
git mv old-file.md new-file.md
git commit -m "rename: Move old-file.md to new-file.md for better organization"
```

### Why `git mv` is Superior

1. **Preserves File History**: Git can track that the file was moved, not deleted and recreated
2. **Better Diff Display**: Shows as a rename operation, not deletion + addition
3. **Cleaner Git Log**: History follows the file through its moves
4. **Automatic Staging**: The move operation is automatically staged
5. **Atomic Operation**: Move and stage happen together, reducing errors

### File Organization Operations

**Moving files between directories:**
```bash
# Create target directory if needed
mkdir -p docs/architecture

# Move files with git mv
git mv src/old-doc.md docs/architecture/new-doc.md
git mv src/another-doc.md docs/architecture/

# Commit the reorganization
git commit -m "docs: Reorganize documentation structure

- Move old-doc.md to docs/architecture/new-doc.md
- Move another-doc.md to docs/architecture/
- Improve documentation discoverability"
```

**Batch file operations:**
```bash
# Move multiple files at once
git mv docs/file1.md .github/
git mv docs/file2.md .github/
git mv docs/file3.md .github/

# Or use a loop for many files
for file in docs/guidelines/*.md; do
    git mv "$file" .github/
done

git commit -m "docs: Move guideline files from docs/ to .github/

- Consolidate contributor guidelines in .github/ directory
- Separate project documentation from contribution guidelines
- Improve repository organization"
```

### Deleting Files

**✅ CORRECT: Using `git rm`**
```bash
# Remove file from both working directory and git
git rm obsolete-file.md

# Remove file from git but keep in working directory
git rm --cached sensitive-file.txt

# Force remove (if file has uncommitted changes)
git rm -f problematic-file.md
```

## Commit Best Practices

### Commit Message Format

Follow the conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `rename`: File/directory renaming or moving
- `remove`: File/directory removal

**Examples:**
```bash
# Simple rename
git commit -m "rename: Move CONTRIBUTING.md to .github/ for better visibility"

# Complex reorganization
git commit -m "docs: Reorganize JavaScript best practices documentation

- Move ES6 guides from docs/ to .github/
- Consolidate all coding standards in contributor guidelines
- Update INDEX.md with new file locations
- Improve separation between project docs and dev guidelines

Closes #123"
```

### Staging Best Practices

**Check what you're committing:**
```bash
# Review staged changes
git diff --staged

# Review file status
git status

# Add specific files
git add path/to/specific/file.md

# Add all changes (use with caution)
git add -A
```

## Branch Management

### Branch Naming Conventions

```bash
# Feature branches
git checkout -b feature/add-logging-controls
git checkout -b feature/improve-documentation-structure

# Bug fix branches
git checkout -b fix/speech-queue-error-handling
git checkout -b hotfix/critical-security-patch

# Documentation branches
git checkout -b docs/reorganize-best-practices
git checkout -b docs/add-git-guidelines
```

### Safe Branch Operations

```bash
# Create and switch to new branch
git checkout -b docs/reorganize-structure

# Make your changes using git mv, git rm, etc.
git mv docs/guidelines/* .github/
git commit -m "docs: Move guidelines to .github/"

# Push new branch
git push origin docs/reorganize-structure

# Switch back to main when done
git checkout main
```

## Submodule Management

### Updating Submodules After File Operations

When you move files in a submodule, you need to update the parent repositories:

```bash
# 1. In the submodule (e.g., guia_js)
cd src/submodules/guia_turistico/src/libs/guia_js
git mv docs/file.md .github/file.md
git commit -m "docs: Move file.md to .github/"
git push origin main

# 2. In the intermediate repository (e.g., guia_turistico)
cd ../../..  # Go to guia_turistico root
git add src/libs/guia_js
git commit -m "Update guia_js submodule with documentation reorganization"
git push origin main

# 3. In the main repository
cd ../../../..  # Go to main repository root
git add src/submodules/guia_turistico
git commit -m "Update guia_turistico submodule with latest changes"
git push origin main
```

### Submodule File Organization Workflow

```bash
# Complete workflow for submodule file reorganization
#!/bin/bash

# Navigate to submodule
cd src/submodules/guia_turistico/src/libs/guia_js

# Perform file operations with git mv
git mv docs/JAVASCRIPT_BEST_PRACTICES.md .github/
git mv docs/CODING_STANDARDS.md .github/
git rm docs/obsolete-file.md

# Update documentation references
# Edit INDEX.md or other files to reflect new paths

# Commit submodule changes
git add -A
git commit -m "docs: Reorganize documentation structure

- Move JavaScript guidelines to .github/
- Remove obsolete documentation
- Update cross-references for new file locations"

# Push submodule changes
git push origin main

# Update parent repositories
cd ../../..  # guia_turistico
git add src/libs/guia_js
git commit -m "Update guia_js submodule with documentation improvements"
git push origin main

cd ../../../..  # main repository
git add src/submodules/guia_turistico
git commit -m "Sync guia_turistico submodule with latest documentation"
git push origin main
```

## Collaboration Guidelines

### Before Making Changes

```bash
# Always sync with remote before major reorganizations
git fetch origin
git pull origin main

# Check if anyone else has pending changes
git log --oneline origin/main..HEAD
```

### After File Operations

```bash
# Verify your changes
git status
git log --oneline -5
git diff HEAD~1

# Check that moved files preserved history
git log --follow path/to/moved-file.md
```

## Common Pitfalls and Solutions

### Problem: Used `mv` instead of `git mv`

**Solution:**
```bash
# If you already used mv but haven't committed:
git add -A
git status  # Will show as deleted + new file

# To fix this, reset and use git mv:
git reset HEAD
git mv old/location/file.md new/location/file.md
git commit -m "rename: Move file.md to new location"

# If you already committed with mv:
# The history is broken, but you can add a note in the commit:
git commit --amend -m "rename: Move file.md to new location

Note: File history may be broken due to using mv instead of git mv"
```

### Problem: Large File Reorganization

**Solution:**
```bash
# Break into logical commits
git mv docs/javascript/* .github/javascript/
git commit -m "rename: Move JavaScript documentation to .github/"

git mv docs/testing/* .github/testing/
git commit -m "rename: Move testing documentation to .github/"

# Update references in separate commit
# Edit INDEX.md and other files
git add docs/INDEX.md
git commit -m "docs: Update INDEX.md with new file locations"
```

### Problem: Conflicting File Moves

**Solution:**
```bash
# If someone else moved files while you were working:
git fetch origin
git status

# If conflicts occur:
git merge origin/main
# Resolve conflicts manually
git add -A
git commit -m "resolve: Merge remote file reorganization changes"
```

## Quick Reference Commands

### File Operations
```bash
# Move/rename files
git mv old-name.md new-name.md
git mv file.md new-directory/

# Remove files
git rm file.md
git rm --cached file.md  # Remove from git but keep locally

# Batch operations
for file in docs/*.md; do git mv "$file" .github/; done
```

### Checking Changes
```bash
# See what files were moved/renamed
git status
git diff --staged --name-status

# Follow file history through renames
git log --follow path/to/file.md

# See rename detection in log
git log --stat -M
```

### Committing
```bash
# Good commit messages for file operations
git commit -m "rename: Move file.md to better location"
git commit -m "docs: Reorganize documentation structure"
git commit -m "remove: Delete obsolete configuration files"
```

### Submodule Updates
```bash
# Update submodule reference in parent
git add path/to/submodule
git commit -m "Update submodule with file reorganization"

# Update all submodules to latest
git submodule update --remote --merge
```

## Integration with Development Workflow

### Pre-commit Checklist

Before committing file reorganization:

- [ ] Used `git mv` instead of `mv`
- [ ] Used `git rm` instead of `rm`
- [ ] Updated documentation references
- [ ] Tested that links still work
- [ ] Verified file history is preserved with `git log --follow`
- [ ] Wrote descriptive commit message
- [ ] Updated submodule references if applicable

### Automation Scripts

Create a script for common reorganization tasks:

```bash
#!/bin/bash
# File: scripts/reorganize-docs.sh

set -e  # Exit on error

echo "Starting documentation reorganization..."

# Move files with git mv
git mv docs/javascript-*.md .github/
git mv docs/testing-*.md .github/

# Update references
sed -i 's|docs/javascript-|.github/javascript-|g' docs/INDEX.md
sed -i 's|docs/testing-|.github/testing-|g' docs/INDEX.md

# Stage reference updates
git add docs/INDEX.md

echo "File reorganization complete. Ready to commit."
echo "Run: git commit -m 'docs: Reorganize documentation structure'"
```

## Conclusion

Following these Git best practices ensures:

- **Clean History**: File moves are properly tracked
- **Better Collaboration**: Changes are clear to team members
- **Easier Debugging**: History is preserved through renames
- **Professional Standards**: Consistent with industry best practices

Always remember: **Use `git mv` for moves, `git rm` for deletions, and write clear commit messages describing the reorganization rationale.**

---

**Last Updated**: October 20, 2025
**Author**: MP Barbosa
**Version**: 1.0.0