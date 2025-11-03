# MP Barbosa Personal Website

**ALWAYS** reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.

## Project Overview

This is a static HTML personal portfolio website for MP Barbosa featuring Material Design components. The site showcases personal projects, provides an about section, curriculum information, and includes a contact form with JavaScript interactivity.

**Architecture Highlights**:
- **Multi-project structure**: Main site + 3 specialized submodules (Music in Numbers, Guia Turístico, Monitora Vagas)
- **Modern ES Modules**: `"type": "module"` with `.mjs` files and comprehensive Jest testing
- **Advanced submodule patterns**: Dependency injection, functional core/imperative shell architecture
- **Professional deployment**: Automated shell scripts for production nginx deployment

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
- Three submodules exist for personal projects:
  - `src/submodules/music_in_numbers` → Music in Numbers (Spotify analytics) project
  - `src/submodules/guia_turistico` → Guia Turístico (Travel Guide) project
  - `src/submodules/monitora_vagas` → Monitora Vagas (Job monitoring) project
- To initialize submodules (when authenticated): `git submodule update --init --recursive`
- Automated submodule management available: `./shell_scripts/pull_all_submodules.sh`
- If submodules fail to initialize, the project links will show 404 errors but the main site will function normally

## Validation and Testing

### Manual Validation Scenarios
**ALWAYS** perform these validation steps after making changes:

1. **Homepage Loading**: Navigate to `http://127.0.0.1:8080` and verify:
   - Page loads without errors (some CDN resources may be blocked but site functions)
   - Version badge appears in top-right corner showing "HTML page v0.4.1-alpha (unstable, pre-release)"
   - Material Design styling is applied correctly

2. **Navigation Testing**: 
   - Click "About", "Projects", and "Contact" navigation links
   - Verify smooth scrolling to respective sections works

3. **Contact Form Testing**:
   - Fill in all three form fields: Name, Email, Message
   - Click "Send" button
   - Verify JavaScript alert appears: "Form submitted! Thank you for reaching out."
   - Verify form resets after submission

4. **Project Links**: 
   - Click "Music in Numbers", "Guia Turístico", and "Monitora Vagas" project links
   - **Expected behavior**: These will show 404 errors unless submodules are properly initialized
   - This is normal and documented behavior in environments without authentication
   - All project links follow consistent submodule navigation pattern

### Performance and Layout
- Take screenshots to verify visual layout and Material Design components render correctly
- Test responsive design by resizing browser window
- Verify all sections (About Me, Personal Projects, Curriculum, Contact) are visible

## Common Tasks and File Structure

### Key Files and Directories
```
mpbarbosa_site/
├── .github/                    # GitHub configuration and workflows
│   └── copilot-instructions.md # These instructions
├── shell_scripts/              # Automation and deployment scripts
│   ├── deploy_to_webserver.sh  # Production deployment to nginx
│   ├── pull_all_submodules.sh  # Update all submodules
│   ├── push_all_submodules.sh  # Deploy submodule changes
│   └── README.md               # Shell scripts documentation
├── src/                        # Main source directory 
│   ├── index.html             # Main landing page (entry point)
│   ├── package.json           # Node.js dependencies and scripts
│   ├── styles/
│   │   └── main.css          # Main stylesheet with Material Design theme
│   ├── scripts/
│   │   └── main.js           # JavaScript for smooth scrolling and form handling
│   ├── components/            # Individual HTML components (not used in main page)
│   │   ├── about.html        # Standalone about page
│   │   ├── contact.html      # Standalone contact page
│   │   ├── header.html       # Standalone header component
│   │   └── projects.html     # Standalone projects page
│   ├── pages/                 # Redirect pages for projects
│   │   ├── music_in_numbers.html    # Redirects to submodule
│   │   ├── guia_turistico.html      # Redirects to submodule
│   │   └── monitora_vagas.html      # Redirects to submodule
│   └── submodules/            # Git submodules for projects (may be empty)
├── .gitmodules               # Git submodule configuration
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

#### Production Deployment
```bash
# Deploy to production web server (nginx)
./shell_scripts/deploy_to_webserver.sh

# Features:
# - Automatic backup with cleanup (7-day retention)
# - Dynamic source directory detection
# - Comprehensive error handling with colored output
# - Dry-run mode for validation
# - Proper web server permissions
```

#### Submodule Management
```bash
# Update all submodules from remote repositories
./shell_scripts/pull_all_submodules.sh

# Deploy changes to all submodules
./shell_scripts/push_all_submodules.sh
```

### Important Notes
- **No linting tools configured**: There are no ESLint, HTMLHint, or other linting tools set up
- **Jest Testing Framework**: Comprehensive test suite exists in `src/__tests__/` with coverage reporting
- **ES Modules**: Project uses `"type": "module"` with `.mjs` files for modern JavaScript
- **No CI/CD**: No GitHub Actions or other continuous integration configured
- **External dependencies**: Uses CDN resources (Google Fonts, Material Web Components, unpkg.com)
- **Browser compatibility**: Designed for modern browsers that support ES6+ and CSS Grid

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
2. **CDN resource blocked**: Some external resources may be blocked but site functions
3. **npm vulnerabilities**: The project uses `live-server@1.2.1` which has known vulnerabilities but is only for development
4. **Port conflicts**: If port 8080 is in use, live-server will automatically find another available port

### Quick Fixes
- **Server won't start**: Ensure you're in the `src/` directory and `npm install` was successful
- **Changes not reflecting**: Check if live-server is running and browser is pointed to correct localhost URL
- **Form not working**: Verify `scripts/main.js` is loaded correctly and no JavaScript errors in console

## File Reference

### package.json Scripts
```json
{
  "scripts": {
    "start": "live-server .",
    "build": "echo 'Build step not defined yet.'",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
    "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage"
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
- Google Fonts (Roboto font family)
- Google Material Icons
- Material Web Components (unpkg.com CDN)

## Modular Architecture Excellence

### Music in Numbers Subproject Structure
The Music in Numbers project demonstrates **professional-grade modular architecture**:

#### HTML Pages (Clean Semantic Structure)
- `src/index.html` (246 lines) - Main analytics dashboard
- `src/artist.html` (60 lines) - Artist information display

#### CSS Modules (Organized Styling)
- `styles/main.css` - Base styles and Material Design
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

# Production deployment with nginx integration
sudo ./shell_scripts/deploy_to_webserver.sh --dry-run
```

**Key Pattern**: Always use `--dry-run` first to preview operations before executing.

## 📖 Related Documentation References

For comprehensive development guidance, consult these detailed documentation resources:

- **[Comprehensive UX Documentation](../docs/COMPREHENSIVE_UX_DOCUMENTATION.md)** - Complete user experience design guide covering navigation patterns, accessibility features, responsive design, and interaction design across all project components
- **[Resource Path Guide](../docs/RESOURCE_PATH_GUIDE.md)** - Detailed path resolution strategies and troubleshooting for submodule deployment
- **[Path Resolution Fix Report](../docs/PATH_RESOLUTION_FIX_COMPLETION_REPORT.md)** - Technical incident report and lessons learned
- **[Modularization Achievements](../docs/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md)** - Architecture improvements and code reduction metrics
- **[Dependency Injection Best Practices](../docs/DEPENDENCY_INJECTION_BEST_PRACTICES.md)** - Enterprise patterns for scalable JavaScript architecture

Always verify the development server starts successfully and the main page loads before making any modifications to the codebase.