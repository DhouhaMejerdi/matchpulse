# 📘 Match Pulse — `LeagueInfoBanner` Implementation Guide (v1.0)

**Component:** `LeagueInfoBanner`

**Owner:** Frontend Team  
**Last updated:** 2025-11-06

---

## 🧩 Responsibility

Render an **optional contextual banner** above the `TeamsGrid` when a single league is selected.

Displays key meta information about the league:

```
--------------------------------------------------------------
| Premier League 🇬🇧  ·  20 Teams  ·  Current Season: 2025/26  |
| “Select a team to view fixtures, stats, and top players.”   |
--------------------------------------------------------------
```

When no league is selected (or "All Leagues" is active), this component remains hidden.

---

## 🎯 Goals

| Goal | Description |
| --- | --- |
| ✅ **Contextual clarity** | Give users clear information about the selected league. |
| ✅ **Pure presentation** | No data fetching; receives a `LeagueMeta` object via props. |
| ✅ **Tokens-first styling** | Use spacing, radius, font, and color tokens — no raw values. |
| ✅ **A11y-first** | Section with `aria-label`; flag emoji has `role="img"` and label. |
| ✅ **Consistent rhythm** | Align banner width and padding to `.container` and `TeamsGrid`. |
| ✅ **Motion-safe polish** | Subtle lift + shadow transitions wrapped in `motion-safe()`. |
| ✅ **CI-compliant** | Must pass `npm run verify` (lint, stylelint strict, typecheck). |

---

## 🧱 File Structure

```
src/
  components/
    teams/
      LeagueInfoBanner.tsx
  styles/
    components/
      _teams-league-banner.scss

docs/
  teams/
    README_TeamsLeagueInfoBanner_Implementation.md
```

Banner styles are imported through `src/styles/components/_index.scss`.

---

## 🧩 Component Contract

| Contract | Description |
| --- | --- |
| **LeagueInfoBanner** | Receives a `LeagueMeta` object; renders league info and tagline. |
| **Parent** | `/teams/page.tsx` |
| **Visibility** | Only rendered when `league !== "all"` and `leagueMeta` exists. |
| **Props** | `{ id, name, countryCode, countryName, teamCount, seasonLabel, tagline? }` |
| **Default tagline** | `"Select a team to view fixtures, stats, and top players."` |
| **A11y** | `<section aria-label="Premier League league overview">` |
| **Visual tokens** | `--surface-teams-banner`, `--border-subtle`, `--s-*`, `--r-md`, `--shadow-sm`, `--text-muted` |

---

## 🧠 Type Definition

```ts
// src/app/teams/page.tsx (or shared types file)

export type LeagueMeta = {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  teamCount: number;
  seasonLabel: string;
  tagline?: string;
};
```

---

## 🧩 Example Usage

```tsx
import LeagueInfoBanner from '@/components/teams/LeagueInfoBanner';
import { LEAGUES } from '@/lib/teams/leagues';

const league = 'premier-league';
const leagueMeta = LEAGUES[league];

return (
  <main className="page">
    <section className="teams-header container" />
    {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}
    <section className="teams-grid container" />
  </main>
);
```

---

## 🧱 Example TSX Implementation

```tsx
// =============================================================================
// COMPONENT: LeagueInfoBanner
// Responsibility: Context banner for currently selected league on /teams
// Contracts: Pure presentational; expects a populated LeagueMeta object
// A11y: Section with aria-label; uses semantic text and safe contrast
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import * as React from 'react';
import type { LeagueMeta } from '@/app/teams/page';

type Props = { league: LeagueMeta };

export default function LeagueInfoBanner({ league }: Props) {
  const { name, countryCode, countryName, teamCount, seasonLabel, tagline } = league;

  const flag = countryCodeToFlag(countryCode);

  return (
    <section className="league-banner container" aria-label={`${name} league overview`}>
      <div className="league-banner__meta">
        <span className="league-banner__name">
          {name}
          {flag && (
            <span className="league-banner__flag" role="img" aria-label={countryName}>
              {' ' + flag}
            </span>
          )}
        </span>

        <span className="league-banner__separator" aria-hidden="true">·</span>
        <span className="league-banner__stat">{teamCount} Teams</span>

        <span className="league-banner__separator" aria-hidden="true">·</span>
        <span className="league-banner__stat">Current Season: {seasonLabel}</span>
      </div>

      <p className="league-banner__tagline">
        {tagline ?? 'Select a team to view fixtures, stats, and top players.'}
      </p>
    </section>
  );
}

function countryCodeToFlag(code: string) {
  if (!code || code.length !== 2) return null;
  const base = 0x1f1e6;
  return String.fromCodePoint(
    base + (code.toUpperCase().charCodeAt(0) - 65),
    base + (code.toUpperCase().charCodeAt(1) - 65)
  );
}
```

---

## 🧩 SCSS Rules (📘 Styles Quality Gate Compliant)

```scss
// ==========================================================
// COMPONENT: LeagueBanner
// Responsibility: Context banner above teams grid for selected league
// Tokens: --surface-teams-banner, --border-subtle, --s-4, --s-3,
//         --text-sm, --text-base, --r-md, --shadow-sm
// Owner: Frontend Team • Last updated: 2025-11-06
// ==========================================================

@use 'sass:map';
@use '../abstracts' as abstracts;

.league-banner {
  margin-block: var(--s-4);
  padding: var(--s-4);
  border-radius: var(--r-md);
  background: var(--surface-teams-banner, var(--surface-2));
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--s-2);
    font-size: clamp(var(--text-sm), 2.5vw, var(--text-base));
    font-weight: 500;
  }

  &__name {
    font-weight: 600;
  }

  &__flag {
    margin-left: var(--s-1);
  }

  &__separator {
    opacity: 0.6;
  }

  &__stat {
    color: var(--text-muted);
  }

  &__tagline {
    margin-top: var(--s-2);
    font-size: clamp(var(--text-sm), 2.4vw, var(--text-base));
    color: var(--text-muted);
  }

  @include abstracts.mq-min(map.get(abstracts.$breakpoints, md)) {
    padding-inline: var(--s-6);
    &__meta { gap: var(--s-3); }
    &__tagline { margin-top: var(--s-1); }
  }

  &:focus-within { @include abstracts.focus-ring(); }

  @include abstracts.motion-safe() {
    transition: box-shadow 150ms ease-out, transform 150ms ease-out;

    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
  }
}
```

---

## 🧠 Accessibility Notes

- Banner is rendered as a `<section>` with `aria-label` (e.g. “Premier League league overview”).
- Emoji flag uses `role="img"` and `aria-label` for screen readers.
- All text has sufficient contrast against banner surface.
- Font sizes use `clamp()` for responsive scaling.
- Safe hover and focus states are motion-wrapped for users with reduced motion.

---

## 🧩 States & Logic

| State | Behavior |
| --- | --- |
| **Single league selected** | Banner shown with league meta. |
| **All leagues / none** | Banner hidden. |
| **Missing meta data** | Component not rendered (fail-safe). |
| **Custom tagline** | Overrides default tagline if provided. |

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

- ✅ Mobile + Desktop screenshots  
- ✅ All gates green  
- ✅ Focus-visible + reduced-motion evidence

---

## 📜 Comment Header Template

```tsx
// =============================================================================
// COMPONENT: LeagueInfoBanner
// Responsibility: Contextual banner for currently selected league on /teams
// Contracts: Pure presentational; expects LeagueMeta props; no logic inside
// A11y: Section with aria-label; emoji flag labelled for screen readers
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================
```

---

## 🔒 Quality Gate References

- 📘 *Match Pulse — Styles Quality Gate (v1.1)*  
- 📗 *Frontend Architecture & Project Structure (v1.0)*  
- 📗 *Commenting & Docstring Conventions (v1.0)*  
- 📘 *Header Implementation Post-Mortem & Lessons (v1.0)*  
- 📘 *TeamsGrid Implementation Guide (v1.1)*  

---

## ✅ Definition of Done (for PR)

| Category | Requirement |
| --- | --- |
| **Tokens-first** | No raw px/hex/rgb values. |
| **Maintainable** | BEM naming, ≤ 3 nesting, no !important. |
| **A11y-safe** | Section labelled, focus-visible, flag accessible. |
| **Mobile-first** | `clamp()` typography + flex-wrap meta line. |
| **CI-passed** | Lint strict + Typecheck + Build OK. |
| **Visual evidence** | Screenshots attached (Desktop + Mobile). |
