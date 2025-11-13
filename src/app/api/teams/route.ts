// =============================================================================
// ROUTE: /api/teams
// Responsibility: Proxy football-data.org competition teams → TeamSummary[]
// Contracts: GET /api/teams?leagueId=premier-league|laliga|serie-a|all-leagues
//            Returns JSON { teams: TeamSummary[] }.
// Notes: Uses football-data.org v4 endpoints:
//   - GET /v4/competitions/{code}/teams
//   - GET /v4/teams/{id}/matches?status=FINISHED[&competitions=CODE]&limit=5
// Owner: Frontend Team • Last updated: 2025-11-12
// =============================================================================

import type { TeamSummary } from "@/app/teams/types";
import type { TeamFormEntry } from "@/app/teams/form";

// --- External API types (minimal shapes we use) ------------------------------

type FootballDataTeam = {
  id: number;
  name: string;
  shortName?: string;
  tla?: string | null;
  crest?: string | null;
  area?: {
    name?: string;
    code?: string | null;
  };
};

type CompetitionTeamsResponse = {
  count: number;
  competition?: {
    code: string;
    name: string;
  };
  teams: FootballDataTeam[];
};

type FootballDataMatch = {
  status: string;
  utcDate: string;
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
  score: {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    fullTime: { home: number | null; away: number | null };
  };
};

type TeamMatchesResponse = { matches: FootballDataMatch[] };

// --- League mapping -----------------------------------------------------------

const LEAGUE_ID_TO_COMPETITION_CODE: Record<string, string> = {
  "premier-league": "PL",
  laliga: "PD",
  "serie-a": "SA",
};

const COMPETITION_CODE_TO_LEAGUE_NAME: Record<string, string> = {
  PL: "Premier League",
  PD: "La Liga",
  SA: "Serie A",
};

// --- Helpers -----------------------------------------------------------------

/**
 * Fetch last N finished matches for a team, optionally scoped to a competition.
 * Converts them into TeamFormEntry[] (W/D/L with opponent + score).
 *
 * If competitionCode is an empty string, the `competitions` filter is omitted
 * (searches all competitions).
 */
async function fetchRecentFormForTeam(
  apiKey: string,
  teamId: number,
  competitionCode: string,
  limit = 5
): Promise<TeamFormEntry[]> {
  const url = new URL(`https://api.football-data.org/v4/teams/${teamId}/matches`);
  url.searchParams.set("status", "FINISHED");
  if (competitionCode) url.searchParams.set("competitions", competitionCode);
  url.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-Auth-Token": apiKey },
      // Optionally: revalidate/next cache if desired
    });

    if (!res.ok) {
      // Upstream error → return no form (UI can render neutral state)
      console.error("[fetchRecentFormForTeam] Upstream error", res.status, await res.text());
      return [];
    }

    const data = (await res.json()) as TeamMatchesResponse;
    const matches = data.matches ?? [];

    // inside fetchRecentFormForTeam, after const matches = data.matches ?? [];
    const ordered = [...matches].sort((a, b) =>
      new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
    );
    
    // Map newest → oldest, then slice 5
    return ordered.slice(0, limit).map((match) => {
      const isHome = match.homeTeam.id === teamId;
      const opponent = isHome ? match.awayTeam.name : match.homeTeam.name;
      const homeGoals = match.score.fullTime.home ?? 0;
      const awayGoals = match.score.fullTime.away ?? 0;

      let result: "W" | "D" | "L";
      if (match.score.winner === "DRAW" || match.score.winner === null) result = "D";
      else if (match.score.winner === "HOME_TEAM") result = isHome ? "W" : "L";
      else result = isHome ? "L" : "W";

      const score = isHome ? `${homeGoals}-${awayGoals}` : `${awayGoals}-${homeGoals}`;
      return { result, opponent, score };
    });

  } catch (err) {
    console.error("[fetchRecentFormForTeam] Exception", err);
    return [];
  }
}

// --- Handler -----------------------------------------------------------------

export async function GET(request: Request) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "FOOTBALL_DATA_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("leagueId") ?? "premier-league";

  // Resolve which competition codes to fetch
  let competitionCodes: string[];
  if (leagueId === "all-leagues") {
    competitionCodes = Object.values(LEAGUE_ID_TO_COMPETITION_CODE);
  } else {
    const code = LEAGUE_ID_TO_COMPETITION_CODE[leagueId];
    if (!code) {
      // Unknown league ID → safe empty payload
      return new Response(JSON.stringify({ teams: [] }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      });
    }
    competitionCodes = [code];
  }

  try {
    const allTeams: TeamSummary[] = [];

    // Fetch competitions one by one (safer for rate limits)
    for (const code of competitionCodes) {
      const url = `https://api.football-data.org/v4/competitions/${code}/teams`;

      const res = await fetch(url, {
        headers: { "X-Auth-Token": apiKey },
      });

      if (!res.ok) {
        console.error("[/api/teams] competitions error", res.status, await res.text());
        continue; // skip this competition gracefully
      }

      const data = (await res.json()) as CompetitionTeamsResponse;

      const leagueName =
        data.competition?.name ?? COMPETITION_CODE_TO_LEAGUE_NAME[code] ?? "League";

      // Map each team → TeamSummary (with crest + real recent form)
      for (const team of data.teams) {
        const slug = team.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const crestFromApi = team.crest ?? undefined;
        const crestUrl =
          crestFromApi && crestFromApi.length > 0
            ? crestFromApi
            : `/api/crest?team=${slug}`;

        // Fetch last 5 finished matches in this competition
        let form = await fetchRecentFormForTeam(apiKey, team.id, code, 5);

        // Fallback: widen search if no data (omit competitions filter)
        if (form.length === 0) {
          form = await fetchRecentFormForTeam(apiKey, team.id, "", 5);
        }

        allTeams.push({
          id: String(team.id),
          name: team.name,
          country: team.area?.name ?? "Unknown",
          leagueName,
          crestUrl,
          form,
        });

        // (Optional) gentle delay to be kind to upstream (tweak/remove as needed)
        // await new Promise((r) => setTimeout(r, 75));
      }
    }

    return new Response(JSON.stringify({ teams: allTeams }), {
      headers: {
        "Content-Type": "application/json",
        // Small edge cache to reduce bursts; tune per needs
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching teams from football-data.org", error);
    return Response.json(
      { error: "Failed to fetch teams from upstream API" },
      { status: 500 }
    );
  }
}
