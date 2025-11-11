// =============================================================================
// COMPONENT: TeamsPageHeader
// Responsibility: /teams hero (title + filters bar: league, search, sort)
// Contracts: Controlled filters (league, search, sort); does not own data
//            fetching or teams grid state; delegates filter changes upwards
// A11y: Section labelled by h1; filters grouped via role="group" with label
// Owner: Frontend Team • Last updated: 2025-11-10
// =============================================================================

import React from "react";
import LeagueFilter from "./LeagueFilter";
import TeamsSearchField from "./TeamsSearchField";
import TeamsSortSelect from "./TeamsSortSelect";

// -- PROPS --------------------------------------------------------------------

export type TeamsPageHeaderProps = {
  league: string;
  onLeagueChange: (leagueId: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: "alpha-asc" | "alpha-desc";
  onSortChange: (value: "alpha-asc" | "alpha-desc") => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function TeamsPageHeader({
  league,
  onLeagueChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
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
        <TeamsSearchField value={search} onChange={onSearchChange} />
        <TeamsSortSelect value={sort} onChange={onSortChange} />
      </div>
    </section>
  );
}
