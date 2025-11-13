// =============================================================================
// COMPONENT: LeagueInfoBanner
// Responsibility: Context banner for currently selected league on /teams
// Contracts: Pure presentational; expects LeagueMeta; no data fetching
// A11y: Section with aria-label; emoji flag labelled for screen readers
// Owner: Frontend Team • Last updated: 2025-11-13
// =============================================================================

import * as React from "react";
import type { LeagueMeta } from "@/app/teams/types";

type Props = {
  league: LeagueMeta;
};

export default function LeagueInfoBanner({ league }: Props) {
  const {
    name,
    countryCode,
    countryName,
    teamCount,
    seasonLabel,
    tagline,
  } = league;

  const flag = countryCodeToFlag(countryCode);

  // Empty-league aware default copy (v1.0)
  const isEmptyLeague = teamCount === 0;

  const defaultTagline = isEmptyLeague
    ? "No teams are available for this league yet. We’ll show clubs here as soon as the season data is available."
    : "Select a team to view fixtures, stats, and top players.";

  const bannerTagline = tagline ?? defaultTagline;

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

          <span className="league-banner__separator" aria-hidden="true">
            ·
          </span>

          <span className="league-banner__stat">{teamCount} Teams</span>

          <span className="league-banner__separator" aria-hidden="true">
            ·
          </span>

          <span className="league-banner__stat">
            Current Season: {seasonLabel}
          </span>
        </div>

        <p className="league-banner__tagline">{bannerTagline}</p>
      </div>
    </section>
  );
}

// Convert ISO country code (e.g. "GB") to regional flag emoji.
// If the code is invalid, returns null so callers can safely skip rendering.
function countryCodeToFlag(code: string): string | null {
  if (!code || code.length !== 2) return null;

  const base = 0x1f1e6;
  const upper = code.toUpperCase();

  return String.fromCodePoint(
    base + (upper.charCodeAt(0) - 65),
    base + (upper.charCodeAt(1) - 65)
  );
}
