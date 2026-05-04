# Copilot Guidance: mpbarbosa-site-root

This file provides durable, high-signal guidance for Copilot-assisted development in this repository.  
**Purpose:** Help Copilot make correct, context-aware edits by clarifying project boundaries, validation commands, and architectural rules.  
**Audience:** Copilot and AI-assisted tools.  
**Do not duplicate implementation status, inventories, or workflow walkthroughs here.**

---

## Project Boundaries and Architecture

- **Primary source directory:** `src/`
- **Stable source layers:**  
  - `src/assets/`  
  - `src/components/`  
  - `src/coverage/`  
  - `src/images/`  
  - `src/node_modules/`  
  - `src/pages/`  
  - `src/scripts/`  
  - `src/styles/`
- **Sibling project structure:**  
  - This repository is the main site.  
  - Four sibling projects (not git submodules) exist as independent repositories in the parent directory.  
  - Sibling projects are managed and deployed independently; do not treat them as submodules.
- **Staging/deployment:**  
  - Sibling projects and the main site deploy to a staging repository (e.g., `../mpbarbosa.com/`).  
  - Do not assume direct integration or cross-repo dependencies.

---

## Copilot File Purpose

- This file is for Copilot and AI tools only.
- Keep content focused on durable, project-specific guidance.
- Do not include implementation status, numeric inventories, or workflow tutorials.
- When detailed reference is needed, point to authoritative docs (if available) rather than duplicating content.

---

## Validation and Testing

- **Test command:**  
  - Run all tests with: `npm test`
- **Do not add or change test commands unless explicitly required.**
- **Do not assume a build step exists unless present in `package.json`.**

---

## Documentation and Reference

- **Authoritative reference docs:** Not available.
- For implementation details, refer to the main `README.md` or surfaced documentation in the `/docs/` directory if present.
- Do not duplicate file trees, dependency lists, or command walkthroughs here.

---

## Design and Coding Principles

- Respect the stable source layers and sibling project boundaries.
- Do not introduce cross-repo dependencies or submodule logic.
- When in doubt, prefer durable, minimal, and maintainable changes.
- If a rule or pattern is not explicitly stated here or in surfaced authoritative docs, do not assume it applies.

---

## When to Update This File

- Update only when project boundaries, validation commands, or Copilot-specific guidance changes.
- Do not use this file for status snapshots, implementation notes, or general documentation.

---
