'use client';
import React from 'react';
import { normalizeStatus } from '@/lib/status/codes';
import { STATUS_MAP } from '@/lib/status/statusMap';

/**
 * Reusable visual badge for displaying match statuses.
 * Color + label are derived from STATUS_MAP tokens.
 * Defensive against unknown/undefined codes.
 */
export default function StatusBadge({ code }: { code?: string }) {
  const safeCode = normalizeStatus(code);
  const status = STATUS_MAP[safeCode];

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
    <span
      className={`status-badge status-badge--${safeCode.toLowerCase()}`}
      style={style}
      aria-label={`Status: ${status.label}`}
    >
      {status.label}
    </span>
  );
}
