'use client';
import React from 'react';
import { STATUS_MAP, type StatusCode } from '@/lib/status/statusMap';

/**
 * Reusable visual badge for displaying match statuses.
 * Color + label are derived from STATUS_MAP tokens.
 */
export default function StatusBadge({ code }: { code: StatusCode }) {
  const status = STATUS_MAP[code];
  const style = {
    backgroundColor: `var(${status.token})`,
    color: '#fff',
    borderRadius: '9999px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.2,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    display: 'inline-block',
  } as const;

  return (
    <span style={style} aria-label={`Status: ${status.label}`}>
      {status.label}
    </span>
  );
}
