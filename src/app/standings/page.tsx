// =============================================================================
// PAGE: /standings
// -----------------------------------------------------------------------------
// Responsibility: Server entry for /standings; wraps client-side standings view.
// Contracts: Renders <StandingsPageClient /> inside <Suspense> with skeleton
//            fallback to satisfy Next.js requirement for client hooks.
// A11y: Still lives inside <main id="main-content"> from RootLayout.
// Owner: Frontend Team • Last updated: 2025-11-25
// =============================================================================

import * as React from "react";
import { Suspense } from "react";
import StandingsPageClient from "./StandingsPageClient";
import StandingsTableSkeleton from "./StandingsTableSkeleton";

export default function StandingsPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <section className="standings-table container" aria-busy="true">
          <p className="standings-table__status" aria-live="polite">
            🌀 Loading standings…
          </p>
          <StandingsTableSkeleton />
        </section>
      } 
    >
      <StandingsPageClient />
    </Suspense>
  );
}
