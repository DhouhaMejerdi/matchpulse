// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + league banner + teams grid)
// Contracts: Renders TeamsPageHeader, LeagueInfoBanner, TeamsGrid with mock data
// A11y: Lives inside <main id="main-content"> from RootLayout
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import React from 'react';
import TeamsPageHeader from './TeamsPageHeader';
import TeamsGrid from './TeamsGrid';
import LeagueInfoBanner from '@/components/teams/LeagueInfoBanner';
import { PREMIER_LEAGUE_MOCK_TEAMS } from '@/components/teams/__mocks__/teams.mock';
import { DEFAULT_LEAGUE_ID, LEAGUE_META } from '@/lib/teams/leagues';

export default function TeamsPage() {
  const selectedLeagueId = DEFAULT_LEAGUE_ID;
  const leagueMeta = LEAGUE_META[selectedLeagueId];

  return (
    <>
      <TeamsPageHeader />

      {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}

      <TeamsGrid teams={PREMIER_LEAGUE_MOCK_TEAMS} />
    </>
  );
}
