// app/api/standings/seasons/route.ts
// =============================================================================
// ROUTE: /api/standings/seasons
// -----------------------------------------------------------------------------
// Responsibility:
//   Return Season options for a given league, derived from football-data.org
//   competition "seasons" array.
//
// Query params:
//   - leagueId (e.g. "premier-league")
//   - debug   (optional: "true" → return raw upstream JSON for inspection)
//
// Notes:
//   - Server-only, reads upstream API key from env.
//   - Maps external "season" model → StandingsFilterOption (value, label).
//   - Currently supports a small subset of leagues via shared LEAGUE_ID_TO_CODE.
// =============================================================================

import { NextResponse } from "next/server";
import type { StandingsFilterOption } from "@/app/standings/types";
import { LEAGUE_ID_TO_CODE, SupportedLeagueId } from "@/app/standings/leagueMappings";

export type SeasonsApiResponse = {
  seasons: StandingsFilterOption[];
};

// -----------------------------------------------------------------------------
// Upstream types (minimal subset of what we actually use)
// -----------------------------------------------------------------------------

type FootballDataSeason = {
  id: number;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  currentMatchday: number | null;
  winner: unknown | null;
};

type FootballDataCompetitionWithSeasons = {
  id: number;
  area: {
    id: number;
    name: string;
    code: string | null;
    flag?: string | null;
  };
  name: string;
  code: string | null;
  type: string;
  emblem?: string | null;
  currentSeason: FootballDataSeason | null;
  seasons: FootballDataSeason[];
};

/**
 * Format a season label/value pair from start/end dates.
 *
 * Examples:
 *   2025-08-15 → 2025, 2026 → label "2025/26", value "2025-26"
 *   2020-08-01 → 2020, 2021 → label "2020/21", value "2020-21"
 */
function formatSeasonOptionFromDates(season: FootballDataSeason): StandingsFilterOption | null {
  if (!season.startDate || !season.endDate) return null;

  const startYear = Number(season.startDate.slice(0, 4));
  const endYear = Number(season.endDate.slice(0, 4));

  if (Number.isNaN(startYear) || Number.isNaN(endYear)) {
    return null;
  }

  // If end year == start year (rare), just show a single year.
  if (endYear === startYear) {
    const label = String(startYear);
    return { value: label, label };
  }

  const endYearShort = String(endYear).slice(-2); // 2026 → "26"
  const label = `${startYear}/${endYearShort}`; // "2025/26"
  const value = `${startYear}-${endYearShort}`; // "2025-26"

  return { value, label };
}

/**
 * Map and sort seasons → newest first, then limit to a reasonable count.
 */
function mapSeasonsToOptions(upstream: FootballDataCompetitionWithSeasons): StandingsFilterOption[] {
  const seasons = upstream.seasons ?? [];

  return seasons
    .slice() // defensive copy
    .sort((a, b) => {
      // Sort DESC by startDate (newest first).
      // Invalid dates fall back to 0 so they go to the end.
      const aTime = Date.parse(a.startDate ?? "") || 0;
      const bTime = Date.parse(b.startDate ?? "") || 0;
      return bTime - aTime;
    })
    .map(formatSeasonOptionFromDates)
    .filter((option): option is StandingsFilterOption => option !== null)
    .slice(0, 20); // UX: cap to last 20 seasons for now
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("leagueId");
  const debug = searchParams.get("debug") === "true";

  if (!leagueId) {
    return NextResponse.json(
      {
        error: { code: "MISSING_LEAGUE_ID", message: "leagueId is required." },
      },
      { status: 400 },
    );
  }

  const competitionCode =
    LEAGUE_ID_TO_CODE[leagueId as SupportedLeagueId];

  if (!competitionCode) {
    return NextResponse.json(
      {
        error: {
          code: "UNSUPPORTED_LEAGUE_ID",
          message: `League '${leagueId}' is not supported yet in /api/standings/seasons.`,
        },
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: {
          code: "MISSING_API_KEY",
          message: "FOOTBALL_DATA_API_KEY is not configured on the server.",
        },
      },
      { status: 500 },
    );
  }

  try {
    const upstreamResponse = await fetch(
      `https://api.football-data.org/v4/competitions/${competitionCode}`,
      {
        headers: {
          "X-Auth-Token": apiKey,
        },
        // Optional: small cache, safe for "seasons" which hardly change
        next: { revalidate: 60 * 60 }, // 1 hour
      },
    );

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          error: {
            code: "SEASONS_UPSTREAM_ERROR",
            message: `Upstream responded with status ${upstreamResponse.status}.`,
          },
        },
        { status: 502 },
      );
    }

    const upstreamJson = (await upstreamResponse.json()) as FootballDataCompetitionWithSeasons;

    // Debug mode: return the raw upstream payload you pasted earlier.
    if (debug) {
      return NextResponse.json(upstreamJson, { status: 200 });
    }

    const seasons = mapSeasonsToOptions(upstreamJson);

    const responseBody: SeasonsApiResponse = { seasons };

    return NextResponse.json(responseBody, {
      status: 200,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET /api/standings/seasons] Unexpected error", error);

    return NextResponse.json(
      {
        error: {
          code: "SEASONS_UPSTREAM_UNAVAILABLE",
          message: "Unable to fetch season options at this time.",
        },
      },
      { status: 500 },
    );
  }
}
