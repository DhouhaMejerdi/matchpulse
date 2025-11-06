// =============================================================================
// COMPONENT: LeagueFilter
// Responsibility: Dropdown control for selecting the current league
// Contracts: Options sourced from central LeagueOptions module (API stand-in)
// A11y: Uses <select> with associated label; focus state handled via CSS
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

import React from "react";
import {
  LEAGUE_OPTIONS,
  DEFAULT_LEAGUE_ID,
} from "@/lib/teams/leagues";

type LeagueFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

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
          defaultValue={DEFAULT_LEAGUE_ID}
          className="teams-filter__control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {LEAGUE_OPTIONS.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
