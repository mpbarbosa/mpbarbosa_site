---
name: Technical Minimalist
author: Google AI Studio
description: A high-precision computational aesthetic utilizing monochromatic palettes, grid-based layouts, and architectural typography.
---

# Design Documentation - Marcelo Pereira Barbosa Portfolio

## Philosophy
The portfolio is designed with a **Technical Minimalist** aesthetic, emphasizing precision, hierarchy, and a "dark mode" interface that reflects high-end engineering and AI research environments.

## Visual Language
- **Grid-First Layout**: Utilizing a subtle 40px grid background to evoke computational frameworks.
- **Micro-interactions**: Smooth transitions via CSS (`opacity`, `transform`, `border-color`) and staggered section entrances driven by the IntersectionObserver API — no external animation library.
- **Monochromatic Palette**: A deep charcoal base (`#141313`) with pure white accents for high contrast and focus.

## Typography
Two distinct families create visual rhythm:
- **Primary (Geometric Sans):** `Inter` — body text, labels, and form elements. `font-weight: 300` (light) is an intentional aesthetic choice; `line-height: 1.7` ensures comfortable reading.
- **Display (Geometric Sans):** `Montserrat` — headings and branding. `font-weight: 700–800`, `letter-spacing: 0.2em`, `text-transform: uppercase` for an architectural, premium feel.

### Responsive Type Scale
Base font size scales down at narrow viewports with a minimum floor of 13px:

| Breakpoint | `html` font-size |
|---|---|
| > 1680px | 16px |
| ≤ 1680px | 13px |
| ≤ 736px | 13px |
| ≤ 360px | 13px |

## Color System

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#141313` | Page background (Deep Neutral) |
| `--color-primary` | `#ffffff` | Primary text, icons |
| `--color-surface-var` | `#c4c7c8` | Secondary text, nav links |
| `--color-surface` | `rgba(255,255,255,0.04)` | Card backgrounds |
| `--color-border` | `rgba(255,255,255,0.12)` | Default border |
| `--color-border-hover` | `rgba(255,255,255,0.5)` | Hover border |
| `--color-border-active` | `rgba(255,255,255,0.8)` | Active/focus border |

Footer text uses `rgba(255,255,255,0.45)`; footer links use `rgba(255,255,255,0.55)` for legibility at small sizes.

## Spacing Tokens

| Token | Value |
|---|---|
| `--space-xs` | 8px |
| `--space-sm` | 12px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-xxl` | 48px |

## Site Structure
Four sections, navigated via sticky top bar:

1. **Intro** — Personal statement and current focus
2. **Projetos (IA)** — AI-assisted projects list
3. **Sobre** — Profile, photo strip, and background
4. **Contato** — Contact form and social links

Navigation labels are fully in Brazilian Portuguese (`Intro`, `Projetos`, `Sobre`, `Contato`) on the PT version; fully in English on the EN version (`Intro`, `Projects`, `About`, `Contact`).

## Key Components

### 1. The "Diamond" Emblem
A recurring geometric SVG motif in the top-bar brand, signifying "precision" and "core logic." Rotates 45° on hover.

### 2. Section Cards (`.section-card`)
Border-based cards with:
- Default border: `--color-border` (0.12 opacity)
- Hover border: `--color-border-hover` (0.5 opacity)
- Top linear-gradient accent rule that fades in on hover
- Staggered entrance: starts at `opacity: 0; transform: translateY(24px)`, animates to visible via IntersectionObserver adding `.visible`

### 3. Project List (`.project-list`)
Each entry has a title line (project name + short label) and a `.project-desc` secondary line — a smaller, muted sentence that gives the visitor enough context to decide whether to click.

### 4. Connectors (`.connector`)
Vertical 1px lines between sections with diamond-shaped end caps (rotated squares), mimicking a technical schematic. Use linear gradients (transparent → white → transparent).

### 5. Photo Strip (`.photo-strip`)
Horizontal flex row of profile photos used in the Sobre section. Images use `aspect-ratio: 3/4` and `object-fit: cover` to align regardless of source dimensions. Photos wrapped in `.photo-figure` carry `<figcaption>` captions styled in small italic muted text.

### 6. SVG Card Decoration
An abstract latent-space / kernel-map visualization (dots connected by lines) rendered above the project list card for visual texture.

### 7. Accessibility Utilities
- **`.sr-only`**: Standard visually-hidden class for screen-reader-only content (e.g., the page `<h1>`).
- All sections use `aria-labelledby` pointing to their `<h2>`.
- Decorative images carry `alt=""` and `role="presentation"`.

## Assets

### Background Texture (`#bg`)
A fixed full-page element behind all content. Rotates through multiple photos via JavaScript on a random interval. Rendered with:
- `opacity: 0.06` — very subtle presence
- `filter: grayscale(1) brightness(0.4)` — desaturated and heavily darkened
- `background-attachment: fixed` — parallax effect on scroll

This produces an 80% perceptually-dark overlay: the image reads as atmospheric texture rather than a visible photograph.

### Fonts
Loaded from Google Fonts: `Inter` (weights 300, 400, 500, 700) and `Montserrat` (weights 600, 700, 800). Font Awesome used for social icons.
