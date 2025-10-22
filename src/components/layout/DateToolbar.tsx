'use client';
import * as React from 'react';

type Props = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
  ariaLabel?: string; // defaults to "Change date"
};

export default function DateToolbar({
  label,
  onPrev,
  onNext,
  onToday,
  ariaLabel = 'Change date',
}: Props) {
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
    },
    [onPrev, onNext]
  );

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      aria-keyshortcuts="ArrowLeft, ArrowRight"
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}  // ⬅️ same as before
    >
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous day"
        title="Previous day"
        style={{ padding: '6px 10px', borderRadius: 8 }}         // ⬅️ same as before
      >
        ←
      </button>

      <strong
        className="small"
        aria-live="polite"
        aria-atomic="true"
        style={{ minWidth: 120, textAlign: 'center' }}           // ⬅️ same as before
      >
        {label}
      </strong>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next day"
        title="Next day"
        style={{ padding: '6px 10px', borderRadius: 8 }}         // ⬅️ same as before
      >
        →
      </button>

      {onToday && (
        <button
          type="button"
          onClick={onToday}
          aria-label="Go to today"
          title="Go to today"
          className="small"
          style={{ padding: '6px 10px', borderRadius: 8 }}       // ⬅️ same as before
        >
          Today
        </button>
      )}
    </div>
  );
}
