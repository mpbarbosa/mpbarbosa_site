#!/bin/bash

# validate_documentation_consistency.sh
# Automated documentation consistency validation script
# Version: 1.1.1
# Date: 2025-11-14

set -euo pipefail

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}=== Documentation Consistency Validation ===${NC}"
echo ""

# Track issues
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0

# 1. Version Consistency Check
echo -e "${BLUE}[1/7] Checking script versions...${NC}"

if [ -f "$PROJECT_ROOT/shell_scripts/workflow/execute_tests_docs_workflow.sh" ]; then
    WORKFLOW_VERSION=$(grep "^# Version:" "$PROJECT_ROOT/shell_scripts/workflow/execute_tests_docs_workflow.sh" | awk '{print $3}')
    echo -e "  workflow script: ${GREEN}$WORKFLOW_VERSION${NC}"
    
    # Check if docs claim v2.0.0 when script says v1.5.0
    if [ "$WORKFLOW_VERSION" = "v1.5.0" ]; then
        V2_REFS=$(grep -r "execute_tests_docs_workflow.*v2\.0\.0" "$PROJECT_ROOT/.github/copilot-instructions.md" "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/shell_scripts/README.md" 2>/dev/null | wc -l)
        if [ "$V2_REFS" -gt 0 ]; then
            echo -e "  ${RED}❌ CRITICAL: Found $V2_REFS documentation references claiming v2.0.0${NC}"
            CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
        else
            echo -e "  ${GREEN}✅ Version documentation consistent${NC}"
        fi
    fi
else
    echo -e "  ${RED}❌ Script not found${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

if [ -f "$PROJECT_ROOT/shell_scripts/sync_to_public.sh" ]; then
    SYNC_VERSION=$(grep "^# Version:" "$PROJECT_ROOT/shell_scripts/sync_to_public.sh" | awk '{print $3}')
    echo -e "  sync_to_public: ${GREEN}$SYNC_VERSION${NC}"
else
    echo -e "  ${RED}❌ sync_to_public.sh not found${NC}"
    HIGH_ISSUES=$((HIGH_ISSUES + 1))
fi

if [ -f "$PROJECT_ROOT/shell_scripts/deploy_to_webserver.sh" ]; then
    DEPLOY_VERSION=$(grep "^# Version:" "$PROJECT_ROOT/shell_scripts/deploy_to_webserver.sh" | awk '{print $3}')
    echo -e "  deploy_to_webserver: ${GREEN}$DEPLOY_VERSION${NC}"
else
    echo -e "  ${RED}❌ deploy_to_webserver.sh not found${NC}"
    HIGH_ISSUES=$((HIGH_ISSUES + 1))
fi

# 2. Path Validation
echo ""
echo -e "${BLUE}[2/7] Validating script paths...${NC}"

if [ -f "$PROJECT_ROOT/shell_scripts/workflow/execute_tests_docs_workflow.sh" ]; then
    echo -e "  ${GREEN}✅ execute_tests_docs_workflow.sh found in workflow/${NC}"
    
    # Check for incorrect path references in documentation
    WRONG_PATH_REFS=$(grep -r "shell_scripts/execute_tests_docs_workflow\.sh" "$PROJECT_ROOT/.github/copilot-instructions.md" "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/shell_scripts/README.md" 2>/dev/null | grep -v "shell_scripts/workflow/execute_tests_docs_workflow.sh" | wc -l)
    if [ "$WRONG_PATH_REFS" -gt 0 ]; then
        echo -e "  ${RED}❌ HIGH: Found $WRONG_PATH_REFS incorrect path references${NC}"
        HIGH_ISSUES=$((HIGH_ISSUES + 1))
    else
        echo -e "  ${GREEN}✅ All path references correct${NC}"
    fi
else
    echo -e "  ${RED}❌ execute_tests_docs_workflow.sh NOT found in expected location${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

# 3. Command Validation
echo ""
echo -e "${BLUE}[3/7] Validating documented commands...${NC}"

if [ -f "$PROJECT_ROOT/shell_scripts/sync_to_public.sh" ]; then
    if bash -n "$PROJECT_ROOT/shell_scripts/sync_to_public.sh" 2>/dev/null; then
        echo -e "  ${GREEN}✅ sync_to_public.sh syntax valid${NC}"
    else
        echo -e "  ${RED}❌ sync_to_public.sh has syntax errors${NC}"
        HIGH_ISSUES=$((HIGH_ISSUES + 1))
    fi
fi

if [ -f "$PROJECT_ROOT/shell_scripts/deploy_to_webserver.sh" ]; then
    if bash -n "$PROJECT_ROOT/shell_scripts/deploy_to_webserver.sh" 2>/dev/null; then
        echo -e "  ${GREEN}✅ deploy_to_webserver.sh syntax valid${NC}"
    else
        echo -e "  ${RED}❌ deploy_to_webserver.sh has syntax errors${NC}"
        HIGH_ISSUES=$((HIGH_ISSUES + 1))
    fi
fi

if [ -f "$PROJECT_ROOT/shell_scripts/workflow/execute_tests_docs_workflow.sh" ]; then
    if bash -n "$PROJECT_ROOT/shell_scripts/workflow/execute_tests_docs_workflow.sh" 2>/dev/null; then
        echo -e "  ${GREEN}✅ execute_tests_docs_workflow.sh syntax valid${NC}"
    else
        echo -e "  ${RED}❌ execute_tests_docs_workflow.sh has syntax errors${NC}"
        HIGH_ISSUES=$((HIGH_ISSUES + 1))
    fi
fi

# 4. Documentation Reference Count
echo ""
echo -e "${BLUE}[4/7] Checking documentation references...${NC}"

WORKFLOW_REFS=$(grep -r "execute_tests_docs_workflow" "$PROJECT_ROOT/.github/copilot-instructions.md" "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/shell_scripts/README.md" 2>/dev/null | wc -l)
echo -e "  execute_tests_docs_workflow references: ${GREEN}$WORKFLOW_REFS${NC}"

SYNC_REFS=$(grep -r "sync_to_public" "$PROJECT_ROOT/.github/copilot-instructions.md" "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/shell_scripts/README.md" 2>/dev/null | wc -l)
echo -e "  sync_to_public references: ${GREEN}$SYNC_REFS${NC}"

DEPLOY_REFS=$(grep -r "deploy_to_webserver" "$PROJECT_ROOT/.github/copilot-instructions.md" "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/shell_scripts/README.md" 2>/dev/null | wc -l)
echo -e "  deploy_to_webserver references: ${GREEN}$DEPLOY_REFS${NC}"

# 5. File Count Validation
echo ""
echo -e "${BLUE}[5/7] Validating markdown file counts...${NC}"

TOTAL_MD_FILES=$(find "$PROJECT_ROOT" -name "*.md" -type f 2>/dev/null | wc -l)
MAIN_MD_FILES=$(find "$PROJECT_ROOT" -name "*.md" -type f 2>/dev/null | grep -v node_modules | grep -v "\.backups" | grep -v "/submodules/" | wc -l)

echo -e "  Total markdown files: ${GREEN}$TOTAL_MD_FILES${NC}"
echo -e "  Main project (excluding submodules, node_modules, backups): ${GREEN}$MAIN_MD_FILES${NC}"

if [ "$MAIN_MD_FILES" -lt 200 ] || [ "$MAIN_MD_FILES" -gt 250 ]; then
    echo -e "  ${YELLOW}⚠️  MEDIUM: File count ($MAIN_MD_FILES) outside expected range (200-250)${NC}"
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
fi

# 6. Duplicate Documentation Files
echo ""
echo -e "${BLUE}[6/7] Checking for duplicate documentation files...${NC}"

DUPLICATE_PATTERNS=(
    "DIRECTORY_STRUCTURE_VALIDATION_REPORT"
    "DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT"
    "SHELL_SCRIPT_DOCUMENTATION_VALIDATION_REPORT"
)

for pattern in "${DUPLICATE_PATTERNS[@]}"; do
    COUNT=$(find "$PROJECT_ROOT" -maxdepth 1 -name "${pattern}*.md" -type f 2>/dev/null | wc -l)
    if [ "$COUNT" -gt 2 ]; then
        echo -e "  ${YELLOW}⚠️  MEDIUM: Found $COUNT versions of $pattern (recommend cleanup)${NC}"
        MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
    else
        echo -e "  ${GREEN}✅ $pattern: $COUNT file(s)${NC}"
    fi
done

# 7. Package.json Version
echo ""
echo -e "${BLUE}[7/7] Checking package.json version...${NC}"

if [ -f "$PROJECT_ROOT/src/package.json" ]; then
    PKG_VERSION=$(grep '"version"' "$PROJECT_ROOT/src/package.json" | cut -d'"' -f4)
    echo -e "  package.json version: ${GREEN}$PKG_VERSION${NC}"
    
    if [ "$PKG_VERSION" = "1.1.1" ]; then
        echo -e "  ${YELLOW}⚠️  MEDIUM: Consider updating to v2.0.0 given architectural achievements${NC}"
        MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
    fi
else
    echo -e "  ${RED}❌ package.json not found${NC}"
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
fi

# Summary
echo ""
echo -e "${BLUE}=== Validation Summary ===${NC}"
echo ""

TOTAL_ISSUES=$((CRITICAL_ISSUES + HIGH_ISSUES + MEDIUM_ISSUES + LOW_ISSUES))

if [ "$CRITICAL_ISSUES" -gt 0 ]; then
    echo -e "${RED}❌ Critical Issues: $CRITICAL_ISSUES${NC}"
fi

if [ "$HIGH_ISSUES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  High Priority Issues: $HIGH_ISSUES${NC}"
fi

if [ "$MEDIUM_ISSUES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Medium Priority Issues: $MEDIUM_ISSUES${NC}"
fi

if [ "$LOW_ISSUES" -gt 0 ]; then
    echo -e "${BLUE}ℹ️  Low Priority Issues: $LOW_ISSUES${NC}"
fi

if [ "$TOTAL_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✅ All validation checks passed!${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}Total Issues Found: $TOTAL_ISSUES${NC}"
    echo ""
    echo "See docs/DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT_20251114_185320.md for detailed analysis"
    exit 1
fi
