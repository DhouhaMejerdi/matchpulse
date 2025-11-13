// =============================================================================
// COMPONENT: TeamsGrid
// -----------------------------------------------------------------------------
// Responsibility: Responsive grid layout for team cards on /teams.
// Contracts: Receives `teams[]` (TeamSummary) and renders a semantic <ul> of
//            <TeamCard/> items; renders a contextual empty state when needed.
// A11y: Section labelled by hidden <h2> and referenced via aria-labelledby;
//       list semantics around cards; empty state announced via its own
//       role="status" (polite). See notes inline.
// Owner: Frontend Team • Last updated: 2025-11-12
// =============================================================================
"use client";

import TeamCard from "@/components/teams/TeamCard";
import TeamsEmptyState from "@/components/teams/TeamsEmptyState";
import type { TeamSummary } from "./types";

// -- PROPS --------------------------------------------------------------------
// NOTE: `search` and `leagueName` are display-only inputs used to generate
//       precise, recovery-oriented empty-state copy. They do not influence data.
export type TeamsGridProps = {
  teams: TeamSummary[];
  search?: string;
  leagueName?: string;
};

// -- RENDER -------------------------------------------------------------------
export default function TeamsGrid({
  teams,
  search,
  leagueName,
}: TeamsGridProps) {
  // WHY: Personalize empty copy; avoid implying user error when no search exists.
  const emptyMsg = search?.trim()
    ? `No teams match “${search}” in ${leagueName ?? "this league"}. Try clearing search or switching leagues.`
    : `No teams available for ${leagueName ?? "this league"} this season. Please check another league or come back when the season starts.`;

  return (
    // A11Y: The section is named by a visually-hidden <h2>; this ensures a
    // proper H1→H2→H2 sequence for screen readers without adding visual noise.
    // Ref: MDN aria-labelledby & hidden headings patterns.
    <section className="teams-grid container" aria-labelledby="teams-list-heading">
      <h2 id="teams-list-heading" className="sr-only">
        Teams list
      </h2>

      {teams.length === 0 ? (
        <TeamsEmptyState
          // A11Y: Render a title only when a term exists; otherwise message-only.
          title={search?.trim() ? `No results for “${search}”` : undefined}
          message={emptyMsg}
        />
      ) : (
        <ul className="teams-grid__list">
          {teams.map((team) => (
            <li key={team.id} className="teams-grid__item">
              <TeamCard {...team} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
