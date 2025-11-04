import React from "react";

// =============================================================================
// COMPONENT: TeamsSortSelect
// Responsibility: Dropdown control for sorting teams (e.g., A–Z / Z–A)
// Contracts: Placeholder; behaviour wired later in /teams state
// A11y: Uses <select> with hidden label and focus state via CSS
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

export default function TeamsSortSelect() {
  return (
    <div className="teams-filter teams-filter--sort">
      <label htmlFor="teams-sort" className="sr-only">
        Sort teams
      </label>

      <div className="teams-filter__field">
        {/* Overlay div for the animated border beam */}
        <div className="teams-filter__beam" aria-hidden="true" />
        <span className="teams-filter__icon" aria-hidden="true">
          ⇅
        </span>

        <select
          id="teams-sort"
          name="sort"
          defaultValue="alpha-asc"
          className="teams-filter__control"
        >
          <option value="alpha-asc">A–Z</option>
          <option value="alpha-desc">Z–A</option>
        </select>
      </div>
    </div>
  );
}
