// =============================================================================
// COMPONENT: TeamsSortSelect
// Responsibility: Dropdown control for sorting teams (e.g., A–Z / Z–A)
// Contracts: Controlled via value/onChange from parent (/teams page header);
//            emits stable sort mode keys used for derived ordering logic
// A11y: Uses <label class="sr-only"> and focus state via .teams-filter__field
// Owner: Frontend Team • Last updated: 2025-11-10
// =============================================================================

import React from "react";

// -- TYPES --------------------------------------------------------------------

export type TeamsSortOrder = "alpha-asc" | "alpha-desc";

// -- PROPS --------------------------------------------------------------------

export type TeamsSortSelectProps = {
  value: TeamsSortOrder;
  onChange: (value: TeamsSortOrder) => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function TeamsSortSelect({
  value,
  onChange,
}: TeamsSortSelectProps) {
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
          className="teams-filter__control teams-filter__control--select"
          value={value}
          onChange={(event) =>
            onChange(event.target.value as TeamsSortOrder)
          }
        >
          <option
            value="alpha-asc"
            className="teams-filter__option teams-filter__option--primary"
          >
            A–Z
          </option>
          <option
            value="alpha-desc"
            className="teams-filter__option teams-filter__option--primary"
          >
            Z–A
          </option>
        </select>
      </div>
    </div>
  );
}
