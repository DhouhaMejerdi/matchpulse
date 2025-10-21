'use client';
import * as React from 'react';

export type SegmentedFilterProps<T extends string> = {
  segments: readonly T[];
  value: T;
  onChange: (v: T) => void;
  'aria-label'?: string;
  // Step 2 (later): ariaControlsId?: string; // to wire the results region
};

export default function SegmentedFilter<T extends string>({
  segments,
  value,
  onChange,
  'aria-label': ariaLabel,
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
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{ display: 'inline-flex', background: 'var(--ui-200)', borderRadius: 10, padding: 4, gap: 4 }}
    >
      {segments.map((s, i) => {
        const selected = s === value;
        return (
          <button
            key={s}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}           // ⬅️ roving tabindex
            onClick={() => onChange(s)}
            onKeyDown={(e) => onKeyDown(e, i)}     // ⬅️ keyboard nav
            className="small"
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: selected ? 'var(--surface-0)' : 'transparent',
              boxShadow: selected ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
