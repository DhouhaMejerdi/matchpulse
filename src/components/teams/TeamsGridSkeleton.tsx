// =============================================================================
// COMPONENT: TeamsGridSkeleton
// -----------------------------------------------------------------------------
// Responsibility: Render placeholder team cards while /teams data is loading.
// Notes:
// - Pure presentational component: no data fetching or timers.
// - Shape should mirror TeamCard so skeletons avoid layout shift.
// Owner: Frontend Team
// Last updated: 2025-11-07
// =============================================================================

import * as React from "react";

type TeamsGridSkeletonProps = {
  /**
   * Number of skeleton cards to render.
   * Default: 8 (e.g., 2 rows of 4 on desktop).
   */
  count?: number;
};

export default function TeamsGridSkeleton({
  count = 8,
}: TeamsGridSkeletonProps) {
  return (
    <div className="teams-grid__list">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="team-card team-card--skeleton"
          aria-hidden="true"
        >
          <div className="team-card__crest team-card__crest--skeleton" />
          <div className="team-card__line team-card__line--primary" />
          <div className="team-card__line team-card__line--secondary" />
          <div className="team-card__form team-card__form--skeleton" />
        </article>
      ))}
    </div>
  );
}
