// =============================================================================
// COMPONENT: TeamsPageHeader
// Responsibility: /teams hero (title + filters bar: league, search, sort)
// Contracts: Controlled filters (league, search, sort, leagueOptions);
//            does not own data fetching; receives options from parent.
// A11y: Section labelled by h1; filters grouped via role="group" with label
// Owner: Frontend Team • Last updated: 2025-11-11
// =============================================================================

import React from "react";
import type { LeagueOption } from "./types";

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
  leagueOptions: LeagueOption[];
};

// -- COMPONENT ----------------------------------------------------------------

export default function TeamsPageHeader({
  league,
  onLeagueChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  leagueOptions,
}: TeamsPageHeaderProps) {
  const [activeFilter, setActiveFilter] = React.useState<
    "league" | "search" | "sort"
  >("league"); // 👈 default highlight on LeagueFilter
  
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
        <LeagueFilter
          value={league}
          onChange={onLeagueChange}
          options={leagueOptions}
          isActive={activeFilter === "league"}
          onFocus={() => setActiveFilter("league")}
        />
        <TeamsSearchField 
          value={search} 
          onChange={onSearchChange} 
          isActive={activeFilter === "search"}
          onFocus={() => setActiveFilter("search")}
        />
        <TeamsSortSelect 
          value={sort} 
          onChange={onSortChange} 
          isActive={activeFilter === "sort"}
          onFocus={() => setActiveFilter("sort")}
        />
      </div>
    </section>
  );
}
