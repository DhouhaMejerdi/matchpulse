'use client';

// =============================================================================
// COMPONENT: HeroHeader
// -----------------------------------------------------------------------------
// Responsibility: Page hero row with title + date switcher.
// Contracts: Props { title: string; dateLabel: string; onPrev: () => void; onNext: () => void; onToday: () => void }
// A11y: Header landmark is labelled via aria-labelledby; h1 defines the page title; date controls are grouped with role="group".
// Notes: Semantics‑first. Visual styles remain inline for now; will be moved to `_hero-header.scss` in Step 2 (mobile‑first).
// Owner: Frontend Team • Last updated: 2025-10-29
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
      <div className="hero__container ">
        <h1 id="heroTitle" className="h1 hero__title">
          {title}
        </h1>

        <div role="group" aria-label="Match day controls">
          <DateToolbar
            label={dateLabel}
            onPrev={onPrev}
            onNext={onNext}
            onToday={onToday}
          />
        </div>
      </div>
    </header>
  );
}