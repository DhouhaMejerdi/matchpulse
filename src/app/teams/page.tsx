// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + teams grid)
// Contracts: Renders TeamsPageHeader; teams grid will be added in v1.0
// A11y: Lives inside <main id="main-content"> from RootLayout
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

import React from "react";
import TeamsPageHeader from "./TeamsPageHeader";

export default function TeamsPage() {
  return (
    <>
      <TeamsPageHeader />
      {/* TODO[teams-grid/2025-11-04]: Render TeamsGrid with TeamCard items. */}
    </>
  );
}
