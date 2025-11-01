'use client';
import * as React from 'react';

export type TabItem<T extends string> = { value: T; label: string };

type TabsProps<T extends string> = {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  'aria-label'?: string;
};

export default function Tabs<T extends string>({
  items,
  value,
  onChange,
  'aria-label': ariaLabel,
}: TabsProps<T>) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = items.findIndex((i) => i.value === value);
    if (idx < 0) return;
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % items.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + items.length) % items.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = items.length - 1;
    if (next !== idx) {
      e.preventDefault();
      onChange(items[next].value);
      refs.current[next]?.focus();
    }
  };

  return (
    <div className="mp-tabs" role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}>
      {items.map((it, i) => {
        const selected = it.value === value;
        return (
          <button
            key={it.value}
            ref={(el: HTMLButtonElement | null) => {
                refs.current[i] = el;  // ✅ assign, return nothing
            }}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className="mp-tab"
            onClick={() => onChange(it.value)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
