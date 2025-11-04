'use client';

// =============================================================================
// COMPONENT: Team
// -----------------------------------------------------------------------------
// Responsibility: Render a team's crest and name, aligned left (home) or right (away).
// Contracts: Props { name: string; crest: string; side: 'home' | 'away' }
// A11y: Provides alt text for the crest; ensures the team name truncates safely.
// Notes: Applies BEM modifiers (team--home / team--away) and name alignment.
// Owner: Frontend Team • Last updated: 2025‑10‑30
// =============================================================================

import Image from 'next/image';

export type TeamProps = {
  name: string;
  crest: string;
  side: 'home' | 'away';
};

export default function Team({ name, crest, side }: TeamProps) {
  return (
    <div className={`team team--${side}`}>
      {side === 'home' ? (
        <>
          <Image
            src={crest}
            width={28}
            height={28}
            alt={`${name} crest`}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
            unoptimized
          />
          <span className="team__name" title={name}>{name}</span>
        </>
      ) : (
        <>
          <span className="team__name team__name--right" title={name}>{name}</span>
          <Image
            src={crest}
            width={28}
            height={28}
            alt={`${name} crest`}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
            unoptimized
          />
        </>
      )}
    </div>
  );
}
