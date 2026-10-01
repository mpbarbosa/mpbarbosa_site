---
version: alpha
name: mpbarbosa
description: Minimalist, high-contrast personal portfolio site for a software engineer. Built on Material Design 3 Expressive with a custom black-and-white identity.
colors:
  primary: "#000000"
  on-primary: "#ffffff"
  secondary: "#666666"
  on-secondary: "#ffffff"
  accent: "#333333"
  surface: "#ffffff"
  surface-variant: "#f8f8f8"
  neutral: "#fafafa"
typography:
  h1:
    fontFamily: Roboto
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.3rem
  h2:
    fontFamily: Roboto
    fontSize: 1.6rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2rem
  h3:
    fontFamily: Roboto
    fontSize: 1.25rem
    fontWeight: 500
    lineHeight: 1.5
  body-lg:
    fontFamily: Roboto
    fontSize: 1.1rem
    lineHeight: 1.6
    letterSpacing: 0.01em
  body-md:
    fontFamily: Roboto
    fontSize: 1rem
    fontWeight: 300
    lineHeight: 1.65
    letterSpacing: 0.01em
  caption:
    fontFamily: Roboto
    fontSize: 0.9rem
    lineHeight: 1.5
  label:
    fontFamily: Roboto
    fontSize: 0.8rem
    fontWeight: 300
    lineHeight: 1.5
  code:
    fontFamily: "Courier New"
    fontSize: 0.9rem
    lineHeight: 1.75
rounded:
  xs: 4px
  sm: 12px
  md: 14px
  lg: 18px
  xl: 24px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  3xl: 44px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "0.7rem 1.5rem"
    typography: "{typography.body-md}"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.xl}"
    padding: "0.7rem 1.5rem"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "2rem"
  card-hover:
    backgroundColor: "{colors.surface}"
  top-app-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "0 0 24px 24px"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "0.7rem"
  input-focus:
    backgroundColor: "{colors.neutral}"
  list-item:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "1.2rem 1rem"
---

## Overview

Architectural Minimalism meets Engineering Precision. The site presents a personal portfolio for a software engineer with a high-contrast black-and-white identity — clean, contemporary, and distraction-free.

The visual language draws from **Material Design 3 Expressive** with a deliberate monochromatic override: black is structure and authority; white is space and clarity; grays are nuance and depth. Color is never used for decoration — only for communication.

Typography is set in **Roboto** throughout, with uppercase tracked headings conveying precision and professionalism. Body text is light-weight and airy, allowing content to breathe. Subtle transitions (0.18s–0.25s) and elevation changes acknowledge interaction without distraction.

## Colors

The palette is intentionally minimal: one primary, one secondary, and a range of neutral surfaces.

- **Primary (#000000):** Deep ink — used for backgrounds of key UI surfaces (nav bar, buttons) and all primary text.
- **Secondary (#666666):** Medium gray — for secondary text, metadata, and supporting UI.
- **Accent (#333333):** Dark charcoal — hover/active states and left-border accents on list items.
- **Surface (#ffffff):** Pure white — the primary content background for cards and panels.
- **Surface Variant (#f8f8f8):** Off-white — for list items, input backgrounds, and subtle container differentiation.
- **Outline (#dddddd):** Light gray — card borders, input borders, dividers.
- **Background (#1b1f22):** Near-black — the full-page backdrop, providing depth beneath the content layer.

## Typography

All text is set in **Roboto** (Google Fonts). `Courier New` is reserved strictly for code.

Headings use uppercase with generous letter-spacing (0.2rem–0.5rem) to reinforce the architectural tone. Body text uses a light weight (300) with relaxed line-height (1.65) for readability. The type scale is driven by `rem` units on a responsive base font size that scales down at each breakpoint.

Responsive base font size:
- ≥ 1680px: 16pt
- ≤ 1680px: 12pt
- ≤ 736px: 11pt
- ≤ 360px: 10pt

## Layout

The layout uses CSS Flexbox throughout. The main content grid has a max-width of `1200px`, centered with `margin: 0 auto`, and uses a `2rem` gap between cells. Each grid cell has a minimum width of `300px` and grows to fill available space.

- **Content max-width:** 1200px
- **Layout padding:** `2rem` (desktop) → `0.5rem` (mobile)
- **Grid gap:** `2rem` (desktop) → `1rem` (≤ 900px)
- **Card padding:** `2rem` (desktop) → `1rem` (≤ 600px)

## Elevation & Depth

Shadows are always `rgba(0,0,0,...)` — never colored. They express physical elevation and reinforce interactive affordance.

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `0 1px 4px rgba(0,0,0,0.06)` | Resting list items |
| Soft | `0 1px 6px rgba(0,0,0,0.07)` | Form elements |
| Medium | `0 4px 16px rgba(0,0,0,0.08)` | Resting cards |
| Strong | `0 4px 24px rgba(0,0,0,0.10)` | Elevated cards |
| Deep | `0 6px 24px rgba(0,0,0,0.18)` | Button hover |
| Maximum | `0 12px 40px rgba(0,0,0,0.18)` | Card hover state |

All elevation transitions use `0.18s–0.25s ease-in-out`.

## Shapes

Shapes follow a scale from sharp (interactive elements like inputs and images) to very rounded (buttons and the top app bar).

- **4px (xs):** Images, code blocks, checkboxes — structural, content-adjacent
- **12px (sm):** Text inputs — soft but form-functional
- **14px (md):** List items — visually grouped without being pill-shaped
- **18px (lg):** Cards — friendly, contemporary card appearance
- **24px (xl):** Buttons and top app bar bottom corners — pill-shaped, Material 3 standard
- **100% (circle):** Icon links and radio buttons — fully circular

## Components

### Button (Primary)
Black pill-shaped button with white text. Hover state shifts to charcoal (`#333333`) with an elevated shadow and `scale(1.04)`. Active state scales down to `0.98`. Overflow is `hidden` for ripple containment.

### Card
White surface with `18px` border radius, `2rem` padding, and a `1.5px` outline border. On hover, the card lifts via `translateY(-4px) scale(1.02)` with maximum-level shadow. A thin gradient accent bar (`5px`, `opacity: 0.12`) appears at the top edge.

### Top App Bar
Full-width black header with white text. Bottom corners are `24px` rounded to soften the transition to the page body. Title is `1.5rem / 700` weight.

### Text Input
Off-white (`#fafafa`) background, `12px` border radius, `1.5px` outline border. On focus, the border color shifts to black and no outline ring is shown. Smooth `0.2s` border-color transition.

### List Item
Off-white (`#f8f8f8`) background, `14px` radius, with a `4px` solid left border in black. On hover, the shadow deepens and the border shifts to `#333333`. Provides strong visual affordance for interactive rows.

## Do's and Don'ts

**Do:**
- Use uppercase with letter-spacing for all headings.
- Reserve color exclusively for black/white/gray — this palette is intentionally monochromatic.
- Apply elevation changes (shadow + transform) for all interactive hover states.
- Use `Roboto` at light weight (300) for all body text.
- Use `border-left` accents (4px, black) on list items to add hierarchy without color.
- Scale down padding and gaps at each responsive breakpoint — never crop or overflow content.

**Don't:**
- Don't introduce hues (blue, red, green, etc.) into the UI — this breaks the monochromatic identity.
- Don't use heavy font weights (700+) for body text — reserve bold for headings only.
- Don't use abrupt transitions — all interactive state changes must animate at 0.18s–0.25s.
- Don't apply rounded corners larger than `24px` to non-button elements.
- Don't use box shadows with colored tints — shadows are always `rgba(0,0,0,...)`.
- Don't skip hover/focus states — interactive affordance is critical for accessibility.
