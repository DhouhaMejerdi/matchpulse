// =============================================================================
// COMPONENT: TeamsPageHeader
// Responsibility: Page hero for /teams (title + future filters bar)
// Contracts: No props (v1.0); rendered at top of /teams main content
// A11y: Section labelled by h1; wrapped in .container to prevent CLS
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

import React from "react";
import LeagueFilter from "./LeagueFilter";
import TeamsSearchField from "./TeamsSearchField";
import TeamsSortSelect from "./TeamsSortSelect";

type TeamsPageHeaderProps = {
  league: string;
  onLeagueChange: (value: string) => void;
};

export default function TeamsPageHeader({ league, onLeagueChange }: TeamsPageHeaderProps) {
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

      <div
        className="teams-header__controls"
        role="group"
        aria-label="Team filters"
      >
        <LeagueFilter value={league} onChange={onLeagueChange}/>
        <TeamsSearchField />
        <TeamsSortSelect />
      </div>
    </section>
  );
}
