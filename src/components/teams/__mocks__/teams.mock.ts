// =============================================================================
// MOCKS: /teams
// Responsibility: Production-like mock data for /teams grid and stories
// Contracts: Matches TeamSummary type; used by /teams/page.tsx and Storybook
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import type { TeamSummary } from "@/app/teams/types";

// -----------------------------------------------------------------------------
// PREMIER LEAGUE
// -----------------------------------------------------------------------------

export const PREMIER_LEAGUE_MOCK_TEAMS: TeamSummary[] = [
  {
    id: "manchester-city",
    name: "Manchester City",
    crestUrl: "/api/crest?team=manchester-city",
    country: "England",
    leagueName: "Premier League",
    form: ["W", "W", "D", "L", "W"],
  },
  {
    id: "arsenal",
    name: "Arsenal",
    crestUrl: "/api/crest?team=arsenal",
    country: "England",
    leagueName: "Premier League",
    form: ["W", "D", "W", "W", "L"],
  },
];

// -----------------------------------------------------------------------------
// LA LIGA
// -----------------------------------------------------------------------------

export const LA_LIGA_MOCK_TEAMS: TeamSummary[] = [
  {
    id: "fc-barcelona",
    name: "FC Barcelona",
    crestUrl: "/api/crest?team=fc-barcelona",
    country: "Spain",
    leagueName: "La Liga",
    form: ["W", "W", "W", "D", "W"],
  },
  {
    id: "real-madrid",
    name: "Real Madrid",
    crestUrl: "/api/crest?team=real-madrid",
    country: "Spain",
    leagueName: "La Liga",
    form: ["W", "D", "W", "W", "W"],
  },
];

// -----------------------------------------------------------------------------
// SERIE A
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// ALL LEAGUES (CONVENIENCE AGGREGATE)
// -----------------------------------------------------------------------------

export const ALL_LEAGUES_MOCK_TEAMS: TeamSummary[] = [
  ...PREMIER_LEAGUE_MOCK_TEAMS,
  ...LA_LIGA_MOCK_TEAMS,

];
