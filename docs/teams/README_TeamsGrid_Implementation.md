# README_TeamsGrid_Implementation

# 📘 Match Pulse — `TeamsGrid` Implementation Guide (v1.1)

**Component:** `TeamsGrid` + `TeamCard`

**Owner:** Frontend Team

**Last updated:** 2025-11-05

---

## 🧩 Responsibility

Render the **main content grid** of the `/teams` page.

Displays all clubs for the selected league in a responsive card layout.

Each card (`TeamCard`) includes:

- Crest (via `/api/crest`)
- Team name
- Country · League
- Form chips (5 results: W/D/L) with color coding
- Hover CTA (“View team →”)
- Graceful crest fallback (first letter badge)

---

## 🎯 Goals

| Goal | Description |
| --- | --- |
| ✅ **Consistent layout** | Respect `.container` rhythm inside `/teams`. |
| ✅ **Responsive grid** | 2 cols → 3 cols → 4 cols (`repeat(auto-fill, minmax(240px, 1fr))`). |
| ✅ **Tokens-first** | All color, spacing, radius, font, and shadow values use design tokens. |
| ✅ **A11y-first** | Each card is a single link; min tap ≥ 44 px; `aria-label` includes team + league. |
| ✅ **Motion-safe** | Lift shadow + CTA animation wrapped in `@include abstracts.motion-safe()`. |
| ✅ **Tooltip-ready form** | Each chip supports `title` + `sr-only` labels (“Win / Draw / Loss”). |
| ✅ **Commenting standard** | Full docstring headers per 📗 *Commenting & Docstring Conventions (v1)*. |
| ✅ **CI compliance** | Pass `npm run verify` (lint + stylelint strict + typecheck + build). |

---

## 🧱 File Structure

```
src/
  app/
    teams/
      TeamsGrid.tsx
      form.ts                # shared form model & helpers
      page.tsx               # imports mock + renders grid
  components/
    teams/
      TeamCard.tsx
      __mocks__/
        teams.mock.ts
  styles/
    components/
      _teams-grid.scss
      _team-card.scss

```

Both SCSS files are imported through `src/styles/components/_index.scss`.

---

## 🧩 Component Contracts

| Contract | Description |
| --- | --- |
| **TeamsGrid** | Receives `teams: TeamSummary[]`; renders responsive `<ul>` of `<TeamCard>`. |
| **TeamCard** | Single visual card; entire card = link → `/team/[id]`. |
| **Parent** | `/teams/page.tsx` |
| **Children** | `TeamCard` (1 per team) |
| **Empty state** | Shows “No teams match your filters.” |
| **A11y** | `<section aria-label="Teams list">` wrapping semantic `<ul>`. |
| **Visual tokens** | `--surface-0`, `--muted-600`, `--status-upcoming`, `--status-ht`, `--status-pens`, `--shadow-sm/lg`, `--s-*`, `--r-lg`, `--brand-500`. |

---

## 🧩 SCSS Rules (📘 Styles Quality Gate Compliant)

| Rule | Implementation |
| --- | --- |
| **Imports** | `@use 'sass:map';` `@use '../abstracts' as abstracts;` |
| **BEM naming** | `.teams-grid`, `.teams-grid__list`, `.team-card`, `.team-card__cta`, etc. |
| **Nesting** | ≤ 3 levels |
| **No !important** | Forbidden — use mixins (`focus-ring()`, `motion-safe()`). |
| **Responsive** | `@include abstracts.mq-min(map.get($breakpoints, md))` etc. |
| **Focus ring** | `@include abstracts.focus-ring();` |
| **Transitions** | Inside `@include abstracts.motion-safe()` wrapper. |
| **List reset** | Global `_reset.scss` removes default `ul` padding/margins. |

---

## 🧠 Accessibility Notes

- Grid lives inside `<main id="main-content">` (not header).
- Each `TeamCard` = single `<Link>`.
- Focus ring visible on TAB navigation.
- Tap targets ≥ 44 px.
- Form dots include hidden text (`sr-only`).
- Crest fallback letter ensures name always visible.
- Colors meet AA contrast on dark surface.

---

## 🧩 Layout Behavior

| Viewport | Columns | Example CSS |
| --- | --- | --- |
| **Mobile (base)** | 2 | `grid-template-columns: repeat(2, 1fr);` |
| **Tablet (md)** | 3 | `grid-template-columns: repeat(3, 1fr);` |
| **Desktop (lg +)** | 4+ | `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));` |

Vertical spacing = `gap: var(--s-4)` · `padding-block: var(--s-6)`

Grid collapses → 1 col below 340 px for narrow devices.

---

## 🧠 Hover & Focus Interactions

| Interaction | Result |
| --- | --- |
| **Hover / Focus** | Card lifts 2 px; shadow → `--shadow-lg`; border → accent color. |
| **CTA bar** | Slides up (150 ms ease-out) into reserved padding space. |
| **Accent color** | `--team-accent` or fallback `--brand-500`. |
| **Motion-safe** | Animations wrapped in `motion-safe()` for reduced-motion users. |

---

## 🧪 Example Data (Production Mock)

Located in `src/components/teams/__mocks__/teams.mock.ts`

```tsx
import type { TeamSummary } from '@/app/teams/TeamsGrid';

export const PREMIER_LEAGUE_MOCK_TEAMS: TeamSummary[] = [
  {
    id: 'manchester-city',
    name: 'Manchester City',
    crestUrl: '/api/crest?team=manchester-city',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'W', 'D', 'L', 'W'],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    crestUrl: '/api/crest?team=arsenal',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'D', 'W', 'W', 'L'],
  },
  // …
];

```

---

## ⚙️ Lint & Verification Flow

Local:

```bash
npm run lint:css:fix
npm run check

```

Before merge:

```bash
npm run verify

```

Attach to PR:

- ✅ Desktop + mobile screenshots
- ✅ All gates green
- ✅ Focus-visible evidence
- ✅ Reduced-motion evidence

---

## 📜 Comment Header Template

```tsx
// =============================================================================
// COMPONENT: TeamsGrid
// Responsibility: Responsive grid layout for team cards on /teams
// Contracts: Receives teams[]; renders <ul> of <TeamCard>; empty state supported
// A11y: Section labelled "Teams list"; focus-visible ring on card links
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

```

```tsx
// =============================================================================
// COMPONENT: TeamCard
// Responsibility: Individual team card (crest, name, meta, form, CTA)
// Contracts: Receives TeamSummary; entire card is a link to /team/[id]
// A11y: 44 px tap target; sr-only labels for form dots; focus-visible ring
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

```

---

## 🔒 Quality Gate References

- 📘 *Match Pulse — Styles Quality Gate (v1.1)*
- 📗 *Frontend Architecture & Project Structure (v1.0)*
- 📗 *Commenting & Docstring Conventions (v1.0)*
- 📘 *Header Implementation Post-Mortem & Lessons (v1.0)*

All `/teams` code must comply with these documents **strictly**.

---

## ✅ Definition of Done (for PR)

| Category | Requirement |
| --- | --- |
| **Tokens-first** | No raw px/hex/rgb values |
| **Maintainable** | BEM naming, ≤ 3 nesting, no !important |
| **A11y-safe** | Single link per card, 44 px tap target, sr-only labels |
| **Mobile-first** | 1 → 2 → 3 → 4 columns via modern media ranges |
| **Verified** | Lint strict + Typecheck + Build passed |
| **Visual evidence** | Screenshots attached (Desktop + Mobile) |