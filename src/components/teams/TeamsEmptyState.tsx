// =============================================================================
// COMPONENT: TeamsEmptyState
// -----------------------------------------------------------------------------
// Responsibility: Present the empty-result UI inside the TeamsGrid region.
// Contracts: Pure presentational; receives optional title/message via props;
//            no data fetching, no side effects.
// A11y: role="status" + aria-live="polite" so SR users are informed of changes;
//       icon marked aria-hidden; title rendered only when provided.
// Owner: Frontend Team • Last updated: 2025-11-12
// =============================================================================

import * as React from "react";

// -- PROPS --------------------------------------------------------------------
// NOTE: Title is optional on purpose. When no search term exists, we omit the
//       heading and show only the contextual message to reduce redundancy.
type TeamsEmptyStateProps = {
  /** Optional short heading (e.g., `No results for "ars"`). */
  title?: string;

  /** Supporting copy suggesting recovery (e.g., clear search, switch league). */
  message?: string;
};

const DEFAULT_MESSAGE = "Try a different league or keyword.";

// -- RENDER -------------------------------------------------------------------
export default function TeamsEmptyState({
  title,
  message = DEFAULT_MESSAGE,
}: TeamsEmptyStateProps) {
  return (
    <div className="teams-grid__empty" role="status">
      {/* A11Y: Decorative icon only; keep out of SR tree. */}
      <div className="teams-grid__empty-icon" aria-hidden="true">
        🔍
      </div>

      {/* A11Y: Render heading only when meaningful (e.g., search-specific). */}
      {title && <p className="teams-grid__empty-title">{title}</p>}

      <p className="teams-grid__empty-message">{message}</p>
    </div>
  );
}
