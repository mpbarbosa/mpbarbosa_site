# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The real npm scripts live in `src/package.json` — run them from `src/`. The root `package.json` is a thin wrapper that just `cd src && ...` for a few common scripts (`test`, `test:ci`, `test:coverage`, `test:watch`, `start`, `lint:md`), so `npm test`/`npm start` also work from the repo root.

```bash
cd src

npm test                  # run full test suite (all Jest projects)
npm run test:unit         # unit project: main.test.js, InitializationUtilities.test.js, fixtures/
npm run test:integration  # integration project: html_functionality, project_navigation, shell_integration
npm run test:shell        # shell-scripts project: shell_scripts, sync_to_public, staging_content
npm run test:docs         # documentation project
npm run test:a11y         # accessibility project (real Chrome via puppeteer + axe-core) — needs `npm start` on :8080
npm run test:pa11y        # pa11y audit via headless browser — needs `npm start` running on :8080 first
npm run test:coverage     # with coverage report
npm run test:watch        # watch mode

npm run lint              # ESLint on .js/.mjs
npm run lint:fix          # auto-fix lint issues
npm run lint:md           # markdownlint (mdl) on tracked markdown
npm run format            # Prettier write (all supported types)
npm run format:check      # Prettier check

npm start                 # live-server (serves src/, defaults to http://localhost:8080)
```

Jest uses `--experimental-vm-modules` because the project is `"type": "module"` (ES Modules). Run a single test file:

```bash
cd src && node --experimental-vm-modules node_modules/jest/bin/jest.js __tests__/html_functionality.test.js
```

The pre-commit hook (`.husky/pre-commit`) runs `cd src && npx lint-staged` — i.e. `eslint --fix` + `prettier --write` on staged files only. It does **not** run the test suite.

## Architecture

### Site structure

The site is a **static HTML5 personal portfolio** (`src/index.html`) with no build step. The current live version is `v2` — a custom vanilla-JS design (`src/scripts/v2.js`, `src/styles/v2.css`). The old HTML5 UP Dimension template lives in `src/v1/` as an archived fallback linked in the footer.

There are two language versions, both loading the same `scripts/v2.js` + `styles/v2.css`:
- `src/index.html` — **primary**, Portuguese (pt-BR); the canonical portfolio.
- `src/en/index.html` — English; doubles as the Singularity investor-facing landing for the `ai_workflow` mission. See `CONTEXT.md` for the domain glossary (Mission, Singularity section, Fund request, etc.) — use that terminology when editing `/en/`.

Key source layers under `src/`:
- `index.html` — single-page portfolio with sections: Intro, Projetos, About, Contact
- `scripts/v2.js` — the script actually loaded by both pages; vanilla ES module handling random background rotation and contact-form UX (no jQuery). The contact form posts via Formspree (`@formspree/ajax` loaded from unpkg).
- `scripts/main.mjs` — modular smooth-scroll + contact-form helpers, exercised by `main.test.js`; not currently referenced by either HTML page (kept for testing/backward compatibility).
- `scripts/initialization/InitializationUtilities.js` — utility helpers tested by `InitializationUtilities.test.js`
- `styles/v2.css` — custom CSS for v2 layout
- `assets/` — FontAwesome fonts/CSS, legacy SASS sources (used by v1), and legacy jQuery-based JS (used by v1)
- `pages/` — HTML redirect stubs (`music-in-numbers.html`, `guia-turistico.html`, `monitora-vagas.html`) that forward visitors into sibling project directories via `<meta http-equiv="refresh">` or `window.location`
- `components/` — reusable HTML components (if any)
- `images/` — static images (bg.jpg + personal photos rotated as background)
- LLM/SEO metadata served from the domain root: `llms.txt`, `llms-full.txt`, `robots.txt`, `humans.txt`, `ads.txt` (Google AdSense), `favicon.svg`

### Sibling projects (not git submodules)

The projects linked from the landing page (`guia_js/`, `music_in_numbers/`, `monitora_vagas/`, `mapasp/`) are **sibling directories on the web server**, not submodules in this repo. The `src/pages/*.html` redirect stubs use relative paths like `../submodules/<project>/src`. Deployment copies `src/` alongside those sibling project directories.

### Deployment model

**Pushing the staging repo is the deploy.** Nothing you run pushes files to
production; the prod host pulls them on a cron:

1. On your workstation, `shell_scripts/sync_to_staging.sh --step1` copies `src/`
   into `../mpbarbosa.com/`, a separate git repo
   (`git@github.com:mpbarbosa/mpbarbosa.com.git`) used as versioned staging. It
   copies an explicit allow-list, so a new top-level file needs a `copy_*`
   function there.
2. Commit and push `../mpbarbosa.com`.
3. Within ~10 minutes the prod host picks it up. ubuntu's crontab runs
   `*/10 * * * * /home/ubuntu/Documents/GitHub/devops/scripts/git_sync.sh`,
   which pulls every repo under `/home/ubuntu/Documents/GitHub` that is behind.
   When the `mpbarbosa.com` pull succeeds it runs `devops/copa_2026/prod_deploy.sh`
   (in the separate `devops` repo), and that runs **this repo's**
   `sync_to_staging.sh --step2 --production-dir /var/www/mpbarbosa.com`, as
   ubuntu, from the host's own `mpbarbosa_site` checkout.

To confirm it landed (read-only; compares GitHub main, the staging clone and the
web root, and shows the relevant git_sync log lines):

```bash
AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh shell_scripts/check_prod_deploy.sh
```

Things that follow from that design:

- `--step2` is `rsync -a --delete` of the whole staging checkout, `.git`
  included, into `/var/www/mpbarbosa.com` (nginx's `root`). The web root's git
  history is a **copy**, not a clone that pulls: its HEAD is the staging commit
  last copied.
- The host's `mpbarbosa_site` checkout is pulled by the same cron, so merging a
  change to `sync_to_staging.sh` into `main` changes the live deploy code.
  git_sync walks repos alphabetically and `mpbarbosa.com` sorts before
  `mpbarbosa_site`, so a staging push and a script change that land in the same
  10-minute window deploy with the *old* script.
- git_sync skips any repo whose tracked files have local changes, so a dirty
  staging clone on the host silently stops deploys.
- Its log is `/home/ubuntu/.local/log/git_sync.log`, rotated at 500 KB with one
  old copy kept, so it only reaches back about a day.

**Never run `sync_to_staging.sh --step2` on the prod host as root** (every SSM
session is root). The cron already runs it as ubuntu. As root it also restarts
nginx and the unrelated `busca_vagas_node_app` service, and any git run as root
in these ubuntu-owned checkouts can leave root-owned files in `.git`; a
`git pull` as root creates object directories that ubuntu's pulls can no longer
write into.

`shell_scripts/prod_deploy.sh` is **retired**: it prints the steps above and
exits 1. It used to `git pull` staging and run `--step2`, which failed at once
under SSM (`~` is `/root`) and would have done the damage above had it got
further. `shell_scripts/deploy_to_webserver.sh` is the older pre-staging deploy
and is not part of the production path either.

Legacy submodule helper scripts (`pull_all_submodules.sh`, `push_all_submodules.sh`) are in `shell_scripts/deprecated/`.

### Reaching the prod host (SSH does not work — use SSM)

The production host is EC2 instance `i-0ca13c62d0d9d0d00` ("WebServer", Ubuntu
24.04, sa-east-1, `18.229.20.196`). A normal deploy never needs it (see above);
you go there to diagnose, or to install the nginx configs below.

**SSH is not a usable path.** The instance has **no EC2 key pair attached**
(`KeyName: null`), so `authorized_keys` was populated by hand and there is no
`.pem` to fall back on. `ssh mpbarbosa.com` also picks up your local username;
the only account on the box is `ubuntu`. Both `mpb@` and `ubuntu@` currently
fail with `Permission denied (publickey)`.

Use SSM instead — it needs no key and no inbound port 22, because the agent
dials out:

```bash
AWS_PROFILE=mpb aws ssm start-session --target i-0ca13c62d0d9d0d00
```

SSM sessions run as **root**, so scripts invoked this way must not expect
`sudo`. To run a local script on the host non-interactively:

```bash
AWS_PROFILE=mpb ./shell_scripts/run_on_prod_via_ssm.sh <local-script> [args...]
```

That base64-encodes the script, ships it in one SSM command, and prints the
remote stdout/stderr and exit code back to your terminal.

Two failure modes look alike from the terminal and have different fixes:

| Symptom | Cause | Fix |
|---|---|---|
| SSH **times out** | security group's port-22 rule points at a stale IP | `AWS_PROFILE=mpb ./shell_scripts/aws_allow_my_ip.sh` |
| SSH **rejects auth** (`publickey`) | no key pair on the instance | use SSM; `aws_allow_my_ip.sh` will not help |

### nginx / canonical host

`mpbarbosa.com` (bare apex) is the canonical host; `www` 301-redirects to it,
preserving path and query. The nginx configs live in `shell_scripts/nginx/` and
are **not** deployed by `sync_to_staging.sh` — they are installed separately by:

- `setup_www_redirect.sh` — installs the redirect vhost. **Refuses to run** while
  another enabled vhost still claims `www`, and tells you to edit that file.
- `fix_www_vhost_conflict.sh` — does that prerequisite edit (drops `www` from the
  main vhost's `server_name`) *and* installs the redirect in a single
  `nginx -t` + reload, with automatic rollback. Use this one; the two-step manual
  sequence leaves a window where `www` matches no vhost and falls through to
  `default_server`.

Both run on the prod host. Shipping a config change to `shell_scripts/nginx/`
does nothing on its own — someone has to run the installer.

### Test suite layout (`src/__tests__/`)

| File | Jest project | What it covers |
|---|---|---|
| `main.test.js` | unit | DOM behaviour in index.html |
| `InitializationUtilities.test.js` | unit | utility helpers |
| `fixtures/**/*.test.js` | unit | fixture-based unit tests |
| `html_functionality.test.js` | integration | HTML structure / DOM |
| `project_navigation.test.js` | integration | redirect pages, landing-page links |
| `shell_integration.test.js` | integration | shell integration |
| `shell_scripts.test.js` | shell-scripts | deploy/sync script validation + dry-run |
| `sync_to_public.test.js` | shell-scripts | staging sync script |
| `staging_content.test.js` | shell-scripts | staged content correctness |
| `documentation.test.js` | documentation | docs file checks |
| `accessibility.test.mjs` | accessibility | axe-core a11y checks (puppeteer-driven Chrome) |

The five Jest projects (`unit`, `integration`, `shell-scripts`, `documentation`, `accessibility`) are defined in `src/jest.config.js`; `npm test` runs them all. Tests are ES Modules. The `unit` project uses a custom jsdom environment (`jest-environment-jsdom-no-warnings.cjs`); `integration`, `shell-scripts`, `documentation`, and `accessibility` run in the `node` environment. `accessibility` must be `node`: it drives a real Chrome through puppeteer, whose `ws` transport refuses to run when jsdom makes the environment look like a browser.
