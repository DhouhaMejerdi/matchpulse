// =============================================================================
// MOCKS: Premier League teams
// Responsibility: Production-like mock data for /teams grid and stories
// Contracts: Matches TeamSummary type; used by /teams/page.tsx and Storybook
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

import { TeamSummary } from "@/app/teams/types";


export const PREMIER_LEAGUE_MOCK_TEAMS: TeamSummary[] = [
  {
    id: 'manchester-city',
    name: 'Manchester City',
    crestUrl: '/api/crest?team=manchester-city',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'W', 'D', 'L', 'W'],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    crestUrl: '/api/crest?team=arsenal',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'D', 'W', 'W', 'L'],
  },
];
