'use client';
import * as React from 'react';

export type SegmentedFilterProps<T extends string> = {
  segments: readonly T[];
  value: T;
  onChange: (v: T) => void;
  'aria-label'?: string;
};

export default function SegmentedFilter<T extends string>({
  segments,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedFilterProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{ display: 'inline-flex', background: 'var(--ui-200)', borderRadius: 10, padding: 4, gap: 4 }}
    >
      {segments.map((s) => {
        const selected = s === value;
        return (
          <button
            key={s}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(s)}
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
