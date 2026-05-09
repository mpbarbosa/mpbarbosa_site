#!/bin/bash

# External Links Validation Script
# Validates that all external links follow the policy of opening in new tabs
# with proper security attributes (target="_blank" rel="noopener noreferrer")
# Version: 1.1.5

set -euo pipefail

VERSION="1.1.5"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SEARCH_DIRS=("src/index.html" "src/components" "src/pages" "src/submodules/*/src/*.html")
ISSUES_FOUND=0

echo -e "${BLUE}=== External Links Policy Validation ===${NC}\n"

# Function to check external links in a file
check_file() {
    local file="$1"
    
    # Find external links (http/https) that are anchor tags
    # Exclude <link> tags as they don't need target="_blank"
    external_links=$(grep -n '<a[^>]*href="http' "$file" 2>/dev/null || true)
    
    if [ -z "$external_links" ]; then
        return 0
    fi
    
    echo -e "${YELLOW}Checking: $file${NC}"
    
    # Check each external link
    while IFS= read -r line; do
        line_num=$(echo "$line" | cut -d: -f1)
        content=$(echo "$line" | cut -d: -f2-)
        
        # Check if it has target="_blank"
        if ! echo "$content" | grep -q 'target="_blank"'; then
            echo -e "${RED}  ❌ Line $line_num: Missing target=\"_blank\"${NC}"
            echo -e "     $content"
            ((ISSUES_FOUND++))
        # Check if it has rel="noopener noreferrer"
        elif ! echo "$content" | grep -q 'rel="noopener'; then
            echo -e "${RED}  ❌ Line $line_num: Missing rel=\"noopener noreferrer\"${NC}"
            echo -e "     $content"
            ((ISSUES_FOUND++))
        else
            echo -e "${GREEN}  ✅ Line $line_num: Compliant${NC}"
        fi
    done <<< "$external_links"
    
    echo ""
}

# Main validation loop
echo -e "${BLUE}Scanning HTML files...${NC}\n"

# Check main index.html
if [ -f "src/index.html" ]; then
    check_file "src/index.html"
fi

# Check components
if ls src/components/*.html 1> /dev/null 2>&1; then
    for file in src/components/*.html; do
        [ -f "$file" ] && check_file "$file"
    done
fi

# Check pages
if ls src/pages/*.html 1> /dev/null 2>&1; then
    for file in src/pages/*.html; do
        [ -f "$file" ] && check_file "$file"
    done
fi

# Check submodules
if ls src/submodules/*/src/*.html 1> /dev/null 2>&1; then
    for file in src/submodules/*/src/*.html; do
        [ -f "$file" ] && check_file "$file"
    done
fi

# Summary
echo -e "${BLUE}=== Validation Summary ===${NC}"
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ All external links are compliant!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ISSUES_FOUND issue(s) that need fixing${NC}"
    echo -e "${YELLOW}Please review and apply the correct attributes:${NC}"
    echo -e "  target=\"_blank\" rel=\"noopener noreferrer\""
    exit 1
fi
