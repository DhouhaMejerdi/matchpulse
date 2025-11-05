// =============================================================================
// COMPONENT: TeamCard
// Responsibility: Individual team card (crest, name, meta, form, CTA)
// Contracts: Receives single TeamSummary; entire card is link to /team/[id]
// A11y: 44px tap target; sr-only labels for form dots; focus-visible ring
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

import Link from 'next/link';
import type { TeamSummary } from '@/app/teams/TeamsGrid';

type Props = TeamSummary;

export default function TeamCard({
  id,
  name,
  crestUrl,
  country,
  leagueName,
  form,
}: Props) {
  return (
    <Link
      href={`/team/${id}`}
      className="team-card"
      aria-label={`${name} — ${leagueName}`}
    >
      <div className="team-card__body">
        <div className="team-card__crest-wrap">
          <img
            src={crestUrl}
            alt={`${name} crest`}
            className="team-card__crest"
            loading="lazy"
          />
        </div>

        <div className="team-card__text">
          <h2 className="team-card__name">{name}</h2>
          <p className="team-card__meta">
            <span className="team-card__country">{country}</span>
            <span aria-hidden="true"> · </span>
            <span className="team-card__league">{leagueName}</span>
          </p>
        </div>

        <div className="team-card__form" aria-label={`Recent form for ${name}`}>
          {form.map((result, index) => (
            <span
              key={`${result}-${index}`}
              className={`team-card__form-dot team-card__form-dot--${result}`}
            >
              <span className="sr-only">
                {result === 'W'
                  ? 'Win'
                  : result === 'D'
                  ? 'Draw'
                  : 'Loss'}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="team-card__cta" aria-hidden="true">
        <span>View team →</span>
      </div>
    </Link>
  );
}
