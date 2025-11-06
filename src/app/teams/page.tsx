// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + league banner + teams grid)
// Contracts: Holds selected league state; renders TeamsPageHeader, LeagueInfoBanner,
//            and TeamsGrid with mock data; uses LEAGUE_META for contextual banner
// A11y: Lives inside <main id="main-content"> from RootLayout (no nested <main>)
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================
"use client";

import React, { useState } from "react";
import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid from "./TeamsGrid";
import LeagueInfoBanner from "@/components/teams/LeagueInfoBanner";
import { PREMIER_LEAGUE_MOCK_TEAMS } from "@/components/teams/__mocks__/teams.mock";
import { DEFAULT_LEAGUE_ID, LEAGUE_META } from "@/lib/teams/leagues";

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function TeamsPage() {
  // -- STATE ------------------------------------------------------------------
  // NOTE: Single source of truth for currently selected league on /teams.
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(
    DEFAULT_LEAGUE_ID
  );

  const leagueMeta = LEAGUE_META[selectedLeagueId];

  // -- RENDER -----------------------------------------------------------------
  return (
    <>
      <TeamsPageHeader
        league={selectedLeagueId}
        onLeagueChange={setSelectedLeagueId}
      />

      {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}

      <TeamsGrid teams={PREMIER_LEAGUE_MOCK_TEAMS} />
    </>
  );
}
