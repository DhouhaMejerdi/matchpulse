// =============================================================================
// COMPONENT: LeagueFilter
// Responsibility: Dropdown control for selecting the current league on /teams
// Contracts: Controlled via value + onChange; options sourced from LEAGUE_OPTIONS
// A11y: Uses <select> with associated (sr-only) label; focus via CSS
// Owner: Frontend Team • Last updated: 2025-11-10
// =============================================================================

import React from "react";
import { LEAGUE_OPTIONS } from "@/lib/teams/leagues";

// -- PROPS --------------------------------------------------------------------

export type LeagueFilterProps = {
  value: string;
  onChange: (leagueId: string) => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function LeagueFilter({ value, onChange }: LeagueFilterProps) {
  return (
    <div className="teams-filter teams-filter--league">
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
        >
          {LEAGUE_OPTIONS.map((league) => (
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
