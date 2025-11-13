// =============================================================================
// COMPONENT: LeagueFilter
// Responsibility: Dropdown control for selecting the current league on /teams
// Contracts: Controlled via value + onChange; options provided by parent
// A11y: Uses <select> with associated (sr-only) label; focus via CSS
// Owner: Frontend Team • Last updated: 2025-11-11
// =============================================================================

import React from "react";
import type { LeagueOption } from "@/app/teams/types";

// -- PROPS --------------------------------------------------------------------

export type LeagueFilterProps = {
  value: string;
  onChange: (leagueId: string) => void;
  options: LeagueOption[];
  // NEW:
  isActive?: boolean;
  onFocus?: () => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function LeagueFilter({
  value,
  onChange,
  options,
  isActive = false,
  onFocus,
}: LeagueFilterProps) {
  return (
    <div
      className={
        "teams-filter teams-filter--league" +
        (isActive ? " teams-filter--active" : "")
      }
    >
      <label htmlFor="league-select" className="sr-only">
        Select league
      </label>

      <div className="teams-filter__field">
        {/* Overlay div for the animated border beam */}
        <div className="teams-filter__beam" aria-hidden="true" />

        <span className="teams-filter__icon" aria-hidden="true">
          🏆
        </span>

        <select
          id="league-select"
          aria-label="League"
          name="league"
          className="teams-filter__control teams-filter__control--select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
        >
          {options.map((league) => (
            <option
              key={league.id}
              value={league.id}
              className="teams-filter__option teams-filter__option--primary"
            >
              {league.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

