# ROADMAP: copilot_with_enhanced_prompt.sh

**Script Location:** `./shell_scripts/copilot_with_enhanced_prompt.sh`  
**Purpose:** Two-stage prompt enhancement and execution pipeline for GitHub Copilot CLI  
**Created:** November 3, 2025  
**Current Version:** 2.0 (Simplified Architecture)

---

## Table of Contents

1. [Implementation History](#implementation-history)
2. [Current Features (v2.0)](#current-features-v20)
3. [Deleted Features](#deleted-features)
4. [Future Roadmap](#future-roadmap)
5. [Technical Architecture](#technical-architecture)
6. [Dependencies](#dependencies)

---

## Implementation History

### Version 1.0 - Initial Implementation (November 3, 2025 - 00:30 UTC)

**Commit Summary:** Initial two-stage pipeline script creation

**Features Implemented:**
- ✅ Basic two-stage architecture (enhance → execute)
- ✅ Integration with `enhance_prompt.sh` dependency script
- ✅ Model selection for both stages (`-m`, `--enhance-model`, `--exec-model`)
- ✅ Dry-run mode (`--dry-run`) for testing enhancements
- ✅ Save enhanced prompt to file (`-s`, `--save`)
- ✅ Verbose mode (`-v`) for detailed logging
- ✅ Show enhanced prompt flag (`--show-enhanced`)
- ✅ Color-coded terminal output (RED, GREEN, YELLOW, BLUE, CYAN)
- ✅ Comprehensive error handling and validation
- ✅ Help documentation (`-h`, `--help`)

**Implementation Details:**
- Simple synchronous execution model
- Direct call to `enhance_prompt.sh` script
- Standard output capture using command substitution
- Exit code validation and error propagation
- Cleanup with trap handlers for temporary files

**Lines of Code:** ~209 lines

**Key Decisions:**
- Chose simplicity over complexity for initial version
- Relied on external script for enhancement logic
- Used grep/sed for output parsing

---

### Version 1.5 - Agent Mode Implementation (November 3, 2025 - 01:20 UTC)

**Commit Summary:** Advanced agent mode with timeout control and progress monitoring

**Features Added:**
- ✅ **Agent Mode Execution**: Direct copilot agent invocation instead of script delegation
- ✅ **Configurable Timeout**: `--timeout SECONDS` option (default: 120s)
- ✅ **Progress Monitoring**: Real-time spinner animation with elapsed time display
- ✅ **Process Management**: Background process execution with PID tracking
- ✅ **Advanced Timeout Handling**: Graceful SIGTERM followed by SIGKILL
- ✅ **Step-by-step Feedback**: Detailed multi-stage status updates
- ✅ **Agent Process Monitoring**: Continuous health checks with `kill -0`
- ✅ **Temporary File Management**: Structured temp file creation with cleanup
- ✅ **Enhanced Logging**: Separate output and log file streams

**Implementation Details:**
- Background process execution with `&` operator
- PID file creation for cross-process communication
- Spinner animation using Unicode Braille patterns (`⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏`)
- Sleep-based polling loop with 1-second intervals
- ANSI escape code manipulation for spinner clearing
- Standard exit code 124 for timeout conditions

**Lines of Code:** ~383 lines (83% increase from v1.0)

**Technical Challenges Solved:**
- Process lifecycle management in Bash
- Real-time progress indication without blocking
- Graceful timeout with escalating termination signals
- Multi-file temporary resource cleanup

**Performance Characteristics:**
- Overhead: ~5s for process initialization and monitoring
- Timeout precision: ±1s due to polling interval
- Memory footprint: +3 temporary files during execution

---

### Version 2.0 - Simplified Architecture (November 3, 2025 - 01:39 UTC)

**Commit Summary:** Simplification and reliability improvements with always-on enhanced prompt display

**Major Changes:**
- ✅ **Removed Agent Mode**: Reverted to simple script delegation for reliability
- ✅ **Always-on Enhanced Prompt Display**: Removed conditional flag, always shows enhancement
- ✅ **ANSI Color Stripping**: Proper handling of color codes in output parsing
- ✅ **Improved Output Extraction**: Better grep/sed pipeline for content isolation
- ✅ **PIPESTATUS Validation**: Proper exit code capture from piped commands
- ✅ **Enhanced Error Messages**: More descriptive failure diagnostics

**Features Removed:**
- ❌ Agent mode execution
- ❌ Configurable timeout option
- ❌ Progress spinner animation
- ❌ PID-based process monitoring
- ❌ Step-by-step agent feedback
- ❌ Background process management
- ❌ Conditional enhanced prompt display

**Lines of Code:** ~225 lines (41% reduction from v1.5, 8% increase from v1.0)

**Rationale for Simplification:**
1. **Reliability**: Agent mode had output parsing issues with variable response formats
2. **Maintainability**: Simpler code is easier to debug and extend
3. **User Experience**: Always showing enhanced prompt is more transparent
4. **Dependency Management**: Leveraging existing `enhance_prompt.sh` reduces duplication
5. **Debugging**: Color code stripping improves output parsing reliability

**Performance Improvements:**
- Reduced initialization overhead from ~5s to <1s
- Eliminated polling loop CPU usage
- Simpler process model with direct script invocation

---

## Current Features (v2.0)

### Core Functionality

| Feature | Flag | Description | Status |
|---------|------|-------------|--------|
| Two-stage pipeline | - | Enhance → Execute workflow | ✅ Active |
| Model selection (both) | `-m`, `--model` | Apply same model to both stages | ✅ Active |
| Enhancement model | `--enhance-model` | Model for enhancement stage only | ✅ Active |
| Execution model | `--exec-model` | Model for execution stage only | ✅ Active |
| Save enhanced prompt | `-s`, `--save FILE` | Save to file before execution | ✅ Active |
| Verbose mode | `-v`, `--verbose` | Show configuration details | ✅ Active |
| Dry-run mode | `--dry-run` | Enhance only, skip execution | ✅ Active |
| Help documentation | `-h`, `--help` | Display usage information | ✅ Active |
| Enhanced prompt display | (always on) | Show enhanced prompt between stages | ✅ Active |

### Technical Features

- ✅ **Color-coded Output**: Visual distinction for errors, success, info, and headers
- ✅ **ANSI Strip Processing**: Removes color codes for reliable parsing
- ✅ **Dependency Validation**: Checks for `enhance_prompt.sh` and `copilot` CLI
- ✅ **Error Propagation**: Proper exit code handling throughout pipeline
- ✅ **Temporary File Cleanup**: Automatic cleanup with trap handlers
- ✅ **Input Validation**: Required argument checking and validation
- ✅ **Graceful Error Messages**: User-friendly error reporting with suggestions

---

## Deleted Features

These features were implemented in v1.5 but removed in v2.0. They are candidates for future re-implementation with improved architecture.

### 1. Agent Mode Execution

**Status:** ❌ Removed in v2.0  
**Original Implementation:** v1.5 (lines 167-260)

**Description:**  
Direct invocation of `copilot --agent` command instead of delegating to `enhance_prompt.sh` script. Provided more control over the enhancement process but introduced parsing complexity.

**Technical Details:**
```bash
copilot --allow-all-tools --agent --model "$MODEL" --prompt "$AGENT_PROMPT"
```

**Removal Reason:**  
- Output format variability made reliable parsing difficult
- Added unnecessary complexity for marginal benefit
- Duplicate logic with `enhance_prompt.sh`

**Future Consideration:**  
Re-implement with structured JSON output parsing or streaming API

---

### 2. Configurable Timeout Control

**Status:** ❌ Removed in v2.0  
**Original Implementation:** v1.5 (line 77, 112-114, 163, 183, 218-244)

**Description:**  
`--timeout SECONDS` option allowing users to configure maximum wait time for enhancement stage. Default was 120 seconds with graceful termination handling.

**Technical Details:**
```bash
--timeout 180  # 3 minutes timeout
ENHANCE_TIMEOUT=120  # Default: 2 minutes
```

**Implementation Approach:**
- Sleep-based polling loop checking process status
- Escalating termination: SIGTERM → wait 2s → SIGKILL
- Standard exit code 124 for timeout conditions

**Removal Reason:**  
- No longer needed with synchronous script execution
- Enhancement script has built-in timeouts
- Added complexity without clear user benefit

**Future Consideration:**  
Could be re-added if async execution is reintroduced with proper timeout needs

---

### 3. Real-time Progress Spinner

**Status:** ❌ Removed in v2.0  
**Original Implementation:** v1.5 (lines 213-233)

**Description:**  
Animated Unicode Braille spinner with elapsed time counter showing enhancement progress in real-time.

**Visual Example:**
```
⠋ Processing... (15s / 120s)
```

**Technical Details:**
- 10-frame Braille pattern animation: `⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏`
- Carriage return (`\r`) for in-place updates
- 1-second update interval with modulo frame rotation
- ANSI escape codes for color and cursor control

**Removal Reason:**  
- Enhancement now completes in <10s, spinner unnecessary
- Simplified execution model doesn't need progress indication
- Terminal output cleaner without animation

**Future Consideration:**  
Valuable for long-running operations (>30s). Could return with:
- Conditional display (only for operations >10s)
- Progress percentage if available from underlying process
- Configurable spinner styles

---

### 4. Background Process Management

**Status:** ❌ Removed in v2.0  
**Original Implementation:** v1.5 (lines 171-173, 194-210)

**Description:**  
Sophisticated background process execution with PID file tracking, health monitoring, and controlled termination.

**Technical Details:**
```bash
# Start background process
copilot ... > "$AGENT_OUTPUT" 2> "$AGENT_LOG" &
echo $! > "$AGENT_PID_FILE"

# Monitor with kill -0
if ! kill -0 "$AGENT_PID" 2>/dev/null; then
    # Process exited
fi
```

**Process Lifecycle:**
1. Fork background process with output redirection
2. Capture PID to file for cross-process communication
3. Continuous health checks with `kill -0` (non-destructive signal)
4. Graceful termination on timeout/error

**Removal Reason:**  
- Synchronous execution is simpler and sufficient
- Eliminated race conditions in PID file creation
- Reduced complexity of error handling

**Future Consideration:**  
Essential for true async operations. Re-implement if adding:
- Parallel enhancement of multiple prompts
- Long-running enhancement operations
- User-interruptible processes

---

### 5. Step-by-step Agent Feedback

**Status:** ❌ Removed in v2.0  
**Original Implementation:** v1.5 (lines 192, 210, 246)

**Description:**  
Multi-stage status updates showing granular progress through agent initialization, processing, and validation.

**Example Output:**
```
Step 1.1: Starting Copilot Agent for prompt enhancement...
✓ Agent process started (PID: 100102)
Step 1.2: Processing enhancement with AI agent...
⠋ Processing... (15s / 120s)
Step 1.3: Validating agent output...
✓ Enhancement completed successfully
```

**Visual Elements:**
- Checkmark (✓) for successful steps
- Cross (✗) for failures
- Arrow (→) for informational messages
- Numbered sub-steps (1.1, 1.2, 1.3)

**Removal Reason:**  
- Over-engineered for simple synchronous operations
- Current "Step 1: Enhancing Prompt" is sufficient
- Enhanced prompt display provides enough feedback

**Future Consideration:**  
Valuable for complex multi-stage workflows:
- Add progress steps for validation, sanitization, formatting
- Show individual sub-tasks in parallel processing scenarios
- Implement if adding features like prompt templates, multi-model ensemble enhancement

---

### 6. Separate Output and Log Streams

**Status:** ❌ Removed in v2.0  
**Original Implementation:** v1.5 (lines 171-172)

**Description:**  
Dedicated temporary files for standard output vs. error/log messages enabling granular analysis.

**Technical Details:**
```bash
AGENT_OUTPUT=$(mktemp /tmp/agent_output.XXXXXX)  # stdout
AGENT_LOG=$(mktemp /tmp/agent_log.XXXXXX)        # stderr
copilot ... > "$AGENT_OUTPUT" 2> "$AGENT_LOG"
```

**Use Cases:**
- Debug failed enhancements by inspecting logs
- Separate clean output from diagnostic messages
- Preserve error messages for user feedback

**Removal Reason:**  
- Single temp file sufficient for current implementation
- `enhance_prompt.sh` already handles output/error separation
- Reduced file I/O overhead

**Future Consideration:**  
Re-add if implementing:
- Detailed debugging mode with log preservation
- Audit trail functionality
- Performance profiling with separate timing logs

---

### 7. Conditional Enhanced Prompt Display

**Status:** ❌ Removed in v2.0 (made always-on)  
**Original Implementation:** v1.0-1.5 (conditional on `--show-enhanced` flag)

**Description:**  
Optional display of enhanced prompt controlled by `--show-enhanced` flag. In v2.0, this became always-on for transparency.

**Old Behavior:**
```bash
# Only show if flag provided
if [[ "$SHOW_ENHANCED" = true ]] || [[ "$DRY_RUN" = true ]]; then
    print_section "Enhanced Prompt"
    echo "$ENHANCED_PROMPT"
fi
```

**New Behavior (v2.0):**
```bash
# Always show enhanced prompt
print_section "Enhanced Prompt"
echo "$ENHANCED_PROMPT"
```

**Rationale for Change:**
- Transparency: Users should always see what's being executed
- Debugging: Easier to diagnose enhancement quality issues
- Trust: Builds confidence in AI-driven enhancement
- UX: Eliminates need for an extra flag

**Future Consideration:**  
Could add `--quiet` mode to suppress enhanced prompt display for scripting scenarios

---

## Future Roadmap

### Phase 1: Stability & Polish (Q4 2025)

**Priority:** High  
**Focus:** Bug fixes, documentation, and user experience improvements

#### Planned Features:

1. **Configuration File Support** 🆕
   - Priority: Medium
   - Effort: 2-4 hours
   - Description: Support `.copilotrc` or `~/.config/copilot/enhancement.conf` for default settings
   - Benefits: Avoid repetitive flag usage, team-wide standardization
   - Technical approach: Source config file before argument parsing, allow CLI to override

2. **Enhanced Error Messages** 🔧
   - Priority: High
   - Effort: 1-2 hours
   - Description: Context-aware error messages with recovery suggestions
   - Example: "Enhancement failed. Try --enhance-model claude-sonnet-4.5 or check network"

3. **Quiet Mode** 🆕
   - Priority: Low
   - Effort: 30 minutes
   - Description: `--quiet` flag to suppress enhanced prompt display for scripting
   - Use case: Automated CI/CD pipelines, batch processing

4. **Comprehensive Testing Suite** 🆕
   - Priority: High
   - Effort: 4-6 hours
   - Description: Unit tests for all flag combinations and error conditions
   - Framework: BATS (Bash Automated Testing System)
   - Coverage target: >80%

---

### Phase 2: Advanced Features (Q1 2026)

**Priority:** Medium  
**Focus:** Re-introduction of deleted features with improved architecture

#### Planned Features:

5. **Smart Timeout Control (v2)** 🔄
   - Priority: Medium
   - Effort: 3-4 hours
   - Description: Re-introduce `--timeout` with automatic timeout estimation
   - Improvements over v1.5:
     - Auto-calculate timeout based on prompt length
     - Exponential backoff for retries
     - Preserve partial results on timeout
   - Technical approach: Async execution with timeout(1) command

6. **Progress Indication (v2)** 🔄
   - Priority: Low
   - Effort: 2-3 hours
   - Description: Conditional spinner for operations >10s
   - Improvements over v1.5:
     - Only show for long-running operations
     - Add progress percentage if available
     - Configurable spinner style (dots, braille, arrows)
   - Technical approach: Background monitoring with conditional display

7. **Multi-Prompt Batch Processing** 🆕
   - Priority: Medium
   - Effort: 6-8 hours
   - Description: Process multiple prompts from file or stdin
   - Features:
     - Parallel processing (configurable worker count)
     - CSV/JSON input format support
     - Aggregate results to single output file
   - Use case: Bulk enhancement of documentation, test cases, commit messages

8. **Prompt Templates** 🆕
   - Priority: High
   - Effort: 4-5 hours
   - Description: Reusable enhancement templates for common patterns
   - Templates:
     - `bug-fix`: Enhance bug report descriptions
     - `feature`: Enhance feature request descriptions
     - `test`: Generate test scenarios from requirements
     - `docs`: Improve documentation clarity
   - Technical approach: Template library with variable substitution

---

### Phase 3: Integration & Ecosystem (Q2 2026)

**Priority:** Low  
**Focus:** Integration with external tools and workflow automation

#### Planned Features:

9. **Git Integration** 🆕
   - Priority: Medium
   - Effort: 6-8 hours
   - Description: Enhance commit messages, PR descriptions, code review comments
   - Commands:
     - `copilot-enhance-commit`: Improve commit message before push
     - `copilot-enhance-pr`: Generate comprehensive PR descriptions
     - `copilot-enhance-review`: Enhance code review feedback
   - Technical approach: Git hooks integration, GitHub CLI plugin

10. **IDE Plugin Support** 🆕
    - Priority: Low
    - Effort: 10-15 hours
    - Description: VS Code, JetBrains, Vim/Neovim plugins
    - Features:
      - Right-click context menu "Enhance with Copilot"
      - Inline preview of enhanced prompts
      - Keybinding support
    - Technical approach: Language Server Protocol (LSP) or native plugins

11. **API Mode** 🆕
    - Priority: Low
    - Effort: 8-10 hours
    - Description: HTTP API server for remote enhancement requests
    - Features:
      - RESTful API with JSON request/response
      - Authentication and rate limiting
      - Async job queue for long-running enhancements
      - WebSocket support for real-time progress
    - Use case: Web dashboard, mobile apps, remote integrations

12. **Telemetry & Analytics** 🆕
    - Priority: Low
    - Effort: 5-7 hours
    - Description: Optional usage analytics for improvement insights
    - Metrics:
      - Enhancement time distribution
      - Most common prompt patterns
      - Model performance comparison
      - Error rate tracking
    - Privacy: Opt-in, anonymized, local-first storage

---

### Phase 4: Advanced Agent Features (Q3 2026)

**Priority:** Low  
**Focus:** Advanced AI-driven enhancements and multi-model strategies

#### Planned Features:

13. **Agent Mode v2 (Refined)** 🔄
    - Priority: Medium
    - Effort: 10-12 hours
    - Description: Re-implement agent mode with structured output
    - Improvements over v1.5:
      - JSON-based output parsing (no grep/sed hacks)
      - Streaming response support
      - Retry logic with exponential backoff
      - Model fallback chain (try gpt-5, fallback to claude-sonnet-4.5)
    - Technical approach: Use `--format json` if available, or custom output parser

14. **Multi-Model Ensemble Enhancement** 🆕
    - Priority: Low
    - Effort: 12-15 hours
    - Description: Enhance using multiple models, merge best results
    - Process:
      1. Send prompt to 2-3 models in parallel
      2. Score each enhancement (quality metrics)
      3. Merge or select best enhancement
      4. Show comparison before execution
    - Benefits: Higher quality enhancements, reduced model bias
    - Technical approach: Parallel execution with result ranking

15. **Iterative Enhancement** 🆕
    - Priority: Low
    - Effort: 6-8 hours
    - Description: Multi-pass enhancement with refinement
    - Process:
      1. Initial enhancement
      2. Self-critique and identify weaknesses
      3. Second pass enhancement addressing critiques
      4. Optional third pass for complex prompts
    - Use case: Critical prompts requiring highest quality

16. **Domain-Specific Enhancement** 🆕
    - Priority: Medium
    - Effort: 8-10 hours
    - Description: Context-aware enhancement based on project type
    - Auto-detect domains:
      - Web development (frontend, backend, full-stack)
      - Data science / ML
      - DevOps / Infrastructure
      - Security / Pentesting
      - Documentation / Technical writing
    - Apply domain-specific templates and terminology

---

### Phase 5: Enterprise Features (Q4 2026+)

**Priority:** Very Low  
**Focus:** Team collaboration, governance, and enterprise deployment

#### Planned Features:

17. **Team Prompt Library** 🆕
    - Priority: Low
    - Effort: 15-20 hours
    - Description: Shared prompt repository for teams
    - Features:
      - Centralized prompt templates
      - Version control for templates
      - Access control (public, team, private)
      - Usage statistics per template
    - Technical approach: Git-based storage with metadata index

18. **Prompt Review & Approval Workflow** 🆕
    - Priority: Very Low
    - Effort: 20-25 hours
    - Description: Enterprise workflow for sensitive prompts
    - Features:
      - Submit enhanced prompts for review
      - Approval chain (junior → senior → execution)
      - Audit trail of changes and approvals
      - Rejection with feedback loop
    - Use case: Regulated industries, security-sensitive operations

19. **Compliance & Audit Logging** 🆕
    - Priority: Very Low
    - Effort: 10-15 hours
    - Description: Detailed audit logs for compliance requirements
    - Logs:
      - All prompts (original + enhanced)
      - User identity and timestamp
      - Model versions used
      - Execution results and outcomes
      - Retention policies
    - Technical approach: Structured logging with rotation and encryption

20. **Cost Optimization** 🆕
    - Priority: Low
    - Effort: 8-10 hours
    - Description: Token usage tracking and cost analysis
    - Features:
      - Per-prompt token count estimation
      - Monthly cost reports
      - Budget alerts and limits
      - Model selection based on cost/quality tradeoff
    - Technical approach: Token counting library, cost database

21. **Enhanced Unicode Emoji Status Indicators** 🆕
    - Priority: Low
    - Effort: 3-4 hours
    - Description: Rich visual feedback using Unicode emoji for all operations
    - Features:
      - Status indicators for each pipeline stage (⏳, ✓, ✗)
      - Priority badges for prompts (🔴 high, 🟡 medium, 🟢 low)
      - Progress visualization with phase emojis (1️⃣, 2️⃣, 3️⃣)
      - Error type categorization (🐛 bug, 🚨 critical, ⚠️ warning)
      - Performance indicators (⚡ fast, 🐌 slow)
      - Context-aware emoji selection based on operation type
      - Configurable emoji sets (professional, playful, minimal)
    - Visual Examples:
      ```
      ⏳ Step 1: Enhancing Prompt...
      ✓ Enhancement completed in 5.2s ⚡
      📊 Prompt improved by 45% (clarity metric)
      
      2️⃣ Step 2: Executing with Copilot 🚀
      ✓ Execution successful 🎉
      💚 All validation checks passed
      ```
    - Technical approach: Emoji mapping dictionary, context detection, user preferences
    - Benefits: Improved readability, faster visual parsing, better UX
    - Accessibility: Optional plain-text mode for screen readers

---

## Technical Architecture

### Current Architecture (v2.0)

```
┌─────────────────────────────────────────────────────────┐
│  copilot_with_enhanced_prompt.sh (Main Script)         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  1. Argument Parsing & Validation               │   │
│  │     - Parse CLI flags                            │   │
│  │     - Validate required arguments               │   │
│  │     - Check dependencies                         │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  2. Enhancement Stage (Step 1)                   │   │
│  │     - Call enhance_prompt.sh                     │   │
│  │     - Capture output to temp file                │   │
│  │     - Strip ANSI color codes                     │   │
│  │     - Extract enhanced prompt                    │   │
│  │     - Display enhanced prompt (always)           │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  3. Execution Stage (Step 2)                     │   │
│  │     - Build copilot command                      │   │
│  │     - Execute enhanced prompt                    │   │
│  │     - Stream output to terminal                  │   │
│  │     - Validate exit code                         │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  4. Cleanup & Exit                               │   │
│  │     - Remove temporary files (trap handler)      │   │
│  │     - Display completion status                  │   │
│  │     - Exit with appropriate code                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Dependency
                         ▼
         ┌───────────────────────────────┐
         │  enhance_prompt.sh            │
         │  (External Enhancement Script)│
         └───────────────────────────────┘
                         │
                         │ API Call
                         ▼
         ┌───────────────────────────────┐
         │  GitHub Copilot CLI (copilot) │
         │  (External AI Service)         │
         └───────────────────────────────┘
```

### Data Flow

```
User Input
    │
    ├─ Original Prompt: "fix login bug"
    ├─ Flags: --dry-run, -v, --model claude-sonnet-4.5
    │
    ▼
┌────────────────────┐
│ Argument Parser    │  → MODEL, PROMPT, DRY_RUN, VERBOSE, etc.
└────────────────────┘
    │
    ▼
┌────────────────────┐
│ enhance_prompt.sh  │  → Calls copilot --prompt with meta-prompt
└────────────────────┘
    │
    ├─ Output: Enhanced Prompt (with ANSI codes, usage stats)
    │
    ▼
┌────────────────────┐
│ ANSI Stripper      │  → sed 's/\x1b\[[0-9;]*m//g'
└────────────────────┘
    │
    ├─ Clean Output: Text without color codes
    │
    ▼
┌────────────────────┐
│ Prompt Extractor   │  → grep/sed to isolate enhanced prompt
└────────────────────┘
    │
    ├─ Enhanced Prompt: "Investigate and resolve authentication..."
    │
    ▼
┌────────────────────┐
│ Display to User    │  → Always show enhanced prompt
└────────────────────┘
    │
    ├─ If DRY_RUN: Exit
    │
    ▼
┌────────────────────┐
│ copilot CLI        │  → Execute enhanced prompt
└────────────────────┘
    │
    ├─ Copilot Response: Code changes, explanations, etc.
    │
    ▼
Terminal Output
```

---

## Dependencies

### Required

| Dependency | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| Bash | ≥4.0 | Shell interpreter | Pre-installed on most systems |
| GitHub Copilot CLI | Latest | AI code assistant | `npm install -g @githubnext/github-copilot-cli` |
| enhance_prompt.sh | Same dir | Prompt enhancement | Part of this project |
| sed | GNU/BSD | Text processing | Pre-installed on most systems |
| grep | GNU/BSD | Pattern matching | Pre-installed on most systems |
| mktemp | POSIX | Temp file creation | Pre-installed on most systems |

### Optional

| Dependency | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| BATS | ≥1.0 | Testing framework | `npm install -g bats` (future) |
| jq | ≥1.6 | JSON parsing | `apt install jq` (future for Agent Mode v2) |

---

## Version History Summary

| Version | Date | Lines | Key Features | Status |
|---------|------|-------|--------------|--------|
| v1.0 | 2025-11-03 00:30 | 209 | Initial two-stage pipeline | Superseded |
| v1.5 | 2025-11-03 01:20 | 383 | Agent mode, timeout, spinner | Superseded |
| v2.0 | 2025-11-03 01:39 | 225 | Simplified, always-on display | **Current** |

---

## Unicode Emoji Glossary

### Status & State Indicators

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| ✅ | Active/Implemented | Features currently working in production |
| ❌ | Removed/Deleted | Features removed from codebase |
| 🆕 | New Feature | Planned features not yet implemented |
| 🔄 | Returning Feature | Previously removed, planned for re-implementation |
| 🔧 | Enhancement | Improvement to existing functionality |
| ⚠️ | Warning/Caution | Deprecated or risky features |
| 🚧 | In Progress | Currently under development |
| 🎯 | Planned | Scheduled for future implementation |
| 📌 | Pinned/Priority | High-priority or critical items |

### Progress & Execution

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| ⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏ | Spinner Animation | Real-time progress indication (Braille patterns) |
| ⏳ | Processing | Long-running operation in progress |
| ⏱️ | Timed Operation | Operations with timeout constraints |
| 🔄 | Refresh/Retry | Retry or refresh operations |
| ⏸️ | Paused | Temporarily suspended operation |
| ⏹️ | Stopped | Terminated or cancelled operation |
| ▶️ | Start/Execute | Begin operation or execution |
| ⏭️ | Skip | Skip optional step |

### Success & Validation

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| ✓ | Success/Check | Successful completion of operation |
| ✔️ | Verified | Validated or confirmed |
| 🎉 | Celebration | Major milestone or achievement |
| 💚 | Passed | Tests or validation passed |
| 🏆 | Achievement | Significant accomplishment |

### Errors & Problems

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| ✗ | Failure/Error | Failed operation or check |
| ❗ | Alert | Important notice or alert |
| 🚨 | Critical Error | Severe error requiring immediate attention |
| 💔 | Broken | Broken functionality or compatibility |
| 🔥 | Critical Issue | Hot fix needed, urgent problem |
| 🐛 | Bug | Known bug or defect |

### Information & Communication

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| → | Direction/Next | Informational message, next step |
| ℹ️ | Information | General information or note |
| 💡 | Tip/Idea | Helpful suggestion or insight |
| 📝 | Documentation | Documentation or notes |
| 📖 | Guide | Tutorial or guide |
| 📋 | Checklist | Task list or requirements |
| 📊 | Analytics | Data, metrics, or statistics |
| 📈 | Growth/Improvement | Positive trend or enhancement |

### Configuration & Settings

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| ⚙️ | Settings | Configuration or settings |
| 🔧 | Tool/Utility | Development tool or utility |
| 🛠️ | Build/Setup | Build process or setup |
| ⚡ | Performance | Performance-related features |
| 🚀 | Deploy/Launch | Deployment or production release |
| 🔐 | Security | Security-related features |
| 🔑 | Authentication | Auth or access control |

### Priority & Planning

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| 🔴 | High Priority | Critical, high-priority item |
| 🟡 | Medium Priority | Moderate priority |
| 🟢 | Low Priority | Nice-to-have, low priority |
| 🔵 | Info Priority | Informational, no action needed |
| ⭐ | Important | Starred or important item |
| 🎯 | Target | Goal or objective |
| 📅 | Scheduled | Time-bound or scheduled item |
| ⏰ | Deadline | Upcoming deadline |

### Development & Code

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| 💻 | Development | Development environment or coding |
| 🖥️ | CLI/Terminal | Command-line interface |
| 📦 | Package | Package or dependency |
| 🔌 | Plugin | Plugin or extension |
| 🧩 | Module | Modular component |
| 🎨 | UI/UX | User interface or design |
| 🌐 | Web/Network | Web-related or network features |
| 📡 | API | API or service integration |

### Testing & Quality

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| 🧪 | Testing | Unit tests, integration tests |
| 🔬 | Analysis | Code analysis or profiling |
| 🎭 | Mock/Stub | Testing mocks or stubs |
| 📏 | Measurement | Metrics or measurements |
| 🔍 | Investigation | Debugging or investigation |
| 🕵️ | Deep Dive | Detailed analysis |

### Version & Release

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| 🏷️ | Version Tag | Version or release tag |
| 📌 | Pinned Version | Pinned or locked version |
| 🔖 | Bookmark | Saved state or bookmark |
| 📦 | Release | Package release |
| 🎁 | New Release | New feature release |

### Phases & Milestones

| Emoji | Meaning | Usage Context |
|-------|---------|---------------|
| 1️⃣ | Phase 1 | First phase or step |
| 2️⃣ | Phase 2 | Second phase or step |
| 3️⃣ | Phase 3 | Third phase or step |
| 4️⃣ | Phase 4 | Fourth phase or step |
| 5️⃣ | Phase 5 | Fifth phase or step |
| 🏁 | Finish | Completion or final phase |

---

## Feature Status Legend

- 🆕 **New Feature** - Not yet implemented, planned for future
- 🔄 **Returning Feature** - Previously removed, planned for re-implementation
- ✅ **Active** - Currently implemented and working
- ❌ **Removed** - Previously implemented, removed from current version
- 🔧 **Enhancement** - Improvement to existing feature

---

## Contributing

To contribute to this roadmap:

1. **Feature Requests**: Open an issue with tag `[ROADMAP]`
2. **Implementation**: Reference this roadmap in PR descriptions
3. **Prioritization**: Discuss priority changes in project discussions
4. **Updates**: Keep this document in sync with actual implementation

---

## Changelog Location

Detailed changelog maintained in: `./shell_scripts/CHANGELOG.md` (to be created)

---

**Document Version:** 1.0  
**Last Updated:** November 3, 2025  
**Maintained By:** mpbarbosa.com project team  
**Next Review:** December 1, 2025
