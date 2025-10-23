// src/lib/status/statusMap.ts

import { StatusCode } from './codes';

export type StatusMeta = {
  label: string;        // human-readable
  token: `--${string}`; // CSS var token (from styles/tokens/_status.css)
  terminal: boolean;    // whether play is definitively over
  description?: string; // optional human-readable description
};

export const STATUS_MAP: Record<StatusCode, StatusMeta> = {
  LIVE:       { label: 'Live',       token: '--status-live',       terminal: false },
  UPCOMING:   { label: 'Upcoming',   token: '--status-upcoming',   terminal: false },
  HT:         { label: 'Half-Time',  token: '--status-ht',         terminal: false },
  AET:        { label: 'AET',        token: '--status-aet',        terminal: false },
  PENS:       { label: 'Penalties',  token: '--status-pens',       terminal: false },
  FT:         { label: 'Full-Time',  token: '--status-ft',         terminal: true  },

  DELAYED:    { label: 'Delayed',    token: '--status-delayed',    terminal: false },
  SUSPENDED:  { label: 'Suspended',  token: '--status-suspended',  terminal: false },
  ABANDONED:  { label: 'Abandoned',  token: '--status-abandoned',  terminal: true  },
  POSTPONED:  { label: 'Postponed',  token: '--status-postponed',  terminal: false },
  CANCELED:   { label: 'Canceled',   token: '--status-canceled',   terminal: true  },
  TBD:        { label: 'TBD',        token: '--status-tbd',        terminal: false },
};

// Small helper for inline styles or CSS-in-JS
export const getStatusColorVar = (code: StatusCode) => `var(${STATUS_MAP[code].token})`;

