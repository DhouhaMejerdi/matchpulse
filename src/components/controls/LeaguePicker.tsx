'use client';
import * as React from 'react';

type Props = {
  leagues: string[];                 // e.g. ["Premier League","La Liga"]
  value: string | null;              // selected league or null (All)
  onChange: (league: string | null) => void;
  label?: string;                    // e.g. "League"
  className?: string; // ⬅️ NEW: allow external classes
};

export default function LeaguePicker({ leagues, value, onChange, label = 'League', className }: Props) {
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
    <div className={['league-picker', className].filter(Boolean).join(' ')}>
      {/* Selected pill + Clear */}
      <span className="league-picker__label small" aria-live="polite" aria-atomic="true">
        {selectedLabel}
      </span>

      {value && (
        <button
          type="button"
          onClick={() => select(null)}
          className="league-picker__clear small"
          aria-label="Clear league filter"
        >
          Clear
        </button>
      )}

      {/* Combobox input */}
      <div className="league-picker__field">
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
          className="league-picker__input small"
        />
        {/* Popup list */}
        {open && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={`${label} options`}
            className="league-picker__popover"
          >
            {filtered.length === 0 && (
              <li className="league-picker__empty small" aria-hidden="true">
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
                  className={`league-picker__option small${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
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
