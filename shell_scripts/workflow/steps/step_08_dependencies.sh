#!/bin/bash
################################################################################
# Step 8: AI-Powered Dependency Validation
# Purpose: Validate npm dependencies and environment configuration
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - validates dependencies with AI assistance
# Returns: 0 for success, 1 for failure
step8_validate_dependencies() {
    print_step "8" "Validate Dependencies & Environment"
    
    cd "$SRC_DIR"
    
    local issues=0
    local dependency_report=$(mktemp)
    TEMP_FILES+=("$dependency_report")
    
    # PHASE 1: Automated dependency analysis
    print_info "Phase 1: Automated dependency analysis..."
    
    # Check 1: Verify package.json exists and is valid
    print_info "Validating package.json..."
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found!"
        echo "CRITICAL: Missing package.json" >> "$dependency_report"
        ((issues++))
        cd "$PROJECT_ROOT"
        update_workflow_status "step8" "❌"
        return 1
    else
        # Validate JSON syntax
        if jq empty package.json &>/dev/null; then
            print_success "package.json is valid JSON"
        else
            print_error "package.json contains invalid JSON"
            echo "CRITICAL: Invalid package.json syntax" >> "$dependency_report"
            ((issues++))
        fi
    fi
    
    # Check 2: Run npm audit for security vulnerabilities
    print_info "Running npm audit for security vulnerabilities..."
    local audit_output=$(mktemp)
    TEMP_FILES+=("$audit_output")
    
    local vuln_count=0
    if npm audit --json > "$audit_output" 2>&1; then
        print_success "No security vulnerabilities found"
    else
        local vulnerabilities=$(jq -r '.metadata.vulnerabilities | to_entries[] | "\(.key): \(.value)"' "$audit_output" 2>/dev/null || echo "Unable to parse")
        vuln_count=$(echo "$vulnerabilities" | grep -c ":" || echo "0")
        print_warning "Security vulnerabilities detected"
        echo "Security vulnerabilities:" >> "$dependency_report"
        echo "$vulnerabilities" >> "$dependency_report"
        ((issues++))
    fi
    
    # Check 3: Check for outdated packages
    print_info "Checking for outdated packages..."
    local outdated_output=$(mktemp)
    TEMP_FILES+=("$outdated_output")
    
    local outdated_count=0
    if npm outdated --json > "$outdated_output" 2>&1; then
        print_success "All packages are up to date"
    else
        outdated_count=$(jq 'length' "$outdated_output" 2>/dev/null || echo "0")
        if [[ $outdated_count -gt 0 ]]; then
            print_warning "$outdated_count packages are outdated"
            echo "Outdated packages: $outdated_count" >> "$dependency_report"
            jq -r 'to_entries[] | "\(.key): \(.value.current) -> \(.value.latest)"' "$outdated_output" >> "$dependency_report" 2>/dev/null
        fi
    fi
    
    # Check 4: Verify lockfile integrity
    print_info "Verifying package-lock.json integrity..."
    if [[ -f "package-lock.json" ]]; then
        if npm ls &>/dev/null; then
            print_success "Lockfile integrity verified"
        else
            print_warning "Dependency tree has issues - may need npm install"
            echo "Lockfile issues: Dependency tree inconsistent" >> "$dependency_report"
            ((issues++))
        fi
    else
        print_warning "package-lock.json not found"
        echo "Missing lockfile: Recommended to commit package-lock.json" >> "$dependency_report"
    fi
    
    # Check 5: Verify Node.js and npm versions
    print_info "Checking Node.js and npm versions..."
    local node_version=$(node --version 2>/dev/null || echo "not installed")
    local npm_version=$(npm --version 2>/dev/null || echo "not installed")
    
    print_info "Node.js: $node_version, npm: $npm_version"
    echo "Environment: Node.js $node_version, npm $npm_version" >> "$dependency_report"
    
    # Check 6: Analyze dependency count and size
    print_info "Analyzing dependency footprint..."
    local dep_count=$(jq -r '.dependencies // {} | length' package.json 2>/dev/null || echo "0")
    local dev_dep_count=$(jq -r '.devDependencies // {} | length' package.json 2>/dev/null || echo "0")
    local total_deps=$((dep_count + dev_dep_count))
    
    print_info "Dependencies: $dep_count, DevDependencies: $dev_dep_count (Total: $total_deps)"
    echo "Dependency count: $dep_count prod, $dev_dep_count dev, $total_deps total" >> "$dependency_report"
    
    # PHASE 2: AI-powered dependency strategy analysis
    print_info "Phase 2: Preparing AI-powered dependency analysis..."
    
    # Build dependency summary
    local dependency_summary="Dependency Analysis Summary:
- Production Dependencies: $dep_count
- Development Dependencies: $dev_dep_count
- Total Packages: $total_deps
- Node.js Version: $node_version
- npm Version: $npm_version
- Security Issues: $(grep -c "Security" "$dependency_report" 2>/dev/null || echo "0")
- Outdated Packages: $(grep -c "Outdated" "$dependency_report" 2>/dev/null || echo "0")"
    
    # Extract actual dependencies
    local prod_deps=$(jq -r '.dependencies // {} | to_entries[] | "\(.key)@\(.value)"' package.json 2>/dev/null | head -20)
    local dev_deps=$(jq -r '.devDependencies // {} | to_entries[] | "\(.key)@\(.value)"' package.json 2>/dev/null)
    
    local dependency_report_content=$(cat "$dependency_report" 2>/dev/null || echo "   No critical issues detected")
    local audit_summary=$(cat "$audit_output" 2>/dev/null | jq -r '.metadata // "No data"' || echo "Unable to parse audit results")
    local outdated_list=$(cat "$outdated_output" 2>/dev/null | jq -r 'to_entries[] | "\(.key): \(.value.current) -> \(.value.latest) (wanted: \(.value.wanted))"' | head -10 || echo "None or unable to parse")
    
    # Build comprehensive dependency analysis prompt
    local copilot_prompt="**Role**: You are a senior DevOps engineer and package management specialist with expertise in npm/yarn ecosystem, security vulnerability assessment, version compatibility analysis, dependency tree optimization, and environment configuration best practices.

**Task**: Analyze project dependencies, assess security risks, evaluate version compatibility, and provide recommendations for dependency management and environment setup.

**Context:**
- Project: MP Barbosa Personal Website (static HTML + JavaScript with ES Modules)
- Package Manager: npm
- Node.js Version: $node_version
- npm Version: $npm_version
- Production Dependencies: $dep_count
- Development Dependencies: $dev_dep_count
- Total Packages: $total_deps

**Dependency Analysis Results:**
$dependency_summary

**Automated Findings:**
$dependency_report_content

**Production Dependencies:**
$prod_deps

**Development Dependencies:**
$dev_deps

**npm Audit Summary:**
$audit_summary

**Outdated Packages:**
$outdated_list

**Analysis Tasks:**

1. **Security Vulnerability Assessment:**
   - Review npm audit results
   - Identify critical/high severity vulnerabilities
   - Assess exploitability and impact
   - Provide immediate remediation steps
   - Recommend long-term security strategy
   - Consider transitive dependencies

2. **Version Compatibility Analysis:**
   - Check for breaking changes in outdated packages
   - Identify version conflicts
   - Assess compatibility with Node.js version
   - Review semver ranges (^, ~, exact versions)
   - Recommend version pinning strategy

3. **Dependency Tree Optimization:**
   - Identify unused dependencies
   - Detect duplicate packages in tree
   - Find opportunities to reduce bundle size
   - Recommend consolidation strategies
   - Suggest peer dependency resolution

4. **Environment Configuration Review:**
   - Validate Node.js version compatibility
   - Check npm version requirements
   - Review engine specifications in package.json
   - Assess development vs production dependencies
   - Recommend .nvmrc or .node-version file

5. **Update Strategy Recommendations:**
   - Prioritize updates (security > bug fixes > features)
   - Create phased update plan
   - Identify breaking changes to watch
   - Recommend testing strategy for updates
   - Suggest automation (Dependabot, Renovate)

**Expected Output:**
- Security vulnerability assessment with severity levels
- Immediate action items for critical vulnerabilities
- Safe update path for outdated packages
- Version compatibility matrix
- Dependency optimization recommendations
- Environment configuration best practices
- Automated dependency management setup
- Testing strategy for dependency updates
- Priority-ordered action plan with effort estimates

Please provide a comprehensive dependency analysis with specific, actionable recommendations for maintaining a secure, optimized dependency tree."

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Dependency Analysis Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for dependency analysis..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with dependency analysis prompt"
        else
            # Smart triggering
            if [[ $issues -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for dependency analysis?"; then
                    print_info "Starting Copilot CLI dependency analysis..."
                    echo ""
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt"
                    
                    print_success "Copilot CLI dependency analysis completed"
                    echo ""
                    
                    # User action on vulnerabilities
                    if [[ $issues -gt 0 ]]; then
                        if confirm_action "Critical dependency issues found - continue workflow?"; then
                            print_warning "Continuing despite dependency issues"
                        else
                            print_error "Workflow paused - resolve dependency issues first"
                            cd "$PROJECT_ROOT"
                            return 1
                        fi
                    fi
                else
                    print_warning "Skipped Copilot dependency analysis"
                fi
            else
                print_info "No dependency issues - skipping optional analysis"
                if confirm_action "Run optional dependency optimization analysis?"; then
                    execute_copilot_prompt "$copilot_prompt"
                fi
            fi
        fi
    else
        print_warning "GitHub Copilot CLI not found - using basic checks only"
        print_info "Install from: https://github.com/github/gh-copilot"
    fi
    
    # Summary
    echo ""
    if [[ $issues -eq 0 ]]; then
        print_success "Dependency validation passed ✅ ($total_deps packages healthy)"
        save_step_summary "8" "Dependency_Validation" "All ${total_deps} dependencies validated. No vulnerabilities or outdated packages detected." "✅"
    else
        print_warning "Found $issues dependency issue(s) - review recommended"
        save_step_summary "8" "Dependency_Validation" "Found ${issues} dependency issues. Review vulnerabilities and outdated packages." "⚠️"
        
        # Save to backlog
        local step_issues="### Dependency Validation Issues

**Total Issues:** ${issues}
**Total Dependencies:** ${total_deps}
**Vulnerabilities:** ${vuln_count}
**Outdated Packages:** ${outdated_count}

"
        if [[ -f "$audit_output" && -s "$audit_output" ]]; then
            step_issues+="### npm audit Output

\`\`\`
$(cat "$audit_output" | head -50)
\`\`\`
"
        fi
        if [[ -f "$outdated_output" && -s "$outdated_output" ]]; then
            step_issues+="### Outdated Packages

\`\`\`
$(cat "$outdated_output" | jq -r '.' 2>/dev/null || cat "$outdated_output")
\`\`\`
"
        fi
        save_step_issues "8" "Dependency_Validation" "$step_issues"
    fi
    
    cd "$PROJECT_ROOT"
    update_workflow_status "step8" "✅"
}

# Export step function
export -f step8_validate_dependencies
