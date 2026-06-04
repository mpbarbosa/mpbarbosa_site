---
name: check-prod-parity
description: >
  Compares the local codebase (src/) against the live production site at
  https://www.mpbarbosa.com and reports every parity gap as a table of
  ✓ / ✗ markers. Use when asked to "check prod parity", "compare with
  production", or "is production up to date".
---

<what-to-do>

Run the full parity check without asking questions. Work through each phase
in order, then output a single structured report.

## Phase 1 — Extract ground truth from local source

Read the following files and extract the markers listed under each:

**`src/index.html`**
- AI tools named in intro: "GitHub Copilot", "Claude Code", "Cursor", "Google Stitch"
- EN language toggle present: `href="en/"`
- Formspree endpoint: `formspree.io/f/xrevgvda`
- Formspree CDN: `@formspree/ajax`
- Success div: `data-fs-success`
- PT success message: "Obrigado pela mensagem"

**`src/en/index.html`**
- Language attribute: `lang="en"`
- PT toggle: `href="../"`
- Singularity section: `id="singularity"`
- Singularity CTA: "Back this mission"
- Singularity link: `singularity.diy`
- Formspree endpoint: `formspree.io/f/xrevgvda`
- Formspree CDN: `@formspree/ajax`
- EN success message: "Thank you for your message"

**`src/llms.txt`**
- Mission statement fragment: "AI-assisted development reliable"
- Singularity link: `singularity.diy`
- GitHub profile: `github.com/mpbarbosa`
- English portfolio link: `mpbarbosa.com/en/`

**`src/llms-full.txt`**
- Module count: `111 total modules`
- Funding blockchain: `Solana`
- English investor page: `mpbarbosa.com/en/`

**`src/scripts/v2.js`**
- Fake form handler removed: `initContactForm` must NOT be present

**`src/styles/v2.css`**
- Error style present: `.form-error`
- Disabled button style: `btn-primary:disabled`

## Phase 2 — Fetch production pages

Fetch each of these URLs and record the raw content:

| URL | Purpose |
|---|---|
| `https://www.mpbarbosa.com/` | PT portfolio (index.html) |
| `https://www.mpbarbosa.com/en/` | EN portfolio + Singularity section |
| `https://www.mpbarbosa.com/llms.txt` | LLM-readable domain file |
| `https://www.mpbarbosa.com/llms-full.txt` | Full LLM context |
| `https://www.mpbarbosa.com/v1/` | Legacy archive (check it loads) |

Ask the fetch tool for exact string presence for each marker. Do not rely on
model interpretation — ask for raw found/not-found for specific substrings.

## Phase 3 — Compare and report

Output a report with three sections:

### 1. Summary line
One sentence: e.g. "Production is in sync" or "Production is behind — N markers missing".

### 2. Parity table

One row per marker, grouped by file/page. Use ✓ for match, ✗ for mismatch.
For each ✗, add a short note explaining the likely cause (not deployed, stale
staging, etc.).

### 3. Action items (only if gaps found)

Ordered list of the commands needed to close the gaps, e.g.:
1. Run `sync_to_staging.sh --step1` to sync source to staging
2. Commit and push staging repo
3. Run `prod_deploy.sh` to deploy staging to production

If production is fully in sync, say so and stop — no action items needed.

</what-to-do>

<supporting-info>

## Deployment pipeline

```
src/  →  (sync_to_staging.sh --step1)  →  ../mpbarbosa.com/  →  (prod_deploy.sh)  →  /var/www/mpbarbosa.com
```

- **Staging repo**: `/home/mpb/Documents/GitHub/mpbarbosa.com/`
- **Production dir**: `/var/www/mpbarbosa.com`
- **Production URL**: `https://www.mpbarbosa.com`
- `prod_deploy.sh` does `git pull` on the staging repo then runs `--step2`
- Step1 copies files but does NOT auto-commit; changes must be committed and
  pushed to the staging remote before `prod_deploy.sh` can pull them on the server

## Key files and their production URLs

| Local path | Production URL |
|---|---|
| `src/index.html` | `https://www.mpbarbosa.com/` |
| `src/en/index.html` | `https://www.mpbarbosa.com/en/` |
| `src/llms.txt` | `https://www.mpbarbosa.com/llms.txt` |
| `src/llms-full.txt` | `https://www.mpbarbosa.com/llms-full.txt` |
| `src/v1/` | `https://www.mpbarbosa.com/v1/` |
| `src/styles/v2.css` | `https://www.mpbarbosa.com/styles/v2.css` |
| `src/scripts/v2.js` | `https://www.mpbarbosa.com/scripts/v2.js` |

## Known WebFetch limitations

The WebFetch tool converts HTML to markdown before processing. Some HTML
attributes (e.g. form `action`, `data-*` attributes) may be stripped in the
conversion. When checking for these markers:

- Always ask for exact substring presence, not semantic interpretation
- If a marker is reported as not found but its visible side-effect IS found
  (e.g. success message text visible but `data-fs-success` attr not found),
  note the ambiguity — the marker may be present but invisible to the fetcher
- For CSS and JS files, fetch them directly by URL; they are served as plain
  text and are reliably readable

## Version tracking

The version number lives in `src/package.json` and is NOT embedded in any
served HTML file. Do not attempt to infer production version from page content.
Infer sync status from content markers only.

</supporting-info>
