'use client';

// =============================================================================
// COMPONENT: TeamCard
// Responsibility: Individual team card (crest, name, meta, form, CTA)
// Contracts: Receives single TeamSummary; entire card is link to /team/[id]
// A11y: 44px tap target; sr-only labels for form dots; focus-visible ring
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { TeamSummary } from '@/app/teams/types';
import { getFormResult, getFormTooltip, TeamFormResult } from '@/app/teams/form';

const FORM_RESULT_TO_MODIFIER: Record<TeamFormResult, 'win' | 'draw' | 'loss'> = {
  W: 'win',
  D: 'draw',
  L: 'loss',
};

type Props = TeamSummary;

export default function TeamCard({
  id,
  name,
  crestUrl,
  country,
  leagueName,
  form,
}: Props) {
  const [hasCrestError, setHasCrestError] = useState(false);

  const initial = name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <Link
      href={`/team/${id}`}
      className="team-card"
      aria-label={`${name} — ${leagueName}`}
    >
      <div className="team-card__body">
        <div className="team-card__crest-wrap">
          {hasCrestError ? (
            <div className="team-card__crest-fallback" aria-hidden="true">
              {initial}
            </div>
          ) : (
            <Image
              src={crestUrl}
              alt={`${name} crest`}
              className="team-card__crest"
              width={80}
              height={80}
              onError={() => setHasCrestError(true)}
            />
          )}
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
          {form.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="team-card__form-dot team-card__form-dot--empty"
                title="No recent match"
              >
                <span className="sr-only">No recent match</span>
              </span>
            ))
          ) : (
            form.map((entry, index) => {
              const result = getFormResult(entry); // "W" | "D" | "L"
              const modifier = FORM_RESULT_TO_MODIFIER[result];
              const tooltip = getFormTooltip(entry); // uses opponent + score
              return (
                <span
                  key={index}
                  className={`team-card__form-dot team-card__form-dot--${modifier}`}
                  title={tooltip}
                >
                  <span className="sr-only">{tooltip}</span>
                </span>
              );
            })
          )}
        </div>

      </div>

      <div className="team-card__cta" aria-hidden="true">
        <span>View team →</span>
      </div>
    </Link>
  );
}
