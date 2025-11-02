'use client';

// =============================================================================
// COMPONENT: DateToolbar
// -----------------------------------------------------------------------------
// Responsibility: Toolbar for navigating match dates. Provides previous, next and optional “today” buttons.
// Contracts: Props { label: string; onPrev: () => void; onNext: () => void; onToday?: () => void; ariaLabel?: string }
// A11y: Uses role="toolbar" with a descriptive aria-label; arrow keys trigger prev/next handlers; tabIndex=0 makes the toolbar focusable; aria-live updates announce date changes.
// Notes: Uses BEM classes defined in `_date-toolbar.scss` for layout and spacing; visual styles are token-based with no inline styles.
// Owner: Frontend Team • Last updated: 2025-10-29
// =============================================================================

// -- PROPS --------------------------------------------------------------------
type Props = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
  ariaLabel?: string; // defaults to "Change date"
};

// -- HANDLERS -----------------------------------------------------------------
import * as React from 'react';

export default function DateToolbar({
  label,
  onPrev,
  onNext,
  onToday,
  ariaLabel = 'Change date',
}: Props) {
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    },
    [onPrev, onNext],
  );

  // -- RENDER -----------------------------------------------------------------
  return (
    <div
      className="date-toolbar"
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      aria-keyshortcuts="ArrowLeft ArrowRight" 
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous day"
        title="Previous day"
        className="date-toolbar__button"
      >
        ←
      </button>

      <strong
        className="small date-toolbar__label"
        aria-live="polite"
        aria-atomic="true"
      >
        {label}
      </strong>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next day"
        title="Next day"
        className="date-toolbar__button"
      >
        →
      </button>

      {onToday && (
        <button
          type="button"
          onClick={onToday}
          aria-label="Go to today"
          title="Go to today"
          className="date-toolbar__button small"
        >
          Today
        </button>
      )}
    </div>
  );
}
