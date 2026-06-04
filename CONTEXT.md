---
name: mpbarbosa-site-context
description: Domain glossary for mpbarbosa.com and the ai_workflow Singularity funding mission
metadata:
  type: project
---

# mpbarbosa.com

Portfolio site and developer hub. The Portuguese version is the primary version; the English version lives at `/en/` and is the Singularity investor-facing landing.

## Language

**Mission**:
The purpose of ai_workflow as expressed to Singularity investors — distinct from its technical description as a tool or repo.
_Avoid_: Project, product, tool

**Mission page**:
The Singularity-hosted fundraising page for ai_workflow. Not part of this repo.
_Avoid_: Singularity page, funding page, campaign

**Singularity section**:
The dedicated block on `/en/index.html` presenting the ai_workflow mission and the "Back this mission" call-to-action to investors.
_Avoid_: Investment section, funding block

**Portfolio site**:
mpbarbosa.com — the static HTML5 site in this repo (`mpbarbosa_site`). Two versions: PT at `/`, EN at `/en/`.
_Avoid_: Landing page, personal site

**Fund request**:
A formal on-chain request to Singularity investors for treasury funds. In this mission, fund requests pay for developer time on ai_workflow. Requires 4-of-6 top-investor approval.
_Avoid_: Payment request, invoice

**LLM-readable files**:
`llms.txt` (concise) and `llms-full.txt` (comprehensive) served at the domain root per llmstxt.org. Also present in the `ai_workflow` repo root for AI tools that read repos directly (Cursor, Claude Code, Copilot Workspace).
_Avoid_: AI metadata, robot files, machine-readable files
