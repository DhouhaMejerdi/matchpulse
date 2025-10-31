'use client';

// =============================================================================
// COMPONENT: ControlsBar
// -----------------------------------------------------------------------------
// Responsibility: Provides a toolbar grouping SegmentedFilter and LeaguePicker.
// Contracts: Props {
//   segments: readonly FilterTab[];
//   value: FilterTab;
//   onChange: (tab: FilterTab) => void;
//   leagueOptions: string[];
//   league: string | null;
//   onLeagueChange: (league: string | null) => void;
//   ariaLabel?: string;
//   sticky?: boolean;
// }
// A11y: Uses role="toolbar" with a descriptive aria-label; children manage their own focus
//       and ARIA semantics; right-hand group is pushed to the end via flex.
// Notes: Mobile-first layout; styling is defined in `_controls-bar.scss` using tokens;
//        the optional `sticky` prop toggles the sticky modifier.
// Owner: Frontend Team • Last updated: 2025‑10‑30
// =============================================================================

import * as React from 'react';
import SegmentedFilter from '@/components/controls/SegmentedFilter';
import LeaguePicker from '@/components/controls/LeaguePicker';
import type { FilterTab } from '@/lib/types/ui';

type Props = {
  segments: readonly FilterTab[];
  value: FilterTab;
  onChange: (tab: FilterTab) => void;
  leagueOptions: string[];
  league: string | null;
  onLeagueChange: (league: string | null) => void;
  ariaLabel?: string;
  sticky?: boolean;
};

export default function ControlsBar({
  segments,
  value,
  onChange,
  leagueOptions,
  league,
  onLeagueChange,
  ariaLabel = 'Fixture filters',
  sticky = false,
}: Props) {
  return (
    <div
      className={`controls-bar${sticky ? ' controls-bar--sticky' : ''}`}
      role="toolbar"
      aria-label={ariaLabel}
    >
      <SegmentedFilter<FilterTab>
        segments={segments}
        value={value}
        onChange={onChange}
        aria-label="Fixture status"
        ariaControlsId="fixtures-region"
        idPrefix="filter-tab"
      />
      <div className="controls-bar__end">
        <LeaguePicker
          className="league-picker"
          leagues={leagueOptions}
          value={league}
          onChange={onLeagueChange}
          label="League"
        />
      </div>
    </div>
  );
}
