// =============================================================================
// COMPONENT: TeamsSearchField
// Responsibility: Search input for filtering teams by name on /teams
// Contracts: Controlled via value/onChange from parent (/teams page header);
//            does not perform filtering itself, only emits query text
// A11y: Uses type="search" + aria-label; focus state via .teams-filter__field
// Owner: Frontend Team • Last updated: 2025-11-10
// =============================================================================

import React from "react";

// -- PROPS --------------------------------------------------------------------

export type TeamsSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function TeamsSearchField({
  value,
  onChange,
}: TeamsSearchFieldProps) {
  return (
    <div className="teams-filter teams-filter--search">
      <div className="teams-filter__field">
        {/* Overlay div for the animated border beam */}
        <div className="teams-filter__beam" aria-hidden="true" />

        <span className="teams-filter__icon" aria-hidden="true">
          🔍
        </span>

        <input
          type="search"
          placeholder="Search teams..."
          aria-label="Search teams"
          className="teams-filter__control"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
