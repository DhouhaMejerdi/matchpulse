# README_TeamsPageHeader_Implementation

# 📘 Match Pulse — `TeamsPageHeader` Implementation Guide (v1.0)

**Component:** `TeamsPageHeader`

**Location:** `src/app/teams/TeamsPageHeader.tsx`

**Owner:** Frontend Team

**Last updated:** 2025-11-04

---

## 🧩 Responsibility

Render the **hero section** for the `/teams` page.

It introduces the page title, subtitle, and hosts the filters bar (League, Search, Sort).

---

## 🎯 Goals

| Goal | Description |
| --- | --- |
| ✅ **Consistent layout** | Follow the `container` rhythm contract (`.container` inside `.page`). |
| ✅ **Tokens-first** | Use only tokens (`var(--*)`) for color, spacing, radius, font size, shadows. |
| ✅ **Mobile-first** | Default styles = mobile; scale up with `@include abstracts.mq-min(map.get(abstracts.$breakpoints, md))`. |
| ✅ **A11y-first** | Section labelled by `<h1>`; visible focus ring; tap targets ≥ 44px. |
| ✅ **Commenting standard** | Include docstring header and section dividers per 📗 *Commenting & Docstring Conventions (v1)*. |
| ✅ **CI compliance** | Pass `npm run verify` (lint, stylelint strict, typecheck, build). |

---

## 🧱 File Structure

```
src/
  app/
    teams/
      TeamsPageHeader.tsx
  styles/
    components/
      _teams-header.scss

```

Both files are imported by their respective global orchestrators:

- `TeamsPageHeader.tsx` is rendered inside `/teams/page.tsx`.
- `_teams-header.scss` is included from `src/styles/components/_index.scss`.

---

## 🧩 Component Contracts

| Contract | Description |
| --- | --- |
| **Name** | `TeamsPageHeader` |
| **Props** | None in v1.0 (future versions may accept `league`, `search`, `sort` state) |
| **Parent** | `/teams/page.tsx` |
| **Children** | `LeagueFilter`, `TeamsSearchField`, `TeamsSortSelect` *(placeholders for now)* |
| **A11y** | `aria-labelledby="teams-header-title"` on section, `id="teams-header-title"` on h1, filters wrapped in `role="group"` with `aria-label="Team filters"`. |
| **Container** | Must include `.container` wrapper to prevent CLS and match layout rhythm. |
| **Visual tokens** | `--surface-1`, `--ui-800`, `--s-8`, `--s-4`, `--s-3`, `--text-xl`, `--text-2xl`, `--text-muted`, `--brand-500`. |

---

## 🧩 SCSS Rules (📘 Styles Quality Gate compliant)

| Rule | Implementation |
| --- | --- |
| **Imports** | `@use 'sass:map';` and `@use '../abstracts' as abstracts;` |
| **BEM Naming** | `.teams-header`, `.teams-header__title`, `.teams-header__controls`, etc. |
| **Nesting** | ≤ 3 levels |
| **No !important** | Forbidden; use `motion-safe()` and `focus-ring()` mixins instead |
| **Responsive breakpoints** | `map.get(abstracts.$breakpoints, md)` (not raw `48rem`) |
| **Focus ring** | `@include abstracts.focus-ring();` |
| **Motion safe transitions** | `@include abstracts.motion-safe()` wrapper |

---

## 🧠 Accessibility Notes

- The header sits **inside `<main role="main" id="main-content">`** from RootLayout — never inside the global `<header role="banner">`.
- Focus ring visible on TAB navigation.
- No interactive element under 44px height.
- Colors meet AA contrast on dark surface background.

---

## ⚙️ Lint & Verification Flow

Run locally before committing:

```bash
npm run lint:css:fix   # fix property order, etc.
npm run check          # eslint + stylelint + typecheck

```

Before merge:

```bash
npm run verify         # full lint strict + typecheck + build

```

Attach in PR:

- ✅ Desktop + Mobile screenshots of `/teams` header
- ✅ All gates green
- ✅ Focus-visible evidence
- ✅ Reduced-motion safe evidence

---

## 📜 Comment Header Template

For any `/teams` component, include this at the top:

```tsx
// =============================================================================
// COMPONENT: [ComponentName]
// Responsibility: [short summary of what it renders or controls]
// Contracts: [props / dependencies / interactions summary]
// A11y: [roles / labels / focus rules summary]
// Owner: Frontend Team • Last updated: [YYYY-MM-DD]
// =============================================================================

```

Example:

```tsx
// =============================================================================
// COMPONENT: TeamsPageHeader
// Responsibility: Page hero for /teams (title + filters bar)
// Contracts: No props; rendered inside /teams main content
// A11y: Section labelled by h1; filters group has aria-label="Team filters"
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

```

---

## 🔒 Quality Gate References

- 📘 *Match Pulse — Styles Quality Gate (v1.1)*
- 📗 *Match Pulse — Frontend Architecture & Project Structure (v1.0)*
- 📗 *Match Pulse — Commenting & Docstring Conventions (v1.0)*
- 📘 *Match Pulse — Header Implementation Post-Mortem & Lessons (v1.0)*

All `/teams` styles, comments, and file structures must respect these documents **strictly**.

---

## ✅ Definition of Done (for PR)

| Category | Requirement |
| --- | --- |
| **Tokens-first** | No raw px, hex, or rgb values |
| **Maintainable** | BEM naming, ≤ 3 nesting, no !important |
| **A11y-safe** | Focus-visible ring, 44px tap targets |
| **Mobile-first** | Responsive with modern media ranges |
| **Verified** | Lint, Stylelint strict, Typecheck, Build passed |
| **Visual evidence** | Desktop + mobile screenshots attached |