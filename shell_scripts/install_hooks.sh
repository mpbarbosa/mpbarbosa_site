#!/bin/bash
# Hook Installation Script
# Installs Git hooks for automated testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_SOURCE="$PROJECT_ROOT/.git-hooks"
HOOKS_TARGET="$PROJECT_ROOT/.git/hooks"

echo "🔧 Installing Git hooks..."
echo ""

# Check if .git directory exists
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo "❌ Error: Not a Git repository"
  echo "   Run this script from the project root"
  exit 1
fi

# Create hooks directory if needed
mkdir -p "$HOOKS_TARGET"

# Install pre-commit hook
if [ -f "$HOOKS_SOURCE/pre-commit" ]; then
  cp "$HOOKS_SOURCE/pre-commit" "$HOOKS_TARGET/pre-commit"
  chmod +x "$HOOKS_TARGET/pre-commit"
  echo "✅ Installed: pre-commit"
else
  echo "⚠️  Warning: pre-commit hook not found"
fi

# Install pre-push hook
if [ -f "$HOOKS_SOURCE/pre-push" ]; then
  cp "$HOOKS_SOURCE/pre-push" "$HOOKS_TARGET/pre-push"
  chmod +x "$HOOKS_TARGET/pre-push"
  echo "✅ Installed: pre-push"
else
  echo "⚠️  Warning: pre-push hook not found"
fi

echo ""
echo "🎉 Git hooks installation complete!"
echo ""
echo "Installed hooks:"
ls -lh "$HOOKS_TARGET" | grep -E "(pre-commit|pre-push)" || echo "   No hooks found"
echo ""
echo "📖 See .git-hooks/README.md for usage details"
echo ""
echo "To bypass hooks (not recommended):"
echo "   git commit --no-verify"
echo "   git push --no-verify"
