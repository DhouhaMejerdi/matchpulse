// =============================================================================
// MOCKS: Premier League teams
// Responsibility: Production-like mock data for /teams grid and stories
// Contracts: Matches TeamSummary type; used by /teams/page.tsx and Storybook
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

import type { TeamSummary } from '@/app/teams/TeamsGrid';

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
  {
    id: 'liverpool',
    name: 'Liverpool',
    crestUrl: '/api/crest?team=liverpool',
    country: 'England',
    leagueName: 'Premier League',
    form: ['D', 'W', 'W', 'L', 'W'],
  },
  {
    id: 'tottenham-hotspur',
    name: 'Tottenham Hotspur',
    crestUrl: '/api/crest?team=tottenham-hotspur',
    country: 'England',
    leagueName: 'Premier League',
    form: ['L', 'W', 'D', 'W', 'W'],
  },
  {
    id: 'aston-villa',
    name: 'Aston Villa',
    crestUrl: '/api/crest?team=aston-villa',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'L', 'W', 'W', 'D'],
  },
  {
    id: 'newcastle-united',
    name: 'Newcastle United',
    crestUrl: '/api/crest?team=newcastle-united',
    country: 'England',
    leagueName: 'Premier League',
    form: ['L', 'D', 'W', 'W', 'L'],
  },
  {
    id: 'chelsea',
    name: 'Chelsea',
    crestUrl: '/api/crest?team=chelsea',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'W', 'L', 'D', 'W'],
  },
  {
    id: 'manchester-united',
    name: 'Manchester United',
    crestUrl: '/api/crest?team=manchester-united',
    country: 'England',
    leagueName: 'Premier League',
    form: ['L', 'W', 'W', 'D', 'L'],
  },
];
