// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + teams grid)
// Contracts: Renders TeamsPageHeader; teams grid will be added in v1.0
// A11y: Lives inside <main id="main-content"> from RootLayout
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

import React from "react";
import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid, { TeamSummary } from "./TeamsGrid";

const PREMIER_LEAGUE_MOCK_TEAMS: TeamSummary[] = [
  {
    id: 'manchester-city',
    name: 'Manchester City',
    crestUrl: '/images/crests/man-city.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'W', 'D', 'L', 'W'],
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    crestUrl: '/images/crests/arsenal.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'D', 'W', 'W', 'L'],
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    crestUrl: '/images/crests/liverpool.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['D', 'W', 'W', 'L', 'W'],
  },
  {
    id: 'tottenham-hotspur',
    name: 'Tottenham Hotspur',
    crestUrl: '/images/crests/tottenham.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['L', 'W', 'D', 'W', 'W'],
  },
  {
    id: 'aston-villa',
    name: 'Aston Villa',
    crestUrl: '/images/crests/aston-villa.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'L', 'W', 'W', 'D'],
  },
  {
    id: 'newcastle-united',
    name: 'Newcastle United',
    crestUrl: '/images/crests/newcastle.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['L', 'D', 'W', 'W', 'L'],
  },
  {
    id: 'chelsea',
    name: 'Chelsea',
    crestUrl: '/images/crests/chelsea.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['W', 'W', 'L', 'D', 'W'],
  },
  {
    id: 'manchester-united',
    name: 'Manchester United',
    crestUrl: '/images/crests/man-united.png',
    country: 'England',
    leagueName: 'Premier League',
    form: ['L', 'W', 'W', 'D', 'L'],
  },
];

export default function TeamsPage() {
  return (
    <>
      <TeamsPageHeader />
      <main className="page">
        <TeamsGrid teams={PREMIER_LEAGUE_MOCK_TEAMS} />
      </main>
    </>
  );
}
