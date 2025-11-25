// =============================================================================
// COMPONENT: LeagueFilter
// Responsibility: Dropdown control for selecting the current league on /teams
// Contracts: Controlled via value + onChange; options provided by parent
// A11y: Custom button + listbox; labelled by SR-only text
// Owner: Frontend Team • Last updated: 2025-11-17
// =============================================================================

"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import type { LeagueOption } from "@/app/teams/types";

// -- PROPS --------------------------------------------------------------------

export type LeagueFilterProps = {
  value: string;
  onChange: (leagueId: string) => void;
  options: LeagueOption[];
  isActive?: boolean;
  onFocus?: () => void;
};

// -- COMPONENT ----------------------------------------------------------------

export default function LeagueFilter({
  value,
  onChange,
  options,
  isActive = false,
  onFocus,
}: LeagueFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const labelId = useId();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((league) => league.id === value) ?? options[0];

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (onFocus) onFocus();
  };

  const handleSelect = (leagueId: string) => {
    onChange(leagueId);
    setIsOpen(false);
  };

  const isFilterActive = isActive || isOpen;

  return (
    <div
      ref={containerRef}
      className={
        "teams-filter teams-filter--league" +
        (isFilterActive ? " teams-filter--active" : "")
      }
    >
      <span id={labelId} className="sr-only">
        Select league
      </span>

      {/* Trigger capsule */}
      <button
        type="button"
        className="teams-filter__field teams-filter__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={handleToggle}
        onFocus={onFocus}
      >
        {/* Overlay div for the animated border beam */}
        <div className="teams-filter__beam" aria-hidden="true" />

        <span className="teams-filter__icon" aria-hidden="true">
          {selected?.crestUrl ? (
            <img
              src={selected.crestUrl}
              alt=""
              className="teams-filter__icon-img"
            />
          ) : (
            "🏆"
          )}
        </span>

        <span className="teams-filter__value">
          {selected ? selected.name : "All leagues"}
        </span>

        <span className="teams-filter__chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {/* Custom dropdown panel */}
      {isOpen && (
        <ul
          id={listboxId}
          className="teams-filter__menu"
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((league) => {
            const isSelected = league.id === value;
            return (
              <li key={league.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={
                    "teams-filter__option" +
                    (isSelected ? " teams-filter__option--selected" : "")
                  }
                  onClick={() => handleSelect(league.id)}
                >
                  {league.crestUrl && (
                    <span className="teams-filter__option-icon" aria-hidden="true">
                      <img
                        src={league.crestUrl}
                        alt=""
                        className="teams-filter__icon-img"
                      />
                    </span>
                  )}

                  <span className="teams-filter__option-label">{league.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
