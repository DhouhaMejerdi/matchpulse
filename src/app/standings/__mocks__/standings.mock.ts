// =============================================================================
// MOCK: Premier League standings (MVP)
// Responsibility: Provide static data for /standings UI before API integration.
// NOTE: Replace with real /api/standings in a future phase.
// =============================================================================

import type { StandingEntry } from "../types";

export const premierLeagueStandings: StandingEntry[] = [
  {
    position: 1,
    teamId: "mci",
    teamName: "Manchester City",
    teamCode: "MCI",
    crestUrl: "https://crests.football-data.org/65.png",
    played: 28,
    won: 21,
    drawn: 4,
    lost: 3,
    goalsFor: 71,
    goalsAgainst: 27,
    goalDifference: 44,
    points: 67,
    last5: ["W", "W", "D", "W", "W"],
  },
  {
    position: 2,
    teamId: "ars",
    teamName: "Arsenal",
    teamCode: "ARS",
    crestUrl: "https://crests.football-data.org/57.png",
    played: 28,
    won: 20,
    drawn: 5,
    lost: 3,
    goalsFor: 70,
    goalsAgainst: 29,
    goalDifference: 41,
    points: 65,
    last5: ["W", "W", "W", "D", "W"],
  },
  {
    position: 3,
    teamId: "liv",
    teamName: "Liverpool",
    teamCode: "LIV",
    crestUrl: "https://crests.football-data.org/64.png",
    played: 28,
    won: 19,
    drawn: 6,
    lost: 3,
    goalsFor: 68,
    goalsAgainst: 32,
    goalDifference: 36,
    points: 63,
    last5: ["D", "W", "W", "L", "W"],
  },
  // TODO: add remaining teams as needed
];
