# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All npm scripts run from `src/` (where `package.json` lives):

```bash
cd src

npm test                  # run full test suite
npm run test:unit         # unit tests only (main.test.js, InitializationUtilities.test.js)
npm run test:integration  # integration tests
npm run test:shell        # shell script tests (shell_scripts.test.js, sync_to_public.test.js)
npm run test:docs         # documentation tests
npm run test:a11y         # accessibility tests (jsdom)
npm run test:coverage     # with coverage report
npm run test:watch        # watch mode

npm run lint              # ESLint on .js/.mjs
npm run lint:fix          # auto-fix lint issues
npm run format            # Prettier write (all supported types)
npm run format:check      # Prettier check

npm start                 # live-server at http://localhost:8080 (serves src/)
```

Jest uses `--experimental-vm-modules` because the project is `"type": "module"` (ES Modules). Run a single test file:

```bash
cd src && node --experimental-vm-modules node_modules/jest/bin/jest.js __tests__/html_functionality.test.js
```

The pre-commit hook (`.husky/pre-commit`) runs `npm test` automatically.

## Architecture

### Site structure

The site is a **static HTML5 personal portfolio** (`src/index.html`) with no build step. The current live version is `v2` — a custom vanilla-JS design (`src/scripts/v2.js`, `src/styles/v2.css`). The old HTML5 UP Dimension template lives in `src/v1/` as an archived fallback linked in the footer.

Key source layers under `src/`:
- `index.html` — single-page portfolio, in Portuguese (pt-BR), with sections: Intro, Projetos, About, Contact
- `scripts/v2.js` — vanilla ES module; handles random background rotation and contact-form UX (no jQuery)
- `styles/v2.css` — custom CSS for v2 layout
- `assets/` — FontAwesome fonts/CSS, legacy SASS sources (used by v1), and legacy jQuery-based JS (used by v1)
- `pages/` — HTML redirect stubs (`music-in-numbers.html`, `guia-turistico.html`, `monitora-vagas.html`) that forward visitors into sibling project directories via `<meta http-equiv="refresh">` or `window.location`
- `scripts/initialization/InitializationUtilities.js` — utility helpers tested by `InitializationUtilities.test.js`
- `components/` — reusable HTML components (if any)
- `images/` — static images (bg.jpg + personal photos rotated as background)

### Sibling projects (not git submodules)

The projects linked from the landing page (`guia_js/`, `music_in_numbers/`, `monitora_vagas/`, `mapasp/`) are **sibling directories on the web server**, not submodules in this repo. The `src/pages/*.html` redirect stubs use relative paths like `../submodules/<project>/src`. Deployment copies `src/` alongside those sibling project directories.

### Deployment model

Two-step pipeline managed by `shell_scripts/`:

1. `shell_scripts/sync_to_staging.sh` — copies `src/` into `../mpbarbosa.com/` (a separate git repo used as versioned staging)
2. `shell_scripts/deploy_to_webserver.sh` — copies staging to the production web server directory; supports `--dry-run`

Legacy submodule helper scripts (`pull_all_submodules.sh`, `push_all_submodules.sh`) are in `shell_scripts/deprecated/`.

### Test suite layout (`src/__tests__/`)

| File | Jest project | What it covers |
|---|---|---|
| `main.test.js` | unit | DOM behaviour in index.html |
| `InitializationUtilities.test.js` | unit | utility helpers |
| `html_functionality.test.js` | integration | HTML structure / DOM |
| `project_navigation.test.js` | integration | redirect pages, landing-page links |
| `shell_integration.test.js` | integration | shell integration |
| `shell_scripts.test.js` | shell-scripts | deploy/sync script validation + dry-run |
| `sync_to_public.test.js` | shell-scripts | staging sync script |
| `documentation.test.js` | documentation | docs file checks |

Tests are ES Modules; Jest is configured in `src/jest.config.js` with a custom jsdom environment (`jest-environment-jsdom-no-warnings.cjs`).
