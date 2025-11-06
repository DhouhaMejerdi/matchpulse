# 📘 Match Pulse — `LeagueInfoBanner` Implementation Guide (v1.1)

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

When no league is selected (or `leagueMeta` is missing), this component is not rendered.

---

## 🎯 Goals

| Goal | Description |
| --- | --- |
| ✅ **Contextual clarity** | Give users clear information about the selected league (name, country, team count, season). |
| ✅ **Pure presentation** | No data fetching or routing logic; receives a `LeagueMeta` object via props. |
| ✅ **Tokens-first styling** | Uses spacing, radius, font, and color tokens only (no raw px/hex). |
| ✅ **A11y-first** | Section with `aria-label`; flag emoji has `role="img"` and `aria-label`. |
| ✅ **Consistent rhythm** | Width controlled by `.container`; vertical spacing controlled by `.page > * + *`. |
| ✅ **Motion-safe polish** | Subtle lift + shadow transitions wrapped in `motion-safe()`. |
| ✅ **CI-compliant** | Must pass `npm run verify` (lint, stylelint strict, typecheck, build). |

---

## 🧱 File Structure

```bash
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
| **DOM structure** | Outer `<section class="container">` for layout, inner `<div class="league-banner">` for the card surface. |
| **Visibility** | Only rendered when `leagueMeta` is defined (single league context). |
| **Props** | `{ id, name, countryCode, countryName, teamCount, seasonLabel, tagline? }` |
| **Default tagline** | `"Select a team to view fixtures, stats, and top players."` |
| **A11y** | `<section aria-label="Premier League league overview">`; flag emoji has `role="img"` + `aria-label={countryName}`. |
| **Visual tokens** | `--surface-2`, `--border-subtle`, `--s-*`, `--r-md`, `--shadow-sm`, `--shadow-lg`, `--control-text-muted`, `--text-sm`, `--text-base`. |

---

## 🧠 Type Definition

Defined once in `src/app/teams/types.ts` and shared across `/teams`:

```ts
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

## 🧩 Example Usage in `/teams/page.tsx` (v1.1)

```tsx
"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid from "./TeamsGrid";
import LeagueInfoBanner from "@/components/teams/LeagueInfoBanner";
import { ALL_LEAGUES_MOCK_TEAMS } from "@/components/teams/__mocks__/teams.mock";
import { DEFAULT_LEAGUE_ID, LEAGUE_META } from "@/lib/teams/leagues";

export default function TeamsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedLeagueId, setSelectedLeagueId] = useState(() => {
    const fromUrl = searchParams.get("league");
    return fromUrl && LEAGUE_META[fromUrl] ? fromUrl : DEFAULT_LEAGUE_ID;
  });

  const leagueMeta = LEAGUE_META[selectedLeagueId];
  const baseTeams = ALL_LEAGUES_MOCK_TEAMS;

  const filteredTeams = baseTeams.filter((team) => {
    if (!leagueMeta) return true;
    return team.leagueName === leagueMeta.name;
  });

  const handleLeagueChange = (nextLeagueId: string) => {
    setSelectedLeagueId(nextLeagueId);

    const params = new URLSearchParams(searchParams.toString());

    if (nextLeagueId === DEFAULT_LEAGUE_ID) {
      params.delete("league");
    } else {
      params.set("league", nextLeagueId);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <>
      <TeamsPageHeader
        league={selectedLeagueId}
        onLeagueChange={handleLeagueChange}
      />
      {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}
      <TeamsGrid teams={filteredTeams} />
    </>
  );
}
```

---

## 🧱 Final TSX Implementation

```tsx
import * as React from "react";
import type { LeagueMeta } from "@/app/teams/types";

type Props = { league: LeagueMeta };

export default function LeagueInfoBanner({ league }: Props) {
  const { name, countryCode, countryName, teamCount, seasonLabel, tagline } =
    league;
  const flag = countryCodeToFlag(countryCode);

  return (
    <section className="container" aria-label={`${name} league overview`}>
      <div className="league-banner">
        <div className="league-banner__meta">
          <span className="league-banner__name">
            {name}
            {flag && (
              <span
                className="league-banner__flag"
                role="img"
                aria-label={countryName}
              >
                {" " + flag}
              </span>
            )}
          </span>

          <span className="league-banner__separator" aria-hidden="true">·</span>
          <span className="league-banner__stat">{teamCount} Teams</span>
          <span className="league-banner__separator" aria-hidden="true">·</span>
          <span className="league-banner__stat">Current Season: {seasonLabel}</span>
        </div>

        <p className="league-banner__tagline">
          {tagline ?? "Select a team to view fixtures, stats, and top players."}
        </p>
      </div>
    </section>
  );
}

function countryCodeToFlag(code: string): string | null {
  if (!code || code.length !== 2) return null;
  const base = 0x1f1e6;
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    base + (upper.charCodeAt(0) - 65),
    base + (upper.charCodeAt(1) - 65)
  );
}
```

---

## 🧩 SCSS Rules

```scss
@use "sass:map";
@use "../../abstracts" as abstracts;

.league-banner {
  padding: var(--s-4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  background: var(--surface-2);
  box-shadow: var(--shadow-sm);

  &__meta {
    display: flex;
    gap: var(--s-2);
    align-items: center;
    flex-wrap: wrap;
    font-size: clamp(var(--text-sm), 2.5vw, var(--text-base));
    font-weight: 500;
  }

  &__name { font-weight: 600; }
  &__flag { margin-left: var(--s-1); }
  &__separator { opacity: 0.6; }
  &__stat, &__tagline { color: var(--control-text-muted); }

  &__tagline {
    margin-top: var(--s-2);
    font-size: clamp(var(--text-sm), 2.4vw, var(--text-base));
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
      box-shadow: var(--shadow-lg);
      transform: translateY(-1px);
    }
  }
}
```

---

## ✅ Definition of Done

| Category | Requirement |
| --- | --- |
| **Tokens-first** | No raw px/hex/rgb values. |
| **Maintainable** | BEM naming, ≤ 3 nesting levels, no `!important`. |
| **A11y-safe** | Section labelled, focus-visible, flag accessible. |
| **Mobile-first** | `clamp()` typography + responsive gaps. |
| **Layout-safe** | Width handled by `.container`, rhythm handled by `.page`. |
| **CI-passed** | Lint strict + Typecheck + Build OK. |
| **Visual evidence** | Screenshots attached (Desktop + Mobile). |
