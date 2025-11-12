#!/bin/bash
################################################################################
# Step 9: AI-Powered Code Quality Validation
# Purpose: Validate code quality, detect anti-patterns, assess maintainability
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - validates code quality with AI assistance
# Returns: 0 for success, 1 for failure
step9_code_quality_validation() {
    print_step "9" "Code Quality Validation"
    
    cd "$SRC_DIR"
    
    local quality_issues=0
    local quality_report=$(mktemp)
    TEMP_FILES+=("$quality_report")
    
    # PHASE 1: Automated code quality checks
    print_info "Phase 1: Automated code quality analysis..."
    
    # Check 1: Enumerate code files
    print_info "Enumerating code files..."
    local js_files=$(find . -name "*.js" -o -name "*.mjs" 2>/dev/null | wc -l)
    local html_files=$(find . -name "*.html" 2>/dev/null | wc -l)
    local css_files=$(find . -name "*.css" 2>/dev/null | wc -l)
    local total_files=$((js_files + html_files + css_files))
    
    print_info "Code files: $js_files JS, $html_files HTML, $css_files CSS (Total: $total_files)"
    echo "File count: $js_files JavaScript, $html_files HTML, $css_files CSS" >> "$quality_report"
    
    # Check 2: Analyze file sizes and complexity
    print_info "Analyzing code complexity..."
    local large_files_count=0
    local large_files_list=""
    
    # Find JavaScript files over 300 lines
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        local line_count=$(wc -l < "$file" 2>/dev/null || echo 0)
        if [[ $line_count -gt 300 ]]; then
            ((large_files_count++))
            large_files_list+="  - $file ($line_count lines)\n"
            echo "Large file: $file ($line_count lines)" >> "$quality_report"
        fi
    done < <(find . -name "*.js" -o -name "*.mjs" 2>/dev/null)
    
    if [[ $large_files_count -gt 0 ]]; then
        print_warning "Found $large_files_count large files (>300 lines) - may need refactoring"
        ((quality_issues++))
    else
        print_success "All files are reasonably sized"
    fi
    
    # Check 3: Naming convention validation
    print_info "Validating naming conventions..."
    local naming_issues=0
    
    # Check for non-kebab-case HTML files
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        local basename=$(basename "$file")
        if [[ "$basename" =~ [A-Z_] ]]; then
            ((naming_issues++))
            echo "Naming issue: $file (not kebab-case)" >> "$quality_report"
        fi
    done < <(find . -name "*.html" 2>/dev/null)
    
    if [[ $naming_issues -gt 0 ]]; then
        print_warning "Found $naming_issues naming convention issues"
        ((quality_issues++))
    else
        print_success "Naming conventions followed"
    fi
    
    # Check 4: Detect potential code duplication
    print_info "Checking for potential code duplication..."
    local duplicate_patterns=0
    
    # Look for common duplicate patterns
    if command -v grep &> /dev/null; then
        # Count function declarations
        local function_count=$(grep -r "^function\|^const.*=.*function\|^export function" . --include="*.js" --include="*.mjs" 2>/dev/null | wc -l)
        echo "Function declarations: $function_count" >> "$quality_report"
        
        # Basic check: if too many functions in small codebase
        if [[ $function_count -gt 100 ]] && [[ $js_files -lt 10 ]]; then
            print_warning "High function count relative to file count - check for duplication"
            ((duplicate_patterns++))
        fi
    fi
    
    # Check 5: Validate ES Module patterns
    print_info "Validating ES Module usage..."
    local module_issues=0
    
    # Check for proper import/export usage
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        
        # Check if file uses modern ES modules
        if grep -q "^import\|^export" "$file" 2>/dev/null; then
            # Good - using ES modules
            :
        elif grep -q "require(" "$file" 2>/dev/null; then
            # Found CommonJS pattern
            echo "Module issue: $file uses require() instead of import" >> "$quality_report"
            ((module_issues++))
        fi
    done < <(find . -name "*.js" -o -name "*.mjs" 2>/dev/null | grep -v node_modules | grep -v vendor)
    
    if [[ $module_issues -gt 0 ]]; then
        print_warning "Found $module_issues files using CommonJS instead of ES modules"
        ((quality_issues++))
    fi
    
    # Check 6: Code organization assessment
    print_info "Assessing code organization..."
    local dirs_with_js=$(find . -type f \( -name "*.js" -o -name "*.mjs" \) -exec dirname {} \; 2>/dev/null | sort -u | wc -l)
    
    echo "Code organization: JavaScript files spread across $dirs_with_js directories" >> "$quality_report"
    
    # PHASE 2: AI-powered code quality review
    print_info "Phase 2: Preparing AI-powered code quality review..."
    
    # Build quality summary
    local quality_summary="Code Quality Analysis Summary:
- Total Files: $total_files ($js_files JS, $html_files HTML, $css_files CSS)
- Large Files (>300 lines): $large_files_count
- Naming Convention Issues: $naming_issues
- Module Pattern Issues: $module_issues
- Code Organization: $dirs_with_js directories
- Quality Issues: $quality_issues"
    
    # Sample problematic files for review
    local sample_files=$(find . -name "*.js" -o -name "*.mjs" 2>/dev/null | grep -v node_modules | head -5)
    local sample_code=""
    
    for file in $sample_files; do
        [[ -z "$file" ]] && continue
        sample_code+="
File: $file
Lines: $(wc -l < "$file" 2>/dev/null || echo 0)
Preview:
$(head -30 "$file" 2>/dev/null)
---
"
    done
    
    local quality_report_content=$(cat "$quality_report" 2>/dev/null || echo "   No critical issues detected")
    
    # Build comprehensive code quality prompt
    local copilot_prompt="**Role**: You are a senior software quality engineer and code review specialist with expertise in code quality standards, static analysis, linting best practices, design patterns, maintainability assessment, and technical debt identification.

**Task**: Perform comprehensive code quality review, identify anti-patterns, assess maintainability, and provide recommendations for improving code quality and reducing technical debt.

**Context:**
- Project: MP Barbosa Personal Website (static HTML + JavaScript with ES Modules)
- Technology Stack: HTML5, CSS3, JavaScript ES6+, ES Modules
- Testing: Jest with jsdom
- Code Files: $total_files total ($js_files JavaScript, $html_files HTML, $css_files CSS)

**Code Quality Analysis Results:**
$quality_summary

**Automated Findings:**
$quality_report_content

**Large Files Requiring Review:**
$(echo -e "$large_files_list" | head -10 || echo "None")

**Code Samples for Review:**
$sample_code

**Analysis Tasks:**

1. **Code Standards Compliance Assessment:**
   - Evaluate JavaScript coding standards (ES6+ features)
   - Check HTML5 semantic markup usage
   - Review CSS organization and naming (BEM, OOCSS, etc.)
   - Assess consistent indentation and formatting
   - Validate JSDoc/comment quality
   - Check error handling patterns

2. **Best Practices Validation:**
   - Verify separation of concerns (HTML/CSS/JS)
   - Check for proper event handling
   - Assess DOM manipulation patterns
   - Review async/await vs promises usage
   - Validate proper use of const/let (no var)
   - Check for magic numbers/strings

3. **Maintainability & Readability Analysis:**
   - Assess function complexity (cyclomatic complexity)
   - Evaluate function length (should be < 50 lines)
   - Check variable naming clarity
   - Review code organization and structure
   - Assess comment quality and documentation
   - Identify overly complex logic

4. **Anti-Pattern Detection:**
   - Identify code smells (duplicated code, long functions)
   - Detect callback hell or promise anti-patterns
   - Find global variable pollution
   - Spot tight coupling between modules
   - Identify monolithic functions
   - Detect violation of DRY principle

5. **Refactoring Recommendations:**
   - Suggest modularization opportunities
   - Recommend function extraction for clarity
   - Propose design pattern applications
   - Suggest performance optimizations
   - Recommend code reuse strategies
   - Identify technical debt priorities

**Expected Output:**
- Code quality grade (A-F) with justification
- Standards compliance checklist
- Anti-patterns detected with file:line references
- Maintainability score and improvement areas
- Top 5 refactoring priorities with effort estimates
- Best practice violations and fixes
- Technical debt assessment
- Specific code improvement recommendations
- Quick wins vs long-term improvements

Please provide a comprehensive code quality assessment with specific, actionable recommendations."

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Code Quality Review Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for code quality review..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with code quality prompt"
        else
            # Smart triggering
            if [[ $quality_issues -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for code quality review?"; then
                    print_info "Starting Copilot CLI code quality analysis..."
                    echo ""
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt"
                    
                    print_success "Copilot CLI code quality review completed"
                    echo ""
                    
                    # User action on critical issues
                    if [[ $quality_issues -gt 3 ]]; then
                        if confirm_action "Multiple code quality issues found - continue workflow?"; then
                            print_warning "Continuing despite quality issues - address in future iterations"
                        else
                            print_error "Workflow paused - improve code quality first"
                            cd "$PROJECT_ROOT"
                            return 1
                        fi
                    fi
                else
                    print_warning "Skipped Copilot code quality review"
                fi
            else
                print_info "No major quality issues - skipping optional review"
                if confirm_action "Run optional code quality optimization review?"; then
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
    if [[ $quality_issues -eq 0 ]]; then
        print_success "Code quality validation passed ✅ ($total_files files analyzed)"
        save_step_summary "9" "Code_Quality_Validation" "Code quality validated across ${total_files} files. All quality standards met." "✅"
    else
        print_warning "Found $quality_issues code quality area(s) for improvement"
        print_info "Review recommendations above for code quality enhancements"
        save_step_summary "9" "Code_Quality_Validation" "Found ${quality_issues} code quality improvements needed across ${total_files} files. Review and apply quality enhancements." "⚠️"
        
        # Save to backlog
        local step_issues="### Code Quality Issues Found

**Total Issues:** ${quality_issues}
**Files Analyzed:** ${total_files}

"
        if [[ -f "$quality_report" && -s "$quality_report" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$quality_report")
\`\`\`
"
        fi
        save_step_issues "9" "Code_Quality_Validation" "$step_issues"
    fi
    
    cd "$PROJECT_ROOT"
    update_workflow_status "step9" "✅"
}

# Export step function
export -f step9_code_quality_validation
