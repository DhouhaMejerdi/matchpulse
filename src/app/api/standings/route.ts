// =============================================================================
// ROUTE: /api/standings
// -----------------------------------------------------------------------------
// Responsibility: Proxy football-data.org standings → Match Pulse internal
//                 standings model (leagueMeta + rows).
// Contracts: Accepts query params
//            - leagueId  (internal slug, e.g. "premier-league")
//            - seasonId  (UI season id, e.g. "2024-25")
//            - matchday  (string matchday index, e.g. "1", "2")
//            Returns JSON: { leagueMeta, rows } where shapes are defined in
//            src/app/standings/types.ts.
// Notes: Server-only. Reads API key from FOOTBALL_DATA_API_KEY env var and
//        calls /v4/competitions/{code}/standings with appropriate filters.
// Owner: Frontend Team • Last updated: 2025-11-26
// =============================================================================

import { NextResponse } from "next/server";

import type {
  StandingsApiResponse,
  StandingsLeagueMeta,
  StandingsTableRow,
} from "@/app/standings/types";

// -----------------------------------------------------------------------------
// Upstream types (subset of football-data.org standings response)
// -----------------------------------------------------------------------------

type FootballDataTeam = {
  id: number;
  name: string;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
};

type FootballDataStandingRow = {
  position: number;
  team: FootballDataTeam;
  playedGames: number;
  form?: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

type FootballDataStandingsBlock = {
  stage: string;
  type: string; // "TOTAL" | "HOME" | "AWAY"
  group: string | null;
  table: FootballDataStandingRow[];
};

type FootballDataStandingsResponse = {
  filters: {
    season?: string;
    matchday?: string;
  };
  area: {
    id: number;
    name: string;
    code: string | null;
    flag?: string | null;
  };
  competition: {
    id: number;
    name: string;
    code: string | null;
    type: string;
    emblem?: string | null;
  };
  season: {
    id: number;
    startDate: string; // "YYYY-MM-DD"
    endDate: string; // "YYYY-MM-DD"
    currentMatchday: number | null;
    winner?: unknown;
  };
  standings: FootballDataStandingsBlock[];
};

// -----------------------------------------------------------------------------
// Config: supported leagues + mapping to football-data competition codes
// -----------------------------------------------------------------------------

const LEAGUE_TO_COMPETITION_CODE: Record<string, string> = {
  "premier-league": "PL",
  "la-liga": "PD",
  "bundesliga": "BL1",
  "serie-a": "SA",
  "ligue-1": "FL1",
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function mapSeasonIdToYear(seasonId: string | null): number | null {
  if (!seasonId) return null;
  const year = Number.parseInt(seasonId.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

function mapMatchday(matchdayParam: string | null): number | null {
  if (!matchdayParam) return null;
  const value = Number.parseInt(matchdayParam, 10);
  return Number.isNaN(value) ? null : value;
}

function buildSeasonLabel(startDate: string, endDate: string): string {
  const startYear = startDate.slice(0, 4);
  const endYearShort = endDate.slice(2, 4);
  return `${startYear}/${endYearShort}`;
}

function buildMatchesPlayedLabel(
  rows: FootballDataStandingRow[],
): string | undefined {
  if (!rows.length) return undefined;
  const maxPlayed = rows.reduce(
    (max, row) => (row.playedGames > max ? row.playedGames : max),
    0,
  );
  return maxPlayed > 0 ? `${maxPlayed} matches played` : undefined;
}

function parseForm(
  form: string | null | undefined,
): Array<"W" | "D" | "L"> | undefined {
  if (!form) return undefined;

  const tokens = form.split(",").map((token) => token.trim() as "W" | "D" | "L");
  const validTokens = tokens.filter(
    (token) => token === "W" || token === "D" || token === "L",
  );

  return validTokens.length ? validTokens : undefined;
}

function mapLeagueMeta(
  leagueId: string,
  payload: FootballDataStandingsResponse,
  rows: FootballDataStandingRow[],
  requestedMatchday: number | null,
): StandingsLeagueMeta {
  const { area, competition, season } = payload;

  const seasonLabel = buildSeasonLabel(season.startDate, season.endDate);

  // Requested snapshot matchday (from query) is what we display as "current".
  const currentMatchday = requestedMatchday ?? season.currentMatchday ?? null;

  // football-data doesn't expose total matchdays directly; currentMatchday often
  // equals the last played matchday. For PL this is typically 38, which is also
  // the total. We use it as a best-effort approximation.
  const totalMatchdays = season.currentMatchday ?? null;

  return {
    leagueId,
    leagueName: competition.name,
    countryName: area.name,
    countryCode: area.code ?? "",
    seasonLabel,
    currentMatchday,
    totalMatchdays,
    matchesPlayedLabel: buildMatchesPlayedLabel(rows),
    lastUpdatedLabel: undefined,
    crestUrl: competition.emblem ?? null,
  };
}

function mapRowsToStandingsTable(
  rows: FootballDataStandingRow[],
): StandingsTableRow[] {
  return rows.map((row): StandingsTableRow => {
    const team = row.team;

    return {
      position: row.position,
      teamId: String(team.id),
      teamName: team.name,
      teamCode: team.tla ?? team.shortName ?? undefined,
      crestUrl: team.crest ?? null,
      played: row.playedGames,
      won: row.won,
      drawn: row.draw,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
      last5: parseForm(row.form),
    };
  });
}

// -----------------------------------------------------------------------------
// GET handler
// -----------------------------------------------------------------------------

export async function GET(request: Request) {
  const url = new URL(request.url);

  const leagueId = url.searchParams.get("leagueId") ?? "premier-league";
  const seasonId = url.searchParams.get("seasonId");
  const matchdayParam = url.searchParams.get("matchday"); // <— matches hook

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          "FOOTBALL_DATA_API_KEY is not configured on the server. Please add it to your environment.",
      },
      { status: 500 },
    );
  }

  const competitionCode = LEAGUE_TO_COMPETITION_CODE[leagueId];
  if (!competitionCode) {
    return NextResponse.json(
      {
        message: `Unsupported leagueId "${leagueId}".`,
      },
      { status: 400 },
    );
  }

  const seasonYear = mapSeasonIdToYear(seasonId);
  const requestedMatchday = mapMatchday(matchdayParam);

  const searchParams = new URLSearchParams();
  if (seasonYear !== null) {
    searchParams.set("season", String(seasonYear));
  }
  if (requestedMatchday !== null) {
    searchParams.set("matchday", String(requestedMatchday));
  }

  const upstreamUrl = new URL(
    `https://api.football-data.org/v4/competitions/${competitionCode}/standings`,
  );
  if ([...searchParams.keys()].length > 0) {
    upstreamUrl.search = searchParams.toString();
  }

  try {
    const response = await fetch(upstreamUrl.toString(), {
      headers: {
        "X-Auth-Token": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);

      const status = response.status === 429 ? 429 : 502;

      return NextResponse.json(
        {
          message: "Failed to fetch standings from upstream provider.",
          statusCode: response.status,
          upstreamBody: errorText,
        },
        { status },
      );
    }

    const json = (await response.json()) as FootballDataStandingsResponse;

    const totalBlock =
      json.standings.find((block) => block.type === "TOTAL") ??
      json.standings[0];

    const tableRows = totalBlock?.table ?? [];

    const leagueMeta = mapLeagueMeta(
      leagueId,
      json,
      tableRows,
      requestedMatchday,
    );
    const rows = mapRowsToStandingsTable(tableRows);

    const payload: StandingsApiResponse = {
      leagueMeta,
      rows,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unexpected error while fetching standings.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
