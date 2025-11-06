// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + teams grid)
// Contracts: Renders TeamsPageHeader; teams grid will be added in v1.0
// A11y: Lives inside <main id="main-content"> from RootLayout
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

import React from "react";
import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid from "./TeamsGrid";
import { PREMIER_LEAGUE_MOCK_TEAMS } from "@/components/teams/__mocks__/teams.mock";


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
