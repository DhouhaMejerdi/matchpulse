// =============================================================================
// COMPONENT: StandingsPageClient
// -----------------------------------------------------------------------------
// Responsibility: Client-side composition root for /standings. Wires together
//                 the page header, header filters, league banner, zones legend
//                 and standings table using the useStandingsPageState view
//                 model.
// Contracts: Reads the /standings page view model from useStandingsPageState()
//            and passes slices down to presentational components:
//            - <StandingsPageHeader> for the page-level title ("Standings")
//            - <StandingsHeaderFilters> as children of the header (filters)
//            - <StandingsLeagueBanner> for league identity + season/matchday
//            - <StandingsZonesLegend> for qualification/relegation hint
//            - <StandingsTable> for the normalised standings rows
// A11y: Rendered inside <main id="main-content"> by the route-level Server
//       Component (/standings/page.tsx). Exposes a top-level h1 ("Standings")
//       via StandingsPageHeader, groups filter controls in a labelled
//       role="group", and wraps the table in a <section> with an sr-only h2
//       ("League table") for screen readers.
// Owner: Frontend Team • Last updated: 2025-12-02
// =============================================================================

"use client";

import * as React from "react";
import StandingsPageHeader from "./StandingsPageHeader";
import StandingsTable from "./StandingsTable";
import StandingsLeagueBanner from "./StandingsLeagueBanner";
import StandingsHeaderFilters from "./StandingsHeaderFilters";
import { useStandingsPageState } from "./useStandingsPageState";
import StandingsZonesLegend from "./StandingsZonesLegend";

// -- COMPONENT ----------------------------------------------------------------

/**
 * Client-side shell for the /standings route.
 *
 * In v1 this component:
 * - Initializes the /standings view model via useStandingsPageState()
 *   (league/season/matchday filters, league meta and standings data).
 * - Renders the page header with a single page-level title ("Standings").
 * - Injects <StandingsHeaderFilters /> into the header `children` slot so the
 *   header owns layout and the filters own the interactive controls.
 * - Binds <StandingsLeagueBanner /> to vm.leagueMeta and vm.status so the
 *   banner reflects the selected league, season and matchday.
 * - Shows <StandingsZonesLegend /> when vm.shouldShowZones is true.
 * - Renders <StandingsTable /> with vm.rows and status/error states.
 *
 * NOTE: The <main id="main-content"> landmark lives in /standings/page.tsx so
 * this component stays focused on client-side composition only.
 */
export default function StandingsPageClient(): React.ReactElement {
  // View model encapsulating filters, URL sync and standings data.
  const vm = useStandingsPageState();

  return (
    <>
      {/* 1) Page header + filter controls
          - Header exposes the page-level h1 ("Standings") only.
          - Filters are rendered as children and grouped via role="group"
            inside StandingsPageHeader for accessible layout. */}
      <StandingsPageHeader title={vm.headerTitle}>
        <StandingsHeaderFilters
          leagueId={vm.leagueId}
          leagueOptions={vm.leagueOptions}
          onLeagueChange={vm.onLeagueChange}
          seasonId={vm.seasonId}
          seasonOptions={vm.seasonOptions}
          onSeasonChange={vm.onSeasonChange}
          matchdayId={vm.matchdayId}
          matchdayOptions={vm.matchdayOptions}
          onMatchdayChange={vm.onMatchdayChange}
        />
      </StandingsPageHeader>

      {/* 2) League meta / banner
          - Reflects the selected league, season and matchday via vm.leagueMeta.
          - Uses vm.status to show a skeleton while standings are loading. */}
      <StandingsLeagueBanner
        meta={vm.leagueMeta}
        isLoading={vm.status === "loading"}
      />

      {/* 3) Zones legend (conditionally visible based on matchday logic)
          - Visibility controlled by vm.shouldShowZones (latest completed
            matchday only). */}
      {vm.shouldShowZones && <StandingsZonesLegend />}

      {/* 4) Standings table
          - Binds to vm.rows (normalised standings rows).
          - Uses vm.status + vm.errorMessage for loading/error/empty states.
          - Section is labelled via a sr-only <h2> for screen readers. */}
      <section
        className="standings-table container"
        aria-labelledby="standings-table-heading"
      >
        <h2 id="standings-table-heading" className="sr-only">
          League table
        </h2>

        <StandingsTable
          rows={vm.rows}
          status={vm.status}
          errorMessage={vm.errorMessage}
          showZones={vm.shouldShowZones}
        />
      </section>
    </>
  );
}
