'use client';

// =============================================================================
// COMPONENT: HeroHeader
// -----------------------------------------------------------------------------
// Responsibility: Page hero row with title + date switcher.
// Contracts: Props { title: string; dateLabel: string; onPrev: () => void; onNext: () => void; onToday: () => void }
// A11y: <header> is labelled by the H1; DateToolbar exposes role="toolbar".
// Owner: Frontend Team • Last updated: 2025-11-02
// =============================================================================

// -- PROPS --------------------------------------------------------------------
type Props = {
  title: string;
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

// -- RENDER -------------------------------------------------------------------
import * as React from 'react';
import DateToolbar from '@/components/controls/DateToolbar';

export default function HeroHeader({
  title,
  dateLabel,
  onPrev,
  onNext,
  onToday,
}: Props) {
  return (
    <header className="hero" aria-labelledby="heroTitle">
      <div className="hero__container container">
        <h1 id="heroTitle" className="h1 hero__title">
          {title}
        </h1>

        <DateToolbar
          label={dateLabel}
          onPrev={onPrev}
          onNext={onNext}
          onToday={onToday}
        />
      </div>
    </header>
  );
}