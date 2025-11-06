// =============================================================================
// MODULE: Teams Types
// Responsibility: Shared types for /teams page, grid, and league banner
// the single source of truth for /teams types.
// Consumers: TeamsGrid, LeagueInfoBanner, /teams page, mocks
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import type { TeamFormEntry } from './form';

export type TeamSummary = {
  id: string;
  name: string;
  crestUrl: string;
  country: string;
  leagueName: string;
  form: TeamFormEntry[];
};

// League meta used by the /teams page and LeagueInfoBanner
export type LeagueMeta = {
  id: string;          // "premier-league"
  name: string;        // "Premier League"
  countryCode: string; // "GB"
  countryName: string; // "United Kingdom"
  teamCount: number;   // 20
  seasonLabel: string; // "2025/26"
  tagline?: string;    // Optional custom tagline for banner
};

// League option used by filters and league selection UI
export type LeagueOption = {
  id: string;          // Stable internal ID, e.g. "premier-league"
  name: string;        // Display name, e.g. "Premier League"
  countryCode: string; // ISO-like country code
  slug: string;        // URL / API slug, e.g. "england-premier-league"
  isDefault?: boolean;
};

