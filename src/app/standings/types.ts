// =============================================================================
// TYPES: Standings
// -----------------------------------------------------------------------------
// Responsibility: Shared types for /standings mocks, table component, header
//                 filters, page view model (header + banner + table) and
//                 /api/standings response.
// Owner: Frontend Team • Last updated: 2025-11-26
// =============================================================================

export type StandingEntry = {
  /** 1-based position in the table. */
  position: number;
  teamId: string;
  /** Display name of the team, e.g. "Arsenal". */
  teamName: string;
  /** Optional team short name / code, e.g. "ARS". */
  teamCode?: string;
  /** Optional crest URL. */
  crestUrl?: string | null;

  played: number;
  won: number;
  drawn: number;
  lost: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;

  /** Last 5 results, e.g. ["W", "D", "L", "W", "W"]. */
  last5?: Array<"W" | "D" | "L">;
};

// For now, the table row is the same as a StandingEntry.
export type StandingsTableRow = StandingEntry;

// -----------------------------------------------------------------------------
// Header filters
// -----------------------------------------------------------------------------

/**
 * Generic option used by /standings header filters (league, season, matchday).
 */
export type StandingsFilterOption = {
  /** Stable value used in URLs / API calls (e.g. "premier-league"). */
  value: string;
  /** Human-readable label (e.g. "Premier League"). */
  label: string;
};

/**
 * Props contract for <StandingsHeaderFilters />.
 * Kept here so mocks, hooks and components share the same shape.
 */
export type StandingsHeaderFiltersProps = {
  // League
  leagueId: string;
  leagueOptions: StandingsFilterOption[];
  onLeagueChange?: (leagueId: string) => void;

  // Season (e.g. 2024/25)
  seasonId: string;
  seasonOptions: StandingsFilterOption[];
  onSeasonChange?: (seasonId: string) => void;

  // Matchday (e.g. "1", "2", "3")
  matchdayId: string;
  matchdayOptions: StandingsFilterOption[];
  onMatchdayChange?: (matchdayId: string) => void;
};

// -----------------------------------------------------------------------------
// Page state / view model
// -----------------------------------------------------------------------------

export type StandingsPageStatus = "loading" | "success" | "error";

/**
 * Meta needed for <StandingsLeagueBanner />.
 * Keeps it small and presentation-friendly.
 */
export type StandingsLeagueMeta = {
  leagueId: string;
  leagueName: string;
  countryName: string;
  countryCode: string;
  seasonLabel: string;
  currentMatchday: number | null;
  totalMatchdays: number | null;
  /** Fully formatted text, e.g. "Updated moments ago". */
  lastUpdatedLabel?: string;
  /** Optional "28 matches played" label for header. */
  matchesPlayedLabel?: string;
  /** Optional league crest URL for identity block. */
  crestUrl?: string | null;
};

/**
 * Shape returned by useStandingsPageState to /standings client shell.
 */
export type StandingsPageViewModel = {
  status: StandingsPageStatus;
  errorMessage?: string | null;

  // Filters
  leagueId: string;
  seasonId: string;
  matchdayId: string;
  leagueOptions: StandingsFilterOption[];
  seasonOptions: StandingsFilterOption[];
  matchdayOptions: StandingsFilterOption[];
  onLeagueChange: (leagueId: string) => void;
  onSeasonChange: (seasonId: string) => void;
  onMatchdayChange: (matchdayId: string) => void;

  // Header meta
  headerTitle: string;
  headerSeasonLabel?: string;
  headerMatchesPlayedLabel?: string;

  // Banner + table
  leagueMeta: StandingsLeagueMeta | null;
  rows: StandingsTableRow[];

  // Zones visibility (qualification & relegation stripes)
  shouldShowZones: boolean;
  latestCompletedMatchday: string;

  // NEW: summary label for the matchday filter (e.g. "Matchday 38 of 38").
  matchdaySummaryLabel?: string;
};

// -----------------------------------------------------------------------------
// API response shape for /api/standings
// -----------------------------------------------------------------------------

/**
 * Normalised payload returned by /api/standings. This is the only shape
 * that client code (hooks, components) should depend on, regardless of how
 * the upstream football-data.org response evolves.
 */
export type StandingsApiResponse = {
  leagueMeta: StandingsLeagueMeta;
  rows: StandingsTableRow[];
};
