---
name: mpbarbosa-site-context
description: Domain glossary for mpbarbosa.com — the hiring-facing portfolio and the ai_workflow Singularity funding mission
metadata:
  type: project
---

# mpbarbosa.com

Portfolio site and hiring-facing profile. The Portuguese version is the primary version; the English version lives at `/en/` and mirrors it for a global audience. The Singularity fundraising content has its own page at `/en/singularity/` and is deliberately kept off the hiring path.

## Language

**Mission**:
The purpose of ai_workflow as expressed to Singularity investors — distinct from its technical description as a tool or repo.
_Avoid_: Project, product, tool

**Mission page**:
The Singularity-hosted fundraising page for ai_workflow. Not part of this repo.
_Avoid_: Singularity page, funding page, campaign

**Singularity section**:
The block presenting the ai_workflow mission and the "Back this mission" call-to-action to investors. It lives on its own page at `/en/singularity/` (`src/en/singularity/index.html`), reachable from the `/en/` footer only — it was moved off `/en/index.html` so the English landing reads as a professional profile to recruiters.
_Avoid_: Investment section, funding block

**Portfolio site**:
mpbarbosa.com — the static HTML5 site in this repo (`mpbarbosa_site`). Two versions: PT at `/`, EN at `/en/`. Both lead with the professional positioning (telecom billing, Oracle/PL-SQL, software built by directing AI coding agents) and state availability for senior positions.
_Avoid_: Landing page, personal site

**Fund request**:
A formal on-chain request to Singularity investors for treasury funds. In this mission, fund requests pay for developer time on ai_workflow. Requires 4-of-6 top-investor approval.
_Avoid_: Payment request, invoice

**LLM-readable files**:
`llms.txt` (concise) and `llms-full.txt` (comprehensive) served at the domain root per llmstxt.org. Also present in the `ai_workflow` repo root for AI tools that read repos directly (Cursor, Claude Code, Copilot Workspace).
_Avoid_: AI metadata, robot files, machine-readable files
