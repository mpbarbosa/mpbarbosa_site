#!/bin/bash
################################################################################
# Step 2: AI-Powered Documentation Consistency Analysis
# Purpose: Check documentation for broken references and consistency issues
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Validates semantic version format (MAJOR.MINOR.PATCH)
# Arguments: $1 - version string to validate
# Returns: 0 if valid semver, 1 if invalid
validate_semver() {
    local version="$1"
    
    # Semantic versioning regex: MAJOR.MINOR.PATCH (optional v prefix)
    if [[ "$version" =~ ^v?([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        return 0
    else
        return 1
    fi
}

# Extracts version numbers from documentation files
# Arguments: $1 - file path
# Returns: Array of version strings found
extract_versions_from_file() {
    local file="$1"
    
    # Extract version patterns: v1.2.3 or 1.2.3
    grep -oP 'v?[0-9]+\.[0-9]+\.[0-9]+' "$file" 2>/dev/null | sort -u || true
}

# Checks version consistency across documentation
# Returns: 0 if consistent, 1 if inconsistencies found
check_version_consistency() {
    local inconsistencies=0
    local version_map_file
    version_map_file=$(mktemp)
    TEMP_FILES+=("$version_map_file")
    
    print_info "Checking semantic version consistency across documentation..."
    
    # Find all markdown files
    while IFS= read -r md_file; do
        local versions
        versions=$(extract_versions_from_file "$md_file")
        
        while IFS= read -r version; do
            [[ -z "$version" ]] && continue
            
            # Validate semver format
            if ! validate_semver "$version"; then
                print_warning "Invalid semantic version format in $md_file: $version"
                echo "$md_file: $version (INVALID FORMAT)" >> "$version_map_file"
                ((inconsistencies++))
            else
                echo "$md_file: $version" >> "$version_map_file"
            fi
        done <<< "$versions"
    done < <(find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" 2>/dev/null || true)
    
    # Check package.json version if exists
    if [[ -f "src/package.json" ]]; then
        local pkg_version
        pkg_version=$(grep -oP '"version":\s*"\K[^"]+' "src/package.json" 2>/dev/null || true)
        
        if [[ -n "$pkg_version" ]]; then
            if ! validate_semver "$pkg_version"; then
                print_warning "Invalid semantic version in package.json: $pkg_version"
                echo "package.json: $pkg_version (INVALID FORMAT)" >> "$version_map_file"
                ((inconsistencies++))
            else
                echo "package.json: $pkg_version" >> "$version_map_file"
            fi
        fi
    fi
    
    # Display version map
    if [[ -s "$version_map_file" ]]; then
        local total_versions
        total_versions=$(wc -l < "$version_map_file")
        print_info "Found $total_versions version reference(s)"
        
        if [[ $inconsistencies -gt 0 ]]; then
            print_warning "Version format issues detected:"
            cat "$version_map_file"
        fi
    fi
    
    return $inconsistencies
}

# Main step function - validates documentation consistency with AI assistance
# Returns: 0 for success, 1 for failure
step2_check_consistency() {
    print_step "2" "Check Documentation Consistency"
    
    cd "$PROJECT_ROOT" || return 1
    
    local issues_found=0
    local broken_refs_file
    broken_refs_file=$(mktemp)
    TEMP_FILES+=("$broken_refs_file")
    
    # PHASE 1: Automated broken link detection
    print_info "Phase 1: Automated broken link detection..."
    
    # Check semantic version consistency
    local version_issues=0
    check_version_consistency || version_issues=$?
    if [[ $version_issues -gt 0 ]]; then
        print_warning "Found $version_issues semantic versioning issue(s)"
        ((issues_found += version_issues))
    else
        print_success "All version numbers follow semantic versioning format ✅"
    fi
    
    # Check docs directory for broken references
    while IFS= read -r md_file; do
        # Extract file paths using regex (paths starting with /)
        local refs
        refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' "$md_file" 2>/dev/null || true)
        
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            
            local full_path="${PROJECT_ROOT}${ref}"
            if [[ ! -e "$full_path" ]]; then
                print_warning "Broken reference in $md_file: $ref"
                echo "$md_file: $ref" >> "$broken_refs_file"
                ((issues_found++))
            fi
        done <<< "$refs"
    done < <(fast_find "docs" "*.md" 5)
    
    # Check README.md
    if [[ -f "README.md" ]]; then
        local refs
        refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' "README.md" 2>/dev/null || true)
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            local full_path="${PROJECT_ROOT}${ref}"
            if [[ ! -e "$full_path" ]]; then
                print_warning "Broken reference in README.md: $ref"
                echo "README.md: $ref" >> "$broken_refs_file"
                ((issues_found++))
            fi
        done <<< "$refs"
    fi
    
    # Check .github/copilot-instructions.md (critical for CI/CD)
    if [[ -f ".github/copilot-instructions.md" ]]; then
        local refs
        refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' ".github/copilot-instructions.md" 2>/dev/null || true)
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            local full_path="${PROJECT_ROOT}${ref}"
            if [[ ! -e "$full_path" ]]; then
                print_warning "Broken reference in .github/copilot-instructions.md: $ref"
                echo ".github/copilot-instructions.md: $ref" >> "$broken_refs_file"
                ((issues_found++))
            fi
        done <<< "$refs"
    fi
    
    # Gather documentation inventory for AI analysis
    local doc_files
    doc_files=$(fast_find "." "*.md" 5 "node_modules" ".git" "coverage" | sort)
    local doc_count
    doc_count=$(echo "$doc_files" | wc -l)
    
    # Build AI prompt using helper function
    local broken_refs_content
    broken_refs_content=$(cat "$broken_refs_file" 2>/dev/null || echo "   No broken references detected")
    
    # Create comprehensive consistency prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step2_consistency_prompt \
        "$doc_count" \
        "${CHANGE_SCOPE}" \
        "${ANALYSIS_MODIFIED}" \
        "$broken_refs_content" \
        "$doc_files")

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Consistency Analysis Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Execute Phase 2 AI analysis using shared library
    execute_phase2_ai_analysis \
        "$copilot_prompt" \
        "2" \
        "consistency_analysis" \
        "Consistency_Analysis" \
        "$issues_found" \
        "documentation consistency analysis" \
        "No broken references found - skipping optional deep analysis" \
        "Did Copilot identify issues that need fixing?"
    
    # Save step results using shared library
    save_step_results \
        "2" \
        "Consistency_Analysis" \
        "$issues_found" \
        "No broken references found in automated checks" \
        "Found ${issues_found} broken references requiring attention. Review and fix broken links before proceeding." \
        "$broken_refs_file" \
        "$doc_count"
    
    update_workflow_status "step2" "✅"
}

# Export step function and helper functions
export -f step2_check_consistency
export -f validate_semver
export -f extract_versions_from_file
export -f check_version_consistency
