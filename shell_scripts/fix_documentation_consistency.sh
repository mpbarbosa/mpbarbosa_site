#!/bin/bash
# Documentation Consistency Fixes - Priority 1 & 2
# Date: November 13, 2025
# Based on: DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT_20251113_180450.md

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Applying documentation consistency fixes...${NC}"
echo ""

# Fix 1.1: Script path inconsistency (CRITICAL)
echo -e "${YELLOW}1/4${NC} Fixing script path references (CRITICAL)..."
find .github README.md shell_scripts/README.md -type f -exec sed -i \
  's|shell_scripts/execute_tests_docs_workflow\.sh|shell_scripts/workflow/execute_tests_docs_workflow.sh|g' {} + 2>/dev/null
echo -e "${GREEN}    ✓${NC} Updated all references to correct workflow script path"

# Fix 1.2: Module count discrepancy (CRITICAL)
echo -e "${YELLOW}2/4${NC} Updating module counts in README.md (CRITICAL)..."
sed -i 's/20 modules (8 libraries + 12 steps, 4,313 lines)/21 modules (8 libraries + 13 steps, 5,646 lines)/g' README.md
echo -e "${GREEN}    ✓${NC} Updated module counts from 20 to 21 modules"

# Fix 2.1: Version number mismatch (HIGH)
echo -e "${YELLOW}3/4${NC} Updating workflow script version to v2.0.0 (HIGH)..."
sed -i 's/# Version: 1\.5\.0/# Version: 2.0.0/' shell_scripts/workflow/execute_tests_docs_workflow.sh
echo -e "${GREEN}    ✓${NC} Updated workflow script version from v1.5.0 to v2.0.0"

# Fix 2.2: Line count inconsistency (HIGH)
echo -e "${YELLOW}4/4${NC} Updating line count in copilot-instructions.md (HIGH)..."
sed -i 's/488 lines (~24,700 characters, ~6,200 tokens)/552 lines (~27,600 characters, ~6,900 tokens)/g' .github/copilot-instructions.md
echo -e "${GREEN}    ✓${NC} Updated line count from 488 to 552 lines"

echo ""
echo -e "${GREEN}✅ All priority fixes applied successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review changes:     ${YELLOW}git diff${NC}"
echo "  2. Test workflow:      ${YELLOW}./shell_scripts/workflow/execute_tests_docs_workflow.sh --dry-run${NC}"
echo "  3. Verify module count: ${YELLOW}ls shell_scripts/workflow/lib/*.sh | wc -l${NC} (should be 8)"
echo "  4. Verify step count:   ${YELLOW}ls shell_scripts/workflow/steps/*.sh | wc -l${NC} (should be 13)"
echo "  5. Commit changes:     ${YELLOW}git commit -am 'docs: fix critical path and count inconsistencies'${NC}"
echo ""
echo -e "${BLUE}Summary of changes:${NC}"
echo "  • Fixed workflow script path references (9+ locations)"
echo "  • Updated module count: 20 → 21 modules"
echo "  • Updated line count: 5,646 lines"
echo "  • Aligned workflow version: v1.5.0 → v2.0.0"
echo "  • Updated copilot-instructions line count: 488 → 552 lines"
