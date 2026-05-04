# Copilot Guidance: mpbarbosa-site-root

This file provides durable, high-signal guidance for Copilot-assisted development in this repository.

**Purpose:** Guide Copilot and AI tools to make correct, context-aware edits by clarifying project boundaries, validation commands, and architectural rules.

## Project Boundaries

- The primary source directory is `src/`, with stable submodules: `assets`, `components`, `coverage`, `images`, `node_modules`, `pages`, `scripts`, and `styles`.
- Do not make changes outside these layers unless explicitly required.

## Validation and Testing

- Use `npm test` to validate changes.
- Do not alter test commands unless explicitly required.

## Documentation and Reference

- For implementation details and authoritative project information, refer to:
  - `README.md`
  - `CHANGELOG.md`
  - `docs/ARCHITECTURE.md`
- Do not duplicate file trees, dependency lists, or command walkthroughs here; link to the above documents as needed.

## Design and Coding Principles

- Respect the stable source layers and project boundaries.
- Prefer durable, minimal, and maintainable changes.
- If a rule or pattern is not explicitly stated here or in the referenced docs, do not assume it applies.

## When to Update This File

- Update only when project boundaries, validation commands, or Copilot-specific guidance change.
- Do not use this file for status snapshots, implementation notes, or general documentation.
