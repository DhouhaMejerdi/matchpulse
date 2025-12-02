// src/app/standings/leagueMappings.ts

export type SupportedLeagueId =
  | "premier-league"
  | "la-liga"
  | "serie-a";

export const LEAGUE_ID_TO_CODE: Record<SupportedLeagueId, string> = {
  "premier-league": "PL",
  "la-liga": "PD",
  "serie-a": "SA",
};
