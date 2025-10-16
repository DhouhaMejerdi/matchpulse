'use client';
import * as React from 'react';

type Props = {
  segments: string[];
  value: string;
  onChange: (v: string) => void;
  'aria-label'?: string;
};

export default function SegmentedFilter({ segments, value, onChange, 'aria-label': ariaLabel }: Props) {
  return (
    <div role="tablist" aria-label={ariaLabel} style={{ display: 'inline-flex', background: 'var(--ui-200)', borderRadius: 10, padding: 4, gap: 4 }}>
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