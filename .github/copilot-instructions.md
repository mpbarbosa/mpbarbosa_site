# MP Barbosa Personal Website

> **📄 File Size Note**
> This comprehensive instructions file is 863 lines (~46,600 characters, ~11,650 tokens).
> Size is **intentional** to provide complete development context in a single file.
> Well within AI context limits (128K+ tokens for modern models).
> Alternative: Split into `/docs/` if file exceeds 1,000 lines or 200K characters.

> **📅 Last Verified**: 2025-12-25  
> This document is actively maintained and verified for accuracy.

**ALWAYS** reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.

## Project Overview

This is a static HTML personal portfolio website for MP Barbosa built on the **HTML5 UP Dimension** responsive template. The site showcases personal projects, provides an about section, curriculum information, direct link to GitHub repositories, and includes interactive navigation with smooth transitions.

**Architecture Highlights**:
- **HTML5 UP Dimension Template**: Fully responsive design with modern CSS3/HTML5 features and Font Awesome integration
- **Sibling project structure**: Main site + 4 independent sibling projects (Music in Numbers, Guia Turístico, Monitora Vagas, Busca Vagas)
- **Modern ES Modules**: `"type": "module"` with `.mjs` files and comprehensive Jest testing
- **Advanced architectural patterns**: Dependency injection, functional core/imperative shell architecture
- **Professional deployment**: Two-step git-based staging architecture (v3.0.0) with automated shell scripts for production nginx deployment
- **Sibling project integration**: Four external projects deployed alongside main site (Music in Numbers, Guia Turístico, Monitora Vagas, Busca Vagas)
- **Git-versioned staging**: Dedicated mpbarbosa.com repository for staging with full version control and rollback capability

### 🏗️ **Sibling Project Architecture** (Important Terminology)
This project uses a **sibling project architecture** where external repositories live alongside the main repository:
- **What they are**: Independent Git repositories in parent directory (`../*`)
- **NOT git submodules**: `.gitmodules` is empty, no `git submodule` commands used
- **Deployment**: All projects deploy to `../mpbarbosa.com/` staging repository (v3.0.0)
- **Management**: Each project managed independently with standard git commands
- **Staging Repository**: `../mpbarbosa.com/` is a dedicated git repository for staging before production deployment

### 🎉 **Recent Major Achievement: Complete Modularization Success**
The Music in Numbers sibling project has achieved **outstanding architectural transformation**:
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

### Development Environment Configuration
The project includes comprehensive development environment configuration:

**EditorConfig** (`.editorconfig`):
- Enforces consistent coding styles across editors and IDEs
- Configures indentation, line endings, charset, and file endings
- Supports: Markdown (4 spaces), JavaScript/TypeScript (2 spaces), Shell scripts (tabs), HTML/CSS (2 spaces)

**Node.js Version Management** (`.node-version`, `.nvmrc`):
- Project uses Node.js **v25.2.1**
- Compatible with nvm, fnm, and other Node version managers
- Ensures consistent runtime across development environments

**Markdown Linting** (`.mdlrc`):
- Configures markdownlint rules for AI-generated documentation
- Disables problematic rules: MD001, MD002, MD005, MD007, MD012, MD013, MD022, MD025, MD029, MD031, MD032, MD046
- Maintains critical rules: MD009 (trailing spaces), MD026 (header punctuation), MD047 (file endings)
- Run linting: `npm run lint:md` (requires Ruby gem: `gem install mdl`)

**Automated Dependency Updates** (`.github/dependabot.yml`):
- Weekly dependency scanning on Mondays at 09:00 (America/Sao_Paulo)
- Monitors: NPM dependencies (`/src/package.json`) and GitHub Actions
- Intelligent grouping: Separates dev vs production dependencies
- Auto-assigns PRs to @mpbarbosa with conventional commit messages
- See: `docs/development-guides/DEPENDABOT_SETUP.md` for configuration details

**Git Hooks** (`.git-hooks/`):
- Custom git hook implementation for code quality enforcement
- Pre-commit hook: Runs accessibility tests, markdown linting, and shell script validation
- Pre-push hook: Runs full test suite before pushing changes
- Installation: `./shell_scripts/install_hooks.sh` (creates symlinks from `.git-hooks/` to `.git/hooks/`)
- Prevents commits/pushes that fail quality checks
- See: `.git-hooks/README.md` for hook documentation

### Running the Development Server
- Start the development server: `npm start` -- starts instantly (under 5 seconds)
- Alternative command: `npx live-server --port=8080`
- The server runs at: `http://127.0.0.1:8080` or `http://localhost:8080`
- Live reload is automatically enabled for HTML, CSS, and JavaScript changes

### Sibling Projects Architecture
- **All four projects are independent repositories managed as sibling projects**
- Four sibling projects:
  - `../music_in_numbers` → Music in Numbers (Spotify analytics) - Client-side web application
  - `../guia_turistico` → Guia Turístico (Travel Guide) - Tourism guide application
  - `../monitora_vagas` → Monitora Vagas (AFPESP hotel vacancy monitoring) - Vanilla JavaScript SPA with API client
  - `../busca_vagas` → Busca Vagas (backend API service) - Node.js/Express with Puppeteer scraping
- Each sibling project is managed independently in its own repository
- Deployment is handled via `sync_to_staging.sh` which copies from sibling directories to `mpbarbosa.com/` directory
- **Architecture Complete**: All sibling projects now deployed at top level of `mpbarbosa.com/` directory
- **Legacy Directory Removed**: The `mpbarbosa.com/submodules/` directory has been completely migrated out
- **Architecture Note**: This project does NOT use git submodules (`.gitmodules` is empty) - all projects use independent sibling architecture

## Validation and Testing

### Manual Validation Scenarios
**ALWAYS** perform these validation steps after making changes:

1. **Homepage Loading**: Navigate to `http://127.0.0.1:8080` and verify:
   - Page loads without errors
   - HTML5 UP Dimension template loads with Font Awesome icons
   - Background image and overlay render correctly
   - Responsive preloader animation displays

2. **Navigation Testing**:
   - Click "Intro", "Projetos (IA)", "About", "Contact", and "Repositórios no GitHub" navigation links
   - Verify smooth transitions and modal-style article displays (internal links)
   - Verify GitHub link opens in new tab with proper security attributes (external link)
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
   - **Expected behavior**: Project links will show 404 errors unless `sync_to_staging.sh --step1` has been run to deploy sibling projects
   - This is normal behavior when sibling projects aren't deployed to `mpbarbosa.com/` directory
   - All project links point to top-level directories in `mpbarbosa.com/`

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
│   ├── sync_to_staging.sh       # Two-step deployment script (v2.0.0)
│   ├── deploy_to_webserver.sh  # Legacy production deployment to nginx
│   ├── pull_all_submodules.sh  # DEPRECATED: Use "cd ../PROJECT && git pull" instead
│   ├── push_all_submodules.sh  # DEPRECATED: Use "cd ../PROJECT && git push" instead
│   ├── cleanup_old_folders.sh  # Automated cleanup utilities
│   ├── fix_documentation_consistency.sh  # Documentation consistency fixes
│   └── README.md              # Shell scripts documentation
├── mpbarbosa.com/                     # Deployment staging directory (sync_to_staging.sh output)
│   ├── index.html             # Synchronized main page
│   ├── assets/                # Synchronized HTML5 UP Dimension assets
│   ├── busca_vagas/           # Busca Vagas API backend (not in submodules)
│   │   ├── client/mpbarbosa.com/     # Frontend HTML interface
│   │   └── src/               # Node.js/Express API server with Puppeteer
│   ├── monitora_vagas/        # AFPESP hotel monitoring vanilla JavaScript app
│   │   ├── src/               # Legacy source files
│   │   │   ├── services/apiClient.js    # Original API client implementation
│   │   │   ├── services/hotelCache.js   # Original caching layer
│   │   │   └── styles/main.css          # Original stylesheet
│   │   └── mpbarbosa.com/            # Modern production build (v2.0.0)
│   │       ├── index.html                   # Main UI with hotel search form
│   │       ├── archived-versions/           # Historical UI iterations
│   │       │   ├── api-test.html            # API testing tool
│   │       │   ├── index-md3-cards.html     # Material Design 3 cards version
│   │       │   ├── index-md3.html           # Material Design 3 version
│   │       │   └── index-original-backup.html # Original backup
│   │       ├── config/                      # Configuration layer architecture
│   │       │   ├── app.js                   # Application constants and metadata
│   │       │   ├── constants.js             # Business logic constants
│   │       │   ├── environment.js           # Environment detection and API URLs
│   │       │   └── index.js                 # Unified configuration exports
│   │       ├── services/                    # Service layer
│   │       │   ├── apiClient.js             # BuscaVagasAPIClient class with fetch
│   │       │   └── hotelCache.js            # Hotel data caching service
│   │       ├── js/                          # Application scripts
│   │       │   ├── global.js                # Global utilities
│   │       │   ├── guestCounter.js          # Guest counter widget with filter state management (FR-004A)
│   │       │   ├── guestNumberFilter.js     # Client-side guest number filtering (FR-004B)
│   │       │   └── noScrollInterface.js     # No-scroll UI optimization
│   │       ├── css/                         # Modular CSS architecture
│   │       │   ├── main.css                 # Main stylesheet aggregator
│   │       │   ├── global/                  # Global styles (reset, base, variables)
│   │       │   ├── components/              # Component styles (progress-bar, search-form)
│   │       │   └── pages/                   # Page-specific styles (home.css)
│   │       ├── vendor/                      # Third-party libraries
│   │       │   ├── jquery/                  # jQuery 3.x
│       │   ├── datepicker/          # Daterangepicker + Moment.js
│       │   ├── select2/             # Select2 dropdown library
│       │   ├── font-awesome-4.7/    # Font Awesome icons
│       │   ├── mdi-font/            # Material Design Iconic Font
│       │   ├── bootstrap-wizard/    # Bootstrap wizard components
│       │   └── jquery-validate/     # jQuery validation plugin
│       ├── sw.js                    # Service worker for PWA support
│       └── favicon.ico              # Application favicon
│   ├── busca_vagas/           # Busca Vagas API backend
│   ├── guia_turistico/        # Travel guide sibling project
│   ├── monitora_vagas/        # Hotel monitoring sibling project
│   └── music_in_numbers/      # Spotify analytics sibling project
├── src/                        # Main source directory
│   ├── index.html             # Main landing page (HTML5 UP Dimension template)
│   ├── package.json           # Node.js dependencies and scripts
│   ├── jest-environment-jsdom-no-warnings.cjs  # Custom Jest environment (CommonJS)
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
│   │   ├── music-in-numbers.html    # Redirects to mpbarbosa.com/music_in_numbers/
│   │   ├── guia-turistico.html      # Redirects to mpbarbosa.com/guia_turistico/
│   │   └── monitora-vagas.html      # Redirects to mpbarbosa.com/monitora_vagas/
├── .ai_workflow/              # AI workflow automation (gitignored, 1.3M)
│   ├── backlog/               # Workflow task backlog with timestamped sessions
│   ├── logs/                  # Workflow execution logs and debugging output
│   ├── prompts/               # AI prompt templates and library
│   └── summaries/             # Workflow session summaries and reports
├── .gitmodules               # Empty file (git submodules deprecated, sibling architecture used)
├── index.html               # Simple redirect to mpbarbosa.com
└── README.md               # Project documentation
```

**Note**: The `.ai_workflow/` utility directory is gitignored and contains:
- **AI workflow state**: Automation session data, logs, and summaries (1.3M)
- This directory is automatically managed and not tracked in version control

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
./shell_scripts/sync_to_staging.sh --step1 --verbose

# Step 2: Public → Production (deployment)
./shell_scripts/sync_to_staging.sh --step2 --production-dir /var/www/html

# Combined deployment (both steps)
./shell_scripts/sync_to_staging.sh --both-steps

# Legacy deployment script v2.0.0 (uses public directory as source)
# Requires sync_to_staging.sh --step1 to prepare files first
sudo ./shell_scripts/deploy_to_webserver.sh

# Features (sync_to_staging.sh v2.0.0):
# - Parametrized step control (--step1, --step2, --both-steps)
# - Flexible production directory configuration (default: /var/www/html)
# - Comprehensive asset management (HTML, CSS, JS, images, webfonts)
# - Music in Numbers sibling project support with complete module architecture
# - Guia Turístico sibling project support with complete project structure
# - Monitora Vagas dual-directory deployment:
#   - Both src/ (legacy) and mpbarbosa.com/ (modern v2.0.0) folder support
#   - Modern configuration layer architecture (app.js, constants.js, environment.js, index.js)
#   - BuscaVagasAPIClient class with fetch API and timeout handling
#   - Modular CSS architecture (global/, components/, pages/)
#   - Archived UI versions for historical reference
#   - Service worker (sw.js) for PWA support
#   - Complete vendor library bundling (jQuery, datepicker, Select2, Font Awesome 4.7, MDI Font)
#   - Symlink resolution with -L flag for proper content copying
# - Busca Vagas full-stack deployment (client HTML + server API)
# - Systemd service deployment with sudo privilege handling for system directories
# - Enhanced backup system for both public and production directories
# - Production environment validation with permission checks
# - Comprehensive error handling with colored output
# - Dry-run mode for safe operation preview
# - Proper web server permissions (755 for directories, 644 for files)
# - Detailed deployment summary with file counts and validation
# - Project test status (Dec 2025): 256/287 tests passing (89.2% pass rate)
# - Test coverage: Temporarily disabled due to Node.js 25.2.1 compatibility (see docs/testing-qa/COVERAGE_ISSUE.md)

# Features (deploy_to_webserver.sh v2.0.0):
# - Uses public directory as source (requires sync_to_staging.sh step1 first)
# - Simplified deployment path with pre-staged files
# - Maintains backward compatibility with existing workflows
# - Automatic validation of public directory preparation
# - Enhanced permission management for web-ready files
# - Git validation updated to check project root instead of source directory
# - All file paths updated for new public directory structure
# - Comprehensive test suite with 225 tests (92.4% pass rate)
# - Coverage reporting temporarily disabled (Node.js 25 compatibility issue)
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



#### Sibling Project Management
```bash
# All projects are sibling projects - manage each independently:

# Music in Numbers (Spotify analytics)
cd ../music_in_numbers && git pull && git push

# Guia Turístico (Travel guide)
cd ../guia_turistico && git pull && git push

# Monitora Vagas (Hotel monitoring)
cd ../monitora_vagas && git pull && git push

# Busca Vagas (Backend API)
cd ../busca_vagas && git pull && git push

# Deploy sibling projects to mpbarbosa.com/ directory (top level):
./shell_scripts/sync_to_staging.sh --step1
```

### Important Notes
- **Linting Tools**: Markdown linting available via `npm run lint:md` (markdownlint with `.mdlrc` configuration); no ESLint or HTMLHint configured
- **Jest Testing Framework**: Comprehensive test suite in `src/__tests__/` (Jest standard location for co-located tests)
- **ES Modules**: Project uses `"type": "module"` with `.mjs` files for modern JavaScript
- **Dependabot Integration**: Automated weekly dependency updates with PR grouping and security alerts (see `docs/development-guides/DEPENDABOT_SETUP.md`)
- **Git Hooks**: Pre-commit and pre-push hooks for quality enforcement (see `.git-hooks/README.md`)
- **EditorConfig**: Code formatting standards enforced via `.editorconfig` for consistent style across editors
- **Node.js Version**: Project uses v25.2.1 (managed via `.node-version` and `.nvmrc`)
- **GitHub Actions CI**: Three workflows configured - accessibility testing, shell script validation, and Jest test suite
- **HTML5 UP Dimension Template**: Uses responsive template with Font Awesome icons and jQuery utilities
- **External dependencies**: Font Awesome webfonts bundled locally, jQuery and utilities included in assets
- **Browser compatibility**: Designed for modern browsers supporting ES6+, CSS Grid, and HTML5 features
- **Template License**: HTML5 UP Dimension released under Creative Commons Attribution 3.0 License

### Critical Path Resolution Guidelines (October 2025)
**ALWAYS** follow these path resolution rules to prevent critical resource loading failures:

1. **Sibling Project HTML Files**: Use relative paths only

   ```html
   <!-- ✅ CORRECT for sibling project files deployed to mpbarbosa.com/ directory -->
   <link rel="stylesheet" href="styles/themes.css">
   <script defer src="scripts/utils.js"></script>

   <!-- ❌ WRONG - causes 404 errors -->
   <link rel="stylesheet" href="mpbarbosa.com/music_in_numbers/src/styles/themes.css">
   ```

2. **Access Method Testing**: Always test both access patterns:
   - Direct deployment access: `http://127.0.0.1:8080/music_in_numbers/src/`
   - Direct deployment access: `http://127.0.0.1:8080/guia_turistico/`
   - Main site integration: Via redirect pages (`src/pages/*.html`)

3. **Path Strategy Consistency**: Never mix relative and absolute server-root paths within the same HTML file

4. **Resource Validation**: Verify no 404 errors in browser console and live-server logs show successful GET requests

**Reference**: See `/docs/deployment-architecture/RESOURCE_PATH_GUIDE.md` for comprehensive path resolution documentation.

## Troubleshooting

### Common Issues
1. **404 errors for project links**: Normal when sibling projects aren't deployed to `mpbarbosa.com/` - run `sync_to_staging.sh --step1` to deploy
2. **Template assets not loading**: Verify `assets/` directory structure is intact
3. **Port conflicts**: If port 8080 is in use, live-server will automatically find another available port
4. **Font Awesome icons not showing**: Check that `assets/webfonts/` directory contains all font files
5. **Background image missing**: Verify `images/bg.jpg` and `images/overlay.png` exist
6. **Orphan files in root directory**: Workflow artifacts should be cleaned up periodically - these are temporary AI session files
   - Common orphan files: "before attempting edits", "sues", "sed documentation sections", "in workflow configuration", "sue**: Multiple command...", etc.
   - These files are created during AI-assisted workflow sessions
   - Safe to delete - they are not tracked by git
7. **Jest localStorage warnings**: Custom environment suppresses these automatically
8. **npm audit vulnerabilities**: Should show 0 vulnerabilities - check overrides if issues appear

### Quick Fixes
- **Server won't start**: Ensure you're in the `src/` directory and `npm install` was successful
- **Changes not reflecting**: Check if live-server is running and browser is pointed to correct localhost URL
- **Template styling broken**: Clear browser cache and verify `assets/css/main.css` exists
- **JavaScript errors**: Check browser console for missing dependencies in `assets/js/`
- **Test failures**: Check jest configuration and ensure all polyfills are loaded (`jest.setup.js`)
- **Security vulnerabilities**: Run `npm audit` - should show 0 vulnerabilities with current overrides

## File Reference

### package.json Scripts
```json
{
  "scripts": {
    "start": "live-server .",
    "build": "echo 'Build step not defined yet.'",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js 2>&1 | grep -v 'localstorage-file'",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
    "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage 2>&1 | grep -v 'localstorage-file'",
    "lint:md": "mdl --git-recurse --ignore-front-matter ."
  },
  "overrides": {
    "braces": "^3.0.3",
    "micromatch": "^4.0.8",
    "glob": "^11.1.0"
  },
  "jest": {
    "testEnvironment": "<rootDir>/jest-environment-jsdom-no-warnings.cjs",
    "testEnvironmentOptions": {
      "url": "http://localhost",
      "storageQuota": 10000000,
      "resources": "usable"
    },
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "transform": {},
    "testMatch": [
      "**/__tests__/**/*.test.js",
      "**/?(*.)+(spec|test).js"
    ],
    "collectCoverageFrom": [
      "scripts/**/*.{js,mjs}",
      "../guia_turistico/src/libs/guia_js/src/**/*.js",
      "../music_in_numbers/src/**/*.js"
    ]
  }
}
```

### Key Dependencies
- `live-server@1.2.1` (development server with live reload)
- `jest@30.2.0` (testing framework with ES modules support)
- `jest-environment-jsdom@30.2.0` (browser environment for tests)

### npm Security Overrides
The project uses npm overrides to resolve transitive dependency vulnerabilities:
```json
"overrides": {
  "braces": "^3.0.3",      // Fix: CVE-1098094 (High - ReDoS)
  "micromatch": "^4.0.8",  // Fix: GHSA-952p-6rrq-rcjv (High - ReDoS)
  "glob": "^11.1.0"        // Fix: GHSA-5j98-mcp5-4vw2 (High - Command Injection)
}
```
**Status**: ✅ 0 vulnerabilities (verified December 15, 2025)
**See**: `docs/development-guides/SECURITY_VULNERABILITY_RESOLUTION.md` for details

### External Resources Used
- **HTML5 UP Dimension Template**: Responsive site template (html5up.net)
  - License: Creative Commons Attribution 3.0 (html5up.net/license)
  - Includes: jQuery 3.x, Font Awesome 5.x, custom utilities
- **Font Awesome 5.x**: Icon fonts (bundled in assets/webfonts/)
  - Brands, Regular, and Solid icon sets
- **jQuery 3.x**: JavaScript library (bundled in assets/js/jquery.min.js)



## Modular Architecture Excellence

### Monitora Vagas (AFPESP Hotel Monitoring) Architecture v2.0.0
The Monitora Vagas project showcases **production-ready vanilla JavaScript SPA with modern configuration architecture and client-side filtering**:

#### Directory Structure
The project now maintains both legacy (`src/`) and modern (`mpbarbosa.com/`) directories:

**Legacy Structure** (`src/`):
- Original implementation with inline configuration
- Direct API client without environment abstraction
- Monolithic CSS architecture
- Maintained for backward compatibility

**Modern Structure v2.0.0** (`mpbarbosa.com/`):
- **Configuration Layer**: Modular config architecture with separation of concerns
- **Service Layer**: Enhanced API client with environment detection
- **CSS Architecture**: Component-based styling with global, component, and page-specific modules
- **Archived Versions**: Historical UI iterations for reference and rollback
- **Vendor Management**: Comprehensive third-party library bundling

#### Core Features (v2.0.0)
- **Vanilla JavaScript UI**: Single-page application for AFPESP hotel vacancy monitoring (no React framework)
- **Client-Side Guest Filtering**: Real-time vacancy filtering based on guest count (FR-004)
- **Filter State Management**: Intelligent filter enable/disable based on search state (FR-004A)
- **Capacity Parsing**: Regex-based extraction of "até N pessoas" from vacancy text (FR-004B)
- **Environment-Aware Configuration**: Dynamic API endpoint detection with URL override support
- **BuscaVagasAPIClient Class**: Modern fetch API implementation with timeout handling
- **Modular CSS Architecture**: Separation of global styles, components, and pages
- **PWA Support**: Service worker implementation for progressive web app capabilities
- **Archived UI Versions**: Historical iterations preserved for reference
- **Comprehensive Vendor Bundle**: All third-party dependencies included and optimized

#### Configuration Layer Architecture (`config/`)

**app.js** - Application Constants:
- Application metadata (name, version, description)
- Search configuration (default/max/min weekends, search types)
- Hotel configuration (value, label, description arrays)
- UI settings and feature flags
- Build and deployment metadata

**constants.js** - Business Logic Constants:
- API endpoint paths and methods
- HTTP status codes and error messages
- Timeout configurations per operation type
- Cache duration settings
- Validation rules and constraints
- Date format patterns

**environment.js** - Environment Detection:
- Browser-compatible environment detection (no Node.js process.env)
- Dynamic API base URL: `http://localhost:3001/api` (dev) or `https://www.mpbarbosa.com/api` (prod)
- URL parameter override: `?useProductionAPI=true` forces production API
- Feature flags based on environment (logging, analytics, caching)
- Environment-specific security and performance configurations
- `getEnvironment()` export for centralized environment access

**index.js** - Unified Configuration Exports:
- Central export point for all configuration modules
- Tree-shakeable ES6 module exports
- Single import point for application code
- Maintains separation of concerns while providing convenience

#### Service Layer (`services/`)

**BuscaVagasAPIClient** (`apiClient.js`):
- Class-based architecture with constructor initialization
- Environment-aware API base URL configuration
- Fetch API wrapper with timeout handling (30s default, 60s search, 600s weekend)
- AbortController integration for request cancellation
- ISO 8601 date formatting for API compliance
- Generic `fetchWithTimeout()` method for all API calls
- Comprehensive error handling with network, timeout, and API errors
- Console logging for debugging and monitoring
- Methods:
  - `scrapeHotels()` - Fetch hotel list from `/api/vagas/hoteis`
  - `searchVacancies()` - Search vacancies with checkin/checkout dates
  - `searchWeekends()` - Multi-weekend search with count parameter

**Hotel Cache Service** (`hotelCache.js`):
- In-memory caching layer for hotel data
- Cache duration management (5 minutes default)
- Cache invalidation and refresh logic
- Reduces redundant API calls
- Improves application performance

**Logger Service** (`logger.js`):
- Centralized logging with environment-aware log levels
- Singleton pattern for consistent logging across application
- Production mode: ERROR level only (suppresses debug/info/warn logs)
- Development mode: DEBUG level with localStorage persistence
- Log level management: DEBUG, INFO, WARN, ERROR, NONE
- Formatted log messages with timestamps and context
- Performance timing with `time()` and `timeEnd()` methods
- Log grouping for related messages (collapsed or expanded)
- Emoji logging for better development visibility
- Future-ready error tracking integration (Sentry, Rollbar)
- Global `setLogLevel()` function exposed in development

#### CSS Architecture (`css/`)

**Global Styles** (`global/`):
- `reset.css` - CSS reset for cross-browser consistency
- `base.css` - Base typography, layout, and element styles
- `variables.css` - CSS custom properties (colors, spacing, typography, breakpoints)

**Component Styles** (`components/`):
- `progress-bar.css` - Loading and progress indicators
- `search-form.css` - Search form components and validation states

**Page Styles** (`pages/`):
- `home.css` - Home page specific styles and layout

**Main Aggregator** (`main.css`):
- Imports all global, component, and page styles
- Provides single entry point for stylesheet loading
- Optimized for HTTP/2 multiplexing

**No-Scroll Optimizations** (`no-scroll-optimizations.css`):
- Performance optimizations for scroll-free interfaces
- Reduces layout thrashing
- Improves rendering performance

#### Archived Versions (`archived-versions/`)
Historical UI iterations preserved for reference and potential rollback:
- `api-test.html` - Standalone API testing interface
- `index-md3-cards.html` - Material Design 3 with card-based results
- `index-md3.html` - Material Design 3 base implementation
- `index-original-backup.html` - Original UI before refactoring

#### Vendor Libraries (`vendor/`)
Comprehensive third-party library bundling:
- **jQuery 3.x** - DOM manipulation and AJAX
- **Moment.js + Daterangepicker** - Date selection and formatting
- **Select2** - Enhanced dropdown functionality
- **Font Awesome 4.7** - Icon library (webfonts: EOT, TTF, WOFF, WOFF2)
- **Material Design Iconic Font** - MDI icons (TTF, WOFF, WOFF2)
- **Bootstrap Wizard** - Multi-step form components
- **jQuery Validate** - Form validation plugin

#### JavaScript Module Architecture

**hotelSearch.js** - Main Search Orchestration:
- HotelSearchOrchestrator class for coordinating search operations
- Integration with BuscaVagasAPIClient for backend communication
- Search lifecycle state management with SearchLifecycleStateMachine
- Guest filtering integration with GuestNumberFilter
- UI state management and result rendering
- Error handling and user feedback
- Cache-aware search with hotelCache service
- Support for single weekend and multi-weekend searches

**searchLifecycleState.js** - Search State Machine:
- SearchLifecycleStateMachine class for search flow control
- State management: IDLE → LOADING → RESULTS → ERROR
- State transition validation and lifecycle hooks
- Event-driven architecture for state changes
- Integration with filter state management
- Tracks search initiation and completion
- Enables/disables filters based on search lifecycle

**guestCounter.js** (FR-004A - Filter State Management):
- GuestFilterStateManager class for filter enable/disable control
- Filter disabled on page load, enabled after first search
- Visual feedback with CSS state classes (filter-enabled/disabled)
- Interactive element control (readonly attribute management)
- Plus/minus button handlers with filter state validation
- Integration with searchLifecycleState for state synchronization

**guestNumberFilter.js** (FR-004B - Client-Side Filtering):
- GuestNumberFilter class for vacancy filtering logic
- parseCapacity() method: Regex extraction of "até N pessoas" pattern
- applyFilter() method: Hide/show vacancies based on guest count
- Filter statistics tracking (visible/hidden hotels and vacancies)
- Graceful degradation: Show vacancies without capacity info
- Real-time filtering as guest count changes

**global.js** - Global Utilities:
- Shared utility functions used across modules
- DOM manipulation helpers
- Common validation functions
- Date formatting utilities

#### Integration with Busca Vagas Backend
- **Backend Repository**: `../busca_vagas` (sibling project)
- **API Server**: Node.js/Express with Puppeteer-based scraping
- **Production Deployment**: Systemd service at `/etc/systemd/system/busca_vagas_node_app.service`
- **Port**: 3000 (configurable via PORT environment variable)
- **CORS**: Configured for `http://localhost:5173` (development)

#### Deployment Strategy
The `sync_to_staging.sh` script (v2.0.0) handles dual-directory deployment:
- **src/ folder**: Legacy implementation copied as-is
- **mpbarbosa.com/ folder**: Modern implementation with symlink resolution (`cp -rL`)
- **Validation**: Both directories validated for HTML and JS files
- **Backward Compatibility**: Ensures smooth transition from legacy to modern architecture

### Music in Numbers Sibling Project Structure
The Music in Numbers sibling project (located at `../music_in_numbers`) demonstrates **professional-grade modular architecture**:

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

#### Custom Jest Configuration
The project uses a custom jsdom environment to suppress localStorage warnings:

**Custom Environment** (`jest-environment-jsdom-no-warnings.cjs`):
- CommonJS module format for Jest compatibility
- Wraps `jest-environment-jsdom` to filter console warnings
- Suppresses `--localstorage-file` warnings (in-memory storage is sufficient)
- Maintains full jsdom functionality

**Test Setup** (`jest.setup.js`):
- **Response Polyfill**: Adds Response class for advanced error handling tests
- **Headers Polyfill**: Implements Headers API for fetch simulation
- **AbortController Polyfill**: Supports fetch timeout testing
- **LocalStorage Mock**: Ensures proper localStorage configuration
- **Environment Detection**: Sets `global.IS_TEST_ENV` and `global.IS_JSDOM` flags

**Console Warning Suppression**:
Test commands filter out localStorage warnings using grep:
```bash
npm test          # Filters stderr warnings
npm test:coverage # Filters stderr warnings
npm test:watch    # No filtering (interactive)
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
./shell_scripts/sync_to_staging.sh --step1 --dry-run
./shell_scripts/sync_to_staging.sh --step2 --production-dir /var/www/html
./shell_scripts/sync_to_staging.sh --both-steps

# Legacy deployment v2.0.0 (uses public directory as source, requires sync_to_staging.sh step1 first)
sudo ./shell_scripts/deploy_to_webserver.sh --dry-run
```

**Key Deployment Patterns**:
- Always use `--dry-run` first to preview operations before executing
- For deployment: Use `sync_to_staging.sh --step1` to prepare files in /public directory
- Step 2 options: Either `sync_to_staging.sh --step2` or legacy `deploy_to_webserver.sh` (v2.0.0)
- Both scripts now at v2.0.0: `sync_to_staging.sh` with two-step architecture, `deploy_to_webserver.sh` with public source
- Legacy `deploy_to_webserver.sh` uses `/public` as source (requires step1 to run first)
- Production directory is configurable via `--production-dir` parameter (default: `/var/www/html`)
- Use `--both-steps` for complete source-to-production deployment in one command
- Legacy script requires sudo for web server directory access
- Git validation updated: deploy_to_webserver checks project root, not source directory



## 📖 Related Documentation References

For comprehensive development guidance, consult these detailed documentation resources:

### Development Environment & Tools
- **⭐ [Code Quality Remediation Plan](../docs/development-guides/CODE_QUALITY_REMEDIATION_PLAN.md)** - Comprehensive roadmap for code quality improvements (87 hours, 407% ROI, Grade B+ → A+)
- **⭐ [Quick Remediation Checklist](../docs/QUICK_REMEDIATION_CHECKLIST.md)** - Quick start guide for implementing quality improvements
- **[Dependabot Setup Guide](../docs/development-guides/DEPENDABOT_SETUP.md)** - Automated dependency monitoring and security updates configuration
- **[Security Vulnerability Resolution](../docs/development-guides/SECURITY_VULNERABILITY_RESOLUTION.md)** - npm security audit resolution using package overrides (8 vulnerabilities fixed: 5 High, 3 Moderate)
- **[Markdown Linting Guide](../docs/documentation-standards/MARKDOWN_LINTING_GUIDE.md)** - Best practices for AI-generated documentation and mdl configuration
- **[Markdown Linting Solution Summary](../docs/documentation-standards/MARKDOWN_LINTING_SOLUTION_SUMMARY.md)** - Complete solution for recurring markdown linting issues
- **[Selenium E2E Setup Guide](../docs/development-guides/SELENIUM_E2E_SETUP_GUIDE.md)** - Browser automation test configuration (Status: Not Yet Configured)
- **[Testing Documentation Index](../docs/testing-qa/README.md)** - Consolidated testing and QA documentation (208/225 tests passing as of Dec 2025)
- **[Test Quick Start](../docs/testing-qa/TEST_QUICK_START.md)** - Get started with testing in 5 minutes
- **[Test Execution Guide](../docs/testing-qa/TEST_EXECUTION_GUIDE.md)** - Running tests, debugging failures, coverage analysis
- **[Test Failure Troubleshooting](../docs/testing-qa/TEST_FAILURE_TROUBLESHOOTING.md)** - Fix common test issues and known failures
- **[Naming Convention Fix Report](../docs/implementation-reports/NAMING_CONVENTION_FIX_REPORT.md)** - File naming standardization improvements

### AI Integration & Prompts
- **[AI Prompt Extraction Standard](../docs/ai-prompts/AI_PROMPT_EXTRACTION_STANDARD.md)** - Project standard for extracting AI prompts to centralized library
- **[Copilot Prompt Scoping Guide](../docs/ai-prompts/COPILOT_PROMPT_SCOPING_GUIDE.md)** - Best practices for GitHub Copilot prompt design and context management
- **[Prompt Extraction Refactoring](../docs/ai-prompts/PROMPT_EXTRACTION_REFACTORING.md)** - Refactoring patterns for AI prompt centralization

### Architecture & Development
- **[Comprehensive UX Documentation](../docs/development-guides/COMPREHENSIVE_UX_DOCUMENTATION.md)** - Complete user experience design guide covering navigation patterns, accessibility features, responsive design, and interaction design across all project components
- **[Resource Path Guide](../docs/deployment-architecture/RESOURCE_PATH_GUIDE.md)** - Detailed path resolution strategies and troubleshooting for submodule deployment
- **[Path Resolution Fix Report](../docs/deployment-architecture/PATH_RESOLUTION_FIX_COMPLETION_REPORT.md)** - Technical incident report and lessons learned
- **[Modularization Achievements](../docs/development-guides/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md)** - Architecture improvements and code reduction metrics
- **[Dependency Injection Best Practices](../docs/development-guides/DEPENDENCY_INJECTION_BEST_PRACTICES.md)** - Enterprise patterns for scalable JavaScript architecture

### Workflow Automation
- **[Workflow Automation Version Evolution](../docs/workflow-automation/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md)** - Version history v1.1.0 through v2.0.0 (current with output limits enhancement and auto-mode)
- **[Tests & Docs Workflow Plan](../docs/workflow-automation/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)** - Comprehensive development plan for workflow automation script
- **[Workflow Automation Phase 2 Completion](../docs/workflow-automation/WORKFLOW_AUTOMATION_PHASE2_COMPLETION.md)** - Implementation completion report for v2.0.0 (HISTORICAL)
- **[Workflow Modularization Phase 1 Completion](../docs/workflow-automation/WORKFLOW_MODULARIZATION_PHASE1_COMPLETION.md)** - Library modules extraction completion
- **[Workflow Modularization Phase 2 Completion](../docs/workflow-automation/WORKFLOW_MODULARIZATION_PHASE2_COMPLETION.md)** - Additional library modules completion
- **[Workflow Modularization Phase 3 Completion](../docs/workflow-automation/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md)** - All step modules extraction COMPLETE ✅
- **[Step 11 Git Enhancement](../docs/workflow-automation/STEP11_GIT_FINALIZATION_ENHANCEMENT.md)** - AI-powered conventional commit message generation
- **[Workflow Execution Context](../docs/workflow-automation/WORKFLOW_EXECUTION_CONTEXT_ANALYSIS.md)** - Execution context and best practices analysis

### Deployment
- **[Sync to Public Functional Documentation](../docs/deployment-architecture/SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md)** - Two-step deployment architecture functional guide
- **[Sync to Public Technical Documentation](../docs/deployment-architecture/SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md)** - Technical implementation details

### Quality Assurance & Validation
- **[Shell Script Validation Report](../docs/validation-reports/shell_script_validation_report.md)** - Current validation report (Dec 11, 2025): 43/44 scripts documented, metrics_validation.sh missing documentation

### Historical Validation Reports (v2.0.0 - Consolidated)
- **[Directory Structure Validation History](../docs/validation-reports/DIRECTORY_STRUCTURE_VALIDATION_HISTORY_CONSOLIDATED.md)** - 9 historical reports consolidated (Nov 13-25, 2025), all ✅ EXCELLENT status
- **[Documentation Consistency History](../docs/documentation-standards/DOCUMENTATION_CONSISTENCY_HISTORY_CONSOLIDATED.md)** - Historical cross-reference and terminology tracking
- **[Shell Script Validation History](../docs/validation-reports/SHELL_SCRIPT_VALIDATION_HISTORY_CONSOLIDATED.md)** - Shell script quality and best practices compliance history

**Note**: Individual timestamped validation reports have been archived into consolidated files to maintain repository cleanliness while preserving complete historical analysis.

---

## 🔗 See Also

### Quick Navigation to Key Documentation

**Getting Started**:
- **[Project README](../README.md)** - Project overview and setup
- **[Testing Quick Start](../docs/testing-qa/TEST_QUICK_START.md)** - Get testing in 5 minutes
- **[Shell Scripts README](../shell_scripts/README.md)** - All automation scripts

**Deployment & Architecture**:
- **[Deployment Architecture Index](../docs/deployment-architecture/README.md)** - Deployment documentation hub
- **[Two-Step Deployment v2.0.0](../docs/deployment-architecture/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)** - Complete deployment workflow
- **[Resource Path Guide](../docs/deployment-architecture/RESOURCE_PATH_GUIDE.md)** - Path resolution troubleshooting

**Testing & Quality**:
- **[Testing Documentation Index](../docs/testing-qa/README.md)** - Test suite documentation (208/225 tests, 92.4%)
- **[Code Quality Remediation Plan](../docs/development-guides/CODE_QUALITY_REMEDIATION_PLAN.md)** - Quality improvement roadmap
- **[Test Failure Troubleshooting](../docs/testing-qa/TEST_FAILURE_TROUBLESHOOTING.md)** - Fix common test issues

**Development Guides**:
- **[Security Vulnerability Resolution](../docs/development-guides/SECURITY_VULNERABILITY_RESOLUTION.md)** - npm security fixes
- **[Dependabot Setup](../docs/development-guides/DEPENDABOT_SETUP.md)** - Automated dependency updates
- **[Markdown Linting Guide](../docs/documentation-standards/MARKDOWN_LINTING_GUIDE.md)** - Documentation standards

**Workflow Automation**:
- **[Workflow Automation Version Evolution](../docs/workflow-automation/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md)** - v1.1.0 through v2.0.0
- **[Workflow Modular Architecture](../shell_scripts/workflow/README.md)** - Complete module documentation
- **[Tests & Docs Workflow Plan](../docs/workflow-automation/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)** - Automation roadmap

**Architecture Patterns**:
- **[Dependency Injection Best Practices](../docs/development-guides/DEPENDENCY_INJECTION_BEST_PRACTICES.md)** - Enterprise patterns
- **[Functional Core, Imperative Shell Guide](../docs/development-guides/FUNCTIONAL_CORE_IMPERATIVE_SHELL_GUIDE.md)** - Architecture pattern
- **[Modularization Achievements](../docs/development-guides/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md)** - 85.8% code reduction

---

Always verify the development server starts successfully and the main page loads before making any modifications to the codebase.
