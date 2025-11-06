// =============================================================================
// COMPONENT: TeamsPageHeader
// Responsibility: /teams hero (title + filters bar: league, search, sort)
// Contracts: Controlled league props (league, onLeagueChange); does not own
//            data fetching or teams grid state
// A11y: Section labelled by h1; filters grouped via role="group" with label
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import React from "react";
import LeagueFilter from "./LeagueFilter";
import TeamsSearchField from "./TeamsSearchField";
import TeamsSortSelect from "./TeamsSortSelect";

// -- PROPS --------------------------------------------------------------------

export type TeamsPageHeaderProps = {
  league: string;
  onLeagueChange: (leagueId: string) => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function TeamsPageHeader({
  league,
  onLeagueChange,
}: TeamsPageHeaderProps) {
  return (
    <section
      className="teams-header container"
      aria-labelledby="teams-header-title"
    >
      <div className="teams-header__top">
        <h1 id="teams-header-title" className="teams-header__title">
          Teams
        </h1>

        <p className="teams-header__subtitle">
          Browse all clubs in the league and jump into their fixtures, stats,
          and top players.
        </p>
      </div>

      {/* -- CONTROLS BAR ------------------------------------------------------ */}
      <div
        className="teams-header__controls"
        role="group"
        aria-label="Team filters"
      >
        <LeagueFilter value={league} onChange={onLeagueChange} />
        <TeamsSearchField />
        <TeamsSortSelect />
      </div>
    </section>
  );
}
