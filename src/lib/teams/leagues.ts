// =============================================================================
// MODULE: LeagueOptions
// Responsibility: Centralised league metadata for /teams (API stand-in)
// Contracts: Used by LeagueFilter and future /teams data fetching layer
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

export type LeagueOption = {
  id: string;          // stable ID, e.g. "premier-league"
  name: string;        // display name, e.g. "Premier League"
  countryCode: string; // ISO-like code, e.g. "GB"
  slug: string;        // URL / API slug, e.g. "england-premier-league"
  isDefault?: boolean;
};

export const LEAGUE_OPTIONS: LeagueOption[] = [
  {
    id: "premier-league",
    name: "Premier League",
    countryCode: "GB",
    slug: "england-premier-league",
    isDefault: true,
  },
  {
    id: "laliga",
    name: "La Liga",
    countryCode: "ES",
    slug: "spain-la-liga",
  },
  {
    id: "serie-a",
    name: "Serie A",
    countryCode: "IT",
    slug: "italy-serie-a",
  },
];

export const DEFAULT_LEAGUE_ID =
  LEAGUE_OPTIONS.find((league) => league.isDefault)?.id ??
  LEAGUE_OPTIONS[0]?.id ??
  "premier-league";
