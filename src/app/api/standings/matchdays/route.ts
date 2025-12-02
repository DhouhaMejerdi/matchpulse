// app/api/standings/matchdays/route.ts
// =============================================================================
// ROUTE: /api/standings/matchdays
// -----------------------------------------------------------------------------
// Responsibility:
//   Return matchday options for a given league + season, derived from
//   football-data.org competition "seasons" array.
//
// Query params:
//   - leagueId (e.g. "premier-league")
//   - seasonId (e.g. "2024-25") → we use the start year to locate the season.
//
// Notes:
//   - Server-only, reads upstream API key from env.
//   - Maps external "season" model → list of matchdays as StandingsFilterOption.
//   - Currently supports the same leagues as /api/standings/seasons via
//     LEAGUE_ID_TO_CODE.
// =============================================================================

import { NextResponse } from "next/server";
import type { StandingsFilterOption } from "@/app/standings/types";
import {
  LEAGUE_ID_TO_CODE,
  SupportedLeagueId,
} from "@/app/standings/leagueMappings";

export type MatchdaysApiResponse = {
  matchdays: StandingsFilterOption[];
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
  name: string;
  code: string | null;
  type: string;
  currentSeason: FootballDataSeason | null;
  seasons: FootballDataSeason[];
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Given a seasonId like "2024-25", try to extract the start year (2024).
 */
function getStartYearFromSeasonId(seasonId: string | null): number | null {
  if (!seasonId) return null;
  const year = Number(seasonId.slice(0, 4));
  if (Number.isNaN(year)) return null;
  return year;
}

/**
 * Find the FootballDataSeason corresponding to the given seasonId.
 *
 * Strategy:
 *   - If seasonId is provided, match by start year (season.startDate startsWith that year).
 *   - Otherwise, fall back to competition.currentSeason.
 *   - As a last resort, use the first season in the array (if any).
 */
function findSeasonForMatchdays(
  upstream: FootballDataCompetitionWithSeasons,
  seasonId: string | null,
): FootballDataSeason | null {
  const seasons = upstream.seasons ?? [];
  const startYear = getStartYearFromSeasonId(seasonId);

  if (startYear !== null) {
    const startYearStr = String(startYear);
    const match = seasons.find((season) =>
      season.startDate?.startsWith(startYearStr),
    );
    if (match) return match;
  }

  if (upstream.currentSeason) {
    return upstream.currentSeason;
  }

  return seasons[0] ?? null;
}

/**
 * Build "Matchday X" options from 1 → totalMatchdays.
 */
function buildMatchdayOptions(totalMatchdays: number): StandingsFilterOption[] {
  const safeTotal = Number.isFinite(totalMatchdays) && totalMatchdays > 0
    ? Math.min(totalMatchdays, 46) // guard rail (some older leagues had 42)
    : 38; // fallback

  return Array.from({ length: safeTotal }, (_unused, index) => {
    const matchday = String(index + 1);
    return {
      value: matchday,
      label: `Matchday ${matchday}`,
    };
  });
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("leagueId");
  const seasonId = searchParams.get("seasonId");
  const debug = searchParams.get("debug") === "true";

  if (!leagueId) {
    return NextResponse.json(
      {
        error: { code: "MISSING_LEAGUE_ID", message: "leagueId is required." },
      },
      { status: 400 },
    );
  }

  const competitionCode = LEAGUE_ID_TO_CODE[leagueId as SupportedLeagueId];

  if (!competitionCode) {
    return NextResponse.json(
      {
        error: {
          code: "UNSUPPORTED_LEAGUE_ID",
          message: `League '${leagueId}' is not supported yet in /api/standings/matchdays.`,
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
        next: { revalidate: 60 * 60 }, // 1 hour
      },
    );

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          error: {
            code: "MATCHDAYS_UPSTREAM_ERROR",
            message: `Upstream responded with status ${upstreamResponse.status}.`,
          },
        },
        { status: 502 },
    );
    }

    const upstreamJson =
      (await upstreamResponse.json()) as FootballDataCompetitionWithSeasons;

    if (debug) {
      return NextResponse.json(upstreamJson, { status: 200 });
    }

    const targetSeason = findSeasonForMatchdays(upstreamJson, seasonId);

    // Use currentMatchday as "max" for the selector.
    // - For finished seasons: == total matchdays.
    // - For running seasons: only expose up to the currently played round.
    const totalMatchdays = targetSeason?.currentMatchday ?? 38;

    const matchdays = buildMatchdayOptions(totalMatchdays);

    const responseBody: MatchdaysApiResponse = { matchdays };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET /api/standings/matchdays] Unexpected error", error);

    return NextResponse.json(
      {
        error: {
          code: "MATCHDAYS_UPSTREAM_UNAVAILABLE",
          message: "Unable to fetch matchday options at this time.",
        },
      },
      { status: 500 },
    );
  }
}
