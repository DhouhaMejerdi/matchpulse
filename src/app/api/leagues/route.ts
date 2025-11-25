// =============================================================================
// ROUTE: /api/leagues
// Responsibility: Proxy football-data.org competitions → LeagueOption[]
// Contracts: Returns JSON { leagues: LeagueOption[] } where LeagueOption
//            matches /teams types (id, name, countryCode, slug).
// Notes: Server-only; reads API key from FOOTBALL_DATA_API_KEY env var and
//        calls /v4/competitions?plan=TIER_ONE.
// Owner: Frontend Team • Last updated: 2025-11-11
// =============================================================================

import type { LeagueOption } from "@/app/teams/types";

// Minimal shape from football-data.org /v4/competitions
type FootballDataCompetition = {
  id: number;
  name: string;
  code: string | null;
  type: string; // "LEAGUE" | "CUP"
  plan: string; // "TIER_ONE", ...
  emblem?: string | null; // NEW: league crest URL from API
  area: {
    name: string;
    code: string | null;
  };
};

type FootballDataCompetitionList = {
  count: number;
  competitions: FootballDataCompetition[];
};

// Only expose competitions we fully support in /teams v1.0
const SUPPORTED_CODES = new Set(["PL", "PD", "SA"]);

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "FOOTBALL_DATA_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const url = "https://api.football-data.org/v4/competitions?plan=TIER_ONE";

  try {
    const res = await fetch(url, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return Response.json(
        {
          error: "Upstream football-data.org error",
          status: res.status,
          body: errorBody,
        },
        { status: 502 }
      );
    }

    const data = (await res.json()) as FootballDataCompetitionList;

    // Map external competitions → your internal LeagueOption[]
    const leagues: LeagueOption[] = data.competitions
      .filter(
        (competition) =>
          competition.type === "LEAGUE" &&
          competition.code !== null &&
          SUPPORTED_CODES.has(competition.code)
      )
      .map((competition) => {
        const rawCountryCode = competition.area.code ?? "XX";
        const code = competition.code!;

        // Map football-data codes → your internal IDs used in LEAGUE_META
        let internalId: string;
        switch (code) {
          case "PL":
            internalId = "premier-league";
            break;
          case "PD":
            internalId = "laliga";
            break;
          case "SA":
            internalId = "serie-a";
            break;
          default:
            internalId = code.toLowerCase();
            break;
        }

        // Display name: you can tweak marketing names if you want later
        let displayName = competition.name;
        if (code === "PD") {
          // Show "La Liga" instead of "Primera Division"
          displayName = "La Liga";
        }

        // Simple slug: "England-Premier League" → "england-premier-league"
        const slugBase = `${competition.area.name}-${displayName}`;
        const slug = slugBase
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const crestUrl = competition.emblem ?? null; // NEW
        return {
          id: internalId,    // matches LEAGUE_META keys
          name: displayName, // "Premier League", "La Liga", "Serie A"
          countryCode: rawCountryCode,
          slug,
          crestUrl, // NEW
        };
      });

    return Response.json({ leagues });
  } catch (error) {
    console.error("Error fetching leagues from football-data.org", error);
    return Response.json(
      { error: "Failed to fetch leagues from upstream API" },
      { status: 500 }
    );
  }
}
