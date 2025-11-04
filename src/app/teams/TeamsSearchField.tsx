import React from "react";

// =============================================================================
// COMPONENT: TeamsSearchField
// Responsibility: Search input for filtering teams by name
// Contracts: Uncontrolled in v1.0; will become controlled later
// A11y: type="search" + aria-label; focus state via parent .teams-filter__field
// Owner: Frontend Team • Last updated: 2025-11-04
// =============================================================================

// Example: TeamsSearchField.tsx
export default function TeamsSearchField() {
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
        />
      </div>
    </div>
  );
}

