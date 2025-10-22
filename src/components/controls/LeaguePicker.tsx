'use client';
import * as React from 'react';

type Props = {
  leagues: string[];                 // e.g. ["Premier League","La Liga"]
  value: string | null;              // selected league or null (All)
  onChange: (league: string | null) => void;
  label?: string;                    // e.g. "League"
};

export default function LeaguePicker({ leagues, value, onChange, label = 'League' }: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const popoverId = React.useId();
  const listboxId = `${popoverId}-listbox`;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? leagues.filter(l => l.toLowerCase().includes(q)) : leagues;
  }, [leagues, query]);

  // keep active index in range
  React.useEffect(() => {
    if (activeIndex > filtered.length - 1) setActiveIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, activeIndex]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  const select = (league: string | null) => {
    onChange(league);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, Math.max(0, filtered.length - 1)));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (open) {
          e.preventDefault();
          const item = filtered[activeIndex];
          if (item) select(item);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const selectedLabel = value ?? 'All leagues';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {/* Selected pill + Clear */}
      <span className="small" aria-live="polite" aria-atomic="true">
        {selectedLabel}
      </span>
      {value && (
        <button
          type="button"
          onClick={() => select(null)}
          className="small"
          aria-label="Clear league filter"
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--ui-200)',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      )}

      {/* Combobox input */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          placeholder={`${label}…`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          className="small"
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid transparent',
            background: 'var(--surface-0)',
            boxShadow: 'var(--shadow-sm)',
            minWidth: 180,
          }}
        />
        {/* Popup list */}
        {open && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={`${label} options`}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              zIndex: 20,
              background: 'var(--surface-0)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-md)',
              padding: 4,
              margin: 0,
              listStyle: 'none',
              maxHeight: 220,
              overflowY: 'auto',
              minWidth: 220,
            }}
          >
            {filtered.length === 0 && (
              <li className="small" aria-hidden="true" style={{ padding: '6px 10px', opacity: 0.6 }}>
                No leagues
              </li>
            )}
            {filtered.map((league, idx) => {
              const active = idx === activeIndex;
              const selected = value === league;
              return (
                <li
                  key={league}
                  id={`${listboxId}-${idx}`}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
                  onClick={() => select(league)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="small"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: active ? 'var(--ui-200)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {league}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
