// =============================================================================
// COMPONENT: TeamsEmptyState
// -----------------------------------------------------------------------------
// Responsibility: Render an empty-state message when no teams match filters.
// Notes:
// - Pure presentational: receives copy via props, no data fetching.
// - Intended to sit inside the TeamsGrid container area.
// - Copy should clearly explain what happened + what user can do next.
// Owner: Frontend Team
// Last updated: 2025-11-07
// =============================================================================

import * as React from "react";

type TeamsEmptyStateProps = {
  /**
   * Short heading describing the empty result.
   * Default: "No teams match your search."
   */
  title?: string;

  /**
   * Supporting text suggesting a next action.
   * Default: "Try a different league or keyword."
   */
  message?: string;
};

const DEFAULT_TITLE = "No teams match your search.";
const DEFAULT_MESSAGE = "Try a different league or keyword.";

export default function TeamsEmptyState({
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
}: TeamsEmptyStateProps) {
  return (
    <div className="teams-grid__empty" role="status" aria-live="polite">
      <div className="teams-grid__empty-icon" aria-hidden="true">
        🔍
      </div>
      <p className="teams-grid__empty-title">{title}</p>
      <p className="teams-grid__empty-message">{message}</p>
    </div>
  );
}
