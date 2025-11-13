# MP Barbosa Personal Website

Static HTML personal portfolio website built on the **HTML5 UP Dimension** responsive template, showcasing personal projects with modern design and smooth transitions.

## 🎯 Project Overview

This is a professional portfolio website built with modern web standards, featuring:
- **HTML5 UP Dimension Template** - Fully responsive design with smooth modal transitions
- **Font Awesome Integration** - Professional iconography with brands, regular, and solid icon sets
- **Responsive Design** for all devices with breakpoint optimization
- **Personal Projects** showcase via Git submodules
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
│   ├── execute_tests_docs_workflow.sh # Tests & docs workflow automation (v2.0.0 - Phase 3 Complete)
│   ├── workflow/                      # Modular workflow architecture (v2.0.0 - Phase 3 Complete)
│   │   ├── lib/                       # 8 library modules (989 lines)
│   │   │   ├── config.sh              # Configuration and constants
│   │   │   ├── colors.sh              # ANSI color definitions
│   │   │   ├── utils.sh               # Utility functions
│   │   │   ├── git_cache.sh           # Git state caching
│   │   │   ├── validation.sh          # Pre-flight checks
│   │   │   ├── backlog.sh             # Issue tracking
│   │   │   ├── summary.sh             # Summary generation
│   │   │   └── ai_helpers.sh          # AI integration
│   │   ├── backlog/                   # Workflow execution backlog (v1.3.0)
│   │   │   ├── README.md              # Backlog management documentation
│   │   │   └── workflow_YYYYMMDD_HHMMSS/ # Timestamped workflow runs
│   │   ├── steps/                     # 12 step modules (3,324 lines)
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
│   │   │   └── step_11_git.sh         # AI-powered git finalization ⭐
│   │   ├── test_modules.sh            # Module testing script
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
│   │   ├── music_in_numbers.html     # Music in Numbers redirect
│   │   ├── guia_turistico.html       # Guia Turístico redirect
│   │   └── monitora_vagas.html       # Monitora Vagas redirect
│   ├── submodules/                   # Personal projects (Git submodules)
│   │   ├── music_in_numbers/         # 🎵 Music analytics platform
│   │   ├── guia_turistico/           # 🗺️ Travel guide application
│   │   └── monitora_vagas/           # 💼 Job monitoring application
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
│   └── [other documentation files]

├── summaries/                        # Workflow step summaries (v1.4.0)
│   ├── README.md                     # Summary documentation
│   └── workflow_YYYYMMDD_HHMMSS/    # Timestamped summary runs
├── logs/                             # Workflow execution logs (v1.5.0)
├── prompts/                          # AI workflow templates
│   └── tests_documentation_update_enhanced.txt
├── html5up-dimension/                # HTML5 UP Dimension template source
├── public/                           # Generated deployment directory (sync_to_public.sh output)
│   ├── index.html                    # Synchronized main page
│   ├── assets/                       # HTML5 UP Dimension template assets
│   ├── submodules/                   # Synchronized subproject content
│   └── [other synchronized files]
└── .github/                          # GitHub configuration
    └── copilot-instructions.md       # Development guidelines
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
**Job Monitoring Application**
- Automated job search and monitoring
- Custom filtering and alert systems
- Professional opportunity tracking
- **Status**: Active development

## 🛠 Development

### Quick Start
```bash
cd src
npm install
npm start
```
The development server runs at `http://localhost:8080` with live reload.

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

# Update all submodules from remote repositories
./shell_scripts/pull_all_submodules.sh

# Deploy changes to all submodules
./shell_scripts/push_all_submodules.sh --handle-stash

# Tests & documentation workflow automation (v2.0.0)
./shell_scripts/execute_tests_docs_workflow.sh                # Full 13-step workflow
./shell_scripts/execute_tests_docs_workflow.sh --auto         # CI/CD mode (no prompts)
./shell_scripts/execute_tests_docs_workflow.sh --dry-run      # Preview workflow

# AI-assisted development
./shell_scripts/copilot_with_enhanced_prompt.sh "your task description"
```

**Deployment Features (v2.0.0):**
- Two-step deployment architecture (staging → production)
- Parametrized step control for flexible workflows
- Configurable production directory (default: /var/www/html)
- Automatic backup with 7-day retention for both public and production
- Comprehensive asset management (HTML, CSS, JS, images, webfonts)
- Music in Numbers submodule support with complete module architecture
- Production environment validation with permission checks
- Comprehensive error handling with colored output
- Dry-run mode for validation
- Proper web server permissions (755/644)
- **Comprehensive test coverage**: 3,403 lines of Jest tests across 6 test suites (1,520 passing tests)

**Workflow Automation Features (v2.0.0):**
- **Fully modularized architecture**: 20 modules (8 libraries + 12 steps, 4,313 lines)
- Professional separation of concerns with single responsibility per module
- 13-step comprehensive workflow (analysis → documentation → testing → git finalization)
- AI-powered with GitHub Copilot CLI (11 enhanced steps with specialized personas)
- Conventional commit message generation with comprehensive git context
- Smart execution modes: Interactive (default), Auto (CI/CD), Dry-run (preview)
- Two-phase validation: Automated detection + AI-powered deep analysis
- Backlog tracking with timestamped workflow runs
- Summary generation with status indicators (✅ ⚠️ ❌)
- Performance optimized with git state caching (v1.5.0)
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
- **[Comprehensive UX Documentation](docs/COMPREHENSIVE_UX_DOCUMENTATION.md)** - Complete user experience design guide with accessibility standards and interaction patterns
- **[Two-Step Deployment Architecture v2.0.0](docs/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)** - Comprehensive parametrized deployment workflow guide
- **[Tests & Docs Workflow Automation](docs/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)** - AI-powered 13-step automation workflow (Phase 3 COMPLETE ✅)
- **[Workflow Modular Architecture](shell_scripts/workflow/README.md)** - Complete module documentation (20 modules, 4,313 lines extracted)
- **[Workflow Phase 3 Completion](docs/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md)** - All step modules extraction completion report ⭐
- **[External Links Policy](docs/EXTERNAL_LINKS_POLICY.md)** - Security and UX standards for external hyperlinks with tabnapping prevention
- **[Functional Core, Imperative Shell Guide](docs/FUNCTIONAL_CORE_IMPERATIVE_SHELL_GUIDE.md)** - Comprehensive architectural pattern guide
- **[Resource Path Guide](docs/RESOURCE_PATH_GUIDE.md)** - Detailed path resolution strategies and deployment best practices
- **[Git Best Practices](docs/GIT_BEST_PRACTICES_GUIDE.md)** - Comprehensive version control workflow guide
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
- **Monitora Vagas**: Custom design
