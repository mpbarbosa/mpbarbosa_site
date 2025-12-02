# MP Barbosa Personal Website

> **📄 File Size Note**  
> This comprehensive instructions file is 552 lines (~27,600 characters, ~6,900 tokens).  
> Size is **intentional** to provide complete development context in a single file.  
> Well within AI context limits (128K+ tokens for modern models).  
> Alternative: Split into `/docs/` if file exceeds 1,000 lines or 200K characters.

**ALWAYS** reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.

## Project Overview

This is a static HTML personal portfolio website for MP Barbosa built on the **HTML5 UP Dimension** responsive template. The site showcases personal projects, provides an about section, curriculum information, and includes interactive navigation with smooth transitions.

**Architecture Highlights**:
- **HTML5 UP Dimension Template**: Fully responsive design with modern CSS3/HTML5 features and Font Awesome integration
- **Multi-project structure**: Main site + 2 git submodules (Music in Numbers, Guia Turístico) + 2 sibling projects (Monitora Vagas, Busca Vagas)
- **Modern ES Modules**: `"type": "module"` with `.mjs` files and comprehensive Jest testing
- **Advanced submodule patterns**: Dependency injection, functional core/imperative shell architecture
- **Professional deployment**: Two-step deployment architecture (v2.0.0) with automated shell scripts for production nginx deployment

### 🎉 **Recent Major Achievement: Complete Modularization Success**
The Music in Numbers subproject has achieved **outstanding architectural transformation**:
- **Overall Code Reduction**: 85.8% (2,161 → 306 lines across major pages)
- **Index.html**: 84.5% reduction (1,581 → 246 lines) with 9 JavaScript modules
- **Artist.html**: 89.7% reduction (580 → 60 lines) with 3 specialized modules  
- **Development Efficiency**: 50% faster implementation using established patterns
- **Architecture Excellence**: Professional modular structure with zero functionality loss

## Working Effectively

### Bootstrap and Setup
1. Navigate to the project root: `cd /path/to/mpbarbosa_site`
2. Navigate to the src directory: `cd src`
3. Install dependencies: `npm install` -- takes approximately 30 seconds. Set timeout to 60+ seconds.
4. The build command is not yet implemented (`npm run build` only echoes a placeholder message)

### Running the Development Server
- Start the development server: `npm start` -- starts instantly (under 5 seconds)
- Alternative command: `npx live-server --port=8080`
- The server runs at: `http://127.0.0.1:8080` or `http://localhost:8080`
- Live reload is automatically enabled for HTML, CSS, and JavaScript changes

### Git Submodules (REQUIRES AUTHENTICATION)
- **WARNING**: Submodules require GitHub authentication and will fail in environments without proper credentials
- Two git submodules exist for personal projects:
  - `src/submodules/music_in_numbers` → Music in Numbers (Spotify analytics) project
  - `src/submodules/guia_turistico` → Guia Turístico (Travel Guide) project
- Two sibling projects (not submodules):
  - `../monitora_vagas` → Monitora Vagas (AFPESP hotel vacancy monitoring) - React SPA with API client
  - `../busca_vagas` → Busca Vagas (backend API service) - Node.js/Express with Puppeteer scraping
- To initialize submodules (when authenticated): `git submodule update --init --recursive`
- Automated submodule management available: `./shell_scripts/pull_all_submodules.sh`
- If submodules fail to initialize, the project links will show 404 errors but the main site will function normally

## Validation and Testing

### Manual Validation Scenarios
**ALWAYS** perform these validation steps after making changes:

1. **Homepage Loading**: Navigate to `http://127.0.0.1:8080` and verify:
   - Page loads without errors
   - HTML5 UP Dimension template loads with Font Awesome icons
   - Background image and overlay render correctly
   - Responsive preloader animation displays

2. **Navigation Testing**: 
   - Click "Intro", "Projetos (IA)", "About", and "Contact" navigation links
   - Verify smooth transitions and modal-style article displays
   - Test close button (X) on each article overlay
   - Verify background blur effect when articles are open

3. **Contact Form Testing**:
   - Open "Contact" article
   - Fill in form fields: Name, Email, Message
   - Submit form and verify expected behavior
   - Test form validation for required fields

4. **Project Links**: 
   - Navigate to "Projetos (IA)" section
   - Click "Scripts de automação", "Music in Numbers", and "Monitora Vagas" project links
   - **Expected behavior**: Submodule links will show 404 errors unless submodules are properly initialized
   - This is normal and documented behavior in environments without authentication
   - All project links follow consistent submodule navigation pattern

### Performance and Layout
- Test responsive design by resizing browser window (breakpoints: XLarge, Large, Medium, Small, XSmall)
- Verify Font Awesome icons load correctly (brands, regular, solid)
- Verify background image transitions and parallax effects
- Test keyboard navigation (ESC key closes articles, arrow keys navigate)
- Verify all sections render correctly in different viewport sizes

## Common Tasks and File Structure

### Key Files and Directories
```
mpbarbosa_site/
├── .github/                    # GitHub configuration and workflows
│   └── copilot-instructions.md # These instructions
├── shell_scripts/              # Automation and deployment scripts
│   ├── sync_to_public.sh       # Two-step deployment script (v2.0.0)
│   ├── deploy_to_webserver.sh  # Legacy production deployment to nginx
│   ├── pull_all_submodules.sh  # Update all submodules
│   ├── push_all_submodules.sh  # Deploy submodule changes
│   ├── cleanup_old_folders.sh  # Automated cleanup of old workflow/backlog folders
│   ├── fix_documentation_consistency.sh  # Documentation consistency fixes
│   ├── workflow/               # Modular workflow architecture (v2.0.0)
│   │   ├── execute_tests_docs_workflow.sh  # Main workflow script (4,740 lines)
│   │   ├── lib/               # 12 library modules
│   │   ├── steps/             # 13 step modules (step_00 through step_12)
│   │   ├── backlog/           # Workflow execution history
│   │   ├── logs/              # Workflow execution logs
│   │   └── summaries/         # Step execution summaries
│   └── README.md              # Shell scripts documentation
├── public/                     # Deployment staging directory (sync_to_public.sh output)
│   ├── index.html             # Synchronized main page
│   ├── assets/                # Synchronized HTML5 UP Dimension assets
│   ├── api/                   # Busca Vagas API proxy (symlink to backend in production)
│   └── submodules/            # Synchronized subproject content
│       ├── monitora_vagas/    # AFPESP hotel monitoring React app
│       │   └── src/
│       │       ├── api-test.html        # API testing tool for Busca Vagas backend
│       │       ├── config/environment.js # Browser-compatible env config with dynamic API URLs
│       │       ├── services/apiClient.js # BuscaVagasAPIClient service class
│       │       └── components/QuickSearch/ # Weekend vacancy search component
│       ├── music_in_numbers/  # Spotify analytics submodule
│       └── guia_turistico/    # Travel guide submodule
├── src/                        # Main source directory 
│   ├── index.html             # Main landing page (HTML5 UP Dimension template)
│   ├── package.json           # Node.js dependencies and scripts
│   ├── assets/                # HTML5 UP Dimension template assets
│   │   ├── css/               # Compiled stylesheets (main.css, noscript.css, fontawesome)
│   │   ├── js/                # JavaScript utilities (jQuery, breakpoints, browser, util)
│   │   ├── sass/              # SASS source files (base, components, layout, libs)
│   │   └── webfonts/          # Font Awesome web fonts (brands, regular, solid)
│   ├── images/                # Background and content images
│   ├── styles/
│   │   └── main.css          # Legacy Material Design stylesheet (deprecated)
│   ├── scripts/
│   │   └── main.js           # Legacy JavaScript (deprecated, template uses assets/js/)
│   ├── components/            # Individual HTML components (not used in current template)
│   │   ├── about.html        # Standalone about page
│   │   ├── contact.html      # Standalone contact page
│   │   ├── header.html       # Standalone header component
│   │   └── projects.html     # Standalone projects page
│   ├── pages/                 # Redirect pages for projects
│   │   ├── music_in_numbers.html    # Redirects to submodule
│   │   ├── guia_turistico.html      # Redirects to submodule
│   │   ├── monitora_vagas.html      # Redirects to sibling project
│   │   └── busca_vagas.html         # Redirects to sibling project
│   └── submodules/            # Git submodules for projects
│       ├── music_in_numbers/  # Spotify analytics (client-side)
│       └── guia_turistico/    # Travel guide (client-side)
├── .gitmodules               # Git submodule configuration (music_in_numbers, guia_turistico)
├── index.html               # Simple redirect to mpbarbosa.com
└── README.md               # Project documentation
```

### Development Workflow
1. **Start development**: Run `npm start` in the `src/` directory
2. **Make changes**: Edit HTML, CSS, or JavaScript files
3. **Test changes**: Live-server automatically reloads the browser
4. **Validate**: Run through the manual validation scenarios above
5. **No build step**: This is a static site, no compilation required

### Deployment and Automation
The project includes comprehensive shell scripts for deployment and maintenance:

#### Production Deployment (Two-Step Architecture v2.0.0)
```bash
# Two-Step Deployment Process:
# Step 1: Source → Public (staging)
./shell_scripts/sync_to_public.sh --step1 --verbose

# Step 2: Public → Production (deployment) 
./shell_scripts/sync_to_public.sh --step2 --production-dir /var/www/html

# Combined deployment (both steps)
./shell_scripts/sync_to_public.sh --both-steps

# Legacy deployment script v2.0.0 (uses public directory as source)
# Requires sync_to_public.sh --step1 to prepare files first
sudo ./shell_scripts/deploy_to_webserver.sh

# Features (sync_to_public.sh v2.0.0):
# - Parametrized step control (--step1, --step2, --both-steps)
# - Flexible production directory configuration (default: /var/www/html)
# - Comprehensive asset management (HTML, CSS, JS, images, webfonts)
# - Music in Numbers submodule support with complete module architecture
# - Monitora Vagas deployment with API client configuration and testing tools
# - Busca Vagas full-stack deployment (client HTML + server API)
# - Systemd service deployment with sudo privilege handling for system directories
# - Enhanced backup system for both public and production directories
# - Production environment validation with permission checks  
# - Comprehensive error handling with colored output
# - Dry-run mode for safe operation preview
# - Proper web server permissions (755 for directories, 644 for files)
# - Detailed deployment summary with file counts and validation
# - Comprehensive test coverage (849 lines, 53 tests, 52/53 passing)

# Features (deploy_to_webserver.sh v2.0.0):
# - Uses public directory as source (requires sync_to_public.sh step1 first)
# - Simplified deployment path with pre-staged files
# - Maintains backward compatibility with existing workflows
# - Automatic validation of public directory preparation
# - Enhanced permission management for web-ready files
# - Git validation updated to check project root instead of source directory
# - All file paths updated for new public directory structure
# - Comprehensive test coverage shared with sync_to_public.sh
```

#### Busca Vagas API Server (Systemd Service)
```bash
# Systemd service configuration for production Node.js API server
# Note: Busca Vagas is now a sibling project at ../busca_vagas
# Location: ../busca_vagas/config/busca_vagas_node_app.service

# Install systemd service (production only)
sudo cp ../busca_vagas/config/busca_vagas_node_app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable busca_vagas_node_app.service
sudo systemctl start busca_vagas_node_app.service

# Service management
sudo systemctl status busca_vagas_node_app.service  # Check status
sudo systemctl restart busca_vagas_node_app.service # Restart after updates
sudo systemctl stop busca_vagas_node_app.service    # Stop service

# Service details:
# - Express.js API server with CORS support
# - Middleware: express.json(), express.urlencoded()
# - Auto-restart on failure
# - Runs on port 3000 (configurable via PORT env variable)
# - WorkingDirectory and User must be configured for production environment
```

#### Tests & Documentation Workflow Automation (v2.0.0)
```bash
# Full automated workflow (13 steps: Step 0-12)
./shell_scripts/workflow/execute_tests_docs_workflow.sh

# Preview without executing
./shell_scripts/workflow/execute_tests_docs_workflow.sh --dry-run

# Automatic mode (CI/CD compatible, no prompts)
./shell_scripts/workflow/execute_tests_docs_workflow.sh --auto

# Interactive mode with confirmations (default)
./shell_scripts/workflow/execute_tests_docs_workflow.sh --interactive

# Features:
# - Complete tests & documentation update automation
# - AI-powered analysis with GitHub Copilot CLI integration
# - 13 workflow steps (Step 0-12) with specialized AI personas
# - AI-powered conventional commit message generation (Step 11)
# - Markdown linting automation with AI assistance (Step 12)
# - Two-phase validation (automated + AI-powered)
# - Smart triggering (auto/interactive/optional modes)
# - Comprehensive error handling with colored output
# - Progress tracking and workflow state management
# 
# Architecture (v2.0.0 - Complete Modularization ✅):
# - Fully modularized: 26 modules (13 libraries [12 .sh + ai_helpers.yaml] + 13 steps)
# - Main workflow script: 4,740 lines with module loading architecture
# - Library modules: 13 files (ai_helpers.sh + ai_helpers.yaml, backlog, colors, config,
#   file_operations, git_cache, performance, session_manager, step_execution, summary, utils, validation)
# - Step modules: 13 files (step_00 through step_12)
# - Total modular code: 6,993 lines extracted from monolithic architecture
# - YAML configuration system: Externalized AI prompt templates (762 lines)
# - Professional separation of concerns with single responsibility principle
# - Comprehensive automated test coverage (54 tests, 100% pass rate)
# - Reusable components across scripts
# - Module Documentation: shell_scripts/workflow/README.md
# - Completion Report: docs/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md
```

#### Submodule Management
```bash
# Update all git submodules (music_in_numbers, guia_turistico) from remote repositories
./shell_scripts/pull_all_submodules.sh

# Deploy changes to all git submodules
./shell_scripts/push_all_submodules.sh --handle-stash

# Preview submodule operations
./shell_scripts/pull_all_submodules.sh --dry-run
./shell_scripts/push_all_submodules.sh --dry-run

# Note: Monitora Vagas and Busca Vagas are now sibling projects
# Manage them independently at ../monitora_vagas and ../busca_vagas
```

### Important Notes
- **Linting Tools**: Markdown linting available via `npm run lint:md` (markdownlint); no ESLint or HTMLHint configured
- **Jest Testing Framework**: Comprehensive test suite exists in `src/__tests__/` with coverage reporting
- **ES Modules**: Project uses `"type": "module"` with `.mjs` files for modern JavaScript
- **No CI/CD**: No GitHub Actions or other continuous integration configured
- **HTML5 UP Dimension Template**: Uses responsive template with Font Awesome icons and jQuery utilities
- **External dependencies**: Font Awesome webfonts bundled locally, jQuery and utilities included in assets
- **Browser compatibility**: Designed for modern browsers supporting ES6+, CSS Grid, and HTML5 features
- **Template License**: HTML5 UP Dimension released under Creative Commons Attribution 3.0 License

### Critical Path Resolution Guidelines (October 2025)
**ALWAYS** follow these path resolution rules to prevent critical resource loading failures:

1. **Submodule HTML Files**: Use relative paths only
   ```html
   <!-- ✅ CORRECT for submodule files -->
   <link rel="stylesheet" href="styles/themes.css">
   <script defer src="scripts/utils.js"></script>
   
   <!-- ❌ WRONG - causes 404 errors -->
   <link rel="stylesheet" href="submodules/music_in_numbers/src/styles/themes.css">
   ```

2. **Access Method Testing**: Always test both access patterns:
   - Direct submodule access: `http://127.0.0.1:8080/submodules/music_in_numbers/src/`
   - Main site integration: Via redirect pages or navigation

3. **Path Strategy Consistency**: Never mix relative and absolute server-root paths within the same HTML file

4. **Resource Validation**: Verify no 404 errors in browser console and live-server logs show successful GET requests

**Reference**: See `/docs/RESOURCE_PATH_GUIDE.md` for comprehensive path resolution documentation.

## Troubleshooting

### Common Issues
1. **404 errors for project links**: Normal when submodules aren't initialized
2. **Template assets not loading**: Verify `assets/` directory structure is intact
3. **npm vulnerabilities**: The project uses `live-server@1.2.1` which has known vulnerabilities but is only for development
4. **Port conflicts**: If port 8080 is in use, live-server will automatically find another available port
5. **Font Awesome icons not showing**: Check that `assets/webfonts/` directory contains all font files
6. **Background image missing**: Verify `images/bg.jpg` and `images/overlay.png` exist

### Quick Fixes
- **Server won't start**: Ensure you're in the `src/` directory and `npm install` was successful
- **Changes not reflecting**: Check if live-server is running and browser is pointed to correct localhost URL
- **Template styling broken**: Clear browser cache and verify `assets/css/main.css` exists
- **JavaScript errors**: Check browser console for missing dependencies in `assets/js/`

## File Reference

### package.json Scripts
```json
{
  "scripts": {
    "start": "live-server .",
    "build": "echo 'Build step not defined yet.'",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
    "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage",
    "lint:md": "mdl --git-recurse --ignore-front-matter ."
  },
  "jest": {
    "testEnvironment": "jsdom",
    "transform": {},
    "testMatch": [
      "**/__tests__/**/*.test.js",
      "**/?(*.)+(spec|test).js"
    ],
    "collectCoverageFrom": [
      "scripts/**/*.{js,mjs}",
      "submodules/guia_turistico/src/libs/guia_js/src/**/*.js",
      "submodules/music_in_numbers/src/**/*.js"
    ]
  }
}
```

### Key Dependencies
- `live-server@1.2.1` (development server with live reload)

### External Resources Used
- **HTML5 UP Dimension Template**: Responsive site template (html5up.net)
  - License: Creative Commons Attribution 3.0 (html5up.net/license)
  - Includes: jQuery 3.x, Font Awesome 5.x, custom utilities
- **Font Awesome 5.x**: Icon fonts (bundled in assets/webfonts/)
  - Brands, Regular, and Solid icon sets
- **jQuery 3.x**: JavaScript library (bundled in assets/js/jquery.min.js)

### Workflow Automation Tools
- `execute_tests_docs_workflow.sh` (v2.0.0) - AI-powered tests & documentation automation
  - 13-step workflow for comprehensive project maintenance
  - GitHub Copilot CLI integration with specialized personas
  - Conventional commit message generation
  - Smart modes: interactive, auto, dry-run
  - **Modular architecture**: 26 modules (13 libraries + 13 steps)
  - **6,993 lines modularized** for professional separation of concerns
  - **YAML configuration system**: Externalized AI prompt templates (762 lines)
  - See: `shell_scripts/workflow/README.md` for module documentation

## Modular Architecture Excellence

### Monitora Vagas (AFPESP Hotel Monitoring) Architecture
The Monitora Vagas project showcases **production-ready React SPA with API integration**:

#### Core Features
- **React-based UI**: Single-page application for AFPESP hotel vacancy monitoring
- **API Client Service**: Comprehensive BuscaVagasAPIClient for backend communication
- **Environment-Aware Configuration**: Dynamic API endpoint detection (development/production)
- **Weekend Search**: Automated multi-weekend vacancy scanning with progress tracking

#### Key Components

**Configuration Layer** (`config/environment.js`):
- Browser-compatible environment detection (no Node.js process.env dependency)
- Dynamic API base URL: `http://localhost:3000/api` (dev) or `https://www.mpbarbosa.com/api` (prod)
- Feature flags based on environment (logging, analytics, caching)
- Environment-specific configurations for security and performance

**API Client Service** (`services/apiClient.js`):
- `BuscaVagasAPIClient` class with singleton pattern
- Health check endpoint: `/api/health`
- Hotel list endpoints: `/api/vagas/hoteis` (cached), `/api/vagas/hoteis/scrape` (live)
- Vacancy search: `/api/vagas/search?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD`
- Weekend search: `/api/vagas/search/weekends?count=1-12`
- Configurable timeouts: 30s (default), 60s (search), 600s (weekend search)
- Automatic retry with exponential backoff for server errors
- 5-minute response caching with Map-based cache storage
- ISO 8601 date formatting for API compliance

**UI Components** (`components/QuickSearch/`):
- `HotelVacancyService` class for weekend vacancy orchestration
- Next weekend calculation (Friday-Sunday pattern)
- API response transformation to component format
- Comprehensive weekend summary display with availability statistics

**Testing Tools** (`api-test.html`):
- Standalone API testing interface for developers
- Interactive buttons for all API endpoints
- Real-time response display with formatted JSON
- Visual feedback for success/error states
- 10-minute timeout support for long-running weekend searches

#### Integration with Busca Vagas Backend
- **Backend Repository**: `../busca_vagas` (sibling project)
- **API Server**: Node.js/Express with Puppeteer-based scraping
- **Production Deployment**: Systemd service at `/etc/systemd/system/busca_vagas_node_app.service`
- **Port**: 3000 (configurable via PORT environment variable)
- **CORS**: Configured for `http://localhost:5173` (development)

### Music in Numbers Subproject Structure
The Music in Numbers project demonstrates **professional-grade modular architecture**:

#### HTML Pages (Clean Semantic Structure)
- `src/index.html` (246 lines) - Main analytics dashboard
- `src/artist.html` (60 lines) - Artist information display

#### CSS Modules (Organized Styling)
- `styles/main.css` - DEPRECATED: Legacy Material Design stylesheet (template uses assets/css/main.css)
- `styles/components.css` - Shared UI components
- `styles/themes.css` - Theme system (light/dark/high-contrast)
- `styles/artist-components.css` - Artist-specific styling

#### JavaScript Modules (Single Responsibility)
- `scripts/theme-manager.js` - Theme switching and persistence
- `scripts/data-export.js` - PDF/CSV/JSON export functionality
- `scripts/performance.js` - Caching and optimization
- `scripts/spotify-api.js` - OAuth and API integration
- `scripts/analytics.js` - Music pattern analysis
- `scripts/ui-components.js` - Interactive UI elements
- `scripts/real-time.js` - Live monitoring features
- `scripts/utils.js` - Common utilities
- `scripts/initialization.js` - Application bootstrap
- `scripts/artist-ui.js` - Artist UI components
- `scripts/artist-api.js` - Artist data processing
- `scripts/artist-page.js` - Artist page orchestration

#### Architecture Benefits
- **85.8% Code Reduction**: From 2,161 to 306 lines across major pages
- **Zero Functionality Loss**: All features preserved and enhanced
- **Development Efficiency**: 50% faster implementation using established patterns
- **Professional Quality**: Industry-standard separation of concerns
- **Scalable Foundation**: Easy to extend with new features and pages

### Development Patterns
When working on the Music in Numbers project:
1. **Leverage Existing Modules**: Reuse shared components (utils.js, spotify-api.js, etc.)
2. **Follow Established Patterns**: Use the same modular approach for new pages
3. **Maintain Separation**: Keep HTML, CSS, and JavaScript in separate files
4. **Use Defer Loading**: Scripts should load with defer attributes for performance
5. **Document Changes**: Update completion reports and architecture documentation

### Testing and ES Module Patterns
This project uses modern ES modules with Jest testing:

#### ES Module Structure
- **Main files**: Use `.mjs` extension (e.g., `scripts/main.mjs`)
- **Exports**: Use named exports for testability
- **Imports**: Use ES6 import syntax consistently
- **Type**: `package.json` includes `"type": "module"`

#### Express.js Middleware in ES Modules
When working with Express.js in ES module projects:
- **Correct syntax**: Use `express.json()` and `express.urlencoded()` as methods on the express object
- **Incorrect syntax**: ❌ `import { json, urlencoded } from 'express'` (causes TypeError)
- **Example**:
  ```javascript
  import express from 'express';
  const app = express();
  
  // ✅ Correct: Call middleware as express methods
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // ❌ Incorrect: Named imports don't work for middleware
  // import { json, urlencoded } from 'express';
  // app.use(json());  // TypeError: json is not a function
  ```

#### Testing Approach
```javascript
// Example: Testable function with named export
export function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    // ... implementation
    return links.length; // Return value for testing
}

// Test structure in __tests__/
import { setupSmoothScrolling } from '../scripts/main.mjs';
test('should set up smooth scrolling', () => {
    const linkCount = setupSmoothScrolling();
    expect(linkCount).toBe(3);
});
```

#### Key Testing Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Test specific file
npm test -- main.test.js

# Lint markdown files (requires mdl: gem install mdl)
npm run lint:md
```

## 🏗️ Advanced Architecture Patterns

### Dependency Injection & "Functional Core, Imperative Shell"
The Music in Numbers subproject demonstrates enterprise-grade patterns:

- **API Class Extraction**: Professional 5-class architectures with dependency injection
- **Separation Pattern**: Pure functions in Core/Processors, side effects in Shell/Utilities
- **Example Structure**:
  ```
  scripts/analytics/
  ├── AnalyticsValidators.js    # Pure validation functions
  ├── AnalyticsProcessors.js    # Pure data processing
  ├── AnalyticsUIBuilders.js    # Pure UI building functions
  ├── AnalyticsCore.js          # Orchestration with injected dependencies
  └── AnalyticsUtilities.js     # DI factory with environment detection
  ```

### Shell Script Automation
Critical deployment and maintenance patterns:

```bash
# Hierarchical submodule management (bottom-up)
./shell_scripts/pull_all_submodules.sh --dry-run
./shell_scripts/push_all_submodules.sh --handle-stash

# Features:
# - Dynamic branch detection (works with any branch, not just main)
# - Recursive submodule discovery using git submodule foreach
# - Absolute path resolution for nested submodules
# - Safe stash management and comprehensive verification

# Two-step production deployment with nginx integration (v2.0.0)
./shell_scripts/sync_to_public.sh --step1 --dry-run
./shell_scripts/sync_to_public.sh --step2 --production-dir /var/www/html
./shell_scripts/sync_to_public.sh --both-steps

# Legacy deployment v2.0.0 (uses public directory as source, requires sync_to_public.sh step1 first)
sudo ./shell_scripts/deploy_to_webserver.sh --dry-run

# Tests & Documentation workflow automation (AI-powered)
./shell_scripts/workflow/execute_tests_docs_workflow.sh --dry-run
./shell_scripts/workflow/execute_tests_docs_workflow.sh --interactive  # Default mode
./shell_scripts/workflow/execute_tests_docs_workflow.sh --auto        # CI/CD mode

# Modular workflow architecture (v2.0.0 - Complete Modularization)
# See: shell_scripts/workflow/README.md for module documentation
# 26 modules total:
# - 13 libraries: ai_helpers.sh, ai_helpers.yaml (YAML config), backlog, colors, config,
#                 file_operations, git_cache, performance, session_manager, step_execution,
#                 summary, utils, validation
# - 13 steps: step_00 through step_12 (Pre-Analysis through Markdown Linting)
# Main workflow script: 4,740 lines with module loading architecture
# Total modular code: 6,993 lines (excluding test/utility scripts)
# YAML configuration: 762 lines of externalized AI prompt templates
# Workflow locations: backlog/, logs/, summaries/ all in shell_scripts/workflow/
```

**Key Patterns**: 
- Always use `--dry-run` first to preview operations before executing
- For deployment: Use `sync_to_public.sh --step1` to prepare files in /public directory
- Step 2 options: Either `sync_to_public.sh --step2` or legacy `deploy_to_webserver.sh` (v2.0.0)
- Both scripts now at v2.0.0: `sync_to_public.sh` with two-step architecture, `deploy_to_webserver.sh` with public source
- Legacy `deploy_to_webserver.sh` uses `/public` as source (requires step1 to run first)
- Production directory is configurable via `--production-dir` parameter (default: `/var/www/html`)
- Use `--both-steps` for complete source-to-production deployment in one command
- Legacy script requires sudo for web server directory access
- Git validation updated: deploy_to_webserver checks project root, not source directory

### AI-Powered Workflow Automation Best Practices

The `execute_tests_docs_workflow.sh` script demonstrates professional AI integration patterns:

#### AI Persona Selection Strategy
- **Match personas to task domain**: Each workflow step uses specialized expertise (Git Workflow Specialist, DevOps Engineer, QA Automation Specialist)
- **Combine complementary skills**: Complex tasks benefit from dual personas (e.g., "Git Workflow Specialist + Technical Communication Expert")
- **Provide comprehensive context**: AI quality depends on repository state, diff analysis, and categorized changes

#### Modern Copilot CLI Integration
- **Use `copilot -p` for interactive workflows**: Embrace the conversation UI rather than fighting it
- **Copy-paste workflow**: Let AI generate in its UI, then user copies/pastes the result
- **Smart triggering**: Auto mode skips interactive AI, Interactive mode prompts, Optional mode provides choice
- **Graceful degradation**: Always provide fallbacks when Copilot CLI unavailable

#### Two-Phase Validation Architecture
All AI-enhanced steps follow this pattern:
1. **Phase 1 - Automated Detection**: Fast checks for common issues (4-9 automated checks per step)
2. **Phase 2 - AI-Powered Analysis**: Deep analysis with specialized persona prompts (5+ analysis categories)

Example from Step 11 (Git Finalization):
- **Phase 1**: Git state analysis, change enumeration, diff statistics, commit type inference
- **Phase 2**: AI-powered conventional commit message generation with comprehensive git context

#### Conventional Commit Message Generation (Step 11)
Step 11 showcases AI-assisted git best practices with complete modular implementation:

**Phase 1 - Automated Git Analysis** (4 checks):
- Repository state analysis (branch, commits ahead/behind)
- Change enumeration (modified, staged, untracked, deleted files)
- Diff statistics and file categorization (docs, tests, scripts, code)
- Commit type inference based on change patterns

**Phase 2 - AI Commit Message Generation** (5 tasks):
- Conventional commit message crafting (type, scope, subject)
- Semantic context integration with workflow metadata
- Change impact description and file change statistics
- Breaking change detection and documentation
- Professional commit body & footer generation

**AI Integration Features**:
- Git Workflow Specialist + Technical Communication Expert persona
- Interactive copy-paste workflow from Copilot UI
- Auto-mode with intelligent default messages
- Conventional commits standard compliance
- Semantic versioning best practices integration

**Module**: `shell_scripts/workflow/steps/step_11_git.sh` (417 lines)

## 📖 Related Documentation References

For comprehensive development guidance, consult these detailed documentation resources:

### Architecture & Development
- **[Comprehensive UX Documentation](../docs/COMPREHENSIVE_UX_DOCUMENTATION.md)** - Complete user experience design guide covering navigation patterns, accessibility features, responsive design, and interaction design across all project components
- **[Resource Path Guide](../docs/RESOURCE_PATH_GUIDE.md)** - Detailed path resolution strategies and troubleshooting for submodule deployment
- **[Path Resolution Fix Report](../docs/PATH_RESOLUTION_FIX_COMPLETION_REPORT.md)** - Technical incident report and lessons learned
- **[Modularization Achievements](../docs/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md)** - Architecture improvements and code reduction metrics
- **[Dependency Injection Best Practices](../docs/DEPENDENCY_INJECTION_BEST_PRACTICES.md)** - Enterprise patterns for scalable JavaScript architecture

### Workflow Automation
- **[Workflow Automation Version Evolution](../docs/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md)** - Complete version history v1.0.0 through v1.5.0 with migration guide
- **[Tests & Docs Workflow Plan](../docs/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)** - Comprehensive development plan for workflow automation script
- **[Workflow Automation Phase 2 Completion](../docs/WORKFLOW_AUTOMATION_PHASE2_COMPLETION.md)** - Implementation completion report for v1.0.0 (HISTORICAL)
- **[Workflow Modularization Phase 1 Completion](../docs/WORKFLOW_MODULARIZATION_PHASE1_COMPLETION.md)** - Library modules extraction completion
- **[Workflow Modularization Phase 2 Completion](../docs/WORKFLOW_MODULARIZATION_PHASE2_COMPLETION.md)** - Additional library modules completion
- **[Workflow Modularization Phase 3 Completion](../docs/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md)** - All step modules extraction COMPLETE ✅
- **[Step 11 Git Enhancement](../docs/STEP11_GIT_FINALIZATION_ENHANCEMENT.md)** - AI-powered conventional commit message generation
- **[Workflow Execution Context](../docs/WORKFLOW_EXECUTION_CONTEXT_ANALYSIS.md)** - Execution context and best practices analysis

### Deployment
- **[Sync to Public Functional Documentation](../docs/SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md)** - Two-step deployment architecture functional guide
- **[Sync to Public Technical Documentation](../docs/SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md)** - Technical implementation details

### Historical Validation Reports (v2.0.0 - Consolidated)
- **[Directory Structure Validation History](../docs/DIRECTORY_STRUCTURE_VALIDATION_HISTORY_CONSOLIDATED.md)** - 9 historical reports consolidated (Nov 13-25, 2025), all ✅ EXCELLENT status
- **[Documentation Consistency History](../docs/DOCUMENTATION_CONSISTENCY_HISTORY_CONSOLIDATED.md)** - Historical cross-reference and terminology tracking
- **[Shell Script Validation History](../docs/SHELL_SCRIPT_VALIDATION_HISTORY_CONSOLIDATED.md)** - Shell script quality and best practices compliance history

**Note**: Individual timestamped validation reports have been archived into consolidated files to maintain repository cleanliness while preserving complete historical analysis.

Always verify the development server starts successfully and the main page loads before making any modifications to the codebase.