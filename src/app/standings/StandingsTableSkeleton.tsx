// =============================================================================
// COMPONENT: StandingsTableSkeleton
// -----------------------------------------------------------------------------
// Responsibility: Lightweight loading state for /standings table.
// Contracts: Used only as Suspense fallback in /standings page.
// =============================================================================

import * as React from "react";

export default function StandingsTableSkeleton(): React.ReactElement {
  // Simple 1 header + 5 skeleton rows
  return (
    <div className="standings-table standings-table--skeleton">
      <div className="standings-table__header">
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
        <div className="standings-table__cell" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="standings-table__row standings-table__row--skeleton"
        >
          <div className="standings-table__cell" />
          <div className="standings-table__cell standings-table__cell--wide" />
          <div className="standings-table__cell" />
          <div className="standings-table__cell" />
          <div className="standings-table__cell" />
          <div className="standings-table__cell" />
          <div className="standings-table__cell" />
          <div className="standings-table__cell" />
        </div>
      ))}
    </div>
  );
}
