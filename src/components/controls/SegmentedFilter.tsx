'use client';
import * as React from 'react';

export type SegmentedFilterProps<T extends string> = {
  segments: readonly T[];
  value: T;
  onChange: (v: T) => void;
  'aria-label'?: string;
  /** NEW: region id that this tablist controls (e.g., "fixtures-region") */
  ariaControlsId?: string;
  /** NEW: stable id prefix for tabs (e.g., "filter-tab") */
  idPrefix?: string;
};

export default function SegmentedFilter<T extends string>({
  segments,
  value,
  onChange,
  'aria-label': ariaLabel,
  ariaControlsId,
  idPrefix = 'seg',
}: SegmentedFilterProps<T>) {
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    btnRefs.current[index]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (!segments.length) return;
    let next = i;

    switch (e.key) {
      case 'ArrowRight':
      case 'Right': // old browsers
        next = (i + 1) % segments.length;
        break;
      case 'ArrowLeft':
      case 'Left':
        next = (i - 1 + segments.length) % segments.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = segments.length - 1;
        break;
      default:
        return; // do nothing for other keys
    }

    e.preventDefault();
    const nextVal = segments[next];
    onChange(nextVal);
    // Move focus to the newly selected tab (roving tabindex behavior)
    requestAnimationFrame(() => focusTab(next));
  };

  return (
    <div role="tablist" className="segmented" aria-label={ariaLabel}>
      {segments.map((s, i) => {
        const selected = s === value;
        const tabId = `${idPrefix}-${String(s)}`; // stable id per tab

        return (
          <button
            key={s}
            id={tabId}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            role="tab"
            aria-selected={selected}
            aria-controls={ariaControlsId}
            tabIndex={selected ? 0 : -1}           // ⬅️ roving tabindex
            onClick={() => onChange(s)}
            onKeyDown={(e) => onKeyDown(e, i)}     // ⬅️ keyboard nav
            className="segmented__item small"
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
