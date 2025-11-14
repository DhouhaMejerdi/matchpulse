// =============================================================================
// PAGE: /teams
// -----------------------------------------------------------------------------
// Responsibility: Server entry for /teams; wraps client-side teams view.
// Contracts: Renders <TeamsPageClient /> inside <Suspense> with skeleton
//            fallback to satisfy Next.js requirement for useSearchParams.
// A11y: Still lives inside <main id="main-content"> from RootLayout.
// Owner: Frontend Team • Last updated: 2025-11-14
// =============================================================================

import * as React from "react";
import { Suspense } from "react";

import TeamsPageClient from "./TeamsPageClient";
import TeamsGridSkeleton from "@/components/teams/TeamsGridSkeleton";

export default function TeamsPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <section className="teams-grid container" aria-busy="true">
          <p className="teams-grid__status" aria-live="polite">
            🌀 Loading teams…
          </p>
          <TeamsGridSkeleton />
        </section>
      }
    >
      <TeamsPageClient />
    </Suspense>
  );
}
