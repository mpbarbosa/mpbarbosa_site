# Copilot Guidance: mpbarbosa-site-root

This file provides durable, high-signal guidance for Copilot-assisted development in this repository.
**Purpose:** Guide Copilot and AI tools to make correct, context-aware edits by clarifying project boundaries, validation commands, and architectural rules.
**Audience:** Copilot and AI-assisted tools.

Do not include implementation status, inventories, or workflow walkthroughs here.

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
- **Do not introduce cross-repo dependencies or submodule logic.**
- Sibling projects may exist as independent repositories in the parent directory; do not treat them as submodules or assume direct integration.

---

## Validation and Testing

- **Test command:**  
  - Run all tests with: `npm test`
- Do not add or change test commands unless explicitly required.

---

## Documentation and Reference

- For implementation details, refer to authoritative docs:
  - `README.md`
  - `CHANGELOG.md`
  - `docs/ARCHITECTURE.md`
- Do not duplicate file trees, dependency lists, or command walkthroughs here.

---

## Design and Coding Principles

- Respect the stable source layers and project boundaries.
- Prefer durable, minimal, and maintainable changes.
- If a rule or pattern is not explicitly stated here or in surfaced authoritative docs, do not assume it applies.

---

## When to Update This File

- Update only when project boundaries, validation commands, or Copilot-specific guidance change.
- Do not use this file for status snapshots, implementation notes, or general documentation.

---
