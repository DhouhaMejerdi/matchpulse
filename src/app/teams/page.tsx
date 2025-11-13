// =============================================================================
// PAGE: /teams
// -----------------------------------------------------------------------------
// Responsibility: Teams overview page (header + league banner + teams grid).
// Contracts: Uses `useTeamsPageState` for league/search/sort state + URL sync
//            and filtered teams list; uses `useLeagueOptions` for select data;
//            renders TeamsPageHeader, LeagueInfoBanner, and TeamsGrid.
// A11y: Lives inside <main id="main-content"> from RootLayout (no nested <main>);
//       loading section announces progress via aria-live; grid has its own
//       hidden <h2> inside TeamsGrid for correct H1→H2→H2 structure.
// Owner: Frontend Team • Last updated: 2025-11-13
// =============================================================================
"use client";

import * as React from "react";

// -- COMPONENTS ---------------------------------------------------------------
import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid from "./TeamsGrid";
import LeagueInfoBanner from "@/components/teams/LeagueInfoBanner";
import TeamsGridSkeleton from "@/components/teams/TeamsGridSkeleton";

// -- HOOKS --------------------------------------------------------------------
import { useTeamsPageState } from "./useTeamsPageState";
import { useLeagueOptions } from "./useLeagueOptions";

// -- RENDER -------------------------------------------------------------------
export default function TeamsPage(): React.ReactElement {
  // WHY: Single source of truth for view state; centralizes filtering + URL sync.
  const {
    status,
    leagueMeta,
    filteredTeams,
    selectedLeagueId,
    searchQuery,
    sortOrder,
    handleLeagueChange,
    handleSearchChange,
    handleSortChange,
  } = useTeamsPageState();

  const { options: leagueOptions } = useLeagueOptions();

  // WHY: Keep markup for each state minimal and semantic.
  let gridContent: React.ReactNode;
  if (status === "loading") {
    gridContent = (
      // A11Y: aria-busy + polite live region prevents focus jumps and informs SR.
      <section className="teams-grid container" aria-busy="true">
        <p className="teams-grid__status" aria-live="polite">
          🌀 Loading teams…
        </p>
        <TeamsGridSkeleton />
      </section>
    );
  } else {
    gridContent = (
      <TeamsGrid
        teams={filteredTeams}
        search={searchQuery}
        leagueName={leagueMeta?.name}
      />
    );
  }

  return (
    <>
      <TeamsPageHeader
        league={selectedLeagueId}
        onLeagueChange={handleLeagueChange}
        search={searchQuery}
        onSearchChange={handleSearchChange}
        sort={sortOrder}
        onSortChange={handleSortChange}
        leagueOptions={leagueOptions}
      />

      {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}

      {gridContent}
    </>
  );
}
