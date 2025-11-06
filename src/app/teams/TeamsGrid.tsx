// =============================================================================
// COMPONENT: TeamsGrid
// Responsibility: Responsive grid layout for team cards on /teams
// Contracts: Receives teams[]; renders <ul> of <TeamCard>; supports empty state
// A11y: Section labelled "Teams list"; list semantics around cards
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================

import TeamCard from '@/components/teams/TeamCard';
import type { TeamSummary } from './types';

export type TeamsGridProps = {
  teams: TeamSummary[];
};

export default function TeamsGrid({ teams }: TeamsGridProps) {
  return (
    <section className="teams-grid container" aria-label="Teams list">
      {teams.length === 0 ? (
        <p className="teams-grid__empty">No teams match your filters.</p>
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
