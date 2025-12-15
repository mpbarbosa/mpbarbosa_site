# MP Barbosa Personal Website

Static HTML personal portfolio website built on the **HTML5 UP Dimension** responsive template, showcasing personal projects with modern design and smooth transitions.

## 🎯 Project Overview

This is a professional portfolio website built with modern web standards, featuring:
- **HTML5 UP Dimension Template** - Fully responsive design with smooth modal transitions
- **Font Awesome Integration** - Professional iconography with brands, regular, and solid icon sets
- **Responsive Design** for all devices with breakpoint optimization
- **Personal Projects** showcase via Git submodules and sibling projects
- **Contact Form** with JavaScript interactivity
- **Clean Architecture** with separation of concerns

## 🚀 Recent Achievements

### 🎉 **Complete Modularization Success** (Latest Update!)
The Music in Numbers subproject has achieved **outstanding architectural transformation**:

- **JavaScript Modularization**: 49.8% code reduction with 9 specialized modules
- **Artist.html Transformation**: 89.7% HTML reduction (580→60 lines) 
- **Index.html Optimization**: 84.5% HTML reduction with complete separation
- **Development Efficiency**: 50% faster implementation using established patterns
- **Zero Functionality Loss**: All features preserved with enhanced performance

### 📈 Key Metrics
| Page | Original Size | Final Size | Reduction | Modules Created |
|------|---------------|------------|-----------|-----------------|
| **index.html** | 1,581 lines | 246 lines | 84.5% | 9 JavaScript modules |
| **artist.html** | 580 lines | 60 lines | 89.7% | 3 specialized modules |
| **Combined** | 2,161 lines | 306 lines | 85.8% | 12+ total modules |

## 📁 Project Structure

```
mpbarbosa_site/
├── .gitmodules                        # Git submodules configuration
├── index.html                         # Simple redirect to mpbarbosa.com
├── shell_scripts/                     # Automation and deployment scripts
│   ├── sync_to_public.sh              # Two-step deployment script (v2.0.0)
│   ├── deploy_to_webserver.sh         # Legacy production deployment (v2.0.0 - requires sync_to_public.sh step1)
│   ├── cleanup_old_folders.sh         # Automated cleanup of old workflow/backlog folders
│   ├── fix_documentation_consistency.sh # Documentation consistency fixes
│   ├── workflow/                      # Modular workflow architecture (v2.0.0 - Complete)
│   │   ├── execute_tests_docs_workflow.sh # Main workflow script (4,740 lines with module loading)
│   │   ├── lib/                       # 12 library modules
│   │   │   ├── ai_helpers.sh          # AI Copilot CLI integration
│   │   │   ├── backlog.sh             # Issue tracking and reporting
│   │   │   ├── colors.sh              # Terminal color codes
│   │   │   ├── config.sh              # Central configuration
│   │   │   ├── file_operations.sh     # File handling utilities
│   │   │   ├── git_cache.sh           # Git state caching
│   │   │   ├── performance.sh         # Performance optimization
│   │   │   ├── session_manager.sh     # Session management
│   │   │   ├── step_execution.sh      # Step execution framework
│   │   │   ├── summary.sh             # Summary generation
│   │   │   ├── utils.sh               # Common utilities
│   │   │   └── validation.sh          # Validation functions
│   │   ├── backlog/                   # Workflow execution backlog
│   │   │   ├── README.md              # Backlog management documentation
│   │   │   └── workflow_YYYYMMDD_HHMMSS/ # Timestamped workflow runs
│   │   ├── steps/                     # 13 step modules (step_00 through step_12)
│   │   │   ├── step_00_analyze.sh     # Pre-workflow change analysis
│   │   │   ├── step_01_documentation.sh # Documentation updates
│   │   │   ├── step_02_consistency.sh # Consistency analysis
│   │   │   ├── step_03_script_refs.sh # Script reference validation
│   │   │   ├── step_04_directory.sh   # Directory structure validation
│   │   │   ├── step_05_test_review.sh # Test review
│   │   │   ├── step_06_test_gen.sh    # Test generation
│   │   │   ├── step_07_test_exec.sh   # Test execution
│   │   │   ├── step_08_dependencies.sh # Dependency validation
│   │   │   ├── step_09_code_quality.sh # Code quality validation
│   │   │   ├── step_10_context.sh     # Context analysis
│   │   │   ├── step_11_git.sh         # AI-powered git finalization ⭐
│   │   │   └── step_12_markdown_lint.sh # Markdown linting with AI
│   │   ├── logs/                      # Workflow execution logs (v2.0.0)
│   │   ├── summaries/                 # Step execution summaries (v2.0.0)
│   │   └── README.md                  # Modular architecture documentation
│   ├── pull_all_submodules.sh         # Submodule update automation
│   ├── push_all_submodules.sh         # Submodule deployment automation
│   ├── validate_external_links.sh     # External links security validator
│   ├── enhance_prompt.sh              # AI prompt enhancement utility
│   └── copilot_with_enhanced_prompt.sh # GitHub Copilot with enhanced prompts
├── src/                               # Main source directory
│   ├── index.html                    # Landing page with HTML5 UP Dimension template
│   ├── assets/                       # HTML5 UP Dimension template assets
│   │   ├── css/                      # Compiled stylesheets
│   │   ├── js/                       # JavaScript utilities
│   │   ├── sass/                     # SASS source files
│   │   └── webfonts/                 # Font Awesome web fonts
│   ├── styles/main.css               # DEPRECATED: Legacy Material Design stylesheet (unused)
│   ├── scripts/main.js               # DEPRECATED: Legacy JavaScript (unused, template uses assets/js/)
│   ├── components/                   # Individual HTML components
│   ├── pages/                        # Project redirect pages
│   │   ├── music-in-numbers.html     # Music in Numbers redirect (git submodule) [renamed]
│   │   ├── guia-turistico.html       # Guia Turístico redirect (git submodule) [renamed]
│   │   └── monitora-vagas.html       # Monitora Vagas redirect (sibling project) [renamed]
│   ├── submodules/                   # Git submodules (personal projects)
│   │   ├── music_in_numbers/         # 🎵 Music analytics platform
│   │   └── guia_turistico/           # 🗺️ Travel guide application
│   └── __tests__/                    # Jest test suites
│       ├── main.test.js              # Main site functionality tests (495 lines)
│       ├── documentation.test.js     # Documentation consistency tests (184 lines)
│       ├── InitializationUtilities.test.js # Initialization logic tests (869 lines)
│       ├── project_navigation.test.js # Project navigation tests (293 lines)
│       ├── shell_scripts.test.js     # Shell script integration tests (849 lines)
│       └── sync_to_public.test.js    # Deployment script tests (713 lines)
├── docs/                             # Project documentation
│   ├── EXTERNAL_LINKS_POLICY.md      # Security standards for external links
│   ├── GIT_BEST_PRACTICES_GUIDE.md   # Version control workflow guide
│   ├── TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md # v2.0.0 deployment guide
│   ├── TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md # Workflow automation plan
│   ├── DIRECTORY_STRUCTURE_VALIDATION_HISTORY_CONSOLIDATED.md # 9 historical reports ⭐ NEW
│   ├── DOCUMENTATION_CONSISTENCY_HISTORY_CONSOLIDATED.md      # Consistency analysis history ⭐ NEW
│   ├── SHELL_SCRIPT_VALIDATION_HISTORY_CONSOLIDATED.md        # Shell validation history ⭐ NEW
│   └── [other documentation files]

### Consolidated Historical Reports

The `/docs` directory contains three consolidated historical validation reports (new in v2.0.0):

- **Directory Structure Validation**: 9 reports consolidated (Nov 13-25, 2025), all ✅ EXCELLENT status
- **Documentation Consistency Analysis**: Historical cross-reference and terminology tracking
- **Shell Script Validation**: Historical shell script quality and best practices compliance

Individual timestamped reports have been archived into these consolidated files to maintain repository cleanliness while preserving complete historical analysis.

├── prompts/                          # AI workflow templates
│   └── tests_documentation_update_enhanced.txt
├── html5up-dimension/                # HTML5 UP Dimension template source
├── public/                           # Generated deployment directory (sync_to_public.sh output)
│   ├── index.html                    # Synchronized main page
│   ├── assets/                       # HTML5 UP Dimension template assets
│   ├── submodules/                   # Synchronized subproject content
│   ├── media/                        # Media assets (images, icons)
│   ├── downloads/                    # Downloadable resources
│   ├── .backups/                     # Automated backup archives
│   └── [other synchronized files]
└── .github/                          # GitHub configuration
    ├── copilot-instructions.md       # Development guidelines
    └── ISSUE_TEMPLATE/               # GitHub issue templates
        ├── copilot_issue.md          # Copilot-specific issues
        └── feature_request.md        # Feature request template
```

## 🎵 Featured Projects

### Music in Numbers
**Advanced Spotify Analytics Platform**
- Professional music analytics with Chart.js visualizations
- Complete HTML/CSS/JavaScript modularization (85.8% code reduction)
- OAuth 2.0 PKCE authentication with Spotify Web API
- Advanced features: Genre analysis, mood detection, export capabilities
- **Status**: Production-ready with enterprise-grade architecture

### Guia Turístico
**Interactive Travel Guide Application**
- Location-based travel recommendations
- Interactive maps and route planning
- Cultural insights and local attractions
- **Status**: Active development

### Monitora Vagas
**AFPESP Hotel Vacancy Monitoring Application v2.0.0** (Sibling Project)
- **Modern Architecture**: Dual-directory structure (legacy src/ + modern public/)
- **Client-Side Guest Filtering**: Real-time vacancy filtering by guest count (FR-004)
  - **Filter State Management**: Intelligent enable/disable based on search state (FR-004A)
  - **Capacity Parsing**: Regex-based "até N pessoas" extraction (FR-004B)
  - **Visual Feedback**: CSS state classes and interactive element control
  - **Statistics Tracking**: Visible/hidden hotel and vacancy counts
- **Configuration Layer**: Modular config architecture (app.js, constants.js, environment.js, index.js)
- **BuscaVagasAPIClient Class**: Modern fetch API with timeout handling and environment detection
- **Modular CSS**: Component-based styling (global/, components/, pages/)
- **Service Worker**: PWA support with sw.js
- **Archived Versions**: Historical UI iterations for reference and rollback
- **Vendor Management**: Complete third-party library bundling (jQuery, datepicker, Select2, Font Awesome 4.7, MDI Font)
- **Automated weekend vacancy search** for AFPESP hotels with configurable ranges
- **Vanilla JavaScript SPA** with no framework dependencies
- **Interactive Form**: Hotel selection with dynamic dropdown and date validation
- **Real-time Results**: Card-based UI with copy/clear functionality
- **Environment-Aware**: Dynamic API URLs (development/production with URL override)
- **AbortController Integration**: Request timeout management (30s/60s/600s)
- **Comprehensive Error Handling**: Network, timeout, and API error management
- **Status**: Production-ready with modern v2.0.0 architecture
- **Location**: `../monitora_vagas` (not a git submodule)

### Busca Vagas
**AFPESP Hotel Vacancy Search Backend API** (Sibling Project)
- Node.js/Express API server with Puppeteer-based scraping
- RESTful API endpoints for hotel search and vacancy queries
- Weekend search automation with configurable ranges (1-12 weekends)
- Health check, hotel list, and vacancy search endpoints
- Systemd service integration for production deployment
- **Status**: Production-ready with systemd deployment
- **Location**: `../busca_vagas` (not a git submodule)
- Full-stack job search application
- Express.js API server with CORS support
- Systemd service for production deployment
- **Status**: Active development
- **Location**: `../busca_vagas` (not a git submodule)

## 🛠 Development

### Quick Start
```bash
cd src
npm install
npm start
```
The development server runs at `http://localhost:8080` with live reload.

**Development Environment Configuration:**
- **Node.js**: v25.2.1 (managed via `.node-version` and `.nvmrc`)
- **EditorConfig**: Automatic code formatting via `.editorconfig`
- **Markdown Linting**: Configured via `.mdlrc` for AI-generated docs
- **Dependabot**: Automated weekly dependency updates (`.github/dependabot.yml`)
- See: `docs/development-guides/DEPENDABOT_SETUP.md`, `docs/documentation-standards/MARKDOWN_LINTING_GUIDE.md` for details

### Testing and Quality

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint markdown files
npm run lint:md
```

### Deployment and Automation

The project includes comprehensive shell scripts for production deployment:

```bash
# Two-step deployment process (v2.0.0)
./shell_scripts/sync_to_public.sh --step1          # Stage files in public folder
./shell_scripts/sync_to_public.sh --step2          # Deploy to production
./shell_scripts/sync_to_public.sh --both-steps     # Execute both steps

# Custom production directory
./shell_scripts/sync_to_public.sh --step2 --production-dir /var/www/mpbarbosa

# Legacy production deployment (nginx v2.0.0 - requires step1 first)
./shell_scripts/sync_to_public.sh --step1          # Prepare public directory
sudo ./shell_scripts/deploy_to_webserver.sh         # Deploy to nginx

# Validate external links security compliance (manual review required)
./shell_scripts/validate_external_links.sh

# Update all git submodules from remote repositories
./shell_scripts/pull_all_submodules.sh

# Deploy changes to all git submodules  
./shell_scripts/push_all_submodules.sh --handle-stash

# Note: Sibling projects (Monitora Vagas, Busca Vagas) managed independently
# at ../monitora_vagas and ../busca_vagas

# Tests & documentation workflow automation (v2.0.0)
./shell_scripts/workflow/execute_tests_docs_workflow.sh                # Full 13-step workflow
./shell_scripts/workflow/execute_tests_docs_workflow.sh --auto         # CI/CD mode (no prompts)
./shell_scripts/workflow/execute_tests_docs_workflow.sh --dry-run      # Preview workflow

# AI-assisted development
./shell_scripts/copilot_with_enhanced_prompt.sh "your task description"
```

**Deployment Features (v2.0.0):**
- Two-step deployment architecture (staging → production)
- Parametrized step control for flexible workflows
- Configurable production directory (default: /var/www/html)
- Automatic backup with 7-day retention for both public and production
- Comprehensive asset management (HTML, CSS, JS, images, webfonts)
- Music in Numbers and Guia Turístico git submodule support with complete module architecture
- Busca Vagas full-stack deployment (client HTML + Node.js API server)
- Monitora Vagas deployment from sibling project with:
  - Card-based vacancy results UI
  - Material Design 3 styling (md3-components.css, md3-results-cards.css, md3-theme.css)
  - API client configuration and testing tools
  - Copy/clear functionality for results management
- Systemd service deployment with sudo privilege handling for system directories
- Production environment validation with permission checks
- Comprehensive error handling with colored output
- Dry-run mode for validation
- Proper web server permissions (755/644)
- **Comprehensive test coverage**: 3,403 lines of Jest tests across 6 test suites (1,520 passing tests)

**Workflow Automation Features (v2.0.0):**
- **Fully modularized architecture**: 26 modules (13 libraries + 13 steps)
- **Main workflow script**: 4,740 lines with automatic module loading
- **Total modular code**: 6,993 lines across all modules
- Professional separation of concerns with single responsibility per module
- 13-step comprehensive workflow (Step 0-12: analysis → documentation → testing → markdown linting → git finalization)
- AI-powered with GitHub Copilot CLI (specialized personas for each step)
- **Copilot CLI authentication validation**: Automatic checks with multiple auth method support
- **Step 1 auto-save documentation**: Intelligent folder detection and automatic file saving
- Conventional commit message generation with comprehensive git context (Step 11)
- Markdown linting automation with AI assistance (Step 12)
- Smart execution modes: Interactive (default), Auto (CI/CD), Dry-run (preview)
- Two-phase validation: Automated detection + AI-powered deep analysis
- Workflow state management with backlog, logs, and summaries directories
- Performance optimized with git state caching
- **54 automated tests** with 100% pass rate
- **Reusable components** across multiple scripts
- See: `shell_scripts/workflow/README.md` for module documentation

### Selenium UI Tests

The Music in Numbers submodule includes a Selenium WebDriver-based UI test suite. To run those tests:

```bash
cd src/submodules/music_in_numbers
npm install
HEADLESS=true npm run test:selenium
```

Run with `HEADLESS=false` for an interactive browser session when debugging locally.

### Architecture Highlights
- **Static Site**: No build process required, direct browser execution
- **Modern Standards**: HTML5, CSS Grid, ES6+ JavaScript
- **HTML5 UP Dimension Template**: Responsive design with Font Awesome 5.x integration
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized loading with defer attributes and caching

## 📊 Technical Excellence

The project demonstrates **professional-grade architecture** with:
- **Modular Design**: Clean separation of HTML, CSS, and JavaScript
- **Scalable Structure**: Easy to extend and maintain
- **Performance Optimization**: Parallel loading and intelligent caching
- **Development Efficiency**: Reusable components and established patterns
- **Quality Assurance**: Comprehensive testing and validation
- **Enterprise Patterns**: Functional Core, Imperative Shell architecture

### 📚 Architecture Documentation

**Development Environment & Tools:**
- **[Dependabot Setup Guide](docs/development-guides/DEPENDABOT_SETUP.md)** - Automated dependency monitoring and security updates (`.github/dependabot.yml`)
- **[Markdown Linting Guide](docs/documentation-standards/MARKDOWN_LINTING_GUIDE.md)** - Best practices for AI-generated docs and `.mdlrc` configuration
- **[Markdown Linting Solution](docs/documentation-standards/MARKDOWN_LINTING_SOLUTION_SUMMARY.md)** - Complete solution for recurring linting issues
- **[Selenium E2E Setup Guide](docs/development-guides/SELENIUM_E2E_SETUP_GUIDE.md)** - Browser automation test configuration (Status: Not Yet Configured)
- **[Test Environment Reports](docs/development-guides/TEST_ENVIRONMENT_FINAL_REPORT.md)** - Comprehensive test environment documentation

**Architecture & Patterns:**
- **[Comprehensive UX Documentation](docs/development-guides/COMPREHENSIVE_UX_DOCUMENTATION.md)** - Complete user experience design guide with accessibility standards and interaction patterns
- **[Two-Step Deployment Architecture v2.0.0](docs/deployment-architecture/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)** - Comprehensive parametrized deployment workflow guide
- **[Tests & Docs Workflow Automation](docs/workflow-automation/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)** - AI-powered 13-step automation workflow (Complete ✅)
- **[Workflow Modular Architecture](shell_scripts/workflow/README.md)** - Complete module documentation (26 modules: 13 libraries + 13 steps)
- **[Workflow Phase 3 Completion](docs/workflow-automation/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md)** - Modularization completion report ⭐
- **[External Links Policy](docs/documentation-standards/EXTERNAL_LINKS_POLICY.md)** - Security and UX standards for external hyperlinks with tabnapping prevention
- **[Functional Core, Imperative Shell Guide](docs/development-guides/FUNCTIONAL_CORE_IMPERATIVE_SHELL_GUIDE.md)** - Comprehensive architectural pattern guide
- **[Resource Path Guide](docs/deployment-architecture/RESOURCE_PATH_GUIDE.md)** - Detailed path resolution strategies and deployment best practices
- **[Git Best Practices](docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md)** - Comprehensive version control workflow guide
- **[Complete Documentation](docs/README.md)** - Full technical documentation
- **[Development Guidelines](.github/copilot-instructions.md)** - Coding standards and workflow

This represents a **significant architectural achievement** in modern web development, transforming monolithic code into a maintainable, scalable, and professional codebase with proven enterprise patterns.

## ⚠️ Legacy Files and Deprecation Notice

The following files are **DEPRECATED** and no longer used by the current HTML5 UP Dimension template implementation:

### Main Site (src/)
- **`src/styles/main.css`** - Legacy Material Design stylesheet
  - **Status**: DEPRECATED - Template uses `src/assets/css/main.css` instead
  - **Reason**: Project migrated from Material Design to HTML5 UP Dimension template
  - **Action**: Retained for historical reference only

- **`src/scripts/main.js`** - Legacy JavaScript
  - **Status**: DEPRECATED - Template uses `src/assets/js/` utilities instead
  - **Reason**: HTML5 UP Dimension includes its own JavaScript framework
  - **Action**: Retained for historical reference only

- **`src/components/`** - Standalone HTML components
  - **Status**: DEPRECATED - Template uses inline article-based navigation
  - **Reason**: HTML5 UP Dimension uses modal-style articles instead of separate component files
  - **Files**: `about.html`, `contact.html`, `header.html`, `projects.html`
  - **Action**: Retained for historical reference only

### Current Template Stack
The site now uses the **HTML5 UP Dimension** template with:
- ✅ Responsive design with breakpoint optimization
- ✅ Font Awesome 5.x integration (brands, regular, solid icons)
- ✅ jQuery 3.x and custom utilities
- ✅ SASS source files in `assets/sass/`
- ✅ Compiled CSS in `assets/css/main.css`
- ✅ Modal-style article navigation with smooth transitions

**Note**: Subprojects may use different design systems:
- **Music in Numbers**: Custom Material Design implementation with theme switching
- **Guia Turístico**: Brazilian Portuguese Material Design UX
- **Monitora Vagas**: Vanilla JavaScript with Material Design 3 styling and card-based results UI
- **Busca Vagas**: Backend API service (no UI, RESTful endpoints)
