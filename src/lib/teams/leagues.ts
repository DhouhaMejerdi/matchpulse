// =============================================================================
// MODULE: Leagues
// Responsibility: Centralized league metadata and options for /teams
// Contracts: Used by TeamsPageHeader (filters) and LeagueInfoBanner (context)
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import type { LeagueMeta, LeagueOption } from '@/app/teams/types';

// -----------------------------------------------------------------------------
// BASE OPTIONS (used by LeagueFilter and TeamsHeader)
// -----------------------------------------------------------------------------

export const LEAGUE_OPTIONS: LeagueOption[] = [
  {
    id: 'premier-league',
    name: 'Premier League',
    countryCode: 'GB',
    slug: 'england-premier-league',
    isDefault: true,
  },
  {
    id: 'laliga',
    name: 'La Liga',
    countryCode: 'ES',
    slug: 'spain-la-liga',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    countryCode: 'IT',
    slug: 'italy-serie-a',
  },
];

// Default fallback for when no league is selected.
export const DEFAULT_LEAGUE_ID =
  LEAGUE_OPTIONS.find((league) => league.isDefault)?.id ??
  LEAGUE_OPTIONS[0]?.id ??
  'premier-league';

// -----------------------------------------------------------------------------
// EXTENDED META (used by LeagueInfoBanner and future API layer)
// -----------------------------------------------------------------------------

export const LEAGUE_META: Record<string, LeagueMeta> = {
  'premier-league': {
    id: 'premier-league',
    name: 'Premier League',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    teamCount: 20,
    seasonLabel: '2025/26',
    tagline: 'Select a team to view fixtures, stats, and top players.',
  },
  laliga: {
    id: 'laliga',
    name: 'La Liga',
    countryCode: 'ES',
    countryName: 'Spain',
    teamCount: 20,
    seasonLabel: '2025/26',
  },
  'serie-a': {
    id: 'serie-a',
    name: 'Serie A',
    countryCode: 'IT',
    countryName: 'Italy',
    teamCount: 20,
    seasonLabel: '2025/26',
  },
};
